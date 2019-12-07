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
var GraphOptionsWidgetComponent = (function () {
    function GraphOptionsWidgetComponent() {
        this.nvd3LineData = [{
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
    }
    GraphOptionsWidgetComponent.prototype.ngOnInit = function () {
    };
    GraphOptionsWidgetComponent.prototype.ngOnDestroy = function () {
        clearTimeout(this.timer);
    };
    GraphOptionsWidgetComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.timer = setTimeout(function () {
            _this.nvd3LineOptions = {
                chart: {
                    type: 'lineChart',
                    color: [
                        ['#27cebc']
                    ],
                    x: function (d) { return d[0]; },
                    y: function (d) { return d[1]; },
                    useInteractiveGuideline: true,
                    clipEdge: false,
                    margin: {
                        top: 10,
                        right: -10,
                        bottom: 10,
                        left: -10
                    },
                    showLegend: false,
                    showXAxis: false,
                    showYAxis: false,
                }
            };
        }, 2000);
    };
    GraphOptionsWidgetComponent = __decorate([
        core_1.Component({
            selector: 'graph-options-widget',
            templateUrl: './graph-options-widget.component.html',
            styleUrls: ['./graph-options-widget.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [])
    ], GraphOptionsWidgetComponent);
    return GraphOptionsWidgetComponent;
}());
exports.GraphOptionsWidgetComponent = GraphOptionsWidgetComponent;
//# sourceMappingURL=graph-options-widget.component.js.map