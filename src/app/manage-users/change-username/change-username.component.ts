import { Component } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from '../../services/Utility.service';

@Component({
    selector: 'change-username-modal',
    templateUrl: './change-username.component.html',
    styleUrls: ['./change-username.component.scss']
})
export class ChangeUserNameComponent {
    public HorizontalUserName;
    constructor(public activeModal: NgbActiveModal, private utilityService: UtilityService
    ) {
        utilityService.CloseModalOnRouteChange(activeModal);
    };
}
