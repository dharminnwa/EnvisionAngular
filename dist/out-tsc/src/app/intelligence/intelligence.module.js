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
var intelligence_routing_module_1 = require("./intelligence-routing.module");
var intelligence_component_1 = require("./intelligence.component");
var company_intelligence_component_1 = require("./company-intelligence/company-intelligence.component");
var company_profile_detail_modal_component_1 = require("./company-profile-detail-modal/company-profile-detail-modal.component");
var tabs_module_1 = require("../@pages/components/tabs/tabs.module");
var generating_units_component_1 = require("./generating-units/generating-units.component");
var operating_utilitydetail_modal_component_1 = require("./operating-utilitydetail-modal/operating-utilitydetail-modal.component");
var pipeline_activity_project_modal_component_1 = require("./pipeline-activity-project-modal/pipeline-activity-project-modal.component");
var pipeline_activity_projects_component_1 = require("./pipeline-activity-projects/pipeline-activity-projects.component");
var power_plantdetail_modal_component_1 = require("./power-plantdetail-modal/power-plantdetail-modal.component");
var power_plants_component_1 = require("./power-plants/power-plants.component");
var transmission_project_detail_modal_component_1 = require("./transmission-project-detail-modal/transmission-project-detail-modal.component");
var transmission_projects_component_1 = require("./transmission-projects/transmission-projects.component");
var listbox_1 = require("primeng/listbox");
var forms_1 = require("@angular/forms");
var ag_grid_angular_1 = require("ag-grid-angular");
require("ag-grid-enterprise");
var router_1 = require("@angular/router");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var IntelligenceModule = (function () {
    function IntelligenceModule() {
    }
    IntelligenceModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                tabs_module_1.pgTabsModule,
                listbox_1.ListboxModule,
                forms_1.FormsModule,
                // SharedModule,
                ngx_bootstrap_1.TypeaheadModule,
                ag_grid_angular_1.AgGridModule.withComponents([]),
                router_1.RouterModule.forChild(intelligence_routing_module_1.intelligenceRoutes),
            ],
            declarations: [
                intelligence_component_1.IntelligenceComponent,
                company_intelligence_component_1.CompanyIntelligenceComponent,
                company_profile_detail_modal_component_1.CompanyPorfileDetailModalComponent,
                generating_units_component_1.GeneratingUnitsComponent,
                operating_utilitydetail_modal_component_1.OperatingUtilitydetailModalComponent,
                pipeline_activity_project_modal_component_1.PipelineActivityProjectModalComponent,
                pipeline_activity_projects_component_1.PipelineActivityProjectsComponent,
                power_plantdetail_modal_component_1.PowerPlantdetailModalComponent,
                power_plants_component_1.PowerPlantsComponent,
                transmission_project_detail_modal_component_1.TransmissionProjectDetailModalComponent,
                transmission_projects_component_1.TransmissionProjectsComponent
            ],
            exports: [
                company_profile_detail_modal_component_1.CompanyPorfileDetailModalComponent,
                operating_utilitydetail_modal_component_1.OperatingUtilitydetailModalComponent,
                pipeline_activity_project_modal_component_1.PipelineActivityProjectModalComponent,
                power_plantdetail_modal_component_1.PowerPlantdetailModalComponent,
                transmission_project_detail_modal_component_1.TransmissionProjectDetailModalComponent,
                intelligence_component_1.IntelligenceComponent,
                company_intelligence_component_1.CompanyIntelligenceComponent
            ]
        })
    ], IntelligenceModule);
    return IntelligenceModule;
}());
exports.IntelligenceModule = IntelligenceModule;
//# sourceMappingURL=intelligence.module.js.map