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
var Utility_service_1 = require("../../../../services/Utility.service");
var CartographicToolComponent = (function () {
    function CartographicToolComponent(bsModalRef, MapServiceService, UtilityService) {
        this.bsModalRef = bsModalRef;
        this.MapServiceService = MapServiceService;
        this.UtilityService = UtilityService;
        this.ScaleUnit = 'Km';
    }
    CartographicToolComponent.prototype.ngOnInit = function () {
        this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
        var map = this.MapServiceService._mapdata.getValue();
        var scale = $(".gm-style-cc:not(.gmnoprint):contains(' mi')");
        if (scale.length == 0) {
            scale = $(".gm-style-cc:not(.gmnoprint):contains(' ft')");
            if (scale.length == 0) {
                this.ScaleUnit = 'Km';
            }
            else {
                this.ScaleUnit = 'Mi';
            }
        }
        else {
            this.ScaleUnit = 'Mi';
        }
        this.setScaleIndicatorVal();
        this.setLatLngVal();
    };
    CartographicToolComponent.prototype.CheckedLatLong = function (event) {
        var latlongDiv = document.getElementById("getlatlng");
        if (event.target.checked) {
            latlongDiv.classList.remove('hide');
        }
        else {
            latlongDiv.classList.add('hide');
        }
    };
    CartographicToolComponent.prototype.setLatLngVal = function () {
        var checkbox = $('#chkLatLong');
        var latlongDiv = document.getElementById("getlatlng");
        var contains = latlongDiv.classList.contains('hide');
        if (contains)
            checkbox.prop('checked', false);
    };
    CartographicToolComponent.prototype.setScaleIndicatorVal = function () {
        var checkbox = $('#chkScale');
        var ccs = $('.gm-style .gm-style-cc');
        var contains = ccs[0].classList.contains('opaciti');
        if (contains)
            checkbox.prop('checked', false);
    };
    CartographicToolComponent.prototype.CheckedScale = function (event) {
        var ccs = $('.gm-style .gm-style-cc');
        if (event.target.checked) {
            if (ccs != undefined && ccs.length > 0) {
                for (var i = 0; i < ccs.length; i++) {
                    ccs[i].classList.remove('opaciti');
                }
            }
        }
        else {
            if (ccs != undefined && ccs.length > 0) {
                for (var i = 0; i < ccs.length; i++) {
                    ccs[i].classList.add('opaciti');
                }
            }
        }
    };
    CartographicToolComponent.prototype.switvhUnit = function () {
        var ccs = $('.gm-style .gm-style-cc');
        if (ccs != undefined && ccs.length > 0) {
            for (var i = 0; i < ccs.length; i++) {
                ccs[i].click();
            }
        }
    };
    CartographicToolComponent = __decorate([
        core_1.Component({
            selector: 'app-cartographic-tool',
            templateUrl: './cartographic-tool.component.html',
            styleUrls: ['./cartographic-tool.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef, map_service_service_1.MapServiceService, Utility_service_1.UtilityService])
    ], CartographicToolComponent);
    return CartographicToolComponent;
}());
exports.CartographicToolComponent = CartographicToolComponent;
//# sourceMappingURL=cartographic-tool.component.js.map