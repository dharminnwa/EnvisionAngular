import { Component, OnInit, Input } from '@angular/core';
import { BaseMapService } from '../../../../services/base-map.service';
import { MapServiceService } from '../../../../services/map-service.service';
import { BsModalRef } from 'ngx-bootstrap';
import { UtilityService } from '../../../../services/Utility.service';
import { HttpRequestService } from '../../../../services/all-http-request.service';
import { AuthenticationService } from '../../../../services/auth.service';
import { environment } from '../../../../../environments/environment';

declare var google: any;
declare var $: any;

@Component({
  selector: 'app-basemap',
  templateUrl: './basemap.component.html',
  styleUrls: ['./basemap.component.scss'],
})

export class BasemapComponent implements OnInit {
  constructor(
    public BaseMapService: BaseMapService,
    public MapServiceService: MapServiceService,
    public bsModalRef: BsModalRef,
    private utilityService: UtilityService,
    private httpRequestService: HttpRequestService,
    private authenticationService: AuthenticationService
  ) { }
  @Input() hideSomePart = true;
  public baseMapList: any = [];
  public activeClass: any = 'active';
  public ShowLoader: boolean = false;
  ImageURLPath: string = environment.ImagespreviewPath;
  ngOnInit() {
    this.utilityService.CloseModalOnRouteChange(this.bsModalRef);
    setTimeout(() => {
      $('.modal-dialog').draggable({
        handle: ".modal-header"
      });
    }, 100);
    let List = this.MapServiceService.BaseMapData.getValue();
    if (List == null) {
      this.ShowLoader = true;
      let UserId = this.authenticationService.getLoggedinUserId();
      this.httpRequestService._NodeGetBaseMapTypes(UserId).subscribe(data => {        
        if (data._Issuccess) {
          this.baseMapList = data.BaseMapData;
          this.SetDefualtMapBasedonMapsetting(data);
          this.MapServiceService.setBaseMap(data);
        }
        this.ShowLoader = false;
      },
        error => {
          console.log(error);
          this.ShowLoader = false;
        });
    }
    else {
      this.baseMapList = List.BaseMapData;
      this.SetDefualtMapBasedonMapsetting(List);
    }
  }
  SetDefualtMapBasedonMapsetting(data) {
    if (data.MapSettingData && data.MapSettingData.length > 0) {
      var activeBasemap = this.baseMapList.filter(m => m.IsDefault == true)[0];
      // if (activeBasemap != null && activeBasemap != undefined) {
      //   activeBasemap.IsDefault = false;
      // }
      activeBasemap = this.baseMapList.filter(m => m.BaseMapProviderID == activeBasemap.BaseMapProviderID)[0];
      activeBasemap.IsDefault = true;
    }
  }
  ChangeBaseMap(baseMapID: any) {
    let UserId = this.authenticationService.getLoggedinUserId();
    var activeBasemap = this.baseMapList.filter(m => m.IsDefault == true)[0];
    if (baseMapID > 0) {
      if (activeBasemap != null && activeBasemap != undefined) {
        activeBasemap.IsDefault = false;
      }
      activeBasemap = this.baseMapList.filter(m => m.BaseMapProviderID == baseMapID)[0];
      activeBasemap.IsDefault = true;
      this.httpRequestService._NodeInsertBaseMapLogs(this.baseMapList, activeBasemap, UserId).subscribe(data => { });
      if (this.hideSomePart)
        this.BaseMapService.setBasemap(activeBasemap);
    }
  }


}
