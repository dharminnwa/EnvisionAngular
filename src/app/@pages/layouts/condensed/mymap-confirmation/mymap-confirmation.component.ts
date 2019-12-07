import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MyMapSaveAsComponent } from './mymap-saveas/mymap-saveas.component';
import { MyMapService } from '../../../../services/my-map.service';
import { GoogleMapPage } from '../../../../maps/google/google.component'
import { HttpRequestService } from '../../../../services/all-http-request.service';
import { MessageService } from '../../../components/message/message.service';
import { NotificationColor, NotificationPosition, NotificationStyle, NotificationDuration } from '../../../../models/constants';
import { MapServiceService } from '../../../../services/map-service.service'
import { AuthenticationService } from '../../../../services/auth.service';
declare var jquery: any;
declare var $: any;
@Component({
    selector: 'app-mymap-confirmation',
    templateUrl: './mymap-confirmation.component.html',
    styleUrls: ['./mymap-confirmation.component.scss']
})
export class MyMapConfirmationComponent implements OnInit {
    constructor(public bsModalRef: BsModalRef,
        private bsModalService: BsModalService,
        public myMapService: MyMapService,
        public GoogleMapPage: GoogleMapPage,
        public httpRequestService: HttpRequestService,
        private _notification: MessageService,
        public MapServiceService: MapServiceService,
        public authenticationService: AuthenticationService) { }
    isSharedMap: boolean = false;
    ngOnInit() {
    }

    CloseMyMapConfirmationModal() {
        this.bsModalRef.hide();
    }

    OpenMyMapSaveAsModal() {
        this.CloseMyMapConfirmationModal();
        this.bsModalService.show(MyMapSaveAsComponent, { class: 'modal-lg myMapSaveAs modal-dialog-centered', backdrop: 'static', animated: false });
    }

