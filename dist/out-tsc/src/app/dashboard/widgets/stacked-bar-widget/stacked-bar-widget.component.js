"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var StackedBarWidgetComponent = (function () {
    function StackedBarWidgetComponent() {
        this.chartData = [{
                "key": "New Users",
                "values": [],
            },
            {
                "key": "Returning Users",
                "values": [],
            }];
    }
    StackedBarWidgetComponent.prototype.ngOnInit = function () {
        //Generate Random Data
        var data = [[], []];
        var max = 90;
        var min = 80;
        for (var i = 0; i < 40; i++) {
            var x = [i, Math.round(Math.random() * (max - min) + min)];
            data[0].push(x);
            x = [i, Math.round(Math.random() * (max - min) + min)];
            data[1].push(x);
        }
        this.chartData[0]["values"] = data[0];
        this.chartData[1]["values"] = data[1];
    };
    StackedBarWidgetComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.timeout = setTimeout(function () {
            _this.chartOptions = {
                chart: {
                    type: 'multiBarChart',
                    color: [
                        pg.getColor('complete'),
                        pg.getColor('master-light')
                    ],
                    x: function (d) { return d[0]; },
                    y: function (d) { return d[1]; },
                    multibar: {
                        stacked: true
                    },
                    showControls: false,
                    useInteractiveGuideline: false,
                    margin: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                    yDomain: [0, 200],
                    showLegend: false,
                    showXAxis: false,
                    showYAxis: false,
                    interactive: false
                }
            };
        }, 2000);
    };
    StackedBarWidgetComponent.prototype.ngOnDestroy = function () {
        clearTimeout(this.timeout);
    };
    StackedBarWidgetComponent = __decorate([
        core_1.Component({
            selector: 'stacked-bar-widget',
            templateUrl: './stacked-bar-widget.component.html',
            styleUrls: ['./stacked-bar-widget.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], StackedBarWidgetComponent);
    return StackedBarWidgetComponent;
}());
exports.StackedBarWidgetComponent = StackedBarWidgetComponent;
//# sourceMappingURL=stacked-bar-widget.component.js.map