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
var environment_1 = require("../../environments/environment");
var map_service_service_1 = require("../services/map-service.service");
var auth_service_1 = require("../services/auth.service");
var api_service_1 = require("./api.service");
var Utility_service_1 = require("./Utility.service");
var all_http_request_service_1 = require("./all-http-request.service");
var MapLayerService = (function () {
    function MapLayerService(mapServices, _api, UtilityService, httpService, authService) {
        this.mapServices = mapServices;
        this._api = _api;
        this.UtilityService = UtilityService;
        this.httpService = httpService;
        this.authService = authService;
        this._mapdata = this.mapServices._mapdata;
    }
    MapLayerService.prototype.SetWMSlayerD = function (layer, geoMapPropID) {
        var _this = this;
        var wmsOptions = {
            alt: layer["TableName"],
            getTileUrl: function (tile, zoom) {
                // return this.WMStileUrlD(layer, "abc", tile, zoom)
                return _this.NodeWMStileUrlD(layer, "abc", tile, zoom, geoMapPropID);
            },
            isPng: true,
            maxZoom: 21,
            minZoom: 4,
            name: layer["TableName"],
            tileSize: new google.maps.Size(256, 256)
        };
        var openlayersWMS = new google.maps.ImageMapType(wmsOptions);
        return openlayersWMS;
    };
    MapLayerService.prototype.NodeWMStileUrlD = function (layer, style, tile, zoom, geoMapPropID) {
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
                var zoomlevel = gmas.getZoom();
                if ((zoomlevel >= layer['ZoomMin']) && (zoomlevel <= layer['ZoomMax'])) {
                    return url;
                }
                else {
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
            var opacity = 1;
            if (layer.Opacity)
                opacity = parseFloat(layer["Opacity"].toFixed(2));
            if (layer.EnergyLayerStylesByUserModel && layer.EnergyLayerStylesByUserModel.length > 0) {
                var EnergyLayerStylesByUserModel = layer.EnergyLayerStylesByUserModel[0];
                if (EnergyLayerStylesByUserModel["Opacity"])
                    opacity = parseFloat(EnergyLayerStylesByUserModel["Opacity"].toFixed(2));
            }
            var BaseUri = "https://hazards.fema.gov/gis/nfhl/services/public/NFHLWMS/MapServer/WMSServer?SERVICE=WMS&REQUEST=GetMap&BBOX=-10684062.0641016,4314717.37204102,-10681616.0791968,4317163.3569458&Width=256&Height=256&LAYERS=4&Format=image/png&TRANSPARENT=TRUE&STYLES=&TILED=true&VERSION=1.1.1&SRS=EPSG:3857";
            var staticParm = "?Service=WMS&Request=GetMap&BBox={0}&Width={1}&Height={2}&Layers={3}&Format=image/png";
            var projdefs = { "4326": L.CRS.EPSG4326, "3857": L.CRS.EPSG3857 };
            var SplitedtheDetail = layer.DetailPanelPropertiesMain.split(';');
            var ExternalURL = "";
            var Parameter = "";
            var Layers = "";
            for (var _i = 0, SplitedtheDetail_1 = SplitedtheDetail; _i < SplitedtheDetail_1.length; _i++) {
                var index = SplitedtheDetail_1[_i];
                if (index.indexOf('BaseUri==') >= 0) {
                    var splitebaseUri = index.replace("BaseUri==", " ");
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
                }
                else if (Parameter.indexOf("4326") >= 0) {
                    bbox = this.UtilityService.getExternalURLBbox(zoom, tile, gmas, projdefs["4326"]);
                }
            }
            else {
                bbox = this.UtilityService.getExternalURLBbox(zoom, tile, gmas, projdefs["4326"]);
            }
            var endpoint = this._api._NodeGeoserverGetHazardImage;
            var uRLParameter = '?BBOX=' + bbox + '&opacityvalue=' + opacity;
            var getURLHazardImage = endpoint + uRLParameter;
            return getURLHazardImage;
        }
    };
    MapLayerService.prototype.GetCQLFilter = function (layer) {
        var CQL_FILTER = "";
        var filterval = layer["FilterValue"];
        var isfilterval = false;
        var filter = '';
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
    };
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
    MapLayerService.prototype.CreateSldBody = function (shape, stroke, strokeWidth, strokeCapcity, layer, title, abstarct) {
        var IconType = layer["IconType"];
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
        //size = parseInt(layer["SizePercent"]);
        var TableName = layer["TableName"];
        var LabelName = '';
        if (layer["IsLabelVisible"] == 1)
            LabelName = layer["LabelField"];
        if (layer.EnergyLayerStylesByUserModel && layer.EnergyLayerStylesByUserModel.length > 0) {
            var EnergyLayerStylesByUserModel = layer.EnergyLayerStylesByUserModel[0];
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
        var fillOpacity = opacity;
        if ((layer["LayerType"] === 'ParcelData' || layer['TableName'].indexOf('Parcels_') >= 0) && layer["RepresentationType"] == 'Area' && opacity == 1) {
            // opacity = 0.30;
            fillOpacity = 0;
        }
        var sld_body = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld">'
            + '<NamedLayer>'
            + '<Name>' + TableName + '</Name>'
            + '<UserStyle>'
            + '<FeatureTypeStyle>'
            + '<Rule>';
        if (shape == "Point") {
            sld_body += '<PointSymbolizer>'
                + '<Graphic>'
                + '<ExternalGraphic>';
            if (!ExternalIconId) {
                //sld_body += '<OnlineResource type="simple" href="http://energymapit.com/en/Handlers/IconImage.ashx?Id=' + layer["EnergyLayerID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + layer["SizePercent"] + '&amp;StrokeThicknessPercent=' + layer["StrokeThicknessPercent"] + '&amp;Opacity=' + opacity + '" />';
                // sld_body += '<OnlineResource type="simple" href="http://env3.beta.mapsearch360.com/api/Test?Id=' + layer["EnergyLayerID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + layer["SizePercent"] + '&amp;StrokeThicknessPercent=' + layer["StrokeThicknessPercent"] + '&amp;Opacity=' + opacity + '" />';
                //sld_body += '<OnlineResource type="simple" href="http://env3.beta.mapsearch360.com/api/Test?Id=' + layer["EnergyLayerID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + layer["SizePercent"] + '&amp;StrokeThicknessPercent=' + layer["StrokeThicknessPercent"] + '&amp;Opacity=' + opacity + '" />';                
                //sld_body += '<OnlineResource type="simple" href="http://energymapit.com/en/Handlers/IconImage.ashx?Id=' + layer["EnergyLayerID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + layer["SizePercent"] + '&amp;StrokeThicknessPercent=' + layer["StrokeThicknessPercent"] + '&amp;Opacity=' + opacity + '" />';
                //sld_body += '<OnlineResource type="simple" href="http://env3.beta.mapsearch360.com/api/Test?Id=' + layer["EnergyLayerID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + SizePercent + '&amp;StrokeThicknessPercent=' + StrokeThicknessPercent + '&amp;Opacity=' + opacity + '" />';                
                // sld_body += '<OnlineResource type="simple" href="https://api.envisionmaps.com:8080/api/icongenerate/get/?Id=' + layer["EnergyLayerID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + SizePercent + '&amp;StrokeThicknessPercent=' + StrokeThicknessPercent + '&amp;Opacity=' + opacity + '" />';
                var PointIconURL = environment_1.environment.GetLayerIconURL + "/icongenerate/get/?Id=" + layer["EnergyLayerID"] + "&amp;URLType=CustomStyleIcon&amp;FillColor=" + FillColor + "&amp;IconType=" + IconType + "&amp;StrokeColor=" + StrokeColor + "&amp;SizePercent=" + SizePercent + "&amp;StrokeThicknessPercent=" + StrokeThicknessPercent + "&amp;Opacity=" + opacity;
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
            //NewStrokeColor = this.GetHexValueWithAlpha(NewfillColor);
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
        sld_body += '</Rule>';
        sld_body += '</FeatureTypeStyle>';
        if (LabelName) {
            sld_body += this.UtilityService.GetXMLLabelstyle(LabelName, shape);
        }
        sld_body += '</UserStyle>';
        sld_body += '</NamedLayer>';
        sld_body += '</StyledLayerDescriptor>';
        return sld_body;
        // return encodeURIComponent(sld_body);
    };
    MapLayerService.prototype.GetOgcFilterChildren = function (FilterValueData) {
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
    MapLayerService.prototype.FilterValueChildLoop = function (Filter) {
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
    MapLayerService.prototype.SingleFilterLoop = function (Filter) {
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
    MapLayerService.prototype.removemapLayer = function (layer) {
        var maps = this._mapdata.getValue();
        maps.overlayMapTypes.setAt(layer.Layerindexval, null);
    };
    MapLayerService.prototype.loadmapLayers = function (layer) {
        var _this = this;
        if (!layer.TableName && layer.DetailPanelProperties.toString().indexOf('BaseUri==') != -1 && layer.DetailPanelPropertiesMain.toString().indexOf('BaseUri==') != -1) {
            var gmaps = this._mapdata.getValue();
            gmaps.overlayMapTypes.setAt(layer.Layerindexval, this.SetWMSlayerD(layer, 0));
        }
        else {
            if (layer.Layerindexval != undefined) {
                var SLD_BODY = this.CreateSldBody(layer["RepresentationType"], "abc", "5", "1", layer, "BaseMaps:" + layer, "abstract");
                var CQL_FILTER = this.GetCQLFilter(layer);
                var userId = this.authService.getLoggedinUserId();
                this.httpService._NodeGeoserverSetImageLayerData(SLD_BODY, CQL_FILTER, userId).subscribe(function (res) {
                    var gmaps = _this._mapdata.getValue();
                    gmaps.overlayMapTypes.setAt(layer.Layerindexval, _this.SetWMSlayerD(layer, res.GeoMapPropID));
                });
            }
        }
    };
    MapLayerService.prototype.CreateFilter = function (FilterValueData) {
        var sld_filter = "";
        if (FilterValueData != null && FilterValueData != "") {
            if (FilterValueData.indexOf(";") !== -1) {
                var Filter = FilterValueData.split(';');
                sld_filter += this.CreateFilterLoop(Filter);
            }
            if (FilterValueData.indexOf("#OR#") !== -1) {
                var Filter = FilterValueData.split('#OR#');
                sld_filter += this.CreateFilterLoop(Filter);
            }
            if (sld_filter == "") {
                sld_filter += '<Filter xmlns="http://www.opengis.net/ogc">'
                    + '<And>';
                sld_filter += this.SingleFilterLoop(FilterValueData);
                sld_filter += '</And>'
                    + '</Filter>';
            }
        }
        return encodeURIComponent(sld_filter);
    };
    MapLayerService.prototype.CreateFilterLoop = function (Filter) {
        var sld_filter = '<Filter xmlns="http://www.opengis.net/ogc">'
            + '<And>';
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
        sld_filter += '</And>'
            + '</Filter>';
        return sld_filter;
    };
    MapLayerService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [map_service_service_1.MapServiceService,
            api_service_1.ApiService,
            Utility_service_1.UtilityService,
            all_http_request_service_1.HttpRequestService,
            auth_service_1.AuthenticationService])
    ], MapLayerService);
    return MapLayerService;
}());
exports.MapLayerService = MapLayerService;
//# sourceMappingURL=MapLayer-service.js.map