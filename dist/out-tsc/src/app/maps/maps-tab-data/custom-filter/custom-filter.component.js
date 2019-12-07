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
var map_service_service_1 = require("../../../services/map-service.service");
var all_http_request_service_1 = require("../../../services/all-http-request.service");
var CustomFilterComponent = (function () {
    function CustomFilterComponent(mapService, httpRequest, cdRef) {
        this.mapService = mapService;
        this.httpRequest = httpRequest;
        this.cdRef = cdRef;
        this.selectedValues = [];
        this.isSelectAll = false;
        this.filterText = '';
        this.distinctCheckboxList = [];
        this.AlldistinctCheckboxList = [];
        this.displayCount = 50;
        this.take = this.displayCount;
        this.skip = 0;
        this.options = [
            { name: "Is equal to", value: "#EQUAL#" },
            { name: "Is not equal to", value: "#NOTEQUAL#" },
            { name: "Contains", value: "#LIKE#" },
            { name: "Is less then", value: "<" },
            { name: "Is less then or equal to", value: "<=" },
            { name: "Is greater then", value: ">" },
            { name: "Is greater then or equal to", value: ">=" }
        ];
        this.optionCompare = [
            { name: "And", value: ";" },
            { name: "Or", value: "#OR#" }
        ];
        this.isLodaing = false;
        this.filter1Option = '#EQUAL#';
        this.filter1Val = '';
        this.bothFilterOption = ';';
        this.filter2Option = '#EQUAL#';
        this.filter2Val = '';
    }
    CustomFilterComponent.prototype.agInit = function (params) {
        this.params = params;
        this.valueGetter = params.valueGetter;
        this.GetFilterData();
    };
    CustomFilterComponent.prototype.GetFilterData = function () {
        var _this = this;
        this.isLodaing = true;
        this.mapService.CloseFilterOnToggle();
        var filedname = this.params.colDef.field;
        var TabList = this.mapService._GridTabData.getValue();
        var index = 0;
        for (var _i = 0, TabList_1 = TabList; _i < TabList_1.length; _i++) {
            var tab = TabList_1[_i];
            if (tab.ActiveClass == " active") {
                if (filedname == "Notes" && tab.energyLayer && tab.energyLayer.length > 0 && tab.energyLayer[0]) {
                    this.setNotesFilter(tab.energyLayer[0].EnergyLayerID);
                    return;
                }
                var default_filter = this.mapService.filterval(tab.IsFiltervalue);
                var cql_Filter = this.mapService.getForDistinctCqlFilter(default_filter, false);
                var lastIndexval = 60000;
                if (tab.EnergylayersavegridFilter.mapfilterval) {
                    this.params.context.thisComponent.ClearColumnEventListner(TabList, index);
                }
                if (tab.energyLayer && tab.energyLayer.length > 0 && tab.energyLayer[0]) {
                    this.httpRequest._NodeGetDatabasedonPropertyname(tab.energyLayer[0], 0, lastIndexval, cql_Filter, filedname, '', filedname, "")
                        .subscribe(function (data) {
                        if (data.features.length > 0) {
                            var checkBoxList = [];
                            var arr = data.features;
                            arr.forEach(function (x) {
                                if (x) {
                                    var item = {
                                        name: x,
                                        value: false
                                    };
                                    checkBoxList.push(item);
                                }
                            });
                            _this.SortArrayByName(checkBoxList);
                            _this.distinctCheckboxList = checkBoxList;
                            _this.AlldistinctCheckboxList = checkBoxList;
                            _this.distinctCheckboxList = _this.AlldistinctCheckboxList.slice(_this.skip, _this.take);
                            _this.isSelectAll = false;
                            _this.isLodaing = false;
                            _this.params.filterModifiedCallback();
                            _this.cdRef.detectChanges();
                        }
                        ;
                    }, function (error) {
                        console.log(error);
                        _this.isLodaing = false;
                    });
                }
            }
            index++;
        }
    };
    CustomFilterComponent.prototype.setNotesFilter = function (energyLayerId) {
        var NotesData = this.mapService.LodedIsNotesArray.getValue();
        var NotesItem = NotesData.find(function (x) { return x.energylayerId == energyLayerId; });
        if (NotesItem && NotesItem.NotesData && NotesItem.NotesData.length > 0) {
            var arr = this.GetDistinctNotes(NotesItem.NotesData);
            var checkBoxList_1 = [];
            arr.forEach(function (x) {
                if (x) {
                    var item = {
                        name: x,
                        value: false
                    };
                    checkBoxList_1.push(item);
                }
            });
            this.SortArrayByName(checkBoxList_1);
            this.distinctCheckboxList = checkBoxList_1;
            this.isLodaing = false;
            this.params.filterModifiedCallback();
            this.cdRef.detectChanges();
        }
    };
    CustomFilterComponent.prototype.GetDistinctNotes = function (arr) {
        var result = [];
        arr.forEach(function (x) {
            var item = result.find(function (y) { return y == x.NoteValue; });
            if (!item)
                result.push(x.NoteValue);
        });
        return result;
    };
    CustomFilterComponent.prototype.isFilterActive = function () {
        this.selectedValues = this.distinctCheckboxList.filter(function (x) { return x.value == true; });
        if (this.selectedValues && this.selectedValues.length > 0)
            return true;
        else
            return false;
    };
    CustomFilterComponent.prototype.doesFilterPass = function (params) {
        var _this = this;
        this.selectedValues = this.distinctCheckboxList.filter(function (x) { return x.value == true; });
        if (this.selectedValues && this.selectedValues.length > 0) {
            var val_1 = [];
            this.selectedValues.forEach(function (x) {
                val_1.push(x.name);
            });
            return val_1.every(function (filterWord) {
                return _this.valueGetter(params.node).toString().toLowerCase().indexOf(filterWord) >= 0;
            });
        }
        return false;
    };
    CustomFilterComponent.prototype.getModel = function () {
        //this.selectedValues = this.distinctCheckboxList.filter(x => x.value == true);
        this.selectedValues = this.AlldistinctCheckboxList.filter(function (x) { return x.value == true; });
        if ((this.selectedValues && this.selectedValues.length > 0) || (this.filter1Val.trim() != '' || this.filter2Val.trim() != '')) {
            var val_2 = [];
            this.selectedValues.forEach(function (x) {
                val_2.push(x.name);
            });
            var textFilterval = this.getTextFilterVal();
            return { values: val_2, textFilterVal: textFilterval };
        }
        else {
            return { values: [], textFilterVal: '' };
        }
    };
    CustomFilterComponent.prototype.setModel = function (model) {
        this.selectedValues = model ? model.values : [];
    };
    CustomFilterComponent.prototype.onChangeCheckboxVal = function (item) {
        this.isSelectAll = false;
        this.AlldistinctCheckboxList.forEach(function (x) {
            if (item.name == x.name) {
                x.value = item.value;
            }
        });
        this.params.filterChangedCallback();
    };
    CustomFilterComponent.prototype.filterClick = function () {
        this.params.filterChangedCallback();
    };
    CustomFilterComponent.prototype.onSelectAll = function () {
        if (this.isSelectAll == true) {
            this.UpdateAllCheckValue(true);
        }
        else {
            this.UpdateAllCheckValue(false);
        }
        this.cdRef.detectChanges();
        //this.params.filterChangedCallback();
    };
    CustomFilterComponent.prototype.UpdateAllCheckValue = function (val) {
        this.distinctCheckboxList.forEach(function (x) {
            x.value = val;
        });
        this.AlldistinctCheckboxList.forEach(function (x) {
            x.value = val;
        });
    };
    CustomFilterComponent.prototype.SortArrayByName = function (List) {
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
    CustomFilterComponent.prototype.onScroll = function () {
        var _this = this;
        this.take = this.take + this.displayCount;
        this.skip = this.take - this.displayCount;
        if (this.skip < this.AlldistinctCheckboxList.length) {
            var data = this.AlldistinctCheckboxList.slice(this.skip, this.take);
            data.forEach(function (x) {
                x.value = _this.isSelectAll;
            });
            this.distinctCheckboxList = this.distinctCheckboxList.concat(data);
        }
    };
    CustomFilterComponent.prototype.getTextFilterVal = function () {
        var filter = '';
        // if (this.filter1Val.trim() != '' || this.filter2Val.trim() != '') {
        //     filter += '( ';
        //     if (this.filter1Val.trim() != '') {
        //             filter += ' (' + this.params.colDef.field + ' ' + this.filter1Option + " '" + encodeURIComponent(this.filter1Val) + "' )";
        //     }
        //     if (filter != '( ' && this.filter2Val.trim() != '') {
        //         filter += ' ' + this.bothFilterOption + ' ';
        //     }
        //     if (this.filter2Val.trim() != '') {
        //             filter += ' (' + this.params.colDef.field + ' ' + this.filter2Option + " '" + encodeURIComponent(this.filter2Val) + "' )";
        //     }
        //     filter += ' )';
        // }
        if (this.filter1Val.trim() != '' || this.filter2Val.trim() != '') {
            // filter += '( ';
            if (this.filter1Val.trim() != '') {
                filter += this.params.colDef.field + this.filter1Option + this.filter1Val;
            }
            if (filter != '' && this.filter2Val.trim() != '') {
                filter += this.bothFilterOption;
            }
            if (this.filter2Val.trim() != '') {
                filter += this.params.colDef.field + this.filter2Option + this.filter2Val;
            }
            // filter += ' )';
        }
        return filter;
    };
    CustomFilterComponent = __decorate([
        core_1.Component({
            selector: 'app-custom-filter',
            templateUrl: './custom-filter.component.html',
            styleUrls: ['./custom-filter.component.scss']
        }),
        __metadata("design:paramtypes", [map_service_service_1.MapServiceService, all_http_request_service_1.HttpRequestService, core_1.ChangeDetectorRef])
    ], CustomFilterComponent);
    return CustomFilterComponent;
}());
exports.CustomFilterComponent = CustomFilterComponent;
//# sourceMappingURL=custom-filter.component.js.map