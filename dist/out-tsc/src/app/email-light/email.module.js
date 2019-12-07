"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
//Demo Used for Simply white Layout only
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
var http_2 = require("@angular/common/http");
var forms_1 = require("@angular/forms");
var email_routing_1 = require("./email.routing");
//Core Pages Layout Components
var shared_module_1 = require("../@pages/components/shared.module");
var ngx_quill_1 = require("ngx-quill");
var tag_module_1 = require("../@pages/components/tag/tag.module");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var list_component_1 = require("./list/list.component");
var compose_component_1 = require("./compose/compose.component");
var email_service_1 = require("./email.service");
var EmailLightModule = (function () {
    function EmailLightModule() {
    }
    EmailLightModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                http_1.HttpModule,
                http_2.HttpClientModule,
                shared_module_1.SharedModule,
                ngx_quill_1.QuillModule,
                tag_module_1.pgTagModule,
                forms_1.FormsModule, forms_1.ReactiveFormsModule,
                router_1.RouterModule.forChild(email_routing_1.emailRoute),
                ngx_bootstrap_1.BsDropdownModule.forRoot(),
            ],
            declarations: [list_component_1.EmailListComponentLight, compose_component_1.ComposeComponentLight],
            providers: [email_service_1.EmailServiceLight]
        })
    ], EmailLightModule);
    return EmailLightModule;
}());
exports.EmailLightModule = EmailLightModule;
//# sourceMappingURL=email.module.js.map