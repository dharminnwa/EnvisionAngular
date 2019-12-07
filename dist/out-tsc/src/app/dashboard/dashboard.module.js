"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
//Angular Dependencies
var core_1 = require("@angular/core");
var card_module_1 = require("../@pages/components/card/card.module");
var switch_module_1 = require("../@pages/components/switch/switch.module");
var tabs_module_1 = require("../@pages/components/tabs/tabs.module");
var ngx_nvd3_1 = require("ngx-nvd3");
var ngx_echarts_1 = require("ngx-echarts");
var ngx_swiper_wrapper_1 = require("ngx-swiper-wrapper");
var DEFAULT_SWIPER_CONFIG = {
    direction: 'horizontal',
    slidesPerView: 'auto'
};
// Widgets
var image_widget_component_1 = require("./widgets/image-widget/image-widget.component");
var image_widget_basic_component_1 = require("./widgets/image-widget-basic/image-widget-basic.component");
var graph_tile_widget_component_1 = require("./widgets/graph-tile-widget/graph-tile-widget.component");
var plain_widget_component_1 = require("./widgets/plain-widget/plain-widget.component");
var plain_live_widget_component_1 = require("./widgets/plain-live-widget/plain-live-widget.component");
var graph_live_widget_component_1 = require("./widgets/graph-live-widget/graph-live-widget.component");
var bar_tile_widget_component_1 = require("./widgets/bar-tile-widget/bar-tile-widget.component");
var graph_tile_flat_widget_component_1 = require("./widgets/graph-tile-flat-widget/graph-tile-flat-widget.component");
var progress_tile_flat_widget_component_1 = require("./widgets/progress-tile-flat-widget/progress-tile-flat-widget.component");
var stat_tile_widget_component_1 = require("./widgets/stat-tile-widget/stat-tile-widget.component");
var graph_widget_component_1 = require("./widgets/graph-widget/graph-widget.component");
var table_basic_widget_component_1 = require("./widgets/table-basic-widget/table-basic-widget.component");
var map_widget_component_1 = require("./widgets/map-widget/map-widget.component");
var realtime_widget_component_1 = require("./widgets/realtime-widget/realtime-widget.component");
var stacked_bar_widget_component_1 = require("./widgets/stacked-bar-widget/stacked-bar-widget.component");
var graph_options_widget_component_1 = require("./widgets/graph-options-widget/graph-options-widget.component");
var weather_widget_component_1 = require("./widgets/weather-widget/weather-widget.component");
var table_widget_component_1 = require("./widgets/table-widget/table-widget.component");
var social_image_tile_widget_component_1 = require("./widgets/social-image-tile-widget/social-image-tile-widget.component");
var social_post_tile_widget_component_1 = require("./widgets/social-post-tile-widget/social-post-tile-widget.component");
var project_progress_widget_component_1 = require("./widgets/project-progress-widget/project-progress-widget.component");
var weekly_sales_widget_component_1 = require("./widgets/weekly-sales-widget/weekly-sales-widget.component");
var quick_stats_widget_component_1 = require("./widgets/quick-stats-widget/quick-stats-widget.component");
var todo_list_widget_component_1 = require("./widgets/todo-list-widget/todo-list-widget.component");
var graph_widget_basic_component_1 = require("./widgets/graph-widget-basic/graph-widget-basic.component");
var components = [
    image_widget_component_1.ImageWidgetComponent,
    image_widget_basic_component_1.ImageWidgetBasicComponent,
    graph_tile_widget_component_1.GraphTileWidgetComponent,
    plain_widget_component_1.PlainWidgetComponent,
    plain_live_widget_component_1.PlainLiveWidgetComponent,
    graph_live_widget_component_1.GraphLiveWidgetComponent,
    bar_tile_widget_component_1.BarTileWidgetComponent,
    graph_tile_flat_widget_component_1.GraphTileFlatWidgetComponent,
    progress_tile_flat_widget_component_1.ProgressTileFlatWidgetComponent,
    stat_tile_widget_component_1.StatTileWidgetComponent,
    graph_widget_component_1.GraphWidgetComponent,
    graph_widget_basic_component_1.GraphWidgetBasicComponent,
    table_basic_widget_component_1.TableBasicWidgetComponent,
    map_widget_component_1.MapWidgetComponent,
    realtime_widget_component_1.RealtimeWidgetComponent,
    stacked_bar_widget_component_1.StackedBarWidgetComponent,
    graph_options_widget_component_1.GraphOptionsWidgetComponent,
    weather_widget_component_1.WeatherWidgetComponent,
    table_widget_component_1.TableWidgetComponent,
    social_image_tile_widget_component_1.SocialImageTileWidgetComponent,
    social_post_tile_widget_component_1.SocialPostTileWidgetComponent,
    project_progress_widget_component_1.ProjectProgressWidgetComponent,
    weekly_sales_widget_component_1.WeeklySalesWidgetComponent,
    quick_stats_widget_component_1.QuickStatsWidgetComponent,
    todo_list_widget_component_1.TodoListWidgetComponent
];
var DashboardModule = (function () {
    function DashboardModule() {
    }
    DashboardModule = __decorate([
        core_1.NgModule({
            imports: [
                card_module_1.pgCardModule,
                tabs_module_1.pgTabsModule,
                ngx_nvd3_1.NvD3Module,
                ngx_echarts_1.NgxEchartsModule,
                ngx_swiper_wrapper_1.SwiperModule,
                switch_module_1.pgSwitchModule
            ],
            declarations: components,
            exports: components,
            providers: [{
                    provide: ngx_swiper_wrapper_1.SWIPER_CONFIG,
                    useValue: DEFAULT_SWIPER_CONFIG
                }]
        })
    ], DashboardModule);
    return DashboardModule;
}());
exports.DashboardModule = DashboardModule;
//# sourceMappingURL=dashboard.module.js.map