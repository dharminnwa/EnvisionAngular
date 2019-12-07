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
var map_service_service_1 = require("./map-service.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var elevation_graph_component_1 = require("../@pages/layouts/condensed/elevation-profile/elevation-graph/elevation-graph.component");
var ElevationPofileService = (function () {
    function ElevationPofileService(mapService, bsModalService) {
        this.mapService = mapService;
        this.bsModalService = bsModalService;
        this.elevationToolMeasurement = "Feet";
    }
    ElevationPofileService.prototype.DrawToolsForElevation = function () {
        var _this = this;
        var map = this.mapService._mapdata.getValue();
        var drawingManagerElevation = this.mapService._drawingToolForElevation.getValue();
        var drawingElevation;
        if (drawingManagerElevation == null) {
            drawingElevation = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.POLYLINE,
                drawingControl: false,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: ['polyline']
                },
                polylineOptions: {
                    clickable: true,
                    editable: true,
                    draggable: false
                },
                map: map
            });
            drawingElevation.setMap(map);
            var elevationTool = {
                DrawingTool: drawingElevation,
                AllOverLayers: [],
                DrawingManagerId: 0
            };
            this.mapService.setDrawingToolElevation(elevationTool);
        }
        else if (drawingManagerElevation.DrawingTool == null) {
            drawingElevation = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.POLYLINE,
                drawingControl: false,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: ['polyline']
                },
                polylineOptions: {
                    clickable: true,
                    editable: true,
                    draggable: false
                },
                map: map
            });
            drawingElevation.setMap(map);
            drawingManagerElevation.DrawingTool = drawingElevation;
        }
        if (drawingElevation) {
            google.maps.event.addListener(drawingElevation, 'overlaycomplete', function (e) {
                var drawingToolElevation = _this.mapService._drawingToolForElevation.getValue();
                drawingToolElevation.AllOverLayers.push({ Id: drawingToolElevation.DrawingManagerId, Overlay: e.overlay });
                drawingToolElevation.DrawingManagerId = drawingToolElevation.DrawingManagerId + 1;
                _this.PlotElevation(e.overlay.getPath().getArray());
                var newShape = e.overlay;
                newShape.type = e.type;
                google.maps.event.addListener(newShape.getPath(), 'set_at', function () {
                    _this.PlotElevation(newShape.getPath().getArray());
                });
                google.maps.event.addListener(newShape.getPath(), 'insert_at', function () {
                    _this.PlotElevation(newShape.getPath().getArray());
                });
                google.maps.event.addListener(newShape.getPath(), 'remove_at', function () {
                    _this.PlotElevation(newShape.getPath().getArray());
                });
            });
        }
    };
    ElevationPofileService.prototype.CloseDrawToolsForElevation = function () {
        var elevationGraphClosebtn = document.getElementById("btnElevatGraphClose");
        if (elevationGraphClosebtn != null)
            elevationGraphClosebtn.click();
        if (this.mapService._drawingToolForElevation.getValue()) {
            var drawingToolElevation = this.mapService._drawingToolForElevation.getValue();
            if (drawingToolElevation.DrawingTool.getMap()) {
                drawingToolElevation.DrawingTool.setDrawingMode(null);
                drawingToolElevation.DrawingTool.setMap(null);
                drawingToolElevation.DrawingTool = null;
                if (drawingToolElevation.AllOverLayers.length > 0) {
                    for (var _i = 0, _a = drawingToolElevation.AllOverLayers; _i < _a.length; _i++) {
                        var overLayer = _a[_i];
                        if (overLayer.Overlay.getMap())
                            overLayer.Overlay.setMap(null);
                    }
                }
                this.mapService._drawingToolForElevation.getValue().AllOverLayers = [];
                this.mapService._drawingToolForElevation.getValue().DrawingManagerId = 0;
            }
        }
    };
    ElevationPofileService.prototype.ClearButtonClick = function () {
        var elevationGraphClosebtn = document.getElementById("btnElevatGraphClose");
        if (elevationGraphClosebtn != null)
            elevationGraphClosebtn.click();
        if (this.mapService._drawingToolForElevation.getValue()) {
            var drawingToolElevation = this.mapService._drawingToolForElevation.getValue();
            if (drawingToolElevation.DrawingTool.getMap()) {
                if (drawingToolElevation.AllOverLayers.length > 0) {
                    for (var _i = 0, _a = drawingToolElevation.AllOverLayers; _i < _a.length; _i++) {
                        var overLayer = _a[_i];
                        if (overLayer.Overlay.getMap())
                            overLayer.Overlay.setMap(null);
                    }
                }
                this.mapService._drawingToolForElevation.getValue().AllOverLayers = [];
                this.mapService._drawingToolForElevation.getValue().DrawingManagerId = 0;
                drawingToolElevation.DrawingTool.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
            }
        }
    };
    ElevationPofileService.prototype.PlotElevation = function (path) {
        var _this = this;
        var elevator = new google.maps.ElevationService;
        elevator.getElevationAlongPath({
            'path': path,
            'samples': 256
        }, function (elevations, status) {
            if (status !== 'OK') {
                return;
            }
            var graphDataTable = _this.GenerateElevationGraphData(elevations, _this.elevationToolMeasurement);
            if (_this.mapService._elevationGraphData.getValue()) {
                _this.mapService._elevationGraphData.getValue().length = 0;
                var graphTitle = _this.elevationToolMeasurement == "Feet" ? 'Elevation (f)' : 'Elevation (m)';
                var elevationColumnChart = [{
                        chartType: 'ColumnChart',
                        dataTable: graphDataTable,
                        options: { 'title': graphTitle, legend: 'none', height: 150, width: 580 },
                    }];
                Array.prototype.push.apply(_this.mapService._elevationGraphData.getValue(), elevationColumnChart);
            }
            var elevationGraph = document.getElementById("elevationGraph");
            if (elevationGraph == null || elevationGraph == undefined) {
                _this.ElevationGraph();
            }
            var drawingToolElevation = _this.mapService._drawingToolForElevation.getValue();
            drawingToolElevation.DrawingTool.setDrawingMode(null);
        });
    };
    ElevationPofileService.prototype.ElevationGraph = function () {
        this.bsModalRef = this.bsModalService.show(elevation_graph_component_1.ElevationGraphComponent, { class: 'modal-lg elevationGraph modal-dialog-centered', backdrop: 'static', animated: false }); //initialState
    };
    ElevationPofileService.prototype.GenerateElevationGraphData = function (elevations, measurement) {
        var data = [];
        data.push(['Sample', 'Elevation']);
        if (measurement == "Feet") {
            elevations.map(function (el) {
                data.push(['', (el.elevation * 3.28084)]);
            });
        }
        else if (measurement == "Meter") {
            elevations.map(function (el) {
                data.push(['', el.elevation]);
            });
        }
        return data;
    };
    ElevationPofileService.prototype.OnMeasurementChange = function () {
        var drawingToolElevation = this.mapService._drawingToolForElevation.getValue();
        if (drawingToolElevation != null && drawingToolElevation.AllOverLayers.length > 0) {
            var filterElevation = drawingToolElevation.AllOverLayers.map(function (el) {
                if (el.Id == parseInt(drawingToolElevation.DrawingManagerId) - 1) {
                    return el;
                }
            });
            if (filterElevation.length == 1) {
                this.PlotElevation(filterElevation[0].Overlay.getPath().getArray());
            }
        }
    };
    ElevationPofileService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [map_service_service_1.MapServiceService,
            ngx_bootstrap_1.BsModalService])
    ], ElevationPofileService);
    return ElevationPofileService;
}());
exports.ElevationPofileService = ElevationPofileService;
//# sourceMappingURL=elevation-profile.service.js.map