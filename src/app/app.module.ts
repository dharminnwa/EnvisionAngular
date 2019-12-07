//Angular 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
//Routing
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
//Layouts
import { CondensedComponent, BlankComponent, RootLayout, CorporateLayout, SimplyWhiteLayout, ExecutiveLayout, CasualLayout } from './@pages/layouts';
//Layout Service - Required
import { pagesToggleService } from './@pages/services/toggler.service';
//Shared Layout Components
import { SidebarComponent } from './@pages/components/sidebar/sidebar.component';
import { QuickviewComponent } from './@pages/components/quickview/quickview.component';
import { QuickviewService } from './@pages/components/quickview/quickview.service';
import { SearchOverlayComponent } from './@pages/components/search-overlay/search-overlay.component';
import { HeaderComponent } from './@pages/components/header/header.component';
import { HorizontalMenuComponent } from './@pages/components/horizontal-menu/horizontal-menu.component';
import { SharedModule } from './@pages/components/shared.module';
import { pgListViewModule } from './@pages/components/list-view/list-view.module';
import { pgCardModule } from './@pages/components/card/card.module';
import { pgCardSocialModule } from './@pages/components/card-social/card-social.module';
import { pgSelectModule } from './@pages/components/select/select.module';
import { pgTagModule } from './@pages/components/tag/tag.module';
import { pgTimePickerModule } from './@pages/components/time-picker/timepicker.module';
import { pgSelectfx } from './@pages/components/cs-select/select.module';
import { pgDatePickerModule } from './@pages/components/datepicker/datepicker.module';
import { pgUploadModule } from './@pages/components/upload/upload.module';

//Basic Bootstrap Modules
import {
  BsDropdownModule,
  AccordionModule,
  AlertModule,
  ButtonsModule,
  CollapseModule,
  ModalModule,
  ProgressbarModule,
  TabsModule,
  TooltipModule,
  TypeaheadModule,
} from 'ngx-bootstrap';
//Pages Globaly required Components - Optional
import { pgTabsModule } from './@pages/components/tabs/tabs.module';
import { pgSwitchModule } from './@pages/components/switch/switch.module';
import { ProgressModule } from './@pages/components/progress/progress.module';
//Thirdparty Components / Plugins - Optional
import { NvD3Module } from 'ngx-nvd3';
import { NgxEchartsModule } from 'ngx-echarts';
import { QuillModule } from 'ngx-quill';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CookieService } from 'ngx-cookie-service';
//Dashboard Widgets - Optional
import { DashboardModule } from './dashboard/dashboard.module';
//Dashboards - Optional
import { CondensedDashboardComponent } from './dashboard/condensed/dashboard.component';
//Sample Blank Pages - Optional
import { BlankCorporateComponent } from './@pages/layouts/blank-corporate/blank-corporate.component';
import { BlankSimplywhiteComponent } from './@pages/layouts/blank-simplywhite/blank-simplywhite.component';
import { BlankCasualComponent } from './@pages/layouts/blank-casual/blank-casual.component';
import { pgSliderModule } from './@pages/components/slider/slider.module';
import { MessageModule } from './@pages/components/message/message.module';
import { MessageService } from './@pages/components/message/message.service';
// Start Import All services 
import { MapServiceService } from './services/map-service.service';
import { ApiService } from './services/api.service';
import { AuthenticationService } from './services/auth.service';
import { MapLayerService } from './services/MapLayer-service';
import { condensedService } from './services/condensed-service';
import { MapLayerInfoService } from './services/map-layer-info.service';
import { IntelligenceService } from './services/Intelligence.service'
import { BaseMapService } from './services/base-map.service';
import { DashboardService } from './services/dashboard.service';
import { PrivateMapLayerService } from './services/private-maplayer-service';
import { MapLayernewService } from './services/MapLayer-new-service';
import { ToolsService } from './services/tools.service';
import { CreateLayerToolService } from './services/CreateLayerToolService';
import { GlobalSearchServiceService } from './services/GlobalSearchService';
import { UtilityService } from './services/Utility.service';
import { HttpRequestService } from './services/all-http-request.service';
import { LocalDataService } from './services/localdata.service';
import { MyMapService } from './services/my-map.service';
import { PrivateMapLayerService_new } from './services/private-maplayer-service_New';
/// end Service
// start Component
import { CompaniesComponent } from './manage-companies/companies.component';
import { UsersComponent } from './manage-users/users.component';
import { AddeditCompaniesComponent } from './manage-companies/addedit-companies/addedit.component';

