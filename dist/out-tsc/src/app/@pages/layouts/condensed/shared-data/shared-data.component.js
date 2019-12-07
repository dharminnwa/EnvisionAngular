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
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var all_http_request_service_1 = require("../../../../services/all-http-request.service");
var map_service_service_1 = require("../../../../services/map-service.service");
var auth_service_1 = require("../../../../services/auth.service");
var condensed_component_1 = require("../../condensed/condensed.component");
var environment_1 = require("../../../../../environments/environment");
var SharedDataComponent = (function () {
    function SharedDataComponent(activeModal, httpRequestService, mapServiceService, authServices, CondensedComponent) {
        this.activeModal = activeModal;
        this.httpRequestService = httpRequestService;
        this.mapServiceService = mapServiceService;
        this.authServices = authServices;
        this.CondensedComponent = CondensedComponent;
        this.ShowLoader = false;
        this.fileType = [];
        this.selectedfileType = [];
        this.dropdownSettings = {};
        this.hideSomePart = true;
        this.sharedDataSearchtext = '';
        this.sharedDataList = [];
        this.displayingCount = 0;
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
    }
    SharedDataComponent.prototype.ngOnInit = function () {
        this.FillFileTypes();
        this.GetSharedData();
    };
    SharedDataComponent.prototype.FillFileTypes = function () {
        this.fileType = [
            { item_extention: '', item_text: 'My Layers' },
            { item_extention: '.zip,.shp', item_text: 'ShapeFile' },
            { item_extention: '.kml,.kmz', item_text: 'KML' },
            { item_extention: '.xls,.xlsx,.csv', item_text: 'Locations' },
            { item_extention: '.png,.jpg,.ico,.bmp,.pdf', item_text: 'Image' },
        ];
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_extention',
            textField: 'item_text',
            enableCheckAll: false,
            maxHeight: 120,
            itemsShowLimit: 1,
        };
    };
    SharedDataComponent.prototype.GetSharedData = function () {
        var _this = this;
        var userSearch = this.mapServiceService._SharedLayersUserSearch.getValue();
        if (userSearch == null) {
            var userSearch_1 = {
                searchText: '',
                searchFileType: []
            };
            this.mapServiceService.setSharedLayersUserSearch(userSearch_1);
            this.sharedDataSearchtext = userSearch_1.searchText;
            this.selectedfileType = userSearch_1.searchFileType;
        }
        else {
            if (userSearch.searchText)
                this.sharedDataSearchtext = userSearch.searchText;
            if (userSearch.searchFileType.length > 0)
                this.selectedfileType = userSearch.searchFileType;
        }
        var existingSharedDataList = this.mapServiceService._SharedData.getValue();
        if (existingSharedDataList == null) {
            var userId = this.authServices.getLoggedinUserId();
            this.ShowLoader = true;
            this.httpRequestService._NodeGetSharedData(userId).subscribe(function (data) {
                _this.ShowLoader = false;
                if (data._Issuccess) {
                    var sharedData = data.SharedData;
                    if (sharedData.length > 0) {
                        var list = sharedData.map(function (el) {
                            var o = Object.assign({}, el);
                            o.Addtomap = 'Add to map';
                            o.isVisible = true;
                            return o;
                        });
                        _this.mapServiceService.setSharedData(list);
                        _this.sharedDataList = _this.mapServiceService._SharedData.getValue();
                        var displayingLength = _this.sharedDataList.map(function (x) { return x.isVisible; });
                        _this.displayingCount = displayingLength.reduce(function (n, val) {
                            return n + (val === true);
                        }, 0);
                    }
                }
            }, function (error) {
                console.log(error);
                _this.ShowLoader = false;
            });
        }
        else {
            this.sharedDataList = existingSharedDataList;
            var displayingLength = this.sharedDataList.map(function (x) { return x.isVisible; });
            this.displayingCount = displayingLength.reduce(function (n, val) {
                return n + (val === true);
            }, 0);
        }
    };
    SharedDataComponent.prototype.ResetFilter = function () {
        this.selectedfileType = [];
        if (this.mapServiceService._SharedLayersUserSearch.getValue()) {
            var userSearch = this.mapServiceService._SharedLayersUserSearch.getValue();
            userSearch.searchFileType = [];
        }
        this.ResetSharedData();
    };
    SharedDataComponent.prototype.SearchSharedData = function () {
        var searchData = this.sharedDataSearchtext ? this.sharedDataSearchtext.trim() : '';
        if (this.mapServiceService._SharedLayersUserSearch.getValue()) {
            var userSearch = this.mapServiceService._SharedLayersUserSearch.getValue();
            userSearch.searchText = searchData ? searchData : '';
            userSearch.searchFileType = this.selectedfileType;
        }
        if (searchData && this.selectedfileType.length == 0) {
            this.sharedDataList.map(function (el) {
                if (el && el.DataSetName && el.DataSetName != '') {
                    if (((el.DataSetName.toLowerCase().indexOf(searchData.toLowerCase()) > -1)
                        || (el.Description && el.Description.toLowerCase().indexOf(searchData.toLowerCase()) > -1))) {
                        el.isVisible = true;
                    }
                    else
                        el.isVisible = false;
                }
            });
            var displayingLength = this.sharedDataList.map(function (x) { return x.isVisible; });
            this.displayingCount = displayingLength.reduce(function (n, val) {
                return n + (val === true);
            }, 0);
        }
        else if (searchData == "" && this.selectedfileType.length > 0) {
            var selectedfileExtentions_1 = [];
            var result = this.selectedfileType.map(function (a) { return a.item_extention; });
            for (var i = 0; i < result.length; i++) {
                if (result[i].indexOf(',') > -1) {
                    var extentions = result[i].split(',');
                    for (var j = 0; j < extentions.length; j++) {
                        selectedfileExtentions_1.push(extentions[j].toLocaleString());
                    }
                }
                else {
                    selectedfileExtentions_1.push(result[i].toLocaleString());
                }
            }
            this.sharedDataList.map(function (el) {
                if (selectedfileExtentions_1.indexOf(el.UploadFileType.toLocaleLowerCase()) > -1) {
                    el.isVisible = true;
                }
                else
                    el.isVisible = false;
            });
            var displayingLength = this.sharedDataList.map(function (x) { return x.isVisible; });
            this.displayingCount = displayingLength.reduce(function (n, val) {
                return n + (val === true);
            }, 0);
        }
        else if (searchData && this.selectedfileType.length > 0) {
            var selectedfileExtentions_2 = [];
            var result = this.selectedfileType.map(function (a) { return a.item_extention; });
            for (var i = 0; i < result.length; i++) {
                if (result[i].indexOf(',') > -1) {
                    var extentions = result[i].split(',');
                    for (var j = 0; j < extentions.length; j++) {
                        selectedfileExtentions_2.push(extentions[j].toLocaleString());
                    }
                }
                else {
                    selectedfileExtentions_2.push(result[i].toLocaleString());
                }
            }
            this.sharedDataList.map(function (el) {
                if (((el.DataSetName.toLocaleLowerCase().indexOf(searchData.toLocaleLowerCase()) > -1) || (el.Description && el.Description.toLocaleLowerCase().indexOf(searchData.toLocaleLowerCase()) > -1)) && (selectedfileExtentions_2.indexOf(el.UploadFileType.toLocaleLowerCase()) > -1)) {
                    el.isVisible = true;
                }
                else
                    el.isVisible = false;
            });
            var displayingLength = this.sharedDataList.map(function (x) { return x.isVisible; });
            this.displayingCount = displayingLength.reduce(function (n, val) {
                return n + (val === true);
            }, 0);
        }
        else {
            this.ResetSharedData();
        }
    };
    SharedDataComponent.prototype.ResetSharedData = function () {
        this.sharedDataList.map(function (el) {
            if (!el.isVisible)
                el.isVisible = true;
        });
        var displayingLength = this.sharedDataList.map(function (x) { return x.isVisible; });
        this.displayingCount = displayingLength.reduce(function (n, val) {
            return n + (val === true);
        }, 0);
        if (this.mapServiceService._SharedLayersUserSearch.getValue()) {
            var userSearch = this.mapServiceService._SharedLayersUserSearch.getValue();
            userSearch.searchText = '';
        }
        this.sharedDataSearchtext = '';
    };
    SharedDataComponent.prototype.onItemSelectChange = function (item) {
        this.SearchSharedData();
    };
    SharedDataComponent.prototype.ClearSearchText = function () {
        if (this.mapServiceService._SharedLayersUserSearch.getValue()) {
            var userSearch = this.mapServiceService._SharedLayersUserSearch.getValue();
            userSearch.searchText = '';
        }
        this.sharedDataSearchtext = '';
        this.SearchSharedData();
    };
    SharedDataComponent.prototype.AddtomapClick = function (LayerId) {
        if (this.mapServiceService._SharedData.getValue()) {
            var _loop_1 = function (layer) {
                if (layer.DataSetID == LayerId) {
                    var treeUI = this_1.mapServiceService._SharedTreeUI.getValue();
                    if (layer.Addtomap == 'Add to map') {
                        layer.Addtomap = 'Remove from map';
                        this_1.CondensedComponent.GetSharedLayerTreeData(LayerId, [], [], 0, layer.UserId);
                    }
                    else {
                        layer.Addtomap = 'Add to map';
                        var layerRemoveButtonID_1 = layer.DataSetID + 'RemoveTreeData';
                        var Removeexistnode = treeUI.treeModel.getNodeById(layer.DataSetID);
                        if (Removeexistnode.data["children"]) {
                            if (Removeexistnode.data["children"].length > 1) {
                                var _loop_2 = function (removelayer) {
                                    setTimeout(function () {
                                        layerRemoveButtonID_1 = removelayer.Id + 'RemoveTreeData';
                                        var element = document.getElementById(layerRemoveButtonID_1);
                                        element.click();
                                    }, 200);
                                };
                                for (var _i = 0, _a = Removeexistnode.data["children"]; _i < _a.length; _i++) {
                                    var removelayer = _a[_i];
                                    _loop_2(removelayer);
                                }
                            }
                            else {
                                setTimeout(function () {
                                    var element = document.getElementById(layerRemoveButtonID_1);
                                    element.click();
                                }, 200);
                            }
                        }
                        else {
                            setTimeout(function () {
                                var element = document.getElementById(layerRemoveButtonID_1);
                                element.click();
                            }, 200);
                        }
                    }
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = this.mapServiceService._SharedData.getValue(); _i < _a.length; _i++) {
                var layer = _a[_i];
                _loop_1(layer);
            }
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SharedDataComponent.prototype, "hideSomePart", void 0);
    SharedDataComponent = __decorate([
        core_1.Component({
            selector: 'app-shared-data',
            templateUrl: './shared-data.component.html',
            styleUrls: ['./shared-data.component.scss']
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal,
            all_http_request_service_1.HttpRequestService,
            map_service_service_1.MapServiceService,
            auth_service_1.AuthenticationService,
            condensed_component_1.CondensedComponent])
    ], SharedDataComponent);
    return SharedDataComponent;
}());
exports.SharedDataComponent = SharedDataComponent;
//# sourceMappingURL=shared-data.component.js.map