import { Injectable } from '@angular/core';
import { MapServiceService } from './map-service.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ElevationGraphComponent } from '../@pages/layouts/condensed/elevation-profile/elevation-graph/elevation-graph.component';

declare var google: any;
@Injectable()
export class ElevationPofileService {
    public elevationToolMeasurement: string = "Feet";
    bsModalRef: BsModalRef;
    constructor(
        private mapService: MapServiceService,
        private bsModalService: BsModalService
    ) { }

    DrawToolsForElevation() {
        let map = this.mapService._mapdata.getValue();
        let drawingManagerElevation = this.mapService._drawingToolForElevation.getValue();
        let drawingElevation: any;
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
            let elevationTool = {
                DrawingTool: drawingElevation,
                AllOverLayers: [],
                DrawingManagerId: 0
            }
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
            google.maps.event.addListener(drawingElevation, 'overlaycomplete', (e) => {
                let drawingToolElevation = this.mapService._drawingToolForElevation.getValue();
                drawingToolElevation.AllOverLayers.push({ Id: drawingToolElevation.DrawingManagerId, Overlay: e.overlay });
                drawingToolElevation.DrawingManagerId = drawingToolElevation.DrawingManagerId + 1;
                this.PlotElevation(e.overlay.getPath().getArray());
                let newShape = e.overlay;
                newShape.type = e.type;
                google.maps.event.addListener(newShape.getPath(), 'set_at', () => {
                    this.PlotElevation(newShape.getPath().getArray());
                });

                google.maps.event.addListener(newShape.getPath(), 'insert_at', () => {
                    this.PlotElevation(newShape.getPath().getArray());
                });

                google.maps.event.addListener(newShape.getPath(), 'remove_at', () => {
                    this.PlotElevation(newShape.getPath().getArray());
                });

            });
        }

    }

    CloseDrawToolsForElevation() {
        let elevationGraphClosebtn = document.getElementById("btnElevatGraphClose");
        if (elevationGraphClosebtn != null)
            elevationGraphClosebtn.click();
        if (this.mapService._drawingToolForElevation.getValue()) {
            let drawingToolElevation = this.mapService._drawingToolForElevation.getValue();
            if (drawingToolElevation.DrawingTool.getMap()) {
                drawingToolElevation.DrawingTool.setDrawingMode(null);
                drawingToolElevation.DrawingTool.setMap(null);
                drawingToolElevation.DrawingTool = null;
                if (drawingToolElevation.AllOverLayers.length > 0) {
                    for (let overLayer of drawingToolElevation.AllOverLayers) {
                        if (overLayer.Overlay.getMap())
                            overLayer.Overlay.setMap(null);
                    }
                }
                this.mapService._drawingToolForElevation.getValue().AllOverLayers = [];
                this.mapService._drawingToolForElevation.getValue().DrawingManagerId = 0;
            }
        }
    }

    ClearButtonClick() {
        let elevationGraphClosebtn = document.getElementById("btnElevatGraphClose");
        if (elevationGraphClosebtn != null)
            elevationGraphClosebtn.click();
        if (this.mapService._drawingToolForElevation.getValue()) {
            let drawingToolElevation = this.mapService._drawingToolForElevation.getValue();
            if (drawingToolElevation.DrawingTool.getMap()) {
                if (drawingToolElevation.AllOverLayers.length > 0) {
                    for (let overLayer of drawingToolElevation.AllOverLayers) {
                        if (overLayer.Overlay.getMap())
                            overLayer.Overlay.setMap(null);
                    }
                }
                this.mapService._drawingToolForElevation.getValue().AllOverLayers = [];
                this.mapService._drawingToolForElevation.getValue().DrawingManagerId = 0;
                drawingToolElevation.DrawingTool.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
            }
        }
    }

    PlotElevation(path) {
        let elevator = new google.maps.ElevationService;
        elevator.getElevationAlongPath({
            'path': path,
            'samples': 256
        }, (elevations, status) => {
            if (status !== 'OK') {
                return;
            }
            let graphDataTable = this.GenerateElevationGraphData(elevations, this.elevationToolMeasurement);
            if (this.mapService._elevationGraphData.getValue()) {
                this.mapService._elevationGraphData.getValue().length = 0;
                let graphTitle = this.elevationToolMeasurement == "Feet" ? 'Elevation (f)' : 'Elevation (m)';
                let elevationColumnChart = [{
                    chartType: 'ColumnChart',
                    dataTable: graphDataTable,
                    options: { 'title': graphTitle, legend: 'none', height: 150, width: 580 }, // chartArea: { width: '80%', height: '80%' }
                }];
                Array.prototype.push.apply(this.mapService._elevationGraphData.getValue(), elevationColumnChart);
            }
            let elevationGraph = document.getElementById("elevationGraph");
            if (elevationGraph == null || elevationGraph == undefined) {
                this.ElevationGraph();
            }
            let drawingToolElevation = this.mapService._drawingToolForElevation.getValue();
            drawingToolElevation.DrawingTool.setDrawingMode(null);
        });
    }

    ElevationGraph() {
        this.bsModalRef = this.bsModalService.show(ElevationGraphComponent, { class: 'modal-lg elevationGraph modal-dialog-centered', backdrop: 'static', animated: false }); //initialState
    }

    GenerateElevationGraphData(elevations: any, measurement: string) {
        let data = [];
        data.push(['Sample', 'Elevation']);
        if (measurement == "Feet") {
            elevations.map((el) => {
                data.push(['', (el.elevation * 3.28084)]);
            });
        }
        else if (measurement == "Meter") {
            elevations.map((el) => {
                data.push(['', el.elevation]);
            });
        }
        return data;
    }

    OnMeasurementChange() {
        let drawingToolElevation = this.mapService._drawingToolForElevation.getValue();
        if (drawingToolElevation != null && drawingToolElevation.AllOverLayers.length > 0) {
            let filterElevation = drawingToolElevation.AllOverLayers.map((el) => {
                if (el.Id == parseInt(drawingToolElevation.DrawingManagerId) - 1) {
                    return el;
                }
            });
            if (filterElevation.length == 1) {
                this.PlotElevation(filterElevation[0].Overlay.getPath().getArray());
            }
        }
    }
}