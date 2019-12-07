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
var Utility_service_1 = require("../../services/Utility.service");
var CompanyPorfileDetailModalComponent = (function () {
    function CompanyPorfileDetailModalComponent(activeModal, utilityService) {
        this.activeModal = activeModal;
        this.utilityService = utilityService;
        this.CompanyProfiledetailURL = "";
    }
    CompanyPorfileDetailModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.utilityService.CloseModalOnRouteChange(this.activeModal);
        this.CompanyProfiledetailURL = this.URL;
        setTimeout(function () {
            $("#CompanyProfiledetailModelIframe").attr("src", _this.CompanyProfiledetailURL);
        }, 500);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CompanyPorfileDetailModalComponent.prototype, "URL", void 0);
    CompanyPorfileDetailModalComponent = __decorate([
        core_1.Component({
            selector: 'app-company-profile-detail-modal',
            templateUrl: './company-profile-detail-modal.component.html',
            styleUrls: ['./company-profile-detail-modal.component.scss']
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal, Utility_service_1.UtilityService])
    ], CompanyPorfileDetailModalComponent);
    return CompanyPorfileDetailModalComponent;
}());
exports.CompanyPorfileDetailModalComponent = CompanyPorfileDetailModalComponent;
//# sourceMappingURL=company-profile-detail-modal.component.js.map