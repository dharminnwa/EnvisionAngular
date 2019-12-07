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
var widget_modal_component_1 = require("./widget-modal/widget-modal.component");
var map_service_service_1 = require("../services/map-service.service");
var HomeComponent = (function () {
    function HomeComponent(modalService, MapServiceService) {
        this.modalService = modalService;
        this.MapServiceService = MapServiceService;
        this.searchFacilitiesOptions = [
            { value: 'One', label: 'One' },
            { value: 'Two', label: 'Two' },
        ];
        this.searchCommoditiesOptions = [
            { value: 'Crude Oil', label: 'Crude Oil' },
            { value: 'Natural Gas', label: 'Natural Gas' },
            { value: 'LPG/NGL', label: 'LPG/NGL' },
            { value: 'Petrochemical', label: 'Petrochemical' },
            { value: 'Refined Products', label: 'Refined Products' }
        ];
        this.searchStatesOptions = [
            { value: 'Alabama', label: 'Alabama' },
            { value: 'Alaska', label: 'Alaska' },
            { value: 'Arizona', label: 'Arizona' },
            { value: 'Arkansas', label: 'Arkansas' },
            { value: 'California', label: 'California' },
            { value: 'Colorado', label: 'Colorado' },
            { value: 'Connecticut', label: 'Connecticut' },
            { value: 'Delaware', label: 'Delaware' },
            { value: 'District of Columbia', label: 'District of Columbia' },
            { value: 'Florida', label: 'Florida' },
            { value: 'California', label: 'California' },
            { value: 'California', label: 'California' }
        ];
        this.restoreClass = "fa fa-window-restore";
        this.panelClass = "panel panel-default col-md-4";
        this.PanelContainerClass = "col-md-12";
        this.restoredPanel = { Id: 0, Title: '' };
        this.IsOpen = false;
        this.panelArray = [
            { Id: 1, Title: 'Parcel Centerpint Lookup' },
            { Id: 2, Title: 'Latest Industry News' },
            { Id: 3, Title: 'Envision 101' },
            { Id: 4, Title: 'PipeLine Activity Reports' },
            { Id: 5, Title: 'Latest Electric Industry news' },
            { Id: 6, Title: 'Fincial markets' },
        ];
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.InitDraggble();
    };
    HomeComponent.prototype.InitDraggble = function () {
        var panelList = $('#draggablePanelList');
        panelList.sortable({
            handle: '.panel-heading',
            update: function (e) {
                $('.panel', panelList).each(function (index, elem) {
                    var $listItem = $(elem), newIndex = $listItem.index();
                });
            }
        });
    };
    HomeComponent.prototype.ResizePanel = function (event) {
        var target = event.target || event.srcElement || event.currentTarget;
        var panelElement = $(target.parentElement.parentElement);
        if (panelElement != undefined) {
            if (target.className.includes('restore')) {
                this.IsOpen = true;
                this.PanelContainerClass = "col-md-3";
                this.panelClass = "panel panel-default col-md-12";
                var selectedIndex = parseInt(panelElement.attr('data-index'));
                if (selectedIndex >= 0) {
                    var tempPanel = { Id: 0, Title: '' };
                    if (this.restoredPanel.Id > 0) {
                        tempPanel = this.restoredPanel;
                    }
                    this.restoredPanel = this.panelArray[selectedIndex];
                    this.panelArray.splice(selectedIndex, 1);
                    if (tempPanel.Id > 0) {
                        this.panelArray.unshift(tempPanel);
                        tempPanel = { Id: 0, Title: '' };
                    }
                }
            }
            else if (target.className.includes('minimize')) {
                this.IsOpen = false;
                this.PanelContainerClass = "col-md-12";
                this.panelClass = "panel panel-default col-md-4";
                this.panelArray.unshift(this.restoredPanel);
                this.restoredPanel = '';
            }
        }
    };
    HomeComponent.prototype.openWidgetModal = function () {
        var _this = this;
        this.MapServiceService.setHomeWidgetArray(this.panelArray);
        var ref = this.modalService.open(widget_modal_component_1.WidgetModalComponent, { size: 'lg', centered: true, keyboard: false });
        ref.result.then(function (result) {
            _this.panelArray = result;
        });
    };
    HomeComponent.prototype.SearchAssest = function () {
        this.selectedMultipleFacilities;
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: './home.component.html',
            styleUrls: ['./home.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbModal, map_service_service_1.MapServiceService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map