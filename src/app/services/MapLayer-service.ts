import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { environment } from '../../environments/environment';
import { MapServiceService } from '../services/map-service.service';
import { Subject, Observable } from 'rxjs';
import { AuthenticationService } from '../services/auth.service';
import { ApiService } from './api.service';
import { UtilityService } from './Utility.service';
import { MapLayerInfoService } from './map-layer-info.service'
import { HttpRequestService } from './all-http-request.service';
declare var jquery: any;
declare var $: any;
declare var google: any;
declare var L: any;
@Injectable()

export class MapLayerService {
    constructor(
        private mapServices: MapServiceService,
        private _api: ApiService,
        private UtilityService: UtilityService,
        private httpService: HttpRequestService,
        private authService: AuthenticationService) { }

    public _mapdata: any = this.mapServices._mapdata;
    SetWMSlayerD(layer, geoMapPropID) {
        let wmsOptions = {
            alt: layer["TableName"],
            getTileUrl: (tile, zoom) => {
                // return this.WMStileUrlD(layer, "abc", tile, zoom)
                return this.NodeWMStileUrlD(layer, "abc", tile, zoom, geoMapPropID)
            },
            isPng: true,
            maxZoom: 21,
            minZoom: 4,
            name: layer["TableName"],
            tileSize: new google.maps.Size(256, 256)
        };
        let openlayersWMS = new google.maps.ImageMapType(wmsOptions);
        return openlayersWMS;
    }


