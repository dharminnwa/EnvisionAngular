"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
//Angular 
var animations_1 = require("@angular/platform-browser/animations");
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var http_2 = require("@angular/common/http");
var router_1 = require("@angular/router");
//Routing
var app_routing_1 = require("./app.routing");
var app_component_1 = require("./app.component");
//Layouts
var layouts_1 = require("./@pages/layouts");
//Layout Service - Required
var toggler_service_1 = require("./@pages/services/toggler.service");
//Shared Layout Components
var sidebar_component_1 = require("./@pages/components/sidebar/sidebar.component");
var quickview_component_1 = require("./@pages/components/quickview/quickview.component");
var quickview_service_1 = require("./@pages/components/quickview/quickview.service");
var search_overlay_component_1 = require("./@pages/components/search-overlay/search-overlay.component");
var header_component_1 = require("./@pages/components/header/header.component");
var horizontal_menu_component_1 = require("./@pages/components/horizontal-menu/horizontal-menu.component");
var shared_module_1 = require("./@pages/components/shared.module");
var list_view_module_1 = require("./@pages/components/list-view/list-view.module");
var card_module_1 = require("./@pages/components/card/card.module");
var card_social_module_1 = require("./@pages/components/card-social/card-social.module");
var select_module_1 = require("./@pages/components/select/select.module");
var tag_module_1 = require("./@pages/components/tag/tag.module");
var timepicker_module_1 = require("./@pages/components/time-picker/timepicker.module");
var select_module_2 = require("./@pages/components/cs-select/select.module");
var datepicker_module_1 = require("./@pages/components/datepicker/datepicker.module");
var upload_module_1 = require("./@pages/components/upload/upload.module");
//Basic Bootstrap Modules
var ngx_bootstrap_1 = require("ngx-bootstrap");
//Pages Globaly required Components - Optional
var tabs_module_1 = require("./@pages/components/tabs/tabs.module");
var switch_module_1 = require("./@pages/components/switch/switch.module");
var progress_module_1 = require("./@pages/components/progress/progress.module");
//Thirdparty Components / Plugins - Optional
var ngx_nvd3_1 = require("ngx-nvd3");
var ngx_echarts_1 = require("ngx-echarts");
var ngx_quill_1 = require("ngx-quill");
var ngx_perfect_scrollbar_1 = require("ngx-perfect-scrollbar");
var ngx_perfect_scrollbar_2 = require("ngx-perfect-scrollbar");
var ngx_cookie_service_1 = require("ngx-cookie-service");
//Dashboard Widgets - Optional
var dashboard_module_1 = require("./dashboard/dashboard.module");
//Dashboards - Optional
var dashboard_component_1 = require("./dashboard/condensed/dashboard.component");
//Sample Blank Pages - Optional
var blank_corporate_component_1 = require("./@pages/layouts/blank-corporate/blank-corporate.component");
var blank_simplywhite_component_1 = require("./@pages/layouts/blank-simplywhite/blank-simplywhite.component");
var blank_casual_component_1 = require("./@pages/layouts/blank-casual/blank-casual.component");
var slider_module_1 = require("./@pages/components/slider/slider.module");
var message_module_1 = require("./@pages/components/message/message.module");
var message_service_1 = require("./@pages/components/message/message.service");
// Start Import All services 
var map_service_service_1 = require("./services/map-service.service");
var api_service_1 = require("./services/api.service");
var auth_service_1 = require("./services/auth.service");
var MapLayer_service_1 = require("./services/MapLayer-service");
var condensed_service_1 = require("./services/condensed-service");
var map_layer_info_service_1 = require("./services/map-layer-info.service");
var Intelligence_service_1 = require("./services/Intelligence.service");
var base_map_service_1 = require("./services/base-map.service");
var dashboard_service_1 = require("./services/dashboard.service");
var private_maplayer_service_1 = require("./services/private-maplayer-service");
var MapLayer_new_service_1 = require("./services/MapLayer-new-service");
var tools_service_1 = require("./services/tools.service");
var CreateLayerToolService_1 = require("./services/CreateLayerToolService");
var GlobalSearchService_1 = require("./services/GlobalSearchService");
var Utility_service_1 = require("./services/Utility.service");
var all_http_request_service_1 = require("./services/all-http-request.service");
var localdata_service_1 = require("./services/localdata.service");
var my_map_service_1 = require("./services/my-map.service");
var private_maplayer_service_New_1 = require("./services/private-maplayer-service_New");
/// end Service
// start Component
var companies_component_1 = require("./manage-companies/companies.component");
var users_component_1 = require("./manage-users/users.component");
var addedit_component_1 = require("./manage-companies/addedit-companies/addedit.component");
var home_component_1 = require("./home/home.component");
var map_search_data_component_1 = require("./map-search-data/map-search-data.component");
var widget_modal_component_1 = require("./home/widget-modal/widget-modal.component");
var basemap_component_1 = require("./@pages/layouts/condensed/basemap/basemap.component");
var tsp_component_1 = require("./manage-companies/edit-tsps/tsp.component");
var home_new_component_1 = require("./home-new/home-new.component");
var add_data_component_1 = require("./add-data/add-data.component");
var shapefile_component_1 = require("./add-data/shapefile-tab/shapefile.component");
var kml_component_1 = require("./add-data/kml-tab/kml.component");
var location_component_1 = require("./add-data/location-tab/location.component");
var image_component_1 = require("./add-data/image-tab/image.component");
var feed_component_1 = require("./add-data/feed-tab/feed.component");
var envisiontab_component_1 = require("./manage-companies/addedit-companies/envision-tab/envisiontab.component");
var profiletab_component_1 = require("./manage-companies/addedit-companies/profile-tab/profiletab.component");
var layercategorytab_component_1 = require("./manage-companies/addedit-companies/layercategory-tab/layercategorytab.component");
var expresstab_component_1 = require("./manage-companies/addedit-companies/express-tab/expresstab.component");
var addedit_user_component_1 = require("./manage-users/addedit-users/addedit-user.component");
var change_username_component_1 = require("./manage-users/change-username/change-username.component");
var mymaps_component_1 = require("./@pages/layouts/condensed/mymaps/mymaps.component");
var shared_data_component_1 = require("./@pages/layouts/condensed/shared-data/shared-data.component");
var map_library_component_1 = require("./@pages/layouts/condensed/map-library/map-library.component");
var my_data_component_1 = require("./@pages/layouts/condensed/my-data/my-data.component");
var map_properties_component_1 = require("./@pages/layouts/condensed/map-library/map-properties/map-properties.component");
var summary_component_1 = require("./@pages/layouts/condensed/map-library/summary/summary.component");
var energy_data_component_1 = require("./@pages/layouts/condensed/map-library/energy-data/energy-data.component");
var search_location_component_1 = require("./@pages/layouts/condensed/search-location/search-location.component");
var reverse_geocode_component_1 = require("./@pages/layouts/condensed/reverse-geocode/reverse-geocode.component");
var measure_distance_component_1 = require("./@pages/layouts/condensed/measure-distance/measure-distance.component");
var elevation_profile_component_1 = require("./@pages/layouts/condensed/elevation-profile/elevation-profile.component");
var cartographic_tool_component_1 = require("./@pages/layouts/condensed/cartographic-tool/cartographic-tool.component");
var save_image_component_1 = require("./@pages/layouts/condensed/save-image/save-image.component");
var book_marks_component_1 = require("./@pages/layouts/condensed/book-marks/book-marks.component");
var asset_lookup_component_1 = require("./home-new/asset-lookup/asset-lookup.component");
var parcel_center_point_component_1 = require("./home-new/parcel-center-point/parcel-center-point.component");
var well_lookup_component_1 = require("./home-new/well-lookup/well-lookup.component");
var transmission_project_component_1 = require("./home-new/transmission-project/transmission-project.component");
var pipeline_activity_component_1 = require("./home-new/pipeline-activity/pipeline-activity.component");
//End Component
//Start picklist UI
var picklist_1 = require("primeng/picklist");
var fileupload_1 = require("primeng/fileupload");
var listbox_1 = require("primeng/listbox");
var slider_1 = require("primeng/slider");
var colorpicker_1 = require("primeng/colorpicker");
var dropdown_1 = require("primeng/dropdown");
//end picklist UI
//Start Ag-Grid UI
var ag_grid_angular_1 = require("ag-grid-angular");
require("ag-grid-enterprise");
var ag_grid_enterprise_1 = require("ag-grid-enterprise");
ag_grid_enterprise_1.LicenseManager.setLicenseKey('Evaluation_License_Valid_Until__17_November_2018__MTU0MjQxMjgwMDAwMA==e6e57614394e82591f7af9baff0981a4');
//End Ag-Grid UI
//Start  
var ng_multiselect_dropdown_1 = require("ng-multiselect-dropdown");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var power_plantdetail_modal_component_1 = require("./intelligence/power-plantdetail-modal/power-plantdetail-modal.component");
var operating_utilitydetail_modal_component_1 = require("./intelligence/operating-utilitydetail-modal/operating-utilitydetail-modal.component");
var company_profile_detail_modal_component_1 = require("./intelligence/company-profile-detail-modal/company-profile-detail-modal.component");
var pipeline_activity_project_modal_component_1 = require("./intelligence/pipeline-activity-project-modal/pipeline-activity-project-modal.component");
var transmission_project_detail_modal_component_1 = require("./intelligence/transmission-project-detail-modal/transmission-project-detail-modal.component");
var map_layer_styles_component_1 = require("./@pages/layouts/condensed/map-layer-styles/map-layer-styles.component");
var edit_mydata_component_1 = require("./@pages/layouts/condensed/my-data/edit-mydata/edit-mydata.component");
var parcel_buffer_component_1 = require("./@pages/layouts/condensed/parcel-buffer/parcel-buffer.component");
var create_layer_component_1 = require("./@pages/layouts/condensed/create-layer/create-layer.component");
var map_layer_feedback_component_1 = require("./@pages/layouts/condensed/map-layer-feedback/map-layer-feedback.component");
var pipeline_component_1 = require("./@pages/layouts/condensed/create-layer/pipeline/pipeline.component");
var railroad_component_1 = require("./@pages/layouts/condensed/create-layer/railroad/railroad.component");
var point_component_1 = require("./@pages/layouts/condensed/parcel-buffer/point/point.component");
var line_component_1 = require("./@pages/layouts/condensed/parcel-buffer/line/line.component");
var site_selection_component_1 = require("./@pages/layouts/condensed/site-selection/site-selection.component");
var show_legend_component_1 = require("./@pages/layouts/condensed/show-legend/show-legend.component");
var delete_externalsymbols_component_1 = require("./@pages/layouts/condensed/map-layer-styles/delete-externalsymbols/delete-externalsymbols.component");
var ngx_infinite_scroll_1 = require("ngx-infinite-scroll");
var elevation_graph_component_1 = require("./@pages/layouts/condensed/elevation-profile/elevation-graph/elevation-graph.component");
var ng2_google_charts_1 = require("ng2-google-charts");
var elevation_profile_service_1 = require("./services/elevation-profile.service");
var global_search_result_component_1 = require("./@pages/layouts/condensed/global-search-result/global-search-result.component");
var savesearch_component_1 = require("./@pages/layouts/condensed/savesearch/savesearch.component");
//End
//Start Interceptor service//
var http_3 = require("@angular/common/http");
var auth_interceptor_service_1 = require("./services/auth-interceptor.service");
var intelligence_module_1 = require("./intelligence/intelligence.module");
//end Interceptor service//
// satrt Guards
var auth_guard_1 = require("./guards/auth.guard");
var maps_module_1 = require("./maps/maps.module");
var mesure_distance_service_1 = require("./services/mesure-distance.service");
var my_profile_component_1 = require("./@pages/layouts/condensed/my-profile/my-profile.component");
var checkbox_picklist_component_1 = require("./@pages/layouts/condensed/create-layer/checkbox-picklist/checkbox-picklist.component");
var mymap_confirmation_component_1 = require("./@pages/layouts/condensed/mymap-confirmation/mymap-confirmation.component");
var mymap_saveas_component_1 = require("./@pages/layouts/condensed/mymap-confirmation/mymap-saveas/mymap-saveas.component");
var save_create_layerdata_component_1 = require("./@pages/layouts/condensed/create-layer/save-create-layerdata/save-create-layerdata.component");
var deletemap_confirmation_component_1 = require("./@pages/layouts/condensed/mymaps/deletemap-confirmation/deletemap-confirmation.component");
var ParcelBufferTool_service_1 = require("./services/ParcelBufferTool.service");
var logout_confirmation_component_1 = require("./@pages/layouts/condensed/logout-confirmation/logout-confirmation.component");
var draw_tools_component_1 = require("./@pages/layouts/condensed/draw-tools/draw-tools.component");
var draw_tools_service_1 = require("./services/draw-tools.service");
var save_draw_tools_component_1 = require("./@pages/layouts/condensed/draw-tools/save-draw-tools/save-draw-tools.component");
var confirm_draw_tools_component_1 = require("./@pages/layouts/condensed/draw-tools/confirm-draw-tools/confirm-draw-tools.component");
var confirm_delete_draw_tool_component_1 = require("./@pages/layouts/condensed/draw-tools/confirm-delete-draw-tool/confirm-delete-draw-tool.component");
var edit_my_map_component_1 = require("./@pages/layouts/condensed/mymaps/edit-my-map/edit-my-map.component");
//End Guards
//import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
var DEFAULT_PERFECT_SCROLLBAR_CONFIG = {
    suppressScrollX: true
};
//Hammer Config Overide
//https://github.com/angular/angular/issues/10541
var AppHammerConfig = (function (_super) {
    __extends(AppHammerConfig, _super);
    function AppHammerConfig() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.overrides = {
            'pinch': { enable: false },
            'rotate': { enable: false }
        };
        return _this;
    }
    return AppHammerConfig;
}(platform_browser_1.HammerGestureConfig));
exports.AppHammerConfig = AppHammerConfig;
//const config: SocketIoConfig = { url: 'http://localhost:1338/api/', options: {} };
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            entryComponents: [
                map_search_data_component_1.MapSearchDataComponent,
                widget_modal_component_1.WidgetModalComponent,
                companies_component_1.CompaniesComponent,
                users_component_1.UsersComponent,
                addedit_component_1.AddeditCompaniesComponent,
                basemap_component_1.BasemapComponent,
                tsp_component_1.TspComponent,
                addedit_user_component_1.AddEditUserComponent,
                change_username_component_1.ChangeUserNameComponent,
                add_data_component_1.AddDataComponent,
                mymaps_component_1.MymapsComponent,
                map_library_component_1.MapLibraryComponent,
                shared_data_component_1.SharedDataComponent,
                my_data_component_1.MyDataComponent,
                search_location_component_1.SearchLocationComponent,
                reverse_geocode_component_1.ReverseGeocodeComponent,
                measure_distance_component_1.MeasureDistanceComponent,
                elevation_profile_component_1.ElevationProfileComponent,
                elevation_graph_component_1.ElevationGraphComponent,
                cartographic_tool_component_1.CartographicToolComponent,
                save_image_component_1.SaveImageComponent,
                book_marks_component_1.BookMarksComponent,
                power_plantdetail_modal_component_1.PowerPlantdetailModalComponent,
                operating_utilitydetail_modal_component_1.OperatingUtilitydetailModalComponent,
                company_profile_detail_modal_component_1.CompanyPorfileDetailModalComponent,
                pipeline_activity_project_modal_component_1.PipelineActivityProjectModalComponent,
                transmission_project_detail_modal_component_1.TransmissionProjectDetailModalComponent,
                map_layer_styles_component_1.MapLayerStylesComponent,
                edit_mydata_component_1.EditMyDataComponent,
                map_layer_feedback_component_1.MapLayerFeedbackComponent,
                create_layer_component_1.CreateLayerComponent,
                parcel_buffer_component_1.ParcelBufferComponent,
                site_selection_component_1.SiteSelectionComponent,
                show_legend_component_1.ShowLegendComponent,
                delete_externalsymbols_component_1.DeleteExternalsymbolsComponent,
                global_search_result_component_1.GlobalSearchResultComponent,
                savesearch_component_1.SavesearchComponent,
                my_profile_component_1.MyProfileComponent,
                mymap_confirmation_component_1.MyMapConfirmationComponent,
                mymap_saveas_component_1.MyMapSaveAsComponent,
                save_create_layerdata_component_1.SaveCreateLayerdataComponent,
                deletemap_confirmation_component_1.DeleteMapConfirmationComponent,
                logout_confirmation_component_1.LogoutConfirmationComponent,
                draw_tools_component_1.DrawToolsComponent,
                save_draw_tools_component_1.SaveDrawToolsComponent,
                confirm_draw_tools_component_1.ConfirmDrawToolsComponent,
                confirm_delete_draw_tool_component_1.ConfirmDeleteDrawToolComponent,
                edit_my_map_component_1.EditMyMapComponent
            ],
            declarations: [
                app_component_1.AppComponent,
                layouts_1.CondensedComponent,
                layouts_1.CorporateLayout,
                layouts_1.SimplyWhiteLayout,
                layouts_1.ExecutiveLayout,
                layouts_1.CasualLayout,
                sidebar_component_1.SidebarComponent, quickview_component_1.QuickviewComponent, search_overlay_component_1.SearchOverlayComponent, header_component_1.HeaderComponent, horizontal_menu_component_1.HorizontalMenuComponent,
                layouts_1.BlankComponent,
                layouts_1.RootLayout,
                dashboard_component_1.CondensedDashboardComponent,
                blank_corporate_component_1.BlankCorporateComponent,
                blank_simplywhite_component_1.BlankSimplywhiteComponent,
                blank_casual_component_1.BlankCasualComponent,
                companies_component_1.CompaniesComponent,
                users_component_1.UsersComponent,
                addedit_component_1.AddeditCompaniesComponent,
                home_component_1.HomeComponent,
                map_search_data_component_1.MapSearchDataComponent,
                widget_modal_component_1.WidgetModalComponent,
                basemap_component_1.BasemapComponent,
                tsp_component_1.TspComponent,
                home_new_component_1.HomeNewComponent,
                addedit_user_component_1.AddEditUserComponent,
                change_username_component_1.ChangeUserNameComponent,
                add_data_component_1.AddDataComponent,
                shapefile_component_1.ShapefileComponent,
                kml_component_1.KmlComponent,
                location_component_1.LocationComponent,
                image_component_1.ImageComponent,
                feed_component_1.FeedComponent,
                envisiontab_component_1.EnvisionTabComponent,
                profiletab_component_1.ProfileTabComponent,
                layercategorytab_component_1.LayerCategoryTabComponent,
                expresstab_component_1.ExpressTabComponent,
                change_username_component_1.ChangeUserNameComponent,
                mymaps_component_1.MymapsComponent,
                map_library_component_1.MapLibraryComponent,
                map_properties_component_1.MapPropertiesComponent,
                summary_component_1.SummaryComponent,
                shared_data_component_1.SharedDataComponent,
                my_data_component_1.MyDataComponent,
                energy_data_component_1.EnergyDataComponent,
                search_location_component_1.SearchLocationComponent,
                reverse_geocode_component_1.ReverseGeocodeComponent,
                measure_distance_component_1.MeasureDistanceComponent,
                elevation_profile_component_1.ElevationProfileComponent,
                elevation_graph_component_1.ElevationGraphComponent,
                cartographic_tool_component_1.CartographicToolComponent,
                save_image_component_1.SaveImageComponent,
                book_marks_component_1.BookMarksComponent,
                asset_lookup_component_1.AssetLookupComponent,
                parcel_center_point_component_1.ParcelCenterPointComponent,
                well_lookup_component_1.WellLookupComponent,
                transmission_project_component_1.TransmissionProjectComponent,
                pipeline_activity_component_1.PipelineActivityComponent,
                map_layer_styles_component_1.MapLayerStylesComponent,
                edit_mydata_component_1.EditMyDataComponent,
                parcel_buffer_component_1.ParcelBufferComponent,
                create_layer_component_1.CreateLayerComponent,
                map_layer_feedback_component_1.MapLayerFeedbackComponent,
                pipeline_component_1.PipelineComponent,
                railroad_component_1.RailroadComponent,
                point_component_1.PointComponent,
                line_component_1.LineComponent,
                site_selection_component_1.SiteSelectionComponent,
                show_legend_component_1.ShowLegendComponent,
                delete_externalsymbols_component_1.DeleteExternalsymbolsComponent,
                global_search_result_component_1.GlobalSearchResultComponent,
                savesearch_component_1.SavesearchComponent,
                my_profile_component_1.MyProfileComponent,
                checkbox_picklist_component_1.CheckboxPicklistComponent,
                mymap_confirmation_component_1.MyMapConfirmationComponent,
                mymap_saveas_component_1.MyMapSaveAsComponent,
                save_create_layerdata_component_1.SaveCreateLayerdataComponent,
                deletemap_confirmation_component_1.DeleteMapConfirmationComponent,
                logout_confirmation_component_1.LogoutConfirmationComponent,
                draw_tools_component_1.DrawToolsComponent,
                save_draw_tools_component_1.SaveDrawToolsComponent,
                confirm_draw_tools_component_1.ConfirmDrawToolsComponent,
                confirm_delete_draw_tool_component_1.ConfirmDeleteDrawToolComponent,
                edit_my_map_component_1.EditMyMapComponent
                //GoogleMapPage
            ],
            imports: [
                platform_browser_1.BrowserModule,
                animations_1.BrowserAnimationsModule,
                common_1.CommonModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                http_1.HttpModule,
                http_2.HttpClientModule,
                shared_module_1.SharedModule,
                progress_module_1.ProgressModule,
                list_view_module_1.pgListViewModule,
                card_module_1.pgCardModule,
                card_social_module_1.pgCardSocialModule,
                router_1.RouterModule.forRoot(app_routing_1.AppRoutes, { useHash: true }),
                ngx_bootstrap_1.BsDropdownModule.forRoot(),
                ngx_bootstrap_1.AccordionModule.forRoot(),
                ngx_bootstrap_1.AlertModule.forRoot(),
                ngx_bootstrap_1.ButtonsModule.forRoot(),
                ngx_bootstrap_1.CollapseModule.forRoot(),
                ngx_bootstrap_1.ModalModule.forRoot(),
                ngx_bootstrap_1.ProgressbarModule.forRoot(),
                ngx_bootstrap_1.TabsModule.forRoot(),
                ngx_bootstrap_1.TooltipModule.forRoot(),
                ngx_bootstrap_1.TypeaheadModule.forRoot(),
                ngx_nvd3_1.NvD3Module,
                tabs_module_1.pgTabsModule,
                ngx_echarts_1.NgxEchartsModule,
                ngx_quill_1.QuillModule,
                ngx_perfect_scrollbar_1.PerfectScrollbarModule,
                switch_module_1.pgSwitchModule,
                dashboard_module_1.DashboardModule,
                ng_bootstrap_1.NgbModule.forRoot(),
                ag_grid_angular_1.AgGridModule.withComponents([]),
                picklist_1.PickListModule,
                select_module_1.pgSelectModule,
                tag_module_1.pgTagModule,
                slider_module_1.pgSliderModule,
                switch_module_1.pgSwitchModule,
                timepicker_module_1.pgTimePickerModule,
                tabs_module_1.pgTabsModule,
                select_module_2.pgSelectfx,
                datepicker_module_1.pgDatePickerModule,
                upload_module_1.pgUploadModule,
                ng_multiselect_dropdown_1.NgMultiSelectDropDownModule.forRoot(),
                fileupload_1.FileUploadModule,
                listbox_1.ListboxModule,
                slider_1.SliderModule,
                colorpicker_1.ColorPickerModule,
                message_module_1.MessageModule,
                dropdown_1.DropdownModule,
                ngx_infinite_scroll_1.InfiniteScrollModule,
                ng2_google_charts_1.Ng2GoogleChartsModule,
                intelligence_module_1.IntelligenceModule,
                maps_module_1.MapsModule
                //SocketIoModule.forRoot(config)
            ],
            providers: [
                {
                    provide: ngx_perfect_scrollbar_2.PERFECT_SCROLLBAR_CONFIG,
                    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
                },
                {
                    provide: platform_browser_1.HAMMER_GESTURE_CONFIG,
                    useClass: AppHammerConfig
                },
                {
                    provide: http_3.HTTP_INTERCEPTORS,
                    useClass: auth_interceptor_service_1.AuthInterceptorService,
                    multi: true
                },
                quickview_service_1.QuickviewService,
                toggler_service_1.pagesToggleService,
                map_service_service_1.MapServiceService,
                auth_service_1.AuthenticationService,
                api_service_1.ApiService,
                MapLayer_service_1.MapLayerService,
                condensed_service_1.condensedService,
                ngx_cookie_service_1.CookieService,
                map_layer_info_service_1.MapLayerInfoService,
                base_map_service_1.BaseMapService,
                Intelligence_service_1.IntelligenceService,
                dashboard_service_1.DashboardService,
                private_maplayer_service_1.PrivateMapLayerService,
                MapLayer_new_service_1.MapLayernewService,
                tools_service_1.ToolsService,
                message_service_1.MessageService,
                CreateLayerToolService_1.CreateLayerToolService,
                elevation_profile_service_1.ElevationPofileService,
                GlobalSearchService_1.GlobalSearchServiceService,
                Utility_service_1.UtilityService,
                auth_guard_1.AuthGuard,
                all_http_request_service_1.HttpRequestService,
                localdata_service_1.LocalDataService,
                mesure_distance_service_1.MesureDistanceService,
                my_map_service_1.MyMapService,
                ParcelBufferTool_service_1.ParcelBufferToolService,
                draw_tools_service_1.DrawingToolService,
                private_maplayer_service_New_1.PrivateMapLayerService_new
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map