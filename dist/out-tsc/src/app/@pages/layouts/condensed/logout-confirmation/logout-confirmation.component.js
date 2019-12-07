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
var auth_service_1 = require("../../../../services/auth.service");
var condensed_component_1 = require("../condensed.component");
var map_service_service_1 = require("../../../../services/map-service.service");
var LogoutConfirmationComponent = (function () {
    function LogoutConfirmationComponent(bsModalRef, AuthServices, MapServiceService, injector) {
        var _this = this;
        this.bsModalRef = bsModalRef;
        this.AuthServices = AuthServices;
        this.MapServiceService = MapServiceService;
        this.injector = injector;
        setTimeout(function () { return _this.CondensedComponent = injector.get(condensed_component_1.CondensedComponent); });
    }
    LogoutConfirmationComponent.prototype.ngOnInit = function () {
    };
    LogoutConfirmationComponent.prototype.CloseModal = function () {
        this.bsModalRef.hide();
    };
    LogoutConfirmationComponent.prototype.Ignore = function () {
        this.AuthServices.LogoutUserProfile();
    };
    LogoutConfirmationComponent.prototype.Save = function () {
        this.CondensedComponent.SaveMap();
    };
    LogoutConfirmationComponent = __decorate([
        core_1.Component({
            selector: 'app-logout-confirmation',
            templateUrl: './logout-confirmation.component.html',
            styleUrls: ['./logout-confirmation.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            auth_service_1.AuthenticationService,
            map_service_service_1.MapServiceService,
            core_1.Injector])
    ], LogoutConfirmationComponent);
    return LogoutConfirmationComponent;
}());
exports.LogoutConfirmationComponent = LogoutConfirmationComponent;
//# sourceMappingURL=logout-confirmation.component.js.map