    NodeWMStileUrlD(layer, style, tile, zoom, geoMapPropID) {
        var url = this._api._NodeGeoserverGetGeoMapNew;
        var gmas = this._mapdata.getValue();
        var bbox = this.UtilityService.getBbox(zoom, tile, gmas);
        layer = this.UtilityService.CheckIcontype(layer);
        if (layer.TableName && layer.DetailPanelProperties.toString().indexOf('BaseUri==') == -1 && layer.DetailPanelPropertiesMain.toString().indexOf('BaseUri==') == -1) {
            url += '?BBOX=' + bbox + '&GeoMapPropID=' + geoMapPropID;
            // if (!CQL_FILTER) {
            //     CQL_FILTER = "&CQL_FILTER=";
            // }
            // url += "Body=" + theSLD_BODY + "&bbox=" + bbox + CQL_FILTER;
            if (layer['ZoomMin'] && layer['ZoomMax']) {
                let zoomlevel = gmas.getZoom();
                if ((zoomlevel >= layer['ZoomMin']) && (zoomlevel <= layer['ZoomMax'])) {
                    return url;
                } else {
                    return null;
                }
            }
            else {
                return url;
            }
        }
        else if (!layer.TableName && layer.DetailPanelProperties.toString().indexOf('BaseUri==') != -1 && layer.DetailPanelPropertiesMain.toString().indexOf('BaseUri==') != -1) {
            // let BaseUri = "https://hazards.fema.gov/gis/nfhl/services/public/NFHLWMS/MapServer/WMSServer?SERVICE=WMS&REQUEST=GetMap&BBOX=-10684062.0641016,4314717.37204102,-10681616.0791968,4317163.3569458&Width=256&Height=256&LAYERS=4&Format=image/png&TRANSPARENT=TRUE&STYLES=&TILED=true&VERSION=1.1.1&SRS=EPSG:3857";
            // let staticParm = "?Service=WMS&Request=GetMap&BBox={0}&Width={1}&Height={2}&Layers={3}&Format=image/png";
            // var projdefs = { "4326": L.CRS.EPSG4326, "3857": L.CRS.EPSG3857 };
            // let SplitedtheDetail = layer.DetailPanelPropertiesMain.split(';');
            // let ExternalURL = "";
            // let Parameter = "";
            // let Layers = "";
            // for (let index of SplitedtheDetail) {
            //     if (index.indexOf('BaseUri==') >= 0) {
            //         let splitebaseUri = index.replace("BaseUri==", " ");
            //         ExternalURL = splitebaseUri;
            //     }
            //     else if (index.indexOf('Parameters==') >= 0) {
            //         Parameter = index.replace("Parameters==", " ");
            //     }
            //     else if (index.indexOf('Layers==') >= 0) {
            //         Layers = index.replace("Layers==", " ");
            //     }
            // }
            // if (Parameter) {
            //     if (Parameter.indexOf("3857") >= 0) {
            //         bbox = this.UtilityService.getExternalURLBbox(zoom, tile, gmas, projdefs["3857"]);
            //     } else if (Parameter.indexOf("4326") >= 0) {
            //         bbox = this.UtilityService.getExternalURLBbox(zoom, tile, gmas, projdefs["4326"]);
            //     }
            // } else {
            //     bbox = this.UtilityService.getExternalURLBbox(zoom, tile, gmas, projdefs["4326"]);
            // }
            // url = ExternalURL + "?Service=WMS&Request=GetMap&BBox=" + bbox + "&Width=256&Height=256&Layers=" + Layers.trim() + "&Format=image/png";
            // if (url) {
            //     url += "&" + Parameter.trim();
            // }
            // if (layer['ZoomMin'] && layer['ZoomMax']) {
            //     let zoomlevel = gmas.getZoom();
            //     if ((zoomlevel >= layer['ZoomMin']) && (zoomlevel <= layer['ZoomMax'])) {
            //         return url.trim();
            //     } else {
            //         return null;
            //     }
            // }
            // else {
            //     return url.trim();
            // }
            let opacity = 1;
            if (layer.Opacity)
                opacity = parseFloat(layer["Opacity"].toFixed(2));
            if (layer.EnergyLayerStylesByUserModel && layer.EnergyLayerStylesByUserModel.length > 0) {
                let EnergyLayerStylesByUserModel = layer.EnergyLayerStylesByUserModel[0];
                if (EnergyLayerStylesByUserModel["Opacity"])
                    opacity = parseFloat(EnergyLayerStylesByUserModel["Opacity"].toFixed(2));
            }
            let BaseUri = "https://hazards.fema.gov/gis/nfhl/services/public/NFHLWMS/MapServer/WMSServer?SERVICE=WMS&REQUEST=GetMap&BBOX=-10684062.0641016,4314717.37204102,-10681616.0791968,4317163.3569458&Width=256&Height=256&LAYERS=4&Format=image/png&TRANSPARENT=TRUE&STYLES=&TILED=true&VERSION=1.1.1&SRS=EPSG:3857";
            let staticParm = "?Service=WMS&Request=GetMap&BBox={0}&Width={1}&Height={2}&Layers={3}&Format=image/png";
            var projdefs = { "4326": L.CRS.EPSG4326, "3857": L.CRS.EPSG3857 };
            let SplitedtheDetail = layer.DetailPanelPropertiesMain.split(';');
            let ExternalURL = "";
            let Parameter = "";
            let Layers = "";
            for (let index of SplitedtheDetail) {
                if (index.indexOf('BaseUri==') >= 0) {
                    let splitebaseUri = index.replace("BaseUri==", " ");
                    ExternalURL = splitebaseUri;
                }
                else if (index.indexOf('Parameters==') >= 0) {
                    Parameter = index.replace("Parameters==", " ");
                }
                else if (index.indexOf('Layers==') >= 0) {
                    Layers = index.replace("Layers==", " ");
                }
            }
            if (Parameter) {
                if (Parameter.indexOf("3857") >= 0) {
                    bbox = this.UtilityService.getExternalURLBbox(zoom, tile, gmas, projdefs["3857"]);
                } else if (Parameter.indexOf("4326") >= 0) {
                    bbox = this.UtilityService.getExternalURLBbox(zoom, tile, gmas, projdefs["4326"]);
                }
            } else {
                bbox = this.UtilityService.getExternalURLBbox(zoom, tile, gmas, projdefs["4326"]);
            }
            const endpoint = this._api._NodeGeoserverGetHazardImage;
            let uRLParameter = '?BBOX=' + bbox + '&opacityvalue=' + opacity;
            const getURLHazardImage = endpoint + uRLParameter;
            return getURLHazardImage;
        }
    }

