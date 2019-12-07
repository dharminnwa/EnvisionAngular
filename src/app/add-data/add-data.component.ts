import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef } from 'ngx-bootstrap';
import { UtilityService } from '../services/Utility.service';

@Component({
    selector: 'add-data-modal',
    templateUrl: './add-data.component.html',
    styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent {
    public uploadedFiles: any[] = [];
    
    constructor(
        public bsModalRef: BsModalRef,
        private utilityService: UtilityService
    ) {
        utilityService.CloseModalOnRouteChange(bsModalRef);
     };

    onUpload(event) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
    }
}