    UpdateMap() {
        if (this.myMapService.isCustomMapLoaded && this.myMapService.loadedMapData.CustomMaps.length == 1) {
            var savedMapData = this.myMapService.loadedMapData.CustomMaps[0];
            if (savedMapData.Name != this.MapServiceService.getMapTitledata().getValue()) {
                this.httpRequestService._NodeCheckMapName(this.MapServiceService.getMapTitledata().getValue()).subscribe(data => {
                    if (data._Issuccess && data.isMapNameExists == false) {
                        var CustomMap = this.myMapService.GetCustomMapData();
                        var LegendOrder;
                        if ($('#ToggleLegend').text().trim() == 'Hide Legend') {
                            LegendOrder = this.GoogleMapPage.energyLayer.map(obj => obj.EnergyLayerGUID);
                            if (LegendOrder.length > 0) {
                                LegendOrder = LegendOrder.join('#');
                            }
                            CustomMap["LegendOrder"] = LegendOrder;
                        }
                        var EnergyLayers = this.GoogleMapPage.energyLayer.map(obj => obj.EnergyLayerID);
                        var PrivateLayers = this.GoogleMapPage.privateLayer.map(obj => obj.DataSetID);
                        var DefaultCheckedLayer = this.myMapService.GetDefaultCheckedLayers(this.GoogleMapPage.energyLayer, this.GoogleMapPage.privateLayer, this.GoogleMapPage.sharedLayer);
                        var sharedLayer = this.GoogleMapPage.sharedLayer.map(obj => obj.DataSetID);
                        let logData = {
                            LoadedCustomMapID: savedMapData.CustomMapId,
                            CustomMapData: CustomMap,
                            EnergyLayers: EnergyLayers,
                            PrivateLayers: PrivateLayers,
                            SharedLayers: sharedLayer
                        }
                        let UserId = this.authenticationService.getLoggedinUserId();
                        this.httpRequestService._NodeInsertMyMapChangedLogs(logData, UserId).subscribe(data => { });
                        if (sharedLayer && sharedLayer.length > 0) {
                            PrivateLayers.push(...sharedLayer);
                        }
                        var LayerGridFilters = this.myMapService.GetLayerGridFilter();
                        var mapId = this.myMapService.loadedMapData.CustomMaps[0].CustomMapId;

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
                                                this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(data => {
                                                    if (data._Issuccess) {
                                                        const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                                        this.myMapService.UpdateMapInUserMapList(mapData);
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
                                                        this.CloseMyMapConfirmationModal();
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
                                                        this.MapServiceService.setMapTitledata(savedMapData.Name);
                                                        this.CloseMyMapConfirmationModal();
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
                                            this.MapServiceService.setMapTitledata(savedMapData.Name);
                                            this.CloseMyMapConfirmationModal();
                                        });
                                    }
                                    else {
                                        DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                                        this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(data => {
                                            if (data._Issuccess) {
                                                const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                                this.myMapService.UpdateMapInUserMapList(mapData);
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
                                                this.CloseMyMapConfirmationModal();
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
                                                this.MapServiceService.setMapTitledata(savedMapData.Name);
                                                this.CloseMyMapConfirmationModal();
                                            });

                                    }

                                }
                                else {
                                    DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                                    this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(data => {
                                        if (data._Issuccess) {
                                            const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                            this.myMapService.UpdateMapInUserMapList(mapData);
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
                                            this.CloseMyMapConfirmationModal();
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
                                        this.MapServiceService.setMapTitledata(savedMapData.Name);
                                        this.CloseMyMapConfirmationModal();
                                    });
                                }
                            }
                            else {
                                DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                                this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(data => {
                                    if (data._Issuccess) {
                                        const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                        this.myMapService.UpdateMapInUserMapList(mapData);
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
                                        this.CloseMyMapConfirmationModal();
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
                                    this.MapServiceService.setMapTitledata(savedMapData.Name);
                                    this.CloseMyMapConfirmationModal();
                                });
                            }
                        }
                        else {
                            DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                            this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(data => {
                                if (data._Issuccess) {
                                    const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                    this.myMapService.UpdateMapInUserMapList(mapData);
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
                                    this.CloseMyMapConfirmationModal();
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
                                this.MapServiceService.setMapTitledata(savedMapData.Name);
                                this.CloseMyMapConfirmationModal();
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
                        this.MapServiceService.setMapTitledata(savedMapData.Name);
                        this.CloseMyMapConfirmationModal();
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
                    this.MapServiceService.setMapTitledata(savedMapData.Name);
                    this.CloseMyMapConfirmationModal();
                });
            }
            else {
                var CustomMap = this.myMapService.GetCustomMapData();
                var LegendOrder;
                if ($('#ToggleLegend').text().trim() == 'Hide Legend') {
                    LegendOrder = this.GoogleMapPage.energyLayer.map(obj => obj.EnergyLayerGUID);
                    if (LegendOrder.length > 0) {
                        LegendOrder = LegendOrder.join('#');
                    }
                    CustomMap["LegendOrder"] = LegendOrder;
                }
                var EnergyLayers = this.GoogleMapPage.energyLayer.map(obj => obj.EnergyLayerID);
                var PrivateLayers = this.GoogleMapPage.privateLayer.map(obj => obj.DataSetID);
                var DefaultCheckedLayer = this.myMapService.GetDefaultCheckedLayers(this.GoogleMapPage.energyLayer, this.GoogleMapPage.privateLayer, this.GoogleMapPage.sharedLayer);
                var sharedLayer = this.GoogleMapPage.sharedLayer.map(obj => obj.DataSetID);
                let logData = {
                    LoadedCustomMapID: savedMapData.CustomMapId,
                    CustomMapData: CustomMap,
                    EnergyLayers: EnergyLayers,
                    PrivateLayers: PrivateLayers,
                    SharedLayers: sharedLayer
                }
                let UserId = this.authenticationService.getLoggedinUserId();
                this.httpRequestService._NodeInsertMyMapChangedLogs(logData, UserId).subscribe(data => { });
                if (sharedLayer && sharedLayer.length > 0) {
                    PrivateLayers.push(...sharedLayer);
                }
                var LayerGridFilters = this.myMapService.GetLayerGridFilter();
                var mapId = this.myMapService.loadedMapData.CustomMaps[0].CustomMapId;
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
                                        this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(data => {
                                            if (data._Issuccess) {
                                                const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                                this.myMapService.UpdateMapInUserMapList(mapData);
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
                                                this.CloseMyMapConfirmationModal();
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
                                                this.CloseMyMapConfirmationModal();
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
                                    this.CloseMyMapConfirmationModal();
                                });
                            }
                            else {
                                DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                                this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(data => {
                                    if (data._Issuccess) {
                                        const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                        this.myMapService.UpdateMapInUserMapList(mapData);
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
                                        this.CloseMyMapConfirmationModal();
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
                                        this.CloseMyMapConfirmationModal();
                                    });

                            }

                        }
                        else {
                            DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                            this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(data => {
                                if (data._Issuccess) {
                                    const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                    this.myMapService.UpdateMapInUserMapList(mapData);
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
                                    this.CloseMyMapConfirmationModal();
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
                                this.CloseMyMapConfirmationModal();
                            });
                        }
                    }
                    else {
                        DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                        this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(data => {
                            if (data._Issuccess) {
                                const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                this.myMapService.UpdateMapInUserMapList(mapData);
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
                                this.CloseMyMapConfirmationModal();
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
                            this.CloseMyMapConfirmationModal();
                        });
                    }
                }
                else {
                    DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                    this.httpRequestService._NodeUpdateMyMap(mapId, CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters).subscribe(data => {
                        if (data._Issuccess) {
                            const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                            this.myMapService.UpdateMapInUserMapList(mapData);
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
                            this.CloseMyMapConfirmationModal();
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
                        this.CloseMyMapConfirmationModal();
                    });
                }
            }
        }
    }
}
