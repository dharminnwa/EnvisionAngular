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
var auth_service_1 = require("../../../../../services/auth.service");
var ngx_cookie_service_1 = require("ngx-cookie-service");
var map_service_service_1 = require("../../../../../services/map-service.service");
var all_http_request_service_1 = require("../../../../../services/all-http-request.service");
var environment_1 = require("../../../../../../environments/environment");
var EnergyDataComponent = (function () {
    function EnergyDataComponent(cookieService, 
        // public http: Http,
        AuthServices, 
        // public MapLayerService: MapLayerService,
        // public condensedService: condensedService,
        MapServiceService, httpRequest) {
        this.cookieService = cookieService;
        this.AuthServices = AuthServices;
        this.MapServiceService = MapServiceService;
        this.httpRequest = httpRequest;
        this.totalCount = 0;
        this.DisplayingCount = 0;
        this.NormalViewContent = true;
        this.ReducedViewContent = false;
        this.ImageListviewContent = false;
        this.LayerLoader = false;
        this.LoginId = '';
        this.Searchtext = '';
        this.showDefaultCategoryId = 0;
        this.ActiveMapLayersLibrary = [];
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
    }
    EnergyDataComponent.prototype.ngOnInit = function () {
        this.setMapserachLayer();
    };
    EnergyDataComponent.prototype.setMapserachLayer = function () {
        var _this = this;
        this.LayerLoader = true;
        this.LoginId = this.AuthServices.getUserId();
        if (!this.MapServiceService.EnergyLayerLibrary.getValue()) {
            //this.MapServiceService.GetEnergyLayerLibrary(this.LoginId, "Energy Layer Group", 0,777,0).subscribe(data => {
            this.httpRequest._NodeGetEnergyLayerLibrary(this.LoginId, "Energy Layer Group", 0, 777, 0).subscribe(function (data) {
                var Data = data;
                var LayersLibrary = Data;
                var res = LayersLibrary;
                if (res.errormsg == "") {
                    res["IsLoaded"] = true;
                    var layer = res.LayerLibrary[0].map(function (el) {
                        var o = Object.assign({}, el);
                        o.ViewData = 'View Data';
                        o.Addtomap = 'Add to map';
                        return o;
                    });
                    var DefaultLayer = [
                        {
                            CategoryID: 0,
                            LayerLibrary: layer,
                        }
                    ];
                    _this.MapServiceService.setMapSearchEnergyLayerLibrary(DefaultLayer);
                    _this.DisplayLayres(_this.showDefaultCategoryId);
                }
                else {
                    console.log(res.errorms);
                }
                _this.LayerLoader = false;
            }, function (error) {
                console.log(error);
                _this.LayerLoader = false;
            });
        }
        else {
            this.DisplayLayres(this.showDefaultCategoryId);
        }
    };
    EnergyDataComponent.prototype.DisplayLayres = function (categoryId) {
        var isActive = false;
        var LayerList;
        if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
            for (var _i = 0, _a = this.MapServiceService.EnergyLayerLibrary.getValue(); _i < _a.length; _i++) {
                var a = _a[_i];
                if (a.CategoryID == categoryId) {
                    isActive = true;
                    LayerList = a;
                }
            }
        }
        if (isActive == true) {
            //this.MapServiceService.setActiveLayerslist(DefaultLayer);
            this.ActiveMapLayersLibrary.length = 0;
            this.ActiveMapLayersLibrary.push(LayerList);
            this.totalCount = this.ActiveMapLayersLibrary[0].LayerLibrary.length;
            this.DisplayingCount = this.totalCount;
        }
        this.LayerLoader = false;
    };
    EnergyDataComponent.prototype.showNormalView = function () {
        this.LayerLoader = true;
        this.ReducedViewContent = false;
        this.ImageListviewContent = false;
        this.NormalViewContent = true;
        this.LayerLoader = false;
    };
    EnergyDataComponent.prototype.SearchData = function () {
        var SearchData = this.Searchtext.trim();
        localStorage.removeItem("AllActiveMapLayes_1");
        if (SearchData) {
            var Data = this.ActiveMapLayersLibrary[0].LayerLibrary.filter(function (el) {
                if (((el.LayerName.toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1) || ((el.DisplayName).toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1) ||
                    (!el.Tags && el.Tags.toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1))) {
                    return el;
                }
            });
            var _JsonAllActiveMapLayes = JSON.stringify(this.ActiveMapLayersLibrary);
            localStorage.setItem("AllActiveMapLayes_1", _JsonAllActiveMapLayes);
            this.ActiveMapLayersLibrary[0].LayerLibrary.length = 0;
            Array.prototype.push.apply(this.ActiveMapLayersLibrary[0].LayerLibrary, Data);
            this.DisplayingCount = this.ActiveMapLayersLibrary[0].LayerLibrary.length;
        }
        else {
            this.ResetDataLayer();
        }
    };
    EnergyDataComponent.prototype.ResetDataLayer = function () {
        this.LayerLoader = true;
        this.Searchtext = '';
        var categoryId = this.ActiveMapLayersLibrary[0].CategoryID;
        this.LoginId = this.AuthServices.getUserId();
        if (localStorage.getItem("AllActiveMapLayes_1")) {
            var AllActiveMapLayes = JSON.parse(localStorage.getItem("AllActiveMapLayes_1"));
            if (AllActiveMapLayes) {
                for (var _i = 0, AllActiveMapLayes_1 = AllActiveMapLayes; _i < AllActiveMapLayes_1.length; _i++) {
                    var a = AllActiveMapLayes_1[_i];
                    if (a.CategoryID == categoryId) {
                        if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
                            for (var _a = 0, _b = this.MapServiceService.EnergyLayerLibrary.getValue(); _a < _b.length; _a++) {
                                var e = _b[_a];
                                if (e.CategoryID == categoryId) {
                                    e.LayerLibrary.length = 0;
                                    Array.prototype.push.apply(e.LayerLibrary, a.LayerLibrary);
                                }
                            }
                        }
                    }
                }
            }
        }
        this.DisplayLayres(categoryId);
    };
    EnergyDataComponent.prototype.AddtomapClick = function (LayerId, CategoryId) {
        if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
            for (var _i = 0, _a = this.MapServiceService.EnergyLayerLibrary.getValue(); _i < _a.length; _i++) {
                var a = _a[_i];
                if (a.CategoryID == CategoryId) {
                    var _loop_1 = function (e) {
                        if (e.EnergyLayerID == LayerId) {
                            if (e.Addtomap == 'Add to map') {
                                e.Addtomap = 'Remove from map';
                                this_1.CondensedComponent.GetTreeData(LayerId);
                                setTimeout(function () {
                                    var Treeecheckboxlement = document.getElementById(e.EnergyLayerID + 'LoadlayerinTreeData');
                                    if (Treeecheckboxlement == null) {
                                        setTimeout(function () { Treeecheckboxlement.click(); }, 1000);
                                    }
                                    else
                                        Treeecheckboxlement.click();
                                }, 2500);
                            }
                            else {
                                e.Addtomap = 'Add to map';
                                var EnergyLayerID_1 = e.EnergyLayerID + 'RemoveTreeData';
                                setTimeout(function () {
                                    var element = document.getElementById(EnergyLayerID_1);
                                    element.click();
                                }, 1000);
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
    EnergyDataComponent = __decorate([
        core_1.Component({
            selector: 'app-energy-data',
            templateUrl: './energy-data.component.html',
            styleUrls: ['./energy-data.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_cookie_service_1.CookieService,
            auth_service_1.AuthenticationService,
            map_service_service_1.MapServiceService,
            all_http_request_service_1.HttpRequestService])
    ], EnergyDataComponent);
    return EnergyDataComponent;
}());
exports.EnergyDataComponent = EnergyDataComponent;
//# sourceMappingURL=energy-data.component.js.map