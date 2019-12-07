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
var map_service_service_1 = require("../services/map-service.service");
var all_http_request_service_1 = require("./all-http-request.service");
var auth_service_1 = require("./auth.service");
var environment_1 = require("../../environments/environment");
var api_service_1 = require("./api.service");
var Utility_service_1 = require("./Utility.service");
var my_map_service_1 = require("./my-map.service");
var MapLayernewService = (function () {
    function MapLayernewService(MapServiceService, httpRequest, _api, UtilityService, authService, myMapService) {
        this.MapServiceService = MapServiceService;
        this.httpRequest = httpRequest;
        this._api = _api;
        this.UtilityService = UtilityService;
        this.authService = authService;
        this.myMapService = myMapService;
        this._mapdata = this.MapServiceService._mapdata;
        this._isLayerLoaded = false;
        this._isGroupLayerLoaded = false;
        this.recentFilters = {
            cqlFilter: '',
            sldBody: '',
            id: ''
        };
        this.recentCustomMapFilters = {
            cqlFilter: '',
            sldBody: '',
            id: ''
        };
        this.groupRecentFilters = [];
        this.IndividualgroupRecentFilters = [];
    }
    MapLayernewService.prototype.LoadMapLayers = function () {
        var _this = this;
        var tabdata = this.MapServiceService._GridTabData.value;
        if (this._isLayerLoaded)
            this.removemapLayer();
        if (tabdata.length > 0) {
            var groupLayers = tabdata.filter(function (x) { return x.treestatus != 'Individual'; });
            var timeout = 0;
            if (groupLayers.length > 0)
                timeout = 300;
            setTimeout(function () {
                var data = _this.CreateSldBodyAndCqlFilter(tabdata);
                if ((_this.recentFilters['cqlFilter'] == data.cqlFilter && _this.recentFilters['sldBody'] == data.sldBody) || (data.cqlFilter == ''))
                    return;
                _this.recentFilters['cqlFilter'] = data.cqlFilter;
                _this.recentFilters['sldBody'] = data.sldBody;
                var userId = _this.authService.getLoggedinUserId();
                _this.httpRequest._NodeGeoserverSetImageLayerData(data.sldBody, data.cqlFilter, userId).subscribe(function (res) {
                    if (data.sldBody == _this.recentFilters['sldBody'] && data.cqlFilter == _this.recentFilters['cqlFilter'])
                        _this.recentFilters['id'] = res.GeoMapPropID;
                    var gmaps = _this._mapdata.getValue();
                    gmaps.overlayMapTypes.setAt(1000, _this.SetnewWMSlayerD(tabdata, res.GeoMapPropID));
                    // google.maps.event.addListener(gmaps, 'tilesloaded', (e) => {
                    //     this.DeleteTempImgData(data.GeoMapPropID);
                    // });
                    _this._isLayerLoaded = true;
                }, function (error) {
                    console.error(error);
                });
            }, timeout);
        }
        // else {
        //     gmaps.overlayMapTypes.setAt(1, null);
        // }
    };
    MapLayernewService.prototype.removemapLayer = function () {
        var gmaps = this._mapdata.getValue();
        gmaps.overlayMapTypes.setAt(1000, null);
        this._isLayerLoaded = false;
    };
    MapLayernewService.prototype.LoadCustomMapLayers = function () {
        var _this = this;
        var tabdata = this.MapServiceService._GridTabData.value;
        if (tabdata.length > 0) {
            setTimeout(function () {
                var data = _this.CreateCustomMapSldBodyAndCqlFilter(tabdata);
                if ((_this.recentCustomMapFilters['cqlFilter'] == data.cqlFilter && _this.recentCustomMapFilters['sldBody'] == data.sldBody) || (data.cqlFilter == ''))
                    return;
                if (_this.myMapService.isCustomMapLoaded)
                    _this.RemoveCustomMapLayer();
                _this.recentCustomMapFilters['cqlFilter'] = data.cqlFilter;
                _this.recentCustomMapFilters['sldBody'] = data.sldBody;
                var userId = _this.authService.getLoggedinUserId();
                _this.httpRequest._NodeGeoserverSetImageLayerData(data.sldBody, data.cqlFilter, userId).subscribe(function (res) {
                    if (data.sldBody == _this.recentCustomMapFilters['sldBody'] && data.cqlFilter == _this.recentCustomMapFilters['cqlFilter'])
                        _this.recentCustomMapFilters['id'] = res.GeoMapPropID;
                    var gmaps = _this._mapdata.getValue();
                    gmaps.overlayMapTypes.setAt(1000, _this.SetnewWMSlayerD(tabdata, res.GeoMapPropID));
                    // google.maps.event.addListener(gmaps, 'tilesloaded', (e) => {
                    //     this.DeleteTempImgData(data.GeoMapPropID);
                    // });
                }, function (error) {
                    console.error(error);
                });
            }, 3000);
        }
        else if (tabdata.length == 0) {
            if (this.myMapService.isCustomMapLoaded)
                this.RemoveCustomMapLayer();
        }
        // else {
        //     gmaps.overlayMapTypes.setAt(1, null);
        // }
    };
    MapLayernewService.prototype.RemoveCustomMapLayer = function () {
        var gmaps = this._mapdata.getValue();
        gmaps.overlayMapTypes.setAt(1000, null);
        this._isLayerLoaded = false;
    };
    MapLayernewService.prototype.LoadGroupMapLayers = function () {
        var _this = this;
        var tabdata = this.MapServiceService._GridTabData.value;
        if (tabdata.length > 0) {
            setTimeout(function () {
                var groupLayers = tabdata.filter(function (x) { return x.treestatus == 'GroupLayer'; });
                if (groupLayers && groupLayers.length > 0) {
                    var _loop_1 = function (i) {
                        var groupLayer = groupLayers[i];
                        var data = _this.CreateSldBodyAndCqlFilterForGroupLayer(groupLayer);
                        var isRecentFilter = _this.groupRecentFilters.find(function (x) { return x.cqlFilter == data.cqlFilter && x.sldBody == data.sldBody && groupLayer.parentID == x.groupLayerId; });
                        if (isRecentFilter)
                            return "continue";
                        _this.removeGroupmapLayer(groupLayer.Layerindexval);
                        var existingGroupLayerIndex = _this.groupRecentFilters.findIndex(function (x) { return x.groupLayerId == groupLayer.parentID; });
                        if (existingGroupLayerIndex > -1)
                            _this.groupRecentFilters.splice(existingGroupLayerIndex, 1);
                        var groupFilterData = new FilterGroup();
                        groupFilterData.cqlFilter = data.cqlFilter;
                        groupFilterData.sldBody = data.sldBody;
                        groupFilterData.id = '';
                        groupFilterData.groupLayerId = groupLayer.parentID;
                        _this.groupRecentFilters.push(groupFilterData);
                        var userId = _this.authService.getLoggedinUserId();
                        _this.httpRequest._NodeGeoserverSetImageLayerData(data.sldBody, data.cqlFilter, userId).subscribe(function (res) {
                            var groupFilterData = _this.groupRecentFilters.find(function (x) { return x.groupLayerId == groupLayer.parentID; });
                            if (groupFilterData)
                                groupFilterData.id = res.GeoMapPropID;
                            var gmaps = _this._mapdata.getValue();
                            gmaps.overlayMapTypes.setAt(groupLayer.Layerindexval, _this.SetnewWMSlayerD(tabdata, res.GeoMapPropID));
                            _this._isGroupLayerLoaded = true;
                        }, function (error) {
                            console.error(error);
                        });
                    };
                    for (var i = 0; i < groupLayers.length; i++) {
                        _loop_1(i);
                    }
                }
            }, 300);
        }
    };
    MapLayernewService.prototype.LoadIndividualGroupMapLayer = function (FeatureType) {
        var _this = this;
        var tabdata = this.MapServiceService._GridTabData.value;
        if (tabdata.length > 0) {
            setTimeout(function () {
                tabdata = tabdata.filter(function (x) { return x.treestatus == 'Individual' && (x.FeatureType == FeatureType); });
                var LayerIndexvalue = tabdata[0].Layerindexval;
                var data = _this.CreateIndividualSldBodyAndCqlFilter(tabdata, FeatureType);
                if ((_this.recentFilters['cqlFilter'] == data.cqlFilter && _this.recentFilters['sldBody'] == data.sldBody) || (data.cqlFilter == ''))
                    return;
                _this.recentFilters['cqlFilter'] = data.cqlFilter;
                _this.recentFilters['sldBody'] = data.sldBody;
                _this.removeGroupmapLayer(LayerIndexvalue);
                var userId = _this.authService.getLoggedinUserId();
                _this.httpRequest._NodeGeoserverSetImageLayerData(data.sldBody, data.cqlFilter, userId).subscribe(function (res) {
                    if (data.sldBody == _this.recentFilters['sldBody'] && data.cqlFilter == _this.recentFilters['cqlFilter'])
                        _this.recentFilters['id'] = res.GeoMapPropID;
                    var gmaps = _this._mapdata.getValue();
                    gmaps.overlayMapTypes.setAt(LayerIndexvalue, _this.SetnewWMSlayerD(tabdata, res.GeoMapPropID));
                    // google.maps.event.addListener(gmaps, 'tilesloaded', (e) => {
                    //     this.DeleteTempImgData(data.GeoMapPropID);
                    // });
                }, function (error) {
                    console.error(error);
                });
            }, 200);
        }
    };
    MapLayernewService.prototype.removeGroupmapLayer = function (index) {
        var gmaps = this._mapdata.getValue();
        gmaps.overlayMapTypes.setAt(index, null);
        this._isLayerLoaded = false;
    };
    MapLayernewService.prototype.SetnewWMSlayerD = function (tabdata, geoMapPropID) {
        var _this = this;
        var wmsOptions = {
            alt: "EnergyLayer",
            getTileUrl: function (tile, zoom) {
                return _this.WMStileUrlD(geoMapPropID, tile, zoom);
            },
            isPng: true,
            maxZoom: 17,
            minZoom: 1,
            name: "EnergyLayer",
            tileSize: new google.maps.Size(256, 256)
        };
        var openlayersWMS = new google.maps.ImageMapType(wmsOptions);
        return openlayersWMS;
    };
    MapLayernewService.prototype.WMStileUrlD = function (geoMapPropID, tile, zoom) {
        var gmas = this._mapdata.getValue();
        var projection = gmas.getProjection();
        var zpow = Math.pow(2, zoom);
        var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
        var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
        var ulw = projection.fromPointToLatLng(ul);
        var lrw = projection.fromPointToLatLng(lr);
        var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
        var endpoint = this._api._NodeGeoserverGetGeoMapNew;
        var uRLParameter = '?BBOX=' + bbox + '&GeoMapPropID=' + geoMapPropID;
        var getGeoMapNewURL = endpoint + uRLParameter;
        return getGeoMapNewURL;
    };
    MapLayernewService.prototype.CreateSldBodyAndCqlFilter = function (tabdata) {
        var sldBody = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld">';
        var cqlFilter = '';
        for (var p = 0; p < tabdata.length; p++) {
            var _TabData = tabdata[p];
            //if (_TabData.GeoserverLayerStatus == 'Published') {
            if (_TabData.treestatus == 'Individual') {
                var _EnergyLayer = tabdata[p].energyLayer[0];
                if (_TabData.EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer == true && !_EnergyLayer.serversidefilterval) {
                    if (_TabData.EnergylayersavegridFilter.mapfilterval.indexOf(";") != -1)
                        _EnergyLayer.serversidefilterval = _TabData.EnergylayersavegridFilter.mapfilterval.split(";");
                    else
                        _EnergyLayer.serversidefilterval = [_TabData.EnergylayersavegridFilter.mapfilterval];
                }
                sldBody += this.CreateSldBody(_EnergyLayer);
                var currentCqlfilter = this.GetCQLFilter(_EnergyLayer);
                if (currentCqlfilter == '')
                    currentCqlfilter = 'INCLUDE';
                if (cqlFilter != '')
                    cqlFilter += ';';
                cqlFilter += currentCqlfilter;
            }
            else if (_TabData.treestatus != 'Individual') {
                if (this.MapServiceService._TreeUI.getValue()) {
                    var nodeData = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(tabdata[p].parentID).data.children;
                    var allCheckedLayer = nodeData.filter(function (m) { return m.IsChecked == false; }).map(function (m) { return m.Id; });
                    if (allCheckedLayer.length > 0) {
                        for (var _i = 0, _a = _TabData.energyLayer; _i < _a.length; _i++) {
                            var layer = _a[_i];
                            if (allCheckedLayer.indexOf(layer.EnergyLayerID) != -1) {
                                if (_TabData.EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer == true && !layer.serversidefilterval) {
                                    if (_TabData.EnergylayersavegridFilter.mapfilterval.indexOf(";") != -1)
                                        layer.serversidefilterval = _TabData.EnergylayersavegridFilter.mapfilterval.split(";");
                                    else
                                        layer.serversidefilterval = [_TabData.EnergylayersavegridFilter.mapfilterval];
                                }
                                sldBody += this.CreateSldBody(layer);
                                var currentCqlfilter = this.GetCQLFilter(layer);
                                if (currentCqlfilter == '')
                                    currentCqlfilter = 'INCLUDE';
                                if (cqlFilter != '')
                                    cqlFilter += ';';
                                cqlFilter += currentCqlfilter;
                            }
                        }
                    }
                }
            }
        }
        sldBody += '</StyledLayerDescriptor>';
        var data = {
            sldBody: sldBody,
            cqlFilter: cqlFilter
        };
        return data;
    };
    MapLayernewService.prototype.CreateCustomMapSldBodyAndCqlFilter = function (tabdata) {
        var sldBody = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld">';
        var cqlFilter = '';
        tabdata = this.TabSortByIconType(tabdata);
        for (var p = 0; p < tabdata.length; p++) {
            var _TabData = tabdata[p];
            //if (_TabData.GeoserverLayerStatus == 'Published') {
            var _EnergyLayer = tabdata[p].energyLayer[0];
            if ((_EnergyLayer.UploadFileType && (_EnergyLayer.UploadFileType == '.kml' || _EnergyLayer.UploadFileType == '.kmz')) || !_EnergyLayer['TableName'])
                continue;
            if (_TabData.treestatus == 'Individual') {
                if (_TabData.EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer == true && !_EnergyLayer.serversidefilterval) {
                    if (_TabData.EnergylayersavegridFilter.mapfilterval.indexOf(";") != -1)
                        _EnergyLayer.serversidefilterval = _TabData.EnergylayersavegridFilter.mapfilterval.split(";");
                    else
                        _EnergyLayer.serversidefilterval = [_TabData.EnergylayersavegridFilter.mapfilterval];
                }
                sldBody += this.CreateSldBody(_EnergyLayer);
                var currentCqlfilter = this.GetCQLFilter(_EnergyLayer);
                if (currentCqlfilter == '')
                    currentCqlfilter = 'INCLUDE';
                if (cqlFilter != '')
                    cqlFilter += ';';
                cqlFilter += currentCqlfilter;
            }
            else if (_TabData.treestatus != 'Individual') {
                if (this.MapServiceService._TreeUI.getValue()) {
                    var nodeData = [];
                    var energyTree = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(tabdata[p].parentID);
                    if (energyTree && energyTree.data) {
                        var EnergyNodeData = energyTree.data.children;
                        if (EnergyNodeData.length > 0)
                            nodeData.push.apply(nodeData, EnergyNodeData);
                    }
                    var privateTree = this.MapServiceService._PrivateTreeUI.getValue().treeModel.getNodeById(tabdata[p].parentID);
                    if (privateTree && privateTree.data) {
                        var PrivateNodeData = privateTree.data.children;
                        if (PrivateNodeData.length > 0)
                            nodeData.push.apply(nodeData, PrivateNodeData);
                    }
                    var sharedTree = this.MapServiceService._SharedTreeUI.getValue().treeModel.getNodeById(tabdata[p].parentID);
                    if (sharedTree && sharedTree.data) {
                        var SharedNodeData = sharedTree.data.children;
                        if (SharedNodeData.length > 0)
                            nodeData.push.apply(nodeData, SharedNodeData);
                    }
                    var tempTree = this.MapServiceService._TemporaryTreeUI.getValue().treeModel.getNodeById(tabdata[p].parentID);
                    if (tempTree && tempTree.data) {
                        var TempNodeData = tempTree.data.children;
                        if (TempNodeData.length > 0)
                            nodeData.push.apply(nodeData, TempNodeData);
                    }
                    if (nodeData.length > 0) {
                        var allCheckedLayer = nodeData.filter(function (m) { return m.IsChecked == false; }).map(function (m) { return m.Id; });
                        if (allCheckedLayer.length > 0) {
                            for (var _i = 0, _a = _TabData.energyLayer; _i < _a.length; _i++) {
                                var layer = _a[_i];
                                if (allCheckedLayer.indexOf(layer.EnergyLayerID) != -1) {
                                    if (_TabData.EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer == true && !layer.serversidefilterval) {
                                        if (_TabData.EnergylayersavegridFilter.mapfilterval.indexOf(";") != -1)
                                            layer.serversidefilterval = _TabData.EnergylayersavegridFilter.mapfilterval.split(";");
                                        else
                                            layer.serversidefilterval = [_TabData.EnergylayersavegridFilter.mapfilterval];
                                    }
                                    sldBody += this.CreateSldBody(layer);
                                    var currentCqlfilter = this.GetCQLFilter(layer);
                                    if (currentCqlfilter == '')
                                        currentCqlfilter = 'INCLUDE';
                                    if (cqlFilter != '')
                                        cqlFilter += ';';
                                    cqlFilter += currentCqlfilter;
                                }
                            }
                        }
                    }
                }
            }
        }
        sldBody += '</StyledLayerDescriptor>';
        var data = {
            sldBody: sldBody,
            cqlFilter: cqlFilter
        };
        return data;
    };
    MapLayernewService.prototype.TabSortByIconType = function (tabdata) {
        var tabDataInOrder = [];
        var pointLayerTab = [];
        var lineLayerTab = [];
        var areaLayerTab = [];
        for (var _i = 0, tabdata_1 = tabdata; _i < tabdata_1.length; _i++) {
            var tab = tabdata_1[_i];
            if (tab.energyLayer.length > 0) {
                var layer = tab.energyLayer[0];
                var IconType = layer["IconType"];
                if (IconType == 'Square') {
                    IconType = "Circle";
                }
                var shape = layer["RepresentationType"];
                if (shape == null) {
                    IconType = this.UtilityService.getIconType(IconType);
                    if (IconType == 'Circle') {
                        shape = "Point";
                    }
                    else if (IconType == 'Line') {
                        shape = "Line";
                    }
                    else if (IconType == 'Rectangle') {
                        shape = "Area";
                    }
                    else if (IconType == 'RoundedRectangle') {
                        shape = "Area";
                    }
                    else {
                        shape = IconType;
                    }
                }
                if (shape == "Point")
                    pointLayerTab.push(tab);
                else if (shape == "Line")
                    lineLayerTab.push(tab);
                else if (shape == "Area")
                    areaLayerTab.push(tab);
            }
        }
        var areaAndLineLayers = areaLayerTab.concat(lineLayerTab);
        tabDataInOrder = areaAndLineLayers.concat(pointLayerTab);
        return tabDataInOrder;
    };
    MapLayernewService.prototype.CreateIndividualSldBodyAndCqlFilter = function (tabdata, FeatureType) {
        tabdata = this.TabSortByIconType(tabdata);
        var sldBody = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld">';
        var cqlFilter = '';
        for (var p = 0; p < tabdata.length; p++) {
            var _TabData = tabdata[p];
            //if (_TabData.GeoserverLayerStatus == 'Published') {
            var treeIschecked = false;
            if (_TabData.FeatureType == FeatureType) {
                if (this.MapServiceService._TemporaryTreeUI.getValue()) {
                    var nodeData = this.MapServiceService._TemporaryTreeUI.getValue().treeModel.getNodeById(_TabData.ID);
                    if (nodeData && nodeData.data && nodeData.data.IsChecked == false) {
                        treeIschecked = true;
                    }
                }
                if (FeatureType == "SiteSelection") {
                    if (this.MapServiceService._TreeUI.getValue()) {
                        var nodeData = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(_TabData.ID);
                        if (nodeData && nodeData.data && nodeData.data.IsChecked == false) {
                            treeIschecked = true;
                        }
                    }
                }
            }
            if (_TabData.treestatus == 'Individual' && treeIschecked) {
                var _EnergyLayer = tabdata[p].energyLayer[0];
                if (_TabData.EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer == true && !_EnergyLayer.serversidefilterval) {
                    if (_TabData.EnergylayersavegridFilter.mapfilterval.indexOf(";") != -1)
                        _EnergyLayer.serversidefilterval = _TabData.EnergylayersavegridFilter.mapfilterval.split(";");
                    else
                        _EnergyLayer.serversidefilterval = [_TabData.EnergylayersavegridFilter.mapfilterval];
                }
                sldBody += this.CreateSldBody(_EnergyLayer);
                var currentCqlfilter = this.GetCQLFilter(_EnergyLayer);
                if (currentCqlfilter == '')
                    currentCqlfilter = 'INCLUDE';
                if (cqlFilter != '')
                    cqlFilter += ';';
                cqlFilter += currentCqlfilter;
            }
            else if (_TabData.treestatus != 'Individual' && treeIschecked) {
                if (this.MapServiceService._TreeUI.getValue()) {
                    var nodeData = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(tabdata[p].parentID).data.children;
                    var allCheckedLayer = nodeData.filter(function (m) { return m.IsChecked == false; }).map(function (m) { return m.Id; });
                    if (allCheckedLayer.length > 0) {
                        for (var _i = 0, _a = _TabData.energyLayer; _i < _a.length; _i++) {
                            var layer = _a[_i];
                            if (allCheckedLayer.indexOf(layer.EnergyLayerID) != -1) {
                                if (_TabData.EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer == true && !layer.serversidefilterval) {
                                    if (_TabData.EnergylayersavegridFilter.mapfilterval.indexOf(";") != -1)
                                        layer.serversidefilterval = _TabData.EnergylayersavegridFilter.mapfilterval.split(";");
                                    else
                                        layer.serversidefilterval = [_TabData.EnergylayersavegridFilter.mapfilterval];
                                }
                                sldBody += this.CreateSldBody(layer);
                                var currentCqlfilter = this.GetCQLFilter(layer);
                                if (currentCqlfilter == '')
                                    currentCqlfilter = 'INCLUDE';
                                if (cqlFilter != '')
                                    cqlFilter += ';';
                                cqlFilter += currentCqlfilter;
                            }
                        }
                    }
                }
            }
        }
        sldBody += '</StyledLayerDescriptor>';
        var data = {
            sldBody: sldBody,
            cqlFilter: cqlFilter
        };
        return data;
    };
    MapLayernewService.prototype.Create_Individual_SldBodyAndCqlFilterForGroupLayer = function (tabdata) {
        var sldBody = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld">';
        var cqlFilter = '';
        for (var p = 0; p < tabdata.length; p++) {
            var _TabData = tabdata[p];
            //if (_TabData.GeoserverLayerStatus == 'Published') {
            if (_TabData.treestatus == 'Individual') {
                var _EnergyLayer = tabdata[p].energyLayer[0];
                sldBody += this.CreateSldBody(_EnergyLayer);
                var currentCqlfilter = this.GetCQLFilter(_EnergyLayer);
                if (currentCqlfilter == '')
                    currentCqlfilter = 'INCLUDE';
                if (cqlFilter != '')
                    cqlFilter += ';';
                cqlFilter += currentCqlfilter;
            }
            else {
                if (this.MapServiceService._TreeUI.getValue()) {
                    var nodeData = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(tabdata[p].parentID).data.children;
                    var allCheckedLayer = nodeData.filter(function (m) { return m.IsChecked == false; }).map(function (m) { return m.Id; });
                    if (allCheckedLayer.length > 0) {
                        for (var _i = 0, _a = _TabData.energyLayer; _i < _a.length; _i++) {
                            var layer = _a[_i];
                            if (allCheckedLayer.indexOf(layer.EnergyLayerID) != -1) {
                                sldBody += this.CreateSldBody(layer);
                                var currentCqlfilter = this.GetCQLFilter(layer);
                                if (currentCqlfilter == '')
                                    currentCqlfilter = 'INCLUDE';
                                if (cqlFilter != '')
                                    cqlFilter += ';';
                                cqlFilter += currentCqlfilter;
                            }
                        }
                    }
                }
            }
        }
        sldBody += '</StyledLayerDescriptor>';
        var data = {
            sldBody: sldBody,
            cqlFilter: cqlFilter
        };
        return data;
    };
    MapLayernewService.prototype.CreateSldBodyAndCqlFilterForGroupLayer = function (tabdata) {
        var sldBody = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld">';
        var cqlFilter = '';
        var _TabData = tabdata;
        var allCheckedLayer = null;
        if (_TabData.treestatus == 'GroupLayer') {
            if (_TabData.FeatureType == "CreateLayer") {
                if (this.MapServiceService._TemporaryTreeUI.getValue()) {
                    var nodeData = this.MapServiceService._TemporaryTreeUI.getValue().treeModel.getNodeById(tabdata.parentID).data.children;
                    allCheckedLayer = nodeData.filter(function (m) { return m.IsChecked == false; }).map(function (m) { return m.Id; });
                }
            }
            else if (_TabData.FeatureType == "EnergyLayer") {
                if (this.MapServiceService._TreeUI.getValue()) {
                    var treeModel = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(tabdata.parentID);
                    if (treeModel) {
                        var nodeData = treeModel.data.children;
                        allCheckedLayer = nodeData.filter(function (m) { return m.IsChecked == false; }).map(function (m) { return m.Id; });
                    }
                }
            }
            else if (_TabData.FeatureType == "PrivateLayer") {
                if (this.MapServiceService._PrivateTreeUI.getValue()) {
                    var treeModel = this.MapServiceService._PrivateTreeUI.getValue().treeModel.getNodeById(tabdata.parentID);
                    if (treeModel) {
                        var nodeData = treeModel.data.children;
                        allCheckedLayer = nodeData.filter(function (m) { return m.IsChecked == false; }).map(function (m) { return m.Id; });
                    }
                }
            }
            else if (_TabData.FeatureType == "SharedLayer") {
                if (this.MapServiceService._SharedTreeUI.getValue()) {
                    var treeModel = this.MapServiceService._SharedTreeUI.getValue().treeModel.getNodeById(tabdata.parentID);
                    if (treeModel) {
                        var nodeData = treeModel.data.children;
                        allCheckedLayer = nodeData.filter(function (m) { return m.IsChecked == false; }).map(function (m) { return m.Id; });
                    }
                }
            }
            if (allCheckedLayer != null && allCheckedLayer.length > 0) {
                for (var _i = 0, _a = _TabData.energyLayer; _i < _a.length; _i++) {
                    var layer = _a[_i];
                    if (allCheckedLayer.indexOf(layer.EnergyLayerID) != -1) {
                        if (_TabData.EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer == true && !layer.serversidefilterval) {
                            if (_TabData.EnergylayersavegridFilter.mapfilterval.indexOf(";") != -1)
                                layer.serversidefilterval = _TabData.EnergylayersavegridFilter.mapfilterval.split(";");
                            else
                                layer.serversidefilterval = [_TabData.EnergylayersavegridFilter.mapfilterval];
                        }
                        sldBody += this.CreateSldBody(layer);
                        var currentCqlfilter = this.GetCQLFilter(layer);
                        if (currentCqlfilter == '')
                            currentCqlfilter = 'INCLUDE';
                        if (cqlFilter != '')
                            cqlFilter += ';';
                        cqlFilter += currentCqlfilter;
                    }
                }
            }
        }
        sldBody += '</StyledLayerDescriptor>';
        var data = {
            sldBody: sldBody,
            cqlFilter: cqlFilter
        };
        return data;
    };
    MapLayernewService.prototype.CreateSldBody = function (layer) {
        var IconType = layer["IconType"];
        if (IconType == 'Square') {
            IconType = "Circle";
        }
        var shape = layer["RepresentationType"];
        if (shape == null) {
            IconType = this.UtilityService.getIconType(IconType);
            if (IconType == 'Circle') {
                shape = "Point";
            }
            else if (IconType == 'Line') {
                shape = "Line";
            }
            else if (IconType == 'Rectangle') {
                shape = "Area";
            }
            else if (IconType == 'RoundedRectangle') {
                shape = "Area";
            }
            else {
                shape = IconType;
            }
        }
        var StrokeColor = layer["StrokeColor"].replace('#', '');
        var FillColor = layer["FillColor"].replace('#', '');
        var SizePercent = layer["SizePercent"];
        var StrokeThicknessPercent = layer["StrokeThicknessPercent"];
        var Stockwidth = parseInt(layer["StrokeThicknessPercent"]) / 10;
        var opacity = parseFloat(layer["Opacity"].toFixed(2));
        var NewStrokeColor = this.UtilityService.GetHexColorValue(layer["StrokeColor"]);
        var ExternalIconId = layer["ExternalIconId"];
        var NewfillColor = this.UtilityService.GetHexColorValue(layer["FillColor"]);
        var size = Math.round(parseInt(layer["SizePercent"]) * 25 / 100);
        var TableName = layer["TableName"];
        var LabelName = '';
        if (layer["IsLabelVisible"] == 1)
            LabelName = layer["LabelField"];
        if (layer.EnergyLayerStylesByUserModel && layer.EnergyLayerStylesByUserModel.length > 0) {
            var EnergyLayerStylesByUserModel = layer.EnergyLayerStylesByUserModel[0];
            if (EnergyLayerStylesByUserModel["IconType"])
                IconType = EnergyLayerStylesByUserModel["IconType"];
            if (EnergyLayerStylesByUserModel["StrokeColor"])
                StrokeColor = EnergyLayerStylesByUserModel["StrokeColor"].replace('#', '');
            if (EnergyLayerStylesByUserModel["FillColor"])
                FillColor = EnergyLayerStylesByUserModel["FillColor"].replace('#', '');
            if (EnergyLayerStylesByUserModel["StrokeThicknessPercent"])
                Stockwidth = parseInt(EnergyLayerStylesByUserModel["StrokeThicknessPercent"]) / 10;
            if (EnergyLayerStylesByUserModel["Opacity"])
                opacity = parseFloat(EnergyLayerStylesByUserModel["Opacity"].toFixed(2));
            if (EnergyLayerStylesByUserModel["StrokeColor"])
                NewStrokeColor = this.UtilityService.GetHexColorValue(EnergyLayerStylesByUserModel["StrokeColor"]);
            ExternalIconId = EnergyLayerStylesByUserModel["ExternalIconId"];
            if (EnergyLayerStylesByUserModel["FillColor"])
                NewfillColor = this.UtilityService.GetHexColorValue(EnergyLayerStylesByUserModel["FillColor"]);
            if (EnergyLayerStylesByUserModel["SizePercent"])
                SizePercent = EnergyLayerStylesByUserModel["SizePercent"];
            if (EnergyLayerStylesByUserModel["StrokeThicknessPercent"])
                StrokeThicknessPercent = EnergyLayerStylesByUserModel["StrokeThicknessPercent"];
            if (EnergyLayerStylesByUserModel["SizePercent"])
                size = Math.round(parseInt(EnergyLayerStylesByUserModel["SizePercent"]) * 25 / 100);
            LabelName = EnergyLayerStylesByUserModel["LabelField"];
        }
        var fillOpacity = opacity;
        if ((layer["LayerType"] === 'ParcelData' || (layer['TableName'] && layer['TableName'].indexOf('Parcels_') >= 0)) && layer["RepresentationType"] == 'Area' && opacity == 1) {
            fillOpacity = 0;
        }
        var sld_body = '<NamedLayer>'
            + '<Name>' + TableName + '</Name>'
            + '<UserStyle>'
            + '<FeatureTypeStyle>'
            + '<Rule>';
        if (shape == "Point") {
            sld_body += '<PointSymbolizer>'
                + '<Graphic>'
                + '<ExternalGraphic>';
            if (!ExternalIconId) {
                var PointIconURL = environment_1.environment.GetLayerIconURL + "/icongenerate/get/?Id=" + layer["EnergyLayerID"] + "&amp;URLType=CustomStyleIcon&amp;FillColor=" + FillColor + "&amp;IconType=" + IconType + "&amp;StrokeColor=" + StrokeColor + "&amp;SizePercent=" + SizePercent + "&amp;StrokeThicknessPercent=" + StrokeThicknessPercent + "&amp;Opacity=" + opacity;
                // let PointIconURL = environment.GetLayerIconURL + "/icongenerate/get/?Id=" + layer["EnergyLayerID"] + "&URLType=CustomStyleIcon&FillColor=" + FillColor + "&IconType=" + IconType + "&StrokeColor=" + StrokeColor + "&SizePercent=" + SizePercent + "&StrokeThicknessPercent=" + StrokeThicknessPercent + "&Opacity=" + opacity;
                sld_body += '<OnlineResource type="simple" href="' + PointIconURL + '" />';
            }
            else {
                var Exid = document.getElementById(layer.EnergyLayerID + 'TreeCostomelayerIconImage');
                var ExternalIconurl = Exid['src'];
                sld_body += '<OnlineResource type="simple" href="' + ExternalIconurl + '"/>';
                sld_body += '<Stroke>'
                    + '<CssParameter name="stroke-opacity">' + opacity + '</CssParameter>'
                    + '</Stroke>';
            }
            sld_body += '<Format>image/png</Format>'
                + '</ExternalGraphic>'
                + '<Size>' + size + '</Size>'
                + '</Graphic>'
                + '</PointSymbolizer>';
        }
        if (shape == "Line") {
            NewStrokeColor = this.UtilityService.GetHexValueWithAlpha(NewStrokeColor);
            if (IconType == "Line") {
                sld_body += ' <LineSymbolizer>'
                    + '<Stroke>'
                    + '<CssParameter name="stroke">#' + NewStrokeColor + '</CssParameter>'
                    + '<CssParameter name="stroke-width">' + Stockwidth + '</CssParameter>'
                    + '<CssParameter name="stroke-opacity">' + opacity + '</CssParameter>'
                    + '</Stroke>'
                    + '</LineSymbolizer>';
            }
            else if (IconType == "DashLine") {
                sld_body += ' <LineSymbolizer>'
                    + '<Stroke>'
                    + '<CssParameter name="stroke">#' + NewStrokeColor + '</CssParameter>'
                    + '<CssParameter name="stroke-width">' + Stockwidth + '</CssParameter>'
                    + '<CssParameter name="stroke-dasharray">' + opacity + '</CssParameter>'
                    + '</Stroke>'
                    + '</LineSymbolizer>';
            }
        }
        if (shape == "Area") {
            sld_body += '<PolygonSymbolizer>'
                + '<Stroke>'
                + '<CssParameter name="stroke">#' + NewStrokeColor + '</CssParameter>'
                + '<CssParameter name="stroke-width">' + Stockwidth + '</CssParameter>'
                + '<CssParameter name="stroke-opacity">' + opacity + '</CssParameter> '
                + '</Stroke>'
                + '<Fill>'
                + '<CssParameter name="fill">#' + NewfillColor + '</CssParameter> '
                + '<CssParameter name="fill-opacity">' + fillOpacity + '</CssParameter> '
                + '</Fill>'
                + '</PolygonSymbolizer>';
        }
        sld_body += '</Rule>';
        sld_body += '</FeatureTypeStyle>';
        if (LabelName) {
            sld_body += this.UtilityService.GetXMLLabelstyle(LabelName, shape);
        }
        sld_body += '</UserStyle>';
        sld_body += '</NamedLayer>';
        return sld_body;
    };
    MapLayernewService.prototype.GetCQLFilter = function (layer) {
        var CQL_FILTER = "";
        var filterval = layer["FilterValue"];
        var isfilterval = false;
        var filter = '';
        if (layer["RepresentationType"] == "Line" || layer["RepresentationType"] == "Area" || layer["RepresentationType"] == "Shape" || layer["RepresentationType"] == "Circle" || layer["RepresentationType"] == "Point") {
            if (layer["serversidefilterval"]) {
                filter = this.MapServiceService.gridfilter(layer["serversidefilterval"]);
            }
            if (filter != '' && filterval) {
                filter += ' and (' + this.MapServiceService.CreateCQL_Filter(filterval, ' and ') + ')';
            }
            else if (filterval && filter == '') {
                filter = this.MapServiceService.CreateCQL_Filter(filterval, ' and ');
            }
            if (filter != '') {
                CQL_FILTER = filter;
            }
        }
        //CQL_FILTER = decodeURI(CQL_FILTER);
        CQL_FILTER = decodeURIComponent(CQL_FILTER);
        return CQL_FILTER;
    };
    MapLayernewService.prototype.GetHexColorValue = function (hexCode) {
        var color = "";
        var len = parseInt(hexCode.length);
        if (len == 8) {
            color = hexCode.substr(2);
        }
        else if (len == 9) {
            color = hexCode.substr(3);
        }
        return color;
    };
    MapLayernewService.prototype.GetHexValueWithAlpha = function (color) {
        color = color.replace('#', '');
        if (color.length == 8) {
            color = color.substring(2);
        }
        return color;
    };
    MapLayernewService.prototype.GetOgcFilterChildren = function (FilterValueData) {
        var sld_filter = "";
        if (FilterValueData != null && FilterValueData != "") {
            if (FilterValueData.indexOf(";") !== -1) {
                var Filter = FilterValueData.split(';');
                sld_filter += this.FilterValueChildLoop(Filter);
            }
            if (FilterValueData.indexOf("#OR#") !== -1) {
                var Filter = FilterValueData.split('#OR#');
                sld_filter += this.FilterValueChildLoop(Filter);
            }
            if (sld_filter == "") {
                sld_filter += '<Filter xmlns="http://www.opengis.net/ogc">';
                sld_filter += this.SingleFilterLoop(FilterValueData);
                sld_filter += '</Filter>';
            }
        }
        return sld_filter;
    };
    MapLayernewService.prototype.FilterValueChildLoop = function (Filter) {
        var sld_filter = '<Filter xmlns="http://www.opengis.net/ogc">';
        for (var i = 0; i < Filter.length; i++) {
            if (Filter[i].indexOf("=") !== -1 && Filter[i].indexOf("<") == -1 && Filter[i].indexOf(">") == -1) {
                var FilterValue = Filter[i].split('=');
                var PropertyName = FilterValue[0];
                var Literal = FilterValue[1];
                sld_filter += '<PropertyIsEqualTo matchCase="false">'
                    + '<PropertyName>' + PropertyName + '</PropertyName>'
                    + '<Literal>' + Literal + '</Literal>'
                    + '</PropertyIsEqualTo>';
            }
            if (Filter[i].indexOf(">") !== -1 && Filter[i].indexOf("=") == -1) {
                var FilterValue = Filter[i].split('>');
                var PropertyName = FilterValue[0];
                var Literal = FilterValue[1];
                sld_filter += '<PropertyIsGreaterThan matchCase="false">'
                    + '<PropertyName>' + PropertyName + '</PropertyName>'
                    + '<Literal>' + Literal + '</Literal>'
                    + '</PropertyIsGreaterThan>';
            }
            if (Filter[i].indexOf("<") !== -1 && Filter[i].indexOf("=") == -1) {
                var FilterValue = Filter[i].split('<');
                var PropertyName = FilterValue[0];
                var Literal = FilterValue[1];
                sld_filter += '<PropertyIsLessThan matchCase="false">'
                    + '<PropertyName>' + PropertyName + '</PropertyName>'
                    + '<Literal>' + Literal + '</Literal>'
                    + '</PropertyIsLessThan>';
            }
            if (Filter[i].indexOf("<=") !== -1) {
                var FilterValue = Filter[i].split('<=');
                var PropertyName = FilterValue[0];
                var Literal = FilterValue[1];
                sld_filter += '<PropertyIsLessThanOrEqualTo matchCase="false">'
                    + '<PropertyName>' + PropertyName + '</PropertyName>'
                    + '<Literal>' + Literal + '</Literal>'
                    + '</PropertyIsLessThanOrEqualTo>';
            }
            if (Filter[i].indexOf("#EQUAL#") !== -1) {
                var FilterValue = Filter[i].split('#EQUAL#');
                var PropertyName = FilterValue[0];
                var Literal = FilterValue[1];
                sld_filter += '<PropertyIsEqualTo matchCase="false">'
                    + '<PropertyName>' + PropertyName + '</PropertyName>'
                    + '<Literal>' + Literal + '</Literal>'
                    + '</PropertyIsEqualTo>';
            }
            if (Filter[i].indexOf("#LIKE#") !== -1) {
                var FilterValue = Filter[i].split('#LIKE#');
                var PropertyName = FilterValue[0];
                var Literal = FilterValue[1];
                sld_filter += '<PropertyIsLike matchCase="false" wildCard="*" singleChar="." escape="!">'
                    + '<PropertyName>' + PropertyName + '</PropertyName>'
                    + '<Literal>*' + Literal + '*</Literal>'
                    + '</PropertyIsLike>';
            }
        }
        sld_filter += '</Filter>';
        return sld_filter;
    };
    MapLayernewService.prototype.SingleFilterLoop = function (Filter) {
        var sld_filter = "";
        if (Filter.indexOf("#EQUAL#") !== -1) {
            var FilterValue = Filter.split('#EQUAL#');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            sld_filter += '<PropertyIsEqualTo matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsEqualTo>';
        }
        if (Filter.indexOf("=") !== -1 && Filter.indexOf("<") == -1 && Filter.indexOf(">") == -1 && Filter.indexOf("#EQUAL#") == -1) {
            var FilterValue = Filter.split('=');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            sld_filter += '<PropertyIsEqualTo matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsEqualTo>';
        }
        if (Filter.indexOf(">") !== -1 && Filter.indexOf("=") == -1 && Filter.indexOf("#EQUAL#") == -1) {
            var FilterValue = Filter.split('>');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            sld_filter += '<PropertyIsGreaterThan matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsGreaterThan>';
        }
        if (Filter.indexOf("<") !== -1 && Filter.indexOf("=") == -1 && Filter.indexOf("#EQUAL#") == -1) {
            var FilterValue = Filter.split('<');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            sld_filter += '<PropertyIsLessThan matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsLessThan>';
        }
        if (Filter.indexOf("<=") !== -1 && Filter.indexOf("#EQUAL#") == -1) {
            var FilterValue = Filter.split('<=');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            sld_filter += '<PropertyIsLessThanOrEqualTo matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsLessThanOrEqualTo>';
        }
        if (Filter.indexOf("#LIKE#") !== -1) {
            var FilterValue = Filter.split('#LIKE#');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            sld_filter += '<PropertyIsLike matchCase="false" wildCard="*" singleChar="." escape="!">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>*' + Literal + '*</Literal>'
                + '</PropertyIsLike>';
        }
        if (Filter.indexOf("#NotEqualTo#") !== -1) {
            var FilterValue = Filter.split('#NotEqualTo#');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            sld_filter += '<PropertyIsNotEqualTo matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsNotEqualTo>';
        }
        return sld_filter;
    };
    // addlayesbasedonId(Id) {
    //     let energyLayerLoad = this.energyLayer.filter((el) => {
    //         if (((el.EnergyParentID == parseInt(Id)) || (el.EnergyLayerID == parseInt(Id)))) {
    //             return el;
    //         }
    //     });
    //     if (energyLayerLoad.length > 0) {
    //         for (let x in energyLayerLoad) {
    //             var layer = energyLayerLoad[x];
    //             this.MapServiceService.GetLayerData(layer, 0, 1, '', '', '')
    //                 .subscribe(data => {
    //                     if (data['_body'].indexOf('totalFeatures') > 0) {
    //                         //this.loadmapLayers(layer);
    //                     }
    //                 }, error => {
    //                     console.log(error);
    //                 });
    //         }
    //     }
    // }
    MapLayernewService.prototype.DeleteTempImgData = function (id) {
        this.httpRequest._NodeDeleteGeoImageProp(id).subscribe(function (x) { });
    };
    MapLayernewService.prototype.ClearAllRecentData = function () {
        this.recentFilters = {
            cqlFilter: '',
            sldBody: '',
            id: ''
        };
        this.recentCustomMapFilters = {
            cqlFilter: '',
            sldBody: '',
            id: ''
        };
        this.groupRecentFilters = [];
        this.IndividualgroupRecentFilters = [];
    };
    MapLayernewService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [map_service_service_1.MapServiceService,
            all_http_request_service_1.HttpRequestService,
            api_service_1.ApiService,
            Utility_service_1.UtilityService,
            auth_service_1.AuthenticationService,
            my_map_service_1.MyMapService])
    ], MapLayernewService);
    return MapLayernewService;
}());
exports.MapLayernewService = MapLayernewService;
var FilterGroup = (function () {
    function FilterGroup() {
    }
    return FilterGroup;
}());
exports.FilterGroup = FilterGroup;
//# sourceMappingURL=MapLayer-new-service.js.map