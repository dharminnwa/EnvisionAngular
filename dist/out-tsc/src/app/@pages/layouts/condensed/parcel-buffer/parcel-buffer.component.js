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
var modal_1 = require("ngx-bootstrap/modal");
var Utility_service_1 = require("../../../../services/Utility.service");
var ParcelBufferTool_service_1 = require("../../../../services/ParcelBufferTool.service");
var point_component_1 = require("./point/point.component");
var line_component_1 = require("./line/line.component");
var ParcelBufferComponent = (function () {
    function ParcelBufferComponent(bsModalRef, utilityService, parcelBufferToolService) {
        this.bsModalRef = bsModalRef;
        this.utilityService = utilityService;
        this.parcelBufferToolService = parcelBufferToolService;
        this.activeTabNumber = 1;
    }
    ParcelBufferComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.utilityService.CloseModalOnRouteChange(this.bsModalRef);
        this.parcelBufferToolService.InitPointForParcelBuffer();
        setTimeout(function () {
            var modalDiv = document.getElementsByClassName('parcelBuffer')[0];
            var modalElement = $(modalDiv).parents('.modal');
            $(modalElement).attr('id', 'parcelBuffer');
            _this.SetModal('parcelBuffer');
        }, 100);
        this.Draggable();
    };
    ParcelBufferComponent.prototype.ngOnDestroy = function () {
        // this.CloseModal(true);
    };
    ParcelBufferComponent.prototype.SetModal = function (modalname) {
        var modalwidth;
        var modalheight;
        var screenwidth;
        //$("#" + modalname).modal({ show: 'fade', hide: 'drop', backdrop: 'static', keyboard: false });
        $("#" + modalname + " .modal-dialog").css({ position: 'fixed', width: $("#" + modalname + " .modal-content").width(), height: $("#" + modalname + " .modal-content").height(), margin: '0px' });
        $("#" + modalname).css({ position: 'fixed', width: $("#" + modalname + " .modal-dialog").width(), height: $("#" + modalname + " .modal-dialog").height() });
        $('.modal').css('background', 'rgba(0,0,0,0)');
        $("#" + modalname).css({ left: ($(window).width() - $('#' + modalname).outerWidth()) / 2, top: ($(window).height() - $("#" + modalname).outerHeight()) / 2 });
        if ($('.modal-backdrop')) {
            $('.modal-backdrop').remove();
        }
        modalwidth = $("#" + modalname + " .modal-content").width();
        modalheight = $("#" + modalname + " .modal-content").height();
        screenwidth = $(window).width();
        $(window).resize(function () {
            if ($(window).width() < screenwidth) {
                $("#" + modalname + " .modal-content").css({ width: $(window).width() - 20 });
                $("#" + modalname + " .modal-dialog").css({ position: 'fixed', width: $("#" + modalname + " .modal-content").width(), height: $("#" + modalname + " .modal-content").height(), margin: '0px' });
                $("#" + modalname).css({ width: $("#" + modalname + " .modal-dialog").width(), height: $("#" + modalname + " .modal-dialog").height() });
            }
            else {
                $("#" + modalname + " .modal-content").css({ width: modalwidth });
                $("#" + modalname + " .modal-dialog").css({ position: 'fixed', width: $("#" + modalname + " .modal-content").width(), height: $("#" + modalname + " .modal-content").height(), margin: '0px' });
                $("#" + modalname).css({ width: $("#" + modalname + " .modal-dialog").width(), height: $("#" + modalname + " .modal-dialog").height() });
            }
            var topPos = ($(window).height() - $("#" + modalname).outerHeight()) / 2;
            $("#" + modalname).css({
                left: ($(window).width() - $("#" + modalname).outerWidth()) / 2,
                top: topPos > 0 ? topPos : 0
            });
        });
    };
    ParcelBufferComponent.prototype.Draggable = function () {
        setTimeout(function () {
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
        }, 10);
    };
    ParcelBufferComponent.prototype.SelectTab = function (tabNumber) {
        if (this.activeTabNumber != tabNumber) {
            this.activeTabNumber = tabNumber;
            if (this.activeTabNumber == 1) {
                this.parcelBufferToolService.CloseDrawToolsForLine();
                this.parcelBufferToolService.InitPointForParcelBuffer();
                this.lineComponent.ClearData(false);
            }
            else if (this.activeTabNumber == 2) {
                this.parcelBufferToolService.CloseDrawToolsForPoint();
                this.parcelBufferToolService.InitLineForParcelBuffer();
                this.pointComponent.ClearData(false);
            }
        }
    };
    ParcelBufferComponent.prototype.CloseModal = function (isFromDestroy) {
        if (isFromDestroy === void 0) { isFromDestroy = false; }
        this.pointComponent.ClearData(false);
        this.lineComponent.ClearData(false);
        this.parcelBufferToolService.CloseDrawToolsForPoint();
        this.parcelBufferToolService.CloseDrawToolsForLine();
        if (!isFromDestroy)
            this.bsModalRef.hide();
    };
    __decorate([
        core_1.ViewChild(point_component_1.PointComponent),
        __metadata("design:type", point_component_1.PointComponent)
    ], ParcelBufferComponent.prototype, "pointComponent", void 0);
    __decorate([
        core_1.ViewChild(line_component_1.LineComponent),
        __metadata("design:type", line_component_1.LineComponent)
    ], ParcelBufferComponent.prototype, "lineComponent", void 0);
    ParcelBufferComponent = __decorate([
        core_1.Component({
            selector: 'app-parcel-buffer',
            templateUrl: './parcel-buffer.component.html',
            styleUrls: ['./parcel-buffer.component.scss']
        }),
        __metadata("design:paramtypes", [modal_1.BsModalRef,
            Utility_service_1.UtilityService,
            ParcelBufferTool_service_1.ParcelBufferToolService])
    ], ParcelBufferComponent);
    return ParcelBufferComponent;
}());
exports.ParcelBufferComponent = ParcelBufferComponent;
//# sourceMappingURL=parcel-buffer.component.js.map