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
var mymap_saveas_component_1 = require("./mymap-saveas/mymap-saveas.component");
var my_map_service_1 = require("../../../../services/my-map.service");
var google_component_1 = require("../../../../maps/google/google.component");
var all_http_request_service_1 = require("../../../../services/all-http-request.service");
var message_service_1 = require("../../../components/message/message.service");
var constants_1 = require("../../../../models/constants");
var map_service_service_1 = require("../../../../services/map-service.service");
var MyMapConfirmationComponent = (function () {
    function MyMapConfirmationComponent(bsModalRef, bsModalService, myMapService, GoogleMapPage, httpRequestService, _notification, MapServiceService) {
        this.bsModalRef = bsModalRef;
        this.bsModalService = bsModalService;
        this.myMapService = myMapService;
        this.GoogleMapPage = GoogleMapPage;
        this.httpRequestService = httpRequestService;
        this._notification = _notification;
        this.MapServiceService = MapServiceService;
        this.isSharedMap = false;
    }
    MyMapConfirmationComponent.prototype.ngOnInit = function () {
    };
    MyMapConfirmationComponent.prototype.CloseMyMapConfirmationModal = function () {
        this.bsModalRef.hide();
    };
    MyMapConfirmationComponent.prototype.OpenMyMapSaveAsModal = function () {
        this.CloseMyMapConfirmationModal();
        this.bsModalService.show(mymap_saveas_component_1.MyMapSaveAsComponent, { class: 'modal-lg myMapSaveAs modal-dialog-centered', backdrop: 'static', animated: false });
    };
    MyMapConfirmationComponent.prototype.UpdateMap = function () {
        var _this = this;
        if (this.myMapService.isCustomMapLoaded && this.myMapService.loadedMapData.CustomMaps.length == 1) {
            var savedMapData = this.myMapService.loadedMapData.CustomMaps[0];
            if (savedMapData.Name != this.MapServiceService.getMapTitledata().getValue()) {
                this.httpRequestService._NodeCheckMapName(this.MapServiceService.getMapTitledata().getValue()).subscribe(function (data) {
                    if (data._Issuccess && data.isMapNameExists == false) {
                        var CustomMap = _this.myMapService.GetCustomMapData();
                        var LegendOrder;
                        if ($('#ToggleLegend').text().trim() == 'Hide Legend') {
                            LegendOrder = _this.GoogleMapPage.energyLayer.map(function (obj) { return obj.EnergyLayerGUID; });
                            if (LegendOrder.length > 0) {
                                LegendOrder = LegendOrder.join('#');
                            }
                            CustomMap["LegendOrder"] = LegendOrder;
                        }
                        var EnergyLayers = _this.GoogleMapPage.energyLayer.map(function (obj) { return obj.EnergyLayerID; });
                        var PrivateLayers = _this.GoogleMapPage.privateLayer.map(function (obj) { return obj.DataSetID; });
                        var DefaultCheckedLayer = _this.myMapService.GetDefaultCheckedLayers(_this.GoogleMapPage.energyLayer, _this.GoogleMapPage.privateLayer, _this.GoogleMapPage.sharedLayer);
                        var sharedLayer = _this.GoogleMapPage.sharedLayer.map(function (obj) { return obj.DataSetID; });
                        if (sharedLayer && sharedLayer.length > 0) {
                            PrivateLayers.push.apply(PrivateLayers, sharedLayer);
                        }
                        var LayerGridFilters = _this.myMapService.GetLayerGridFilter();
                        var mapId = _this.myMapService.loadedMapData.CustomMaps[0].CustomMapId;
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
                                                _this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(function (data) {
                                                    if (data._Issuccess) {
                                                        var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                                        _this.myMapService.UpdateMapInUserMapList(mapData);
                                                        _this.myMapService.loadedMapData = data.CustomMapData;
                                                        _this.myMapService.isCustomMapLoaded = true;
                                                        _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                                            Position: constants_1.NotificationPosition.TopRight,
                                                            Style: constants_1.NotificationStyle.Simple,
                                                            Duration: constants_1.NotificationDuration
                                                        });
                                                        _this.CloseMyMapConfirmationModal();
                                                    }
                                                }, function (error) {
                                                    _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                                        Position: constants_1.NotificationPosition.TopRight,
                                                        Style: constants_1.NotificationStyle.Simple,
                                                        Duration: constants_1.NotificationDuration
                                                    });
                                                    _this.MapServiceService.setMapTitledata(savedMapData.Name);
                                                    _this.CloseMyMapConfirmationModal();
                                                });
                                            }
                                        }, function (error) {
                                            _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                                Position: constants_1.NotificationPosition.TopRight,
                                                Style: constants_1.NotificationStyle.Simple,
                                                Duration: constants_1.NotificationDuration
                                            });
                                            _this.MapServiceService.setMapTitledata(savedMapData.Name);
                                            _this.CloseMyMapConfirmationModal();
                                        });
                                    }
                                    else {
                                        DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                                        _this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(function (data) {
                                            if (data._Issuccess) {
                                                var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                                _this.myMapService.UpdateMapInUserMapList(mapData);
                                                _this.myMapService.loadedMapData = data.CustomMapData;
                                                _this.myMapService.isCustomMapLoaded = true;
                                                _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                                    Position: constants_1.NotificationPosition.TopRight,
                                                    Style: constants_1.NotificationStyle.Simple,
                                                    Duration: constants_1.NotificationDuration
                                                });
                                                _this.CloseMyMapConfirmationModal();
                                            }
                                        }, function (error) {
                                            _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                                Position: constants_1.NotificationPosition.TopRight,
                                                Style: constants_1.NotificationStyle.Simple,
                                                Duration: constants_1.NotificationDuration
                                            });
                                            _this.MapServiceService.setMapTitledata(savedMapData.Name);
                                            _this.CloseMyMapConfirmationModal();
                                        });
                                    }
                                }
                                else {
                                    DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                                    _this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(function (data) {
                                        if (data._Issuccess) {
                                            var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                            _this.myMapService.UpdateMapInUserMapList(mapData);
                                            _this.myMapService.isCustomMapLoaded = true;
                                            _this.myMapService.loadedMapData = data.CustomMapData;
                                            _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                                Position: constants_1.NotificationPosition.TopRight,
                                                Style: constants_1.NotificationStyle.Simple,
                                                Duration: constants_1.NotificationDuration
                                            });
                                            _this.CloseMyMapConfirmationModal();
                                        }
                                    }, function (error) {
                                        _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                            Position: constants_1.NotificationPosition.TopRight,
                                            Style: constants_1.NotificationStyle.Simple,
                                            Duration: constants_1.NotificationDuration
                                        });
                                        _this.MapServiceService.setMapTitledata(savedMapData.Name);
                                        _this.CloseMyMapConfirmationModal();
                                    });
                                }
                            }
                            else {
                                DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                                _this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(function (data) {
                                    if (data._Issuccess) {
                                        var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                        _this.myMapService.UpdateMapInUserMapList(mapData);
                                        _this.myMapService.isCustomMapLoaded = true;
                                        _this.myMapService.loadedMapData = data.CustomMapData;
                                        _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                            Position: constants_1.NotificationPosition.TopRight,
                                            Style: constants_1.NotificationStyle.Simple,
                                            Duration: constants_1.NotificationDuration
                                        });
                                        _this.CloseMyMapConfirmationModal();
                                    }
                                }, function (error) {
                                    _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                        Position: constants_1.NotificationPosition.TopRight,
                                        Style: constants_1.NotificationStyle.Simple,
                                        Duration: constants_1.NotificationDuration
                                    });
                                    _this.MapServiceService.setMapTitledata(savedMapData.Name);
                                    _this.CloseMyMapConfirmationModal();
                                });
                            }
                        }
                        else {
                            DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                            _this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(function (data) {
                                if (data._Issuccess) {
                                    var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                    _this.myMapService.UpdateMapInUserMapList(mapData);
                                    _this.myMapService.isCustomMapLoaded = true;
                                    _this.myMapService.loadedMapData = data.CustomMapData;
                                    _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                        Position: constants_1.NotificationPosition.TopRight,
                                        Style: constants_1.NotificationStyle.Simple,
                                        Duration: constants_1.NotificationDuration
                                    });
                                    _this.CloseMyMapConfirmationModal();
                                }
                            }, function (error) {
                                _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                    Position: constants_1.NotificationPosition.TopRight,
                                    Style: constants_1.NotificationStyle.Simple,
                                    Duration: constants_1.NotificationDuration
                                });
                                _this.MapServiceService.setMapTitledata(savedMapData.Name);
                                _this.CloseMyMapConfirmationModal();
                            });
                        }
                    }
                    else if (data._Issuccess && data.isMapNameExists) {
                        _this._notification.create(constants_1.NotificationColor.Danger, "The name of the map is used by another map!", {
                            Position: constants_1.NotificationPosition.TopRight,
                            Style: constants_1.NotificationStyle.Simple,
                            Duration: constants_1.NotificationDuration
                        });
                        _this.MapServiceService.setMapTitledata(savedMapData.Name);
                        _this.CloseMyMapConfirmationModal();
                    }
                }, function (error) {
                    _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                        Position: constants_1.NotificationPosition.TopRight,
                        Style: constants_1.NotificationStyle.Simple,
                        Duration: constants_1.NotificationDuration
                    });
                    _this.MapServiceService.setMapTitledata(savedMapData.Name);
                    _this.CloseMyMapConfirmationModal();
                });
            }
            else {
                var CustomMap = this.myMapService.GetCustomMapData();
                var LegendOrder;
                if ($('#ToggleLegend').text().trim() == 'Hide Legend') {
                    LegendOrder = this.GoogleMapPage.energyLayer.map(function (obj) { return obj.EnergyLayerGUID; });
                    if (LegendOrder.length > 0) {
                        LegendOrder = LegendOrder.join('#');
                    }
                    CustomMap["LegendOrder"] = LegendOrder;
                }
                var EnergyLayers = this.GoogleMapPage.energyLayer.map(function (obj) { return obj.EnergyLayerID; });
                var PrivateLayers = this.GoogleMapPage.privateLayer.map(function (obj) { return obj.DataSetID; });
                var DefaultCheckedLayer = this.myMapService.GetDefaultCheckedLayers(this.GoogleMapPage.energyLayer, this.GoogleMapPage.privateLayer, this.GoogleMapPage.sharedLayer);
                var sharedLayer = this.GoogleMapPage.sharedLayer.map(function (obj) { return obj.DataSetID; });
                if (sharedLayer && sharedLayer.length > 0) {
                    PrivateLayers.push.apply(PrivateLayers, sharedLayer);
                }
                var LayerGridFilters = this.myMapService.GetLayerGridFilter();
                var mapId = this.myMapService.loadedMapData.CustomMaps[0].CustomMapId;
                if (PrivateLayers.length > 0) {
                    var PrivateParentIds = this.GoogleMapPage.privateLayer.map(function (obj) { return obj.ParentDataSetID; }).filter(function (obj) { return obj; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
                    if (PrivateParentIds.length > 0) {
                        PrivateLayers = PrivateLayers.concat(PrivateParentIds);
                        if (DefaultCheckedLayer.length > 0) {
                            var ParentIds = [];
                            this.GoogleMapPage.privateLayer.map(function (e) {
                                if (e.ParentDataSetID) {
                                    ParentIds.push({ DataSetID: e.DataSetID, ParentDataSetID: e.ParentDataSetID });
                                }
                            });
                            var needToAddGUIDOfDataSetID = [];
                            for (var _i = 0, PrivateParentIds_2 = PrivateParentIds; _i < PrivateParentIds_2.length; _i++) {
                                var id = PrivateParentIds_2[_i];
                                var allChildLayers = [];
                                ParentIds.map(function (e) {
                                    if (e.ParentDataSetID == id)
                                        allChildLayers.push(e);
                                });
                                var checkedChildLayers = [];
                                for (var _a = 0, allChildLayers_2 = allChildLayers; _a < allChildLayers_2.length; _a++) {
                                    var child = allChildLayers_2[_a];
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
                                this.httpRequestService._NodeGetGUIDOfDataSets(needToAddGUIDOfDataSetID).subscribe(function (data) {
                                    if (data._Issuccess && data.result.length > 0) {
                                        for (var _i = 0, _a = data.result; _i < _a.length; _i++) {
                                            var layer = _a[_i];
                                            DefaultCheckedLayer.push({ DataSetID: layer.DataSetID, GUID: layer.DataSetGUID });
                                        }
                                        DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                                        _this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(function (data) {
                                            if (data._Issuccess) {
                                                var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                                _this.myMapService.UpdateMapInUserMapList(mapData);
                                                _this.myMapService.loadedMapData = data.CustomMapData;
                                                _this.myMapService.isCustomMapLoaded = true;
                                                _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                                    Position: constants_1.NotificationPosition.TopRight,
                                                    Style: constants_1.NotificationStyle.Simple,
                                                    Duration: constants_1.NotificationDuration
                                                });
                                                _this.CloseMyMapConfirmationModal();
                                            }
                                        }, function (error) {
                                            _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                                Position: constants_1.NotificationPosition.TopRight,
                                                Style: constants_1.NotificationStyle.Simple,
                                                Duration: constants_1.NotificationDuration
                                            });
                                            _this.CloseMyMapConfirmationModal();
                                        });
                                    }
                                }, function (error) {
                                    _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                        Position: constants_1.NotificationPosition.TopRight,
                                        Style: constants_1.NotificationStyle.Simple,
                                        Duration: constants_1.NotificationDuration
                                    });
                                    _this.CloseMyMapConfirmationModal();
                                });
                            }
                            else {
                                DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                                this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(function (data) {
                                    if (data._Issuccess) {
                                        var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                        _this.myMapService.UpdateMapInUserMapList(mapData);
                                        _this.myMapService.loadedMapData = data.CustomMapData;
                                        _this.myMapService.isCustomMapLoaded = true;
                                        _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                            Position: constants_1.NotificationPosition.TopRight,
                                            Style: constants_1.NotificationStyle.Simple,
                                            Duration: constants_1.NotificationDuration
                                        });
                                        _this.CloseMyMapConfirmationModal();
                                    }
                                }, function (error) {
                                    _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                        Position: constants_1.NotificationPosition.TopRight,
                                        Style: constants_1.NotificationStyle.Simple,
                                        Duration: constants_1.NotificationDuration
                                    });
                                    _this.CloseMyMapConfirmationModal();
                                });
                            }
                        }
                        else {
                            DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                            this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(function (data) {
                                if (data._Issuccess) {
                                    var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                    _this.myMapService.UpdateMapInUserMapList(mapData);
                                    _this.myMapService.isCustomMapLoaded = true;
                                    _this.myMapService.loadedMapData = data.CustomMapData;
                                    _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                        Position: constants_1.NotificationPosition.TopRight,
                                        Style: constants_1.NotificationStyle.Simple,
                                        Duration: constants_1.NotificationDuration
                                    });
                                    _this.CloseMyMapConfirmationModal();
                                }
                            }, function (error) {
                                _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                    Position: constants_1.NotificationPosition.TopRight,
                                    Style: constants_1.NotificationStyle.Simple,
                                    Duration: constants_1.NotificationDuration
                                });
                                _this.CloseMyMapConfirmationModal();
                            });
                        }
                    }
                    else {
                        DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                        this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(function (data) {
                            if (data._Issuccess) {
                                var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                _this.myMapService.UpdateMapInUserMapList(mapData);
                                _this.myMapService.isCustomMapLoaded = true;
                                _this.myMapService.loadedMapData = data.CustomMapData;
                                _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                    Position: constants_1.NotificationPosition.TopRight,
                                    Style: constants_1.NotificationStyle.Simple,
                                    Duration: constants_1.NotificationDuration
                                });
                                _this.CloseMyMapConfirmationModal();
                            }
                        }, function (error) {
                            _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                Position: constants_1.NotificationPosition.TopRight,
                                Style: constants_1.NotificationStyle.Simple,
                                Duration: constants_1.NotificationDuration
                            });
                            _this.CloseMyMapConfirmationModal();
                        });
                    }
                }
                else {
                    DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                    this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(function (data) {
                        if (data._Issuccess) {
                            var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                            _this.myMapService.UpdateMapInUserMapList(mapData);
                            _this.myMapService.isCustomMapLoaded = true;
                            _this.myMapService.loadedMapData = data.CustomMapData;
                            _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                Position: constants_1.NotificationPosition.TopRight,
                                Style: constants_1.NotificationStyle.Simple,
                                Duration: constants_1.NotificationDuration
                            });
                            _this.CloseMyMapConfirmationModal();
                        }
                    }, function (error) {
                        _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                            Position: constants_1.NotificationPosition.TopRight,
                            Style: constants_1.NotificationStyle.Simple,
                            Duration: constants_1.NotificationDuration
                        });
                        _this.CloseMyMapConfirmationModal();
                    });
                }
            }
        }
    };
    MyMapConfirmationComponent = __decorate([
        core_1.Component({
            selector: 'app-mymap-confirmation',
            templateUrl: './mymap-confirmation.component.html',
            styleUrls: ['./mymap-confirmation.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            ngx_bootstrap_1.BsModalService,
            my_map_service_1.MyMapService,
            google_component_1.GoogleMapPage,
            all_http_request_service_1.HttpRequestService,
            message_service_1.MessageService,
            map_service_service_1.MapServiceService])
    ], MyMapConfirmationComponent);
    return MyMapConfirmationComponent;
}());
exports.MyMapConfirmationComponent = MyMapConfirmationComponent;
//# sourceMappingURL=mymap-confirmation.component.js.map