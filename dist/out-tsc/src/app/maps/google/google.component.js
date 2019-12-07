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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var root_component_1 = require("../../@pages/layouts/root/root.component");
var map_search_data_component_1 = require("../../map-search-data/map-search-data.component");
var basemap_component_1 = require("../../@pages/layouts/condensed/basemap/basemap.component");
var show_legend_component_1 = require("../../@pages/layouts/condensed/show-legend/show-legend.component");
var _ = require("lodash");
var savesearch_component_1 = require("../../@pages/layouts/condensed/savesearch/savesearch.component");
var draw_tools_component_1 = require("../../@pages/layouts/condensed/draw-tools/draw-tools.component");
var GoogleMapPage = (function (_super) {
    __extends(GoogleMapPage, _super);
    function GoogleMapPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.zoomSlider = 5;
        _this.zoomLevel = 5;
        _this.center = { lat: 40.6700, lng: -73.9400 };
        _this.maxZoom = 21;
        _this.minZoom = 4;
        _this.clickableIcons = false;
        _this.mapType = "hybrid";
        _this.lat = 39.5;
        _this.lng = -98.35;
        _this.Coordinates = "40.6700,-73.9400";
        _this.SetElevationval = "";
        _this.hideshowClass = "fa fa-angle-double-up";
        _this.caretClass = "fa fa-caret-up";
        _this.BottomGriddesc = "Show Map Details ";
        _this.BindTabs = [];
        _this.pageSize = 50;
        _this.skip = 0;
        _this.GridTotal = 0;
        _this.GridtotalData = 0;
        _this.energyLayer = [];
        _this.LoadedLayersObj = [];
        _this.LoadedLayersIds = [];
        _this.privateLayer = [];
        _this.LoadedPrivateLayersObj = [];
        _this.LoadedPrivateLayersIds = [];
        _this.sharedLayer = [];
        _this.GridData = [];
        _this.LoadedGridData = [];
        _this.Gridcolumns = [];
        _this.KMLGridData = [];
        _this.KMLGridcolumns = [];
        _this.components = {
            loadingRenderer: function (params) {
                if (params.value !== undefined) {
                    return params.value;
                }
                else {
                    return '<img src="https://www.ag-grid.com/images/loading.gif">';
                }
            }
        };
        _this.rowBuffer = 0;
        // rowSelection = "multiple";
        // rowModelType = "infinite";
        // paginationPageSize = 100;
        // cacheOverflowSize = 2;
        // maxConcurrentDatasourceRequests = 2;
        // infiniteInitialRowCount = 1;
        // maxBlocksInCache = 2;
        // getRowNodeId;
        _this.gridmouserclick = false;
        _this.bounds = null;
        _this.shiftPressed = false;
        _this.gribBoundingBox = null;
        _this.mouseIsDown = 0;
        // GetMapBound() {
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
        //         if (val.toString().indexOf("-") >= 0) {
        //             minusbboxval.push(val);
        //         } else {
        //             pulsebboxval.push(val);
        //         }
        //     }
        //     bbox = minusbboxval[0] + "," + pulsebboxval[0] + "," + minusbboxval[1] + "," + pulsebboxval[1];
        //     return bbox
        // }
        _this.mapfilterval = '';
        _this.GridfilterList = [];
        return _this;
    }
    GoogleMapPage.prototype.ngOnInit = function () {
        var _this = this;
        var testScript = document.createElement("script");
        testScript.setAttribute("id", "testScript");
        testScript.setAttribute("src", "assets/plugins/slim_slider/simple-slider.js");
        document.body.appendChild(testScript);
        this.sub = this.route.params.subscribe(function (params) {
            _this.parameter = params['type'];
            //Show header for casual/executive and coporate
            if (_this.parameter != "with-header") {
                _this.toggler.setHeaderClass("transparent");
            }
        });
        // this.toggler.setBodyLayoutClass("no-header");
        this.toggler.setPageContainer("full-height");
        this.toggler.setContent("full-width full-height overlay-footer relative");
        setTimeout(function () {
            _this.toggler.toggleFooter(false);
            $(".page-container").css('padding-left', '40px !important');
        }, 1000);
        setTimeout(function () {
            _this.SetZoom();
            $("#Resizingmap").draggable({
                axis: "y",
                start: function (a) {
                    _this.gridmouserclick = true;
                    var position = a.target.offsetTop;
                    var h = 1500 - position;
                    // if (h > 1000) 
                    //     h = $("#content1").height();
                    $('#Resizingmap').css('height', h + 'px');
                    $('#Resizingmap').css('top', '');
                    $('#content1').css('height', h + "px");
                    // this.changeBottomSliderddesc();
                    // $('.footerDrawer .content1').css('display', 'block');
                    if (_this.hideshowClass == "fa fa-angle-double-up") {
                        _this.hideshowClass = "fa fa-angle-double-down";
                        _this.caretClass = "fa fa-caret-down";
                        _this.BottomGriddesc = "Hide Map Details ";
                        $('.footerDrawer .content1').css('display', 'block');
                    }
                },
                // drag: (b) => {
                //     this.calculatepercent(b.target.offsetTop);
                // },
                stop: function (c) {
                    setTimeout(function () {
                        _this.gridmouserclick = false;
                    }, 800);
                    _this.setgridhight();
                    $("#Resizingmap")[0].offsetTop;
                    $("#Resizingmap")[0].offsetHeight;
                    var h = $("#Resizingmap")[0].offsetHeight - $("#Resizingmap")[0].offsetTop;
                    _this.SetLegendBasedOnGrid(h);
                    if (h <= 80) {
                        _this.hideshowClass = "fa fa-angle-double-up";
                        _this.BottomGriddesc = "Show Map Details ";
                        _this.caretClass = "fa fa-caret-up";
                        $('.footerDrawer .content1').css('display', 'none');
                        $('#Resizingmap').css('top', '').css('height', '');
                    }
                }
            });
            $('#getlatlng').draggable();
        }, 1000);
        this.MapServiceService.setTabData(this.BindTabs);
        this.MapServiceService.setGridMapData(this.GridData);
        this.MapServiceService.setGridMapcolumns(this.Gridcolumns);
        this.MapServiceService.setKMLGridMapData(this.KMLGridData);
        this.MapServiceService.setKMLGridMapcolumns(this.KMLGridcolumns);
        this.MapServiceService.setLodedGridMapData(this.LoadedGridData);
        document.addEventListener('keydown', function (event) {
            var keyName = event.key;
            if (event.which === 16) {
                _this.shiftPressed = true;
            }
        });
        document.addEventListener('keyup', function (event) {
            var keyName = event.key;
            if (event.which === 16) {
                _this.shiftPressed = false;
            }
        });
        if (window.screen.width < 1399) {
            $('#bottomemapgrid').css('Padding-left', '0%');
        }
    };
    GoogleMapPage.prototype.SetLegendBasedOnGrid = function (h) {
        if (!h)
            h = $("#Resizingmap")[0].offsetHeight - $("#Resizingmap")[0].offsetTop;
        if ($('#LegendModal').length != 0) {
            var Child = $('#LegendModal').children();
            if (Child) {
                Child.css('top', '');
                Child.css('bottom', (h + 15) + 'px');
            }
        }
    };
    GoogleMapPage.prototype.setgridhight = function () {
        $("#Resizingmap")[0].offsetTop;
        $("#Resizingmap")[0].offsetHeight;
        var h = $("#Resizingmap")[0].offsetHeight - $("#Resizingmap")[0].offsetTop;
        $("#divmapgrid").css('height', h - 60 + "px");
        $('#content1').css('height', h + "px");
        $('#Resizingmap').css('height', h + 'px');
        $('#Resizingmap').css('top', '0');
    };
    GoogleMapPage.prototype.BottomSliderclick = function (event) {
        if (this.gridmouserclick == false) {
            this.changeBottomSliderddesc();
            $('#Resizingmap').css('top', '');
            this.setgridhight();
        }
    };
    GoogleMapPage.prototype.changeBottomSliderddesc = function () {
        if (this.hideshowClass == "fa fa-angle-double-up") {
            this.hideshowClass = "fa fa-angle-double-down";
            this.caretClass = "fa fa-caret-down";
            this.BottomGriddesc = "Hide Map Details ";
            $('.footerDrawer .content1').css('display', 'block');
            $('#Resizingmap').css('height', '280px');
            this.SetLegendBasedOnGrid(280);
        }
        else {
            this.hideshowClass = "fa fa-angle-double-up";
            this.caretClass = "fa fa-caret-up";
            this.BottomGriddesc = "Show Map Details ";
            $('.footerDrawer .content1').css('display', 'none');
            $('#Resizingmap').css('height', '');
            this.SetLegendBasedOnGrid(25);
        }
    };
    GoogleMapPage.prototype.SetBaseMap = function () {
        var _this = this;
        var BaseMapList = this.MapServiceService.BaseMapData.getValue();
        if (BaseMapList == null) {
            var UserId = this.AuthServices.getLoggedinUserId();
            this.httpService._NodeGetBaseMapTypes(UserId).subscribe(function (data) {
                if (data._Issuccess) {
                    _this.SetBaseMapsetting(data);
                    _this.MapServiceService.setBaseMap(data);
                }
            }, function (error) {
                console.log(error);
            });
        }
        else {
            this.SetBaseMapsetting(BaseMapList);
        }
    };
    GoogleMapPage.prototype.SetBaseMapsetting = function (data) {
        if (data.MapSettingData && data.MapSettingData.length > 0) {
            var baseMapList = data.BaseMapData;
            var BaseMapProviderID_1 = data.MapSettingData[0].BaseMapProviderID;
            var activeBasemap = baseMapList.filter(function (m) { return m.IsDefault == true; })[0];
            if (activeBasemap != null && activeBasemap != undefined) {
                activeBasemap.IsDefault = false;
            }
            activeBasemap = baseMapList.filter(function (m) { return m.BaseMapProviderID == BaseMapProviderID_1; })[0];
            activeBasemap.IsDefault = true;
            var MinZoom = activeBasemap.MinZoom == null ? 4 : activeBasemap.MinZoom;
            var maxzoom = activeBasemap.MaxZoom == null ? 21 : activeBasemap.MaxZoom;
            this.minZoom = MinZoom;
            this.maxZoom = maxzoom;
            this.basemapservice.setBasemap(activeBasemap);
        }
    };
    GoogleMapPage.prototype.mapReady = function ($event) {
        var _this = this;
        this.map = $event;
        this.map.setTilt(0);
        this.SetBaseMap();
        this.map.addListener('mousemove', function (event) {
            _this.onMouseHover(event);
            _this.RectangleZoom(event);
            if (_this.MapServiceService.SetElavationvalue.IsElavation) {
                $('#getElevationval').draggable();
                var elevator = new google.maps.ElevationService;
                var location_1 = event.latLng;
                elevator.getElevationForLocations({
                    'locations': [location_1]
                }, function (results, status) {
                    if (status === google.maps.ElevationStatus.OK) {
                        // Retrieve the first result
                        if (results[0]) {
                            var elevationvalue = results[0].elevation;
                            if (_this.MapServiceService.SetElavationvalue.Unitvalue == "Meter") {
                                _this.SetElevationval = " Elevation " + elevationvalue.toFixed(0) + " m";
                            }
                            else if (_this.MapServiceService.SetElavationvalue.Unitvalue == "Feet") {
                                var feet = (elevationvalue * 3.28084);
                                _this.SetElevationval = " Elevation " + feet.toFixed(0) + " ft";
                            }
                            else {
                                _this.SetElevationval = "";
                            }
                        }
                    }
                    else {
                        // setAltitude('Elevation service failed due to: ' + status);
                    }
                });
            }
        });
        this.map.addListener('click', function (event) {
            _this.MapLayerInfoService.onClickMarker(event);
        });
        google.maps.event.addListener(this.map, "idle", function (event) {
            _this.hidethePaceProcessbar();
            setTimeout(function () {
                _this.getTotalCount();
            }, 500);
            var TabList = _this.MapServiceService._GridTabData.value;
            if (TabList.length == 0) {
                _this.MapServiceService.GridData.getValue().length = 0;
                _this.MapServiceService.GridColumns.getValue().length = 0;
            }
            for (var t = 0; t < TabList.length; t++) {
                if (TabList[t].ActiveClass == " active") {
                    if (_this.MapServiceService.GridApi.getValue()) {
                        _this.MapServiceService.GridApi.getValue().api.onFilterChanged();
                    }
                }
            }
        });
        this.map.addListener('mousedown', function (event) {
            _this.OnMouseDown(event);
        });
        this.map.addListener('mouseup', function (event) {
            _this.OnMouseUp(event);
        });
        this.SetMapContext();
        this.MapServiceService.setMap(this.map);
        this.switchUnit();
    };
    GoogleMapPage.prototype.zoomIn = function () {
        if (this.maxZoom != this.zoomLevel) {
            this.zoomLevel++;
            this.SetZoom();
        }
        this.hidethePaceProcessbar();
    };
    GoogleMapPage.prototype.zoomOut = function () {
        if (this.minZoom != this.zoomLevel) {
            this.zoomLevel--;
            this.SetZoom();
        }
        this.hidethePaceProcessbar();
    };
    GoogleMapPage.prototype.SetZoom = function () {
        var val = this.zoomLevel;
        this.zoomSlider = val;
        this.hidethePaceProcessbar();
    };
    GoogleMapPage.prototype.PanBy = function (x, y) {
        this.hidethePaceProcessbar();
        return this.map.panBy(x, y);
    };
    GoogleMapPage.prototype.ZoomChange = function () {
        if ((this.map.getZoom() >= this.minZoom) && (this.map.getZoom() <= this.maxZoom)) {
            this.zoomLevel = this.map.getZoom();
            $("#mapzoom").html(this.zoomLevel);
            this.zoomSlider = this.zoomLevel;
        }
    };
    GoogleMapPage.prototype.onSliderChange = function (e) {
        this.zoomLevel = e;
    };
    GoogleMapPage.prototype.onMouseHover = function (event) {
        var lat = event.latLng.lat();
        var long = event.latLng.lng();
        this.Coordinates = lat.toFixed(6) + " , " + long.toFixed(6);
    };
    GoogleMapPage.prototype.removeLayersFromMap = function (id) {
        this.mapfilterval = '';
        if (this.energyLayer.length > 0) {
            for (var x in this.energyLayer) {
                var layer = this.energyLayer[x];
                if (layer.EnergyParentID == id || layer.EnergyLayerID == id) {
                    this.MapLayerService.removemapLayer(layer);
                    if (layer && layer.treestatus == 'GroupLayer')
                        this.MapLayernewService.LoadGroupMapLayers();
                    this.getTotalCount();
                }
            }
        }
        this.energyLayer = this.energyLayer.filter(function (el) {
            if (!((el.EnergyParentID == parseInt(id)) || (el.EnergyLayerID == parseInt(id)))) {
                return el;
            }
        });
    };
    GoogleMapPage.prototype.RemovePrivateLayerFromMap = function (id) {
        this.mapfilterval = '';
        if (this.privateLayer.length > 0) {
            for (var x in this.privateLayer) {
                var layer = this.privateLayer[x];
                if (layer.DataSetID == id) {
                    if ((layer.UploadFileType != null || layer.UploadFileType != undefined) && (layer.UploadFileType.toLowerCase() == ".kml" || layer.UploadFileType.toLowerCase() == ".kmz")) {
                        this.PrivateMapLayerService.RemoveKmlLayer(layer);
                    }
                    else {
                        // this.PrivateMapLayerService.RemoveMapLayer(layer);
                        // if (layer && layer.treestatus == 'GroupLayer')
                        //     this.MapLayernewService.LoadGroupMapLayers();
                        // this.getTotalCount();
                        if (layer && layer.treestatus == 'GroupLayer') {
                            this.MapLayernewService.LoadGroupMapLayers();
                            this.getTotalCount();
                        }
                        else {
                            this.PrivateMapLayerService.RemoveMapLayer(layer);
                        }
                    }
                }
            }
        }
    };
    GoogleMapPage.prototype.RemoveLayerFromPrivateLayerList = function (id) {
        if (this.privateLayer.length > 0) {
            for (var x in this.privateLayer) {
                var layer = this.privateLayer[x];
                if (layer.DataSetID == id) {
                    var index = this.privateLayer.indexOf(layer);
                    this.privateLayer.splice(index, 1);
                }
            }
        }
    };
    GoogleMapPage.prototype.RemoveLayerFromSharedLayerList = function (id) {
        if (this.sharedLayer.length > 0) {
            for (var _i = 0, _a = this.sharedLayer; _i < _a.length; _i++) {
                var layer = _a[_i];
                if (layer.DataSetID == id) {
                    var index = this.sharedLayer.indexOf(layer);
                    this.sharedLayer.splice(index, 1);
                }
            }
        }
    };
    GoogleMapPage.prototype.RemoveLayerFromTemporaryLayerList = function (id) {
        if (this.MapServiceService.temporaryLayer.length > 0) {
            for (var x in this.MapServiceService.temporaryLayer) {
                var layer = this.MapServiceService.temporaryLayer[x];
                if (layer.DataSetID == id) {
                    var index = this.MapServiceService.temporaryLayer.indexOf(layer);
                    this.MapServiceService.temporaryLayer.splice(index, 1);
                }
            }
        }
    };
    GoogleMapPage.prototype.setvalueMapLayers = function (MapLayers) {
        if (MapLayers.length > 0) {
            for (var x in MapLayers) {
                var layer = MapLayers[x];
                if (!(this.energyLayer.indexOf(layer) > -1)) {
                    this.energyLayer.push(layer);
                    this.LoadedLayersObj.push(layer);
                    this.LoadedLayersIds.push(layer.EnergyLayerID);
                }
            }
        }
    };
    GoogleMapPage.prototype.RemoveLayesBasedOnid = function (id) {
        this.mapfilterval = '';
        if (this.energyLayer.length > 0) {
            for (var x in this.energyLayer) {
                var layer = this.energyLayer[x];
                if (layer.EnergyParentID == id || layer.EnergyLayerID == id) {
                    this.MapLayerService.removemapLayer(layer);
                }
            }
        }
    };
    GoogleMapPage.prototype.RemovePrivateLayersBasedOnId = function (id) {
        this.mapfilterval = '';
        if (this.privateLayer.length > 0) {
            for (var x in this.privateLayer) {
                var layer = this.privateLayer[x];
                if (layer.DataSetID == id) {
                    if ((layer.UploadFileType != null || layer.UploadFileType != undefined) && (layer.UploadFileType.toLowerCase() == ".kml" || layer.UploadFileType.toLowerCase() == ".kmz")) {
                        this.PrivateMapLayerService.RemoveKmlLayer(layer);
                    }
                    else {
                        this.PrivateMapLayerService.RemoveMapLayer(layer);
                    }
                }
            }
        }
    };
    GoogleMapPage.prototype.RemoveSharedLayersBasedOnId = function (id) {
        this.mapfilterval = '';
        if (this.sharedLayer.length > 0) {
            for (var _i = 0, _a = this.sharedLayer; _i < _a.length; _i++) {
                var layer = _a[_i];
                if (layer.DataSetID == id) {
                    if ((layer.UploadFileType) && (layer.UploadFileType.toLowerCase() == ".kml" || layer.UploadFileType.toLowerCase() == ".kmz")) {
                        this.PrivateMapLayerService.RemoveKmlLayer(layer);
                    }
                    else {
                        if (layer && layer.treestatus == 'GroupLayer') {
                            this.MapLayernewService.LoadGroupMapLayers();
                            this.getTotalCount();
                        }
                        else {
                            this.PrivateMapLayerService.RemoveMapLayer(layer);
                        }
                    }
                }
            }
        }
    };
    GoogleMapPage.prototype.RemoveTemporaryLayersBasedOnId = function (id) {
        this.mapfilterval = '';
        if (this.MapServiceService.temporaryLayer.length > 0) {
            for (var x in this.MapServiceService.temporaryLayer) {
                var layer = this.MapServiceService.temporaryLayer[x];
                if (layer.DataSetID == id) {
                    this.PrivateMapLayerService.RemoveMapLayer(layer);
                }
            }
        }
    };
    GoogleMapPage.prototype.addlayesbasedonId = function (Id) {
        var _this = this;
        var energyLayerLoad = this.energyLayer.filter(function (el) {
            if (((el.EnergyParentID == parseInt(Id)) || (el.EnergyLayerID == parseInt(Id)))) {
                return el;
            }
        });
        if (energyLayerLoad.length > 0) {
            for (var x in energyLayerLoad) {
                var layer = energyLayerLoad[x];
                setTimeout(function () {
                    var UserId = _this.AuthServices.getLoggedinUserId();
                    if (layer.TableName) {
                        // this.httpService._NodeGetFeaturetype(layer, 0, 1, '', '', '', UserId)
                        //     .subscribe(data => {
                        // if (data['featureTypes']) {
                        _this.MapLayerService.loadmapLayers(layer);
                        // }
                        // }, error => {
                        //     console.log(error);
                        // });
                    }
                    else if (!layer.TableName && layer.DetailPanelProperties.toString().indexOf('BaseUri==') != -1 && layer.DetailPanelPropertiesMain.toString().indexOf('BaseUri==') != -1) {
                        _this.MapLayerService.loadmapLayers(layer);
                    }
                }, 500);
            }
        }
    };
    GoogleMapPage.prototype.AddPrivateLayerBasedOnId = function (Id) {
        var _this = this;
        var privateLayerLoad = this.privateLayer.filter(function (el) {
            if (el.DataSetID == parseInt(Id)) {
                return el;
            }
        });
        if (privateLayerLoad.length > 0) {
            for (var x in privateLayerLoad) {
                var layer = privateLayerLoad[x];
                if ((layer.UploadFileType != null || layer.UploadFileType != undefined) && (layer.UploadFileType.toLowerCase() == ".kml" || layer.UploadFileType.toLowerCase() == ".kmz")) {
                    this.LoadPrivateKmlLayers(layer);
                }
                else {
                    var UserId = this.AuthServices.getLoggedinUserId();
                    this.httpService._NodeGetPrivateLayerData(layer, 0, 1, '', '', '', UserId)
                        .subscribe(function (data) {
                        if (data['totalFeatures']) {
                            _this.PrivateMapLayerService.LoadPrivateMapLayers(layer);
                        }
                    }, function (error) {
                        console.log(error);
                    });
                }
            }
        }
    };
    GoogleMapPage.prototype.AddSharedLayerBasedOnId = function (Id) {
        var _this = this;
        var sharedLayerLoad = this.sharedLayer.filter(function (el) {
            if (el.DataSetID == parseInt(Id)) {
                return el;
            }
        });
        if (sharedLayerLoad.length > 0) {
            var _loop_1 = function (layer) {
                if ((layer.UploadFileType) && (layer.UploadFileType.toLowerCase() == ".kml" || layer.UploadFileType.toLowerCase() == ".kmz")) {
                    this_1.LoadPrivateKmlLayers(layer);
                }
                else {
                    var UserId = this_1.AuthServices.getLoggedinUserId();
                    this_1.httpService._NodeGetPrivateLayerData(layer, 0, 1, '', '', '', UserId)
                        .subscribe(function (data) {
                        if (data['totalFeatures']) {
                            _this.PrivateMapLayerService.LoadPrivateMapLayers(layer);
                        }
                    }, function (error) {
                        console.log(error);
                    });
                }
            };
            var this_1 = this;
            for (var _i = 0, sharedLayerLoad_1 = sharedLayerLoad; _i < sharedLayerLoad_1.length; _i++) {
                var layer = sharedLayerLoad_1[_i];
                _loop_1(layer);
            }
        }
    };
    GoogleMapPage.prototype.AddTemporaryLayerBasedOnId = function (Id) {
        var _this = this;
        var temporaryLayerLoad = this.MapServiceService.temporaryLayer.filter(function (el) {
            if (el.DataSetID == parseInt(Id)) {
                return el;
            }
        });
        if (temporaryLayerLoad.length > 0) {
            for (var x in temporaryLayerLoad) {
                var layer = temporaryLayerLoad[x];
                setTimeout(function () {
                    var UserId = _this.AuthServices.getLoggedinUserId();
                    _this.httpService._NodeGetFeaturetype(layer, 0, 1, '', '', '', UserId)
                        .subscribe(function (data) {
                        if (data['featureTypes']) {
                            _this.PrivateMapLayerService.LoadPrivateMapLayers(layer);
                        }
                    }, function (error) {
                        console.log(error);
                    });
                }, 500);
            }
        }
    };
    GoogleMapPage.prototype.LoadPrivateKmlLayers = function (layer) {
        var _this = this;
        if (!this.MapServiceService.KmlLayersData.getValue()) {
            this.httpService.GetKmlData(layer.DataSetGUID, layer.UploadFileType)
                .subscribe(function (data) {
                var result = data.json();
                if (result.isSuccess) {
                    var kmlData = {
                        LayerID: layer.DataSetID,
                        LayerData: result.result
                    };
                    _this.MapServiceService.setKMLLayersData([kmlData]);
                    var kmlLayer = _this.PrivateMapLayerService.SetPrivateKMLlayer(kmlData);
                    var klayer = {
                        LayerIndex: layer.Layerindexval,
                        Layer: kmlLayer
                    };
                    if (!_this.MapServiceService.KmlLayers.getValue()) {
                        _this.MapServiceService.setKmlLayers([klayer]);
                    }
                    else {
                        var existingklayer = _this.MapServiceService.KmlLayers.getValue();
                        existingklayer.push(klayer);
                    }
                    _this.BindPrivateLayerActiveGridData();
                }
            });
        }
        else {
            var existingklayer = this.MapServiceService.kmlLayersData.getValue();
            var selectedKmlLayer = [];
            for (var _i = 0, existingklayer_1 = existingklayer; _i < existingklayer_1.length; _i++) {
                var layerdata = existingklayer_1[_i];
                if (layerdata.LayerID == parseInt(layer.DataSetID))
                    selectedKmlLayer.push(layerdata);
            }
            if (selectedKmlLayer.length == 1) {
                if (layer['serversidefilterval'] != undefined && layer['serversidefilterval'].length > 0 && layer['serversidefilterval'][0].indexOf("Name=") > -1) {
                    if (layer['serversidefilterval'][0].indexOf(';') > -1) {
                        var filterValues = layer['serversidefilterval'][0].split(';');
                        var filterDataValues_1 = [];
                        for (var _a = 0, filterValues_1 = filterValues; _a < filterValues_1.length; _a++) {
                            var filter = filterValues_1[_a];
                            if (filter.indexOf('=') > -1) {
                                var keyValues = filter.split('=');
                                filterDataValues_1.push(keyValues[1]);
                            }
                        }
                        if (filterDataValues_1.length > 0) {
                            var lData = selectedKmlLayer[0].LayerData.KMLGeometryList;
                            var FilterKMLGeometryList_1 = [];
                            lData.filter(function (el) {
                                if (filterDataValues_1.indexOf(el.Name) > -1) {
                                    FilterKMLGeometryList_1.push(el);
                                }
                            });
                            selectedKmlLayer[0].LayerData.KMLGeometryList = FilterKMLGeometryList_1;
                        }
                    }
                    else {
                        var filter = layer['serversidefilterval'][0];
                        var filterDataValues_2 = [];
                        if (filter.indexOf('=') > -1) {
                            var keyValues = filter.split('=');
                            filterDataValues_2.push(keyValues[1]);
                        }
                        if (filterDataValues_2.length > 0) {
                            var lData = selectedKmlLayer[0].LayerData.KMLGeometryList;
                            var FilterKMLGeometryList_2 = [];
                            lData.filter(function (el) {
                                if (filterDataValues_2.indexOf(el.Name) > -1) {
                                    FilterKMLGeometryList_2.push(el);
                                }
                            });
                            selectedKmlLayer[0].LayerData.KMLGeometryList = FilterKMLGeometryList_2;
                        }
                    }
                }
                var kmlLayer = this.PrivateMapLayerService.SetPrivateKMLlayer(selectedKmlLayer[0]);
                var klayer = {
                    LayerIndex: layer.Layerindexval,
                    Layer: kmlLayer
                };
                if (!this.MapServiceService.KmlLayers.getValue()) {
                    this.MapServiceService.setKmlLayers([klayer]);
                }
                else {
                    var existinglayer = this.MapServiceService.KmlLayers.getValue();
                    existinglayer.push(klayer);
                }
            }
            else {
                this.httpService.GetKmlData(layer.DataSetGUID, layer.UploadFileType)
                    .subscribe(function (data) {
                    var result = data.json();
                    if (result.isSuccess) {
                        var kmlData = {
                            LayerID: layer.DataSetID,
                            LayerData: result.result
                        };
                        var existingklayer_2 = _this.MapServiceService.kmlLayersData.getValue();
                        existingklayer_2.push(kmlData);
                        var kmlLayer = _this.PrivateMapLayerService.SetPrivateKMLlayer(kmlData);
                        var klayer = {
                            LayerIndex: layer.Layerindexval,
                            Layer: kmlLayer
                        };
                        if (!_this.MapServiceService.KmlLayers.getValue()) {
                            _this.MapServiceService.setKmlLayers([klayer]);
                        }
                        else {
                            var existingklayer_3 = _this.MapServiceService.KmlLayers.getValue();
                            existingklayer_3.push(klayer);
                        }
                        _this.BindPrivateLayerActiveGridData();
                    }
                });
            }
        }
    };
    // AddPrivateLayerToMap(MapLayer) {
    //     if (MapLayer.length > 0) {
    //         var layer = MapLayer;
    //         if (!(this.privateLayer.indexOf(layer) > -1)) {
    //             this.privateLayer.push(layer);
    //             this.LoadedPrivateLayersObj.push(layer);
    //             this.LoadedPrivateLayersIds.push(layer.EnergyLayerID);
    //             if (data['_body'].indexOf('totalFeatures') > 0) {
    //                 this.loadmapLayers(resultData.result.MapLayers);
    //             }
    //             //setButtonLabel(layer.EnergyLayerID, "Remove from Map");
    //         }
    //         //GetCountForLayers(layer);
    //     }
    // }
    // AddLayersToMap(MapLayers) {
    //     if (MapLayers.length > 0) {
    //         for (let x in MapLayers) {
    //             var layer = MapLayers[x];
    //             if (!(this.energyLayer.indexOf(layer) > -1)) {
    //                 this.energyLayer.push(layer);
    //                 this.LoadedLayersObj.push(layer);
    //                 this.LoadedLayersIds.push(layer.EnergyLayerID);
    //                 //setButtonLabel(layer.EnergyLayerID, "Remove from Map");
    //             }
    //             //GetCountForLayers(layer);
    //         }
    //     }
    //     this.SetlayersOnMap("");
    // }
    // SetlayersOnMap(gmaps) {
    //     for (let x in this.energyLayer) {
    //         let layer = this.energyLayer[x];
    //         // mapA.overlayMapTypes.setAt(count, setWMSlayerD(layer));
    //         //this.map.overlayMapTypes.setAt(layer.EnergyLayerID, this.SetWMSlayerD(layer));             
    //         gmaps = this.MapServiceService._mapdata.getValue();
    //         gmaps.overlayMapTypes.setAt(layer.EnergyLayerID, this.MapLayerService.SetWMSlayerD(layer));
    //     }
    // }
    GoogleMapPage.prototype.TabClick = function (evt, tabId) {
        var actionType = evt.target.getAttribute("data-action-type");
        if (actionType == "MapDataFeature") {
            var tabdata = this.MapServiceService._GridTabData.value;
            for (var inactiveall in tabdata) {
                tabdata[inactiveall].ActiveClass = "";
            }
            for (var o = 0; o < tabdata.length; o++) {
                if (tabdata[o].ID == tabId) {
                    if (this.MapServiceService._GridTabData.value[o].ActiveClass == "") {
                        this.MapServiceService._GridTabData.value[o].ActiveClass = " active";
                        this.MapServiceService.ClearColumncheckvalue();
                        if (!tabdata[o].energyLayer[0].hasOwnProperty("DataSetID")) {
                            this.BindActiveGridData();
                        }
                        else {
                            this.BindPrivateLayerActiveGridData();
                        }
                    }
                }
                else {
                    this.MapServiceService._GridTabData.value[o].ActiveClass = "";
                    // this.MapServiceService._GridTabData.value[o].EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer = false;
                    // this.MapServiceService._GridTabData.value[o].EnergylayersavegridFilter.mapfilterval = ""
                }
            }
        }
    };
    GoogleMapPage.prototype.bindtab = function (nodesData) {
        var _this = this;
        this.MapServiceService._TreeUI.getValue().treeModel.update();
        this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
        this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
        //let Id = nodesData.data.Id;
        var EnergyLayerID = nodesData.data.Id;
        //let Id = nodesData.parent.data.Id;
        var parentid = nodesData.parent.data.Id;
        var parentName = nodesData.parent.data.Name;
        var featureType = '';
        if (nodesData.data.FeatureType)
            featureType = nodesData.data.FeatureType;
        var LayerStatus = '';
        var Layerindexval = 0;
        var tabs = this.energyLayer.filter(function (el) {
            if (el["serversidefilterval"] && el.TableName) {
                el["serversidefilterval"] = '';
                _this.MapServiceService.ClearColumncheckvalue();
            }
            if (el.EnergyLayerID == parseInt(EnergyLayerID) && el.TableName) {
                LayerStatus = el.treestatus;
                Layerindexval = el.Layerindexval;
            }
            if (el.treestatus === "GroupLayer" && el.TableName) {
                if (el.EnergyParentID == parseInt(parentid) && el.treestatus === "GroupLayer") {
                    return el;
                }
            }
            else if (el.treestatus === "Individual" && el.TableName) {
                if (el.EnergyParentID == parseInt(parentid) && el.treestatus === "Individual" && el.EnergyLayerID == parseInt(EnergyLayerID)) {
                    return el;
                }
            }
            if (!el.TableName) {
                if (_this.MapServiceService.ExternalEnergyLayer.length > 0) {
                    var exlayer = _this.MapServiceService.ExternalEnergyLayer.filter(function (exlayer) {
                        if (exlayer.EnergyLayerID != el.EnergyLayerID) {
                            return exlayer;
                        }
                    });
                    if (exlayer && exlayer.length > 0) {
                        _this.MapServiceService.ExternalEnergyLayer.push(exlayer);
                    }
                }
                else {
                    _this.MapServiceService.ExternalEnergyLayer.push(el);
                }
            }
        });
        if (tabs.length > 0) {
            var Isparent = this.MapServiceService._GridTabData.value.filter(function (el) {
                if (el.treestatus === "GroupLayer") {
                    if (el.parentID == parseInt(parentid) && el.treestatus === "GroupLayer") {
                        el.ListOfChildID.push(EnergyLayerID);
                        return el;
                    }
                }
                else if (el.treestatus === "Individual") {
                    if (el.EnergyParentID == parseInt(parentid) && el.treestatus === "Individual" && el.EnergyLayerID == parseInt(EnergyLayerID)) {
                        el.ListOfChildID.push(EnergyLayerID);
                        return el;
                    }
                }
            });
            var IsFiltervalue_1 = [];
            for (var _i = 0, _a = this.energyLayer; _i < _a.length; _i++) {
                var f = _a[_i];
                if (f.FilterValue != "" && f.EnergyLayerID == EnergyLayerID) {
                    IsFiltervalue_1.push(f.FilterValue);
                }
            }
            // let IsFiltervalue = this.energyLayer.filter((el) => {
            //     if (el.FilterValue != "") {
            //         return el.FilterValue;
            //     }
            // });
            if (Isparent == 0) {
                if (nodesData.parent.data["children"]) {
                    if (nodesData.parent.data["children"].length >= 3 && LayerStatus == "GroupLayer") {
                        tabs[0]['DisplayName'] = parentName;
                    }
                }
                var Addtab = {
                    parentID: parentid,
                    parentName: parentName,
                    ID: EnergyLayerID,
                    Title: tabs[0]['DisplayName'],
                    DisplayName: tabs[0]['DisplayName'],
                    ActiveClass: '',
                    energyLayer: tabs,
                    IsFiltervalue: IsFiltervalue_1,
                    totalCount: 0,
                    ListOfChildID: [],
                    treestatus: LayerStatus,
                    GeoserverLayerStatus: "Not Published",
                    VisibaleExportFeature: true,
                    ViewingtotalCount: 0,
                    EnergylayersavegridFilter: { VisibaleSavefiltereneregyLayer: false, mapfilterval: "" },
                    FeatureType: featureType,
                    Layerindexval: Layerindexval
                };
                Addtab.ListOfChildID.push(EnergyLayerID);
                if (this.MapServiceService._GridTabData.getValue().length == 0) {
                    Addtab.ActiveClass = " active";
                }
                this.MapServiceService._GridTabData.getValue().push(Addtab);
                if (this.MapServiceService._GridTabData.getValue().length == 1) {
                    this.MapServiceService.ClearColumncheckvalue();
                    this.BindActiveGridData();
                }
                else {
                    setTimeout(function () {
                        _this.getTotalCount();
                    }, 500);
                }
            }
            else {
                this.MapServiceService._GridTabData.value.filter(function (el) {
                    if (el.parentID == parentid) {
                        el.IsFiltervalue.push(IsFiltervalue_1[0]);
                    }
                });
                var ISGroupLayer_1 = false;
                this.MapServiceService._GridTabData.value.filter(function (el) {
                    if (el.treestatus === "GroupLayer") {
                        ISGroupLayer_1 = true;
                    }
                });
                if (!ISGroupLayer_1)
                    this.BindActiveGridData();
            }
        }
    };
    GoogleMapPage.prototype.BindTabForPrivateLayer = function (nodesData) {
        var _this = this;
        var Id = nodesData.data.Id;
        var PrivateLayerID = nodesData.data.Id;
        //let Id = nodesData.parent.data.Id;
        var parentid = nodesData.parent.data.Id;
        var parentName = nodesData.parent.data.Name;
        var LayerStatus = '';
        var featureType = '';
        if (nodesData.data.FeatureType)
            featureType = nodesData.data.FeatureType;
        var Layerindexval = 0;
        var tabs = this.privateLayer.filter(function (el) {
            if (el["serversidefilterval"]) {
                el["serversidefilterval"] = '';
                _this.MapServiceService.ClearColumncheckvalue();
            }
            // if (el.treestatus === "Individual" && el.DataSetID == parseInt(PrivateLayerID)) {
            //     LayerStatus = el.treestatus;
            //     return el;
            // }
            if (el.DataSetID == parseInt(PrivateLayerID)) {
                LayerStatus = el.treestatus;
                Layerindexval = el.Layerindexval;
            }
            if (el.treestatus === "GroupLayer") {
                if (el.ParentDataSetID == parseInt(parentid) && el.treestatus === "GroupLayer") {
                    return el;
                }
            }
            else if (el.treestatus === "Individual") {
                if (el.treestatus === "Individual" && el.DataSetID == parseInt(PrivateLayerID)) {
                    return el;
                }
            }
        });
        //region not bind kml data tab
        // let kmlDataFilter = tabs.filter((el) => {
        //     if (el.UploadFileType.toLowerCase() == ".kml" || el.UploadFileType.toLowerCase() == ".kmz") {
        //         return el;
        //     }
        // });
        // let needToRemoveDataFromTabs = [];
        // for (let i = 0; i < kmlDataFilter.length; i++) {
        //     let index = tabs.indexOf(kmlDataFilter[i]);
        //     if (index > -1) {
        //         needToRemoveDataFromTabs.push(index);
        //     }
        // }
        // if (needToRemoveDataFromTabs.length > 0) {
        //     for (let j = needToRemoveDataFromTabs.length - 1; j >= 0; j--) {
        //         tabs.splice(needToRemoveDataFromTabs[j], 1);
        //     }
        // }
        //endregion
        if (tabs.length > 0) {
            var Isparent = this.MapServiceService._GridTabData.value.filter(function (el) {
                if (el.treestatus === "GroupLayer") {
                    if (el.parentID == parseInt(parentid) && el.treestatus === "GroupLayer") {
                        el.ListOfChildID.push(PrivateLayerID);
                        return el;
                    }
                }
                else if (el.treestatus === "Individual") {
                    if (el.EnergyParentID == parseInt(parentid) && el.treestatus === "Individual" && el.EnergyLayerID == parseInt(PrivateLayerID)) {
                        el.ListOfChildID.push(PrivateLayerID);
                        return el;
                    }
                }
            });
            var IsFiltervalue_2 = [];
            for (var _i = 0, _a = this.privateLayer; _i < _a.length; _i++) {
                var f = _a[_i];
                if (f.FilterValue != null && f.FilterValue != "" && f.DataSetID == PrivateLayerID) {
                    IsFiltervalue_2.push(f.FilterValue);
                }
            }
            if (Isparent == 0) {
                if (nodesData.parent.data["children"] && nodesData.parent.data["children"].length >= 1 && LayerStatus == "GroupLayer") {
                    tabs[0]['DisplayName'] = parentName;
                }
                else {
                    tabs[0]['DisplayName'] = tabs[0].DataSetName;
                }
                var Addtab = {
                    parentID: parentid,
                    parentName: parentName,
                    ID: PrivateLayerID,
                    Title: tabs[0].DisplayName,
                    DisplayName: tabs[0]['DisplayName'],
                    ActiveClass: '',
                    energyLayer: tabs,
                    IsFiltervalue: IsFiltervalue_2,
                    totalCount: 0,
                    ListOfChildID: [],
                    treestatus: LayerStatus,
                    GeoserverLayerStatus: "Not Published",
                    VisibaleExportFeature: true,
                    ViewingtotalCount: 0,
                    EnergylayersavegridFilter: { VisibaleSavefiltereneregyLayer: false, mapfilterval: "" },
                    FeatureType: featureType,
                    Layerindexval: Layerindexval
                };
                Addtab.ListOfChildID.push(PrivateLayerID);
                if (this.MapServiceService._GridTabData.getValue().length == 0) {
                    Addtab.ActiveClass = " active";
                }
                this.MapServiceService._GridTabData.getValue().push(Addtab);
                if (this.MapServiceService._GridTabData.getValue().length == 1) {
                    this.BindPrivateLayerActiveGridData();
                }
                else {
                    setTimeout(function () {
                        _this.getTotalCount();
                    }, 1000);
                }
            }
            else {
                this.MapServiceService._GridTabData.value.filter(function (el) {
                    if (el.parentID == parentid) {
                        el.IsFiltervalue.push(IsFiltervalue_2[0]);
                    }
                });
                var ISGroupLayer_2 = false;
                this.MapServiceService._GridTabData.value.filter(function (el) {
                    if (el.treestatus === "GroupLayer") {
                        ISGroupLayer_2 = true;
                    }
                });
                if (!ISGroupLayer_2)
                    this.BindPrivateLayerActiveGridData();
                //     this.BindTemporaryLayerActiveGridData();
                // this.BindActiveGridData();
            }
        }
        //this.BindTabs.push(dj);
    };
    GoogleMapPage.prototype.BindTabForSharedLayer = function (nodesData) {
        var _this = this;
        var Id = nodesData.data.Id;
        var SharedLayerID = nodesData.data.Id;
        var parentid = nodesData.parent.data.Id;
        var parentName = nodesData.parent.data.Name;
        var LayerStatus = '';
        var featureType = '';
        if (nodesData.data.FeatureType)
            featureType = nodesData.data.FeatureType;
        var Layerindexval = 0;
        var tabs = this.sharedLayer.filter(function (el) {
            if (el["serversidefilterval"]) {
                el["serversidefilterval"] = '';
                _this.MapServiceService.ClearColumncheckvalue();
            }
            if (el.DataSetID == parseInt(SharedLayerID)) {
                LayerStatus = el.treestatus;
                Layerindexval = el.Layerindexval;
            }
            if (el.treestatus === "GroupLayer") {
                if (el.ParentDataSetID == parseInt(parentid) && el.treestatus === "GroupLayer") {
                    return el;
                }
            }
            else if (el.treestatus === "Individual") {
                if (el.treestatus === "Individual" && el.DataSetID == parseInt(SharedLayerID)) {
                    return el;
                }
            }
        });
        if (tabs.length > 0) {
            var Isparent = this.MapServiceService._GridTabData.value.filter(function (el) {
                if (el.treestatus === "GroupLayer") {
                    if (el.parentID == parseInt(parentid) && el.treestatus === "GroupLayer") {
                        el.ListOfChildID.push(SharedLayerID);
                        return el;
                    }
                }
                else if (el.treestatus === "Individual") {
                    if (el.EnergyParentID == parseInt(parentid) && el.treestatus === "Individual" && el.EnergyLayerID == parseInt(SharedLayerID)) {
                        el.ListOfChildID.push(SharedLayerID);
                        return el;
                    }
                }
            });
            var IsFiltervalue_3 = [];
            for (var _i = 0, _a = this.sharedLayer; _i < _a.length; _i++) {
                var f = _a[_i];
                if (f.FilterValue != null && f.FilterValue != "" && f.DataSetID == SharedLayerID) {
                    IsFiltervalue_3.push(f.FilterValue);
                }
            }
            if (Isparent == 0) {
                if (nodesData.parent.data["children"] && nodesData.parent.data["children"].length >= 1 && LayerStatus == "GroupLayer") {
                    tabs[0]['DisplayName'] = parentName;
                }
                else {
                    tabs[0]['DisplayName'] = tabs[0].DataSetName;
                }
                var Addtab = {
                    parentID: parentid,
                    parentName: parentName,
                    ID: SharedLayerID,
                    Title: tabs[0].DisplayName,
                    DisplayName: tabs[0]['DisplayName'],
                    ActiveClass: '',
                    energyLayer: tabs,
                    IsFiltervalue: IsFiltervalue_3,
                    totalCount: 0,
                    ListOfChildID: [],
                    treestatus: LayerStatus,
                    GeoserverLayerStatus: "Not Published",
                    VisibaleExportFeature: true,
                    ViewingtotalCount: 0,
                    EnergylayersavegridFilter: { VisibaleSavefiltereneregyLayer: false, mapfilterval: "" },
                    FeatureType: featureType,
                    Layerindexval: Layerindexval
                };
                Addtab.ListOfChildID.push(SharedLayerID);
                if (this.MapServiceService._GridTabData.getValue().length == 0) {
                    Addtab.ActiveClass = " active";
                }
                this.MapServiceService._GridTabData.getValue().push(Addtab);
                if (this.MapServiceService._GridTabData.getValue().length == 1) {
                    this.BindPrivateLayerActiveGridData();
                }
                else {
                    setTimeout(function () {
                        _this.getTotalCount();
                    }, 1000);
                }
            }
            else {
                this.MapServiceService._GridTabData.value.filter(function (el) {
                    if (el.parentID == parentid) {
                        el.IsFiltervalue.push(IsFiltervalue_3[0]);
                    }
                });
                var ISGroupLayer_3 = false;
                this.MapServiceService._GridTabData.value.filter(function (el) {
                    if (el.treestatus === "GroupLayer") {
                        ISGroupLayer_3 = true;
                    }
                });
                if (!ISGroupLayer_3)
                    this.BindPrivateLayerActiveGridData();
            }
        }
    };
    GoogleMapPage.prototype.BindTabForTemporaryLayer = function (nodesData) {
        var _this = this;
        var TemporaryLayerID = nodesData.data.Id;
        var LayerStatus = '';
        var parentid = nodesData.parent.data.Id;
        var parentName = nodesData.parent.data.Name;
        var featureType = '';
        if (nodesData.data.FeatureType)
            featureType = nodesData.data.FeatureType;
        var Layerindexval = 0;
        //let tabs = [];
        // if (featureType == "GlobalSearch" && parentid > 0 && nodesData.data.treestatus == "GroupLayer") {
        //     parentid = 0
        // }
        var tabs = this.MapServiceService.temporaryLayer.filter(function (el) {
            if (el["serversidefilterval"]) {
                el["serversidefilterval"] = '';
                _this.MapServiceService.ClearColumncheckvalue();
            }
            if (el.DataSetID == parseInt(TemporaryLayerID)) {
                LayerStatus = el.TreeStatus;
                Layerindexval = el.Layerindexval;
            }
            if (el.TreeStatus === "GroupLayer") {
                if (el.ParentDataSetID == parseInt(parentid) && el.TreeStatus === "GroupLayer") {
                    return el;
                }
            }
            else if (el.TreeStatus === "Individual") {
                if (el.TreeStatus === "Individual" && el.DataSetID == parseInt(TemporaryLayerID)) {
                    return el;
                }
            }
        });
        if (tabs.length > 0) {
            var Isparent = this.MapServiceService._GridTabData.value.filter(function (el) {
                if (el.treestatus === "GroupLayer") {
                    if (el.parentID == parseInt(parentid) && el.treestatus === "GroupLayer") {
                        el.ListOfChildID.push(TemporaryLayerID);
                        return el;
                    }
                }
                else if (el.treestatus === "Individual") {
                    if (el.treestatus === "Individual" && el.ID == parseInt(TemporaryLayerID)) {
                        el.ListOfChildID.push(TemporaryLayerID);
                        return el;
                    }
                }
            });
            var IsFiltervalue_4 = [];
            for (var _i = 0, _a = this.MapServiceService.temporaryLayer; _i < _a.length; _i++) {
                var f = _a[_i];
                if (f.FilterValue != null && f.FilterValue != "" && f.DataSetID == TemporaryLayerID) {
                    IsFiltervalue_4.push(f.FilterValue);
                }
            }
            if (Isparent == 0) {
                if (nodesData.parent.data["children"]) {
                    if (nodesData.parent.data["children"].length >= 1 && LayerStatus == "GroupLayer") {
                        tabs[0]['DisplayName'] = parentName;
                    }
                }
                else {
                    tabs[0]['DisplayName'] = tabs[0].DataSetName;
                }
                var Addtab = {
                    parentID: parentid,
                    parentName: parentName,
                    ID: TemporaryLayerID,
                    Title: tabs[0].DisplayName,
                    DisplayName: tabs[0].DisplayName,
                    ActiveClass: '',
                    energyLayer: tabs,
                    IsFiltervalue: IsFiltervalue_4,
                    totalCount: 0,
                    ListOfChildID: [],
                    treestatus: LayerStatus,
                    GeoserverLayerStatus: "Not Published",
                    VisibaleExportFeature: false,
                    ViewingtotalCount: 0,
                    EnergylayersavegridFilter: { VisibaleSavefiltereneregyLayer: false, mapfilterval: "" },
                    FeatureType: featureType,
                    Layerindexval: Layerindexval
                };
                Addtab.ListOfChildID.push(TemporaryLayerID);
                if (this.MapServiceService._GridTabData.getValue().length == 0) {
                    Addtab.ActiveClass = " active";
                }
                this.MapServiceService._GridTabData.getValue().push(Addtab);
                if (this.MapServiceService._GridTabData.getValue().length == 1) {
                    this.MapServiceService.ClearColumncheckvalue();
                    this.BindTemporaryLayerActiveGridData();
                }
                else {
                    setTimeout(function () {
                        _this.getTotalCount();
                    }, 1000);
                }
            }
            else {
                this.MapServiceService._GridTabData.value.filter(function (el) {
                    if (el.parentID == parentid) {
                        el.IsFiltervalue.push(IsFiltervalue_4[0]);
                    }
                });
                var ISGroupLayer_4 = false;
                this.MapServiceService._GridTabData.value.filter(function (el) {
                    if (el.treestatus === "GroupLayer") {
                        ISGroupLayer_4 = true;
                    }
                });
                if (!ISGroupLayer_4)
                    this.BindTemporaryLayerActiveGridData();
            }
        }
    };
    GoogleMapPage.prototype.removeTab = function (nodesData) {
        var Id = nodesData.data.Id;
        var parentId = nodesData.parent.data.Id;
        var tabdata = this.MapServiceService._GridTabData.value;
        var IsActive = false;
        var Isparent = this.MapServiceService._GridTabData.value.filter(function (el) {
            // if (el.parentID == parseInt(parentId)) {
            //     for (let c = 0; c < el.ListOfChildID.length; c++) {
            //         if (el.ListOfChildID[c] === Id) {
            //             el.ListOfChildID.splice(c, 1);
            //             c--;
            //         }
            //     }
            //     if (el.ListOfChildID.length > 0)
            //         return el;
            // }  
            if (el.treestatus === "GroupLayer") {
                if (el.parentID == parseInt(parentId) && el.treestatus === "GroupLayer") {
                    for (var c = 0; c < el.ListOfChildID.length; c++) {
                        if (el.ListOfChildID[c] === Id) {
                            el.ListOfChildID.splice(c, 1);
                            c--;
                        }
                    }
                    if (el.ListOfChildID.length > 0)
                        return el;
                }
                el.energyLayer.filter(function (el) {
                    if (el.ViewingCount != "" && el.ViewingCount != undefined) {
                        el.ViewingCount = 0;
                    }
                });
            }
            else if (el.treestatus === "Individual") {
                if (el.EnergyParentID == parseInt(parentId) && el.treestatus === "Individual" && el.EnergyLayerID == parseInt(Id)) {
                    for (var c = 0; c < el.ListOfChildID.length; c++) {
                        if (el.ListOfChildID[c] === Id) {
                            el.ListOfChildID.splice(c, 1);
                            c--;
                        }
                    }
                    if (el.ListOfChildID.length > 0)
                        return el;
                }
            }
        });
        this.MapServiceService.ClearColumncheckvalue();
        if (Isparent.length == 0) {
            for (var i = 0; i < tabdata.length; i++) {
                //if ((tabdata[i].ID == parseInt(Id) || (tabdata[i].parentID == parseInt(Id)))) {
                if (tabdata[i].treestatus == "GroupLayer") {
                    if ((tabdata[i].ListOfChildID.length == 0 || (tabdata[i].parentID == parseInt(parentId) && tabdata[i].treestatus == "GroupLayer"))) {
                        if (this.MapServiceService._GridTabData.value[i].ActiveClass == " active") {
                            IsActive = true;
                        }
                        this.MapLayernewService.removeGroupmapLayer(tabdata[i].Layerindexval);
                        this.MapServiceService._GridTabData.value.splice(i, 1);
                    }
                }
                else if (tabdata[i].treestatus == "Individual") {
                    if ((tabdata[i].ListOfChildID.length == 0 || (tabdata[i].parentID == parseInt(parentId) && tabdata[i].ID == parseInt(Id)))) {
                        if (this.MapServiceService._GridTabData.value[i].ActiveClass == " active") {
                            IsActive = true;
                        }
                        this.MapServiceService._GridTabData.value.splice(i, 1);
                    }
                }
            }
            if (IsActive == true) {
                if (this.MapServiceService._GridTabData.value.length > 0) {
                    this.MapServiceService._GridTabData.value[0].ActiveClass = " active";
                }
            }
        }
        //if (Isparent.length > 0) {
        var filterval = '';
        this.energyLayer.filter(function (el) {
            if (el.EnergyLayerID == Id) {
                filterval = el.FilterValue;
            }
        });
        if (filterval) {
            this.MapServiceService._GridTabData.value.filter(function (el) {
                el.IsFiltervalue = el.IsFiltervalue.filter(function (fel) {
                    if (fel != filterval) {
                        return fel;
                    }
                });
            });
        }
        // }
        var activeGridTabData = this.MapServiceService._GridTabData.value.filter(function (el) {
            if (el.ActiveClass == " active") {
                return el;
            }
        });
        if (activeGridTabData.length > 0) {
            if (activeGridTabData[0].energyLayer[0].hasOwnProperty('DataSetID')) {
                if (activeGridTabData[0].energyLayer[0].DataSetID >= 100000)
                    this.BindTemporaryLayerActiveGridData();
                else
                    this.BindPrivateLayerActiveGridData();
            }
            else {
                this.BindActiveGridData();
            }
        }
        else {
            this.MapServiceService.GridData.getValue().length = 0;
            this.MapServiceService.GridColumns.getValue().length = 0;
            this.MapServiceService.KMLGridData.getValue().length = 0;
            this.MapServiceService.KMLGridcolumns.getValue().length = 0;
            var map = this.MapServiceService._mapdata.getValue();
            map.overlayMapTypes.clear();
        }
        if (this.MapServiceService.ExternalEnergyLayer.length > 0) {
            for (var e = 0; e < this.MapServiceService.ExternalEnergyLayer.length; e++) {
                var Exlayer = this.MapServiceService.ExternalEnergyLayer[e];
                if (Exlayer.EnergyLayerID == Id) {
                    this.MapServiceService.ExternalEnergyLayer.splice(e, 1);
                }
            }
        }
    };
    GoogleMapPage.prototype.RemoveTabForPrivateLayer = function (nodesData) {
        var Id = nodesData.data.Id;
        var parentId = nodesData.parent.data.Id;
        var tabdata = this.MapServiceService._GridTabData.value;
        var IsActive = false;
        var Isparent = this.MapServiceService._GridTabData.value.filter(function (el) {
            if (el.parentID == parseInt(parentId)) {
                for (var c = 0; c < el.ListOfChildID.length; c++) {
                    if (el.ListOfChildID[c] === Id) {
                        el.ListOfChildID.splice(c, 1);
                        c--;
                    }
                }
                if (el.ListOfChildID.length > 0)
                    return el;
            }
            if (el.treestatus === "GroupLayer") {
                if (el.parentID == parseInt(parentId) && el.treestatus === "GroupLayer") {
                    for (var c = 0; c < el.ListOfChildID.length; c++) {
                        if (el.ListOfChildID[c] === Id) {
                            el.ListOfChildID.splice(c, 1);
                            c--;
                        }
                    }
                    if (el.ListOfChildID.length > 0)
                        return el;
                }
            }
            else if (el.treestatus === "Individual") {
                if (el.EnergyParentID == parseInt(parentId) && el.treestatus === "Individual" && el.EnergyLayerID == parseInt(Id)) {
                    for (var c = 0; c < el.ListOfChildID.length; c++) {
                        if (el.ListOfChildID[c] === Id) {
                            el.ListOfChildID.splice(c, 1);
                            c--;
                        }
                    }
                    if (el.ListOfChildID.length > 0)
                        return el;
                }
            }
        });
        if (Isparent.length == 0) {
            for (var i = 0; i < tabdata.length; i++) {
                if ((tabdata[i].ID == parseInt(Id) || (tabdata[i].parentID == parseInt(parentId)))) {
                    if (tabdata[i].treestatus == "GroupLayer") {
                        if ((tabdata[i].ListOfChildID.length == 0 || (tabdata[i].parentID == parseInt(parentId) && tabdata[i].treestatus == "GroupLayer"))) {
                            if (this.MapServiceService._GridTabData.value[i].ActiveClass == " active") {
                                IsActive = true;
                            }
                            this.MapServiceService._GridTabData.value.splice(i, 1);
                        }
                    }
                    else if (tabdata[i].treestatus == "Individual") {
                        if (tabdata[i].ID == parseInt(Id)) {
                            if (this.MapServiceService._GridTabData.value[i].ActiveClass == " active") {
                                IsActive = true;
                            }
                            this.MapServiceService._GridTabData.value.splice(i, 1);
                        }
                    }
                }
            }
            if (IsActive == true) {
                if (this.MapServiceService._GridTabData.value.length > 0) {
                    this.MapServiceService._GridTabData.value[0].ActiveClass = " active";
                }
            }
        }
        // if (Isparent.length > 0) {
        var filterval = '';
        this.privateLayer.filter(function (el) {
            if (el.DataSetID == Id) {
                filterval = el.FilterValue;
            }
        });
        if (filterval) {
            this.MapServiceService._GridTabData.value.filter(function (el) {
                el.IsFiltervalue = el.IsFiltervalue.filter(function (fel) {
                    if (fel != filterval) {
                        return fel;
                    }
                });
            });
        }
        // }
        var activeGridTabData = this.MapServiceService._GridTabData.value.filter(function (el) {
            if (el.ActiveClass == " active") {
                return el;
            }
        });
        if (activeGridTabData.length > 0) {
            if (activeGridTabData[0].energyLayer[0].hasOwnProperty('DataSetID')) {
                if (activeGridTabData[0].energyLayer[0].DataSetID >= 100000)
                    this.BindTemporaryLayerActiveGridData();
                else
                    this.BindPrivateLayerActiveGridData();
            }
            else
                this.BindActiveGridData();
        }
        else {
            this.MapServiceService.GridData.getValue().length = 0;
            this.MapServiceService.GridColumns.getValue().length = 0;
            this.MapServiceService.KMLGridData.getValue().length = 0;
            this.MapServiceService.KMLGridcolumns.getValue().length = 0;
            var map = this.MapServiceService._mapdata.getValue();
            map.overlayMapTypes.clear();
        }
    };
    GoogleMapPage.prototype.RemoveTabForSharedLayer = function (nodesData) {
        var Id = nodesData.data.Id;
        var parentId = nodesData.parent.data.Id;
        var tabdata = this.MapServiceService._GridTabData.value;
        var IsActive = false;
        var Isparent = this.MapServiceService._GridTabData.value.filter(function (el) {
            if (el.parentID == parseInt(parentId)) {
                for (var c = 0; c < el.ListOfChildID.length; c++) {
                    if (el.ListOfChildID[c] === Id) {
                        el.ListOfChildID.splice(c, 1);
                        c--;
                    }
                }
                if (el.ListOfChildID.length > 0)
                    return el;
            }
            if (el.treestatus === "GroupLayer") {
                if (el.parentID == parseInt(parentId) && el.treestatus === "GroupLayer") {
                    for (var c = 0; c < el.ListOfChildID.length; c++) {
                        if (el.ListOfChildID[c] === Id) {
                            el.ListOfChildID.splice(c, 1);
                            c--;
                        }
                    }
                    if (el.ListOfChildID.length > 0)
                        return el;
                }
            }
            else if (el.treestatus === "Individual") {
                if (el.EnergyParentID == parseInt(parentId) && el.treestatus === "Individual" && el.EnergyLayerID == parseInt(Id)) {
                    for (var c = 0; c < el.ListOfChildID.length; c++) {
                        if (el.ListOfChildID[c] === Id) {
                            el.ListOfChildID.splice(c, 1);
                            c--;
                        }
                    }
                    if (el.ListOfChildID.length > 0)
                        return el;
                }
            }
        });
        if (Isparent.length == 0) {
            for (var i = 0; i < tabdata.length; i++) {
                if ((tabdata[i].ID == parseInt(Id) || (tabdata[i].parentID == parseInt(parentId)))) {
                    if (tabdata[i].treestatus == "GroupLayer") {
                        if ((tabdata[i].ListOfChildID.length == 0 || (tabdata[i].parentID == parseInt(parentId) && tabdata[i].treestatus == "GroupLayer"))) {
                            if (this.MapServiceService._GridTabData.value[i].ActiveClass == " active") {
                                IsActive = true;
                            }
                            this.MapServiceService._GridTabData.value.splice(i, 1);
                        }
                    }
                    else if (tabdata[i].treestatus == "Individual") {
                        if (tabdata[i].ID == parseInt(Id)) {
                            if (this.MapServiceService._GridTabData.value[i].ActiveClass == " active") {
                                IsActive = true;
                            }
                            this.MapServiceService._GridTabData.value.splice(i, 1);
                        }
                    }
                }
            }
            if (IsActive == true) {
                if (this.MapServiceService._GridTabData.value.length > 0) {
                    this.MapServiceService._GridTabData.value[0].ActiveClass = " active";
                }
            }
        }
        // if (Isparent.length > 0) {
        var filterval = '';
        this.privateLayer.filter(function (el) {
            if (el.DataSetID == Id) {
                filterval = el.FilterValue;
            }
        });
        if (filterval) {
            this.MapServiceService._GridTabData.value.filter(function (el) {
                el.IsFiltervalue = el.IsFiltervalue.filter(function (fel) {
                    if (fel != filterval) {
                        return fel;
                    }
                });
            });
        }
        // }
        var activeGridTabData = this.MapServiceService._GridTabData.value.filter(function (el) {
            if (el.ActiveClass == " active") {
                return el;
            }
        });
        if (activeGridTabData.length > 0) {
            if (activeGridTabData[0].energyLayer[0].hasOwnProperty('DataSetID')) {
                if (activeGridTabData[0].energyLayer[0].DataSetID >= 100000)
                    this.BindTemporaryLayerActiveGridData();
                else
                    this.BindPrivateLayerActiveGridData();
            }
            else
                this.BindActiveGridData();
        }
        else {
            this.MapServiceService.GridData.getValue().length = 0;
            this.MapServiceService.GridColumns.getValue().length = 0;
            this.MapServiceService.KMLGridData.getValue().length = 0;
            this.MapServiceService.KMLGridcolumns.getValue().length = 0;
            var map = this.MapServiceService._mapdata.getValue();
            map.overlayMapTypes.clear();
        }
    };
    GoogleMapPage.prototype.RemoveTabForTemporaryLayer = function (nodesData) {
        var Id = nodesData.data.Id;
        var parentId = nodesData.parent.data.Id;
        var tabdata = this.MapServiceService._GridTabData.value;
        var IsActive = false;
        var Isparent = this.MapServiceService._GridTabData.value.filter(function (el) {
            // if (el.parentID == parseInt(parentId)) {
            //     for (let c = 0; c < el.ListOfChildID.length; c++) {
            //         if (el.ListOfChildID[c] === Id) {
            //             el.ListOfChildID.splice(c, 1);
            //             c--;
            //         }
            //     }
            //     if (el.ListOfChildID.length > 0)
            //         return el;
            // }  
            if (el.treestatus === "GroupLayer") {
                if (el.parentID == parseInt(parentId) && el.treestatus === "GroupLayer") {
                    for (var c = 0; c < el.ListOfChildID.length; c++) {
                        if (el.ListOfChildID[c] === Id) {
                            el.ListOfChildID.splice(c, 1);
                            c--;
                        }
                    }
                    if (el.ListOfChildID.length > 0)
                        return el;
                }
            }
            else if (el.treestatus === "Individual") {
                if (el.treestatus === "Individual" && el.ID == parseInt(Id)) {
                    for (var c = 0; c < el.ListOfChildID.length; c++) {
                        if (el.ListOfChildID[c] === Id) {
                            el.ListOfChildID.splice(c, 1);
                            c--;
                        }
                    }
                    if (el.ListOfChildID.length > 0)
                        return el;
                }
            }
        });
        this.MapServiceService.ClearColumncheckvalue();
        if (Isparent.length == 0) {
            for (var i = 0; i < tabdata.length; i++) {
                //if ((tabdata[i].ID == parseInt(Id) || (tabdata[i].parentID == parseInt(Id)))) {
                if (tabdata[i].treestatus == "GroupLayer") {
                    if ((tabdata[i].ListOfChildID.length == 0 || (tabdata[i].parentID == parseInt(parentId) && tabdata[i].treestatus == "GroupLayer"))) {
                        if (this.MapServiceService._GridTabData.value[i].ActiveClass == " active") {
                            IsActive = true;
                        }
                        this.MapServiceService._GridTabData.value.splice(i, 1);
                    }
                }
                else if (tabdata[i].treestatus == "Individual") {
                    if ((tabdata[i].ListOfChildID.length == 0 || (tabdata[i].ID == parseInt(Id)))) {
                        if (this.MapServiceService._GridTabData.value[i].ActiveClass == " active") {
                            IsActive = true;
                        }
                        this.MapServiceService._GridTabData.value.splice(i, 1);
                    }
                }
            }
            if (IsActive == true) {
                if (this.MapServiceService._GridTabData.value.length > 0) {
                    this.MapServiceService._GridTabData.value[0].ActiveClass = " active";
                }
            }
        }
        //if (Isparent.length > 0) {
        var filterval = '';
        this.MapServiceService.temporaryLayer.map(function (el) {
            if (el.DataSetID == Id) {
                filterval = el.FilterValue;
            }
        });
        if (filterval) {
            this.MapServiceService._GridTabData.value.filter(function (el) {
                el.IsFiltervalue = el.IsFiltervalue.filter(function (fel) {
                    if (fel != filterval) {
                        return fel;
                    }
                });
            });
        }
        // }
        var activeGridTabData = this.MapServiceService._GridTabData.value.filter(function (el) {
            if (el.ActiveClass == " active") {
                return el;
            }
        });
        if (activeGridTabData.length > 0) {
            if (activeGridTabData[0].energyLayer[0].hasOwnProperty('DataSetID')) {
                if (activeGridTabData[0].energyLayer[0].DataSetID >= 100000)
                    this.BindTemporaryLayerActiveGridData();
                else
                    this.BindPrivateLayerActiveGridData();
            }
            else
                this.BindActiveGridData();
        }
        else {
            this.MapServiceService.GridData.getValue().length = 0;
            this.MapServiceService.GridColumns.getValue().length = 0;
            this.MapServiceService.KMLGridData.getValue().length = 0;
            this.MapServiceService.KMLGridcolumns.getValue().length = 0;
            var map = this.MapServiceService._mapdata.getValue();
            map.overlayMapTypes.clear();
        }
    };
    GoogleMapPage.prototype.BindActiveGridData1 = function () {
        var _this = this;
        var TabList = this.MapServiceService._GridTabData.value;
        if (TabList.length == 0) {
            this.MapServiceService.GridData.getValue().length = 0;
            this.MapServiceService.GridColumns.getValue().length = 0;
        }
        var _loop_2 = function (t) {
            if (TabList[t].ActiveClass == " active") {
                var UserId = this_2.AuthServices.getLoggedinUserId();
                this_2.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 100, '', '', '', UserId)
                    .then(function (data) {
                    var Data = data;
                    var Gridcolumns = _this.MapServiceService.GenerateColumns(TabList[t].energyLayer[0]);
                    var total = Data.totalFeatures;
                    TabList[t]['totalCount'] = total;
                    _this.GridTotal = total;
                    _this.MapServiceService.GridData.value.length = 0;
                    _this.MapServiceService.GridColumns.value.length = 0;
                    TabList[t].Title += " - Viewing " + total + " of " + total;
                    var ArrayData = [];
                    if (Data.features.length > 0) {
                        var Ldata = Data.features;
                        for (var _i = 0, Ldata_1 = Ldata; _i < Ldata_1.length; _i++) {
                            var d = Ldata_1[_i];
                            ArrayData.push(d.properties);
                        }
                        Array.prototype.push.apply(_this.MapServiceService.GridData.getValue(), ArrayData);
                        Array.prototype.push.apply(_this.MapServiceService.GridColumns.getValue(), Gridcolumns);
                    }
                    ;
                }).catch(function (ex) {
                    console.log(ex);
                });
                //let newArray: any = this.MapServiceService.GridData.getValue();                    
                //newArray = newArray.concat(this.Data);
                //this.MapServiceService.GridData.getValue().push(newArray);
                //}
                //  else if (TabList[t].ID == 10821) {
                //  this.MapServiceService.GridData.value.length = 0;
                // let newArray: any = this.MapServiceService.GridData.getValue();
                // newArray = newArray.concat(this.products);
                // this.MapServiceService.GridData.getValue().push(newArray);
                //    Array.prototype.push.apply(this.MapServiceService.GridData.getValue(), this.products);
                //  }
                // else {
                //     this.MapServiceService.GridData.value.length = 0;
                //     Array.prototype.push.apply(this.MapServiceService.GridData.getValue(), this.Data);
                //let newArray = this.MapServiceService.GridData.value.concat(this.Data);
                //  }
                // for (let Griddata in this.Data) {
                //     this.MapServiceService.GridData.value.push(this.Data[Griddata]);
                // }
            }
        };
        var this_2 = this;
        for (var t = 0; t < TabList.length; t++) {
            _loop_2(t);
        }
        var Acivetab = TabList.filter(function (el) {
            if (el.ActiveClass == " active") {
                return el;
            }
        });
        if (Acivetab.length == 0) {
            this.MapServiceService.GridData.getValue().length = 0;
        }
    };
    GoogleMapPage.prototype.SetTotalCountOnEnergLayertreevie = function () {
        var nodeList = [];
        var treeData = this.MapServiceService.TreeNodes.getValue();
        if (treeData) {
            if (treeData != null && treeData.length > 0) {
                for (var i = 0; i < treeData.length; i++) {
                    if (treeData[i].children != undefined && treeData[i].children.length > 0) {
                        for (var j = 0; j < treeData[i].children.length; j++) {
                            if (treeData[i].children[j].children != undefined) {
                                if (treeData[i].children[j].children.length > 0) {
                                    for (var k = 0; k < treeData[i].children[j].children.length; k++) {
                                        if (treeData[i].children[j].children[k].children != undefined) {
                                            if (treeData[i].children[j].children[k].children.length > 0) {
                                                for (var l = 0; l < treeData[i].children[j].children[k].children.length; l++) {
                                                    nodeList.push(treeData[i].children[j].children[k].children[l]);
                                                }
                                            }
                                        }
                                        else {
                                            nodeList.push(treeData[i].children[j].children[k]);
                                        }
                                    }
                                }
                            }
                            else {
                                nodeList.push(treeData[i].children[j]);
                            }
                        }
                    }
                }
            }
        }
        return nodeList;
    };
    GoogleMapPage.prototype.RefreshAG_GridView = function () {
        if (this.MapServiceService.GridApi.getValue()) {
            var param = this.MapServiceService.GridApi.getValue();
            param.api.purgeInfiniteCache();
        }
    };
    GoogleMapPage.prototype.getTotalCount = function () {
        var _this = this;
        try {
            var TabList = this.MapServiceService._GridTabData.value;
            this.MapServiceService._TreeUI.getValue().treeModel.update();
            this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
            this.MapServiceService._SharedTreeUI.getValue().treeModel.update();
            this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
            var _loop_3 = function (t) {
                if (TabList[t].energyLayer[0].UploadFileType && (TabList[t].energyLayer[0].UploadFileType != null || TabList[t].energyLayer[0].UploadFileType != undefined) && (TabList[t].energyLayer[0].UploadFileType.toLowerCase() == ".kml" || TabList[t].energyLayer[0].UploadFileType.toLowerCase() == ".kmz")) {
                    return "continue";
                }
                setTimeout(function () {
                    if (TabList[t]) {
                        var defaultfilterlist = [];
                        TabList[t].energyLayer.filter(function (el) {
                            if (el.FilterValue != "" && el.FilterValue != undefined) {
                                defaultfilterlist.push(el.FilterValue);
                            }
                        });
                        var default_filter = "";
                        if (TabList[t].energyLayer.length > 0 && TabList[t].energyLayer[0].IsFromHomeLookup)
                            default_filter = _this.MapServiceService.filtervalForHomeLookup(defaultfilterlist);
                        else
                            default_filter = _this.MapServiceService.filterval(defaultfilterlist);
                        var Gridfilter = '';
                        if (TabList[t].EnergylayersavegridFilter.mapfilterval) {
                            Gridfilter = _this.MapServiceService.gridfilter([TabList[t].EnergylayersavegridFilter.mapfilterval]);
                        }
                        if (default_filter == '' && Gridfilter != '') {
                            default_filter = '(' + Gridfilter + ')';
                        }
                        else if (Gridfilter != '' && default_filter != '') {
                            default_filter = '(' + Gridfilter + ') and (' + default_filter + ')';
                        }
                        var cql_Filter = _this.setCqlFilter(default_filter, false);
                        // this.hidethePaceProcessbar();
                        var UserId = _this.AuthServices.getLoggedinUserId();
                        _this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '', UserId)
                            .then(function (data) {
                            if (TabList[t]) {
                                var Data = data;
                                if (Data["totalFeatures"]) {
                                    var total = Data.totalFeatures;
                                    if (total) {
                                        if (TabList[t]['totalCount']) {
                                            TabList[t]['totalCount'] = total;
                                        }
                                        else {
                                            TabList[t]['totalCount'] = total;
                                        }
                                    }
                                    // this.hidethePaceProcessbar();
                                    if (TabList[t].treestatus == "GroupLayer") {
                                        var ListofInactiveEngid = [];
                                        var _loop_4 = function (engidex) {
                                            var Grpenglayer = TabList[t].energyLayer[engidex];
                                            defaultfilterlist = [];
                                            defaultfilterlist.push(Grpenglayer.FilterValue);
                                            default_filter = _this.MapServiceService.filterval(defaultfilterlist);
                                            Gridfilter = '';
                                            if (TabList[t].EnergylayersavegridFilter.mapfilterval) {
                                                Gridfilter = _this.MapServiceService.gridfilter([TabList[t].EnergylayersavegridFilter.mapfilterval]);
                                            }
                                            if (default_filter == '' && Gridfilter != '') {
                                                default_filter = '(' + Gridfilter + ')';
                                            }
                                            else if (Gridfilter != '' && default_filter != '') {
                                                default_filter = '(' + Gridfilter + ') and (' + default_filter + ')';
                                            }
                                            cql_Filter = _this.setCqlFilter(default_filter, true);
                                            nodeList = _this.SetTotalCountOnEnergLayertreevie();
                                            var UserId_1 = _this.AuthServices.getLoggedinUserId();
                                            _this.httpService._NodegetLayerData(Grpenglayer, 0, 1, cql_Filter, '', '', UserId_1)
                                                .then(function (res) {
                                                var Res = res;
                                                var SingalayerCount = Res.totalFeatures;
                                                var filterTreeData = nodeList.filter(function (el) {
                                                    if (el.Id == Grpenglayer.EnergyLayerID) {
                                                        if (!el.IsChecked == false) {
                                                            ListofInactiveEngid.push(Grpenglayer.EnergyLayerID);
                                                        }
                                                        return el;
                                                    }
                                                });
                                                // let EnergyTreeNodeList = this.MapServiceService.TreeNodes.getValue();
                                                var privateTreeNodeData = _this.MapServiceService.PrivateTreeNode.getValue();
                                                var sharedTreeNodeData = _this.MapServiceService._SharedTreeNode.getValue();
                                                var TemporaryTreeNodeData = _this.MapServiceService.TemporaryTreeNode.getValue();
                                                // for (let i = 0; i < EnergyTreeNodeList.length; i++) {
                                                // let grpLayer = EnergyTreeNodeList[i];                                                          
                                                // if (Grpenglayer.ParentDataSetID == grpLayer.Id) {
                                                // if (grpLayer.children.length != TabList[t].energyLayer.length) {
                                                if (TabList[t].FeatureType == "EnergyLayer") {
                                                    TabList[t].energyLayer.forEach(function (layer) {
                                                        var index = nodeList.findIndex(function (x) { return x.Id == layer.EnergyLayerID; });
                                                        if (index == -1 && ListofInactiveEngid.indexOf(layer.EnergyLayerID) == -1) {
                                                            ListofInactiveEngid.push(layer.EnergyLayerID);
                                                        }
                                                    });
                                                }
                                                var _loop_5 = function (i) {
                                                    var grpLayer = privateTreeNodeData[i];
                                                    grpLayer.children.filter(function (x) {
                                                        if (!x.IsChecked == false) {
                                                            ListofInactiveEngid.push(x.Id);
                                                        }
                                                    });
                                                    if (Grpenglayer.ParentDataSetID == grpLayer.Id) {
                                                        if (grpLayer.children.length != TabList[t].energyLayer.length) {
                                                            TabList[t].energyLayer.forEach(function (layer) {
                                                                var index = grpLayer.children.findIndex(function (x) { return x.Id == layer.DataSetID; });
                                                                if (index == -1 && ListofInactiveEngid.indexOf(layer.DataSetID) == -1) {
                                                                    ListofInactiveEngid.push(layer.DataSetID);
                                                                }
                                                            });
                                                        }
                                                    }
                                                };
                                                // }
                                                // }
                                                // }
                                                for (var i = 0; i < privateTreeNodeData.length; i++) {
                                                    _loop_5(i);
                                                }
                                                var _loop_6 = function (i) {
                                                    var grpLayer = sharedTreeNodeData[i];
                                                    grpLayer.children.filter(function (x) {
                                                        if (!x.IsChecked == false) {
                                                            ListofInactiveEngid.push(x.Id);
                                                        }
                                                    });
                                                    if (Grpenglayer.ParentDataSetID == grpLayer.Id) {
                                                        if (grpLayer.children.length != TabList[t].energyLayer.length) {
                                                            TabList[t].energyLayer.forEach(function (layer) {
                                                                var index = grpLayer.children.findIndex(function (x) { return x.Id == layer.DataSetID; });
                                                                if (index == -1 && ListofInactiveEngid.indexOf(layer.DataSetID) == -1) {
                                                                    ListofInactiveEngid.push(layer.DataSetID);
                                                                }
                                                            });
                                                        }
                                                    }
                                                };
                                                for (var i = 0; i < sharedTreeNodeData.length; i++) {
                                                    _loop_6(i);
                                                }
                                                var _loop_7 = function (i) {
                                                    var grpLayer = TemporaryTreeNodeData[i];
                                                    grpLayer.children.filter(function (x) {
                                                        if (!x.IsChecked == false) {
                                                            ListofInactiveEngid.push(x.Id);
                                                        }
                                                    });
                                                    if (Grpenglayer.ParentDataSetID == grpLayer.Id) {
                                                        if (grpLayer.children.length != TabList[t].energyLayer.length) {
                                                            TabList[t].energyLayer.forEach(function (layer) {
                                                                var index = grpLayer.children.findIndex(function (x) { return x.Id == layer.DataSetID; });
                                                                if (index == -1 && ListofInactiveEngid.indexOf(layer.DataSetID) == -1) {
                                                                    ListofInactiveEngid.push(layer.DataSetID);
                                                                }
                                                            });
                                                        }
                                                    }
                                                };
                                                for (var i = 0; i < TemporaryTreeNodeData.length; i++) {
                                                    _loop_7(i);
                                                }
                                                var Totalcount = 0;
                                                var GrpTotalCount = undefined;
                                                //  if (IscheckedActive) {
                                                TabList[t].energyLayer[engidex]["ViewingCount"] = Res.totalFeatures;
                                                TabList[t].ViewingtotalCount = TabList[t].ViewingtotalCount + SingalayerCount;
                                                if (parseInt(engidex) == (TabList[t].energyLayer.length - 1)) {
                                                    // if (grpLayerIndex == (TabList[t].ListOfChildID.length)) {
                                                    TabList[t].energyLayer.filter(function (el) {
                                                        if (el.ViewingCount != "" && el.ViewingCount != undefined) {
                                                            if (ListofInactiveEngid.indexOf(el.EnergyLayerID) == -1) {
                                                                Totalcount = Totalcount + el.ViewingCount;
                                                            }
                                                        }
                                                    });
                                                    if (Totalcount != undefined)
                                                        TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing " + Totalcount + " of " + TabList[t]['totalCount'];
                                                    GrpTotalCount = Totalcount;
                                                }
                                                // }
                                                // else {
                                                //     TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing " + Totalcount + " of " + TabList[t]['totalCount'];
                                                // }
                                                // -------- For Private Data Total count Display -------------
                                                if (_this.MapServiceService.PrivateTreeNode.getValue()) {
                                                    privateTreeNodeData.forEach(function (el) {
                                                        if (el.LayerType = "GroupLayer" && el.Id == Grpenglayer.ParentDataSetID) {
                                                            // for(let ptd=0;ptd<el.children)
                                                            if (GrpTotalCount > -1)
                                                                el["activeCount"] = GrpTotalCount;
                                                            if (el.children) {
                                                                for (var ptd = 0; ptd < el.children.length; ptd++) {
                                                                    var element = el.children[ptd];
                                                                    if (Grpenglayer.DataSetID == element.Id) {
                                                                        element["activeCount"] = SingalayerCount;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        // if (el.Id == Grpenglayer.DataSetID || el.Id == Grpenglayer.ParentDataSetID) {
                                                        // if (el.Id == Grpenglayer.ParentDataSetID && el.id) {
                                                        //     return el;
                                                        // }
                                                    });
                                                    setTimeout(function () {
                                                        _this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
                                                    }, 500);
                                                    // if (filterPrivateTreeData.length == 1) {
                                                    //     // filterPrivateTreeData[0]["activeCount"] = SingalayerCount;
                                                    //     if (GrpTotalCount != undefined || GrpTotalCount > -1)
                                                    //         filterPrivateTreeData[0]["activeCount"] = GrpTotalCount;
                                                    //     filterPrivateTreeData[0].children[engidex]["activeCount"] = SingalayerCount;
                                                    // }
                                                }
                                                // -------- For Shared Data Total count Display -------------
                                                if (_this.MapServiceService._SharedTreeNode.getValue()) {
                                                    // let filterSharedTreeData = sharedTreeNodeData.filter((el) => {
                                                    //     if (el.Id == Grpenglayer.ParentDataSetID) {
                                                    //         return el;
                                                    //     }
                                                    // });
                                                    // if (filterSharedTreeData.length == 1) {
                                                    //     if (GrpTotalCount != undefined || GrpTotalCount > -1)
                                                    //         filterSharedTreeData[0]["activeCount"] = GrpTotalCount;
                                                    //     filterSharedTreeData[0].children[engidex]["activeCount"] = SingalayerCount;
                                                    // }
                                                    sharedTreeNodeData.forEach(function (el) {
                                                        if (el.LayerType = "GroupLayer" && el.Id == Grpenglayer.ParentDataSetID) {
                                                            // for(let ptd=0;ptd<el.children)
                                                            if (GrpTotalCount > -1)
                                                                el["activeCount"] = GrpTotalCount;
                                                            if (el.children) {
                                                                for (var std = 0; std < el.children.length; std++) {
                                                                    var element = el.children[std];
                                                                    if (Grpenglayer.DataSetID == element.Id) {
                                                                        element["activeCount"] = SingalayerCount;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        // if (el.Id == Grpenglayer.DataSetID || el.Id == Grpenglayer.ParentDataSetID) {
                                                        // if (el.Id == Grpenglayer.ParentDataSetID && el.id) {
                                                        //     return el;
                                                        // }
                                                    });
                                                }
                                                // -------- For Temporary Data Total count Display -------------
                                                if (_this.MapServiceService.TemporaryTreeNode.getValue()) {
                                                    // let temporaryTreeNodeData = this.MapServiceService.TemporaryTreeNode.getValue();
                                                    // let filterTemporaryTreeData = temporaryTreeNodeData.filter((el) => {
                                                    //     if (el.Id == Grpenglayer.ParentDataSetID && Grpenglayer.TreeStatus == "GroupLayer") {
                                                    //         return el;
                                                    //     }
                                                    // });
                                                    // if (filterTemporaryTreeData.length == 1) {
                                                    //     if (filterTemporaryTreeData[0].Id == "200008") {
                                                    //         // if (TempGroupLayerCount != undefined)
                                                    //         let totalCountGrpLayer = 0;
                                                    //         TabList[t].energyLayer.forEach(x => {
                                                    //             if (x && x.ViewingCount && x.ViewingCount > 0)
                                                    //                 totalCountGrpLayer = totalCountGrpLayer + x.ViewingCount;
                                                    //         });
                                                    //         TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing " + totalCountGrpLayer + " of " + TabList[t]['totalCount'];
                                                    //         filterTemporaryTreeData[0]["activeCount"] = totalCountGrpLayer;
                                                    //     } else {
                                                    //         filterTemporaryTreeData[0]["activeCount"] = Totalcount;
                                                    //     }
                                                    // }
                                                    TemporaryTreeNodeData.forEach(function (el) {
                                                        if (el.LayerType = "GroupLayer" && el.Id == Grpenglayer.ParentDataSetID) {
                                                            // for(let ptd=0;ptd<el.children)
                                                            if (GrpTotalCount > -1)
                                                                el["activeCount"] = GrpTotalCount;
                                                            if (el.children) {
                                                                for (var std = 0; std < el.children.length; std++) {
                                                                    var element = el.children[std];
                                                                    if (Grpenglayer.DataSetID == element.Id) {
                                                                        element["activeCount"] = SingalayerCount;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        // if (el.Id == Grpenglayer.DataSetID || el.Id == Grpenglayer.ParentDataSetID) {
                                                        // if (el.Id == Grpenglayer.ParentDataSetID && el.id) {
                                                        //     return el;
                                                        // }
                                                    });
                                                }
                                                _this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
                                                // -------- For Energy Data Total count Display -------------
                                                if (_this.MapServiceService.TreeNodes.getValue()) {
                                                    if (nodeList.length > 0) {
                                                        if (filterTreeData.length == 1) {
                                                            filterTreeData[0]["activeCount"] = SingalayerCount;
                                                        }
                                                    }
                                                    _this.MapServiceService._TreeUI.getValue().treeModel.update();
                                                }
                                            }).catch(function (ex) {
                                                console.log(ex);
                                            });
                                        };
                                        var default_filter, nodeList;
                                        for (var engidex in TabList[t].energyLayer) {
                                            _loop_4(engidex);
                                        }
                                    }
                                    else {
                                        var defaultfilterlist = [];
                                        TabList[t].energyLayer.filter(function (el) {
                                            if (el.FilterValue != "" && el.FilterValue != undefined) {
                                                defaultfilterlist.push(el.FilterValue);
                                            }
                                        });
                                        var default_filter_1 = _this.MapServiceService.filterval(defaultfilterlist);
                                        var Gridfilter_1 = '';
                                        if (TabList[t].EnergylayersavegridFilter.mapfilterval) {
                                            Gridfilter_1 = _this.MapServiceService.gridfilter([TabList[t].EnergylayersavegridFilter.mapfilterval]);
                                        }
                                        if (default_filter_1 == '' && Gridfilter_1 != '') {
                                            default_filter_1 = '(' + Gridfilter_1 + ')';
                                        }
                                        else if (Gridfilter_1 != '' && default_filter_1 != '') {
                                            default_filter_1 = '(' + Gridfilter_1 + ') and (' + default_filter_1 + ')';
                                        }
                                        cql_Filter = _this.setCqlFilter(default_filter_1, true);
                                        var UserId_2 = _this.AuthServices.getLoggedinUserId();
                                        _this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '', UserId_2)
                                            .then(function (res) {
                                            var Res = res;
                                            var Activetotal = Res.totalFeatures;
                                            if (Activetotal != undefined) {
                                                if (TabList[t])
                                                    TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing " + Activetotal + " of " + TabList[t]['totalCount'];
                                            }
                                            // -------- For Private Data Total count Display -------------
                                            if (_this.MapServiceService.PrivateTreeNode.getValue()) {
                                                var privateTreeNodeData = _this.MapServiceService.PrivateTreeNode.getValue();
                                                var filterPrivateTreeData = privateTreeNodeData.filter(function (el) {
                                                    if (el.Id == TabList[t].energyLayer[0].DataSetID) {
                                                        return el;
                                                    }
                                                });
                                                if (filterPrivateTreeData.length == 1 && Activetotal != undefined) {
                                                    filterPrivateTreeData[0]["activeCount"] = Activetotal;
                                                }
                                                setTimeout(function () {
                                                    _this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
                                                }, 500);
                                            }
                                            // -------- For Shared Data Total count Display -------------
                                            if (_this.MapServiceService._SharedTreeNode.getValue()) {
                                                var sharedTreeNodeData = _this.MapServiceService._SharedTreeNode.getValue();
                                                var filterSharedTreeData = sharedTreeNodeData.filter(function (el) {
                                                    if (el.Id == TabList[t].energyLayer[0].DataSetID) {
                                                        return el;
                                                    }
                                                });
                                                if (filterSharedTreeData.length == 1 && Activetotal != undefined) {
                                                    filterSharedTreeData[0]["activeCount"] = Activetotal;
                                                }
                                                setTimeout(function () {
                                                    _this.MapServiceService._SharedTreeUI.getValue().treeModel.update();
                                                }, 500);
                                            }
                                            // -------- For Temporary Data Total count Display -------------
                                            if (_this.MapServiceService.TemporaryTreeNode.getValue()) {
                                                var temporaryTreeNodeData = _this.MapServiceService.TemporaryTreeNode.getValue();
                                                var filterTemporaryTreeData = temporaryTreeNodeData.filter(function (el) {
                                                    if (el.Id == TabList[t].energyLayer[0].DataSetID) {
                                                        return el;
                                                    }
                                                });
                                                if (filterTemporaryTreeData.length == 1 && Activetotal != undefined) {
                                                    filterTemporaryTreeData[0]["activeCount"] = Activetotal;
                                                }
                                                setTimeout(function () {
                                                    _this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
                                                }, 500);
                                            }
                                            // -------- For Energy Data Total count Display -------------
                                            if (_this.MapServiceService.TreeNodes.getValue()) {
                                                var nodeList = _this.SetTotalCountOnEnergLayertreevie();
                                                setTimeout(function () {
                                                    if (nodeList.length > 0) {
                                                        var filterTreeData = nodeList.filter(function (el) {
                                                            if (TabList[t] && el.Id == TabList[t].energyLayer[0].EnergyLayerID) {
                                                                return el;
                                                            }
                                                        });
                                                        if (filterTreeData.length == 1 && Activetotal != undefined) {
                                                            filterTreeData[0]["activeCount"] = Activetotal;
                                                        }
                                                    }
                                                    setTimeout(function () {
                                                        _this.MapServiceService._TreeUI.getValue().treeModel.update();
                                                    }, 500);
                                                }, 500);
                                            }
                                        }).catch(function (ex) {
                                            console.log(ex);
                                        });
                                    }
                                }
                                else {
                                    TabList[t]['totalCount'] = 0;
                                    TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing 0 of 0";
                                    console.log(Data);
                                }
                            }
                        }).catch(function (ex) {
                            console.log(ex);
                        });
                    }
                }, 500);
            };
            for (var t = 0; t < TabList.length; t++) {
                _loop_3(t);
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    GoogleMapPage.prototype.getTotalCount_Test = function () {
        var _this = this;
        try {
            var TabList_1 = this.MapServiceService._GridTabData.value;
            var _loop_8 = function (t) {
                if (TabList_1[t].energyLayer[0].UploadFileType && (TabList_1[t].energyLayer[0].UploadFileType != null || TabList_1[t].energyLayer[0].UploadFileType != undefined) && (TabList_1[t].energyLayer[0].UploadFileType.toLowerCase() == ".kml" || TabList_1[t].energyLayer[0].UploadFileType.toLowerCase() == ".kmz")) {
                    return "continue";
                }
                var defaultfilterlist = [];
                TabList_1[t].energyLayer.filter(function (el) {
                    if (el.FilterValue != "" && el.FilterValue != undefined) {
                        defaultfilterlist.push(el.FilterValue);
                    }
                });
                if (TabList_1[t].treestatus == "GroupLayer") {
                    var _loop_9 = function (Grpenglayer) {
                        var default_filter = "";
                        if (TabList_1[t].energyLayer.length > 0 && TabList_1[t].energyLayer[0].IsFromHomeLookup)
                            default_filter = this_3.MapServiceService.filtervalForHomeLookup(defaultfilterlist);
                        else
                            default_filter = this_3.MapServiceService.filterval(defaultfilterlist);
                        var cql_Filter = this_3.setCqlFilter(default_filter, false);
                        this_3.hidethePaceProcessbar();
                        var UserId = this_3.AuthServices.getLoggedinUserId();
                        this_3.httpService._NodegetLayerData(Grpenglayer, 0, 1, cql_Filter, '', '', UserId)
                            .then(function (data) {
                            var Data = data;
                            _this.hidethePaceProcessbar();
                            if (Data["totalFeatures"]) {
                                var total = Data.totalFeatures;
                                if (total) {
                                    if (TabList_1[t]['totalCount']) {
                                        TabList_1[t]['totalCount'] = parseInt(TabList_1[t]['totalCount']) + parseInt(total);
                                    }
                                    else {
                                        TabList_1[t]['totalCount'] = parseInt(TabList_1[t]['totalCount']) + parseInt(total);
                                    }
                                }
                                var default_filter_2 = _this.MapServiceService.filterval(defaultfilterlist);
                                var Gridfilter = _this.MapServiceService.gridfilter(_this.GridfilterList);
                                if (default_filter_2 == '' && Gridfilter != '') {
                                    default_filter_2 = '(' + Gridfilter + ')';
                                }
                                else if (Gridfilter != '' && default_filter_2 != '') {
                                    default_filter_2 = '(' + Gridfilter + ') and (' + default_filter_2 + ')';
                                }
                                cql_Filter = _this.setCqlFilter(default_filter_2, true);
                                _this.hidethePaceProcessbar();
                                var UserId_3 = _this.AuthServices.getLoggedinUserId();
                                _this.httpService._NodegetLayerData(Grpenglayer, 0, 1, cql_Filter, '', '', UserId_3)
                                    .then(function (res) {
                                    var Res = res;
                                    var Activetotal = Res.totalFeatures;
                                    TabList_1[t].Title = TabList_1[t]['DisplayName'] + " - Viewing " + Activetotal + " of " + TabList_1[t]['totalCount'];
                                    // -------- For Private Data Total count Display -------------
                                    if (_this.MapServiceService.PrivateTreeNode.getValue()) {
                                        var privateTreeNodeData = _this.MapServiceService.PrivateTreeNode.getValue();
                                        var filterPrivateTreeData = privateTreeNodeData.filter(function (el) {
                                            if (el.Id == TabList_1[t].energyLayer[0].DataSetID) {
                                                return el;
                                            }
                                        });
                                        if (filterPrivateTreeData.length == 1) {
                                            filterPrivateTreeData[0]["activeCount"] = Activetotal;
                                        }
                                    }
                                    // -------- For Temporary Data Total count Display -------------
                                    if (_this.MapServiceService.TemporaryTreeNode.getValue()) {
                                        var temporaryTreeNodeData = _this.MapServiceService.TemporaryTreeNode.getValue();
                                        var filterTemporaryTreeData = temporaryTreeNodeData.filter(function (el) {
                                            if (el.Id == TabList_1[t].energyLayer[0].DataSetID) {
                                                return el;
                                            }
                                        });
                                        if (filterTemporaryTreeData.length == 1) {
                                            filterTemporaryTreeData[0]["activeCount"] = Activetotal;
                                        }
                                    }
                                    // -------- For Energy Data Total count Display -------------
                                    var nodeList = _this.SetTotalCountOnEnergLayertreevie();
                                    setTimeout(function () {
                                        if (nodeList.length > 0) {
                                            var filterTreeData = nodeList.filter(function (el) {
                                                if (el.Id == Grpenglayer.EnergyLayerID) {
                                                    return el;
                                                }
                                            });
                                            if (filterTreeData.length == 1) {
                                                filterTreeData[0]["activeCount"] = Activetotal;
                                            }
                                        }
                                        _this.MapServiceService._TreeUI.getValue().treeModel.update();
                                    }, 500);
                                }).catch(function (ex) {
                                    console.log(ex);
                                });
                            }
                            else {
                                TabList_1[t]['totalCount'] = 0;
                                TabList_1[t].Title = TabList_1[t]['DisplayName'] + " - Viewing 0 of 0";
                            }
                        }).catch(function (ex) {
                            console.log(ex);
                        });
                    };
                    for (var _i = 0, _a = TabList_1[0].energyLayer; _i < _a.length; _i++) {
                        var Grpenglayer = _a[_i];
                        _loop_9(Grpenglayer);
                    }
                }
                else {
                    var default_filter = "";
                    if (TabList_1[t].energyLayer.length > 0 && TabList_1[t].energyLayer[0].IsFromHomeLookup)
                        default_filter = this_3.MapServiceService.filtervalForHomeLookup(defaultfilterlist);
                    else
                        default_filter = this_3.MapServiceService.filterval(defaultfilterlist);
                    var cql_Filter_1 = this_3.setCqlFilter(default_filter, false);
                    this_3.hidethePaceProcessbar();
                    var UserId = this_3.AuthServices.getLoggedinUserId();
                    this_3.httpService._NodegetLayerData(TabList_1[t].energyLayer[0], 0, 1, cql_Filter_1, '', '', UserId)
                        .then(function (data) {
                        var Data = data;
                        _this.hidethePaceProcessbar();
                        if (Data["totalFeatures"]) {
                            var total = Data.totalFeatures;
                            if (total) {
                                if (TabList_1[t]['totalCount']) {
                                    TabList_1[t]['totalCount'] = total;
                                }
                                else {
                                    TabList_1[t]['totalCount'] = total;
                                }
                            }
                            var default_filter_3 = "";
                            if (TabList_1[t].energyLayer.length > 0 && TabList_1[t].energyLayer[0].IsFromHomeLookup)
                                default_filter_3 = _this.MapServiceService.filtervalForHomeLookup(defaultfilterlist);
                            else
                                default_filter_3 = _this.MapServiceService.filterval(defaultfilterlist);
                            var Gridfilter = _this.MapServiceService.gridfilter(_this.GridfilterList);
                            if (default_filter_3 == '' && Gridfilter != '') {
                                default_filter_3 = '(' + Gridfilter + ')';
                            }
                            else if (Gridfilter != '' && default_filter_3 != '') {
                                default_filter_3 = '(' + Gridfilter + ') and (' + default_filter_3 + ')';
                            }
                            cql_Filter_1 = _this.setCqlFilter(default_filter_3, true);
                            _this.hidethePaceProcessbar();
                            var UserId_4 = _this.AuthServices.getLoggedinUserId();
                            _this.httpService._NodegetLayerData(TabList_1[t].energyLayer[0], 0, 1, cql_Filter_1, '', '', UserId_4)
                                .then(function (res) {
                                var Res = res;
                                var Activetotal = Res.totalFeatures;
                                TabList_1[t].Title = TabList_1[t]['DisplayName'] + " - Viewing " + Activetotal + " of " + TabList_1[t]['totalCount'];
                                // -------- For Private Data Total count Display -------------
                                if (_this.MapServiceService.PrivateTreeNode.getValue()) {
                                    var privateTreeNodeData = _this.MapServiceService.PrivateTreeNode.getValue();
                                    var filterPrivateTreeData = privateTreeNodeData.filter(function (el) {
                                        if (el.Id == TabList_1[t].energyLayer[0].DataSetID) {
                                            return el;
                                        }
                                    });
                                    if (filterPrivateTreeData.length == 1) {
                                        filterPrivateTreeData[0]["activeCount"] = Activetotal;
                                    }
                                }
                                // -------- For Temporary Data Total count Display -------------
                                if (_this.MapServiceService.TemporaryTreeNode.getValue()) {
                                    var temporaryTreeNodeData = _this.MapServiceService.TemporaryTreeNode.getValue();
                                    var filterTemporaryTreeData = temporaryTreeNodeData.filter(function (el) {
                                        if (el.Id == TabList_1[t].energyLayer[0].DataSetID) {
                                            return el;
                                        }
                                    });
                                    if (filterTemporaryTreeData.length == 1) {
                                        filterTemporaryTreeData[0]["activeCount"] = Activetotal;
                                    }
                                }
                                // -------- For Energy Data Total count Display -------------
                                var nodeList = _this.SetTotalCountOnEnergLayertreevie();
                                setTimeout(function () {
                                    if (nodeList.length > 0) {
                                        var filterTreeData = nodeList.filter(function (el) {
                                            if (el.Id == TabList_1[t].energyLayer[0].EnergyLayerID) {
                                                return el;
                                            }
                                        });
                                        if (filterTreeData.length == 1) {
                                            filterTreeData[0]["activeCount"] = Activetotal;
                                        }
                                    }
                                    _this.MapServiceService._TreeUI.getValue().treeModel.update();
                                }, 500);
                            }).catch(function (ex) {
                                console.log(ex);
                            });
                        }
                        else {
                            TabList_1[t]['totalCount'] = 0;
                            TabList_1[t].Title = TabList_1[t]['DisplayName'] + " - Viewing 0 of 0";
                        }
                    }).catch(function (ex) {
                        console.log(ex);
                    });
                }
            };
            var this_3 = this;
            for (var t = 0; t < TabList_1.length; t++) {
                _loop_8(t);
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    GoogleMapPage.prototype.hidethePaceProcessbar = function () {
        // $(".pace").css("display", "none");
    };
    GoogleMapPage.prototype.setCqlFilter = function (filetrval, bbox) {
        var bboxval = '';
        var returnfilterval = '';
        if (bbox == true) {
            //bboxval = 'BBOX(the_geom,' + this.GetMapBound() + ')';
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
    GoogleMapPage.prototype.GetFilterVal = function (IsFiltervalue) {
        if (IsFiltervalue === void 0) { IsFiltervalue = []; }
        var cql_Filter = "";
        var Isreturn = false;
        if (IsFiltervalue.length > 0) {
            for (var _i = 0, IsFiltervalue_5 = IsFiltervalue; _i < IsFiltervalue_5.length; _i++) {
                var f = IsFiltervalue_5[_i];
                if (f != undefined && f != null && f != '') {
                    var CQLFilter = this.MapServiceService.CreateCQL_Filter(f, 'and');
                    if (cql_Filter == "") {
                        cql_Filter = '&CQL_FILTER=(' + CQLFilter;
                    }
                    else {
                        cql_Filter += " or " + CQLFilter;
                    }
                    Isreturn = true;
                }
            }
        }
        if (Isreturn == true)
            return cql_Filter += ')';
        else
            return '';
    };
    GoogleMapPage.prototype.BindActiveGridData = function () {
        var _this = this;
        var TabList = this.MapServiceService._GridTabData.value;
        if (TabList.length == 0) {
            this.MapServiceService.GridData.getValue().length = 0;
            this.MapServiceService.GridColumns.getValue().length = 0;
            this.MapServiceService.KMLGridData.getValue().length = 0;
            this.MapServiceService.KMLGridcolumns.getValue().length = 0;
            var map = this.MapServiceService._mapdata.getValue();
            map.overlayMapTypes.clear();
        }
        var _loop_10 = function (t) {
            if (TabList[t].ActiveClass == " active") {
                //TabList[t].Title += " - Viewing  of ";     
                this_4.MapServiceService.GridData.value.length = 0;
                this_4.MapServiceService.GridColumns.value.length = 0;
                this_4.MapServiceService.KMLGridData.value.length = 0;
                this_4.MapServiceService.KMLGridcolumns.value.length = 0;
                var Gridcolumns = this_4.MapServiceService.GenerateColumns(TabList[t].energyLayer[0]);
                var default_filter_4 = this_4.MapServiceService.filterval(TabList[t].IsFiltervalue);
                var cql_Filter_2 = this_4.setCqlFilter(default_filter_4, false);
                Array.prototype.push.apply(this_4.MapServiceService.GridColumns.getValue(), Gridcolumns);
                var UserId = this_4.AuthServices.getLoggedinUserId();
                this_4.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter_2, '', '', UserId)
                    .then(function (data) {
                    if (TabList[t]) {
                        var Data = data;
                        // if (data['_body'].indexOf('totalFeatures') > 0) {
                        if (Data["totalFeatures"] && TabList[t]) {
                            var total = Data.totalFeatures;
                            _this.GridTotal = total;
                            TabList[t]['totalCount'] = total;
                            cql_Filter_2 = _this.setCqlFilter(default_filter_4, false);
                            var UserId_5 = _this.AuthServices.getLoggedinUserId();
                            _this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 100, cql_Filter_2, '', '', UserId_5)
                                .then(function (data) {
                                var Data = data;
                                var ArrayData = [];
                                if (Data.features.length > 0) {
                                    var Ldata = Data.features;
                                    for (var _i = 0, Ldata_2 = Ldata; _i < Ldata_2.length; _i++) {
                                        var d = Ldata_2[_i];
                                        ArrayData.push(d.properties);
                                    }
                                    _this.MapServiceService.ColumnsGriddata = [];
                                    Array.prototype.push.apply(_this.MapServiceService.GridData.getValue(), ArrayData);
                                    Array.prototype.push.apply(_this.MapServiceService.ColumnsGriddata, ArrayData);
                                    _this.RefreshAG_GridView();
                                }
                                ;
                                var gridTabData = _this.MapServiceService._GridTabData.getValue();
                                if (gridTabData.length == 1) {
                                    //if (gridTabData[0].treestatus != 'GroupLayer')
                                    _this.getTotalCount();
                                }
                            }).catch(function (ex) {
                                console.log(ex);
                            });
                        }
                        else {
                            _this.GridTotal = 0;
                            TabList[t]['totalCount'] = 0;
                            TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing 0 of 0";
                            _this.RefreshAG_GridView();
                        }
                    }
                });
            }
        };
        var this_4 = this;
        for (var t = 0; t < TabList.length; t++) {
            _loop_10(t);
        }
        var Acivetab = TabList.filter(function (el) {
            if (el.ActiveClass == " active") {
                return el;
            }
        });
        if (Acivetab.length == 0) {
            this.MapServiceService.GridData.getValue().length = 0;
            this.MapServiceService.GridColumns.getValue().length = 0;
        }
        this.MapServiceService.GetLegendData();
    };
    GoogleMapPage.prototype.BindPrivateLayerActiveGridData = function () {
        var _this = this;
        var TabList = this.MapServiceService._GridTabData.value;
        var array = [];
        if (TabList.length == 0) {
            this.MapServiceService.GridData.getValue().length = 0;
            this.MapServiceService.GridColumns.getValue().length = 0;
            this.MapServiceService.KMLGridData.getValue().length = 0;
            this.MapServiceService.KMLGridcolumns.getValue().length = 0;
            var map = this.MapServiceService._mapdata.getValue();
            map.overlayMapTypes.clear();
        }
        var _loop_11 = function (t) {
            if (TabList[t].ActiveClass == " active") {
                //TabList[t].Title += " - Viewing  of ";
                this_5.MapServiceService.KMLGridData.value.length = 0;
                this_5.MapServiceService.KMLGridcolumns.value.length = 0;
                this_5.MapServiceService.GridData.value.length = 0;
                this_5.MapServiceService.GridColumns.value.length = 0;
                if ((TabList[t].energyLayer[0].UploadFileType != null || TabList[t].energyLayer[0].UploadFileType != undefined) && (TabList[t].energyLayer[0].UploadFileType.toLowerCase() == ".kml" || TabList[t].energyLayer[0].UploadFileType.toLowerCase() == ".kmz")) {
                    if (this_5.MapServiceService.KmlLayersData.getValue()) {
                        setTimeout(function () {
                            var existingklayer = _this.MapServiceService.kmlLayersData.getValue();
                            var selectedKmlLayer = existingklayer.filter(function (el) {
                                if (el.LayerID == parseInt(TabList[t].energyLayer[0].DataSetID)) {
                                    return el;
                                }
                            });
                            if (selectedKmlLayer.length == 1) {
                                var result = selectedKmlLayer[0].LayerData;
                                var total = result.KMLGeometryList.length;
                                _this.GridTotal = total;
                                TabList[t].totalCount = total;
                                if (result.KMLGeometryList[0].hasOwnProperty('Name')) {
                                    var KMLGridcolumns = _this.MapServiceService.GenerateColumnsForKml(["Name"]);
                                    Array.prototype.push.apply(_this.MapServiceService.KMLGridcolumns.getValue(), KMLGridcolumns);
                                    var ArrayData = [""];
                                    // let nameData = result.KMLGeometryList.map(a => a.Name);
                                    // for (let d of nameData) {
                                    //     ArrayData.push({ Name: d });
                                    // }
                                    //this.MapServiceService.ColumnsGriddata = [];
                                    Array.prototype.push.apply(_this.MapServiceService.KMLGridData.getValue(), ArrayData);
                                    //Array.prototype.push.apply(this.MapServiceService.ColumnsGriddata, ArrayData);
                                }
                            }
                        }, 2000);
                    }
                }
                else {
                    var Gridcolumns = this_5.MapServiceService.GenerateColumns(TabList[t].energyLayer[0]);
                    //let cql_Filter = this.GetFilterVal(TabList[t].IsFiltervalue);
                    var default_filter_5 = this_5.MapServiceService.filterval(TabList[t].IsFiltervalue);
                    var cql_Filter_3 = this_5.setCqlFilter(default_filter_5, false);
                    Array.prototype.push.apply(this_5.MapServiceService.GridColumns.getValue(), Gridcolumns);
                    //this.MapServiceService.GetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '')
                    var UserId = this_5.AuthServices.getLoggedinUserId();
                    this_5.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter_3, '', '', UserId)
                        .then(function (data) {
                        if (TabList[t]) {
                            var Data = data;
                            // if (data['_body'].indexOf('totalFeatures') > 0) {
                            if (Data["totalFeatures"]) {
                                var total = Data.totalFeatures;
                                _this.GridTotal = total;
                                TabList[t]['totalCount'] = total;
                                cql_Filter_3 = _this.setCqlFilter(default_filter_5, false);
                                var UserId_6 = _this.AuthServices.getLoggedinUserId();
                                //  this.MapServiceService.GetLayerData(TabList[t].energyLayer[0], 0, 3000, cql_Filter, '', '')
                                _this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 100, cql_Filter_3, '', '', UserId_6)
                                    .then(function (data) {
                                    var Data = data;
                                    var ArrayData = [];
                                    if (Data.features.length > 0) {
                                        var Ldata = Data.features;
                                        for (var _i = 0, Ldata_3 = Ldata; _i < Ldata_3.length; _i++) {
                                            var d = Ldata_3[_i];
                                            ArrayData.push(d.properties);
                                        }
                                        _this.MapServiceService.ColumnsGriddata = [];
                                        Array.prototype.push.apply(_this.MapServiceService.GridData.getValue(), ArrayData);
                                        Array.prototype.push.apply(_this.MapServiceService.ColumnsGriddata, ArrayData);
                                    }
                                    ;
                                    if (_this.MapServiceService._GridTabData.getValue().length == 1) {
                                        _this.getTotalCount();
                                    }
                                }).catch(function (ex) {
                                    console.log(ex);
                                });
                            }
                            else {
                                _this.GridTotal = 0;
                                TabList[t]['totalCount'] = 0;
                                TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing 0 of 0";
                                //this.MapServiceService.GetLegendData();
                                if (TabList[t].treestatus == "GroupLayer")
                                    _this.getTotalCount();
                            }
                        }
                    });
                }
            }
        };
        var this_5 = this;
        for (var t = 0; t < TabList.length; t++) {
            _loop_11(t);
        }
        var Acivetab = TabList.filter(function (el) {
            if (el.ActiveClass == " active") {
                return el;
            }
        });
        if (Acivetab.length == 0) {
            this.MapServiceService.GridData.getValue().length = 0;
            this.MapServiceService.GridColumns.getValue().length = 0;
        }
        this.MapServiceService.GetLegendData();
    };
    GoogleMapPage.prototype.BindTemporaryLayerActiveGridData = function () {
        var _this = this;
        var TabList = this.MapServiceService._GridTabData.value;
        var array = [];
        if (TabList.length == 0) {
            this.MapServiceService.GridData.getValue().length = 0;
            this.MapServiceService.GridColumns.getValue().length = 0;
            this.MapServiceService.KMLGridData.getValue().length = 0;
            this.MapServiceService.KMLGridcolumns.getValue().length = 0;
            var map = this.MapServiceService._mapdata.getValue();
            map.overlayMapTypes.clear();
        }
        var _loop_12 = function (t) {
            if (TabList[t].ActiveClass == " active") {
                //TabList[t].Title += " - Viewing  of ";     
                this_6.MapServiceService.GridData.value.length = 0;
                this_6.MapServiceService.GridColumns.value.length = 0;
                this_6.MapServiceService.KMLGridData.value.length = 0;
                this_6.MapServiceService.KMLGridcolumns.value.length = 0;
                var Gridcolumns = this_6.MapServiceService.GenerateColumns(TabList[t].energyLayer[0]);
                //let cql_Filter = this.GetFilterVal(TabList[t].IsFiltervalue);
                var default_filter_6 = this_6.MapServiceService.filterval(TabList[t].IsFiltervalue);
                var cql_Filter_4 = this_6.setCqlFilter(default_filter_6, false);
                Array.prototype.push.apply(this_6.MapServiceService.GridColumns.getValue(), Gridcolumns);
                // this.MapServiceService.testGetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '').subscribe(data => {  }, error => {
                //     
                // })               
                //this.MapServiceService.GetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '')
                var UserId = this_6.AuthServices.getLoggedinUserId();
                this_6.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter_4, '', '', UserId)
                    .then(function (data) {
                    if (TabList[t]) {
                        var Data = data;
                        if (Data["totalFeatures"]) {
                            // if (data['_body'].indexOf('totalFeatures') > 0) {
                            var total = Data.totalFeatures;
                            _this.GridTotal = total;
                            TabList[t]['totalCount'] = total;
                            cql_Filter_4 = _this.setCqlFilter(default_filter_6, false);
                            //this.MapServiceService.GetLayerData(TabList[t].energyLayer[0], 0, 3000, cql_Filter, '', '')
                            var UserId_7 = _this.AuthServices.getLoggedinUserId();
                            _this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter_4, '', '', UserId_7)
                                .then(function (data) {
                                var Data = data;
                                var ArrayData = [];
                                if (Data.features.length > 0) {
                                    var Ldata = Data.features;
                                    for (var _i = 0, Ldata_4 = Ldata; _i < Ldata_4.length; _i++) {
                                        var d = Ldata_4[_i];
                                        ArrayData.push(d.properties);
                                    }
                                    _this.MapServiceService.ColumnsGriddata = [];
                                    Array.prototype.push.apply(_this.MapServiceService.GridData.getValue(), ArrayData);
                                    Array.prototype.push.apply(_this.MapServiceService.ColumnsGriddata, ArrayData);
                                    _this.RefreshAG_GridView();
                                }
                                ;
                                if (_this.MapServiceService._GridTabData.getValue().length == 1) {
                                    _this.getTotalCount();
                                }
                            }).catch(function (ex) {
                                console.log(ex);
                            });
                        }
                        else {
                            _this.GridTotal = 0;
                            TabList[t]['totalCount'] = 0;
                            TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing 0 of 0";
                            if (TabList[t].parentID == "200008")
                                _this.getTotalCount();
                            _this.RefreshAG_GridView();
                        }
                    }
                });
            }
        };
        var this_6 = this;
        for (var t = 0; t < TabList.length; t++) {
            _loop_12(t);
        }
        var Acivetab = TabList.filter(function (el) {
            if (el.ActiveClass == " active") {
                return el;
            }
        });
        if (Acivetab.length == 0) {
            this.MapServiceService.GridData.getValue().length = 0;
            this.MapServiceService.GridColumns.getValue().length = 0;
        }
        this.MapServiceService.GetLegendData();
    };
    GoogleMapPage.prototype.serverLayrefilter = function (IsFiltervalue) {
        var sld_filter = '';
        if (IsFiltervalue.length > 0) {
            for (var _i = 0, IsFiltervalue_6 = IsFiltervalue; _i < IsFiltervalue_6.length; _i++) {
                var f = IsFiltervalue_6[_i];
                if (f != undefined && f != null && f != '') {
                    // if (f.indexOf(";") !== -1) {
                    //     let Filter = f.split(';');
                    //     for (let i = 0; i < Filter.length; i++) {
                    //         sld_filter += this.MapLayerService.SingleFilterLoop(Filter[i]);
                    //     }
                    // }
                    // if (f.indexOf("#OR#") !== -1) {
                    //     let Filter = f.split('#OR#');
                    //     for (let i = 0; i < Filter.length; i++) {
                    //         sld_filter += this.MapLayerService.SingleFilterLoop(Filter[i]);
                    //     }
                    // }
                    if (f.indexOf(";") == -1 && f.indexOf("#OR#") == -1) {
                        //sld_filter += '<Filter xmlns="http://www.opengis.net/ogc">'
                        sld_filter += '<And>';
                        sld_filter += this.MapLayerService.SingleFilterLoop(f);
                        sld_filter += '</And>';
                        //    sld_filter += '</Filter>'
                    }
                }
            }
        }
        if (sld_filter != '') {
            return sld_filter;
        }
        else
            return '';
    };
    // serversidefilter(filterval, filterModel, k, sld_filter, multipleFilter, IsFiltervalue) {
    //     filterval = '';
    //     let type = ''
    //     if (multipleFilter == true) {
    //         type = filterModel.type;
    //         filterval = filterModel.filter.toString();
    //     }
    //     else {
    //         type = filterModel[k].type;
    //         filterval = filterModel[k].filter.toString();
    //     }
    //     if (type == "equals") {
    //         filterval = k + '=' + filterval;
    //     }
    //     else if (type == "notEqual") {
    //         filterval = k + '#NotEqualTo#' + filterval;
    //     }
    //     else if (type == "contains") {
    //         filterval = k + '#LIKE#' + filterval
    //     }
    //     else if (type == "lessThan") {
    //         filterval = k + '<' + filterval
    //     }
    //     else if (type == "lessThanOrEqual") {
    //         filterval = k + '<=' + filterval
    //     }
    //     else if (type == "greaterThan") {
    //         filterval = k + '>' + filterval;
    //     }
    //     else if (type == "greaterThanOrEqual") {
    //         filterval = k + '>=' + filterval;
    //     }
    //     if (filterval != '') {
    //         sld_filter += this.MapLayerService.SingleFilterLoop(filterval);
    //     }
    //     return sld_filter;
    // }
    GoogleMapPage.prototype.indivisualserversidecql_filter = function (filterModel, k, sld_filter) {
        var filterval = '';
        var cql_Filter = '';
        var bbox = this.UtilityService.getgooleMapBbox(this.MapServiceService._mapdata.getValue());
        for (var _i = 0, _a = filterModel[k].values; _i < _a.length; _i++) {
            var v = _a[_i];
            if (v == null) {
                v = ' ';
            }
            filterval = k + '=' + v;
            this.mapfilterval += ';' + filterval;
            var CQLFilter = this.MapServiceService.CreateCQL_Filter(filterval, 'and');
            if (cql_Filter == "") {
                cql_Filter = '&CQL_FILTER=(bbox(the_geom,' + bbox + ') and  ' + CQLFilter;
                // cql_Filter = '&filter=' + CQLFilter;
            }
            else {
                cql_Filter += " or " + CQLFilter;
            }
            //sld_filter += this.MapLayerService.SingleFilterLoop(filterval);
        }
        return sld_filter;
    };
    GoogleMapPage.prototype.indivisualserversidefilter = function (filterModel, k, sld_filter) {
        var filterval = '';
        for (var _i = 0, _a = filterModel[k].values; _i < _a.length; _i++) {
            var v = _a[_i];
            if (v == null) {
                v = ' ';
            }
            filterval = k + '=' + v;
            this.mapfilterval += ';' + filterval;
            // sld_filter += this.MapServiceService.CreateCQL_Filter(filterval);
            sld_filter += this.MapLayerService.SingleFilterLoop(filterval);
        }
        return sld_filter;
    };
    // onGridReady(params) {
    //     try {
    //         this.hidethePaceProcessbar();
    //         let TabList = this.MapServiceService._GridTabData.value;
    //         for (let t = 0; t < TabList.length; t++) {
    //             if (TabList[t].ActiveClass == " active") {
    //                 this.gridApi = params.api;
    //                 this.gridColumnApi = params.columnApi;
    //                 this.MapServiceService.setGridapi(params);
    //                 //let cql_Filter = this.GetFilterVal(TabList[t].IsFiltervalue);
    //                 let default_filter = this.MapServiceService.filterval(TabList[t].IsFiltervalue);
    //                 let cql_Filter = this.setCqlFilter(default_filter, true);
    //                 this.hidethePaceProcessbar();
    //                 this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '')
    //                     //this.MapServiceService.GetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '')
    //                     .subscribe(data => {
    //                         let Data: any = data;
    //                         let total = Data.totalFeatures;
    //                         let Viewing = " - Viewing " + total + " of " + TabList[t]['totalCount'];
    //                         TabList[t].Title = TabList[t]['DisplayName'] + Viewing;
    //                         // let Ldata = data.json().features;
    //                         // let ArrayData = [];
    //                         // for (let d of Ldata) {
    //                         //     ArrayData.push(d.properties);
    //                         // }
    //                         var dataSource = {
    //                             rowCount: null,
    //                             getRows: (params) => {
    //                                 let default_filter = this.MapServiceService.filterval(TabList[t].IsFiltervalue);
    //                                 let cql_Filter = this.setCqlFilter(default_filter, true);
    //                                 let sortby = 'gid a';
    //                                 let isclear = false;
    //                                 let filterModel = params.filterModel
    //                                 let keys = Object.keys(filterModel);
    //                                 this.GridfilterList = [];
    //                                 let filterParam = '';
    //                                 this.mapfilterval = '';
    //                                 if (Object.keys(params.filterModel).length == 1) {
    //                                     this.unchckedAllfilterop();
    //                                 }
    //                                 if (Object.keys(params.filterModel).length == 0) {
    //                                     this.unchckedAllfilterop();
    //                                     this.getTotalCount();
    //                                     if (this.MapServiceService._columnfiltervalStatus == "Clear All Filter") {
    //                                         this.addandremovefilterLayeronMap(TabList[t]);
    //                                         // for (let s of TabList[t].energyLayer) {
    //                                         //     for (let c of TabList[t].ListOfChildID) {
    //                                         //         if (((s.EnergyParentID == parseInt(TabList[t].parentID)) && (s.EnergyLayerID == parseInt(c)))) {
    //                                         //             this.removemapLayer(s);
    //                                         //             s["serversidefilterval"] = '';
    //                                         //         }
    //                                         //     }
    //                                         // }
    //                                         // for (let s of TabList[t].energyLayer) {
    //                                         //     for (let c of TabList[t].ListOfChildID) {
    //                                         //         if (((s.EnergyParentID == parseInt(TabList[t].parentID)) && (s.EnergyLayerID == parseInt(c)))) {
    //                                         //             s["serversidefilterval"] = this.GridfilterList;
    //                                         //             this.loadmapLayers(s);
    //                                         //         }
    //                                         //     }
    //                                         // }
    //                                     }
    //                                 }
    //                                 if (Object.keys(params.filterModel).length > 0) {
    //                                     if (document.getElementById("clearButton") != null) {
    //                                         $('#clearButton').removeAttr('disabled');
    //                                         document.getElementById("clearButton").addEventListener("click", (event) => {
    //                                             if (isclear == false) {
    //                                                 isclear = true;
    //                                                 this.MapServiceService.GridData.getValue().length = 0
    //                                                 // let cql_Filter = this.GetFilterVal(TabList[t].IsFiltervalue);
    //                                                 let default_filter = this.MapServiceService.filterval(TabList[t].IsFiltervalue);
    //                                                 let cql_Filter = this.setCqlFilter(default_filter, false);
    //                                                 //this.MapServiceService.GetLayerData(TabList[t].energyLayer[0], 0, 500, cql_Filter, '', '')
    //                                                 this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 500, cql_Filter, '', '')
    //                                                     .subscribe(data => {
    //                                                         let ArrayData: any = []
    //                                                         let Data: any = data;
    //                                                         if (data["features"]) {
    //                                                             if (data["features"].length > 0) {
    //                                                                 let Ldata = Data.features;
    //                                                                 for (let d of Ldata) {
    //                                                                     ArrayData.push(d.properties)
    //                                                                 }
    //                                                                 Array.prototype.push.apply(this.MapServiceService.GridData.getValue(), ArrayData);
    //                                                             }
    //                                                         }
    //                                                     });
    //                                                 for (let s of TabList[t].energyLayer) {
    //                                                     if (((s.EnergyParentID == parseInt(TabList[t].parentID)) && (s.EnergyLayerID == parseInt(TabList[t].ID)))) {
    //                                                         this.MapLayerService.removemapLayer(s);
    //                                                         this.mapfilterval = '';
    //                                                         s["serversidefilterval"] = ''
    //                                                     }
    //                                                 }
    //                                                 for (let s of TabList[t].energyLayer) {
    //                                                     if (((s.EnergyParentID == parseInt(TabList[t].parentID)) && (s.EnergyLayerID == parseInt(TabList[t].ID)))) {
    //                                                         this.MapLayerService.loadmapLayers(s);
    //                                                     }
    //                                                 }
    //                                                 this.MapServiceService.ClearColumncheckvalue();
    //                                             }
    //                                         });
    //                                     }
    //                                     let isfilter = false;
    //                                     for (let k of keys) {
    //                                         let filterval = '';
    //                                         if (filterModel[k].values) {
    //                                             if (filterModel[k].values.length > 0) {
    //                                                 isfilter = true;
    //                                                 for (let v of filterModel[k].values) {
    //                                                     if (v == null) {
    //                                                         v = ' ';
    //                                                     }
    //                                                     if (filterval == '')
    //                                                         filterval = k + "=" + v;
    //                                                     else
    //                                                         filterval += ';' + k + "=" + v;
    //                                                 }
    //                                                 if (this.mapfilterval == "") {
    //                                                     this.mapfilterval += filterval;
    //                                                 }
    //                                                 else {
    //                                                     this.mapfilterval = this.mapfilterval + ';' + filterval;
    //                                                 }
    //                                                 this.GridfilterList.push(filterval);
    //                                                 // filterParam += this.indivisualserversidefilter(filterModel, k, '');
    //                                             }
    //                                             else if ($("#ag-mini-filter > :input").val()) {
    //                                                 filterval = k + '#LIKE#' + encodeURIComponent($("#ag-mini-filter > :input").val());
    //                                                 this.GridfilterList.push(filterval);
    //                                                 this.mapfilterval += ';' + filterval;
    //                                                 // filterval = k + '=' + encodeURIComponent($("#ag-mini-filter > :input").val());
    //                                                 filterParam += this.MapLayerService.SingleFilterLoop(filterval);
    //                                             }
    //                                         }
    //                                         if (!filterModel[k].values) {
    //                                             if (filterModel[k].filter) {
    //                                                 filterval = filterModel[k].filter.toString().toLocaleLowerCase();
    //                                                 filterParam += this.serversidefilter(filterval, filterModel, k, '', false, TabList[t].IsFiltervalue);
    //                                             }
    //                                             else {
    //                                                 for (let c = 1; c <= 2; c++) {
    //                                                     if (c == 1) {
    //                                                         filterval = filterModel[k].condition1.filter.toString().toLocaleLowerCase();
    //                                                         filterParam += this.serversidefilter(filterval, filterModel[k].condition1, k, '', true, TabList[t].IsFiltervalue);
    //                                                     }
    //                                                     else {
    //                                                         filterval = filterModel[k].condition2.filter.toString().toLocaleLowerCase();
    //                                                         filterParam += this.serversidefilter(filterval, filterModel[k].condition2, k, '', true, TabList[t].IsFiltervalue);
    //                                                     }
    //                                                 }
    //                                             }
    //                                         }
    //                                     }
    //                                     default_filter = this.MapServiceService.filterval(TabList[t].IsFiltervalue);
    //                                     let Gridfilter = this.MapServiceService.gridfilter(this.GridfilterList);
    //                                     if (default_filter == '' && Gridfilter != '') {
    //                                         default_filter = '(' + Gridfilter + ')';
    //                                     }
    //                                     else if (Gridfilter != '' && default_filter != '') {
    //                                         default_filter = '(' + Gridfilter + ') and (' + default_filter + ')';
    //                                     }
    //                                     cql_Filter = this.setCqlFilter(default_filter, true);
    //                                     // cql_Filter = this.serverLayrefilter(TabList[t].IsFiltervalue);
    //                                     // let sld_filter = '';
    //                                     // //let sld_filter = '<Filter xmlns="http://www.opengis.net/ogc">' + cql_Filter + '<And>' + filterParam + '</And></Filter>';
    //                                     // if ((cql_Filter != '') || (filterParam != '')) {
    //                                     //     sld_filter = '<Filter xmlns="http://www.opengis.net/ogc">' + cql_Filter + '<Or>' + filterParam + '</Or></Filter>';
    //                                     // }
    //                                     // if (sld_filter != '') {
    //                                     //     cql_Filter = '&filter=' + sld_filter;
    //                                     // }
    //                                     if (isfilter == true) {
    //                                         setTimeout(() => {
    //                                             this.addandremovefilterLayeronMap(TabList[t]);
    //                                             // for (let s of TabList[t].energyLayer) {
    //                                             //     for (let c of TabList[t].ListOfChildID) {
    //                                             //         if (((s.EnergyParentID == parseInt(TabList[t].parentID)) && (s.EnergyLayerID == parseInt(c)))) {
    //                                             //             this.removemapLayer(s);
    //                                             //             s["serversidefilterval"] = '';
    //                                             //         }
    //                                             //     }
    //                                             // }
    //                                             // for (let s of TabList[t].energyLayer) {
    //                                             //     for (let c of TabList[t].ListOfChildID) {
    //                                             //         if (((s.EnergyParentID == parseInt(TabList[t].parentID)) && (s.EnergyLayerID == parseInt(c)))) {
    //                                             //             s["serversidefilterval"] = this.GridfilterList;
    //                                             //             this.loadmapLayers(s);
    //                                             //         }
    //                                             //     }
    //                                             // }
    //                                         }, 500);
    //                                     }
    //                                     else {
    //                                         this.addandremovefilterLayeronMap(TabList[t]);
    //                                         // for (let s of TabList[t].energyLayer) {
    //                                         //     for (let c of TabList[t].ListOfChildID) {
    //                                         //         if (((s.EnergyParentID == parseInt(TabList[t].parentID)) && (s.EnergyLayerID == parseInt(c)))) {
    //                                         //             this.removemapLayer(s);
    //                                         //             s["serversidefilterval"] = '';
    //                                         //         }
    //                                         //     }
    //                                         // }
    //                                         // for (let s of TabList[t].energyLayer) {
    //                                         //     for (let c of TabList[t].ListOfChildID) {
    //                                         //         if (((s.EnergyParentID == parseInt(TabList[t].parentID)) && (s.EnergyLayerID == parseInt(c)))) {
    //                                         //             s["serversidefilterval"] = this.GridfilterList;
    //                                         //             this.loadmapLayers(s);
    //                                         //         }
    //                                         //     }
    //                                         // }
    //                                     }
    //                                     this.getTotalCount();
    //                                 }
    //                                 if (params.sortModel.length > 0) {
    //                                     sortby = params.sortModel[0].colId;
    //                                     if (params.sortModel[0].sort == "asc") {
    //                                         sortby += ' a'
    //                                     }
    //                                     else {
    //                                         sortby += ' d';
    //                                     }
    //                                 }
    //                                 //  if (params.startRow > 0) { 
    //                                 this.hidethePaceProcessbar();
    //                                 //this.MapServiceService.GetLayerData(TabList[t].energyLayer[0], params.startRow, params.endRow, cql_Filter, sortby, '')
    //                                 this.httpService._NodegetLayerData(TabList[t].energyLayer[0], params.startRow, params.endRow, cql_Filter, sortby, '')
    //                                     .subscribe(data => {
    //                                         let Data: any = data;
    //                                         total = Data.totalFeatures;
    //                                         if (this.mapfilterval != '') {
    //                                             let Viewing = " - Viewing " + total + " of " + TabList[t]['totalCount'];
    //                                             TabList[t].Title = TabList[t]['DisplayName'] + Viewing;
    //                                         }
    //                                         let Ldata1 = Data.features;
    //                                         let ArrayData1 = [];
    //                                         for (let d of Ldata1) {
    //                                             ArrayData1.push(d.properties)
    //                                         }
    //                                         //var rowsThisPage = data1.slice(params.startRow, params.endRow);
    //                                         // if (params.sortModel.length > 0) {
    //                                         //     dataAfterSortingAndFiltering = this.sortAndFilter(ArrayData, params.sortModel, params.filterModel);
    //                                         //     ArrayData1 = dataAfterSortingAndFiltering;
    //                                         // }
    //                                         // if (params.sortModel.length > 0 || Object.keys(params.filterModel).length > 0) {
    //                                         //     if (params.sortModel.length > 0) {
    //                                         //         sortby = params.sortModel[0].colId;
    //                                         //         if (params.sortModel[0].sort == "asc") {
    //                                         //             sortby += ' a'
    //                                         //         }
    //                                         //         else {
    //                                         //             sortby += ' d';
    //                                         //         }
    //                                         //     }
    //                                         //     // if (Object.keys(params.filterModel).length > 0) {
    //                                         //     //     total = data.json().totalFeatures;
    //                                         //     // }
    //                                         //     // dataAfterSortingAndFiltering = this.sortAndFilter(ArrayData1, params.sortModel, params.filterModel);
    //                                         //     // ArrayData1 = dataAfterSortingAndFiltering;
    //                                         //     // if (total <= ArrayData1.length) {
    //                                         //     //     total = ArrayData1.length;
    //                                         //     // }
    //                                         // }
    //                                         var rowsThisPage = ArrayData1
    //                                         var lastRow = -1;
    //                                         if (total <= params.endRow) {
    //                                             lastRow = total;
    //                                         }
    //                                         params.successCallback(rowsThisPage, lastRow);
    //                                         this.setgridhight();
    //                                         //this.MapServiceService.Gridcolumncheckboxevent();                                            
    //                                         setInterval(() => {
    //                                             this.unchckedAllfilterop();
    //                                             this.MapServiceService.Gridcolumncheckboxevent();
    //                                         }, 3000);
    //                                         // if ($('.ag-header-cell-menu-button')[0]) {
    //                                         //     $('.ag-header-cell-menu-button').click((e) => {                                        //         
    //                                         //         this.MapServiceService.Gridcolumncheckboxevent();
    //                                         //     });
    //                                         // }
    //                                         // if (Object.keys(params.filterModel).length == 0) {
    //                                         //     if ($('#selectAll')[0]) {
    //                                         //         if ($('#selectAll').html().indexOf('ag-icon-checkbox-checked') >= 0) {
    //                                         //             $('#selectAll').attr('checked', false).trigger('click');
    //                                         //         }
    //                                         //     }
    //                                         // }                                        
    //                                     });
    //                                 //}, 500);
    //                                 // }
    //                                 // else {
    //                                 //     params.successCallback(ArrayData, total);
    //                                 // }
    //                             }
    //                         };
    //                         params.api.setDatasource(dataSource);
    //                     });
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    // OnKMLGridReady(params) {
    //     try {
    //         this.hidethePaceProcessbar();
    //         let TabList = this.MapServiceService._GridTabData.value;
    //         for (let t = 0; t < TabList.length; t++) {
    //             if (TabList[t].ActiveClass == " active") {
    //                 this.kmlGridApi = params.api;
    //                 this.kmlGridColumnApi = params.columnApi;
    //                 this.MapServiceService.setKMLGridapi(params);
    //                 this.hidethePaceProcessbar();
    //                 let Viewing = " - Viewing " + TabList[t]['totalCount'] + " of " + TabList[t]['totalCount'];
    //                 TabList[t].Title = TabList[t]['DisplayName'] + Viewing;
    //                 //this.MapServiceService.GetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '')
    //                 //    .subscribe(data => {
    //                 //let total = data.json().totalFeatures;
    //                 //let Viewing = " - Viewing " + total + " of " + TabList[t]['totalCount'];
    //                 //TabList[t].Title = TabList[t]['DisplayName'] + Viewing;
    //                 var dataSource = {
    //                     rowCount: null,
    //                     getRows: (params) => {
    //                         let sortby = 'gid a';
    //                         let isclear = false;
    //                         let filterModel = params.filterModel
    //                         let keys = Object.keys(filterModel);
    //                         this.GridfilterList = [];
    //                         let filterParam = '';
    //                         this.mapfilterval = '';
    //                         if (Object.keys(params.filterModel).length == 1) {
    //                             this.unchckedAllfilterop();
    //                         }
    //                         if (Object.keys(params.filterModel).length == 0) {
    //                             this.unchckedAllfilterop();
    //                             //this.getTotalCount();
    //                             if (this.MapServiceService._columnfiltervalStatus == "Clear All Filter") {
    //                                 this.AddAndRemoveFilterLayeronMapForKML(TabList[t]);
    //                             }
    //                         }
    //                         if (Object.keys(params.filterModel).length > 0) {
    //                             if (document.getElementById("clearButton") != null) {
    //                                 $('#clearButton').removeAttr('disabled');
    //                                 document.getElementById("clearButton").addEventListener("click", (event) => {
    //                                     if (isclear == false) {
    //                                         isclear = true;
    //                                         this.MapServiceService.KMLGridData.getValue().length = 0;
    //                                         setTimeout(() => {
    //                                             let existingklayer = this.MapServiceService.kmlLayersData.getValue();
    //                                             let selectedKmlLayer = existingklayer.filter((el) => {
    //                                                 if (el.LayerID == parseInt(TabList[t].energyLayer[0].DataSetID)) {
    //                                                     return el;
    //                                                 }
    //                                             });
    //                                             if (selectedKmlLayer.length == 1) {
    //                                                 let result = selectedKmlLayer[0].LayerData;
    //                                                 if (result.KMLGeometryList[0].hasOwnProperty('Name')) {
    //                                                     let ArrayData: any = [""];
    //                                                     let nameData = result.KMLGeometryList.map(a => a.Name);
    //                                                     for (let d of nameData) {
    //                                                         ArrayData.push({ Name: d });
    //                                                     }
    //                                                     Array.prototype.push.apply(this.MapServiceService.KMLGridData.getValue(), ArrayData);
    //                                                 }
    //                                             }
    //                                         }, 2000);
    //                                         for (let s of TabList[t].energyLayer) {
    //                                             if (((s.EnergyParentID == parseInt(TabList[t].parentID)) && (s.EnergyLayerID == parseInt(TabList[t].ID)))) {
    //                                                 this.PrivateMapLayerService.RemoveKmlLayer(s);
    //                                                 this.mapfilterval = '';
    //                                                 s["serversidefilterval"] = ''
    //                                             }
    //                                         }
    //                                         for (let s of TabList[t].energyLayer) {
    //                                             if (((s.EnergyParentID == parseInt(TabList[t].parentID)) && (s.EnergyLayerID == parseInt(TabList[t].ID)))) {
    //                                                 this.LoadPrivateKmlLayers(s);
    //                                             }
    //                                         }
    //                                         this.MapServiceService.ClearColumncheckvalue();
    //                                     }
    //                                 });
    //                             }
    //                             let isfilter = false;
    //                             for (let k of keys) {
    //                                 let filterval = '';
    //                                 if (filterModel[k].values) {
    //                                     if (filterModel[k].values.length > 0) {
    //                                         isfilter = true;
    //                                         for (let v of filterModel[k].values) {
    //                                             if (v == null) {
    //                                                 v = ' ';
    //                                             }
    //                                             if (filterval == '')
    //                                                 filterval = k + "=" + v;
    //                                             else
    //                                                 filterval += ';' + k + "=" + v;
    //                                         }
    //                                         if (this.mapfilterval == "") {
    //                                             this.mapfilterval += filterval;
    //                                         }
    //                                         else {
    //                                             this.mapfilterval = this.mapfilterval + ';' + filterval;
    //                                         }
    //                                         this.GridfilterList.push(filterval);
    //                                     }
    //                                     else if ($("#ag-mini-filter > :input").val()) {
    //                                         filterval = k + '#LIKE#' + encodeURIComponent($("#ag-mini-filter > :input").val());
    //                                         this.GridfilterList.push(filterval);
    //                                         this.mapfilterval += ';' + filterval;
    //                                         filterParam += this.MapLayerService.SingleFilterLoop(filterval);
    //                                     }
    //                                 }
    //                                 if (!filterModel[k].values) {
    //                                     if (filterModel[k].filter) {
    //                                         filterval = filterModel[k].filter.toString().toLocaleLowerCase();
    //                                         filterParam += this.serversidefilter(filterval, filterModel, k, '', false, TabList[t].IsFiltervalue);
    //                                     }
    //                                     else {
    //                                         for (let c = 1; c <= 2; c++) {
    //                                             if (c == 1) {
    //                                                 filterval = filterModel[k].condition1.filter.toString().toLocaleLowerCase();
    //                                                 filterParam += this.serversidefilter(filterval, filterModel[k].condition1, k, '', true, TabList[t].IsFiltervalue);
    //                                             }
    //                                             else {
    //                                                 filterval = filterModel[k].condition2.filter.toString().toLocaleLowerCase();
    //                                                 filterParam += this.serversidefilter(filterval, filterModel[k].condition2, k, '', true, TabList[t].IsFiltervalue);
    //                                             }
    //                                         }
    //                                     }
    //                                 }
    //                             }
    //                             let Gridfilter = this.MapServiceService.gridfilter(this.GridfilterList);
    //                             if (isfilter == true) {
    //                                 setTimeout(() => {
    //                                     this.AddAndRemoveFilterLayeronMapForKML(TabList[t]);
    //                                 }, 500);
    //                             }
    //                             else {
    //                                 this.AddAndRemoveFilterLayeronMapForKML(TabList[t]);
    //                             }
    //                             //this.getTotalCount();
    //                             //}
    //                             // if (params.sortModel.length > 0) {
    //                             //     sortby = params.sortModel[0].colId;
    //                             //     if (params.sortModel[0].sort == "asc") {
    //                             //         sortby += ' a'
    //                             //     }
    //                             //     else {
    //                             //         sortby += ' d';
    //                             //     }
    //                         }
    //                         this.hidethePaceProcessbar();
    //                         setTimeout(() => {
    //                             let existingklayer = this.MapServiceService.kmlLayersData.getValue();
    //                             let selectedKmlLayer = existingklayer.filter((el) => {
    //                                 if (el.LayerID == parseInt(TabList[t].energyLayer[0].DataSetID)) {
    //                                     return el;
    //                                 }
    //                             });
    //                             if (selectedKmlLayer.length == 1) {
    //                                 let result = selectedKmlLayer[0].LayerData;
    //                                 let total = result.KMLGeometryList.length;
    //                                 if (result.KMLGeometryList[0].hasOwnProperty('Name')) {
    //                                     let ArrayData1: any = [];
    //                                     let Ldata1 = result.KMLGeometryList.map(a => a.Name);
    //                                     if (this.mapfilterval != '') {
    //                                         let Viewing = " - Viewing " + total + " of " + TabList[t]['totalCount'];
    //                                         TabList[t].Title = TabList[t]['DisplayName'] + Viewing;
    //                                     }
    //                                     if (Object.keys(params.filterModel).length > 0) {
    //                                         let data = Ldata1;
    //                                         ArrayData1 = [];
    //                                         for (let i = 0; i < data.length; i++) {
    //                                             if (filterModel[keys[0]].values.indexOf(data[i]) > -1)
    //                                                 ArrayData1.push(data[i]);
    //                                         }
    //                                         total = ArrayData1.length;
    //                                         if (this.mapfilterval != '') {
    //                                             let Viewing = " - Viewing " + total + " of " + TabList[t]['totalCount'];
    //                                             TabList[t].Title = TabList[t]['DisplayName'] + Viewing;
    //                                         }
    //                                         data = ArrayData1;
    //                                         ArrayData1 = [];
    //                                         for (let i = 0; i < data.length; i++) {
    //                                             if (i >= params.startRow && i < params.endRow)
    //                                                 ArrayData1.push({ Name: data[i] });
    //                                         }
    //                                     }
    //                                     else {
    //                                         for (let i = 0; i < Ldata1.length; i++) {
    //                                             if (i >= params.startRow && i < params.endRow)
    //                                                 ArrayData1.push({ Name: Ldata1[i] });
    //                                         }
    //                                     }
    //                                     var rowsThisPage = ArrayData1
    //                                     var lastRow = -1;
    //                                     if (total <= params.endRow) {
    //                                         lastRow = total;
    //                                     }
    //                                     params.successCallback(rowsThisPage, lastRow);
    //                                     this.setgridhight();
    //                                 }
    //                             }
    //                             setInterval(() => {
    //                                 this.unchckedAllfilterop();
    //                                 this.MapServiceService.GridColumnCheckboxEventForKml();
    //                             }, 3000);
    //                         }, 2000);
    //                     }
    //                 };
    //                 params.api.setDatasource(dataSource);
    //                 //});
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    // addandremovefilterLayeronMap(TabList) {
    //     for (let s of TabList.energyLayer) {
    //         for (let c of TabList.ListOfChildID) {
    //             if (((s.EnergyParentID == parseInt(TabList.parentID)) && (s.EnergyLayerID == parseInt(c)))) {
    //                 this.MapLayerService.removemapLayer(s);
    //                 s["serversidefilterval"] = '';
    //             }
    //         }
    //     }
    //     for (let s of TabList.energyLayer) {
    //         for (let c of TabList.ListOfChildID) {
    //             if (((s.EnergyParentID == parseInt(TabList.parentID)) && (s.EnergyLayerID == parseInt(c)))) {
    //                 s["serversidefilterval"] = this.GridfilterList;
    //                 this.MapLayerService.loadmapLayers(s);
    //             }
    //         }
    //     }
    // }
    // AddAndRemoveFilterLayeronMapForKML(TabList) {
    //     for (let s of TabList.energyLayer) {
    //         for (let c of TabList.ListOfChildID) {
    //             if (((s.EnergyParentID == parseInt(TabList.parentID)) && (s.EnergyLayerID == parseInt(c)))) {
    //                 this.PrivateMapLayerService.RemoveKmlLayer(s);
    //                 s["serversidefilterval"] = '';
    //             }
    //         }
    //     }
    //     for (let s of TabList.energyLayer) {
    //         for (let c of TabList.ListOfChildID) {
    //             if (((s.EnergyParentID == parseInt(TabList.parentID)) && (s.EnergyLayerID == parseInt(c)))) {
    //                 s["serversidefilterval"] = this.GridfilterList;
    //                 this.LoadPrivateKmlLayers(s);
    //             }
    //         }
    //     }
    // }
    // unchckedAllfilterop() {
    //     if ($('#selectAll')[0]) {
    //         if ($('#selectAll').html().indexOf('ag-icon-checkbox-checked') >= 0) {
    //             $('#selectAll').attr('checked', false).trigger('click');
    //         }
    //     }
    // }
    GoogleMapPage.prototype.filterData = function (filterModel, data) {
        var filterPresent = filterModel && Object.keys(filterModel).length > 0;
        if (!filterPresent) {
            return data;
        }
        var resultOfFilter = [];
        var keys = Object.keys(filterModel);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var k = keys_1[_i];
            var filterval = filterModel[k].filter.toString().toLocaleLowerCase();
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var columnval = item[k].toString().toLocaleLowerCase();
                if (filterModel[k].type == "equals") {
                    if (columnval !== filterval) {
                        continue;
                    }
                }
                else if (filterModel[k].type == "lessThan") {
                    if (columnval >= filterval) {
                        continue;
                    }
                }
                else if (filterModel[k].type == "contains") {
                    if (columnval.indexOf(filterval) < 0) {
                        continue;
                    }
                }
                else {
                    if (columnval <= filterval) {
                        continue;
                    }
                }
                resultOfFilter.push(item);
            }
        }
        return resultOfFilter;
    };
    GoogleMapPage.prototype.collapseSideBar = function (res) {
        var sideBar = document.getElementsByClassName('page-sidebar')[0];
        var cardBody = document.getElementsByClassName('card-body')[0];
        if (sideBar != undefined) {
            if (res == true) {
                sideBar.setAttribute("style", "height:85% !important");
                cardBody.setAttribute("style", "height:70vh !important");
            }
            else {
                sideBar.setAttribute("style", "height:50% !important");
                cardBody.setAttribute("style", "height:30vh !important");
            }
        }
    };
    GoogleMapPage.prototype.SetMapContext = function () {
        var _this = this;
        setTimeout(function () {
            var map = _this.MapServiceService._mapdata.getValue();
            var menu = new contextMenu({ map: map });
            menu.addItem('Mapsearch Data', function (map, latLng) {
                _this.mapsearchDataLibrary();
            });
            menu.addItem('Change Basemap', function (map, latLng) {
                _this.bsModalServices.show(basemap_component_1.BasemapComponent, { class: 'modal-lg modal-dialog-centered xlModal', animated: false, backdrop: 'static' });
            });
            menu.addItem('Draw Tools', function () {
                // this.MapServiceService.DrawTools();
                _this.OpenDrawTools();
            });
            menu.addItem('Show Legend', function () {
                if ($('#LegendModal').length == 0) {
                    _this.bsModalServices.show(show_legend_component_1.ShowLegendComponent, { class: 'modal-sm LegendModal slide-right in show', backdrop: 'static', animated: false });
                    setTimeout(function () { _this.SetLegendBasedOnGrid(); }, 100);
                }
            });
            //menu.addItem('Favorite Layers', (map, latLng) => { });
        }, 1000);
    };
    GoogleMapPage.prototype.OpenDrawTools = function (editId) {
        var isOpened = this.MapServiceService.isDrawToolsOpened.getValue();
        if (isOpened == true)
            return;
        else
            this.MapServiceService.isDrawToolsOpened.next(true);
        this.DisableContextMenuforDrawTools();
        var config = { class: 'modal-sm drawTools modal-dialog-centered', backdrop: 'static', animated: false };
        var drawModal = this.bsModalServices.show(draw_tools_component_1.DrawToolsComponent, config);
        if (editId)
            drawModal.content.EditLayerId = editId;
    };
    GoogleMapPage.prototype.DisableContextMenuforDrawTools = function () {
        var menu = document.getElementsByClassName('contextMenu');
        if (menu && menu.length > 0) {
            this.MapServiceService.isDrawToolsOpened.subscribe(function (x) {
                if (x == true) {
                    menu[0].classList.add('d-none');
                }
                else if (x == false) {
                    menu[0].classList.remove('d-none');
                    menu[0].setAttribute('style', 'display: none');
                }
            });
        }
    };
    GoogleMapPage.prototype.mapsearchDataLibrary = function () {
        var _this = this;
        var LoginId = this.AuthServices.getLoggedinUserId();
        if (!this.MapServiceService.MapsearchLayersCategory.getValue()) {
            this.httpService._NodeGetLayerCategoey(LoginId, "Energy Layer Group", 0).subscribe(function (data) {
                // let LayersLibrary = JSON.stringify(data);
                // let res = JSON.parse(LayersLibrary);                
                var LayersLibrary = data;
                var res = LayersLibrary;
                if (res.errormsg == "") {
                    res["IsLoaded"] = true;
                    _this.MapServiceService.setMapsearchLayersCategory(res);
                    _this.OpenMapsearchDataLibrary();
                }
                else {
                    //console.log(res.errorms);
                    _this.OpenMapsearchDataLibrary();
                }
            }, function (error) {
                console.log(error);
                _this.OpenMapsearchDataLibrary();
            });
        }
        else {
            this.OpenMapsearchDataLibrary();
        }
        // if (!this.MapServiceService.MapsearchLayersCategory.getValue()) {
        //     this.MapServiceService.GetLayersCategory(LoginId, "Energy Layer Group", 0).subscribe(data => {
        //         let LayersLibrary = data.json();
        //         let res = JSON.parse(LayersLibrary);
        //         if (res.errormsg == "") {
        //             res["IsLoaded"] = true;
        //             this.MapServiceService.setMapsearchLayersCategory(res);
        //             this.OpenMapsearchDataLibrary()
        //         }
        //         else {
        //             //console.log(res.errorms);
        //             this.OpenMapsearchDataLibrary();
        //         }
        //     }, error => {
        //         console.log(error);
        //     })
        // }
        // else {
        //     this.OpenMapsearchDataLibrary();
        // }
    };
    GoogleMapPage.prototype.OpenMapsearchDataLibrary = function () {
        this.modalService.open(map_search_data_component_1.MapSearchDataComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false, windowClass: "xlModal" }).result.then(function (result) { }, function (reason) { });
    };
    GoogleMapPage.prototype.RectangleZoom = function (e) {
        if (this.mouseIsDown && (this.shiftPressed || this.gribBoundingBox != null)) {
            if (this.gribBoundingBox !== null) {
                var newbounds = new google.maps.LatLngBounds(this.mouseDownPos, null);
                newbounds.extend(e.latLng);
                this.gribBoundingBox.setBounds(newbounds);
            }
            else {
                this.bounds = new google.maps.LatLngBounds();
                this.bounds.extend(e.latLng);
                this.gribBoundingBox = new google.maps.Rectangle({
                    map: this.map,
                    bounds: null,
                    fillOpacity: 0.15,
                    strokeWeight: 0.9,
                    clickable: false
                });
            }
        }
    };
    GoogleMapPage.prototype.OnMouseDown = function (e) {
        if (this.shiftPressed) {
            this.mouseIsDown = 1;
            this.mouseDownPos = e.latLng;
            this.map.setOptions({
                draggable: false
            });
        }
    };
    GoogleMapPage.prototype.OnMouseUp = function (e) {
        if (this.mouseIsDown && (this.shiftPressed || this.gribBoundingBox != null)) {
            this.mouseIsDown = 0;
            if (this.gribBoundingBox !== null) {
                var boundsSelectionArea = new google.maps.LatLngBounds(this.gribBoundingBox.getBounds().getSouthWest(), this.gribBoundingBox.getBounds().getNorthEast());
                this.map.fitBounds(boundsSelectionArea);
                this.gribBoundingBox.setMap(null); // remove the rectangle
            }
            this.gribBoundingBox = null;
        }
        this.map.setOptions({
            draggable: true
        });
    };
    GoogleMapPage.prototype.SavefiltereneregyLayer = function (event, Tab, Id) {
        var modalRef = this.modalService.open(savesearch_component_1.SavesearchComponent, { size: 'sm', centered: true, backdrop: 'static', windowClass: "SaveSearchModal" });
        modalRef.componentInstance.FilterEneregyLayer = Tab;
        modalRef.componentInstance.FilterEnergyLayerID = Id;
        modalRef.componentInstance.StatusOfSaveLayers = "EnergyLayerOrPrivateLayer";
    };
    GoogleMapPage.prototype.ExportData = function (event, Id, Tab) {
        var _this = this;
        var actionType = event.target.getAttribute("data-action-type");
        if (actionType == "ExportFeature") {
            event.target.classList.remove('fa-file-excel');
            event.target.classList.add('fa-spinner');
            event.target.classList.add('fa-spin');
            //this.ExportFeatureClass = "far fa-spinner fa-spin fa-lg";
            var ExportGridfilterList = this.GridfilterList;
            if (Tab.treestatus == "Individual") {
                ExportGridfilterList = Tab.energyLayer[0]["serversidefilterval"];
            }
            else {
                var list = [];
                for (var _i = 0, _a = Tab.energyLayer; _i < _a.length; _i++) {
                    var l = _a[_i];
                    Array.prototype.push.apply(list, l["serversidefilterval"]);
                }
                ExportGridfilterList = list;
            }
            var default_filter = this.MapServiceService.filterval(Tab.IsFiltervalue);
            var Gridfilter = this.MapServiceService.gridfilter(ExportGridfilterList);
            if (default_filter == '' && Gridfilter != '') {
                default_filter = '(' + Gridfilter + ')';
            }
            else if (Gridfilter != '' && default_filter != '') {
                default_filter = '(' + Gridfilter + ') and (' + default_filter + ')';
            }
            var cql_Filter = this.setCqlFilter(default_filter, true);
            var columnsList_1 = this.MapServiceService.GenerateColumns(Tab.energyLayer[0]);
            var propertyNameList_1 = [];
            for (var _b = 0, columnsList_2 = columnsList_1; _b < columnsList_2.length; _b++) {
                var c = columnsList_2[_b];
                if (c.field != undefined) {
                    propertyNameList_1.push(c.field);
                }
            }
            propertyNameList_1.push('the_geom');
            propertyNameList_1 = _.uniqWith(propertyNameList_1, _.isEqual);
            var propertyName = _.join(propertyNameList_1, ',');
            //this.MapServiceService.GetExportFeatureData(Tab.energyLayer[0], cql_Filter, propertyName)
            var UserId = this.AuthServices.getLoggedinUserId();
            var Username = this._UserName;
            this.httpService._NodeGetExportFeatureData(Tab.energyLayer[0], cql_Filter, propertyName, UserId, Username)
                .subscribe(function (data) {
                // if (data['_body'].indexOf('totalFeatures') > 0) {
                if (data['totalFeatures']) {
                    var Ldata = data.features;
                    var ArrayData = [];
                    var geometryColName_1 = "EID";
                    var RendomeChar = [];
                    for (var c = 0; c < 200; c++) {
                        var getchar = _this.UtilityService.GetTwoRendomeCharacter();
                        RendomeChar.push(getchar);
                    }
                    for (var _i = 0, Ldata_5 = Ldata; _i < Ldata_5.length; _i++) {
                        var d = Ldata_5[_i];
                        var EID = _this.UtilityService.ConvertJsongeometryTostringGeometry(d.geometry);
                        if (d.geometry.type.toLowerCase() == "multipolygon" || d.geometry.type.toLowerCase() == "multilinestring") {
                            if (EID.length > 0) {
                                var ListOfstring = EID.match(/.{1,12000}/g);
                                var indexval = 0;
                                for (var _a = 0, ListOfstring_1 = ListOfstring; _a < ListOfstring_1.length; _a++) {
                                    var l = ListOfstring_1[_a];
                                    if (indexval == 0) {
                                        d.properties[geometryColName_1] = l;
                                        propertyNameList_1.push(geometryColName_1);
                                    }
                                    else {
                                        d.properties[geometryColName_1 + " " + RendomeChar[indexval]] = l;
                                        propertyNameList_1.push(geometryColName_1 + " " + RendomeChar[indexval]);
                                    }
                                    indexval++;
                                }
                            }
                            ArrayData.push(d.properties);
                        }
                        else {
                            d.properties[geometryColName_1] = EID;
                            ArrayData.push(d.properties);
                            propertyNameList_1.push(geometryColName_1);
                        }
                    }
                    propertyNameList_1 = _.uniqWith(propertyNameList_1, _.isEqual);
                    var EIDColindexval_1 = 0;
                    var EIDColindexvalList = [];
                    var arrayListData = ArrayData.map(function (o) {
                        return propertyNameList_1.reduce(function (newo, name) {
                            if (name.indexOf(geometryColName_1) > 0) {
                                newo[name] = o[name];
                            }
                            if (name != "the_geom") {
                                newo[name] = o[name];
                                for (var _i = 0, columnsList_3 = columnsList_1; _i < columnsList_3.length; _i++) {
                                    var c = columnsList_3[_i];
                                    if (c.field != undefined) {
                                        if (name == c.field) {
                                            var jsonval = JSON.stringify(newo);
                                            newo = JSON.parse(jsonval.replace(name, c.headerName));
                                        }
                                    }
                                }
                            }
                            EIDColindexval_1++;
                            return newo;
                        }, {});
                    });
                    _this.MapServiceService.exportAsExcelFile(arrayListData, Tab['DisplayName'], propertyNameList_1, EIDColindexvalList);
                }
                event.target.classList.remove('fa-spinner');
                event.target.classList.remove('fa-spin');
                event.target.classList.add('fa-file-excel');
                // this.ExportFeatureClass = "far fa-file-excel fa-lg";
            }, function (error) {
                console.log(error);
            });
        }
    };
    GoogleMapPage.prototype.switchUnit = function () {
        setTimeout(function () {
            var ccs = $('.gm-style .gm-style-cc');
            if (ccs != undefined && ccs.length > 0) {
                for (var i = 0; i < ccs.length; i++) {
                    ccs[i].click();
                }
            }
        }, 3000);
    };
    GoogleMapPage = __decorate([
        core_1.Component({
            selector: 'google-map-page',
            templateUrl: './google.component.html',
            styleUrls: ['./google.component.scss'],
            host: {
                '[class.relative]': 'true',
            }
        })
    ], GoogleMapPage);
    return GoogleMapPage;
}(root_component_1.RootLayout));
exports.GoogleMapPage = GoogleMapPage;
//# sourceMappingURL=google.component.js.map