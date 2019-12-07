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
var map_service_service_1 = require("./map-service.service");
var Utility_service_1 = require("./Utility.service");
var map_layer_info_service_1 = require("./map-layer-info.service");
var api_service_1 = require("./api.service");
var all_http_request_service_1 = require("./all-http-request.service");
var auth_service_1 = require("./auth.service");
var PrivateMapLayerService = (function () {
    function PrivateMapLayerService(mapServices, mapLayerInfoService, UtilityService, _api, httpRequest, authService) {
        this.mapServices = mapServices;
        this.mapLayerInfoService = mapLayerInfoService;
        this.UtilityService = UtilityService;
        this._api = _api;
        this.httpRequest = httpRequest;
        this.authService = authService;
        this._mapdata = this.mapServices._mapdata;
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
    }
    // region LoadWmsLayer
    PrivateMapLayerService.prototype.SetPrivateWMSlayerD = function (layer, geoMapPropID) {
        var _this = this;
        var wmsOptions = {
            alt: layer["TableName"],
            getTileUrl: function (tile, zoom) {
                //return this.WMStileUrlD(layer, "abc", tile, zoom)
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
    PrivateMapLayerService.prototype.NodeWMStileUrlD = function (layer, style, tile, zoom, geoMapPropID) {
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
                var zoomlevel = gmas.getZoom();
                if ((zoomlevel >= parseInt(layer['ZoomMin'])) && (zoomlevel <= parseInt(layer['ZoomMax']))) {
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
        // url += "Body=" + theSLD_BODY + "&bbox=" + bbox + CQL_FILTER;
    };
    PrivateMapLayerService.prototype.GetCQLFilter = function (layer) {
        var CQL_FILTER = "";
        // if (layer["RepresentationType"] == "Line") {
        //     CQL_FILTER = this.CreateFilter(layer["FilterValue"]);
        // }
        var filterval = layer["FilterValue"];
        var isfilterval = false;
        var filter = '';
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
            }
            else {
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
        } // let Icons = ["CheckeredCircle", "UndergroundStorage", "Area"];
        // let a = Icons.indexOf(layer["IconType"]);
        // if (a != -1) {
        //     CQL_FILTER = this.GetOgcFilterChildren(layer["FilterValue"]);
        // }
        CQL_FILTER = decodeURIComponent(CQL_FILTER);
        return CQL_FILTER;
    };
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
    PrivateMapLayerService.prototype.CreateSldBody = function (shape, stroke, strokeWidth, strokeCapcity, layer, title, abstarct) {
        var IconType = layer["IconType"];
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
        var opacity = layer["Opacity"];
        // var NewStrokeColor = layer["StrokeColor"].substr(3);
        //  var NewStrokeColor = layer["StrokeColor"].substr(2);
        var NewStrokeColor = this.UtilityService.GetHexColorValue(layer["StrokeColor"]);
        var ExternalIconId = layer["ExternalIconId"];
        // var NewfillColor = layer["FillColor"].substr(3);
        // var NewfillColor = layer["FillColor"].substr(2);
        var NewfillColor = this.UtilityService.GetHexColorValue(layer["FillColor"]);
        if (layer["LayerType"] === 'ParcelData' && layer["EnergyLayerID"] == 7863) {
            NewfillColor = '';
        }
        var size = Math.round(parseInt(layer["SizePercent"]) * 20 / 100);
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
            if (EnergyLayerStylesByUserModel["IsLabelVisible"] == 1)
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
                + '<ExternalGraphic>';
            if (!ExternalIconId) {
                // sld_body += '<OnlineResource type="simple" href="https://api.envisionmaps.com:8080/api/icongenerate/get/?Id=' + layer["DataSetID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + SizePercent + '&amp;StrokeThicknessPercent=' + StrokeThicknessPercent + '&amp;Opacity=' + opacity + '" />';
                // sld_body += '<OnlineResource type="simple" href="http://energymapit.com/en/Handlers/IconImage.ashx?Id=' + layer["DataSetID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + layer["SizePercent"] + '&amp;StrokeThicknessPercent=' + layer["StrokeThicknessPercent"] + '&amp;Opacity=' + opacity + '" />';
                // sld_body += '<OnlineResource type="simple" href="https://api.envisionmaps.com:8080/api/icongenerate/get/?Id=' + layer["DataSetID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + SizePercent + '&amp;StrokeThicknessPercent=' + StrokeThicknessPercent + '&amp;Opacity=' + opacity + '" />';
                var PointIconURL = environment_1.environment.GetLayerIconURL + "/icongenerate/get/?Id=" + layer["EnergyLayerID"] + "&amp;URLType=CustomStyleIcon&amp;FillColor=" + FillColor + "&amp;IconType=" + IconType + "&amp;StrokeColor=" + StrokeColor + "&amp;SizePercent=" + SizePercent + "&amp;StrokeThicknessPercent=" + StrokeThicknessPercent + "&amp;Opacity=" + opacity;
                sld_body += '<OnlineResource type="simple" href="' + PointIconURL + '" />';
            }
            else {
                //sld_body += '<OnlineResource type="simple" href="https://api.envisionmaps.com:8080/api/icongenerate/get/?Id=' + layer["DataSetID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;ExternalIconId=' + ExternalIconId + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + layer["SizePercent"] + '&amp;StrokeThicknessPercent=' + layer["StrokeThicknessPercent"] + '&amp;Opacity=' + opacity + '" />';
                // sld_body += '<OnlineResource type="simple" href="http://energymapit.com/en/Handlers/IconImage.ashx?Id=' + layer["DataSetID"] + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;ExternalIconId=' + ExternalIconId + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + layer["SizePercent"] + '&amp;StrokeThicknessPercent=' + layer["StrokeThicknessPercent"] + '&amp;Opacity=' + opacity + '" />';
                var ExternalIconurl = this.UtilityService.GetDefaultExternalIcon(ExternalIconId);
                var PreviewImageURL = environment_1.environment.ImagespreviewPath;
                var ImagePath = PreviewImageURL + "01)AngularEnvision%20Images";
                if (ExternalIconurl.indexOf(ImagePath) >= 0) {
                    sld_body += '<OnlineResource type="simple" href="' + ExternalIconurl + '"/>';
                }
                else {
                    var externaliconlist = this.mapServices.ExternalIconList.value;
                    if (externaliconlist) {
                        for (var _i = 0, externaliconlist_1 = externaliconlist; _i < externaliconlist_1.length; _i++) {
                            var exicon = externaliconlist_1[_i];
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
                + '</PointSymbolizer>';
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
        // return encodeURIComponent(sld_body);
        return sld_body;
    };
    PrivateMapLayerService.prototype.GetOgcFilterChildren = function (FilterValueData) {
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
    PrivateMapLayerService.prototype.FilterValueChildLoop = function (Filter) {
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
    PrivateMapLayerService.prototype.SingleFilterLoop = function (Filter) {
        var sld_filter = "";
        if (Filter.indexOf("=") !== -1 && Filter.indexOf("<") == -1 && Filter.indexOf(">") == -1) {
            var FilterValue = Filter.split('=');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            sld_filter += '<PropertyIsEqualTo matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsEqualTo>';
        }
        if (Filter.indexOf(">") !== -1 && Filter.indexOf("=") == -1) {
            var FilterValue = Filter.split('>');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            sld_filter += '<PropertyIsGreaterThan matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsGreaterThan>';
        }
        if (Filter.indexOf("<") !== -1 && Filter.indexOf("=") == -1) {
            var FilterValue = Filter.split('<');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            sld_filter += '<PropertyIsLessThan matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsLessThan>';
        }
        if (Filter.indexOf("<=") !== -1) {
            var FilterValue = Filter.split('<=');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            sld_filter += '<PropertyIsLessThanOrEqualTo matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsLessThanOrEqualTo>';
        }
        if (Filter.indexOf("#EQUAL#") !== -1) {
            var FilterValue = Filter.split('#EQUAL#');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            sld_filter += '<PropertyIsEqualTo matchCase="false">'
                + '<PropertyName>' + PropertyName + '</PropertyName>'
                + '<Literal>' + Literal + '</Literal>'
                + '</PropertyIsEqualTo>';
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
    PrivateMapLayerService.prototype.CreateFilter = function (FilterValueData) {
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
    PrivateMapLayerService.prototype.CreateFilterLoop = function (Filter) {
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
    // endregion
    // region Load and Remove Layer
    PrivateMapLayerService.prototype.LoadPrivateMapLayers = function (layer) {
        var _this = this;
        if (layer.Layerindexval != undefined) {
            var SLD_BODY = this.CreateSldBody(layer["RepresentationType"], "abc", "5", "1", layer, "BaseMaps:" + layer, "abstract");
            var CQL_FILTER = this.GetCQLFilter(layer);
            var userId = this.authService.getLoggedinUserId();
            this.httpRequest._NodeGeoserverSetImageLayerData(SLD_BODY, CQL_FILTER, userId).subscribe(function (res) {
                var gmaps = _this._mapdata.getValue();
                gmaps.overlayMapTypes.setAt(layer.Layerindexval, _this.SetPrivateWMSlayerD(layer, res.GeoMapPropID));
            });
        }
        // let gmaps = this.mapServices._mapdata.getValue();
        // gmaps.overlayMapTypes.setAt(layer.Layerindexval, this.SetPrivateWMSlayerD(layer));
    };
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
    PrivateMapLayerService.prototype.RemoveMapLayer = function (layer) {
        var maps = this._mapdata.getValue();
        maps.overlayMapTypes.setAt(layer.Layerindexval, null);
    };
    PrivateMapLayerService.prototype.RemoveKmlLayer = function (layer) {
        if (this.mapServices.KmlLayers.getValue()) {
            var existingklayer = this.mapServices.KmlLayers.getValue();
            var selectedKmlLayer = existingklayer.filter(function (el) {
                if (el.LayerIndex == parseInt(layer.Layerindexval)) {
                    return el;
                }
            });
            if (selectedKmlLayer.length == 1) {
                for (var x in selectedKmlLayer[0].Layer) {
                    if (selectedKmlLayer[0].Layer[x].getMap() != null) {
                        selectedKmlLayer[0].Layer[x].setMap(null);
                    }
                }
                var index = existingklayer.indexOf(selectedKmlLayer[0]);
                if (index > -1) {
                    existingklayer.splice(index, 1);
                }
            }
        }
    };
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
    PrivateMapLayerService.prototype.SetPrivateKMLlayer = function (kmlData) {
        var _this = this;
        var kmllayers = [];
        if (kmlData.LayerData.KMLGeometryList.length > 0) {
            var lineCoordinates_1 = [];
            var pointCoordinates_1 = [];
            var polygonCoordinates_1 = [];
            kmlData.LayerData.KMLGeometryList.filter(function (el) {
                if (el.coordinatesType == "Line") {
                    lineCoordinates_1.push(el);
                }
                else if (el.coordinatesType == "Point") {
                    pointCoordinates_1.push(el);
                }
                else if (el.coordinatesType == "Polygon") {
                    polygonCoordinates_1.push(el);
                }
            });
            var infowindow = new google.maps.InfoWindow();
            if (lineCoordinates_1.length > 0) {
                for (var x in lineCoordinates_1) {
                    var polyLine = new google.maps.Polyline({
                        path: lineCoordinates_1[x].Coordinate,
                        geodesic: true,
                        strokeColor: '#ffffff',
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });
                    polyLine.setMap(this._mapdata.getValue());
                    kmllayers.push(polyLine);
                    google.maps.event.addListener(polyLine, 'click', (function (polyLine, i) {
                        return function (e) {
                            if ((lineCoordinates_1[i].Name != null && lineCoordinates_1[i].Name != "") && (lineCoordinates_1[i].Description != null && lineCoordinates_1[i].Description != "")) {
                                if (_this.mapLayerInfoService.map == null)
                                    _this.mapLayerInfoService.map = _this.mapServices._mapdata.getValue();
                                var position = _this.LatLongToPosition(e.latLng);
                                _this.mapLayerInfoService.pixelX = position.x;
                                _this.mapLayerInfoService.pixelY = (position.y + 78);
                                _this.mapLayerInfoService.DisplayInfoPopupForKml(e.latLng, lineCoordinates_1[i]);
                            }
                        };
                    })(polyLine, x));
                }
            }
            if (pointCoordinates_1.length > 0) {
                for (var x in pointCoordinates_1) {
                    var point = new google.maps.Marker({
                        position: pointCoordinates_1[x].Coordinate,
                        icon: {
                            url: this.ImageURLPath + "01)AngularEnvision%20Images/ExternalIconId/113.png",
                            scaledSize: new google.maps.Size(20, 20),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(0, 0) // anchor
                        }
                    });
                    point.setMap(this._mapdata.getValue());
                    kmllayers.push(point);
                    google.maps.event.addListener(point, 'click', (function (point, i) {
                        return function (e) {
                            if ((pointCoordinates_1[i].Name != null && pointCoordinates_1[i].Name != "") && (pointCoordinates_1[i].Description != null && pointCoordinates_1[i].Description != "")) {
                                if (_this.mapLayerInfoService.map == null)
                                    _this.mapLayerInfoService.map = _this.mapServices._mapdata.getValue();
                                var position = _this.LatLongToPosition(e.latLng);
                                _this.mapLayerInfoService.pixelX = position.x;
                                _this.mapLayerInfoService.pixelY = (position.y + 78);
                                _this.mapLayerInfoService.DisplayInfoPopupForKml(e.latLng, pointCoordinates_1[i]);
                            }
                        };
                    })(point, x));
                }
            }
            if (polygonCoordinates_1.length > 0) {
                for (var x in polygonCoordinates_1) {
                    var polygon = new google.maps.Polygon({
                        paths: polygonCoordinates_1[x].Coordinate,
                        strokeColor: '#0000cc',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#0000cc',
                        fillOpacity: 0.35
                    });
                    polygon.setMap(this._mapdata.getValue());
                    kmllayers.push(polygon);
                    google.maps.event.addListener(polygon, 'click', (function (polygon, i) {
                        return function (e) {
                            if ((polygonCoordinates_1[i].Name != null && polygonCoordinates_1[i].Name != "") && (polygonCoordinates_1[i].Description != null && polygonCoordinates_1[i].Description != "")) {
                                if (_this.mapLayerInfoService.map == null)
                                    _this.mapLayerInfoService.map = _this.mapServices._mapdata.getValue();
                                var position = _this.LatLongToPosition(e.latLng);
                                _this.mapLayerInfoService.pixelX = position.x;
                                _this.mapLayerInfoService.pixelY = (position.y + 78);
                                _this.mapLayerInfoService.DisplayInfoPopupForKml(e.latLng, polygonCoordinates_1[i]);
                            }
                        };
                    })(polygon, x));
                }
            }
        }
        return kmllayers;
    };
    PrivateMapLayerService.prototype.LatLongToPosition = function (latLng) {
        var map = this._mapdata.getValue();
        var numTiles = 1 << map.getZoom();
        var projection = map.getProjection();
        var worldCoordinate = projection.fromLatLngToPoint(latLng);
        var pixelCoordinate = new google.maps.Point(worldCoordinate.x * numTiles, worldCoordinate.y * numTiles);
        var topLeft = new google.maps.LatLng(map.getBounds().getNorthEast().lat(), map.getBounds().getSouthWest().lng());
        var topLeftWorldCoordinate = projection.fromLatLngToPoint(topLeft);
        var topLeftPixelCoordinate = new google.maps.Point(topLeftWorldCoordinate.x * numTiles, topLeftWorldCoordinate.y * numTiles);
        return new google.maps.Point(pixelCoordinate.x - topLeftPixelCoordinate.x, pixelCoordinate.y - topLeftPixelCoordinate.y);
    };
    PrivateMapLayerService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [map_service_service_1.MapServiceService,
            map_layer_info_service_1.MapLayerInfoService,
            Utility_service_1.UtilityService,
            api_service_1.ApiService,
            all_http_request_service_1.HttpRequestService,
            auth_service_1.AuthenticationService])
    ], PrivateMapLayerService);
    return PrivateMapLayerService;
}());
exports.PrivateMapLayerService = PrivateMapLayerService;
//# sourceMappingURL=private-maplayer-service.js.map