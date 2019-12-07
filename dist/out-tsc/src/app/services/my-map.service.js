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
var map_service_service_1 = require("./map-service.service");
var auth_service_1 = require("./auth.service");
var Utility_service_1 = require("../services/Utility.service");
var MyMapService = (function () {
    function MyMapService(MapServiceService, AuthServices, UtilityService) {
        this.MapServiceService = MapServiceService;
        this.AuthServices = AuthServices;
        this.UtilityService = UtilityService;
        this.isCustomMapLoaded = false;
        this.loadedMapData = null;
    }
    MyMapService.prototype.GetCustomMapData = function () {
        var customMap = {};
        if (this.MapServiceService.BaseMapData.getValue()) {
            var baseMapProvider = [];
            this.MapServiceService.BaseMapData.getValue().BaseMapData.map(function (e) {
                if (e.IsDefault)
                    baseMapProvider.push(e);
            });
            if (baseMapProvider.length == 1 && this.MapServiceService.getMapTitledata().getValue() && this.MapServiceService._mapdata.getValue()) {
                customMap = {
                    Name: this.MapServiceService.getMapTitledata().getValue(),
                    Description: this.MapServiceService.getMapTitledata().getValue(),
                    UserId: this.AuthServices.getLoggedinUserId(),
                    CenterLatitude: this.MapServiceService._mapdata.getValue().getCenter().lat(),
                    CenterLongitude: this.MapServiceService._mapdata.getValue().getCenter().lng(),
                    ZoomLevel: this.MapServiceService._mapdata.getValue().getZoom(),
                    BaseMapProviderId: baseMapProvider[0].BaseMapProviderID,
                    LegendOrder: ""
                };
            }
        }
        return customMap;
    };
    MyMapService.prototype.GetDefaultCheckedLayers = function (energyLayersList, dataSetsLayerList, sharedLayerList) {
        var defaultCheckedLayers = [];
        if (energyLayersList.length > 0) {
            for (var _i = 0, energyLayersList_1 = energyLayersList; _i < energyLayersList_1.length; _i++) {
                var e = energyLayersList_1[_i];
                var treeNode = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(e.EnergyLayerID);
                if (treeNode && treeNode.data.IsChecked == false)
                    defaultCheckedLayers.push({ EnergyLayerID: e.EnergyLayerID, GUID: e.EnergyLayerGUID });
            }
        }
        if (dataSetsLayerList.length > 0) {
            for (var _a = 0, dataSetsLayerList_1 = dataSetsLayerList; _a < dataSetsLayerList_1.length; _a++) {
                var e = dataSetsLayerList_1[_a];
                var treeNode = this.MapServiceService._PrivateTreeUI.getValue().treeModel.getNodeById(e.DataSetID);
                if (treeNode && treeNode.data.IsChecked == false)
                    defaultCheckedLayers.push({ DataSetID: e.DataSetID, GUID: e.DataSetGUID });
            }
        }
        if (sharedLayerList.length > 0) {
            for (var _b = 0, sharedLayerList_1 = sharedLayerList; _b < sharedLayerList_1.length; _b++) {
                var e = sharedLayerList_1[_b];
                var treeNode = this.MapServiceService._SharedTreeUI.getValue().treeModel.getNodeById(e.DataSetID);
                if (treeNode && treeNode.data.IsChecked == false)
                    defaultCheckedLayers.push({ DataSetID: e.DataSetID, GUID: e.DataSetGUID });
            }
        }
        return defaultCheckedLayers;
    };
    MyMapService.prototype.GetLayerGridFilter = function () {
        var layerGridFilter = [];
        if (this.MapServiceService._GridTabData.getValue()) {
            var gridTabData = this.MapServiceService._GridTabData.getValue();
            var activeTabData = [];
            gridTabData.map(function (e) {
                if (e.ActiveClass.trim() == "active")
                    activeTabData.push(e);
            });
            if (activeTabData.length == 1) {
                var gridFilter = activeTabData[0].EnergylayersavegridFilter.mapfilterval;
                var Gridfiltercolumns = activeTabData[0].EnergylayersavegridFilter["mapfilterColumns"];
                var xmlFilter = this.UtilityService.ConvertMapGridCqlFilterToXML_new(gridFilter, Gridfiltercolumns);
                //var xmlFilter = this.UtilityService.ConvertMapGridCqlFilterToXML(gridFilter);
                if (xmlFilter) {
                    for (var _i = 0, _a = activeTabData[0].energyLayer; _i < _a.length; _i++) {
                        var layer = _a[_i];
                        var layerFilter = {
                            LayerId: layer.EnergyLayerID,
                            IsEnergyLayer: layer.DataSetID ? "false" : "true",
                            UserId: this.AuthServices.getLoggedinUserId(),
                            FilterSaveString: xmlFilter
                        };
                        layerGridFilter.push(layerFilter);
                        if (layer.treestatus.toLowerCase() == "grouplayer") {
                            if (layer.EnergyParentID) {
                                var index = layerGridFilter.findIndex(function (x) { return x.LayerId == layer.EnergyParentID; });
                                if (index == -1) {
                                    var layerFilter = {
                                        LayerId: layer.EnergyParentID,
                                        IsEnergyLayer: "true",
                                        UserId: this.AuthServices.getLoggedinUserId(),
                                        FilterSaveString: xmlFilter
                                    };
                                    layerGridFilter.push(layerFilter);
                                }
                            }
                            else if (layer.ParentDataSetID) {
                                var index = layerGridFilter.findIndex(function (x) { return x.LayerId == layer.ParentDataSetID; });
                                if (index == -1) {
                                    var layerFilter = {
                                        LayerId: layer.ParentDataSetID,
                                        IsEnergyLayer: "false",
                                        UserId: this.AuthServices.getLoggedinUserId(),
                                        FilterSaveString: xmlFilter
                                    };
                                    layerGridFilter.push(layerFilter);
                                }
                            }
                        }
                    }
                }
            }
        }
        return layerGridFilter;
    };
    MyMapService.prototype.AddMapInUserMapList = function (mapData) {
        var userMapList = this.MapServiceService._UserMapData.getValue();
        if (userMapList && userMapList.length > 0) {
            mapData["UserName"] = this.AuthServices.GetUserData().DisplayName;
            mapData["Type"] = "mymap";
            delete mapData["BaseMapProviderId"];
            delete mapData["IsDeleted"];
            delete mapData["IsPublic"];
            delete mapData["LegendOrder"];
            delete mapData["Modified"];
            userMapList.push(mapData);
            userMapList.sort(function (a, b) { return b.CustomMapId - a.CustomMapId; });
        }
    };
    MyMapService.prototype.UpdateMapInUserMapList = function (mapData) {
        var userMapList = this.MapServiceService._UserMapData.getValue();
        if (userMapList && userMapList.length > 0) {
            for (var _i = 0, userMapList_1 = userMapList; _i < userMapList_1.length; _i++) {
                var map = userMapList_1[_i];
                if (map.CustomMapId == mapData.CustomMapId) {
                    map.Name = mapData.Name;
                    map.CenterLatitude = mapData.CenterLatitude;
                    map.CenterLongitude = mapData.CenterLongitude;
                    map.Created = mapData.Created;
                    map.Description = mapData.Description;
                    map.UserId = mapData.UserId;
                    map.ZoomLevel = mapData.ZoomLevel;
                }
            }
        }
    };
    MyMapService.prototype.DeleteMapInUserMapList = function (mapData) {
        var userMapList = this.MapServiceService._UserMapData.getValue();
        if (userMapList && userMapList.length > 0) {
            for (var i = userMapList.length - 1; i >= 0; --i) {
                if (userMapList[i].CustomMapId == mapData.CustomMapId) {
                    userMapList.splice(i, 1);
                }
            }
        }
    };
    MyMapService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [map_service_service_1.MapServiceService,
            auth_service_1.AuthenticationService,
            Utility_service_1.UtilityService])
    ], MyMapService);
    return MyMapService;
}());
exports.MyMapService = MyMapService;
//# sourceMappingURL=my-map.service.js.map