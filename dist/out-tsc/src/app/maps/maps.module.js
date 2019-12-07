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
//Core Pages Layout Components
var shared_module_1 = require("../@pages/components/shared.module");
var google_component_1 = require("./google/google.component");
var core_2 = require("@agm/core");
var ag_grid_angular_1 = require("ag-grid-angular");
require("ag-grid-enterprise");
var slider_module_1 = require("../@pages/components/slider/slider.module");
var forms_1 = require("@angular/forms");
var environment_prod_1 = require("../../environments/environment.prod");
var ag_grid_enterprise_1 = require("ag-grid-enterprise");
var maps_tab_data_component_1 = require("./maps-tab-data/maps-tab-data.component");
var custom_filter_component_1 = require("./maps-tab-data/custom-filter/custom-filter.component");
var filter_by_name_pipe_1 = require("../pipes/filter-by-name.pipe");
var ngx_infinite_scroll_1 = require("ngx-infinite-scroll");
ag_grid_enterprise_1.LicenseManager.setLicenseKey(environment_prod_1.environment.aggridLicenseKey);
var MapsModule = (function () {
    function MapsModule() {
    }
    MapsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                // RouterModule.forChild(MapsRoutes),
                shared_module_1.SharedModule,
                slider_module_1.pgSliderModule,
                forms_1.FormsModule,
                ag_grid_angular_1.AgGridModule.withComponents([]),
                core_2.AgmCoreModule.forRoot({
                    apiKey: environment_prod_1.environment.GooglemapAPIKey
                }),
                ngx_infinite_scroll_1.InfiniteScrollModule
            ],
            entryComponents: [custom_filter_component_1.CustomFilterComponent],
            declarations: [google_component_1.GoogleMapPage, maps_tab_data_component_1.MapsTabDataComponent, custom_filter_component_1.CustomFilterComponent, filter_by_name_pipe_1.FilterByNamePipe],
            exports: [google_component_1.GoogleMapPage, filter_by_name_pipe_1.FilterByNamePipe],
            providers: [core_2.GoogleMapsAPIWrapper, core_2.InfoWindowManager, core_2.MarkerManager, core_2.PolygonManager, core_2.PolylineManager, core_2.KmlLayerManager, core_2.DataLayerManager]
        })
    ], MapsModule);
    return MapsModule;
}());
exports.MapsModule = MapsModule;
//# sourceMappingURL=maps.module.js.map