import { Injectable } from '@angular/core';
import { MapServiceService } from '../services/map-service.service';
import { HttpRequestService } from './all-http-request.service';
import { AuthenticationService } from './auth.service'
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { UtilityService } from './Utility.service';
import { MyMapService } from './my-map.service';
import { ParcelBufferZoomMax, ParcelBufferZoomMin } from '../models/constants';
declare var jquery: any;
declare var $: any;
declare var google: any;
@Injectable()
export class MapLayernewService {
    constructor(private MapServiceService: MapServiceService,
        private httpRequest: HttpRequestService,
        private _api: ApiService,
        private UtilityService: UtilityService,
        private authService: AuthenticationService,
        private myMapService: MyMapService) { }
    public _mapdata: any = this.MapServiceService._mapdata;
    public _isLayerLoaded = false;
    public _isGroupLayerLoaded = false;

    recentFilters: FilterGroup = {
        cqlFilter: '',
        sldBody: '',
        id: ''
    };
    recentCustomMapFilters: FilterGroup = {
        cqlFilter: '',
        sldBody: '',
        id: ''
    };
    groupRecentFilters: FilterGroup[] = [];
    IndividualgroupRecentFilters: FilterGroup[] = [];

    LoadMapLayers() {
        let tabdata = this.MapServiceService._GridTabData.value;
        if (this._isLayerLoaded)
            this.removemapLayer();
        if (tabdata.length > 0) {
            let groupLayers = tabdata.filter(x => x.treestatus != 'Individual');
            let timeout: number = 0;
            if (groupLayers.length > 0)
                timeout = 300;
            setTimeout(() => {
                let data = this.CreateSldBodyAndCqlFilter(tabdata);
                if ((this.recentFilters['cqlFilter'] == data.cqlFilter && this.recentFilters['sldBody'] == data.sldBody) || (data.cqlFilter == ''))
                    return;
                this.recentFilters['cqlFilter'] = data.cqlFilter;
                this.recentFilters['sldBody'] = data.sldBody;
                let userId = this.authService.getLoggedinUserId();
                this.httpRequest._NodeGeoserverSetImageLayerData(data.sldBody, data.cqlFilter, userId).subscribe(res => {
                    if (data.sldBody == this.recentFilters['sldBody'] && data.cqlFilter == this.recentFilters['cqlFilter'])
                        this.recentFilters['id'] = res.GeoMapPropID;
                    let gmaps = this._mapdata.getValue();
                    gmaps.overlayMapTypes.setAt(1000, this.SetnewWMSlayerD(tabdata, res.GeoMapPropID));
                    // google.maps.event.addListener(gmaps, 'tilesloaded', (e) => {
                    //     this.DeleteTempImgData(data.GeoMapPropID);
                    // });
                    this._isLayerLoaded = true;
                }, error => {
                    console.error(error);
                });
            }, timeout);

        }
        // else {
        //     gmaps.overlayMapTypes.setAt(1, null);
        // }
    }
    removemapLayer() {
        let gmaps = this._mapdata.getValue();
        gmaps.overlayMapTypes.setAt(1000, null);
        this._isLayerLoaded = false;
    }

    LoadCustomMapLayers() {
        let tabdata = this.MapServiceService._GridTabData.value;
        if (tabdata.length > 0) {
            setTimeout(() => {
                let data = this.CreateCustomMapSldBodyAndCqlFilter(tabdata);
                // if ((this.recentCustomMapFilters['cqlFilter'] == data.cqlFilter && this.recentCustomMapFilters['sldBody'] == data.sldBody) || (data.cqlFilter == ''))
                if (this.recentCustomMapFilters['cqlFilter'] == data.cqlFilter && this.recentCustomMapFilters['sldBody'] == data.sldBody)
                    return;
                if (this.myMapService.isCustomMapLoaded)
                    this.RemoveCustomMapLayer();
                this.recentCustomMapFilters['cqlFilter'] = data.cqlFilter;
                this.recentCustomMapFilters['sldBody'] = data.sldBody;
                if (data.sldBody == '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld"> ; </StyledLayerDescriptor>' || data.sldBody == '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld"></StyledLayerDescriptor>')
                    return;
                let userId = this.authService.getLoggedinUserId();
                this.httpRequest._NodeGeoserverSetImageLayerData(data.sldBody, data.cqlFilter, userId, data.zoomData).subscribe(res => {
                    if (data.sldBody == this.recentCustomMapFilters['sldBody'] && data.cqlFilter == this.recentCustomMapFilters['cqlFilter'])
                        this.recentCustomMapFilters['id'] = res.GeoMapPropID;
                    let gmaps = this._mapdata.getValue();
                    gmaps.overlayMapTypes.setAt(1000, this.SetnewWMSlayerD(tabdata, res.GeoMapPropID));
                    // google.maps.event.addListener(gmaps, 'tilesloaded', (e) => {
                    //     this.DeleteTempImgData(data.GeoMapPropID);
                    // });
                }, error => {
                    console.error(error);
                });
            }, 3000);

        } else if (tabdata.length == 0) {
            if (this.myMapService.isCustomMapLoaded) {
                this.recentCustomMapFilters = {
                    cqlFilter: '',
                    sldBody: '',
                    id: ''
                };
                this.RemoveCustomMapLayer();
            }

        }
        // else {
        //     gmaps.overlayMapTypes.setAt(1, null);
        // }
    }
    RemoveCustomMapLayer() {
        let gmaps = this._mapdata.getValue();
        gmaps.overlayMapTypes.setAt(1000, null);
        this._isLayerLoaded = false;
    }