import { HomeComponent } from './home/home.component';
import { MapSearchDataComponent } from './map-search-data/map-search-data.component';
import { WidgetModalComponent } from './home/widget-modal/widget-modal.component';
import { BasemapComponent } from './@pages/layouts/condensed/basemap/basemap.component';
import { TspComponent } from './manage-companies/edit-tsps/tsp.component';
import { HomeNewComponent } from './home-new/home-new.component';

import { AddDataComponent } from './add-data/add-data.component';
import { ShapefileComponent } from './add-data/shapefile-tab/shapefile.component';
import { KmlComponent } from './add-data/kml-tab/kml.component';
import { LocationComponent } from './add-data/location-tab/location.component';
import { ImageComponent } from './add-data/image-tab/image.component';
import { FeedComponent } from './add-data/feed-tab/feed.component';

import { EnvisionTabComponent } from './manage-companies/addedit-companies/envision-tab/envisiontab.component';
import { ProfileTabComponent } from './manage-companies/addedit-companies/profile-tab/profiletab.component';
import { LayerCategoryTabComponent } from './manage-companies/addedit-companies/layercategory-tab/layercategorytab.component';
import { ExpressTabComponent } from './manage-companies/addedit-companies/express-tab/expresstab.component';
import { AddEditUserComponent } from './manage-users/addedit-users/addedit-user.component';
import { ChangeUserNameComponent } from './manage-users/change-username/change-username.component';

import { MymapsComponent } from './@pages/layouts/condensed/mymaps/mymaps.component';
import { SharedDataComponent } from './@pages/layouts/condensed/shared-data/shared-data.component';
import { MapLibraryComponent } from './@pages/layouts/condensed/map-library/map-library.component';

import { MyDataComponent } from './@pages/layouts/condensed/my-data/my-data.component';
import { MapPropertiesComponent } from './@pages/layouts/condensed/map-library/map-properties/map-properties.component';
import { SummaryComponent } from './@pages/layouts/condensed/map-library/summary/summary.component';
import { EnergyDataComponent } from './@pages/layouts/condensed/map-library/energy-data/energy-data.component';

import { SearchLocationComponent } from './@pages/layouts/condensed/search-location/search-location.component';
import { ReverseGeocodeComponent } from './@pages/layouts/condensed/reverse-geocode/reverse-geocode.component';
import { MeasureDistanceComponent } from './@pages/layouts/condensed/measure-distance/measure-distance.component';
import { ElevationProfileComponent } from './@pages/layouts/condensed/elevation-profile/elevation-profile.component';
import { CartographicToolComponent } from './@pages/layouts/condensed/cartographic-tool/cartographic-tool.component';
import { SaveImageComponent } from './@pages/layouts/condensed/save-image/save-image.component';
import { BookMarksComponent } from './@pages/layouts/condensed/book-marks/book-marks.component';

import { AssetLookupComponent } from './home-new/asset-lookup/asset-lookup.component';
import { ParcelCenterPointComponent } from './home-new/parcel-center-point/parcel-center-point.component';
import { WellLookupComponent } from './home-new/well-lookup/well-lookup.component';
import { TransmissionProjectComponent } from './home-new/transmission-project/transmission-project.component';
import { PipelineActivityComponent } from './home-new/pipeline-activity/pipeline-activity.component';
//End Component

