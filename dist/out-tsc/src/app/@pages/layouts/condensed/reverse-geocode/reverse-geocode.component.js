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
var map_layer_info_service_1 = require("../../../../services/map-layer-info.service");
var Utility_service_1 = require("../../../../services/Utility.service");
var environment_1 = require("../../../../../environments/environment");
var ReverseGeocodeComponent = (function () {
    function ReverseGeocodeComponent(bsModalRef, mapServiceService, mapLayerInfoService, UtilityService) {
        this.bsModalRef = bsModalRef;
        this.mapServiceService = mapServiceService;
        this.mapLayerInfoService = mapLayerInfoService;
        this.UtilityService = UtilityService;
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
        this.lat = 36.65874;
        this.lng = -96.78954;
        this.streetAddress = '';
        this.image = new google.maps.MarkerImage(this.ImageURLPath + "tools/pushpinRed.PNG", new google.maps.Size(24, 46), new google.maps.Point(0, 0), new google.maps.Point(12, 46), new google.maps.Size(24, 46));
        this.revGeocodeMarker = null;
    }
    ReverseGeocodeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
        this.Draggable();
        this.ClearMarkers();
        this.mymap = this.mapServiceService._mapdata.getValue();
        this.mymap.addListener('click', function (location) {
            var reverseGeocodeModal = document.getElementById('reverseGeocode');
            if (reverseGeocodeModal != undefined && reverseGeocodeModal != null) {
                _this.SetLocationpin(location);
            }
        });
        setTimeout(function () {
            var modalDiv = document.getElementsByClassName('reverseGeocode')[0];
            var modalElement = $(modalDiv).parents('.modal');
            $(modalElement).attr('id', 'reverseGeocode');
            _this.SetModal('reverseGeocode');
            _this.CollapseDesclaimer();
        }, 100);
    };
    ReverseGeocodeComponent.prototype.SetLocationpin = function (location) {
        this.ClearMarkers();
        var reverseGeocodeModal = document.getElementById('reverseGeocode');
        if (reverseGeocodeModal != null) {
            var position = location.latLng;
            this.revGeocodeMarker = new google.maps.Marker({
                map: this.mymap,
                icon: this.image,
                position: position,
            });
            this.revGeocodeMarker.setMap(this.mymap);
            this.lat = position.lat().toFixed(6);
            this.lng = position.lng().toFixed(6);
        }
    };
    ReverseGeocodeComponent.prototype.SearchStreetAddress = function () {
        var _this = this;
        this.ClearMarkers();
        var latlng = new google.maps.LatLng(this.lat, this.lng);
        var geocoder = geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    _this.revGeocodeMarker = new google.maps.Marker({
                        icon: _this.image,
                        position: latlng,
                        map: _this.mymap,
                    });
                    _this.mymap.setCenter(latlng);
                    _this.mymap.setZoom(17);
                    _this.streetAddress = results[0].formatted_address;
                }
            }
        });
    };
    ReverseGeocodeComponent.prototype.Draggable = function () {
        setTimeout(function () {
            $('.modal-dialog').draggable({
                handle: ".modal-header",
            });
        }, 10);
    };
    ReverseGeocodeComponent.prototype.ClearMarkers = function () {
        if (this.revGeocodeMarker != undefined && this.revGeocodeMarker != null && this.mymap) {
            this.revGeocodeMarker.setMap(null);
            this.revGeocodeMarker = null;
        }
        this.streetAddress = '';
    };
    ReverseGeocodeComponent.prototype.SetModal = function (modalname) {
        $("#" + modalname + " .modal-dialog").css({
            position: 'fixed',
            width: $("#" + modalname + " .modal-content").width(),
            height: $("#" + modalname + " .modal-content").height(), margin: '0px'
        });
        $("#" + modalname).css({
            position: 'fixed',
            width: $("#" + modalname + " .modal-dialog").width(),
            height: $("#" + modalname + " .modal-dialog").height()
        });
        $('.modal').css('background', 'rgba(0,0,0,0)');
        $("#" + modalname).css({
            left: ($(window).width() - $('#' + modalname).outerWidth()),
            top: 200
        });
        $('.modal-backdrop').hide();
    };
    ReverseGeocodeComponent.prototype.CollapseDesclaimer = function () {
        var collapseControl = $('#reverseGeocodeDesc').find('.card-collapse .pg');
        if (collapseControl != undefined && collapseControl.length > 0) {
            $(collapseControl[0]).click();
        }
    };
    ReverseGeocodeComponent.prototype.CloseGeoCode = function () {
        var _this = this;
        google.maps.event.clearListeners(this.mymap, 'click');
        this.mymap.addListener('click', function (event) {
            _this.mapLayerInfoService.onClickMarker(event);
        });
        this.ClearMarkers();
        this.bsModalRef.hide();
    };
    ReverseGeocodeComponent = __decorate([
        core_1.Component({
            selector: 'app-reverse-geocode',
            templateUrl: './reverse-geocode.component.html',
            styleUrls: ['./reverse-geocode.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            map_service_service_1.MapServiceService,
            map_layer_info_service_1.MapLayerInfoService,
            Utility_service_1.UtilityService])
    ], ReverseGeocodeComponent);
    return ReverseGeocodeComponent;
}());
exports.ReverseGeocodeComponent = ReverseGeocodeComponent;
//# sourceMappingURL=reverse-geocode.component.js.map