    LoadGroupMapLayers() {
        let tabdata = this.MapServiceService._GridTabData.value;
        if (tabdata.length > 0) {
            setTimeout(() => {
                let groupLayers = tabdata.filter(x => x.treestatus == 'GroupLayer');
                if (groupLayers && groupLayers.length > 0) {
                    for (let i = 0; i < groupLayers.length; i++) {
                        let groupLayer = groupLayers[i];
                        let data = this.CreateSldBodyAndCqlFilterForGroupLayer(groupLayer);
                        let isRecentFilter = this.groupRecentFilters.find(x => x.cqlFilter == data.cqlFilter && x.sldBody == data.sldBody && groupLayer.parentID == x.groupLayerId);
                        if (isRecentFilter)
                            continue;
                        this.removeGroupmapLayer(groupLayer.Layerindexval);
                        let existingGroupLayerIndex = this.groupRecentFilters.findIndex(x => x.groupLayerId == groupLayer.parentID);
                        if (existingGroupLayerIndex > -1)
                            this.groupRecentFilters.splice(existingGroupLayerIndex, 1);
                        let groupFilterData = new FilterGroup();
                        groupFilterData.cqlFilter = data.cqlFilter;
                        groupFilterData.sldBody = data.sldBody;
                        groupFilterData.id = '';
                        groupFilterData.groupLayerId = groupLayer.parentID;
                        this.groupRecentFilters.push(groupFilterData);
                        let userId = this.authService.getLoggedinUserId();
                        this.httpRequest._NodeGeoserverSetImageLayerData(data.sldBody, data.cqlFilter, userId).subscribe(res => {
                            let groupFilterData = this.groupRecentFilters.find(x => x.groupLayerId == groupLayer.parentID);
                            if (groupFilterData)
                                groupFilterData.id = res.GeoMapPropID;
                            let gmaps = this._mapdata.getValue();
                            gmaps.overlayMapTypes.setAt(groupLayer.Layerindexval, this.SetnewWMSlayerD(tabdata, res.GeoMapPropID));
                            this._isGroupLayerLoaded = true;
                        }, error => {
                            console.error(error);
                        });
                    }
                }

            }, 300);

        }
    }

    LoadIndividualGroupMapLayer(FeatureType) {
        let tabdata = this.MapServiceService._GridTabData.value;
        if (tabdata.length > 0) {
            setTimeout(() => {
                tabdata = tabdata.filter(x => x.treestatus == 'Individual' && (x.FeatureType == FeatureType));
                let LayerIndexvalue = tabdata[0].Layerindexval;
                let data = this.CreateIndividualSldBodyAndCqlFilter(tabdata, FeatureType);
                if ((this.recentFilters['cqlFilter'] == data.cqlFilter && this.recentFilters['sldBody'] == data.sldBody) || (data.cqlFilter == ''))
                    return;
                this.recentFilters['cqlFilter'] = data.cqlFilter;
                this.recentFilters['sldBody'] = data.sldBody;
                this.removeGroupmapLayer(LayerIndexvalue);
                let userId = this.authService.getLoggedinUserId();
                this.httpRequest._NodeGeoserverSetImageLayerData(data.sldBody, data.cqlFilter, userId, data.zoomData).subscribe(res => {
                    if (data.sldBody == this.recentFilters['sldBody'] && data.cqlFilter == this.recentFilters['cqlFilter'])
                        this.recentFilters['id'] = res.GeoMapPropID;
                    let gmaps = this._mapdata.getValue();
                    gmaps.overlayMapTypes.setAt(LayerIndexvalue, this.SetnewWMSlayerD(tabdata, res.GeoMapPropID, FeatureType));
                    // google.maps.event.addListener(gmaps, 'tilesloaded', (e) => {
                    //     this.DeleteTempImgData(data.GeoMapPropID);
                    // });

                }, error => {
                    console.error(error);
                });
            }, 200);

        }
    }
    removeGroupmapLayer(index) {
        let gmaps = this._mapdata.getValue();
        gmaps.overlayMapTypes.setAt(index, null);
        this._isLayerLoaded = false;
    }

    SetnewWMSlayerD(tabdata, geoMapPropID, FeatureType?: string) {
        let wmsOptions = {
            alt: "EnergyLayer",
            getTileUrl: (tile, zoom) => {
                return this.WMStileUrlD(geoMapPropID, tile, zoom, FeatureType);
            },
            isPng: true,
            maxZoom: 17,
            minZoom: 1,
            name: "EnergyLayer",
            tileSize: new google.maps.Size(256, 256)
        };
        let openlayersWMS = new google.maps.ImageMapType(wmsOptions);
        return openlayersWMS;
    }

