import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { MapServiceService } from './map-service.service';
import { BehaviorSubject } from 'rxjs/Rx';
import { tempLayerDataProp } from '../models/layer-data-prop';
import { UtilityService } from './Utility.service';
import { AuthenticationService } from './auth.service';
import { environment } from '../../environments/environment';
import { ParcelBufferZoomMax, ParcelBufferZoomMin } from '../models/constants';

declare var google: any;
@Injectable()
export class ParcelBufferToolService {

  PointLatLngs = new BehaviorSubject<any>(null);
  LineLatLngs = new BehaviorSubject<any>(null);

  ParcelCenterPointData = {
    DataSetID: "200009",
    DataSetBoundryID: "200010",
    LayerName: 'Parcel Points',
    PreviewImage: "http://mapsearch360.com/images/datasetimage.png",
    DBFProperties: "PARCELAPN,FIPS,TAXAPN,STHSNUM,STDIR,STSTNAME,STSUFFIX,STQUADRANT,STUNITPRFX,STUNITNUM,STCITY,STSTATE,STZIP,STZIP4,GEOSOURCE,ADDRSCORE,OWN1,OWN2,MHSNUMB,MPREDIR,MSTNAME,MMODE,MQUADRNT,MUNITPRFX,MUNITNUM,MCITY,MSTATE,MZIP,MZIP4,LEGAL1,USECDSTDSC,USECDSTD,MQUADRANT,STNAME,CUSECDDSC,CUSECDSTD,LOTSZARNUM,LOTSZARUNT,ORGLOTSZAR,TAXSOURCE,TAXAMOUNT,TAXYEAR,ASSESSDATE,LATESTSALE,ASSESSAMT,LOTSZAR",
    DetailPanelProperties: "APN=TAXAPN,Owner=OWN1,Owner2=OWN2,Site Num=STHSNUM,Site Dir=STDIR,Site Name=STSTNAME,Site Unit=STUNITNUM,City=STCITY,State=STSTATE,Zip=STZIP,Legal=LEGAL1,Use Code=USECDSTD,Code Description=USECDSTDSC,MQUADRANT=MQUADRANT,CUSECDDSC=CUSECDDSC,CUSECDSTD=CUSECDSTD,LOTSZARNUM=LOTSZARNUM,LOTSZARUNT=LOTSZARUNT,ORGLOTSZAR=ORGLOTSZAR,TAXSOURCE=TAXSOURCE,TAXAMOUNT=TAXAMOUNT,TAXYEAR=TAXYEAR,=ASSESSDATEASSESSDATE,LATESTSALE=LATESTSALE,ASSESSAMT=ASSESSAMT",
    DBFPropertiesBoundries: "PARCELAPN,FIPS",
    BoundriesParecelDetailPanelProperties: "ParcelAPN=PARCELAPN,Fips=FIPS",
    ZoomMin: ParcelBufferZoomMin,
    ZoomMax: ParcelBufferZoomMax,
    isEnergyLayer: true,
    EnergyLayerDisplayName: "Parcel search results",
    EnergyLayerID: "200009"
  }
  treestatus = "Individual";
  FeatureType = "ParcelBufferSection";
  constructor(private mapService: MapServiceService,
    private utilityService: UtilityService,
    private authService: AuthenticationService) { }

