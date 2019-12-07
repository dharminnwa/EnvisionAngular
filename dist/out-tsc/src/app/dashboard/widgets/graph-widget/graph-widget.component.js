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
var graph_widget_service_1 = require("./graph-widget.service");
var GraphWidgetComponent = (function () {
    function GraphWidgetComponent(_service) {
        this._service = _service;
        this.nvd3LineData = [];
        this._emphasize = false;
        this._chartWrapperClass = "col-xlg-8 col-lg-12";
        this._chartHighlightsClass = "col-xlg-4 visible-xlg";
        this.COLOR_SUCCESS = pg.getColor('success');
        this.COLOR_DANGER = pg.getColor('danger');
        this.COLOR_PRIMARY = pg.getColor('primary');
        this.COLOR_COMPLETE = pg.getColor('complete');
    }
    GraphWidgetComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service = this._service.getChartSampleData().subscribe(function (d) {
            _this.timeout = setTimeout(function () {
                _this.nvd3LineData = d.nvd3.line;
                _this.nvd3LineOptions = {
                    chart: {
                        type: 'lineChart',
                        color: [
                            _this.COLOR_SUCCESS,
                            _this.COLOR_DANGER,
                            _this.COLOR_PRIMARY,
                            _this.COLOR_COMPLETE,
                        ],
                        x: function (d) { return d[0]; },
                        y: function (d) { return d[1]; },
                        // duration: 500,
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
            }, 1000);
        });
    };
    GraphWidgetComponent.prototype.ngAfterViewInit = function () {
        setTimeout(function () {
            window.dispatchEvent(new Event('resize'));
        }, 3000);
    };
    GraphWidgetComponent.prototype.ngOnDestroy = function () {
        this.service.unsubscribe();
        clearTimeout(this.timeout);
    };
    Object.defineProperty(GraphWidgetComponent.prototype, "Emphasize", {
        set: function (value) {
            this._emphasize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphWidgetComponent.prototype, "ChartWrapperClass", {
        set: function (value) {
            this._chartWrapperClass = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphWidgetComponent.prototype, "ChartHighlightsClass", {
        set: function (value) {
            this._chartHighlightsClass = value;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], GraphWidgetComponent.prototype, "Emphasize", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], GraphWidgetComponent.prototype, "ChartWrapperClass", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], GraphWidgetComponent.prototype, "ChartHighlightsClass", null);
    GraphWidgetComponent = __decorate([
        core_1.Component({
            selector: 'graph-widget',
            templateUrl: './graph-widget.component.html',
            styleUrls: ['./graph-widget.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [graph_widget_service_1.GraphWidgetService]
        }),
        __metadata("design:paramtypes", [graph_widget_service_1.GraphWidgetService])
    ], GraphWidgetComponent);
    return GraphWidgetComponent;
}());
exports.GraphWidgetComponent = GraphWidgetComponent;
//# sourceMappingURL=graph-widget.component.js.map