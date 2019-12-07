"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var layouts_1 = require("../../@pages/layouts");
var google_component_1 = require("../google/google.component");
var custom_filter_component_1 = require("./custom-filter/custom-filter.component");
var MapsTabDataComponent = (function (_super) {
    __extends(MapsTabDataComponent, _super);
    function MapsTabDataComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.GridData = [];
        _this.Gridcolumns = [];
        _this.KMLGridData = [];
        _this.KMLGridcolumns = [];
        _this.rowSelection = "multiple";
        _this.rowModelType = "infinite";
        _this.paginationPageSize = 100;
        _this.cacheOverflowSize = 2;
        _this.maxConcurrentDatasourceRequests = 2;
        _this.infiniteInitialRowCount = 1;
        _this.maxBlocksInCache = 2;
        _this.components = {
            loadingRenderer: function (params) {
                if (params.value !== undefined) {
                    return params.value;
                }
                else {
                    return '<div><img src="https://www.ag-grid.com/images/loading.gif"></div>';
                }
            }
        };
        return _this;
        //   GetMapBound() {
        //     var bounds = this.MapServiceService._mapdata.getValue().getBounds();
        //     //-83.26113978,42.71493246,-83.25429169,42.72432181   
        //     let Key1 = Object.keys(bounds);
        //     let key2 = Object.keys(bounds[Object.keys(bounds)[0]]);
        //     let key3 = Object.keys(bounds[Object.keys(bounds)[1]]);
        //     let x1, x2, y1, y2;
        //     x1 = bounds[Key1[0]][key2[0]];
        //     x2 = bounds[Key1[0]][key2[1]];
        //     y1 = bounds[Key1[1]][key3[0]];
        //     y2 = bounds[Key1[1]][key3[1]];
        //     var bbox = x1 + "," + y1 + "," + x2 + "," + y2;
        //     let splitbox = bbox.split(',');
        //     let minusbboxval = [];
        //     let pulsebboxval = [];
        //     for (let val of splitbox) {
        //       if (val.toString().indexOf("-") >= 0) {
        //         minusbboxval.push(val);
        //       } else {
        //         pulsebboxval.push(val);
        //       }
        //     }
        //     bbox = minusbboxval[0] + "," + pulsebboxval[0] + "," + minusbboxval[1] + "," + pulsebboxval[1];
        //     return bbox
        //   }
    }
    MapsTabDataComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.frameworkComponents = { customMatchFilter: custom_filter_component_1.CustomFilterComponent };
        this.gridOptions = {
            context: { thisComponent: this }
        };
        setTimeout(function () { return _this.GoogleMapPage = _this.Injector.get(google_component_1.GoogleMapPage); });
        this.gridOptions = {
            context: { thisComponent: this }
        };
        this.getRowNodeId = function (item) {
            return item.id;
        };
        if (this.tab) {
            this.MapServiceService.LodedIsNotesArray.subscribe(function (x) {
                var columns = _this.MapServiceService.GridColumns.getValue();
                _this.ShowNotesColumn(columns, true);
            });
            this.MapServiceService.getGridMapColumns().subscribe(function (x) {
                _this.Gridcolumns = x;
                _this.ShowNotesColumn(x);
            });
            this.MapServiceService.getKMLGridMapData().subscribe(function (x) {
                _this.KMLGridData = x;
            });
            this.MapServiceService.getKMLGridMapColumns().subscribe(function (x) {
                _this.KMLGridcolumns = x;
            });
        }
    };
    MapsTabDataComponent.prototype.ShowNotesColumn = function (columns, forcedColumnUpdate) {
        var _this = this;
        if (forcedColumnUpdate === void 0) { forcedColumnUpdate = false; }
        var NotesColIndex = columns.findIndex(function (y) { return y.field == 'Notes' && y.headerName == 'Notes'; });
        if (NotesColIndex > -1) {
            var TabList = this.MapServiceService._GridTabData.value;
            for (var t = 0; t < TabList.length; t++) {
                if (TabList[t].ActiveClass == " active" && this.gridApi) {
                    var _loop_1 = function (i) {
                        var energyLayer = TabList[t].energyLayer[i];
                        var energyLayerId = energyLayer.EnergyLayerID;
                        var NotesData = this_1.MapServiceService.LodedIsNotesArray.getValue();
                        var LodedIsNotes = NotesData.find(function (x) { return x.energylayerId == energyLayer.EnergyLayerID; });
                        if (LodedIsNotes) {
                            columns[NotesColIndex].hide = LodedIsNotes.NotesData.length > 0 ? false : true;
                            if (forcedColumnUpdate == true)
                                this_1.gridApi.setColumnDefs(columns);
                        }
                        else {
                            var data = {
                                userId: this_1.AuthServices.getLoggedinUserId(),
                                energylayerId: energyLayerId
                            };
                            this_1.httpService._NodeGetInfoboxNotesforLayer(data).subscribe(function (res) {
                                if (res._Issuccess == true) {
                                    if (res.data && res.data.length >= 0) {
                                        columns[NotesColIndex].hide = res.data.length > 0 ? false : true;
                                        ;
                                        _this.Gridcolumns = columns;
                                        var item = {
                                            energylayerId: energyLayerId,
                                            NotesData: res.data
                                        };
                                        _this.MapServiceService.setLodedIsNotesArray(item);
                                        _this.gridApi.setColumnDefs(columns);
                                    }
                                }
                            });
                        }
                    };
                    var this_1 = this;
                    for (var i = 0; i < TabList[t].energyLayer.length; i++) {
                        _loop_1(i);
                    }
                }
            }
        }
    };
    MapsTabDataComponent.prototype.getContextMenuItems = function (params) {
        var element = document.querySelector("app-maps-tab-data");
        params.api.setPopupParent(element);
        setTimeout(function () {
            var element2 = document.querySelector("ag-grid-angular");
            params.api.setPopupParent(element2);
        }, 150);
        var result = [
            {
                name: "Zoom To",
                action: function () {
                    if (params.node && params.node.data) {
                        params.context.thisComponent.ZoomtoMap(params.node.data, 12, true);
                    }
                },
                icon: '<img src="assets/img/zoom-in.svg" width="14" />',
            },
        ];
        return result;
    };
    MapsTabDataComponent.prototype.ZoomtoMap = function (column, zoom, isZoomFromMapGrid) {
        if (zoom === void 0) { zoom = 12; }
        if (isZoomFromMapGrid === void 0) { isZoomFromMapGrid = false; }
        if (column["Tablename"]) {
            if (column["Tablename"].indexOf("ParcelPoints_") >= 0) {
                zoom = 15;
                if (isZoomFromMapGrid)
                    zoom = 20;
            }
            if (column["Tablename"].indexOf("Parcels_") >= 0) {
                zoom = 15;
                if (isZoomFromMapGrid)
                    zoom = 20;
            }
        }
        if (column && column.bbox && column.bbox.length > 1) {
            var bbox = column.bbox;
            // Find the avrage of latlngs from given LatLngs
            var latitude = 0;
            var longtitude = 0;
            for (var i = 0; i < bbox.length; i++) {
                var Lng = bbox[i];
                var Lat = bbox[i + 1];
                latitude = latitude + Lat;
                longtitude = longtitude + Lng;
                i++;
            }
            latitude = latitude / (bbox.length / 2);
            longtitude = longtitude / (bbox.length / 2);
            var myMap = this.MapServiceService._mapdata.getValue();
            if (myMap != undefined) {
                var MapZoomlevel = myMap.getZoom();
                //if (MapZoomlevel != zoom) {
                var zoomLevel = zoom;
                var center = { lat: latitude, lng: longtitude };
                var myOptions = {
                    zoom: zoomLevel,
                    center: center,
                };
                myMap.setOptions(myOptions);
                //}
            }
        }
    };
    MapsTabDataComponent.prototype.onGridReady = function (params) {
        var _this = this;
        try {
            this.hidethePaceProcessbar();
            var TabList_1 = this.MapServiceService._GridTabData.value;
            var _loop_2 = function (t) {
                if (TabList_1[t].ActiveClass == " active") {
                    this_2.gridApi = params.api;
                    this_2.gridColumnApi = params.columnApi;
                    this_2.MapServiceService.setGridapi(params);
                    default_filter = this_2.MapServiceService.filterval(TabList_1[t].IsFiltervalue);
                    cql_Filter = this_2.setCqlFilter(default_filter, true);
                    this_2.hidethePaceProcessbar();
                    // this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '')
                    //   .subscribe(data => {
                    // let Data: any = data;
                    // let total = Data.totalFeatures;
                    // let Viewing = " - Viewing " + total + " of " + TabList[t]['totalCount'];
                    // TabList[t].Title = TabList[t]['DisplayName'] + Viewing;
                    dataSource = {
                        rowCount: null,
                        getRows: function (params) {
                            var default_filter = '';
                            if (TabList_1[t].energyLayer.length > 0 && TabList_1[t].energyLayer[0].IsFromHomeLookup) {
                                default_filter = _this.MapServiceService.filtervalForHomeLookup(TabList_1[t].IsFiltervalue);
                            }
                            else {
                                default_filter = _this.MapServiceService.filterval(TabList_1[t].IsFiltervalue);
                            }
                            var TableName = TabList_1[t].energyLayer[0].TableName;
                            var IsEnergyLayer = TabList_1[t].energyLayer[0].isEnergyLayer;
                            var IsPrivateLayer = TabList_1[t].energyLayer[0].isPrivateLayer;
                            var Isbox = true;
                            if (TableName.indexOf("ParcelPoints_") >= 0 && _this.MapServiceService.ParcelCenterLookupZoom == false) {
                                Isbox = false;
                            }
                            else {
                                Isbox = true;
                            }
                            var cql_Filter = _this.setCqlFilter(default_filter, Isbox);
                            var sortby = 'gid a';
                            var isclear = false;
                            var filterModel = params.filterModel;
                            var keys = Object.keys(filterModel);
                            _this.GoogleMapPage.GridfilterList = [];
                            var filterParam = '';
                            var allStoredData = _this.MapServiceService.LodedGridData.getValue();
                            _this.GoogleMapPage.mapfilterval = '';
                            if (Object.keys(params.filterModel).length == 1) {
                                _this.unchckedAllfilterop();
                            }
                            if (Object.keys(params.filterModel).length == 0) {
                                _this.unchckedAllfilterop();
                                if (_this.MapServiceService._columnfiltervalStatus == "Clear All Filter") {
                                    _this.addandremovefilterLayeronMap(TabList_1[t]);
                                }
                            }
                            if (Object.keys(params.filterModel).length > 0) {
                                _this.ClearColumnEventListner(TabList_1, t);
                                var isfilter = false;
                                var textFilter = '';
                                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                                    var k = keys_1[_i];
                                    var filterval = '';
                                    if (filterModel[k].textFilterVal)
                                        textFilter = filterModel[k].textFilterVal;
                                    if (filterModel[k].values) {
                                        isfilter = true;
                                        if (filterModel[k].values.length > 0 || filterModel[k].textFilterVal) {
                                            if (k == "Notes") {
                                                filterval = _this.getCQLFilterfromNotesVal(filterModel[k].values, TabList_1[t].energyLayer[0].EnergyLayerID);
                                            }
                                            else {
                                                var filtervalindex = 0;
                                                for (var _a = 0, _b = filterModel[k].values; _a < _b.length; _a++) {
                                                    var v = _b[_a];
                                                    if (v == null) {
                                                        v = ' ';
                                                    }
                                                    if (filterval == '')
                                                        filterval = k + "=" + v;
                                                    else
                                                        filterval += '#OR#' + k + "=" + v;
                                                    filtervalindex++;
                                                    // if (filtervalindex > 100)
                                                    //   break;
                                                }
                                            }
                                            if (filterval)
                                                filterval += ';' + textFilter;
                                            else
                                                filterval = textFilter;
                                            if (!_this.GoogleMapPage.mapfilterval) {
                                                _this.GoogleMapPage.mapfilterval += filterval;
                                            }
                                            else {
                                                _this.GoogleMapPage.mapfilterval = _this.GoogleMapPage.mapfilterval + ';' + filterval;
                                            }
                                            _this.GoogleMapPage.GridfilterList.push(filterval);
                                        }
                                        else if ($("#ag-mini-filter > :input").val()) {
                                            filterval = k + '#LIKE#' + encodeURIComponent($("#ag-mini-filter > :input").val());
                                            _this.GoogleMapPage.GridfilterList.push(filterval);
                                            _this.GoogleMapPage.mapfilterval += ';' + filterval;
                                            // filterval = k + '=' + encodeURIComponent($("#ag-mini-filter > :input").val());
                                            filterParam += _this.MapLayerService.SingleFilterLoop(filterval);
                                        }
                                    }
                                    if (!filterModel[k].values) {
                                        if (filterModel[k].filter) {
                                            filterval = filterModel[k].filter.toString().toLocaleLowerCase();
                                            filterParam += _this.serversidefilter(filterval, filterModel, k, '', false, TabList_1[t].IsFiltervalue);
                                        }
                                        else {
                                            for (var c = 1; c <= 2; c++) {
                                                if (c == 1) {
                                                    filterval = filterModel[k].condition1.filter.toString().toLocaleLowerCase();
                                                    filterParam += _this.serversidefilter(filterval, filterModel[k].condition1, k, '', true, TabList_1[t].IsFiltervalue);
                                                }
                                                else {
                                                    filterval = filterModel[k].condition2.filter.toString().toLocaleLowerCase();
                                                    filterParam += _this.serversidefilter(filterval, filterModel[k].condition2, k, '', true, TabList_1[t].IsFiltervalue);
                                                }
                                            }
                                        }
                                    }
                                }
                                if (IsEnergyLayer || IsPrivateLayer) {
                                    TabList_1[t].EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer = true;
                                    TabList_1[t].EnergylayersavegridFilter.mapfilterval = _this.GoogleMapPage.mapfilterval;
                                    TabList_1[t].EnergylayersavegridFilter["mapfilterColumns"] = keys;
                                }
                                default_filter = _this.MapServiceService.filterval(TabList_1[t].IsFiltervalue);
                                var Gridfilter = _this.MapServiceService.gridfilter(_this.GoogleMapPage.GridfilterList);
                                if (default_filter == '' && Gridfilter != '') {
                                    default_filter = '(' + Gridfilter + ')';
                                }
                                else if (Gridfilter != '' && default_filter != '') {
                                    default_filter = '(' + Gridfilter + ') and (' + default_filter + ')';
                                }
                                //var ISFilter_Changed = allStoredData.find(x => (x.cql_filter == cql_Filter) && (x.TabData.EnergyLayerID == TabList[t].energyLayer[0].EnergyLayerID) && (x.TabData.LayerName == TabList[t].energyLayer[0].LayerName));
                                // if (isfilter == true && !ISFilter_Changed)  {
                                if (isfilter == true) {
                                    setTimeout(function () {
                                        _this.addandremovefilterLayeronMap(TabList_1[t]);
                                    }, 500);
                                    _this.GoogleMapPage.getTotalCount();
                                }
                                else {
                                    //this.addandremovefilterLayeronMap(TabList[t]);
                                }
                            }
                            else {
                                var serviceGridfilter = _this.MapServiceService.gridfilter([TabList_1[t].EnergylayersavegridFilter.mapfilterval]);
                                if (default_filter == '' && serviceGridfilter != '') {
                                    default_filter = '(' + serviceGridfilter + ')';
                                }
                                else if (serviceGridfilter != '' && default_filter != '') {
                                    default_filter = '(' + serviceGridfilter + ') and (' + default_filter + ')';
                                }
                                //cql_Filter = this.setCqlFilter(default_filter, Isbox);
                            }
                            cql_Filter = _this.setCqlFilter(default_filter, true);
                            if (params.sortModel.length > 0) {
                                sortby = params.sortModel[0].colId;
                                if (params.sortModel[0].sort == "asc") {
                                    sortby += ' a';
                                }
                                else {
                                    sortby += ' d';
                                }
                            }
                            _this.hidethePaceProcessbar();
                            var findData = allStoredData.find(function (x) { return ((x.cql_filter == cql_Filter) && (x.TabData.EnergyLayerID == TabList_1[t].energyLayer[0].EnergyLayerID) && (x.TabData.LayerName == TabList_1[t].energyLayer[0].LayerName) && (x.endRow == params.endRow) && (x.sortBy == sortby) && (x.startRow == params.startRow) && (x.tableName == TableName)); });
                            if (findData && findData.data && findData.data.length > 0) {
                                params.successCallback(findData.data, findData.totalFetures);
                                if (TableName.indexOf("ParcelPoints_") >= 0 && _this.MapServiceService.ParcelCenterLookupZoom == false) {
                                    _this.MapServiceService.ParcelCenterLookupZoom = true;
                                    _this.ZoomtoMap(findData.data[0], 15);
                                }
                            }
                            else {
                                var UserId = _this.AuthServices.getLoggedinUserId();
                                _this.httpService._NodegetLayerData(TabList_1[t].energyLayer[0], params.startRow, params.endRow, cql_Filter, sortby, '', UserId)
                                    .then(function (data) {
                                    if (TabList_1[t]) {
                                        var Data = data;
                                        if (Data["totalFeatures"]) {
                                            var total = Data.totalFeatures;
                                            if (_this.GoogleMapPage.mapfilterval != '') {
                                                var Viewing = " - Viewing " + total + " of " + TabList_1[t]['totalCount'];
                                                TabList_1[t].Title = TabList_1[t]['DisplayName'] + Viewing;
                                            }
                                            var Ldata1 = Data.features;
                                            var ArrayData1 = [];
                                            for (var _i = 0, Ldata1_1 = Ldata1; _i < Ldata1_1.length; _i++) {
                                                var d = Ldata1_1[_i];
                                                ArrayData1.push(d.properties);
                                            }
                                            var rowsThisPage = ArrayData1;
                                            var lastRow = -1;
                                            if (total <= params.endRow) {
                                                lastRow = total;
                                            }
                                            var storeData = _this.MapServiceService.LodedGridData.getValue();
                                            rowsThisPage.forEach(function (x) {
                                                x['Tablename'] = TableName;
                                            });
                                            var newData = new StoredData();
                                            newData.TabData = TabList_1[t].energyLayer[0];
                                            newData.cql_filter = cql_Filter;
                                            newData.data = rowsThisPage;
                                            newData.endRow = params.endRow;
                                            newData.totalFetures = lastRow;
                                            newData.sortBy = sortby;
                                            newData.startRow = params.startRow;
                                            newData.tableName = TableName;
                                            if (TableName.indexOf("ParcelPoints_") >= 0 && _this.MapServiceService.ParcelCenterLookupZoom == false) {
                                                _this.MapServiceService.ParcelCenterLookupZoom = true;
                                                _this.ZoomtoMap(newData.data[0], 15);
                                            }
                                            storeData.push(newData);
                                            _this.MapServiceService.setLodedGridMapData(storeData);
                                            _this.SetGridDataWithNotes(params, rowsThisPage, lastRow, TabList_1[t].energyLayer[0].EnergyLayerID);
                                            // params.successCallback(rowsThisPage, lastRow);
                                            _this.setgridhight();
                                            // this.unchckedAllfilterop();
                                            // this.MapServiceService.Gridcolumncheckboxevent();
                                            //this.GoogleMapPage.getTotalCount();
                                        }
                                        else {
                                            console.log(Data);
                                            params.successCallback([], 0);
                                        }
                                    }
                                });
                            }
                        }
                    };
                    params.api.setDatasource(dataSource);
                    this_2.MapServiceService.CloseFilterOnToggle();
                    // });
                }
            };
            var this_2 = this, default_filter, cql_Filter, dataSource;
            for (var t = 0; t < TabList_1.length; t++) {
                _loop_2(t);
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    MapsTabDataComponent.prototype.getCQLFilterfromNotesVal = function (NotesVals, energyLayerId) {
        var filterval = '';
        var _loop_3 = function (v) {
            if (v == null) {
                v = ' ';
            }
            var NotesData = this_3.MapServiceService.LodedIsNotesArray.getValue();
            var NotesItem = NotesData.find(function (x) { return x.energylayerId == energyLayerId; });
            if (NotesItem && NotesItem.NotesData && NotesItem.NotesData.length > 0) {
                var NotesArr = NotesItem.NotesData.filter(function (x) { return x.NoteValue == v; });
                if (NotesArr && NotesArr.length > 0) {
                    for (var i = 0; i < NotesArr.length; i++) {
                        var Note = NotesArr[i];
                        if (Note.EnergyLayerRecordLabel && Note.EnergyLayerRecordId) {
                            if (filterval == '')
                                filterval = Note.EnergyLayerRecordLabel + "=" + Note.EnergyLayerRecordId;
                            else
                                filterval += '#OR#' + Note.EnergyLayerRecordLabel + "=" + Note.EnergyLayerRecordId;
                        }
                    }
                }
            }
        };
        var this_3 = this;
        for (var _i = 0, NotesVals_1 = NotesVals; _i < NotesVals_1.length; _i++) {
            var v = NotesVals_1[_i];
            _loop_3(v);
        }
        return filterval;
    };
    MapsTabDataComponent.prototype.SetGridDataWithNotes = function (gridApi, data, totalFeatures, energyLayerId) {
        var notesArr = this.MapServiceService.LodedIsNotesArray.getValue();
        if (notesArr && notesArr.length > 0) {
            var notesItem_1 = notesArr.find(function (x) { return x.energylayerId == energyLayerId; });
            if (notesItem_1) {
                if (notesItem_1.NotesData && notesItem_1.NotesData.length > 0) {
                    data.forEach(function (item) {
                        item['Notes'] = '';
                        for (var i = 0; i < notesItem_1.NotesData.length; i++) {
                            var noteItem = notesItem_1.NotesData[i];
                            if (item[noteItem.EnergyLayerRecordLabel] == noteItem.EnergyLayerRecordId) {
                                if (item['Notes'] == '') {
                                    item['Notes'] = noteItem.NoteValue;
                                }
                                else {
                                    item['Notes'] = item['Notes'] + ', ' + noteItem.NoteValue;
                                }
                            }
                        }
                    });
                    gridApi.successCallback(data, totalFeatures);
                }
                else {
                    gridApi.successCallback(data, totalFeatures);
                }
            }
            else {
                gridApi.successCallback(data, totalFeatures);
            }
        }
        else {
            gridApi.successCallback(data, totalFeatures);
        }
    };
    MapsTabDataComponent.prototype.OnKMLGridReady = function (params) {
        var _this = this;
        try {
            this.hidethePaceProcessbar();
            var TabList_2 = this.MapServiceService._GridTabData.value;
            var _loop_4 = function (t) {
                if (TabList_2[t].ActiveClass == " active") {
                    this_4.kmlGridApi = params.api;
                    this_4.kmlGridColumnApi = params.columnApi;
                    this_4.MapServiceService.setKMLGridapi(params);
                    this_4.hidethePaceProcessbar();
                    var Viewing = " - Viewing " + TabList_2[t]['totalCount'] + " of " + TabList_2[t]['totalCount'];
                    TabList_2[t].Title = TabList_2[t]['DisplayName'] + Viewing;
                    var dataSource = {
                        rowCount: null,
                        getRows: function (params) {
                            var sortby = 'gid a';
                            var isclear = false;
                            var filterModel = params.filterModel;
                            var keys = Object.keys(filterModel);
                            _this.GoogleMapPage.GridfilterList = [];
                            var filterParam = '';
                            _this.GoogleMapPage.mapfilterval = '';
                            if (Object.keys(params.filterModel).length == 1) {
                                _this.unchckedAllfilterop();
                            }
                            if (Object.keys(params.filterModel).length == 0) {
                                _this.unchckedAllfilterop();
                                //this.getTotalCount();
                                if (_this.MapServiceService._columnfiltervalStatus == "Clear All Filter") {
                                    _this.AddAndRemoveFilterLayeronMapForKML(TabList_2[t]);
                                }
                            }
                            if (Object.keys(params.filterModel).length > 0) {
                                if (document.getElementById("clearButton") != null) {
                                    $('#clearButton').removeAttr('disabled');
                                    document.getElementById("clearButton").addEventListener("click", function (event) {
                                        if (isclear == false) {
                                            isclear = true;
                                            _this.MapServiceService.KMLGridData.getValue().length = 0;
                                            setTimeout(function () {
                                                var existingklayer = _this.MapServiceService.kmlLayersData.getValue();
                                                var selectedKmlLayer = existingklayer.filter(function (el) {
                                                    if (el.LayerID == parseInt(TabList_2[t].energyLayer[0].DataSetID)) {
                                                        return el;
                                                    }
                                                });
                                                if (selectedKmlLayer.length == 1) {
                                                    var result = selectedKmlLayer[0].LayerData;
                                                    if (result.KMLGeometryList[0].hasOwnProperty('Name')) {
                                                        var ArrayData = [""];
                                                        var nameData = result.KMLGeometryList.map(function (a) { return a.Name; });
                                                        for (var _i = 0, nameData_1 = nameData; _i < nameData_1.length; _i++) {
                                                            var d = nameData_1[_i];
                                                            ArrayData.push({ Name: d });
                                                        }
                                                        Array.prototype.push.apply(_this.MapServiceService.KMLGridData.getValue(), ArrayData);
                                                    }
                                                }
                                            }, 2000);
                                            for (var _i = 0, _a = TabList_2[t].energyLayer; _i < _a.length; _i++) {
                                                var s = _a[_i];
                                                if (((s.EnergyParentID == parseInt(TabList_2[t].parentID)) && (s.EnergyLayerID == parseInt(TabList_2[t].ID)))) {
                                                    _this.PrivateMapLayerService.RemoveKmlLayer(s);
                                                    _this.GoogleMapPage.mapfilterval = '';
                                                    s["serversidefilterval"] = '';
                                                }
                                            }
                                            for (var _b = 0, _c = TabList_2[t].energyLayer; _b < _c.length; _b++) {
                                                var s = _c[_b];
                                                if (((s.EnergyParentID == parseInt(TabList_2[t].parentID)) && (s.EnergyLayerID == parseInt(TabList_2[t].ID)))) {
                                                    //KML
                                                    // this.LoadPrivateKmlLayers(s);
                                                }
                                            }
                                            _this.MapServiceService.ClearColumncheckvalue();
                                        }
                                    });
                                }
                                var isfilter = false;
                                for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                                    var k = keys_2[_i];
                                    var filterval = '';
                                    if (filterModel[k].values) {
                                        if (filterModel[k].values.length > 0) {
                                            isfilter = true;
                                            var filtervalindex = 0;
                                            for (var _a = 0, _b = filterModel[k].values; _a < _b.length; _a++) {
                                                var v = _b[_a];
                                                if (v == null) {
                                                    v = ' ';
                                                }
                                                if (filterval == '')
                                                    filterval = k + "=" + v;
                                                else
                                                    filterval += ';' + k + "=" + v;
                                                filtervalindex++;
                                                if (filtervalindex > 10)
                                                    break;
                                            }
                                            if (_this.GoogleMapPage.mapfilterval == "") {
                                                _this.GoogleMapPage.mapfilterval += filterval;
                                            }
                                            else {
                                                _this.GoogleMapPage.mapfilterval = _this.GoogleMapPage.mapfilterval + ';' + filterval;
                                            }
                                            _this.GoogleMapPage.GridfilterList.push(filterval);
                                        }
                                        else if ($("#ag-mini-filter > :input").val()) {
                                            filterval = k + '#LIKE#' + encodeURIComponent($("#ag-mini-filter > :input").val());
                                            _this.GoogleMapPage.GridfilterList.push(filterval);
                                            _this.GoogleMapPage.mapfilterval += ';' + filterval;
                                            filterParam += _this.MapLayerService.SingleFilterLoop(filterval);
                                        }
                                    }
                                    if (!filterModel[k].values) {
                                        if (filterModel[k].filter) {
                                            filterval = filterModel[k].filter.toString().toLocaleLowerCase();
                                            filterParam += _this.serversidefilter(filterval, filterModel, k, '', false, TabList_2[t].IsFiltervalue);
                                        }
                                        else {
                                            for (var c = 1; c <= 2; c++) {
                                                if (c == 1) {
                                                    filterval = filterModel[k].condition1.filter.toString().toLocaleLowerCase();
                                                    filterParam += _this.serversidefilter(filterval, filterModel[k].condition1, k, '', true, TabList_2[t].IsFiltervalue);
                                                }
                                                else {
                                                    filterval = filterModel[k].condition2.filter.toString().toLocaleLowerCase();
                                                    filterParam += _this.serversidefilter(filterval, filterModel[k].condition2, k, '', true, TabList_2[t].IsFiltervalue);
                                                }
                                            }
                                        }
                                    }
                                }
                                var Gridfilter = _this.MapServiceService.gridfilter(_this.GoogleMapPage.GridfilterList);
                                if (isfilter == true) {
                                    setTimeout(function () {
                                        _this.AddAndRemoveFilterLayeronMapForKML(TabList_2[t]);
                                    }, 500);
                                }
                                else {
                                    _this.AddAndRemoveFilterLayeronMapForKML(TabList_2[t]);
                                }
                            }
                            _this.hidethePaceProcessbar();
                            setTimeout(function () {
                                var existingklayer = _this.MapServiceService.kmlLayersData.getValue();
                                var selectedKmlLayer = existingklayer.filter(function (el) {
                                    if (el.LayerID == parseInt(TabList_2[t].energyLayer[0].DataSetID)) {
                                        return el;
                                    }
                                });
                                if (selectedKmlLayer.length == 1) {
                                    var result = selectedKmlLayer[0].LayerData;
                                    var total = result.KMLGeometryList.length;
                                    if (result.KMLGeometryList[0].hasOwnProperty('Name')) {
                                        var ArrayData1 = [];
                                        var Ldata1 = result.KMLGeometryList.map(function (a) { return a.Name; });
                                        if (_this.GoogleMapPage.mapfilterval != '') {
                                            var Viewing_1 = " - Viewing " + total + " of " + TabList_2[t]['totalCount'];
                                            TabList_2[t].Title = TabList_2[t]['DisplayName'] + Viewing_1;
                                        }
                                        if (Object.keys(params.filterModel).length > 0) {
                                            var data = Ldata1;
                                            ArrayData1 = [];
                                            for (var i = 0; i < data.length; i++) {
                                                if (filterModel[keys[0]].values.indexOf(data[i]) > -1)
                                                    ArrayData1.push(data[i]);
                                            }
                                            total = ArrayData1.length;
                                            if (_this.GoogleMapPage.mapfilterval != '') {
                                                var Viewing_2 = " - Viewing " + total + " of " + TabList_2[t]['totalCount'];
                                                TabList_2[t].Title = TabList_2[t]['DisplayName'] + Viewing_2;
                                            }
                                            data = ArrayData1;
                                            ArrayData1 = [];
                                            for (var i = 0; i < data.length; i++) {
                                                if (i >= params.startRow && i < params.endRow)
                                                    ArrayData1.push({ Name: data[i] });
                                            }
                                        }
                                        else {
                                            for (var i = 0; i < Ldata1.length; i++) {
                                                if (i >= params.startRow && i < params.endRow)
                                                    ArrayData1.push({ Name: Ldata1[i] });
                                            }
                                        }
                                        var rowsThisPage = ArrayData1;
                                        var lastRow = -1;
                                        if (total <= params.endRow) {
                                            lastRow = total;
                                        }
                                        params.successCallback(rowsThisPage, lastRow);
                                        _this.setgridhight();
                                    }
                                }
                                setInterval(function () {
                                    _this.unchckedAllfilterop();
                                    _this.MapServiceService.GridColumnCheckboxEventForKml();
                                }, 3000);
                            }, 2000);
                        }
                    };
                    params.api.setDatasource(dataSource);
                }
            };
            var this_4 = this;
            for (var t = 0; t < TabList_2.length; t++) {
                _loop_4(t);
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    MapsTabDataComponent.prototype.ClearColumnEventListner = function (TabList, Index) {
        var _this = this;
        if (document.getElementById("clearButton") != null) {
            $('#clearButton').removeAttr('disabled');
            document.getElementById("clearButton").addEventListener("click", function (event) {
                _this.Gridcolumns = [];
                setTimeout(function () {
                    _this.Gridcolumns = _this.MapServiceService.GridColumns.getValue();
                    _this.GoogleMapPage.getTotalCount();
                }, 150);
                TabList[Index].EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer = false;
                TabList[Index].EnergylayersavegridFilter.mapfilterval = "";
                TabList[Index].EnergylayersavegridFilter["mapfilterColumns"] = null;
                _this.GoogleMapPage.GridfilterList = [];
                _this.addandremovefilterLayeronMap(TabList[Index]);
                // for (let s of TabList[Index].energyLayer) {
                //   if (((s.EnergyParentID == parseInt(TabList[Index].parentID)) && (s.EnergyLayerID == parseInt(TabList[Index].ID)))) {
                //     this.MapLayerService.removemapLayer(s);
                //     this.GoogleMapPage.mapfilterval = '';
                //     s["serversidefilterval"] = ''
                //   }
                // }
                // for (let s of TabList[Index].energyLayer) {
                //   if (((s.EnergyParentID == parseInt(TabList[Index].parentID)) && (s.EnergyLayerID == parseInt(TabList[Index].ID)))) {
                //     this.MapLayerService.loadmapLayers(s);
                //   }
                // }
                _this.MapServiceService.ClearColumncheckvalue();
            });
        }
    };
    MapsTabDataComponent.prototype.hidethePaceProcessbar = function () {
        $(".pace").css("display", "none");
    };
    MapsTabDataComponent.prototype.setCqlFilter = function (filetrval, bbox) {
        var bboxval = '';
        var returnfilterval = '';
        if (bbox == true) {
            bboxval = 'BBOX(the_geom,' + this.UtilityService.getgooleMapBbox(this.MapServiceService._mapdata.getValue()) + ')';
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
    MapsTabDataComponent.prototype.unchckedAllfilterop = function () {
        if ($('#selectAll')[0]) {
            if ($('#selectAll').html().indexOf('ag-icon-checkbox-checked') >= 0) {
                $('#selectAll').attr('checked', false).trigger('click');
            }
        }
    };
    MapsTabDataComponent.prototype.addandremovefilterLayeronMap = function (TabList) {
        var _this = this;
        if (TabList.parentID && !TabList.parentName) {
            TabList.parentID = 0;
        }
        var oldFilter = [];
        if (TabList.energyLayer.length > 0 && TabList.energyLayer[0].serversidefilterval && TabList.energyLayer[0].serversidefilterval.length > 0) {
            oldFilter = TabList.energyLayer[0].serversidefilterval;
        }
        // let isAllowedGroupLayer = this.UtilityService.IsAllowedForGroupLayer(TabList.FeatureType);
        for (var _i = 0, _a = TabList.energyLayer; _i < _a.length; _i++) {
            var s = _a[_i];
            for (var _b = 0, _c = TabList.ListOfChildID; _b < _c.length; _b++) {
                var c = _c[_b];
                if (((s.EnergyParentID == parseInt(TabList.parentID)) && (s.EnergyLayerID == parseInt(c)))) {
                    s["serversidefilterval"] = '';
                    s["serversidefilterval"] = this.GoogleMapPage.GridfilterList;
                    // if (isAllowedGroupLayer == false) {
                    if (TabList.treestatus != 'GroupLayer' && TabList.FeatureType != 'CustomMap' && TabList.FeatureType != 'SiteSelection') {
                        this.MapLayerService.removemapLayer(s);
                        this.MapLayerService.loadmapLayers(s);
                    }
                    // }
                }
            }
        }
        if (TabList.FeatureType && TabList.FeatureType == "CreateLayer" && TabList.treestatus == "GroupLayer") {
            if (!(oldFilter.length === this.GoogleMapPage.GridfilterList.length && oldFilter.every(function (value, index) { return value === _this.GoogleMapPage.GridfilterList[index]; })))
                this.PrivateMapLayerService_new.LoadGroupMapLayers_Private();
        }
        else if (TabList.FeatureType == 'CustomMap') {
            this.MapLayernewService.LoadCustomMapLayers();
        }
        else if (TabList.FeatureType == 'SiteSelection') {
            this.MapLayernewService.LoadIndividualGroupMapLayer(TabList.FeatureType);
        }
        else {
            // if (isAllowedGroupLayer == true) {
            if (TabList.treestatus == 'GroupLayer') {
                if (!(oldFilter.length === this.GoogleMapPage.GridfilterList.length && oldFilter.every(function (value, index) { return value === _this.GoogleMapPage.GridfilterList[index]; })))
                    this.MapLayernewService.LoadGroupMapLayers();
            }
        }
        // }
    };
    MapsTabDataComponent.prototype.AddAndRemoveFilterLayeronMapForKML = function (TabList) {
        for (var _i = 0, _a = TabList.energyLayer; _i < _a.length; _i++) {
            var s = _a[_i];
            for (var _b = 0, _c = TabList.ListOfChildID; _b < _c.length; _b++) {
                var c = _c[_b];
                if (((s.EnergyParentID == parseInt(TabList.parentID)) && (s.EnergyLayerID == parseInt(c)))) {
                    this.PrivateMapLayerService.RemoveKmlLayer(s);
                    s["serversidefilterval"] = '';
                }
            }
        }
        for (var _d = 0, _e = TabList.energyLayer; _d < _e.length; _d++) {
            var s = _e[_d];
            for (var _f = 0, _g = TabList.ListOfChildID; _f < _g.length; _f++) {
                var c = _g[_f];
                if (((s.EnergyParentID == parseInt(TabList.parentID)) && (s.EnergyLayerID == parseInt(c)))) {
                    s["serversidefilterval"] = this.GoogleMapPage.GridfilterList;
                    // KML
                    // this.LoadPrivateKmlLayers(s);
                }
            }
        }
    };
    MapsTabDataComponent.prototype.serversidefilter = function (filterval, filterModel, k, sld_filter, multipleFilter, IsFiltervalue) {
        filterval = '';
        var type = '';
        if (multipleFilter == true) {
            type = filterModel.type;
            filterval = filterModel.filter.toString();
        }
        else {
            type = filterModel[k].type;
            filterval = filterModel[k].filter.toString();
        }
        if (type == "equals") {
            filterval = k + '=' + filterval;
        }
        else if (type == "notEqual") {
            filterval = k + '#NotEqualTo#' + filterval;
        }
        else if (type == "contains") {
            filterval = k + '#LIKE#' + filterval;
        }
        else if (type == "lessThan") {
            filterval = k + '<' + filterval;
        }
        else if (type == "lessThanOrEqual") {
            filterval = k + '<=' + filterval;
        }
        else if (type == "greaterThan") {
            filterval = k + '>' + filterval;
        }
        else if (type == "greaterThanOrEqual") {
            filterval = k + '>=' + filterval;
        }
        if (filterval != '') {
            sld_filter += this.MapLayerService.SingleFilterLoop(filterval);
        }
        return sld_filter;
    };
    MapsTabDataComponent.prototype.setgridhight = function () {
        $("#Resizingmap")[0].offsetTop;
        $("#Resizingmap")[0].offsetHeight;
        var h = $("#Resizingmap")[0].offsetHeight - $("#Resizingmap")[0].offsetTop;
        if (h == 0) {
            var gridHeight = $("#content1").height();
            $('#Resizingmap').css('height', gridHeight + 'px');
            $('#Resizingmap').css('top', '0');
            if (gridHeight <= 100)
                $('#Resizingmap').css('height', 20 + "px");
        }
        if (h != 0) {
            $("#divmapgrid").css('height', h - 60 + "px");
            $('#content1').css('height', h + "px");
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MapsTabDataComponent.prototype, "tab", void 0);
    MapsTabDataComponent = __decorate([
        core_1.Component({
            selector: 'app-maps-tab-data',
            templateUrl: './maps-tab-data.component.html',
            styleUrls: ['./maps-tab-data.component.scss']
        })
    ], MapsTabDataComponent);
    return MapsTabDataComponent;
}(layouts_1.RootLayout));
exports.MapsTabDataComponent = MapsTabDataComponent;
var StoredData = (function () {
    function StoredData() {
    }
    return StoredData;
}());
exports.StoredData = StoredData;
//# sourceMappingURL=maps-tab-data.component.js.map