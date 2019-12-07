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
var base_map_service_1 = require("../../../../services/base-map.service");
var map_service_service_1 = require("../../../../services/map-service.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var Utility_service_1 = require("../../../../services/Utility.service");
var all_http_request_service_1 = require("../../../../services/all-http-request.service");
var auth_service_1 = require("../../../../services/auth.service");
var environment_1 = require("../../../../../environments/environment");
var BasemapComponent = (function () {
    function BasemapComponent(BaseMapService, MapServiceService, bsModalRef, utilityService, httpRequestService, authenticationService) {
        this.BaseMapService = BaseMapService;
        this.MapServiceService = MapServiceService;
        this.bsModalRef = bsModalRef;
        this.utilityService = utilityService;
        this.httpRequestService = httpRequestService;
        this.authenticationService = authenticationService;
        this.hideSomePart = true;
        this.baseMapList = [];
        this.activeClass = 'active';
        this.ShowLoader = false;
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
    }
    BasemapComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.utilityService.CloseModalOnRouteChange(this.bsModalRef);
        setTimeout(function () {
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
        }, 100);
        var List = this.MapServiceService.BaseMapData.getValue();
        if (List == null) {
            this.ShowLoader = true;
            var UserId = this.authenticationService.getLoggedinUserId();
            this.httpRequestService._NodeGetBaseMapTypes(UserId).subscribe(function (data) {
                if (data._Issuccess) {
                    _this.baseMapList = data.BaseMapData;
                    _this.SetDefualtMapBasedonMapsetting(data);
                    _this.MapServiceService.setBaseMap(data);
                }
                _this.ShowLoader = false;
            }, function (error) {
                console.log(error);
                _this.ShowLoader = false;
            });
        }
        else {
            this.baseMapList = List.BaseMapData;
            this.SetDefualtMapBasedonMapsetting(List);
        }
    };
    BasemapComponent.prototype.SetDefualtMapBasedonMapsetting = function (data) {
        if (data.MapSettingData && data.MapSettingData.length > 0) {
            var activeBasemap = this.baseMapList.filter(function (m) { return m.IsDefault == true; })[0];
            // if (activeBasemap != null && activeBasemap != undefined) {
            //   activeBasemap.IsDefault = false;
            // }
            activeBasemap = this.baseMapList.filter(function (m) { return m.BaseMapProviderID == activeBasemap.BaseMapProviderID; })[0];
            activeBasemap.IsDefault = true;
        }
    };
    BasemapComponent.prototype.ChangeBaseMap = function (baseMapID) {
        var UserId = this.authenticationService.getLoggedinUserId();
        var activeBasemap = this.baseMapList.filter(function (m) { return m.IsDefault == true; })[0];
        if (baseMapID > 0) {
            if (activeBasemap != null && activeBasemap != undefined) {
                activeBasemap.IsDefault = false;
            }
            activeBasemap = this.baseMapList.filter(function (m) { return m.BaseMapProviderID == baseMapID; })[0];
            activeBasemap.IsDefault = true;
            this.httpRequestService._NodeInsertBaseMapLogs(this.baseMapList, activeBasemap, UserId).subscribe(function (data) { });
            if (this.hideSomePart)
                this.BaseMapService.setBasemap(activeBasemap);
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], BasemapComponent.prototype, "hideSomePart", void 0);
    BasemapComponent = __decorate([
        core_1.Component({
            selector: 'app-basemap',
            templateUrl: './basemap.component.html',
            styleUrls: ['./basemap.component.scss'],
        }),
        __metadata("design:paramtypes", [base_map_service_1.BaseMapService,
            map_service_service_1.MapServiceService,
            ngx_bootstrap_1.BsModalRef,
            Utility_service_1.UtilityService,
            all_http_request_service_1.HttpRequestService,
            auth_service_1.AuthenticationService])
    ], BasemapComponent);
    return BasemapComponent;
}());
exports.BasemapComponent = BasemapComponent;
//# sourceMappingURL=basemap.component.js.map