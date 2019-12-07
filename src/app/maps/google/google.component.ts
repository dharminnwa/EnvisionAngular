import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RootLayout } from '../../@pages/layouts/root/root.component';
import { MapSearchDataComponent } from '../../map-search-data/map-search-data.component';
import { BasemapComponent } from '../../@pages/layouts/condensed/basemap/basemap.component';
import { ShowLegendComponent } from '../../@pages/layouts/condensed/show-legend/show-legend.component';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap';

import * as _ from 'lodash';
import { SavesearchComponent } from '../../@pages/layouts/condensed/savesearch/savesearch.component';
import { DrawToolsComponent } from '../../@pages/layouts/condensed/draw-tools/draw-tools.component';
declare var jquery: any;
declare var $: any;
declare var google: any;

declare var contextMenu: any;
@Component({
    selector: 'google-map-page',
    templateUrl: './google.component.html',
    styleUrls: ['./google.component.scss'],
    host: {
        '[class.relative]': 'true',
    }
})

export class GoogleMapPage extends RootLayout implements OnInit {
    zoomSlider = 5;
    zoomLevel = 5;
    center = { lat: 40.6700, lng: -73.9400 };
    maxZoom = 21;
    minZoom = 4;
    clickableIcons: boolean = false;
    mapType: string = "hybrid"
    lat: number = 39.5;
    lng: number = -98.35;
    map: any;
    Coordinates: string = "40.6700,-73.9400";
    SetElevationval: string = "";
    parameter: string;
    private sub: any;
    hideshowClass: string = "fa fa-angle-double-up";
    caretClass: string = "fa fa-caret-up";
    BottomGriddesc: string = "Show Map Details ";
    public BindTabs: any = [];
    public pageSize = 50;
    public skip = 0;
    public GridTotal = 0;
    public GridtotalData = 0;
    public energyLayer: any = [];
    LoadedLayersObj: any = [];
    LoadedLayersIds: any = [];
    privateLayer: any = [];
    LoadedPrivateLayersObj: any = [];
    LoadedPrivateLayersIds: any = [];
    sharedLayer: any = [];
    public gridApi;
    public gridColumnApi;
    public kmlGridApi;
    public kmlGridColumnApi;
    public rowData: any[];
    public columnDefs;
    public GridData: any = [];
    public LoadedGridData: any[] = [];
    public Gridcolumns: any = [];
    public KMLGridData: any = [];
    public KMLGridcolumns: any = [];
    //public ColumnsGriddata: any = [];
    bsModalRef: BsModalRef;
    components = {
        loadingRenderer: (params) => {
            if (params.value !== undefined) {
                return params.value;
            } else {
                return '<img src="https://node.envisionmaps.net/images/loading.gif">';
            }
        }
    };
    rowBuffer = 0;
    // rowSelection = "multiple";
    // rowModelType = "infinite";
    // paginationPageSize = 100;
    // cacheOverflowSize = 2;
    // maxConcurrentDatasourceRequests = 2;
    // infiniteInitialRowCount = 1;
    // maxBlocksInCache = 2;
    // getRowNodeId;
    gridmouserclick = false;
    bounds = null;
    shiftPressed: boolean = false;
    mouseDownPos: any;
    gribBoundingBox: any = null;
    mouseIsDown = 0;
    ngOnInit() {
        var testScript = document.createElement("script");
        testScript.setAttribute("id", "testScript");
        testScript.setAttribute("src", "assets/plugins/slim_slider/simple-slider.js");
        document.body.appendChild(testScript);
        this.sub = this.route.params.subscribe(params => {
            this.parameter = params['type'];
            //Show header for casual/executive and coporate
            if (this.parameter != "with-header") {
                this.toggler.setHeaderClass("transparent");
            }
        });
        // this.toggler.setBodyLayoutClass("no-header");
        this.toggler.setPageContainer("full-height");
        this.toggler.setContent("full-width full-height overlay-footer relative");
        setTimeout(() => {

            this.toggler.toggleFooter(false);
            $(".page-container").css('padding-left', '40px !important');
        }, 1000);
        setTimeout(() => {
            this.SetZoom();
            $("#Resizingmap").draggable({
                axis: "y",
                start: (a) => {
                    this.gridmouserclick = true;
                    let position = a.target.offsetTop;
                    let h = 1500 - position;
                    // if (h > 1000) 
                    //     h = $("#content1").height();
                    $('#Resizingmap').css('height', h + 'px');
                    $('#Resizingmap').css('top', '');
                    $('#content1').css('height', h + "px");
                    // this.changeBottomSliderddesc();
                    // $('.footerDrawer .content1').css('display', 'block');
                    if (this.hideshowClass == "fa fa-angle-double-up") {
                        this.hideshowClass = "fa fa-angle-double-down";
                        this.caretClass = "fa fa-caret-down"
                        this.BottomGriddesc = "Hide Map Details ";
                        $('.footerDrawer .content1').css('display', 'block');
                    }
                },
                // drag: (b) => {
                //     this.calculatepercent(b.target.offsetTop);
                // },
                stop: (c) => {
                    setTimeout(() => {
                        this.gridmouserclick = false;
                    }, 800);
                    this.setgridhight();
                    $("#Resizingmap")[0].offsetTop;
                    $("#Resizingmap")[0].offsetHeight;
                    let h = $("#Resizingmap")[0].offsetHeight - $("#Resizingmap")[0].offsetTop;
                    this.SetLegendBasedOnGrid(h);
                    if (h <= 80) {
                        this.hideshowClass = "fa fa-angle-double-up";
                        this.BottomGriddesc = "Show Map Details ";
                        this.caretClass = "fa fa-caret-up"
                        $('.footerDrawer .content1').css('display', 'none');
                        $('#Resizingmap').css('top', '').css('height', '');
                    }
                }
            });
            $('#getlatlng').draggable();
            setTimeout(() => {
                // $('.gm-style .gm-style-cc').css("width", "130px");
                // $('.gm-style-cc').draggable(); 
                var ScaleIndicator = $('.gm-style-cc');
                for (let index = 0; index < ScaleIndicator.length; index++) {
                    const element = ScaleIndicator[index];
                    if (index == 3)
                        $(element).draggable();
                    else if (index == 2)
                        $($(".gm-style-cc")[index]).addClass("d-none")
                }

            }, 5000);
        }, 1000);
        this.MapServiceService.setTabData(this.BindTabs);
        this.MapServiceService.setGridMapData(this.GridData);
        this.MapServiceService.setGridMapcolumns(this.Gridcolumns);
        this.MapServiceService.setKMLGridMapData(this.KMLGridData);
        this.MapServiceService.setKMLGridMapcolumns(this.KMLGridcolumns);
        this.MapServiceService.setLodedGridMapData(this.LoadedGridData);
        document.addEventListener('keydown', (event) => {
            const keyName = event.key;
            if (event.which === 16) {
                this.shiftPressed = true;
            }
        });
        document.addEventListener('keyup', (event) => {
            const keyName = event.key;
            if (event.which === 16) {
                this.shiftPressed = false;
            }
        });
        if (window.screen.width < 1399) {
            $('#bottomemapgrid').css('Padding-left', '0%');
        }
    }

    SetLegendBasedOnGrid(h?: number) {
        if (!h)
            h = $("#Resizingmap")[0].offsetHeight - $("#Resizingmap")[0].offsetTop;
        if ($('#LegendModal').length != 0) {
            let Child = $('#LegendModal').children();
            if (Child) {
                Child.css('top', '');
                Child.css('bottom', (h + 15) + 'px');
            }
        }
    }
    setgridhight() {
        $("#Resizingmap")[0].offsetTop;
        $("#Resizingmap")[0].offsetHeight;
        let h = $("#Resizingmap")[0].offsetHeight - $("#Resizingmap")[0].offsetTop;
        $("#divmapgrid").css('height', h - 60 + "px");
        $('#content1').css('height', h + "px");
        $('#Resizingmap').css('height', h + 'px');
        $('#Resizingmap').css('top', '0');
    }
    BottomSliderclick(event) {
        if (this.gridmouserclick == false) {
            this.changeBottomSliderddesc();
            $('#Resizingmap').css('top', '');
            this.setgridhight();
        }
    }
    changeBottomSliderddesc() {
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
    }
    SetBaseMap() {
        let BaseMapList = this.MapServiceService.BaseMapData.getValue();
        if (BaseMapList == null) {
            let UserId = this.AuthServices.getLoggedinUserId();
            this.httpService._NodeGetBaseMapTypes(UserId).subscribe(data => {
                if (data._Issuccess) {
                    this.SetBaseMapsetting(data);
                    this.MapServiceService.setBaseMap(data);
                }
            }, error => {
                console.log(error);
            });
        }
        else {
            this.SetBaseMapsetting(BaseMapList);
        }
    }
    SetBaseMapsetting(data) {
        if (data.MapSettingData && data.MapSettingData.length > 0) {
            let baseMapList = data.BaseMapData;
            let BaseMapProviderID = data.MapSettingData[0].BaseMapProviderID;
            var activeBasemap = baseMapList.filter(m => m.IsDefault == true)[0];
            if (activeBasemap != null && activeBasemap != undefined) {
                activeBasemap.IsDefault = false;
            }
            activeBasemap = baseMapList.filter(m => m.BaseMapProviderID == BaseMapProviderID)[0];
            activeBasemap.IsDefault = true;
            let MinZoom = activeBasemap.MinZoom == null ? 4 : activeBasemap.MinZoom;
            let maxzoom = activeBasemap.MaxZoom == null ? 21 : activeBasemap.MaxZoom
            this.minZoom = MinZoom;
            this.maxZoom = maxzoom;
            this.basemapservice.setBasemap(activeBasemap);
        }
    }
    mapReady($event: any) {
        this.map = $event;
        this.map.setTilt(0);
        this.SetBaseMap();
        this.map.addListener('mousemove', (event) => {
            this.onMouseHover(event);
            this.RectangleZoom(event);
            if (this.MapServiceService.SetElavationvalue.IsElavation) {
                $('#getElevationval').draggable();
                let elevator = new google.maps.ElevationService;
                let location = event.latLng;
                elevator.getElevationForLocations({
                    'locations': [location]
                }, (results, status) => {
                    if (status === google.maps.ElevationStatus.OK) {
                        // Retrieve the first result
                        if (results[0]) {
                            let elevationvalue = results[0].elevation;
                            if (this.MapServiceService.SetElavationvalue.Unitvalue == "Meter") {
                                this.SetElevationval = " Elevation " + elevationvalue.toFixed(0) + " m"
                            }
                            else if (this.MapServiceService.SetElavationvalue.Unitvalue == "Feet") {
                                let feet = (elevationvalue * 3.28084);
                                this.SetElevationval = " Elevation " + feet.toFixed(0) + " ft"
                            }
                            else {
                                this.SetElevationval = "";
                            }
                        }
                    } else {
                        // setAltitude('Elevation service failed due to: ' + status);
                    }
                });
            }
        });
        this.map.addListener('click', (event) => {
            this.MapLayerInfoService.onClickMarker(event);
        });
        this.map.addListener('idle', (event) => {
            this.hidethePaceProcessbar();
            setTimeout(() => {
                this.getTotalCount();
            }, 500);
            let TabList = this.MapServiceService._GridTabData.value;
            if (TabList.length == 0) {
                this.MapServiceService.GridData.getValue().length = 0
                this.MapServiceService.GridColumns.getValue().length = 0
            }
            for (let t = 0; t < TabList.length; t++) {
                if (TabList[t].ActiveClass == " active") {
                    if (this.MapServiceService.GridApi.getValue()) {
                        this.MapServiceService.GridApi.getValue().api.onFilterChanged();
                    }
                }
            }

        });

        this.map.addListener('mousedown', (event) => {
            this.OnMouseDown(event);
        });
        this.map.addListener('mouseup', (event) => {
            this.OnMouseUp(event);
        });

        this.SetMapContext(this.map);
        this.MapServiceService.setMap(this.map);
        this.switchUnit();
    }
    zoomIn() {
        if (this.maxZoom != this.zoomLevel) {
            this.zoomLevel++;
            this.SetZoom();
        }
        this.hidethePaceProcessbar();
    }
    zoomOut() {
        if (this.minZoom != this.zoomLevel) {
            this.zoomLevel--;
            this.SetZoom();
        }
        this.hidethePaceProcessbar();
    }
    SetZoom() {
        var val = this.zoomLevel;
        this.zoomSlider = val;
        this.hidethePaceProcessbar();
    }

    PanBy(x: number, y: number) {
        this.hidethePaceProcessbar();
        return this.map.panBy(x, y);
    }

    ZoomChange() {
        if ((this.map.getZoom() >= this.minZoom) && (this.map.getZoom() <= this.maxZoom)) {
            this.zoomLevel = this.map.getZoom();
            $("#mapzoom").html(this.zoomLevel);
            this.zoomSlider = this.zoomLevel;
        }
    }

    onSliderChange(e: any) {
        this.zoomLevel = e;
    }

