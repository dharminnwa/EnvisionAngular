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
var router_1 = require("@angular/router");
var message_service_1 = require("../@pages/components/message/message.service");
var constants_1 = require("../models/constants");
var localdata_service_1 = require("./localdata.service");
var UtilityService = (function () {
    function UtilityService(router, messageService, LocalDataService) {
        this.router = router;
        this.messageService = messageService;
        this.LocalDataService = LocalDataService;
        this.isSubscriberCreated = false;
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
    }
    UtilityService.prototype.getBbox = function (zoom, tile, map) {
        var projection = map.getProjection();
        var zpow = Math.pow(2, zoom);
        var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
        var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
        var ulw = projection.fromPointToLatLng(ul);
        var lrw = projection.fromPointToLatLng(lr);
        var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
        //bbox = ulw.lng() + "," + ulw.lat() + "," + lrw.lng() + "," + lrw.lat();
        return bbox;
    };
    UtilityService.prototype.getExternalURLBbox = function (zoom, tile, map, Projection) {
        var projection = map.getProjection();
        var zpow = Math.pow(2, zoom);
        var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
        var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
        var ulw = projection.fromPointToLatLng(ul);
        var lrw = projection.fromPointToLatLng(lr);
        var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
        var southwest1 = {
            lat: ulw.lat(),
            lng: ulw.lng()
        };
        var northeast1 = {
            lat: lrw.lat(),
            lng: lrw.lng()
        };
        var southwest = Projection.project(southwest1);
        var northeast = Projection.project(northeast1);
        var xmin = southwest.x.toFixed(4);
        var ymin = southwest.y.toFixed(4);
        var xmax = northeast.x.toFixed(4);
        var ymax = northeast.y.toFixed(4);
        bbox = xmin + "," + ymin + "," + xmax + "," + ymax;
        return bbox;
    };
    UtilityService.prototype.getgooleMapBbox_New = function (map) {
        var bounds = map.getBounds();
        var southwest = bounds.getSouthWest();
        var northeast = bounds.getNorthEast();
        var xmin = "0";
        var ymin = "0";
        var xmax = "0";
        var ymax = "0";
        xmin = southwest.lng().toFixed(6);
        ymin = southwest.lat().toFixed(6);
        xmax = northeast.lng().toFixed(6);
        ymax = northeast.lat().toFixed(6);
        if (xmin.toString().indexOf("-") == -1) {
            xmin = "-" + xmin;
        }
        if (xmax.toString().indexOf("-") == -1) {
            xmax = "-" + xmax;
        }
        var formattedBounds = xmin + ',' + ymin + ',' + xmax + ',' + ymax;
        var bounds = map.getBounds();
        var ne = bounds.getNorthEast(); // LatLng of the north-east corner
        var sw = bounds.getSouthWest();
        var nw = new google.maps.LatLng(ne.lat(), sw.lng());
        var se = new google.maps.LatLng(sw.lat(), ne.lng());
        xmin = se.lng().toFixed(6);
        ymin = se.lat().toFixed(6);
        xmax = nw.lng().toFixed(6);
        ymax = nw.lat().toFixed(6);
        var formattedBounds1 = xmin + ',' + ymin + ',' + xmax + ',' + ymax;
        console.log("bbox :=" + formattedBounds1);
        return formattedBounds1;
    };
    UtilityService.prototype.formateofbbox = function (bounds) {
        var x1, x2, y1, y2;
        var southwest = bounds.getSouthWest();
        var northeast = bounds.getNorthEast();
        x1 = southwest.lng();
        y1 = southwest.lat();
        x2 = northeast.lng();
        y2 = northeast.lat();
        var bbox = x1 + "," + y1 + "," + x2 + "," + y2;
        if (x1 > 160 && x1 < 180)
            x1 = Math.abs(x1) * -1;
        else if (x1 > 140 && x1 < 160) {
            x1 = x1 + 55;
            x1 = Math.abs(x1) * -1;
        }
        else if (x1 > 130 && x1 < 140) {
            x1 = x1 - 10;
            x1 = Math.abs(x1) * -1;
        }
        else if (x1 > 120 && x1 < 130) {
            x1 = x1 + 100;
            x1 = Math.abs(x1) * -1;
        }
        else if (x1 > 110 && x1 < 120) {
            x1 = x1 + 120;
            x1 = Math.abs(x1) * -1;
        }
        else if (x1 > 100 && x1 < 110) {
            x1 = x1 + 150;
            x1 = Math.abs(x1) * -1;
        }
        else if (x1 > 90 && x1 < 100) {
            x1 = x1 + 170;
            x1 = Math.abs(x1) * -1;
        }
        else if (x1 > 80 && x1 < 90) {
            x1 = x1 + 200;
            x1 = Math.abs(x1) * -1;
        }
        else if (x1 > 70 && x1 < 80) {
            x1 = x1 + 220;
            x1 = Math.abs(x1) * -1;
        }
        else if (x1 > 60 && x1 < 70) {
            x1 = x1 + 235;
            x1 = Math.abs(x1) * -1;
        }
        else if (x1 > 50 && x1 < 60) {
            x1 = x1 + 250;
            x1 = Math.abs(x1) * -1;
        }
        else if (x1 > 40 && x1 < 50) {
            x1 = x1 + 280;
            x1 = Math.abs(x1) * -1;
        }
        else if (x1 > 30 && x1 < 40) {
            x1 = x1 + 300;
            x1 = Math.abs(x1) * -1;
        }
        else if (x1 > 20 && x1 < 30) {
            x1 = x1 + 320;
            x1 = Math.abs(x1) * -1;
        }
        else if (x1 > 10 && x1 < 20) {
            x1 = x1 + 330;
            x1 = Math.abs(x1) * -1;
        }
        var bbox = x1 + "," + y1 + "," + x2 + "," + y2;
        return bbox;
    };
    UtilityService.prototype.getgooleMapBbox = function (map) {
        //if(map.getZoom() == 4)
        var bounds = this.getBoundsFromMapCurrentPosition(map);
        //else
        //var bounds = map.getBounds();
        return this.formateofbbox(bounds);
    };
    UtilityService.prototype.getBoundsFromMapCurrentPosition = function (map) {
        var p = map.getProjection();
        if (!p)
            return undefined;
        //var d = $(div || this.getDiv());
        var zf = Math.pow(2, map.getZoom()) * 2;
        var dw = map.getDiv().offsetWidth / zf;
        var dh = map.getDiv().offsetHeight / zf;
        var cpx = p.fromLatLngToPoint(map.getCenter());
        return new google.maps.LatLngBounds(p.fromPointToLatLng(new google.maps.Point(cpx.x - dw, cpx.y + dh)), p.fromPointToLatLng(new google.maps.Point(cpx.x + dw, cpx.y - dh)));
    };
    UtilityService.prototype.GetInfoBoxBbox = function (mapA, center, x, y) {
        var zoom = mapA.getZoom();
        var scale = Math.pow(2, zoom);
        var proj = mapA.getProjection();
        var wc = proj.fromLatLngToPoint(center);
        var bounds = new google.maps.LatLngBounds();
        var sw = new google.maps.Point(wc.x - (4 / scale), wc.y - (4 / scale));
        var swPro = proj.fromPointToLatLng(sw);
        bounds.extend(swPro);
        var ne = new google.maps.Point(wc.x + (4 / scale), wc.y + (4 / scale));
        var nePro = proj.fromPointToLatLng(ne);
        bounds.extend(nePro);
        var Bbox = swPro.lng() + "," + nePro.lat() + "," + nePro.lng() + "," + swPro.lat();
        return Bbox;
    };
    UtilityService.prototype.GetBboxForInfoBox_New = function (map, latitude, longitude, location, LayerType) {
        if (LayerType === void 0) { LayerType = undefined; }
        var p = map.getProjection();
        if (!p)
            return undefined;
        //var d = $(div || this.getDiv());
        var zf = Math.pow(2, map.getZoom()) * 2;
        var dw = 7 / zf;
        var dh = 7 / zf;
        if (LayerType == 'Area') {
            dw = 5 / zf;
            dh = 5 / zf;
        }
        else if (LayerType == 'Point') {
            dw = 12.5 / zf;
            dh = 12.5 / zf;
        }
        var cpx = p.fromLatLngToPoint(location.latLng);
        var bounds;
        if (LayerType == 'Point') {
            bounds = new google.maps.LatLngBounds(p.fromPointToLatLng(new google.maps.Point(cpx.x - dw, cpx.y + (dh * 2))), p.fromPointToLatLng(new google.maps.Point(cpx.x + dw, cpx.y - dh)));
        }
        else {
            bounds = new google.maps.LatLngBounds(p.fromPointToLatLng(new google.maps.Point(cpx.x - dw, cpx.y + dh)), p.fromPointToLatLng(new google.maps.Point(cpx.x + dw, cpx.y - dh)));
        }
        return this.formateofbbox(bounds);
    };
    UtilityService.prototype.drawRect = function (map, lat, lng, width, height, color) {
        var NORTH = 0;
        var WEST = -90;
        var SOUTH = 180;
        var EAST = 90;
        var center = new google.maps.LatLng(lat, lng);
        var north = new google.maps.geometry.spherical.computeOffset(center, height / 2, NORTH);
        var south = new google.maps.geometry.spherical.computeOffset(center, height / 2, SOUTH);
        var northEast = new google.maps.geometry.spherical.computeOffset(north, width / 2, EAST);
        var northWest = new google.maps.geometry.spherical.computeOffset(north, width / 2, WEST);
        var southEast = new google.maps.geometry.spherical.computeOffset(south, width / 2, EAST);
        var southWest = new google.maps.geometry.spherical.computeOffset(south, width / 2, WEST);
        var corners = [northEast, northWest, southWest, southEast];
        var bbox = corners[0].lng() + "," + corners[0].lat() + "," + corners[2].lng() + "," + corners[2].lat();
        return bbox;
    };
    UtilityService.prototype.GetExternalLayerBboxForInfoBox = function (map, latitude, longitude, location, Projection) {
        var p = map.getProjection();
        if (!p)
            return undefined;
        var zf = Math.pow(2, map.getZoom()) * 2;
        var dw = 5 / zf;
        var dh = 5 / zf;
        var cpx = p.fromLatLngToPoint(location.latLng);
        //var cpx = Projection.latLngToPoint({ lng: location.latLng.lng(), lat: location.latLng.lat() })
        var bounds = new google.maps.LatLngBounds(p.fromPointToLatLng(new google.maps.Point(cpx.x - dw, cpx.y + dh)), p.fromPointToLatLng(new google.maps.Point(cpx.x + dw, cpx.y - dh)));
        // var bounds = new google.maps.LatLngBounds(
        //     Projection.pointToLatLng(new google.maps.Point(cpx.x - dw, cpx.y + dh)),
        //     Projection.pointToLatLng(new google.maps.Point(cpx.x + dw, cpx.y - dh)));
        //var bounds = L.latLngBounds(Projection.pointToLatLng(L.point(cpx.x - dw, cpx.y + dh)), Projection.pointToLatLng(L.point(cpx.x + dw, cpx.y - dh)))
        var ulw = bounds.getSouthWest();
        var lrw = bounds.getNorthEast();
        // var ulw = bounds._southWest;
        // var lrw = bounds._northEast;
        var southwest1 = {
            lat: ulw.lat(),
            lng: ulw.lng()
        };
        var northeast1 = {
            lat: lrw.lat(),
            lng: lrw.lng()
        };
        // var southwest1 = {
        //     lat: ulw.lat,
        //     lng: ulw.lng
        // }
        // var northeast1 = {
        //     lat: lrw.lat,
        //     lng: lrw.lng
        // }
        var southwest = Projection.project(southwest1);
        var northeast = Projection.project(northeast1);
        var xmin = southwest.x.toFixed(6);
        var ymin = southwest.y.toFixed(6);
        var xmax = northeast.x.toFixed(6);
        var ymax = northeast.y.toFixed(6);
        return xmin + "," + ymin + "," + xmax + "," + ymax;
    };
    UtilityService.prototype.GetBboxForInfoBox_old = function (mapA, latitude, longitude) {
        //var p = Math.pow(2, (21 - mapA.getZoom()));
        var p = Math.pow(2, (mapA.getZoom()));
        //var p = mapA.getZoom();
        var radiusTemp = p * 600.497220 * 0.0040;
        var pi = 3.1416;
        var R = 63710009;
        var radius = radiusTemp;
        var x1 = longitude - (180 / pi) * (radius / R / Math.cos((pi / 180) * latitude));
        var x2 = longitude + (180 / pi) * (radius / R / Math.cos((pi / 180) * latitude));
        var y1 = latitude + (180 / pi) * (radius / R);
        var y2 = latitude - (180 / pi) * (radius / R);
        var Bbox2 = x1 + "," + y2 + "," + x2 + "," + y1;
        return Bbox2;
    };
    UtilityService.prototype.GetBboxForInfoBoxNew = function (mapA, center, x, y) {
        var zoom = mapA.getZoom();
        var scale = Math.pow(2, zoom);
        var proj = mapA.getProjection();
        var wc = proj.fromLatLngToPoint(center);
        var bounds = new google.maps.LatLngBounds();
        var sw = new google.maps.Point(wc.x - (4 / scale), wc.y - (4 / scale));
        var swPro = proj.fromPointToLatLng(sw);
        bounds.extend(swPro);
        var ne = new google.maps.Point(wc.x + (4 / scale), wc.y + (4 / scale));
        var nePro = proj.fromPointToLatLng(ne);
        bounds.extend(nePro);
        var Bbox = swPro.lng() + "," + nePro.lat() + "," + nePro.lng() + "," + swPro.lat();
        return Bbox;
    };
    UtilityService.prototype.GetHexValueWithAlpha = function (color) {
        color = color.replace('#', '');
        if (color.length == 8) {
            color = color.substring(2);
        }
        return color;
    };
    UtilityService.prototype.getIconType = function (iconName) {
        var icon = "";
        switch (iconName) {
            case "IndustrialPlant":
            case "GasProcessingPlant":
            case "HalfSquare":
            case "Circle":
            case "LNGTerminal":
            case "OilDerrick":
            case "Point":
            case "LPGFractionator":
            case "Rectangle":
            case "Mine":
            case "Rhombus":
            case "NaturalGasMarketingHub":
            case "TriangleUp":
            case "Refinery":
            case "TriangleDown":
            case "Storage":
            case "TriangleRight":
            case "TruckUnloader":
            case "TriangleLeft":
            case "UndergroundStorage":
            case "Pentagon":
            case "Airport":
            case "Pentagram":
            case "BullsEye":
            case "AsphaltRefinery":
            case "CheckeredCircle":
            case "ChemicalPlant":
            case "CheckeredSquare":
            case "DehydrationPlant":
            case "Pointer":
            case "DeliveryPoint":
            case "HalfCircle":
            case "ExternalIcon":
                icon = "Point";
                break;
            case "Area":
                icon = "Area";
                break;
            case "Line":
            case "None":
            case "DashLine":
                icon = "Line";
                break;
            default:
                icon = iconName;
                break;
        }
        return icon;
    };
    UtilityService.prototype.CheckIcontype = function (layer) {
        var IconType = layer["IconType"];
        if (layer["RepresentationType"] == null) {
            IconType = this.getIconType(IconType);
            if (IconType == 'Circle') {
                layer["RepresentationType"] = "Point";
            }
            else if (IconType == 'Line') {
                layer["RepresentationType"] = "Line";
            }
            else if (IconType == 'Rectangle') {
                layer["RepresentationType"] = "Area";
            }
            else if (IconType == 'RoundedRectangle') {
                layer["RepresentationType"] = "Area";
            }
            else {
                layer["RepresentationType"] = IconType;
            }
        }
        return layer;
    };
    UtilityService.prototype.GetChildNodeData = function (treeData) {
        var nodeList = [];
        // var treeData = this.TreeNodes.getValue();
        if (treeData != null && treeData.length > 0) {
            for (var i = 0; i < treeData.length; i++) {
                if (treeData[i].children != undefined && treeData[i].children.length > 0) {
                    for (var j = 0; j < treeData[i].children.length; j++) {
                        if (treeData[i].children[j].children != undefined && treeData[i].children[j].children.length > 0) {
                            for (var k = 0; k < treeData[i].children[j].children.length; k++) {
                                if (treeData[i].children[j].children[k].children != undefined) {
                                    if (treeData[i].children[j].children[k].children.length > 0) {
                                        for (var l = 0; l < treeData[i].children[j].children[k].children.length; l++) {
                                            if (treeData[i].children[j].children[k].LayerType == "GroupLayer")
                                                treeData[i].children[j].children[k].children[l]['ParentLayerName'] = treeData[i].children[j].children[k].Name;
                                            nodeList.push(treeData[i].children[j].children[k].children[l]);
                                        }
                                    }
                                }
                                else {
                                    if (treeData[i].children[j].LayerType == "GroupLayer")
                                        treeData[i].children[j].children[k]['ParentLayerName'] = treeData[i].children[j].Name;
                                    nodeList.push(treeData[i].children[j].children[k]);
                                }
                            }
                        }
                        else {
                            if (treeData[i].LayerType == "GroupLayer")
                                treeData[i].children[j]['ParentLayerName'] = treeData[i].Name;
                            nodeList.push(treeData[i].children[j]);
                        }
                    }
                }
                else {
                    nodeList.push(treeData[i]);
                }
            }
            // setTimeout(() => {
            //     this._TreeUI.getValue().treeModel.update();
            // }, 500);
        }
        return nodeList;
    };
    UtilityService.prototype.GetDefaultExternalIcon = function (externalId) {
        var URL = "";
        externalId = parseInt(externalId);
        switch (externalId) {
            case 53:
            case 55:
            case 56:
            case 88:
            case 89:
            case 90:
            case 91:
            case 92:
            case 93:
            case 94:
            case 95:
            case 96:
            case 97:
            case 98:
            case 99:
            case 103:
            case 105:
            case 107:
            case 113:
                URL = this.ImageURLPath + "01)AngularEnvision%20Images/ExternalIconId/" + externalId + ".png";
                break;
        }
        return URL;
    };
    UtilityService.prototype.GetHexColorValue = function (hexCode) {
        var color = "";
        var len = parseInt(hexCode.length);
        if (len == 8) {
            color = hexCode.substr(2);
        }
        else if (len == 9) {
            color = hexCode.substr(3);
        }
        return color;
    };
    UtilityService.prototype.GetXMLLabelstyle = function (labelvalue, shape) {
        var labelpoint = '<FeatureTypeStyle>'
            + '<Rule>'
            + '<TextSymbolizer>';
        if (shape == "Point" || shape == "Area") {
            labelpoint += '<Geometry>'
                + '<Function name="centroid" xmlns="http://www.opengis.net/ogc">'
                + '<PropertyName>the_geom</PropertyName>'
                + '</Function>'
                + '</Geometry>';
        }
        labelpoint += '<Label>'
            + '<PropertyName xmlns="http://www.opengis.net/ogc">' + labelvalue + '</PropertyName>'
            + '</Label>'
            + '<Font>'
            + '<CssParameter name="font-size">10</CssParameter>'
            + '<CssParameter name="font-family">Arial</CssParameter>'
            + '<CssParameter name="font-style">Normal</CssParameter>'
            + '<CssParameter name="font-weight">Normal</CssParameter>'
            + '</Font>';
        if (shape == "Point") {
            labelpoint += '<LabelPlacement><PointPlacement/></LabelPlacement>';
        }
        if (shape == "Line") {
            labelpoint += '<LabelPlacement><LinePlacement/></LabelPlacement>';
        }
        if (shape == "Area") {
            labelpoint += '<LabelPlacement><AreaPlacement/></LabelPlacement>';
        }
        labelpoint += '<Halo>'
            + '<Radius>1</Radius>'
            + '<Fill>'
            + '<CssParameter name="fill">#FFFFFF</CssParameter>'
            + '</Fill>'
            + '</Halo>'
            + '<Fill>'
            + '<CssParameter name="fill">#000000</CssParameter>'
            + '</Fill>'
            + '<VendorOption name="followLine"/>'
            + '<VendorOption name="group">yes</VendorOption>'
            + '<VendorOption name="spaceAround">0</VendorOption>'
            + '<VendorOption name="maxDisplacement">300</VendorOption>'
            + '<VendorOption name="repeat">750</VendorOption>'
            + '</TextSymbolizer>'
            + '</Rule>'
            + '</FeatureTypeStyle>';
        return labelpoint;
    };
    UtilityService.prototype.GetTwoRendomeCharacter = function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < 2; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };
    //#region Create Layer Tools
    UtilityService.prototype.getRandomColor = function () {
        var letters = '0123456789ABCDEF';
        var color = '';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    //#endregion
    UtilityService.prototype.ddToDms = function (lat, lng) {
        var lat = lat;
        var lng = lng;
        var latResult, lngResult, dmsResult;
        lat = parseFloat(lat);
        lng = parseFloat(lng);
        // Call to getDms(lat) function for the coordinates of Latitude in DMS.
        // The result is stored in latResult variable.
        latResult = this.getDms(lat);
        latResult += (lat >= 0) ? ' N' : ' S';
        // Call to getDms(lng) function for the coordinates of Longitude in DMS.
        // The result is stored in lngResult variable.
        lngResult = this.getDms(lng);
        lngResult += (lng >= 0) ? ' E ' : ' W';
        // Joining both variables and separate them with a space.
        dmsResult = latResult + ' ' + lngResult;
        // Return the resultant string
        return dmsResult;
    };
    UtilityService.prototype.getDms = function (val) {
        var valDeg, valMin, valSec, result;
        val = Math.abs(val);
        valDeg = Math.floor(val);
        result = valDeg + "ยบ";
        valMin = Math.floor((val - valDeg) * 60);
        result += valMin + "'";
        valSec = Math.round((val - valDeg - valMin / 60) * 3600 * 1000) / 1000;
        result += valSec + '"';
        return result;
    };
    UtilityService.prototype.closeAllPopupmodalbaseonclass = function () {
        var Closemodal = document.getElementsByClassName('ClosePopupmodal');
        if (Closemodal.length > 0) {
            for (var c in Closemodal) {
                if (Closemodal[c].id) {
                    var Closebtn = document.getElementById(Closemodal[c].id);
                    Closebtn.click();
                }
            }
        }
    };
    UtilityService.prototype.setTableAndfiltervalueinEnergyLayers = function (index) {
        if (index["TableName"] == "69-138 kV") {
            index["TableName"] = this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpowerlines : '';
        }
        if (index["FilterValue"] == "69-138 kV") {
            index["FilterValue"] = 'VOLT_CAT#LIKE#69-138 kV';
        }
        if (index["TableName"] == "Pipe_Crude_Transmission" && index["DisplayName"] == "Crude Gathering Pipelines") {
            index["TableName"] = this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpipelines : '';
            index["FilterValue"] = 'LINETYPE#LIKE#Gathering';
        }
        if (index["TableName"] == "Pipe_NG_Local" && index["DisplayName"] == "Natural Gas Local Distribution Pipelines") {
            index["TableName"] = this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpipelines : '';
            index["FilterValue"] = 'LINETYPE#LIKE#Local';
        }
        if (index["TableName"] == "Pipe_Crude_Gathering" && index["DisplayName"] == "Crude Gathering Pipelines") {
            index["TableName"] = this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpipelines : '';
            index["FilterValue"] = 'LINETYPE#LIKE#Gathering';
        }
        if (index["TableName"] == "Pipe_NG_Gathering" && index["DisplayName"] == "Natural Gas Gathering Pipelines") {
            index["TableName"] = this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpipelines : '';
            index["FilterValue"] = 'LINETYPE#LIKE#Gathering';
        }
        return index;
    };
    UtilityService.prototype.setTableAndfiltervaluein_Private_EnergyLayers = function (index) {
        if (index["TableName"] == this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpipelines : '' && index["isPrivateLayer"] && index["DBFProperties"].indexOf('SYSNAME') >= 0) {
            index["DBFProperties"] = "MSID,OWNER,NUMOWNERS,LEASED,OPERATOR,COMMODITY,COMMODITY2,PRIMBATCH1,SECBATCH1,PRIMBATCH2,SECBATCH2,LINETYPE,SYSTEM,DIAMETER,MDIAMETER,STATUS,CORRIDOR,SEGMENTNUM,TX_T4,TX_P5,UPDATED,UPDATED_SP,METACODE,LASTOWNER,LASTOPER,MILEAGE,COUNTRY,STATE_NAME,COUNTY,RELEASE_DT,INSERVICE,systype";
            var Filterval = index["FilterValue"];
            if (Filterval) {
                var Ischanged = false;
                if (Filterval.indexOf("OWNER=") >= 0) {
                    Filterval = Filterval.replace("OWNER=", "OWNER#LIKE#");
                    Ischanged = true;
                }
                if (Filterval.indexOf("OPERATOR=") >= 0) {
                    Filterval = Filterval.replace("OPERATOR=", "OPERATOR#LIKE#");
                    Ischanged = true;
                }
                if (Filterval.indexOf("SYSNAME=") >= 0) {
                    Filterval = Filterval.replace("SYSNAME=", "SYSTEM#LIKE#");
                    Ischanged = true;
                }
                if (Filterval.indexOf("SYSTEM=") >= 0) {
                    Filterval = Filterval.replace("SYSTEM=", "SYSTEM#LIKE#");
                    Ischanged = true;
                }
                if (Ischanged)
                    index["FilterValue"] = Filterval;
            }
        }
        return index;
    };
    UtilityService.prototype.ConvertJsongeometryTostringGeometry = function (geometry) {
        var strgeomVal = '';
        if (geometry) {
            if (geometry.type == "Point") {
                strgeomVal = 'POINT(' + geometry.coordinates[0] + ' ' + geometry.coordinates[1] + ')';
            }
            else if (geometry.type == "MultiLineString") {
                for (var _i = 0, _a = geometry.coordinates; _i < _a.length; _i++) {
                    var c = _a[_i];
                    for (var _b = 0, c_1 = c; _b < c_1.length; _b++) {
                        var l = c_1[_b];
                        //for (let m of l) {
                        if (strgeomVal == "") {
                            strgeomVal = "MULTILINESTRING ((" + l[0] + ' ' + l[1];
                        }
                        else {
                            strgeomVal += ", " + l[0] + ' ' + l[1];
                        }
                        //}
                    }
                }
                if (strgeomVal != "") {
                    strgeomVal += "))";
                }
            }
            else if (geometry.type.toLowerCase() == "multipolygon") {
                for (var _c = 0, _d = geometry.coordinates; _c < _d.length; _c++) {
                    var c = _d[_c];
                    for (var _e = 0, c_2 = c; _e < c_2.length; _e++) {
                        var l = c_2[_e];
                        for (var _f = 0, l_1 = l; _f < l_1.length; _f++) {
                            var m = l_1[_f];
                            if (strgeomVal == "") {
                                strgeomVal = "MULTIPOLYGON (((" + m[0] + ' ' + m[1];
                            }
                            else {
                                strgeomVal += ", " + m[0] + ' ' + m[1];
                            }
                        }
                    }
                }
                if (strgeomVal != "") {
                    strgeomVal += ")))";
                }
            }
        }
        return btoa(strgeomVal);
    };
    UtilityService.prototype.format = function (n, decimal) {
        if (!isNaN(decimal))
            return parseFloat(n).toFixed(decimal).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
        else
            return n;
    };
    UtilityService.prototype.toProperCase = function (str) {
        var noCaps = ['of', 'a', 'the', 'and', 'an', 'am', 'or', 'nor', 'but', 'is', 'if', 'then',
            'else', 'when', 'at', 'from', 'by', 'on', 'off', 'for', 'in', 'out', 'to', 'into', 'with'];
        return str.replace(/\w\S*/g, function (txt, offset) {
            if (offset != 0 && noCaps.indexOf(txt.toLowerCase()) != -1) {
                return txt.toLowerCase();
            }
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
    UtilityService.prototype.ActiveLayerData = function (Layerid, chkIdname) {
        try {
            setTimeout(function () {
                var Treeecheckboxlement = document.getElementById(Layerid + chkIdname);
                if (Treeecheckboxlement == null) {
                    setTimeout(function () {
                        if (Treeecheckboxlement != null) {
                            Treeecheckboxlement.click();
                        }
                        else {
                            setTimeout(function () {
                                if (Treeecheckboxlement != null)
                                    Treeecheckboxlement.click();
                                else {
                                    setTimeout(function () {
                                        Treeecheckboxlement.click();
                                    }, 1000);
                                }
                            }, 1000);
                        }
                    }, 1000);
                }
                else
                    Treeecheckboxlement.click();
            }, 500);
        }
        catch (error) {
            console.log(error);
        }
    };
    UtilityService.prototype.RemoveLayerData = function (Layerid, chkIdname) {
        try {
            var Treeecheckboxlement_1 = document.getElementById(Layerid + chkIdname);
            if (Treeecheckboxlement_1 == null) {
                setTimeout(function () {
                    if (Treeecheckboxlement_1 != null) {
                        Treeecheckboxlement_1.click();
                    }
                    else {
                        setTimeout(function () {
                            if (Treeecheckboxlement_1 != null)
                                Treeecheckboxlement_1.click();
                            else {
                                setTimeout(function () {
                                    Treeecheckboxlement_1.click();
                                }, 1000);
                            }
                        }, 1000);
                    }
                }, 1000);
            }
            else
                Treeecheckboxlement_1.click();
        }
        catch (error) {
            console.log(error);
        }
    };
    UtilityService.prototype.OpenClosePrivateLayerAreaOnSidebar = function (toOpen) {
        var collapsedElement = document.getElementById('privateLayerArea');
        var cc = collapsedElement.querySelector('.card-header');
        if (toOpen) {
            if (collapsedElement.children[0].getAttribute("aria-expanded") == "false")
                cc.click();
        }
        else {
            if (collapsedElement.children[0].getAttribute("aria-expanded") == "true")
                cc.click();
        }
    };
    UtilityService.prototype.OpenCloseSharedLayerAreaOnSidebar = function (toOpen) {
        var collapsedElement = document.getElementById('sharedLayerArea');
        var cc = collapsedElement.querySelector('.card-header');
        if (toOpen) {
            if (collapsedElement.children[0].getAttribute("aria-expanded") == "false")
                cc.click();
        }
        else {
            if (collapsedElement.children[0].getAttribute("aria-expanded") == "true")
                cc.click();
        }
    };
    UtilityService.prototype.OpenCloseTemporaryLayerAreaOnSidebar = function (toOpen) {
        var collapsedElement = document.getElementById('temporaryLayerArea');
        var cc = collapsedElement.querySelector('.card-header');
        if (toOpen) {
            if (collapsedElement.children[0].getAttribute("aria-expanded") == "false")
                cc.click();
        }
        else {
            if (collapsedElement.children[0].getAttribute("aria-expanded") == "true")
                cc.click();
        }
    };
    UtilityService.prototype.OpenCloseEnergyLayerAreaOnSidebar = function (toOpen) {
        var collapsedElement = document.getElementById('energyLayerArea');
        var cc = collapsedElement.querySelector('.card-header');
        if (toOpen) {
            if (collapsedElement.children[0].getAttribute("aria-expanded") == "false")
                cc.click();
        }
        else {
            if (collapsedElement.children[0].getAttribute("aria-expanded") == "true")
                cc.click();
        }
    };
    UtilityService.prototype.OpenCloseDrawToolLayerAreaOnSidebar = function (toOpen) {
        var collapsedElement = document.getElementById('drawToolArea');
        var cc = collapsedElement.querySelector('.card-header');
        if (toOpen) {
            if (collapsedElement.children[0].getAttribute("aria-expanded") == "false")
                cc.click();
        }
        else {
            if (collapsedElement.children[0].getAttribute("aria-expanded") == "true")
                cc.click();
        }
    };
    UtilityService.prototype.CloseModalOnRouteChange = function (modal) {
        var _this = this;
        if (this.isSubscriberCreated && this._routerEvents != undefined) {
            this._routerEvents.unsubscribe();
        }
        this.isSubscriberCreated = true;
        this._routerEvents = this.router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationStart) {
                var Closemodal = document.getElementsByClassName('ClosePopupmodal');
                if (Closemodal.length > 0) {
                    for (var c in Closemodal) {
                        if (Closemodal[c].id == "btnElevatClose") {
                            var Closebtn = document.getElementById(Closemodal[c].id);
                            Closebtn.click();
                        }
                    }
                }
                if (modal.dismiss != undefined)
                    modal.dismiss();
                else
                    modal.hide();
                _this._routerEvents.unsubscribe();
                _this.isSubscriberCreated = false;
                _this.closeAllPopupmodalbaseonclass();
            }
            else {
                _this.closeAllPopupmodalbaseonclass();
            }
        });
    };
    UtilityService.prototype.HovereventForMapSearchData = function () {
        $(".MainBordercolor").hover(function (e) {
            $($('.MapLayerstyle .tab-wrapper')[0]).attr('style', 'overflow: inherit !important');
        }, function (event) {
        });
    };
    UtilityService.prototype.SetDefaultIconImagestyle = function (Width, Opacity, imagesmapsearch360) {
        Width = Math.round(parseInt(Width) * 30 / 100) + "px";
        Opacity = this.GetOpacityFromPercentage(Opacity);
        setTimeout(function () {
            var ImageId = document.getElementById("pointImage");
            if (ImageId) {
                var Imagesrc = ImageId.getAttribute('src');
                if (Imagesrc) {
                    if (Imagesrc.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0 || Imagesrc.indexOf(imagesmapsearch360) >= 0) {
                        ImageId.style.opacity = "" + Opacity;
                        ImageId.style.width = Width;
                    }
                    else {
                        ImageId.style.opacity = "";
                        ImageId.style.width = "";
                    }
                }
            }
            setTimeout(function () {
                $(".CostomelayerIcon").css('width', Width);
                $(".CostomelayerIcon").css('opacity', Opacity);
                $(".CostomelayerIcon").attr('style', 'width:' + Width + " !important;opacity:" + Opacity + " !important;");
            }, 1000);
        }, 1000);
    };
    UtilityService.prototype.GetOpacityFromPercentage = function (percentage) {
        var opacityPoint = 1;
        if (parseInt(percentage) > 0) {
            opacityPoint = 1 - (parseInt(percentage) / 100);
        }
        return parseFloat(opacityPoint.toFixed(2));
    };
    UtilityService.prototype.GetAlphaValue = function (percentage) {
        var alphaValue;
        percentage = parseInt(percentage);
        switch (percentage) {
            case 100:
                alphaValue = "00";
                break;
            case 95:
                alphaValue = "1A";
                break;
            case 90:
                alphaValue = "26";
                break;
            case 85:
                alphaValue = "33";
                break;
            case 80:
                alphaValue = "40";
                break;
            case 75:
                alphaValue = "4D";
                break;
            case 70:
                alphaValue = "59";
                break;
            case 65:
                alphaValue = "66";
                break;
            case 60:
                alphaValue = "73";
                break;
            case 55:
                alphaValue = "80";
                break;
            case 50:
                alphaValue = "8C";
                break;
            case 45:
                alphaValue = "99";
                break;
            case 40:
                alphaValue = "A6";
                break;
            case 35:
                alphaValue = "B3";
                break;
            case 30:
                alphaValue = "BF";
                break;
            case 25:
                alphaValue = "CC";
                break;
            case 20:
                alphaValue = "D9";
                break;
            case 15:
                alphaValue = "E6";
                break;
            case 10:
                alphaValue = "F2";
                break;
            case 5:
            case 0:
            default:
                alphaValue = "FF";
                break;
        }
        return alphaValue;
    };
    UtilityService.prototype.SortByKeyDesc = function (array, key) {
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((y < x) ? -1 : ((y > x) ? 1 : 0));
        });
    };
    UtilityService.prototype.ConvertMapGridCqlFilterToXML_new = function (cqlFilter, columnList) {
        debugger;
        if (columnList && columnList.length > 0 && cqlFilter) {
            var xmlfilterbody = '<ArrayOfFilterSetting xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.datacontract.org/2004/07/MAPSearchEnery360.Helpers.TelerikDatagrid">';
            var xmlFilter1 = '<Filter1 i:nil="true"></Filter1>';
            var xmlFilter2 = '<Filter2 i:nil="true"></Filter2>';
            var xmlFilter3 = '<SelectedDistinctValues xmlns:d3p1="http://schemas.microsoft.com/2003/10/Serialization/Arrays"></SelectedDistinctValues>';
            var MainXMLfilter = "";
            var Operator = "And";
            for (var _i = 0, columnList_1 = columnList; _i < columnList_1.length; _i++) {
                var columnName = columnList_1[_i];
                var columnsFilter = cqlFilter.split(";");
                if (columnsFilter.length > 0) {
                    var index = 0;
                    for (var _a = 0, columnsFilter_1 = columnsFilter; _a < columnsFilter_1.length; _a++) {
                        var filter = columnsFilter_1[_a];
                        if (filter.indexOf('#OR#') >= 0 && filter.indexOf('=') >= 0 && filter.indexOf('#EQUAL#') == -1 && filter.indexOf('#NOTEQUAL#') == -1 && filter.indexOf('#LIKE#') == -1) {
                            var singleColumnMultipleValues = filter.split("#OR#");
                            var checkboxvalu = "";
                            for (var _b = 0, singleColumnMultipleValues_1 = singleColumnMultipleValues; _b < singleColumnMultipleValues_1.length; _b++) {
                                var filter = singleColumnMultipleValues_1[_b];
                                var columnValuePair = filter.split("=");
                                var filtercolumn = columnValuePair[0];
                                if (columnName == filtercolumn && columnValuePair[1]) {
                                    var value = columnValuePair[1];
                                    if (checkboxvalu) {
                                        checkboxvalu += '<d3p1:anyType xmlns:d4p1="http://www.w3.org/2001/XMLSchema" i:type="d4p1:string">' + value + '</d3p1:anyType>';
                                    }
                                    else {
                                        checkboxvalu = '<d3p1:anyType xmlns:d4p1="http://www.w3.org/2001/XMLSchema" i:type="d4p1:string">' + value + '</d3p1:anyType>';
                                    }
                                }
                            }
                            xmlFilter3 = '<SelectedDistinctValues xmlns:d3p1="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + checkboxvalu + '</SelectedDistinctValues>';
                        }
                        else if (filter.indexOf('#OR#') >= 0 || filter.indexOf('=') == -1 || filter.indexOf('#EQUAL#') >= 0 || filter.indexOf('#NOTEQUAL#') >= 0 || filter.indexOf('#LIKE#') >= 0) {
                            var singleColumnMultipleValues1 = filter.split("#OR#");
                            if (singleColumnMultipleValues1.length > 1) {
                                Operator = "Or";
                            }
                            for (var _c = 0, singleColumnMultipleValues1_1 = singleColumnMultipleValues1; _c < singleColumnMultipleValues1_1.length; _c++) {
                                var filter1 = singleColumnMultipleValues1_1[_c];
                                var spliedvalfiltyer = this.getColumnsandvaluefromgridfilter(filter1);
                                if (spliedvalfiltyer.length > 0 && columnName == spliedvalfiltyer[0] && index == 0) {
                                    xmlFilter1 = '<Filter1><IsCaseSensitive>false</IsCaseSensitive><Operator>' + spliedvalfiltyer[2] + '</Operator><Value xmlns:d4p1="http://www.w3.org/2001/XMLSchema" i:type="d4p1:string">' + spliedvalfiltyer[1] + '</Value></Filter1>';
                                }
                                else if (spliedvalfiltyer.length > 0 && columnName == spliedvalfiltyer[0] && index == 1) {
                                    xmlFilter2 = '<Filter2><IsCaseSensitive>false</IsCaseSensitive><Operator>' + spliedvalfiltyer[2] + '</Operator><Value xmlns:d4p1="http://www.w3.org/2001/XMLSchema" i:type="d4p1:string">' + spliedvalfiltyer[1] + '</Value></Filter2>';
                                }
                                index++;
                            }
                        }
                    }
                }
                if (MainXMLfilter) {
                    MainXMLfilter += '<FilterSetting><ColumnUniqueName>' + columnName + '</ColumnUniqueName><FieldFilterLogicalOperator>' + Operator + '</FieldFilterLogicalOperator>' + xmlFilter1 + xmlFilter2 + xmlFilter3 + "</FilterSetting>";
                }
                else {
                    MainXMLfilter = '<FilterSetting><ColumnUniqueName>' + columnName + '</ColumnUniqueName><FieldFilterLogicalOperator>' + Operator + '</FieldFilterLogicalOperator>' + xmlFilter1 + xmlFilter2 + xmlFilter3 + "</FilterSetting>";
                }
            }
            return '<ArrayOfFilterSetting xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.datacontract.org/2004/07/MAPSearchEnery360.Helpers.TelerikDatagrid">' + MainXMLfilter + '</ArrayOfFilterSetting>';
        }
        else {
            return "";
        }
    };
    UtilityService.prototype.getColumnsandvaluefromgridfilter = function (filter) {
        var spliedvalue = [];
        if (filter.indexOf('#EQUAL#') >= 0) {
            spliedvalue = filter.split("#EQUAL#");
            spliedvalue.push("IsEqualTo");
        }
        else if (filter.indexOf('#NOTEQUAL#') >= 0) {
            spliedvalue = filter.split("#NOTEQUAL#");
            spliedvalue.push("IsNotEqualTo");
        }
        else if (filter.indexOf('#LIKE#') >= 0) {
            spliedvalue = filter.split("#LIKE#");
            spliedvalue.push("Contains");
        }
        else if (filter.indexOf('<') >= 0) {
            spliedvalue = filter.split("<");
            spliedvalue.push("IsLessThan");
        }
        else if (filter.indexOf('<=') >= 0) {
            spliedvalue = filter.split("<=");
            spliedvalue.push("IsLessThanOrEqualToo");
        }
        else if (filter.indexOf('>') >= 0) {
            spliedvalue = filter.split(">");
            spliedvalue.push("IsGreaterThan");
        }
        else if (filter.indexOf('>=') >= 0) {
            spliedvalue = filter.split(">=");
            spliedvalue.push("IsGreaterThanOrEqualTo");
        }
        return spliedvalue;
    };
    UtilityService.prototype.ConvertMapGridCqlFilterToXML = function (cqlFilter) {
        var xmlFilter = "";
        if (cqlFilter) {
            xmlFilter += '<ArrayOfFilterSetting xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.datacontract.org/2004/07/MAPSearchEnery360.Helpers.TelerikDatagrid">';
            var columnsFilter = cqlFilter.split(";");
            if (columnsFilter.length > 0) {
                for (var _i = 0, columnsFilter_2 = columnsFilter; _i < columnsFilter_2.length; _i++) {
                    var filter = columnsFilter_2[_i];
                    xmlFilter += '<FilterSetting>';
                    var singleColumnMultipleValues = filter.split("#OR#");
                    if (singleColumnMultipleValues.length > 0) {
                        var columnValuePair = singleColumnMultipleValues[0].split("=");
                        var columnName = columnValuePair[0];
                        xmlFilter += '<ColumnUniqueName>' + columnName + '</ColumnUniqueName>';
                        xmlFilter += '<FieldFilterLogicalOperator>And</FieldFilterLogicalOperator>';
                        xmlFilter += '<Filter1 i:nil="true"/>';
                        xmlFilter += '<Filter2 i:nil="true"/>';
                        xmlFilter += '<SelectedDistinctValues xmlns:d3p1="http://schemas.microsoft.com/2003/10/Serialization/Arrays">';
                        for (var _a = 0, singleColumnMultipleValues_2 = singleColumnMultipleValues; _a < singleColumnMultipleValues_2.length; _a++) {
                            var filter = singleColumnMultipleValues_2[_a];
                            var columnValuePair = filter.split("=");
                            var value = columnValuePair[1];
                            xmlFilter += '<d3p1:anyType xmlns:d4p1="http://www.w3.org/2001/XMLSchema" i:type="d4p1:string">' + value + '</d3p1:anyType>';
                        }
                        xmlFilter += '</SelectedDistinctValues>';
                    }
                    xmlFilter += '</FilterSetting>';
                }
            }
            xmlFilter += '</ArrayOfFilterSetting>';
        }
        return xmlFilter;
    };
    UtilityService.prototype.toTitleCase = function (str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
    UtilityService.prototype.ShowErrorMsg = function (msg) {
        this.messageService.create(constants_1.NotificationColor.Danger, msg, {
            Position: constants_1.NotificationPosition.TopRight,
            Style: constants_1.NotificationStyle.Simple,
            Duration: constants_1.NotificationDuration
        });
    };
    UtilityService.prototype.ShowSuccessMsg = function (msg) {
        this.messageService.create(constants_1.NotificationColor.Success, msg, {
            Position: constants_1.NotificationPosition.TopRight,
            Style: constants_1.NotificationStyle.Simple,
            Duration: constants_1.NotificationDuration
        });
    };
    UtilityService.prototype.IsAllowedForGroupLayer = function (featureType) {
        if (featureType != '') {
            var isAccess = constants_1.AllowedValuesForGroupLayer.find(function (val) { return val == featureType; });
            if (isAccess)
                return true;
        }
        return false;
    };
    UtilityService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router, message_service_1.MessageService, localdata_service_1.LocalDataService])
    ], UtilityService);
    return UtilityService;
}());
exports.UtilityService = UtilityService;
//# sourceMappingURL=Utility.service.js.map