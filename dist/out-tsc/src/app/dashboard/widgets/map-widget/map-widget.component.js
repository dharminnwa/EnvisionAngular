"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var map_widget_service_1 = require("./map-widget.service");
var ngx_echarts_1 = require("ngx-echarts");
var MapWidgetComponent = (function () {
    function MapWidgetComponent(mapWidgetService, es) {
        this.mapWidgetService = mapWidgetService;
        this.es = es;
        this._isGrayscale = false;
    }
    Object.defineProperty(MapWidgetComponent.prototype, "IsGrayscale", {
        set: function (value) {
            this._isGrayscale = value;
        },
        enumerable: true,
        configurable: true
    });
    MapWidgetComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service = this.mapWidgetService.getMapData().subscribe(function (GEO_JSON) {
            var echarts = _this.es.echarts;
            echarts.registerMap('USA', GEO_JSON, {
                Alaska: {
                    left: -131,
                    top: 31,
                    width: 15,
                    height: 15
                },
                Hawaii: {
                    left: -112,
                    top: 29,
                    width: 5,
                    height: 5
                },
                'Puerto Rico': {
                    left: -76,
                    top: 26,
                    width: 2,
                    height: 2
                }
            });
            _this.initMap();
        });
    };
    MapWidgetComponent.prototype.ngOnDestroy = function () {
        this.service.unsubscribe();
    };
    MapWidgetComponent.prototype.onResize = function (event) {
        this.resizeChart();
    };
    MapWidgetComponent.prototype.onChartInit = function (ec) {
        this.echartsIntance = ec;
    };
    MapWidgetComponent.prototype.resizeChart = function () {
        if (this.echartsIntance) {
            var parentElement = this._chartContainer.nativeElement;
            var _a = parentElement.getBoundingClientRect(), width = _a.width, height = _a.height;
            this.echartsIntance.resize({ width: width, height: height });
        }
    };
    MapWidgetComponent.prototype.snapToCountry = function (country) {
        var coords = [];
        coords['United States'] = [-100, 40];
        coords['Canada'] = [-100, 60];
        coords['Greenland'] = [-50, 65];
        var updatedOptions = __assign({}, this.chartOptions);
        updatedOptions.series[0].center = coords[country];
        this.mapUpdate = updatedOptions;
    };
    MapWidgetComponent.prototype.initMap = function () {
        var parentElement = this._chartContainer.nativeElement;
        var _a = parentElement.getBoundingClientRect(), width = _a.width, height = _a.height;
        this.chartInitOptions = {
            renderer: 'svg',
            width: width,
            height: height
        };
        this.chartOptions = {
            backgroundColor: 'rgba(0,0,0,0)',
            tooltip: {
                trigger: 'item',
                showDelay: 0,
                transitionDuration: 0.2,
                backgroundColor: '#fff',
                borderColor: '#fff',
                position: function (point, params, dom, rect, size) {
                    return [point[0] - 65, point[1] - 70];
                },
                formatter: function (series) {
                    var _a = series.data, name = _a.name, value = _a.value;
                    return "\n          <div class=\"map-tooltip\">\n            <div class=\"text-master\">" + name + "</div>\n            <div>\n              <span class=\"text-uppercase text-muted fs-11 font-montserrat\">Views</span>\n              <span class=\"fs-12 text-warning m-l-5\">" + value + "</span>\n            </div>\n          </div>";
                },
                confine: true
            },
            toolbox: {
                show: false,
            },
            label: false,
            series: [{
                    type: 'map',
                    map: 'USA',
                    // roam: true,
                    zoom: 2,
                    itemStyle: {
                        normal: {
                            areaColor: 'rgba(0,0,0,.15)',
                            borderColor: 'rgba(0, 0, 0, 0)'
                        },
                        emphasis: {
                            label: { show: false },
                            areaColor: 'rgba(0,0,0,.3)'
                        }
                    },
                    data: [
                        { name: 'Bahamas', value: 2637 },
                        { name: 'Canada', value: 3738 },
                        { name: 'Belize', value: 1937 },
                        { name: 'Cuba', value: 3871 },
                        { name: 'Dominican Rep.', value: 8910 },
                        { name: 'Costa Rica', value: 6638 },
                        { name: 'Greenland', value: 6381 },
                        { name: 'Haiti', value: 8821 },
                        { name: 'Jamaica', value: 1181 },
                        { name: 'Guatemala', value: 4367 },
                        { name: 'Mexico', value: 5918 },
                        { name: 'Honduras', value: 4822 },
                        { name: 'Nicaragua', value: 4023 },
                        { name: 'Puerto Rico', value: 7729 },
                        { name: 'El Salvador', value: 6527 },
                        { name: 'Trinidad and Tobago', value: 9991 },
                        { name: 'United States', value: 8383 }
                    ]
                }]
        };
        var elem = this._chart.nativeElement;
        this.echartsIntance = echarts.init(elem, '', this.chartInitOptions);
        this.echartsIntance.setOption(this.chartOptions);
    };
    MapWidgetComponent.prototype.ngAfterViewInit = function () {
    };
    __decorate([
        core_1.ViewChild('chartContainer'),
        __metadata("design:type", core_1.ElementRef)
    ], MapWidgetComponent.prototype, "_chartContainer", void 0);
    __decorate([
        core_1.ViewChild('chart'),
        __metadata("design:type", core_1.ElementRef)
    ], MapWidgetComponent.prototype, "_chart", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MapWidgetComponent.prototype, "IsGrayscale", null);
    MapWidgetComponent = __decorate([
        core_1.Component({
            selector: 'map-widget',
            templateUrl: './map-widget.component.html',
            styleUrls: ['./map-widget.component.scss'],
            providers: [map_widget_service_1.MapWidgetService]
        }),
        __metadata("design:paramtypes", [map_widget_service_1.MapWidgetService, ngx_echarts_1.NgxEchartsService])
    ], MapWidgetComponent);
    return MapWidgetComponent;
}());
exports.MapWidgetComponent = MapWidgetComponent;
//# sourceMappingURL=map-widget.component.js.map