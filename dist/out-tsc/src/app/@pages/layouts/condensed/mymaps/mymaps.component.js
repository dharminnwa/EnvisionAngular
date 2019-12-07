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
var map_library_component_1 = require("../map-library/map-library.component");
var tools_service_1 = require("../../../../services/tools.service");
var auth_service_1 = require("../../../../services/auth.service");
var Utility_service_1 = require("../../../../services/Utility.service");
var all_http_request_service_1 = require("../../../../services/all-http-request.service");
var map_service_service_1 = require("../../../../services/map-service.service");
var environment_1 = require("../../../../../environments/environment");
var my_map_service_1 = require("../../../../services/my-map.service");
var basemap_component_1 = require("../basemap/basemap.component");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var condensed_component_1 = require("../condensed.component");
var deletemap_confirmation_component_1 = require("./deletemap-confirmation/deletemap-confirmation.component");
var edit_my_map_component_1 = require("./edit-my-map/edit-my-map.component");
var MymapsComponent = (function () {
    function MymapsComponent(activeModal, modalService, toolsService, utilityService, authServices, httpService, mapServiceService, httpRequestService, myMapService, Injector, bsModalRef, authenticationService, bsModalService) {
        this.activeModal = activeModal;
        this.modalService = modalService;
        this.toolsService = toolsService;
        this.utilityService = utilityService;
        this.authServices = authServices;
        this.httpService = httpService;
        this.mapServiceService = mapServiceService;
        this.httpRequestService = httpRequestService;
        this.myMapService = myMapService;
        this.Injector = Injector;
        this.bsModalRef = bsModalRef;
        this.authenticationService = authenticationService;
        this.bsModalService = bsModalService;
        this.ShowLoader = false;
        this.AllMyMapList = [];
        this.AllSharedMapList = [];
        this.userMapList = [];
        this.myMapList = [];
        this.sharedMapList = [];
        this.searchMyMap = '';
        this.searchSharedMap = '';
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
        //totalMyMaps: number = 0;
        this.title = "";
        this.mymaptotalcount = 0;
        this.SharedmapTotalcount = 0;
        this.basemapComponent = Injector.get(basemap_component_1.BasemapComponent);
        this.condensedComponent = Injector.get(condensed_component_1.CondensedComponent);
    }
    MymapsComponent.prototype.ngOnInit = function () {
        this.utilityService.CloseModalOnRouteChange(this.activeModal);
        this.Draggable();
        if (this.modalName == 'sharedMap') {
            this.SwitchSharedMap();
        }
        else
            this.title = "My Maps";
        this.GetUserMaps();
    };
    MymapsComponent.prototype.SearchMyMap = function () {
        var SearchData = this.searchMyMap.trim();
        if (SearchData) {
            this.myMapList = [];
            var _AllMyMapList = this.mapServiceService._UserMapData.getValue().filter(function (m) { return m.Type == 'mymap'; });
            _AllMyMapList.map(function (el) {
                if (el && el.Name) {
                    if (((el.Name != null && el.Name.toLowerCase().indexOf(SearchData.toLowerCase()) > -1)
                        || (el.Description != null && el.Description.toLowerCase().indexOf(SearchData.toLowerCase()) > -1))) {
                        el.isVisible = true;
                    }
                    else {
                        el.isVisible = false;
                    }
                }
            });
            this.mymaptotalcount = _AllMyMapList.filter(function (x) { return x.isVisible == true; }).length;
        }
        else {
            this.ResetMyMap();
        }
    };
    MymapsComponent.prototype.SearchSharedMap = function () {
        var SearchData = this.searchSharedMap.trim();
        if (SearchData) {
            this.sharedMapList = [];
            var _AllSharedMapList = this.mapServiceService._UserMapData.getValue().filter(function (m) { return m.Type == 'sharedmap'; });
            _AllSharedMapList.map(function (el) {
                if (el != undefined && el != null && el.Name != '') {
                    if (((el.Name != null && el.Name.toLowerCase().indexOf(SearchData.toLowerCase()) > -1)
                        || (el.Description != null && el.Description.toLowerCase().indexOf(SearchData.toLowerCase()) > -1))) {
                        //this.sharedMapList.push(el);
                        el.isVisible = true;
                    }
                    else {
                        el.isVisible = false;
                    }
                }
            });
            this.SharedmapTotalcount = _AllSharedMapList.filter(function (x) { return x.isVisible == true; }).length;
        }
        else {
            this.ResetSharedMap();
        }
    };
    MymapsComponent.prototype.ResetMyMap = function () {
        var _AllMyMapList = this.mapServiceService._UserMapData.getValue().filter(function (m) { return m.Type == 'mymap'; });
        _AllMyMapList.map(function (el) { el.isVisible = true; });
        this.myMapList = _AllMyMapList;
        this.mymaptotalcount = this.myMapList.length;
        this.searchMyMap = '';
    };
    MymapsComponent.prototype.ResetSharedMap = function () {
        var AllSharedMapList = this.mapServiceService._UserMapData.getValue().filter(function (m) { return m.Type == 'sharedmap'; });
        AllSharedMapList.map(function (el) { el.isVisible = true; });
        this.sharedMapList = AllSharedMapList;
        this.SharedmapTotalcount = this.sharedMapList.length;
        this.searchSharedMap = '';
    };
    MymapsComponent.prototype.GetUserMaps = function () {
        var _this = this;
        this.userMapList = this.mapServiceService._UserMapData.getValue();
        if (this.userMapList == null) {
            var Userid = this.authServices.getLoggedinUserId();
            this.ShowLoader = true;
            this.httpService._NodeGetUserMaps(Userid).subscribe(function (data) {
                _this.ShowLoader = false;
                if (data._Issuccess) {
                    var mdata = data.MapbyUSerData;
                    mdata = mdata.map(function (el) {
                        var o = Object.assign({}, el);
                        o.isVisible = true;
                        return o;
                    });
                    if (mdata.length > 0) {
                        _this.userMapList = mdata;
                        _this.mapServiceService.setUserMap(mdata);
                        _this.myMapList = _this.userMapList.filter(function (m) { return m.Type == 'mymap'; });
                        _this.sharedMapList = _this.userMapList.filter(function (m) { return m.Type == 'sharedmap'; });
                        _this.mymaptotalcount = _this.myMapList.length;
                        _this.SharedmapTotalcount = _this.sharedMapList.length;
                        _this.AllMyMapList = _this.myMapList;
                        _this.AllSharedMapList = _this.sharedMapList;
                    }
                }
            }, function (error) {
                console.log(error);
                _this.ShowLoader = false;
            });
        }
        else {
            var _AllMyMapList = this.mapServiceService._UserMapData.getValue().filter(function (m) { return m.Type == 'mymap'; });
            var _AllsharedMapList = this.mapServiceService._UserMapData.getValue().filter(function (m) { return m.Type == 'sharedmap'; });
            _AllMyMapList.map(function (el) { el.isVisible = true; });
            _AllsharedMapList.map(function (el) { el.isVisible = true; });
            this.myMapList = _AllMyMapList;
            this.sharedMapList = _AllsharedMapList;
            this.mymaptotalcount = this.myMapList.length;
            this.SharedmapTotalcount = this.sharedMapList.length;
            this.AllMyMapList = this.myMapList;
            this.AllSharedMapList = this.sharedMapList;
        }
    };
    MymapsComponent.prototype.SwitchMyMap = function () {
        this.title = "My Maps";
        var sharedMap = document.getElementById('shareMapCard');
        var myMap = document.getElementById('myMapCard');
        myMap.classList.remove("hide");
        sharedMap.classList.add("hide");
    };
    MymapsComponent.prototype.SwitchSharedMap = function () {
        this.title = "Shared Maps";
        var sharedMap = document.getElementById('shareMapCard');
        var myMap = document.getElementById('myMapCard');
        myMap.classList.add("hide");
        sharedMap.classList.remove("hide");
    };
    MymapsComponent.prototype.OpenMapLibrary = function () {
        this.modalService.open(map_library_component_1.MapLibraryComponent, { size: 'lg', centered: true, backdrop: 'static', windowClass: "mapLibrary-modal" });
        this.activeModal.close();
    };
    MymapsComponent.prototype.Draggable = function () {
        setTimeout(function () {
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
        }, 10);
    };
    MymapsComponent.prototype.ViewMyMap = function (mapID) {
        var _this = this;
        debugger;
        this.condensedComponent.BlankMap();
        setTimeout(function () {
            _this.httpRequestService._NodeGetMapData(mapID).subscribe(function (data) {
                if (data._Issuccess) {
                    var UserId_1 = _this.authenticationService.getLoggedinUserId();
                    var UserData = _this.authenticationService.GetUserData();
                    var UserName = UserData ? UserData.DisplayName : _this.authenticationService.GetUsername();
                    //Map Settings
                    if (data.CustomMapData.CustomMaps.length > 0) {
                        var customMapData = data.CustomMapData.CustomMaps[0];
                        _this.httpRequestService._NodeInsertMyMapLogs(customMapData, UserId_1, UserName).subscribe(function (data) { });
                        if (_this.mapServiceService._mapdata.getValue()) {
                            _this.mapServiceService.setMapTitledata(customMapData.Name);
                            var map = _this.mapServiceService._mapdata.getValue();
                            map.setCenter({ lat: customMapData.CenterLatitude, lng: customMapData.CenterLongitude });
                            map.setZoom(customMapData.ZoomLevel);
                            _this.ChangeBaseMapById(customMapData.BaseMapProviderId);
                            if (customMapData.LegendOrder) {
                                _this.condensedComponent.ShowLegends();
                            }
                        }
                    }
                    //Energy Layers Settings
                    if (data.CustomMapData.CustomMaps_EnergyLayers.length > 0 && data.CustomMapData.CustomMaps.length > 0) {
                        var distinctParentIds = data.CustomMapData.CustomMaps_EnergyLayers.map(function (r) { return r.EnergyParentID; }).filter(function (value, index, self) { return self.indexOf(value) === index; });
                        var individualLayers = [];
                        var groupLayers = [];
                        var gLayers = [];
                        for (var _i = 0, distinctParentIds_1 = distinctParentIds; _i < distinctParentIds_1.length; _i++) {
                            var id = distinctParentIds_1[_i];
                            for (var _a = 0, _b = data.CustomMapData.CustomMaps_EnergyLayers; _a < _b.length; _a++) {
                                var layer = _b[_a];
                                if (layer.EnergyParentID == id && layer.IsHaschild)
                                    gLayers.push(layer.EnergyParentID);
                                else if (layer.EnergyParentID == id && !layer.IsHaschild)
                                    individualLayers.push(layer.EnergyLayerId);
                            }
                        }
                        var needToRemoveItems = [];
                        if (gLayers.length > 0) {
                            gLayers = gLayers.filter(function (value, index, self) { return self.indexOf(value) === index; });
                            for (var _c = 0, gLayers_1 = gLayers; _c < gLayers_1.length; _c++) {
                                var layer = gLayers_1[_c];
                                var childs = [];
                                data.CustomMapData.CustomMaps_EnergyLayers.map(function (e) {
                                    if (e.EnergyParentID == layer)
                                        childs.push(e.EnergyLayerId);
                                });
                                if (childs.length > 1)
                                    groupLayers.push({ ParentLayerId: layer, Childs: childs });
                                else if (childs.length == 1) {
                                    needToRemoveItems.push(gLayers.indexOf(layer));
                                    individualLayers.push(childs[0]);
                                }
                            }
                        }
                        if (needToRemoveItems.length > 0) {
                            for (var i = needToRemoveItems.length - 1; i >= 0; i--)
                                gLayers.splice(needToRemoveItems[i], 1);
                        }
                        var energyLayersData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps_EnergyLayers));
                        for (var _d = 0, energyLayersData_1 = energyLayersData; _d < energyLayersData_1.length; _d++) {
                            var layer = energyLayersData_1[_d];
                            if (gLayers.indexOf(layer.EnergyParentID) != -1)
                                layer.EnergyLayerId = layer.EnergyParentID;
                        }
                        var energyLayerOrders = energyLayersData.map(function (r) { return r.EnergyLayerId; }).filter(function (value, index, self) { return self.indexOf(value) === index; });
                        if (data.CustomMapData.CustomMaps_DefaultCheckedLayers.length > 0) {
                            var defauldCheckedGuids = data.CustomMapData.CustomMaps_DefaultCheckedLayers.map(function (r) { return r.LayerGuid.toLowerCase(); });
                            if (energyLayerOrders.length > 1) {
                                for (var _e = 0, energyLayerOrders_1 = energyLayerOrders; _e < energyLayerOrders_1.length; _e++) {
                                    var id = energyLayerOrders_1[_e];
                                    if (individualLayers.indexOf(id) > -1)
                                        _this.condensedComponent.GetTreeData(id, defauldCheckedGuids, energyLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                                    else if (gLayers.indexOf(id) > -1) {
                                        var selectedGroupLayer = [];
                                        groupLayers.map(function (e) {
                                            if (e.ParentLayerId == id)
                                                selectedGroupLayer.push(e);
                                        });
                                        if (selectedGroupLayer.length == 1) {
                                            setTimeout(function () {
                                                _this.condensedComponent.GetTreeData(selectedGroupLayer[0], defauldCheckedGuids, energyLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                                            }, 100);
                                        }
                                    }
                                }
                            }
                            else if (energyLayerOrders.length == 1) {
                                if (individualLayers.indexOf(energyLayerOrders[0]) > -1) {
                                    setTimeout(function () {
                                        _this.condensedComponent.GetTreeData(energyLayerOrders[0], defauldCheckedGuids, [], data.CustomMapData.CustomMaps[0].CustomMapId);
                                    }, 100);
                                }
                                else if (gLayers.indexOf(energyLayerOrders[0]) > -1) {
                                    var selectedGroupLayer = [];
                                    groupLayers.map(function (e) {
                                        if (e.ParentLayerId == energyLayerOrders[0])
                                            selectedGroupLayer.push(e);
                                    });
                                    if (selectedGroupLayer.length == 1) {
                                        setTimeout(function () {
                                            _this.condensedComponent.GetTreeData(selectedGroupLayer[0], defauldCheckedGuids, [], data.CustomMapData.CustomMaps[0].CustomMapId);
                                        }, 100);
                                    }
                                }
                            }
                        }
                        else {
                            if (energyLayerOrders.length > 1) {
                                for (var _f = 0, energyLayerOrders_2 = energyLayerOrders; _f < energyLayerOrders_2.length; _f++) {
                                    var id = energyLayerOrders_2[_f];
                                    if (individualLayers.indexOf(id) > -1) {
                                        setTimeout(function () {
                                            _this.condensedComponent.GetTreeData(id, [], energyLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                                        }, 100);
                                    }
                                    else if (gLayers.indexOf(id) > -1) {
                                        var selectedGroupLayer = [];
                                        groupLayers.map(function (e) {
                                            if (e.ParentLayerId == id)
                                                selectedGroupLayer.push(e);
                                        });
                                        if (selectedGroupLayer.length == 1)
                                            setTimeout(function () {
                                                _this.condensedComponent.GetTreeData(selectedGroupLayer[0], [], energyLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                                            }, 100);
                                    }
                                }
                            }
                            else if (energyLayerOrders.length == 1) {
                                if (individualLayers.indexOf(energyLayerOrders[0]) > -1) {
                                    setTimeout(function () {
                                        _this.condensedComponent.GetTreeData(energyLayerOrders[0], [], [], data.CustomMapData.CustomMaps[0].CustomMapId);
                                    }, 100);
                                }
                                else if (gLayers.indexOf(energyLayerOrders[0]) > -1) {
                                    var selectedGroupLayer = [];
                                    groupLayers.map(function (e) {
                                        if (e.ParentLayerId == energyLayerOrders[0])
                                            selectedGroupLayer.push(e);
                                    });
                                    if (selectedGroupLayer.length == 1)
                                        setTimeout(function () {
                                            _this.condensedComponent.GetTreeData(selectedGroupLayer[0], [], [], data.CustomMapData.CustomMaps[0].CustomMapId);
                                        }, 100);
                                }
                            }
                        }
                    }
                    //Private Layers Settings
                    if (data.CustomMapData.CustomMaps_DataSets.length > 0 && data.CustomMapData.CustomMaps.length > 0) {
                        var privateLayers_1 = [];
                        data.CustomMapData.CustomMaps_DataSets.map(function (e) {
                            if (e.UploadedBy.toLowerCase() == UserId_1.toLowerCase()) {
                                privateLayers_1.push(e);
                            }
                        });
                        if (privateLayers_1.length > 0) {
                            var distinctParentIds = privateLayers_1.map(function (r) { return r.ParentDataSetID; }).filter(function (value, index, self) { return self.indexOf(value) === index; }).filter(function (r) { return r; });
                            var individualLayers = [];
                            var groupLayers = [];
                            for (var _g = 0, privateLayers_2 = privateLayers_1; _g < privateLayers_2.length; _g++) {
                                var layer = privateLayers_2[_g];
                                if (!layer.ParentDataSetID) {
                                    if (distinctParentIds.indexOf(layer.DataSetId) == -1)
                                        individualLayers.push(layer.DataSetId);
                                }
                            }
                            if (distinctParentIds.length > 0) {
                                for (var _h = 0, distinctParentIds_2 = distinctParentIds; _h < distinctParentIds_2.length; _h++) {
                                    var layer = distinctParentIds_2[_h];
                                    var childs = [];
                                    privateLayers_1.map(function (e) {
                                        if (e.ParentDataSetID == layer)
                                            childs.push(e.DataSetId);
                                    });
                                    groupLayers.push({ ParentLayerId: layer, Childs: childs });
                                }
                            }
                            var privateLayersData = JSON.parse(JSON.stringify(privateLayers_1));
                            for (var _j = 0, privateLayersData_1 = privateLayersData; _j < privateLayersData_1.length; _j++) {
                                var layer = privateLayersData_1[_j];
                                if (distinctParentIds.indexOf(layer.ParentDataSetID) != -1)
                                    layer.DataSetId = layer.ParentDataSetID;
                            }
                            var privateLayerOrders = privateLayersData.map(function (r) { return r.DataSetId; }).filter(function (value, index, self) { return self.indexOf(value) === index; });
                            if (data.CustomMapData.CustomMaps_DefaultCheckedLayers.length > 0) {
                                var defauldCheckedGuids = data.CustomMapData.CustomMaps_DefaultCheckedLayers.map(function (r) { return r.LayerGuid.toLowerCase(); });
                                if (privateLayerOrders.length > 1) {
                                    for (var _k = 0, privateLayerOrders_1 = privateLayerOrders; _k < privateLayerOrders_1.length; _k++) {
                                        var id = privateLayerOrders_1[_k];
                                        if (individualLayers.indexOf(id) > -1)
                                            _this.condensedComponent.GetPrivateLayerTreeData(id, defauldCheckedGuids, privateLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                                        else if (distinctParentIds.indexOf(id) > -1) {
                                            var selectedGroupLayer = [];
                                            groupLayers.map(function (e) {
                                                if (e.ParentLayerId == id)
                                                    selectedGroupLayer.push(e);
                                            });
                                            if (selectedGroupLayer.length == 1)
                                                _this.condensedComponent.GetPrivateLayerTreeData(selectedGroupLayer[0], defauldCheckedGuids, privateLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                                        }
                                    }
                                }
                                else if (privateLayerOrders.length == 1) {
                                    if (individualLayers.indexOf(privateLayerOrders[0]) > -1)
                                        _this.condensedComponent.GetPrivateLayerTreeData(privateLayerOrders[0], defauldCheckedGuids, [], data.CustomMapData.CustomMaps[0].CustomMapId);
                                    else if (distinctParentIds.indexOf(privateLayerOrders[0]) > -1) {
                                        var selectedGroupLayer = [];
                                        groupLayers.map(function (e) {
                                            if (e.ParentLayerId == privateLayerOrders[0])
                                                selectedGroupLayer.push(e);
                                        });
                                        if (selectedGroupLayer.length == 1)
                                            _this.condensedComponent.GetPrivateLayerTreeData(selectedGroupLayer[0], defauldCheckedGuids, [], data.CustomMapData.CustomMaps[0].CustomMapId);
                                    }
                                }
                            }
                            else {
                                if (privateLayerOrders.length > 1) {
                                    for (var _l = 0, privateLayerOrders_2 = privateLayerOrders; _l < privateLayerOrders_2.length; _l++) {
                                        var id = privateLayerOrders_2[_l];
                                        if (individualLayers.indexOf(id) > -1)
                                            _this.condensedComponent.GetPrivateLayerTreeData(id, [], privateLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                                        else if (distinctParentIds.indexOf(id) > -1) {
                                            var selectedGroupLayer = [];
                                            groupLayers.map(function (e) {
                                                if (e.ParentLayerId == id)
                                                    selectedGroupLayer.push(e);
                                            });
                                            if (selectedGroupLayer.length == 1)
                                                _this.condensedComponent.GetPrivateLayerTreeData(selectedGroupLayer[0], [], privateLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                                        }
                                    }
                                }
                                else if (privateLayerOrders.length == 1) {
                                    if (individualLayers.indexOf(privateLayerOrders[0]) > -1)
                                        _this.condensedComponent.GetPrivateLayerTreeData(privateLayerOrders[0], [], [], data.CustomMapData.CustomMaps[0].CustomMapId);
                                    else if (distinctParentIds.indexOf(privateLayerOrders[0]) > -1) {
                                        var selectedGroupLayer = [];
                                        groupLayers.map(function (e) {
                                            if (e.ParentLayerId == privateLayerOrders[0])
                                                selectedGroupLayer.push(e);
                                        });
                                        if (selectedGroupLayer.length == 1)
                                            _this.condensedComponent.GetPrivateLayerTreeData(selectedGroupLayer[0], [], [], data.CustomMapData.CustomMaps[0].CustomMapId);
                                    }
                                }
                            }
                        }
                    }
                    //Shared Layers Settings
                    if (data.CustomMapData.CustomMaps_DataSets.length > 0 && data.CustomMapData.CustomMaps.length > 0) {
                        var sharedLayers_1 = [];
                        data.CustomMapData.CustomMaps_DataSets.map(function (e) {
                            if (e.UploadedBy.toLowerCase() != UserId_1.toLowerCase()) {
                                sharedLayers_1.push(e);
                            }
                        });
                        if (sharedLayers_1.length > 0) {
                            var distinctParentIds = sharedLayers_1.map(function (r) { return r.ParentDataSetID; }).filter(function (value, index, self) { return self.indexOf(value) === index; }).filter(function (r) { return r; });
                            var individualLayers = [];
                            var groupLayers = [];
                            for (var _m = 0, sharedLayers_2 = sharedLayers_1; _m < sharedLayers_2.length; _m++) {
                                var layer = sharedLayers_2[_m];
                                if (!layer.ParentDataSetID) {
                                    if (distinctParentIds.indexOf(layer.DataSetId) == -1)
                                        individualLayers.push(layer.DataSetId);
                                }
                            }
                            if (distinctParentIds.length > 0) {
                                for (var _o = 0, distinctParentIds_3 = distinctParentIds; _o < distinctParentIds_3.length; _o++) {
                                    var layer = distinctParentIds_3[_o];
                                    var childs = [];
                                    sharedLayers_1.map(function (e) {
                                        if (e.ParentDataSetID == layer)
                                            childs.push(e.DataSetId);
                                    });
                                    groupLayers.push({ ParentLayerId: layer, Childs: childs });
                                }
                            }
                            var sharedLayersData = JSON.parse(JSON.stringify(sharedLayers_1));
                            for (var _p = 0, sharedLayersData_1 = sharedLayersData; _p < sharedLayersData_1.length; _p++) {
                                var layer = sharedLayersData_1[_p];
                                if (distinctParentIds.indexOf(layer.ParentDataSetID) != -1)
                                    layer.DataSetId = layer.ParentDataSetID;
                            }
                            var sharedLayerOrders = sharedLayersData.map(function (r) { return r.DataSetId; }).filter(function (value, index, self) { return self.indexOf(value) === index; });
                            if (data.CustomMapData.CustomMaps_DefaultCheckedLayers.length > 0) {
                                var defauldCheckedGuids = data.CustomMapData.CustomMaps_DefaultCheckedLayers.map(function (r) { return r.LayerGuid.toLowerCase(); });
                                if (sharedLayerOrders.length > 1) {
                                    for (var _q = 0, sharedLayerOrders_1 = sharedLayerOrders; _q < sharedLayerOrders_1.length; _q++) {
                                        var id = sharedLayerOrders_1[_q];
                                        if (individualLayers.indexOf(id) > -1)
                                            _this.condensedComponent.GetSharedLayerTreeData(id, defauldCheckedGuids, sharedLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                                        else if (distinctParentIds.indexOf(id) > -1) {
                                            var selectedGroupLayer = [];
                                            groupLayers.map(function (e) {
                                                if (e.ParentLayerId == id)
                                                    selectedGroupLayer.push(e);
                                            });
                                            if (selectedGroupLayer.length == 1)
                                                _this.condensedComponent.GetSharedLayerTreeData(selectedGroupLayer[0], defauldCheckedGuids, sharedLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                                        }
                                    }
                                }
                                else if (sharedLayerOrders.length == 1) {
                                    if (individualLayers.indexOf(sharedLayerOrders[0]) > -1)
                                        _this.condensedComponent.GetSharedLayerTreeData(sharedLayerOrders[0], defauldCheckedGuids, [], data.CustomMapData.CustomMaps[0].CustomMapId);
                                    else if (distinctParentIds.indexOf(sharedLayerOrders[0]) > -1) {
                                        var selectedGroupLayer = [];
                                        groupLayers.map(function (e) {
                                            if (e.ParentLayerId == sharedLayerOrders[0])
                                                selectedGroupLayer.push(e);
                                        });
                                        if (selectedGroupLayer.length == 1)
                                            _this.condensedComponent.GetSharedLayerTreeData(selectedGroupLayer[0], defauldCheckedGuids, [], data.CustomMapData.CustomMaps[0].CustomMapId);
                                    }
                                }
                            }
                            else {
                                if (sharedLayerOrders.length > 1) {
                                    for (var _r = 0, sharedLayerOrders_2 = sharedLayerOrders; _r < sharedLayerOrders_2.length; _r++) {
                                        var id = sharedLayerOrders_2[_r];
                                        if (individualLayers.indexOf(id) > -1)
                                            _this.condensedComponent.GetSharedLayerTreeData(id, [], sharedLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                                        else if (distinctParentIds.indexOf(id) > -1) {
                                            var selectedGroupLayer = [];
                                            groupLayers.map(function (e) {
                                                if (e.ParentLayerId == id)
                                                    selectedGroupLayer.push(e);
                                            });
                                            if (selectedGroupLayer.length == 1)
                                                _this.condensedComponent.GetSharedLayerTreeData(selectedGroupLayer[0], [], sharedLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                                        }
                                    }
                                }
                                else if (sharedLayerOrders.length == 1) {
                                    if (individualLayers.indexOf(sharedLayerOrders[0]) > -1)
                                        _this.condensedComponent.GetSharedLayerTreeData(sharedLayerOrders[0], [], [], data.CustomMapData.CustomMaps[0].CustomMapId);
                                    else if (distinctParentIds.indexOf(sharedLayerOrders[0]) > -1) {
                                        var selectedGroupLayer = [];
                                        groupLayers.map(function (e) {
                                            if (e.ParentLayerId == sharedLayerOrders[0])
                                                selectedGroupLayer.push(e);
                                        });
                                        if (selectedGroupLayer.length == 1)
                                            _this.condensedComponent.GetSharedLayerTreeData(selectedGroupLayer[0], [], [], data.CustomMapData.CustomMaps[0].CustomMapId);
                                    }
                                }
                            }
                        }
                    }
                    _this.myMapService.isCustomMapLoaded = true;
                    _this.myMapService.loadedMapData = data.CustomMapData;
                }
            }, function (error) {
                console.log(error);
            });
        }, 1000);
    };
    MymapsComponent.prototype.loadLayersOnMapById = function (id, individualLayers, gLayers, defauldCheckedGuids) {
        var _this = this;
        setTimeout(function () {
            if (individualLayers.indexOf(id) > -1)
                _this.condensedComponent.GetTreeData(id, defauldCheckedGuids);
            else if (gLayers.indexOf(id) > -1)
                _this.condensedComponent.GetTreeData(id, defauldCheckedGuids);
        }, 5000);
    };
    MymapsComponent.prototype.ChangeBaseMapById = function (BaseMapProviderId) {
        var _this = this;
        var List = this.mapServiceService.BaseMapData.getValue();
        if (List == null) {
            this.ShowLoader = true;
            var UserId = this.authenticationService.getLoggedinUserId();
            this.httpRequestService._NodeGetBaseMapTypes(UserId).subscribe(function (data) {
                if (data._Issuccess) {
                    _this.basemapComponent.baseMapList = data.BaseMapData;
                    _this.basemapComponent.SetDefualtMapBasedonMapsetting(data);
                    _this.mapServiceService.setBaseMap(data);
                }
                _this.ShowLoader = false;
            }, function (error) {
                console.log(error);
                _this.ShowLoader = false;
            });
        }
        else {
            this.basemapComponent.baseMapList = List.BaseMapData;
            this.basemapComponent.SetDefualtMapBasedonMapsetting(List);
        }
        this.basemapComponent.ChangeBaseMap(BaseMapProviderId);
    };
    MymapsComponent.prototype.openDeleteMapConfirmation = function (mapID, mapName) {
        var initialState = {
            MapId: mapID,
            MapName: mapName,
        };
        this.bsModalService.show(deletemap_confirmation_component_1.DeleteMapConfirmationComponent, { class: 'modal-md deletemapConfirmation modal-dialog-centered top-backdrop', backdrop: 'static', animated: false, initialState: initialState });
    };
    MymapsComponent.prototype.filterMyMap = function (itemList) {
        var myMapList = [];
        if (itemList && itemList.length > 0) {
            myMapList = itemList.filter(function (m) { return m.Type == 'mymap'; });
            //this.totalMyMaps = myMapList.length;
        }
        return myMapList;
    };
    MymapsComponent.prototype.EditMyMap = function (MapData) {
        var initialState = {
            MapData: MapData
        };
        this.bsModalService.show(edit_my_map_component_1.EditMyMapComponent, { class: 'modal-md EditmymapConfirmation modal-dialog-centered top-backdrop', backdrop: 'static', animated: false, initialState: initialState });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MymapsComponent.prototype, "modalName", void 0);
    MymapsComponent = __decorate([
        core_1.Component({
            selector: 'app-mymaps',
            templateUrl: './mymaps.component.html',
            styleUrls: ['./mymaps.component.scss'],
            providers: [basemap_component_1.BasemapComponent, ngx_bootstrap_1.BsModalRef]
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal,
            ng_bootstrap_1.NgbModal,
            tools_service_1.ToolsService,
            Utility_service_1.UtilityService,
            auth_service_1.AuthenticationService,
            all_http_request_service_1.HttpRequestService,
            map_service_service_1.MapServiceService,
            all_http_request_service_1.HttpRequestService,
            my_map_service_1.MyMapService,
            core_1.Injector,
            ngx_bootstrap_1.BsModalRef,
            auth_service_1.AuthenticationService,
            ngx_bootstrap_1.BsModalService])
    ], MymapsComponent);
    return MymapsComponent;
}());
exports.MymapsComponent = MymapsComponent;
//# sourceMappingURL=mymaps.component.js.map