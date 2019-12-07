import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { pgSelectModule } from '../../@pages/components/select/select.module';
import { ChangeUserNameComponent } from '../change-username/change-username.component';
import { UtilityService } from '../../services/Utility.service';


@Component({
    selector: 'addedituser-modal',
    templateUrl: './addedit-user.component.html',
    styleUrls: ['./addedit-user.component.scss']
})
export class AddEditUserComponent {
    public HorizontalUserName;
    public HorizontalDisplayName;
    
    public selectedOption;
    public companyOptions = [
        { value: 'buffalo_STX', label: 'Buffalo STX' },
        { value: 'del_test_1', label: 'Del test 1' },
        { value: 'demo', label: 'Demo' },
        { value: 'envisionbasci_electric_power', label: 'Envisionbasci Electric Power' },
        { value: 'envisionbasic_oil_and_gas', label: 'Envisionbasic Oil and Gas' },
        { value: 'buffalo_STX', label: 'Buffalo STX' },
        { value: 'del_test_1', label: 'Del test 1' },
        { value: 'demo', label: 'Demo' },
        { value: 'envisionbasci_electric_power', label: 'Envisionbasci Electric Power' },
        { value: 'envisionbasic_oil_and_gas', label: 'Envisionbasic Oil and Gas' }
    ];

    constructor(public activeModal: NgbActiveModal,private modalService: NgbModal, private utilityService: UtilityService) {
        utilityService.CloseModalOnRouteChange(activeModal);
    }

    OpenUserNameModal() {
        this.modalService.open(ChangeUserNameComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', centered: true, windowClass: 'changeuser-modal' });
    }



}
