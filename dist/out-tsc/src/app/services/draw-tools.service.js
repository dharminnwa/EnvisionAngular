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
var all_http_request_service_1 = require("./all-http-request.service");
var auth_service_1 = require("./auth.service");
var environment_1 = require("../../environments/environment");
var DrawingToolService = (function () {
    function DrawingToolService(mapService, allHttpRequestService, authService) {
        this.mapService = mapService;
        this.allHttpRequestService = allHttpRequestService;
        this.authService = authService;
        this.pointTool = new Rx_1.BehaviorSubject(null);
        this.polyLineTool = new Rx_1.BehaviorSubject(null);
        this.lineTool = new Rx_1.BehaviorSubject(null);
        this.triangleTool = new Rx_1.BehaviorSubject(null);
        this.RectangleTool = new Rx_1.BehaviorSubject(null);
        this.CircleTool = new Rx_1.BehaviorSubject(null);
        this.PolygonTool = new Rx_1.BehaviorSubject(null);
        this.LabelTool = new Rx_1.BehaviorSubject(null);
        this.AllDrawingLayerList = new Rx_1.BehaviorSubject(null);
        this.AllLodedLayersOnMap = new Rx_1.BehaviorSubject(null);
        this.selectedEditLayer = new Rx_1.BehaviorSubject(null);
        this.AllEditedLayerList = new Rx_1.BehaviorSubject([]);
        this.map = this.mapService._mapdata.getValue();
        this.freehandpolygoneTool = new Rx_1.BehaviorSubject(null);
        this.freehandpolylineTool = new Rx_1.BehaviorSubject(null);
    }
    /** Start Point Tool */
    DrawingToolService.prototype.InitPoint = function (url) {
        var _this = this;
        this.map = this.mapService._mapdata.getValue();
        var drawPoint;
        drawPoint = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: false,
            markerOptions: {
                icon: { url: url }
            },
            map: this.map
        });
        var pointTool = {
            DrawingTool: drawPoint,
            AllOverPoints: [],
            DrawingManagerId: 1
        };
        this.pointTool.next(pointTool);
        drawPoint.setMap(this.map);
        if (drawPoint) {
            google.maps.event.addListener(drawPoint, 'markercomplete', function (e) {
                var position = e.position;
                var drawingToolParcelPoint = _this.pointTool.getValue();
                drawingToolParcelPoint.AllOverPoints.push({ Id: drawingToolParcelPoint.DrawingManagerId, Point: e });
                var point = {
                    DrawingItem: e,
                    DrawingManagerId: 1
                };
                _this.AllDrawingLayerList.getValue().push(point);
            });
        }
    };
    DrawingToolService.prototype.CloseDrawToolsForPoint = function () {
        if (this.pointTool.getValue()) {
            var drawingToolPoint = this.pointTool.getValue();
            if (drawingToolPoint && drawingToolPoint.DrawingTool && drawingToolPoint.DrawingTool.getMap()) {
                drawingToolPoint.DrawingTool.setDrawingMode(null);
                drawingToolPoint.DrawingTool.setMap(null);
                drawingToolPoint.DrawingTool = null;
                if (drawingToolPoint.AllOverPoints.length > 0) {
                    for (var _i = 0, _a = drawingToolPoint.AllOverPoints; _i < _a.length; _i++) {
                        var overLayer = _a[_i];
                        if (overLayer.Point.getMap())
                            overLayer.Point.setMap(null);
                    }
                }
                this.pointTool.getValue().AllOverPoints = [];
                this.pointTool.getValue().DrawingManagerId = 0;
            }
        }
    };
    DrawingToolService.prototype.DisableDrawingModeforPoint = function () {
        if (this.pointTool.getValue()) {
            var drawingToolPoint = this.pointTool.getValue();
            if (drawingToolPoint && drawingToolPoint.DrawingTool && drawingToolPoint.DrawingTool.getMap()) {
                drawingToolPoint.DrawingTool.setDrawingMode(null);
            }
        }
    };
    /** End Point Tool */
    /** Start Line Tool */
    DrawingToolService.prototype.InitLine = function (color, strokeWidth, opacity) {
        var _this = this;
        var lineTool = this.lineTool;
        var mouseDown = google.maps.event.addListener(this.map, 'mousedown', function (e) {
            //the polygon
            _this.SetmapOptionsProperties(false);
            var polyLine = new google.maps.Polyline({
                map: _this.map,
                clickable: false,
                editable: false,
                draggable: false,
                strokeColor: color,
                strokeWeight: strokeWidth,
                strokeOpacity: opacity
            });
            polyLine.getPath().push(e.latLng);
            var firstPoint = e.latLng;
            var move = google.maps.event.addListener(_this.map, 'mousemove', function (e) {
                var lastPath = e.latLng;
                var TotalPath = [];
                TotalPath.push(firstPoint);
                TotalPath.push(lastPath);
                polyLine.setPath(TotalPath);
            });
            //mouseup-listener
            google.maps.event.addListenerOnce(_this.map, 'mouseup', function (e) {
                google.maps.event.removeListener(move);
                _this.SetmapOptionsProperties(true);
                var LineToolval = lineTool.getValue();
                LineToolval.AllOverLines.push(polyLine);
                var line = {
                    DrawingItem: polyLine,
                    DrawingManagerId: 2
                };
                _this.AllDrawingLayerList.getValue().push(line);
            });
        });
        var Tool = {
            DrawingTool: mouseDown,
            AllOverLines: [],
            DrawingManagerId: 2
        };
        var lineToolVal = this.lineTool.getValue();
        if (lineToolVal && lineToolVal.AllOverLines && lineToolVal.AllOverLines.length > 0)
            Tool.AllOverLines = lineToolVal.AllOverLines;
        this.lineTool.next(Tool);
        // google.maps.event.removeListener(mouseDown);
    };
    DrawingToolService.prototype.CloseDrawToolsForLine = function () {
        if (this.lineTool.getValue()) {
            var drawingToolLines = this.lineTool.getValue();
            if (drawingToolLines && drawingToolLines.DrawingTool) {
                if (drawingToolLines.AllOverLines.length > 0) {
                    for (var _i = 0, _a = drawingToolLines.AllOverLines; _i < _a.length; _i++) {
                        var overLayer = _a[_i];
                        if (overLayer.getMap())
                            overLayer.setMap(null);
                    }
                }
                this.lineTool.getValue().AllOverLines = [];
                this.lineTool.getValue().DrawingManagerId = 2;
            }
        }
        this.DisableDrawingModeLine();
    };
    DrawingToolService.prototype.DisableDrawingModeLine = function () {
        if (this.lineTool.getValue()) {
            var drawingLines = this.lineTool.getValue();
            if (drawingLines && drawingLines.DrawingTool) {
                google.maps.event.removeListener(drawingLines.DrawingTool);
            }
        }
    };
    /** End Line Tool */
    /** Start Polyline */
    DrawingToolService.prototype.InitPolyLineTool = function (color, opacity, border) {
        var _this = this;
        this.map = this.mapService._mapdata.getValue();
        var drawPolyLine;
        var thickness = 1;
        drawPolyLine = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYLINE,
            drawingControl: false,
            polylineOptions: {
                clickable: false,
                draggable: false,
                editable: false,
                strokeColor: color,
                strokeOpacity: opacity,
                strokeWeight: thickness
            },
            map: this.map
        });
        var polyLineTool = {
            DrawingTool: drawPolyLine,
            DrawingManagerId: 3
        };
        this.polyLineTool.next(polyLineTool);
        drawPolyLine.setMap(this.map);
        if (drawPolyLine) {
            google.maps.event.addListener(drawPolyLine, 'overlaycomplete', function (e) {
                var polyLine = {
                    DrawingItem: e.overlay,
                    DrawingManagerId: 3
                };
                _this.AllDrawingLayerList.getValue().push(polyLine);
                var newShape = e.overlay;
                newShape.type = e.type;
                google.maps.event.addListener(newShape.getPath(), 'set_at', function () {
                    var polyLine = {
                        DrawingItem: newShape,
                        DrawingManagerId: 3
                    };
                    _this.AllDrawingLayerList.getValue().push(polyLine);
                });
                google.maps.event.addListener(newShape.getPath(), 'insert_at', function () {
                    var polyLine = {
                        DrawingItem: newShape,
                        DrawingManagerId: 3
                    };
                    _this.AllDrawingLayerList.getValue().push(polyLine);
                });
                google.maps.event.addListener(newShape.getPath(), 'remove_at', function () {
                    var polyLine = {
                        DrawingItem: newShape,
                        DrawingManagerId: 3
                    };
                    _this.AllDrawingLayerList.getValue().push(polyLine);
                });
            });
        }
    };
    DrawingToolService.prototype.CloseDrawToolsForPolyLine = function () {
        if (this.polyLineTool.getValue()) {
            var drawingToolPolyline = this.polyLineTool.getValue();
            if (drawingToolPolyline && drawingToolPolyline.DrawingTool && drawingToolPolyline.DrawingTool.getMap()) {
                drawingToolPolyline.DrawingTool.setDrawingMode(null);
                drawingToolPolyline.DrawingTool.setMap(null);
                drawingToolPolyline.DrawingTool = null;
                this.polyLineTool.getValue().DrawingManagerId = 3;
            }
        }
    };
    DrawingToolService.prototype.DisableDrawingModeforPolyLine = function () {
        if (this.polyLineTool.getValue()) {
            var drawingToolPolyLine = this.polyLineTool.getValue();
            if (drawingToolPolyLine && drawingToolPolyLine.DrawingTool && drawingToolPolyLine.DrawingTool.getMap()) {
                drawingToolPolyLine.DrawingTool.setDrawingMode(null);
            }
        }
    };
    /** End Polyline */
    /** Start Triangle */
    DrawingToolService.prototype.InitTriangle = function (fillColor, strokeColor, strokeWidth, opacity) {
        var _this = this;
        var mouseDown = google.maps.event.addListener(this.map, 'mousedown', function (e) {
            //the polygon
            _this.SetmapOptionsProperties(false);
            var polyLine = new google.maps.Polyline({
                map: _this.map,
                clickable: false,
                editable: false,
                draggable: false,
                strokeColor: '#8db3e2',
                strokeWeight: 2,
                strokeOpacity: 0
            });
            polyLine.getPath().push(e.latLng);
            var firstPoint = e.latLng;
            var lat = firstPoint.lat();
            var lng = firstPoint.lng();
            var diff = _this.GetDiffFromZoomLevel();
            var firstcords = [
                { lat: lat - (diff / 2), lng: lng - diff },
                { lat: lat - (diff / 2), lng: lng + diff },
                { lat: lat + diff, lng: lng }
            ];
            var triangle = new google.maps.Polygon({
                map: _this.map,
                paths: firstcords,
                fillColor: fillColor,
                fillOpacity: opacity,
                strokeColor: strokeColor,
                strokeWeight: strokeWidth,
                draggable: false,
                editable: false,
                clickable: false
            });
            var move = google.maps.event.addListener(_this.map, 'mousemove', function (e) {
                var lastPath = e.latLng;
                var lat = firstPoint.lat();
                var lng = firstPoint.lng();
                var diff = 0;
                var lastLat = lastPath.lat();
                var lastLng = lastPath.lng();
                var latDiff = Math.abs(lat - lastLat);
                var lngDiff = Math.abs(lng - lastLng);
                if (latDiff > lngDiff)
                    diff = latDiff;
                else
                    diff = lngDiff;
                var cords = [
                    { lat: lat - (diff / 2), lng: lng - diff },
                    { lat: lat - (diff / 2), lng: lng + diff },
                    { lat: lat + diff, lng: lng }
                ];
                triangle.setPaths(cords);
            });
            //mouseup-listener
            google.maps.event.addListenerOnce(_this.map, 'mouseup', function (e) {
                google.maps.event.removeListener(move);
                _this.SetmapOptionsProperties(true);
                polyLine.setMap(null);
                var triangleObj = {
                    DrawingItem: triangle,
                    DrawingManagerId: 5
                };
                _this.AllDrawingLayerList.getValue().push(triangleObj);
            });
        });
        var Tool = {
            DrawingTool: mouseDown,
            DrawingManagerId: 5
        };
        this.triangleTool.next(Tool);
    };
    DrawingToolService.prototype.GetDiffFromZoomLevel = function () {
        if (this.map) {
            var zoom = this.map.getZoom();
            var avgNum = 2;
            if (zoom == 6)
                avgNum = 1.5;
            else if (zoom == 7)
                avgNum = 1;
            else if (zoom == 8)
                avgNum = 0.5;
            else if (zoom == 9)
                avgNum = 0.3;
            else if (zoom == 10)
                avgNum = 0.15;
            else if (zoom == 11)
                avgNum = 0.07;
            else if (zoom == 12)
                avgNum = 0.03;
            else if (zoom == 13)
                avgNum = 0.015;
            else if (zoom == 14)
                avgNum = 0.007;
            else if (zoom == 15)
                avgNum = 0.003;
            else if (zoom == 16)
                avgNum = 0.0015;
            else if (zoom == 17)
                avgNum = 0.0007;
            else if (zoom == 18)
                avgNum = 0.0003;
            else if (zoom == 19)
                avgNum = 0.00015;
            else if (zoom == 20)
                avgNum = 0.00007;
            else if (zoom == 21)
                avgNum = 0.00003;
            return avgNum;
        }
        return 0.1;
    };
    DrawingToolService.prototype.DisableDrawingModeTriangle = function () {
        if (this.triangleTool.getValue()) {
            var drawingTriangle = this.triangleTool.getValue();
            if (drawingTriangle && drawingTriangle.DrawingTool) {
                google.maps.event.removeListener(drawingTriangle.DrawingTool);
            }
        }
    };
    /** End Triangle */
    /** Start Rectangle */
    DrawingToolService.prototype.InitRectangleTool = function (color, opacity, border) {
        var _this = this;
        this.map = this.mapService._mapdata.getValue();
        var drawRectangle;
        var thickness = 1;
        drawRectangle = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
            drawingControl: false,
            rectangleOptions: {
                clickable: false,
                draggable: false,
                editable: false,
                fillColor: color,
                strokeColor: border,
                fillOpacity: opacity,
                strokeWeight: thickness
            },
            map: this.map
        });
        var polyLineTool = {
            DrawingTool: drawRectangle,
            DrawingManagerId: 6
        };
        this.RectangleTool.next(polyLineTool);
        drawRectangle.setMap(this.map);
        if (drawRectangle) {
            google.maps.event.addListener(drawRectangle, 'overlaycomplete', function (e) {
                var Rectangle = {
                    DrawingItem: e.overlay,
                    DrawingManagerId: 6
                };
                _this.AllDrawingLayerList.getValue().push(Rectangle);
                var newShape = e.overlay;
                newShape.type = e.type;
                // console.log(newShape);
                // google.maps.event.addListener(newShape.getBounds(), 'set_at', () => {
                //   let Rectangle = {
                //     DrawingItem: newShape,
                //     DrawingManagerId: 3
                //   }
                //   this.AllDrawingLayerList.getValue().push(Rectangle);
                // });
                // google.maps.event.addListener(newShape.getBounds(), 'insert_at', () => {
                //   let Rectangle = {
                //     DrawingItem: newShape,
                //     DrawingManagerId: 3
                //   }
                //   this.AllDrawingLayerList.getValue().push(Rectangle);
                // });
                // google.maps.event.addListener(newShape.getBounds(), 'remove_at', () => {
                //   let Rectangle = {
                //     DrawingItem: newShape,
                //     DrawingManagerId: 3
                //   }
                //   this.AllDrawingLayerList.getValue().push(Rectangle);
                // });
            });
        }
    };
    DrawingToolService.prototype.CloseDrawToolsForRectangle = function () {
        if (this.RectangleTool.getValue()) {
            var drawingToolRectangle = this.RectangleTool.getValue();
            if (drawingToolRectangle && drawingToolRectangle.DrawingTool && drawingToolRectangle.DrawingTool.getMap()) {
                drawingToolRectangle.DrawingTool.setDrawingMode(null);
                drawingToolRectangle.DrawingTool.setMap(null);
                drawingToolRectangle.DrawingTool = null;
                this.RectangleTool.getValue().DrawingManagerId = 6;
            }
        }
    };
    DrawingToolService.prototype.DisableDrawingModeforRectangle = function () {
        if (this.RectangleTool.getValue()) {
            var drawingToolRectangle = this.RectangleTool.getValue();
            if (drawingToolRectangle && drawingToolRectangle.DrawingTool && drawingToolRectangle.DrawingTool.getMap()) {
                drawingToolRectangle.DrawingTool.setDrawingMode(null);
            }
        }
    };
    /** End Rectangle */
    /** Start Circle */
    DrawingToolService.prototype.InitCircleTool = function (color, opacity, border) {
        var _this = this;
        this.map = this.mapService._mapdata.getValue();
        var drawCircle;
        var thickness = 1;
        drawCircle = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.CIRCLE,
            drawingControl: false,
            circleOptions: {
                clickable: false,
                draggable: false,
                editable: false,
                fillColor: color,
                strokeColor: border,
                fillOpacity: opacity,
                strokeWeight: thickness
            },
            map: this.map
        });
        var circleTool = {
            DrawingTool: drawCircle,
            DrawingManagerId: 7
        };
        this.CircleTool.next(circleTool);
        drawCircle.setMap(this.map);
        if (drawCircle) {
            google.maps.event.addListener(drawCircle, 'overlaycomplete', function (e) {
                var Circle = {
                    DrawingItem: e.overlay,
                    DrawingManagerId: 7
                };
                _this.AllDrawingLayerList.getValue().push(Circle);
                // let newShape = e.overlay;
                // newShape.type = e.type;
                // console.log(newShape);
                // google.maps.event.addListener(newShape.getBounds(), 'set_at', () => {
                //   let Rectangle = {
                //     DrawingItem: newShape,
                //     DrawingManagerId: 3
                //   }
                //   this.AllDrawingLayerList.getValue().push(Rectangle);
                // });
                // google.maps.event.addListener(newShape.getBounds(), 'insert_at', () => {
                //   let Rectangle = {
                //     DrawingItem: newShape,
                //     DrawingManagerId: 3
                //   }
                //   this.AllDrawingLayerList.getValue().push(Rectangle);
                // });
                // google.maps.event.addListener(newShape.getBounds(), 'remove_at', () => {
                //   let Rectangle = {
                //     DrawingItem: newShape,
                //     DrawingManagerId: 3
                //   }
                //   this.AllDrawingLayerList.getValue().push(Rectangle);
                // });
            });
        }
    };
    DrawingToolService.prototype.CloseDrawToolsForCircle = function () {
        if (this.CircleTool.getValue()) {
            var drawingToolCircle = this.CircleTool.getValue();
            if (drawingToolCircle && drawingToolCircle.DrawingTool && drawingToolCircle.DrawingTool.getMap()) {
                drawingToolCircle.DrawingTool.setDrawingMode(null);
                drawingToolCircle.DrawingTool.setMap(null);
                drawingToolCircle.DrawingTool = null;
            }
        }
    };
    DrawingToolService.prototype.DisableDrawingModeforCircle = function () {
        if (this.CircleTool.getValue()) {
            var drawingToolCircle = this.CircleTool.getValue();
            if (drawingToolCircle && drawingToolCircle.DrawingTool && drawingToolCircle.DrawingTool.getMap()) {
                drawingToolCircle.DrawingTool.setDrawingMode(null);
            }
        }
    };
    /** End Circle */
    /** Start Polygon */
    DrawingToolService.prototype.InitPolygonTool = function (color, opacity, border) {
        var _this = this;
        this.map = this.mapService._mapdata.getValue();
        var drawPolygon;
        var thickness = 1;
        drawPolygon = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: false,
            polygonOptions: {
                clickable: false,
                draggable: false,
                editable: false,
                fillColor: color,
                strokeColor: border,
                fillOpacity: opacity,
                strokeWeight: thickness
            },
            map: this.map
        });
        var polygonTool = {
            DrawingTool: drawPolygon,
            DrawingManagerId: 8
        };
        this.PolygonTool.next(polygonTool);
        drawPolygon.setMap(this.map);
        if (drawPolygon) {
            google.maps.event.addListener(drawPolygon, 'overlaycomplete', function (e) {
                var Polygon = {
                    DrawingItem: e.overlay,
                    DrawingManagerId: 8
                };
                _this.AllDrawingLayerList.getValue().push(Polygon);
                // let newShape = e.overlay;
                // newShape.type = e.type;
                // console.log(newShape);
                // google.maps.event.addListener(newShape.getBounds(), 'set_at', () => {
                //   let Rectangle = {
                //     DrawingItem: newShape,
                //     DrawingManagerId: 3
                //   }
                //   this.AllDrawingLayerList.getValue().push(Rectangle);
                // });
                // google.maps.event.addListener(newShape.getBounds(), 'insert_at', () => {
                //   let Rectangle = {
                //     DrawingItem: newShape,
                //     DrawingManagerId: 3
                //   }
                //   this.AllDrawingLayerList.getValue().push(Rectangle);
                // });
                // google.maps.event.addListener(newShape.getBounds(), 'remove_at', () => {
                //   let Rectangle = {
                //     DrawingItem: newShape,
                //     DrawingManagerId: 3
                //   }
                //   this.AllDrawingLayerList.getValue().push(Rectangle);
                // });
            });
        }
    };
    DrawingToolService.prototype.CloseDrawToolsForPolygon = function () {
        if (this.PolygonTool.getValue()) {
            var drawingToolPolygon = this.PolygonTool.getValue();
            if (drawingToolPolygon && drawingToolPolygon.DrawingTool && drawingToolPolygon.DrawingTool.getMap()) {
                drawingToolPolygon.DrawingTool.setDrawingMode(null);
                drawingToolPolygon.DrawingTool.setMap(null);
                drawingToolPolygon.DrawingTool = null;
            }
        }
    };
    DrawingToolService.prototype.DisableDrawingModeforPolygon = function () {
        if (this.PolygonTool.getValue()) {
            var drawingToolPolygon = this.PolygonTool.getValue();
            if (drawingToolPolygon && drawingToolPolygon.DrawingTool && drawingToolPolygon.DrawingTool.getMap()) {
                drawingToolPolygon.DrawingTool.setDrawingMode(null);
            }
        }
    };
    /** End Polygon */
    /** Start Marker Label */
    DrawingToolService.prototype.InitLabelTool = function (label, color, size, opacity) {
        var _this = this;
        this.map = this.mapService._mapdata.getValue();
        var drawLabel;
        var thickness = 1;
        drawLabel = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: false,
            markerOptions: {
                clickable: false,
                draggable: false,
                editable: false,
                icon: environment_1.environment.ImagespreviewPath + 'transparent.png',
                label: { color: color, fontSize: size, text: label },
                opacity: opacity
            },
            map: this.map
        });
        var labelTool = {
            DrawingTool: drawLabel,
            DrawingManagerId: 10
        };
        this.LabelTool.next(labelTool);
        drawLabel.setMap(this.map);
        if (drawLabel) {
            google.maps.event.addListener(drawLabel, 'overlaycomplete', function (e) {
                var Label = {
                    DrawingItem: e.overlay,
                    DrawingManagerId: 10
                };
                if (e.overlay.label && e.overlay.label.text.trim() == '') {
                    e.overlay.setMap(null);
                }
                else {
                    _this.AllDrawingLayerList.getValue().push(Label);
                }
            });
        }
    };
    DrawingToolService.prototype.CloseDrawToolsForLabel = function () {
        if (this.LabelTool.getValue()) {
            var drawingToolLabel = this.LabelTool.getValue();
            if (drawingToolLabel && drawingToolLabel.DrawingTool && drawingToolLabel.DrawingTool.getMap()) {
                drawingToolLabel.DrawingTool.setDrawingMode(null);
                drawingToolLabel.DrawingTool.setMap(null);
                drawingToolLabel.DrawingTool = null;
            }
        }
    };
    DrawingToolService.prototype.DisableDrawingModeforLabel = function () {
        if (this.LabelTool.getValue()) {
            var drawingToolLabel = this.LabelTool.getValue();
            if (drawingToolLabel && drawingToolLabel.DrawingTool && drawingToolLabel.DrawingTool.getMap()) {
                drawingToolLabel.DrawingTool.setDrawingMode(null);
            }
        }
    };
    /** End Marker Label */
    /** Start Free hand Polygon */
    DrawingToolService.prototype.InitdrawFreeHand = function (LayerStyleVisibleList) {
        var _this = this;
        this.SetmapOptionsProperties(false);
        var event = google.maps.event.addDomListenerOnce(this.map.getDiv(), 'mousedown', function (e) {
            _this.drawFreeHand(LayerStyleVisibleList);
        });
        this.freehandpolygoneTool.next({ DrawingTool: event, DrawingManagerId: 9 });
    };
    DrawingToolService.prototype.drawFreeHand = function (LayerStyleVisibleList) {
        var _this = this;
        var opacity = 1 - (LayerStyleVisibleList.Transparency / 100);
        var fillColor = '#';
        fillColor += LayerStyleVisibleList.Color.replace('#', '');
        var strokeColor = '#';
        strokeColor += LayerStyleVisibleList.Border.replace('#', '');
        var strokeThicknessPercentage = LayerStyleVisibleList.Thickness / 10;
        var sizePercentage = LayerStyleVisibleList.Size;
        var frehandpolygon = { map: this.map, clickable: false, editable: false, draggable: false, fillColor: fillColor, fillOpacity: opacity, strokeWeight: strokeThicknessPercentage, strokeColor: strokeColor };
        //the polygon
        var poly = new google.maps.Polygon(frehandpolygon);
        //move-listener
        var move = google.maps.event.addListener(this.map, 'mousemove', function (e) {
            poly.getPath().push(e.latLng);
        });
        //mouseup-listener
        google.maps.event.addListenerOnce(this.map, 'mouseup', function (e) {
            google.maps.event.removeListener(move);
            var path = poly.getPath();
            poly.setMap(null);
            frehandpolygon["path"] = path;
            poly = new google.maps.Polygon(frehandpolygon);
            google.maps.event.clearListeners(_this.map.getDiv(), 'mousedown');
            _this.SetmapOptionsProperties();
            var freehandpolyline = {
                DrawingItem: poly,
                DrawingManagerId: 9
            };
            if (freehandpolyline.DrawingItem.getPath().j.length > 0) {
                _this.AllDrawingLayerList.getValue().push(freehandpolyline);
                _this.InitdrawFreeHand(LayerStyleVisibleList);
            }
        });
    };
    DrawingToolService.prototype.SetmapOptionsProperties = function (draggable) {
        if (draggable === void 0) { draggable = true; }
        this.map.setOptions({
            draggable: draggable
        });
    };
    DrawingToolService.prototype.DisableFreehandpolygon = function () {
        if (this.freehandpolygoneTool.getValue()) {
            var drawingLines = this.freehandpolygoneTool.getValue();
            if (drawingLines.DrawingTool) {
                google.maps.event.removeListener(drawingLines.DrawingTool);
            }
        }
    };
    /** End Free hand Polygon */
    /** Start Freehand polyline */
    DrawingToolService.prototype.InitdrawFreeHandpolyline = function (LayerStyleVisibleList) {
        var _this = this;
        this.SetmapOptionsProperties(false);
        var event = google.maps.event.addDomListenerOnce(this.map.getDiv(), 'mousedown', function (e) {
            _this.drawFreeHandpolyline(LayerStyleVisibleList);
        });
        this.freehandpolylineTool.next({ DrawingTool: event, DrawingManagerId: 4 });
    };
    DrawingToolService.prototype.drawFreeHandpolyline = function (LayerStyleVisibleList) {
        var _this = this;
        var opacity = 1 - (LayerStyleVisibleList.Transparency / 100);
        var borderWidth = LayerStyleVisibleList.Thickness / 10;
        var fillColor = '#';
        fillColor += LayerStyleVisibleList.Color.replace('#', '');
        var strokeColor = '#';
        strokeColor += LayerStyleVisibleList.Border.replace('#', '');
        // let strokeThicknessPercentage = LayerStyleVisibleList.Thickness;
        var sizePercentage = LayerStyleVisibleList.Size;
        var frehandpolyline = { map: this.map, clickable: false, editable: false, draggable: false, strokeWeight: borderWidth, strokeColor: fillColor, strokeOpacity: opacity };
        //the polygon
        var polyline = new google.maps.Polyline(frehandpolyline);
        //move-listener
        var move = google.maps.event.addListener(this.map, 'mousemove', function (e) {
            polyline.getPath().push(e.latLng);
        });
        //mouseup-listener
        google.maps.event.addListenerOnce(this.map, 'mouseup', function (e) {
            google.maps.event.removeListener(move);
            var path = polyline.getPath();
            polyline.setMap(null);
            frehandpolyline["path"] = path;
            polyline = new google.maps.Polyline(frehandpolyline);
            google.maps.event.clearListeners(_this.map.getDiv(), 'mousedown');
            _this.SetmapOptionsProperties();
            var freehandpolyline = {
                DrawingItem: polyline,
                DrawingManagerId: 4
            };
            if (freehandpolyline.DrawingItem.getPath().j.length > 0) {
                _this.AllDrawingLayerList.getValue().push(freehandpolyline);
                _this.InitdrawFreeHandpolyline(LayerStyleVisibleList);
            }
        });
    };
    DrawingToolService.prototype.DisableFreehandpolyline = function () {
        if (this.freehandpolylineTool.getValue()) {
            var drawingLines = this.freehandpolylineTool.getValue();
            if (drawingLines.DrawingTool) {
                google.maps.event.removeListener(drawingLines.DrawingTool);
            }
        }
    };
    /** End Free hand Polyline */
    /** Start Load Draw Tools */
    DrawingToolService.prototype.AddDrawingLayer = function (id, isEditable) {
        var _this = this;
        if (isEditable === void 0) { isEditable = false; }
        this.allHttpRequestService._NodeGetDrawToolsItems(id).subscribe(function (data) {
            if (data._Issuccess == true && data.ToolsData.length > 0) {
                _this.AllLodedLayersOnMap.next([]);
                _this.LoadDrawingLayer(data.ToolsData, isEditable);
            }
        });
    };
    DrawingToolService.prototype.RemoveAddedLayer = function (id) {
        var data = this.AllLodedLayersOnMap.getValue();
        if (data && data.length > 0) {
            for (var i = data.length - 1; i >= 0; i--) {
                var item = data[i];
                if (item.layerId == id) {
                    if (item.drawingItem && item.drawingItem.getMap()) {
                        item.drawingItem.setMap(null);
                        data.splice(i, 1);
                    }
                }
            }
            this.AllLodedLayersOnMap.next(data);
        }
    };
    DrawingToolService.prototype.LoadDrawingLayer = function (tools, isEditable) {
        if (!this.map)
            this.map = this.mapService._mapdata.getValue();
        for (var i = 0; i < tools.length; i++) {
            var tool = tools[i];
            var lodedItem = undefined;
            if (tool.ShapeType == 'Point')
                lodedItem = this.LoadPointOnMap(tool, isEditable);
            else if (tool.ShapeType == 'Line')
                lodedItem = this.LoadLineOnMap(tool, isEditable);
            else if (tool.ShapeType == 'Rectangle')
                lodedItem = this.LoadRectangleOnMap(tool, isEditable);
            else if (tool.ShapeType == 'Circle')
                lodedItem = this.LoadCircleOnMap(tool, isEditable);
            else if (tool.ShapeType == 'Polygon' || tool.ShapeType == 'Triangle')
                lodedItem = this.LoadPolygonOnMap(tool, isEditable);
            else if (tool.ShapeType == 'Label')
                lodedItem = this.LoadLabelOnMap(tool, isEditable);
            if (lodedItem) {
                var LodedData = this.AllLodedLayersOnMap.getValue();
                if (!LodedData) {
                    this.AllLodedLayersOnMap.next([]);
                    LodedData = this.AllLodedLayersOnMap.getValue();
                }
                var obj = {
                    layerId: tool.HTML_EditableLayerID,
                    drawingItem: lodedItem
                };
                LodedData.push(obj);
                this.AllLodedLayersOnMap.next(LodedData);
            }
        }
    };
    DrawingToolService.prototype.LoadPointOnMap = function (point, isEditable) {
        var url = this.GenrateUrlFromItem(point);
        var position = this.GetLatLngFromGeoShape(point.ShapeGeo);
        var marker = new google.maps.Marker({
            position: position,
            map: this.map,
            icon: { url: url },
            draggable: isEditable,
            clickable: isEditable
        });
        if (isEditable)
            this.onEditMarker(marker, point);
        return marker;
    };
    DrawingToolService.prototype.LoadLineOnMap = function (line, isEditable) {
        var latLng = this.GetLatLngFromGeoShape(line.ShapeGeo);
        var polyLine = new google.maps.Polyline({
            map: this.map,
            clickable: isEditable,
            editable: false,
            draggable: isEditable,
            strokeColor: line.Color,
            strokeWeight: line.StrokeThickness,
            strokeOpacity: line.Opacity,
            path: latLng
        });
        if (isEditable)
            this.onEditObj(polyLine, line);
        return polyLine;
    };
    DrawingToolService.prototype.LoadRectangleOnMap = function (rectangle, isEditable) {
        var latLngs = this.GetLatLngFromGeoShape(rectangle.ShapeGeo);
        var bounds = this.GenrateBoundsFromLatLngs(latLngs);
        var rect = new google.maps.Rectangle({
            clickable: isEditable,
            editable: false,
            draggable: isEditable,
            strokeColor: rectangle.Color,
            strokeWeight: rectangle.StrokeThickness,
            fillColor: rectangle.BackColor,
            fillOpacity: rectangle.Opacity,
            map: this.map,
            bounds: bounds
        });
        if (isEditable)
            this.onEditObj(rect, rectangle);
        return rect;
    };
    DrawingToolService.prototype.LoadCircleOnMap = function (circle, isEditable) {
        var latLngs = this.GetLatLngFromGeoShape(circle.ShapeGeo);
        var cir = new google.maps.Circle({
            clickable: isEditable,
            editable: false,
            draggable: isEditable,
            strokeColor: circle.Color,
            strokeWeight: circle.StrokeThickness,
            fillColor: circle.BackColor,
            fillOpacity: circle.Opacity,
            map: this.map,
            center: latLngs,
            radius: circle.Radius
        });
        if (isEditable)
            this.onEditObj(cir, circle);
        return cir;
    };
    DrawingToolService.prototype.LoadPolygonOnMap = function (polygon, isEditable) {
        var latLngs = this.GetLatLngFromGeoShape(polygon.ShapeGeo);
        var poly = new google.maps.Polygon({
            clickable: isEditable,
            editable: false,
            draggable: isEditable,
            strokeColor: polygon.Color,
            strokeWeight: polygon.StrokeThickness,
            fillColor: polygon.BackColor,
            fillOpacity: polygon.Opacity,
            map: this.map,
            paths: latLngs
        });
        if (isEditable)
            this.onEditObj(poly, polygon);
        return poly;
    };
    DrawingToolService.prototype.LoadLabelOnMap = function (label, isEditable) {
        var latLng = this.GetLatLngFromGeoShape(label.ShapeGeo);
        var labelMarker = new google.maps.Marker({
            position: latLng,
            map: this.map,
            icon: environment_1.environment.ImagespreviewPath + 'transparent.png',
            label: { color: label.Color, fontSize: label.FontSize + 'px', text: label.Name },
            opacity: label.Opacity,
            draggable: isEditable,
            clickable: isEditable
        });
        if (isEditable)
            this.onEditMarker(labelMarker, label);
        return labelMarker;
    };
    DrawingToolService.prototype.GenrateUrlFromItem = function (item) {
        var iconUrl = environment_1.environment.GetLayerIconURL + "/icongenerate/get/?";
        var url = iconUrl;
        var and = '&';
        if (item) {
            if (item.Id)
                url += "Id=" + item.Id + and;
            url += "URLType=CustomStyleIcon" + and;
            if (item.BackColor) {
                url += "FillColor=" + item.BackColor.replace('#', '') + and;
            }
            if (item.SubType) {
                url += "IconType=" + item.SubType + and;
            }
            if (item.Color) {
                url += "StrokeColor=" + item.Color.replace('#', '') + and;
            }
            if (item.FontSize != undefined) {
                url += "SizePercent=" + item.FontSize + and;
            }
            if (item.StrokeThickness) {
                url += "StrokeThicknessPercent=" + item.StrokeThickness + and;
            }
            if (item.Opacity) {
                url += "Opacity=" + item.Opacity;
            }
            return url;
        }
    };
    DrawingToolService.prototype.GetLatLngFromGeoShape = function (shapeGeo) {
        var latLngs;
        if (shapeGeo && shapeGeo.indexOf('POINT') > -1) {
            var arr = shapeGeo.replace('POINT', '').replace(' (', '').replace('(', '').replace(')', '').split(' ');
            if (arr.length > 1) {
                latLngs = {
                    lat: Number(arr[1]),
                    lng: Number(arr[0])
                };
            }
        }
        else if (shapeGeo && shapeGeo.indexOf('LINESTRING') > -1) {
            var arr = shapeGeo.replace('LINESTRING', '').replace(' (', '').replace('(', '').replace(')', '').split(',');
            for (var i = 0; i < arr.length; i++) {
                var latLng = arr[i];
                var latLngArr = latLng.split(' ');
                latLngArr = latLngArr.filter(function (x) { return x != ''; });
                if (latLngArr.length > 1) {
                    var latLngObj = {
                        lat: Number(latLngArr[1]),
                        lng: Number(latLngArr[0])
                    };
                    if (!latLngs)
                        latLngs = [];
                    latLngs.push(latLngObj);
                }
            }
        }
        if (!latLngs)
            latLngs = {};
        return latLngs;
    };
    DrawingToolService.prototype.GenrateBoundsFromLatLngs = function (latLngs) {
        if (latLngs.length == 2) {
            var NE = new google.maps.LatLng(latLngs[0].lat, latLngs[0].lng);
            var SW = new google.maps.LatLng(latLngs[1].lat, latLngs[1].lng);
            var bounds = new google.maps.LatLngBounds(SW, NE);
            return bounds;
        }
        return {};
    };
    DrawingToolService.prototype.RemoveAllLayersFromMap = function () {
        var layers = this.mapService.DrawToolTreenode.getValue();
        if (layers && layers.length > 0) {
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                if (layer && layer.isChecked == true) {
                    var checkItem = $('#' + layer.EditableLayerID + 'LoadlayerinDrawToolData');
                    if (checkItem)
                        checkItem.click();
                }
            }
        }
        var sharedLayers = this.mapService.SharedDrawToolTreenode.getValue();
        if (sharedLayers && sharedLayers.length > 0) {
            for (var i = 0; i < sharedLayers.length; i++) {
                var sharedLayer = sharedLayers[i];
                if (sharedLayer && sharedLayer.isChecked == true) {
                    var checkItem = $('#' + sharedLayer.EditableLayerID + 'LoadlayerinDrawToolData');
                    if (checkItem)
                        checkItem.click();
                }
            }
        }
    };
    /** End Load Draw Tools */
    /** Start Edit Draw Tools */
    DrawingToolService.prototype.onEditMarker = function (marker, item) {
        var _this = this;
        google.maps.event.addListener(marker, 'click', function (f) {
            _this.DisableEditofOtherTools();
            var selObj = {
                savedItem: item,
                mapItem: marker
            };
            _this.selectedEditLayer.next(selObj);
            _this.UpdateEditObj(item, marker);
        });
        google.maps.event.addListener(marker, 'dragend', function (f) {
            _this.DisableEditofOtherTools();
            item.ShapeGeo = 'POINT (' + f.latLng.lng() + ' ' + f.latLng.lat() + ')';
            var selObj = {
                savedItem: item,
                mapItem: marker
            };
            _this.selectedEditLayer.next(selObj);
            _this.UpdateEditObj(item, marker);
        });
    };
    DrawingToolService.prototype.onEditObj = function (mapItem, item) {
        var _this = this;
        google.maps.event.addListener(mapItem, 'click', function (f) {
            _this.DisableEditofOtherTools();
            var selObj = {
                savedItem: item,
                mapItem: mapItem
            };
            _this.selectedEditLayer.next(selObj);
            mapItem.setOptions({ editable: true });
            _this.UpdateEditObj(item, mapItem);
        });
        google.maps.event.addListener(mapItem, 'dragend', function (f) {
            // item.ShapeGeo = 'POINT (' + f.latLng.lng() + ' ' + f.latLng.lat() + ')';
            _this.DisableEditofOtherTools();
            var selObj = {
                savedItem: item,
                mapItem: mapItem
            };
            mapItem.setOptions({ editable: true });
            _this.selectedEditLayer.next(selObj);
            _this.UpdateEditObj(item, mapItem);
        });
    };
    DrawingToolService.prototype.UpdateEditObj = function (updatedItem, MapItem) {
        var editObj = {
            updatedItem: updatedItem,
            mapItem: MapItem
        };
        var editedData = this.AllEditedLayerList.getValue();
        var oldItem = editedData.find(function (x) { return x.updatedItem.Id == updatedItem.Id; });
        if (oldItem)
            oldItem = editObj;
        else
            editedData.push(editObj);
        this.AllEditedLayerList.next(editedData);
    };
    DrawingToolService.prototype.DisableEditofOtherTools = function () {
        var editedData = this.AllEditedLayerList.getValue();
        if (editedData && editedData.length > 0) {
            for (var i = 0; i < editedData.length; i++) {
                var item = editedData[i];
                if (item.updatedItem.ShapeType != 'Point' && item.updatedItem.ShapeType != 'Label')
                    item.mapItem.setOptions({ editable: false });
            }
        }
    };
    DrawingToolService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [map_service_service_1.MapServiceService,
            all_http_request_service_1.HttpRequestService,
            auth_service_1.AuthenticationService])
    ], DrawingToolService);
    return DrawingToolService;
}());
exports.DrawingToolService = DrawingToolService;
//# sourceMappingURL=draw-tools.service.js.map