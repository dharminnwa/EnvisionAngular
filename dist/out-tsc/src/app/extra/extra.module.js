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
var extra_routing_1 = require("./extra.routing");
//NGX Bootstrap Components
var ngx_bootstrap_1 = require("ngx-bootstrap");
var ngx_bootstrap_2 = require("ngx-bootstrap");
//Thirdparty
var ngx_swiper_wrapper_1 = require("ngx-swiper-wrapper");
// Dependant of pg-slider
var forms_1 = require("@angular/forms");
var slider_module_1 = require("../@pages/components/slider/slider.module");
var DEFAULT_SWIPER_CONFIG = {
    direction: 'horizontal',
    slidesPerView: 'auto'
};
var ngx_bootstrap_3 = require("ngx-bootstrap");
//Demo Page
var blankpage_component_1 = require("./blankpage/blankpage.component");
var shared_module_1 = require("../@pages/components/shared.module");
//import { GalleryComponent } from './gallery/gallery.component';
//import { TimelineComponent } from './timeline/timeline.component';
//import { InvoiceComponent } from './invoice/invoice.component';
//import { GalleryService } from './gallery/gallery.service';
var ExtraModule = (function () {
    function ExtraModule() {
    }
    ExtraModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                router_1.RouterModule.forChild(extra_routing_1.ExtraRouts),
                ngx_bootstrap_1.CollapseModule.forRoot(),
                ngx_bootstrap_2.BsDropdownModule.forRoot(),
                // NgsRevealModule.forRoot(),
                ngx_swiper_wrapper_1.SwiperModule,
                forms_1.FormsModule,
                slider_module_1.pgSliderModule,
                ngx_bootstrap_3.ModalModule.forRoot()
            ],
            // providers:[GalleryService, {
            //   provide: SWIPER_CONFIG,
            //   useValue: DEFAULT_SWIPER_CONFIG
            // }],
            // InvoiceComponent, GalleryComponent, TimelineComponent
            declarations: [blankpage_component_1.BlankpageComponent]
        })
    ], ExtraModule);
    return ExtraModule;
}());
exports.ExtraModule = ExtraModule;
//# sourceMappingURL=extra.module.js.map