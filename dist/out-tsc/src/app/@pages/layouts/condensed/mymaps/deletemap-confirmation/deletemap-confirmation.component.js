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
var all_http_request_service_1 = require("../../../../../services/all-http-request.service");
var my_map_service_1 = require("../../../../../services/my-map.service");
var map_service_service_1 = require("../../../../../services/map-service.service");
var condensed_component_1 = require("../../condensed.component");
var DeleteMapConfirmationComponent = (function () {
    function DeleteMapConfirmationComponent(bsModalRef, bsModalService, httpRequestService, myMapService, mapServiceService, Injector) {
        this.bsModalRef = bsModalRef;
        this.bsModalService = bsModalService;
        this.httpRequestService = httpRequestService;
        this.myMapService = myMapService;
        this.mapServiceService = mapServiceService;
        this.Injector = Injector;
        this.condensedComponent = Injector.get(condensed_component_1.CondensedComponent);
    }
    DeleteMapConfirmationComponent.prototype.ngOnInit = function () {
    };
    DeleteMapConfirmationComponent.prototype.DeleteMyMap = function () {
        var _this = this;
        this.httpRequestService._NodeDeleteMyMap(this.MapId).subscribe(function (data) {
            if (data._Issuccess && data.CustomMapData.length == 1) {
                _this.bsModalRef.hide();
                _this.myMapService.DeleteMapInUserMapList(data.CustomMapData[0]);
                if (_this.myMapService.isCustomMapLoaded == true) {
                    if (_this.myMapService.loadedMapData.CustomMaps[0].CustomMapId == _this.MapId) {
                        _this.condensedComponent.BlankMap();
                        _this.myMapService.isCustomMapLoaded = false;
                        _this.myMapService.loadedMapData = null;
                    }
                }
            }
        }, function (error) {
        });
    };
    DeleteMapConfirmationComponent = __decorate([
        core_1.Component({
            selector: 'app-deletemap-confirmation',
            templateUrl: './deletemap-confirmation.component.html',
            styleUrls: ['./deletemap-confirmation.component.scss'],
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            ngx_bootstrap_1.BsModalService,
            all_http_request_service_1.HttpRequestService,
            my_map_service_1.MyMapService,
            map_service_service_1.MapServiceService,
            core_1.Injector])
    ], DeleteMapConfirmationComponent);
    return DeleteMapConfirmationComponent;
}());
exports.DeleteMapConfirmationComponent = DeleteMapConfirmationComponent;
//# sourceMappingURL=deletemap-confirmation.component.js.map