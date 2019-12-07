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
var ngx_bootstrap_1 = require("ngx-bootstrap");
var map_service_service_1 = require("../../../../services/map-service.service");
var MapLayer_service_1 = require("../../../../services/MapLayer-service");
var Utility_service_1 = require("../../../../services/Utility.service");
var ShowLegendComponent = (function () {
    function ShowLegendComponent(bsModalRef, mapServiceService, MapLayerService, UtilityService) {
        var _this = this;
        this.bsModalRef = bsModalRef;
        this.mapServiceService = mapServiceService;
        this.MapLayerService = MapLayerService;
        this.UtilityService = UtilityService;
        this.legendList = [];
        this.pvtLegendList = [];
        this.srdLegendList = [];
        this.tempLegendList = [];
        this.mapServiceService.legendData$.subscribe(function () {
            _this.GetAllChildNodeData();
        });
    }
    ShowLegendComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
        this.GetAllChildNodeData();
        setTimeout(function () {
            // if (this.legendList.length == 0 && this.pvtLegendList == 0) {
            //   this.CloseShowLegend();
            // }
            var modalDiv = document.getElementsByClassName('LegendModal')[0];
            var modalElement = $(modalDiv).parents('.modal');
            $(modalElement).attr('id', 'LegendModal');
            _this.SetModal('LegendModal');
        }, 50);
        this.Draggable();
        this.Resizable();
    };
    ShowLegendComponent.prototype.SetModal = function (modalname) {
        $("#" + modalname + " .modal-dialog").css({
            position: 'fixed',
            width: '250px',
            height: $("#" + modalname + " .modal-content").height(), margin: '0px'
        });
        $("#" + modalname).css({
            position: 'fixed',
            width: '250px',
            height: $("#" + modalname + " .modal-dialog").height()
        });
        $('.modal').css('background', 'rgba(0,0,0,0)');
        $("#" + modalname).css({
            left: ($(window).width() - $('#' + modalname).outerWidth()),
            top: ($(window).height() - ($("#" + modalname).outerHeight() + 200))
        });
        $('.modal-backdrop').hide();
    };
    ShowLegendComponent.prototype.Draggable = function () {
        setTimeout(function () { $('.modal-dialog').draggable({ handle: ".modal-header" }); }, 10);
    };
    ShowLegendComponent.prototype.Resizable = function () {
        setTimeout(function () {
            $('.modal-content').resizable({
                handles: 'w, s, se, sw',
                minHeight: 140,
                minWidth: 250
            });
        }, 10);
    };
    ShowLegendComponent.prototype.GetAllChildNodeData = function () {
        var _this = this;
        try {
            this.legendList = [];
            this.pvtLegendList = [];
            this.srdLegendList = [];
            this.tempLegendList = [];
            setTimeout(function () {
                _this.legendList = _this.mapServiceService.GetAllChildNodeData();
                _this.legendList = _this.legendList.filter(function (m) { return m.IsChecked == false; });
                // this.legendList = JSON.parse(JSON.stringify(this.legendList));
                // this.legendList.forEach(x => {
                //   if (x && x.ParentLayerName)
                //     x.Name = x.ParentLayerName.split(' ')[0] + ': ' + x.Name;
                // });
            }, 100);
            // this.pvtLegendList = this.mapServiceService.PrivateTreeNode.getValue();
            this.pvtLegendList = this.UtilityService.GetChildNodeData(this.mapServiceService.PrivateTreeNode.getValue());
            if (this.pvtLegendList != null && this.pvtLegendList.length > 0) {
                this.pvtLegendList = this.pvtLegendList.filter(function (m) { return m.IsChecked == false; });
            }
            this.srdLegendList = this.UtilityService.GetChildNodeData(this.mapServiceService._SharedTreeNode.getValue());
            if (this.srdLegendList != null && this.srdLegendList.length > 0) {
                this.srdLegendList = this.srdLegendList.filter(function (m) { return m.IsChecked == false; });
            }
            this.tempLegendList = this.UtilityService.GetChildNodeData(this.mapServiceService.TemporaryTreeNode.getValue());
            if (this.tempLegendList != null && this.tempLegendList.length > 0) {
                this.tempLegendList = this.tempLegendList.filter(function (m) { return m.IsChecked == false; });
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    ShowLegendComponent.prototype.CloseShowLegend = function () {
        this.bsModalRef.hide();
        $('#ToggleLegend').text('Show Legend');
    };
    ShowLegendComponent = __decorate([
        core_1.Component({
            selector: 'app-show-legend',
            templateUrl: './show-legend.component.html',
            styleUrls: ['./show-legend.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            map_service_service_1.MapServiceService,
            MapLayer_service_1.MapLayerService,
            Utility_service_1.UtilityService])
    ], ShowLegendComponent);
    return ShowLegendComponent;
}());
exports.ShowLegendComponent = ShowLegendComponent;
//# sourceMappingURL=show-legend.component.js.map