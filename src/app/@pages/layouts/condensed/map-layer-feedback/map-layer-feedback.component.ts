import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from '../../../../services/Utility.service';
import { Feedback } from '../../../../models/feedback';
import { AuthenticationService } from '../../../../services/auth.service';
import { HttpRequestService } from '../../../../services/all-http-request.service';
declare var $: any;

@Component({
  selector: 'app-map-layer-feedback',
  templateUrl: './map-layer-feedback.component.html',
  styleUrls: ['./map-layer-feedback.component.scss']
})
export class MapLayerFeedbackComponent implements OnInit {
  feedback: Feedback;
  message: string = '';
  data;
  constructor(public activeModal: NgbActiveModal,
    private utilityService: UtilityService,
    private authService: AuthenticationService,
    private httpRequestService: HttpRequestService) { }
  ngOnInit() {
    this.utilityService.CloseModalOnRouteChange(this.activeModal);
    this.Draggable();
    this.InitObject();
  }

  Draggable() {
    setTimeout(() => {
      $('.modal-dialog').draggable({
        handle: ".modal-header"
      });
    }, 10);
  }

  InitObject() {
    this.feedback = new Feedback();
    this.feedback.Timestamp = new Date();
    this.feedback.IP = '';
    this.feedback.Host = window.location.hostname;
    this.feedback.UserId = this.authService.getLoggedinUserId();
    this.feedback.User = this.authService.GetUsername();

    if (this.data && this.data.energyLayer) {      
      let energyLayer = this.data.energyLayer;
      this.feedback.EnergyLayer = energyLayer.DisplayName ? energyLayer.DisplayName : '';
      this.feedback.NodeSqlId = energyLayer.EnergyLayerID ? energyLayer.EnergyLayerID : '';
      this.feedback.EnergyLayerGuid=energyLayer.EnergyLayerGUID ? energyLayer.EnergyLayerGUID : '';
    }
    if (this.data.clickLocation && this.data.clickLocation.lat && this.data.clickLocation.lng) {
      let clickLoc = this.data.clickLocation;
      this.feedback.Clicklocation = "(Lat: " + clickLoc.lat() + ", Long: " + clickLoc.lng() + ")";
    }

    this.feedback.Company = '';
    this.feedback.Description = '';

    if (this.data && this.data.infoData && this.data.infoData.data) {
      let infoData = this.data.infoData.data;
      this.feedback.MSID = infoData.MSID ? infoData.MSID : '';
      this.feedback.ObjectId = infoData.OBJECTID ? infoData.OBJECTID : 0;
    }

    this.feedback.DataSet = '';
    this.feedback.ShapeName = '';
  }

  SendFeedback() {
    if (this.message.trim() == '')
      return;

    this.feedback.Message = this.message;
    this.httpRequestService._NodeSendLayerFeedback(this.feedback).subscribe(data => {
      this.activeModal.dismiss();
    },
      error => {
        this.activeModal.dismiss();
        console.log(error);
      });
  }

}
