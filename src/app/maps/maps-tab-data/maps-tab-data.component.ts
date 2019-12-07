import { Component, OnInit, Input } from '@angular/core';
import { MapServiceService } from '../../services/map-service.service';
import { RootLayout } from '../../@pages/layouts';
import { GridOptions } from 'ag-grid-community';
import { GoogleMapPage } from '../google/google.component';
import { CustomFilterComponent } from './custom-filter/custom-filter.component';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-maps-tab-data',
  templateUrl: './maps-tab-data.component.html',
  styleUrls: ['./maps-tab-data.component.scss']
})
export class MapsTabDataComponent extends RootLayout implements OnInit {
  @Input() tab;
  activeTabId
  public gridApi;
  public gridColumnApi;
  public kmlGridApi;
  public kmlGridColumnApi;
  public GridData: any = [];
  public Gridcolumns: any = [];
  public KMLGridData: any = [];
  public KMLGridcolumns: any = [];
  rowSelection = "multiple";
  rowModelType = "infinite";
  paginationPageSize = 100;
  cacheOverflowSize = 2;
  maxConcurrentDatasourceRequests = 2;
  infiniteInitialRowCount = 1;
  maxBlocksInCache = 2;
  getRowNodeId;
  //mapfilterval = '';
  // GridfilterList = [];
  gridOptions;
  frameworkComponents;
  GoogleMapPage: GoogleMapPage;
  components = {
    loadingRenderer: (params) => {
      if (params.value !== undefined) {
        return params.value;
      } else {
        return '<div><img src="https://node.envisionmaps.net/images/loading.gif"></div>';
      }
    }
  };
  ngOnInit() {
    this.frameworkComponents = { customMatchFilter: CustomFilterComponent };
    this.gridOptions = <GridOptions>{
      context: { thisComponent: this }
    }
    setTimeout(() => this.GoogleMapPage = this.Injector.get(GoogleMapPage));
    this.gridOptions = <GridOptions>{
      context: { thisComponent: this }
    }
    this.getRowNodeId = (item) => {
      return item.id;
    };
    if (this.tab) {
      this.MapServiceService.LodedIsNotesArray.subscribe(x => {
        let columns = this.MapServiceService.GridColumns.getValue();
        this.ShowNotesColumn(columns, true);
      })
      this.MapServiceService.getGridMapColumns().subscribe(x => {
        this.Gridcolumns = x;
        setTimeout(() => {
          this.ShowNotesColumn(x);
        }, 150);
      });
      this.MapServiceService.getKMLGridMapData().subscribe(x => {
        this.KMLGridData = x;
      });
      this.MapServiceService.getKMLGridMapColumns().subscribe(x => {
        this.KMLGridcolumns = x;
      })
    }
  }

  ShowNotesColumn(columns: any[], forcedColumnUpdate: boolean = false) {
    if (!columns)
      return;
    let NotesColIndex = columns.findIndex(y => y.field == 'Notes' && y.headerName == 'Notes');
    if (NotesColIndex > -1) {
      let TabList = this.MapServiceService._GridTabData.value;
      for (let t = 0; t < TabList.length; t++) {
        if (TabList[t].ActiveClass == " active" && this.gridApi) {
          for (let i = 0; i < TabList[t].energyLayer.length; i++) {
            let energyLayer = TabList[t].energyLayer[i];
            let energyLayerId = energyLayer.EnergyLayerID;
            let NotesData = this.MapServiceService.LodedIsNotesArray.getValue();
            let LodedIsNotes = NotesData.find(x => x.energylayerId == energyLayer.EnergyLayerID);
            if (LodedIsNotes) {
              columns[NotesColIndex].hide = LodedIsNotes.NotesData.length > 0 ? false : true;
              if (forcedColumnUpdate == true)
                this.gridApi.setColumnDefs(columns);
            } else {
              let data = {
                userId: this.AuthServices.getLoggedinUserId(),
                energylayerId: energyLayerId
              }
              this.httpService._NodeGetInfoboxNotesforLayer(data).subscribe(res => {
                if (res._Issuccess == true) {
                  if (res.data && res.data.length >= 0) {
                    columns[NotesColIndex].hide = res.data.length > 0 ? false : true;;
                    this.Gridcolumns = columns;
                    let item = {
                      energylayerId: energyLayerId,
                      NotesData: res.data
                    }
                    this.MapServiceService.setLodedIsNotesArray(item);
                    this.gridApi.setColumnDefs(columns);
                  }
                }
              })
            }
          }
        }
      }
    }
  }

