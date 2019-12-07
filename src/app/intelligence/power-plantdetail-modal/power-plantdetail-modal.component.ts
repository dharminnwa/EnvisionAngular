import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from '../../services/Utility.service';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-power-plantdetail-modal',
  templateUrl: './power-plantdetail-modal.component.html',
  styleUrls: ['./power-plantdetail-modal.component.scss'],
  providers: [NgbModal]
})
export class PowerPlantdetailModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private utilityService: UtilityService) { }
  PowerPlantModelURL = "";
  @Input() URL: string;
  ngOnInit() {
    this.utilityService.CloseModalOnRouteChange(this.activeModal);
    this.PowerPlantModelURL = this.URL
    setTimeout(() => {
      $("#PowerPlantModelIframe").attr("src", this.PowerPlantModelURL);
    }, 500);
  }

}
