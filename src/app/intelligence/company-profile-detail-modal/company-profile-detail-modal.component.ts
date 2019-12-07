import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from '../../services/Utility.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-company-profile-detail-modal',
  templateUrl: './company-profile-detail-modal.component.html',
  styleUrls: ['./company-profile-detail-modal.component.scss']
})
export class CompanyPorfileDetailModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private utilityService: UtilityService) { }
  CompanyProfiledetailURL = "";
  @Input() URL: string;
  ngOnInit() {
    this.utilityService.CloseModalOnRouteChange(this.activeModal);
    this.CompanyProfiledetailURL = this.URL
    setTimeout(() => {
      $("#CompanyProfiledetailModelIframe").attr("src", this.CompanyProfiledetailURL);
    }, 500);
  }

}
