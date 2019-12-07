import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { intelligenceRoutes } from './intelligence-routing.module';
import { IntelligenceComponent } from './intelligence.component';
import { CompanyIntelligenceComponent } from './company-intelligence/company-intelligence.component';
import { CompanyPorfileDetailModalComponent } from './company-profile-detail-modal/company-profile-detail-modal.component';
import { pgTabsModule } from '../@pages/components/tabs/tabs.module';
import { GeneratingUnitsComponent } from './generating-units/generating-units.component';
import { OperatingUtilitydetailModalComponent } from './operating-utilitydetail-modal/operating-utilitydetail-modal.component';
import { PipelineActivityProjectModalComponent } from './pipeline-activity-project-modal/pipeline-activity-project-modal.component';
import { PipelineActivityProjectsComponent } from './pipeline-activity-projects/pipeline-activity-projects.component';
import { PowerPlantdetailModalComponent } from './power-plantdetail-modal/power-plantdetail-modal.component';
import { PowerPlantsComponent } from './power-plants/power-plants.component';
import { TransmissionProjectDetailModalComponent } from './transmission-project-detail-modal/transmission-project-detail-modal.component';
import { TransmissionProjectsComponent } from './transmission-projects/transmission-projects.component';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from "ag-grid-angular";
import 'ag-grid-enterprise';
import { RouterModule } from '@angular/router';
import { TypeaheadModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    pgTabsModule,
    ListboxModule,
    FormsModule,
    // SharedModule,
    TypeaheadModule,
    AgGridModule.withComponents([]),
    RouterModule.forChild(intelligenceRoutes),
  ],
  declarations: [ 
    IntelligenceComponent,
    CompanyIntelligenceComponent,
    CompanyPorfileDetailModalComponent,
    GeneratingUnitsComponent,
    OperatingUtilitydetailModalComponent,
    PipelineActivityProjectModalComponent,
    PipelineActivityProjectsComponent,
    PowerPlantdetailModalComponent,
    PowerPlantsComponent,
    TransmissionProjectDetailModalComponent,
    TransmissionProjectsComponent
  ],
  exports: [
    CompanyPorfileDetailModalComponent,
    OperatingUtilitydetailModalComponent,
    PipelineActivityProjectModalComponent,
    PowerPlantdetailModalComponent,
    TransmissionProjectDetailModalComponent,
    IntelligenceComponent,
    CompanyIntelligenceComponent
  ]
})
export class IntelligenceModule { }
