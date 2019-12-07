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
require("rxjs/Rx");
var map_service_service_1 = require("./map-service.service");
var Rx_1 = require("rxjs/Rx");
var MesureDistanceService = (function () {
    function MesureDistanceService(mapService) {
        this.mapService = mapService;
        this.DistanceLatLngs = new Rx_1.BehaviorSubject(null);
        this.AreaLatLngs = new Rx_1.BehaviorSubject(null);
    }
    MesureDistanceService.prototype.DrawToolsForMesureDistance = function () {
        var _this = this;
        var map = this.mapService._mapdata.getValue();
        var drawingDistance;
        drawingDistance = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYLINE,
            drawingControl: false,
            polylineOptions: {
                clickable: true,
                strokeColor: 'red',
                strokeOpacity: 1.0
            },
            map: map
        });
        var distanceTool = {
            DrawingTool: drawingDistance,
            AllOverLayers: [],
            DrawingManagerId: 0
        };
        this.mapService.setDrawingToolDistance(distanceTool);
        drawingDistance.setMap(map);
        if (drawingDistance) {
            // google.maps.event.addListener(drawingDistance, 'click', (e) => {
            //     console.log('clicked');
            // });
            google.maps.event.addListener(drawingDistance, 'overlaycomplete', function (e) {
                var drawingToolDistance = _this.mapService._drawingToolForDistance.getValue();
                drawingToolDistance.AllOverLayers.push({ Id: drawingToolDistance.DrawingManagerId, Overlay: e.overlay });
                drawingToolDistance.DrawingManagerId = drawingToolDistance.DrawingManagerId + 1;
                _this.SetDistanceData(e.overlay.getPath().getArray());
                var newShape = e.overlay;
                newShape.type = e.type;
                google.maps.event.addListener(newShape.getPath(), 'set_at', function () {
                    _this.SetDistanceData(newShape.getPath().getArray());
                });
                google.maps.event.addListener(newShape.getPath(), 'insert_at', function () {
                    _this.SetDistanceData(newShape.getPath().getArray());
                });
                google.maps.event.addListener(newShape.getPath(), 'remove_at', function () {
                    _this.SetDistanceData(newShape.getPath().getArray());
                });
            });
        }
    };
    MesureDistanceService.prototype.DrawToolsForMesureArea = function () {
        var _this = this;
        var map = this.mapService._mapdata.getValue();
        var drawingArea;
        drawingArea = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: false,
            polygonOptions: {
                clickable: true,
                strokeColor: 'red',
                strokeOpacity: 1.0
            },
            map: map
        });
        var areaTool = {
            DrawingTool: drawingArea,
            AllOverLayers: [],
            DrawingManagerId: 0
        };
        this.mapService.setDrawingToolArea(areaTool);
        drawingArea.setMap(map);
        if (drawingArea) {
            google.maps.event.addListener(drawingArea, 'overlaycomplete', function (e) {
                var drawingToolArea = _this.mapService._drawingToolForArea.getValue();
                drawingToolArea.AllOverLayers.push({ Id: drawingToolArea.DrawingManagerId, Overlay: e.overlay });
                drawingToolArea.DrawingManagerId = drawingToolArea.DrawingManagerId + 1;
                _this.SetAreaData(e.overlay.getPath().getArray());
                var newShape = e.overlay;
                newShape.type = e.type;
                google.maps.event.addListener(newShape.getPath(), 'set_at', function () {
                    _this.SetAreaData(newShape.getPath().getArray());
                });
                google.maps.event.addListener(newShape.getPath(), 'insert_at', function () {
                    _this.SetAreaData(newShape.getPath().getArray());
                });
                google.maps.event.addListener(newShape.getPath(), 'remove_at', function () {
                    _this.SetAreaData(newShape.getPath().getArray());
                });
            });
        }
    };
    MesureDistanceService.prototype.CloseDrawToolsForDistance = function () {
        if (this.mapService._drawingToolForDistance.getValue()) {
            var drawingToolDistance = this.mapService._drawingToolForDistance.getValue();
            if (drawingToolDistance && drawingToolDistance.DrawingTool && drawingToolDistance.DrawingTool.getMap()) {
                drawingToolDistance.DrawingTool.setDrawingMode(null);
                drawingToolDistance.DrawingTool.setMap(null);
                drawingToolDistance.DrawingTool = null;
                if (drawingToolDistance.AllOverLayers.length > 0) {
                    for (var _i = 0, _a = drawingToolDistance.AllOverLayers; _i < _a.length; _i++) {
                        var overLayer = _a[_i];
                        if (overLayer.Overlay.getMap())
                            overLayer.Overlay.setMap(null);
                    }
                }
                this.mapService._drawingToolForDistance.getValue().AllOverLayers = [];
                this.mapService._drawingToolForDistance.getValue().DrawingManagerId = 0;
            }
        }
    };
    MesureDistanceService.prototype.CloseDrawToolsForArea = function () {
        if (this.mapService._drawingToolForArea.getValue()) {
            var drawingToolArea = this.mapService._drawingToolForArea.getValue();
            if (drawingToolArea && drawingToolArea.DrawingTool && drawingToolArea.DrawingTool.getMap()) {
                drawingToolArea.DrawingTool.setDrawingMode(null);
                drawingToolArea.DrawingTool.setMap(null);
                drawingToolArea.DrawingTool = null;
                if (drawingToolArea.AllOverLayers.length > 0) {
                    for (var _i = 0, _a = drawingToolArea.AllOverLayers; _i < _a.length; _i++) {
                        var overLayer = _a[_i];
                        if (overLayer.Overlay.getMap())
                            overLayer.Overlay.setMap(null);
                    }
                }
                this.mapService._drawingToolForArea.getValue().AllOverLayers = [];
                this.mapService._drawingToolForArea.getValue().DrawingManagerId = 0;
            }
        }
    };
    MesureDistanceService.prototype.SetDistanceData = function (latLngs) {
        this.DistanceLatLngs.next(latLngs);
        this.ClearAllDistanceLines();
    };
    MesureDistanceService.prototype.SetAreaData = function (latLngs) {
        this.AreaLatLngs.next(latLngs);
        this.ClearAllAreaLines();
    };
    MesureDistanceService.prototype.ClearAllDistanceLines = function () {
        var drawingToolDistance = this.mapService._drawingToolForDistance.getValue();
        if (drawingToolDistance.AllOverLayers.length > 1) {
            var index = 0;
            for (var _i = 0, _a = drawingToolDistance.AllOverLayers; _i < _a.length; _i++) {
                var overLayer = _a[_i];
                if (index == 0) {
                    if (overLayer.Overlay.getMap()) {
                        overLayer.Overlay.setMap(null);
                        drawingToolDistance.AllOverLayers.splice(0, 1);
                    }
                }
                index++;
            }
        }
    };
    MesureDistanceService.prototype.ClearAllAreaLines = function () {
        var drawingToolArea = this.mapService._drawingToolForArea.getValue();
        if (drawingToolArea.AllOverLayers.length > 1) {
            var index = 0;
            for (var _i = 0, _a = drawingToolArea.AllOverLayers; _i < _a.length; _i++) {
                var overLayer = _a[_i];
                if (index == 0) {
                    if (overLayer.Overlay.getMap()) {
                        overLayer.Overlay.setMap(null);
                        drawingToolArea.AllOverLayers.splice(0, 1);
                    }
                }
                index++;
            }
        }
    };
    MesureDistanceService.prototype.getDistanceData = function () {
        return this.DistanceLatLngs;
    };
    MesureDistanceService.prototype.getAreaData = function () {
        return this.AreaLatLngs;
    };
    MesureDistanceService.prototype.MesureDistance = function (data) {
        console.log(data);
        if (data && data.length > 1) {
            var distance = google.maps.geometry.spherical.computeDistanceBetween(data[0], data[1]);
            console.log(distance);
        }
    };
    MesureDistanceService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [map_service_service_1.MapServiceService])
    ], MesureDistanceService);
    return MesureDistanceService;
}());
exports.MesureDistanceService = MesureDistanceService;
//# sourceMappingURL=mesure-distance.service.js.map