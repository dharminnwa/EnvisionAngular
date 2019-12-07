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
var Utility_service_1 = require("../../../../../services/Utility.service");
var auth_service_1 = require("../../../../../services/auth.service");
var all_http_request_service_1 = require("../../../../../services/all-http-request.service");
var ParcelBufferTool_service_1 = require("../../../../../services/ParcelBufferTool.service");
var map_service_service_1 = require("../../../../../services/map-service.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var condensed_component_1 = require("../../condensed.component");
var LineComponent = (function () {
    function LineComponent(bsModalRef, mapService, parcelBufferToolService, httpRequestService, authService, utilityService, injector) {
        var _this = this;
        this.bsModalRef = bsModalRef;
        this.mapService = mapService;
        this.parcelBufferToolService = parcelBufferToolService;
        this.httpRequestService = httpRequestService;
        this.authService = authService;
        this.utilityService = utilityService;
        this.injector = injector;
        this.displayLatLng = '';
        this.msg = 'Click to add point, Double-click to finish';
        this.errMsg = '';
        this.distanceType = 'ft'; // ft = Feet, mi = Miles, m - Meters, km = Kilometers
        this.distance = 50;
        this.Treedatalist = [];
        setTimeout(function () { return _this.CondensedComponent = injector.get(condensed_component_1.CondensedComponent); });
    }
    LineComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.mapService.SetModal('parcelBuffer');
        this.latLngChangeSub = this.parcelBufferToolService.LineLatLngs.subscribe(function (x) {
            if (x) {
                _this.latLng = x;
                // this.DrawCircleBasedonLatLng(x);
                _this.setLatLngs();
            }
            else {
                _this.latLng = null;
                _this.displayLatLng = '';
                // this.RemoveCirclefromMap();
            }
        });
    };
    LineComponent.prototype.ngOnDestroy = function () {
        this.latLngChangeSub.unsubscribe();
    };
    LineComponent.prototype.setLatLngs = function () {
        if (this.latLng && this.latLng.length > 0) {
            for (var i = 0; i < this.latLng.length; i++) {
                var latLng = this.latLng[i];
                this.displayLatLng = this.displayLatLng + (i + 1);
                this.displayLatLng += ':';
                this.displayLatLng += ' ' + latLng.lat().toFixed(6);
                this.displayLatLng += ', ' + latLng.lng().toFixed(6);
                this.displayLatLng += '\n';
            }
        }
    };
    LineComponent.prototype.searchData = function () {
        var _this = this;
        if (this.latLng && this.latLng.length > 0 && this.distance > 0) {
            var points_1 = [];
            this.latLng.forEach(function (latLng) {
                if (latLng && latLng.lat && latLng.lng) {
                    var item = {
                        lat: latLng.lat(),
                        lng: latLng.lng()
                    };
                    points_1.push(item);
                }
            });
            var data = {
                points: points_1,
                distanceMeter: this.getRadius(),
                userId: this.authService.getLoggedinUserId()
            };
            this.errMsg = '';
            this.httpRequestService.GetLocationFromLineString(data).subscribe(function (data) {
                if (data._Issuccess == true) {
                    if (data && data.States && data.States.length > 0) {
                        var states = data.States;
                        var userData = _this.authService.GetUserData();
                        if (userData && userData.LayerCategoriesRoles) {
                            var accessStates_1 = userData.LayerCategoriesRoles;
                            var isAccess_1 = undefined;
                            states.forEach(function (state) {
                                var stateName = state.state_name;
                                var access = accessStates_1.find(function (x) { return x == stateName; });
                                if (access)
                                    isAccess_1 = true;
                                else
                                    isAccess_1 = false;
                            });
                            if (isAccess_1 == true) {
                                _this.LoadParcelStates(states);
                                _this.msg = 'Click Clear button and Begin a new Search';
                            }
                            else {
                                _this.errMsg = 'Your Company does not have access to parcel data in this area: ' + states[0].state_name + ' Click Clear button to begin a new search.';
                                _this.parcelBufferToolService.DisableDrawingModeLine();
                            }
                        }
                    }
                    else {
                        _this.errMsg = 'No Parcel Data Found please click Clear button and Begin a new Search';
                    }
                }
            });
        }
    };
    LineComponent.prototype.LoadParcelStates = function (states) {
        var _this = this;
        if (states && states.length && states.length > 0) {
            this.Treedatalist = [];
            var currentIndexVal = this.mapService.LayerIndex.getValue().value + 1;
            for (var i = 0; i < states.length; i++) {
                var state = states[i];
                if (state.fips) {
                    var tableNameParcel = 'Parcels_' + state.fips; // Boundries
                    var tableNameParcelPoints = 'ParcelPoints_' + state.fips; // Points
                    var tempLayerObjPropObj = this.parcelBufferToolService.GetParcelTempLayerObject(tableNameParcelPoints, state, i);
                    var tempLayerBoundriesObjPropObj = this.parcelBufferToolService.GetParcelTempLayerBoundriesObject(tableNameParcel, state, i);
                    tempLayerObjPropObj.FilterValue = this.GetFilterValue("Point");
                    tempLayerBoundriesObjPropObj.FilterValue = this.GetFilterValue("Line");
                    var Treedatalist = this.parcelBufferToolService.SetTree(this.parcelBufferToolService.ParcelCenterPointData, tempLayerObjPropObj, tempLayerBoundriesObjPropObj, currentIndexVal);
                    if (Treedatalist && Treedatalist.length > 0) {
                        Treedatalist.forEach(function (item) {
                            _this.Treedatalist.push(item);
                        });
                    }
                    this.parcelBufferToolService.ZoomToPoint(this.latLng[this.latLng.length - 1]);
                    this.parcelBufferToolService.DisableDrawingModeLine();
                }
            }
            if (this.Treedatalist.length > 0) {
                this.CondensedComponent.SetTemporaryTreeNodeForWidget(this.Treedatalist);
            }
        }
    };
    LineComponent.prototype.GetFilterValue = function (layerType) {
        var filterVal = '';
        filterVal += 'DWITHIN(the_geom,LINESTRING(';
        for (var i = 0; i < this.latLng.length; i++) {
            var latLng = this.latLng[i];
            filterVal += latLng.lng() + " " + latLng.lat();
            if (this.latLng.length - 1 != i) {
                filterVal += ', ';
            }
        }
        var radius = this.getRadius();
        console.log(radius);
        if (radius < 300) {
            if (layerType == "Point")
                filterVal += '), 350 ,meters)';
            else
                filterVal += '),' + radius + ',meters)';
        }
        else {
            filterVal += '),' + radius + ',meters)';
        }
        return filterVal;
    };
    LineComponent.prototype.ClearData = function (isEnebleDrawTool) {
        if (isEnebleDrawTool === void 0) { isEnebleDrawTool = true; }
        this.msg = 'Click to add point, Double Click to finish';
        this.parcelBufferToolService.RemoveOldLine(true);
        this.parcelBufferToolService.RemovelayerFromTree(this.parcelBufferToolService.ParcelCenterPointData.DataSetID, this.parcelBufferToolService.ParcelCenterPointData.DataSetBoundryID);
        this.distance = 50;
        this.distanceType = 'ft';
        this.displayLatLng = '';
        this.latLng = undefined;
        this.parcelBufferToolService.DisableDrawingModeLine();
        if (isEnebleDrawTool)
            this.parcelBufferToolService.InitLineForParcelBuffer();
    };
    LineComponent.prototype.getRadius = function () {
        var radius = 0;
        if (this.distanceType == 'ft') {
            radius = this.distance * 0.3048;
        }
        else if (this.distanceType == 'mi') {
            radius = this.distance * 1609.34;
        }
        else if (this.distanceType == 'm') {
            radius = this.distance;
        }
        else if (this.distanceType == 'km') {
            radius = this.distance * 1000;
        }
        return radius;
    };
    LineComponent = __decorate([
        core_1.Component({
            selector: 'app-line',
            templateUrl: './line.component.html',
            styleUrls: ['./line.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            map_service_service_1.MapServiceService,
            ParcelBufferTool_service_1.ParcelBufferToolService,
            all_http_request_service_1.HttpRequestService,
            auth_service_1.AuthenticationService,
            Utility_service_1.UtilityService,
            core_1.Injector])
    ], LineComponent);
    return LineComponent;
}());
exports.LineComponent = LineComponent;
//# sourceMappingURL=line.component.js.map