//Start picklist UI
import { PickListModule } from 'primeng/picklist';
import { FileUploadModule } from 'primeng/fileupload';
import { ListboxModule } from 'primeng/listbox';
import { SliderModule } from 'primeng/slider';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DropdownModule } from 'primeng/dropdown';
//end picklist UI

//Start Ag-Grid UI
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { LicenseManager } from "ag-grid-enterprise";
LicenseManager.setLicenseKey('Evaluation_License_Valid_Until__17_November_2018__MTU0MjQxMjgwMDAwMA==e6e57614394e82591f7af9baff0981a4');
//End Ag-Grid UI

//Start  
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PowerPlantdetailModalComponent } from './intelligence/power-plantdetail-modal/power-plantdetail-modal.component';
import { OperatingUtilitydetailModalComponent } from './intelligence/operating-utilitydetail-modal/operating-utilitydetail-modal.component';
import { CompanyPorfileDetailModalComponent } from './intelligence/company-profile-detail-modal/company-profile-detail-modal.component';
import { PipelineActivityProjectModalComponent } from './intelligence/pipeline-activity-project-modal/pipeline-activity-project-modal.component';
import { TransmissionProjectDetailModalComponent } from './intelligence/transmission-project-detail-modal/transmission-project-detail-modal.component';
import { MapLayerStylesComponent } from './@pages/layouts/condensed/map-layer-styles/map-layer-styles.component';
import { EditMyDataComponent } from './@pages/layouts/condensed/my-data/edit-mydata/edit-mydata.component';
import { ParcelBufferComponent } from './@pages/layouts/condensed/parcel-buffer/parcel-buffer.component';
import { CreateLayerComponent } from './@pages/layouts/condensed/create-layer/create-layer.component';
import { MapLayerFeedbackComponent } from './@pages/layouts/condensed/map-layer-feedback/map-layer-feedback.component';
import { PipelineComponent } from './@pages/layouts/condensed/create-layer/pipeline/pipeline.component';
import { RailroadComponent } from './@pages/layouts/condensed/create-layer/railroad/railroad.component';
import { PointComponent } from './@pages/layouts/condensed/parcel-buffer/point/point.component';
import { LineComponent } from './@pages/layouts/condensed/parcel-buffer/line/line.component';
import { SiteSelectionComponent } from './@pages/layouts/condensed/site-selection/site-selection.component';
import { ShowLegendComponent } from './@pages/layouts/condensed/show-legend/show-legend.component';
import { DeleteExternalsymbolsComponent } from './@pages/layouts/condensed/map-layer-styles/delete-externalsymbols/delete-externalsymbols.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ElevationGraphComponent } from './@pages/layouts/condensed/elevation-profile/elevation-graph/elevation-graph.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ElevationPofileService } from './services/elevation-profile.service';
import { GlobalSearchResultComponent } from './@pages/layouts/condensed/global-search-result/global-search-result.component';
import { SavesearchComponent } from './@pages/layouts/condensed/savesearch/savesearch.component';
//End

//Start Interceptor service//
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { IntelligenceModule } from './intelligence/intelligence.module';
//end Interceptor service//

