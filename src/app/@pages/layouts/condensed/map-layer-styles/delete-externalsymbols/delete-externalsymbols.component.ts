import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { MapServiceService } from '../../../../../services/map-service.service';
import { UtilityService } from '../../../../../services/Utility.service';
import { HttpRequestService } from '../../../../../services/all-http-request.service';
@Component({
  selector: 'app-delete-externalsymbols',
  templateUrl: './delete-externalsymbols.component.html',
  styleUrls: ['./delete-externalsymbols.component.scss']
})
export class DeleteExternalsymbolsComponent implements OnInit {

  constructor(public BsModalRef: BsModalRef, 
  private MapServiceService: MapServiceService, 
  private UtilityService: UtilityService,
  private httpRequest: HttpRequestService) { }
  UserID: string;
  IconURL: string
  ngOnInit() {
    this.UtilityService.CloseModalOnRouteChange(this.BsModalRef);
  }

  deleteIcon() {
    this.IconURL;
    this.UserID;
    let filenamewithex = this.IconURL.replace(/^.*[\\\/]/, '');
    let id = filenamewithex.split('.').slice(0, -1).join('.');
    this.httpRequest._NodeDeleteExternalSysmbols(this.UserID, filenamewithex, id).subscribe(data => {
      let res = data;
      if (res._Issuccess) {
        let ExternalIconlist = this.MapServiceService.ExternalIconList.value;

        let index = ExternalIconlist.findIndex(x=> x.Id == res.ExternalIcon.IconID);
        if(index != -1){
          ExternalIconlist.splice(index, 1);
        }

        let Closebtnid = document.getElementById('btndeleteExIconClose');
        Closebtnid.click();
        setTimeout(() => {
          Closebtnid = null;
          Closebtnid = document.getElementById('_btnMapLayerclosePopup');
          if (Closebtnid != null) {
            Closebtnid.click();
          }
        }, 1000);
        // for (let i of ExternalIconlist) {
        //   if ((i.Id == res.ExternalIcon.Id) && res.ExternalIcon.IsDeleted == true) {
        //     continue;
        //   }
        //   else {
        //     exicon.push(i);
        //   }
        // }
        // if (exicon.length > 0) {
        //   this.MapServiceService.ExternalIconList.value.length = 0;
        //   this.MapServiceService.ExternalIconList.getValue().push(exicon);
        // }
      }
      else {
        alert(res.errormsg);
      }
    }, error => {      
      console.log(error);
    })
  }
}
