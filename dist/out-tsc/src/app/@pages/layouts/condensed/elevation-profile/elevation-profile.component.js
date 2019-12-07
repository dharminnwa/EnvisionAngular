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
var elevation_profile_service_1 = require("../../../../services/elevation-profile.service");
var Utility_service_1 = require("../../../../services/Utility.service");
var ElevationProfileComponent = (function () {
    function ElevationProfileComponent(bsModalRef, bsModalService, mapService, elevationPofileService, UtilityService) {
        this.bsModalRef = bsModalRef;
        this.bsModalService = bsModalService;
        this.mapService = mapService;
        this.elevationPofileService = elevationPofileService;
        this.UtilityService = UtilityService;
    }
    ElevationProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
        setTimeout(function () {
            var modalDiv = document.getElementsByClassName('elevationProfile')[0];
            var modalElement = $(modalDiv).parents('.modal');
            $(modalElement).attr('id', 'elevationProfile');
            _this.mapService.SetModal('elevationProfile');
            if (!_this.mapService._elevationGraphData.getValue()) {
                var elevationColumnChart = [{
                        chartType: 'ColumnChart',
                        dataTable: [],
                        options: { 'title': 'Elevation' },
                    }];
                _this.mapService.setElevationGraphData(elevationColumnChart);
            }
        }, 100);
        this.Draggable();
    };
    ElevationProfileComponent.prototype.Draggable = function () {
        setTimeout(function () {
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
        }, 10);
    };
    ElevationProfileComponent.prototype.CloseElevationProfile = function () {
        this.elevationPofileService.CloseDrawToolsForElevation();
        this.bsModalRef.hide();
        this.elevationPofileService.elevationToolMeasurement = "Feet";
    };
    ElevationProfileComponent.prototype.OnMeasurementChange = function (e) {
        if (document.getElementById("optMeter").checked)
            this.elevationPofileService.elevationToolMeasurement = "Meter";
        else if (document.getElementById("optFeet").checked)
            this.elevationPofileService.elevationToolMeasurement = "Feet";
        this.elevationPofileService.OnMeasurementChange();
    };
    ElevationProfileComponent.prototype.ClearClick = function () {
        this.elevationPofileService.ClearButtonClick();
    };
    ElevationProfileComponent = __decorate([
        core_1.Component({
            selector: 'app-elevation-profile',
            templateUrl: './elevation-profile.component.html',
            styleUrls: ['./elevation-profile.component.scss'],
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            ngx_bootstrap_1.BsModalService,
            map_service_service_1.MapServiceService,
            elevation_profile_service_1.ElevationPofileService,
            Utility_service_1.UtilityService])
    ], ElevationProfileComponent);
    return ElevationProfileComponent;
}());
exports.ElevationProfileComponent = ElevationProfileComponent;
//# sourceMappingURL=elevation-profile.component.js.map