import { Injectable } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';


import { environment } from '../../environments/environment';
import { GoogleMapPage } from '../maps/google/google.component'
import { UtilityService } from './Utility.service';

import { keys } from 'd3';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subject } from 'rxjs';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import { HttpRequestService } from './all-http-request.service';
import { ActiveLibrary } from '../map-search-data/map-search-data.component';
declare var jquery: any;
declare var $: any;
declare var google: any;
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable()
export class MapServiceService {
    GoogleMapPage: GoogleMapPage;
    private _mapsharedata = new BehaviorSubject<any>(null);
    private _GridTabsData = new BehaviorSubject<any>(null);
    private MapGridData = new BehaviorSubject<any>(null);
    private LodedMapGridData = new BehaviorSubject<any>(null);
    private MapGridColumns = new BehaviorSubject<any>(null);
    private LodedMapGridColumns = new BehaviorSubject<any>(null);
    private GridDataResult = new BehaviorSubject<any>(null);
    private GridDataAPi = new BehaviorSubject<any>(null);
    private KMLGridDataAPi = new BehaviorSubject<any>(null);
    private LayersCategory = new BehaviorSubject<any>(null);
    private ActiveLayersList = new BehaviorSubject<any>(null);
    private MapSearchEnergyLayerLibrary = new BehaviorSubject<any>(null);
    private HomeWidgetArray = new BehaviorSubject<any>(null);
    private Treenode = new BehaviorSubject<any>(null);
    private TreeUI = new BehaviorSubject<any>(null);
    public ColumnsGriddata: any = [];
    public ColumnsGriddatawithKey: any = [];
    public columnfilterval: any = [];
    public _columnfiltervalStatus: string = "";
    public DrawingTool = new BehaviorSubject<any>(null);
    public MyDataLayerLibrary = new BehaviorSubject<any>(null);
    private PrivateTreenode = new BehaviorSubject<any>(null);
    private SharedTreenode = new BehaviorSubject<any>(null);
    public DrawToolTreenode = new BehaviorSubject<any>(null);
    public SharedDrawToolTreenode = new BehaviorSubject<any>(null);
    private PrivateTreeUI = new BehaviorSubject<any>(null);
    private SharedTreeUI = new BehaviorSubject<any>(null);
    public KmlLayers = new BehaviorSubject<any>(null);
    public MapKMLGridData = new BehaviorSubject<any>(null);
    public MapKMLGridColumns = new BehaviorSubject<any>(null);
    public KmlLayersData = new BehaviorSubject<any>(null);
    public ExternalIconList = new BehaviorSubject<any>(null);
    public PipelineCreateLayer = new BehaviorSubject<any>(null);
    public RailRoadCreateLayer = new BehaviorSubject<any>(null);
    private TemporaryTreenode = new BehaviorSubject<any>(null);
    private TemporaryTreeUI = new BehaviorSubject<any>(null);
    public LayerIndex = new BehaviorSubject<any>(null);
    public _drawingToolForElevation = new BehaviorSubject<any>(null);
    public _elevationGraphData = new BehaviorSubject<any>(null);
    public _drawingToolForDistance = new BehaviorSubject<any>(null);
    public _drawingToolForArea = new BehaviorSubject<any>(null);
    public _temporaryLayerData = new BehaviorSubject<any>(null);
    private _GlobaleSearchEnergyLayer = new BehaviorSubject<any>(null);
    public _SystemParameterList = new BehaviorSubject<any>(null);
    private BaseMap = new BehaviorSubject<any>(null);
    private parcelStates = new BehaviorSubject<any>(null);
    private wellStates = new BehaviorSubject<any>(null);
    private transProjects = new BehaviorSubject<any>(null);
    private pipeActivities = new BehaviorSubject<any>(null);
    private CompanyProfileData = new BehaviorSubject<any>(null);
    private PipelineActivityData = new BehaviorSubject<any>(null);
    private TransmissionProjectData = new BehaviorSubject<any>(null);
    private PowerPlantData = new BehaviorSubject<any>(null);
    private GeneratingUnitsData = new BehaviorSubject<any>(null);
    private MapTitleString = new BehaviorSubject<string>(null);
    public UserMap = new BehaviorSubject<any>(null);
    public GlobalSearchText = new BehaviorSubject<string>(null);
    public ActiveSearchDataLibrary = new BehaviorSubject<ActiveLibrary>(null);
    public CreateLayerParentObj = new BehaviorSubject<any>(null);
    public LodedIsNotesArray = new BehaviorSubject<any>([]);
    public drawingToolForParcelPoint = new BehaviorSubject<any>(null);
    public drawingToolForParcelPointLines = new BehaviorSubject<any>(null);
    public sitePermissions = new BehaviorSubject<any>(null);
    private SharedData = new BehaviorSubject<any>(null);
    private SharedLayersUserSearch = new BehaviorSubject<any>(null);
    public isDrawToolsOpened = new BehaviorSubject<boolean>(false);
    public SetElavationvalue = {
        IsElavation: false,
        Unitvalue: "Feet"
    }
    public ParcelCenterLookupZoom: boolean;
    public SiteselectionToolZoom: boolean;
    public SharedUserList = [];
    // private MydataLibraryTotalCount = new BehaviorSubject<any>(null);

    //public MydataLibraryTotalCount:number = 0;