// satrt Guards
import { AuthGuard } from './guards/auth.guard';
import { MapsModule } from './maps/maps.module';
import { GoogleMapPage } from './maps/google/google.component';
import { MesureDistanceService } from './services/mesure-distance.service';
import { MyProfileComponent } from './@pages/layouts/condensed/my-profile/my-profile.component';
import { CheckboxPicklistComponent } from './@pages/layouts/condensed/create-layer/checkbox-picklist/checkbox-picklist.component';
import { MyMapConfirmationComponent } from './@pages/layouts/condensed/mymap-confirmation/mymap-confirmation.component';
import { MyMapSaveAsComponent } from './@pages/layouts/condensed/mymap-confirmation/mymap-saveas/mymap-saveas.component';
import { SaveCreateLayerdataComponent } from './@pages/layouts/condensed/create-layer/save-create-layerdata/save-create-layerdata.component';
import { DeleteMapConfirmationComponent } from './@pages/layouts/condensed/mymaps/deletemap-confirmation/deletemap-confirmation.component';
import { ParcelBufferToolService } from './services/ParcelBufferTool.service';
import { LogoutConfirmationComponent } from './@pages/layouts/condensed/logout-confirmation/logout-confirmation.component';
import { DrawToolsComponent } from './@pages/layouts/condensed/draw-tools/draw-tools.component';
import { DrawingToolService } from './services/draw-tools.service';
import { SaveDrawToolsComponent } from './@pages/layouts/condensed/draw-tools/save-draw-tools/save-draw-tools.component';
import { ConfirmDrawToolsComponent } from './@pages/layouts/condensed/draw-tools/confirm-draw-tools/confirm-draw-tools.component';
import { ConfirmDeleteDrawToolComponent } from './@pages/layouts/condensed/draw-tools/confirm-delete-draw-tool/confirm-delete-draw-tool.component';
import { EditMyMapComponent } from './@pages/layouts/condensed/mymaps/edit-my-map/edit-my-map.component';
import { CacheInterceptorService } from './services/Cache-interceptor.Service';
import { HttpCacheservice } from './services/Cache-Service';
import { RememberMeService } from './services/remembermedata.service';
//End Guards


//import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

//Hammer Config Overide
//https://github.com/angular/angular/issues/10541
export class AppHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    'pinch': { enable: false },
    'rotate': { enable: false }
  }
}
//const config: SocketIoConfig = { url: 'http://localhost:1338/api/', options: {} };

