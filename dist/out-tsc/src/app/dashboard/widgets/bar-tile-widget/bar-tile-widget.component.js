"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var BarTileWidgetComponent = (function () {
    function BarTileWidgetComponent() {
        this.chartData = [{
                "key": "Site visits",
                "values": [
                    [1, 10],
                    [2, 8],
                    [3, 5],
                    [4, 9],
                    [5, 5],
                    [6, 8],
                    [7, 10],
                ],
            },
            {
                "key": "Site new",
                "values": [
                    [1, 0],
                    [2, 2],
                    [3, 5],
                    [4, 1],
                    [5, 5],
                    [6, 2],
                    [7, 0],
                ],
            }];
    }
    BarTileWidgetComponent.prototype.ngOnInit = function () {
    };
    BarTileWidgetComponent.prototype.ngOnDestroy = function () {
        clearTimeout(this.timeout);
    };
    BarTileWidgetComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.timeout = setTimeout(function () {
            _this.chartOptions = {
                chart: {
                    type: 'multiBarChart',
                    color: [
                        pg.getColor('danger'),
                        pg.getColor('master-light')
                    ],
                    x: function (d) { return d[0]; },
                    y: function (d) { return d[1]; },
                    multibar: {
                        stacked: true
                    },
                    showControls: false,
                    useInteractiveGuideline: false,
                    tooltip: {
                        enabled: false
                    },
                    margin: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                    groupSpacing: 0.7,
                    yDomain: [0, 10],
                    showLegend: false,
                    showXAxis: false,
                    showYAxis: false,
                    interactive: false
                }
            };
        }, 2000);
    };
    BarTileWidgetComponent = __decorate([
        core_1.Component({
            selector: 'bar-tile-widget',
            templateUrl: './bar-tile-widget.component.html',
            styleUrls: ['./bar-tile-widget.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], BarTileWidgetComponent);
    return BarTileWidgetComponent;
}());
exports.BarTileWidgetComponent = BarTileWidgetComponent;
//# sourceMappingURL=bar-tile-widget.component.js.map