    _mapdata = this._mapsharedata;
    _GridTabData = this._GridTabsData;
    GridData = this.MapGridData;
    LodedGridData = this.LodedMapGridData;
    GridColumns = this.MapGridColumns;
    LodedGridColumns = this.LodedMapGridColumns;
    GridResult = this.GridDataResult
    GridApi = this.GridDataAPi;
    KMLGridApi = this.KMLGridDataAPi;
    MapsearchLayersCategory = this.LayersCategory;
    EnergyLayerLibrary = this.MapSearchEnergyLayerLibrary;
    ActiveLayerslst = this.ActiveLayersList;
    TreeNodes = this.Treenode;
    _TreeUI = this.TreeUI;
    // GridApi = this.GridDataAPi;
    _HomeWidgetArray = this.HomeWidgetArray;
    drawingManagerTool = this.DrawingTool;
    MyDataLibrary = this.MyDataLayerLibrary;
    PrivateTreeNode = this.PrivateTreenode;
    _SharedTreeNode = this.SharedTreenode
    _PrivateTreeUI = this.PrivateTreeUI;
    _SharedTreeUI = this.SharedTreeUI;
    kmllayer = this.KmlLayers;
    KMLGridcolumns = this.MapKMLGridColumns;
    KMLGridData = this.MapKMLGridData;
    kmlLayersData = this.KmlLayersData;
    _ExternalIconList = this.ExternalIconList;
    _PipelineCreateLayer = this.PipelineCreateLayer;
    TemporaryTreeNode = this.TemporaryTreenode;
    _TemporaryTreeUI = this.TemporaryTreeUI;
    layerIndex = this.LayerIndex;
    _elevationDrawingTool = this._drawingToolForElevation;
    _graphData = this._elevationGraphData;
    _distanceDrawingTool = this._drawingToolForDistance;
    _areaDrawingTool = this._drawingToolForArea;
    // MydataLibraryCount = this.MydataLibraryTotalCount;
    _tempLayerData = this._temporaryLayerData;
    _GlobalsearchLayerList = this._GlobaleSearchEnergyLayer;
    _Systemperlst = this._SystemParameterList;
    BaseMapData = this.BaseMap;
    parcelStateData = this.parcelStates;
    wellStateData = this.wellStates;
    transProjectData = this.transProjects;
    pipeActivityData = this.pipeActivities;
    _CompanyProfile = this.CompanyProfileData;
    _PipelineActivityData = this.PipelineActivityData;
    _TransmissionProjectData = this.TransmissionProjectData;
    _PowerPlantData = this.PowerPlantData;
    _GeneratingUnitsData = this.GeneratingUnitsData;
    _UserMapData = this.UserMap;
    _SharedData = this.SharedData;
    _SharedLayersUserSearch = this.SharedLayersUserSearch;
    private legendData = new Subject<any>();
    public legendData$ = this.legendData.asObservable();
    GetLegendData() { this.legendData.next(); }

    private globalsearchData = new Subject<any>();
    public globalsearchData$ = this.globalsearchData.asObservable();
    GlobalSearchResult() { this.globalsearchData.next(); }

    bsModalRef: BsModalRef;
    showDefaultCategoryId = 1;
    temporaryLayer = [];
    MyProfileUserDetails = [];
    public ExternalEnergyLayer = [];
    public siteSelectionData: any = {
        isLayerLoaded: false,
        loadedEnergyLayerIds: null,
        loadedToolsData: null
    };
    recentLayersCountRequest = [];
    constructor(private UtilityService: UtilityService,
        private httpRequest: HttpRequestService
    ) { }

    setTreeUI(tree: any) {
        this.TreeUI.next(tree);
    }
    setTreenode(node: any) {
        this.Treenode.next(node);

    }
    setPrivateTreeUI(tree: any) {
        this.PrivateTreeUI.next(tree);
    }
    setSharedTreeUI(tree: any) {
        this.SharedTreeUI.next(tree);
    }
    setPrivateTreenode(node: any) {
        this.PrivateTreeNode.next(node);

    }
    setSharedTreenode(node: any) {
        this._SharedTreeNode.next(node);

    }
    setTemporaryTreeUI(tree: any) {
        this.TemporaryTreeUI.next(tree);
    }
    setTemporaryTreenode(node: any) {
        this.TemporaryTreenode.next(node);

    }
    setDrawToolTreenode(node: any) {
        this.DrawToolTreenode.next(node);
    }
    setSharedDrawToolTreenode(node: any) {
        this.SharedDrawToolTreenode.next(node);
    }
    setActiveLayerslist(activeLayerLibrary: any) {
        this.ActiveLayersList.next(activeLayerLibrary);
    }
    setMapSearchEnergyLayerLibrary(LayersLibrary: any) {
        this.MapSearchEnergyLayerLibrary.next(LayersLibrary);
    }
    setMapsearchLayersCategory(LayersCategory: any) {
        this.LayersCategory.next(LayersCategory);
    }
    setGridapi(GridApi: any) {
        this.GridDataAPi.next(GridApi);
    }
    setKMLGridapi(KmlGridApi: any) {
        this.KMLGridApi.next(KmlGridApi);
    }
    setGridResults(GridResults: any) {
        this.GridDataResult.next(GridResults);
    }
    setGridMapData(Grid: any) {
        this.MapGridData.next(Grid);
    }
    setLodedGridMapData(Grid: any) {
        this.LodedGridData.next(Grid);
    }
    getLodedGridMapData() {
        return this.LodedGridData;
    }
    setGridMapcolumns(columns: any) {
        this.MapGridColumns.next(columns);
    }
    getGridMapColumns() {
        return this.MapGridColumns;
    }
    setLodedGridMapcolumns(columns: any) {
        this.LodedGridColumns.next(columns);
    }
    getLodedGridMapcolumns() {
        return this.LodedGridColumns;
    }
    setTabData(tab: any) {
        this._GridTabData.next(tab);
    }
    setMap(map: any) {
        this._mapsharedata.next(map);
    }
    setHomeWidgetArray(PanelArray: any) {
        this.HomeWidgetArray.next(PanelArray);
    }
    setMyDataLayerLibrary(LayersLibrary: any) {
        this.MyDataLayerLibrary.next(LayersLibrary);
    }
    setKmlLayers(layer: any) {
        this.KmlLayers.next(layer);
    }
    setKMLGridMapData(Grid: any) {
        this.KMLGridData.next(Grid);
    }
    getKMLGridMapData() {
        return this.KMLGridData;
    }
    setKMLGridMapcolumns(columns: any) {
        this.MapKMLGridColumns.next(columns);
    }
    getKMLGridMapColumns() {
        return this.MapKMLGridColumns;
    }
    setKMLLayersData(data: any) {
        this.KmlLayersData.next(data);
    }
    // setMydataLibraryCount(count: any) {
    //     this.MydataLibraryTotalCount.next(count);
    // }
    setLayerIndex(index: any) {
        this.LayerIndex.next(index);
    }
    setExternalIconList(ExternalIcon: any) {
        this.ExternalIconList.next(ExternalIcon);
    }
    setPipelinecreatetool(Pipeline: any) {
        this.PipelineCreateLayer.next(Pipeline);
    }
    setRailroadcreatetool(RailRoad: any) {
        this.RailRoadCreateLayer.next(RailRoad);
    }
    setDrawingToolElevation(tool: any) {
        this._elevationDrawingTool.next(tool);
    }
    setElevationGraphData(data: any) {
        this._graphData.next(data);
    }
    setDrawingToolDistance(tool: any) {
        this._distanceDrawingTool.next(tool);
    }
    setDrawingToolArea(tool: any) {
        this._areaDrawingTool.next(tool);
    }
    setTemporaryLayerData(tempLayer: any) {
        this._temporaryLayerData.next(tempLayer);
    }
    setGlobaleSearchEnergyLayer(globalLayerList: any) {
        this._GlobaleSearchEnergyLayer.next(globalLayerList);
    }
    setSystemParameterList(sys: any) {
        this._SystemParameterList.next(sys);
    }
    setBaseMap(_basemap: any) {
        this.BaseMap.next(_basemap);
    }
    setParcelStates(_pStates: any) {
        this.parcelStates.next(_pStates);
    }

