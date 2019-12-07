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
var GraphTileFlatWidgetComponent = (function () {
    function GraphTileFlatWidgetComponent() {
        this.chartData = [{
                "key": "Site visits",
                "values": [
                    [100, 0],
                    [150, 8],
                    [200, 20],
                    [250, 22],
                    [300, 30],
                    [350, 26],
                    [400, 10]
                ]
            }];
        this._bgColor = 'bg-success';
        this._pointColor = 'success';
    }
    GraphTileFlatWidgetComponent.prototype.ngOnInit = function () {
    };
    GraphTileFlatWidgetComponent.prototype.ngOnDestroy = function () {
        clearTimeout(this.timeout);
    };
    GraphTileFlatWidgetComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.timeout = setTimeout(function () {
            _this.chartOptions = {
                chart: {
                    type: 'lineChart',
                    color: [
                        ['#000']
                    ],
                    x: function (d) { return d[0]; },
                    y: function (d) { return d[1]; },
                    tooltip: {
                        enabled: false
                    },
                    useInteractiveGuideline: false,
                    clipEdge: false,
                    margin: {
                        top: 10,
                        right: -10,
                        bottom: -13,
                        left: -10
                    },
                    showLegend: false,
                    showXAxis: false,
                    showYAxis: false,
                    showLegen: false,
                    interactive: false
                }
            };
        });
    };
    Object.defineProperty(GraphTileFlatWidgetComponent.prototype, "BgColor", {
        set: function (value) {
            this._bgColor = value;
            this._pointColor = value.replace('bg-', '');
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], GraphTileFlatWidgetComponent.prototype, "BgColor", null);
    GraphTileFlatWidgetComponent = __decorate([
        core_1.Component({
            selector: 'graph-tile-flat-widget',
            templateUrl: './graph-tile-flat-widget.component.html',
            styleUrls: ['./graph-tile-flat-widget.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [])
    ], GraphTileFlatWidgetComponent);
    return GraphTileFlatWidgetComponent;
}());
exports.GraphTileFlatWidgetComponent = GraphTileFlatWidgetComponent;
//# sourceMappingURL=graph-tile-flat-widget.component.js.map