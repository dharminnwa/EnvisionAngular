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
var RealtimeWidgetComponent = (function () {
    function RealtimeWidgetComponent() {
        this.timeouts = [];
        this.chartData = [{
                "key": "Web Server",
                "values": [],
            },
            {
                "key": "DB Server",
                "values": [],
            }];
    }
    RealtimeWidgetComponent.prototype.ngOnInit = function () {
    };
    RealtimeWidgetComponent.prototype.updateChart = function () {
        var _this = this;
        this.timeouts.push(setTimeout(function () {
            var data = [[], []];
            var max = 50;
            var min = 30;
            var x = [0, Math.round(Math.random() * (max - min) + min)];
            var y = [2, Math.round(Math.random() * (max - min) + min)];
            _this.chartData[0]["values"].shift();
            _this.chartData[1]["values"].shift();
            _this.chartData[0]["values"].push(x);
            _this.chartData[1]["values"].push(y);
            _this.updateChart();
        }, 1000));
    };
    RealtimeWidgetComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var data = [[], []];
        var max = 50;
        var min = 30;
        for (var i = 0; i < 30; i++) {
            var x = [i, Math.round(Math.random() * (max - min) + min)];
            data[0].push(x);
            x = [i, Math.round(Math.random() * (max - min) + min)];
            data[1].push(x);
        }
        this.chartData[0]["values"] = data[0];
        this.chartData[1]["values"] = data[1];
        setTimeout(function () {
            _this.chartOptions = {
                chart: {
                    type: 'stackedAreaChart',
                    color: [
                        pg.getColor('success'),
                        pg.getColor('master-light')
                    ],
                    x: function (d) { return d[0]; },
                    y: function (d) { return d[1]; },
                    interpolate: "cardinal",
                    yAxis: {
                        ticks: 2
                    },
                    showControls: false,
                    clipEdge: false,
                    useInteractiveGuideline: false,
                    margin: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                    showLegend: false,
                    showXAxis: false,
                    showYAxis: true,
                    interactive: true
                }
            };
        }, 2000);
        this.timeouts.push(setTimeout(function () {
            window.dispatchEvent(new Event('resize'));
            // Enable to simulate real time chart
            //this.updateChart();
        }, 1000));
    };
    RealtimeWidgetComponent.prototype.ngOnDestroy = function () {
        for (var _i = 0, _a = this.timeouts; _i < _a.length; _i++) {
            var timeout = _a[_i];
            clearTimeout(timeout);
        }
    };
    RealtimeWidgetComponent = __decorate([
        core_1.Component({
            selector: 'realtime-widget',
            templateUrl: './realtime-widget.component.html',
            styleUrls: ['./realtime-widget.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [])
    ], RealtimeWidgetComponent);
    return RealtimeWidgetComponent;
}());
exports.RealtimeWidgetComponent = RealtimeWidgetComponent;
//# sourceMappingURL=realtime-widget.component.js.map