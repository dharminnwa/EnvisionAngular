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
var TransmissionProjectDetailModalComponent = (function () {
    function TransmissionProjectDetailModalComponent(activeModal, utilityService) {
        this.activeModal = activeModal;
        this.utilityService = utilityService;
        this.TransmissionProjectlURL = "";
    }
    TransmissionProjectDetailModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.utilityService.CloseModalOnRouteChange(this.activeModal);
        this.TransmissionProjectlURL = this.URL;
        setTimeout(function () {
            $("#TransmissionProjectModelIframe").attr("src", _this.TransmissionProjectlURL);
        }, 500);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TransmissionProjectDetailModalComponent.prototype, "URL", void 0);
    TransmissionProjectDetailModalComponent = __decorate([
        core_1.Component({
            selector: 'app-transmission-project-detail-modal',
            templateUrl: './transmission-project-detail-modal.component.html',
            styleUrls: ['./transmission-project-detail-modal.component.scss']
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal, Utility_service_1.UtilityService])
    ], TransmissionProjectDetailModalComponent);
    return TransmissionProjectDetailModalComponent;
}());
exports.TransmissionProjectDetailModalComponent = TransmissionProjectDetailModalComponent;
//# sourceMappingURL=transmission-project-detail-modal.component.js.map