import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TspComponent } from '../../edit-tsps/tsp.component';

@Component({
    selector: 'express-tab',
    templateUrl: './expresstab.component.html',
    styleUrls: ['./expresstab.component.scss']
})
export class ExpressTabComponent {
    
    public HorizontalName;

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal
    ) { };

    OpenTSPModal() {
        this.modalService.open(TspComponent, { size: 'lg', centered: true, backdropClass: 'light-blue-backdrop', backdrop: 'static', windowClass: 'tsp-modal' });
    }

}