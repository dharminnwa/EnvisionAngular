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
var ng_bootstrap_2 = require("@ng-bootstrap/ng-bootstrap");
var tsp_component_1 = require("../../edit-tsps/tsp.component");
var ExpressTabComponent = (function () {
    function ExpressTabComponent(activeModal, modalService) {
        this.activeModal = activeModal;
        this.modalService = modalService;
    }
    ;
    ExpressTabComponent.prototype.OpenTSPModal = function () {
        this.modalService.open(tsp_component_1.TspComponent, { size: 'lg', centered: true, backdropClass: 'light-blue-backdrop', backdrop: 'static', windowClass: 'tsp-modal' });
    };
    ExpressTabComponent = __decorate([
        core_1.Component({
            selector: 'express-tab',
            templateUrl: './expresstab.component.html',
            styleUrls: ['./expresstab.component.scss']
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal,
            ng_bootstrap_2.NgbModal])
    ], ExpressTabComponent);
    return ExpressTabComponent;
}());
exports.ExpressTabComponent = ExpressTabComponent;
//# sourceMappingURL=expresstab.component.js.map