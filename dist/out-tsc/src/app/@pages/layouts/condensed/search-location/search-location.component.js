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
var map_service_service_1 = require("../../../../services/map-service.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var Utility_service_1 = require("../../../../services/Utility.service");
var SearchLocationComponent = (function () {
    function SearchLocationComponent(MapServiceService, bsModalRef, UtilityService) {
        this.MapServiceService = MapServiceService;
        this.bsModalRef = bsModalRef;
        this.UtilityService = UtilityService;
        this.allMarkers = [];
    }
    SearchLocationComponent.prototype.ngOnInit = function () {
        this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
        setTimeout(function () {
            $('.pac-container').css('z-index', 9999);
        }, 500);
        this.map = this.MapServiceService._mapdata.getValue();
        this.Draggable();
        this.searchLocation();
    };
    SearchLocationComponent.prototype.searchLocation = function () {
        var _this = this;
        // var options = {
        //   types: ['(cities)'],
        //   componentRestrictions: { country: "us" }
        // };
        var input = document.getElementById('txtlocation');
        var searchBox = new google.maps.places.SearchBox(input);
        this.searchlocmarker = new google.maps.Marker({
            map: this.map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8.5,
                fillColor: "#F00",
                fillOpacity: 0.6,
                strokeWeight: 1
            },
        });
        google.maps.event.addListener(searchBox, 'places_changed', function () {
            searchBox.set(_this.map, null);
            var places = searchBox.getPlaces();
            var bounds = new google.maps.LatLngBounds();
            var i;
            var place;
            if (places.length > 0) {
                for (i = 0; i <= places.length; i++) {
                    place = places[i];
                    if (place != undefined && place.name != undefined) {
                        _this.searchlocmarker.setVisible(false);
                        if (place.geometry.viewport) {
                            _this.map.fitBounds(place.geometry.viewport);
                        }
                        else {
                            _this.map.setCenter(place.geometry.location);
                            _this.map.setZoom(15);
                        }
                        _this.searchlocmarker.setPosition(place.geometry.location);
                        _this.searchlocmarker.setVisible(true);
                        _this.searchlocmarker.bindTo(_this.map, searchBox, _this.map);
                        _this.allMarkers.push(_this.searchlocmarker);
                        // google.maps.event.addListener(this.searchlocmarker, 'map_changed', function () {
                        //   if (!this.getMap()) {
                        //     this.unbindAll();
                        //   }
                        // });
                        bounds.extend(place.geometry.location);
                        $("#txtlocation").val(place.formatted_address);
                    }
                }
            }
        });
    };
    SearchLocationComponent.prototype.Draggable = function () {
        setTimeout(function () {
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
        }, 10);
    };
    SearchLocationComponent.prototype.CloseModal = function () {
        this.RemoveAllMarkers();
        this.bsModalRef.hide();
    };
    SearchLocationComponent.prototype.RemoveAllMarkers = function () {
        for (var i = 0; i < this.allMarkers.length; i++) {
            this.allMarkers[i].setMap(null);
        }
        this.allMarkers = [];
    };
    SearchLocationComponent = __decorate([
        core_1.Component({
            selector: 'app-search-location',
            templateUrl: './search-location.component.html',
            styleUrls: ['./search-location.component.scss'],
        }),
        __metadata("design:paramtypes", [map_service_service_1.MapServiceService,
            ngx_bootstrap_1.BsModalRef,
            Utility_service_1.UtilityService])
    ], SearchLocationComponent);
    return SearchLocationComponent;
}());
exports.SearchLocationComponent = SearchLocationComponent;
//# sourceMappingURL=search-location.component.js.map