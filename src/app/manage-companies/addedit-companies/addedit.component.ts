import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from '../../services/Utility.service';

@Component({
    selector: 'addeditcompanies-modal',
    templateUrl: './addedit.component.html',
    styleUrls: ['./addedit.component.scss'],

})
export class AddeditCompaniesComponent {
    public HorizontalUserLimit = "";
    public HorizontalName = "";


    constructor(public activeModal: NgbActiveModal, private utilityService: UtilityService) {
        utilityService.CloseModalOnRouteChange(activeModal);
    }

}