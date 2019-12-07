import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from '../../services/Utility.service';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-pipeline-activity-project-modal',
  templateUrl: './pipeline-activity-project-modal.component.html',
  styleUrls: ['./pipeline-activity-project-modal.component.scss']
})
export class PipelineActivityProjectModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private utilityService: UtilityService) { }
  PipelineActivityProjectlURL = "";
  @Input() URL: string;
  ngOnInit() {
    this.utilityService.CloseModalOnRouteChange(this.activeModal);
    this.PipelineActivityProjectlURL = this.URL
    setTimeout(() => {
      $("#PipelineActivityProjectModelIframe").attr("src", this.PipelineActivityProjectlURL);
    }, 500);
  }


}
