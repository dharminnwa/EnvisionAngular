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
var ngx_bootstrap_1 = require("ngx-bootstrap");
var all_http_request_service_1 = require("../../../../../services/all-http-request.service");
var my_map_service_1 = require("../../../../../services/my-map.service");
var message_service_1 = require("../../../../components/message/message.service");
var google_component_1 = require("../../../../../maps/google/google.component");
var map_service_service_1 = require("../../../../../services/map-service.service");
var constants_1 = require("../../../../../models/constants");
var MyMapSaveAsComponent = (function () {
    function MyMapSaveAsComponent(bsModalRef, MapServiceService, httpRequestService, myMapService, _notification, GoogleMapPage) {
        this.bsModalRef = bsModalRef;
        this.MapServiceService = MapServiceService;
        this.httpRequestService = httpRequestService;
        this.myMapService = myMapService;
        this._notification = _notification;
        this.GoogleMapPage = GoogleMapPage;
    }
    MyMapSaveAsComponent.prototype.ngOnInit = function () {
        this.mapNameText = this.MapServiceService.getMapTitledata().getValue();
    };
    MyMapSaveAsComponent.prototype.CloseMyMapSaveAsModal = function () {
        this.bsModalRef.hide();
    };
    MyMapSaveAsComponent.prototype.SaveMap = function () {
        var _this = this;
        debugger;
        if (this.mapNameText)
            this.MapServiceService.setMapTitledata(this.mapNameText.trim());
        this.httpRequestService._NodeCheckMapName(this.MapServiceService.getMapTitledata().getValue()).subscribe(function (data) {
            if (data._Issuccess && data.isMapNameExists == false) {
                var CustomMap_1 = _this.myMapService.GetCustomMapData();
                if (_this.myMapService.loadedMapData.CustomMaps && _this.myMapService.loadedMapData.CustomMaps.length == 1)
                    CustomMap_1["Description"] = _this.myMapService.loadedMapData.CustomMaps[0].Description;
                var EnergyLayers = _this.GoogleMapPage.energyLayer.map(function (obj) { return obj.EnergyLayerID; });
                var PrivateLayers = _this.GoogleMapPage.privateLayer.map(function (obj) { return obj.DataSetID; });
                var EnergyLayersStylebyuser = [];
                var LegendOrder;
                _this.GoogleMapPage.energyLayer.forEach(function (s) {
                    if (s.EnergyLayerStylesByUserModel && s.EnergyLayerStylesByUserModel.length > 0) {
                        EnergyLayersStylebyuser.push(s.EnergyLayerStylesByUserModel[0].Id);
                    }
                });
                if ($('#ToggleLegend').text().trim() == 'Hide Legend') {
                    LegendOrder = _this.GoogleMapPage.energyLayer.map(function (obj) { return obj.EnergyLayerGUID; });
                    if (LegendOrder.length > 0) {
                        LegendOrder = LegendOrder.join('#');
                    }
                    CustomMap_1["LegendOrder"] = LegendOrder;
                }
                var DefaultCheckedLayer = _this.myMapService.GetDefaultCheckedLayers(_this.GoogleMapPage.energyLayer, _this.GoogleMapPage.privateLayer, _this.GoogleMapPage.sharedLayer);
                var sharedLayer = _this.GoogleMapPage.sharedLayer.map(function (obj) { return obj.DataSetID; });
                if (sharedLayer && sharedLayer.length > 0) {
                    PrivateLayers.push.apply(PrivateLayers, sharedLayer);
                }
                var LayerGridFilters = _this.myMapService.GetLayerGridFilter();
                if (PrivateLayers.length > 0) {
                    var PrivateParentIds = _this.GoogleMapPage.privateLayer.map(function (obj) { return obj.ParentDataSetID; }).filter(function (obj) { return obj; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
                    if (PrivateParentIds.length > 0) {
                        PrivateLayers = PrivateLayers.concat(PrivateParentIds);
                        if (DefaultCheckedLayer.length > 0) {
                            var ParentIds = [];
                            _this.GoogleMapPage.privateLayer.map(function (e) {
                                if (e.ParentDataSetID) {
                                    ParentIds.push({ DataSetID: e.DataSetID, ParentDataSetID: e.ParentDataSetID });
                                }
                            });
                            var needToAddGUIDOfDataSetID = [];
                            for (var _i = 0, PrivateParentIds_1 = PrivateParentIds; _i < PrivateParentIds_1.length; _i++) {
                                var id = PrivateParentIds_1[_i];
                                var allChildLayers = [];
                                ParentIds.map(function (e) {
                                    if (e.ParentDataSetID == id)
                                        allChildLayers.push(e);
                                });
                                var checkedChildLayers = [];
                                for (var _a = 0, allChildLayers_1 = allChildLayers; _a < allChildLayers_1.length; _a++) {
                                    var child = allChildLayers_1[_a];
                                    DefaultCheckedLayer.map(function (e) {
                                        if (e.DataSetID == child.DataSetID)
                                            checkedChildLayers.push(child);
                                    });
                                }
                                if (checkedChildLayers.length == allChildLayers.length) {
                                    needToAddGUIDOfDataSetID.push(allChildLayers[0].ParentDataSetID);
                                }
                            }
                            if (needToAddGUIDOfDataSetID.length > 0) {
                                _this.httpRequestService._NodeGetGUIDOfDataSets(needToAddGUIDOfDataSetID).subscribe(function (data) {
                                    if (data._Issuccess && data.result.length > 0) {
                                        for (var _i = 0, _a = data.result; _i < _a.length; _i++) {
                                            var layer = _a[_i];
                                            DefaultCheckedLayer.push({ DataSetID: layer.DataSetID, GUID: layer.DataSetGUID });
                                        }
                                        DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                                        _this.httpRequestService._NodeSaveMyMap(CustomMap_1, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(function (data) {
                                            if (data._Issuccess) {
                                                var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                                _this.myMapService.AddMapInUserMapList(mapData);
                                                _this.myMapService.loadedMapData = data.CustomMapData;
                                                _this.myMapService.isCustomMapLoaded = true;
                                                _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                                    Position: constants_1.NotificationPosition.TopRight,
                                                    Style: constants_1.NotificationStyle.Simple,
                                                    Duration: constants_1.NotificationDuration
                                                });
                                                _this.CloseMyMapSaveAsModal();
                                            }
                                        }, function (error) {
                                            _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                                Position: constants_1.NotificationPosition.TopRight,
                                                Style: constants_1.NotificationStyle.Simple,
                                                Duration: constants_1.NotificationDuration
                                            });
                                            _this.CloseMyMapSaveAsModal();
                                        });
                                    }
                                }, function (error) {
                                    _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                        Position: constants_1.NotificationPosition.TopRight,
                                        Style: constants_1.NotificationStyle.Simple,
                                        Duration: constants_1.NotificationDuration
                                    });
                                    _this.CloseMyMapSaveAsModal();
                                });
                            }
                            else {
                                DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                                _this.httpRequestService._NodeSaveMyMap(CustomMap_1, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(function (data) {
                                    if (data._Issuccess) {
                                        var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                        _this.myMapService.AddMapInUserMapList(mapData);
                                        _this.myMapService.loadedMapData = data.CustomMapData;
                                        _this.myMapService.isCustomMapLoaded = true;
                                        _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                            Position: constants_1.NotificationPosition.TopRight,
                                            Style: constants_1.NotificationStyle.Simple,
                                            Duration: constants_1.NotificationDuration
                                        });
                                        _this.CloseMyMapSaveAsModal();
                                    }
                                }, function (error) {
                                    _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                        Position: constants_1.NotificationPosition.TopRight,
                                        Style: constants_1.NotificationStyle.Simple,
                                        Duration: constants_1.NotificationDuration
                                    });
                                    _this.CloseMyMapSaveAsModal();
                                });
                            }
                        }
                        else {
                            DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                            _this.httpRequestService._NodeSaveMyMap(CustomMap_1, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(function (data) {
                                if (data._Issuccess) {
                                    var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                    _this.myMapService.AddMapInUserMapList(mapData);
                                    _this.myMapService.loadedMapData = data.CustomMapData;
                                    _this.myMapService.isCustomMapLoaded = true;
                                    _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                        Position: constants_1.NotificationPosition.TopRight,
                                        Style: constants_1.NotificationStyle.Simple,
                                        Duration: constants_1.NotificationDuration
                                    });
                                    _this.CloseMyMapSaveAsModal();
                                }
                            }, function (error) {
                                _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                    Position: constants_1.NotificationPosition.TopRight,
                                    Style: constants_1.NotificationStyle.Simple,
                                    Duration: constants_1.NotificationDuration
                                });
                                _this.CloseMyMapSaveAsModal();
                            });
                        }
                    }
                    else {
                        DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                        _this.httpRequestService._NodeSaveMyMap(CustomMap_1, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(function (data) {
                            if (data._Issuccess) {
                                var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                _this.myMapService.AddMapInUserMapList(mapData);
                                _this.myMapService.loadedMapData = data.CustomMapData;
                                _this.myMapService.isCustomMapLoaded = true;
                                _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                    Position: constants_1.NotificationPosition.TopRight,
                                    Style: constants_1.NotificationStyle.Simple,
                                    Duration: constants_1.NotificationDuration
                                });
                                _this.CloseMyMapSaveAsModal();
                            }
                        }, function (error) {
                            _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                Position: constants_1.NotificationPosition.TopRight,
                                Style: constants_1.NotificationStyle.Simple,
                                Duration: constants_1.NotificationDuration
                            });
                            _this.CloseMyMapSaveAsModal();
                        });
                    }
                }
                else {
                    DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                    _this.httpRequestService._NodeSaveMyMap(CustomMap_1, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(function (data) {
                        if (data._Issuccess) {
                            var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                            _this.myMapService.AddMapInUserMapList(mapData);
                            _this.myMapService.isCustomMapLoaded = true;
                            _this.myMapService.loadedMapData = data.CustomMapData;
                            _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                Position: constants_1.NotificationPosition.TopRight,
                                Style: constants_1.NotificationStyle.Simple,
                                Duration: constants_1.NotificationDuration
                            });
                            _this.CloseMyMapSaveAsModal();
                        }
                    }, function (error) {
                        _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                            Position: constants_1.NotificationPosition.TopRight,
                            Style: constants_1.NotificationStyle.Simple,
                            Duration: constants_1.NotificationDuration
                        });
                        _this.CloseMyMapSaveAsModal();
                    });
                }
            }
            else if (data._Issuccess && data.isMapNameExists) {
                _this._notification.create(constants_1.NotificationColor.Danger, "The name of the map is used by another map!", {
                    Position: constants_1.NotificationPosition.TopRight,
                    Style: constants_1.NotificationStyle.Simple,
                    Duration: constants_1.NotificationDuration
                });
            }
        }, function (error) {
            _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                Position: constants_1.NotificationPosition.TopRight,
                Style: constants_1.NotificationStyle.Simple,
                Duration: constants_1.NotificationDuration
            });
            _this.CloseMyMapSaveAsModal();
        });
    };
    MyMapSaveAsComponent = __decorate([
        core_1.Component({
            selector: 'app-mymap-saveas',
            templateUrl: './mymap-saveas.component.html',
            styleUrls: ['./mymap-saveas.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            map_service_service_1.MapServiceService,
            all_http_request_service_1.HttpRequestService,
            my_map_service_1.MyMapService,
            message_service_1.MessageService,
            google_component_1.GoogleMapPage])
    ], MyMapSaveAsComponent);
    return MyMapSaveAsComponent;
}());
exports.MyMapSaveAsComponent = MyMapSaveAsComponent;
//# sourceMappingURL=mymap-saveas.component.js.map