import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SaveDrawToolsComponent } from '../save-draw-tools/save-draw-tools.component';
declare var $: any;

@Component({
  selector: 'app-confirm-draw-tools',
  templateUrl: './confirm-draw-tools.component.html',
  styleUrls: ['./confirm-draw-tools.component.scss']
})
export class ConfirmDrawToolsComponent implements OnInit {

  parentBsModelRef: BsModalRef;
  EditLayerId;
  @Output() close = new EventEmitter();
  constructor(public bsModalRef: BsModalRef,
    private injector: Injector,
    private bsModalService: BsModalService) {
  }

  ngOnInit() {
    $('.modal-backdrop').show();
    $('#draw-tools').css("z-index", "99");
  }

  CloseModal() {
    $('.modal-backdrop').hide();
    $('#draw-tools').css("z-index", "");
    this.bsModalRef.hide();
    // this.parentBsModelRef.hide();
    this.close.emit(true);
  }

  saveDrawToolData() {
    this.bsModalRef.hide();
    const config: ModalOptions = { class: 'modal-sm modal-dialog-centered', backdrop: 'static', animated: false };
    let bsModalRef = this.bsModalService.show(SaveDrawToolsComponent, config);
    bsModalRef.content.isSaved.take(1).subscribe((value) => {
      if (value == true)
        this.close.emit(true);
    });
    if (this.EditLayerId)
      bsModalRef.content.EditLayerId = this.EditLayerId;
  }
}
