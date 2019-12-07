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
var ParcelBufferTool_service_1 = require("../../../../../services/ParcelBufferTool.service");
var map_service_service_1 = require("../../../../../services/map-service.service");
var all_http_request_service_1 = require("../../../../../services/all-http-request.service");
var auth_service_1 = require("../../../../../services/auth.service");
var Utility_service_1 = require("../../../../../services/Utility.service");
var condensed_component_1 = require("../../condensed.component");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var PointComponent = (function () {
    function PointComponent(bsModalRef, mapService, parcelBufferToolService, httpRequestService, authService, utilityService, injector) {
        var _this = this;
        this.bsModalRef = bsModalRef;
        this.mapService = mapService;
        this.parcelBufferToolService = parcelBufferToolService;
        this.httpRequestService = httpRequestService;
        this.authService = authService;
        this.utilityService = utilityService;
        this.injector = injector;
        this.distanceType = 'ft'; // ft = Feet, mi = Miles, m - Meters, km = Kilometers
        this.distance = 50;
        this.errMsg = '';
        this.msg = 'Click to add point';
        this.Treedatalist = [];
        setTimeout(function () { return _this.CondensedComponent = injector.get(condensed_component_1.CondensedComponent); });
    }
    PointComponent.prototype.ngOnInit = function () {
        var _this = this;
        // this.parcelBufferToolService.InitPointForParcelBuffer();
        this.mapService.SetModal('parcelBuffer');
        this.latLngChangeSub = this.parcelBufferToolService.PointLatLngs.subscribe(function (x) {
            if (x && x.lat && x.lng) {
                _this.lat = x.lat().toFixed(6);
                _this.lng = x.lng().toFixed(6);
                _this.latLng = x;
                _this.DrawCircleBasedonLatLng(x);
            }
            else {
                _this.lat = null;
                _this.lng = null;
                _this.latLng = null;
                _this.RemoveCirclefromMap();
            }
        });
    };
    PointComponent.prototype.ngOnDestroy = function () {
        this.latLngChangeSub.unsubscribe();
    };
    PointComponent.prototype.DrawCircleBasedonLatLng = function (latLng) {
        var _this = this;
        var map = this.mapService._mapdata.getValue();
        this.RemoveCirclefromMap();
        setTimeout(function () {
            var circle = new google.maps.Circle({
                strokeColor: '#FFFF00',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0,
                map: map,
                center: latLng,
                radius: _this.getRadius(),
                clickable: false
            });
            _this.activeCircle = circle;
            // circle.setMap(map);
        }, 200);
        // let center = { lat: this.latLng.lat(), lng: this.latLng.lng() };
        // var myOptions = {
        //   center: center,
        // };
        // map.setOptions(myOptions);
    };
    PointComponent.prototype.getRadius = function () {
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
    PointComponent.prototype.distanceChange = function (value) {
        if (this.activeCircle && this.activeCircle.setRadius)
            this.activeCircle.setRadius(this.getRadius());
    };
    PointComponent.prototype.distanceTypeChange = function (value) {
        if (this.activeCircle && this.activeCircle.setRadius)
            this.activeCircle.setRadius(this.getRadius());
    };
    PointComponent.prototype.RemoveCirclefromMap = function () {
        if (this.activeCircle) {
            this.activeCircle.setMap(null);
            this.activeCircle = undefined;
        }
    };
    PointComponent.prototype.searchData = function () {
        var _this = this;
        if (this.latLng && this.distance > 0) {
            var data = {
                lat: this.latLng.lat(),
                lng: this.latLng.lng(),
                distanceMeter: this.getRadius(),
                userId: this.authService.getLoggedinUserId()
            };
            this.errMsg = '';
            this.httpRequestService.GetLocationFromLatLng(data).subscribe(function (data) {
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
                                _this.parcelBufferToolService.DisableDrawingMode();
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
    PointComponent.prototype.LoadParcelStates = function (states) {
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
                    tempLayerObjPropObj.FilterValue = this.GetFilterValue();
                    tempLayerBoundriesObjPropObj.FilterValue = this.GetFilterValue();
                    var Treedatalist = this.parcelBufferToolService.SetTree(this.parcelBufferToolService.ParcelCenterPointData, tempLayerObjPropObj, tempLayerBoundriesObjPropObj, currentIndexVal);
                    if (Treedatalist && Treedatalist.length > 0) {
                        Treedatalist.forEach(function (item) {
                            _this.Treedatalist.push(item);
                        });
                    }
                    this.parcelBufferToolService.ZoomToPoint(this.latLng, this.getRadius());
                    this.parcelBufferToolService.DisableDrawingMode();
                }
            }
            if (this.Treedatalist.length > 0) {
                this.CondensedComponent.SetTemporaryTreeNodeForWidget(this.Treedatalist);
            }
        }
    };
    PointComponent.prototype.ClearData = function (isEnebleDrawTool) {
        if (isEnebleDrawTool === void 0) { isEnebleDrawTool = true; }
        this.msg = 'Click to add point';
        this.RemoveCirclefromMap();
        this.parcelBufferToolService.RemoveOldPoints(true);
        this.parcelBufferToolService.RemovelayerFromTree(this.parcelBufferToolService.ParcelCenterPointData.DataSetID, this.parcelBufferToolService.ParcelCenterPointData.DataSetBoundryID);
        this.lat = null;
        this.lng = null;
        this.latLng = undefined;
        this.distance = 50;
        this.distanceType = 'ft';
        this.parcelBufferToolService.DisableDrawingMode();
        if (isEnebleDrawTool)
            this.parcelBufferToolService.InitPointForParcelBuffer();
    };
    PointComponent.prototype.GetFilterValue = function () {
        var filterVal = '';
        filterVal += '( DWITHIN(the_geom,Point(' + (this.latLng.lng() - this.GetLngDistanceDiffrence()) + ' ' + this.latLng.lat() + '),' + this.getRadius() + ',meters) or DWITHIN(the_geom,Point(' + (this.latLng.lng() + this.GetLngDistanceDiffrence()) + ' ' + this.latLng.lat() + '),' + this.getRadius() + ',meters) or DWITHIN(the_geom,Point(' + this.latLng.lng() + ' ' + this.latLng.lat() + '),' + this.getRadius() + ',meters) )';
        filterVal += 'and ( DWITHIN(the_geom,Point(' + (this.latLng.lng() - this.GetLngDistanceDiffrence()) + ' ' + (this.latLng.lat() - this.GetDistanceDiffrence()) + '),' + this.getRadius() + ',meters) or DWITHIN(the_geom,Point(' + (this.latLng.lng() + this.GetLngDistanceDiffrence()) + ' ' + (this.latLng.lat() - this.GetDistanceDiffrence()) + '),' + this.getRadius() + ',meters) or DWITHIN(the_geom,Point(' + this.latLng.lng() + ' ' + (this.latLng.lat() - this.GetDistanceDiffrence()) + '),' + this.getRadius() + ',meters) )';
        filterVal += 'and ( DWITHIN(the_geom,Point(' + (this.latLng.lng() - this.GetLngDistanceDiffrence()) + ' ' + (this.latLng.lat() + this.GetDistanceDiffrence()) + '),' + this.getRadius() + ',meters) or DWITHIN(the_geom,Point(' + (this.latLng.lng() + this.GetLngDistanceDiffrence()) + ' ' + (this.latLng.lat() + this.GetDistanceDiffrence()) + '),' + this.getRadius() + ',meters) or DWITHIN(the_geom,Point(' + this.latLng.lng() + ' ' + (this.latLng.lat() + this.GetDistanceDiffrence()) + '),' + this.getRadius() + ',meters) )';
        return filterVal;
    };
    PointComponent.prototype.GetDistanceDiffrence = function () {
        var degree = this.getRadiusWithDegree();
        // this.GetSNBasedOnLat(this.latLng.lat());
        var medianVal = (0.000002 * this.getRadius()) - (0.000001 * this.getRadius());
        var val = (medianVal * degree) / 33;
        return val;
        // return (0.000002 * this.getRadius()) - (0.000001 * this.getRadius());
    };
    PointComponent.prototype.GetLngDistanceDiffrence = function () {
        var degree = this.getRadiusWithDegree();
        var MedianVal = (0.000002 * this.getRadius()) / 2;
        var val = (MedianVal * degree) / 33;
        return val;
        // return (0.000002 * this.getRadius()) / 2;
    };
    PointComponent.prototype.getRadiusWithDegree = function () {
        var degree = this.getDD2DMS(this.latLng.lat());
        var degreeMts = Math.cos(degree) * 111325;
        var val = Math.abs(degreeMts) / 1000000;
        if (!degree || degree == NaN)
            return 1;
        return degree;
    };
    PointComponent.prototype.getDD2DMS = function (dms) {
        var sign = 1, Abs = 0;
        var days, minutes, secounds, direction;
        if (dms < 0) {
            sign = -1;
        }
        Abs = Math.abs(Math.round(dms * 1000000.));
        //Math.round is used to eliminate the small error caused by rounding in the computer:
        //e.g. 0.2 is not the same as 0.20000000000284
        //Error checks
        if (Abs > (90 * 1000000)) {
            //alert(" Degrees Latitude must be in the range of -90. to 90. ");
            return false;
        }
        days = Math.floor(Abs / 1000000);
        minutes = Math.floor(((Abs / 1000000) - days) * 60);
        secounds = (Math.floor(((((Abs / 1000000) - days) * 60) - minutes) * 100000) * 60 / 100000).toFixed();
        days = days * sign;
        direction = days < 0 ? 'S' : 'N';
        //else return value     
        return (days * sign);
        // return (days * sign) + 'º ' + minutes + "' " + secounds + "'' " + direction;
    };
    PointComponent = __decorate([
        core_1.Component({
            selector: 'app-point',
            templateUrl: './point.component.html',
            styleUrls: ['./point.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            map_service_service_1.MapServiceService,
            ParcelBufferTool_service_1.ParcelBufferToolService,
            all_http_request_service_1.HttpRequestService,
            auth_service_1.AuthenticationService,
            Utility_service_1.UtilityService,
            core_1.Injector])
    ], PointComponent);
    return PointComponent;
}());
exports.PointComponent = PointComponent;
//# sourceMappingURL=point.component.js.map