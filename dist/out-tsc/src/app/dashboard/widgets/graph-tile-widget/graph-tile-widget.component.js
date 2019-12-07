"use strict";
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
var http_1 = require("@angular/common/http");
var graph_tile_widget_service_1 = require("./graph-tile-widget.service");
var GraphTileWidgetComponent = (function () {
    function GraphTileWidgetComponent(_service, http) {
        this._service = _service;
        this.http = http;
        this.nvd3LineData = [];
    }
    GraphTileWidgetComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service = this._service.getChartSampleData().subscribe(function (d) {
            _this.timeout = setTimeout(function () {
                _this.nvd3LineData = d.nvd3.productRevenue;
                _this.nvd3LineOptions = {
                    chart: {
                        type: 'lineChart',
                        color: [
                            pg.getColor('success')
                        ],
                        x: function (d) { return d[0]; },
                        y: function (d) { return d[1] / 100; },
                        forceY: [0, 2],
                        tooltip: {
                            chartContainer: "#widget-4-container"
                        },
                        useInteractiveGuideline: false,
                        margin: {
                            top: 60,
                            right: -10,
                            bottom: -10,
                            left: -10
                        },
                        showLegend: false
                    }
                };
            }, 1000);
        });
    };
    GraphTileWidgetComponent.prototype.ngOnDestroy = function () {
        this.service.unsubscribe();
        clearTimeout(this.timeout);
    };
    GraphTileWidgetComponent = __decorate([
        core_1.Component({
            selector: 'graph-tile-widget',
            templateUrl: './graph-tile-widget.component.html',
            styleUrls: ['./graph-tile-widget.component.scss'],
            providers: [graph_tile_widget_service_1.GraphTileWidgetService],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [graph_tile_widget_service_1.GraphTileWidgetService, http_1.HttpClient])
    ], GraphTileWidgetComponent);
    return GraphTileWidgetComponent;
}());
exports.GraphTileWidgetComponent = GraphTileWidgetComponent;
//# sourceMappingURL=graph-tile-widget.component.js.map