    GetCQLFilter(layer) {
        let CQL_FILTER = "";
        let filterval = layer["FilterValue"];
        let isfilterval = false;
        let filter = '';
        if (layer["RepresentationType"] == "Line" || layer["RepresentationType"] == "Area" || layer["RepresentationType"] == "Shape" || layer["RepresentationType"] == "Circle" || layer["RepresentationType"] == "Point") {
            // let serversidefilter = layer["serversidefilterval"];
            // if ((serversidefilter==undefined && filterval.indexOf('CQL_FILTER') == -1)  || (serversidefilter.indexOf('CQL_FILTER') == -1 && filterval.indexOf('CQL_FILTER') == -1)) {

            //     if (layer["serversidefilterval"]) {
            //         filter = this.mapServices.gridfilter(layer["serversidefilterval"]);
            //         // if (default_filter != '') {
            //         //     default_filter = '(' + Gridfilter + ') and ' + default_filter;
            //         // }
            //         // filter = this.mapServices.CreateCQL_Filter(, 'or');
            //     }
            //     if (filter != '' && filterval) {
            //         filter += ' and (' + this.mapServices.CreateCQL_Filter(filterval, ' and ') + ')';
            //     }
            //     else if (filterval && filter == '') {
            //         filter = this.mapServices.CreateCQL_Filter(filterval, ' and ');
            //     }
            //     if (filter != '') {
            //         CQL_FILTER = '&CQL_FILTER=(' + filter + ')';
            //     }
            // }
            // else if (!serversidefilter && filterval.indexOf('CQL_FILTER') >= 0) {
            //     CQL_FILTER = filterval;
            // }
            // else if (serversidefilter && filterval.indexOf('CQL_FILTER') >= 0) {
            //     let serverfilter = '';
            //     if (layer["serversidefilterval"]) {
            //         serverfilter = this.mapServices.gridfilter(layer["serversidefilterval"]);
            //     }
            //     if(!serverfilter){
            //         filterval=filterval.replace('&CQL_FILTER=','');
            //         CQL_FILTER="&CQL_FILTER=(" 
            //     }
            // }

            // -------------------------- old logic -------------------------- //
            if (layer["serversidefilterval"]) {
                filter = this.mapServices.gridfilter(layer["serversidefilterval"]);
            }
            if (filter != '' && filterval) {
                filter += ' and (' + this.mapServices.CreateCQL_Filter(filterval, ' and ') + ')';
            }
            else if (filterval && filter == '') {
                filter = this.mapServices.CreateCQL_Filter(filterval, ' and ');
            }
            // if (filter != '') {
            //     CQL_FILTER = '&CQL_FILTER=(' + filter + ')';
            // }
        }
        CQL_FILTER = decodeURIComponent(filter);
        return CQL_FILTER;
    }
    // WMStileUrlD(layer, style, tile, zoom) {
    //     let url = environment.newTileLayerURL
    //     //let url = "http://ec2-54-225-240-244.compute-1.amazonaws.com:8080/envision/BaseMaps/wms?";                
    //     let gmas = this._mapdata.getValue();
    //     let bbox = this.UtilityService.getBbox(zoom, tile, gmas);
    //     let version = "1.3.0";
    //     let request = "GetMap";
    //     let format = "image%2Fpng";
    //     let layers = "BaseMaps%3A" + layer["TableName"];
    //     let srs = "EPSG:4326";
    //     let IconType = layer["IconType"];
    //     let service = "WMS";
    //     let width = "256";
    //     let height = "256";
    //     let transparent = "true";
    //     layer = this.UtilityService.CheckIcontype(layer);
    //     let theSLD_BODY = this.CreateSldBody(layer["RepresentationType"], style, "5", "1", layer, "BaseMaps:" + layer, "abstract");
    //     let CQL_FILTER = this.GetCQLFilter(layer);
    //     if (style == "")
    //         url += "Layers=" + layers;
    //     else
    //         url += "SLD_BODY=" + theSLD_BODY;
    //     url += "&version=" + version + "&TILED=true&EXCEPTIONS=INIMAGE&Service=" + service + "&request=" + request + "&format=" + format + "&CRS=" + srs + "&BBOX=" + bbox + "&width=" + width + "&height=" + height + "&isBaseLayer=True&TRANSPARENT=" + transparent;
    //     if (CQL_FILTER) {
    //         url += CQL_FILTER;
    //     }
    //     if (layer['ZoomMin'] && layer['ZoomMax']) {
    //         let zoomlevel = gmas.getZoom();
    //         if ((zoomlevel >= layer['ZoomMin']) && (zoomlevel <= layer['ZoomMax'])) {
    //             return url;
    //         } else {
    //             return null;
    //         }
    //     }
    //     else {
    //         return url;
    //     }
    // }

