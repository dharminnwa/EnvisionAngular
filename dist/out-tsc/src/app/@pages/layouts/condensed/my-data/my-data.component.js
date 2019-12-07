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
var auth_service_1 = require("../../../../services/auth.service");
var ngx_cookie_service_1 = require("ngx-cookie-service");
var condensed_component_1 = require("../../condensed/condensed.component");
var map_service_service_1 = require("../../../../services/map-service.service");
var google_component_1 = require("../../../../maps/google/google.component");
var edit_mydata_component_1 = require("./edit-mydata/edit-mydata.component");
var all_http_request_service_1 = require("../../../../services/all-http-request.service");
var Utility_service_1 = require("../../../../services/Utility.service");
var environment_1 = require("../../../../../environments/environment");
var MyDataComponent = (function () {
    function MyDataComponent(activeModal, AuthServices, CondensedComponent, cookieService, MapServiceService, GoogleMapPage, modalService, httpService, UtilityService) {
        this.activeModal = activeModal;
        this.AuthServices = AuthServices;
        this.CondensedComponent = CondensedComponent;
        this.cookieService = cookieService;
        this.MapServiceService = MapServiceService;
        this.GoogleMapPage = GoogleMapPage;
        this.modalService = modalService;
        this.httpService = httpService;
        this.UtilityService = UtilityService;
        this.fileType = [];
        this.selectedfileType = [];
        this.dropdownSettings = {};
        this.LayerLoader = false;
        this.showDefaultCategoryId = 0;
        this.LoginUserGuId = '';
        this.ActivePrivateLayersLibrary = [
            {
                CategoryID: 0,
                TotalCount: 0,
                LayerLibrary: [],
            }
        ];
        this.MydataSearchtext = '';
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
        this.hideSomePart = true;
    }
    // ActivePrivateLayersLibrary=[
    //   {
    //     CategoryID: 0,
    //     TotalCount: layer.length,
    //     LayerLibrary: layer,
    //   }
    // ];
    MyDataComponent.prototype.ngOnInit = function () {
        this.FillFileTypes();
        this.setMyDataLayer();
    };
    MyDataComponent.prototype.FillFileTypes = function () {
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
    MyDataComponent.prototype.setMyDataLayer = function () {
        var _this = this;
        this.LayerLoader = true;
        this.LoginUserGuId = this.AuthServices.getLoggedinUserId();
        if (!this.MapServiceService.MyDataLayerLibrary.getValue()) {
            this.httpService._NodeGetMyDataLibrary(this.LoginUserGuId).subscribe(function (data) {
                var res = data;
                var MyDataRes = res;
                if (MyDataRes._Issuccess == true) {
                    if (_this.GoogleMapPage.privateLayer.length > 0) {
                        var privateLayerDataSetIds_1 = _this.GoogleMapPage.privateLayer.map(function (a) { return a.DataSetID; });
                        MyDataRes["IsLoaded"] = true;
                        var layer = MyDataRes.LayerLibrary.map(function (el) {
                            var o = Object.assign({}, el);
                            o.Delete = 'Delete';
                            o.Edit = 'Edit';
                            if (privateLayerDataSetIds_1.indexOf(el.DataSetID) != -1) {
                                o.Addtomap = 'Remove from map';
                            }
                            else {
                                o.Addtomap = 'Add to map';
                            }
                            return o;
                        });
                        var DefaultLayer = [
                            {
                                CategoryID: 0,
                                TotalCount: layer.length,
                                DisplayingCount: layer.length,
                                LayerLibrary: layer,
                            }
                        ];
                        _this.MapServiceService.setMyDataLayerLibrary(DefaultLayer);
                        _this.DisplayLayres(_this.showDefaultCategoryId);
                    }
                    else {
                        MyDataRes["IsLoaded"] = true;
                        var layer = MyDataRes.LayerLibrary.map(function (el) {
                            var o = Object.assign({}, el);
                            o.Delete = 'Delete';
                            o.Edit = 'Edit';
                            o.Addtomap = 'Add to map';
                            return o;
                        });
                        var DefaultLayer = [
                            {
                                CategoryID: 0,
                                TotalCount: layer.length,
                                DisplayingCount: layer.length,
                                LayerLibrary: layer,
                            }
                        ];
                        _this.MapServiceService.setMyDataLayerLibrary(DefaultLayer);
                        _this.DisplayLayres(_this.showDefaultCategoryId);
                    }
                    var _JsonAllActiveMapLayes = JSON.stringify(_this.MapServiceService.MyDataLibrary.getValue());
                    if (localStorage.getItem("AllActivePrivateLayersLibrary") == null)
                        localStorage.setItem("AllActivePrivateLayersLibrary", _JsonAllActiveMapLayes);
                }
                else {
                    console.log(res.errorms);
                }
                // if (this.MapServiceService.MydataLibraryCount.getValue().length > 0) {
                //   let count = this.MapServiceService.MydataLibraryCount.getValue()[0].total;
                //   this.totalCount = count;
                //   //this.totalCount = this.MapServiceService.MydataLibraryCount.getValue();
                //   this.DisplayingCount = this.totalCount;
                // }
                _this.LayerLoader = false;
            }, function (error) {
                console.log(error);
                _this.LayerLoader = false;
            });
        }
        else {
            this.DisplayLayres(this.showDefaultCategoryId);
            // this.totalCount = this.MapServiceService.MydataLibraryCount.getValue()[0].total;
            // this.DisplayingCount = this.totalCount;
            this.LayerLoader = false;
        }
    };
    MyDataComponent.prototype.DisplayLayres = function (categoryId) {
        var _this = this;
        var isActive = false;
        var LayerList;
        if (this.MapServiceService.MyDataLibrary.getValue()) {
            for (var _i = 0, _a = this.MapServiceService.MyDataLibrary.getValue(); _i < _a.length; _i++) {
                var a = _a[_i];
                if (a.CategoryID == categoryId) {
                    isActive = true;
                    LayerList = a;
                }
            }
        }
        if (isActive == true) {
            //this.MapServiceService.setActiveLayerslist(DefaultLayer);
            this.ActivePrivateLayersLibrary.length = 0;
            this.ActivePrivateLayersLibrary.push(LayerList);
            this.ActivePrivateLayersLibrary[0].LayerLibrary.forEach(function (el) {
                if (_this.GoogleMapPage.privateLayer.length > 0) {
                    var privateLayerDataSetIds = _this.GoogleMapPage.privateLayer.map(function (a) { return a.DataSetID; });
                    if (privateLayerDataSetIds.indexOf(el.DataSetID) != -1) {
                        el.Addtomap = 'Remove from map';
                    }
                    else {
                        el.Addtomap = 'Add to map';
                    }
                }
                else {
                    el.Addtomap = 'Add to map';
                }
            });
        }
        this.LayerLoader = false;
    };
    MyDataComponent.prototype.OpenAddDataModal = function () {
        this.CondensedComponent.OpenAddadtaModal();
    };
    MyDataComponent.prototype.AddtomapClick = function (LayerId, CategoryId) {
        if (this.MapServiceService.MyDataLibrary.getValue()) {
            for (var _i = 0, _a = this.MapServiceService.MyDataLibrary.getValue(); _i < _a.length; _i++) {
                var a = _a[_i];
                if (a.CategoryID == CategoryId) {
                    var _loop_1 = function (e) {
                        if (e.DataSetID == LayerId) {
                            var treeUI = this_1.MapServiceService._PrivateTreeUI.getValue();
                            if (e.Addtomap == 'Add to map') {
                                e.Addtomap = 'Remove from map';
                                this_1.CondensedComponent.GetPrivateLayerTreeData(LayerId);
                            }
                            else {
                                e.Addtomap = 'Add to map';
                                var layerRemoveButtonID_1 = e.DataSetID + 'RemoveTreeData';
                                var Removeexistnode = treeUI.treeModel.getNodeById(e.DataSetID);
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
                    for (var _b = 0, _c = a.LayerLibrary; _b < _c.length; _b++) {
                        var e = _c[_b];
                        _loop_1(e);
                    }
                }
            }
        }
    };
    MyDataComponent.prototype.DeleteClick = function (LayerId) {
        if (this.GoogleMapPage.privateLayer.length > 0) {
            var privateLayerList = this.GoogleMapPage.privateLayer;
            var filteredData = privateLayerList.filter(function (item) { return LayerId == item.DataSetID; });
            if (filteredData.length == 1)
                this.UtilityService.ActiveLayerData(LayerId, 'RemoveTreeData');
        }
        this.CondensedComponent.RemoveLayerFromMyDataLibrary(LayerId);
    };
    MyDataComponent.prototype.SearchData = function () {
        var SearchData = this.MydataSearchtext.trim();
        var Data = [];
        var categoryId = this.ActivePrivateLayersLibrary[0].CategoryID;
        //localStorage.clear();
        if (localStorage.getItem("AllActivePrivateLayersLibrary")) {
            var AllActivePrivateLayers = JSON.parse(localStorage.getItem("AllActivePrivateLayersLibrary"));
            if (AllActivePrivateLayers) {
                for (var _i = 0, AllActivePrivateLayers_1 = AllActivePrivateLayers; _i < AllActivePrivateLayers_1.length; _i++) {
                    var a = AllActivePrivateLayers_1[_i];
                    if (a.CategoryID == categoryId) {
                        if (this.MapServiceService.MyDataLibrary.getValue()) {
                            for (var _a = 0, _b = this.MapServiceService.MyDataLibrary.getValue(); _a < _b.length; _a++) {
                                var e = _b[_a];
                                if (e.CategoryID == categoryId) {
                                    e.LayerLibrary.length = 0;
                                    Array.prototype.push.apply(e.LayerLibrary, a.LayerLibrary);
                                }
                            }
                            this.MapServiceService.MyDataLibrary.getValue()[0].TotalCount = a.TotalCount;
                            this.MapServiceService.MyDataLibrary.getValue()[0].DisplayingCount = a.DisplayingCount;
                        }
                    }
                }
            }
        }
        if (SearchData && this.selectedfileType.length == 0) {
            Data = this.ActivePrivateLayersLibrary[0].LayerLibrary.filter(function (el) {
                if (((el.DataSetName.toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1) || (el.Description != null && el.Description.toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1))) {
                    return el;
                }
            });
            this.ActivePrivateLayersLibrary[0].LayerLibrary.length = 0;
            Array.prototype.push.apply(this.ActivePrivateLayersLibrary[0].LayerLibrary, Data);
            this.ActivePrivateLayersLibrary[0].TotalCount = Data.length;
            this.ActivePrivateLayersLibrary[0].DisplayingCount = Data.length;
        }
        else if (SearchData == "" && this.selectedfileType.length > 0) {
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
            Data = this.ActivePrivateLayersLibrary[0].LayerLibrary.filter(function (el) {
                if (selectedfileExtentions_1.indexOf(el.UploadFileType.toLocaleLowerCase()) > -1) {
                    return el;
                }
            });
            this.ActivePrivateLayersLibrary[0].LayerLibrary.length = 0;
            Array.prototype.push.apply(this.ActivePrivateLayersLibrary[0].LayerLibrary, Data);
            this.ActivePrivateLayersLibrary[0].TotalCount = Data.length;
            this.ActivePrivateLayersLibrary[0].DisplayingCount = Data.length;
        }
        else if (SearchData && this.selectedfileType.length > 0) {
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
            Data = this.ActivePrivateLayersLibrary[0].LayerLibrary.filter(function (el) {
                if (((el.DataSetName.toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1) || (el.Description != null && el.Description.toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1)) && (selectedfileExtentions_2.indexOf(el.UploadFileType.toLocaleLowerCase()) > -1)) {
                    return el;
                }
            });
            this.ActivePrivateLayersLibrary[0].LayerLibrary.length = 0;
            Array.prototype.push.apply(this.ActivePrivateLayersLibrary[0].LayerLibrary, Data);
            this.ActivePrivateLayersLibrary[0].TotalCount = Data.length;
            this.ActivePrivateLayersLibrary[0].DisplayingCount = Data.length;
        }
        else {
            this.ResetDataLayer();
        }
        //let _JsonAllActiveMapLayes = JSON.stringify(this.ActivePrivateLayersLibrary);
        //if(localStorage.getItem("test")!=null)
        //localStorage.setItem("AllActivePrivateLayersLibrary", _JsonAllActiveMapLayes);
    };
    MyDataComponent.prototype.onItemSelectChange = function (item) {
        this.SearchData();
    };
    MyDataComponent.prototype.ResetDataLayer = function () {
        this.LayerLoader = true;
        this.MydataSearchtext = '';
        this.selectedfileType = [];
        var categoryId = this.ActivePrivateLayersLibrary[0].CategoryID;
        if (localStorage.getItem("AllActivePrivateLayersLibrary")) {
            var AllActivePrivateLayers = JSON.parse(localStorage.getItem("AllActivePrivateLayersLibrary"));
            if (AllActivePrivateLayers) {
                for (var _i = 0, AllActivePrivateLayers_2 = AllActivePrivateLayers; _i < AllActivePrivateLayers_2.length; _i++) {
                    var a = AllActivePrivateLayers_2[_i];
                    if (a.CategoryID == categoryId) {
                        if (this.MapServiceService.MyDataLibrary.getValue()) {
                            for (var _a = 0, _b = this.MapServiceService.MyDataLibrary.getValue(); _a < _b.length; _a++) {
                                var e = _b[_a];
                                if (e.CategoryID == categoryId) {
                                    e.LayerLibrary.length = 0;
                                    Array.prototype.push.apply(e.LayerLibrary, a.LayerLibrary);
                                }
                            }
                            this.MapServiceService.MyDataLibrary.getValue()[0].TotalCount = a.TotalCount;
                            this.MapServiceService.MyDataLibrary.getValue()[0].DisplayingCount = a.DisplayingCount;
                        }
                    }
                }
            }
        }
        this.LayerLoader = false;
        //this.DisplayLayres(categoryId);
    };
    MyDataComponent.prototype.OpenEditMyDataModal = function (LayerId) {
        var ids = [LayerId];
        var privateLayerData;
        if (this.MapServiceService.MyDataLayerLibrary.getValue()) {
            var myDataLibraryList = this.MapServiceService.MyDataLayerLibrary.getValue()[0].LayerLibrary;
            var filteredData = myDataLibraryList.filter(function (item) { return ids.indexOf(item.DataSetID) > -1; });
            if (filteredData.length == 1) {
                privateLayerData = filteredData[0];
            }
        }
        var editModalRef = this.modalService.open(edit_mydata_component_1.EditMyDataComponent, { size: 'lg', backdropClass: 'adddata-backdrop', backdrop: 'static', centered: true, windowClass: 'editMydata-modal' });
        editModalRef.componentInstance.PrivateLayerData = privateLayerData;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MyDataComponent.prototype, "hideSomePart", void 0);
    MyDataComponent = __decorate([
        core_1.Component({
            selector: 'app-my-data',
            templateUrl: './my-data.component.html',
            styleUrls: ['./my-data.component.scss']
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal,
            auth_service_1.AuthenticationService,
            condensed_component_1.CondensedComponent,
            ngx_cookie_service_1.CookieService,
            map_service_service_1.MapServiceService,
            google_component_1.GoogleMapPage,
            ng_bootstrap_1.NgbModal,
            all_http_request_service_1.HttpRequestService,
            Utility_service_1.UtilityService])
    ], MyDataComponent);
    return MyDataComponent;
}());
exports.MyDataComponent = MyDataComponent;
//# sourceMappingURL=my-data.component.js.map