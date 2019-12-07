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
var layer_data_prop_1 = require("../models/layer-data-prop");
var Utility_service_1 = require("./Utility.service");
var auth_service_1 = require("./auth.service");
var environment_1 = require("../../environments/environment");
var ParcelBufferToolService = (function () {
    function ParcelBufferToolService(mapService, utilityService, authService) {
        this.mapService = mapService;
        this.utilityService = utilityService;
        this.authService = authService;
        this.PointLatLngs = new Rx_1.BehaviorSubject(null);
        this.LineLatLngs = new Rx_1.BehaviorSubject(null);
        this.ParcelCenterPointData = {
            DataSetID: "200009",
            DataSetBoundryID: "200010",
            LayerName: 'Parcel Points',
            PreviewImage: "http://mapsearch360.com/images/datasetimage.png",
            DBFProperties: "PARCELAPN,FIPS,TAXAPN,STHSNUM,STDIR,STSTNAME,STSUFFIX,STQUADRANT,STUNITPRFX,STUNITNUM,STCITY,STSTATE,STZIP,STZIP4,GEOSOURCE,ADDRSCORE,OWN1,OWN2,MHSNUMB,MPREDIR,MSTNAME,MMODE,MQUADRNT,MUNITPRFX,MUNITNUM,MCITY,MSTATE,MZIP,MZIP4,LEGAL1,USECDSTDSC,USECDSTD,MQUADRANT,STNAME,CUSECDDSC,CUSECDSTD,LOTSZARNUM,LOTSZARUNT,ORGLOTSZAR,TAXSOURCE,TAXAMOUNT,TAXYEAR,ASSESSDATE,LATESTSALE,ASSESSAMT,LOTSZAR",
            DetailPanelProperties: "APN=TAXAPN,Owner=OWN1,Owner2=OWN2,Site Num=STHSNUM,Site Dir=STDIR,Site Name=STSTNAME,Site Unit=STUNITNUM,City=STCITY,State=STSTATE,Zip=STZIP,Legal=LEGAL1,Use Code=USECDSTD,Code Description=USECDSTDSC,MQUADRANT=MQUADRANT,CUSECDDSC=CUSECDDSC,CUSECDSTD=CUSECDSTD,LOTSZARNUM=LOTSZARNUM,LOTSZARUNT=LOTSZARUNT,ORGLOTSZAR=ORGLOTSZAR,TAXSOURCE=TAXSOURCE,TAXAMOUNT=TAXAMOUNT,TAXYEAR=TAXYEAR,=ASSESSDATEASSESSDATE,LATESTSALE=LATESTSALE,ASSESSAMT=ASSESSAMT",
            DBFPropertiesBoundries: "PARCELAPN,FIPS",
            BoundriesParecelDetailPanelProperties: "ParcelAPN=PARCELAPN,Fips=FIPS",
            ZoomMin: "10",
            ZoomMax: "20",
            isEnergyLayer: true,
            EnergyLayerDisplayName: "Parcel search results",
            EnergyLayerID: "200009"
        };
        this.treestatus = "Individual";
        this.FeatureType = "ParcelBufferSection";
    }
    ParcelBufferToolService.prototype.InitPointForParcelBuffer = function () {
        var _this = this;
        var map = this.mapService._mapdata.getValue();
        var parcelPoint;
        parcelPoint = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: false,
            map: map
        });
        var pointTool = {
            DrawingTool: parcelPoint,
            AllOverPoints: [],
            DrawingManagerId: 0
        };
        this.mapService.setDrawingToolForParcelPoint(pointTool);
        parcelPoint.setMap(map);
        if (parcelPoint) {
            google.maps.event.addListener(parcelPoint, 'markercomplete', function (e) {
                var position = e.position;
                var drawingToolParcelPoint = _this.mapService.drawingToolForParcelPoint.getValue();
                drawingToolParcelPoint.AllOverPoints.push({ Id: drawingToolParcelPoint.DrawingManagerId, Point: e });
                drawingToolParcelPoint.DrawingManagerId = drawingToolParcelPoint.DrawingManagerId + 1;
                _this.SetPointData(position);
            });
        }
    };
    ParcelBufferToolService.prototype.InitLineForParcelBuffer = function () {
        var _this = this;
        var map = this.mapService._mapdata.getValue();
        var parcelLine;
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
        var lineTool = {
            DrawingTool: parcelLine,
            AllOverLines: [],
            DrawingManagerId: 0
        };
        this.mapService.setDrawingToolForParcelPointLines(lineTool);
        parcelLine.setMap(map);
        if (parcelLine) {
            google.maps.event.addListener(parcelLine, 'overlaycomplete', function (e) {
                var drawingToolParcelLines = _this.mapService.drawingToolForParcelPointLines.getValue();
                drawingToolParcelLines.AllOverLines.push({ Id: drawingToolParcelLines.DrawingManagerId, Overlay: e.overlay });
                drawingToolParcelLines.DrawingManagerId = drawingToolParcelLines.DrawingManagerId + 1;
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
    ParcelBufferToolService.prototype.SetPointData = function (latLng) {
        this.PointLatLngs.next(latLng);
        this.RemoveOldPoints();
    };
    ParcelBufferToolService.prototype.SetDistanceData = function (data) {
        this.LineLatLngs.next(data);
        this.RemoveOldLine();
    };
    ParcelBufferToolService.prototype.RemoveOldLine = function (isRemoveAll) {
        if (isRemoveAll === void 0) { isRemoveAll = false; }
        var drawingToolParcelLines = this.mapService.drawingToolForParcelPointLines.getValue();
        if (drawingToolParcelLines && drawingToolParcelLines.AllOverLines && drawingToolParcelLines.AllOverLines.length > 1 || isRemoveAll) {
            var index = 0;
            if (drawingToolParcelLines && drawingToolParcelLines.AllOverLines) {
                for (var _i = 0, _a = drawingToolParcelLines.AllOverLines; _i < _a.length; _i++) {
                    var overLayer = _a[_i];
                    if (index == 0 || isRemoveAll) {
                        if (overLayer.Overlay.getMap()) {
                            overLayer.Overlay.setMap(null);
                            drawingToolParcelLines.AllOverLines.splice(0, 1);
                        }
                    }
                    index++;
                }
            }
        }
    };
    ParcelBufferToolService.prototype.RemoveOldPoints = function (isRemoveAll) {
        if (isRemoveAll === void 0) { isRemoveAll = false; }
        var drawingToolParcelPoint = this.mapService.drawingToolForParcelPoint.getValue();
        if (drawingToolParcelPoint && drawingToolParcelPoint.AllOverPoints && drawingToolParcelPoint.AllOverPoints.length > 1 || isRemoveAll) {
            var index = 0;
            if (drawingToolParcelPoint && drawingToolParcelPoint.AllOverPoints) {
                for (var _i = 0, _a = drawingToolParcelPoint.AllOverPoints; _i < _a.length; _i++) {
                    var overLayer = _a[_i];
                    if (index == 0 || isRemoveAll) {
                        if (overLayer.Point.getMap()) {
                            overLayer.Point.setMap(null);
                            drawingToolParcelPoint.AllOverPoints.splice(0, 1);
                        }
                    }
                    index++;
                }
            }
        }
    };
    ParcelBufferToolService.prototype.CloseDrawToolsForPoint = function () {
        if (this.mapService.drawingToolForParcelPoint.getValue()) {
            var drawingToolParcelPoint = this.mapService.drawingToolForParcelPoint.getValue();
            if (drawingToolParcelPoint && drawingToolParcelPoint.DrawingTool && drawingToolParcelPoint.DrawingTool.getMap()) {
                drawingToolParcelPoint.DrawingTool.setDrawingMode(null);
                drawingToolParcelPoint.DrawingTool.setMap(null);
                drawingToolParcelPoint.DrawingTool = null;
                if (drawingToolParcelPoint.AllOverPoints.length > 0) {
                    for (var _i = 0, _a = drawingToolParcelPoint.AllOverPoints; _i < _a.length; _i++) {
                        var overLayer = _a[_i];
                        if (overLayer.Point.getMap())
                            overLayer.Point.setMap(null);
                    }
                }
                this.mapService.drawingToolForParcelPoint.getValue().AllOverPoints = [];
                this.mapService.drawingToolForParcelPoint.getValue().DrawingManagerId = 0;
                this.PointLatLngs.next(null);
            }
        }
    };
    ParcelBufferToolService.prototype.CloseDrawToolsForLine = function () {
        if (this.mapService.drawingToolForParcelPointLines.getValue()) {
            var drawingToolParcelPointLines = this.mapService.drawingToolForParcelPointLines.getValue();
            if (drawingToolParcelPointLines && drawingToolParcelPointLines.DrawingTool && drawingToolParcelPointLines.DrawingTool.getMap()) {
                drawingToolParcelPointLines.DrawingTool.setDrawingMode(null);
                drawingToolParcelPointLines.DrawingTool.setMap(null);
                drawingToolParcelPointLines.DrawingTool = null;
                if (drawingToolParcelPointLines.AllOverLines.length > 0) {
                    for (var _i = 0, _a = drawingToolParcelPointLines.AllOverLines; _i < _a.length; _i++) {
                        var overLayer = _a[_i];
                        if (overLayer.Overlay.getMap())
                            overLayer.Overlay.setMap(null);
                    }
                }
                this.mapService.drawingToolForParcelPoint.getValue().AllOverLines = [];
                this.mapService.drawingToolForParcelPoint.getValue().DrawingManagerId = 0;
                this.LineLatLngs.next(null);
            }
        }
    };
    ParcelBufferToolService.prototype.DisableDrawingMode = function () {
        if (this.mapService.drawingToolForParcelPoint.getValue()) {
            var drawingToolParcelPoint = this.mapService.drawingToolForParcelPoint.getValue();
            if (drawingToolParcelPoint && drawingToolParcelPoint.DrawingTool && drawingToolParcelPoint.DrawingTool.getMap()) {
                drawingToolParcelPoint.DrawingTool.setDrawingMode(null);
            }
        }
    };
    ParcelBufferToolService.prototype.DisableDrawingModeLine = function () {
        if (this.mapService.drawingToolForParcelPointLines.getValue()) {
            var drawingToolParcelLines = this.mapService.drawingToolForParcelPointLines.getValue();
            if (drawingToolParcelLines && drawingToolParcelLines.DrawingTool && drawingToolParcelLines.DrawingTool.getMap()) {
                drawingToolParcelLines.DrawingTool.setDrawingMode(null);
            }
        }
    };
    ParcelBufferToolService.prototype.GetParcelTempLayerObject = function (tableName, stateObj, index) {
        var tempLayerObjPropObj = this.GetCommonParcelTempObj();
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
    };
    ParcelBufferToolService.prototype.GetParcelTempLayerBoundriesObject = function (tableName, stateObj, index) {
        var tempLayerObjPropObj = this.GetCommonParcelTempObj();
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
    };
    ParcelBufferToolService.prototype.GetCommonParcelTempObj = function () {
        var tempLayerObjPropObj = new layer_data_prop_1.tempLayerDataProp();
        tempLayerObjPropObj.UploadedBy = this.authService.getLoggedinUserId();
        tempLayerObjPropObj.Tags = this.ParcelCenterPointData.LayerName;
        tempLayerObjPropObj.IsPublic = "false";
        tempLayerObjPropObj.PreviewImage = this.ParcelCenterPointData.PreviewImage;
        tempLayerObjPropObj.IsEnabled = "true";
        tempLayerObjPropObj.SortNumber = "1";
        tempLayerObjPropObj.Count = "0";
        tempLayerObjPropObj.IsSaveSearch = "true";
        tempLayerObjPropObj.IsLabelVisible = "false";
        tempLayerObjPropObj.ZoomMin = this.ParcelCenterPointData.ZoomMin;
        tempLayerObjPropObj.ZoomMax = this.ParcelCenterPointData.ZoomMax;
        tempLayerObjPropObj.LayerType = 'ParcelData';
        tempLayerObjPropObj.TreeStatus = this.treestatus;
        tempLayerObjPropObj.FeatureType = this.FeatureType;
        if (tempLayerObjPropObj.DBFProperties != 'undefined' && tempLayerObjPropObj.DBFProperties == '' && tempLayerObjPropObj.DetailPanelProperties != 'undefined' && tempLayerObjPropObj.DetailPanelProperties != '') {
            var DetailPanelPro = tempLayerObjPropObj.DetailPanelProperties.split(',');
            if (DetailPanelPro.length > 0) {
                for (var _i = 0, DetailPanelPro_1 = DetailPanelPro; _i < DetailPanelPro_1.length; _i++) {
                    var prop = DetailPanelPro_1[_i];
                    var p = prop.split("=");
                    tempLayerObjPropObj.DBFProperties += p[1] + ',';
                }
                tempLayerObjPropObj.DBFProperties = tempLayerObjPropObj.DBFProperties.substring(0, tempLayerObjPropObj.DBFProperties.length - 1);
                ;
            }
        }
        tempLayerObjPropObj.isEnergyLayer = this.ParcelCenterPointData.isEnergyLayer;
        return tempLayerObjPropObj;
    };
    ParcelBufferToolService.prototype.SetTree = function (temp, tempLayerObjPropObj, tempLayerBoundryObjPropObj, currentIndexVal) {
        this.RemovelayerFromTree(temp.DataSetID, temp.DataSetBoundryID);
        this.AddLayeronTempVariable(tempLayerObjPropObj, tempLayerBoundryObjPropObj, currentIndexVal);
        var Treedatalist = [];
        Treedatalist.push(this.getsingaleTree(tempLayerObjPropObj));
        Treedatalist.push(this.getsingaleTree(tempLayerBoundryObjPropObj));
        return Treedatalist;
    };
    ParcelBufferToolService.prototype.AddLayeronTempVariable = function (tempobj, tempObjBoundry, currentIndexVal) {
        if (currentIndexVal === void 0) { currentIndexVal = this.mapService.LayerIndex.getValue().value + 1; }
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
    };
    ParcelBufferToolService.prototype.RemovelayerFromTree = function (DatasetId, DataSetBoundryID) {
        var tempLayerTreeData = this.mapService.TemporaryTreeNode.getValue();
        var parcelData = tempLayerTreeData.filter(function (x) { return x.Id.indexOf(DatasetId) || x.Id.indexOf(DataSetBoundryID); });
        if (parcelData && parcelData.length > 0) {
            for (var i = 0; i < parcelData.length; i++) {
                var parcelItem = parcelData[i];
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
    };
    ParcelBufferToolService.prototype.ZoomToPoint = function (latLng, radius) {
        if (radius === void 0) { radius = undefined; }
        var myMap = this.mapService._mapdata.getValue();
        if (myMap != undefined) {
            var zoom = 15;
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
    };
    ParcelBufferToolService.prototype.getZoomFromArea = function (radius) {
        if (radius) {
            if (radius > 1400 && radius <= 2750) {
                return 14;
            }
            else if (radius > 2750 && radius <= 5500) {
                return 13;
            }
            else if (radius > 5500 && radius <= 11000) {
                return 12;
            }
            else if (radius > 11000 && radius <= 22000) {
                return 11;
            }
            else if (radius > 22000) {
                return 10;
            }
        }
        return 15;
    };
    ParcelBufferToolService.prototype.RemoveTree = function (datasetId) {
        this.utilityService.RemoveLayerData(datasetId, 'RemovetemporaryTreeData');
    };
    ParcelBufferToolService.prototype.getsingaleTree = function (tempobj) {
        var Tree = {
            Id: tempobj.DataSetID,
            Name: tempobj.DataSetName,
            activeCount: 0,
            IconUrl: environment_1.environment.GetLayerIconURL + "/icongenerate/get/?Id=" + tempobj.DataSetID + "&URLType=CustomStyleIcon&FillColor=" + tempobj.FillColor + "&IconType=" + tempobj.IconType + "&StrokeColor=" + tempobj.StrokeColor + "&SizePercent=" + tempobj.SizePercent + "&StrokeThicknessPercent=" + tempobj.StrokeThicknessPercent + "&Opacity=" + tempobj.Opacity,
            IsChecked: true,
            treestatus: this.treestatus,
            FeatureType: this.FeatureType
        };
        return Tree;
    };
    ParcelBufferToolService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [map_service_service_1.MapServiceService,
            Utility_service_1.UtilityService,
            auth_service_1.AuthenticationService])
    ], ParcelBufferToolService);
    return ParcelBufferToolService;
}());
exports.ParcelBufferToolService = ParcelBufferToolService;
//# sourceMappingURL=ParcelBufferTool.service.js.map