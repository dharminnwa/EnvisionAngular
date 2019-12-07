import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from '../../services/Utility.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-operating-utilitydetail-modal',
  templateUrl: './operating-utilitydetail-modal.component.html',
  styleUrls: ['./operating-utilitydetail-modal.component.scss']
})
export class OperatingUtilitydetailModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private utilityService: UtilityService) { }
  OperatingUtilitydetailURL = "";
  @Input() URL: string;
  ngOnInit() {
    this.utilityService.CloseModalOnRouteChange(this.activeModal);
    this.OperatingUtilitydetailURL = this.URL
    setTimeout(() => {
      $("#OperatingUtilitydetailModelIframe").attr("src", this.OperatingUtilitydetailURL);
    }, 500);
  }

}