  getContextMenuItems(params) {
    let element = document.querySelector("app-maps-tab-data");
    params.api.setPopupParent(element);
    setTimeout(() => {
      let element2 = document.querySelector("ag-grid-angular");
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
  }

  ZoomtoMap(column, zoom = 12, isZoomFromMapGrid: boolean = false) {
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
      let bbox = column.bbox;
      // Find the avrage of latlngs from given LatLngs
      var latitude = 0;
      var longtitude = 0;
      for (let i = 0; i < bbox.length; i++) {
        let Lng = bbox[i];
        let Lat = bbox[i + 1];
        latitude = latitude + Lat;
        longtitude = longtitude + Lng;
        i++;
      }
      latitude = latitude / (bbox.length / 2);
      longtitude = longtitude / (bbox.length / 2);

      var myMap: any = this.MapServiceService._mapdata.getValue();
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
  }

  onGridReady(params) {
    try {
      
      this.hidethePaceProcessbar();
      var TabList = this.MapServiceService._GridTabData.value;
      for (let t = 0; t < TabList.length; t++) {
        if (TabList[t].ActiveClass == " active") {
          this.gridApi = params.api;
          this.gridColumnApi = params.columnApi;
          this.MapServiceService.setGridapi(params);
          var default_filter = this.MapServiceService.filterval(TabList[t].IsFiltervalue);
          var cql_Filter = this.setCqlFilter(default_filter, true);
          this.hidethePaceProcessbar();
          // this.httpService._NodegetLayerData(TabList[t].energyLayer[0], 0, 1, cql_Filter, '', '')
          //   .subscribe(data => {
          // let Data: any = data;
          // let total = Data.totalFeatures;
          // let Viewing = " - Viewing " + total + " of " + TabList[t]['totalCount'];
          // TabList[t].Title = TabList[t]['DisplayName'] + Viewing;
          var dataSource = {
            rowCount: null,
            getRows: (params) => {
              
              var default_filter = '';
              if (TabList[t].energyLayer.length > 0 && TabList[t].energyLayer[0].IsFromHomeLookup) {
                default_filter = this.MapServiceService.filtervalForHomeLookup(TabList[t].IsFiltervalue);
              } else {
                default_filter = this.MapServiceService.filterval(TabList[t].IsFiltervalue);
              }

              var TableName = TabList[t].energyLayer[0].TableName;
              var IsEnergyLayer = TabList[t].energyLayer[0].isEnergyLayer;
              var IsPrivateLayer = TabList[t].energyLayer[0].isPrivateLayer;
              var Isbox = true;
              if (TableName.indexOf("ParcelPoints_") >= 0 && this.MapServiceService.ParcelCenterLookupZoom == false) {
                Isbox = false;
              } else {
                Isbox = true;
              }
              var cql_Filter = this.setCqlFilter(default_filter, Isbox);
              var sortby = 'gid a';
              var isclear = false;
              var filterModel = params.filterModel;
              var keys = Object.keys(filterModel);
              this.GoogleMapPage.GridfilterList = [];
              var filterParam = '';
              var allStoredData: StoredData[] = this.MapServiceService.LodedGridData.getValue();
              this.GoogleMapPage.mapfilterval = '';
              if (Object.keys(params.filterModel).length == 1) {
                this.unchckedAllfilterop();
              }
              if (Object.keys(params.filterModel).length == 0) {
                this.unchckedAllfilterop();
                if (this.MapServiceService._columnfiltervalStatus == "Clear All Filter") {
                  this.addandremovefilterLayeronMap(TabList[t]);
                }
              }
              if (Object.keys(params.filterModel).length > 0) {
                this.ClearColumnEventListner(TabList, t);
                let isfilter = false;
                let textFilter = '';
                for (let k of keys) {
                  let filterval = '';
                  if (filterModel[k].textFilterVal)
                    textFilter = filterModel[k].textFilterVal;
                  if (filterModel[k].values) {
                    isfilter = true;
                    if (filterModel[k].values.length > 0 || filterModel[k].textFilterVal) {
                      if (k == "Notes") {
                        filterval = this.getCQLFilterfromNotesVal(filterModel[k].values, TabList[t].energyLayer[0].EnergyLayerID);
                      } else {
                        var filtervalindex = 0
                        for (let v of filterModel[k].values) {
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
                      if (!this.GoogleMapPage.mapfilterval) {
                        this.GoogleMapPage.mapfilterval += filterval;
                      }
                      else {
                        this.GoogleMapPage.mapfilterval = this.GoogleMapPage.mapfilterval + ';' + filterval;
                      }
                      this.GoogleMapPage.GridfilterList.push(filterval);
                    }
                    else if ($("#ag-mini-filter > :input").val()) {
                      filterval = k + '#LIKE#' + encodeURIComponent($("#ag-mini-filter > :input").val());
                      this.GoogleMapPage.GridfilterList.push(filterval);
                      this.GoogleMapPage.mapfilterval += ';' + filterval;
                      // filterval = k + '=' + encodeURIComponent($("#ag-mini-filter > :input").val());
                      filterParam += this.MapLayerService.SingleFilterLoop(filterval);
                    }
                  }
                  if (!filterModel[k].values) {
                    if (filterModel[k].filter) {
                      filterval = filterModel[k].filter.toString().toLocaleLowerCase();
                      filterParam += this.serversidefilter(filterval, filterModel, k, '', false, TabList[t].IsFiltervalue);
                    }
                    else {
                      for (let c = 1; c <= 2; c++) {
                        if (c == 1) {
                          filterval = filterModel[k].condition1.filter.toString().toLocaleLowerCase();
                          filterParam += this.serversidefilter(filterval, filterModel[k].condition1, k, '', true, TabList[t].IsFiltervalue);
                        }
                        else {
                          filterval = filterModel[k].condition2.filter.toString().toLocaleLowerCase();
                          filterParam += this.serversidefilter(filterval, filterModel[k].condition2, k, '', true, TabList[t].IsFiltervalue);
                        }
                      }
                    }
                  }
                }
                if (IsEnergyLayer || IsPrivateLayer) {
                  TabList[t].EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer = true;
                  TabList[t].EnergylayersavegridFilter.mapfilterval = this.GoogleMapPage.mapfilterval;
                  TabList[t].EnergylayersavegridFilter["mapfilterColumns"] = keys;

                }
                default_filter = this.MapServiceService.filterval(TabList[t].IsFiltervalue);
                let Gridfilter = this.MapServiceService.gridfilter(this.GoogleMapPage.GridfilterList);
                if (default_filter == '' && Gridfilter != '') {
                  default_filter = '(' + Gridfilter + ')';
                }
                else if (Gridfilter != '' && default_filter != '') {
                  default_filter = '(' + Gridfilter + ') and (' + default_filter + ')';
                }
                //var ISFilter_Changed = allStoredData.find(x => (x.cql_filter == cql_Filter) && (x.TabData.EnergyLayerID == TabList[t].energyLayer[0].EnergyLayerID) && (x.TabData.LayerName == TabList[t].energyLayer[0].LayerName));
                // if (isfilter == true && !ISFilter_Changed)  {
                if (isfilter == true) {
                  setTimeout(() => {
                    this.addandremovefilterLayeronMap(TabList[t]);
                  }, 500);
                  this.GoogleMapPage.getTotalCount();
                }
                else {
                  //this.addandremovefilterLayeronMap(TabList[t]);
                }

              }
              else {
                let serviceGridfilter = this.MapServiceService.gridfilter([TabList[t].EnergylayersavegridFilter.mapfilterval]);
                if (default_filter == '' && serviceGridfilter != '') {
                  default_filter = '(' + serviceGridfilter + ')';
                }
                else if (serviceGridfilter != '' && default_filter != '') {
                  default_filter = '(' + serviceGridfilter + ') and (' + default_filter + ')';
                }
                //cql_Filter = this.setCqlFilter(default_filter, Isbox);
              }
              cql_Filter = this.setCqlFilter(default_filter, true);
              if (params.sortModel.length > 0) {
                sortby = params.sortModel[0].colId;
                if (params.sortModel[0].sort == "asc") {
                  sortby += ' a'
                }
                else {
                  sortby += ' d';
                }
              }
              this.hidethePaceProcessbar();
              var findData = allStoredData.find(x => ((x.cql_filter == cql_Filter) && (x.TabData.EnergyLayerID == TabList[t].energyLayer[0].EnergyLayerID) && (x.TabData.LayerName == TabList[t].energyLayer[0].LayerName) && (x.endRow == params.endRow) && (x.sortBy == sortby) && (x.startRow == params.startRow) && (x.tableName == TableName)));
              if (findData && findData.data && findData.data.length > 0) {
                params.successCallback(findData.data, findData.totalFetures);
                if (TableName.indexOf("ParcelPoints_") >= 0 && this.MapServiceService.ParcelCenterLookupZoom == false) {
                  this.MapServiceService.ParcelCenterLookupZoom = true;
                  this.ZoomtoMap(findData.data[0], 15);
                }
                if ((TableName.indexOf("ParcelPoints_") >= 0 || TableName.indexOf("Parcels_") >= 0) && this.MapServiceService.SiteselectionToolZoom == false) {
                  this.MapServiceService.SiteselectionToolZoom = true;
                  this.ZoomtoMap(findData.data[0], 15);
                }
              } else {
                let UserId = this.AuthServices.getLoggedinUserId();
                this.httpService._NodegetLayerData(TabList[t].energyLayer[0], params.startRow, params.endRow, cql_Filter, sortby, '', UserId)
                  .then(data => {
                    if (TabList[t]) {
                      var Data: any = data;
                      if (Data["totalFeatures"]) {
                        var total = Data.totalFeatures;
                        if (this.GoogleMapPage.mapfilterval != '') {
                          var Viewing = " - Viewing " + total + " of " + TabList[t]['totalCount'];
                          TabList[t].Title = TabList[t]['DisplayName'] + Viewing;
                        }
                        var Ldata1 = Data.features;
                        var ArrayData1 = [];
                        for (let d of Ldata1) {
                          ArrayData1.push(d.properties)
                        }
                        var rowsThisPage = ArrayData1
                        var lastRow = -1;
                        if (total <= params.endRow) {
                          lastRow = total;
                        }
                        var storeData: StoredData[] = this.MapServiceService.LodedGridData.getValue();
                        rowsThisPage.forEach(x => {
                          x['Tablename'] = TableName;
                        });
                        var newData: StoredData = new StoredData();
                        newData.TabData = TabList[t].energyLayer[0];
                        newData.cql_filter = cql_Filter;
                        newData.data = rowsThisPage;
                        newData.endRow = params.endRow;
                        newData.totalFetures = lastRow;
                        newData.sortBy = sortby;
                        newData.startRow = params.startRow;
                        newData.tableName = TableName;
                        if (TableName.indexOf("ParcelPoints_") >= 0 && this.MapServiceService.ParcelCenterLookupZoom == false) {
                          this.MapServiceService.ParcelCenterLookupZoom = true;
                          this.ZoomtoMap(newData.data[0], 15);
                        }
                        if ((TableName.indexOf("ParcelPoints_") >= 0 || TableName.indexOf("Parcels_") >= 0) && this.MapServiceService.SiteselectionToolZoom == false) {
                          this.MapServiceService.SiteselectionToolZoom = true;
                          this.ZoomtoMap(newData.data[0], 15);
                        }
                        if (storeData && storeData.length >= 0) {
                          storeData.push(newData);
                          this.MapServiceService.setLodedGridMapData(storeData);
                        }
                        this.SetGridDataWithNotes(params, rowsThisPage, lastRow, TabList[t].energyLayer[0].EnergyLayerID);
                        // params.successCallback(rowsThisPage, lastRow);
                        this.setgridhight();
                        // this.unchckedAllfilterop();
                        // this.MapServiceService.Gridcolumncheckboxevent();
                        //this.GoogleMapPage.getTotalCount();

                      } else {
                        console.log(Data);
                        params.successCallback([], 0);
                      }
                    }
                  });
              }

            }
          };
          params.api.setDatasource(dataSource);
          this.MapServiceService.CloseFilterOnToggle();
          // });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  getCQLFilterfromNotesVal(NotesVals, energyLayerId) {
    let filterval = '';
    for (let v of NotesVals) {
      if (v == null) {
        v = ' ';
      }
      let NotesData = this.MapServiceService.LodedIsNotesArray.getValue();
      let NotesItem = NotesData.find(x => x.energylayerId == energyLayerId);
      if (NotesItem && NotesItem.NotesData && NotesItem.NotesData.length > 0) {
        let NotesArr = NotesItem.NotesData.filter(x => x.NoteValue == v);
        if (NotesArr && NotesArr.length > 0) {
          for (let i = 0; i < NotesArr.length; i++) {
            let Note = NotesArr[i];
            if (Note.EnergyLayerRecordLabel && Note.EnergyLayerRecordId) {
              if (filterval == '')
                filterval = Note.EnergyLayerRecordLabel + "=" + Note.EnergyLayerRecordId;
              else
                filterval += '#OR#' + Note.EnergyLayerRecordLabel + "=" + Note.EnergyLayerRecordId;
            }
          }

        }
      }

    }
    return filterval;
  }

  SetGridDataWithNotes(gridApi, data, totalFeatures, energyLayerId) {
    let notesArr = this.MapServiceService.LodedIsNotesArray.getValue();
    if (notesArr && notesArr.length > 0) {
      let notesItem = notesArr.find(x => x.energylayerId == energyLayerId);
      if (notesItem) {
        if (notesItem.NotesData && notesItem.NotesData.length > 0) {
          data.forEach(item => {
            item['Notes'] = '';
            for (let i = 0; i < notesItem.NotesData.length; i++) {
              let noteItem = notesItem.NotesData[i];
              if (item[noteItem.EnergyLayerRecordLabel] == noteItem.EnergyLayerRecordId) {
                if (item['Notes'] == '') {
                  item['Notes'] = noteItem.NoteValue;
                } else {
                  item['Notes'] = item['Notes'] + ', ' + noteItem.NoteValue;
                }
              }
            }
          });
          gridApi.successCallback(data, totalFeatures);
        } else {
          gridApi.successCallback(data, totalFeatures);
        }
      } else {
        gridApi.successCallback(data, totalFeatures);
      }
    } else {
      gridApi.successCallback(data, totalFeatures);
    }
  }

  OnKMLGridReady(params) {
    try {
      this.hidethePaceProcessbar();
      let TabList = this.MapServiceService._GridTabData.value;
      for (let t = 0; t < TabList.length; t++) {
        if (TabList[t].ActiveClass == " active") {
          this.kmlGridApi = params.api;
          this.kmlGridColumnApi = params.columnApi;
          this.MapServiceService.setKMLGridapi(params);
          this.hidethePaceProcessbar();
          let Viewing = " - Viewing " + TabList[t]['totalCount'] + " of " + TabList[t]['totalCount'];
          TabList[t].Title = TabList[t]['DisplayName'] + Viewing;
          let dataSource = {
            rowCount: null,
            getRows: (params) => {
              let sortby = 'gid a';
              let isclear = false;
              let filterModel = params.filterModel
              let keys = Object.keys(filterModel);
              this.GoogleMapPage.GridfilterList = [];
              let filterParam = '';
              this.GoogleMapPage.mapfilterval = '';
              if (Object.keys(params.filterModel).length == 1) {
                this.unchckedAllfilterop();
              }
              if (Object.keys(params.filterModel).length == 0) {
                this.unchckedAllfilterop();
                //this.getTotalCount();
                if (this.MapServiceService._columnfiltervalStatus == "Clear All Filter") {
                  this.AddAndRemoveFilterLayeronMapForKML(TabList[t]);
                }
              }
              if (Object.keys(params.filterModel).length > 0) {
                if (document.getElementById("clearButton") != null) {
                  $('#clearButton').removeAttr('disabled');
                  document.getElementById("clearButton").addEventListener("click", (event) => {
                    if (isclear == false) {
                      isclear = true;
                      this.MapServiceService.KMLGridData.getValue().length = 0;
                      setTimeout(() => {
                        let existingklayer = this.MapServiceService.kmlLayersData.getValue();
                        let selectedKmlLayer = existingklayer.filter((el) => {
                          if (el.LayerID == parseInt(TabList[t].energyLayer[0].DataSetID)) {
                            return el;
                          }
                        });
                        if (selectedKmlLayer.length == 1) {
                          let result = selectedKmlLayer[0].LayerData;
                          if (result.KMLGeometryList[0].hasOwnProperty('Name')) {
                            let ArrayData: any = [""];
                            let nameData = result.KMLGeometryList.map(a => a.Name);
                            for (let d of nameData) {
                              ArrayData.push({ Name: d });
                            }
                            Array.prototype.push.apply(this.MapServiceService.KMLGridData.getValue(), ArrayData);
                          }
                        }
                      }, 2000);
                      for (let s of TabList[t].energyLayer) {
                        if (((s.EnergyParentID == parseInt(TabList[t].parentID)) && (s.EnergyLayerID == parseInt(TabList[t].ID)))) {
                          this.PrivateMapLayerService.RemoveKmlLayer(s);
                          this.GoogleMapPage.mapfilterval = '';
                          s["serversidefilterval"] = ''
                        }
                      }
                      for (let s of TabList[t].energyLayer) {
                        if (((s.EnergyParentID == parseInt(TabList[t].parentID)) && (s.EnergyLayerID == parseInt(TabList[t].ID)))) {

                          //KML
                          // this.LoadPrivateKmlLayers(s);
                        }
                      }
                      this.MapServiceService.ClearColumncheckvalue();
                    }
                  });
                }
                let isfilter = false;
                for (let k of keys) {
                  let filterval = '';
                  if (filterModel[k].values) {
                    if (filterModel[k].values.length > 0) {
                      isfilter = true;
                      var filtervalindex = 0;
                      for (let v of filterModel[k].values) {
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
                      if (this.GoogleMapPage.mapfilterval == "") {
                        this.GoogleMapPage.mapfilterval += filterval;
                      }
                      else {
                        this.GoogleMapPage.mapfilterval = this.GoogleMapPage.mapfilterval + ';' + filterval;
                      }
                      this.GoogleMapPage.GridfilterList.push(filterval);
                    }
                    else if ($("#ag-mini-filter > :input").val()) {
                      filterval = k + '#LIKE#' + encodeURIComponent($("#ag-mini-filter > :input").val());
                      this.GoogleMapPage.GridfilterList.push(filterval);
                      this.GoogleMapPage.mapfilterval += ';' + filterval;
                      filterParam += this.MapLayerService.SingleFilterLoop(filterval);
                    }
                  }
                  if (!filterModel[k].values) {
                    if (filterModel[k].filter) {
                      filterval = filterModel[k].filter.toString().toLocaleLowerCase();
                      filterParam += this.serversidefilter(filterval, filterModel, k, '', false, TabList[t].IsFiltervalue);
                    }
                    else {
                      for (let c = 1; c <= 2; c++) {
                        if (c == 1) {
                          filterval = filterModel[k].condition1.filter.toString().toLocaleLowerCase();
                          filterParam += this.serversidefilter(filterval, filterModel[k].condition1, k, '', true, TabList[t].IsFiltervalue);
                        }
                        else {
                          filterval = filterModel[k].condition2.filter.toString().toLocaleLowerCase();
                          filterParam += this.serversidefilter(filterval, filterModel[k].condition2, k, '', true, TabList[t].IsFiltervalue);
                        }
                      }
                    }
                  }
                }
                let Gridfilter = this.MapServiceService.gridfilter(this.GoogleMapPage.GridfilterList);
                if (isfilter == true) {
                  setTimeout(() => {
                    this.AddAndRemoveFilterLayeronMapForKML(TabList[t]);
                  }, 500);
                }
                else {
                  this.AddAndRemoveFilterLayeronMapForKML(TabList[t]);
                }
              }
              this.hidethePaceProcessbar();
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
                  if (result.KMLGeometryList[0].hasOwnProperty('Name')) {
                    let ArrayData1: any = [];
                    let Ldata1 = result.KMLGeometryList.map(a => a.Name);
                    if (this.GoogleMapPage.mapfilterval != '') {
                      let Viewing = " - Viewing " + total + " of " + TabList[t]['totalCount'];
                      TabList[t].Title = TabList[t]['DisplayName'] + Viewing;
                    }
                    if (Object.keys(params.filterModel).length > 0) {
                      let data = Ldata1;
                      ArrayData1 = [];
                      for (let i = 0; i < data.length; i++) {
                        if (filterModel[keys[0]].values.indexOf(data[i]) > -1)
                          ArrayData1.push(data[i]);
                      }
                      total = ArrayData1.length;
                      if (this.GoogleMapPage.mapfilterval != '') {
                        let Viewing = " - Viewing " + total + " of " + TabList[t]['totalCount'];
                        TabList[t].Title = TabList[t]['DisplayName'] + Viewing;
                      }
                      data = ArrayData1;
                      ArrayData1 = [];
                      for (let i = 0; i < data.length; i++) {
                        if (i >= params.startRow && i < params.endRow)
                          ArrayData1.push({ Name: data[i] });
                      }
                    }
                    else {
                      for (let i = 0; i < Ldata1.length; i++) {
                        if (i >= params.startRow && i < params.endRow)
                          ArrayData1.push({ Name: Ldata1[i] });
                      }
                    }
                    let rowsThisPage = ArrayData1
                    let lastRow = -1;
                    if (total <= params.endRow) {
                      lastRow = total;
                    }
                    params.successCallback(rowsThisPage, lastRow);
                    this.setgridhight();
                  }

                }
                setInterval(() => {
                  this.unchckedAllfilterop();
                  this.MapServiceService.GridColumnCheckboxEventForKml();
                }, 3000);
              }, 2000);
            }
          };
          params.api.setDatasource(dataSource);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  ClearColumnEventListner(TabList, Index) {
    if (document.getElementById("clearButton") != null) {
      $('#clearButton').removeAttr('disabled');
      document.getElementById("clearButton").addEventListener("click", (event) => {
        this.Gridcolumns = [];
        setTimeout(() => {
          this.Gridcolumns = this.MapServiceService.GridColumns.getValue();
          this.GoogleMapPage.getTotalCount();
        }, 150);
        TabList[Index].EnergylayersavegridFilter.VisibaleSavefiltereneregyLayer = false;
        TabList[Index].EnergylayersavegridFilter.mapfilterval = "";
        TabList[Index].EnergylayersavegridFilter["mapfilterColumns"] = null;
        this.GoogleMapPage.GridfilterList = [];
        this.addandremovefilterLayeronMap(TabList[Index]);
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
        this.MapServiceService.ClearColumncheckvalue();
      });
    }
  }

  hidethePaceProcessbar() {
    $(".pace").css("display", "none");
  }

  setCqlFilter(filetrval, bbox) {
    let bboxval = '';
    let returnfilterval = '';
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
  }

  unchckedAllfilterop() {
    if ($('#selectAll')[0]) {
      if ($('#selectAll').html().indexOf('ag-icon-checkbox-checked') >= 0) {
        $('#selectAll').attr('checked', false).trigger('click');
      }
    }
  }

  addandremovefilterLayeronMap(TabList) {
    if (TabList.parentID && !TabList.parentName) {
      TabList.parentID = 0;
    }
    let oldFilter = [];
    if (TabList.energyLayer.length > 0 && TabList.energyLayer[0].serversidefilterval && TabList.energyLayer[0].serversidefilterval.length > 0) {
      oldFilter = TabList.energyLayer[0].serversidefilterval;
    }
    // let isAllowedGroupLayer = this.UtilityService.IsAllowedForGroupLayer(TabList.FeatureType);
    for (let s of TabList.energyLayer) {
      for (let c of TabList.ListOfChildID) {
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
      if (!(oldFilter.length === this.GoogleMapPage.GridfilterList.length && oldFilter.every((value, index) => value === this.GoogleMapPage.GridfilterList[index])))
        this.PrivateMapLayerService_new.LoadGroupMapLayers_Private();
    } else if (TabList.FeatureType == 'CustomMap') {
      this.MapLayernewService.LoadCustomMapLayers();
    } else if (TabList.FeatureType == 'SiteSelection') {
      this.MapLayernewService.LoadIndividualGroupMapLayer(TabList.FeatureType);
    } else {
      // if (isAllowedGroupLayer == true) {
      if (TabList.treestatus == 'GroupLayer') {
        if (!(oldFilter.length === this.GoogleMapPage.GridfilterList.length && oldFilter.every((value, index) => value === this.GoogleMapPage.GridfilterList[index])))
          this.MapLayernewService.LoadGroupMapLayers();
      }
    }
    // }

  }

  AddAndRemoveFilterLayeronMapForKML(TabList) {
    for (let s of TabList.energyLayer) {
      for (let c of TabList.ListOfChildID) {
        if (((s.EnergyParentID == parseInt(TabList.parentID)) && (s.EnergyLayerID == parseInt(c)))) {
          this.PrivateMapLayerService.RemoveKmlLayer(s);
          s["serversidefilterval"] = '';
        }
      }
    }
    for (let s of TabList.energyLayer) {
      for (let c of TabList.ListOfChildID) {
        if (((s.EnergyParentID == parseInt(TabList.parentID)) && (s.EnergyLayerID == parseInt(c)))) {
          s["serversidefilterval"] = this.GoogleMapPage.GridfilterList;

          // KML
          // this.LoadPrivateKmlLayers(s);
        }
      }
    }
  }

  serversidefilter(filterval, filterModel, k, sld_filter, multipleFilter, IsFiltervalue) {
    filterval = '';
    let type = ''
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
      filterval = k + '#LIKE#' + filterval
    }
    else if (type == "lessThan") {
      filterval = k + '<' + filterval
    }
    else if (type == "lessThanOrEqual") {
      filterval = k + '<=' + filterval
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
  }

  setgridhight() {
    $("#Resizingmap")[0].offsetTop;
    $("#Resizingmap")[0].offsetHeight;
    let h = $("#Resizingmap")[0].offsetHeight - $("#Resizingmap")[0].offsetTop;
    if (h == 0) {
      let gridHeight = $("#content1").height();
      $('#Resizingmap').css('height', gridHeight + 'px');
      $('#Resizingmap').css('top', '0');
      if (gridHeight <= 100)
        $('#Resizingmap').css('height', 20 + "px");
    }
    if (h != 0) {
      $("#divmapgrid").css('height', h - 60 + "px");
      $('#content1').css('height', h + "px");
    }
  }

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

export class StoredData {
  TabData: any;
  cql_filter: string;
  startRow: string;
  endRow: string;
  sortBy: string;
  totalFetures: any;
  data: any;
  tableName: string;
}