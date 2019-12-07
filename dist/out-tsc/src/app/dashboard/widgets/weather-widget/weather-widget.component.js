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
var WeatherWidgetComponent = (function () {
    function WeatherWidgetComponent() {
        this._type = '';
    }
    Object.defineProperty(WeatherWidgetComponent.prototype, "Type", {
        set: function (value) {
            this._type = value;
        },
        enumerable: true,
        configurable: true
    });
    WeatherWidgetComponent.prototype.ngOnInit = function () {
    };
    WeatherWidgetComponent.prototype.ngAfterViewInit = function () {
        var icons = new Skycons();
        icons.set("clear-day", Skycons.CLEAR_DAY);
        icons.set("partly-cloudy-day", Skycons.PARTLY_CLOUDY_DAY);
        icons.set("cloudy", Skycons.CLOUDY);
        icons.set("rain", Skycons.RAIN);
        icons.set("sleet", Skycons.SLEET);
        icons.set("snow", Skycons.SNOW);
        icons.set("wind", Skycons.WIND);
        icons.set("rain2", Skycons.RAIN);
        icons.set("sleet2", Skycons.SLEET);
        icons.set("wind2", Skycons.SNOW);
        icons.set("rain3", Skycons.RAIN);
        icons.set("sleet3", Skycons.SLEET);
        icons.set("wind3", Skycons.SNOW);
        // icons.play();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], WeatherWidgetComponent.prototype, "Type", null);
    WeatherWidgetComponent = __decorate([
        core_1.Component({
            selector: 'weather-widget',
            templateUrl: './weather-widget.component.html',
            styleUrls: ['./weather-widget.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], WeatherWidgetComponent);
    return WeatherWidgetComponent;
}());
exports.WeatherWidgetComponent = WeatherWidgetComponent;
//# sourceMappingURL=weather-widget.component.js.map