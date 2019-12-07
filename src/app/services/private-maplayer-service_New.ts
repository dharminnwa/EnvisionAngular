import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MapServiceService } from './map-service.service';
import { UtilityService } from './Utility.service';
import { MapLayerInfoService } from './map-layer-info.service';
import { ApiService } from './api.service';
import { HttpRequestService } from './all-http-request.service';
import { FilterGroup } from './MapLayer-new-service';
import { AuthenticationService } from './auth.service';

declare var jquery: any;
declare var $: any;
declare var google: any;
@Injectable()
export class PrivateMapLayerService_new {
    constructor(private MapServiceService: MapServiceService,
        private mapLayerInfoService: MapLayerInfoService,
        private UtilityService: UtilityService,
        private _api: ApiService,
        private httpRequest: HttpRequestService,
        private authService:AuthenticationService
    ) { }
    public _mapdata: any = this.MapServiceService._mapdata;
    ImageURLPath: string = environment.ImagespreviewPath;
    recentFilters: FilterGroup = {
        cqlFilter: '',
        sldBody: '',
        id: ''
    };
    groupRecentFilters: FilterGroup[] = [];
    SetPrivateNew_WMSlayerD(tabdata, geoMapPropID) {
        let wmsOptions = {
            alt: "TempLayer",
            getTileUrl: (tile, zoom) => {
                return this.WMStileUrlD(geoMapPropID, tile, zoom);
            },
            isPng: true,
            maxZoom: 21,
            minZoom: 1,
            name: "TempLayer",
            tileSize: new google.maps.Size(256, 256)
        };
        let openlayersWMS = new google.maps.ImageMapType(wmsOptions);
        return openlayersWMS;
    }
    LoadGroupMapLayers_Private() {
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
                            gmaps.overlayMapTypes.setAt(groupLayer.Layerindexval, this.SetPrivateNew_WMSlayerD(tabdata, res.GeoMapPropID));
                        }, error => {
                            console.error(error);
                        });
                    }
                }

            }, 300);

        }
    }
    removeGroupmapLayer(index) {
        let gmaps = this._mapdata.getValue();
        gmaps.overlayMapTypes.setAt(index, null);
    }
    CreateSldBodyAndCqlFilterForGroupLayer(tabdata) {
        let sldBody = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld">';
        let cqlFilter = '';
        let _TabData = tabdata;
        if (_TabData.treestatus == 'GroupLayer') {
            if (_TabData.FeatureType == "CreateLayer") {
                if (this.MapServiceService._TemporaryTreeUI.getValue()) {
                    let nodeData = this.MapServiceService._TemporaryTreeUI.getValue().treeModel.getNodeById(tabdata.parentID).data.children;
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
            } else {
                if (this.MapServiceService._TreeUI.getValue()) {
                    let nodeData = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(tabdata.parentID).data.children;
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


    WMStileUrlD(geoMapPropID, tile, zoom) {
        let gmas = this._mapdata.getValue()
        let projection = gmas.getProjection();
        let zpow = Math.pow(2, zoom);
        let ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
        let lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
        let ulw = projection.fromPointToLatLng(ul);
        let lrw = projection.fromPointToLatLng(lr);
        let bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
        const endpoint = this._api._NodeGeoserverGetGeoMapNew;
        let uRLParameter = '?BBOX=' + bbox + '&GeoMapPropID=' + geoMapPropID;
        const getGeoMapNewURL = endpoint + uRLParameter;
        return getGeoMapNewURL;
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
        let fillOpacity = opacity;
        if ((layer["LayerType"] === 'ParcelData' || layer['TableName'].indexOf('Parcels_') >= 0) && layer["RepresentationType"] == 'Area' && opacity == 1) {
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
        CQL_FILTER = decodeURIComponent(CQL_FILTER);
        return CQL_FILTER;
    }
}

