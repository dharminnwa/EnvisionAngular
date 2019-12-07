import { NgModule, Component, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//Core Pages Layout Components
import { SharedModule } from '../@pages/components/shared.module';
import { GoogleMapPage } from './google/google.component';
import { MapsRoutes } from './maps.routing';
import { AgmCoreModule, GoogleMapsAPIWrapper, InfoWindowManager, MarkerManager, PolygonManager, PolylineManager, KmlLayerManager, DataLayerManager } from '@agm/core';
import { AgGridModule } from "ag-grid-angular";
import 'ag-grid-enterprise';
import { pgSliderModule } from '../@pages/components/slider/slider.module';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment.prod';
import { LicenseManager } from "ag-grid-enterprise";
import { MapsTabDataComponent } from './maps-tab-data/maps-tab-data.component';
import { CustomFilterComponent } from './maps-tab-data/custom-filter/custom-filter.component';
import { FilterByNamePipe } from '../pipes/filter-by-name.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
LicenseManager.setLicenseKey(environment.aggridLicenseKey);

@NgModule({
  imports: [
    CommonModule,
    // RouterModule.forChild(MapsRoutes),
    SharedModule,
    pgSliderModule,
    FormsModule,
    AgGridModule.withComponents([]),
    AgmCoreModule.forRoot({
      apiKey: environment.GooglemapAPIKey
    }),
    InfiniteScrollModule
  ],
  entryComponents: [CustomFilterComponent],
  declarations: [GoogleMapPage, MapsTabDataComponent, CustomFilterComponent, FilterByNamePipe],
  exports: [GoogleMapPage, FilterByNamePipe],
  providers: [GoogleMapsAPIWrapper, InfoWindowManager, MarkerManager, PolygonManager, PolylineManager, KmlLayerManager, DataLayerManager]
})
export class MapsModule { }