    setWellStates(_wStates: any) {
        this.wellStates.next(_wStates);
    }

    setTransProject(_tProjects: any) {
        this.transProjects.next(_tProjects);
    }
    setPipeActivity(_pActivities: any) {
        this.pipeActivities.next(_pActivities);
    }
    setCompanyProfileData(cmpdata) {
        this.CompanyProfileData.next(cmpdata);
    }
    setPipelineActivityData(pipelinedata) {
        this.PipelineActivityData.next(pipelinedata);
    }
    setTransmissionProjectdata(transdata) {
        this.TransmissionProjectData.next(transdata);
    }
    setPowerPlantdata(powerdata) {
        this.PowerPlantData.next(powerdata);
    }
    setGeneraryingUnitsdata(generatingdata) {
        this.GeneratingUnitsData.next(generatingdata);
    }
    getMapTitledata(): BehaviorSubject<string> {
        return this.MapTitleString;
    }
    setMapTitledata(title) {
        this.MapTitleString.next(title);
    }
    setUserMap(_usermap: any) {
        this.UserMap.next(_usermap);
    }
    setSharedData(_sharedData: any) {
        this.SharedData.next(_sharedData);
    }
    setGlobalSearchText(searchText: string) {
        this.GlobalSearchText.next(searchText);
    }
    setSharedLayersUserSearch(search: any) {
        this.SharedLayersUserSearch.next(search);
    }
    setActiveSearchDataLibrary(data: ActiveLibrary) {
        this.ActiveSearchDataLibrary.next(data);
    }

    setCreateLayerParentObj(data: any) {
        this.CreateLayerParentObj.next(data);
    }

    setLodedIsNotesArray(item: any) {
        let data = this.LodedIsNotesArray.getValue();
        let itemIndex = data.findIndex(x => x.energylayerId == item.energylayerId);
        if (itemIndex > -1) {
            // if (data[itemIndex].NotesData && item.NotesData && data[itemIndex].NotesData.length != item.NotesData.length) {
            data[itemIndex] = item;
            this.LodedIsNotesArray.next(data);
            // }
        } else {
            data.push(item);
            this.LodedIsNotesArray.next(data);
        }
    }

    setDrawingToolForParcelPoint(tool: any) {
        this.drawingToolForParcelPoint.next(tool);
    }

    setDrawingToolForParcelPointLines(tool: any) {
        this.drawingToolForParcelPointLines.next(tool);
    }

    setSitePermissions(data: any) {
        this.sitePermissions.next(data);
    }

    DestroyAllObjects() { // This Will Destroy all Observables (Use it on Logout).
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
        this.recentLayersCountRequest = [];
    }

