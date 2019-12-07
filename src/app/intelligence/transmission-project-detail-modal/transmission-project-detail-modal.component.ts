import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from '../../services/Utility.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-transmission-project-detail-modal',
  templateUrl: './transmission-project-detail-modal.component.html',
  styleUrls: ['./transmission-project-detail-modal.component.scss']
})
export class TransmissionProjectDetailModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private utilityService: UtilityService) { }
  TransmissionProjectlURL = "";
  @Input() URL: string;
  ngOnInit() {
    this.utilityService.CloseModalOnRouteChange(this.activeModal);
    this.TransmissionProjectlURL = this.URL
    setTimeout(() => {
      $("#TransmissionProjectModelIframe").attr("src", this.TransmissionProjectlURL);
    }, 500);
  }
}