    WMStileUrlD(geoMapPropID, tile, zoom, FeatureType?: string) {
        if (FeatureType && FeatureType == "ParcelBufferSection") {
            if (!(zoom >= ParcelBufferZoomMin) && (zoom <= ParcelBufferZoomMax)) {
                return null;
            }
        }
        let gmas = this._mapdata.getValue()
        let projection = gmas.getProjection();
        let zpow = Math.pow(2, zoom);
        let ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
        let lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
        let ulw = projection.fromPointToLatLng(ul);
        let lrw = projection.fromPointToLatLng(lr);
        let bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
        const endpoint = this._api._NodeGeoserverGetGeoMapNew;
        let uRLParameter = '?BBOX=' + bbox + '&GeoMapPropID=' + geoMapPropID + '&Zoom=' + zoom;
        const getGeoMapNewURL = endpoint + uRLParameter;
        return getGeoMapNewURL;
    }
    CreateSldBodyAndCqlFilter(tabdata) {
        let sldBody = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld">';
        let cqlFilter = '';
        for (let p = 0; p < tabdata.length; p++) {
            let _TabData = tabdata[p];
            //if (_TabData.GeoserverLayerStatus == 'Published') {

            if (_TabData.treestatus == 'Individual') {
                let _EnergyLayer = tabdata[p].energyLayer[0];
                if (_TabData.EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer == true && !_EnergyLayer.serversidefilterval) {
                    if (_TabData.EnergylayersavegridFilter.mapfilterval.indexOf(";") != -1)
                        _EnergyLayer.serversidefilterval = _TabData.EnergylayersavegridFilter.mapfilterval.split(";");
                    else
                        _EnergyLayer.serversidefilterval = [_TabData.EnergylayersavegridFilter.mapfilterval];
                }
                sldBody += this.CreateSldBody(_EnergyLayer);
                let currentCqlfilter = this.GetCQLFilter(_EnergyLayer);
                if (currentCqlfilter == '')
                    currentCqlfilter = 'INCLUDE';
                if (cqlFilter != '')
                    cqlFilter += ';';
                cqlFilter += currentCqlfilter;
            }
            else if (_TabData.treestatus != 'Individual') {
                if (this.MapServiceService._TreeUI.getValue()) {
                    let nodeData = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(tabdata[p].parentID).data.children;
                    let allCheckedLayer = nodeData.filter(m => m.IsChecked == false).map(m => m.Id);
                    if (allCheckedLayer.length > 0) {
                        for (let layer of _TabData.energyLayer) {
                            if (allCheckedLayer.indexOf(layer.EnergyLayerID) != -1) {
                                if (_TabData.EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer == true && !layer.serversidefilterval) {
                                    if (_TabData.EnergylayersavegridFilter.mapfilterval.indexOf(";") != -1)
                                        layer.serversidefilterval = _TabData.EnergylayersavegridFilter.mapfilterval.split(";");
                                    else
                                        layer.serversidefilterval = [_TabData.EnergylayersavegridFilter.mapfilterval];
                                }
                                sldBody += this.CreateSldBody(layer);
                                let currentCqlfilter = this.GetCQLFilter(layer);
                                if (currentCqlfilter == '')
                                    currentCqlfilter = 'INCLUDE'
                                if (cqlFilter != '')
                                    cqlFilter += ';'
                                cqlFilter += currentCqlfilter;
                            }
                        }
                    }
                }
            }
        }
        sldBody += '</StyledLayerDescriptor>';
        let data = {
            sldBody: sldBody,
            cqlFilter: cqlFilter
        }
        return data;
    }
    CreateCustomMapSldBodyAndCqlFilter(tabdata) {
        let sldBody = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld">';
        let cqlFilter = '';
        let zoomConstraints = '';
        tabdata = this.TabSortByIconType(tabdata);
        for (let p = 0; p < tabdata.length; p++) {
            let _TabData = tabdata[p];
            //if (_TabData.GeoserverLayerStatus == 'Published') {
            let _EnergyLayer = tabdata[p].energyLayer[0];
            if ((_EnergyLayer.UploadFileType && (_EnergyLayer.UploadFileType == '.kml' || _EnergyLayer.UploadFileType == '.kmz')) || !_EnergyLayer['TableName'])
                continue;
            if (_TabData.treestatus == 'Individual') {
                if (_TabData.EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer == true && !_EnergyLayer.serversidefilterval) {
                    if (_TabData.EnergylayersavegridFilter.mapfilterval.indexOf(";") != -1)
                        _EnergyLayer.serversidefilterval = _TabData.EnergylayersavegridFilter.mapfilterval.split(";");
                    else
                        _EnergyLayer.serversidefilterval = [_TabData.EnergylayersavegridFilter.mapfilterval];
                }
                sldBody += ' ; ';
                sldBody += this.CreateSldBody(_EnergyLayer);
                zoomConstraints += this.getZoomConstraints(_EnergyLayer);
                zoomConstraints += ';';
                let currentCqlfilter = this.GetCQLFilter(_EnergyLayer);
                if (currentCqlfilter == '')
                    currentCqlfilter = 'INCLUDE';
                if (cqlFilter != '')
                    cqlFilter += ';';
                cqlFilter += currentCqlfilter;
            }
            else if (_TabData.treestatus != 'Individual') {
                if (this.MapServiceService._TreeUI.getValue()) {
                    let nodeData = [];
                    let energyTree = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(tabdata[p].parentID);
                    if (energyTree && energyTree.data) {
                        let EnergyNodeData = energyTree.data.children;
                        if (EnergyNodeData.length > 0)
                            nodeData.push(...EnergyNodeData);
                    }
                    let privateTree = this.MapServiceService._PrivateTreeUI.getValue().treeModel.getNodeById(tabdata[p].parentID);
                    if (privateTree && privateTree.data) {
                        let PrivateNodeData = privateTree.data.children;
                        if (PrivateNodeData.length > 0)
                            nodeData.push(...PrivateNodeData);
                    }
                    let sharedTree = this.MapServiceService._SharedTreeUI.getValue().treeModel.getNodeById(tabdata[p].parentID);
                    if (sharedTree && sharedTree.data) {
                        let SharedNodeData = sharedTree.data.children;
                        if (SharedNodeData.length > 0)
                            nodeData.push(...SharedNodeData);
                    }
                    let tempTree = this.MapServiceService._TemporaryTreeUI.getValue().treeModel.getNodeById(tabdata[p].parentID);
                    if (tempTree && tempTree.data) {
                        let TempNodeData = tempTree.data.children;
                        if (TempNodeData.length > 0)
                            nodeData.push(...TempNodeData);
                    }
                    if (nodeData.length > 0) {
                        let allCheckedLayer = nodeData.filter(m => m.IsChecked == false).map(m => m.Id);
                        if (allCheckedLayer.length > 0) {
                            for (let layer of _TabData.energyLayer) {
                                if (allCheckedLayer.indexOf(layer.EnergyLayerID) != -1) {
                                    if (_TabData.EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer == true && !layer.serversidefilterval) {
                                        if (_TabData.EnergylayersavegridFilter.mapfilterval.indexOf(";") != -1)
                                            layer.serversidefilterval = _TabData.EnergylayersavegridFilter.mapfilterval.split(";");
                                        else
                                            layer.serversidefilterval = [_TabData.EnergylayersavegridFilter.mapfilterval];
                                    }
                                    sldBody += ' ; ';
                                    sldBody += this.CreateSldBody(layer);
                                    zoomConstraints += this.getZoomConstraints(layer);
                                    zoomConstraints += ';';
                                    let currentCqlfilter = this.GetCQLFilter(layer);
                                    if (currentCqlfilter == '')
                                        currentCqlfilter = 'INCLUDE'
                                    if (cqlFilter != '')
                                        cqlFilter += ';'
                                    cqlFilter += currentCqlfilter;
                                }
                            }
                        }
                    }
                }
            }
        }
        sldBody += ' ; ';
        sldBody += '</StyledLayerDescriptor>';
        let data = {
            sldBody: sldBody,
            cqlFilter: cqlFilter,
            zoomData: zoomConstraints
        }
        return data;
    }
    getZoomConstraints(layer) {
        let zoomStr = '';
        if (layer['ZoomMin'] && layer['ZoomMax']) {
            zoomStr = layer['ZoomMin'] + ',' + layer['ZoomMax'];
        }
        return zoomStr;
    }
    TabSortByIconType(tabdata) {
        let tabDataInOrder = [];
        let pointLayerTab = [];
        let lineLayerTab = [];
        let areaLayerTab = [];
        for (let tab of tabdata) {
            if (tab.energyLayer.length > 0) {
                let layer = tab.energyLayer[0];
                let IconType = layer["IconType"];
                if (IconType == 'Square') {
                    IconType = "Circle";
                }
                let shape = layer["RepresentationType"]
                if (shape == null) {
                    IconType = this.UtilityService.getIconType(IconType);
                    if (IconType == 'Circle') {
                        shape = "Point";
                    }
                    else if (IconType == 'Line') {
                        shape = "Line";
                    }
                    else if (IconType == 'Rectangle') { shape = "Area"; }
                    else if (IconType == 'RoundedRectangle') { shape = "Area"; }
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
        let areaAndLineLayers = areaLayerTab.concat(lineLayerTab);
        tabDataInOrder = areaAndLineLayers.concat(pointLayerTab);
        return tabDataInOrder;
    }
    CreateIndividualSldBodyAndCqlFilter(tabdata, FeatureType) {
        tabdata = this.TabSortByIconType(tabdata);
        let sldBody = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld">';
        let cqlFilter = '';
        let zoomConstraints = '';
        for (let p = 0; p < tabdata.length; p++) {
            let _TabData = tabdata[p];
            //if (_TabData.GeoserverLayerStatus == 'Published') {
            let treeIschecked = false;
            if (_TabData.FeatureType == FeatureType) {
                if (this.MapServiceService._TemporaryTreeUI.getValue()) {
                    let nodeData = this.MapServiceService._TemporaryTreeUI.getValue().treeModel.getNodeById(_TabData.ID);
                    if (nodeData && nodeData.data && nodeData.data.IsChecked == false) {
                        treeIschecked = true;
                    }
                }
                if (FeatureType == "SiteSelection") {
                    if (this.MapServiceService._TreeUI.getValue()) {
                        let nodeData = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(_TabData.ID);
                        if (nodeData && nodeData.data && nodeData.data.IsChecked == false) {
                            treeIschecked = true;
                        }
                    }
                }
            }
            if (_TabData.treestatus == 'Individual' && treeIschecked) {
                let _EnergyLayer = tabdata[p].energyLayer[0];
                if (_TabData.EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer == true && !_EnergyLayer.serversidefilterval) {
                    if (_TabData.EnergylayersavegridFilter.mapfilterval.indexOf(";") != -1)
                        _EnergyLayer.serversidefilterval = _TabData.EnergylayersavegridFilter.mapfilterval.split(";");
                    else
                        _EnergyLayer.serversidefilterval = [_TabData.EnergylayersavegridFilter.mapfilterval];
                }
                if (FeatureType == "SiteSelection") {
                    sldBody += ' ; ';
                    zoomConstraints += this.getZoomConstraints(_EnergyLayer);
                    zoomConstraints += ';';
                }
                sldBody += this.CreateSldBody(_EnergyLayer);
                let currentCqlfilter = this.GetCQLFilter(_EnergyLayer);
                if (currentCqlfilter == '')
                    currentCqlfilter = 'INCLUDE';
                if (cqlFilter != '')
                    cqlFilter += ';';
                cqlFilter += currentCqlfilter;
            }
            else if (_TabData.treestatus != 'Individual' && treeIschecked) {
                if (this.MapServiceService._TreeUI.getValue()) {
                    let nodeData = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(tabdata[p].parentID).data.children;
                    let allCheckedLayer = nodeData.filter(m => m.IsChecked == false).map(m => m.Id);
                    if (allCheckedLayer.length > 0) {
                        for (let layer of _TabData.energyLayer) {
                            if (allCheckedLayer.indexOf(layer.EnergyLayerID) != -1) {
                                if (_TabData.EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer == true && !layer.serversidefilterval) {
                                    if (_TabData.EnergylayersavegridFilter.mapfilterval.indexOf(";") != -1)
                                        layer.serversidefilterval = _TabData.EnergylayersavegridFilter.mapfilterval.split(";");
                                    else
                                        layer.serversidefilterval = [_TabData.EnergylayersavegridFilter.mapfilterval];
                                }
                                if (FeatureType == "SiteSelection") {
                                    sldBody += ' ; ';
                                    zoomConstraints += this.getZoomConstraints(layer);
                                    zoomConstraints += ';';
                                }
                                sldBody += this.CreateSldBody(layer);
                                let currentCqlfilter = this.GetCQLFilter(layer);
                                if (currentCqlfilter == '')
                                    currentCqlfilter = 'INCLUDE'
                                if (cqlFilter != '')
                                    cqlFilter += ';'
                                cqlFilter += currentCqlfilter;
                            }
                        }
                    }
                }
            }
        }
        if (FeatureType == "SiteSelection") {
            sldBody += ' ; ';
        }
        sldBody += '</StyledLayerDescriptor>';
        let data = {
            sldBody: sldBody,
            cqlFilter: cqlFilter,
            zoomData: zoomConstraints
        }
        return data;
    }
    Create_Individual_SldBodyAndCqlFilterForGroupLayer(tabdata) {
        let sldBody = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld">';
        let cqlFilter = '';
        for (let p = 0; p < tabdata.length; p++) {
            let _TabData = tabdata[p];
            //if (_TabData.GeoserverLayerStatus == 'Published') {
            if (_TabData.treestatus == 'Individual') {
                let _EnergyLayer = tabdata[p].energyLayer[0];
                sldBody += this.CreateSldBody(_EnergyLayer);
                let currentCqlfilter = this.GetCQLFilter(_EnergyLayer);
                if (currentCqlfilter == '')
                    currentCqlfilter = 'INCLUDE'
                if (cqlFilter != '')
                    cqlFilter += ';'
                cqlFilter += currentCqlfilter;
            }
            else {
                if (this.MapServiceService._TreeUI.getValue()) {
                    let nodeData = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(tabdata[p].parentID).data.children;
                    let allCheckedLayer = nodeData.filter(m => m.IsChecked == false).map(m => m.Id);
                    if (allCheckedLayer.length > 0) {
                        for (let layer of _TabData.energyLayer) {
                            if (allCheckedLayer.indexOf(layer.EnergyLayerID) != -1) {
                                sldBody += this.CreateSldBody(layer);
                                let currentCqlfilter = this.GetCQLFilter(layer);
                                if (currentCqlfilter == '')
                                    currentCqlfilter = 'INCLUDE'
                                if (cqlFilter != '')
                                    cqlFilter += ';'
                                cqlFilter += currentCqlfilter;
                            }
                        }
                    }
                }
            }
        }
        sldBody += '</StyledLayerDescriptor>';
        let data = {
            sldBody: sldBody,
            cqlFilter: cqlFilter
        }
        return data;
    }

    CreateSldBodyAndCqlFilterForGroupLayer(tabdata) {
        let sldBody = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld">';
        let cqlFilter = '';
        let _TabData = tabdata;
        let allCheckedLayer = null;
        if (_TabData.treestatus == 'GroupLayer') {
            if (_TabData.FeatureType == "CreateLayer") {
                if (this.MapServiceService._TemporaryTreeUI.getValue()) {
                    let nodeData = this.MapServiceService._TemporaryTreeUI.getValue().treeModel.getNodeById(tabdata.parentID).data.children;
                    allCheckedLayer = nodeData.filter(m => m.IsChecked == false).map(m => m.Id);
                }
            } else if (_TabData.FeatureType == "EnergyLayer") {
                if (this.MapServiceService._TreeUI.getValue()) {
                    let treeModel = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(tabdata.parentID);
                    if (treeModel) {
                        let nodeData = treeModel.data.children;
                        allCheckedLayer = nodeData.filter(m => m.IsChecked == false).map(m => m.Id);
                    }
                }
            } else if (_TabData.FeatureType == "PrivateLayer") {
                if (this.MapServiceService._PrivateTreeUI.getValue()) {
                    let treeModel = this.MapServiceService._PrivateTreeUI.getValue().treeModel.getNodeById(tabdata.parentID);
                    if (treeModel) {
                        let nodeData = treeModel.data.children;
                        allCheckedLayer = nodeData.filter(m => m.IsChecked == false).map(m => m.Id);
                    }
                }
            } else if (_TabData.FeatureType == "SharedLayer") {
                if (this.MapServiceService._SharedTreeUI.getValue()) {
                    let treeModel = this.MapServiceService._SharedTreeUI.getValue().treeModel.getNodeById(tabdata.parentID);
                    if (treeModel) {
                        let nodeData = treeModel.data.children;
                        allCheckedLayer = nodeData.filter(m => m.IsChecked == false).map(m => m.Id);
                    }
                }
            }
            if (allCheckedLayer != null && allCheckedLayer.length > 0) {
                for (let layer of _TabData.energyLayer) {
                    if (allCheckedLayer.indexOf(layer.EnergyLayerID) != -1) {
                        if (_TabData.EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer == true && !layer.serversidefilterval) {
                            if (_TabData.EnergylayersavegridFilter.mapfilterval.indexOf(";") != -1)
                                layer.serversidefilterval = _TabData.EnergylayersavegridFilter.mapfilterval.split(";");
                            else
                                layer.serversidefilterval = [_TabData.EnergylayersavegridFilter.mapfilterval];
                        }
                        sldBody += this.CreateSldBody(layer);
                        let currentCqlfilter = this.GetCQLFilter(layer);
                        if (currentCqlfilter == '')
                            currentCqlfilter = 'INCLUDE'
                        if (cqlFilter != '')
                            cqlFilter += ';'
                        cqlFilter += currentCqlfilter;
                    }
                }
            }

        }
        sldBody += '</StyledLayerDescriptor>';
        let data = {
            sldBody: sldBody,
            cqlFilter: cqlFilter
        }
        return data;
    }

    CreateSldBody(layer) {
        let IconType = layer["IconType"];
        if (IconType == 'Square') {
            IconType = "Circle";
        }
        let shape = layer["RepresentationType"]
        if (shape == null) {
            IconType = this.UtilityService.getIconType(IconType);
            if (IconType == 'Circle') {
                shape = "Point";
            }
            else if (IconType == 'Line') {
                shape = "Line";
            }
            else if (IconType == 'Rectangle') { shape = "Area"; }
            else if (IconType == 'RoundedRectangle') { shape = "Area"; }
            else {
                shape = IconType;
            }
        }
        let StrokeColor = layer["StrokeColor"].replace('#', '');
        let FillColor = layer["FillColor"].replace('#', '');
        let SizePercent = layer["SizePercent"];
        let StrokeThicknessPercent = layer["StrokeThicknessPercent"];
        let Stockwidth = parseInt(layer["StrokeThicknessPercent"]) / 10;
        let opacity = parseFloat(layer["Opacity"].toFixed(2));
        let NewStrokeColor = this.UtilityService.GetHexColorValue(layer["StrokeColor"]);
        let ExternalIconId = layer["ExternalIconId"];
        let NewfillColor = this.UtilityService.GetHexColorValue(layer["FillColor"]);
        let size = Math.round(parseInt(layer["SizePercent"]) * 25 / 100);
        let TableName = layer["TableName"];
        let LabelName = '';
        if (layer["IsLabelVisible"] == 1)
            LabelName = layer["LabelField"];
        if (layer.EnergyLayerStylesByUserModel && layer.EnergyLayerStylesByUserModel.length > 0) {
            let EnergyLayerStylesByUserModel = layer.EnergyLayerStylesByUserModel[0];
            if (EnergyLayerStylesByUserModel["IconType"])
                IconType = EnergyLayerStylesByUserModel["IconType"];
            if (EnergyLayerStylesByUserModel["StrokeColor"])
                StrokeColor = EnergyLayerStylesByUserModel["StrokeColor"].replace('#', '');
            if (EnergyLayerStylesByUserModel["FillColor"])
                FillColor = EnergyLayerStylesByUserModel["FillColor"].replace('#', '');
            if (EnergyLayerStylesByUserModel["StrokeThicknessPercent"])
                Stockwidth = parseInt(EnergyLayerStylesByUserModel["StrokeThicknessPercent"]) / 10;
            if (EnergyLayerStylesByUserModel["Opacity"] != null && EnergyLayerStylesByUserModel["Opacity"] != undefined)
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
        let fillOpacity = opacity;
        if ((layer["LayerType"] === 'ParcelData' || (layer['TableName'] && layer['TableName'].indexOf('Parcels_') >= 0)) && layer["RepresentationType"] == 'Area' && opacity == 1) {
            fillOpacity = 0;
        }
        let sld_body = '<NamedLayer>'
            + '<Name>' + TableName + '</Name>'
            + '<UserStyle>'
            + '<FeatureTypeStyle>'
            + '<Rule>'
        if (shape == "Point") {
            sld_body += '<PointSymbolizer>'
                + '<Graphic>'
                + '<ExternalGraphic>'
            if (!ExternalIconId) {
                let PointIconURL = environment.GetLayerIconURL + "/icongenerate/get/?Id=" + layer["EnergyLayerID"] + "&amp;URLType=CustomStyleIcon&amp;FillColor=" + FillColor + "&amp;IconType=" + IconType + "&amp;StrokeColor=" + StrokeColor + "&amp;SizePercent=" + SizePercent + "&amp;StrokeThicknessPercent=" + StrokeThicknessPercent + "&amp;Opacity=" + opacity;
                // let PointIconURL = environment.GetLayerIconURL + "/icongenerate/get/?Id=" + layer["EnergyLayerID"] + "&URLType=CustomStyleIcon&FillColor=" + FillColor + "&IconType=" + IconType + "&StrokeColor=" + StrokeColor + "&SizePercent=" + SizePercent + "&StrokeThicknessPercent=" + StrokeThicknessPercent + "&Opacity=" + opacity;
                sld_body += '<OnlineResource type="simple" href="' + PointIconURL + '" />';
            }
            else {
                var Exid = document.getElementById(layer.EnergyLayerID + 'TreeCostomelayerIconImage');
                let ExternalIconurl = Exid['src'];
                sld_body += '<OnlineResource type="simple" href="' + ExternalIconurl + '"/>';
                sld_body += '<Stroke>'
                    + '<CssParameter name="stroke-opacity">' + opacity + '</CssParameter>'
                    + '</Stroke>';
            }
            sld_body += '<Format>image/png</Format>'
                + '</ExternalGraphic>'
                + '<Size>' + size + '</Size>'
                + '</Graphic>'
                + '</PointSymbolizer>'
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
                    + '</LineSymbolizer>'
            } else if (IconType == "DashLine") {
                sld_body += ' <LineSymbolizer>'
                    + '<Stroke>'
                    + '<CssParameter name="stroke">#' + NewStrokeColor + '</CssParameter>'
                    + '<CssParameter name="stroke-width">' + Stockwidth + '</CssParameter>'
                    + '<CssParameter name="stroke-dasharray">' + opacity + '</CssParameter>'
                    + '</Stroke>'
                    + '</LineSymbolizer>'
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
        sld_body += '</Rule>'
        sld_body += '</FeatureTypeStyle>'
        if (LabelName) {
            sld_body += this.UtilityService.GetXMLLabelstyle(LabelName, shape);
        }
        sld_body += '</UserStyle>'
        sld_body += '</NamedLayer>'
        return sld_body;
    }

    GetCQLFilter(layer) {
        let CQL_FILTER = "";
        let filterval = layer["FilterValue"];
        let isfilterval = false;
        let filter = '';
        let shape = layer["RepresentationType"];
        let IconType = layer["IconType"];
        if (shape == null) {
            IconType = this.UtilityService.getIconType(IconType);
            if (IconType == 'Circle') {
                layer["RepresentationType"] = "Point";
            }
            else if (IconType == 'Line') {
                layer["RepresentationType"] = "Line";
            }
            else if (IconType == 'Rectangle') { layer["RepresentationType"] = "Area"; }
            else if (IconType == 'RoundedRectangle') { layer["RepresentationType"] = "Area"; }
            else {
                layer["RepresentationType"] = IconType;
            }
        }
        if (layer["RepresentationType"] == "Line" || layer["RepresentationType"] == "Area" || layer["RepresentationType"] == "Shape" || layer["RepresentationType"] == "Circle" || layer["RepresentationType"] == "Point") {
            if (layer.FilterValue && layer.FilterValue.indexOf('Note#EQUAL#') > -1) {
                return '';
            }
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
    }

    GetHexColorValue(hexCode) {
        let color = "";
        let len = parseInt(hexCode.length);
        if (len == 8) {
            color = hexCode.substr(2);
        }
        else if (len == 9) {
            color = hexCode.substr(3);
        }
        return color;
    }
    GetHexValueWithAlpha(color) {
        color = color.replace('#', '');
        if (color.length == 8) {
            color = color.substring(2);
        }
        return color;
    }
    GetOgcFilterChildren(FilterValueData) {
        let sld_filter = "";
        if (FilterValueData != null && FilterValueData != "") {
            if (FilterValueData.indexOf(";") !== -1) {
                let Filter = FilterValueData.split(';');
                sld_filter += this.FilterValueChildLoop(Filter);
            }
            if (FilterValueData.indexOf("#OR#") !== -1) {
                let Filter = FilterValueData.split('#OR#');
                sld_filter += this.FilterValueChildLoop(Filter);
            }
            if (sld_filter == "") {
                sld_filter += '<Filter xmlns="http://www.opengis.net/ogc">'
                sld_filter += this.SingleFilterLoop(FilterValueData);
                sld_filter += '</Filter>'
            }
        }
        return sld_filter;
    }
    FilterValueChildLoop(Filter) {
        let sld_filter = '<Filter xmlns="http://www.opengis.net/ogc">'
        for (let i = 0; i < Filter.length; i++) {
            if (Filter[i].indexOf("=") !== -1 && Filter[i].indexOf("<") == -1 && Filter[i].indexOf(">") == -1) {
                let FilterValue = Filter[i].split('=');
                let PropertyName = FilterValue[0];
                let Literal = FilterValue[1];
                sld_filter += '<PropertyIsEqualTo matchCase="false">'
                    + '<PropertyName>' + PropertyName + '</PropertyName>'
                    + '<Literal>' + Literal + '</Literal>'
                    + '</PropertyIsEqualTo>';
            }

            if (Filter[i].indexOf(">") !== -1 && Filter[i].indexOf("=") == -1) {
                let FilterValue = Filter[i].split('>');
                let PropertyName = FilterValue[0];
                let Literal = FilterValue[1];
                sld_filter += '<PropertyIsGreaterThan matchCase="false">'
                    + '<PropertyName>' + PropertyName + '</PropertyName>'
                    + '<Literal>' + Literal + '</Literal>'
                    + '</PropertyIsGreaterThan>';
            }

            if (Filter[i].indexOf("<") !== -1 && Filter[i].indexOf("=") == -1) {
                let FilterValue = Filter[i].split('<');
                let PropertyName = FilterValue[0];
                let Literal = FilterValue[1];
                sld_filter += '<PropertyIsLessThan matchCase="false">'
                    + '<PropertyName>' + PropertyName + '</PropertyName>'
                    + '<Literal>' + Literal + '</Literal>'
                    + '</PropertyIsLessThan>';
            }

            if (Filter[i].indexOf("<=") !== -1) {
                let FilterValue = Filter[i].split('<=');
                let PropertyName = FilterValue[0];
                let Literal = FilterValue[1];
                sld_filter += '<PropertyIsLessThanOrEqualTo matchCase="false">'
                    + '<PropertyName>' + PropertyName + '</PropertyName>'
                    + '<Literal>' + Literal + '</Literal>'
                    + '</PropertyIsLessThanOrEqualTo>';
            }

            if (Filter[i].indexOf("#EQUAL#") !== -1) {
                let FilterValue = Filter[i].split('#EQUAL#');
                let PropertyName = FilterValue[0];
                let Literal = FilterValue[1];
                sld_filter += '<PropertyIsEqualTo matchCase="false">'
                    + '<PropertyName>' + PropertyName + '</PropertyName>'
                    + '<Literal>' + Literal + '</Literal>'
                    + '</PropertyIsEqualTo>';
            }
            if (Filter[i].indexOf("#LIKE#") !== -1) {
                let FilterValue = Filter[i].split('#LIKE#');
                let PropertyName = FilterValue[0];
                let Literal = FilterValue[1];
                sld_filter += '<PropertyIsLike matchCase="false" wildCard="*" singleChar="." escape="!">'
                    + '<PropertyName>' + PropertyName + '</PropertyName>'
                    + '<Literal>*' + Literal + '*</Literal>'
                    + '</PropertyIsLike>';
            }
        }
        sld_filter += '</Filter>'
        return sld_filter;
    }

    SingleFilterLoop(Filter) {
        let sld_filter = "";
        if (Filter.indexOf("#EQUAL#") !== -1) {
            let FilterValue = Filter.split('#EQUAL#');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            sld_filter += '<PropertyIsEqualTo matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsEqualTo>';
        }
        if (Filter.indexOf("=") !== -1 && Filter.indexOf("<") == -1 && Filter.indexOf(">") == -1 && Filter.indexOf("#EQUAL#") == -1) {
            let FilterValue = Filter.split('=');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            sld_filter += '<PropertyIsEqualTo matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsEqualTo>';
        }

        if (Filter.indexOf(">") !== -1 && Filter.indexOf("=") == -1 && Filter.indexOf("#EQUAL#") == -1) {
            let FilterValue = Filter.split('>');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            sld_filter += '<PropertyIsGreaterThan matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsGreaterThan>';
        }

        if (Filter.indexOf("<") !== -1 && Filter.indexOf("=") == -1 && Filter.indexOf("#EQUAL#") == -1) {
            let FilterValue = Filter.split('<');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            sld_filter += '<PropertyIsLessThan matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsLessThan>';
        }

        if (Filter.indexOf("<=") !== -1 && Filter.indexOf("#EQUAL#") == -1) {
            let FilterValue = Filter.split('<=');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            sld_filter += '<PropertyIsLessThanOrEqualTo matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsLessThanOrEqualTo>';
        }


        if (Filter.indexOf("#LIKE#") !== -1) {
            let FilterValue = Filter.split('#LIKE#');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            sld_filter += '<PropertyIsLike matchCase="false" wildCard="*" singleChar="." escape="!">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>*' + Literal + '*</Literal>'
                + '</PropertyIsLike>';
        }
        if (Filter.indexOf("#NotEqualTo#") !== -1) {
            let FilterValue = Filter.split('#NotEqualTo#');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            sld_filter += '<PropertyIsNotEqualTo matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsNotEqualTo>';
        }
        return sld_filter;
    }

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

    DeleteTempImgData(id: string) {
        this.httpRequest._NodeDeleteGeoImageProp(id).subscribe(x => { })
    }

    ClearAllRecentData() {
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
}

export class FilterGroup {
    cqlFilter: string;
    sldBody: string;
    id: string;
    groupLayerId?: string;
}