  InitPointForParcelBuffer() {
    let map = this.mapService._mapdata.getValue();
    let parcelPoint: any;
    parcelPoint = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: false,
      map: map
    });
    let pointTool = {
      DrawingTool: parcelPoint,
      AllOverPoints: [],
      DrawingManagerId: 0
    }
    this.mapService.setDrawingToolForParcelPoint(pointTool);
    parcelPoint.setMap(map);

    if (parcelPoint) {
      google.maps.event.addListener(parcelPoint, 'markercomplete', (e) => {
        let position = e.position;
        let drawingToolParcelPoint = this.mapService.drawingToolForParcelPoint.getValue();
        drawingToolParcelPoint.AllOverPoints.push({ Id: drawingToolParcelPoint.DrawingManagerId, Point: e });
        drawingToolParcelPoint.DrawingManagerId = drawingToolParcelPoint.DrawingManagerId + 1;
        this.SetPointData(position);
      })
    }
  }

  InitLineForParcelBuffer() {
    let map = this.mapService._mapdata.getValue();
    let parcelLine: any;
    parcelLine = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYLINE,
      drawingControl: false,
      map: map,
      polylineOptions: {
        clickable: false,
        strokeColor: 'red',
        strokeOpacity: 1.0
      },
    });
    let lineTool = {
      DrawingTool: parcelLine,
      AllOverLines: [],
      DrawingManagerId: 0
    }
    this.mapService.setDrawingToolForParcelPointLines(lineTool);
    parcelLine.setMap(map);

    if (parcelLine) {
      google.maps.event.addListener(parcelLine, 'overlaycomplete', (e) => {
        let drawingToolParcelLines = this.mapService.drawingToolForParcelPointLines.getValue();
        drawingToolParcelLines.AllOverLines.push({ Id: drawingToolParcelLines.DrawingManagerId, Overlay: e.overlay });
        drawingToolParcelLines.DrawingManagerId = drawingToolParcelLines.DrawingManagerId + 1;
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
      })
    }
  }

  SetPointData(latLng) {
    this.PointLatLngs.next(latLng);
    this.RemoveOldPoints();
  }

  SetDistanceData(data) {
    this.LineLatLngs.next(data);
    this.RemoveOldLine();
  }

  RemoveOldLine(isRemoveAll: boolean = false) {
    let drawingToolParcelLines = this.mapService.drawingToolForParcelPointLines.getValue();
    if (drawingToolParcelLines && drawingToolParcelLines.AllOverLines && drawingToolParcelLines.AllOverLines.length > 1 || isRemoveAll) {
      let index = 0;
      if (drawingToolParcelLines && drawingToolParcelLines.AllOverLines) {
        for (let overLayer of drawingToolParcelLines.AllOverLines) {
          if (index == 0 || isRemoveAll) {
            if (overLayer.Overlay.getMap()) {
              overLayer.Overlay.setMap(null);
              drawingToolParcelLines.AllOverLines.splice(0, 1);
            }
          }
          index++
        }
      }
    }
  }

  RemoveOldPoints(isRemoveAll: boolean = false) {
    let drawingToolParcelPoint = this.mapService.drawingToolForParcelPoint.getValue();
    if (drawingToolParcelPoint && drawingToolParcelPoint.AllOverPoints && drawingToolParcelPoint.AllOverPoints.length > 1 || isRemoveAll) {
      let index = 0;
      if (drawingToolParcelPoint && drawingToolParcelPoint.AllOverPoints) {
        for (let overLayer of drawingToolParcelPoint.AllOverPoints) {
          if (index == 0 || isRemoveAll) {
            if (overLayer.Point.getMap()) {
              overLayer.Point.setMap(null);
              drawingToolParcelPoint.AllOverPoints.splice(0, 1);
            }
          }
          index++
        }
      }
    }
  }

  CloseDrawToolsForPoint() {
    if (this.mapService.drawingToolForParcelPoint.getValue()) {
      let drawingToolParcelPoint = this.mapService.drawingToolForParcelPoint.getValue();
      if (drawingToolParcelPoint && drawingToolParcelPoint.DrawingTool && drawingToolParcelPoint.DrawingTool.getMap()) {
        drawingToolParcelPoint.DrawingTool.setDrawingMode(null);
        drawingToolParcelPoint.DrawingTool.setMap(null);
        drawingToolParcelPoint.DrawingTool = null;
        if (drawingToolParcelPoint.AllOverPoints.length > 0) {
          for (let overLayer of drawingToolParcelPoint.AllOverPoints) {
            if (overLayer.Point.getMap())
              overLayer.Point.setMap(null);
          }
        }
        this.mapService.drawingToolForParcelPoint.getValue().AllOverPoints = [];
        this.mapService.drawingToolForParcelPoint.getValue().DrawingManagerId = 0;
        this.PointLatLngs.next(null);
      }
    }
  }

  CloseDrawToolsForLine() {
    if (this.mapService.drawingToolForParcelPointLines.getValue()) {
      let drawingToolParcelPointLines = this.mapService.drawingToolForParcelPointLines.getValue();
      if (drawingToolParcelPointLines && drawingToolParcelPointLines.DrawingTool && drawingToolParcelPointLines.DrawingTool.getMap()) {
        drawingToolParcelPointLines.DrawingTool.setDrawingMode(null);
        drawingToolParcelPointLines.DrawingTool.setMap(null);
        drawingToolParcelPointLines.DrawingTool = null;
        if (drawingToolParcelPointLines.AllOverLines.length > 0) {
          for (let overLayer of drawingToolParcelPointLines.AllOverLines) {
            if (overLayer.Overlay.getMap())
              overLayer.Overlay.setMap(null);
          }
        }
        this.mapService.drawingToolForParcelPoint.getValue().AllOverLines = [];
        this.mapService.drawingToolForParcelPoint.getValue().DrawingManagerId = 0;
        this.LineLatLngs.next(null);
      }
    }
  }

  DisableDrawingMode() {
    if (this.mapService.drawingToolForParcelPoint.getValue()) {
      let drawingToolParcelPoint = this.mapService.drawingToolForParcelPoint.getValue();
      if (drawingToolParcelPoint && drawingToolParcelPoint.DrawingTool && drawingToolParcelPoint.DrawingTool.getMap()) {
        drawingToolParcelPoint.DrawingTool.setDrawingMode(null);
      }
    }
  }

  DisableDrawingModeLine() {
    if (this.mapService.drawingToolForParcelPointLines.getValue()) {
      let drawingToolParcelLines = this.mapService.drawingToolForParcelPointLines.getValue();
      if (drawingToolParcelLines && drawingToolParcelLines.DrawingTool && drawingToolParcelLines.DrawingTool.getMap()) {
        drawingToolParcelLines.DrawingTool.setDrawingMode(null);
      }
    }
  }

  GetParcelTempLayerObject(tableName, stateObj, index) {
    let tempLayerObjPropObj = this.GetCommonParcelTempObj();
    if (index == 0)
      tempLayerObjPropObj.DataSetID = this.ParcelCenterPointData.DataSetBoundryID;
    else
      tempLayerObjPropObj.DataSetID = this.ParcelCenterPointData.DataSetBoundryID + index;
    tempLayerObjPropObj.EnergyLayerID = tempLayerObjPropObj.DataSetID;
    tempLayerObjPropObj.DataSetName = stateObj[tableName] ? stateObj[tableName] : this.ParcelCenterPointData.LayerName;
    tempLayerObjPropObj.Description = stateObj[tableName] ? stateObj[tableName] : this.ParcelCenterPointData.LayerName;

    tempLayerObjPropObj.IconType = "Circle";
    tempLayerObjPropObj.StrokeThicknessPercent = 5;
    tempLayerObjPropObj.StrokeColor = "FFFF0000";
    tempLayerObjPropObj.FillColor = tempLayerObjPropObj.StrokeColor;
    tempLayerObjPropObj.SizePercent = 55;
    tempLayerObjPropObj.Opacity = 1;

    tempLayerObjPropObj.RepresentationType = "Point";
    tempLayerObjPropObj.TableName = tableName;
    tempLayerObjPropObj.LayerTypeID = "9";
    tempLayerObjPropObj.DetailPanelPropertiesMain = this.ParcelCenterPointData.DBFProperties;
    tempLayerObjPropObj.DBFProperties = this.ParcelCenterPointData.DBFProperties;
    tempLayerObjPropObj.DetailPanelProperties = this.ParcelCenterPointData.DetailPanelProperties;

    tempLayerObjPropObj["DisplayName"] = stateObj[tableName] ? stateObj[tableName] : this.ParcelCenterPointData.EnergyLayerDisplayName;
    return tempLayerObjPropObj;
  }

  GetParcelTempLayerBoundriesObject(tableName, stateObj, index) {
    let tempLayerObjPropObj = this.GetCommonParcelTempObj();
    if (index == 0)
      tempLayerObjPropObj.DataSetID = this.ParcelCenterPointData.DataSetID;
    else
      tempLayerObjPropObj.DataSetID = this.ParcelCenterPointData.DataSetID + index;
    tempLayerObjPropObj.EnergyLayerID = tempLayerObjPropObj.DataSetID;
    tempLayerObjPropObj.DataSetName = stateObj[tableName] ? stateObj[tableName] : this.ParcelCenterPointData.LayerName;
    tempLayerObjPropObj.Description = stateObj[tableName] ? stateObj[tableName] : this.ParcelCenterPointData.LayerName;

    tempLayerObjPropObj.IconType = "RoundedRectangle";
    tempLayerObjPropObj.StrokeThicknessPercent = 10;
    tempLayerObjPropObj.StrokeColor = "FF120103";
    tempLayerObjPropObj.FillColor = "00F8F0F0";
    tempLayerObjPropObj.FillOpacity = 0;
    tempLayerObjPropObj.SizePercent = 100;
    tempLayerObjPropObj.Opacity = 1;
    tempLayerObjPropObj.DetailPanelPropertiesMain = this.ParcelCenterPointData.DBFPropertiesBoundries;
    tempLayerObjPropObj.DBFProperties = this.ParcelCenterPointData.DBFPropertiesBoundries;
    tempLayerObjPropObj.DetailPanelProperties = this.ParcelCenterPointData.BoundriesParecelDetailPanelProperties;

    tempLayerObjPropObj.RepresentationType = "Area";
    tempLayerObjPropObj.TableName = tableName;
    tempLayerObjPropObj.LayerTypeID = "9";

    tempLayerObjPropObj["DisplayName"] = stateObj[tableName] ? stateObj[tableName] : this.ParcelCenterPointData.EnergyLayerDisplayName;
    return tempLayerObjPropObj;
  }

  GetCommonParcelTempObj() {
    let tempLayerObjPropObj = new tempLayerDataProp();
    tempLayerObjPropObj.UploadedBy = this.authService.getLoggedinUserId();
    tempLayerObjPropObj.Tags = this.ParcelCenterPointData.LayerName;
    tempLayerObjPropObj.IsPublic = "false";
    tempLayerObjPropObj.PreviewImage = this.ParcelCenterPointData.PreviewImage;
    tempLayerObjPropObj.IsEnabled = "true";
    tempLayerObjPropObj.SortNumber = "1";
    tempLayerObjPropObj.Count = "0";
    tempLayerObjPropObj.IsSaveSearch = "true";
    tempLayerObjPropObj.IsLabelVisible = "false"
    tempLayerObjPropObj.ZoomMin = this.ParcelCenterPointData.ZoomMin;
    tempLayerObjPropObj.ZoomMax = this.ParcelCenterPointData.ZoomMax;
    tempLayerObjPropObj.LayerType = 'ParcelData';
    tempLayerObjPropObj.TreeStatus = this.treestatus;
    tempLayerObjPropObj.FeatureType = this.FeatureType;
    if (tempLayerObjPropObj.DBFProperties != 'undefined' && tempLayerObjPropObj.DBFProperties == '' && tempLayerObjPropObj.DetailPanelProperties != 'undefined' && tempLayerObjPropObj.DetailPanelProperties != '') {
      let DetailPanelPro = tempLayerObjPropObj.DetailPanelProperties.split(',');
      if (DetailPanelPro.length > 0) {
        for (let prop of DetailPanelPro) {
          let p = prop.split("=");
          tempLayerObjPropObj.DBFProperties += p[1] + ',';
        }
        tempLayerObjPropObj.DBFProperties = tempLayerObjPropObj.DBFProperties.substring(0, tempLayerObjPropObj.DBFProperties.length - 1);;
      }
    }
    tempLayerObjPropObj.isEnergyLayer = this.ParcelCenterPointData.isEnergyLayer;
    return tempLayerObjPropObj;
  }

  SetTree(temp, tempLayerObjPropObj, tempLayerBoundryObjPropObj, currentIndexVal) {
    this.RemovelayerFromTree(temp.DataSetID, temp.DataSetBoundryID);
    this.AddLayeronTempVariable(tempLayerObjPropObj, tempLayerBoundryObjPropObj, currentIndexVal);
    let Treedatalist = [];
    Treedatalist.push(this.getsingaleTree(tempLayerObjPropObj));
    Treedatalist.push(this.getsingaleTree(tempLayerBoundryObjPropObj));
    return Treedatalist;
  }


  AddLayeronTempVariable(tempobj, tempObjBoundry, currentIndexVal = this.mapService.LayerIndex.getValue().value + 1) {
    if (this.mapService.LayerIndex.getValue()) {
      // let currentIndexVal = this.mapService.LayerIndex.getValue().value;
      // tempobj["Layerindexval"] = currentIndexVal;
      // tempObjBoundry["Layerindexval"] = currentIndexVal + 1;
      // this.mapService.LayerIndex.getValue().value = currentIndexVal + 2;    
      tempobj["Layerindexval"] = currentIndexVal;
      tempObjBoundry["Layerindexval"] = currentIndexVal;
      //this.mapService.LayerIndex.getValue().value = currentIndexVal + 2;
    }
    this.mapService.temporaryLayer.push(tempobj);
    this.mapService.temporaryLayer.push(tempObjBoundry);
  }
  RemovelayerFromTree(DatasetId, DataSetBoundryID) {
    let tempLayerTreeData = this.mapService.TemporaryTreeNode.getValue();
    let parcelData = tempLayerTreeData.filter(x => x.Id.indexOf(DatasetId) || x.Id.indexOf(DataSetBoundryID));
    if (parcelData && parcelData.length > 0) {
      for (let i = 0; i < parcelData.length; i++) {
        let parcelItem = parcelData[i];
        this.RemoveTree(parcelItem.Id);
      }
    }


    // let ParcelData = tempLayerTreeData.find(x => x.Id == DatasetId);
    // if (ParcelData)
    //   this.RemoveTree(DatasetId);
    // let ParcelDataBoundry = tempLayerTreeData.find(x => x.Id == DataSetBoundryID);
    // if (ParcelDataBoundry)
    //   this.RemoveTree(DataSetBoundryID);
    // this.Treedatalist = [];
  }


  ZoomToPoint(latLng, radius: number = undefined) {
    let myMap: any = this.mapService._mapdata.getValue();
    if (myMap != undefined) {
      let zoom = 15;
      if (radius) {
        zoom = this.getZoomFromArea(radius);
      }
      // let center = { lat: bookmarkData.Latitude, lng: bookmarkData.Longitude };
      var myOptions = {
        zoom: zoom,
        center: latLng,
      };
      myMap.setOptions(myOptions);
    }
  }

  getZoomFromArea(radius) {
    if (radius) {
      if (radius > 1400 && radius <= 2750) {
        return 14;
      } else if (radius > 2750 && radius <= 5500) {
        return 13;
      } else if (radius > 5500 && radius <= 11000) {
        return 12;
      } else if (radius > 11000 && radius <= 22000) {
        return 11;
      } else if (radius > 22000) {
        return 10;
      }
    }
    return 15;
  }

  RemoveTree(datasetId) {
    this.utilityService.RemoveLayerData(datasetId, 'RemovetemporaryTreeData');
  }

  getsingaleTree(tempobj) {
    let Tree = {
      Id: tempobj.DataSetID,
      Name: tempobj.DataSetName,
      activeCount: 0,
      IconUrl: environment.GetLayerIconURL + "/icongenerate/get/?Id=" + tempobj.DataSetID + "&URLType=CustomStyleIcon&FillColor=" + tempobj.FillColor + "&IconType=" + tempobj.IconType + "&StrokeColor=" + tempobj.StrokeColor + "&SizePercent=" + tempobj.SizePercent + "&StrokeThicknessPercent=" + tempobj.StrokeThicknessPercent + "&Opacity=" + tempobj.Opacity,
      IsChecked: true,
      treestatus: this.treestatus,
      FeatureType: this.FeatureType
    }
    return Tree
  }

}