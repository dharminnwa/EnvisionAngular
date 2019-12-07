import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { HttpRequestService } from '../../../../../services/all-http-request.service';
import { MapServiceService } from '../../../../../services/map-service.service';
import { DrawingToolService } from '../../../../../services/draw-tools.service';
import { AuthenticationService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-confirm-delete-draw-tool',
  templateUrl: './confirm-delete-draw-tool.component.html',
  styleUrls: ['./confirm-delete-draw-tool.component.scss']
})
export class ConfirmDeleteDrawToolComponent implements OnInit {

  layerId: any;
  isShared: boolean = false;
  @Output() isDelete = new EventEmitter();
  constructor(public bsModalRef: BsModalRef,
    private httpService: HttpRequestService,
    private mapService: MapServiceService,
    private drawingToolService: DrawingToolService,
    private authService: AuthenticationService) { }

  ngOnInit() {
  }

  CloseModal() {
    this.bsModalRef.hide();
  }

  DeleteDrawTool() {
    this.bsModalRef.hide();
    if (this.layerId && !this.isShared) {
      this.drawingToolService.RemoveAddedLayer(this.layerId);
      this.httpService._NodeDeleteDrawTools(this.layerId).subscribe(data => {
        if (data && data._Issuccess == true) {
          let drawData = this.mapService.DrawToolTreenode.getValue();
          if (drawData && drawData.length > 0) {
            let drawIndex = drawData.findIndex(x => x.EditableLayerID == this.layerId);
            if (drawIndex > -1) {
              drawData.splice(drawIndex, 1);
              this.mapService.DrawToolTreenode.next(drawData);
            }
          }
        }
      })
    } else if (this.layerId && this.isShared) {
      this.drawingToolService.RemoveAddedLayer(this.layerId);
      let userId = this.authService.getLoggedinUserId();
      let data = {
        HTML_EditableLayerID: this.layerId,
        UserGuid: userId
      }
      this.httpService._NodeDeleteSharedDrawTools(data).subscribe(data => {
        if(data && data._Issuccess == true)
          this.isDelete.emit(true);
      })
    }
  }

}