    CreateCQL_FilterLoop(Filter, filtercondition) {

        // let sld_filter = '<Filter xmlns="http://www.opengis.net/ogc">'        
        //     + '<And>'
        let sld_filter = ''
        for (let i = 0; i < Filter.length; i++) {

            // if (Filter[i].indexOf("#OR#") !== -1) {
            //     let FilterData = Filter[i].split('#OR#');
            //     sld_filter += this.CreateCQL_FilterLoopForHome(FilterData, ' Or ');
            // }
            if (Filter[i].indexOf("#semicolon#") != -1)
                Filter[i] = Filter[i].replace(/#semicolon#/g, ";");
            if (Filter[i].indexOf("=") !== -1 && Filter[i].indexOf("<") == -1 && Filter[i].indexOf(">") == -1) {
                let FilterValue = Filter[i].split('=');
                let PropertyName = FilterValue[0];
                let Literal = FilterValue[1];
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
                let FilterValue = Filter[i].split('>');
                let PropertyName = FilterValue[0];
                let Literal = FilterValue[1];
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
                let FilterValue = Filter[i].split('>=');
                let PropertyName = FilterValue[0];
                let Literal = FilterValue[1];
                if (sld_filter == "") {

                    sld_filter = ' (' + PropertyName + ' >= ' + encodeURIComponent(Literal) + ' ';
                }
                else {
                    sld_filter += ' ' + filtercondition + PropertyName + ' >= ' + encodeURIComponent(Literal) + ' ';
                }

            }
            if (Filter[i].indexOf("<") !== -1 && Filter[i].indexOf("=") == -1 && Filter[i].indexOf("#EQUAL#") == -1) {
                let FilterValue = Filter[i].split('<');
                let PropertyName = FilterValue[0];
                let Literal = FilterValue[1];
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
                let FilterValue = Filter[i].split('<=');
                let PropertyName = FilterValue[0];
                let Literal = FilterValue[1];
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
                let FilterValue = Filter[i].split('#EQUAL#');
                let PropertyName = FilterValue[0];
                let Literal = FilterValue[1];
                // sld_filter += '<PropertyIsEqualTo matchCase="false">'
                //     + '<PropertyName>' + PropertyName + '</PropertyName>'
                //     + '<Literal>' + Literal + '</Literal>'
                //     + '</PropertyIsEqualTo>';
                if (sld_filter == "") {
                    sld_filter = ' (' + PropertyName + '=' + "'" + encodeURIComponent(Literal) + "' ";
                } else {
                    sld_filter += ' ' + filtercondition + PropertyName + '=' + "'" + encodeURIComponent(Literal) + "' ";
                }
            }
            if (Filter[i].indexOf("#NOTEQUAL#") !== -1) {
                let FilterValue = Filter[i].split('#NOTEQUAL#');
                let PropertyName = FilterValue[0];
                let Literal = FilterValue[1];
                // sld_filter += '<PropertyIsEqualTo matchCase="false">'
                //     + '<PropertyName>' + PropertyName + '</PropertyName>'
                //     + '<Literal>' + Literal + '</Literal>'
                //     + '</PropertyIsEqualTo>';
                if (sld_filter == "") {
                    sld_filter = ' (' + PropertyName + '<>' + "'" + encodeURIComponent(Literal) + "' ";
                } else {
                    sld_filter += ' ' + filtercondition + PropertyName + '<>' + "'" + encodeURIComponent(Literal) + "' ";
                }
            }
            if (Filter[i].indexOf("#LIKE#") !== -1) {
                let FilterValue = Filter[i].split('#LIKE#');
                let PropertyName = FilterValue[0];
                let Literal = FilterValue[1];
                // sld_filter += '<PropertyIsLike matchCase="false" wildCard="*" singleChar="." escape="!">'
                //     + '<PropertyName>' + PropertyName + '</PropertyName>'
                //     + '<Literal>*' + Literal + '*</Literal>'
                //     + '</PropertyIsLike>';
                if (sld_filter == "") {
                    sld_filter = ' (' + PropertyName + ' ILIKE ' + " '%25" + encodeURIComponent(Literal) + "%25' ";
                } else {
                    sld_filter += ' ' + filtercondition + PropertyName + ' ILIKE ' + " '%25" + encodeURIComponent(Literal) + "%25' ";
                }
            }
        }
        // sld_filter += '</And>'
        //     + '</Filter>'
        return sld_filter + ')';
    }

    CreateCQL_FilterLoopForHome(Filter, filtercondition) {

        let sld_filter = ''
        for (let i = 0; i < Filter.length; i++) {
            if (Filter[i]) {
                if (i == 0 || sld_filter == '')
                    sld_filter += ' (';
                else
                    sld_filter += filtercondition + ' (';
                if (Filter[i].indexOf("=") !== -1 && Filter[i].indexOf("<") == -1 && Filter[i].indexOf(">") == -1) {
                    let FilterValue = Filter[i].split('#OR#').filter(x => x != '');
                    // let Literal = FilterValue;
                    for (let j = 0; j < FilterValue.length; j++) {
                        let FilterItem = FilterValue[j].split('=');
                        let PropertyName = FilterItem[0];
                        let PropertyValue = FilterItem[1];
                        sld_filter += PropertyName + '=' + "'" + encodeURIComponent(PropertyValue) + "'" + ((FilterValue.length != j + 1) ? ' or ' : '');
                    }
                }
                if (Filter[i].indexOf("#LIKE#") !== -1 && Filter[i].indexOf("=") == -1) {
                    // let FilterValue = Filter[i].replace(/#OR#/g,' or ').replace('#AND#',' and ');
                    let FilterValue = Filter[i].split('#OR#').filter(x => x != '');
                    for (let j = 0; j < FilterValue.length; j++) {
                        let FilterItem = FilterValue[j].split('#LIKE#');
                        let PropertyName = FilterItem[0];
                        let PropertyValue = FilterItem[1];
                        sld_filter += PropertyName + ' ILIKE ' + " '%25" + encodeURIComponent(PropertyValue) + "%25' " + ((FilterValue.length != j + 1) ? ' or ' : '');
                    }
                }
                sld_filter += ' )';
            }
        }
        return sld_filter;
    }
    gridfilter(IsFiltervalue: any = []) {
        let cql_Filter = "";
        let Isreturn = false;
        if (IsFiltervalue.length > 0) {
            for (let f of IsFiltervalue) {
                if (f != undefined && f != null && f != '') {
                    let CQLFilter = this.CreateCQL_Filter(f, 'and');
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
                        cql_Filter = CQLFilter
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
    }
    filterval(IsFiltervalue: any = []) {
        let cql_Filter = "";
        let Isreturn = false;
        if (IsFiltervalue.length > 0) {
            for (let f of IsFiltervalue) {
                if (f != undefined && f != null && f != '') {
                    let CQLFilter = this.CreateCQL_Filter(f, ' and ');
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
    }
    filtervalForHomeLookup(IsFiltervalue: any = []) {
        let cql_Filter = "";
        let Isreturn = false;
        if (IsFiltervalue.length > 0) {
            for (let f of IsFiltervalue) {
                if (f != undefined && f != null && f != '') {
                    let CQLFilter = this.CreateCQL_FilterForHome(f, ' and ');
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
    }
    CreateCQL_Filter(FilterValueData, filtercondition) {

        let sld_filter = "";
        if (FilterValueData != null && FilterValueData != "") {
            // FilterValueData = FilterValueData.replace('#EQUAL#', '=');            
            if (FilterValueData.indexOf(";") !== -1) {
                let Filter = FilterValueData.split(';');
                Filter = Filter.filter(x => x != "" && x != undefined && x != null);
                for (let index = 0; index < Filter.length; index++) {
                    if (Filter[index].indexOf("#OR#") !== -1) {
                        let FilterData = Filter[index].split('#OR#');
                        if (sld_filter)
                            sld_filter += filtercondition;
                        sld_filter += this.CreateCQL_FilterLoop(FilterData, ' Or ');

                    } else if (Filter[index].indexOf(";") !== -1) {
                        sld_filter += this.CreateCQL_FilterLoop(Filter, filtercondition);
                    }
                    else if (Filter[index].indexOf(";") == -1 && Filter[index].indexOf("#OR#") == -1) {
                        if (sld_filter) {
                            sld_filter += filtercondition;
                            sld_filter += this.SingleCQL_filterFilterLoop(Filter[index]);
                        } else {
                            sld_filter += this.SingleCQL_filterFilterLoop(Filter[index]);
                        }

                    }

                }

            }
            else if (FilterValueData.indexOf("#OR#") !== -1) {
                let Filter = FilterValueData.split('#OR#');
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
    }
    CreateCQL_FilterForHome(FilterValueData, filtercondition) {
        let sld_filter = "";
        if (FilterValueData != null && FilterValueData != "") {
            // FilterValueData = FilterValueData.replace('#EQUAL#', '=');            
            if (FilterValueData.indexOf(";") !== -1) {
                let Filter = FilterValueData.split(';');
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
    }

    SingleCQL_filterFilterLoop(Filter) {
        let sld_filter = "";
        if (Filter.indexOf("#semicolon#") != -1)
            Filter = Filter.replace(/#semicolon#/g, ";");
        if (Filter.indexOf("DWITHIN") !== -1) {
            sld_filter += ' (' + Filter;
        }
        if (Filter.indexOf("#EQUAL#") !== -1) {
            let FilterValue = Filter.split('#EQUAL#');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            if (sld_filter == '')
                sld_filter += ' (' + PropertyName + ' = ' + "'" + encodeURIComponent(Literal) + "'"
            // sld_filter += '<PropertyIsEqualTo matchCase="false">'
            //     + '<PropertyName>' + PropertyName + '</PropertyName>'
            //     + '<Literal>' + Literal + '</Literal>'
            //     + '</PropertyIsEqualTo>';
        }
        if (Filter.indexOf("#LIKE#") !== -1) {
            let FilterValue = Filter.split('#LIKE#');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            // sld_filter += '<PropertyIsLike matchCase="false" wildCard="*" singleChar="." escape="!">'
            //     + '<PropertyName>' + PropertyName + '</PropertyName>'
            //     + '<Literal>*' + Literal + '*</Literal>'
            //     + '</PropertyIsLike>';
            if (sld_filter == '')
                sld_filter += ' (' + PropertyName + ' ILIKE ' + "'%25" + encodeURIComponent(Literal) + "%25'";
        }
        if (Filter.indexOf("=") !== -1 && Filter.indexOf("<") == -1 && Filter.indexOf(">") == -1) {
            let FilterValue = Filter.split('=');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            if (sld_filter == '')
                sld_filter += ' (' + PropertyName + ' = ' + "'" + encodeURIComponent(Literal) + "'"
            // sld_filter += '<PropertyIsEqualTo matchCase="false">'
            //     + '<PropertyName>' + PropertyName + '</PropertyName>'
            //     + '<Literal>' + Literal + '</Literal>'
            //     + '</PropertyIsEqualTo>';
        }
        if (Filter.indexOf(">") !== -1 && Filter.indexOf("=") == -1) {
            let FilterValue = Filter.split('>');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            if (sld_filter == '')
                sld_filter += ' (' + PropertyName + ' > ' + encodeURIComponent(Literal);
            // sld_filter += '<PropertyIsGreaterThan matchCase="false">'
            //     + '<PropertyName>' + PropertyName + '</PropertyName>'
            //     + '<Literal>' + Literal + '</Literal>'
            //     + '</PropertyIsGreaterThan>';
        }
        if (Filter.indexOf("<") !== -1 && Filter.indexOf("=") == -1) {
            let FilterValue = Filter.split('<');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            if (sld_filter == '')
                sld_filter += ' (' + PropertyName + ' < ' + encodeURIComponent(Literal);
            // sld_filter += '<PropertyIsLessThan matchCase="false">'
            //     + '<PropertyName>' + PropertyName + '</PropertyName>'
            //     + '<Literal>' + Literal + '</Literal>'
            //     + '</PropertyIsLessThan>';
        }
        if (Filter.indexOf("<=") !== -1) {
            let FilterValue = Filter.split('<=');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            // sld_filter += '<PropertyIsLessThanOrEqualTo matchCase="false">'
            //     + '<PropertyName>' + PropertyName + '</PropertyName>'
            //     + '<Literal>' + Literal + '</Literal>'
            //     + '</PropertyIsLessThanOrEqualTo>';
            sld_filter += ' (' + PropertyName + ' <= ' + encodeURIComponent(Literal);
        }
        if (Filter.indexOf(">=") !== -1) {
            let FilterValue = Filter.split('>=');
            let PropertyName = FilterValue[0];
            let Literal = FilterValue[1];
            // sld_filter += '<PropertyIsLessThanOrEqualTo matchCase="false">'
            //     + '<PropertyName>' + PropertyName + '</PropertyName>'
            //     + '<Literal>' + Literal + '</Literal>'
            //     + '</PropertyIsLessThanOrEqualTo>';
            sld_filter += ' (' + PropertyName + ' >= ' + encodeURIComponent(Literal);
        }
        if (sld_filter)
            sld_filter = sld_filter + ')';
        return sld_filter;
    }

    getForDistinctCqlFilter(filetrval, bbox) {
        let bboxval = '';
        let returnfilterval = '';
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
    }
    GenerateColumns(layer) {
        if (layer.TableName) {
            //{ 
            //     headerName: "No.",
            //     width: 80,
            //     valueGetter: "node.id",
            //     cellRenderer: "loadingRenderer",
            //hide: true
            // }
            let columns: any = [{
                headerName: "ID",
                width: 10,
                valueGetter: "node.id",
                hide: true,
                suppressSorting: true,
                suppressMenu: true,
                suppressFilter: true
            }];
            let columnslist: any = [{
                headerName: "ID",
                width: 10,
                valueGetter: "node.id",
                hide: true,
                // suppressSorting: true,
                // suppressMenu: true,
                // suppressFilter: true
            }];
            let DBFPro: any = layer.DBFProperties.split(',');
            if (layer.DBFProperties.indexOf('=') > 0) {
                DBFPro = layer.DetailPanelPropertiesMain.split(',');
            }
            else {
                DBFPro = layer.DBFProperties.split(',');
            }
            DBFPro = _.uniqWith(DBFPro, _.isEqual);
            // let DBFPro = layer.DetailPanelPropertiesMain.split(',');
            for (let p of DBFPro) {
                let col = {
                    headerName: p,
                    field: p,
                    width: 120,
                    menuTabs: ["filterMenuTab"],
                    filter: "customMatchFilter",
                    // filterParams: {
                    //     applyButton: true,
                    //     clearButton: true,
                    //     values: (params) => {
                    //         this.CloseFilterOnToggle();
                    //         setTimeout(() => {
                    //             let filedname = params.colDef.field;
                    //             for (let tab of this._GridTabData.value) {
                    //                 if (tab.ActiveClass == " active") {
                    //                     let default_filter = this.filterval(tab.IsFiltervalue);
                    //                     let cql_Filter = this.getForDistinctCqlFilter(default_filter, false);
                    //                     let lastIndexval = 60000;
                    //                     if (tab.totalCount >= 150000) {
                    //                         lastIndexval = 100000;
                    //                     }                                    
                    //                     this.httpRequest._NodeGetDatabasedonPropertyname(tab.energyLayer[0], 0, lastIndexval, cql_Filter, '', '', filedname,"")
                    //                         .subscribe(data => {
                    //                             let ArrayData: any = []
                    //                             if (data.features.length > 0) {
                    //                                 let Ldata = data.features;
                    //                                 for (let d of Ldata) {
                    //                                     ArrayData.push(d.properties)
                    //                                 }
                    //                                 this.ColumnsGriddata = ArrayData;
                    //                                 // Array.prototype.push.apply(this.ColumnsGriddata, ArrayData);
                    //                                 let result = this.ColumnsGriddata.map(a => a[filedname]);
                    //                                 let arr = this.getDistinctarray(result);
                    //                                 params.success(arr);
                    //                                 this.setDistinctvaluewithKey(arr, filedname);
                    //                             };
                    //                         }, error => {
                    //                             console.log(error);
                    //                             let result = this.ColumnsGriddata.map(a => a[filedname]);
                    //                             let arr = this.getDistinctarray(result);
                    //                             params.success(arr);
                    //                             this.setDistinctvaluewithKey(arr, filedname);
                    //                         });
                    //                     //this.GetDatabasedonPropertyname(tab.energyLayer[0], 0, lastIndexval, cql_Filter, '', '', filedname)
                    //                 }
                    //             }
                    //         }, 1000);
                    //     },
                    //     selectAllOnMiniFilter: true,
                    //     suppressMiniFilter: false,
                    //     cellHeight: 20
                    // }
                }
                if (columns.length == 1) {
                    col["cellRenderer"] = "loadingRenderer";
                }
                columns.push(col);
            }
            let DetailPanelPro = layer.DetailPanelProperties.split(',');
            if (layer.EnergyLayerStylesByUserModel && layer.EnergyLayerStylesByUserModel.length > 0) {
                let UserDetailPanelProperties = layer.EnergyLayerStylesByUserModel[0]['DetailPanelProperties'];
                if (!layer.EnergyLayerStylesByUserModel[0]['DetailPanelProperties']) {
                    DetailPanelPro = layer.DetailPanelProperties.split(',');
                }
                else {
                    DetailPanelPro = UserDetailPanelProperties.split(',');
                }
            }
            for (let x in columns) {
                let coldata = columns[x];
                let DetailPanelProres = DetailPanelPro.filter((el) => {
                    let c = el.split('=');
                    if (c[1] === coldata.field) {
                        return el;
                    }
                });
                var colWidth = 5;
                if (DetailPanelProres.length > 0) {
                    let c = DetailPanelProres[0].split("=");
                    let colTitle = c[0];
                    if (colTitle.length >= 10) {
                        colWidth += colTitle.length * 10;
                    }
                    else if (colTitle.length >= 20) {
                        colWidth += colTitle.length * 10;
                    }
                    else {
                        colWidth += 100;//colTitle.length * 5 + 5;
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
            }
            let NotesColumn = {
                headerName: 'Notes',
                field: 'Notes',
                width: 120,
                menuTabs: ["filterMenuTab"],
                filter: "customMatchFilter",
                hide: true,
                filterParams: { newRowsAction: 'clear' }
            }
            columnslist.push(NotesColumn);
            return columnslist;
        } else {
            return [];
        }
    }


    CloseFilterOnToggle() {
        $(".ag-header-cell-menu-button").off('click').on('click', function (event) {
            setTimeout(() => {
                $(".ag-menu").append("<div id='isFilterHide'></div>");
            }, 50);
            if ($('.ag-menu').length != 0) {
                if ($('#isFilterHide').length != 0) {
                    $('.ag-menu').remove();
                }
            }
        });
    }

    GenerateColumnsForKml(properties) {
        let columns: any = [];
        let columnslist: any = [];
        for (let p of properties) {
            let col = {
                headerName: p,
                field: p,
                width: 120,
                menuTabs: ["filterMenuTab"],
                filter: "agSetColumnFilter",
                filterParams: {
                    applyButton: true,
                    clearButton: true,
                    // newRowsAction: "keep",
                    values: (params) => {
                        setTimeout(() => {
                            let filedname = params.colDef.field;
                            for (let tab of this._GridTabData.value) {
                                if (tab.ActiveClass == " active") {
                                    let existingklayer = this.kmlLayersData.getValue();
                                    let selectedKmlLayerData = existingklayer.filter((el) => {
                                        if (el.LayerID == parseInt(tab.ID)) {
                                            return el;
                                        }
                                    });
                                    if (selectedKmlLayerData.length == 1) {
                                        this.ColumnsGriddata = selectedKmlLayerData[0].LayerData.KMLGeometryList;
                                        let result = this.ColumnsGriddata.map(a => a[filedname]);
                                        let arr = this.getDistinctarray(result);
                                        params.success(arr);
                                        this.SetDistinctvalueWithKeyForKml(arr, filedname);
                                    }
                                }
                            }
                        }, 1000);
                    },
                    selectAllOnMiniFilter: true,
                    suppressMiniFilter: false,
                    cellHeight: 20
                }
            }
            if (columns.length == 0) {
                col["cellRenderer"] = "loadingRenderer";
            }
            columns.push(col);
        }
        for (let x in columns) {
            let coldata = columns[x];
            var colWidth = 5;

            let colTitle = coldata.field;
            if (colTitle.length >= 10) {
                colWidth += colTitle.length * 10;
            }
            else if (colTitle.length >= 20) {
                colWidth += colTitle.length * 10;
            }
            else {
                colWidth += 100;//colTitle.length * 5 + 5;
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
    }

    setDistinctvaluewithKey(arr, filedname) {
        let Keyval = {
            Key: filedname,
            valList: arr
        }
        this.ColumnsGriddatawithKey.push(Keyval);
        $(".ag-virtual-list-viewport").scroll((e) => {
            this.Gridcolumncheckboxevent();
        });
        this.Gridcolumncheckboxevent();
        $('#selectAll').attr('checked', false).trigger('click');
        if (document.getElementById("clearButton") != null)
            $('#clearButton').attr('disabled', 'disabled');
    }

    SetDistinctvalueWithKeyForKml(arr, filedname) {
        let Keyval = {
            Key: filedname,
            valList: arr
        }
        this.ColumnsGriddatawithKey.push(Keyval);
        $(".ag-virtual-list-viewport").scroll((e) => {
            this.GridColumnCheckboxEventForKml();
        });
        this.GridColumnCheckboxEventForKml();
        $('#selectAll').attr('checked', false).trigger('click');
        if (document.getElementById("clearButton") != null)
            $('#clearButton').attr('disabled', 'disabled');
    }


    getDistinctarray(result) {
        var arr = [];
        for (var i = 0; i < result.length; i++) {
            if (result[i] != undefined && result[i] != null) {
                if (!arr.includes(result[i])) {
                    arr.push(result[i]);
                }
            }
        }
        return arr;
    }
    ClearColumncheckvalue() {
        this.ColumnsGriddatawithKey = []
        this.columnfilterval = [];
    }
    Gridcolumncheckboxevent() {
        setTimeout(() => {
            $("#myGrid #richList .ag-filter-checkbox").off('click').on('click', (e) => {
                let filterval = '';
                if ($(e.currentTarget.offsetParent).length > 0) {
                    filterval = $(e.currentTarget.offsetParent)[0].children[0].children[1].innerText;
                }
                if (filterval != '') {
                    //this._columnfiltervalStatus = "";
                    //let checked = e.toElement.className.indexOf('ag-icon-checkbox-checked');                
                    let checked = e.currentTarget.innerHTML.indexOf('ag-icon-checkbox-checked');
                    this.setGridFirlter(checked, filterval);
                    //this.Gridcolumncheckboxevent();
                }
            });
            $("#myGrid #richList .ag-virtual-list-item").off('click').on('click', (e) => {
                let filterval = e.toElement.innerText;
                //let checked = e.currentTarget.children[0].innerHTML.indexOf('ag-icon-checkbox-unchecked');
                let checked = e.currentTarget.innerHTML.indexOf('ag-icon-checkbox-checked');
                // this._columnfiltervalStatus = "";
                this.setGridFirlter(checked, filterval);
            });
        }, 100);
    }

    GridColumnCheckboxEventForKml() {
        setTimeout(() => {
            $("#kmlGrid #richList .ag-filter-checkbox").off('click').on('click', (e) => {
                let filterval = '';
                if ($(e.currentTarget.offsetParent).length > 0) {
                    filterval = $(e.currentTarget.offsetParent)[0].children[0].children[1].innerText;
                }
                if (filterval != '') {
                    let checked = e.currentTarget.innerHTML.indexOf('ag-icon-checkbox-checked');
                    this.SetGridFirlterForKml(checked, filterval);
                }
            });
            $("#kmlGrid #richList .ag-virtual-list-item").off('click').on('click', (e) => {
                let filterval = e.toElement.innerText;
                let checked = e.currentTarget.innerHTML.indexOf('ag-icon-checkbox-checked');
                this.SetGridFirlterForKml(checked, filterval);
            });
        }, 100);
    }

    setGridFirlter(Ischecked, filterval) {
        //let filterval = filterval;
        let isfilterval: boolean = false;
        //let abc = e.target.children[0].children[0].classList;
        this.columnfilterval.forEach(element => {
            if (element.Filterparamvalue == filterval) {
                isfilterval = true;
            }
        });
        if (Ischecked >= 0) {
            if (filterval && isfilterval) {
                let list = [];
                if (this.columnfilterval.length == 1) {
                    this.columnfilterval.forEach(element => {
                        if (element.Filterparamvalue != filterval && isfilterval == false) {
                            list.push(element);
                        }
                    });
                }
                else {
                    this.columnfilterval.forEach(element => {
                        if (element.Filterparamvalue != filterval && isfilterval == true) {
                            list.push(element);
                        }
                    });
                }
                if (list.length > 0) {
                    this.columnfilterval = list;
                    this._columnfiltervalStatus = "";
                    // this.setFilterOngrid(this.columnfilterval);
                }
                else {
                    // this.columnfilterval = list;
                }
                if (isfilterval == true) {
                    let Filtyerval = this.setFilterOngrid(list);
                    let GridAPi = this.GridDataAPi.value.api;
                    if (Filtyerval) {
                        GridAPi.setFilterModel(Filtyerval);
                        GridAPi.onFilterChanged();
                    }
                    else {
                        let filterval = {
                            key: ''
                        }
                        let a = JSON.stringify(filterval).replace("key", this.columnfilterval[0].filterparam);
                        GridAPi.setFilterModel(JSON.parse(a));
                        GridAPi.onFilterChanged();
                        // let clearbtn = document.getElementById("clearButton");
                        // clearbtn.click();
                    }
                }
                if (list.length == 0) {
                    this.columnfilterval = list;
                    this._columnfiltervalStatus = "Clear All Filter";
                }
            }
        }
        else {
            if (filterval) {
                for (let c of this.ColumnsGriddatawithKey) {
                    for (let v of c.valList) {
                        if (filterval == v && isfilterval == false) {
                            let filtervalarr = {
                                filterparam: c.Key,
                                Filterparamvalue: v
                            }
                            this.columnfilterval.push(filtervalarr);
                            this._columnfiltervalStatus = "";
                        }
                    }
                }
                if (isfilterval == false) {
                    let Filtyerval = this.setFilterOngrid(this.columnfilterval);
                    let GridAPi = this.GridDataAPi.value.api;
                    if (Filtyerval) {
                        GridAPi.setFilterModel(Filtyerval);
                        GridAPi.onFilterChanged();
                    }
                    else {
                        this._columnfiltervalStatus = "";
                        let clearbtn = document.getElementById("clearButton");
                        clearbtn.click();
                    }
                }
            }
        }
        if (isfilterval == false) {
            this.Gridcolumncheckboxevent();
        }
    }

    SetGridFirlterForKml(Ischecked, filterval) {
        //let filterval = filterval;
        let isfilterval: boolean = false;
        //let abc = e.target.children[0].children[0].classList;
        this.columnfilterval.forEach(element => {
            if (element.Filterparamvalue == filterval) {
                isfilterval = true;
            }
        });
        if (Ischecked >= 0) {
            if (filterval && isfilterval) {
                let list = [];
                if (this.columnfilterval.length == 1) {
                    this.columnfilterval.forEach(element => {
                        if (element.Filterparamvalue != filterval && isfilterval == false) {
                            list.push(element);
                        }
                    });
                }
                else {
                    this.columnfilterval.forEach(element => {
                        if (element.Filterparamvalue != filterval && isfilterval == true) {
                            list.push(element);
                        }
                    });
                }
                if (list.length > 0) {
                    this.columnfilterval = list;
                    this._columnfiltervalStatus = "";
                    // this.setFilterOngrid(this.columnfilterval);
                }
                else {
                    // this.columnfilterval = list;
                }
                if (isfilterval == true) {
                    let Filtyerval = this.setFilterOngrid(list);
                    let GridAPi = this.KMLGridDataAPi.value.api;
                    if (Filtyerval) {
                        GridAPi.setFilterModel(Filtyerval);
                        GridAPi.onFilterChanged();
                    }
                    else {
                        let filterval = {
                            key: ''
                        }
                        let a = JSON.stringify(filterval).replace("key", this.columnfilterval[0].filterparam);
                        GridAPi.setFilterModel(JSON.parse(a));
                        GridAPi.onFilterChanged();
                        // let clearbtn = document.getElementById("clearButton");
                        // clearbtn.click();
                    }
                }
                if (list.length == 0) {
                    this.columnfilterval = list;
                    this._columnfiltervalStatus = "Clear All Filter";
                }
            }
        }
        else {
            if (filterval) {
                for (let c of this.ColumnsGriddatawithKey) {
                    for (let v of c.valList) {
                        if (filterval == v && isfilterval == false) {
                            let filtervalarr = {
                                filterparam: c.Key,
                                Filterparamvalue: v
                            }
                            this.columnfilterval.push(filtervalarr);
                            this._columnfiltervalStatus = "";
                        }
                    }
                }
                if (isfilterval == false) {
                    let Filtyerval = this.setFilterOngrid(this.columnfilterval);
                    let GridAPi = this.KMLGridDataAPi.value.api;
                    if (Filtyerval) {
                        GridAPi.setFilterModel(Filtyerval);
                        GridAPi.onFilterChanged();
                    }
                    else {
                        this._columnfiltervalStatus = "";
                        let clearbtn = document.getElementById("clearButton");
                        clearbtn.click();
                    }
                }
            }
        }

        if (isfilterval == false) {
            this.GridColumnCheckboxEventForKml();
        }
    }


    setFilterOngrid(columnfilterval) {
        let keylist = [];
        let FinalfilterList;
        columnfilterval.forEach(element => {
            keylist.push(element.filterparam);
        });
        if (keylist.length > 0) {
            let Gridfilter = [];
            keylist = _.uniqWith(keylist, _.isEqual);
            for (let key of keylist) {
                let columnFilter = [];
                for (let f of columnfilterval) {
                    if (f.filterparam == key) {
                        columnFilter.push(f.Filterparamvalue);
                    }
                }
                if (columnFilter.length > 0) {
                    let val = {
                        key: columnFilter
                    }
                    let a = JSON.stringify(val).replace("key", key);
                    Gridfilter.push(JSON.parse(a));
                }
            }
            if (Gridfilter.length > 0) {
                for (let i = 0; i < Gridfilter.length; i++) {
                    if (i > 0) {
                        let key = keys(Gridfilter[i])[0];
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
    }
    // #region Export Features
    GetExportColumnsList(layer) {
        let columns: any = [];
        let columnslist: any = [];
        let DBFPro: any = layer.DBFProperties.split(',');
        if (layer.DBFProperties.indexOf('=') > 0) {
            DBFPro = layer.DetailPanelPropertiesMain.split(',');
        }
        else {
            DBFPro = layer.DBFProperties.split(',');
        }
        // let DBFPro = layer.DetailPanelPropertiesMain.split(',');
        for (let p of DBFPro) {
            let col = {
                headerName: p,
                field: p
            }
            columns.push(col);

        }
        let DetailPanelPro = layer.DetailPanelProperties.split(',');
        for (let x in columns) {
            let coldata = columns[x];
            let DetailPanelProres = DetailPanelPro.filter((el) => {
                let c = el.split('=');
                if (c[1] === coldata.field) {
                    return el;
                }
            });
            if (DetailPanelProres.length > 0) {
                let c = DetailPanelProres[0].split("=");
                columns[x].headerName = c[0];
                columnslist.push(columns[x]);
            }
        }
        return columnslist;
    }
    public exportAsExcelFile(json: any[], excelFileName: string, ListOfParametter: any, EIDColindexvalList: any): void {
        let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        //var ws = XLSX.utils.aoa_to_sheet(json);
        worksheet['!cols'] = [];
        for (let I = 0; I < ListOfParametter.length; I++) {
            if (ListOfParametter[I].indexOf("EID") >= 0) {
                worksheet['!cols'][I - 1] = { hidden: true };
            }
        }
        //var index = ListOfParametter.indexOf("EID");
        const workbook: XLSX.WorkBook = { Sheets: { 'Export': worksheet }, SheetNames: ['Export'] };
        let excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }
    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }
    //End Export feature


    SetInfoBoxCqlFilter(filetrval: string, bbox: boolean, bboxinfoboxval: string, LayerType: string = undefined) {
        let bboxval = '';
        let returnfilterval = '';
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
        } else if (LayerType == 'Area') {
            if (bbox == true) {
                let bboxArr = bboxinfoboxval.split(',');
                let bboxstr = bboxArr[0] + ' ' + bboxArr[1] + ', ' + bboxArr[2] + ' ' + bboxArr[1] + ', ' + bboxArr[2] + ' ' + bboxArr[3] + ', ' + bboxArr[0] + ' ' + bboxArr[3] + ', ' + bboxArr[0] + ' ' + bboxArr[1];
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

    }

    setTempCqlFilter(filetrval, bbox) {
        let bboxval = '';
        let returnfilterval = '';
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

    }


    GetInfoBoxMapBound() {
        var bounds = this._mapdata.getValue().getBounds();
        let x1, x2, y1, y2;
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
    }

    setDrawingTool(dTool: any) {
        this.DrawingTool.next(dTool);
    }

    //End
    GetAllChildNodeData() {
        return this.UtilityService.GetChildNodeData(this.TreeNodes.getValue());
    }
    getPreviewImageLink(PreviewImage) {
        if (PreviewImage.indexOf('images/energylayers/preview/') >= 0) {
            let splitvalpath = PreviewImage.split('/');
            if (splitvalpath.length > 0) {
                PreviewImage = environment.ImagespreviewPath + "/Preview/" + splitvalpath[splitvalpath.length - 1];
            }
        }
        return PreviewImage;
    }


    SetModal(modalname) {
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
            top: 100,
        });

        setTimeout(() => {
            $("#" + modalname).css({
                height: '0px',
                top: 100,
            });
        }, 500);

        $('.modal-backdrop').hide();
    }

}
