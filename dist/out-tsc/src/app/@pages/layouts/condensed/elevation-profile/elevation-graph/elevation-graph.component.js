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
var map_service_service_1 = require("../../../../../services/map-service.service");
var Utility_service_1 = require("../../../../../services/Utility.service");
var ElevationGraphComponent = (function () {
    function ElevationGraphComponent(bsModalRef, mapService, UtilityService) {
        this.bsModalRef = bsModalRef;
        this.mapService = mapService;
        this.UtilityService = UtilityService;
    }
    ElevationGraphComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
        setTimeout(function () {
            var modalDiv = document.getElementsByClassName('elevationGraph')[0];
            var modalElement = $(modalDiv).parents('.modal');
            $(modalElement).attr('id', 'elevationGraph');
            _this.SetModal('elevationGraph');
        }, 100);
        this.Draggable();
    };
    ElevationGraphComponent.prototype.Draggable = function () {
        setTimeout(function () {
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
        }, 10);
    };
    ElevationGraphComponent.prototype.SetModal = function (modalname) {
        var modalwidth;
        var modalheight;
        var screenwidth;
        //$("#" + modalname).modal({ show: 'fade', hide: 'drop', backdrop: 'static', keyboard: false });
        $("#" + modalname + " .modal-dialog").css({ position: 'fixed', width: $("#" + modalname + " .modal-content").width(), height: $("#" + modalname + " .modal-content").height(), margin: '0px' });
        $("#" + modalname).css({ position: 'fixed', width: $("#" + modalname + " .modal-dialog").width(), height: $("#" + modalname + " .modal-dialog").height() });
        $('.modal').css('background', 'rgba(0,0,0,0)');
        $("#" + modalname).css({ left: ($(window).width() - $('#' + modalname).outerWidth()) / 2, top: ($(window).height() - $("#" + modalname).outerHeight()) / 2 });
        $('.modal-backdrop').hide();
        setTimeout(function () {
            $("#" + modalname).css({
                height: '0px',
                top: 0,
            });
        }, 500);
    };
    ElevationGraphComponent = __decorate([
        core_1.Component({
            selector: 'app-elevation-graph',
            templateUrl: './elevation-graph.component.html',
            styleUrls: ['./elevation-graph.component.scss']
        }),
        __metadata("design:paramtypes", [modal_1.BsModalRef,
            map_service_service_1.MapServiceService,
            Utility_service_1.UtilityService])
    ], ElevationGraphComponent);
    return ElevationGraphComponent;
}());
exports.ElevationGraphComponent = ElevationGraphComponent;
//# sourceMappingURL=elevation-graph.component.js.map