    CreateSldBody(shape, stroke, strokeWidth, strokeCapcity, layer, title, abstarct) {
        let IconType = layer["IconType"];
        if (IconType == 'Square') {
            IconType = "Circle";
        }
        if (shape == null) {
            IconType = this.UtilityService.getIconType(IconType);

            if (IconType == 'Circle') {
                shape = "Point";
            }
            else if (IconType == 'Point') {
                shape = "Point";
                IconType = 'Circle';
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
        //size = parseInt(layer["SizePercent"]);
        let TableName = layer["TableName"];
        let LabelName = '';
        if (layer["IsLabelVisible"] == 1)
            LabelName = layer["LabelField"];
        if (layer.EnergyLayerStylesByUserModel && layer.EnergyLayerStylesByUserModel.length > 0) {
            let EnergyLayerStylesByUserModel = layer.EnergyLayerStylesByUserModel[0];
            if (EnergyLayerStylesByUserModel["IconType"])
                IconType = EnergyLayerStylesByUserModel["IconType"];
            // IconType = this.mapServices.getIconType(IconType);
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
            //size =parseInt(EnergyLayerStylesByUserModel["SizePercent"]);
        }
        let fillOpacity = opacity;
        if ((layer["LayerType"] === 'ParcelData' || layer['TableName'].indexOf('Parcels_') >= 0) && layer["RepresentationType"] == 'Area' && opacity == 1) {
            // opacity = 0.30;
            fillOpacity = 0;
        }
        let sld_body = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld">'
            + '<NamedLayer>'
            + '<Name>' + TableName + '</Name>'
            + '<UserStyle>'
            + '<FeatureTypeStyle>'
            + '<Rule>'
        if (shape == "Point") {
            sld_body += '<PointSymbolizer>'
                + '<Graphic>'
                + '<ExternalGraphic>'
            if (!ExternalIconId) {
                //sld_body += '<OnlineResource type="simple" href="http://energymapit.com/en/Handlers/IconImage.ashx?Id=' + layer["EnergyLayerID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + layer["SizePercent"] + '&amp;StrokeThicknessPercent=' + layer["StrokeThicknessPercent"] + '&amp;Opacity=' + opacity + '" />';
                // sld_body += '<OnlineResource type="simple" href="http://env3.beta.mapsearch360.com/api/Test?Id=' + layer["EnergyLayerID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + layer["SizePercent"] + '&amp;StrokeThicknessPercent=' + layer["StrokeThicknessPercent"] + '&amp;Opacity=' + opacity + '" />';
                //sld_body += '<OnlineResource type="simple" href="http://env3.beta.mapsearch360.com/api/Test?Id=' + layer["EnergyLayerID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + layer["SizePercent"] + '&amp;StrokeThicknessPercent=' + layer["StrokeThicknessPercent"] + '&amp;Opacity=' + opacity + '" />';                
                //sld_body += '<OnlineResource type="simple" href="http://energymapit.com/en/Handlers/IconImage.ashx?Id=' + layer["EnergyLayerID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + layer["SizePercent"] + '&amp;StrokeThicknessPercent=' + layer["StrokeThicknessPercent"] + '&amp;Opacity=' + opacity + '" />';
                //sld_body += '<OnlineResource type="simple" href="http://env3.beta.mapsearch360.com/api/Test?Id=' + layer["EnergyLayerID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + SizePercent + '&amp;StrokeThicknessPercent=' + StrokeThicknessPercent + '&amp;Opacity=' + opacity + '" />';                
                // sld_body += '<OnlineResource type="simple" href="https://api.envisionmaps.com:8080/api/icongenerate/get/?Id=' + layer["EnergyLayerID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + SizePercent + '&amp;StrokeThicknessPercent=' + StrokeThicknessPercent + '&amp;Opacity=' + opacity + '" />';
                let PointIconURL = environment.GetLayerIconURL + "/icongenerate/get/?Id=" + layer["EnergyLayerID"] + "&amp;URLType=CustomStyleIcon&amp;FillColor=" + FillColor + "&amp;IconType=" + IconType + "&amp;StrokeColor=" + StrokeColor + "&amp;SizePercent=" + SizePercent + "&amp;StrokeThicknessPercent=" + StrokeThicknessPercent + "&amp;Opacity=" + opacity;
                // let PointIconURL = environment.GetLayerIconURL + "/icongenerate/get?Id=" + layer["EnergyLayerID"] + "&URLType=CustomStyleIcon&FillColor=" + FillColor + "&IconType=" + IconType + "&StrokeColor=" + StrokeColor + "&SizePercent=" + SizePercent + "&StrokeThicknessPercent=" + StrokeThicknessPercent + "&Opacity=" + opacity;
                sld_body += '<OnlineResource type="simple" href="' + PointIconURL + '" />';
            }
            else {
                // let ExternalIconurl = this.UtilityService.GetDefaultExternalIcon(ExternalIconId);
                // let PreviewImageURL = environment.ImagespreviewPath;
                // let ImagePath = PreviewImageURL + "01)AngularEnvision%20Images";
                // if (ExternalIconurl.indexOf(ImagePath) >= 0) {
                //     sld_body += '<OnlineResource type="simple" href="' + ExternalIconurl + '"/>';
                // }
                // else {
                //     let externaliconlist = this.mapServices.ExternalIconList.value;
                //     if (externaliconlist) {
                //         for (let exicon of externaliconlist) {
                //             if (exicon.Id == ExternalIconId) {
                //                 ExternalIconurl = this.UtilityService.GetDefaultExternalIcon(exicon.Id);
                //                 if (ExternalIconurl == "") {
                //                     ExternalIconurl = PreviewImageURL + "EnvisionAngularUsersIcon/" + exicon.UploadedBy + "/" + exicon.Id + exicon.Extension;
                //                 }
                //                 else {
                //                     ExternalIconurl = PreviewImageURL + "01)AngularEnvision%20Images/ExternalIconId/95.png";
                //                 }
                //             }
                //         }
                //     }
                //     //sld_body += '<OnlineResource type="simple" href="' + ExternalIconurl + '"/>';
                // }
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
            //NewStrokeColor = this.GetHexValueWithAlpha(NewfillColor);
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
            // NewStrokeColor = getAlphaValue(NewStrokeColor);
            // NewfillColor = getAlphaValue(NewfillColor);
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
        sld_body += '</StyledLayerDescriptor>';
        return sld_body;
        // return encodeURIComponent(sld_body);
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
    removemapLayer(layer) {
        let maps = this._mapdata.getValue();
        maps.overlayMapTypes.setAt(layer.Layerindexval, null);

    }

    loadmapLayers(layer) {
        if (!layer.TableName && layer.DetailPanelProperties.toString().indexOf('BaseUri==') != -1 && layer.DetailPanelPropertiesMain.toString().indexOf('BaseUri==') != -1) {
            let gmaps = this._mapdata.getValue();
            gmaps.overlayMapTypes.setAt(layer.Layerindexval, this.SetWMSlayerD(layer, 0));
        } else {
            if (layer.Layerindexval != undefined) {
                var SLD_BODY = this.CreateSldBody(layer["RepresentationType"], "abc", "5", "1", layer, "BaseMaps:" + layer, "abstract");
                var CQL_FILTER = this.GetCQLFilter(layer);
                let userId = this.authService.getLoggedinUserId();
                this.httpService._NodeGeoserverSetImageLayerData(SLD_BODY, CQL_FILTER, userId).subscribe(res => {
                    let gmaps = this._mapdata.getValue();
                    gmaps.overlayMapTypes.setAt(layer.Layerindexval, this.SetWMSlayerD(layer, res.GeoMapPropID));
                });
            }
        }
    }


    CreateFilter(FilterValueData) {
        let sld_filter = "";
        if (FilterValueData != null && FilterValueData != "") {
            if (FilterValueData.indexOf(";") !== -1) {
                let Filter = FilterValueData.split(';');
                sld_filter += this.CreateFilterLoop(Filter);
            }
            if (FilterValueData.indexOf("#OR#") !== -1) {
                let Filter = FilterValueData.split('#OR#');
                sld_filter += this.CreateFilterLoop(Filter);
            }
            if (sld_filter == "") {
                sld_filter += '<Filter xmlns="http://www.opengis.net/ogc">'
                    + '<And>'
                sld_filter += this.SingleFilterLoop(FilterValueData);
                sld_filter += '</And>'
                    + '</Filter>'
            }
        }
        return encodeURIComponent(sld_filter);
    }

    CreateFilterLoop(Filter) {
        let sld_filter = '<Filter xmlns="http://www.opengis.net/ogc">'
            + '<And>'
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
        sld_filter += '</And>'
            + '</Filter>'
        return sld_filter;
    }

}
