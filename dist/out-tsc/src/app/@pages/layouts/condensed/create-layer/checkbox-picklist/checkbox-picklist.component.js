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
var CheckboxPicklistComponent = (function () {
    function CheckboxPicklistComponent() {
        this.lessThenText = '<';
        this.dataToDisplay = [];
        this.displayCount = 200;
        this.take = this.displayCount;
        this.skip = 0;
        this._sourceList = [];
        this.isTargetSelectAll = true;
        this.isSourceSelectAll = true;
        this.isFilterable = false;
        this.isLazyLoad = false;
        this.currentTab = 'Pipelines';
        this.OnChangeList = new core_1.EventEmitter();
        this.sourceSelectAll = false;
        this.targetSelectAll = false;
        this.targetList = [];
    }
    Object.defineProperty(CheckboxPicklistComponent.prototype, "sourceList", {
        get: function () {
            return this._sourceList;
        },
        set: function (value) {
            this._sourceList = value;
            if (value && value.length >= 0) {
                this.FilterSourceList();
                this.skip = 0;
                this.take = this.displayCount;
                this.SortArrayByName(this.sourceList);
                this.dataToDisplay = this.sourceList.slice(this.skip, this.take);
                // this.SetDistinctValueosSourceList();
            }
        },
        enumerable: true,
        configurable: true
    });
    CheckboxPicklistComponent.prototype.ngOnInit = function () {
    };
    CheckboxPicklistComponent.prototype.FilterSourceList = function () {
        var _this = this;
        var deleteIndexs = [];
        if (this.targetList.length == 0)
            return;
        this.sourceList.forEach(function (x) {
            var itemIndex = _this.targetList.findIndex(function (y) { return y.name == x.name && y.id == x.id; });
            if (itemIndex > -1)
                deleteIndexs.push(itemIndex);
        });
        deleteIndexs.reverse();
        deleteIndexs.forEach(function (x) {
            _this.sourceList.splice(x, 1);
        });
    };
    CheckboxPicklistComponent.prototype.MoveToSourceList = function () {
        if (this.targetList && this.targetList.length > 0) {
            var selectedVal = this.targetList.filter(function (x) { return x.isChecked == true; });
            this.AddToList(selectedVal, this.sourceList);
            this.RemoveFromList(selectedVal, this.targetList);
            this.SetDisplayList();
        }
        this.OnChangeList.emit(this.targetList);
        this.sourceSelectAll = false;
        this.targetSelectAll = false;
    };
    CheckboxPicklistComponent.prototype.MoveToTargetList = function () {
        if (this.sourceList && this.sourceList.length > 0) {
            var selectedVal = this.sourceList.filter(function (x) { return x.isChecked == true; });
            this.AddToList(selectedVal, this.targetList);
            this.RemoveFromList(selectedVal, this.sourceList);
            this.SetDisplayList();
        }
        this.OnChangeList.emit(this.targetList);
        this.sourceSelectAll = false;
        this.targetSelectAll = false;
    };
    CheckboxPicklistComponent.prototype.AddToList = function (items, List) {
        if (!List)
            List = [];
        if (items && items.length > 0) {
            items.forEach(function (x) {
                x.isChecked = false;
                List.push(x);
            });
            this.SortArrayByName(List);
        }
    };
    CheckboxPicklistComponent.prototype.RemoveFromList = function (items, List) {
        if (List && List.length > 0 && items && items.length > 0) {
            items.forEach(function (x) {
                var index = List.findIndex(function (y) { return y.id == x.id; });
                if (index != -1) {
                    List.splice(index, 1);
                }
            });
        }
    };
    CheckboxPicklistComponent.prototype.SortArrayByName = function (List) {
        if (List && List.length > 0) {
            List.sort(function (a, b) {
                if (a['name'] < b['name']) {
                    return -1;
                }
                else if (a['name'] > b['name']) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        }
    };
    CheckboxPicklistComponent.prototype.SelectAllSourceList = function () {
        this.sourceSelectAll = !this.sourceSelectAll;
        if (this.sourceSelectAll == true) {
            this.sourceList.forEach(function (x) {
                x.isChecked = true;
            });
        }
        else {
            this.sourceList.forEach(function (x) {
                x.isChecked = false;
            });
        }
    };
    CheckboxPicklistComponent.prototype.SelectAllTargetList = function () {
        this.targetSelectAll = !this.targetSelectAll;
        if (this.targetSelectAll == true) {
            this.targetList.forEach(function (x) {
                x.isChecked = true;
            });
        }
        else {
            this.targetList.forEach(function (x) {
                x.isChecked = false;
            });
        }
    };
    CheckboxPicklistComponent.prototype.SetDisplayList = function () {
        this.dataToDisplay = this.sourceList.slice(0, this.displayCount);
    };
    CheckboxPicklistComponent.prototype.onScroll = function () {
        this.take = this.take + this.displayCount;
        this.skip = this.take - this.displayCount;
        if (this.skip < this.sourceList.length) {
            var data = this.sourceList.slice(this.skip, this.take);
            this.dataToDisplay = this.dataToDisplay.concat(data);
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], CheckboxPicklistComponent.prototype, "sourceList", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CheckboxPicklistComponent.prototype, "listName", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CheckboxPicklistComponent.prototype, "singularName", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CheckboxPicklistComponent.prototype, "isTargetSelectAll", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CheckboxPicklistComponent.prototype, "isSourceSelectAll", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CheckboxPicklistComponent.prototype, "isFilterable", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CheckboxPicklistComponent.prototype, "isLazyLoad", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CheckboxPicklistComponent.prototype, "currentTab", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], CheckboxPicklistComponent.prototype, "OnChangeList", void 0);
    CheckboxPicklistComponent = __decorate([
        core_1.Component({
            selector: 'app-checkbox-picklist',
            templateUrl: './checkbox-picklist.component.html',
            styleUrls: ['./checkbox-picklist.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], CheckboxPicklistComponent);
    return CheckboxPicklistComponent;
}());
exports.CheckboxPicklistComponent = CheckboxPicklistComponent;
//# sourceMappingURL=checkbox-picklist.component.js.map