import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { HttpRequestService } from '../../../../../services/all-http-request.service';
import { MyMapService } from '../../../../../services/my-map.service';
import { MessageService } from '../../../../components/message/message.service';
import { GoogleMapPage } from '../../../../../maps/google/google.component';
import { MapServiceService } from '../../../../../services/map-service.service';
import { NotificationColor, NotificationPosition, NotificationStyle, NotificationDuration } from '../../../../../models/constants';
declare var jquery: any;
declare var $: any;
@Component({
    selector: 'app-mymap-saveas',
    templateUrl: './mymap-saveas.component.html',
    styleUrls: ['./mymap-saveas.component.scss']
})
export class MyMapSaveAsComponent implements OnInit {
    mapNameText: string;
    constructor(public bsModalRef: BsModalRef,
        public MapServiceService: MapServiceService,
        public httpRequestService: HttpRequestService,
        public myMapService: MyMapService,
        public _notification: MessageService,
        public GoogleMapPage: GoogleMapPage
    ) { }
    ngOnInit() {
        this.mapNameText = this.MapServiceService.getMapTitledata().getValue();
    }

    CloseMyMapSaveAsModal() {
        this.bsModalRef.hide();
    }

    SaveMap() {
        if (this.mapNameText)
            this.MapServiceService.setMapTitledata(this.mapNameText.trim());
        this.httpRequestService._NodeCheckMapName(this.MapServiceService.getMapTitledata().getValue()).subscribe(data => {
            if (data._Issuccess && data.isMapNameExists == false) {
                let CustomMap = this.myMapService.GetCustomMapData();

                if (this.myMapService.loadedMapData.CustomMaps && this.myMapService.loadedMapData.CustomMaps.length == 1)
                    CustomMap["Description"] = this.myMapService.loadedMapData.CustomMaps[0].Description;
                var EnergyLayers = this.GoogleMapPage.energyLayer.map(obj => obj.EnergyLayerID);
                var PrivateLayers = this.GoogleMapPage.privateLayer.map(obj => obj.DataSetID);
                var EnergyLayersStylebyuser = [];
                var LegendOrder;
                this.GoogleMapPage.energyLayer.forEach((s) => {
                    if (s.EnergyLayerStylesByUserModel && s.EnergyLayerStylesByUserModel.length > 0) {
                        EnergyLayersStylebyuser.push(s.EnergyLayerStylesByUserModel[0].Id);
                    }
                });
                if ($('#ToggleLegend').text().trim() == 'Hide Legend') {
                    LegendOrder = this.GoogleMapPage.energyLayer.map(obj => obj.EnergyLayerGUID);
                    if (LegendOrder.length > 0) {
                        LegendOrder = LegendOrder.join('#');
                    }
                    CustomMap["LegendOrder"] = LegendOrder;
                }
                var DefaultCheckedLayer = this.myMapService.GetDefaultCheckedLayers(this.GoogleMapPage.energyLayer, this.GoogleMapPage.privateLayer, this.GoogleMapPage.sharedLayer);
                var sharedLayer = this.GoogleMapPage.sharedLayer.map(obj => obj.DataSetID);
                if (sharedLayer && sharedLayer.length > 0) {
                    PrivateLayers.push(...sharedLayer);
                }
                var LayerGridFilters = this.myMapService.GetLayerGridFilter();
                if (PrivateLayers.length > 0) {
                    var PrivateParentIds = this.GoogleMapPage.privateLayer.map(obj => obj.ParentDataSetID).filter(obj => obj).filter((v, i, a) => a.indexOf(v) === i);
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
                            for (var id of PrivateParentIds) {
                                var allChildLayers = [];
                                ParentIds.map(function (e) {
                                    if (e.ParentDataSetID == id)
                                        allChildLayers.push(e);
                                });

                                var checkedChildLayers = [];
                                for (var child of allChildLayers) {
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
                                this.httpRequestService._NodeGetGUIDOfDataSets(needToAddGUIDOfDataSetID).subscribe(data => {
                                    if (data._Issuccess && data.result.length > 0) {
                                        for (var layer of data.result) {
                                            DefaultCheckedLayer.push({ DataSetID: layer.DataSetID, GUID: layer.DataSetGUID });
                                        }
                                        DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                                        this.httpRequestService._NodeSaveMyMap(CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(data => {
                                            if (data._Issuccess) {
                                                const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                                this.myMapService.AddMapInUserMapList(mapData);
                                                this.myMapService.loadedMapData = data.CustomMapData;
                                                this.myMapService.isCustomMapLoaded = true;
                                                this._notification.create(
                                                    NotificationColor.Success,
                                                    "The map saved successfully!",
                                                    {
                                                        Position: NotificationPosition.TopRight,
                                                        Style: NotificationStyle.Simple,
                                                        Duration: NotificationDuration
                                                    });
                                                this.CloseMyMapSaveAsModal();
                                            }
                                        },
                                            error => {
                                                this._notification.create(
                                                    NotificationColor.Danger,
                                                    "There is some issue to save map!",
                                                    {
                                                        Position: NotificationPosition.TopRight,
                                                        Style: NotificationStyle.Simple,
                                                        Duration: NotificationDuration
                                                    });
                                                this.CloseMyMapSaveAsModal();
                                            });
                                    }
                                }, error => {
                                    this._notification.create(
                                        NotificationColor.Danger,
                                        "There is some issue to save map!",
                                        {
                                            Position: NotificationPosition.TopRight,
                                            Style: NotificationStyle.Simple,
                                            Duration: NotificationDuration
                                        });
                                    this.CloseMyMapSaveAsModal();
                                });
                            }
                            else {
                                DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                                this.httpRequestService._NodeSaveMyMap(CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(data => {
                                    if (data._Issuccess) {
                                        const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                        this.myMapService.AddMapInUserMapList(mapData);
                                        this.myMapService.loadedMapData = data.CustomMapData;
                                        this.myMapService.isCustomMapLoaded = true;
                                        this._notification.create(
                                            NotificationColor.Success,
                                            "The map saved successfully!",
                                            {
                                                Position: NotificationPosition.TopRight,
                                                Style: NotificationStyle.Simple,
                                                Duration: NotificationDuration
                                            });
                                        this.CloseMyMapSaveAsModal();
                                    }
                                },
                                    error => {
                                        this._notification.create(
                                            NotificationColor.Danger,
                                            "There is some issue to save map!",
                                            {
                                                Position: NotificationPosition.TopRight,
                                                Style: NotificationStyle.Simple,
                                                Duration: NotificationDuration
                                            });
                                        this.CloseMyMapSaveAsModal();
                                    });

                            }

                        }
                        else {
                            DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                            this.httpRequestService._NodeSaveMyMap(CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(data => {
                                if (data._Issuccess) {
                                    const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                    this.myMapService.AddMapInUserMapList(mapData);
                                    this.myMapService.loadedMapData = data.CustomMapData;
                                    this.myMapService.isCustomMapLoaded = true;
                                    this._notification.create(
                                        NotificationColor.Success,
                                        "The map saved successfully!",
                                        {
                                            Position: NotificationPosition.TopRight,
                                            Style: NotificationStyle.Simple,
                                            Duration: NotificationDuration
                                        });
                                    this.CloseMyMapSaveAsModal();
                                }
                            },
                                error => {
                                    this._notification.create(
                                        NotificationColor.Danger,
                                        "There is some issue to save map!",
                                        {
                                            Position: NotificationPosition.TopRight,
                                            Style: NotificationStyle.Simple,
                                            Duration: NotificationDuration
                                        });
                                    this.CloseMyMapSaveAsModal();
                                });
                        }
                    }
                    else {
                        DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                        this.httpRequestService._NodeSaveMyMap(CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(data => {
                            if (data._Issuccess) {
                                const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                this.myMapService.AddMapInUserMapList(mapData);
                                this.myMapService.loadedMapData = data.CustomMapData;
                                this.myMapService.isCustomMapLoaded = true;
                                this._notification.create(
                                    NotificationColor.Success,
                                    "The map saved successfully!",
                                    {
                                        Position: NotificationPosition.TopRight,
                                        Style: NotificationStyle.Simple,
                                        Duration: NotificationDuration
                                    });
                                this.CloseMyMapSaveAsModal();
                            }
                        },
                            error => {
                                this._notification.create(
                                    NotificationColor.Danger,
                                    "There is some issue to save map!",
                                    {
                                        Position: NotificationPosition.TopRight,
                                        Style: NotificationStyle.Simple,
                                        Duration: NotificationDuration
                                    });
                                this.CloseMyMapSaveAsModal();
                            });
                    }
                }
                else {
                    DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                    this.httpRequestService._NodeSaveMyMap(CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(data => {
                        if (data._Issuccess) {
                            const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                            this.myMapService.AddMapInUserMapList(mapData);
                            this.myMapService.isCustomMapLoaded = true;
                            this.myMapService.loadedMapData = data.CustomMapData;
                            this._notification.create(
                                NotificationColor.Success,
                                "The map saved successfully!",
                                {
                                    Position: NotificationPosition.TopRight,
                                    Style: NotificationStyle.Simple,
                                    Duration: NotificationDuration
                                });
                            this.CloseMyMapSaveAsModal();
                        }
                    },
                        error => {
                            this._notification.create(
                                NotificationColor.Danger,
                                "There is some issue to save map!",
                                {
                                    Position: NotificationPosition.TopRight,
                                    Style: NotificationStyle.Simple,
                                    Duration: NotificationDuration
                                });
                            this.CloseMyMapSaveAsModal();
                        });
                }
            }
            else if (data._Issuccess && data.isMapNameExists) {
                this._notification.create(
                    NotificationColor.Danger,
                    "The name of the map is used by another map!",
                    {
                        Position: NotificationPosition.TopRight,
                        Style: NotificationStyle.Simple,
                        Duration: NotificationDuration
                    });
            }
        }, error => {
            this._notification.create(
                NotificationColor.Danger,
                "There is some issue to save map!",
                {
                    Position: NotificationPosition.TopRight,
                    Style: NotificationStyle.Simple,
                    Duration: NotificationDuration
                });
            this.CloseMyMapSaveAsModal();
        });
    }

}
