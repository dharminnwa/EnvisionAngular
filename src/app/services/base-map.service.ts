import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UtilityService } from './Utility.service';
import { MapServiceService } from './map-service.service';
declare var jquery: any;
declare var $: any;
declare var google: any;

@Injectable()
export class BaseMapService {


  constructor(
    private _api: ApiService,
    private UtilityService: UtilityService,
    private MapServiceService: MapServiceService,
  ) { }

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
  setBasemap(activeBaseMap: any, zoom = 0) {
    let map = this.MapServiceService._mapdata.getValue();
    let MinZoom = activeBaseMap.MinZoom == null ? 4 : activeBaseMap.MinZoom;
    let maxzoom = activeBaseMap.MaxZoom == null ? 21 : activeBaseMap.MaxZoom
    if (activeBaseMap.Name != "Google Hybrid") {
      var wmsOptions = {
        getTileUrl: (tile, zoom) => {
          if (activeBaseMap.IsExtendedWMS != null && activeBaseMap.IsExtendedWMS == true) {
            var baseLayer = activeBaseMap.Layers.replace("BaseMaps:", "");
            return this._NodeGetWMSBaseMaptileUrl(baseLayer, "", tile, zoom, "", this.MapServiceService._mapdata.getValue());
          }
          else {
            if (activeBaseMap.Name == "Bing Maps Hybrid" || activeBaseMap.Name == "Bing Maps Road") {
              let basemapURL = activeBaseMap.TileSources.replace("https", "http");
              return this.gettileUrl(tile, zoom, basemapURL);
            } else {
              return this.gettileUrl(tile, zoom, activeBaseMap.TileSources);
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
        if (map.setMapTypeId)
          map.setMapTypeId('basemap');
      }
    } else {
      if (map && map.setMapTypeId)
        map.setMapTypeId("hybrid");
    }
    setTimeout(() => {
      if (zoom > 0) {
        let center = { lat: 39.5, lng: -98.35 };
        var myOptions = {
          zoom: 5,
          center: center,
          tile: 0
        };
        map.setOptions(myOptions);
      }
    }, 500);
  }



  gettileUrl(tile, zoom, url) {
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
  }
  quad(column, row, zoom, base) {
    var key = "";
    for (var i = 1; i <= zoom; i++) {
      key += (((row >> zoom - i) & 1) << 1) | ((column >> zoom - i) & 1);
    }
    return base.replace("{0}", key);
  }

  CheckValidUrl(url: any) {
    var splittedURls = url.split('http');
    if (splittedURls != null && splittedURls != undefined && splittedURls.length > 2) {
      var firstLink = url.indexOf(';');
      url = url.substring(firstLink, 0);
    }
    return url;
  }
  public _NodeGetWMSBaseMaptileUrl(layer, style, tile, zoom, CQL_FILTER, _mapdata) {

    let bbox = this.UtilityService.getBbox(zoom, tile, _mapdata);
    if (!CQL_FILTER) {
      CQL_FILTER = "&CQL_FILTER=" + CQL_FILTER;
    }
    let EndPoint = this._api._NodeGeoserverGetBasemap + "bbox=" + bbox + (layer ? '&layer=' + layer : '') + CQL_FILTER;
    return EndPoint;
  }

}
