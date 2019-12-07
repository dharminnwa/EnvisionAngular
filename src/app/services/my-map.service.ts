import { Injectable } from '@angular/core';
import { MapServiceService } from './map-service.service';
import { AuthenticationService } from './auth.service';
import { GoogleMapPage } from '../maps/google/google.component';
import { UtilityService } from '../services/Utility.service'

@Injectable()
export class MyMapService {
    GoogleMapPage: GoogleMapPage;
    public isCustomMapLoaded: boolean = false;
    public loadedMapData: any = null;
    constructor(
        private MapServiceService: MapServiceService,
        public AuthServices: AuthenticationService,
        public UtilityService: UtilityService
    ) { }

    GetCustomMapData() {
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
    }

    GetDefaultCheckedLayers(energyLayersList, dataSetsLayerList, sharedLayerList) {
        var defaultCheckedLayers = [];
        if (energyLayersList.length > 0) {
            for (var e of energyLayersList) {
                var treeNode = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(e.EnergyLayerID);
                if (treeNode && treeNode.data.IsChecked == false)
                    defaultCheckedLayers.push({ EnergyLayerID: e.EnergyLayerID, GUID: e.EnergyLayerGUID });
            }
        }
        if (dataSetsLayerList.length > 0) {
            for (var e of dataSetsLayerList) {
                var treeNode = this.MapServiceService._PrivateTreeUI.getValue().treeModel.getNodeById(e.DataSetID);
                if (treeNode && treeNode.data.IsChecked == false)
                    defaultCheckedLayers.push({ DataSetID: e.DataSetID, GUID: e.DataSetGUID });
            }
        }
        if (sharedLayerList.length > 0) {
            for (var e of sharedLayerList) {
                var treeNode = this.MapServiceService._SharedTreeUI.getValue().treeModel.getNodeById(e.DataSetID);
                if (treeNode && treeNode.data.IsChecked == false)
                    defaultCheckedLayers.push({ DataSetID: e.DataSetID, GUID: e.DataSetGUID });
            }
        }
        return defaultCheckedLayers;
    }

    GetLayerGridFilter() {
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
                    for (var layer of activeTabData[0].energyLayer) {
                        var layerFilter = {
                            LayerId: layer.EnergyLayerID,
                            IsEnergyLayer: layer.DataSetID ? "false" : "true",
                            UserId: this.AuthServices.getLoggedinUserId(),
                            FilterSaveString: xmlFilter
                        }
                        layerGridFilter.push(layerFilter);
                        if (layer.treestatus.toLowerCase() == "grouplayer") {
                            if (layer.EnergyParentID) {
                                var index = layerGridFilter.findIndex(x => x.LayerId == layer.EnergyParentID);
                                if (index == -1) {
                                    var layerFilter = {
                                        LayerId: layer.EnergyParentID,
                                        IsEnergyLayer: "true",
                                        UserId: this.AuthServices.getLoggedinUserId(),
                                        FilterSaveString: xmlFilter
                                    }
                                    layerGridFilter.push(layerFilter);
                                }
                            }
                            else if (layer.ParentDataSetID) {
                                var index = layerGridFilter.findIndex(x => x.LayerId == layer.ParentDataSetID);
                                if (index == -1) {
                                    var layerFilter = {
                                        LayerId: layer.ParentDataSetID,
                                        IsEnergyLayer: "false",
                                        UserId: this.AuthServices.getLoggedinUserId(),
                                        FilterSaveString: xmlFilter
                                    }
                                    layerGridFilter.push(layerFilter);
                                }
                            }
                        }
                    }
                }
            }
        }
        return layerGridFilter;
    }

    AddMapInUserMapList(mapData) {
        let userMapList = this.MapServiceService._UserMapData.getValue();
        if (userMapList && userMapList.length > 0) {
            mapData["UserName"] = this.AuthServices.GetUserData().DisplayName;
            mapData["Type"] = "mymap";
            delete mapData["BaseMapProviderId"];
            delete mapData["IsDeleted"];
            delete mapData["IsPublic"];
            delete mapData["LegendOrder"];
            delete mapData["Modified"];
            userMapList.push(mapData);
            userMapList.sort((a, b) => b.CustomMapId - a.CustomMapId);
        }
    }

    UpdateMapInUserMapList(mapData) {
        let userMapList = this.MapServiceService._UserMapData.getValue();
        if (userMapList && userMapList.length > 0) {
            for (var map of userMapList) {
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
    }

    DeleteMapInUserMapList(mapData) {
        let userMapList = this.MapServiceService._UserMapData.getValue();
        if (userMapList && userMapList.length > 0) {
            for (var i = userMapList.length - 1; i >= 0; --i) {
                if (userMapList[i].CustomMapId == mapData.CustomMapId) {
                    userMapList.splice(i, 1);
                }
            }
        }

    }

}