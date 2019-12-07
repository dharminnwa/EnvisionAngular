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
var api_service_1 = require("./api.service");
var Utility_service_1 = require("./Utility.service");
var map_service_service_1 = require("./map-service.service");
var BaseMapService = (function () {
    function BaseMapService(_api, UtilityService, MapServiceService) {
        this._api = _api;
        this.UtilityService = UtilityService;
        this.MapServiceService = MapServiceService;
    }
    // public GetWMSBaseMaptileUrl(layer, style, tile, zoom, CQL_FILTER, _mapdata) {
    //   // var projection = _mapdata.getProjection();
    //   // var zpow = Math.pow(2, zoom);
    //   // var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
    //   // var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
    //   // var ulw = projection.fromPointToLatLng(ul);
    //   // var lrw = projection.fromPointToLatLng(lr);
    //   // var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
    //   let url = "http://54.225.240.244:8080/envision/BaseMaps/wms?";
    //   let bbox = this.UtilityService.getBbox(zoom, tile, _mapdata);
    //   let version = "1.3.0";
    //   let request = "GetMap";
    //   let format = "image%2Fpng";
    //   let layers = "BaseMaps%3A" + layer;
    //   let crs = "EPSG:4326";
    //   let service = "WMS";
    //   let width = "256";
    //   let height = "256";
    //   let transparent = "true";
    //   url += "Layers=" + layers;
    //   url += "&version=" + version + "&EXCEPTIONS=INIMAGE" + "&Service=" + service + "&request=" + request + "&format=" + format + "&CRS=" + crs + "&BBOX=" + bbox + "&width=" + width + "&height=" + height + "&isBaseLayer=True&TRANSPARENT=" + transparent;
    //   if (CQL_FILTER != "")
    //     url += "&CQL_FILTER=" + CQL_FILTER;    
    //   return url;
    // }
    BaseMapService.prototype.setBasemap = function (activeBaseMap, zoom) {
        var _this = this;
        if (zoom === void 0) { zoom = 0; }
        var map = this.MapServiceService._mapdata.getValue();
        var MinZoom = activeBaseMap.MinZoom == null ? 4 : activeBaseMap.MinZoom;
        var maxzoom = activeBaseMap.MaxZoom == null ? 21 : activeBaseMap.MaxZoom;
        if (activeBaseMap.Name != "Google Hybrid") {
            var wmsOptions = {
                getTileUrl: function (tile, zoom) {
                    if (activeBaseMap.IsExtendedWMS != null && activeBaseMap.IsExtendedWMS == true) {
                        var baseLayer = activeBaseMap.Layers.replace("BaseMaps:", "");
                        return _this._NodeGetWMSBaseMaptileUrl(baseLayer, "", tile, zoom, "", _this.MapServiceService._mapdata.getValue());
                    }
                    else {
                        if (activeBaseMap.Name == "Bing Maps Hybrid" || activeBaseMap.Name == "Bing Maps Road") {
                            var basemapURL = activeBaseMap.TileSources.replace("https", "http");
                            return _this.gettileUrl(tile, zoom, basemapURL);
                        }
                        else {
                            return _this.gettileUrl(tile, zoom, activeBaseMap.TileSources);
                        }
                    }
                },
                isPng: true,
                maxZoom: maxzoom,
                minZoom: MinZoom,
                name: activeBaseMap.Name,
                tileSize: new google.maps.Size(256, 256)
            };
            var openlayersWMS = new google.maps.ImageMapType(wmsOptions);
            if (map) {
                map.mapTypes.set('basemap', openlayersWMS);
                map.setMapTypeId('basemap');
            }
        }
        else {
            map.setMapTypeId("hybrid");
        }
        setTimeout(function () {
            if (zoom > 0) {
                var center = { lat: 39.5, lng: -98.35 };
                var myOptions = {
                    zoom: 5,
                    center: center,
                    tile: 0
                };
                map.setOptions(myOptions);
            }
        }, 500);
    };
    BaseMapService.prototype.gettileUrl = function (tile, zoom, url) {
        var x = tile.x;
        var y = tile.y;
        var z = zoom;
        if (x >= 0 && y >= 0 && z >= 0) {
            var s = "";
            if (url.indexOf("{0}") > -1 && url.indexOf("{1}") > -1 && url.indexOf("{2}") > -1) {
                url = url.replace("{0}", x).replace("{1}", y).replace("{2}", z);
            }
            else if (url.indexOf("{0}") > -1)
                url = this.quad(x, y, z, url);
            url = this.CheckValidUrl(url);
            return url;
        }
        else
            return "";
    };
    BaseMapService.prototype.quad = function (column, row, zoom, base) {
        var key = "";
        for (var i = 1; i <= zoom; i++) {
            key += (((row >> zoom - i) & 1) << 1) | ((column >> zoom - i) & 1);
        }
        return base.replace("{0}", key);
    };
    BaseMapService.prototype.CheckValidUrl = function (url) {
        var splittedURls = url.split('http');
        if (splittedURls != null && splittedURls != undefined && splittedURls.length > 2) {
            var firstLink = url.indexOf(';');
            url = url.substring(firstLink, 0);
        }
        return url;
    };
    BaseMapService.prototype._NodeGetWMSBaseMaptileUrl = function (layer, style, tile, zoom, CQL_FILTER, _mapdata) {
        var bbox = this.UtilityService.getBbox(zoom, tile, _mapdata);
        if (!CQL_FILTER) {
            CQL_FILTER = "&CQL_FILTER=" + CQL_FILTER;
        }
        var EndPoint = this._api._NodeGeoserverGetBasemap + "bbox=" + bbox + (layer ? '&layer=' + layer : '') + CQL_FILTER;
        return EndPoint;
    };
    BaseMapService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [api_service_1.ApiService,
            Utility_service_1.UtilityService,
            map_service_service_1.MapServiceService])
    ], BaseMapService);
    return BaseMapService;
}());
exports.BaseMapService = BaseMapService;
//# sourceMappingURL=base-map.service.js.map