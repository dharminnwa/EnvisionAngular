"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var session_routing_1 = require("./session.routing");
var shared_module_1 = require("../@pages/components/shared.module");
var error_component_1 = require("./error/error.component");
var login_component_1 = require("./login/login.component");
var lockscreen_component_1 = require("./lockscreen/lockscreen.component");
// import { RegisterPageComponent } from './register/register.component';
var SessionModule = (function () {
    function SessionModule() {
    }
    SessionModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule, forms_1.ReactiveFormsModule,
                shared_module_1.SharedModule,
                router_1.RouterModule.forChild(session_routing_1.SessionRoute),
            ],
            declarations: [error_component_1.ErrorComponent, login_component_1.LoginComponent, lockscreen_component_1.LockscreenComponent]
        })
    ], SessionModule);
    return SessionModule;
}());
exports.SessionModule = SessionModule;
//# sourceMappingURL=session.module.js.map