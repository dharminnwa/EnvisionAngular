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
var map_service_service_1 = require("../../services/map-service.service");
var Utility_service_1 = require("../../services/Utility.service");
var WidgetModalComponent = (function () {
    function WidgetModalComponent(modalService, activeModal, MapServiceService, utilityService) {
        this.modalService = modalService;
        this.activeModal = activeModal;
        this.MapServiceService = MapServiceService;
        this.utilityService = utilityService;
        this.activeWidgets = [];
        this.homeWidgets = [];
        this.allWidgets = [
            { Id: 1, Title: 'Parcel Centerpint Lookup' },
            { Id: 2, Title: 'Latest Industry News' },
            { Id: 3, Title: 'Envision 101' },
            { Id: 4, Title: 'PipeLine Activity Reports' },
            { Id: 5, Title: 'Latest Electric Industry news' },
            { Id: 6, Title: 'Fincial markets' },
            { Id: 7, Title: 'Assential Lookup' },
            { Id: 8, Title: 'Favourite Companies' },
            { Id: 9, Title: 'Favourite Layers' },
            { Id: 10, Title: 'Latest Energy Research from PennEnergy Research' },
            { Id: 11, Title: 'News Articles' },
            { Id: 12, Title: 'Most Recent Pipeline Projects' },
            { Id: 13, Title: 'Transmission Project Reports' },
            { Id: 14, Title: 'Transmission Projects' },
            { Id: 15, Title: 'Recent Maps' },
            { Id: 16, Title: 'Well Lookup' },
        ];
    }
    WidgetModalComponent.prototype.ngOnInit = function () {
        this.utilityService.CloseModalOnRouteChange(this.activeModal);
        var widgets = this.MapServiceService._HomeWidgetArray.getValue();
        this.activeWidgets = widgets;
    };
    WidgetModalComponent.prototype.ChangeWidget = function (subItem, item) {
        var index = this.activeWidgets.indexOf(item);
        if (index !== -1) {
            this.activeWidgets.splice(index, 1);
        }
        this.activeWidgets.splice(index, 0, { Id: subItem.Id, Title: subItem.Title });
    };
    WidgetModalComponent.prototype.SaveWidget = function () {
        this.activeModal.close(this.activeWidgets);
    };
    WidgetModalComponent = __decorate([
        core_1.Component({
            selector: 'app-widget-modal',
            templateUrl: './widget-modal.component.html',
            styleUrls: ['./widget-modal.component.scss'],
            providers: [ng_bootstrap_1.NgbModal]
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbModal,
            ng_bootstrap_1.NgbActiveModal,
            map_service_service_1.MapServiceService,
            Utility_service_1.UtilityService])
    ], WidgetModalComponent);
    return WidgetModalComponent;
}());
exports.WidgetModalComponent = WidgetModalComponent;
//# sourceMappingURL=widget-modal.component.js.map