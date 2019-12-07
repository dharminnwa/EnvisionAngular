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
var MapLayer_new_service_1 = require("./MapLayer-new-service");
var auth_service_1 = require("./auth.service");
var PrivateMapLayerService_new = (function () {
    function PrivateMapLayerService_new(MapServiceService, mapLayerInfoService, UtilityService, _api, httpRequest, authService) {
        this.MapServiceService = MapServiceService;
        this.mapLayerInfoService = mapLayerInfoService;
        this.UtilityService = UtilityService;
        this._api = _api;
        this.httpRequest = httpRequest;
        this.authService = authService;
        this._mapdata = this.MapServiceService._mapdata;
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
        this.recentFilters = {
            cqlFilter: '',
            sldBody: '',
            id: ''
        };
        this.groupRecentFilters = [];
    }
    PrivateMapLayerService_new.prototype.SetPrivateNew_WMSlayerD = function (tabdata, geoMapPropID) {
        var _this = this;
        var wmsOptions = {
            alt: "TempLayer",
            getTileUrl: function (tile, zoom) {
                return _this.WMStileUrlD(geoMapPropID, tile, zoom);
            },
            isPng: true,
            maxZoom: 21,
            minZoom: 1,
            name: "TempLayer",
            tileSize: new google.maps.Size(256, 256)
        };
        var openlayersWMS = new google.maps.ImageMapType(wmsOptions);
        return openlayersWMS;
    };
    PrivateMapLayerService_new.prototype.LoadGroupMapLayers_Private = function () {
        var _this = this;
        var tabdata = this.MapServiceService._GridTabData.value;
        if (tabdata.length > 0) {
            setTimeout(function () {
                var groupLayers = tabdata.filter(function (x) { return x.treestatus == 'GroupLayer'; });
                if (groupLayers && groupLayers.length > 0) {
                    var _loop_1 = function (i) {
                        var groupLayer = groupLayers[i];
                        var data = _this.CreateSldBodyAndCqlFilterForGroupLayer(groupLayer);
                        var isRecentFilter = _this.groupRecentFilters.find(function (x) { return x.cqlFilter == data.cqlFilter && x.sldBody == data.sldBody && groupLayer.parentID == x.groupLayerId; });
                        if (isRecentFilter)
                            return "continue";
                        _this.removeGroupmapLayer(groupLayer.Layerindexval);
                        var existingGroupLayerIndex = _this.groupRecentFilters.findIndex(function (x) { return x.groupLayerId == groupLayer.parentID; });
                        if (existingGroupLayerIndex > -1)
                            _this.groupRecentFilters.splice(existingGroupLayerIndex, 1);
                        var groupFilterData = new MapLayer_new_service_1.FilterGroup();
                        groupFilterData.cqlFilter = data.cqlFilter;
                        groupFilterData.sldBody = data.sldBody;
                        groupFilterData.id = '';
                        groupFilterData.groupLayerId = groupLayer.parentID;
                        _this.groupRecentFilters.push(groupFilterData);
                        var userId = _this.authService.getLoggedinUserId();
                        _this.httpRequest._NodeGeoserverSetImageLayerData(data.sldBody, data.cqlFilter, userId).subscribe(function (res) {
                            var groupFilterData = _this.groupRecentFilters.find(function (x) { return x.groupLayerId == groupLayer.parentID; });
                            if (groupFilterData)
                                groupFilterData.id = res.GeoMapPropID;
                            var gmaps = _this._mapdata.getValue();
                            gmaps.overlayMapTypes.setAt(groupLayer.Layerindexval, _this.SetPrivateNew_WMSlayerD(tabdata, res.GeoMapPropID));
                        }, function (error) {
                            console.error(error);
                        });
                    };
                    for (var i = 0; i < groupLayers.length; i++) {
                        _loop_1(i);
                    }
                }
            }, 300);
        }
    };
    PrivateMapLayerService_new.prototype.removeGroupmapLayer = function (index) {
        var gmaps = this._mapdata.getValue();
        gmaps.overlayMapTypes.setAt(index, null);
    };
    PrivateMapLayerService_new.prototype.CreateSldBodyAndCqlFilterForGroupLayer = function (tabdata) {
        var sldBody = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld">';
        var cqlFilter = '';
        var _TabData = tabdata;
        if (_TabData.treestatus == 'GroupLayer') {
            if (_TabData.FeatureType == "CreateLayer") {
                if (this.MapServiceService._TemporaryTreeUI.getValue()) {
                    var nodeData = this.MapServiceService._TemporaryTreeUI.getValue().treeModel.getNodeById(tabdata.parentID).data.children;
                    var allCheckedLayer = nodeData.filter(function (m) { return m.IsChecked == false; }).map(function (m) { return m.Id; });
                    if (allCheckedLayer.length > 0) {
                        for (var _i = 0, _a = _TabData.energyLayer; _i < _a.length; _i++) {
                            var layer = _a[_i];
                            if (allCheckedLayer.indexOf(layer.EnergyLayerID) != -1) {
                                sldBody += this.CreateSldBody(layer);
                                var currentCqlfilter = this.GetCQLFilter(layer);
                                if (currentCqlfilter == '')
                                    currentCqlfilter = 'INCLUDE';
                                if (cqlFilter != '')
                                    cqlFilter += ';';
                                cqlFilter += currentCqlfilter;
                            }
                        }
                    }
                }
            }
            else {
                if (this.MapServiceService._TreeUI.getValue()) {
                    var nodeData = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(tabdata.parentID).data.children;
                    var allCheckedLayer = nodeData.filter(function (m) { return m.IsChecked == false; }).map(function (m) { return m.Id; });
                    if (allCheckedLayer.length > 0) {
                        for (var _b = 0, _c = _TabData.energyLayer; _b < _c.length; _b++) {
                            var layer = _c[_b];
                            if (allCheckedLayer.indexOf(layer.EnergyLayerID) != -1) {
                                sldBody += this.CreateSldBody(layer);
                                var currentCqlfilter = this.GetCQLFilter(layer);
                                if (currentCqlfilter == '')
                                    currentCqlfilter = 'INCLUDE';
                                if (cqlFilter != '')
                                    cqlFilter += ';';
                                cqlFilter += currentCqlfilter;
                            }
                        }
                    }
                }
            }
        }
        sldBody += '</StyledLayerDescriptor>';
        var data = {
            sldBody: sldBody,
            cqlFilter: cqlFilter
        };
        return data;
    };
    PrivateMapLayerService_new.prototype.WMStileUrlD = function (geoMapPropID, tile, zoom) {
        var gmas = this._mapdata.getValue();
        var projection = gmas.getProjection();
        var zpow = Math.pow(2, zoom);
        var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
        var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
        var ulw = projection.fromPointToLatLng(ul);
        var lrw = projection.fromPointToLatLng(lr);
        var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
        var endpoint = this._api._NodeGeoserverGetGeoMapNew;
        var uRLParameter = '?BBOX=' + bbox + '&GeoMapPropID=' + geoMapPropID;
        var getGeoMapNewURL = endpoint + uRLParameter;
        return getGeoMapNewURL;
    };
    PrivateMapLayerService_new.prototype.CreateSldBody = function (layer) {
        var IconType = layer["IconType"];
        if (IconType == 'Square') {
            IconType = "Circle";
        }
        var shape = layer["RepresentationType"];
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
        var opacity = parseFloat(layer["Opacity"].toFixed(2));
        var NewStrokeColor = this.UtilityService.GetHexColorValue(layer["StrokeColor"]);
        var ExternalIconId = layer["ExternalIconId"];
        var NewfillColor = this.UtilityService.GetHexColorValue(layer["FillColor"]);
        var size = Math.round(parseInt(layer["SizePercent"]) * 25 / 100);
        var TableName = layer["TableName"];
        var LabelName = '';
        if (layer["IsLabelVisible"] == 1)
            LabelName = layer["LabelField"];
        if (layer.EnergyLayerStylesByUserModel && layer.EnergyLayerStylesByUserModel.length > 0) {
            var EnergyLayerStylesByUserModel = layer.EnergyLayerStylesByUserModel[0];
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
        var fillOpacity = opacity;
        if ((layer["LayerType"] === 'ParcelData' || layer['TableName'].indexOf('Parcels_') >= 0) && layer["RepresentationType"] == 'Area' && opacity == 1) {
            fillOpacity = 0;
        }
        var sld_body = '<NamedLayer>'
            + '<Name>' + TableName + '</Name>'
            + '<UserStyle>'
            + '<FeatureTypeStyle>'
            + '<Rule>';
        if (shape == "Point") {
            sld_body += '<PointSymbolizer>'
                + '<Graphic>'
                + '<ExternalGraphic>';
            if (!ExternalIconId) {
                var PointIconURL = environment_1.environment.GetLayerIconURL + "/icongenerate/get/?Id=" + layer["EnergyLayerID"] + "&amp;URLType=CustomStyleIcon&amp;FillColor=" + FillColor + "&amp;IconType=" + IconType + "&amp;StrokeColor=" + StrokeColor + "&amp;SizePercent=" + SizePercent + "&amp;StrokeThicknessPercent=" + StrokeThicknessPercent + "&amp;Opacity=" + opacity;
                sld_body += '<OnlineResource type="simple" href="' + PointIconURL + '" />';
            }
            else {
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
        return sld_body;
    };
    PrivateMapLayerService_new.prototype.GetCQLFilter = function (layer) {
        var CQL_FILTER = "";
        var filterval = layer["FilterValue"];
        var isfilterval = false;
        var filter = '';
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
    };
    PrivateMapLayerService_new = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [map_service_service_1.MapServiceService,
            map_layer_info_service_1.MapLayerInfoService,
            Utility_service_1.UtilityService,
            api_service_1.ApiService,
            all_http_request_service_1.HttpRequestService,
            auth_service_1.AuthenticationService])
    ], PrivateMapLayerService_new);
    return PrivateMapLayerService_new;
}());
exports.PrivateMapLayerService_new = PrivateMapLayerService_new;
//# sourceMappingURL=private-maplayer-service_New.js.map