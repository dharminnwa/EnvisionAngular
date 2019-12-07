import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MapServiceService } from './map-service.service';
import { UtilityService } from './Utility.service';
import { MapLayerInfoService } from './map-layer-info.service';
import { ApiService } from './api.service';
import { HttpRequestService } from './all-http-request.service';
import { AuthenticationService } from './auth.service';

declare var jquery: any;
declare var $: any;
declare var google: any;
@Injectable()
export class PrivateMapLayerService {
    constructor(private mapServices: MapServiceService,
        private mapLayerInfoService: MapLayerInfoService,
        private UtilityService: UtilityService,
        private _api: ApiService,
        private httpRequest: HttpRequestService,
        private authService: AuthenticationService
    ) { }
    public _mapdata: any = this.mapServices._mapdata;
    ImageURLPath: string = environment.ImagespreviewPath;
    // region LoadWmsLayer
    SetPrivateWMSlayerD(layer, geoMapPropID) {
        let wmsOptions = {
            alt: layer["TableName"],
            getTileUrl: (tile, zoom) => {
                //return this.WMStileUrlD(layer, "abc", tile, zoom)
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
        // let url = this._api._NodeGeoserverGetmap;
        // let gmas = this._mapdata.getValue();
        // let bbox = this.UtilityService.getBbox(zoom, tile, gmas);
        // layer = this.UtilityService.CheckIcontype(layer);
        // let theSLD_BODY = this.CreateSldBody(layer["RepresentationType"], style, "5", "1", layer, "BaseMaps:" + layer, "abstract");
        // let CQL_FILTER = this.GetCQLFilter(layer);
        // if (!CQL_FILTER) {
        //     CQL_FILTER = "&CQL_FILTER=";
        // }

        var url = this._api._NodeGeoserverGetGeoMapNew;
        var gmas = this._mapdata.getValue();
        var bbox = this.UtilityService.getBbox(zoom, tile, gmas);
        layer = this.UtilityService.CheckIcontype(layer);
        if (layer.TableName) {
            url += '?BBOX=' + bbox + '&GeoMapPropID=' + geoMapPropID;
            if (layer['ZoomMin'] && layer['ZoomMax']) {
                let zoomlevel = gmas.getZoom();
                if ((zoomlevel >= parseInt(layer['ZoomMin'])) && (zoomlevel <= parseInt(layer['ZoomMax']))) {
                    return url;
                } else {
                    return null;
                }
            }
            else {
                return url;
            }
        }
        // url += "Body=" + theSLD_BODY + "&bbox=" + bbox + CQL_FILTER;

    }
    GetCQLFilter(layer) {
        let CQL_FILTER = "";
        // if (layer["RepresentationType"] == "Line") {
        //     CQL_FILTER = this.CreateFilter(layer["FilterValue"]);
        // }
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
            // if (layer["serversidefilterval"]) {
            //     filter = this.mapServices.gridfilter(layer["serversidefilterval"]);

            // }
            // if (filter != '') {
            //     filter != ' and (' + this.mapServices.CreateCQL_Filter(filterval, ' and ') + ')';
            // }
            // else {
            //     filter = this.mapServices.CreateCQL_Filter(filterval, ' and ');
            // }
            // if (filter != '') {
            //     CQL_FILTER = '&CQL_FILTER=(' + filter + ')';
            // }
            //CQL_FILTER = this.CreateFilter(filterval);
            if (layer["serversidefilterval"]) {
                filter = this.mapServices.gridfilter(layer["serversidefilterval"]);
                // if (default_filter != '') {
                //     default_filter = '(' + Gridfilter + ') and ' + default_filter;
                // }
                // filter = this.mapServices.CreateCQL_Filter(, 'or');
            }
            if (layer.IsFromHomeLookup) {
                if (filterval && filter == '') {
                    filter = this.mapServices.CreateCQL_FilterForHome(filterval, ' and ');
                }
            } else {

                if (filter != '' && filterval) {
                    filter += ' and (' + this.mapServices.CreateCQL_Filter(filterval, ' and ') + ')';
                }
                else if (filterval && filter == '') {
                    filter = this.mapServices.CreateCQL_Filter(filterval, ' and ');
                }
            }





            if (filter != '') {
                // CQL_FILTER = '&CQL_FILTER=(' + filter + ')';
                CQL_FILTER = '(' + filter + ')';
            }
            // let serversidefilter = layer["serversidefilterval"];
            // if ((serversidefilter==undefined && filterval.indexOf('CQL_FILTER') == -1)  || (serversidefilter!=undefined && serversidefilter.indexOf('CQL_FILTER') == -1 && filterval.indexOf('CQL_FILTER') == -1)) {

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
        }        // let Icons = ["CheckeredCircle", "UndergroundStorage", "Area"];
        // let a = Icons.indexOf(layer["IconType"]);
        // if (a != -1) {
        //     CQL_FILTER = this.GetOgcFilterChildren(layer["FilterValue"]);
        // }
        CQL_FILTER = decodeURIComponent(CQL_FILTER);
        return CQL_FILTER;
    }
    // WMStileUrlD(layer, style, tile, zoom) {
    //     //let url = "http://ec2-54-225-240-244.compute-1.amazonaws.com:8080/envision/BaseMaps/wms?";
    //     let url = environment.newTileLayerURL;
    //     let gmas = this._mapdata.getValue()
    //     let bbox = this.UtilityService.getBbox(zoom, tile, gmas);
    //     let version = "1.3.0";
    //     let request = "GetMap";
    //     let format = "image%2Fpng";
    //     let layers = "BaseMaps%3A" + layer["TableName"];
    //     let srs = "EPSG:4326";
    //     let service = "WMS";
    //     let width = "256";
    //     let height = "256";
    //     let theSLD_BODY = this.CreateSldBody(layer["RepresentationType"], style, "5", "1", layer, "BaseMaps:" + layer, "abstract");
    //     let CQL_FILTER = this.GetCQLFilter(layer);
    //     let transparent = "true";
    //     if (style == "")
    //         url += "Layers=" + layers;
    //     else
    //         url += "SLD_BODY=" + theSLD_BODY;
    //     url += "&version=" + version + "&EXCEPTIONS=INIMAGE" + "&Service=" + service + "&request=" + request + "&format=" + format + "&CRS=" + srs + "&BBOX=" + bbox + "&width=" + width + "&height=" + height + "&isBaseLayer=True&TRANSPARENT=" + transparent;
    //     if (CQL_FILTER != "") {
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
            else if (IconType == 'Line') {
                shape = "Line";
            }
            else if (IconType == 'Rectangle') { shape = "Area"; }
            else if (IconType == 'RoundedRectangle') { shape = "Area"; }
            else {
                shape = IconType;
            }
        }
        let StrokeColor = layer["StrokeColor"].replace('#', '')
        let FillColor = layer["FillColor"].replace('#', '');
        let SizePercent = layer["SizePercent"];
        let StrokeThicknessPercent = layer["StrokeThicknessPercent"];
        let Stockwidth = parseInt(layer["StrokeThicknessPercent"]) / 10;
        let opacity = layer["Opacity"];
        // var NewStrokeColor = layer["StrokeColor"].substr(3);
        //  var NewStrokeColor = layer["StrokeColor"].substr(2);
        let NewStrokeColor = this.UtilityService.GetHexColorValue(layer["StrokeColor"]);
        let ExternalIconId = layer["ExternalIconId"];
        // var NewfillColor = layer["FillColor"].substr(3);
        // var NewfillColor = layer["FillColor"].substr(2);
        let NewfillColor = this.UtilityService.GetHexColorValue(layer["FillColor"]);
        if (layer["LayerType"] === 'ParcelData' && layer["EnergyLayerID"] == 7863) {
            NewfillColor = '';
        }
        let size = Math.round(parseInt(layer["SizePercent"]) * 20 / 100);
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
            if (EnergyLayerStylesByUserModel["IsLabelVisible"] == 1)
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
            // let Icons = ["CheckeredCircle", "UndergroundStorage", "Area"];
            // let a = Icons.indexOf(layer["IconType"]);
            // if (a == -1) {
            //     if (layer["FilterValue"] != null) {
            //         sld_body += this.GetOgcFilterChildren(layer["FilterValue"]);
            //     }
            // }
            // let IconType = layer["IconType"];
            // if (IconType == 'Square') {
            //     IconType = "Circle";
            // }
            sld_body += '<PointSymbolizer>'
                + '<Graphic>'
                + '<ExternalGraphic>'
            if (!ExternalIconId) {
                // sld_body += '<OnlineResource type="simple" href="https://api.envisionmaps.com:8080/api/icongenerate/get/?Id=' + layer["DataSetID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + SizePercent + '&amp;StrokeThicknessPercent=' + StrokeThicknessPercent + '&amp;Opacity=' + opacity + '" />';
                // sld_body += '<OnlineResource type="simple" href="http://energymapit.com/en/Handlers/IconImage.ashx?Id=' + layer["DataSetID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + layer["SizePercent"] + '&amp;StrokeThicknessPercent=' + layer["StrokeThicknessPercent"] + '&amp;Opacity=' + opacity + '" />';
                // sld_body += '<OnlineResource type="simple" href="https://api.envisionmaps.com:8080/api/icongenerate/get/?Id=' + layer["DataSetID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + SizePercent + '&amp;StrokeThicknessPercent=' + StrokeThicknessPercent + '&amp;Opacity=' + opacity + '" />';
                let PointIconURL = environment.GetLayerIconURL + "/icongenerate/get/?Id=" + layer["EnergyLayerID"] + "&amp;URLType=CustomStyleIcon&amp;FillColor=" + FillColor + "&amp;IconType=" + IconType + "&amp;StrokeColor=" + StrokeColor + "&amp;SizePercent=" + SizePercent + "&amp;StrokeThicknessPercent=" + StrokeThicknessPercent + "&amp;Opacity=" + opacity;
                sld_body += '<OnlineResource type="simple" href="' + PointIconURL + '" />';
            }
            else {
                //sld_body += '<OnlineResource type="simple" href="https://api.envisionmaps.com:8080/api/icongenerate/get/?Id=' + layer["DataSetID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;ExternalIconId=' + ExternalIconId + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + layer["SizePercent"] + '&amp;StrokeThicknessPercent=' + layer["StrokeThicknessPercent"] + '&amp;Opacity=' + opacity + '" />';
                // sld_body += '<OnlineResource type="simple" href="http://energymapit.com/en/Handlers/IconImage.ashx?Id=' + layer["DataSetID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;ExternalIconId=' + ExternalIconId + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + layer["SizePercent"] + '&amp;StrokeThicknessPercent=' + layer["StrokeThicknessPercent"] + '&amp;Opacity=' + opacity + '" />';
                let ExternalIconurl = this.UtilityService.GetDefaultExternalIcon(ExternalIconId);
                let PreviewImageURL = environment.ImagespreviewPath;
                let ImagePath = PreviewImageURL + "01)AngularEnvision%20Images";
                if (ExternalIconurl.indexOf(ImagePath) >= 0) {
                    sld_body += '<OnlineResource type="simple" href="' + ExternalIconurl + '"/>';
                }
                else {
                    let externaliconlist = this.mapServices.ExternalIconList.value;
                    if (externaliconlist) {
                        for (let exicon of externaliconlist) {
                            if (exicon.Id == ExternalIconId) {
                                ExternalIconurl = this.UtilityService.GetDefaultExternalIcon(exicon.Id);
                                if (ExternalIconurl == "") {
                                    ExternalIconurl = PreviewImageURL + "EnvisionAngularUsersIcon/" + exicon.UploadedBy + "/" + exicon.Id + exicon.Extension;
                                }
                                else {
                                    ExternalIconurl = PreviewImageURL + "01)AngularEnvision%20Images/ExternalIconId/95.png";
                                }
                            }
                        }
                    }
                    sld_body += '<OnlineResource type="simple" href="' + ExternalIconurl + '"/>';
                }
                //sld_body += '<OnlineResource type="simple" href="http://energymapit.com/en/Handlers/IconImage.ashx?Id=' + layer["EnergyLayerID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;ExternalIconId=' + ExternalIconId + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + SizePercent + '&amp;StrokeThicknessPercent=' + StrokeThicknessPercent + '&amp;Opacity=' + opacity + '" />';
                // sld_body += '<OnlineResource type="simple" href="http://energymapit.com/en/Handlers/IconImage.ashx?Id=' + layer["EnergyLayerID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;ExternalIconId=' + ExternalIconId + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + layer["SizePercent"] + '&amp;StrokeThicknessPercent=' + layer["StrokeThicknessPercent"] + '&amp;Opacity=' + opacity + '" />';                
                //let Userid = this.AuthenticationService.getLoggedinUserId();
                // sld_body += '<OnlineResource type="simple" href="http://107.22.213.227:4243/api/IconGenerate/byteArrayToImage/?UserId=' + Userid + '&amp;ExternalIconid=' + ExternalIconId + '" />';
                //sld_body += '<OnlineResource type="simple" href="http://env3.beta.mapsearch360.com/api/Test?Id=' + layer["EnergyLayerID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + layer["SizePercent"] + '&amp;StrokeThicknessPercent=' + layer["StrokeThicknessPercent"] + '&amp;Opacity=' + opacity + '" />';
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
                // sld_body += ' <LineSymbolizer>'
                //     + '<Stroke>'
                //     + '<CssParameter name="stroke">#' + NewStrokeColor + '</CssParameter>'
                //     + '<CssParameter name="stroke-width">' + Stockwidth + '</CssParameter>'
                //     + '<CssParameter name="stroke-opacity">' + layer["Opacity"] + '</CssParameter>'
                //     + '</Stroke>'
                //     + '</LineSymbolizer>'
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
        sld_body += '</StyledLayerDescriptor>';
        // return encodeURIComponent(sld_body);
        return sld_body;
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
        if (Filter.indexOf("=") !== -1 && Filter.indexOf("<") == -1 && Filter.indexOf(">") == -1) {
            let FilterValue = Filter.split('=');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            sld_filter += '<PropertyIsEqualTo matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsEqualTo>';
        }

        if (Filter.indexOf(">") !== -1 && Filter.indexOf("=") == -1) {
            let FilterValue = Filter.split('>');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            sld_filter += '<PropertyIsGreaterThan matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsGreaterThan>';
        }

        if (Filter.indexOf("<") !== -1 && Filter.indexOf("=") == -1) {
            let FilterValue = Filter.split('<');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            sld_filter += '<PropertyIsLessThan matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsLessThan>';
        }

        if (Filter.indexOf("<=") !== -1) {
            let FilterValue = Filter.split('<=');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            sld_filter += '<PropertyIsLessThanOrEqualTo matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsLessThanOrEqualTo>';
        }

        if (Filter.indexOf("#EQUAL#") !== -1) {
            let FilterValue = Filter.split('#EQUAL#');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            sld_filter += '<PropertyIsEqualTo matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsEqualTo>';
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


    // endregion

    // region Load and Remove Layer
    LoadPrivateMapLayers(layer) {
        if (layer.Layerindexval != undefined) {
            var SLD_BODY = this.CreateSldBody(layer["RepresentationType"], "abc", "5", "1", layer, "BaseMaps:" + layer, "abstract");
            var CQL_FILTER = this.GetCQLFilter(layer);
            let userId = this.authService.getLoggedinUserId();
            this.httpRequest._NodeGeoserverSetImageLayerData(SLD_BODY, CQL_FILTER, userId).subscribe(res => {
                let gmaps = this._mapdata.getValue();
                gmaps.overlayMapTypes.setAt(layer.Layerindexval, this.SetPrivateWMSlayerD(layer, res.GeoMapPropID));
            })
        }
        // let gmaps = this.mapServices._mapdata.getValue();
        // gmaps.overlayMapTypes.setAt(layer.Layerindexval, this.SetPrivateWMSlayerD(layer));
    }

    // region old
    // LoadPrivateKmlLayers(layer) {
    //     let url = environment.KmlFilePath + layer.FilePathLocation;
    //     url = url.replace(/\\/g, "/");
    //     let kmlLayer = this.SetPrivateKMLlayer(url);
    //     let klayer = {
    //         LayerIndex: layer.Layerindexval,
    //         Layer: kmlLayer
    //     };
    //     if (!this.mapServices.KmlLayers.getValue()) {
    //         // let l ={
    //         //     Layers:[klayer]
    //         // }
    //         this.mapServices.setKmlLayers([klayer]);

    //     }
    //     else {
    //         let existingklayer = this.mapServices.KmlLayers.getValue();
    //         existingklayer.push(klayer);
    //     }
    // }
    // endregion


    RemoveMapLayer(layer) {
        let maps = this._mapdata.getValue();
        maps.overlayMapTypes.setAt(layer.Layerindexval, null);
    }

    RemoveKmlLayer(layer) {
        if (this.mapServices.KmlLayers.getValue()) {
            let existingklayer = this.mapServices.KmlLayers.getValue();
            let selectedKmlLayer = existingklayer.filter((el) => {
                if (el.LayerIndex == parseInt(layer.Layerindexval)) {
                    return el;
                }
            });
            if (selectedKmlLayer.length == 1) {
                for (let x in selectedKmlLayer[0].Layer) {
                    if (selectedKmlLayer[0].Layer[x].getMap() != null) {
                        selectedKmlLayer[0].Layer[x].setMap(null);
                    }
                }
                let index = existingklayer.indexOf(selectedKmlLayer[0]);
                if (index > -1) {
                    existingklayer.splice(index, 1);
                }
            }
        }
    }

    // endregion

    // region LoadKmlLayer
    // region old
    // SetPrivateKMLlayer(src) {
    //     //let src = this.ImageURLPath+"EnvisionAngular_KML/Alliance_Pipeline_Joint_Venture.kml";
    //     //let src = "https://developers.google.com/maps/documentation/javascript/examples/kml/westcampus.kml";
    //     //let src=this.ImageURLPath+"INGAA/KMZ/owner/Alliance_Pipeline_Joint_Venture.kmz";
    //     let preserveViewport = true;
    //     let kmllayers = new google.maps.KmlLayer(src, {
    //         suppressInfoWindows: true,
    //         preserveViewport: preserveViewport,
    //         map: this.mapdata.getValue()
    //     });
    //     return kmllayers;
    // }
    // endregion

    SetPrivateKMLlayer(kmlData) {
        let kmllayers = [];
        if (kmlData.LayerData.KMLGeometryList.length > 0) {
            let lineCoordinates = [];
            let pointCoordinates = [];
            let polygonCoordinates = [];
            kmlData.LayerData.KMLGeometryList.filter((el) => {
                if (el.coordinatesType == "Line") {
                    lineCoordinates.push(el);
                }
                else if (el.coordinatesType == "Point") {
                    pointCoordinates.push(el);
                }
                else if (el.coordinatesType == "Polygon") {
                    polygonCoordinates.push(el);
                }
            });
            let infowindow = new google.maps.InfoWindow();
            if (lineCoordinates.length > 0) {
                for (let x in lineCoordinates) {
                    let polyLine = new google.maps.Polyline({
                        path: lineCoordinates[x].Coordinate,
                        geodesic: true,
                        strokeColor: '#ffffff',
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });
                    polyLine.setMap(this._mapdata.getValue());
                    kmllayers.push(polyLine);
                    google.maps.event.addListener(polyLine, 'click', ((polyLine, i) => {
                        return (e) => {
                            if ((lineCoordinates[i].Name != null && lineCoordinates[i].Name != "") && (lineCoordinates[i].Description != null && lineCoordinates[i].Description != "")) {
                                if (this.mapLayerInfoService.map == null)
                                    this.mapLayerInfoService.map = this.mapServices._mapdata.getValue();
                                let position = this.LatLongToPosition(e.latLng);
                                this.mapLayerInfoService.pixelX = position.x;
                                this.mapLayerInfoService.pixelY = (position.y + 78);
                                this.mapLayerInfoService.DisplayInfoPopupForKml(e.latLng, lineCoordinates[i])
                            }
                        }
                    })(polyLine, x));
                }
            }

            if (pointCoordinates.length > 0) {
                for (let x in pointCoordinates) {
                    let point = new google.maps.Marker({
                        position: pointCoordinates[x].Coordinate,
                        icon: {
                            url: this.ImageURLPath + "01)AngularEnvision%20Images/ExternalIconId/113.png", // url
                            scaledSize: new google.maps.Size(20, 20), // scaled size
                            origin: new google.maps.Point(0, 0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                        }
                    });
                    point.setMap(this._mapdata.getValue());
                    kmllayers.push(point);
                    google.maps.event.addListener(point, 'click', ((point, i) => {
                        return (e) => {
                            if ((pointCoordinates[i].Name != null && pointCoordinates[i].Name != "") && (pointCoordinates[i].Description != null && pointCoordinates[i].Description != "")) {
                                if (this.mapLayerInfoService.map == null)
                                    this.mapLayerInfoService.map = this.mapServices._mapdata.getValue();
                                let position = this.LatLongToPosition(e.latLng);
                                this.mapLayerInfoService.pixelX = position.x;
                                this.mapLayerInfoService.pixelY = (position.y + 78);
                                this.mapLayerInfoService.DisplayInfoPopupForKml(e.latLng, pointCoordinates[i])
                            }
                        }
                    })(point, x));
                }
            }

            if (polygonCoordinates.length > 0) {
                for (let x in polygonCoordinates) {
                    let polygon = new google.maps.Polygon({
                        paths: polygonCoordinates[x].Coordinate,
                        strokeColor: '#0000cc',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#0000cc',
                        fillOpacity: 0.35
                    });
                    polygon.setMap(this._mapdata.getValue());
                    kmllayers.push(polygon);
                    google.maps.event.addListener(polygon, 'click', ((polygon, i) => {
                        return (e) => {
                            if ((polygonCoordinates[i].Name != null && polygonCoordinates[i].Name != "") && (polygonCoordinates[i].Description != null && polygonCoordinates[i].Description != "")) {
                                if (this.mapLayerInfoService.map == null)
                                    this.mapLayerInfoService.map = this.mapServices._mapdata.getValue();
                                let position = this.LatLongToPosition(e.latLng);
                                this.mapLayerInfoService.pixelX = position.x;
                                this.mapLayerInfoService.pixelY = (position.y + 78);
                                this.mapLayerInfoService.DisplayInfoPopupForKml(e.latLng, polygonCoordinates[i])
                            }
                        }
                    })(polygon, x));
                }
            }

        }
        return kmllayers;
    }

    LatLongToPosition(latLng: any) {
        let map = this._mapdata.getValue();
        let numTiles = 1 << map.getZoom();
        let projection = map.getProjection();
        let worldCoordinate = projection.fromLatLngToPoint(latLng);
        let pixelCoordinate = new google.maps.Point(
            worldCoordinate.x * numTiles,
            worldCoordinate.y * numTiles);

        let topLeft = new google.maps.LatLng(
            map.getBounds().getNorthEast().lat(),
            map.getBounds().getSouthWest().lng()
        );

        var topLeftWorldCoordinate = projection.fromLatLngToPoint(topLeft);
        var topLeftPixelCoordinate = new google.maps.Point(
            topLeftWorldCoordinate.x * numTiles,
            topLeftWorldCoordinate.y * numTiles);

        return new google.maps.Point(
            pixelCoordinate.x - topLeftPixelCoordinate.x,
            pixelCoordinate.y - topLeftPixelCoordinate.y);
    }

    // endregion
}