@NgModule({
  entryComponents: [
    MapSearchDataComponent,
    WidgetModalComponent,
    CompaniesComponent,
    UsersComponent,
    AddeditCompaniesComponent,
    BasemapComponent,
    TspComponent,
    AddEditUserComponent,
    ChangeUserNameComponent,
    AddDataComponent,
    MymapsComponent,
    MapLibraryComponent,
    SharedDataComponent,
    MyDataComponent,
    SearchLocationComponent,
    ReverseGeocodeComponent,
    MeasureDistanceComponent,
    ElevationProfileComponent,
    ElevationGraphComponent,
    CartographicToolComponent,
    SaveImageComponent,
    BookMarksComponent,
    PowerPlantdetailModalComponent,
    OperatingUtilitydetailModalComponent,
    CompanyPorfileDetailModalComponent,
    PipelineActivityProjectModalComponent,
    TransmissionProjectDetailModalComponent,
    MapLayerStylesComponent,
    EditMyDataComponent,
    MapLayerFeedbackComponent,
    CreateLayerComponent,
    ParcelBufferComponent,
    SiteSelectionComponent,
    ShowLegendComponent,
    DeleteExternalsymbolsComponent,
    GlobalSearchResultComponent,
    SavesearchComponent,
    MyProfileComponent,
    MyMapConfirmationComponent,
    MyMapSaveAsComponent,
    SaveCreateLayerdataComponent,
    DeleteMapConfirmationComponent,
    LogoutConfirmationComponent,
    DrawToolsComponent,
    SaveDrawToolsComponent,
    ConfirmDrawToolsComponent,
    ConfirmDeleteDrawToolComponent,
    EditMyMapComponent
  ],
  declarations: [
    AppComponent,
    CondensedComponent,
    CorporateLayout,
    SimplyWhiteLayout,
    ExecutiveLayout,
    CasualLayout,
    SidebarComponent, QuickviewComponent, SearchOverlayComponent, HeaderComponent, HorizontalMenuComponent,
    BlankComponent,
    RootLayout,
    CondensedDashboardComponent,
    BlankCorporateComponent,
    BlankSimplywhiteComponent,
    BlankCasualComponent,
    CompaniesComponent,
    UsersComponent,
    AddeditCompaniesComponent,
    HomeComponent,
    MapSearchDataComponent,
    WidgetModalComponent,
    BasemapComponent,
    TspComponent,
    HomeNewComponent,
    AddEditUserComponent,
    ChangeUserNameComponent,
    AddDataComponent,
    ShapefileComponent,
    KmlComponent,
    LocationComponent,
    ImageComponent,
    FeedComponent,
    EnvisionTabComponent,
    ProfileTabComponent,
    LayerCategoryTabComponent,
    ExpressTabComponent,
    ChangeUserNameComponent,
    MymapsComponent,
    MapLibraryComponent,
    MapPropertiesComponent,
    SummaryComponent,
    SharedDataComponent,
    MyDataComponent,
    EnergyDataComponent,
    SearchLocationComponent,
    ReverseGeocodeComponent,
    MeasureDistanceComponent,
    ElevationProfileComponent,
    ElevationGraphComponent,
    CartographicToolComponent,
    SaveImageComponent,
    BookMarksComponent,
    AssetLookupComponent,
    ParcelCenterPointComponent,
    WellLookupComponent,
    TransmissionProjectComponent,
    PipelineActivityComponent,
    MapLayerStylesComponent,
    EditMyDataComponent,
    ParcelBufferComponent,
    CreateLayerComponent,
    MapLayerFeedbackComponent,
    PipelineComponent,
    RailroadComponent,
    PointComponent,
    LineComponent,
    SiteSelectionComponent,
    ShowLegendComponent,
    DeleteExternalsymbolsComponent,
    GlobalSearchResultComponent,
    SavesearchComponent,
    MyProfileComponent,
    CheckboxPicklistComponent,
    MyMapConfirmationComponent,
    MyMapSaveAsComponent,
    SaveCreateLayerdataComponent,
    DeleteMapConfirmationComponent,
    LogoutConfirmationComponent,
    DrawToolsComponent,
    SaveDrawToolsComponent,
    ConfirmDrawToolsComponent,
    ConfirmDeleteDrawToolComponent,
    EditMyMapComponent
    //GoogleMapPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    SharedModule,
    ProgressModule,
    pgListViewModule,
    pgCardModule,
    pgCardSocialModule,
    RouterModule.forRoot(AppRoutes, { useHash: true }),
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    NvD3Module,
    pgTabsModule,
    NgxEchartsModule,
    QuillModule,
    PerfectScrollbarModule,
    pgSwitchModule,
    DashboardModule,
    NgbModule.forRoot(),
    AgGridModule.withComponents([]),
    PickListModule,
    pgSelectModule,
    pgTagModule,
    pgSliderModule,
    pgSwitchModule,
    pgTimePickerModule,
    pgTabsModule,
    pgSelectfx,
    pgDatePickerModule,
    pgUploadModule,
    NgMultiSelectDropDownModule.forRoot(),
    FileUploadModule,
    ListboxModule,
    SliderModule,
    ColorPickerModule,
    MessageModule,
    DropdownModule,
    InfiniteScrollModule,
    Ng2GoogleChartsModule,
    IntelligenceModule,
    MapsModule
    //SocketIoModule.forRoot(config)
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: AppHammerConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptorService,
      multi: true
    },
    QuickviewService,
    pagesToggleService,
    MapServiceService,    
    AuthenticationService,
    ApiService,
    MapLayerService,
    condensedService,
    CookieService,
    MapLayerInfoService,
    BaseMapService,
    IntelligenceService,
    DashboardService,
    PrivateMapLayerService,
    MapLayernewService,
    ToolsService,
    MessageService,
    CreateLayerToolService,
    ElevationPofileService,
    GlobalSearchServiceService,
    UtilityService,
    AuthGuard,
    HttpRequestService,
    LocalDataService,
    RememberMeService,
    MesureDistanceService,
    MyMapService,
    ParcelBufferToolService,
    DrawingToolService,
    PrivateMapLayerService_new,
    HttpCacheservice
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }