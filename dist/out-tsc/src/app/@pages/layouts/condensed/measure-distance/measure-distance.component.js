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
var Utility_service_1 = require("../../../../services/Utility.service");
var map_service_service_1 = require("../../../../services/map-service.service");
var mesure_distance_service_1 = require("../../../../services/mesure-distance.service");
var MeasureDistanceComponent = (function () {
    function MeasureDistanceComponent(bsModalRef, UtilityService, mapService, mesureDistanceService) {
        this.bsModalRef = bsModalRef;
        this.UtilityService = UtilityService;
        this.mapService = mapService;
        this.mesureDistanceService = mesureDistanceService;
        this.isMesureDistance = false;
        this.isMesureArea = false;
        this.distanceLatLngs = [];
        this.distanceInMeters = 0;
        this.distanceInFeet = 0;
        this.distanceInKM = 0;
        this.distanceInMiles = 0;
        this.areaLatLngs = [];
        this.areaInMeters = 0;
        this.areaInKm = 0;
        this.areaInMile = 0;
        this.areaInAcres = 0;
        this.menuLinks = [
            {
                label: "Dashboard",
                details: "12 New Updates",
                routerLink: "dashboard",
                iconType: "pg",
                iconName: "home",
                thumbNailClass: "bg-success"
            },
            {
                label: "Email",
                details: "234 New Emails",
                routerLink: "email/list",
                iconType: "pg",
                iconName: "mail"
            },
        ];
    }
    MeasureDistanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
        setTimeout(function () {
            var modalDiv = document.getElementsByClassName('mesure-distance')[0];
            var modalElement = $(modalDiv).parents('.modal');
            $(modalElement).attr('id', 'mesure-distance');
            _this.mapService.SetModal('mesure-distance');
        }, 100);
        this.Draggable();
        this.mesureDistanceService.getDistanceData().subscribe(function (x) {
            _this.distanceLatLngs = x;
            _this.MesureDistance(_this.distanceLatLngs);
        });
        this.mesureDistanceService.getAreaData().subscribe(function (x) {
            _this.areaLatLngs = x;
            _this.MesureArea(_this.areaLatLngs);
        });
    };
    MeasureDistanceComponent.prototype.Draggable = function () {
        setTimeout(function () {
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
        }, 10);
    };
    MeasureDistanceComponent.prototype.ToggleMesureDistance = function () {
        this.isMesureDistance = !this.isMesureDistance;
        if (this.isMesureDistance == true) {
            this.isMesureArea = false;
            this.mesureDistanceService.DrawToolsForMesureDistance();
            this.mesureDistanceService.CloseDrawToolsForArea();
        }
        else {
            this.mesureDistanceService.CloseDrawToolsForDistance();
        }
        this.ResetAllValues();
    };
    MeasureDistanceComponent.prototype.ToggleMesureArea = function () {
        this.isMesureArea = !this.isMesureArea;
        if (this.isMesureArea == true) {
            this.isMesureDistance = false;
            this.mesureDistanceService.DrawToolsForMesureArea();
            this.mesureDistanceService.CloseDrawToolsForDistance();
        }
        else {
            this.mesureDistanceService.CloseDrawToolsForArea();
        }
        this.ResetAllValues();
    };
    MeasureDistanceComponent.prototype.ResetAllValues = function () {
        this.distanceInMeters = 0;
        this.distanceInFeet = 0;
        this.distanceInKM = 0;
        this.distanceInMiles = 0;
        this.areaInMeters = 0;
        this.areaInKm = 0;
        this.areaInMile = 0;
        this.areaInAcres = 0;
    };
    MeasureDistanceComponent.prototype.CloseModal = function () {
        this.mesureDistanceService.CloseDrawToolsForDistance();
        this.mesureDistanceService.CloseDrawToolsForArea();
        this.bsModalRef.hide();
    };
    MeasureDistanceComponent.prototype.MesureArea = function (data) {
        if (data && data.length > 1) {
            this.areaInMeters = google.maps.geometry.spherical.computeArea(data);
            this.areaInKm = this.areaInMeters / 1e+6;
            this.areaInMile = this.areaInMeters / 2.59e+6;
            this.areaInAcres = this.areaInMeters / 4046.856;
        }
    };
    MeasureDistanceComponent.prototype.MesureDistance = function (data) {
        if (data && data.length > 1) {
            if (data.length == 2) {
                this.distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(data[0], data[1]);
            }
            else {
                this.distanceInMeters = 0;
                for (var i = 0; i < data.length - 1; i++) {
                    var element = [];
                    element.push(data[i]);
                    element.push(data[i + 1]);
                    var result = google.maps.geometry.spherical.computeDistanceBetween(element[0], element[1]);
                    this.distanceInMeters = this.distanceInMeters + result;
                }
            }
            this.distanceInFeet = this.distanceInMeters * 3.28084;
            this.distanceInKM = this.distanceInMeters / 1000;
            this.distanceInMiles = this.distanceInMeters / 1609.344;
        }
    };
    MeasureDistanceComponent = __decorate([
        core_1.Component({
            selector: 'app-measure-distance',
            templateUrl: './measure-distance.component.html',
            styleUrls: ['./measure-distance.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            Utility_service_1.UtilityService,
            map_service_service_1.MapServiceService,
            mesure_distance_service_1.MesureDistanceService])
    ], MeasureDistanceComponent);
    return MeasureDistanceComponent;
}());
exports.MeasureDistanceComponent = MeasureDistanceComponent;
//# sourceMappingURL=measure-distance.component.js.map