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
var map_service_service_1 = require("../services/map-service.service");
var auth_service_1 = require("../services/auth.service");
var condensed_component_1 = require("../../app/@pages/layouts/condensed/condensed.component");
var Utility_service_1 = require("../services/Utility.service");
var all_http_request_service_1 = require("../services/all-http-request.service");
var environment_1 = require("../../environments/environment");
var google_component_1 = require("../maps/google/google.component");
var MapSearchDataComponent = (function () {
    function MapSearchDataComponent(injector, activeModal, MapServiceService, AuthServices, UtilityService, httpService) {
        var _this = this;
        this.injector = injector;
        this.activeModal = activeModal;
        this.MapServiceService = MapServiceService;
        this.AuthServices = AuthServices;
        this.UtilityService = UtilityService;
        this.httpService = httpService;
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
        this.totalCount = 0;
        this.DisplayingCount = 0;
        this.NormalViewContent = true;
        this.ReducedViewContent = false;
        this.ImageListviewContent = false;
        this.LayerLoader = false;
        this.LoginId = '';
        this.Searchtext = '';
        this.isFilteredData = false;
        this.showDefaultCategoryId = 1;
        this.ActiveMapLayersLibrary = [];
        this.actionMapping = {
            mouse: {
                click: function (tree, node, $event) {
                    _this.OnLayerclick(node, node.data.Id);
                }
            }
        };
        this.options = {
            displayField: 'Name',
            isExpandedField: 'expanded',
            idField: 'Id',
            hasChildrenField: 'children',
            useTriState: false,
            useCheckbox: false,
            actionMapping: this.actionMapping,
        };
        this.Totalcount = 25;
        this.Take = this.Totalcount;
        this.skip = this.Take;
        this.activeCategoryID = this.showDefaultCategoryId;
        // setTimeout(() => {
        this.CondensedComponent = injector.get(condensed_component_1.CondensedComponent);
        this.GoogleMapPage = injector.get(google_component_1.GoogleMapPage);
        // });
    }
    MapSearchDataComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.UtilityService.CloseModalOnRouteChange(this.activeModal);
        var MapsearchLayesrLibraryres = this.MapServiceService.MapsearchLayersCategory.getValue();
        if (MapsearchLayesrLibraryres) {
            if (MapsearchLayesrLibraryres.IsLoaded == true) {
                // let LayersCategory = MapsearchLayesrLibraryres.LayerLibrary[0];
                var LayersCategory = MapsearchLayesrLibraryres.LayerLibrary;
                if (LayersCategory.length > 0) {
                    this.showDefaultCategoryId = parseInt(LayersCategory[0].CategoryID);
                    this.activeCategoryID = this.showDefaultCategoryId;
                }
                var list = [{
                        Id: 0,
                        Name: 'All',
                        ParentCategoryID: '0'
                        // ParentCategoryID: c.ParentCategoryID,
                        // OrderNumber: c.OrderNumber
                    }];
                for (var _i = 0, LayersCategory_1 = LayersCategory; _i < LayersCategory_1.length; _i++) {
                    var c = LayersCategory_1[_i];
                    var treelist = {
                        Id: c.CategoryID,
                        Name: c.CategoryName,
                        ParentCategoryID: c.ParentCategoryID
                        // ParentCategoryID: c.ParentCategoryID,
                        // OrderNumber: c.OrderNumber
                    };
                    if (c.CategoryChilds.length > 0) {
                        treelist["children"] = [];
                        for (var _a = 0, _b = c.CategoryChilds; _a < _b.length; _a++) {
                            var cc = _b[_a];
                            var childtreelist = {
                                Id: cc.CategoryID,
                                Name: cc.CategoryName,
                                ParentCategoryID: cc.ParentCategoryID
                            };
                            treelist["children"].push(childtreelist);
                        }
                    }
                    list.push(treelist);
                }
                list = list.filter(function (m) { return m.Name != 'Company' && m.Name != 'All'; });
                this.nodes = list;
                this.LayerLoader = true;
                if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
                    // setTimeout(() => {
                    this.DisplayLayres(this.showDefaultCategoryId, true);
                    // }, 2000);
                }
                else {
                    // setTimeout(() => {
                    this.setMapserachLayer();
                    // }, 2000);
                }
            }
        }
        setTimeout(function () {
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
            _this.SwitchTab();
        }, 100);
    };
    MapSearchDataComponent.prototype.setMapserachLayer = function () {
        var _this = this;
        this.LoginId = this.AuthServices.getUserId();
        if (!this.MapServiceService.EnergyLayerLibrary.getValue()) {
            this.httpService._NodeGetEnergyLayerLibrary(this.LoginId, "Energy Layer Group", this.showDefaultCategoryId, this.showDefaultCategoryId != 0 ? 10000 : 25, 0).subscribe(function (data) {
                var LayersLibrary = data;
                var res = LayersLibrary;
                if (res.errormsg == "") {
                    if (_this.GoogleMapPage.energyLayer.length > 0) {
                        var energyLayerDataSetIds_1 = _this.GoogleMapPage.energyLayer.map(function (a) { return a.EnergyLayerID; });
                        res["IsLoaded"] = true;
                        var layer = res.LayerLibrary.map(function (el) {
                            if (el.PreviewImage) {
                                el.PreviewImage = _this.MapServiceService.getPreviewImageLink(el.PreviewImage);
                            }
                            var o = Object.assign({}, el);
                            o.ViewData = 'View Data';
                            o.isVisible = true;
                            if (energyLayerDataSetIds_1.indexOf(el.EnergyLayerID) != -1) {
                                o.Addtomap = 'Remove from map';
                            }
                            else {
                                o.Addtomap = 'Add to map';
                            }
                            return o;
                        });
                        var DefaultLayer = [
                            {
                                CategoryID: _this.showDefaultCategoryId,
                                LayerLibrary: layer,
                                Totalcount: parseInt(res.TotalCount)
                            }
                        ];
                        _this.MapServiceService.setMapSearchEnergyLayerLibrary(DefaultLayer);
                        _this.DisplayLayres(_this.showDefaultCategoryId, true);
                    }
                    else {
                        res["IsLoaded"] = true;
                        var layer = res.LayerLibrary.map(function (el) {
                            if (el.PreviewImage) {
                                el.PreviewImage = _this.MapServiceService.getPreviewImageLink(el.PreviewImage);
                            }
                            var o = Object.assign({}, el);
                            o.ViewData = 'View Data';
                            o.Addtomap = 'Add to map';
                            o.isVisible = true;
                            return o;
                        });
                        var DefaultLayer = [
                            {
                                CategoryID: _this.showDefaultCategoryId,
                                LayerLibrary: layer,
                                Totalcount: parseInt(res.TotalCount)
                            }
                        ];
                        _this.MapServiceService.setMapSearchEnergyLayerLibrary(DefaultLayer);
                        _this.DisplayLayres(_this.showDefaultCategoryId, true);
                    }
                }
                else {
                    console.log(res.errorms);
                }
            }, function (error) {
                console.log(error);
            });
        }
        else {
            this.DisplayLayres(this.showDefaultCategoryId, true);
        }
    };
    MapSearchDataComponent.prototype.DisplayLayres = function (categoryId, isFromInit) {
        var _this = this;
        if (isFromInit === void 0) { isFromInit = false; }
        if (isFromInit == true) {
            //Set Search Text if User Global search any value
            var globalSearchText = this.MapServiceService.GlobalSearchText.getValue();
            var isGlobalSearch = false;
            if (globalSearchText != null) {
                isGlobalSearch = true;
                this.Searchtext = globalSearchText;
            }
            var selectedCategory = this.MapServiceService.ActiveSearchDataLibrary.getValue();
            if (selectedCategory && selectedCategory.categoryId) {
                this.activeCategoryID = selectedCategory.categoryId;
                this.activeParentCategoryID = selectedCategory.parentCategoryId;
                if (isGlobalSearch == false)
                    this.Searchtext = selectedCategory.searchText;
                this.DisplayLayres(selectedCategory.categoryId);
                return;
            }
        }
        var isActive = false;
        var LayerList;
        var mainList = this.MapServiceService.EnergyLayerLibrary.getValue();
        if (mainList) {
            for (var _i = 0, mainList_1 = mainList; _i < mainList_1.length; _i++) {
                var a = mainList_1[_i];
                if (a.CategoryID == categoryId) {
                    isActive = true;
                    LayerList = a;
                }
                if (a.CategoryID == 0) {
                    this.Take = a.LayerLibrary.length;
                }
            }
        }
        if (isActive == true) {
            //this.MapServiceService.setActiveLayerslist(DefaultLayer);
            this.ActiveMapLayersLibrary.length = 0;
            this.ActiveMapLayersLibrary.push(LayerList);
            this.ActiveMapLayersLibrary[0].LayerLibrary.forEach(function (el) {
                el.isVisible = true;
                if (_this.GoogleMapPage.energyLayer.length > 0) {
                    var energyLayerDataSetIds = _this.GoogleMapPage.energyLayer.map(function (a) { return a.EnergyLayerID; });
                    if (el.PreviewImage) {
                        el.PreviewImage = _this.MapServiceService.getPreviewImageLink(el.PreviewImage);
                    }
                    if (energyLayerDataSetIds.indexOf(el.EnergyLayerID) != -1) {
                        el.Addtomap = 'Remove from map';
                    }
                    else {
                        el.Addtomap = 'Add to map';
                    }
                }
                else {
                    if (el.PreviewImage) {
                        el.PreviewImage = _this.MapServiceService.getPreviewImageLink(el.PreviewImage);
                    }
                    el.Addtomap = 'Add to map';
                }
            });
            this.totalCount = this.ActiveMapLayersLibrary[0].Totalcount;
            this.DisplayingCount = this.ActiveMapLayersLibrary[0].LayerLibrary.length;
        }
        this.LayerLoader = false;
        if (this.Searchtext) {
            this.SearchData();
        }
    };
    MapSearchDataComponent.prototype.showNormalView = function () {
        this.LayerLoader = true;
        this.ReducedViewContent = false;
        this.ImageListviewContent = false;
        this.NormalViewContent = true;
        this.LayerLoader = false;
    };
    MapSearchDataComponent.prototype.showReducedView = function () {
        this.LayerLoader = true;
        this.NormalViewContent = false;
        this.ImageListviewContent = false;
        this.ReducedViewContent = true;
        this.LayerLoader = false;
    };
    MapSearchDataComponent.prototype.showImageListview = function () {
        this.LayerLoader = true;
        this.NormalViewContent = false;
        this.ReducedViewContent = false;
        this.ImageListviewContent = true;
        this.LayerLoader = false;
    };
    MapSearchDataComponent.prototype.OnLayerclick = function (node, Categoryid) {
        var _this = this;
        this.activeCategoryID = Categoryid;
        this.activeParentCategoryID = node.data.ParentCategoryID;
        var selectedItem = {
            categoryId: this.activeCategoryID,
            searchText: this.Searchtext,
            parentCategoryId: node.data.ParentCategoryID
        };
        this.MapServiceService.setActiveSearchDataLibrary(selectedItem);
        if (node && node.hasChildren) {
            if (node.isCollapsed) {
                node.expand();
                if (node.data && node.data.children && node.data.children.length > 0) {
                    this.activeParentCategoryID = node.data.children[0].ParentCategoryID;
                    Categoryid = node.data.children[0].Id;
                }
                this.activeCategoryID = Categoryid;
            }
            else {
                node.collapse();
                return;
            }
        }
        this.LayerLoader = true;
        var isActive = false;
        if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
            for (var _i = 0, _a = this.MapServiceService.EnergyLayerLibrary.getValue(); _i < _a.length; _i++) {
                var a = _a[_i];
                if (a.CategoryID == Categoryid) {
                    isActive = true;
                }
            }
        }
        if (isActive == false) {
            this.ActiveMapLayersLibrary.length = 0;
            this.totalCount = 0;
            this.DisplayingCount = 0;
            this.LoginId = this.AuthServices.getUserId();
            this.httpService._NodeGetEnergyLayerLibrary(this.LoginId, "Energy Layer Group", Categoryid, this.Totalcount, 0).subscribe(function (data) {
                var LayersLibrary = data;
                var res = LayersLibrary;
                if (res.errormsg == "") {
                    if (_this.GoogleMapPage.energyLayer.length > 0) {
                        var energyLayerDataSetIds_2 = _this.GoogleMapPage.energyLayer.map(function (a) { return a.EnergyLayerID; });
                        res["IsLoaded"] = true;
                        var layer = res.LayerLibrary.map(function (el) {
                            if (el.PreviewImage) {
                                el.PreviewImage = _this.MapServiceService.getPreviewImageLink(el.PreviewImage);
                            }
                            var o = Object.assign({}, el);
                            o.ViewData = 'View Data';
                            o.isVisible = true;
                            if (energyLayerDataSetIds_2.indexOf(el.EnergyLayerID) != -1) {
                                o.Addtomap = 'Remove from map';
                            }
                            else {
                                o.Addtomap = 'Add to map';
                            }
                            return o;
                        });
                        var DefaultLayer = [
                            {
                                CategoryID: Categoryid,
                                LayerLibrary: layer,
                                Totalcount: parseInt(res.TotalCount)
                            }
                        ];
                        if (_this.MapServiceService.EnergyLayerLibrary.getValue()) {
                            Array.prototype.push.apply(_this.MapServiceService.EnergyLayerLibrary.getValue(), DefaultLayer);
                        }
                        else {
                            _this.MapServiceService.setMapSearchEnergyLayerLibrary(DefaultLayer);
                        }
                        _this.DisplayLayres(Categoryid);
                    }
                    else {
                        res["IsLoaded"] = true;
                        var layer = res.LayerLibrary.map(function (el) {
                            if (el.PreviewImage) {
                                el.PreviewImage = _this.MapServiceService.getPreviewImageLink(el.PreviewImage);
                            }
                            var o = Object.assign({}, el);
                            o.ViewData = 'View Data';
                            o.Addtomap = 'Add to map';
                            o.isVisible = true;
                            return o;
                        });
                        var DefaultLayer = [
                            {
                                CategoryID: Categoryid,
                                LayerLibrary: layer,
                                Totalcount: parseInt(res.TotalCount)
                            }
                        ];
                        if (_this.MapServiceService.EnergyLayerLibrary.getValue()) {
                            Array.prototype.push.apply(_this.MapServiceService.EnergyLayerLibrary.getValue(), DefaultLayer);
                        }
                        else {
                            _this.MapServiceService.setMapSearchEnergyLayerLibrary(DefaultLayer);
                        }
                        _this.DisplayLayres(Categoryid);
                    }
                }
                else {
                    console.log(res.errorms);
                    _this.LayerLoader = false;
                }
            }, function (error) {
                console.log(error);
                _this.LayerLoader = false;
            });
        }
        else {
            this.DisplayLayres(Categoryid);
        }
    };
    MapSearchDataComponent.prototype.ViewDataClick = function (LayerId, CategoryId) {
    };
    MapSearchDataComponent.prototype.SearchData = function () {
        var SearchData = this.Searchtext.trim();
        var selectedItem = {
            categoryId: this.activeCategoryID,
            searchText: this.Searchtext,
            parentCategoryId: this.activeParentCategoryID
        };
        this.MapServiceService.setActiveSearchDataLibrary(selectedItem);
        if (SearchData) {
            this.isFilteredData = true;
            this.Searchtext = SearchData;
            this.ActiveMapLayersLibrary[0].LayerLibrary.forEach(function (el) {
                if (((el.LayerName.toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1) || ((el.DisplayName).toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1) ||
                    (!el.Tags && el.Tags.toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1))) {
                    el.isVisible = true;
                }
                else {
                    el.isVisible = false;
                }
            });
            var displayingLength = this.ActiveMapLayersLibrary[0].LayerLibrary.filter(function (x) { return x.isVisible; }).length;
            if (displayingLength > -1) {
                this.DisplayingCount = displayingLength;
                this.totalCount = displayingLength;
            }
            else {
                this.DisplayingCount = 0;
                this.totalCount = 0;
            }
            this.MapServiceService.setGlobalSearchText(SearchData);
        }
        else {
            this.ResetDataLayer();
        }
    };
    MapSearchDataComponent.prototype.ResetDataLayer = function () {
        this.LayerLoader = true;
        this.Searchtext = '';
        var categoryId = this.ActiveMapLayersLibrary[0].CategoryID;
        this.LoginId = this.AuthServices.getUserId();
        this.ActiveMapLayersLibrary[0].LayerLibrary.forEach(function (el) {
            el.isVisible = true;
        });
        this.MapServiceService.setGlobalSearchText(null);
        var selectedItem = {
            categoryId: this.activeCategoryID,
            searchText: this.Searchtext,
            parentCategoryId: this.activeParentCategoryID
        };
        this.MapServiceService.setActiveSearchDataLibrary(selectedItem);
        this.DisplayLayres(categoryId);
        this.isFilteredData = false;
    };
    MapSearchDataComponent.prototype.AddtomapClick = function (LayerId, CategoryId) {
        if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
            var _loop_1 = function (a) {
                if (a.CategoryID == CategoryId) {
                    var IsLoaded = false;
                    var _loop_2 = function (e) {
                        if (e.EnergyLayerID == LayerId && !IsLoaded) {
                            IsLoaded = true;
                            var treeUI = this_1.MapServiceService._TreeUI.getValue();
                            if (e.Addtomap == 'Add to map') {
                                e.Addtomap = 'Remove from map';
                                var Addtomapexistnode = treeUI.treeModel.getNodeById(e.EnergyLayerID);
                                if (Addtomapexistnode == undefined) {
                                    this_1.CondensedComponent.GetTreeData(LayerId);
                                }
                            }
                            else {
                                e.Addtomap = 'Add to map';
                                var EnergyLayerID_1 = e.EnergyLayerID + 'RemoveTreeData';
                                var Removeexistnode = treeUI.treeModel.getNodeById(e.EnergyLayerID);
                                if (Removeexistnode.data["children"]) {
                                    if (Removeexistnode.data["children"].length > 0) {
                                        var _loop_3 = function (removelayer) {
                                            setTimeout(function () {
                                                EnergyLayerID_1 = removelayer.Id + 'RemoveTreeData';
                                                var element = document.getElementById(EnergyLayerID_1);
                                                element.click();
                                            }, 200);
                                        };
                                        for (var _i = 0, _a = Removeexistnode.data["children"]; _i < _a.length; _i++) {
                                            var removelayer = _a[_i];
                                            _loop_3(removelayer);
                                        }
                                    }
                                    else {
                                        setTimeout(function () {
                                            var element = document.getElementById(EnergyLayerID_1);
                                            element.click();
                                        }, 200);
                                    }
                                }
                                else {
                                    setTimeout(function () {
                                        var element = document.getElementById(EnergyLayerID_1);
                                        element.click();
                                    }, 200);
                                }
                            }
                        }
                    };
                    for (var _i = 0, _a = a.LayerLibrary; _i < _a.length; _i++) {
                        var e = _a[_i];
                        _loop_2(e);
                    }
                    // Group Layer Code
                    var selectedCategory_1 = a.LayerLibrary.find(function (x) { return x.EnergyLayerID == LayerId; });
                    // IF Child Layer
                    if (selectedCategory_1 && selectedCategory_1.EnergyParentID) {
                        var parentlayer_1 = a.LayerLibrary.find(function (x) { return x.EnergyLayerID == selectedCategory_1.EnergyParentID; });
                        if (parentlayer_1) {
                            if (parentlayer_1 && selectedCategory_1.Addtomap != 'Add to map' && parentlayer_1.Addtomap == 'Add to map') {
                                parentlayer_1.Addtomap = 'Remove from map';
                            }
                            if (selectedCategory_1.Addtomap == 'Add to map') {
                                var SameParentCategoryList = a.LayerLibrary.filter(function (x) { return x.EnergyParentID == selectedCategory_1.EnergyParentID; });
                                var childLayersThatAddedToMap = SameParentCategoryList.filter(function (x) { return x.Addtomap != 'Add to map'; });
                                if (childLayersThatAddedToMap && childLayersThatAddedToMap.length == 0) {
                                    parentlayer_1.Addtomap = 'Add to map';
                                }
                                if (childLayersThatAddedToMap && childLayersThatAddedToMap.length > 0) {
                                    parentlayer_1.Addtomap = 'Remove from map';
                                    setTimeout(function () {
                                        parentlayer_1.Addtomap = 'Remove from map';
                                    }, 220);
                                }
                            }
                        }
                    }
                    var ChildCategoryList = a.LayerLibrary.filter(function (x) { return x.EnergyParentID == LayerId; });
                    // IF Parent Layer
                    if (ChildCategoryList && ChildCategoryList.length > 0) {
                        for (var i = 0; i < ChildCategoryList.length; i++) {
                            var category = ChildCategoryList[i];
                            if (selectedCategory_1 && selectedCategory_1.Addtomap == 'Add to map') {
                                category.Addtomap = 'Add to map';
                            }
                            else {
                                category.Addtomap = 'Remove from map';
                            }
                        }
                    }
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = this.MapServiceService.EnergyLayerLibrary.getValue(); _i < _a.length; _i++) {
                var a = _a[_i];
                _loop_1(a);
            }
        }
    };
    MapSearchDataComponent.prototype.SwitchTab = function () {
        if (this.modalName == "MapsearchData") {
            var MapsearchDataTab = document.getElementById('MapsearchDatatitle');
            MapsearchDataTab.click();
        }
        else if (this.modalName == "myData") {
            var MyDataTab = document.getElementById('MyDatatitle');
            MyDataTab.click();
        }
        else if (this.modalName == "SharedData") {
            var SharedDataTab = document.getElementById('SharedDatatitle');
            SharedDataTab.click();
        }
    };
    MapSearchDataComponent.prototype.onScroll = function () {
        var _this = this;
        if (this.ActiveMapLayersLibrary[0].CategoryID == 0) {
            this.LayerLoader = true;
            this.LoginId = this.AuthServices.getUserId();
            this.Take = this.Take + this.Totalcount;
            this.skip = this.Take - this.Totalcount;
            var take = this.Totalcount;
            if (take <= this.ActiveMapLayersLibrary[0].Totalcount) {
                this.httpService._NodeGetEnergyLayerLibrary(this.LoginId, "Energy Layer Group", 0, take, this.skip).subscribe(function (data) {
                    var Data = data;
                    var LayersLibrary = Data;
                    var res = LayersLibrary;
                    if (res.errormsg == "") {
                        var layer = res.LayerLibrary[0].map(function (el) {
                            if (el.PreviewImage) {
                                el.PreviewImage = _this.MapServiceService.getPreviewImageLink(el.PreviewImage);
                            }
                            var o = Object.assign({}, el);
                            o.ViewData = 'View Data';
                            o.Addtomap = 'Add to map';
                            o.isVisible = true;
                            return o;
                        });
                        if (_this.MapServiceService.EnergyLayerLibrary.getValue()) {
                            for (var _i = 0, _a = _this.MapServiceService.EnergyLayerLibrary.getValue(); _i < _a.length; _i++) {
                                var a = _a[_i];
                                if (a.CategoryID == 0) {
                                    Array.prototype.push.apply(a.LayerLibrary, layer);
                                    Array.prototype.push.apply(_this.ActiveMapLayersLibrary[0].LayerLibrary, data);
                                    _this.totalCount = _this.ActiveMapLayersLibrary[0].Totalcount;
                                    _this.DisplayingCount = _this.ActiveMapLayersLibrary[0].LayerLibrary.length;
                                }
                            }
                        }
                    }
                    _this.LayerLoader = false;
                }, function (error) {
                    _this.LayerLoader = false;
                    console.log(error);
                });
            }
        }
    };
    MapSearchDataComponent.prototype.CloseMapsearchdata = function () {
        this.activeModal.dismiss('Cross click');
    };
    __decorate([
        core_1.ViewChild('maplayertree'),
        __metadata("design:type", Object)
    ], MapSearchDataComponent.prototype, "maplayertree", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MapSearchDataComponent.prototype, "modalName", void 0);
    MapSearchDataComponent = __decorate([
        core_1.Component({
            selector: 'app-map-search-data',
            templateUrl: './map-search-data.component.html',
            styleUrls: ['./map-search-data.component.scss'],
            providers: [ng_bootstrap_1.NgbModal]
        }),
        __metadata("design:paramtypes", [core_1.Injector,
            ng_bootstrap_1.NgbActiveModal,
            map_service_service_1.MapServiceService,
            auth_service_1.AuthenticationService,
            Utility_service_1.UtilityService,
            all_http_request_service_1.HttpRequestService])
    ], MapSearchDataComponent);
    return MapSearchDataComponent;
}());
exports.MapSearchDataComponent = MapSearchDataComponent;
var ActiveLibrary = (function () {
    function ActiveLibrary() {
    }
    return ActiveLibrary;
}());
exports.ActiveLibrary = ActiveLibrary;
//# sourceMappingURL=map-search-data.component.js.map