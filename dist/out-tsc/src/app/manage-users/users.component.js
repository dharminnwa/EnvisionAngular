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
var addedit_user_component_1 = require("./addedit-users/addedit-user.component");
var Utility_service_1 = require("../services/Utility.service");
var UsersComponent = (function () {
    function UsersComponent(activeModal, modalService, utilityService) {
        this.activeModal = activeModal;
        this.modalService = modalService;
        this.utilityService = utilityService;
        this.rowGroupPanelShow = "";
        this.columnDefs = [
            {
                headerName: "",
                suppressMenu: true,
                suppressSorting: true,
                width: 100,
                template: "<button type=\"button\" data-action-type=\"view\" class=\"btn btn-link\">\n                 Edit\n               </button>\n               "
            },
            { headerName: 'Make', field: 'make', enableRowGroup: true },
            { headerName: 'Model', field: 'model', enableRowGroup: true },
            { headerName: 'Price', field: 'price', enableRowGroup: true }
        ];
        this.rowData = [
            { make: 'Toyota', model: 'Celica', price: 35000 },
            { make: 'Ford', model: 'Mondeo', price: 32000 },
            { make: 'Porsche', model: 'Boxter', price: 72000 }
        ];
        utilityService.CloseModalOnRouteChange(activeModal);
        this.gridOptions = {};
        this.rowGroupPanelShow = "always";
    }
    UsersComponent.prototype.OpenAddEditUserModal = function () {
        this.modalService.open(addedit_user_component_1.AddEditUserComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', centered: true, windowClass: 'addedituser-modal' });
    };
    UsersComponent = __decorate([
        core_1.Component({
            selector: 'users-modal',
            templateUrl: './users.component.html',
            styleUrls: ['./users.component.scss']
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal,
            ng_bootstrap_1.NgbModal,
            Utility_service_1.UtilityService])
    ], UsersComponent);
    return UsersComponent;
}());
exports.UsersComponent = UsersComponent;
//# sourceMappingURL=users.component.js.map