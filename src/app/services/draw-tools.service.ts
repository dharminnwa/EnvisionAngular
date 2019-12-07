import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { MapServiceService } from './map-service.service';
import { BehaviorSubject } from 'rxjs/Rx';
import { HttpRequestService } from './all-http-request.service';
import { AuthenticationService } from './auth.service';
import { DrawToolItem } from '../models/draw-tool-item';
import { environment } from '../../environments/environment';

declare var google: any;
declare var $: any;
@Injectable()
export class DrawingToolService {

  pointTool = new BehaviorSubject<any>(null);
  polyLineTool = new BehaviorSubject<any>(null);
  lineTool = new BehaviorSubject<any>(null);
  triangleTool = new BehaviorSubject<any>(null);
  RectangleTool = new BehaviorSubject<any>(null);
  CircleTool = new BehaviorSubject<any>(null);
  PolygonTool = new BehaviorSubject<any>(null);
  LabelTool = new BehaviorSubject<any>(null);
  leftarrowTool = new BehaviorSubject<any>(null);
  righttarrowTool = new BehaviorSubject<any>(null);
  uparrowTool = new BehaviorSubject<any>(null);
  downarrowTool = new BehaviorSubject<any>(null);

  AllDrawingLayerList = new BehaviorSubject<any>(null);
  AllLodedLayersOnMap = new BehaviorSubject<any>(null);
  selectedEditLayer = new BehaviorSubject<any>(null);
  AllEditedLayerList = new BehaviorSubject<any[]>([]);
  constructor(private mapService: MapServiceService,
    private allHttpRequestService: HttpRequestService,
    private authService: AuthenticationService) { }
  map = this.mapService._mapdata.getValue();
  freehandpolygoneTool = new BehaviorSubject<any>(null);
  freehandpolylineTool = new BehaviorSubject<any>(null);
  currentlySelectedIcon = new BehaviorSubject<any>(null);


