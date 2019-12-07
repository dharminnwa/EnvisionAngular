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
var forms_1 = require("@angular/forms");
var moment = require("moment");
var dropdown_animations_1 = require("../../animations/dropdown-animations");
var request_animation_1 = require("../util/request-animation");
var convert_1 = require("../util/convert");
var pgTimePickerInnerComponent = (function () {
    function pgTimePickerInnerComponent(_cdr) {
        this._cdr = _cdr;
        this._disabled = false;
        this._hideDisabledOptions = false;
        this._now = new Date();
        this._open = false;
        this._hourList = [];
        this._minuteList = [];
        this._secondList = [];
        this._value = null;
        this._selectedHour = moment(this._now).hours();
        this._selectedMinute = moment(this._now).minutes();
        this._selectedSecond = moment(this._now).seconds();
        this._format = 'HH:mm:ss';
        this._showHour = this._format.indexOf('HH') > -1;
        this._showMinute = this._format.indexOf('mm') > -1;
        this._showSecond = this._format.indexOf('ss') > -1;
        this._width = (+this._showHour + +this._showMinute + +this._showSecond) * 56 + 1 + "px";
        // ngModel Access
        this.onChange = function () { return null; };
        this.onTouched = function () { return null; };
        this.PlaceHolder = "Select Time";
        this.Size = 'default';
    }
    pgTimePickerInnerComponent_1 = pgTimePickerInnerComponent;
    Object.defineProperty(pgTimePickerInnerComponent.prototype, "HideDisabledOptions", {
        get: function () {
            return this._hideDisabledOptions;
        },
        set: function (value) {
            this._hideDisabledOptions = convert_1.toBoolean(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(pgTimePickerInnerComponent.prototype, "DisabledHours", {
        get: function () {
            return this._DisabledHours;
        },
        set: function (fun) {
            this._DisabledHours = fun;
            this._buildHours();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(pgTimePickerInnerComponent.prototype, "Disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = convert_1.toBoolean(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(pgTimePickerInnerComponent.prototype, "Format", {
        get: function () {
            return this._format;
        },
        set: function (value) {
            this._format = value;
            this._showHour = this._format.indexOf('HH') > -1;
            this._showMinute = this._format.indexOf('mm') > -1;
            this._showSecond = this._format.indexOf('ss') > -1;
            this._width = (+this._showHour + +this._showMinute + +this._showSecond) * 56 + 1 + "px";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(pgTimePickerInnerComponent.prototype, "Value", {
        get: function () {
            return this._value || this._now;
        },
        set: function (value) {
            if (this._value === value) {
                return;
            }
            this._value = value;
            this._selectedHour = moment(this.Value).hours();
            this._selectedMinute = moment(this.Value).minutes();
            this._selectedSecond = moment(this.Value).seconds();
        },
        enumerable: true,
        configurable: true
    });
    pgTimePickerInnerComponent.prototype._scrollToSelected = function (instance, index, duration, unit) {
        if (duration === void 0) { duration = 0; }
        var _transIndex = this._translateIndex(index, unit);
        var currentOption = (instance.children[0].children[_transIndex] || instance.children[0].children[0]);
        this.scrollTo(instance, currentOption.offsetTop, duration);
    };
    // got from rc-timepicker
    pgTimePickerInnerComponent.prototype.scrollTo = function (element, to, duration) {
        var _this = this;
        if (duration <= 0) {
            element.scrollTop = to;
            return;
        }
        var difference = to - element.scrollTop;
        var perTick = difference / duration * 10;
        request_animation_1.reqAnimFrame(function () {
            element.scrollTop = element.scrollTop + perTick;
            if (element.scrollTop === to) {
                return;
            }
            _this.scrollTo(element, to, duration - 10);
        });
    };
    pgTimePickerInnerComponent.prototype._selectHour = function (instance, index, disabled) {
        if (disabled) {
            return;
        }
        this._scrollToSelected(instance, index, 120, 'hour');
        this._selectedHour = index;
        this.Value = moment(this.Value).hour(index).toDate();
        this.onChange(this._value);
        this._buildMinutes();
        this._buildSeconds();
    };
    pgTimePickerInnerComponent.prototype._selectMinute = function (instance, index, disabled) {
        if (disabled) {
            return;
        }
        this._scrollToSelected(instance, index, 120, 'minute');
        this._selectedMinute = index;
        this.Value = moment(this.Value).minute(index).toDate();
        this.onChange(this._value);
        this._buildSeconds();
    };
    pgTimePickerInnerComponent.prototype._selectSecond = function (instance, index, disabled) {
        if (disabled) {
            return;
        }
        this._scrollToSelected(instance, index, 120, 'second');
        this._selectedSecond = index;
        this.Value = moment(this.Value).second(index).toDate();
        this.onChange(this._value);
    };
    pgTimePickerInnerComponent.prototype._translateIndex = function (index, unit) {
        if (!this.HideDisabledOptions) {
            return index;
        }
        if (unit === 'hour') {
            var disabledHours = this.DisabledHours && this.DisabledHours();
            return this._calcIndex(disabledHours, index);
        }
        else if (unit === 'minute') {
            var disabledMinutes = this.DisabledMinutes && this.DisabledMinutes(this._selectedHour);
            return this._calcIndex(disabledMinutes, index);
        }
        else if (unit === 'second') {
            var disabledSeconds = this.DisabledSeconds && this.DisabledSeconds(this._selectedHour, this._selectedMinute);
            return this._calcIndex(disabledSeconds, index);
        }
    };
    pgTimePickerInnerComponent.prototype._calcIndex = function (array, index) {
        if (array && array.length) {
            return index - array.reduce(function (pre, value) {
                return pre + (value < index ? 1 : 0);
            }, 0);
        }
        else {
            return index;
        }
    };
    pgTimePickerInnerComponent.prototype._initPosition = function () {
        this._selectedHour = moment(this.Value).hours();
        this._selectedMinute = moment(this.Value).minutes();
        this._selectedSecond = moment(this.Value).seconds();
        if (this._showHour) {
            this._scrollToSelected(this._hourListInstance.nativeElement, this._selectedHour, 0, 'hour');
        }
        if (this._showMinute) {
            this._scrollToSelected(this._minuteListInstance.nativeElement, this._selectedMinute, 0, 'minute');
        }
        if (this._showSecond) {
            this._scrollToSelected(this._secondListInstance.nativeElement, this._selectedSecond, 0, 'second');
        }
    };
    pgTimePickerInnerComponent.prototype._buildTime = function () {
        this._buildHours();
        this._buildMinutes();
        this._buildSeconds();
    };
    pgTimePickerInnerComponent.prototype._buildHours = function () {
        this._hourList = [];
        for (var i = 0; i <= 23; i++) {
            this._hourList.push({
                disabled: this.DisabledHours && (this.DisabledHours().indexOf(i) !== -1),
                name: i.toString().length === 1 ? ('0' + i) : ('' + i),
                index: i
            });
        }
    };
    pgTimePickerInnerComponent.prototype._buildMinutes = function () {
        this._minuteList = [];
        for (var i = 0; i <= 59; i++) {
            this._minuteList.push({
                disabled: this.DisabledMinutes && (this.DisabledMinutes(this._selectedHour).indexOf(i) !== -1),
                name: i.toString().length === 1 ? ('0' + i) : ('' + i),
                index: i
            });
        }
    };
    pgTimePickerInnerComponent.prototype._buildSeconds = function () {
        this._secondList = [];
        for (var i = 0; i <= 59; i++) {
            this._secondList.push({
                disabled: this.DisabledSeconds && (this.DisabledSeconds(this._selectedHour, this._selectedMinute).indexOf(i) !== -1),
                name: i.toString().length === 1 ? ('0' + i) : ('' + i),
                index: i
            });
        }
    };
    pgTimePickerInnerComponent.prototype.writeValue = function (value) {
        this.Value = value;
    };
    pgTimePickerInnerComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    pgTimePickerInnerComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    pgTimePickerInnerComponent.prototype.setDisabledState = function (isDisabled) {
        this.Disabled = isDisabled;
    };
    pgTimePickerInnerComponent.prototype.ngOnInit = function () {
        this._buildTime();
    };
    __decorate([
        core_1.ViewChild('hourListInstance'),
        __metadata("design:type", Object)
    ], pgTimePickerInnerComponent.prototype, "_hourListInstance", void 0);
    __decorate([
        core_1.ViewChild('minuteListInstance'),
        __metadata("design:type", Object)
    ], pgTimePickerInnerComponent.prototype, "_minuteListInstance", void 0);
    __decorate([
        core_1.ViewChild('inputTimeInstance'),
        __metadata("design:type", Object)
    ], pgTimePickerInnerComponent.prototype, "_inputTimeInstance", void 0);
    __decorate([
        core_1.ViewChild('secondListInstance'),
        __metadata("design:type", Object)
    ], pgTimePickerInnerComponent.prototype, "_secondListInstance", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], pgTimePickerInnerComponent.prototype, "HideDisabledOptions", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], pgTimePickerInnerComponent.prototype, "PlaceHolder", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], pgTimePickerInnerComponent.prototype, "Size", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function])
    ], pgTimePickerInnerComponent.prototype, "DisabledHours", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Function)
    ], pgTimePickerInnerComponent.prototype, "DisabledMinutes", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Function)
    ], pgTimePickerInnerComponent.prototype, "DisabledSeconds", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], pgTimePickerInnerComponent.prototype, "Disabled", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], pgTimePickerInnerComponent.prototype, "Format", null);
    pgTimePickerInnerComponent = pgTimePickerInnerComponent_1 = __decorate([
        core_1.Component({
            selector: 'pg-timepicker-inner',
            encapsulation: core_1.ViewEncapsulation.None,
            template: "\n    <span\n      class=\"time-picker\"\n      [ngClass]=\"{'ant-time-picker-large':Size=='large','ant-time-picker-small':Size=='small'}\">\n      <div\n        class=\"time-picker-panel\"\n        [@dropDownAnimation]=\"'bottom'\">\n        <div class=\"time-picker-inner\"\n          [class.time-picker-column-3]=\"_showHour&&_showMinute&&_showSecond\"\n          [class.time-picker-column-2]=\"_showHour&&_showMinute&&!_showSecond\"\n          [class.time-picker-column-1]=\"_showHour&&(!_showMinute)&&(!_showSecond)\">\n        <div class=\"time-picker-combobox\">\n          <div\n            class=\"time-picker-select\"\n            #hourListInstance\n            *ngIf=\"_showHour\">\n            <ul>\n              <ng-template\n                ngFor\n                let-_hour\n                [ngForOf]=\"_hourList\"\n                let-i=\"index\">\n                 <li\n                   [ngClass]=\"_hour.name\"\n                   *ngIf=\"!(HideDisabledOptions&&_hour.disabled)\"\n                   [class.option-selected]=\"_hour.index===_selectedHour\"\n                   [class.option-disabled]=\"_hour.disabled\"\n                   (click)=\"_selectHour(hourListInstance,_hour.index,_hour.disabled)\">\n                   {{ _hour.name }}\n                 </li>\n              </ng-template>\n            </ul>\n          </div>\n          <div\n            class=\"time-picker-select\"\n            #minuteListInstance\n            *ngIf=\"_showMinute\">\n            <ul>\n              <ng-template\n                ngFor\n                let-_minute\n                [ngForOf]=\"_minuteList\"\n                let-i=\"index\">\n                 <li\n                   [ngClass]=\"_minute.name\"\n                   *ngIf=\"!(HideDisabledOptions&&_minute.disabled)\"\n                   [class.option-selected]=\"_minute.index===_selectedMinute\"\n                   [class.option-disabled]=\"_minute.disabled\"\n                   (click)=\"_selectMinute(minuteListInstance,_minute.index,_minute.disabled)\">\n                   {{ _minute.name }}\n                 </li>\n              </ng-template>\n            </ul>\n          </div>\n          <div\n            class=\"time-picker-select\"\n            #secondListInstance\n            *ngIf=\"_showSecond\">\n            <ul>\n              <ng-template\n                ngFor\n                let-_second\n                [ngForOf]=\"_secondList\"\n                let-i=\"index\">\n                 <li\n                   [ngClass]=\"_second.name\"\n                   *ngIf=\"!(HideDisabledOptions&&_second.disabled)\"\n                   [class.option-selected]=\"_second.index===_selectedSecond\"\n                   [class.option-disabled]=\"_second.disabled\"\n                   (click)=\"_selectSecond(secondListInstance,_second.index,_second.disabled)\">\n                   {{ _second.name }}\n                 </li>\n              </ng-template>\n            </ul>\n          </div>\n        </div>\n      </div>\n      </div>\n    </span>",
            animations: [
                dropdown_animations_1.dropDownAnimation
            ],
            providers: [
                {
                    provide: forms_1.NG_VALUE_ACCESSOR,
                    useExisting: core_1.forwardRef(function () { return pgTimePickerInnerComponent_1; }),
                    multi: true
                }
            ],
            styleUrls: ['./timepicker.scss']
        }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
    ], pgTimePickerInnerComponent);
    return pgTimePickerInnerComponent;
    var pgTimePickerInnerComponent_1;
}());
exports.pgTimePickerInnerComponent = pgTimePickerInnerComponent;
//# sourceMappingURL=timepicker-inner.component.js.map