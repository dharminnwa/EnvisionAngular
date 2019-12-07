"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var change_username_component_1 = require("../change-username/change-username.component");
var Utility_service_1 = require("../../services/Utility.service");
var AddEditUserComponent = (function () {
    function AddEditUserComponent(activeModal, modalService, utilityService) {
        this.activeModal = activeModal;
        this.modalService = modalService;
        this.utilityService = utilityService;
        this.companyOptions = [
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
        utilityService.CloseModalOnRouteChange(activeModal);
    }
    AddEditUserComponent.prototype.OpenUserNameModal = function () {
        this.modalService.open(change_username_component_1.ChangeUserNameComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', centered: true, windowClass: 'changeuser-modal' });
    };
    AddEditUserComponent = __decorate([
        core_1.Component({
            selector: 'addedituser-modal',
            templateUrl: './addedit-user.component.html',
            styleUrls: ['./addedit-user.component.scss']
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal, ng_bootstrap_1.NgbModal, Utility_service_1.UtilityService])
    ], AddEditUserComponent);
    return AddEditUserComponent;
}());
exports.AddEditUserComponent = AddEditUserComponent;
//# sourceMappingURL=addedit-user.component.js.map