    onMouseHover(event: any) {
        let lat = event.latLng.lat();
        let long = event.latLng.lng();
        this.Coordinates = lat.toFixed(6) + " , " + long.toFixed(6);
    }
    removeLayersFromMap(id) {
        this.mapfilterval = '';
        if (this.energyLayer.length > 0) {
            for (let x in this.energyLayer) {
                var layer = this.energyLayer[x];
                if (layer.EnergyParentID == id || layer.EnergyLayerID == id) {
                    this.MapLayerService.removemapLayer(layer);
                    if (layer && layer.treestatus == 'GroupLayer')
                        this.MapLayernewService.LoadGroupMapLayers();
                    this.getTotalCount();

                }
            }
        }
        this.energyLayer = this.energyLayer.filter((el) => {
            if (!((el.EnergyParentID == parseInt(id)) || (el.EnergyLayerID == parseInt(id)))) {
                return el;
            }
        });
    }
    RemovePrivateLayerFromMap(id) {
        this.mapfilterval = '';
        if (this.privateLayer.length > 0) {
            for (let x in this.privateLayer) {
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
    }
    RemoveLayerFromPrivateLayerList(id) {
        if (this.privateLayer.length > 0) {
            for (let x in this.privateLayer) {
                var layer = this.privateLayer[x];
                if (layer.DataSetID == id) {
                    let index = this.privateLayer.indexOf(layer);
                    this.privateLayer.splice(index, 1);
                }
            }
        }
    }

    RemoveLayerFromSharedLayerList(id) {
        if (this.sharedLayer.length > 0) {
            for (let layer of this.sharedLayer) {
                if (layer.DataSetID == id) {
                    let index = this.sharedLayer.indexOf(layer);
                    this.sharedLayer.splice(index, 1);
                }
            }
        }
    }

    RemoveLayerFromTemporaryLayerList(id) {
        if (this.MapServiceService.temporaryLayer.length > 0) {
            for (let x in this.MapServiceService.temporaryLayer) {
                var layer = this.MapServiceService.temporaryLayer[x];
                if (layer.DataSetID == id) {
                    let index = this.MapServiceService.temporaryLayer.indexOf(layer);
                    this.MapServiceService.temporaryLayer.splice(index, 1);
                }
            }
        }
    }


    setvalueMapLayers(MapLayers) {
        if (MapLayers.length > 0) {
            for (let x in MapLayers) {
                var layer = MapLayers[x];
                if (!(this.energyLayer.indexOf(layer) > -1)) {
                    this.energyLayer.push(layer);
                    this.LoadedLayersObj.push(layer);
                    this.LoadedLayersIds.push(layer.EnergyLayerID);
                }
            }
        }
    }
    RemoveLayesBasedOnid(id) {
        this.mapfilterval = '';
        if (this.energyLayer.length > 0) {
            for (let x in this.energyLayer) {
                var layer = this.energyLayer[x];
                if (layer.EnergyParentID == id || layer.EnergyLayerID == id) {
                    this.MapLayerService.removemapLayer(layer);
                }
            }
        }
    }

    RemovePrivateLayersBasedOnId(id) {
        this.mapfilterval = '';
        if (this.privateLayer.length > 0) {
            for (let x in this.privateLayer) {
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
    }

    RemoveSharedLayersBasedOnId(id) {
        this.mapfilterval = '';
        if (this.sharedLayer.length > 0) {
            for (let layer of this.sharedLayer) {
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
    }




    RemoveTemporaryLayersBasedOnId(id) {
        this.mapfilterval = '';
        if (this.MapServiceService.temporaryLayer.length > 0) {
            for (let x in this.MapServiceService.temporaryLayer) {
                var layer = this.MapServiceService.temporaryLayer[x];
                if (layer.DataSetID == id) {
                    this.PrivateMapLayerService.RemoveMapLayer(layer);
                }
            }
        }
    }


    addlayesbasedonId(Id) {
        let energyLayerLoad = this.energyLayer.filter((el) => {
            if (((el.EnergyParentID == parseInt(Id)) || (el.EnergyLayerID == parseInt(Id)))) {
                return el;
            }
        });
        if (energyLayerLoad.length > 0) {
            for (let x in energyLayerLoad) {
                var layer = energyLayerLoad[x];
                setTimeout(() => {
                    let UserId = this.AuthServices.getLoggedinUserId();
                    if (layer.TableName) {
                        // this.httpService._NodeGetFeaturetype(layer, 0, 1, '', '', '', UserId)
                        //     .subscribe(data => {
                        // if (data['featureTypes']) {
                        this.MapLayerService.loadmapLayers(layer);
                        // }
                        // }, error => {
                        //     console.log(error);
                        // });
                    }
                    else if (!layer.TableName && layer.DetailPanelProperties.toString().indexOf('BaseUri==') != -1 && layer.DetailPanelPropertiesMain.toString().indexOf('BaseUri==') != -1) {
                        this.MapLayerService.loadmapLayers(layer);
                    }
                }, 500);
            }
        }
    }

    AddPrivateLayerBasedOnId(Id) {

        let privateLayerLoad = this.privateLayer.filter((el) => {
            if (el.DataSetID == parseInt(Id)) {
                return el;
            }
        });
        if (privateLayerLoad.length > 0) {
            for (let x in privateLayerLoad) {
                var layer = privateLayerLoad[x];
                if ((layer.UploadFileType != null || layer.UploadFileType != undefined) && (layer.UploadFileType.toLowerCase() == ".kml" || layer.UploadFileType.toLowerCase() == ".kmz")) {
                    this.LoadPrivateKmlLayers(layer);
                }
                else {
                    let UserId = this.AuthServices.getLoggedinUserId();
                    this.httpService._NodeGetPrivateLayerData(layer, 0, 1, '', '', '', UserId)
                        .subscribe(data => {
                            if (data['totalFeatures']) {
                                this.PrivateMapLayerService.LoadPrivateMapLayers(layer);
                            }
                        }, error => {
                            console.log(error);
                        });
                }
            }
        }
    }

    AddSharedLayerBasedOnId(Id) {
        let sharedLayerLoad = this.sharedLayer.filter((el) => {
            if (el.DataSetID == parseInt(Id)) {
                return el;
            }
        });
        if (sharedLayerLoad.length > 0) {
            for (let layer of sharedLayerLoad) {
                if ((layer.UploadFileType) && (layer.UploadFileType.toLowerCase() == ".kml" || layer.UploadFileType.toLowerCase() == ".kmz")) {
                    this.LoadPrivateKmlLayers(layer);
                }
                else {
                    let UserId = this.AuthServices.getLoggedinUserId();
                    this.httpService._NodeGetPrivateLayerData(layer, 0, 1, '', '', '', UserId)
                        .subscribe(data => {
                            if (data['totalFeatures']) {
                                this.PrivateMapLayerService.LoadPrivateMapLayers(layer);
                            }
                        }, error => {
                            console.log(error);
                        });
                }
            }
        }
    }


    AddTemporaryLayerBasedOnId(Id) {
        let temporaryLayerLoad = this.MapServiceService.temporaryLayer.filter((el) => {
            if (el.DataSetID == parseInt(Id)) {
                return el;
            }
        });
        if (temporaryLayerLoad.length > 0) {
            for (let x in temporaryLayerLoad) {
                var layer = temporaryLayerLoad[x];
                setTimeout(() => {
                    let UserId = this.AuthServices.getLoggedinUserId();
                    this.httpService._NodeGetFeaturetype(layer, 0, 1, '', '', '', UserId)
                        .subscribe(data => {
                            if (data['featureTypes']) {
                                this.PrivateMapLayerService.LoadPrivateMapLayers(layer);
                            }
                        }, error => {
                            console.log(error);
                        });
                }, 500);
            }
        }
    }


    LoadPrivateKmlLayers(layer) {
        if (!this.MapServiceService.KmlLayersData.getValue()) {
            this.httpService.GetKmlData(layer.DataSetGUID, layer.UploadFileType)
                .subscribe(data => {
                    let result = data.json();
                    if (result.isSuccess) {
                        let kmlData = {
                            LayerID: layer.DataSetID,
                            LayerData: result.result
                        };
                        this.MapServiceService.setKMLLayersData([kmlData]);
                        let kmlLayer = this.PrivateMapLayerService.SetPrivateKMLlayer(kmlData);
                        let klayer = {
                            LayerIndex: layer.Layerindexval,
                            Layer: kmlLayer
                        };
                        if (!this.MapServiceService.KmlLayers.getValue()) {
                            this.MapServiceService.setKmlLayers([klayer]);
                        }
                        else {
                            let existingklayer = this.MapServiceService.KmlLayers.getValue();
                            existingklayer.push(klayer);
                        }
                        this.BindPrivateLayerActiveGridData();
                    }
                });
        }
        else {
            let existingklayer = this.MapServiceService.kmlLayersData.getValue();
            let selectedKmlLayer = [];
            for (let layerdata of existingklayer) {
                if (layerdata.LayerID == parseInt(layer.DataSetID))
                    selectedKmlLayer.push(layerdata);
            }
            if (selectedKmlLayer.length == 1) {
                if (layer['serversidefilterval'] != undefined && layer['serversidefilterval'].length > 0 && layer['serversidefilterval'][0].indexOf("Name=") > -1) {
                    if (layer['serversidefilterval'][0].indexOf(';') > -1) {
                        let filterValues = layer['serversidefilterval'][0].split(';');
                        let filterDataValues = [];
                        for (let filter of filterValues) {
                            if (filter.indexOf('=') > -1) {
                                let keyValues = filter.split('=');
                                filterDataValues.push(keyValues[1]);
                            }
                        }
                        if (filterDataValues.length > 0) {
                            let lData = selectedKmlLayer[0].LayerData.KMLGeometryList;
                            let FilterKMLGeometryList = [];
                            lData.filter((el) => {
                                if (filterDataValues.indexOf(el.Name) > -1) {
                                    FilterKMLGeometryList.push(el);
                                }
                            });
                            selectedKmlLayer[0].LayerData.KMLGeometryList = FilterKMLGeometryList;
                        }
                    }
                    else {
                        let filter = layer['serversidefilterval'][0];
                        let filterDataValues = [];
                        if (filter.indexOf('=') > -1) {
                            let keyValues = filter.split('=');
                            filterDataValues.push(keyValues[1]);
                        }
                        if (filterDataValues.length > 0) {
                            let lData = selectedKmlLayer[0].LayerData.KMLGeometryList;
                            let FilterKMLGeometryList = [];
                            lData.filter((el) => {
                                if (filterDataValues.indexOf(el.Name) > -1) {
                                    FilterKMLGeometryList.push(el);
                                }
                            });
                            selectedKmlLayer[0].LayerData.KMLGeometryList = FilterKMLGeometryList;
                        }
                    }
                }
                let kmlLayer = this.PrivateMapLayerService.SetPrivateKMLlayer(selectedKmlLayer[0]);
                let klayer = {
                    LayerIndex: layer.Layerindexval,
                    Layer: kmlLayer
                };
                if (!this.MapServiceService.KmlLayers.getValue()) {
                    this.MapServiceService.setKmlLayers([klayer]);
                }
                else {
                    let existinglayer = this.MapServiceService.KmlLayers.getValue();
                    existinglayer.push(klayer);
                }
            }
            else {
                this.httpService.GetKmlData(layer.DataSetGUID, layer.UploadFileType)
                    .subscribe(data => {
                        let result = data.json();
                        if (result.isSuccess) {
                            let kmlData = {
                                LayerID: layer.DataSetID,
                                LayerData: result.result
                            };
                            let existingklayer = this.MapServiceService.kmlLayersData.getValue();
                            existingklayer.push(kmlData);
                            let kmlLayer = this.PrivateMapLayerService.SetPrivateKMLlayer(kmlData);
                            let klayer = {
                                LayerIndex: layer.Layerindexval,
                                Layer: kmlLayer
                            };
                            if (!this.MapServiceService.KmlLayers.getValue()) {
                                this.MapServiceService.setKmlLayers([klayer]);
                            }
                            else {
                                let existingklayer = this.MapServiceService.KmlLayers.getValue();
                                existingklayer.push(klayer);
                            }
                            this.BindPrivateLayerActiveGridData();
                        }
                    });
            }
        }

    }


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
    TabClick(evt: any, tabId: any) {
        let actionType = evt.target.getAttribute("data-action-type");
        if (actionType == "MapDataFeature") {
            let tabdata = this.MapServiceService._GridTabData.value;
            for (let inactiveall in tabdata) {
                tabdata[inactiveall].ActiveClass = "";
            }
            for (let o = 0; o < tabdata.length; o++) {
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
    }

    bindtab(nodesData: any) {
        this.MapServiceService._TreeUI.getValue().treeModel.update();
        this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
        this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
        //let Id = nodesData.data.Id;
        let EnergyLayerID = nodesData.data.Id;
        //let Id = nodesData.parent.data.Id;
        let parentid = nodesData.parent.data.Id;
        let parentName = nodesData.parent.data.Name;
        let featureType = '';
        if (nodesData.data.FeatureType)
            featureType = nodesData.data.FeatureType;
        let LayerStatus = '';
        let Layerindexval = 0;
        let tabs = this.energyLayer.filter((el) => {
            if (el["serversidefilterval"] && el.TableName) {
                el["serversidefilterval"] = '';
                this.MapServiceService.ClearColumncheckvalue();
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
                if (this.MapServiceService.ExternalEnergyLayer.length > 0) {
                    let exlayer = this.MapServiceService.ExternalEnergyLayer.filter((exlayer) => {
                        if (exlayer.EnergyLayerID != el.EnergyLayerID) {
                            return exlayer;
                        }
                    });
                    if (exlayer && exlayer.length > 0) {
                        this.MapServiceService.ExternalEnergyLayer.push(exlayer);
                    }
                } else {
                    this.MapServiceService.ExternalEnergyLayer.push(el);
                }

            }
        });
        if (tabs.length > 0) {
            let Isparent = this.MapServiceService._GridTabData.value.filter((el) => {
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
            let IsFiltervalue: any = [];
            for (let f of this.energyLayer) {
                if (f.FilterValue != "" && f.EnergyLayerID == EnergyLayerID) {
                    IsFiltervalue.push(f.FilterValue);
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
                    IsFiltervalue: IsFiltervalue,
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
                    setTimeout(() => {
                        this.getTotalCount();
                    }, 500);
                }

            }
            else {
                this.MapServiceService._GridTabData.value.filter((el) => {
                    if (el.parentID == parentid) {
                        el.IsFiltervalue.push(IsFiltervalue[0]);
                    }
                });
                let ISGroupLayer = false;
                this.MapServiceService._GridTabData.value.filter((el) => {
                    if (el.treestatus === "GroupLayer") {
                        ISGroupLayer = true;
                    }
                });
                if (!ISGroupLayer)
                    this.BindActiveGridData();
            }
        }
    }

    BindTabForPrivateLayer(nodesData: any) {
        let Id = nodesData.data.Id;
        let PrivateLayerID = nodesData.data.Id;
        //let Id = nodesData.parent.data.Id;
        let parentid = nodesData.parent.data.Id;
        let parentName = nodesData.parent.data.Name;
        let LayerStatus = '';
        let featureType = '';
        if (nodesData.data.FeatureType)
            featureType = nodesData.data.FeatureType;
        let Layerindexval = 0;

        let tabs = this.privateLayer.filter((el) => {
            if (el["serversidefilterval"]) {
                el["serversidefilterval"] = '';
                this.MapServiceService.ClearColumncheckvalue();

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
                if (el.treestatus === "Individual" && el.DataSetID == parseInt(PrivateLayerID)) { //el.ParentDataSetID == parseInt(parentid)
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
            let Isparent = this.MapServiceService._GridTabData.value.filter((el) => {
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
            let IsFiltervalue: any = [];
            for (let f of this.privateLayer) {
                if (f.FilterValue != null && f.FilterValue != "" && f.DataSetID == PrivateLayerID) {
                    IsFiltervalue.push(f.FilterValue);
                }
            }

            if (Isparent == 0) {
                if (nodesData.parent.data["children"] && nodesData.parent.data["children"].length >= 1 && LayerStatus == "GroupLayer") {
                    tabs[0]['DisplayName'] = parentName;
                } else {
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
                    IsFiltervalue: IsFiltervalue,
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
                    setTimeout(() => {
                        this.getTotalCount();
                    }, 1000);

                }

            }
            else {
                this.MapServiceService._GridTabData.value.filter((el) => {
                    if (el.parentID == parentid) {
                        el.IsFiltervalue.push(IsFiltervalue[0]);
                    }
                });
                let ISGroupLayer = false;
                this.MapServiceService._GridTabData.value.filter((el) => {
                    if (el.treestatus === "GroupLayer") {
                        ISGroupLayer = true;
                    }
                });
                if (!ISGroupLayer)
                    this.BindPrivateLayerActiveGridData();
                //     this.BindTemporaryLayerActiveGridData();
                // this.BindActiveGridData();
            }
        }
        //this.BindTabs.push(dj);

    }

    BindTabForSharedLayer(nodesData: any) {
        let Id = nodesData.data.Id;
        let SharedLayerID = nodesData.data.Id;
        let parentid = nodesData.parent.data.Id;
        let parentName = nodesData.parent.data.Name;
        let LayerStatus = '';
        let featureType = '';
        if (nodesData.data.FeatureType)
            featureType = nodesData.data.FeatureType;
        let Layerindexval = 0;
        let tabs = this.sharedLayer.filter((el) => {
            if (el["serversidefilterval"]) {
                el["serversidefilterval"] = '';
                this.MapServiceService.ClearColumncheckvalue();

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
            let Isparent = this.MapServiceService._GridTabData.value.filter((el) => {
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
            let IsFiltervalue: any = [];
            for (let f of this.sharedLayer) {
                if (f.FilterValue != null && f.FilterValue != "" && f.DataSetID == SharedLayerID) {
                    IsFiltervalue.push(f.FilterValue);
                }
            }

            if (Isparent == 0) {
                if (nodesData.parent.data["children"] && nodesData.parent.data["children"].length >= 1 && LayerStatus == "GroupLayer") {
                    tabs[0]['DisplayName'] = parentName;
                } else {
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
                    IsFiltervalue: IsFiltervalue,
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
                    setTimeout(() => {
                        this.getTotalCount();
                    }, 1000);

                }

            }
            else {
                this.MapServiceService._GridTabData.value.filter((el) => {
                    if (el.parentID == parentid) {
                        el.IsFiltervalue.push(IsFiltervalue[0]);
                    }
                });
                let ISGroupLayer = false;
                this.MapServiceService._GridTabData.value.filter((el) => {
                    if (el.treestatus === "GroupLayer") {
                        ISGroupLayer = true;
                    }
                });
                if (!ISGroupLayer)
                    this.BindPrivateLayerActiveGridData();
            }
        }
    }


    BindTabForTemporaryLayer(nodesData: any) {
        let TemporaryLayerID = nodesData.data.Id;
        let LayerStatus = '';
        let parentid = nodesData.parent.data.Id;
        let parentName = nodesData.parent.data.Name;
        let featureType = '';
        if (nodesData.data.FeatureType)
            featureType = nodesData.data.FeatureType;
        let Layerindexval = 0;
        //let tabs = [];
        // if (featureType == "GlobalSearch" && parentid > 0 && nodesData.data.treestatus == "GroupLayer") {
        //     parentid = 0
        // }
        let tabs = this.MapServiceService.temporaryLayer.filter((el) => {
            if (el["serversidefilterval"]) {
                el["serversidefilterval"] = '';
                this.MapServiceService.ClearColumncheckvalue();
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
                if (el.TreeStatus === "Individual" && el.DataSetID == parseInt(TemporaryLayerID)) { //el.ParentDataSetID == parseInt(parentid)
                    return el;
                }
            }
        });
        if (tabs.length > 0) {
            let Isparent = this.MapServiceService._GridTabData.value.filter((el) => {
                if (el.treestatus === "GroupLayer") {
                    if (el.parentID == parseInt(parentid) && el.treestatus === "GroupLayer") {
                        el.ListOfChildID.push(TemporaryLayerID);
                        return el;
                    }
                }
                else if (el.treestatus === "Individual") {
                    if (el.treestatus === "Individual" && el.ID == parseInt(TemporaryLayerID)) { //el.ParentDataSetID == parseInt(parentid) && el.DataSetID == parseInt(TemporaryLayerID
                        el.ListOfChildID.push(TemporaryLayerID);
                        return el;
                    }
                }

            });
            let IsFiltervalue: any = [];
            for (let f of this.MapServiceService.temporaryLayer) {
                if (f.FilterValue != null && f.FilterValue != "" && f.DataSetID == TemporaryLayerID) {
                    IsFiltervalue.push(f.FilterValue);
                }
            }
            if (Isparent == 0) {
                if (nodesData.parent.data["children"]) {
                    if (nodesData.parent.data["children"].length >= 1 && LayerStatus == "GroupLayer") {
                        tabs[0]['DisplayName'] = parentName;
                    }

                } else {
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
                    IsFiltervalue: IsFiltervalue,
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
                    setTimeout(() => {
                        this.getTotalCount();
                    }, 1000);

                }
            }
            else {
                this.MapServiceService._GridTabData.value.filter((el) => {
                    if (el.parentID == parentid) {
                        el.IsFiltervalue.push(IsFiltervalue[0]);
                    }
                });
                let ISGroupLayer = false;
                this.MapServiceService._GridTabData.value.filter((el) => {
                    if (el.treestatus === "GroupLayer") {
                        ISGroupLayer = true;
                    }
                });
                if (!ISGroupLayer)
                    this.BindTemporaryLayerActiveGridData();
            }

        }
    }


    removeTab(nodesData: any) {
        let Id = nodesData.data.Id;
        let parentId = nodesData.parent.data.Id
        let tabdata = this.MapServiceService._GridTabData.value;
        let IsActive: boolean = false;
        let Isparent = this.MapServiceService._GridTabData.value.filter((el) => {
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
                    for (let c = 0; c < el.ListOfChildID.length; c++) {
                        if (el.ListOfChildID[c] === Id) {
                            el.ListOfChildID.splice(c, 1);
                            c--;
                        }
                    }
                    if (el.ListOfChildID.length > 0)
                        return el;
                }
                el.energyLayer.filter((el) => {
                    if (el.ViewingCount != "" && el.ViewingCount != undefined) {
                        el.ViewingCount = 0;
                    }
                });
            }
            else if (el.treestatus === "Individual") {
                if (el.EnergyParentID == parseInt(parentId) && el.treestatus === "Individual" && el.EnergyLayerID == parseInt(Id)) {
                    for (let c = 0; c < el.ListOfChildID.length; c++) {
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
            for (let i = 0; i < tabdata.length; i++) {
                //if ((tabdata[i].ID == parseInt(Id) || (tabdata[i].parentID == parseInt(Id)))) {
                if (tabdata[i].treestatus == "GroupLayer") {
                    if ((tabdata[i].ListOfChildID.length == 0 || (tabdata[i].parentID == parseInt(parentId) && tabdata[i].treestatus == "GroupLayer"))) {
                        if (this.MapServiceService._GridTabData.value[i].ActiveClass == " active") {
                            IsActive = true;
                        }
                        this.MapLayernewService.removeGroupmapLayer(tabdata[i].Layerindexval)
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
        let filterval = '';
        this.energyLayer.filter((el) => {
            if (el.EnergyLayerID == Id) {
                filterval = el.FilterValue;
            }
        });
        if (filterval) {
            this.MapServiceService._GridTabData.value.filter((el) => {
                el.IsFiltervalue = el.IsFiltervalue.filter((fel) => {
                    if (fel != filterval) {
                        return fel;
                    }
                });
            });
        }
        // }
        let activeGridTabData = this.MapServiceService._GridTabData.value.filter((el) => {
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
            let map = this.MapServiceService._mapdata.getValue();
            map.overlayMapTypes.clear();
        }
        if (this.MapServiceService.ExternalEnergyLayer.length > 0) {
            for (let e = 0; e < this.MapServiceService.ExternalEnergyLayer.length; e++) {
                var Exlayer = this.MapServiceService.ExternalEnergyLayer[e];
                if (Exlayer.EnergyLayerID == Id) {
                    this.MapServiceService.ExternalEnergyLayer.splice(e, 1);
                }
            }
        }
    }

    RemoveTabForPrivateLayer(nodesData: any) {
        let Id = nodesData.data.Id;
        let parentId = nodesData.parent.data.Id
        let tabdata = this.MapServiceService._GridTabData.value;
        let IsActive: boolean = false;
        let Isparent = this.MapServiceService._GridTabData.value.filter((el) => {
            if (el.parentID == parseInt(parentId)) {
                for (let c = 0; c < el.ListOfChildID.length; c++) {
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
                    for (let c = 0; c < el.ListOfChildID.length; c++) {
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
                    for (let c = 0; c < el.ListOfChildID.length; c++) {
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
            for (let i = 0; i < tabdata.length; i++) {
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
        let filterval = '';
        this.privateLayer.filter((el) => {
            if (el.DataSetID == Id) {
                filterval = el.FilterValue;
            }
        });
        if (filterval) {
            this.MapServiceService._GridTabData.value.filter((el) => {
                el.IsFiltervalue = el.IsFiltervalue.filter((fel) => {
                    if (fel != filterval) {
                        return fel;
                    }
                });
            });
        }
        // }
        let activeGridTabData = this.MapServiceService._GridTabData.value.filter((el) => {
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
            let map = this.MapServiceService._mapdata.getValue();
            map.overlayMapTypes.clear();
        }
    }

    RemoveTabForSharedLayer(nodesData: any) {
        let Id = nodesData.data.Id;
        let parentId = nodesData.parent.data.Id
        let tabdata = this.MapServiceService._GridTabData.value;
        let IsActive: boolean = false;
        let Isparent = this.MapServiceService._GridTabData.value.filter((el) => {
            if (el.parentID == parseInt(parentId)) {
                for (let c = 0; c < el.ListOfChildID.length; c++) {
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
                    for (let c = 0; c < el.ListOfChildID.length; c++) {
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
                    for (let c = 0; c < el.ListOfChildID.length; c++) {
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
            for (let i = 0; i < tabdata.length; i++) {
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
        let filterval = '';
        this.privateLayer.filter((el) => {
            if (el.DataSetID == Id) {
                filterval = el.FilterValue;
            }
        });
        if (filterval) {
            this.MapServiceService._GridTabData.value.filter((el) => {
                el.IsFiltervalue = el.IsFiltervalue.filter((fel) => {
                    if (fel != filterval) {
                        return fel;
                    }
                });
            });
        }
        // }
        let activeGridTabData = this.MapServiceService._GridTabData.value.filter((el) => {
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
            let map = this.MapServiceService._mapdata.getValue();
            map.overlayMapTypes.clear();
        }
    }


    RemoveTabForTemporaryLayer(nodesData: any) {
        let Id = nodesData.data.Id;
        let parentId = nodesData.parent.data.Id
        let tabdata = this.MapServiceService._GridTabData.value;
        let IsActive: boolean = false;
        let Isparent = this.MapServiceService._GridTabData.value.filter((el) => {
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
                    for (let c = 0; c < el.ListOfChildID.length; c++) {
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
                if (el.treestatus === "Individual" && el.ID == parseInt(Id)) {//el.EnergyParentID == parseInt(parentId) && el.EnergyLayerID == parseInt(Id)
                    for (let c = 0; c < el.ListOfChildID.length; c++) {
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
            for (let i = 0; i < tabdata.length; i++) {
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
                    if ((tabdata[i].ListOfChildID.length == 0 || (/*tabdata[i].parentID == parseInt(parentId) && */ tabdata[i].ID == parseInt(Id)))) {
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
        let filterval = '';
        this.MapServiceService.temporaryLayer.map((el) => {
            if (el.DataSetID == Id) {
                filterval = el.FilterValue;
            }
        });
        if (filterval) {
            this.MapServiceService._GridTabData.value.filter((el) => {
                el.IsFiltervalue = el.IsFiltervalue.filter((fel) => {
                    if (fel != filterval) {
                        return fel;
                    }
                });
            });
        }
        // }
        let activeGridTabData = this.MapServiceService._GridTabData.value.filter((el) => {
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
                this.BindActiveGridData()
        }
        else {
            this.MapServiceService.GridData.getValue().length = 0;
            this.MapServiceService.GridColumns.getValue().length = 0;
            this.MapServiceService.KMLGridData.getValue().length = 0;
            this.MapServiceService.KMLGridcolumns.getValue().length = 0;
            let map = this.MapServiceService._mapdata.getValue();
            map.overlayMapTypes.clear();
        }

    }


    BindActiveGridData1() {
        let TabList = this.MapServiceService._GridTabData.value;
        if (TabList.length == 0) {
            this.MapServiceService.GridData.getValue().length = 0
            this.MapServiceService.GridColumns.getValue().length = 0
        }
        for (let t = 0; t < TabList.length; t++) {
            if (TabList[t].ActiveClass == " active") {
                let UserId = this.AuthServices.getLoggedinUserId();
                this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 100, '', '', '', UserId)
                    .then(data => {
                        let Data: any = data;
                        let Gridcolumns = this.MapServiceService.GenerateColumns(TabList[t].energyLayer[0]);
                        let total = Data.totalFeatures;
                        TabList[t]['totalCount'] = total;
                        this.GridTotal = total;
                        this.MapServiceService.GridData.value.length = 0;
                        this.MapServiceService.GridColumns.value.length = 0;
                        TabList[t].Title += " - Viewing " + total + " of " + total;
                        let ArrayData: any = []
                        if (Data.features.length > 0) {
                            let Ldata = Data.features
                            for (let d of Ldata) {
                                ArrayData.push(d.properties)
                            }
                            Array.prototype.push.apply(this.MapServiceService.GridData.getValue(), ArrayData);
                            Array.prototype.push.apply(this.MapServiceService.GridColumns.getValue(), Gridcolumns);
                        };
                    }).catch(ex => {
                        console.log(ex);
                    })

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
        }
        let Acivetab = TabList.filter((el) => {
            if (el.ActiveClass == " active") {
                return el;
            }
        });
        if (Acivetab.length == 0) {
            this.MapServiceService.GridData.getValue().length = 0
        }
    }
    SetTotalCountOnEnergLayertreevie() {
        let nodeList = [];
        var treeData = this.MapServiceService.TreeNodes.getValue();
        if (treeData) {
            if (treeData != null && treeData.length > 0) {
                for (let i = 0; i < treeData.length; i++) {
                    if (treeData[i].children != undefined && treeData[i].children.length > 0) {
                        for (let j = 0; j < treeData[i].children.length; j++) {
                            if (treeData[i].children[j].children != undefined) {
                                if (treeData[i].children[j].children.length > 0) {
                                    for (let k = 0; k < treeData[i].children[j].children.length; k++) {
                                        if (treeData[i].children[j].children[k].children != undefined) {
                                            if (treeData[i].children[j].children[k].children.length > 0) {
                                                for (let l = 0; l < treeData[i].children[j].children[k].children.length; l++) {
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
    }
    RefreshAG_GridView() {
        if (this.MapServiceService.GridApi.getValue()) {
            let param = this.MapServiceService.GridApi.getValue();
            param.api.purgeInfiniteCache();
        }
    }

    // Backup total count method
    // getTotalCount() {
    //     debugger
    //     try {
    //         var TabList = this.MapServiceService._GridTabData.value;
    //         this.MapServiceService._TreeUI.getValue().treeModel.update();
    //         this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
    //         this.MapServiceService._SharedTreeUI.getValue().treeModel.update();
    //         this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
    //         for (let t = 0; t < TabList.length; t++) {
    //             if (TabList[t].energyLayer[0].UploadFileType && (TabList[t].energyLayer[0].UploadFileType != null || TabList[t].energyLayer[0].UploadFileType != undefined) && (TabList[t].energyLayer[0].UploadFileType.toLowerCase() == ".kml" || TabList[t].energyLayer[0].UploadFileType.toLowerCase() == ".kmz")) {
    //                 continue;
    //             }
    //             setTimeout(() => {
    //                 if (TabList[t]) {
    //                     var defaultfilterlist = [];
    //                     TabList[t].energyLayer.filter((el) => {
    //                         if (el.FilterValue != "" && el.FilterValue != undefined) {
    //                             defaultfilterlist.push(el.FilterValue);
    //                         }
    //                     });
    //                     var default_filter = "";
    //                     if (TabList[t].energyLayer.length > 0 && TabList[t].energyLayer[0].IsFromHomeLookup)
    //                         default_filter = this.MapServiceService.filtervalForHomeLookup(defaultfilterlist);
    //                     else
    //                         default_filter = this.MapServiceService.filterval(defaultfilterlist);
    //                     var Gridfilter = '';
    //                     if (TabList[t].EnergylayersavegridFilter.mapfilterval) {
    //                         Gridfilter = this.MapServiceService.gridfilter([TabList[t].EnergylayersavegridFilter.mapfilterval]);
    //                     }
    //                     if (default_filter == '' && Gridfilter != '') {
    //                         default_filter = '(' + Gridfilter + ')';
    //                     }
    //                     else if (Gridfilter != '' && default_filter != '') {
    //                         default_filter = '(' + Gridfilter + ') and (' + default_filter + ')';
    //                     }
    //                     var cql_Filter = this.setCqlFilter(default_filter, false);
    //                     // this.hidethePaceProcessbar();
    //                     let UserId = this.AuthServices.getLoggedinUserId();
    //                     this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '', UserId)
    //                         .then(data => {
    //                             if (TabList[t]) {
    //                                 var Data: any = data;
    //                                 if (Data["totalFeatures"]) {
    //                                     var total = Data.totalFeatures;
    //                                     if (total) {
    //                                         if (TabList[t]['totalCount']) {
    //                                             TabList[t]['totalCount'] = total;
    //                                         }
    //                                         else { TabList[t]['totalCount'] = total; }
    //                                     }
    //                                     // this.hidethePaceProcessbar();
    //                                     if (TabList[t].treestatus == "GroupLayer") {
    //                                         var ListofInactiveEngid = [];
    //                                         for (let engidex in TabList[t].energyLayer) {
    //                                             let Grpenglayer = TabList[t].energyLayer[engidex];
    //                                             defaultfilterlist = [];
    //                                             defaultfilterlist.push(Grpenglayer.FilterValue);
    //                                             var default_filter = this.MapServiceService.filterval(defaultfilterlist);
    //                                             Gridfilter = '';
    //                                             if (TabList[t].EnergylayersavegridFilter.mapfilterval) {
    //                                                 Gridfilter = this.MapServiceService.gridfilter([TabList[t].EnergylayersavegridFilter.mapfilterval]);
    //                                             }
    //                                             if (default_filter == '' && Gridfilter != '') {
    //                                                 default_filter = '(' + Gridfilter + ')';
    //                                             }
    //                                             else if (Gridfilter != '' && default_filter != '') {
    //                                                 default_filter = '(' + Gridfilter + ') and (' + default_filter + ')';
    //                                             }
    //                                             cql_Filter = this.setCqlFilter(default_filter, true);
    //                                             var nodeList = this.SetTotalCountOnEnergLayertreevie();
    //                                             let UserId = this.AuthServices.getLoggedinUserId();
    //                                             this.httpService._NodegetLayerData(Grpenglayer, 0, 1, cql_Filter, '', '', UserId)
    //                                                 .then(res => {
    //                                                     var Res: any = res;
    //                                                     var SingalayerCount = Res.totalFeatures;
    //                                                     var filterTreeData = nodeList.filter((el) => {
    //                                                         if (el.Id == Grpenglayer.EnergyLayerID) {
    //                                                             if (!el.IsChecked == false) {
    //                                                                 ListofInactiveEngid.push(Grpenglayer.EnergyLayerID);
    //                                                             }
    //                                                             return el;
    //                                                         }
    //                                                     });
    //                                                     // let EnergyTreeNodeList = this.MapServiceService.TreeNodes.getValue();
    //                                                     let privateTreeNodeData = this.MapServiceService.PrivateTreeNode.getValue();
    //                                                     let sharedTreeNodeData = this.MapServiceService._SharedTreeNode.getValue();
    //                                                     let TemporaryTreeNodeData = this.MapServiceService.TemporaryTreeNode.getValue()
    //                                                     // for (let i = 0; i < EnergyTreeNodeList.length; i++) {
    //                                                     // let grpLayer = EnergyTreeNodeList[i];                                                          
    //                                                     // if (Grpenglayer.ParentDataSetID == grpLayer.Id) {
    //                                                     // if (grpLayer.children.length != TabList[t].energyLayer.length) {
    //                                                     if (TabList[t].FeatureType == "EnergyLayer") {
    //                                                         TabList[t].energyLayer.forEach(layer => {
    //                                                             let index = nodeList.findIndex(x => x.Id == layer.EnergyLayerID);
    //                                                             if (index == -1 && ListofInactiveEngid.indexOf(layer.EnergyLayerID) == -1) {
    //                                                                 ListofInactiveEngid.push(layer.EnergyLayerID);
    //                                                             }
    //                                                         });
    //                                                     }
    //                                                     // }
    //                                                     // }
    //                                                     // }

    //                                                     for (let i = 0; i < privateTreeNodeData.length; i++) {
    //                                                         let grpLayer = privateTreeNodeData[i];
    //                                                         grpLayer.children.filter(x => {
    //                                                             if (!x.IsChecked == false) {
    //                                                                 ListofInactiveEngid.push(x.Id);
    //                                                             }
    //                                                         });
    //                                                         if (Grpenglayer.ParentDataSetID == grpLayer.Id) {
    //                                                             if (grpLayer.children.length != TabList[t].energyLayer.length) {
    //                                                                 TabList[t].energyLayer.forEach(layer => {
    //                                                                     let index = grpLayer.children.findIndex(x => x.Id == layer.DataSetID);
    //                                                                     if (index == -1 && ListofInactiveEngid.indexOf(layer.DataSetID) == -1) {
    //                                                                         ListofInactiveEngid.push(layer.DataSetID);
    //                                                                     }
    //                                                                 });
    //                                                             }
    //                                                         }
    //                                                     }
    //                                                     for (let i = 0; i < sharedTreeNodeData.length; i++) {
    //                                                         let grpLayer = sharedTreeNodeData[i];
    //                                                         grpLayer.children.filter(x => {
    //                                                             if (!x.IsChecked == false) {
    //                                                                 ListofInactiveEngid.push(x.Id);
    //                                                             }
    //                                                         });
    //                                                         if (Grpenglayer.ParentDataSetID == grpLayer.Id) {
    //                                                             if (grpLayer.children.length != TabList[t].energyLayer.length) {
    //                                                                 TabList[t].energyLayer.forEach(layer => {
    //                                                                     let index = grpLayer.children.findIndex(x => x.Id == layer.DataSetID);
    //                                                                     if (index == -1 && ListofInactiveEngid.indexOf(layer.DataSetID) == -1) {
    //                                                                         ListofInactiveEngid.push(layer.DataSetID);
    //                                                                     }
    //                                                                 });
    //                                                             }
    //                                                         }
    //                                                     }
    //                                                     for (let i = 0; i < TemporaryTreeNodeData.length; i++) {
    //                                                         let grpLayer = TemporaryTreeNodeData[i];
    //                                                         grpLayer.children.filter(x => {
    //                                                             if (!x.IsChecked == false) {
    //                                                                 ListofInactiveEngid.push(x.Id);
    //                                                             }
    //                                                         });
    //                                                         if (Grpenglayer.ParentDataSetID == grpLayer.Id) {
    //                                                             if (grpLayer.children.length != TabList[t].energyLayer.length) {
    //                                                                 TabList[t].energyLayer.forEach(layer => {
    //                                                                     let index = grpLayer.children.findIndex(x => x.Id == layer.DataSetID);
    //                                                                     if (index == -1 && ListofInactiveEngid.indexOf(layer.DataSetID) == -1) {
    //                                                                         ListofInactiveEngid.push(layer.DataSetID);
    //                                                                     }
    //                                                                 });
    //                                                             }
    //                                                         }
    //                                                     }
    //                                                     var Totalcount = 0
    //                                                     let GrpTotalCount = undefined;
    //                                                     //  if (IscheckedActive) {
    //                                                     TabList[t].energyLayer[engidex]["ViewingCount"] = Res.totalFeatures;
    //                                                     TabList[t].ViewingtotalCount = TabList[t].ViewingtotalCount + SingalayerCount;
    //                                                     if (parseInt(engidex) == (TabList[t].energyLayer.length - 1)) {
    //                                                         // if (grpLayerIndex == (TabList[t].ListOfChildID.length)) {
    //                                                         TabList[t].energyLayer.filter((el) => {
    //                                                             if (el.ViewingCount != "" && el.ViewingCount != undefined) {
    //                                                                 if (ListofInactiveEngid.indexOf(el.EnergyLayerID) == -1) {
    //                                                                     Totalcount = Totalcount + el.ViewingCount;
    //                                                                 }
    //                                                             }
    //                                                         });
    //                                                         if (Totalcount != undefined)
    //                                                             TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing " + Totalcount + " of " + TabList[t]['totalCount'];
    //                                                         GrpTotalCount = Totalcount;
    //                                                     }
    //                                                     // }
    //                                                     // else {
    //                                                     //     TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing " + Totalcount + " of " + TabList[t]['totalCount'];
    //                                                     // }

    //                                                     // -------- For Private Data Total count Display -------------
    //                                                     if (this.MapServiceService.PrivateTreeNode.getValue()) {
    //                                                         privateTreeNodeData.forEach((el) => {
    //                                                             if (el.LayerType = "GroupLayer" && el.Id == Grpenglayer.ParentDataSetID) {
    //                                                                 // for(let ptd=0;ptd<el.children)
    //                                                                 if (GrpTotalCount > -1)
    //                                                                     el["activeCount"] = GrpTotalCount;
    //                                                                 if (el.children) {
    //                                                                     for (let ptd = 0; ptd < el.children.length; ptd++) {
    //                                                                         const element = el.children[ptd];
    //                                                                         if (Grpenglayer.DataSetID == element.Id) {
    //                                                                             element["activeCount"] = SingalayerCount;
    //                                                                         }
    //                                                                     }
    //                                                                 }
    //                                                             }
    //                                                             // if (el.Id == Grpenglayer.DataSetID || el.Id == Grpenglayer.ParentDataSetID) {
    //                                                             // if (el.Id == Grpenglayer.ParentDataSetID && el.id) {
    //                                                             //     return el;
    //                                                             // }

    //                                                         });
    //                                                         setTimeout(() => {
    //                                                             this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
    //                                                         }, 500);
    //                                                         // if (filterPrivateTreeData.length == 1) {
    //                                                         //     // filterPrivateTreeData[0]["activeCount"] = SingalayerCount;
    //                                                         //     if (GrpTotalCount != undefined || GrpTotalCount > -1)
    //                                                         //         filterPrivateTreeData[0]["activeCount"] = GrpTotalCount;
    //                                                         //     filterPrivateTreeData[0].children[engidex]["activeCount"] = SingalayerCount;
    //                                                         // }
    //                                                     }

    //                                                     // -------- For Shared Data Total count Display -------------
    //                                                     if (this.MapServiceService._SharedTreeNode.getValue()) {
    //                                                         // let filterSharedTreeData = sharedTreeNodeData.filter((el) => {
    //                                                         //     if (el.Id == Grpenglayer.ParentDataSetID) {
    //                                                         //         return el;
    //                                                         //     }
    //                                                         // });
    //                                                         // if (filterSharedTreeData.length == 1) {
    //                                                         //     if (GrpTotalCount != undefined || GrpTotalCount > -1)
    //                                                         //         filterSharedTreeData[0]["activeCount"] = GrpTotalCount;
    //                                                         //     filterSharedTreeData[0].children[engidex]["activeCount"] = SingalayerCount;
    //                                                         // }
    //                                                         sharedTreeNodeData.forEach((el) => {
    //                                                             if (el.LayerType = "GroupLayer" && el.Id == Grpenglayer.ParentDataSetID) {
    //                                                                 // for(let ptd=0;ptd<el.children)
    //                                                                 if (GrpTotalCount > -1)
    //                                                                     el["activeCount"] = GrpTotalCount;
    //                                                                 if (el.children) {
    //                                                                     for (let std = 0; std < el.children.length; std++) {
    //                                                                         const element = el.children[std];
    //                                                                         if (Grpenglayer.DataSetID == element.Id) {
    //                                                                             element["activeCount"] = SingalayerCount;
    //                                                                         }
    //                                                                     }
    //                                                                 }
    //                                                             }
    //                                                             // if (el.Id == Grpenglayer.DataSetID || el.Id == Grpenglayer.ParentDataSetID) {
    //                                                             // if (el.Id == Grpenglayer.ParentDataSetID && el.id) {
    //                                                             //     return el;
    //                                                             // }

    //                                                         });
    //                                                     }

    //                                                     // -------- For Temporary Data Total count Display -------------
    //                                                     if (this.MapServiceService.TemporaryTreeNode.getValue()) {
    //                                                         // let temporaryTreeNodeData = this.MapServiceService.TemporaryTreeNode.getValue();
    //                                                         // let filterTemporaryTreeData = temporaryTreeNodeData.filter((el) => {
    //                                                         //     if (el.Id == Grpenglayer.ParentDataSetID && Grpenglayer.TreeStatus == "GroupLayer") {
    //                                                         //         return el;
    //                                                         //     }
    //                                                         // });
    //                                                         // if (filterTemporaryTreeData.length == 1) {
    //                                                         //     if (filterTemporaryTreeData[0].Id == "200008") {
    //                                                         //         // if (TempGroupLayerCount != undefined)
    //                                                         //         let totalCountGrpLayer = 0;
    //                                                         //         TabList[t].energyLayer.forEach(x => {
    //                                                         //             if (x && x.ViewingCount && x.ViewingCount > 0)
    //                                                         //                 totalCountGrpLayer = totalCountGrpLayer + x.ViewingCount;
    //                                                         //         });
    //                                                         //         TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing " + totalCountGrpLayer + " of " + TabList[t]['totalCount'];
    //                                                         //         filterTemporaryTreeData[0]["activeCount"] = totalCountGrpLayer;
    //                                                         //     } else {
    //                                                         //         filterTemporaryTreeData[0]["activeCount"] = Totalcount;
    //                                                         //     }
    //                                                         // }
    //                                                         TemporaryTreeNodeData.forEach((el) => {
    //                                                             if (el.LayerType = "GroupLayer" && el.Id == Grpenglayer.ParentDataSetID) {
    //                                                                 // for(let ptd=0;ptd<el.children)
    //                                                                 if (GrpTotalCount > -1)
    //                                                                     el["activeCount"] = GrpTotalCount;
    //                                                                 if (el.children) {
    //                                                                     for (let std = 0; std < el.children.length; std++) {
    //                                                                         const element = el.children[std];
    //                                                                         if (Grpenglayer.DataSetID == element.Id) {
    //                                                                             element["activeCount"] = SingalayerCount;
    //                                                                         }
    //                                                                     }
    //                                                                 }
    //                                                             }
    //                                                             // if (el.Id == Grpenglayer.DataSetID || el.Id == Grpenglayer.ParentDataSetID) {
    //                                                             // if (el.Id == Grpenglayer.ParentDataSetID && el.id) {
    //                                                             //     return el;
    //                                                             // }

    //                                                         });

    //                                                     }
    //                                                     this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
    //                                                     // -------- For Energy Data Total count Display -------------
    //                                                     if (this.MapServiceService.TreeNodes.getValue()) {
    //                                                         if (nodeList.length > 0) {
    //                                                             if (filterTreeData.length == 1) {
    //                                                                 filterTreeData[0]["activeCount"] = SingalayerCount;
    //                                                             }
    //                                                         }
    //                                                         this.MapServiceService._TreeUI.getValue().treeModel.update();
    //                                                     }
    //                                                 }).catch(ex => {
    //                                                     console.log(ex);
    //                                                 })
    //                                         }

    //                                     } else {
    //                                         var defaultfilterlist = [];
    //                                         TabList[t].energyLayer.filter((el) => {
    //                                             if (el.FilterValue != "" && el.FilterValue != undefined) {
    //                                                 defaultfilterlist.push(el.FilterValue);
    //                                             }
    //                                         });
    //                                         let default_filter = this.MapServiceService.filterval(defaultfilterlist);
    //                                         let Gridfilter = '';
    //                                         if (TabList[t].EnergylayersavegridFilter.mapfilterval) {
    //                                             Gridfilter = this.MapServiceService.gridfilter([TabList[t].EnergylayersavegridFilter.mapfilterval]);
    //                                         }
    //                                         if (default_filter == '' && Gridfilter != '') {
    //                                             default_filter = '(' + Gridfilter + ')';
    //                                         }
    //                                         else if (Gridfilter != '' && default_filter != '') {
    //                                             default_filter = '(' + Gridfilter + ') and (' + default_filter + ')';
    //                                         }
    //                                         cql_Filter = this.setCqlFilter(default_filter, true);
    //                                         let UserId = this.AuthServices.getLoggedinUserId();
    //                                         this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '', UserId)
    //                                             .then(res => {
    //                                                 var Res: any = res;
    //                                                 var Activetotal = Res.totalFeatures;
    //                                                 if (Activetotal != undefined) {
    //                                                     if (TabList[t])
    //                                                         TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing " + Activetotal + " of " + TabList[t]['totalCount'];
    //                                                 }

    //                                                 // -------- For Private Data Total count Display -------------
    //                                                 if (this.MapServiceService.PrivateTreeNode.getValue()) {
    //                                                     var privateTreeNodeData = this.MapServiceService.PrivateTreeNode.getValue();
    //                                                     var filterPrivateTreeData = privateTreeNodeData.filter((el) => {
    //                                                         if (el.Id == TabList[t].energyLayer[0].DataSetID) {
    //                                                             return el;
    //                                                         }
    //                                                     });
    //                                                     if (filterPrivateTreeData.length == 1 && Activetotal != undefined) {
    //                                                         filterPrivateTreeData[0]["activeCount"] = Activetotal;
    //                                                     }
    //                                                     setTimeout(() => {
    //                                                         this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
    //                                                     }, 500);

    //                                                 }

    //                                                 // -------- For Shared Data Total count Display -------------
    //                                                 if (this.MapServiceService._SharedTreeNode.getValue()) {
    //                                                     var sharedTreeNodeData = this.MapServiceService._SharedTreeNode.getValue();
    //                                                     var filterSharedTreeData = sharedTreeNodeData.filter((el) => {
    //                                                         if (el.Id == TabList[t].energyLayer[0].DataSetID) {
    //                                                             return el;
    //                                                         }
    //                                                     });
    //                                                     if (filterSharedTreeData.length == 1 && Activetotal != undefined) {
    //                                                         filterSharedTreeData[0]["activeCount"] = Activetotal;
    //                                                     }
    //                                                     setTimeout(() => {
    //                                                         this.MapServiceService._SharedTreeUI.getValue().treeModel.update();
    //                                                     }, 500);

    //                                                 }

    //                                                 // -------- For Temporary Data Total count Display -------------
    //                                                 if (this.MapServiceService.TemporaryTreeNode.getValue()) {
    //                                                     var temporaryTreeNodeData = this.MapServiceService.TemporaryTreeNode.getValue();
    //                                                     var filterTemporaryTreeData = temporaryTreeNodeData.filter((el) => {
    //                                                         if (el.Id == TabList[t].energyLayer[0].DataSetID) {
    //                                                             return el;
    //                                                         }
    //                                                     });
    //                                                     if (filterTemporaryTreeData.length == 1 && Activetotal != undefined) {
    //                                                         filterTemporaryTreeData[0]["activeCount"] = Activetotal;
    //                                                     }
    //                                                     setTimeout(() => {
    //                                                         this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
    //                                                     }, 500);

    //                                                 }


    //                                                 // -------- For Energy Data Total count Display -------------
    //                                                 if (this.MapServiceService.TreeNodes.getValue()) {
    //                                                     var nodeList = this.SetTotalCountOnEnergLayertreevie();
    //                                                     setTimeout(() => {
    //                                                         if (nodeList.length > 0) {
    //                                                             var filterTreeData = nodeList.filter((el) => {
    //                                                                 if (TabList[t] && el.Id == TabList[t].energyLayer[0].EnergyLayerID) {
    //                                                                     return el;
    //                                                                 }
    //                                                             });
    //                                                             if (filterTreeData.length == 1 && Activetotal != undefined) {
    //                                                                 filterTreeData[0]["activeCount"] = Activetotal;
    //                                                             }
    //                                                         }
    //                                                         setTimeout(() => {
    //                                                             this.MapServiceService._TreeUI.getValue().treeModel.update();
    //                                                         }, 500);

    //                                                     }, 500);
    //                                                 }
    //                                             }).catch(ex => {
    //                                                 console.log(ex);
    //                                             });
    //                                     }

    //                                 }
    //                                 else {
    //                                     TabList[t]['totalCount'] = 0;
    //                                     TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing 0 of 0";
    //                                     console.log(Data);
    //                                 }
    //                             }

    //                         }).catch(ex => {
    //                             console.log(ex);
    //                         });
    //                 }
    //             }, 500);
    //         }
    //     } catch (error) { console.log(error) }
    // }

    getTotalCount() {
        let TabList = this.MapServiceService._GridTabData.value;
        if (TabList.length > 0) {
            setTimeout(() => {
                try {
                    this.MapServiceService._TreeUI.getValue().treeModel.update();
                    this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
                    this.MapServiceService._SharedTreeUI.getValue().treeModel.update();
                    this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
                    let listOfLayersWithFilter = this.getLayersWithFilterTotalCount(TabList);
                    if (listOfLayersWithFilter.length > 0) {
                        if (TabList.length > 1 && JSON.stringify(this.MapServiceService.recentLayersCountRequest) === JSON.stringify(listOfLayersWithFilter))
                            return
                        this.MapServiceService.recentLayersCountRequest = listOfLayersWithFilter;
                        this.httpService._NodeGeoserverGetTotalCountListOfLayers(listOfLayersWithFilter).subscribe(data => {
                            if (data._Issuccess) {
                                let result = data.result;
                                if (result.length > 0) {
                                    for (let layerCount of result) {
                                        if (layerCount.TreeStatus == "GroupLayer") {
                                            let selectedTab = TabList.filter(item => layerCount.ParentId == item.parentID);
                                            if (selectedTab.length == 1) {
                                                selectedTab = selectedTab[0];
                                                if (layerCount.CountType == "ActiveCount") {
                                                    let ListofInactiveEngid = [];
                                                    let isEnergyLayer = false;
                                                    let isPrivateLayer = false;
                                                    let isSharedLayer = false;
                                                    let isTemporaryLayer = false;
                                                    for (let el of selectedTab.energyLayer) {
                                                        if (!isEnergyLayer && !isPrivateLayer && !isSharedLayer && !isTemporaryLayer) {
                                                            let checkLayer = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(el.EnergyLayerID);
                                                            if (!checkLayer) {
                                                                checkLayer = this.MapServiceService._PrivateTreeUI.getValue().treeModel.getNodeById(el.EnergyLayerID);
                                                                if (!checkLayer) {
                                                                    checkLayer = this.MapServiceService._SharedTreeUI.getValue().treeModel.getNodeById(el.EnergyLayerID);
                                                                    if (!checkLayer) {
                                                                        checkLayer = this.MapServiceService._TemporaryTreeUI.getValue().treeModel.getNodeById(el.EnergyLayerID);
                                                                        if (checkLayer)
                                                                            isTemporaryLayer = true;
                                                                    }
                                                                    else
                                                                        isSharedLayer = true;
                                                                }
                                                                else
                                                                    isPrivateLayer = true;
                                                            }
                                                            else
                                                                isEnergyLayer = true;

                                                        }
                                                        else
                                                            break;
                                                    }


                                                    let singalActiveLayerCount = layerCount.Count;
                                                    if (isEnergyLayer) {  //--------For Energy Data count Display-------------
                                                        let nodeList = this.SetTotalCountOnEnergLayertreevie();
                                                        let filterTreeData = nodeList.filter((el) => {
                                                            if (el.Id == layerCount.LayerId) {
                                                                return el;
                                                            }
                                                        });
                                                        nodeList.map((el) => {
                                                            if (!el.IsChecked == false) {
                                                                ListofInactiveEngid.push(el.Id);
                                                            }
                                                        });
                                                        if (selectedTab.FeatureType == "EnergyLayer") {
                                                            selectedTab.energyLayer.forEach(layer => {
                                                                let index = nodeList.findIndex(x => x.Id == layer.EnergyLayerID);
                                                                if (index == -1 && ListofInactiveEngid.indexOf(layer.EnergyLayerID) == -1) {
                                                                    ListofInactiveEngid.push(layer.EnergyLayerID);
                                                                }
                                                            });
                                                        }
                                                        let selectedGroupEnergyLayer = selectedTab.energyLayer.filter(index => index.EnergyLayerID == layerCount.LayerId);
                                                        if (selectedGroupEnergyLayer.length == 1)
                                                            selectedGroupEnergyLayer = selectedGroupEnergyLayer[0];
                                                        let Totalcount = 0
                                                        let GrpTotalCount = undefined;
                                                        selectedGroupEnergyLayer["ViewingCount"] = singalActiveLayerCount;
                                                        selectedTab.ViewingtotalCount = selectedTab.ViewingtotalCount + singalActiveLayerCount;

                                                        selectedTab.energyLayer.filter((el) => {
                                                            if (el.ViewingCount && el.ViewingCount != "") {
                                                                if (ListofInactiveEngid.indexOf(el.EnergyLayerID) == -1) {
                                                                    Totalcount = Totalcount + el.ViewingCount;
                                                                }
                                                            }
                                                        });
                                                        if (Totalcount != undefined)
                                                            selectedTab.Title = selectedTab['DisplayName'] + " - Viewing " + Totalcount + " of " + selectedTab['totalCount'];
                                                        if (Totalcount == 0)
                                                            this.RefreshAG_GridView();
                                                        GrpTotalCount = Totalcount;

                                                        if (this.MapServiceService.TreeNodes.getValue()) {
                                                            if (nodeList.length > 0) {
                                                                if (filterTreeData.length == 1) {
                                                                    filterTreeData[0]["activeCount"] = singalActiveLayerCount;
                                                                }
                                                            }
                                                            this.MapServiceService._TreeUI.getValue().treeModel.update();
                                                        }
                                                    }
                                                    else if (isPrivateLayer) {  //--------For Private Data count Display-------------
                                                        let privateTreeNodeData = this.MapServiceService.PrivateTreeNode.getValue();
                                                        let selectedGroupPrivateLayer = selectedTab.energyLayer.filter(index => index.EnergyLayerID == layerCount.LayerId);
                                                        if (selectedGroupPrivateLayer.length == 1)
                                                            selectedGroupPrivateLayer = selectedGroupPrivateLayer[0];


                                                        let selectedNode = privateTreeNodeData.filter((x) => {
                                                            if (x.Id == selectedGroupPrivateLayer.ParentDataSetID)
                                                                return x;
                                                        });
                                                        if (selectedNode.length == 1)
                                                            selectedNode = selectedNode[0];
                                                        selectedNode.children.map(x => {
                                                            if (x.IsChecked != false) {
                                                                ListofInactiveEngid.push(x.Id);
                                                            }
                                                        });

                                                        if (selectedNode.children.length != selectedTab.energyLayer.length) {
                                                            selectedTab.energyLayer.forEach(layer => {
                                                                let index = selectedNode.children.findIndex(x => x.Id == layer.DataSetID);
                                                                if (index == -1 && ListofInactiveEngid.indexOf(layer.DataSetID) == -1) {
                                                                    ListofInactiveEngid.push(layer.DataSetID);
                                                                }
                                                            });
                                                        }



                                                        let Totalcount = 0;
                                                        let GrpTotalCount = undefined;
                                                        selectedGroupPrivateLayer["ViewingCount"] = singalActiveLayerCount;
                                                        selectedTab.ViewingtotalCount = selectedTab.ViewingtotalCount + singalActiveLayerCount;
                                                        selectedTab.energyLayer.filter((el) => {
                                                            if (el.ViewingCount && el.ViewingCount != "") {
                                                                if (ListofInactiveEngid.indexOf(el.EnergyLayerID) == -1) {
                                                                    Totalcount = Totalcount + el.ViewingCount;
                                                                }
                                                            }
                                                        });
                                                        if (Totalcount != undefined)
                                                            selectedTab.Title = selectedTab['DisplayName'] + " - Viewing " + Totalcount + " of " + selectedTab['totalCount'];
                                                        if (Totalcount == 0)
                                                            this.RefreshAG_GridView();
                                                        GrpTotalCount = Totalcount;

                                                        if (this.MapServiceService.PrivateTreeNode.getValue()) {
                                                            selectedNode["activeCount"] = GrpTotalCount;
                                                            let selectedNodeChildren = selectedNode.children.filter((x) => {
                                                                if (x.Id == selectedGroupPrivateLayer.DataSetID)
                                                                    return x;
                                                            });
                                                            if (selectedNodeChildren.length == 1)
                                                                selectedNodeChildren = selectedNodeChildren[0];
                                                            selectedNodeChildren["activeCount"] = singalActiveLayerCount;
                                                            setTimeout(() => {
                                                                this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
                                                            }, 500);
                                                        }
                                                    }
                                                    else if (isSharedLayer) {  //--------For Shared Data count Display-------------
                                                        let sharedTreeNodeData = this.MapServiceService._SharedTreeNode.getValue();
                                                        let selectedGroupSharedLayer = selectedTab.energyLayer.filter(index => index.EnergyLayerID == layerCount.LayerId);
                                                        if (selectedGroupSharedLayer.length == 1)
                                                            selectedGroupSharedLayer = selectedGroupSharedLayer[0];


                                                        let selectedNode = sharedTreeNodeData.filter((x) => {
                                                            if (x.Id == selectedGroupSharedLayer.ParentDataSetID)
                                                                return x;
                                                        });
                                                        if (selectedNode.length == 1)
                                                            selectedNode = selectedNode[0];
                                                        selectedNode.children.map(x => {
                                                            if (x.IsChecked != false) {
                                                                ListofInactiveEngid.push(x.Id);
                                                            }
                                                        });
                                                        if (selectedNode.children.length != selectedTab.energyLayer.length) {
                                                            selectedTab.energyLayer.forEach(layer => {
                                                                let index = selectedNode.children.findIndex(x => x.Id == layer.DataSetID);
                                                                if (index == -1 && ListofInactiveEngid.indexOf(layer.DataSetID) == -1) {
                                                                    ListofInactiveEngid.push(layer.DataSetID);
                                                                }
                                                            });
                                                        }
                                                        let Totalcount = 0;
                                                        let GrpTotalCount = undefined;
                                                        selectedGroupSharedLayer["ViewingCount"] = singalActiveLayerCount;
                                                        selectedTab.ViewingtotalCount = selectedTab.ViewingtotalCount + singalActiveLayerCount;
                                                        selectedTab.energyLayer.filter((el) => {
                                                            if (el.ViewingCount && el.ViewingCount != "") {
                                                                if (ListofInactiveEngid.indexOf(el.EnergyLayerID) == -1) {
                                                                    Totalcount = Totalcount + el.ViewingCount;
                                                                }
                                                            }
                                                        });
                                                        if (Totalcount != undefined)
                                                            selectedTab.Title = selectedTab['DisplayName'] + " - Viewing " + Totalcount + " of " + selectedTab['totalCount'];
                                                        if (Totalcount == 0)
                                                            this.RefreshAG_GridView();
                                                        GrpTotalCount = Totalcount;

                                                        if (this.MapServiceService._SharedTreeNode.getValue()) {
                                                            selectedNode["activeCount"] = GrpTotalCount;
                                                            let selectedNodeChildren = selectedNode.children.filter((x) => {
                                                                if (x.Id == selectedGroupSharedLayer.DataSetID)
                                                                    return x;
                                                            });
                                                            if (selectedNodeChildren.length == 1)
                                                                selectedNodeChildren = selectedNodeChildren[0];
                                                            selectedNodeChildren["activeCount"] = singalActiveLayerCount;
                                                            setTimeout(() => {
                                                                this.MapServiceService._SharedTreeUI.getValue().treeModel.update();
                                                            }, 500);
                                                        }
                                                    }
                                                    else if (isTemporaryLayer) {  //--------For Temporary Data count Display-------------
                                                        let temporaryTreeNodeData = this.MapServiceService.TemporaryTreeNode.getValue();
                                                        let selectedGroupTemporaryLayer = selectedTab.energyLayer.filter(index => index.EnergyLayerID == layerCount.LayerId);
                                                        if (selectedGroupTemporaryLayer.length == 1)
                                                            selectedGroupTemporaryLayer = selectedGroupTemporaryLayer[0];


                                                        let selectedNode = temporaryTreeNodeData.filter((x) => {
                                                            if (x.Id == selectedGroupTemporaryLayer.ParentDataSetID)
                                                                return x;
                                                        });
                                                        if (selectedNode.length == 1)
                                                            selectedNode = selectedNode[0];
                                                        selectedNode.children.map(x => {
                                                            if (x.IsChecked != false) {
                                                                ListofInactiveEngid.push(x.Id);
                                                            }
                                                        });
                                                        if (selectedNode.children.length != selectedTab.energyLayer.length) {
                                                            selectedTab.energyLayer.forEach(layer => {
                                                                let index = selectedNode.children.findIndex(x => x.Id == layer.DataSetID);
                                                                if (index == -1 && ListofInactiveEngid.indexOf(layer.DataSetID) == -1) {
                                                                    ListofInactiveEngid.push(layer.DataSetID);
                                                                }
                                                            });
                                                        }
                                                        let Totalcount = 0;
                                                        let GrpTotalCount = undefined;
                                                        selectedGroupTemporaryLayer["ViewingCount"] = singalActiveLayerCount;
                                                        selectedTab.ViewingtotalCount = selectedTab.ViewingtotalCount + singalActiveLayerCount;
                                                        selectedTab.energyLayer.filter((el) => {
                                                            if (el.ViewingCount && el.ViewingCount != "") {
                                                                if (ListofInactiveEngid.indexOf(el.EnergyLayerID) == -1) {
                                                                    Totalcount = Totalcount + el.ViewingCount;
                                                                }
                                                            }
                                                        });
                                                        if (Totalcount != undefined)
                                                            selectedTab.Title = selectedTab['DisplayName'] + " - Viewing " + Totalcount + " of " + selectedTab['totalCount'];
                                                        if (Totalcount == 0)
                                                            this.RefreshAG_GridView();
                                                        GrpTotalCount = Totalcount;

                                                        if (this.MapServiceService.TemporaryTreeNode.getValue()) {
                                                            selectedNode["activeCount"] = GrpTotalCount;
                                                            let selectedNodeChildren = selectedNode.children.filter((x) => {
                                                                if (x.Id == selectedGroupTemporaryLayer.DataSetID)
                                                                    return x;
                                                            });
                                                            if (selectedNodeChildren.length == 1)
                                                                selectedNodeChildren = selectedNodeChildren[0];
                                                            selectedNodeChildren["activeCount"] = singalActiveLayerCount;
                                                            setTimeout(() => {
                                                                this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
                                                            }, 500);
                                                        }
                                                    }
                                                }
                                                else {
                                                    let totalCount = layerCount.Count;
                                                    if (selectedTab['totalCount']) {
                                                        selectedTab['totalCount'] = totalCount;
                                                    }
                                                    else { selectedTab['totalCount'] = totalCount; }
                                                    if (!totalCount) {
                                                        selectedTab.Title = selectedTab['DisplayName'] + " - Viewing 0 of 0";
                                                        this.RefreshAG_GridView();
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            let selectedTab = TabList.filter(item => layerCount.LayerId == item.ID);
                                            if (selectedTab.length == 1) {
                                                selectedTab = selectedTab[0];
                                                if (layerCount.CountType == "ActiveCount") {
                                                    let Activetotal = layerCount.Count;
                                                    if (selectedTab)
                                                        selectedTab.Title = selectedTab['DisplayName'] + " - Viewing " + Activetotal + " of " + selectedTab['totalCount'];


                                                    // -------- For Energy Data Total count Display -------------
                                                    if (this.MapServiceService.TreeNodes.getValue()) {
                                                        let nodeList = this.SetTotalCountOnEnergLayertreevie();
                                                        if (nodeList.length > 0) {
                                                            let filterTreeData = nodeList.filter((el) => {
                                                                if (selectedTab && el.Id == selectedTab.energyLayer[0].EnergyLayerID) {
                                                                    return el;
                                                                }
                                                            });
                                                            if (filterTreeData.length == 1 && Activetotal != undefined) {
                                                                filterTreeData[0]["activeCount"] = Activetotal;
                                                            }
                                                        }
                                                        setTimeout(() => {
                                                            this.MapServiceService._TreeUI.getValue().treeModel.update();
                                                        }, 500);
                                                    }

                                                    // --------For Private Data Total count Display-------------
                                                    if (this.MapServiceService.PrivateTreeNode.getValue()) {
                                                        let privateTreeNodeData = this.MapServiceService.PrivateTreeNode.getValue();
                                                        let filterPrivateTreeData = privateTreeNodeData.filter((el) => {
                                                            if (selectedTab && el.Id == selectedTab.energyLayer[0].DataSetID) {
                                                                return el;
                                                            }
                                                        });
                                                        if (filterPrivateTreeData.length == 1 && Activetotal != undefined) {
                                                            filterPrivateTreeData[0]["activeCount"] = Activetotal;
                                                        }
                                                        setTimeout(() => {
                                                            this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
                                                        }, 500);

                                                    }


                                                    // -------- For Shared Data Total count Display -------------
                                                    if (this.MapServiceService._SharedTreeNode.getValue()) {
                                                        var sharedTreeNodeData = this.MapServiceService._SharedTreeNode.getValue();
                                                        var filterSharedTreeData = sharedTreeNodeData.filter((el) => {
                                                            if (selectedTab && el.Id == selectedTab.energyLayer[0].DataSetID) {
                                                                return el;
                                                            }
                                                        });
                                                        if (filterSharedTreeData.length == 1 && Activetotal != undefined) {
                                                            filterSharedTreeData[0]["activeCount"] = Activetotal;
                                                        }
                                                        setTimeout(() => {
                                                            this.MapServiceService._SharedTreeUI.getValue().treeModel.update();
                                                        }, 500);

                                                    }

                                                    // -------- For Temporary Data Total count Display -------------
                                                    if (this.MapServiceService.TemporaryTreeNode.getValue()) {
                                                        var temporaryTreeNodeData = this.MapServiceService.TemporaryTreeNode.getValue();
                                                        var filterTemporaryTreeData = temporaryTreeNodeData.filter((el) => {
                                                            if (selectedTab && el.Id == selectedTab.energyLayer[0].DataSetID) {
                                                                return el;
                                                            }
                                                        });
                                                        if (filterTemporaryTreeData.length == 1 && Activetotal != undefined) {
                                                            filterTemporaryTreeData[0]["activeCount"] = Activetotal;
                                                        }
                                                        setTimeout(() => {
                                                            this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
                                                        }, 500);

                                                    }

                                                    if (!Activetotal) {
                                                        selectedTab.Title = selectedTab['DisplayName'] + " - Viewing 0 of " + selectedTab['totalCount'];
                                                        this.RefreshAG_GridView();
                                                    }
                                                }
                                                else {
                                                    let totalCount = layerCount.Count;
                                                    if (selectedTab['totalCount']) {
                                                        selectedTab['totalCount'] = totalCount;
                                                    }
                                                    else { selectedTab['totalCount'] = totalCount; }
                                                    if (!totalCount) {
                                                        let selectedCount = result.filter(item => item.LayerId == selectedTab.ID && item.CountType == "ActiveCount");
                                                        if (selectedCount.length == 1) {
                                                            selectedCount = selectedCount[0];
                                                            let activeCount = selectedCount.Count;
                                                            selectedTab.Title = selectedTab['DisplayName'] + " - Viewing " + activeCount + " of 0";
                                                            this.RefreshAG_GridView();
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }, error => {
                            console.log(error);
                        });
                    }
                    // for (let t = 0; t < TabList.length; t++) {
                    //     if (TabList[t]) {
                    //         // this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '', UserId)
                    //         //     .then(data => {
                    //         //if (TabList[t]) {
                    //         //var Data: any = data;
                    //         //if (Data["totalFeatures"]) {
                    //         // var total = Data.totalFeatures;
                    //         // if (total) {
                    //         //     if (TabList[t]['totalCount']) {
                    //         //         TabList[t]['totalCount'] = total;
                    //         //     }
                    //         //     else { TabList[t]['totalCount'] = total; }
                    //         // }
                    //         // this.hidethePaceProcessbar();
                    //         // if (TabList[t].treestatus == "GroupLayer") {
                    //         //     var ListofInactiveEngid = [];
                    //         //     for (let engidex in TabList[t].energyLayer) {
                    //         //         let Grpenglayer = TabList[t].energyLayer[engidex];
                    //         //         defaultfilterlist = [];
                    //         //         defaultfilterlist.push(Grpenglayer.FilterValue);
                    //         //         var default_filter = this.MapServiceService.filterval(defaultfilterlist);
                    //         //         Gridfilter = '';
                    //         //         if (TabList[t].EnergylayersavegridFilter.mapfilterval) {
                    //         //             Gridfilter = this.MapServiceService.gridfilter([TabList[t].EnergylayersavegridFilter.mapfilterval]);
                    //         //         }
                    //         //         if (default_filter == '' && Gridfilter != '') {
                    //         //             default_filter = '(' + Gridfilter + ')';
                    //         //         }
                    //         //         else if (Gridfilter != '' && default_filter != '') {
                    //         //             default_filter = '(' + Gridfilter + ') and (' + default_filter + ')';
                    //         //         }
                    //         //         cql_Filter = this.setCqlFilter(default_filter, true);
                    //         //         var nodeList = this.SetTotalCountOnEnergLayertreevie();
                    //         //         let UserId = this.AuthServices.getLoggedinUserId();
                    //         //         this.httpService._NodegetLayerData(Grpenglayer, 0, 1, cql_Filter, '', '', UserId)
                    //         //             .then(res => {
                    //         //                 var Res: any = res;
                    //         //                 var SingalayerCount = Res.totalFeatures;
                    //         //                 var filterTreeData = nodeList.filter((el) => {
                    //         //                     if (el.Id == Grpenglayer.EnergyLayerID) {
                    //         //                         if (!el.IsChecked == false) {
                    //         //                             ListofInactiveEngid.push(Grpenglayer.EnergyLayerID);
                    //         //                         }
                    //         //                         return el;
                    //         //                     }
                    //         //                 });
                    //         //                 // let EnergyTreeNodeList = this.MapServiceService.TreeNodes.getValue();
                    //         //                 let privateTreeNodeData = this.MapServiceService.PrivateTreeNode.getValue();
                    //         //                 let sharedTreeNodeData = this.MapServiceService._SharedTreeNode.getValue();
                    //         //                 let TemporaryTreeNodeData = this.MapServiceService.TemporaryTreeNode.getValue()
                    //         //                 // for (let i = 0; i < EnergyTreeNodeList.length; i++) {
                    //         //                 // let grpLayer = EnergyTreeNodeList[i];                                                          
                    //         //                 // if (Grpenglayer.ParentDataSetID == grpLayer.Id) {
                    //         //                 // if (grpLayer.children.length != TabList[t].energyLayer.length) {
                    //         //                 if (TabList[t].FeatureType == "EnergyLayer") {
                    //         //                     TabList[t].energyLayer.forEach(layer => {
                    //         //                         let index = nodeList.findIndex(x => x.Id == layer.EnergyLayerID);
                    //         //                         if (index == -1 && ListofInactiveEngid.indexOf(layer.EnergyLayerID) == -1) {
                    //         //                             ListofInactiveEngid.push(layer.EnergyLayerID);
                    //         //                         }
                    //         //                     });
                    //         //                 }
                    //         //                 // }
                    //         //                 // }
                    //         //                 // }

                    //         //                 for (let i = 0; i < privateTreeNodeData.length; i++) {
                    //         //                     let grpLayer = privateTreeNodeData[i];
                    //         //                     grpLayer.children.filter(x => {
                    //         //                         if (!x.IsChecked == false) {
                    //         //                             ListofInactiveEngid.push(x.Id);
                    //         //                         }
                    //         //                     });
                    //         //                     if (Grpenglayer.ParentDataSetID == grpLayer.Id) {
                    //         //                         if (grpLayer.children.length != TabList[t].energyLayer.length) {
                    //         //                             TabList[t].energyLayer.forEach(layer => {
                    //         //                                 let index = grpLayer.children.findIndex(x => x.Id == layer.DataSetID);
                    //         //                                 if (index == -1 && ListofInactiveEngid.indexOf(layer.DataSetID) == -1) {
                    //         //                                     ListofInactiveEngid.push(layer.DataSetID);
                    //         //                                 }
                    //         //                             });
                    //         //                         }
                    //         //                     }
                    //         //                 }
                    //         //                 for (let i = 0; i < sharedTreeNodeData.length; i++) {
                    //         //                     let grpLayer = sharedTreeNodeData[i];
                    //         //                     grpLayer.children.filter(x => {
                    //         //                         if (!x.IsChecked == false) {
                    //         //                             ListofInactiveEngid.push(x.Id);
                    //         //                         }
                    //         //                     });
                    //         //                     if (Grpenglayer.ParentDataSetID == grpLayer.Id) {
                    //         //                         if (grpLayer.children.length != TabList[t].energyLayer.length) {
                    //         //                             TabList[t].energyLayer.forEach(layer => {
                    //         //                                 let index = grpLayer.children.findIndex(x => x.Id == layer.DataSetID);
                    //         //                                 if (index == -1 && ListofInactiveEngid.indexOf(layer.DataSetID) == -1) {
                    //         //                                     ListofInactiveEngid.push(layer.DataSetID);
                    //         //                                 }
                    //         //                             });
                    //         //                         }
                    //         //                     }
                    //         //                 }
                    //         //                 for (let i = 0; i < TemporaryTreeNodeData.length; i++) {
                    //         //                     let grpLayer = TemporaryTreeNodeData[i];
                    //         //                     grpLayer.children.filter(x => {
                    //         //                         if (!x.IsChecked == false) {
                    //         //                             ListofInactiveEngid.push(x.Id);
                    //         //                         }
                    //         //                     });
                    //         //                     if (Grpenglayer.ParentDataSetID == grpLayer.Id) {
                    //         //                         if (grpLayer.children.length != TabList[t].energyLayer.length) {
                    //         //                             TabList[t].energyLayer.forEach(layer => {
                    //         //                                 let index = grpLayer.children.findIndex(x => x.Id == layer.DataSetID);
                    //         //                                 if (index == -1 && ListofInactiveEngid.indexOf(layer.DataSetID) == -1) {
                    //         //                                     ListofInactiveEngid.push(layer.DataSetID);
                    //         //                                 }
                    //         //                             });
                    //         //                         }
                    //         //                     }
                    //         //                 }
                    //         //                 var Totalcount = 0
                    //         //                 let GrpTotalCount = undefined;
                    //         //                 //  if (IscheckedActive) {
                    //         //                 TabList[t].energyLayer[engidex]["ViewingCount"] = Res.totalFeatures;
                    //         //                 TabList[t].ViewingtotalCount = TabList[t].ViewingtotalCount + SingalayerCount;
                    //         //                 if (parseInt(engidex) == (TabList[t].energyLayer.length - 1)) {
                    //         //                     // if (grpLayerIndex == (TabList[t].ListOfChildID.length)) {
                    //         //                     TabList[t].energyLayer.filter((el) => {
                    //         //                         if (el.ViewingCount != "" && el.ViewingCount != undefined) {
                    //         //                             if (ListofInactiveEngid.indexOf(el.EnergyLayerID) == -1) {
                    //         //                                 Totalcount = Totalcount + el.ViewingCount;
                    //         //                             }
                    //         //                         }
                    //         //                     });
                    //         //                     if (Totalcount != undefined)
                    //         //                         TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing " + Totalcount + " of " + TabList[t]['totalCount'];
                    //         //                     GrpTotalCount = Totalcount;
                    //         //                 }
                    //         //                 // }
                    //         //                 // else {
                    //         //                 //     TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing " + Totalcount + " of " + TabList[t]['totalCount'];
                    //         //                 // }

                    //         //                 // -------- For Private Data Total count Display -------------
                    //         //                 if (this.MapServiceService.PrivateTreeNode.getValue()) {
                    //         //                     privateTreeNodeData.forEach((el) => {
                    //         //                         if (el.LayerType = "GroupLayer" && el.Id == Grpenglayer.ParentDataSetID) {
                    //         //                             // for(let ptd=0;ptd<el.children)
                    //         //                             if (GrpTotalCount > -1)
                    //         //                                 el["activeCount"] = GrpTotalCount;
                    //         //                             if (el.children) {
                    //         //                                 for (let ptd = 0; ptd < el.children.length; ptd++) {
                    //         //                                     const element = el.children[ptd];
                    //         //                                     if (Grpenglayer.DataSetID == element.Id) {
                    //         //                                         element["activeCount"] = SingalayerCount;
                    //         //                                     }
                    //         //                                 }
                    //         //                             }
                    //         //                         }
                    //         //                         // if (el.Id == Grpenglayer.DataSetID || el.Id == Grpenglayer.ParentDataSetID) {
                    //         //                         // if (el.Id == Grpenglayer.ParentDataSetID && el.id) {
                    //         //                         //     return el;
                    //         //                         // }

                    //         //                     });
                    //         //                     setTimeout(() => {
                    //         //                         this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
                    //         //                     }, 500);
                    //         //                     // if (filterPrivateTreeData.length == 1) {
                    //         //                     //     // filterPrivateTreeData[0]["activeCount"] = SingalayerCount;
                    //         //                     //     if (GrpTotalCount != undefined || GrpTotalCount > -1)
                    //         //                     //         filterPrivateTreeData[0]["activeCount"] = GrpTotalCount;
                    //         //                     //     filterPrivateTreeData[0].children[engidex]["activeCount"] = SingalayerCount;
                    //         //                     // }
                    //         //                 }

                    //         //                 // -------- For Shared Data Total count Display -------------
                    //         //                 if (this.MapServiceService._SharedTreeNode.getValue()) {
                    //         //                     // let filterSharedTreeData = sharedTreeNodeData.filter((el) => {
                    //         //                     //     if (el.Id == Grpenglayer.ParentDataSetID) {
                    //         //                     //         return el;
                    //         //                     //     }
                    //         //                     // });
                    //         //                     // if (filterSharedTreeData.length == 1) {
                    //         //                     //     if (GrpTotalCount != undefined || GrpTotalCount > -1)
                    //         //                     //         filterSharedTreeData[0]["activeCount"] = GrpTotalCount;
                    //         //                     //     filterSharedTreeData[0].children[engidex]["activeCount"] = SingalayerCount;
                    //         //                     // }
                    //         //                     sharedTreeNodeData.forEach((el) => {
                    //         //                         if (el.LayerType = "GroupLayer" && el.Id == Grpenglayer.ParentDataSetID) {
                    //         //                             // for(let ptd=0;ptd<el.children)
                    //         //                             if (GrpTotalCount > -1)
                    //         //                                 el["activeCount"] = GrpTotalCount;
                    //         //                             if (el.children) {
                    //         //                                 for (let std = 0; std < el.children.length; std++) {
                    //         //                                     const element = el.children[std];
                    //         //                                     if (Grpenglayer.DataSetID == element.Id) {
                    //         //                                         element["activeCount"] = SingalayerCount;
                    //         //                                     }
                    //         //                                 }
                    //         //                             }
                    //         //                         }
                    //         //                         // if (el.Id == Grpenglayer.DataSetID || el.Id == Grpenglayer.ParentDataSetID) {
                    //         //                         // if (el.Id == Grpenglayer.ParentDataSetID && el.id) {
                    //         //                         //     return el;
                    //         //                         // }

                    //         //                     });
                    //         //                 }

                    //         //                 // -------- For Temporary Data Total count Display -------------
                    //         //                 if (this.MapServiceService.TemporaryTreeNode.getValue()) {
                    //         //                     // let temporaryTreeNodeData = this.MapServiceService.TemporaryTreeNode.getValue();
                    //         //                     // let filterTemporaryTreeData = temporaryTreeNodeData.filter((el) => {
                    //         //                     //     if (el.Id == Grpenglayer.ParentDataSetID && Grpenglayer.TreeStatus == "GroupLayer") {
                    //         //                     //         return el;
                    //         //                     //     }
                    //         //                     // });
                    //         //                     // if (filterTemporaryTreeData.length == 1) {
                    //         //                     //     if (filterTemporaryTreeData[0].Id == "200008") {
                    //         //                     //         // if (TempGroupLayerCount != undefined)
                    //         //                     //         let totalCountGrpLayer = 0;
                    //         //                     //         TabList[t].energyLayer.forEach(x => {
                    //         //                     //             if (x && x.ViewingCount && x.ViewingCount > 0)
                    //         //                     //                 totalCountGrpLayer = totalCountGrpLayer + x.ViewingCount;
                    //         //                     //         });
                    //         //                     //         TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing " + totalCountGrpLayer + " of " + TabList[t]['totalCount'];
                    //         //                     //         filterTemporaryTreeData[0]["activeCount"] = totalCountGrpLayer;
                    //         //                     //     } else {
                    //         //                     //         filterTemporaryTreeData[0]["activeCount"] = Totalcount;
                    //         //                     //     }
                    //         //                     // }
                    //         //                     TemporaryTreeNodeData.forEach((el) => {
                    //         //                         if (el.LayerType = "GroupLayer" && el.Id == Grpenglayer.ParentDataSetID) {
                    //         //                             // for(let ptd=0;ptd<el.children)
                    //         //                             if (GrpTotalCount > -1)
                    //         //                                 el["activeCount"] = GrpTotalCount;
                    //         //                             if (el.children) {
                    //         //                                 for (let std = 0; std < el.children.length; std++) {
                    //         //                                     const element = el.children[std];
                    //         //                                     if (Grpenglayer.DataSetID == element.Id) {
                    //         //                                         element["activeCount"] = SingalayerCount;
                    //         //                                     }
                    //         //                                 }
                    //         //                             }
                    //         //                         }
                    //         //                         // if (el.Id == Grpenglayer.DataSetID || el.Id == Grpenglayer.ParentDataSetID) {
                    //         //                         // if (el.Id == Grpenglayer.ParentDataSetID && el.id) {
                    //         //                         //     return el;
                    //         //                         // }

                    //         //                     });

                    //         //                 }
                    //         //                 this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
                    //         //                 // -------- For Energy Data Total count Display -------------
                    //         //                 if (this.MapServiceService.TreeNodes.getValue()) {
                    //         //                     if (nodeList.length > 0) {
                    //         //                         if (filterTreeData.length == 1) {
                    //         //                             filterTreeData[0]["activeCount"] = SingalayerCount;
                    //         //                         }
                    //         //                     }
                    //         //                     this.MapServiceService._TreeUI.getValue().treeModel.update();
                    //         //                 }
                    //         //             }).catch(ex => {
                    //         //                 console.log(ex);
                    //         //             })
                    //         //     }

                    //         // } else {
                    //         var defaultfilterlist = [];
                    //         TabList[t].energyLayer.filter((el) => {
                    //             if (el.FilterValue != "" && el.FilterValue != undefined) {
                    //                 defaultfilterlist.push(el.FilterValue);
                    //             }
                    //         });
                    //         let default_filter = this.MapServiceService.filterval(defaultfilterlist);
                    //         let Gridfilter = '';
                    //         if (TabList[t].EnergylayersavegridFilter.mapfilterval) {
                    //             Gridfilter = this.MapServiceService.gridfilter([TabList[t].EnergylayersavegridFilter.mapfilterval]);
                    //         }
                    //         if (default_filter == '' && Gridfilter != '') {
                    //             default_filter = '(' + Gridfilter + ')';
                    //         }
                    //         else if (Gridfilter != '' && default_filter != '') {
                    //             default_filter = '(' + Gridfilter + ') and (' + default_filter + ')';
                    //         }
                    //         let cql_Filter = this.setCqlFilter(default_filter, true);
                    //         let UserId = this.AuthServices.getLoggedinUserId();
                    //         this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '', UserId)
                    //             .then(res => {
                    //                 var Res: any = res;
                    //                 var Activetotal = Res.totalFeatures;
                    //                 if (Activetotal != undefined) {
                    //                     if (TabList[t])
                    //                         TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing " + Activetotal + " of " + TabList[t]['totalCount'];
                    //                 }

                    //                 // -------- For Private Data Total count Display -------------
                    //                 if (this.MapServiceService.PrivateTreeNode.getValue()) {
                    //                     var privateTreeNodeData = this.MapServiceService.PrivateTreeNode.getValue();
                    //                     var filterPrivateTreeData = privateTreeNodeData.filter((el) => {
                    //                         if (el.Id == TabList[t].energyLayer[0].DataSetID) {
                    //                             return el;
                    //                         }
                    //                     });
                    //                     if (filterPrivateTreeData.length == 1 && Activetotal != undefined) {
                    //                         filterPrivateTreeData[0]["activeCount"] = Activetotal;
                    //                     }
                    //                     setTimeout(() => {
                    //                         this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
                    //                     }, 500);

                    //                 }

                    //                 // -------- For Shared Data Total count Display -------------
                    //                 if (this.MapServiceService._SharedTreeNode.getValue()) {
                    //                     var sharedTreeNodeData = this.MapServiceService._SharedTreeNode.getValue();
                    //                     var filterSharedTreeData = sharedTreeNodeData.filter((el) => {
                    //                         if (el.Id == TabList[t].energyLayer[0].DataSetID) {
                    //                             return el;
                    //                         }
                    //                     });
                    //                     if (filterSharedTreeData.length == 1 && Activetotal != undefined) {
                    //                         filterSharedTreeData[0]["activeCount"] = Activetotal;
                    //                     }
                    //                     setTimeout(() => {
                    //                         this.MapServiceService._SharedTreeUI.getValue().treeModel.update();
                    //                     }, 500);

                    //                 }

                    //                 // -------- For Temporary Data Total count Display -------------
                    //                 if (this.MapServiceService.TemporaryTreeNode.getValue()) {
                    //                     var temporaryTreeNodeData = this.MapServiceService.TemporaryTreeNode.getValue();
                    //                     var filterTemporaryTreeData = temporaryTreeNodeData.filter((el) => {
                    //                         if (el.Id == TabList[t].energyLayer[0].DataSetID) {
                    //                             return el;
                    //                         }
                    //                     });
                    //                     if (filterTemporaryTreeData.length == 1 && Activetotal != undefined) {
                    //                         filterTemporaryTreeData[0]["activeCount"] = Activetotal;
                    //                     }
                    //                     setTimeout(() => {
                    //                         this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
                    //                     }, 500);

                    //                 }


                    //                 // -------- For Energy Data Total count Display -------------
                    //                 if (this.MapServiceService.TreeNodes.getValue()) {
                    //                     var nodeList = this.SetTotalCountOnEnergLayertreevie();
                    //                     setTimeout(() => {
                    //                         if (nodeList.length > 0) {
                    //                             var filterTreeData = nodeList.filter((el) => {
                    //                                 if (TabList[t] && el.Id == TabList[t].energyLayer[0].EnergyLayerID) {
                    //                                     return el;
                    //                                 }
                    //                             });
                    //                             if (filterTreeData.length == 1 && Activetotal != undefined) {
                    //                                 filterTreeData[0]["activeCount"] = Activetotal;
                    //                             }
                    //                         }
                    //                         setTimeout(() => {
                    //                             this.MapServiceService._TreeUI.getValue().treeModel.update();
                    //                         }, 500);

                    //                     }, 500);
                    //                 }
                    //             }).catch(ex => {
                    //                 console.log(ex);
                    //             });
                    //         //}

                    //         // }
                    //         // else {
                    //         //     TabList[t]['totalCount'] = 0;
                    //         //     TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing 0 of 0";
                    //         //     console.log(Data);
                    //         // }
                    //         //}

                    //         // }).catch(ex => {
                    //         //     console.log(ex);
                    //         // });
                    //     }

                    // }
                } catch (error) { console.log(error) }
            }, 3000);
        }

    }

    getLayersWithFilterTotalCount(tabList) {
        let listOfLayersWithFilter = [];
        for (let tabData of tabList) {
            if (tabData.energyLayer[0].UploadFileType && (tabData.energyLayer[0].UploadFileType.toLowerCase() == ".kml" || tabData.energyLayer[0].UploadFileType.toLowerCase() == ".kmz")) {
                continue;
            }
            if (tabData) {
                //total count
                var totalCountDefaultFilterList = [];
                tabData.energyLayer.filter((el) => {
                    if (el.FilterValue != "" && el.FilterValue != undefined) {
                        totalCountDefaultFilterList.push(el.FilterValue);
                    }
                });
                let totalCountDefaultfilter = "";
                if (tabData.energyLayer.length > 0 && tabData.energyLayer[0].IsFromHomeLookup)
                    totalCountDefaultfilter = this.MapServiceService.filtervalForHomeLookup(totalCountDefaultFilterList);
                else
                    totalCountDefaultfilter = this.MapServiceService.filterval(totalCountDefaultFilterList);
                let totalCountGridFilter = '';
                if (tabData.EnergylayersavegridFilter.mapfilterval) {
                    totalCountGridFilter = this.MapServiceService.gridfilter([tabData.EnergylayersavegridFilter.mapfilterval]);
                }
                if (totalCountDefaultfilter == '' && totalCountGridFilter != '') {
                    totalCountDefaultfilter = '(' + totalCountGridFilter + ')';
                }
                else if (totalCountGridFilter != '' && totalCountDefaultfilter != '') {
                    totalCountDefaultfilter = '(' + totalCountGridFilter + ') and (' + totalCountDefaultfilter + ')';
                }
                let totalCountCqlFilter = this.setCqlFilter(totalCountDefaultfilter, false);

                let activeCountCqlFilter = "";
                if (tabData.treestatus == "GroupLayer") {
                    //Group layer active count
                    for (let Grpenglayer of tabData.energyLayer) {
                        let isChecked = false;
                        let treeLayer = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(Grpenglayer.EnergyLayerID);
                        if (!treeLayer)
                            treeLayer = this.MapServiceService._PrivateTreeUI.getValue().treeModel.getNodeById(Grpenglayer.EnergyLayerID);
                        if (!treeLayer)
                            treeLayer = this.MapServiceService._SharedTreeUI.getValue().treeModel.getNodeById(Grpenglayer.EnergyLayerID);
                        if (!treeLayer)
                            treeLayer = this.MapServiceService._TemporaryTreeUI.getValue().treeModel.getNodeById(Grpenglayer.EnergyLayerID);
                        if (treeLayer) {
                            let layerCheckedValue = treeLayer.data.IsChecked;
                            if (!layerCheckedValue)
                                isChecked = true;
                        }
                        if (isChecked) {
                            let activeCountDefaultFilterList = [];
                            activeCountDefaultFilterList.push(Grpenglayer.FilterValue);
                            let activeCountDefaultFilter = this.MapServiceService.filterval(activeCountDefaultFilterList);
                            let activeCountGridFilter = '';
                            if (tabData.EnergylayersavegridFilter.mapfilterval) {
                                activeCountGridFilter = this.MapServiceService.gridfilter([tabData.EnergylayersavegridFilter.mapfilterval]);
                            }
                            if (activeCountDefaultFilter == '' && activeCountGridFilter != '') {
                                activeCountDefaultFilter = '(' + activeCountGridFilter + ')';
                            }
                            else if (activeCountGridFilter != '' && activeCountDefaultFilter != '') {
                                activeCountDefaultFilter = '(' + activeCountGridFilter + ') and (' + activeCountDefaultFilter + ')';
                            }
                            activeCountCqlFilter = this.setCqlFilter(activeCountDefaultFilter, true);
                            let layerWithFilter = {
                                LayerId: Grpenglayer.EnergyLayerID,
                                TreeStatus: tabData.treestatus,
                                Layer: Grpenglayer,
                                ParentId: tabData.parentID,
                                TotalCountFilter: totalCountCqlFilter,
                                ActiveCountFilter: activeCountCqlFilter,
                                UserId: this.AuthServices.getLoggedinUserId()
                            }
                            listOfLayersWithFilter.push(layerWithFilter);
                        }
                    }
                }
                else {
                    //Indevidual layer active count
                    let isChecked = false;
                    let treeLayer = null;
                    treeLayer = this.MapServiceService._TreeUI.getValue().treeModel.getNodeById(tabData.ID);
                    if (!treeLayer)
                        treeLayer = this.MapServiceService._PrivateTreeUI.getValue().treeModel.getNodeById(tabData.ID);
                    if (!treeLayer)
                        treeLayer = this.MapServiceService._SharedTreeUI.getValue().treeModel.getNodeById(tabData.ID);
                    if (!treeLayer)
                        treeLayer = this.MapServiceService._TemporaryTreeUI.getValue().treeModel.getNodeById(tabData.ID);
                    if (treeLayer) {
                        let layerCheckedValue = treeLayer.data.IsChecked;
                        if (!layerCheckedValue)
                            isChecked = true;
                    }
                    if (isChecked) {
                        let activeCountDefaultFilterList = [];
                        tabData.energyLayer.filter((el) => {
                            if (el.FilterValue != "" && el.FilterValue != undefined) {
                                activeCountDefaultFilterList.push(el.FilterValue);
                            }
                        });
                        let activeCountDefaultFilter = this.MapServiceService.filterval(activeCountDefaultFilterList);
                        let activeCountGridFilter = '';
                        if (tabData.EnergylayersavegridFilter.mapfilterval) {
                            activeCountGridFilter = this.MapServiceService.gridfilter([tabData.EnergylayersavegridFilter.mapfilterval]);
                        }
                        if (activeCountDefaultFilter == '' && activeCountGridFilter != '') {
                            activeCountDefaultFilter = '(' + activeCountGridFilter + ')';
                        }
                        else if (activeCountGridFilter != '' && activeCountDefaultFilter != '') {
                            activeCountDefaultFilter = '(' + activeCountGridFilter + ') and (' + activeCountDefaultFilter + ')';
                        }
                        activeCountCqlFilter = this.setCqlFilter(activeCountDefaultFilter, true);
                        let layerWithFilter = {
                            LayerId: tabData.ID,
                            ParentId: tabData.parentID,
                            TreeStatus: tabData.treestatus,
                            Layer: tabData.energyLayer[0],
                            TotalCountFilter: totalCountCqlFilter,
                            ActiveCountFilter: activeCountCqlFilter,
                            UserId: this.AuthServices.getLoggedinUserId()
                        }
                        listOfLayersWithFilter.push(layerWithFilter);
                    }
                }
            }
        }
        return listOfLayersWithFilter;
    }


    getTotalCount_Test() {
        try {
            let TabList = this.MapServiceService._GridTabData.value;
            for (let t = 0; t < TabList.length; t++) {
                if (TabList[t].energyLayer[0].UploadFileType && (TabList[t].energyLayer[0].UploadFileType != null || TabList[t].energyLayer[0].UploadFileType != undefined) && (TabList[t].energyLayer[0].UploadFileType.toLowerCase() == ".kml" || TabList[t].energyLayer[0].UploadFileType.toLowerCase() == ".kmz")) {
                    continue;
                }
                let defaultfilterlist = [];
                TabList[t].energyLayer.filter((el) => {
                    if (el.FilterValue != "" && el.FilterValue != undefined) {
                        defaultfilterlist.push(el.FilterValue);
                    }

                });
                if (TabList[t].treestatus == "GroupLayer") {
                    for (let Grpenglayer of TabList[0].energyLayer) {
                        let default_filter = "";
                        if (TabList[t].energyLayer.length > 0 && TabList[t].energyLayer[0].IsFromHomeLookup)
                            default_filter = this.MapServiceService.filtervalForHomeLookup(defaultfilterlist);
                        else
                            default_filter = this.MapServiceService.filterval(defaultfilterlist);
                        let cql_Filter = this.setCqlFilter(default_filter, false);
                        this.hidethePaceProcessbar();
                        let UserId = this.AuthServices.getLoggedinUserId();
                        this.httpService._NodegetLayerData(Grpenglayer, 0, 1, cql_Filter, '', '', UserId)
                            .then(data => {
                                let Data: any = data;
                                this.hidethePaceProcessbar();
                                if (Data["totalFeatures"]) {
                                    let total = Data.totalFeatures;
                                    if (total) {
                                        if (TabList[t]['totalCount']) {
                                            TabList[t]['totalCount'] = parseInt(TabList[t]['totalCount']) + parseInt(total);
                                        }
                                        else { TabList[t]['totalCount'] = parseInt(TabList[t]['totalCount']) + parseInt(total); }
                                    }
                                    let default_filter = this.MapServiceService.filterval(defaultfilterlist);
                                    let Gridfilter = this.MapServiceService.gridfilter(this.GridfilterList);
                                    if (default_filter == '' && Gridfilter != '') {
                                        default_filter = '(' + Gridfilter + ')';
                                    }
                                    else if (Gridfilter != '' && default_filter != '') {
                                        default_filter = '(' + Gridfilter + ') and (' + default_filter + ')';
                                    }
                                    cql_Filter = this.setCqlFilter(default_filter, true);
                                    this.hidethePaceProcessbar();
                                    let UserId = this.AuthServices.getLoggedinUserId();
                                    this.httpService._NodegetLayerData(Grpenglayer, 0, 1, cql_Filter, '', '', UserId)
                                        .then(res => {
                                            let Res: any = res;
                                            let Activetotal = Res.totalFeatures;
                                            TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing " + Activetotal + " of " + TabList[t]['totalCount'];

                                            // -------- For Private Data Total count Display -------------
                                            if (this.MapServiceService.PrivateTreeNode.getValue()) {
                                                let privateTreeNodeData = this.MapServiceService.PrivateTreeNode.getValue();
                                                let filterPrivateTreeData = privateTreeNodeData.filter((el) => {
                                                    if (el.Id == TabList[t].energyLayer[0].DataSetID) {
                                                        return el;
                                                    }
                                                });
                                                if (filterPrivateTreeData.length == 1) {
                                                    filterPrivateTreeData[0]["activeCount"] = Activetotal;
                                                }
                                            }

                                            // -------- For Temporary Data Total count Display -------------
                                            if (this.MapServiceService.TemporaryTreeNode.getValue()) {
                                                let temporaryTreeNodeData = this.MapServiceService.TemporaryTreeNode.getValue();
                                                let filterTemporaryTreeData = temporaryTreeNodeData.filter((el) => {
                                                    if (el.Id == TabList[t].energyLayer[0].DataSetID) {
                                                        return el;
                                                    }
                                                });
                                                if (filterTemporaryTreeData.length == 1) {
                                                    filterTemporaryTreeData[0]["activeCount"] = Activetotal;
                                                }
                                            }

                                            // -------- For Energy Data Total count Display -------------
                                            let nodeList = this.SetTotalCountOnEnergLayertreevie();
                                            setTimeout(() => {
                                                if (nodeList.length > 0) {
                                                    let filterTreeData = nodeList.filter((el) => {
                                                        if (el.Id == Grpenglayer.EnergyLayerID) {
                                                            return el;
                                                        }
                                                    });
                                                    if (filterTreeData.length == 1) {
                                                        filterTreeData[0]["activeCount"] = Activetotal;
                                                    }
                                                }

                                                this.MapServiceService._TreeUI.getValue().treeModel.update();
                                            }, 500);
                                        }).catch(ex => {
                                            console.log(ex);
                                        });
                                }
                                else {
                                    TabList[t]['totalCount'] = 0;
                                    TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing 0 of 0";
                                }

                            }).catch(ex => {
                                console.log(ex);
                            });
                    }
                } else {

                    let default_filter = "";
                    if (TabList[t].energyLayer.length > 0 && TabList[t].energyLayer[0].IsFromHomeLookup)
                        default_filter = this.MapServiceService.filtervalForHomeLookup(defaultfilterlist);
                    else
                        default_filter = this.MapServiceService.filterval(defaultfilterlist);
                    let cql_Filter = this.setCqlFilter(default_filter, false);
                    this.hidethePaceProcessbar();
                    let UserId = this.AuthServices.getLoggedinUserId();
                    this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '', UserId)
                        .then(data => {
                            let Data: any = data;
                            this.hidethePaceProcessbar();
                            if (Data["totalFeatures"]) {
                                let total = Data.totalFeatures;
                                if (total) {
                                    if (TabList[t]['totalCount']) {
                                        TabList[t]['totalCount'] = total;
                                    }
                                    else { TabList[t]['totalCount'] = total; }
                                }
                                let default_filter = "";
                                if (TabList[t].energyLayer.length > 0 && TabList[t].energyLayer[0].IsFromHomeLookup)
                                    default_filter = this.MapServiceService.filtervalForHomeLookup(defaultfilterlist);
                                else
                                    default_filter = this.MapServiceService.filterval(defaultfilterlist);

                                let Gridfilter = this.MapServiceService.gridfilter(this.GridfilterList);
                                if (default_filter == '' && Gridfilter != '') {
                                    default_filter = '(' + Gridfilter + ')';
                                }
                                else if (Gridfilter != '' && default_filter != '') {
                                    default_filter = '(' + Gridfilter + ') and (' + default_filter + ')';
                                }
                                cql_Filter = this.setCqlFilter(default_filter, true);
                                this.hidethePaceProcessbar();
                                let UserId = this.AuthServices.getLoggedinUserId();
                                this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '', UserId)
                                    .then(res => {
                                        let Res: any = res;
                                        let Activetotal = Res.totalFeatures;
                                        TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing " + Activetotal + " of " + TabList[t]['totalCount'];
                                        // -------- For Private Data Total count Display -------------
                                        if (this.MapServiceService.PrivateTreeNode.getValue()) {
                                            let privateTreeNodeData = this.MapServiceService.PrivateTreeNode.getValue();
                                            let filterPrivateTreeData = privateTreeNodeData.filter((el) => {
                                                if (el.Id == TabList[t].energyLayer[0].DataSetID) {
                                                    return el;
                                                }
                                            });
                                            if (filterPrivateTreeData.length == 1) {
                                                filterPrivateTreeData[0]["activeCount"] = Activetotal;
                                            }
                                        }

                                        // -------- For Temporary Data Total count Display -------------
                                        if (this.MapServiceService.TemporaryTreeNode.getValue()) {
                                            let temporaryTreeNodeData = this.MapServiceService.TemporaryTreeNode.getValue();
                                            let filterTemporaryTreeData = temporaryTreeNodeData.filter((el) => {
                                                if (el.Id == TabList[t].energyLayer[0].DataSetID) {
                                                    return el;
                                                }
                                            });
                                            if (filterTemporaryTreeData.length == 1) {
                                                filterTemporaryTreeData[0]["activeCount"] = Activetotal;
                                            }
                                        }
                                        // -------- For Energy Data Total count Display -------------
                                        let nodeList = this.SetTotalCountOnEnergLayertreevie();
                                        setTimeout(() => {
                                            if (nodeList.length > 0) {
                                                let filterTreeData = nodeList.filter((el) => {
                                                    if (el.Id == TabList[t].energyLayer[0].EnergyLayerID) {
                                                        return el;
                                                    }
                                                });
                                                if (filterTreeData.length == 1) {
                                                    filterTreeData[0]["activeCount"] = Activetotal;
                                                }
                                            }

                                            this.MapServiceService._TreeUI.getValue().treeModel.update();
                                        }, 500);
                                    }).catch(ex => {
                                        console.log(ex);
                                    });
                            }
                            else {
                                TabList[t]['totalCount'] = 0;
                                TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing 0 of 0";
                            }

                        }).catch(ex => {
                            console.log(ex);
                        });

                }
            }
        } catch (error) { console.log(error) }
    }

    hidethePaceProcessbar() {
        // $(".pace").css("display", "none");
    }
    setCqlFilter(filetrval, bbox) {
        let bboxval = '';
        let returnfilterval = '';
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

    }

    GetFilterVal(IsFiltervalue: any = []) {
        let cql_Filter = "";
        let Isreturn = false;
        if (IsFiltervalue.length > 0) {
            for (let f of IsFiltervalue) {
                if (f != undefined && f != null && f != '') {
                    let CQLFilter = this.MapServiceService.CreateCQL_Filter(f, 'and');
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
    }
    BindActiveGridData() {
        let TabList = this.MapServiceService._GridTabData.value;
        if (TabList.length == 0) {
            this.MapServiceService.GridData.getValue().length = 0
            this.MapServiceService.GridColumns.getValue().length = 0
            this.MapServiceService.KMLGridData.getValue().length = 0;
            this.MapServiceService.KMLGridcolumns.getValue().length = 0;
            let map = this.MapServiceService._mapdata.getValue();
            map.overlayMapTypes.clear();
        }
        for (let t = 0; t < TabList.length; t++) {
            if (TabList[t].ActiveClass == " active") {
                //TabList[t].Title += " - Viewing  of ";     
                this.MapServiceService.GridData.value.length = 0;
                this.MapServiceService.GridColumns.value.length = 0;
                this.MapServiceService.KMLGridData.value.length = 0;
                this.MapServiceService.KMLGridcolumns.value.length = 0;
                let Gridcolumns = this.MapServiceService.GenerateColumns(TabList[t].energyLayer[0]);
                let default_filter = this.MapServiceService.filterval(TabList[t].IsFiltervalue);
                let cql_Filter = this.setCqlFilter(default_filter, false);
                Array.prototype.push.apply(this.MapServiceService.GridColumns.getValue(), Gridcolumns);
                let UserId = this.AuthServices.getLoggedinUserId();
                this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 100, cql_Filter, '', '', UserId)
                    .then(data => {
                        let Data: any = data;
                        let ArrayData: any = [];
                        if (Data.features.length > 0) {
                            let Ldata = Data.features
                            for (let d of Ldata) {
                                ArrayData.push(d.properties)
                            }
                            this.MapServiceService.ColumnsGriddata = [];
                            Array.prototype.push.apply(this.MapServiceService.GridData.getValue(), ArrayData);
                            Array.prototype.push.apply(this.MapServiceService.ColumnsGriddata, ArrayData);
                            this.RefreshAG_GridView()
                        };
                        let gridTabData = this.MapServiceService._GridTabData.getValue();
                        if (gridTabData.length == 1) {
                            //if (gridTabData[0].treestatus != 'GroupLayer')
                            this.getTotalCount();
                        }
                    }).catch(ex => {
                        console.log(ex);
                    });
            }
        }
        let Acivetab = TabList.filter((el) => {
            if (el.ActiveClass == " active") {
                return el;
            }
        });
        if (Acivetab.length == 0) {
            this.MapServiceService.GridData.getValue().length = 0
            this.MapServiceService.GridColumns.getValue().length = 0
        }
        this.MapServiceService.GetLegendData();
    }

    BindPrivateLayerActiveGridData() {
        let TabList = this.MapServiceService._GridTabData.value;
        let array: any = [];
        if (TabList.length == 0) {
            this.MapServiceService.GridData.getValue().length = 0;
            this.MapServiceService.GridColumns.getValue().length = 0;
            this.MapServiceService.KMLGridData.getValue().length = 0;
            this.MapServiceService.KMLGridcolumns.getValue().length = 0;
            let map = this.MapServiceService._mapdata.getValue();
            map.overlayMapTypes.clear();
        }
        for (let t = 0; t < TabList.length; t++) {
            if (TabList[t].ActiveClass == " active") {
                //TabList[t].Title += " - Viewing  of ";
                this.MapServiceService.KMLGridData.value.length = 0;
                this.MapServiceService.KMLGridcolumns.value.length = 0;
                this.MapServiceService.GridData.value.length = 0;
                this.MapServiceService.GridColumns.value.length = 0;
                if ((TabList[t].energyLayer[0].UploadFileType != null || TabList[t].energyLayer[0].UploadFileType != undefined) && (TabList[t].energyLayer[0].UploadFileType.toLowerCase() == ".kml" || TabList[t].energyLayer[0].UploadFileType.toLowerCase() == ".kmz")) {
                    if (this.MapServiceService.KmlLayersData.getValue()) {
                        setTimeout(() => {
                            let existingklayer = this.MapServiceService.kmlLayersData.getValue();
                            let selectedKmlLayer = existingklayer.filter((el) => {
                                if (el.LayerID == parseInt(TabList[t].energyLayer[0].DataSetID)) {
                                    return el;
                                }
                            });
                            if (selectedKmlLayer.length == 1) {
                                let result = selectedKmlLayer[0].LayerData;
                                let total = result.KMLGeometryList.length;
                                this.GridTotal = total;
                                TabList[t].totalCount = total;
                                if (result.KMLGeometryList[0].hasOwnProperty('Name')) {
                                    let KMLGridcolumns = this.MapServiceService.GenerateColumnsForKml(["Name"]);
                                    Array.prototype.push.apply(this.MapServiceService.KMLGridcolumns.getValue(), KMLGridcolumns);
                                    let ArrayData: any = [""];
                                    // let nameData = result.KMLGeometryList.map(a => a.Name);
                                    // for (let d of nameData) {
                                    //     ArrayData.push({ Name: d });
                                    // }
                                    //this.MapServiceService.ColumnsGriddata = [];
                                    Array.prototype.push.apply(this.MapServiceService.KMLGridData.getValue(), ArrayData);
                                    //Array.prototype.push.apply(this.MapServiceService.ColumnsGriddata, ArrayData);
                                }
                            }
                        }, 2000);

                    }
                }
                else {
                    let Gridcolumns = this.MapServiceService.GenerateColumns(TabList[t].energyLayer[0]);
                    //let cql_Filter = this.GetFilterVal(TabList[t].IsFiltervalue);
                    let default_filter = this.MapServiceService.filterval(TabList[t].IsFiltervalue);
                    let cql_Filter = this.setCqlFilter(default_filter, false);
                    Array.prototype.push.apply(this.MapServiceService.GridColumns.getValue(), Gridcolumns);
                    //this.MapServiceService.GetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '')
                    let UserId = this.AuthServices.getLoggedinUserId();
                    this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '', UserId)
                        .then(data => {
                            if (TabList[t]) {
                                let Data: any = data;
                                // if (data['_body'].indexOf('totalFeatures') > 0) {
                                if (Data["totalFeatures"]) {
                                    let total = Data.totalFeatures;
                                    this.GridTotal = total;
                                    TabList[t]['totalCount'] = total;
                                    cql_Filter = this.setCqlFilter(default_filter, false);
                                    let UserId = this.AuthServices.getLoggedinUserId();
                                    //  this.MapServiceService.GetLayerData(TabList[t].energyLayer[0], 0, 3000, cql_Filter, '', '')
                                    this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 100, cql_Filter, '', '', UserId)
                                        .then(data => {
                                            let Data: any = data;
                                            let ArrayData: any = []
                                            if (Data.features.length > 0) {
                                                let Ldata = Data.features;
                                                for (let d of Ldata) {
                                                    ArrayData.push(d.properties)
                                                }
                                                this.MapServiceService.ColumnsGriddata = [];
                                                Array.prototype.push.apply(this.MapServiceService.GridData.getValue(), ArrayData);
                                                Array.prototype.push.apply(this.MapServiceService.ColumnsGriddata, ArrayData);
                                            };
                                            if (this.MapServiceService._GridTabData.getValue().length == 1) {
                                                this.getTotalCount();
                                            }

                                        }).catch(ex => {
                                            console.log(ex);
                                        });

                                }
                                else {
                                    this.GridTotal = 0;
                                    TabList[t]['totalCount'] = 0;
                                    TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing 0 of 0";
                                    //this.MapServiceService.GetLegendData();
                                    if (TabList[t].treestatus == "GroupLayer")
                                        this.getTotalCount();
                                }
                            }
                        });
                }

            }
        }
        let Acivetab = TabList.filter((el) => {
            if (el.ActiveClass == " active") {
                return el;
            }
        });
        if (Acivetab.length == 0) {
            this.MapServiceService.GridData.getValue().length = 0
            this.MapServiceService.GridColumns.getValue().length = 0
        }
        this.MapServiceService.GetLegendData();
    }

    BindTemporaryLayerActiveGridData() {
        let TabList = this.MapServiceService._GridTabData.value;
        let array: any = [];
        if (TabList.length == 0) {
            this.MapServiceService.GridData.getValue().length = 0
            this.MapServiceService.GridColumns.getValue().length = 0
            this.MapServiceService.KMLGridData.getValue().length = 0;
            this.MapServiceService.KMLGridcolumns.getValue().length = 0;
            let map = this.MapServiceService._mapdata.getValue();
            map.overlayMapTypes.clear();
        }
        for (let t = 0; t < TabList.length; t++) {
            if (TabList[t].ActiveClass == " active") {
                //TabList[t].Title += " - Viewing  of ";     
                this.MapServiceService.GridData.value.length = 0;
                this.MapServiceService.GridColumns.value.length = 0;
                this.MapServiceService.KMLGridData.value.length = 0;
                this.MapServiceService.KMLGridcolumns.value.length = 0;
                let Gridcolumns = this.MapServiceService.GenerateColumns(TabList[t].energyLayer[0]);
                //let cql_Filter = this.GetFilterVal(TabList[t].IsFiltervalue);
                let default_filter = this.MapServiceService.filterval(TabList[t].IsFiltervalue);
                let cql_Filter = this.setCqlFilter(default_filter, false);
                Array.prototype.push.apply(this.MapServiceService.GridColumns.getValue(), Gridcolumns);

                // this.MapServiceService.testGetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '').subscribe(data => {  }, error => {
                //     
                // })               
                //this.MapServiceService.GetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '')
                let UserId = this.AuthServices.getLoggedinUserId();
                this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '', UserId)
                    .then(data => {
                        if (TabList[t]) {
                            let Data: any = data;
                            if (Data["totalFeatures"]) {
                                // if (data['_body'].indexOf('totalFeatures') > 0) {
                                let total = Data.totalFeatures;
                                this.GridTotal = total;
                                TabList[t]['totalCount'] = total;
                                cql_Filter = this.setCqlFilter(default_filter, false);
                                //this.MapServiceService.GetLayerData(TabList[t].energyLayer[0], 0, 3000, cql_Filter, '', '')
                                let UserId = this.AuthServices.getLoggedinUserId();
                                this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '', UserId)
                                    .then(data => {
                                        let Data: any = data;
                                        let ArrayData: any = []
                                        if (Data.features.length > 0) {
                                            let Ldata = Data.features
                                            for (let d of Ldata) {
                                                ArrayData.push(d.properties)
                                            }
                                            this.MapServiceService.ColumnsGriddata = [];
                                            Array.prototype.push.apply(this.MapServiceService.GridData.getValue(), ArrayData);
                                            Array.prototype.push.apply(this.MapServiceService.ColumnsGriddata, ArrayData);
                                            this.RefreshAG_GridView();
                                        };
                                        if (this.MapServiceService._GridTabData.getValue().length == 1) {
                                            this.getTotalCount();
                                        }

                                    }).catch(ex => {
                                        console.log(ex);
                                    });

                            }
                            else {
                                this.GridTotal = 0;
                                TabList[t]['totalCount'] = 0;
                                TabList[t].Title = TabList[t]['DisplayName'] + " - Viewing 0 of 0";
                                if (TabList[t].parentID == "200008")
                                    this.getTotalCount();
                                this.RefreshAG_GridView();
                            }
                        }
                    });
            }
        }
        let Acivetab = TabList.filter((el) => {
            if (el.ActiveClass == " active") {
                return el;
            }
        });
        if (Acivetab.length == 0) {
            this.MapServiceService.GridData.getValue().length = 0
            this.MapServiceService.GridColumns.getValue().length = 0
        }
        this.MapServiceService.GetLegendData();
    }


    serverLayrefilter(IsFiltervalue) {
        let sld_filter = '';
        if (IsFiltervalue.length > 0) {
            for (let f of IsFiltervalue) {
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
    }
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
    indivisualserversidecql_filter(filterModel, k, sld_filter) {
        let filterval = '';
        let cql_Filter = '';
        let bbox = this.UtilityService.getgooleMapBbox(this.MapServiceService._mapdata.getValue());
        for (let v of filterModel[k].values) {
            if (v == null) {
                v = ' ';
            }
            filterval = k + '=' + v;
            this.mapfilterval += ';' + filterval
            let CQLFilter = this.MapServiceService.CreateCQL_Filter(filterval, 'and');
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
    }
    indivisualserversidefilter(filterModel, k, sld_filter) {
        let filterval = '';
        for (let v of filterModel[k].values) {
            if (v == null) {
                v = ' ';
            }
            filterval = k + '=' + v;
            this.mapfilterval += ';' + filterval
            // sld_filter += this.MapServiceService.CreateCQL_Filter(filterval);

            sld_filter += this.MapLayerService.SingleFilterLoop(filterval);

        }
        return sld_filter;
    }
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
    mapfilterval = '';
    GridfilterList = [];
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
    filterData(filterModel, data) {
        var filterPresent = filterModel && Object.keys(filterModel).length > 0;
        if (!filterPresent) {
            return data;
        }
        var resultOfFilter = [];
        let keys = Object.keys(filterModel);

        for (let k of keys) {
            var filterval = filterModel[k].filter.toString().toLocaleLowerCase();
            for (var i = 0; i < data.length; i++) {
                let item = data[i];
                let columnval = item[k].toString().toLocaleLowerCase();
                if (filterModel[k].type == "equals") {
                    if (columnval !== filterval) {
                        continue;
                    }
                } else if (filterModel[k].type == "lessThan") {
                    if (columnval >= filterval) {
                        continue;
                    }
                }
                else if (filterModel[k].type == "contains") {
                    if (columnval.indexOf(filterval) < 0) {
                        continue
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
    }
    collapseSideBar(res: boolean) {
        let sideBar = document.getElementsByClassName('page-sidebar')[0] as HTMLElement;
        let cardBody = document.getElementsByClassName('card-body')[0] as HTMLElement;

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
    }

    SetMapContext(contextmap) {
        setTimeout(() => {
            // let map = this.MapServiceService._mapdata.getValue();
            var menu = new contextMenu({ map: contextmap });
            menu.addItem('Mapsearch Data', (map, latLng) => {
                this.mapsearchDataLibrary();
            });
            menu.addItem('Change Basemap', (map, latLng) => {
                this.bsModalServices.show(BasemapComponent,
                    { class: 'modal-lg modal-dialog-centered xlModal', animated: false, backdrop: 'static' });
            });
            menu.addItem('Draw Tools', () => {
                // this.MapServiceService.DrawTools();
                this.OpenDrawTools();
            });
            menu.addItem('Show Legend', () => {
                if ($('#LegendModal').length == 0) {
                    this.bsModalServices.show(ShowLegendComponent, { class: 'modal-sm LegendModal slide-right in show', backdrop: 'static', animated: false });
                    setTimeout(() => { this.SetLegendBasedOnGrid(); }, 100);
                }
            });
            //menu.addItem('Favorite Layers', (map, latLng) => { });
        }, 1000)
    }

    OpenDrawTools(editId?: any) {
        let isOpened = this.MapServiceService.isDrawToolsOpened.getValue();
        if (isOpened == true)
            return;
        else
            this.MapServiceService.isDrawToolsOpened.next(true);
        this.DisableContextMenuforDrawTools();
        const config: ModalOptions = { class: 'modal-sm drawTools modal-dialog-centered', backdrop: 'static', animated: false };
        let drawModal = this.bsModalServices.show(DrawToolsComponent, config);
        if (editId)
            drawModal.content.EditLayerId = editId;
    }
    DisableContextMenuforDrawTools() {
        let menu = document.getElementsByClassName('contextMenu');
        if (menu && menu.length > 0) {
            this.MapServiceService.isDrawToolsOpened.subscribe(x => {
                if (x == true) {
                    menu[0].classList.add('d-none');
                } else if (x == false) {
                    menu[0].classList.remove('d-none');
                    menu[0].setAttribute('style', 'display: none');
                }
            });
        }
    }
    mapsearchDataLibrary() {
        let LoginId = this.AuthServices.getLoggedinUserId();
        if (!this.MapServiceService.MapsearchLayersCategory.getValue()) {
            this.httpService._NodeGetLayerCategory(LoginId, "Energy Layer Group", 0).subscribe(data => {
                // let LayersLibrary = JSON.stringify(data);
                // let res = JSON.parse(LayersLibrary);                             
                let LayersLibrary: any = data;
                let res = LayersLibrary;
                if (res.errormsg == "") {
                    res["IsLoaded"] = true;
                    this.MapServiceService.setMapsearchLayersCategory(res);
                    this.OpenMapsearchDataLibrary();
                }
                else {
                    //console.log(res.errorms);
                    this.OpenMapsearchDataLibrary();
                }
            }, error => {
                console.log(error);
                this.OpenMapsearchDataLibrary();
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

    }
    OpenMapsearchDataLibrary() {
        this.modalService.open(MapSearchDataComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false, windowClass: "xlModal" }).result.then((result) => { }, (reason) => { });
    }

    RectangleZoom(e) {
        if (this.mouseIsDown && (this.shiftPressed || this.gribBoundingBox != null)) {
            if (this.gribBoundingBox !== null) // box exists
            {
                var newbounds = new google.maps.LatLngBounds(this.mouseDownPos, null);
                newbounds.extend(e.latLng);
                this.gribBoundingBox.setBounds(newbounds);
            }
            else // create bounding box
            {
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
    }

    OnMouseDown(e) {
        if (this.shiftPressed) {
            this.mouseIsDown = 1;
            this.mouseDownPos = e.latLng;
            this.map.setOptions({
                draggable: false
            });
        }
    }

    OnMouseUp(e) {
        if (this.mouseIsDown && (this.shiftPressed || this.gribBoundingBox != null)) {
            this.mouseIsDown = 0;
            if (this.gribBoundingBox !== null) // box exists
            {
                var boundsSelectionArea = new google.maps.LatLngBounds(this.gribBoundingBox.getBounds().getSouthWest(), this.gribBoundingBox.getBounds().getNorthEast());
                this.map.fitBounds(boundsSelectionArea);
                this.gribBoundingBox.setMap(null); // remove the rectangle
            }
            this.gribBoundingBox = null;
        }

        this.map.setOptions({
            draggable: true
        });
    }
    SavefiltereneregyLayer(event: any, Tab: any, Id: any, ) {
        const modalRef = this.modalService.open(SavesearchComponent, { size: 'sm', centered: true, backdrop: 'static', windowClass: "SaveSearchModal" });
        modalRef.componentInstance.FilterEneregyLayer = Tab;
        modalRef.componentInstance.FilterEnergyLayerID = Id;
        modalRef.componentInstance.StatusOfSaveLayers = "EnergyLayerOrPrivateLayer";
    }
    ExportData(event: any, Id: any, Tab: any) {        
        let actionType = event.target.getAttribute("data-action-type");
        if (actionType == "ExportFeature") {
            event.target.classList.remove('fa-file-excel');
            event.target.classList.add('fa-spinner')
            event.target.classList.add('fa-spin');
            //this.ExportFeatureClass = "far fa-spinner fa-spin fa-lg";
            let ExportGridfilterList = this.GridfilterList;
            if (Tab.treestatus == "Individual") {
                ExportGridfilterList = Tab.energyLayer[0]["serversidefilterval"];
            }
            else {
                let list = [];
                for (let l of Tab.energyLayer) {
                    Array.prototype.push.apply(list, l["serversidefilterval"]);
                }
                ExportGridfilterList = list;
            }
            let default_filter = this.MapServiceService.filterval(Tab.IsFiltervalue);
            let Gridfilter = this.MapServiceService.gridfilter(ExportGridfilterList);
            if (default_filter == '' && Gridfilter != '') {
                default_filter = '(' + Gridfilter + ')';
            }
            else if (Gridfilter != '' && default_filter != '') {
                default_filter = '(' + Gridfilter + ') and (' + default_filter + ')';
            }
            let cql_Filter = this.setCqlFilter(default_filter, true);
            let columnsList = this.MapServiceService.GenerateColumns(Tab.energyLayer[0]);
            let propertyNameList = [];
            for (let c of columnsList) {
                if (c.field != undefined && c.field != "Notes") {
                    propertyNameList.push(c.field);
                }
            }
            propertyNameList.push('the_geom');
            propertyNameList = _.uniqWith(propertyNameList, _.isEqual);
            let propertyName = _.join(propertyNameList, ',');
            //this.MapServiceService.GetExportFeatureData(Tab.energyLayer[0], cql_Filter, propertyName)
            let UserId = this.AuthServices.getLoggedinUserId();
            let Username = this._UserName;
            this.httpService._NodeGetExportFeatureData(Tab.energyLayer[0], cql_Filter, propertyName, UserId, Username)
                .subscribe(data => {
                    // if (data['_body'].indexOf('totalFeatures') > 0) {
                    if (data['totalFeatures']) {
                        let Ldata = data.features;
                        let ArrayData = [];
                        let geometryColName = "EID";
                        let RendomeChar = [];
                        for (let c = 0; c < 200; c++) {
                            let getchar = this.UtilityService.GetTwoRendomeCharacter();
                            RendomeChar.push(getchar);
                        }
                        for (let d of Ldata) {
                            let EID = this.UtilityService.ConvertJsongeometryTostringGeometry(d.geometry);
                            if (d.geometry.type.toLowerCase() == "multipolygon" || d.geometry.type.toLowerCase() == "multilinestring") {
                                if (EID.length > 0) {
                                    let ListOfstring = EID.match(/.{1,12000}/g);
                                    let indexval = 0;
                                    for (let l of ListOfstring) {
                                        if (indexval == 0) {
                                            d.properties[geometryColName] = l;
                                            propertyNameList.push(geometryColName);
                                        }
                                        else {
                                            d.properties[geometryColName + " " + RendomeChar[indexval]] = l;
                                            propertyNameList.push(geometryColName + " " + RendomeChar[indexval]);
                                        }
                                        indexval++;
                                    }
                                }
                                ArrayData.push(d.properties);
                            }
                            else {
                                d.properties[geometryColName] = EID;
                                ArrayData.push(d.properties);
                                propertyNameList.push(geometryColName);
                            }
                        }
                        propertyNameList = _.uniqWith(propertyNameList, _.isEqual);
                        let EIDColindexval = 0;
                        let EIDColindexvalList = [];
                        let arrayListData = ArrayData.map((o) => {
                            return propertyNameList.reduce((newo, name) => {
                                if (name.indexOf(geometryColName) > 0) {
                                    newo[name] = o[name];
                                }
                                if (name != "the_geom") {
                                    newo[name] = o[name];
                                    for (let c of columnsList) {
                                        if (c.field != undefined) {
                                            if (name == c.field) {
                                                let jsonval = JSON.stringify(newo);
                                                newo = JSON.parse(jsonval.replace(name, c.headerName))
                                            }
                                        }
                                    }

                                }
                                EIDColindexval++;
                                return newo;
                            }, {});
                        });
                        this.MapServiceService.exportAsExcelFile(arrayListData, Tab['DisplayName'], propertyNameList, EIDColindexvalList);
                    } else {
                        console.log(data);
                    }
                    event.target.classList.remove('fa-spinner');
                    event.target.classList.remove('fa-spin');
                    event.target.classList.add('fa-file-excel');
                    // this.ExportFeatureClass = "far fa-file-excel fa-lg";
                }, error => {

                    console.log(error)
                });
        }
    }

    switchUnit() {
        setTimeout(() => {
            var ccs = $('.gm-style .gm-style-cc');
            if (ccs != undefined && ccs.length > 0) {
                for (let i = 0; i < ccs.length; i++) {
                    ccs[i].click();
                }
            }
        }, 3000);
    }
}


