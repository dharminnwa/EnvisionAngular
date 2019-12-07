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
var graph_widget_service_1 = require("./graph-widget.service");
var GraphWidgetBasicComponent = (function () {
    function GraphWidgetBasicComponent(_service, http) {
        this._service = _service;
        this.http = http;
        this.nvd3LineData = [];
    }
    GraphWidgetBasicComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service = this._service.getChartSampleData().subscribe(function (d) {
            _this.nvd3LineData = d.nvd3.line;
            setTimeout(function () {
                _this.nvd3LineOptions = {
                    chart: {
                        type: 'lineChart',
                        color: [
                            pg.getColor('success'),
                            pg.getColor('danger'),
                            pg.getColor('primary'),
                            pg.getColor('complete'),
                        ],
                        x: function (d) { return d[0]; },
                        y: function (d) { return d[1]; },
                        duration: 500,
                        clipEdge: true,
                        useInteractiveGuideline: true,
                        margin: {
                            left: 30,
                            bottom: 35
                        },
                        showLegend: false,
                        xAxis: {
                            tickFormat: function (d) {
                                return d3.time.format('%a')(new Date(d));
                            }
                        },
                        yAxis: {
                            tickFormat: function (d) {
                                return Math.round(d);
                            }
                        }
                    }
                };
            });
        });
    };
    GraphWidgetBasicComponent.prototype.ngOnDestroy = function () {
        this.service.unsubscribe();
    };
    GraphWidgetBasicComponent = __decorate([
        core_1.Component({
            selector: 'graph-widget-basic',
            templateUrl: './graph-widget-basic.component.html',
            styleUrls: ['./graph-widget-basic.component.scss'],
            providers: [graph_widget_service_1.GraphWidgetService],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [graph_widget_service_1.GraphWidgetService, http_1.HttpClient])
    ], GraphWidgetBasicComponent);
    return GraphWidgetBasicComponent;
}());
exports.GraphWidgetBasicComponent = GraphWidgetBasicComponent;
//# sourceMappingURL=graph-widget-basic.component.js.map