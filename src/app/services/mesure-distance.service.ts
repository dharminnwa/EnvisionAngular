import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { MapServiceService } from './map-service.service';
import { BehaviorSubject } from 'rxjs/Rx';

declare var google: any;
@Injectable()
export class MesureDistanceService {

    DistanceLatLngs = new BehaviorSubject<any>(null);
    AreaLatLngs = new BehaviorSubject<any>(null);

    constructor(private mapService: MapServiceService) { }

    DrawToolsForMesureDistance() {
        let map = this.mapService._mapdata.getValue();
        let drawingDistance: any;
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
        let distanceTool = {
            DrawingTool: drawingDistance,
            AllOverLayers: [],
            DrawingManagerId: 0
        }
        this.mapService.setDrawingToolDistance(distanceTool);
        drawingDistance.setMap(map);
        if (drawingDistance) {
            // google.maps.event.addListener(drawingDistance, 'click', (e) => {
            //     console.log('clicked');
            // });
            google.maps.event.addListener(drawingDistance, 'overlaycomplete', (e) => {
                let drawingToolDistance = this.mapService._drawingToolForDistance.getValue();
                drawingToolDistance.AllOverLayers.push({ Id: drawingToolDistance.DrawingManagerId, Overlay: e.overlay });
                drawingToolDistance.DrawingManagerId = drawingToolDistance.DrawingManagerId + 1;
                this.SetDistanceData(e.overlay.getPath().getArray());
                let newShape = e.overlay;
                newShape.type = e.type;
                google.maps.event.addListener(newShape.getPath(), 'set_at', () => {
                    this.SetDistanceData(newShape.getPath().getArray());
                });

                google.maps.event.addListener(newShape.getPath(), 'insert_at', () => {
                    this.SetDistanceData(newShape.getPath().getArray());
                });

                google.maps.event.addListener(newShape.getPath(), 'remove_at', () => {
                    this.SetDistanceData(newShape.getPath().getArray());
                });

            });
        }
    }

    DrawToolsForMesureArea() {
        let map = this.mapService._mapdata.getValue();
        let drawingArea: any;
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
        let areaTool = {
            DrawingTool: drawingArea,
            AllOverLayers: [],
            DrawingManagerId: 0
        }
        this.mapService.setDrawingToolArea(areaTool);
        drawingArea.setMap(map);
        if (drawingArea) {
            google.maps.event.addListener(drawingArea, 'overlaycomplete', (e) => {
                let drawingToolArea = this.mapService._drawingToolForArea.getValue();
                drawingToolArea.AllOverLayers.push({ Id: drawingToolArea.DrawingManagerId, Overlay: e.overlay });
                drawingToolArea.DrawingManagerId = drawingToolArea.DrawingManagerId + 1;
                this.SetAreaData(e.overlay.getPath().getArray());
                let newShape = e.overlay;
                newShape.type = e.type;
                google.maps.event.addListener(newShape.getPath(), 'set_at', () => {
                    this.SetAreaData(newShape.getPath().getArray());
                });

                google.maps.event.addListener(newShape.getPath(), 'insert_at', () => {
                    this.SetAreaData(newShape.getPath().getArray());
                });

                google.maps.event.addListener(newShape.getPath(), 'remove_at', () => {
                    this.SetAreaData(newShape.getPath().getArray());
                });

            });
        }
    }

    CloseDrawToolsForDistance() {
        if (this.mapService._drawingToolForDistance.getValue()) {
            let drawingToolDistance = this.mapService._drawingToolForDistance.getValue();
            if (drawingToolDistance && drawingToolDistance.DrawingTool && drawingToolDistance.DrawingTool.getMap()) {
                drawingToolDistance.DrawingTool.setDrawingMode(null);
                drawingToolDistance.DrawingTool.setMap(null);
                drawingToolDistance.DrawingTool = null;
                if (drawingToolDistance.AllOverLayers.length > 0) {
                    for (let overLayer of drawingToolDistance.AllOverLayers) {
                        if (overLayer.Overlay.getMap())
                            overLayer.Overlay.setMap(null);
                    }
                }
                this.mapService._drawingToolForDistance.getValue().AllOverLayers = [];
                this.mapService._drawingToolForDistance.getValue().DrawingManagerId = 0;
            }
        }
    }

    CloseDrawToolsForArea() {
        if (this.mapService._drawingToolForArea.getValue()) {
            let drawingToolArea = this.mapService._drawingToolForArea.getValue();
            if (drawingToolArea && drawingToolArea.DrawingTool && drawingToolArea.DrawingTool.getMap()) {
                drawingToolArea.DrawingTool.setDrawingMode(null);
                drawingToolArea.DrawingTool.setMap(null);
                drawingToolArea.DrawingTool = null;
                if (drawingToolArea.AllOverLayers.length > 0) {
                    for (let overLayer of drawingToolArea.AllOverLayers) {
                        if (overLayer.Overlay.getMap())
                            overLayer.Overlay.setMap(null);
                    }
                }
                this.mapService._drawingToolForArea.getValue().AllOverLayers = [];
                this.mapService._drawingToolForArea.getValue().DrawingManagerId = 0;
            }
        }
    }

    SetDistanceData(latLngs) {
        this.DistanceLatLngs.next(latLngs);
        this.ClearAllDistanceLines();
    }

    SetAreaData(latLngs) {
        this.AreaLatLngs.next(latLngs);
        this.ClearAllAreaLines();
    }

    ClearAllDistanceLines() {
        let drawingToolDistance = this.mapService._drawingToolForDistance.getValue();
        if (drawingToolDistance.AllOverLayers.length > 1) {
            let index = 0;
            for (let overLayer of drawingToolDistance.AllOverLayers) {
                if (index == 0) {
                    if (overLayer.Overlay.getMap()) {
                        overLayer.Overlay.setMap(null);
                        drawingToolDistance.AllOverLayers.splice(0, 1);
                    }
                }
                index++
            }
        }
    }

    ClearAllAreaLines() {
        let drawingToolArea = this.mapService._drawingToolForArea.getValue();
        if (drawingToolArea.AllOverLayers.length > 1) {
            let index = 0;
            for (let overLayer of drawingToolArea.AllOverLayers) {
                if (index == 0) {
                    if (overLayer.Overlay.getMap()) {
                        overLayer.Overlay.setMap(null);
                        drawingToolArea.AllOverLayers.splice(0, 1);
                    }
                }
                index++
            }
        }
    }

    getDistanceData(): BehaviorSubject<any> {
        return this.DistanceLatLngs;
    }

    getAreaData(): BehaviorSubject<any> {
        return this.AreaLatLngs;
    }

    MesureDistance(data) {
        console.log(data);
        if (data && data.length > 1) {
            let distance = google.maps.geometry.spherical.computeDistanceBetween(data[0], data[1]);
            console.log(distance);
        }
    }
}
