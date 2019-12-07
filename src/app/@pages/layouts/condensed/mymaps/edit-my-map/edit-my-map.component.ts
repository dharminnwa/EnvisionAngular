import { Component, OnInit, Injector, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { HttpRequestService } from '../../../../../services/all-http-request.service';
import { MyMapService } from '../../../../../services/my-map.service';
import { MapServiceService } from '../../../../../services/map-service.service';
import { CondensedComponent } from '../../condensed.component';
import { AuthenticationService } from '../../../../../services/auth.service';
import { NotificationColor, NotificationPosition, NotificationStyle, NotificationDuration } from '../../../../../models/constants';
import { MessageService } from '../../../../components/message/message.service';
@Component({
  selector: 'app-edit-my-map',
  templateUrl: './edit-my-map.component.html',
  styleUrls: ['./edit-my-map.component.scss']
})
export class EditMyMapComponent implements OnInit {

  condensedComponent: CondensedComponent;
  MapData;
  editMapDescriptionText = "";
  EditmapNameText = "";
  isShared = false;
  SharedUserList;
  SelectedUser;
  constructor(
    public bsModalRef: BsModalRef,
    private httpRequestService: HttpRequestService,
    private mapServiceService: MapServiceService,
    public Injector: Injector,
    public AuthServices: AuthenticationService,
    private _notification: MessageService
  ) { this.condensedComponent = Injector.get(CondensedComponent); }

  ngOnInit() {
    this.editMapDescriptionText = this.MapData.Description;
    this.EditmapNameText = this.MapData.Name;
    this.isShared = this.MapData.IsPublic;
    this.mapServiceService.SharedUserList = [];
    if (this.MapData) {
      this.GetSharedUserList();
    }
  }

  IsSharedChanged() {
    this.isShared = !this.isShared;
  }

  GetSharedUserList() {
    if (this.mapServiceService.SharedUserList.length == 0) {
      let UserID = this.AuthServices.getLoggedinUserId();
      this.httpRequestService._NodeGetListOfCompnayUserList(UserID, this.MapData.CustomMapId).subscribe(res => {
        let Data = res;
        if (Data._Issuccess) {
          this.mapServiceService.SharedUserList = Data.Data.filter(x => x.DisplayName != "");
          if (Data.CustomMaps_CooperativeUser && Data.CustomMaps_CooperativeUser.length > 0) {
            var SelectedList = [];
            Data.Data.forEach(element => {
              Data.CustomMaps_CooperativeUser.map((e) => {
                if (e.UserGuid == element.UserId && e.MapID == this.MapData.CustomMapId) {
                  SelectedList.push(element);
                }
              });
            });
            if (SelectedList.length > 0) {
              this.SelectedUser = SelectedList;
            }
          }
        }
      }, error => {
        console.log(error);
      });
    }
  }

  SaveEditmymap() {
    var Data = {
      CustomMapId: this.MapData.CustomMapId,
      Name: this.EditmapNameText,
      Description: this.editMapDescriptionText,
      IsPublic: this.isShared,
      SelectedUser: this.SelectedUser
    }
    if (!Data.SelectedUser)
      Data.SelectedUser = "";
    this.httpRequestService._NodeSaveSharedMymap(Data).subscribe(res => {
      if (res._Issuccess) {
        this.mapServiceService._UserMapData.getValue().filter(m => m.Type == 'mymap').forEach(element => {
          if (element.CustomMapId == this.MapData.CustomMapId) {
            element.Name = this.EditmapNameText;
            element.Description = this.editMapDescriptionText;
            element.IsPublic = this.isShared;
          }
        });
        this._notification.create(
          NotificationColor.Success,
          "The map saved successfully!",
          {
            Position: NotificationPosition.TopRight,
            Style: NotificationStyle.Simple,
            Duration: NotificationDuration
          });
      } else {
        this._notification.create(
          NotificationColor.Danger,
          "There is some issue to save map!",
          {
            Position: NotificationPosition.TopRight,
            Style: NotificationStyle.Simple,
            Duration: NotificationDuration
          });
      }
    }, error => {
      console.log(error);
      this._notification.create(
        NotificationColor.Danger,
        "There is some issue to save map!",
        {
          Position: NotificationPosition.TopRight,
          Style: NotificationStyle.Simple,
          Duration: NotificationDuration
        });
    });
  }

}