  /** Start Point Tool */
  InitPoint(url) {

    this.map = this.mapService._mapdata.getValue();
    let drawPoint: any;
    drawPoint = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: false,
      markerOptions: {
        icon: { url: url },
        clickable: true,
        draggable: true,
        editable: true
      },
      map: this.map
    });
    let pointTool = {
      DrawingTool: drawPoint,
      AllOverPoints: [],
      DrawingManagerId: 1
    }
    this.pointTool.next(pointTool);
    drawPoint.setMap(this.map);

    if (drawPoint) {

      // drawPoint.setOptions({ draggable: true });
      google.maps.event.addListener(drawPoint, 'markercomplete', (e) => {
        let position = e.position;
        let drawingToolParcelPoint = this.pointTool.getValue();
        drawingToolParcelPoint.AllOverPoints.push({ Id: drawingToolParcelPoint.DrawingManagerId, Point: e });
        let point = {
          DrawingItem: e,
          DrawingManagerId: 1
        }

        this.AllDrawingLayerList.getValue().push(point);
        google.maps.event.addListener(e, 'click', (ev) => {

          this.DisableOtherSelectedDrawTools();
          let point = {
            layer: e,
            DrawingManagerId: 1
          };

          this.currentlySelectedIcon.next(point);
        })
      });
    }
  }

  CloseDrawToolsForPoint() {
    if (this.pointTool.getValue()) {
      let drawingToolPoint = this.pointTool.getValue();
      if (drawingToolPoint && drawingToolPoint.DrawingTool && drawingToolPoint.DrawingTool.getMap()) {
        drawingToolPoint.DrawingTool.setDrawingMode(null);
        drawingToolPoint.DrawingTool.setMap(null);
        drawingToolPoint.DrawingTool = null;
        if (drawingToolPoint.AllOverPoints.length > 0) {
          for (let overLayer of drawingToolPoint.AllOverPoints) {
            if (overLayer.Point.getMap())
              overLayer.Point.setMap(null);
          }
        }
        this.pointTool.getValue().AllOverPoints = [];
        this.pointTool.getValue().DrawingManagerId = 0;
      }
    }
  }

  DisableDrawingModeforPoint() {
    if (this.pointTool.getValue()) {
      let drawingToolPoint = this.pointTool.getValue();
      if (drawingToolPoint && drawingToolPoint.DrawingTool && drawingToolPoint.DrawingTool.getMap()) {
        drawingToolPoint.DrawingTool.setDrawingMode(null);
      }
    }
  }
  /** End Point Tool */



  /** Start Line Tool */
  InitLine(color, strokeWidth, opacity) {
    var lineTool = this.lineTool;
    var mouseDown = google.maps.event.addListener(this.map, 'mousedown', (e) => {
      //the polygon
      this.SetmapOptionsProperties(false);
      var polyLine = new google.maps.Polyline({
        map: this.map,
        clickable: false,
        editable: false,
        draggable: false,
        strokeColor: color,
        strokeWeight: strokeWidth,
        strokeOpacity: opacity
      });
      polyLine.getPath().push(e.latLng);
      var firstPoint = e.latLng;
      var move = google.maps.event.addListener(this.map, 'mousemove', (e) => {
        let lastPath = e.latLng;
        let TotalPath = [];
        TotalPath.push(firstPoint);
        TotalPath.push(lastPath);
        polyLine.setPath(TotalPath);
      });
      //mouseup-listener
      google.maps.event.addListenerOnce(this.map, 'mouseup', (e) => {

        google.maps.event.removeListener(move);
        this.SetmapOptionsProperties(true);
        let LineToolval = lineTool.getValue();
        LineToolval.AllOverLines.push(polyLine);
        let line = {
          DrawingItem: polyLine,
          DrawingManagerId: 2
        }
        this.AllDrawingLayerList.getValue().push(line);
      });
      setTimeout(() => {
        polyLine.setOptions({ clickable: true });
      }, 5000);

      google.maps.event.addListener(polyLine, 'click', (ev) => {
        this.DisableOtherSelectedDrawTools();
        polyLine.setOptions({
          editable: true,
          clickable: true,
          draggable: true
        });

        let Line = { layer: polyLine, DrawingManagerId: 2 };
        this.currentlySelectedIcon.next(Line);
      })
    });

    let Tool = {
      DrawingTool: mouseDown,
      AllOverLines: [],
      DrawingManagerId: 2
    }
    let lineToolVal = this.lineTool.getValue();
    if (lineToolVal && lineToolVal.AllOverLines && lineToolVal.AllOverLines.length > 0)
      Tool.AllOverLines = lineToolVal.AllOverLines;
    this.lineTool.next(Tool);
    // google.maps.event.removeListener(mouseDown);
  }

  CloseDrawToolsForLine() {
    if (this.lineTool.getValue()) {
      let drawingToolLines = this.lineTool.getValue();
      if (drawingToolLines && drawingToolLines.DrawingTool) {
        if (drawingToolLines.AllOverLines.length > 0) {
          for (let overLayer of drawingToolLines.AllOverLines) {
            if (overLayer.getMap())
              overLayer.setMap(null);
          }
        }
        this.lineTool.getValue().AllOverLines = [];
        this.lineTool.getValue().DrawingManagerId = 2;
      }
    }
    this.DisableDrawingModeLine();
  }

  DisableDrawingModeLine() {
    if (this.lineTool.getValue()) {
      let drawingLines = this.lineTool.getValue();
      if (drawingLines && drawingLines.DrawingTool) {
        google.maps.event.removeListener(drawingLines.DrawingTool);
      }
    }
  }
  /** End Line Tool */

  /** Start Polyline */
  InitPolyLineTool(color, opacity, border) {
    this.map = this.mapService._mapdata.getValue();
    let drawPolyLine: any;
    let thickness = 1;
    drawPolyLine = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYLINE,
      drawingControl: false,
      polylineOptions: {
        clickable: true,
        draggable: true,
        editable: false,
        strokeColor: color,
        strokeOpacity: opacity,
        strokeWeight: thickness
      },
      map: this.map
    });
    let polyLineTool = {
      DrawingTool: drawPolyLine,
      DrawingManagerId: 3
    }
    this.polyLineTool.next(polyLineTool);
    drawPolyLine.setMap(this.map);

    if (drawPolyLine) {
      google.maps.event.addListener(drawPolyLine, 'overlaycomplete', (e) => {
        let polyLine = {
          DrawingItem: e.overlay,
          DrawingManagerId: 3
        }
        this.AllDrawingLayerList.getValue().push(polyLine);
        let newShape = e.overlay;
        newShape.type = e.type;
        google.maps.event.addListener(newShape.getPath(), 'set_at', () => {
          let polyLine = {
            DrawingItem: newShape,
            DrawingManagerId: 3
          }
          this.AllDrawingLayerList.getValue().push(polyLine);
        });

        google.maps.event.addListener(newShape.getPath(), 'insert_at', () => {
          let polyLine = {
            DrawingItem: newShape,
            DrawingManagerId: 3
          }
          this.AllDrawingLayerList.getValue().push(polyLine);
        });

        google.maps.event.addListener(newShape.getPath(), 'remove_at', () => {
          let polyLine = {
            DrawingItem: newShape,
            DrawingManagerId: 3
          }
          this.AllDrawingLayerList.getValue().push(polyLine);
        });

        google.maps.event.addListener(newShape, 'click', (ev) => {
          this.DisableOtherSelectedDrawTools();
          let polyLine = { layer: newShape, DrawingManagerId: 3 }
          newShape.setOptions({ editable: true });
          this.currentlySelectedIcon.next(polyLine);
        })

        newShape.setOptions({ clickable: true, draggable: true });
      })
    }
  }

  CloseDrawToolsForPolyLine() {
    if (this.polyLineTool.getValue()) {
      let drawingToolPolyline = this.polyLineTool.getValue();
      if (drawingToolPolyline && drawingToolPolyline.DrawingTool && drawingToolPolyline.DrawingTool.getMap()) {
        drawingToolPolyline.DrawingTool.setDrawingMode(null);
        drawingToolPolyline.DrawingTool.setMap(null);
        drawingToolPolyline.DrawingTool = null;
        this.polyLineTool.getValue().DrawingManagerId = 3;
      }
    }
  }

  DisableDrawingModeforPolyLine() {
    if (this.polyLineTool.getValue()) {
      let drawingToolPolyLine = this.polyLineTool.getValue();
      if (drawingToolPolyLine && drawingToolPolyLine.DrawingTool && drawingToolPolyLine.DrawingTool.getMap()) {
        drawingToolPolyLine.DrawingTool.setDrawingMode(null);
      }
    }
  }
  /** End Polyline */

  /** Start Triangle */
  InitTriangle(fillColor, strokeColor, strokeWidth, opacity) {
    var mouseDown = google.maps.event.addListener(this.map, 'mousedown', (e) => {
      //the polygon
      this.SetmapOptionsProperties(false);
      var polyLine = new google.maps.Polyline({
        map: this.map,
        clickable: false,
        editable: false,
        draggable: false,
        strokeColor: '#8db3e2',
        strokeWeight: 2,
        strokeOpacity: 0
      });
      polyLine.getPath().push(e.latLng);
      var firstPoint = e.latLng;
      let lat = firstPoint.lat();
      let lng = firstPoint.lng();
      let diff = this.GetDiffFromZoomLevel();
      let firstcords = [
        { lat: lat - (diff / 2), lng: lng - diff },
        { lat: lat - (diff / 2), lng: lng + diff },
        { lat: lat + diff, lng: lng }
      ]
      let triangle = new google.maps.Polygon({
        map: this.map,
        paths: firstcords,
        fillColor: fillColor,
        fillOpacity: opacity,
        strokeColor: strokeColor,
        strokeWeight: strokeWidth,
        draggable: false,
        editable: false,
        clickable: false
      });
      var move = google.maps.event.addListener(this.map, 'mousemove', (e) => {
        let lastPath = e.latLng;
        let lat = firstPoint.lat();
        let lng = firstPoint.lng();
        let diff = 0;
        let lastLat = lastPath.lat();
        let lastLng = lastPath.lng();
        let latDiff = Math.abs(lat - lastLat);
        let lngDiff = Math.abs(lng - lastLng);
        if (latDiff > lngDiff)
          diff = latDiff;
        else
          diff = lngDiff;
        let cords = [
          { lat: lat - (diff / 2), lng: lng - diff },
          { lat: lat - (diff / 2), lng: lng + diff },
          { lat: lat + diff, lng: lng }
        ];
        triangle.setPaths(cords);
      });
      //mouseup-listener
      google.maps.event.addListenerOnce(this.map, 'mouseup', (e) => {
        google.maps.event.removeListener(move);
        this.SetmapOptionsProperties(true);
        polyLine.setMap(null);
        let triangleObj = {
          DrawingItem: triangle,
          DrawingManagerId: 5
        }
        this.AllDrawingLayerList.getValue().push(triangleObj);
        triangle.setOptions({ clickable: true });
      });

      google.maps.event.addListener(triangle, 'click', (ev) => {
        this.DisableOtherSelectedDrawTools();
        let triangleObj = { layer: triangle, DrawingManagerId: 5 }
        this.currentlySelectedIcon.next(triangleObj);
        triangle.setOptions({ draggable: true, editable: true });
      })
    });

    let Tool = {
      DrawingTool: mouseDown,
      DrawingManagerId: 5
    }
    this.triangleTool.next(Tool);
  }

  GetDiffFromZoomLevel() {
    if (this.map) {
      let zoom = this.map.getZoom();
      let avgNum = 2;
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
  }

  DisableDrawingModeTriangle() {
    if (this.triangleTool.getValue()) {
      let drawingTriangle = this.triangleTool.getValue();
      if (drawingTriangle && drawingTriangle.DrawingTool) {
        google.maps.event.removeListener(drawingTriangle.DrawingTool);
      }
    }
  }

  /** End Triangle */

  /** Start Rectangle */
  InitRectangleTool(color, opacity, border) {
    this.map = this.mapService._mapdata.getValue();
    let drawRectangle: any;
    let thickness = 1;
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
    let polyLineTool = {
      DrawingTool: drawRectangle,
      DrawingManagerId: 6
    }
    this.RectangleTool.next(polyLineTool);
    drawRectangle.setMap(this.map);

    if (drawRectangle) {
      google.maps.event.addListener(drawRectangle, 'overlaycomplete', (e) => {
        let Rectangle = {
          DrawingItem: e.overlay,
          DrawingManagerId: 6
        }
        this.AllDrawingLayerList.getValue().push(Rectangle);
        let newShape = e.overlay;
        newShape.type = e.type;

        setTimeout(() => {
          newShape.setOptions({ clickable: true });
        }, 2000);
        google.maps.event.addListener(newShape, 'click', (ev) => {
          this.DisableOtherSelectedDrawTools();
          let rectangleObj = { layer: newShape, DrawingManagerId: 6 }
          this.currentlySelectedIcon.next(rectangleObj);
          newShape.setOptions({ draggable: true, editable: true });
        })
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
      })
    }
  }

  CloseDrawToolsForRectangle() {
    if (this.RectangleTool.getValue()) {
      let drawingToolRectangle = this.RectangleTool.getValue();
      if (drawingToolRectangle && drawingToolRectangle.DrawingTool && drawingToolRectangle.DrawingTool.getMap()) {
        drawingToolRectangle.DrawingTool.setDrawingMode(null);
        drawingToolRectangle.DrawingTool.setMap(null);
        drawingToolRectangle.DrawingTool = null;
        this.RectangleTool.getValue().DrawingManagerId = 6;
      }
    }
  }

  DisableDrawingModeforRectangle() {
    if (this.RectangleTool.getValue()) {
      let drawingToolRectangle = this.RectangleTool.getValue();
      if (drawingToolRectangle && drawingToolRectangle.DrawingTool && drawingToolRectangle.DrawingTool.getMap()) {
        drawingToolRectangle.DrawingTool.setDrawingMode(null);
      }
    }
  }
  /** End Rectangle */

  /** Start Circle */
  InitCircleTool(color, opacity, border) {
    this.map = this.mapService._mapdata.getValue();
    let drawCircle: any;
    let thickness = 1;
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
    let circleTool = {
      DrawingTool: drawCircle,
      DrawingManagerId: 7
    }
    this.CircleTool.next(circleTool);
    drawCircle.setMap(this.map);

    if (drawCircle) {
      google.maps.event.addListener(drawCircle, 'overlaycomplete', (e) => {
        let Circle = {
          DrawingItem: e.overlay,
          DrawingManagerId: 7
        }
        this.AllDrawingLayerList.getValue().push(Circle);

        let newShape = e.overlay;
        newShape.type = e.type;
        setTimeout(() => {
          newShape.setOptions({ clickable: true });
        }, 2000);
        google.maps.event.addListener(newShape, 'click', (ev) => {
          this.DisableOtherSelectedDrawTools();
          let circleObj = { layer: newShape, DrawingManagerId: 7 }
          this.currentlySelectedIcon.next(circleObj);
          newShape.setOptions({ draggable: true, editable: true });
        })

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
      })
    }
  }

  CloseDrawToolsForCircle() {
    if (this.CircleTool.getValue()) {
      let drawingToolCircle = this.CircleTool.getValue();
      if (drawingToolCircle && drawingToolCircle.DrawingTool && drawingToolCircle.DrawingTool.getMap()) {
        drawingToolCircle.DrawingTool.setDrawingMode(null);
        drawingToolCircle.DrawingTool.setMap(null);
        drawingToolCircle.DrawingTool = null;
      }
    }
  }

  DisableDrawingModeforCircle() {
    if (this.CircleTool.getValue()) {
      let drawingToolCircle = this.CircleTool.getValue();
      if (drawingToolCircle && drawingToolCircle.DrawingTool && drawingToolCircle.DrawingTool.getMap()) {
        drawingToolCircle.DrawingTool.setDrawingMode(null);
      }
    }
  }
  /** End Circle */

  /** Start Polygon */
  InitPolygonTool(color, opacity, border) {
    this.map = this.mapService._mapdata.getValue();
    let drawPolygon: any;
    let thickness = 1;
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
    let polygonTool = {
      DrawingTool: drawPolygon,
      DrawingManagerId: 8
    }
    this.PolygonTool.next(polygonTool);
    drawPolygon.setMap(this.map);

    if (drawPolygon) {
      google.maps.event.addListener(drawPolygon, 'overlaycomplete', (e) => {
        let Polygon = {
          DrawingItem: e.overlay,
          DrawingManagerId: 8
        }
        this.AllDrawingLayerList.getValue().push(Polygon);

        let newShape = e.overlay;
        newShape.type = e.type;
        setTimeout(() => {
          newShape.setOptions({ clickable: true });
        }, 2000);
        google.maps.event.addListener(newShape, 'click', (ev) => {
          this.DisableOtherSelectedDrawTools();
          let polygonObj = { layer: newShape, DrawingManagerId: 8 }
          this.currentlySelectedIcon.next(polygonObj);
          newShape.setOptions({ draggable: true, editable: true });
        })
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
      })
    }
  }

  CloseDrawToolsForPolygon() {
    if (this.PolygonTool.getValue()) {
      let drawingToolPolygon = this.PolygonTool.getValue();
      if (drawingToolPolygon && drawingToolPolygon.DrawingTool && drawingToolPolygon.DrawingTool.getMap()) {
        drawingToolPolygon.DrawingTool.setDrawingMode(null);
        drawingToolPolygon.DrawingTool.setMap(null);
        drawingToolPolygon.DrawingTool = null;
      }
    }
  }

  DisableDrawingModeforPolygon() {
    if (this.PolygonTool.getValue()) {
      let drawingToolPolygon = this.PolygonTool.getValue();
      if (drawingToolPolygon && drawingToolPolygon.DrawingTool && drawingToolPolygon.DrawingTool.getMap()) {
        drawingToolPolygon.DrawingTool.setDrawingMode(null);
      }
    }
  }
  /** End Polygon */

  /** Start Marker Label */
  InitLabelTool(label, color, size, opacity) {
    this.map = this.mapService._mapdata.getValue();
    let drawLabel: any;
    let thickness = 1;
    drawLabel = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: false,
      markerOptions: {
        clickable: false,
        draggable: false,
        editable: false,
        icon: environment.ImagespreviewPath + 'transparent.png',
        label: { color: color, fontSize: size, text: label },
        opacity: opacity
      },
      map: this.map
    });
    let labelTool = {
      DrawingTool: drawLabel,
      DrawingManagerId: 10
    }
    this.LabelTool.next(labelTool);
    drawLabel.setMap(this.map);

    if (drawLabel) {
      google.maps.event.addListener(drawLabel, 'overlaycomplete', (e) => {
        let Label = {
          DrawingItem: e.overlay,
          DrawingManagerId: 10
        }
        if (e.overlay.label && e.overlay.label.text.trim() == '') {
          e.overlay.setMap(null);
        } else {
          this.AllDrawingLayerList.getValue().push(Label);

          let newShape = e.overlay;
          newShape.type = e.type;
          setTimeout(() => {
            newShape.setOptions({ clickable: true });
          }, 2000);
          google.maps.event.addListener(newShape, 'click', (ev) => {
            this.DisableOtherSelectedDrawTools();
            let labletoolsObj = { layer: newShape, DrawingManagerId: 10 }
            this.currentlySelectedIcon.next(labletoolsObj);
            newShape.setOptions({ draggable: true, editable: true });
          })
        }
      })
    }
  }

  CloseDrawToolsForLabel() {
    if (this.LabelTool.getValue()) {
      let drawingToolLabel = this.LabelTool.getValue();
      if (drawingToolLabel && drawingToolLabel.DrawingTool && drawingToolLabel.DrawingTool.getMap()) {
        drawingToolLabel.DrawingTool.setDrawingMode(null);
        drawingToolLabel.DrawingTool.setMap(null);
        drawingToolLabel.DrawingTool = null;
      }
    }
  }

  DisableDrawingModeforLabel() {
    if (this.LabelTool.getValue()) {
      let drawingToolLabel = this.LabelTool.getValue();
      if (drawingToolLabel && drawingToolLabel.DrawingTool && drawingToolLabel.DrawingTool.getMap()) {
        drawingToolLabel.DrawingTool.setDrawingMode(null);
      }
    }
  }
  /** End Marker Label */

  /** Start Free hand Polygon */
  InitdrawFreeHand(LayerStyleVisibleList) {
    this.SetmapOptionsProperties(false);
    let event = google.maps.event.addDomListenerOnce(this.map.getDiv(), 'mousedown', (e) => {
      this.drawFreeHand(LayerStyleVisibleList);
    });
    this.freehandpolygoneTool.next({ DrawingTool: event, DrawingManagerId: 9 });
  }

  drawFreeHand(LayerStyleVisibleList) {
    let opacity = 1 - (LayerStyleVisibleList.Transparency / 100);
    let fillColor = '#';
    fillColor += LayerStyleVisibleList.Color.replace('#', '');
    let strokeColor = '#';
    strokeColor += LayerStyleVisibleList.Border.replace('#', '');
    let strokeThicknessPercentage = LayerStyleVisibleList.Thickness / 10;
    let sizePercentage = LayerStyleVisibleList.Size;
    var frehandpolygon = { map: this.map, clickable: false, editable: false, draggable: false, fillColor: fillColor, fillOpacity: opacity, strokeWeight: strokeThicknessPercentage, strokeColor: strokeColor };
    //the polygon
    var poly = new google.maps.Polygon(frehandpolygon);

    //move-listener
    var move = google.maps.event.addListener(this.map, 'mousemove', (e) => {
      poly.getPath().push(e.latLng);
    });

    //mouseup-listener
    google.maps.event.addListenerOnce(this.map, 'mouseup', (e) => {
      google.maps.event.removeListener(move);
      var path = poly.getPath();
      poly.setMap(null);
      frehandpolygon["path"] = path;
      poly = new google.maps.Polygon(frehandpolygon);
      google.maps.event.clearListeners(this.map.getDiv(), 'mousedown');
      this.SetmapOptionsProperties();
      let freehandpolyline = {
        DrawingItem: poly,
        DrawingManagerId: 9
      }
      if (freehandpolyline.DrawingItem.getPath().j.length > 0) {
        this.AllDrawingLayerList.getValue().push(freehandpolyline);
        this.InitdrawFreeHand(LayerStyleVisibleList);
      }
      setTimeout(() => {
        poly.setOptions({ clickable: true });
      }, 1000);
      google.maps.event.addListener(poly, 'click', (ev) => {
        this.DisableOtherSelectedDrawTools();
        poly.setOptions({ editable: true, draggable: true });

        let freeLine = { layer: poly, DrawingManagerId: 9 };
        this.currentlySelectedIcon.next(freeLine);
      })
    });
  }
  SetmapOptionsProperties(draggable: boolean = true) {
    this.map.setOptions({
      draggable: draggable
    });
  }
  DisableFreehandpolygon() {
    if (this.freehandpolygoneTool.getValue()) {
      let drawingLines = this.freehandpolygoneTool.getValue();
      if (drawingLines.DrawingTool) {
        google.maps.event.removeListener(drawingLines.DrawingTool);
      }
    }
  }


  /** End Free hand Polygon */

  /** Start Freehand polyline */
  InitdrawFreeHandpolyline(LayerStyleVisibleList) {
    this.SetmapOptionsProperties(false);
    let event = google.maps.event.addDomListenerOnce(this.map.getDiv(), 'mousedown', (e) => {
      this.drawFreeHandpolyline(LayerStyleVisibleList);
    });
    this.freehandpolylineTool.next({ DrawingTool: event, DrawingManagerId: 4 });
  }
  drawFreeHandpolyline(LayerStyleVisibleList) {
    let opacity = 1 - (LayerStyleVisibleList.Transparency / 100);
    let borderWidth = LayerStyleVisibleList.Thickness / 10;
    let fillColor = '#';
    fillColor += LayerStyleVisibleList.Color.replace('#', '');
    let strokeColor = '#';
    strokeColor += LayerStyleVisibleList.Border.replace('#', '');
    // let strokeThicknessPercentage = LayerStyleVisibleList.Thickness;
    let sizePercentage = LayerStyleVisibleList.Size;
    var frehandpolyline = { map: this.map, clickable: false, editable: false, draggable: false, strokeWeight: borderWidth, strokeColor: fillColor, strokeOpacity: opacity };
    //the polygon
    var polyline = new google.maps.Polyline(frehandpolyline);

    //move-listener
    var move = google.maps.event.addListener(this.map, 'mousemove', (e) => {
      polyline.getPath().push(e.latLng);
    });

    //mouseup-listener
    google.maps.event.addListenerOnce(this.map, 'mouseup', (e) => {
      google.maps.event.removeListener(move);
      var path = polyline.getPath();
      polyline.setMap(null);
      frehandpolyline["path"] = path;
      polyline = new google.maps.Polyline(frehandpolyline);
      google.maps.event.clearListeners(this.map.getDiv(), 'mousedown');
      this.SetmapOptionsProperties();
      let freehandpolyline = {
        DrawingItem: polyline,
        DrawingManagerId: 4
      }
      if (freehandpolyline.DrawingItem.getPath().j.length > 0) {
        this.AllDrawingLayerList.getValue().push(freehandpolyline);
        this.InitdrawFreeHandpolyline(LayerStyleVisibleList);
      }
      setTimeout(() => {
        polyline.setOptions({ clickable: true, draggable: true });
      }, 1000);

      google.maps.event.addListener(polyline, 'click', (ev) => {
        this.DisableOtherSelectedDrawTools();
        polyline.setOptions({ editable: true });

        let freeLine = { layer: polyline, DrawingManagerId: 4 };
        this.currentlySelectedIcon.next(freeLine);
      })
    });
  }

  DisableFreehandpolyline() {
    if (this.freehandpolylineTool.getValue()) {
      let drawingLines = this.freehandpolylineTool.getValue();
      if (drawingLines.DrawingTool) {
        google.maps.event.removeListener(drawingLines.DrawingTool);
      }
    }
  }
  /** End Free hand Polyline */

  /** Start Left Arrrow */
  InitLeftArrow(fillColor, strokeColor, strokeWidth, opacity) {
    var mouseDown = google.maps.event.addListener(this.map, 'mousedown', (e) => {
      //the leftarrow
      this.SetmapOptionsProperties(false);
      var polyLine = new google.maps.Polyline({
        map: this.map,
        clickable: false,
        editable: false,
        draggable: false,
        strokeColor: '#8db3e2',
        strokeWeight: 2,
        strokeOpacity: 0
      });
      polyLine.getPath().push(e.latLng);
      var firstPoint = e.latLng;
      let lat = firstPoint.lat();
      let lng = firstPoint.lng();
      let diff = this.GetDiffFromZoomLevelLeftArrow();
      let firstcords = [
        { lat: lat, lng: lng - (diff * 1.5) },
        { lat: lat + diff, lng: lng },
        { lat: lat + (diff / 2), lng: lng },
        { lat: lat + (diff / 2), lng: lng + (diff * 1.5) },
        { lat: lat - (diff / 2), lng: lng + (diff * 1.5) },
        { lat: lat - (diff / 2), lng: lng },
        { lat: lat - diff, lng: lng },
      ]
      let leftarrowpoint = new google.maps.Polygon({
        map: this.map,
        paths: firstcords,
        fillColor: fillColor,
        fillOpacity: opacity,
        strokeColor: strokeColor,
        strokeWeight: strokeWidth,
        draggable: false,
        editable: false,
        clickable: false
      });
      var move = google.maps.event.addListener(this.map, 'mousemove', (e) => {
        let lastPath = e.latLng;
        let lat = firstPoint.lat();
        let lng = firstPoint.lng();
        let diff = 0;
        let lastLat = lastPath.lat();
        let lastLng = lastPath.lng();
        let latDiff = Math.abs(lat - lastLat);
        let lngDiff = Math.abs(lng - lastLng);
        if (latDiff > lngDiff)
          diff = latDiff;
        else
          diff = lngDiff;
        let cords = [
          { lat: lat, lng: lng - (diff * 1.5) },
          { lat: lat + diff, lng: lng },
          { lat: lat + (diff / 2), lng: lng },
          { lat: lat + (diff / 2), lng: lng + (diff * 1.5) },
          { lat: lat - (diff / 2), lng: lng + (diff * 1.5) },
          { lat: lat - (diff / 2), lng: lng },
          { lat: lat - diff, lng: lng },
        ];
        leftarrowpoint.setPaths(cords);
      });
      //mouseup-listener
      google.maps.event.addListenerOnce(this.map, 'mouseup', (e) => {
        google.maps.event.removeListener(move);
        this.SetmapOptionsProperties(true);
        polyLine.setMap(null);
        let leftarrowObj = {
          DrawingItem: leftarrowpoint,
          DrawingManagerId: 11
        }
        this.AllDrawingLayerList.getValue().push(leftarrowObj);
        leftarrowpoint.setOptions({ clickable: true });
      });

      google.maps.event.addListener(leftarrowpoint, 'click', (ev) => {
        this.DisableOtherSelectedDrawTools();
        let leftarrowObj = { layer: leftarrowpoint, DrawingManagerId: 11 }
        this.currentlySelectedIcon.next(leftarrowObj);
        leftarrowpoint.setOptions({ draggable: true, editable: true });
      })
    });

    let Tool = {
      DrawingTool: mouseDown,
      DrawingManagerId: 11
    }
    this.leftarrowTool.next(Tool);
  }

  GetDiffFromZoomLevelLeftArrow() {
    if (this.map) {
      let zoom = this.map.getZoom();
      let avgNum = 2;
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
  }

  DisableDrawingModeLeftArrow() {
    if (this.leftarrowTool.getValue()) {
      let drawingTriangle = this.leftarrowTool.getValue();
      if (drawingTriangle && drawingTriangle.DrawingTool) {
        google.maps.event.removeListener(drawingTriangle.DrawingTool);
      }
    }
  }
  /** End Left Arrow */

  /** Start Right Arrrow */
  InitRightArrow(fillColor, strokeColor, strokeWidth, opacity) {
    var mouseDown = google.maps.event.addListener(this.map, 'mousedown', (e) => {
      //the rightarrow
      this.SetmapOptionsProperties(false);
      var polyLine = new google.maps.Polyline({
        map: this.map,
        clickable: false,
        editable: false,
        draggable: false,
        strokeColor: '#8db3e2',
        strokeWeight: 2,
        strokeOpacity: 0
      });
      polyLine.getPath().push(e.latLng);
      var firstPoint = e.latLng;
      let lat = firstPoint.lat();
      let lng = firstPoint.lng();
      let diff = this.GetDiffFromZoomLevelRightArrow();
      let firstcords = [
        { lat: lat, lng: lng + (diff * 1.5) },
        { lat: lat - diff, lng: lng },
        { lat: lat - (diff / 2), lng: lng },
        { lat: lat - (diff / 2), lng: lng - (diff * 1.5) },
        { lat: lat + (diff / 2), lng: lng - (diff * 1.5) },
        { lat: lat + (diff / 2), lng: lng },
        { lat: lat + diff, lng: lng },
      ]
      let rightarrowpoint = new google.maps.Polygon({
        map: this.map,
        paths: firstcords,
        fillColor: fillColor,
        fillOpacity: opacity,
        strokeColor: strokeColor,
        strokeWeight: strokeWidth,
        draggable: false,
        editable: false,
        clickable: false
      });
      var move = google.maps.event.addListener(this.map, 'mousemove', (e) => {
        let lastPath = e.latLng;
        let lat = firstPoint.lat();
        let lng = firstPoint.lng();
        let diff = 0;
        let lastLat = lastPath.lat();
        let lastLng = lastPath.lng();
        let latDiff = Math.abs(lat - lastLat);
        let lngDiff = Math.abs(lng - lastLng);
        if (latDiff > lngDiff)
          diff = latDiff;
        else
          diff = lngDiff;
        let cords = [
          { lat: lat, lng: lng + (diff * 1.5) },
          { lat: lat - diff, lng: lng },
          { lat: lat - (diff / 2), lng: lng },
          { lat: lat - (diff / 2), lng: lng - (diff * 1.5) },
          { lat: lat + (diff / 2), lng: lng - (diff * 1.5) },
          { lat: lat + (diff / 2), lng: lng },
          { lat: lat + diff, lng: lng },
        ];
        rightarrowpoint.setPaths(cords);
      });
      //mouseup-listener
      google.maps.event.addListenerOnce(this.map, 'mouseup', (e) => {
        google.maps.event.removeListener(move);
        this.SetmapOptionsProperties(true);
        polyLine.setMap(null);
        let rightarrowObj = {
          DrawingItem: rightarrowpoint,
          DrawingManagerId: 12
        }
        this.AllDrawingLayerList.getValue().push(rightarrowObj);
        rightarrowpoint.setOptions({ clickable: true });
      });

      google.maps.event.addListener(rightarrowpoint, 'click', (ev) => {
        this.DisableOtherSelectedDrawTools();
        let rightarrowObj = { layer: rightarrowpoint, DrawingManagerId: 12 }
        this.currentlySelectedIcon.next(rightarrowObj);
        rightarrowpoint.setOptions({ draggable: true, editable: true });
      })
    });

    let Tool = {
      DrawingTool: mouseDown,
      DrawingManagerId: 12
    }
    this.righttarrowTool.next(Tool);
  }

  GetDiffFromZoomLevelRightArrow() {
    if (this.map) {
      let zoom = this.map.getZoom();
      let avgNum = 2;
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
  }

  DisableDrawingModeRightArrow() {
    if (this.righttarrowTool.getValue()) {
      let drawingTriangle = this.righttarrowTool.getValue();
      if (drawingTriangle && drawingTriangle.DrawingTool) {
        google.maps.event.removeListener(drawingTriangle.DrawingTool);
      }
    }
  }
  /** End Right Arrow */

  /** Start Up Arrrow */
  InitUpArrow(fillColor, strokeColor, strokeWidth, opacity) {
    var mouseDown = google.maps.event.addListener(this.map, 'mousedown', (e) => {
      //the Uparrow
      this.SetmapOptionsProperties(false);
      var polyLine = new google.maps.Polyline({
        map: this.map,
        clickable: false,
        editable: false,
        draggable: false,
        strokeColor: '#8db3e2',
        strokeWeight: 2,
        strokeOpacity: 0
      });
      polyLine.getPath().push(e.latLng);
      var firstPoint = e.latLng;
      let lat = firstPoint.lat();
      let lng = firstPoint.lng();
      let diff = this.GetDiffFromZoomLevelUpArrow();
      let firstcords = [
        { lat: lat + (diff * 1.5), lng: lng },
        { lat: lat, lng: lng - diff },
        { lat: lat, lng: lng - (diff / 2) },
        { lat: lat - (diff), lng: lng - (diff / 2) },
        { lat: lat - (diff), lng: lng + (diff / 2) },
        { lat: lat, lng: lng + (diff / 2) },
        { lat: lat, lng: lng + diff }
      ]
      let Uparrowpoint = new google.maps.Polygon({
        map: this.map,
        paths: firstcords,
        fillColor: fillColor,
        fillOpacity: opacity,
        strokeColor: strokeColor,
        strokeWeight: strokeWidth,
        draggable: false,
        editable: false,
        clickable: false
      });
      var move = google.maps.event.addListener(this.map, 'mousemove', (e) => {
        let lastPath = e.latLng;
        let lat = firstPoint.lat();
        let lng = firstPoint.lng();
        let diff = 0;
        let lastLat = lastPath.lat();
        let lastLng = lastPath.lng();
        let latDiff = Math.abs(lat - lastLat);
        let lngDiff = Math.abs(lng - lastLng);
        if (latDiff > lngDiff)
          diff = latDiff;
        else
          diff = lngDiff;
        let cords = [
          { lat: lat + (diff * 1.5), lng: lng },
          { lat: lat, lng: lng - diff },
          { lat: lat, lng: lng - (diff / 2) },
          { lat: lat - (diff), lng: lng - (diff / 2) },
          { lat: lat - (diff), lng: lng + (diff / 2) },
          { lat: lat, lng: lng + (diff / 2) },
          { lat: lat, lng: lng + diff }
        ];
        Uparrowpoint.setPaths(cords);
      });
      //mouseup-listener
      google.maps.event.addListenerOnce(this.map, 'mouseup', (e) => {
        google.maps.event.removeListener(move);
        this.SetmapOptionsProperties(true);
        polyLine.setMap(null);
        let uparrowObj = {
          DrawingItem: Uparrowpoint,
          DrawingManagerId: 13
        }
        this.AllDrawingLayerList.getValue().push(uparrowObj);
        Uparrowpoint.setOptions({ clickable: true });
      });

      google.maps.event.addListener(Uparrowpoint, 'click', (ev) => {
        this.DisableOtherSelectedDrawTools();
        let uparrowObj = { layer: Uparrowpoint, DrawingManagerId: 13 }
        this.currentlySelectedIcon.next(uparrowObj);
        Uparrowpoint.setOptions({ draggable: true, editable: true });
      })
    });

    let Tool = {
      DrawingTool: mouseDown,
      DrawingManagerId: 13
    }
    this.uparrowTool.next(Tool);
  }

  GetDiffFromZoomLevelUpArrow() {
    if (this.map) {
      let zoom = this.map.getZoom();
      let avgNum = 2;
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
  }

  DisableDrawingModeUpArrow() {
    if (this.uparrowTool.getValue()) {
      let drawingTriangle = this.uparrowTool.getValue();
      if (drawingTriangle && drawingTriangle.DrawingTool) {
        google.maps.event.removeListener(drawingTriangle.DrawingTool);
      }
    }
  }
  /** End Up Arrow */

  /** Start Down Arrrow */
  InitDownArrow(fillColor, strokeColor, strokeWidth, opacity) {
    var mouseDown = google.maps.event.addListener(this.map, 'mousedown', (e) => {
      //the downarrow
      this.SetmapOptionsProperties(false);
      var polyLine = new google.maps.Polyline({
        map: this.map,
        clickable: false,
        editable: false,
        draggable: false,
        strokeColor: '#8db3e2',
        strokeWeight: 2,
        strokeOpacity: 0
      });
      polyLine.getPath().push(e.latLng);
      var firstPoint = e.latLng;
      let lat = firstPoint.lat();
      let lng = firstPoint.lng();
      let diff = this.GetDiffFromZoomLevelDownArrow();
      let firstcords = [
        { lat: lat - (diff * 1.5), lng: lng },
        { lat: lat, lng: lng + diff },
        { lat: lat, lng: lng + (diff / 2) },
        { lat: lat + (diff), lng: lng + (diff / 2) },
        { lat: lat + (diff), lng: lng - (diff / 2) },
        { lat: lat, lng: lng - (diff / 2) },
        { lat: lat, lng: lng - diff }
      ]
      let downarrowpoint = new google.maps.Polygon({
        map: this.map,
        paths: firstcords,
        fillColor: fillColor,
        fillOpacity: opacity,
        strokeColor: strokeColor,
        strokeWeight: strokeWidth,
        draggable: false,
        editable: false,
        clickable: false
      });
      var move = google.maps.event.addListener(this.map, 'mousemove', (e) => {
        let lastPath = e.latLng;
        let lat = firstPoint.lat();
        let lng = firstPoint.lng();
        let diff = 0;
        let lastLat = lastPath.lat();
        let lastLng = lastPath.lng();
        let latDiff = Math.abs(lat - lastLat);
        let lngDiff = Math.abs(lng - lastLng);
        if (latDiff > lngDiff)
          diff = latDiff;
        else
          diff = lngDiff;
        let cords = [
          { lat: lat - (diff * 1.5), lng: lng },
          { lat: lat, lng: lng + diff },
          { lat: lat, lng: lng + (diff / 2) },
          { lat: lat + (diff), lng: lng + (diff / 2) },
          { lat: lat + (diff), lng: lng - (diff / 2) },
          { lat: lat, lng: lng - (diff / 2) },
          { lat: lat, lng: lng - diff }
        ];
        downarrowpoint.setPaths(cords);
      });
      //mouseup-listener
      google.maps.event.addListenerOnce(this.map, 'mouseup', (e) => {
        google.maps.event.removeListener(move);
        this.SetmapOptionsProperties(true);
        polyLine.setMap(null);
        let downarrowObj = {
          DrawingItem: downarrowpoint,
          DrawingManagerId: 14
        }
        this.AllDrawingLayerList.getValue().push(downarrowObj);
        downarrowpoint.setOptions({ clickable: true });
      });

      google.maps.event.addListener(downarrowpoint, 'click', (ev) => {
        this.DisableOtherSelectedDrawTools();
        let downarrowObj = { layer: downarrowpoint, DrawingManagerId: 14 }
        this.currentlySelectedIcon.next(downarrowObj);
        downarrowpoint.setOptions({ draggable: true, editable: true });
      })
    });

    let Tool = {
      DrawingTool: mouseDown,
      DrawingManagerId: 14
    }
    this.downarrowTool.next(Tool);
  }

  GetDiffFromZoomLevelDownArrow() {
    if (this.map) {
      let zoom = this.map.getZoom();
      let avgNum = 2;
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
  }

  DisableDrawingModeDownArrow() {
    if (this.downarrowTool.getValue()) {
      let drawingTriangle = this.downarrowTool.getValue();
      if (drawingTriangle && drawingTriangle.DrawingTool) {
        google.maps.event.removeListener(drawingTriangle.DrawingTool);
      }
    }
  }
  /** End Down Arrow */


  /** Start Load Draw Tools */

  AddDrawingLayer(id, isEditable: boolean = false) {
    this.allHttpRequestService._NodeGetDrawToolsItems(id).subscribe(data => {
      if (data._Issuccess == true && data.ToolsData.length > 0) {
        // this.AllLodedLayersOnMap.next([]);
        this.LoadDrawingLayer(data.ToolsData, isEditable);
      }
    })
  }

  RemoveAddedLayer(id) {
    let data: any[] = this.AllLodedLayersOnMap.getValue();
    if (data && data.length > 0) {
      for (let i = data.length - 1; i >= 0; i--) {
        let item = data[i];
        if (item.layerId == id) {
          if (item.drawingItem && item.drawingItem.getMap()) {
            item.drawingItem.setMap(null);
            data.splice(i, 1);
          }
        }
      }
      this.AllLodedLayersOnMap.next(data);
    }
  }

  LoadDrawingLayer(tools: DrawToolItem[], isEditable: boolean) {
    if (!this.map)
      this.map = this.mapService._mapdata.getValue();
    for (let i = 0; i < tools.length; i++) {
      let tool = tools[i];
      let lodedItem = undefined;
      if (tool.ShapeType == 'Point')
        lodedItem = this.LoadPointOnMap(tool, isEditable);
      else if (tool.ShapeType == 'Line')
        lodedItem = this.LoadLineOnMap(tool, isEditable);
      else if (tool.ShapeType == 'Rectangle')
        lodedItem = this.LoadRectangleOnMap(tool, isEditable);
      else if (tool.ShapeType == 'Circle')
        lodedItem = this.LoadCircleOnMap(tool, isEditable);
      else if (tool.ShapeType == 'Polygon' || tool.ShapeType == 'Triangle' || tool.ShapeType == 'LeftArrow' || tool.ShapeType == 'RightArrow' || tool.ShapeType == 'UpArrow' || tool.ShapeType == 'DownArrow')
        lodedItem = this.LoadPolygonOnMap(tool, isEditable);
      else if (tool.ShapeType == 'Label')
        lodedItem = this.LoadLabelOnMap(tool, isEditable);
      if (lodedItem) {
        let LodedData = this.AllLodedLayersOnMap.getValue();
        if (!LodedData) {
          this.AllLodedLayersOnMap.next([]);
          LodedData = this.AllLodedLayersOnMap.getValue();
        }
        let obj = {
          layerId: tool.HTML_EditableLayerID,
          drawingItem: lodedItem
        }
        LodedData.push(obj);
        this.AllLodedLayersOnMap.next(LodedData);
      }
    }
  }

  LoadPointOnMap(point: DrawToolItem, isEditable: boolean) {
    let url = this.GenrateUrlFromItem(point);
    let position = this.GetLatLngFromGeoShape(point.ShapeGeo);
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
  }

  LoadLineOnMap(line: DrawToolItem, isEditable: boolean) {
    let latLng = this.GetLatLngFromGeoShape(line.ShapeGeo)
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
  }

  LoadRectangleOnMap(rectangle: DrawToolItem, isEditable: boolean) {
    let latLngs = this.GetLatLngFromGeoShape(rectangle.ShapeGeo);
    let bounds = this.GenrateBoundsFromLatLngs(latLngs);
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
  }

  LoadCircleOnMap(circle: DrawToolItem, isEditable: boolean) {
    let latLngs = this.GetLatLngFromGeoShape(circle.ShapeGeo);
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
    })
    if (isEditable)
      this.onEditObj(cir, circle);
    return cir;
  }

  LoadPolygonOnMap(polygon: DrawToolItem, isEditable: boolean) {
    let latLngs = this.GetLatLngFromGeoShape(polygon.ShapeGeo);
    let poly = new google.maps.Polygon({
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
  }

  LoadLabelOnMap(label: DrawToolItem, isEditable: boolean) {
    let latLng = this.GetLatLngFromGeoShape(label.ShapeGeo);
    let labelMarker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      icon: environment.ImagespreviewPath + 'transparent.png',
      label: { color: label.Color, fontSize: label.FontSize + 'px', text: label.Name },
      opacity: label.Opacity,
      draggable: isEditable,
      clickable: isEditable
    });
    if (isEditable)
      this.onEditMarker(labelMarker, label);
    return labelMarker;
  }

  GenrateUrlFromItem(item: DrawToolItem) {
    let iconUrl = environment.GetLayerIconURL + "/icongenerate/get/?";
    let url = iconUrl;
    let and = '&';
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
  }

  GetLatLngFromGeoShape(shapeGeo: string) {
    let latLngs;
    if (shapeGeo && shapeGeo.indexOf('POINT') > -1) {
      let arr = shapeGeo.replace('POINT', '').replace(' (', '').replace('(', '').replace(')', '').split(' ');
      if (arr.length > 1) {
        latLngs = {
          lat: Number(arr[1]),
          lng: Number(arr[0])
        }
      }
    } else if (shapeGeo && shapeGeo.indexOf('LINESTRING') > -1) {
      let arr = shapeGeo.replace('LINESTRING', '').replace(' (', '').replace('(', '').replace(')', '').split(',');
      for (let i = 0; i < arr.length; i++) {
        let latLng = arr[i];
        let latLngArr = latLng.split(' ');
        latLngArr = latLngArr.filter(x => x != '');
        if (latLngArr.length > 1) {
          let latLngObj = {
            lat: Number(latLngArr[1]),
            lng: Number(latLngArr[0])
          }
          if (!latLngs)
            latLngs = [];
          latLngs.push(latLngObj);
        }
      }
    }
    if (!latLngs)
      latLngs = {};
    return latLngs;
  }

  GenrateBoundsFromLatLngs(latLngs: any[]) {
    if (latLngs.length == 2) {
      var NE = new google.maps.LatLng(latLngs[0].lat, latLngs[0].lng);
      var SW = new google.maps.LatLng(latLngs[1].lat, latLngs[1].lng);
      var bounds = new google.maps.LatLngBounds(SW, NE);
      return bounds;
    }
    return {};
  }

  RemoveAllLayersFromMap() {
    let layers = this.mapService.DrawToolTreenode.getValue();
    if (layers && layers.length > 0) {
      for (let i = 0; i < layers.length; i++) {
        let layer = layers[i];
        if (layer && layer.isChecked == true) {
          let checkItem = $('#' + layer.EditableLayerID + 'LoadlayerinDrawToolData');
          if (checkItem)
            checkItem.click()
        }
      }
    }
    let sharedLayers = this.mapService.SharedDrawToolTreenode.getValue();
    if (sharedLayers && sharedLayers.length > 0) {
      for (let i = 0; i < sharedLayers.length; i++) {
        let sharedLayer = sharedLayers[i];
        if (sharedLayer && sharedLayer.isChecked == true) {
          let checkItem = $('#' + sharedLayer.EditableLayerID + 'LoadlayerinDrawToolData');
          if (checkItem)
            checkItem.click()
        }
      }
    }
  }

  /** End Load Draw Tools */

  /** Start Edit Draw Tools */

  onEditMarker(marker, item: DrawToolItem) {
    google.maps.event.addListener(marker, 'click', (f) => {
      this.DisableEditofOtherTools();
      let selObj = {
        savedItem: item,
        mapItem: marker
      };
      this.selectedEditLayer.next(selObj);
      this.UpdateEditObj(item, marker);
    });
    google.maps.event.addListener(marker, 'dragend', (f) => {
      this.DisableEditofOtherTools();
      item.ShapeGeo = 'POINT (' + f.latLng.lng() + ' ' + f.latLng.lat() + ')';
      let selObj = {
        savedItem: item,
        mapItem: marker
      };
      this.selectedEditLayer.next(selObj);
      this.UpdateEditObj(item, marker);
    });
  }

  onEditObj(mapItem, item: DrawToolItem) {
    google.maps.event.addListener(mapItem, 'click', (f) => {
      this.DisableEditofOtherTools();
      let selObj = {
        savedItem: item,
        mapItem: mapItem
      };
      this.selectedEditLayer.next(selObj);
      mapItem.setOptions({ editable: true });
      this.UpdateEditObj(item, mapItem);
    });
    google.maps.event.addListener(mapItem, 'dragend', (f) => {
      // item.ShapeGeo = 'POINT (' + f.latLng.lng() + ' ' + f.latLng.lat() + ')';
      this.DisableEditofOtherTools();
      let selObj = {
        savedItem: item,
        mapItem: mapItem
      };
      mapItem.setOptions({ editable: true });
      this.selectedEditLayer.next(selObj);
      this.UpdateEditObj(item, mapItem);
    });
  }

  UpdateEditObj(updatedItem: DrawToolItem, MapItem) {
    let editObj = {
      updatedItem: updatedItem,
      mapItem: MapItem
    }
    let editedData = this.AllEditedLayerList.getValue();
    let oldItem = editedData.find(x => x.updatedItem.Id == updatedItem.Id);
    if (oldItem)
      oldItem = editObj;
    else
      editedData.push(editObj);
    this.AllEditedLayerList.next(editedData);
  }

  DisableEditofOtherTools() {
    let editedData = this.AllEditedLayerList.getValue();
    if (editedData && editedData.length > 0) {
      for (let i = 0; i < editedData.length; i++) {
        let item = editedData[i];
        if (item.updatedItem.ShapeType != 'Point' && item.updatedItem.ShapeType != 'Label')
          item.mapItem.setOptions({ editable: false });
      }
    }
  }

  /** End Edit Draw Tools */

  DisableOtherSelectedDrawTools() {
    let selectedTool = this.currentlySelectedIcon.getValue();
    if (selectedTool && selectedTool.layer) {
      selectedTool.layer.setOptions({ clickable: true, editable: false })
    }
  }

  EnableMap() {
    console.log('enable map')
    let map = this.mapService._mapdata.getValue();
    if (map) {
      let mapOptions = {
        draggable: true,
        zoomControl: true,
        scrollwheel: true,
        panControl: true,
        scaleControl: true,
        rotateControl: true,
        disableDoubleClickZoom: false,
      }
      map.setOptions(mapOptions);
    }
  }

  DisableMap() {
    console.log('disable map')
    let map = this.mapService._mapdata.getValue();
    if (map) {
      let mapOptions = {
        draggable: false,
        zoomControl: false,
        scrollwheel: false,
        panControl: false,
        scaleControl: false,
        rotateControl: false,
        disableDoubleClickZoom: true,
      }
      map.setOptions(mapOptions);
    }
  }
}