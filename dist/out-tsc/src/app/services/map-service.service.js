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
var Utility_service_1 = require("./Utility.service");
var d3_1 = require("d3");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var rxjs_1 = require("rxjs");
var FileSaver = require("file-saver");
var XLSX = require("xlsx");
var _ = require("lodash");
require("rxjs/add/operator/map");
var all_http_request_service_1 = require("./all-http-request.service");
var EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
var EXCEL_EXTENSION = '.xlsx';
var MapServiceService = (function () {
    function MapServiceService(UtilityService, httpRequest) {
        this.UtilityService = UtilityService;
        this.httpRequest = httpRequest;
        this._mapsharedata = new BehaviorSubject_1.BehaviorSubject(null);
        this._GridTabsData = new BehaviorSubject_1.BehaviorSubject(null);
        this.MapGridData = new BehaviorSubject_1.BehaviorSubject(null);
        this.LodedMapGridData = new BehaviorSubject_1.BehaviorSubject(null);
        this.MapGridColumns = new BehaviorSubject_1.BehaviorSubject(null);
        this.LodedMapGridColumns = new BehaviorSubject_1.BehaviorSubject(null);
        this.GridDataResult = new BehaviorSubject_1.BehaviorSubject(null);
        this.GridDataAPi = new BehaviorSubject_1.BehaviorSubject(null);
        this.KMLGridDataAPi = new BehaviorSubject_1.BehaviorSubject(null);
        this.LayersCategory = new BehaviorSubject_1.BehaviorSubject(null);
        this.ActiveLayersList = new BehaviorSubject_1.BehaviorSubject(null);
        this.MapSearchEnergyLayerLibrary = new BehaviorSubject_1.BehaviorSubject(null);
        this.HomeWidgetArray = new BehaviorSubject_1.BehaviorSubject(null);
        this.Treenode = new BehaviorSubject_1.BehaviorSubject(null);
        this.TreeUI = new BehaviorSubject_1.BehaviorSubject(null);
        this.ColumnsGriddata = [];
        this.ColumnsGriddatawithKey = [];
        this.columnfilterval = [];
        this._columnfiltervalStatus = "";
        this.DrawingTool = new BehaviorSubject_1.BehaviorSubject(null);
        this.MyDataLayerLibrary = new BehaviorSubject_1.BehaviorSubject(null);
        this.PrivateTreenode = new BehaviorSubject_1.BehaviorSubject(null);
        this.SharedTreenode = new BehaviorSubject_1.BehaviorSubject(null);
        this.DrawToolTreenode = new BehaviorSubject_1.BehaviorSubject(null);
        this.SharedDrawToolTreenode = new BehaviorSubject_1.BehaviorSubject(null);
        this.PrivateTreeUI = new BehaviorSubject_1.BehaviorSubject(null);
        this.SharedTreeUI = new BehaviorSubject_1.BehaviorSubject(null);
        this.KmlLayers = new BehaviorSubject_1.BehaviorSubject(null);
        this.MapKMLGridData = new BehaviorSubject_1.BehaviorSubject(null);
        this.MapKMLGridColumns = new BehaviorSubject_1.BehaviorSubject(null);
        this.KmlLayersData = new BehaviorSubject_1.BehaviorSubject(null);
        this.ExternalIconList = new BehaviorSubject_1.BehaviorSubject(null);
        this.PipelineCreateLayer = new BehaviorSubject_1.BehaviorSubject(null);
        this.RailRoadCreateLayer = new BehaviorSubject_1.BehaviorSubject(null);
        this.TemporaryTreenode = new BehaviorSubject_1.BehaviorSubject(null);
        this.TemporaryTreeUI = new BehaviorSubject_1.BehaviorSubject(null);
        this.LayerIndex = new BehaviorSubject_1.BehaviorSubject(null);
        this._drawingToolForElevation = new BehaviorSubject_1.BehaviorSubject(null);
        this._elevationGraphData = new BehaviorSubject_1.BehaviorSubject(null);
        this._drawingToolForDistance = new BehaviorSubject_1.BehaviorSubject(null);
        this._drawingToolForArea = new BehaviorSubject_1.BehaviorSubject(null);
        this._temporaryLayerData = new BehaviorSubject_1.BehaviorSubject(null);
        this._GlobaleSearchEnergyLayer = new BehaviorSubject_1.BehaviorSubject(null);
        this._SystemParameterList = new BehaviorSubject_1.BehaviorSubject(null);
        this.BaseMap = new BehaviorSubject_1.BehaviorSubject(null);
        this.parcelStates = new BehaviorSubject_1.BehaviorSubject(null);
        this.wellStates = new BehaviorSubject_1.BehaviorSubject(null);
        this.transProjects = new BehaviorSubject_1.BehaviorSubject(null);
        this.pipeActivities = new BehaviorSubject_1.BehaviorSubject(null);
        this.CompanyProfileData = new BehaviorSubject_1.BehaviorSubject(null);
        this.PipelineActivityData = new BehaviorSubject_1.BehaviorSubject(null);
        this.TransmissionProjectData = new BehaviorSubject_1.BehaviorSubject(null);
        this.PowerPlantData = new BehaviorSubject_1.BehaviorSubject(null);
        this.GeneratingUnitsData = new BehaviorSubject_1.BehaviorSubject(null);
        this.MapTitleString = new BehaviorSubject_1.BehaviorSubject(null);
        this.UserMap = new BehaviorSubject_1.BehaviorSubject(null);
        this.GlobalSearchText = new BehaviorSubject_1.BehaviorSubject(null);
        this.ActiveSearchDataLibrary = new BehaviorSubject_1.BehaviorSubject(null);
        this.CreateLayerParentObj = new BehaviorSubject_1.BehaviorSubject(null);
        this.LodedIsNotesArray = new BehaviorSubject_1.BehaviorSubject([]);
        this.drawingToolForParcelPoint = new BehaviorSubject_1.BehaviorSubject(null);
        this.drawingToolForParcelPointLines = new BehaviorSubject_1.BehaviorSubject(null);
        this.sitePermissions = new BehaviorSubject_1.BehaviorSubject(null);
        this.SharedData = new BehaviorSubject_1.BehaviorSubject(null);
        this.SharedLayersUserSearch = new BehaviorSubject_1.BehaviorSubject(null);
        this.isDrawToolsOpened = new BehaviorSubject_1.BehaviorSubject(false);
        this.SetElavationvalue = {
            IsElavation: false,
            Unitvalue: "Feet"
        };
        this.SharedUserList = [];
        // private MydataLibraryTotalCount = new BehaviorSubject<any>(null);
        //public MydataLibraryTotalCount:number = 0;
        this._mapdata = this._mapsharedata;
        this._GridTabData = this._GridTabsData;
        this.GridData = this.MapGridData;
        this.LodedGridData = this.LodedMapGridData;
        this.GridColumns = this.MapGridColumns;
        this.LodedGridColumns = this.LodedMapGridColumns;
        this.GridResult = this.GridDataResult;
        this.GridApi = this.GridDataAPi;
        this.KMLGridApi = this.KMLGridDataAPi;
        this.MapsearchLayersCategory = this.LayersCategory;
        this.EnergyLayerLibrary = this.MapSearchEnergyLayerLibrary;
        this.ActiveLayerslst = this.ActiveLayersList;
        this.TreeNodes = this.Treenode;
        this._TreeUI = this.TreeUI;
        // GridApi = this.GridDataAPi;
        this._HomeWidgetArray = this.HomeWidgetArray;
        this.drawingManagerTool = this.DrawingTool;
        this.MyDataLibrary = this.MyDataLayerLibrary;
        this.PrivateTreeNode = this.PrivateTreenode;
        this._SharedTreeNode = this.SharedTreenode;
        this._PrivateTreeUI = this.PrivateTreeUI;
        this._SharedTreeUI = this.SharedTreeUI;
        this.kmllayer = this.KmlLayers;
        this.KMLGridcolumns = this.MapKMLGridColumns;
        this.KMLGridData = this.MapKMLGridData;
        this.kmlLayersData = this.KmlLayersData;
        this._ExternalIconList = this.ExternalIconList;
        this._PipelineCreateLayer = this.PipelineCreateLayer;
        this.TemporaryTreeNode = this.TemporaryTreenode;
        this._TemporaryTreeUI = this.TemporaryTreeUI;
        this.layerIndex = this.LayerIndex;
        this._elevationDrawingTool = this._drawingToolForElevation;
        this._graphData = this._elevationGraphData;
        this._distanceDrawingTool = this._drawingToolForDistance;
        this._areaDrawingTool = this._drawingToolForArea;
        // MydataLibraryCount = this.MydataLibraryTotalCount;
        this._tempLayerData = this._temporaryLayerData;
        this._GlobalsearchLayerList = this._GlobaleSearchEnergyLayer;
        this._Systemperlst = this._SystemParameterList;
        this.BaseMapData = this.BaseMap;
        this.parcelStateData = this.parcelStates;
        this.wellStateData = this.wellStates;
        this.transProjectData = this.transProjects;
        this.pipeActivityData = this.pipeActivities;
        this._CompanyProfile = this.CompanyProfileData;
        this._PipelineActivityData = this.PipelineActivityData;
        this._TransmissionProjectData = this.TransmissionProjectData;
        this._PowerPlantData = this.PowerPlantData;
        this._GeneratingUnitsData = this.GeneratingUnitsData;
        this._UserMapData = this.UserMap;
        this._SharedData = this.SharedData;
        this._SharedLayersUserSearch = this.SharedLayersUserSearch;
        this.legendData = new rxjs_1.Subject();
        this.legendData$ = this.legendData.asObservable();
        this.globalsearchData = new rxjs_1.Subject();
        this.globalsearchData$ = this.globalsearchData.asObservable();
        this.showDefaultCategoryId = 1;
        this.temporaryLayer = [];
        this.MyProfileUserDetails = [];
        this.ExternalEnergyLayer = [];
        this.siteSelectionData = {
            isLayerLoaded: false,
            loadedEnergyLayerIds: null,
            loadedToolsData: null
        };
    }
    MapServiceService.prototype.GetLegendData = function () { this.legendData.next(); };
    MapServiceService.prototype.GlobalSearchResult = function () { this.globalsearchData.next(); };
    MapServiceService.prototype.setTreeUI = function (tree) {
        this.TreeUI.next(tree);
    };
    MapServiceService.prototype.setTreenode = function (node) {
        this.Treenode.next(node);
    };
    MapServiceService.prototype.setPrivateTreeUI = function (tree) {
        this.PrivateTreeUI.next(tree);
    };
    MapServiceService.prototype.setSharedTreeUI = function (tree) {
        this.SharedTreeUI.next(tree);
    };
    MapServiceService.prototype.setPrivateTreenode = function (node) {
        this.PrivateTreeNode.next(node);
    };
    MapServiceService.prototype.setSharedTreenode = function (node) {
        this._SharedTreeNode.next(node);
    };
    MapServiceService.prototype.setTemporaryTreeUI = function (tree) {
        this.TemporaryTreeUI.next(tree);
    };
    MapServiceService.prototype.setTemporaryTreenode = function (node) {
        this.TemporaryTreenode.next(node);
    };
    MapServiceService.prototype.setDrawToolTreenode = function (node) {
        this.DrawToolTreenode.next(node);
    };
    MapServiceService.prototype.setSharedDrawToolTreenode = function (node) {
        this.SharedDrawToolTreenode.next(node);
    };
    MapServiceService.prototype.setActiveLayerslist = function (activeLayerLibrary) {
        this.ActiveLayersList.next(activeLayerLibrary);
    };
    MapServiceService.prototype.setMapSearchEnergyLayerLibrary = function (LayersLibrary) {
        this.MapSearchEnergyLayerLibrary.next(LayersLibrary);
    };
    MapServiceService.prototype.setMapsearchLayersCategory = function (LayersCategory) {
        this.LayersCategory.next(LayersCategory);
    };
    MapServiceService.prototype.setGridapi = function (GridApi) {
        this.GridDataAPi.next(GridApi);
    };
    MapServiceService.prototype.setKMLGridapi = function (KmlGridApi) {
        this.KMLGridApi.next(KmlGridApi);
    };
    MapServiceService.prototype.setGridResults = function (GridResults) {
        this.GridDataResult.next(GridResults);
    };
    MapServiceService.prototype.setGridMapData = function (Grid) {
        this.MapGridData.next(Grid);
    };
    MapServiceService.prototype.setLodedGridMapData = function (Grid) {
        this.LodedGridData.next(Grid);
    };
    MapServiceService.prototype.getLodedGridMapData = function () {
        return this.LodedGridData;
    };
    MapServiceService.prototype.setGridMapcolumns = function (columns) {
        this.MapGridColumns.next(columns);
    };
    MapServiceService.prototype.getGridMapColumns = function () {
        return this.MapGridColumns;
    };
    MapServiceService.prototype.setLodedGridMapcolumns = function (columns) {
        this.LodedGridColumns.next(columns);
    };
    MapServiceService.prototype.getLodedGridMapcolumns = function () {
        return this.LodedGridColumns;
    };
    MapServiceService.prototype.setTabData = function (tab) {
        this._GridTabData.next(tab);
    };
    MapServiceService.prototype.setMap = function (map) {
        this._mapsharedata.next(map);
    };
    MapServiceService.prototype.setHomeWidgetArray = function (PanelArray) {
        this.HomeWidgetArray.next(PanelArray);
    };
    MapServiceService.prototype.setMyDataLayerLibrary = function (LayersLibrary) {
        this.MyDataLayerLibrary.next(LayersLibrary);
    };
    MapServiceService.prototype.setKmlLayers = function (layer) {
        this.KmlLayers.next(layer);
    };
    MapServiceService.prototype.setKMLGridMapData = function (Grid) {
        this.KMLGridData.next(Grid);
    };
    MapServiceService.prototype.getKMLGridMapData = function () {
        return this.KMLGridData;
    };
    MapServiceService.prototype.setKMLGridMapcolumns = function (columns) {
        this.MapKMLGridColumns.next(columns);
    };
    MapServiceService.prototype.getKMLGridMapColumns = function () {
        return this.MapKMLGridColumns;
    };
    MapServiceService.prototype.setKMLLayersData = function (data) {
        this.KmlLayersData.next(data);
    };
    // setMydataLibraryCount(count: any) {
    //     this.MydataLibraryTotalCount.next(count);
    // }
    MapServiceService.prototype.setLayerIndex = function (index) {
        this.LayerIndex.next(index);
    };
    MapServiceService.prototype.setExternalIconList = function (ExternalIcon) {
        this.ExternalIconList.next(ExternalIcon);
    };
    MapServiceService.prototype.setPipelinecreatetool = function (Pipeline) {
        this.PipelineCreateLayer.next(Pipeline);
    };
    MapServiceService.prototype.setRailroadcreatetool = function (RailRoad) {
        this.RailRoadCreateLayer.next(RailRoad);
    };
    MapServiceService.prototype.setDrawingToolElevation = function (tool) {
        this._elevationDrawingTool.next(tool);
    };
    MapServiceService.prototype.setElevationGraphData = function (data) {
        this._graphData.next(data);
    };
    MapServiceService.prototype.setDrawingToolDistance = function (tool) {
        this._distanceDrawingTool.next(tool);
    };
    MapServiceService.prototype.setDrawingToolArea = function (tool) {
        this._areaDrawingTool.next(tool);
    };
    MapServiceService.prototype.setTemporaryLayerData = function (tempLayer) {
        this._temporaryLayerData.next(tempLayer);
    };
    MapServiceService.prototype.setGlobaleSearchEnergyLayer = function (globalLayerList) {
        this._GlobaleSearchEnergyLayer.next(globalLayerList);
    };
    MapServiceService.prototype.setSystemParameterList = function (sys) {
        this._SystemParameterList.next(sys);
    };
    MapServiceService.prototype.setBaseMap = function (_basemap) {
        this.BaseMap.next(_basemap);
    };
    MapServiceService.prototype.setParcelStates = function (_pStates) {
        this.parcelStates.next(_pStates);
    };
    MapServiceService.prototype.setWellStates = function (_wStates) {
        this.wellStates.next(_wStates);
    };
    MapServiceService.prototype.setTransProject = function (_tProjects) {
        this.transProjects.next(_tProjects);
    };
    MapServiceService.prototype.setPipeActivity = function (_pActivities) {
        this.pipeActivities.next(_pActivities);
    };
    MapServiceService.prototype.setCompanyProfileData = function (cmpdata) {
        this.CompanyProfileData.next(cmpdata);
    };
    MapServiceService.prototype.setPipelineActivityData = function (pipelinedata) {
        this.PipelineActivityData.next(pipelinedata);
    };
    MapServiceService.prototype.setTransmissionProjectdata = function (transdata) {
        this.TransmissionProjectData.next(transdata);
    };
    MapServiceService.prototype.setPowerPlantdata = function (powerdata) {
        this.PowerPlantData.next(powerdata);
    };
    MapServiceService.prototype.setGeneraryingUnitsdata = function (generatingdata) {
        this.GeneratingUnitsData.next(generatingdata);
    };
    MapServiceService.prototype.getMapTitledata = function () {
        return this.MapTitleString;
    };
    MapServiceService.prototype.setMapTitledata = function (title) {
        this.MapTitleString.next(title);
    };
    MapServiceService.prototype.setUserMap = function (_usermap) {
        this.UserMap.next(_usermap);
    };
    MapServiceService.prototype.setSharedData = function (_sharedData) {
        this.SharedData.next(_sharedData);
    };
    MapServiceService.prototype.setGlobalSearchText = function (searchText) {
        this.GlobalSearchText.next(searchText);
    };
    MapServiceService.prototype.setSharedLayersUserSearch = function (search) {
        this.SharedLayersUserSearch.next(search);
    };
    MapServiceService.prototype.setActiveSearchDataLibrary = function (data) {
        this.ActiveSearchDataLibrary.next(data);
    };
    MapServiceService.prototype.setCreateLayerParentObj = function (data) {
        this.CreateLayerParentObj.next(data);
    };
    MapServiceService.prototype.setLodedIsNotesArray = function (item) {
        var data = this.LodedIsNotesArray.getValue();
        var itemIndex = data.findIndex(function (x) { return x.energylayerId == item.energylayerId; });
        if (itemIndex > -1) {
            // if (data[itemIndex].NotesData && item.NotesData && data[itemIndex].NotesData.length != item.NotesData.length) {
            data[itemIndex] = item;
            this.LodedIsNotesArray.next(data);
            // }
        }
        else {
            data.push(item);
            this.LodedIsNotesArray.next(data);
        }
    };
    MapServiceService.prototype.setDrawingToolForParcelPoint = function (tool) {
        this.drawingToolForParcelPoint.next(tool);
    };
    MapServiceService.prototype.setDrawingToolForParcelPointLines = function (tool) {
        this.drawingToolForParcelPointLines.next(tool);
    };
    MapServiceService.prototype.setSitePermissions = function (data) {
        this.sitePermissions.next(data);
    };
    MapServiceService.prototype.DestroyAllObjects = function () {
        this._mapsharedata.next(null);
        this._GridTabsData.next(null);
        this.MapGridData.next(null);
        this.LodedMapGridData.next(null);
        this.MapGridColumns.next(null);
        this.LodedMapGridColumns.next(null);
        this.GridDataResult.next(null);
        this.GridDataAPi.next(null);
        this.KMLGridDataAPi.next(null);
        this.LayersCategory.next(null);
        this.ActiveLayersList.next(null);
        this.MapSearchEnergyLayerLibrary.next(null);
        this.HomeWidgetArray.next(null);
        this.Treenode.next(null);
        this.TreeUI.next(null);
        this.DrawingTool.next(null);
        this.MyDataLayerLibrary.next(null);
        this.PrivateTreenode.next(null);
        this.PrivateTreeUI.next(null);
        this.SharedTreeUI.next(null);
        this.KmlLayers.next(null);
        this.MapKMLGridData.next(null);
        this.MapKMLGridColumns.next(null);
        this.KmlLayersData.next(null);
        this.ExternalIconList.next(null);
        this.PipelineCreateLayer.next(null);
        this.RailRoadCreateLayer.next(null);
        this.TemporaryTreenode.next(null);
        this.TemporaryTreeUI.next(null);
        this.LayerIndex.next(null);
        this._drawingToolForElevation.next(null);
        this._drawingToolForDistance.next(null);
        this._drawingToolForArea.next(null);
        this._elevationGraphData.next(null);
        this._temporaryLayerData.next(null);
        this._GlobaleSearchEnergyLayer.next(null);
        this._SystemParameterList.next(null);
        this.BaseMap.next(null);
        this.parcelStates.next(null);
        this.wellStates.next(null);
        this.transProjects.next(null);
        this.pipeActivities.next(null);
        this.ColumnsGriddata = [];
        this.ColumnsGriddatawithKey = [];
        this.columnfilterval = [];
        this._columnfiltervalStatus = "";
        this.UserMap.next(null);
        this.GlobalSearchText.next(null);
        this.ActiveSearchDataLibrary.next(null);
        this.MyProfileUserDetails = [];
        this.MapTitleString.next(null);
        this.CreateLayerParentObj.next(null);
        this.LodedIsNotesArray.next([]);
        this.drawingToolForParcelPoint.next(null);
        this.drawingToolForParcelPointLines.next(null);
        this.SharedData.next(null);
        this.SharedLayersUserSearch.next(null);
        this.isDrawToolsOpened.next(false);
        this.SharedUserList = [];
        this.siteSelectionData = {};
        this.httpRequest.geoRequestSavedData.next([]);
        this.sitePermissions.next(null);
        this._SharedTreeNode.next(null);
    };
    MapServiceService.prototype.CreateCQL_FilterLoop = function (Filter, filtercondition) {
        // let sld_filter = '<Filter xmlns="http://www.opengis.net/ogc">'        
        //     + '<And>'
        var sld_filter = '';
        for (var i = 0; i < Filter.length; i++) {
            // if (Filter[i].indexOf("#OR#") !== -1) {
            //     let FilterData = Filter[i].split('#OR#');
            //     sld_filter += this.CreateCQL_FilterLoopForHome(FilterData, ' Or ');
            // }
            if (Filter[i].indexOf("#semicolon#") != -1)
                Filter[i] = Filter[i].replace(/#semicolon#/g, ";");
            if (Filter[i].indexOf("=") !== -1 && Filter[i].indexOf("<") == -1 && Filter[i].indexOf(">") == -1) {
                var FilterValue = Filter[i].split('=');
                var PropertyName = FilterValue[0];
                var Literal = FilterValue[1];
                if (sld_filter == "") {
                    sld_filter = ' (' + PropertyName + '=' + "'" + encodeURIComponent(Literal) + "'";
                }
                else {
                    sld_filter += filtercondition + ' ' + PropertyName + '=' + "'" + encodeURIComponent(Literal) + "'";
                }
                // sld_filter += '<PropertyIsEqualTo matchCase="false">'
                //     + '<PropertyName>' + PropertyName + '</PropertyName>'
                //     + '<Literal>' + Literal + '</Literal>'
                //     + '</PropertyIsEqualTo>';
            }
            if (Filter[i].indexOf(">") !== -1 && Filter[i].indexOf("=") == -1 && Filter[i].indexOf("#EQUAL#") == -1) {
                var FilterValue = Filter[i].split('>');
                var PropertyName = FilterValue[0];
                var Literal = FilterValue[1];
                if (sld_filter == "") {
                    sld_filter = ' (' + PropertyName + ' > ' + encodeURIComponent(Literal) + ' ';
                }
                else {
                    sld_filter += ' ' + filtercondition + PropertyName + ' > ' + encodeURIComponent(Literal) + ' ';
                }
                // sld_filter += '<PropertyIsGreaterThan matchCase="false">'
                //     + '<PropertyName>' + PropertyName + '</PropertyName>'
                //     + '<Literal>' + Literal + '</Literal>'
                //     + '</PropertyIsGreaterThan>';
            }
            if (Filter[i].indexOf(">=") !== -1) {
                var FilterValue = Filter[i].split('>=');
                var PropertyName = FilterValue[0];
                var Literal = FilterValue[1];
                if (sld_filter == "") {
                    sld_filter = ' (' + PropertyName + ' >= ' + encodeURIComponent(Literal) + ' ';
                }
                else {
                    sld_filter += ' ' + filtercondition + PropertyName + ' >= ' + encodeURIComponent(Literal) + ' ';
                }
            }
            if (Filter[i].indexOf("<") !== -1 && Filter[i].indexOf("=") == -1 && Filter[i].indexOf("#EQUAL#") == -1) {
                var FilterValue = Filter[i].split('<');
                var PropertyName = FilterValue[0];
                var Literal = FilterValue[1];
                if (sld_filter == "") {
                    sld_filter = ' (' + PropertyName + ' < ' + encodeURIComponent(Literal) + ' ';
                }
                else {
                    sld_filter += ' ' + filtercondition + PropertyName + ' < ' + encodeURIComponent(Literal) + ' ';
                }
                // sld_filter += '<PropertyIsLessThan matchCase="false">'
                //     + '<PropertyName>' + PropertyName + '</PropertyName>'
                //     + '<Literal>' + Literal + '</Literal>'
                //     + '</PropertyIsLessThan>';
            }
            if (Filter[i].indexOf("<=") !== -1) {
                var FilterValue = Filter[i].split('<=');
                var PropertyName = FilterValue[0];
                var Literal = FilterValue[1];
                if (sld_filter == "") {
                    sld_filter = ' (' + PropertyName + ' <= ' + encodeURIComponent(Literal) + ' ';
                }
                else {
                    sld_filter += ' ' + filtercondition + PropertyName + ' <= ' + encodeURIComponent(Literal) + ' ';
                }
                // sld_filter += '<PropertyIsLessThanOrEqualTo matchCase="false">'
                //     + '<PropertyName>' + PropertyName + '</PropertyName>'
                //     + '<Literal>' + Literal + '</Literal>'
                //     + '</PropertyIsLessThanOrEqualTo>';
            }
            if (Filter[i].indexOf("#EQUAL#") !== -1) {
                var FilterValue = Filter[i].split('#EQUAL#');
                var PropertyName = FilterValue[0];
                var Literal = FilterValue[1];
                // sld_filter += '<PropertyIsEqualTo matchCase="false">'
                //     + '<PropertyName>' + PropertyName + '</PropertyName>'
                //     + '<Literal>' + Literal + '</Literal>'
                //     + '</PropertyIsEqualTo>';
                if (sld_filter == "") {
                    sld_filter = ' (' + PropertyName + '=' + "'" + encodeURIComponent(Literal) + "' ";
                }
                else {
                    sld_filter += ' ' + filtercondition + PropertyName + '=' + "'" + encodeURIComponent(Literal) + "' ";
                }
            }
            if (Filter[i].indexOf("#NOTEQUAL#") !== -1) {
                var FilterValue = Filter[i].split('#NOTEQUAL#');
                var PropertyName = FilterValue[0];
                var Literal = FilterValue[1];
                // sld_filter += '<PropertyIsEqualTo matchCase="false">'
                //     + '<PropertyName>' + PropertyName + '</PropertyName>'
                //     + '<Literal>' + Literal + '</Literal>'
                //     + '</PropertyIsEqualTo>';
                if (sld_filter == "") {
                    sld_filter = ' (' + PropertyName + '<>' + "'" + encodeURIComponent(Literal) + "' ";
                }
                else {
                    sld_filter += ' ' + filtercondition + PropertyName + '<>' + "'" + encodeURIComponent(Literal) + "' ";
                }
            }
            if (Filter[i].indexOf("#LIKE#") !== -1) {
                var FilterValue = Filter[i].split('#LIKE#');
                var PropertyName = FilterValue[0];
                var Literal = FilterValue[1];
                // sld_filter += '<PropertyIsLike matchCase="false" wildCard="*" singleChar="." escape="!">'
                //     + '<PropertyName>' + PropertyName + '</PropertyName>'
                //     + '<Literal>*' + Literal + '*</Literal>'
                //     + '</PropertyIsLike>';
                if (sld_filter == "") {
                    sld_filter = ' (' + PropertyName + ' ILIKE ' + " '%25" + encodeURIComponent(Literal) + "%25' ";
                }
                else {
                    sld_filter += ' ' + filtercondition + PropertyName + ' ILIKE ' + " '%25" + encodeURIComponent(Literal) + "%25' ";
                }
            }
        }
        // sld_filter += '</And>'
        //     + '</Filter>'
        return sld_filter + ')';
    };
    MapServiceService.prototype.CreateCQL_FilterLoopForHome = function (Filter, filtercondition) {
        var sld_filter = '';
        for (var i = 0; i < Filter.length; i++) {
            if (Filter[i]) {
                if (i == 0 || sld_filter == '')
                    sld_filter += ' (';
                else
                    sld_filter += filtercondition + ' (';
                if (Filter[i].indexOf("=") !== -1 && Filter[i].indexOf("<") == -1 && Filter[i].indexOf(">") == -1) {
                    var FilterValue = Filter[i].split('#OR#').filter(function (x) { return x != ''; });
                    // let Literal = FilterValue;
                    for (var j = 0; j < FilterValue.length; j++) {
                        var FilterItem = FilterValue[j].split('=');
                        var PropertyName = FilterItem[0];
                        var PropertyValue = FilterItem[1];
                        sld_filter += PropertyName + '=' + "'" + encodeURIComponent(PropertyValue) + "'" + ((FilterValue.length != j + 1) ? ' or ' : '');
                    }
                }
                if (Filter[i].indexOf("#LIKE#") !== -1 && Filter[i].indexOf("=") == -1) {
                    // let FilterValue = Filter[i].replace(/#OR#/g,' or ').replace('#AND#',' and ');
                    var FilterValue = Filter[i].split('#OR#').filter(function (x) { return x != ''; });
                    for (var j = 0; j < FilterValue.length; j++) {
                        var FilterItem = FilterValue[j].split('#LIKE#');
                        var PropertyName = FilterItem[0];
                        var PropertyValue = FilterItem[1];
                        sld_filter += PropertyName + ' ILIKE ' + " '%25" + encodeURIComponent(PropertyValue) + "%25' " + ((FilterValue.length != j + 1) ? ' or ' : '');
                    }
                }
                sld_filter += ' )';
            }
        }
        return sld_filter;
    };
    MapServiceService.prototype.gridfilter = function (IsFiltervalue) {
        if (IsFiltervalue === void 0) { IsFiltervalue = []; }
        var cql_Filter = "";
        var Isreturn = false;
        if (IsFiltervalue.length > 0) {
            for (var _i = 0, IsFiltervalue_1 = IsFiltervalue; _i < IsFiltervalue_1.length; _i++) {
                var f = IsFiltervalue_1[_i];
                if (f != undefined && f != null && f != '') {
                    var CQLFilter = this.CreateCQL_Filter(f, 'and');
                    // let orcqlfilter = '';
                    // for (let x of CQLFilter.trim().split('and')) {
                    //     if (orcqlfilter == "") {
                    //         orcqlfilter = x;
                    //     }
                    //     else {
                    //         orcqlfilter += ' or ' + x;
                    //     }
                    // }
                    if (cql_Filter == "") {
                        cql_Filter = CQLFilter;
                    }
                    else {
                        cql_Filter += " and " + CQLFilter;
                    }
                    Isreturn = true;
                }
            }
        }
        if (Isreturn == true)
            return cql_Filter;
        else
            return '';
    };
    MapServiceService.prototype.filterval = function (IsFiltervalue) {
        if (IsFiltervalue === void 0) { IsFiltervalue = []; }
        var cql_Filter = "";
        var Isreturn = false;
        if (IsFiltervalue.length > 0) {
            for (var _i = 0, IsFiltervalue_2 = IsFiltervalue; _i < IsFiltervalue_2.length; _i++) {
                var f = IsFiltervalue_2[_i];
                if (f != undefined && f != null && f != '') {
                    var CQLFilter = this.CreateCQL_Filter(f, ' and ');
                    //let CQLFilter = this.MapLayerService.CreateFilter(f);
                    if (cql_Filter == "") {
                        cql_Filter = CQLFilter;
                        // cql_Filter = '&filter=' + CQLFilter;
                    }
                    else {
                        cql_Filter += " or " + CQLFilter;
                    }
                    Isreturn = true;
                }
            }
        }
        if (Isreturn == true)
            return cql_Filter;
        else
            return '';
    };
    MapServiceService.prototype.filtervalForHomeLookup = function (IsFiltervalue) {
        if (IsFiltervalue === void 0) { IsFiltervalue = []; }
        var cql_Filter = "";
        var Isreturn = false;
        if (IsFiltervalue.length > 0) {
            for (var _i = 0, IsFiltervalue_3 = IsFiltervalue; _i < IsFiltervalue_3.length; _i++) {
                var f = IsFiltervalue_3[_i];
                if (f != undefined && f != null && f != '') {
                    var CQLFilter = this.CreateCQL_FilterForHome(f, ' and ');
                    //let CQLFilter = this.MapLayerService.CreateFilter(f);
                    if (cql_Filter == "") {
                        cql_Filter = CQLFilter;
                        // cql_Filter = '&filter=' + CQLFilter;
                    }
                    else {
                        cql_Filter += " or " + CQLFilter;
                    }
                    Isreturn = true;
                }
            }
        }
        if (Isreturn == true)
            return cql_Filter;
        else
            return '';
    };
    MapServiceService.prototype.CreateCQL_Filter = function (FilterValueData, filtercondition) {
        var sld_filter = "";
        if (FilterValueData != null && FilterValueData != "") {
            // FilterValueData = FilterValueData.replace('#EQUAL#', '=');            
            if (FilterValueData.indexOf(";") !== -1) {
                var Filter = FilterValueData.split(';');
                Filter = Filter.filter(function (x) { return x != "" && x != undefined && x != null; });
                for (var index = 0; index < Filter.length; index++) {
                    if (Filter[index].indexOf("#OR#") !== -1) {
                        var FilterData = Filter[index].split('#OR#');
                        if (sld_filter)
                            sld_filter += filtercondition;
                        sld_filter += this.CreateCQL_FilterLoop(FilterData, ' Or ');
                    }
                    else if (Filter[index].indexOf(";") !== -1) {
                        sld_filter += this.CreateCQL_FilterLoop(Filter, filtercondition);
                    }
                    else if (Filter[index].indexOf(";") == -1 && Filter[index].indexOf("#OR#") == -1) {
                        if (sld_filter) {
                            sld_filter += filtercondition;
                            sld_filter += this.SingleCQL_filterFilterLoop(Filter[index]);
                        }
                        else {
                            sld_filter += this.SingleCQL_filterFilterLoop(Filter[index]);
                        }
                    }
                }
            }
            else if (FilterValueData.indexOf("#OR#") !== -1) {
                var Filter = FilterValueData.split('#OR#');
                sld_filter += this.CreateCQL_FilterLoop(Filter, ' Or ');
            }
            if (sld_filter == "") {
                // sld_filter += '<Filter xmlns="http://www.opengis.net/ogc">'
                //     + '<And>'
                sld_filter += this.SingleCQL_filterFilterLoop(FilterValueData);
                // sld_filter += '</And>'
                //     + '</Filter>'
            }
        }
        //return encodeURIComponent(sld_filter);
        return sld_filter;
    };
    MapServiceService.prototype.CreateCQL_FilterForHome = function (FilterValueData, filtercondition) {
        var sld_filter = "";
        if (FilterValueData != null && FilterValueData != "") {
            // FilterValueData = FilterValueData.replace('#EQUAL#', '=');            
            if (FilterValueData.indexOf(";") !== -1) {
                var Filter = FilterValueData.split(';');
                sld_filter += this.CreateCQL_FilterLoopForHome(Filter, filtercondition);
            }
            // if (FilterValueData.indexOf("#OR#") !== -1) {
            //     let Filter = FilterValueData.split('#OR#');
            //     sld_filter += this.CreateCQL_FilterLoop(Filter, ' Or ');
            // }
            if (sld_filter == "") {
                // sld_filter += '<Filter xmlns="http://www.opengis.net/ogc">'
                //     + '<And>'
                sld_filter += this.SingleCQL_filterFilterLoop(FilterValueData);
                // sld_filter += '</And>'
                //     + '</Filter>'
            }
        }
        //return encodeURIComponent(sld_filter);
        return sld_filter;
    };
    MapServiceService.prototype.SingleCQL_filterFilterLoop = function (Filter) {
        var sld_filter = "";
        if (Filter.indexOf("#semicolon#") != -1)
            Filter = Filter.replace(/#semicolon#/g, ";");
        if (Filter.indexOf("DWITHIN") !== -1) {
            sld_filter += ' (' + Filter;
        }
        if (Filter.indexOf("#EQUAL#") !== -1) {
            var FilterValue = Filter.split('#EQUAL#');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            if (sld_filter == '')
                sld_filter += ' (' + PropertyName + ' = ' + "'" + encodeURIComponent(Literal) + "'";
            // sld_filter += '<PropertyIsEqualTo matchCase="false">'
            //     + '<PropertyName>' + PropertyName + '</PropertyName>'
            //     + '<Literal>' + Literal + '</Literal>'
            //     + '</PropertyIsEqualTo>';
        }
        if (Filter.indexOf("#LIKE#") !== -1) {
            var FilterValue = Filter.split('#LIKE#');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            // sld_filter += '<PropertyIsLike matchCase="false" wildCard="*" singleChar="." escape="!">'
            //     + '<PropertyName>' + PropertyName + '</PropertyName>'
            //     + '<Literal>*' + Literal + '*</Literal>'
            //     + '</PropertyIsLike>';
            if (sld_filter == '')
                sld_filter += ' (' + PropertyName + ' ILIKE ' + "'%25" + encodeURIComponent(Literal) + "%25'";
        }
        if (Filter.indexOf("=") !== -1 && Filter.indexOf("<") == -1 && Filter.indexOf(">") == -1) {
            var FilterValue = Filter.split('=');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            if (sld_filter == '')
                sld_filter += ' (' + PropertyName + ' = ' + "'" + encodeURIComponent(Literal) + "'";
            // sld_filter += '<PropertyIsEqualTo matchCase="false">'
            //     + '<PropertyName>' + PropertyName + '</PropertyName>'
            //     + '<Literal>' + Literal + '</Literal>'
            //     + '</PropertyIsEqualTo>';
        }
        if (Filter.indexOf(">") !== -1 && Filter.indexOf("=") == -1) {
            var FilterValue = Filter.split('>');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            if (sld_filter == '')
                sld_filter += ' (' + PropertyName + ' > ' + encodeURIComponent(Literal);
            // sld_filter += '<PropertyIsGreaterThan matchCase="false">'
            //     + '<PropertyName>' + PropertyName + '</PropertyName>'
            //     + '<Literal>' + Literal + '</Literal>'
            //     + '</PropertyIsGreaterThan>';
        }
        if (Filter.indexOf("<") !== -1 && Filter.indexOf("=") == -1) {
            var FilterValue = Filter.split('<');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            if (sld_filter == '')
                sld_filter += ' (' + PropertyName + ' < ' + encodeURIComponent(Literal);
            // sld_filter += '<PropertyIsLessThan matchCase="false">'
            //     + '<PropertyName>' + PropertyName + '</PropertyName>'
            //     + '<Literal>' + Literal + '</Literal>'
            //     + '</PropertyIsLessThan>';
        }
        if (Filter.indexOf("<=") !== -1) {
            var FilterValue = Filter.split('<=');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            // sld_filter += '<PropertyIsLessThanOrEqualTo matchCase="false">'
            //     + '<PropertyName>' + PropertyName + '</PropertyName>'
            //     + '<Literal>' + Literal + '</Literal>'
            //     + '</PropertyIsLessThanOrEqualTo>';
            sld_filter += ' (' + PropertyName + ' <= ' + encodeURIComponent(Literal);
        }
        if (Filter.indexOf(">=") !== -1) {
            var FilterValue = Filter.split('>=');
            var PropertyName = FilterValue[0];
            var Literal = FilterValue[1];
            // sld_filter += '<PropertyIsLessThanOrEqualTo matchCase="false">'
            //     + '<PropertyName>' + PropertyName + '</PropertyName>'
            //     + '<Literal>' + Literal + '</Literal>'
            //     + '</PropertyIsLessThanOrEqualTo>';
            sld_filter += ' (' + PropertyName + ' >= ' + encodeURIComponent(Literal);
        }
        if (sld_filter)
            sld_filter = sld_filter + ')';
        return sld_filter;
    };
    MapServiceService.prototype.getForDistinctCqlFilter = function (filetrval, bbox) {
        var bboxval = '';
        var returnfilterval = '';
        bbox = false;
        if (bbox == true) {
            //  bboxval = 'BBOX(the_geom,' + this.GetMapBound() + ')';
        }
        if (filetrval != '' && bbox == true) {
            returnfilterval = '&CQL_FILTER=(' + bboxval + ' and (' + filetrval + '))';
        }
        else if (filetrval != '' && bbox == false) {
            returnfilterval = '&CQL_FILTER=(' + filetrval + ')';
        }
        else if (filetrval == '' && bbox == true) {
            returnfilterval = '&CQL_FILTER=(' + bboxval + ')';
        }
        return returnfilterval;
    };
    MapServiceService.prototype.GenerateColumns = function (layer) {
        if (layer.TableName) {
            //{ 
            //     headerName: "No.",
            //     width: 80,
            //     valueGetter: "node.id",
            //     cellRenderer: "loadingRenderer",
            //hide: true
            // }
            var columns = [{
                    headerName: "ID",
                    width: 10,
                    valueGetter: "node.id",
                    hide: true,
                    suppressSorting: true,
                    suppressMenu: true,
                    suppressFilter: true
                }];
            var columnslist = [{
                    headerName: "ID",
                    width: 10,
                    valueGetter: "node.id",
                    hide: true,
                }];
            var DBFPro = layer.DBFProperties.split(',');
            if (layer.DBFProperties.indexOf('=') > 0) {
                DBFPro = layer.DetailPanelPropertiesMain.split(',');
            }
            else {
                DBFPro = layer.DBFProperties.split(',');
            }
            DBFPro = _.uniqWith(DBFPro, _.isEqual);
            // let DBFPro = layer.DetailPanelPropertiesMain.split(',');
            for (var _i = 0, DBFPro_1 = DBFPro; _i < DBFPro_1.length; _i++) {
                var p = DBFPro_1[_i];
                var col = {
                    headerName: p,
                    field: p,
                    width: 120,
                    menuTabs: ["filterMenuTab"],
                    filter: "customMatchFilter",
                };
                if (columns.length == 1) {
                    col["cellRenderer"] = "loadingRenderer";
                }
                columns.push(col);
            }
            var DetailPanelPro = layer.DetailPanelProperties.split(',');
            if (layer.EnergyLayerStylesByUserModel && layer.EnergyLayerStylesByUserModel.length > 0) {
                var UserDetailPanelProperties = layer.EnergyLayerStylesByUserModel[0]['DetailPanelProperties'];
                if (!layer.EnergyLayerStylesByUserModel[0]['DetailPanelProperties']) {
                    DetailPanelPro = layer.DetailPanelProperties.split(',');
                }
                else {
                    DetailPanelPro = UserDetailPanelProperties.split(',');
                }
            }
            var _loop_1 = function (x) {
                var coldata = columns[x];
                var DetailPanelProres = DetailPanelPro.filter(function (el) {
                    var c = el.split('=');
                    if (c[1] === coldata.field) {
                        return el;
                    }
                });
                colWidth = 5;
                if (DetailPanelProres.length > 0) {
                    var c = DetailPanelProres[0].split("=");
                    var colTitle = c[0];
                    if (colTitle.length >= 10) {
                        colWidth += colTitle.length * 10;
                    }
                    else if (colTitle.length >= 20) {
                        colWidth += colTitle.length * 10;
                    }
                    else {
                        colWidth += 100; //colTitle.length * 5 + 5;
                    }
                    columns[x].headerName = c[0];
                    // columns[x].format = 'text';
                    // columns[x].hidden = true;
                    columns[x].width = colWidth;
                    // columns[x].suppressMenu = true;
                    // columns[x].suppressFilter = true;
                    columnslist.push(columns[x]);
                }
                if (columnslist.length > 1) {
                    columnslist[1]["cellRenderer"] = "loadingRenderer";
                }
            };
            var colWidth;
            for (var x in columns) {
                _loop_1(x);
            }
            var NotesColumn = {
                headerName: 'Notes',
                field: 'Notes',
                width: 120,
                menuTabs: ["filterMenuTab"],
                filter: "customMatchFilter",
                hide: true,
                filterParams: { newRowsAction: 'clear' }
            };
            columnslist.push(NotesColumn);
            return columnslist;
        }
        else {
            return "";
        }
    };
    MapServiceService.prototype.CloseFilterOnToggle = function () {
        $(".ag-header-cell-menu-button").off('click').on('click', function (event) {
            setTimeout(function () {
                $(".ag-menu").append("<div id='isFilterHide'></div>");
            }, 50);
            if ($('.ag-menu').length != 0) {
                if ($('#isFilterHide').length != 0) {
                    $('.ag-menu').remove();
                }
            }
        });
    };
    MapServiceService.prototype.GenerateColumnsForKml = function (properties) {
        var _this = this;
        var columns = [];
        var columnslist = [];
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var p = properties_1[_i];
            var col = {
                headerName: p,
                field: p,
                width: 120,
                menuTabs: ["filterMenuTab"],
                filter: "agSetColumnFilter",
                filterParams: {
                    applyButton: true,
                    clearButton: true,
                    // newRowsAction: "keep",
                    values: function (params) {
                        setTimeout(function () {
                            var filedname = params.colDef.field;
                            var _loop_2 = function (tab) {
                                if (tab.ActiveClass == " active") {
                                    var existingklayer = _this.kmlLayersData.getValue();
                                    var selectedKmlLayerData = existingklayer.filter(function (el) {
                                        if (el.LayerID == parseInt(tab.ID)) {
                                            return el;
                                        }
                                    });
                                    if (selectedKmlLayerData.length == 1) {
                                        _this.ColumnsGriddata = selectedKmlLayerData[0].LayerData.KMLGeometryList;
                                        var result = _this.ColumnsGriddata.map(function (a) { return a[filedname]; });
                                        var arr = _this.getDistinctarray(result);
                                        params.success(arr);
                                        _this.SetDistinctvalueWithKeyForKml(arr, filedname);
                                    }
                                }
                            };
                            for (var _i = 0, _a = _this._GridTabData.value; _i < _a.length; _i++) {
                                var tab = _a[_i];
                                _loop_2(tab);
                            }
                        }, 1000);
                    },
                    selectAllOnMiniFilter: true,
                    suppressMiniFilter: false,
                    cellHeight: 20
                }
            };
            if (columns.length == 0) {
                col["cellRenderer"] = "loadingRenderer";
            }
            columns.push(col);
        }
        for (var x in columns) {
            var coldata = columns[x];
            var colWidth = 5;
            var colTitle = coldata.field;
            if (colTitle.length >= 10) {
                colWidth += colTitle.length * 10;
            }
            else if (colTitle.length >= 20) {
                colWidth += colTitle.length * 10;
            }
            else {
                colWidth += 100; //colTitle.length * 5 + 5;
            }
            columns[x].headerName = coldata.field;
            // columns[x].format = 'text';
            // columns[x].hidden = true;
            columns[x].width = colWidth;
            // columns[x].suppressMenu = true;
            // columns[x].suppressFilter = true;
            columnslist.push(columns[x]);
            if (columnslist.length > 0) {
                columnslist[0]["cellRenderer"] = "loadingRenderer";
            }
        }
        return columnslist;
    };
    MapServiceService.prototype.setDistinctvaluewithKey = function (arr, filedname) {
        var _this = this;
        var Keyval = {
            Key: filedname,
            valList: arr
        };
        this.ColumnsGriddatawithKey.push(Keyval);
        $(".ag-virtual-list-viewport").scroll(function (e) {
            _this.Gridcolumncheckboxevent();
        });
        this.Gridcolumncheckboxevent();
        $('#selectAll').attr('checked', false).trigger('click');
        if (document.getElementById("clearButton") != null)
            $('#clearButton').attr('disabled', 'disabled');
    };
    MapServiceService.prototype.SetDistinctvalueWithKeyForKml = function (arr, filedname) {
        var _this = this;
        var Keyval = {
            Key: filedname,
            valList: arr
        };
        this.ColumnsGriddatawithKey.push(Keyval);
        $(".ag-virtual-list-viewport").scroll(function (e) {
            _this.GridColumnCheckboxEventForKml();
        });
        this.GridColumnCheckboxEventForKml();
        $('#selectAll').attr('checked', false).trigger('click');
        if (document.getElementById("clearButton") != null)
            $('#clearButton').attr('disabled', 'disabled');
    };
    MapServiceService.prototype.getDistinctarray = function (result) {
        var arr = [];
        for (var i = 0; i < result.length; i++) {
            if (result[i] != undefined && result[i] != null) {
                if (!arr.includes(result[i])) {
                    arr.push(result[i]);
                }
            }
        }
        return arr;
    };
    MapServiceService.prototype.ClearColumncheckvalue = function () {
        this.ColumnsGriddatawithKey = [];
        this.columnfilterval = [];
    };
    MapServiceService.prototype.Gridcolumncheckboxevent = function () {
        var _this = this;
        setTimeout(function () {
            $("#myGrid #richList .ag-filter-checkbox").off('click').on('click', function (e) {
                var filterval = '';
                if ($(e.currentTarget.offsetParent).length > 0) {
                    filterval = $(e.currentTarget.offsetParent)[0].children[0].children[1].innerText;
                }
                if (filterval != '') {
                    //this._columnfiltervalStatus = "";
                    //let checked = e.toElement.className.indexOf('ag-icon-checkbox-checked');                
                    var checked = e.currentTarget.innerHTML.indexOf('ag-icon-checkbox-checked');
                    _this.setGridFirlter(checked, filterval);
                    //this.Gridcolumncheckboxevent();
                }
            });
            $("#myGrid #richList .ag-virtual-list-item").off('click').on('click', function (e) {
                var filterval = e.toElement.innerText;
                //let checked = e.currentTarget.children[0].innerHTML.indexOf('ag-icon-checkbox-unchecked');
                var checked = e.currentTarget.innerHTML.indexOf('ag-icon-checkbox-checked');
                // this._columnfiltervalStatus = "";
                _this.setGridFirlter(checked, filterval);
            });
        }, 100);
    };
    MapServiceService.prototype.GridColumnCheckboxEventForKml = function () {
        var _this = this;
        setTimeout(function () {
            $("#kmlGrid #richList .ag-filter-checkbox").off('click').on('click', function (e) {
                var filterval = '';
                if ($(e.currentTarget.offsetParent).length > 0) {
                    filterval = $(e.currentTarget.offsetParent)[0].children[0].children[1].innerText;
                }
                if (filterval != '') {
                    var checked = e.currentTarget.innerHTML.indexOf('ag-icon-checkbox-checked');
                    _this.SetGridFirlterForKml(checked, filterval);
                }
            });
            $("#kmlGrid #richList .ag-virtual-list-item").off('click').on('click', function (e) {
                var filterval = e.toElement.innerText;
                var checked = e.currentTarget.innerHTML.indexOf('ag-icon-checkbox-checked');
                _this.SetGridFirlterForKml(checked, filterval);
            });
        }, 100);
    };
    MapServiceService.prototype.setGridFirlter = function (Ischecked, filterval) {
        //let filterval = filterval;
        var isfilterval = false;
        //let abc = e.target.children[0].children[0].classList;
        this.columnfilterval.forEach(function (element) {
            if (element.Filterparamvalue == filterval) {
                isfilterval = true;
            }
        });
        if (Ischecked >= 0) {
            if (filterval && isfilterval) {
                var list_1 = [];
                if (this.columnfilterval.length == 1) {
                    this.columnfilterval.forEach(function (element) {
                        if (element.Filterparamvalue != filterval && isfilterval == false) {
                            list_1.push(element);
                        }
                    });
                }
                else {
                    this.columnfilterval.forEach(function (element) {
                        if (element.Filterparamvalue != filterval && isfilterval == true) {
                            list_1.push(element);
                        }
                    });
                }
                if (list_1.length > 0) {
                    this.columnfilterval = list_1;
                    this._columnfiltervalStatus = "";
                    // this.setFilterOngrid(this.columnfilterval);
                }
                else {
                    // this.columnfilterval = list;
                }
                if (isfilterval == true) {
                    var Filtyerval = this.setFilterOngrid(list_1);
                    var GridAPi = this.GridDataAPi.value.api;
                    if (Filtyerval) {
                        GridAPi.setFilterModel(Filtyerval);
                        GridAPi.onFilterChanged();
                    }
                    else {
                        var filterval_1 = {
                            key: ''
                        };
                        var a = JSON.stringify(filterval_1).replace("key", this.columnfilterval[0].filterparam);
                        GridAPi.setFilterModel(JSON.parse(a));
                        GridAPi.onFilterChanged();
                        // let clearbtn = document.getElementById("clearButton");
                        // clearbtn.click();
                    }
                }
                if (list_1.length == 0) {
                    this.columnfilterval = list_1;
                    this._columnfiltervalStatus = "Clear All Filter";
                }
            }
        }
        else {
            if (filterval) {
                for (var _i = 0, _a = this.ColumnsGriddatawithKey; _i < _a.length; _i++) {
                    var c = _a[_i];
                    for (var _b = 0, _c = c.valList; _b < _c.length; _b++) {
                        var v = _c[_b];
                        if (filterval == v && isfilterval == false) {
                            var filtervalarr = {
                                filterparam: c.Key,
                                Filterparamvalue: v
                            };
                            this.columnfilterval.push(filtervalarr);
                            this._columnfiltervalStatus = "";
                        }
                    }
                }
                if (isfilterval == false) {
                    var Filtyerval = this.setFilterOngrid(this.columnfilterval);
                    var GridAPi = this.GridDataAPi.value.api;
                    if (Filtyerval) {
                        GridAPi.setFilterModel(Filtyerval);
                        GridAPi.onFilterChanged();
                    }
                    else {
                        this._columnfiltervalStatus = "";
                        var clearbtn = document.getElementById("clearButton");
                        clearbtn.click();
                    }
                }
            }
        }
        if (isfilterval == false) {
            this.Gridcolumncheckboxevent();
        }
    };
    MapServiceService.prototype.SetGridFirlterForKml = function (Ischecked, filterval) {
        //let filterval = filterval;
        var isfilterval = false;
        //let abc = e.target.children[0].children[0].classList;
        this.columnfilterval.forEach(function (element) {
            if (element.Filterparamvalue == filterval) {
                isfilterval = true;
            }
        });
        if (Ischecked >= 0) {
            if (filterval && isfilterval) {
                var list_2 = [];
                if (this.columnfilterval.length == 1) {
                    this.columnfilterval.forEach(function (element) {
                        if (element.Filterparamvalue != filterval && isfilterval == false) {
                            list_2.push(element);
                        }
                    });
                }
                else {
                    this.columnfilterval.forEach(function (element) {
                        if (element.Filterparamvalue != filterval && isfilterval == true) {
                            list_2.push(element);
                        }
                    });
                }
                if (list_2.length > 0) {
                    this.columnfilterval = list_2;
                    this._columnfiltervalStatus = "";
                    // this.setFilterOngrid(this.columnfilterval);
                }
                else {
                    // this.columnfilterval = list;
                }
                if (isfilterval == true) {
                    var Filtyerval = this.setFilterOngrid(list_2);
                    var GridAPi = this.KMLGridDataAPi.value.api;
                    if (Filtyerval) {
                        GridAPi.setFilterModel(Filtyerval);
                        GridAPi.onFilterChanged();
                    }
                    else {
                        var filterval_2 = {
                            key: ''
                        };
                        var a = JSON.stringify(filterval_2).replace("key", this.columnfilterval[0].filterparam);
                        GridAPi.setFilterModel(JSON.parse(a));
                        GridAPi.onFilterChanged();
                        // let clearbtn = document.getElementById("clearButton");
                        // clearbtn.click();
                    }
                }
                if (list_2.length == 0) {
                    this.columnfilterval = list_2;
                    this._columnfiltervalStatus = "Clear All Filter";
                }
            }
        }
        else {
            if (filterval) {
                for (var _i = 0, _a = this.ColumnsGriddatawithKey; _i < _a.length; _i++) {
                    var c = _a[_i];
                    for (var _b = 0, _c = c.valList; _b < _c.length; _b++) {
                        var v = _c[_b];
                        if (filterval == v && isfilterval == false) {
                            var filtervalarr = {
                                filterparam: c.Key,
                                Filterparamvalue: v
                            };
                            this.columnfilterval.push(filtervalarr);
                            this._columnfiltervalStatus = "";
                        }
                    }
                }
                if (isfilterval == false) {
                    var Filtyerval = this.setFilterOngrid(this.columnfilterval);
                    var GridAPi = this.KMLGridDataAPi.value.api;
                    if (Filtyerval) {
                        GridAPi.setFilterModel(Filtyerval);
                        GridAPi.onFilterChanged();
                    }
                    else {
                        this._columnfiltervalStatus = "";
                        var clearbtn = document.getElementById("clearButton");
                        clearbtn.click();
                    }
                }
            }
        }
        if (isfilterval == false) {
            this.GridColumnCheckboxEventForKml();
        }
    };
    MapServiceService.prototype.setFilterOngrid = function (columnfilterval) {
        var keylist = [];
        var FinalfilterList;
        columnfilterval.forEach(function (element) {
            keylist.push(element.filterparam);
        });
        if (keylist.length > 0) {
            var Gridfilter = [];
            keylist = _.uniqWith(keylist, _.isEqual);
            for (var _i = 0, keylist_1 = keylist; _i < keylist_1.length; _i++) {
                var key = keylist_1[_i];
                var columnFilter = [];
                for (var _a = 0, columnfilterval_1 = columnfilterval; _a < columnfilterval_1.length; _a++) {
                    var f = columnfilterval_1[_a];
                    if (f.filterparam == key) {
                        columnFilter.push(f.Filterparamvalue);
                    }
                }
                if (columnFilter.length > 0) {
                    var val = {
                        key: columnFilter
                    };
                    var a = JSON.stringify(val).replace("key", key);
                    Gridfilter.push(JSON.parse(a));
                }
            }
            if (Gridfilter.length > 0) {
                for (var i = 0; i < Gridfilter.length; i++) {
                    if (i > 0) {
                        var key = d3_1.keys(Gridfilter[i])[0];
                        Gridfilter[0][key] = Gridfilter[i][key];
                    }
                }
                FinalfilterList = Gridfilter[0];
                // if (FinalfilterList) {
                //     let GridAPi = this.GridDataAPi.value.api;
                //     GridAPi.setFilterModel(FinalfilterList);
                //     GridAPi.onFilterChanged();
                // }
            }
        }
        return FinalfilterList;
        // else {
        //     let clearbtn = document.getElementById("clearButton");
        //     clearbtn.click();
        //     // let GridAPi = this.GridDataAPi.value.api;
        //     // GridAPi.setFilterModel(null);
        //     // GridAPi.onFilterChanged();
        // }
    };
    // #region Export Features
    MapServiceService.prototype.GetExportColumnsList = function (layer) {
        var columns = [];
        var columnslist = [];
        var DBFPro = layer.DBFProperties.split(',');
        if (layer.DBFProperties.indexOf('=') > 0) {
            DBFPro = layer.DetailPanelPropertiesMain.split(',');
        }
        else {
            DBFPro = layer.DBFProperties.split(',');
        }
        // let DBFPro = layer.DetailPanelPropertiesMain.split(',');
        for (var _i = 0, DBFPro_2 = DBFPro; _i < DBFPro_2.length; _i++) {
            var p = DBFPro_2[_i];
            var col = {
                headerName: p,
                field: p
            };
            columns.push(col);
        }
        var DetailPanelPro = layer.DetailPanelProperties.split(',');
        var _loop_3 = function (x) {
            var coldata = columns[x];
            var DetailPanelProres = DetailPanelPro.filter(function (el) {
                var c = el.split('=');
                if (c[1] === coldata.field) {
                    return el;
                }
            });
            if (DetailPanelProres.length > 0) {
                var c = DetailPanelProres[0].split("=");
                columns[x].headerName = c[0];
                columnslist.push(columns[x]);
            }
        };
        for (var x in columns) {
            _loop_3(x);
        }
        return columnslist;
    };
    MapServiceService.prototype.exportAsExcelFile = function (json, excelFileName, ListOfParametter, EIDColindexvalList) {
        var worksheet = XLSX.utils.json_to_sheet(json);
        //var ws = XLSX.utils.aoa_to_sheet(json);
        worksheet['!cols'] = [];
        for (var I = 0; I < ListOfParametter.length; I++) {
            if (ListOfParametter[I].indexOf("EID") >= 0) {
                worksheet['!cols'][I - 1] = { hidden: true };
            }
        }
        //var index = ListOfParametter.indexOf("EID");
        var workbook = { Sheets: { 'Export': worksheet }, SheetNames: ['Export'] };
        var excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    };
    MapServiceService.prototype.saveAsExcelFile = function (buffer, fileName) {
        var data = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    };
    //End Export feature
    MapServiceService.prototype.SetInfoBoxCqlFilter = function (filetrval, bbox, bboxinfoboxval, LayerType) {
        if (LayerType === void 0) { LayerType = undefined; }
        var bboxval = '';
        var returnfilterval = '';
        if (!LayerType) {
            if (bbox == true) {
                bboxval = 'BBOX(the_geom,' + bboxinfoboxval + ')';
            }
            if (filetrval != '' && bbox == true) {
                returnfilterval = '&CQL_FILTER=(' + bboxval + ' and (' + filetrval + '))';
            }
            else if (filetrval != '' && bbox == false) {
                returnfilterval = '&CQL_FILTER=(' + filetrval + ')';
            }
            else if (filetrval == '' && bbox == true) {
                returnfilterval = '&CQL_FILTER=(' + bboxval + ')';
            }
        }
        else if (LayerType == 'Area') {
            if (bbox == true) {
                var bboxArr = bboxinfoboxval.split(',');
                var bboxstr = bboxArr[0] + ' ' + bboxArr[1] + ', ' + bboxArr[2] + ' ' + bboxArr[1] + ', ' + bboxArr[2] + ' ' + bboxArr[3] + ', ' + bboxArr[0] + ' ' + bboxArr[3] + ', ' + bboxArr[0] + ' ' + bboxArr[1];
                bboxval = 'INTERSECTS(the_geom,POLYGON((' + bboxstr + ')))';
            }
            if (filetrval != '' && bbox == true) {
                returnfilterval = '&CQL_FILTER=(' + bboxval + ' and (' + filetrval + '))';
            }
            else if (filetrval != '' && bbox == false) {
                returnfilterval = '&CQL_FILTER=(' + filetrval + ')';
            }
            else if (filetrval == '' && bbox == true) {
                returnfilterval = '&CQL_FILTER=(' + bboxval + ')';
            }
        }
        return returnfilterval;
    };
    MapServiceService.prototype.setTempCqlFilter = function (filetrval, bbox) {
        var bboxval = '';
        var returnfilterval = '';
        if (bbox == true) {
            bboxval = 'BBOX(the_geom,' + this.UtilityService.getgooleMapBbox(this._mapdata.getValue()) + ')';
        }
        if (filetrval != '' && bbox == true) {
            returnfilterval = '&CQL_FILTER=(' + bboxval + ' and (' + filetrval + '))';
        }
        else if (filetrval != '' && bbox == false) {
            returnfilterval = '&CQL_FILTER=(' + filetrval + ')';
        }
        else if (filetrval == '' && bbox == true) {
            returnfilterval = '&CQL_FILTER=(' + bboxval + ')';
        }
        return returnfilterval;
    };
    MapServiceService.prototype.GetInfoBoxMapBound = function () {
        var bounds = this._mapdata.getValue().getBounds();
        var x1, x2, y1, y2;
        // if (bounds['b']) {
        //     x1 = bounds.b.b;
        //     x2 = bounds.b.f;
        //     y1 = bounds.f.b;
        //     y2 = bounds.f.f;
        // }
        // else {
        //     x1 = bounds.j.j;
        //     x2 = bounds.j.l;
        //     y1 = bounds.l.j;
        //     y2 = bounds.l.l;
        // }
        if (bounds['b']) {
            x1 = bounds.b.b;
            x2 = bounds.b.f;
            y1 = bounds.f.b;
            y2 = bounds.f.f;
        }
        else if (bounds['j']) {
            x1 = bounds.j.j;
            x2 = bounds.j.l;
            y1 = bounds.l.j;
            y2 = bounds.l.l;
        }
        else {
            x1 = bounds.ga.j;
            x2 = bounds.ga.l;
            y1 = bounds.ma.j;
            y2 = bounds.ma.l;
        }
        ///var bbox = x1 + "," + y2 + "," + x2 + "," + y1;
        var bbox = x1 + "," + y1 + "," + x2 + "," + y2;
        return bbox;
    };
    MapServiceService.prototype.setDrawingTool = function (dTool) {
        this.DrawingTool.next(dTool);
    };
    //End
    MapServiceService.prototype.GetAllChildNodeData = function () {
        return this.UtilityService.GetChildNodeData(this.TreeNodes.getValue());
    };
    MapServiceService.prototype.getPreviewImageLink = function (PreviewImage) {
        if (PreviewImage.indexOf('images/energylayers/preview/') >= 0) {
            var splitvalpath = PreviewImage.split('/');
            if (splitvalpath.length > 0) {
                PreviewImage = environment_1.environment.ImagespreviewPath + "/Preview/" + splitvalpath[splitvalpath.length - 1];
            }
        }
        return PreviewImage;
    };
    MapServiceService.prototype.SetModal = function (modalname) {
        $("#" + modalname + " .modal-dialog").css({
            position: 'fixed',
            width: $("#" + modalname + " .modal-content").width(),
            height: $("#" + modalname + " .modal-content").height(), margin: '0px'
        });
        $("#" + modalname).css({
            position: 'fixed',
            width: $("#" + modalname + " .modal-dialog").width(),
            height: $("#" + modalname + " .modal-dialog").height()
        });
        $('.modal').css('background', 'rgba(0,0,0,0)');
        $("#" + modalname).css({
            left: ($(window).width() - $('#' + modalname).outerWidth()) / 2,
            top: 0,
        });
        setTimeout(function () {
            $("#" + modalname).css({
                height: '0px',
                top: 0,
            });
        }, 500);
        $('.modal-backdrop').hide();
    };
    MapServiceService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [Utility_service_1.UtilityService,
            all_http_request_service_1.HttpRequestService])
    ], MapServiceService);
    return MapServiceService;
}());
exports.MapServiceService = MapServiceService;
//# sourceMappingURL=map-service.service.js.map