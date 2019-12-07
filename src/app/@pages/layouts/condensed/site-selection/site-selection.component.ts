import { Component, OnInit, Injector } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AuthenticationService } from '../../../../services/auth.service';
import { DashboardService } from '../../../../services/dashboard.service';
import { MapServiceService } from '../../../../services/map-service.service';
import { environment } from '../../../../../environments/environment';
import { UtilityService } from '../../../../services/Utility.service';
import { HttpRequestService } from '../../../../services/all-http-request.service';

import { CondensedComponent } from '../../../../../app/@pages/layouts/condensed/condensed.component';
import { tempLayerDataProp } from '../../../../models/layer-data-prop';
import { ParcelBufferToolService } from '../../../../services/ParcelBufferTool.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../../../../services/localdata.service';
declare var $: any;
declare var google: any;
@Component({
  selector: 'app-site-selection',
  templateUrl: './site-selection.component.html',
  styleUrls: ['./site-selection.component.scss']
})

export class SiteSelectionComponent implements OnInit {

  public selectedProperty;
  CondensedComponent: CondensedComponent
  constructor(
    private injector: Injector,
    public bsModalRef: BsModalRef,
    private authServices: AuthenticationService,
    public dashboardService: DashboardService,
    public MapServiceService: MapServiceService,
    private UtilityService: UtilityService,
    private httpService: HttpRequestService,
    private ParcelBufferToolService: ParcelBufferToolService,
    private formBuilder: FormBuilder,
    private httpRequestService: HttpRequestService,
    private LocalDataService: LocalDataService
  ) {
    setTimeout(() => this.CondensedComponent = injector.get(CondensedComponent));
  }

  LayerLoader: boolean = false;
  States = [];
  Counties = [];
  PropertyTypes = [];
  selectedState = [];
  selectedCounty = [];
  selectedProperties = [];
  ddSettingsSingle = {};
  ddSettingsMulty = {};
  StateModelList: any = [];
  isDisabledSiteCounty: boolean = true;
  isDisabledSiteProperty: boolean = true;
  isDisabled_btnCreateLayer: boolean = true;
  sizeOfPropertyFrom: string = '0';
  sizeOfPropertyTo: string = '5';
  ParcelData = {
    DataSetID: "200015",
    DataSetBoundryID: "200016",
  }
  energyData = {
    FloodHazardZonesTablePrefix: "s_fld_haz_ar_fema_",
    WetlandsTablePostfix: "_wetlands",
    TransmissionLineTable: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpowerlines : '',
    SubstationTable: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xsubstations : ''
  }
  isTransmissonLines: boolean = true;
  isSubstations: boolean = true;
  targetSelectAll = [];
  transmissionMiles: number = 3;
  substationMiles: number = 3;
  milesOptions: number[] = [0.5, 1, 2, 3];
  msgPointLayerCount = "";
  msgBoundriesLayerCount = "";
  public siteSelectionForm: FormGroup;
  public controls = { sizeOfPropertyFrom: 0, sizeOfPropertyTo: 5 };



  selectedOptTransmission = 3;
  selectedOptSubstation = { value: 3, label: '3' };

  optionsTrans = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },

  ];
  optionsSubstation = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
  ];
  chkTransmissionLines = [
    { name: '< 69 kv', value: '<69 kV', isChecked: true },
    { name: '69-138 kv', value: '69-138 kV', isChecked: true },
    { name: '139-230 kv', value: '139-230 kV', isChecked: true },
    { name: '231-345 kv', value: '231-345 kV', isChecked: true },
    { name: '346-500 kv', value: '346-500 kV', isChecked: true },
    { name: '501-765 kv', value: '501-765 kV', isChecked: true },
  ];

  ngOnInit() {
    setTimeout(() => {
      var modalDiv = document.getElementsByClassName('siteSelection')[0];
      var modalElement = $(modalDiv).parents('.modal');
      $(modalElement).attr('id', 'siteSelection');
      this.MapServiceService.SetModal('siteSelection');
      this.Draggable();
    }, 100);
    this.siteSelectionForm = this.formBuilder.group({
      ddlState: [''],
      ddlCounty: [''],
      ddlProperty: [''],
      txtSizeOfPropertyFrom: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9.]*$')])],
      txtSizeOfPropertyTo: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9.]*$')])],
    });
    this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
    this.ddSettingsSingle = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      maxHeight: 120,
    };

    this.ddSettingsMulty = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: true,
      maxHeight: 120,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
    };

    this.StateModelList = this.MapServiceService.parcelStateData.getValue();
    if (this.StateModelList != null && this.StateModelList.length > 0) {
      for (let i = 0; i < this.StateModelList.length; i++) {
        this.States.push({ 'item_id': this.StateModelList[i].ID, 'item_text': this.StateModelList[i].StateName });
      }
    }
    else {
      this.GetSiteStateData();
    }
    if (this.MapServiceService.siteSelectionData.isLayerLoaded && this.MapServiceService.siteSelectionData.loadedToolsData) {
      this.selectedState = this.MapServiceService.siteSelectionData.loadedToolsData.ddlState;
      if (this.selectedState.length > 0)
        this.onStateChange();
      this.selectedCounty = this.MapServiceService.siteSelectionData.loadedToolsData.ddlCounty;
      if (this.selectedCounty.length > 0)
        this.onCountryChange(true);
      this.sizeOfPropertyFrom = this.MapServiceService.siteSelectionData.loadedToolsData.sizeOfPropertyFrom;
      this.sizeOfPropertyTo = this.MapServiceService.siteSelectionData.loadedToolsData.sizeOfPropertyTo;
      this.isTransmissonLines = this.MapServiceService.siteSelectionData.loadedToolsData.isTransmissonLines;
      this.isSubstations = this.MapServiceService.siteSelectionData.loadedToolsData.isSubstations;
      this.chkTransmissionLines = this.MapServiceService.siteSelectionData.loadedToolsData.chkTransmissionLines;
      this.substationMiles = this.MapServiceService.siteSelectionData.loadedToolsData.substationMiles;
      this.transmissionMiles = this.MapServiceService.siteSelectionData.loadedToolsData.transmissionMiles;
      this.msgBoundriesLayerCount = this.MapServiceService.siteSelectionData.loadedToolsData.msgBoundriesLayerCount;
      this.msgPointLayerCount = this.MapServiceService.siteSelectionData.loadedToolsData.msgPointLayerCount
    }
  }
  get siteSelection() { return this.siteSelectionForm.controls; }

  GetSiteStateData() {
    this.LayerLoader = true;
    let UserId = this.authServices.getLoggedinUserId();
    this.httpService._NodeGetParcelStates(UserId).subscribe(data => {
      if (data._Issuccess && data.parcelStateData.length > 0) {
        var jsonData = data.parcelStateData;
        this.States = [];
        this.StateModelList = jsonData;
        for (let i = 0; i < jsonData.length; i++) {
          this.States.push({ 'item_id': jsonData[i].ID, 'item_text': jsonData[i].StateName });
        }
        this.MapServiceService.setParcelStates(this.StateModelList)
      }
      this.LayerLoader = false;
    },
      error => {
        console.log(error);
        this.LayerLoader = false;
      });
  }

  Draggable() {
    setTimeout(() => {
      $('.modal-dialog').draggable({
        handle: ".modal-header"
      });
    }, 10);
  }

  onStateChange() {
    this.Counties = [];
    this.selectedCounty = [];
    if (!this.isDisabledSiteCounty)
      this.isDisabledSiteCounty = true;
    this.PropertyTypes = [];
    this.selectedProperties = [];
    if (!this.isDisabledSiteProperty)
      this.isDisabledSiteProperty = true;
    this.isDisabled_btnCreateLayer = true;
    if (this.selectedState.length > 0) {
      let selectedItem = this.selectedState[0];
      let StateModel = this.StateModelList.filter(m => m.ID === selectedItem.item_id);
      if (StateModel) {
        let cts = StateModel[0].counties;
        this.Counties = [];
        this.selectedCounty = [];
        if (cts && cts.length > 0) {
          cts.sort();
          for (var county of cts) {
            if (county)
              this.Counties.push({ 'item_id': county.ID, 'item_text': county.County, 'FIPS': county.FIPS, 'statecode': county.State });
          }
          if (this.isDisabledSiteCounty)
            this.isDisabledSiteCounty = false;
        }
      }
    }
  }

  onCountryChange(isCallingFromInit) {
    this.PropertyTypes = [];
    this.selectedProperties = [];
    if (!this.isDisabledSiteProperty)
      this.isDisabledSiteProperty = true;
    this.isDisabled_btnCreateLayer = true;
    if (this.selectedCounty.length > 0) {
      let selectedCountyItem = this.selectedCounty[0];
      let filterCountyItem = this.Counties.filter(pe => pe.item_id === selectedCountyItem.item_id)[0];
      if ((!filterCountyItem.FIPS.startsWith("0")) && filterCountyItem.FIPS <= 9999) {
        filterCountyItem.FIPS = '0' + filterCountyItem.FIPS;
      }
      let tableName = 'ParcelPoints_' + filterCountyItem.FIPS;
      this.httpService._NodeGetSiteSelectionProperties(tableName).subscribe(data => {
        if (data._Issuccess && data.PropertyTypes.length > 0) {
          var propertyTypes = data.PropertyTypes;
          this.selectedProperties = [];
          this.PropertyTypes = [];
          for (let i = 0; i < propertyTypes.length; i++) {
            this.PropertyTypes.push({ 'item_id': i, 'item_text': propertyTypes[i].USECDSTDSC });
          }
          if (this.isDisabledSiteProperty)
            this.isDisabledSiteProperty = false;
          if (isCallingFromInit && this.MapServiceService.siteSelectionData.isLayerLoaded && this.MapServiceService.siteSelectionData.loadedToolsData && this.MapServiceService.siteSelectionData.loadedToolsData.ddlProperty) {
            this.selectedProperties = this.MapServiceService.siteSelectionData.loadedToolsData.ddlProperty;
            if (this.selectedProperties.length > 0)
              this.onPropertyChange();
          }
        }
      },
        error => {
          console.log(error);
        });
    }

  }

  onPropertyChange() {
    if (this.selectedProperties.length > 0) {
      if (this.isDisabled_btnCreateLayer)
        this.isDisabled_btnCreateLayer = false;
    }
    else {
      if (!this.isDisabled_btnCreateLayer)
        this.isDisabled_btnCreateLayer = true;
    }
  }

  onPropertyAllChange(item) {
    if (item.length > 0) {
      if (this.isDisabled_btnCreateLayer)
        this.isDisabled_btnCreateLayer = false;
    }
    else {
      if (!this.isDisabled_btnCreateLayer)
        this.isDisabled_btnCreateLayer = true;
    }
  }

  SetDefaultGoogleMapSettings() {
    let map: any = this.MapServiceService._mapdata.getValue();
    map.setCenter({ lat: 39.5, lng: -98.35 });
    map.setZoom(5);
  }

  CreateLayer() {
    this.isDisabled_btnCreateLayer = true;
    this.SetDefaultGoogleMapSettings();
    setTimeout(() => {
      this.MapServiceService.SiteselectionToolZoom = false;
      let Treedatalist = [];
      this.msgPointLayerCount = "";
      this.msgBoundriesLayerCount = "";
      let UserId = this.authServices.getLoggedinUserId();
      let selectedCounty = this.Counties.filter(pe => pe.item_id === this.selectedCounty[0].item_id)[0];
      let parcelCenterPointDisplayName = selectedCounty.statecode + " - " + selectedCounty.item_text + " Centerpoints";
      let parcelCenterPointTableName = "ParcelPoints_" + selectedCounty.FIPS;
      let parcelBoundariesDisplayName = selectedCounty.statecode + " - " + selectedCounty.item_text + " Boundaries";
      let parcelBoundariesTableName = "Parcels_" + selectedCounty.FIPS;
      let tempLayerCenterPointObjPropObj = this.CreateParcelTempLayerCenterPointObject(parcelCenterPointTableName, parcelCenterPointDisplayName);
      tempLayerCenterPointObjPropObj.FilterValue = this.GetCenterPointFilterValue(this.sizeOfPropertyFrom, this.sizeOfPropertyTo);
      let tempLayerBoundariesObjPropObj = this.CreateParcelTempLayerBoundriesObject(parcelBoundariesTableName, parcelBoundariesDisplayName);
      tempLayerBoundariesObjPropObj.FilterValue = this.GetBoundariesFilterValue(this.sizeOfPropertyFrom, this.sizeOfPropertyTo);
      let centerPointFilter = decodeURIComponent(this.MapServiceService.CreateCQL_Filter(tempLayerCenterPointObjPropObj.FilterValue, ' and'));
      let boundariesFilter = decodeURIComponent(this.MapServiceService.CreateCQL_Filter(tempLayerBoundariesObjPropObj.FilterValue, ' and'));
      let centerPointData = {
        energyLayer: tempLayerCenterPointObjPropObj,
        startIndex: 0,
        maxFeatures: 1,
        CQL_FILTER: centerPointFilter,
        sortBy: '',
        bbox: '',
        UserId: UserId
      }
      let boundriesData = {
        energyLayer: tempLayerBoundariesObjPropObj,
        startIndex: 0,
        maxFeatures: 1,
        CQL_FILTER: boundariesFilter,
        sortBy: '',
        bbox: '',
        UserId: UserId
      }
      let requestBodies = [
        centerPointData,
        boundriesData
      ];

      this.httpService._NodeGetParcelsCount(requestBodies).subscribe(data => {
        if (data.length == 2) {
          for (let result of data) {
            if (result.TabelName.startsWith("ParcelPoints")) {
              if (result.TotalFeature == 0)
                this.msgPointLayerCount = "0 results found for points.";
            }
            else {
              if (result.TotalFeature == 0)
                this.msgBoundriesLayerCount = "0 results found for boundaries.";
            }
          }
          let layerOrder = [parcelCenterPointTableName, parcelBoundariesTableName];
          if (this.msgPointLayerCount && !this.msgBoundriesLayerCount)
            layerOrder = [parcelBoundariesTableName, parcelCenterPointTableName];
          let TreeList = this.SetTree(this.ParcelData, tempLayerCenterPointObjPropObj, tempLayerBoundariesObjPropObj, layerOrder);
          if (TreeList && TreeList.length > 0) {
            TreeList.forEach(item => {
              Treedatalist.push(item);
            });
          }

          if (Treedatalist.length > 0) {
            this.CondensedComponent.SetTemporaryTreeNodeForWidget(Treedatalist);
            setTimeout(() => {
              this.isDisabled_btnCreateLayer = false;
            }, 1000);
          }
          this.RemoveEnergyLayers();
          if (!this.msgPointLayerCount && !this.msgBoundriesLayerCount) {
            setTimeout(() => {
              this.LoadEnergyLayers();
            }, 2000);
          }
          this.MapServiceService.siteSelectionData.isLayerLoaded = true;
          this.SaveToolsData();
        }
      }, error => {
        console.error(error);
      });

      // setTimeout(() => {
      //   this.LoadParcelsLayers();
      // }, 2000);
      //

      let ssFilterData = this.GetFilterDataForLog();
      this.httpRequestService._NodeInsertSiteSelectionLogs(ssFilterData, UserId).subscribe(data => { });
    }, 1000);
  }

  GetFilterDataForLog() {
    let stateName = this.selectedState[0].item_text;
    let countyName = this.selectedCounty[0].item_text;
    let size = this.sizeOfPropertyFrom + "-" + this.sizeOfPropertyTo;
    let propeties = this.selectedProperties;
    let selectedLines = this.chkTransmissionLines.filter(x => x.isChecked == true);

    let filterLogData = {
      StateName: stateName,
      CountyName: countyName,
      Size: size,
      Propeties: propeties,
      SelectedLines: selectedLines,
      Substation: this.isSubstations
    }
    return filterLogData;
  }

  SaveToolsData() {
    let toolData = {
      ddlState: this.selectedState,
      ddlCounty: this.selectedCounty,
      ddlProperty: this.selectedProperties,
      sizeOfPropertyFrom: this.sizeOfPropertyFrom,
      sizeOfPropertyTo: this.sizeOfPropertyTo,
      isTransmissonLines: this.isTransmissonLines,
      chkTransmissionLines: this.chkTransmissionLines,
      isSubstations: this.isSubstations,
      substationMiles: this.substationMiles,
      transmissionMiles: this.transmissionMiles,
      msgPointLayerCount: this.msgPointLayerCount,
      msgBoundriesLayerCount: this.msgBoundriesLayerCount
    }
    this.MapServiceService.siteSelectionData.loadedToolsData = toolData;
  }

  ClearToolsData() {
    this.RemoveEnergyLayers();
    if (this.MapServiceService.siteSelectionData.isLayerLoaded)
      this.ParcelBufferToolService.RemovelayerFromTree(this.ParcelData.DataSetID, this.ParcelData.DataSetBoundryID);
    this.selectedState = [];
    this.selectedCounty = [];
    this.selectedProperties = [];
    this.Counties = [];
    this.PropertyTypes = [];
    this.isDisabledSiteCounty = true;
    this.isDisabledSiteProperty = true;
    this.sizeOfPropertyFrom = '0';
    this.sizeOfPropertyTo = '5';
    this.isTransmissonLines = true;
    this.isSubstations = true;
    this.chkTransmissionLines = [
      { name: '< 69 kv', value: '<69 kV', isChecked: true },
      { name: '69-138 kv', value: '69-138 kV', isChecked: true },
      { name: '139-230 kv', value: '139-230 kV', isChecked: true },
      { name: '231-345 kv', value: '231-345 kV', isChecked: true },
      { name: '346-500 kv', value: '346-500 kV', isChecked: true },
      { name: '501-765 kv', value: '501-765 kV', isChecked: true },
    ];
    this.transmissionMiles = 3;
    this.substationMiles = 3;
    this.msgBoundriesLayerCount = "";
    this.msgPointLayerCount = "";
    this.isDisabled_btnCreateLayer = true;

    let toolData = {
      ddlState: [],
      ddlCounty: [],
      ddlProperty: [],
      sizeOfPropertyFrom: '0',
      sizeOfPropertyTo: '5',
      isTransmissonLines: true,
      chkTransmissionLines: [
        { name: '< 69 kv', value: '<69 kV', isChecked: true },
        { name: '69-138 kv', value: '69-138 kV', isChecked: true },
        { name: '139-230 kv', value: '139-230 kV', isChecked: true },
        { name: '231-345 kv', value: '231-345 kV', isChecked: true },
        { name: '346-500 kv', value: '346-500 kV', isChecked: true },
        { name: '501-765 kv', value: '501-765 kV', isChecked: true },
      ],
      isSubstations: true,
      substationMiles: 3,
      transmissionMiles: 3,
      msgPointLayerCount: "",
      msgBoundriesLayerCount: ""
    }
    this.MapServiceService.siteSelectionData.loadedToolsData = toolData;
  }

  ZoomMap() {
    let county = this.UtilityService.toTitleCase(this.selectedCounty[0].item_text);
    let stateCode = this.Counties.filter(pe => pe.item_id === this.selectedCounty[0].item_id)[0].statecode;
    var geocoder = new google.maps.Geocoder();
    var map = this.MapServiceService._mapdata.getValue();
    geocoder.geocode({ 'address': county + ", " + stateCode + ", USA" }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        map.fitBounds(results[0].geometry.viewport);
        map.setZoom(10);
      }
    });
  }

  LoadParcelsLayers() {
    let Treedatalist = []
    let selectedCounty = this.Counties.filter(pe => pe.item_id === this.selectedCounty[0].item_id)[0];
    let parcelCenterPointTableName = "ParcelPoints_" + selectedCounty.FIPS;
    let parcelCenterPointDisplayName = selectedCounty.statecode + " - " + selectedCounty.item_text + " Centerpoints";
    let tempLayerCenterPointObjPropObj = this.CreateParcelTempLayerCenterPointObject(parcelCenterPointTableName, parcelCenterPointDisplayName);
    tempLayerCenterPointObjPropObj.FilterValue = this.GetCenterPointFilterValue(this.sizeOfPropertyFrom, this.sizeOfPropertyTo);
    let parcelBoundariesTableName = "Parcels_" + selectedCounty.FIPS;
    let parcelBoundariesDisplayName = selectedCounty.statecode + " - " + selectedCounty.item_text + " Boundaries";
    let tempLayerBoundariesObjPropObj = this.CreateParcelTempLayerBoundriesObject(parcelBoundariesTableName, parcelBoundariesDisplayName);
    tempLayerBoundariesObjPropObj.FilterValue = this.GetBoundariesFilterValue(this.sizeOfPropertyFrom, this.sizeOfPropertyTo);
    let TreeList = this.SetTree(this.ParcelData, tempLayerCenterPointObjPropObj, tempLayerBoundariesObjPropObj, []);
    if (TreeList && TreeList.length > 0) {
      TreeList.forEach(item => {
        Treedatalist.push(item);
      });
    }
    if (Treedatalist.length > 0) {
      this.CondensedComponent.SetTemporaryTreeNodeForWidget(Treedatalist);
    }
  }

  RemoveEnergyLayers() {
    if (this.MapServiceService.siteSelectionData.isLayerLoaded && this.MapServiceService.siteSelectionData.loadedEnergyLayerIds) {
      for (let i = 0; i < this.MapServiceService.siteSelectionData.loadedEnergyLayerIds.length; i++) {
        let layerId = this.MapServiceService.siteSelectionData.loadedEnergyLayerIds[i];
        let treeUI = this.MapServiceService._TreeUI.getValue();
        let EnergyLayerID = layerId + 'RemoveTreeData';
        let Removeexistnode = treeUI.treeModel.getNodeById(layerId);
        if (Removeexistnode.data["children"]) {
          if (Removeexistnode.data["children"].length > 1) {
            for (let removelayer of Removeexistnode.data["children"]) {
              setTimeout(() => {
                EnergyLayerID = removelayer.Id + 'RemoveTreeData';
                let element: HTMLElement = document.getElementById(EnergyLayerID) as HTMLElement;
                element.click();
                if (i == this.MapServiceService.siteSelectionData.loadedEnergyLayerIds.length - 1)
                  this.MapServiceService.siteSelectionData.loadedEnergyLayerIds = null;
              }, 200);
            }
          } else {
            setTimeout(() => {
              let element: HTMLElement = document.getElementById(EnergyLayerID) as HTMLElement;
              element.click();
              if (i == this.MapServiceService.siteSelectionData.loadedEnergyLayerIds.length - 1)
                this.MapServiceService.siteSelectionData.loadedEnergyLayerIds = null;
            }, 200);
          }
        } else {
          setTimeout(() => {
            let element: HTMLElement = document.getElementById(EnergyLayerID) as HTMLElement;
            element.click();
            if (i == this.MapServiceService.siteSelectionData.loadedEnergyLayerIds.length - 1)
              this.MapServiceService.siteSelectionData.loadedEnergyLayerIds = null;
          }, 200);
        }
      }
    }
  }

  LoadEnergyLayers() {
    let stateName = this.selectedState[0].item_text.toLowerCase();
    let stateCode = this.Counties.filter(pe => pe.item_id === this.selectedCounty[0].item_id)[0].statecode.toLowerCase();
    let floodHazardZonesLayerTableName = this.energyData.FloodHazardZonesTablePrefix + stateName;
    let wetlandsLayerTableName = stateCode + this.energyData.WetlandsTablePostfix;
    let tableNames = [];
    if (this.isSubstations) tableNames.push(this.energyData.SubstationTable);
    if (this.isTransmissonLines) tableNames.push(this.energyData.TransmissionLineTable);
    tableNames.push(wetlandsLayerTableName);
    tableNames.push(floodHazardZonesLayerTableName);
    this.httpRequestService._NodeGetEnergyLayersIDS(tableNames).subscribe(data => {
      let energyLayerIds = [];
      // if (this.isTransmissonLines) energyLayerIds.push(data.EnergyLayersIDS.filter(m => m.TableName === this.energyData.TransmissionLineTable)[0].EnergyLayerID);
      // if (this.isSubstations) {energyLayerIds.push(data.EnergyLayersIDS.filter(m => m.TableName === this.energyData.SubstationTable)[0].EnergyLayerID);

      if (this.isTransmissonLines) {
        if (data.EnergyLayersIDS.filter(m => m.TableName === this.energyData.TransmissionLineTable).length > 0) {
          energyLayerIds.push(data.EnergyLayersIDS.filter(m => m.TableName === this.energyData.TransmissionLineTable)[0].EnergyLayerID);
        }
      }

      if (this.isSubstations) {
        if(data.EnergyLayersIDS.filter(m => m.TableName === this.energyData.SubstationTable).length>0){
          energyLayerIds.push(data.EnergyLayersIDS.filter(m => m.TableName === this.energyData.SubstationTable)[0].EnergyLayerID);
        }
      }

      let wetlandsLayers = data.EnergyLayersIDS.filter(m => m.TableName.indexOf(wetlandsLayerTableName) > -1);
      for (var layer of wetlandsLayers) {
        energyLayerIds.push(layer.EnergyLayerID);
      }
      if (data.EnergyLayersIDS.filter(m => m.TableName === floodHazardZonesLayerTableName).length > 0) {
        energyLayerIds.push(data.EnergyLayersIDS.filter(m => m.TableName === floodHazardZonesLayerTableName)[0].EnergyLayerID);
      }
      for (var layerId of energyLayerIds) {
        this.CondensedComponent.GetTreeData(layerId, [], [], 0, true);
      }
      this.MapServiceService.siteSelectionData.loadedEnergyLayerIds = energyLayerIds;
    }, error => {
      console.log(error);
    });
  }

  CreateParcelTempLayerCenterPointObject(tableName: string, displayName: string) {
    let tempLayerObjPropObj = this.ParcelBufferToolService.GetCommonParcelTempObj();
    tempLayerObjPropObj.DataSetID = this.ParcelData.DataSetID;
    tempLayerObjPropObj.EnergyLayerID = this.ParcelData.DataSetID;
    tempLayerObjPropObj.DataSetName = displayName ? displayName : this.ParcelBufferToolService.ParcelCenterPointData.LayerName;
    tempLayerObjPropObj.Description = "Site Selection - " + displayName ? displayName : this.ParcelBufferToolService.ParcelCenterPointData.LayerName;
    tempLayerObjPropObj.IconType = "Circle";
    tempLayerObjPropObj.StrokeThicknessPercent = 5;
    tempLayerObjPropObj.StrokeColor = "FFFF0000";
    tempLayerObjPropObj.FillColor = tempLayerObjPropObj.StrokeColor;
    tempLayerObjPropObj.SizePercent = 55;
    tempLayerObjPropObj.Opacity = 1;
    tempLayerObjPropObj.RepresentationType = "Point";
    tempLayerObjPropObj.TableName = tableName;
    tempLayerObjPropObj.LayerTypeID = "9";
    tempLayerObjPropObj.DetailPanelPropertiesMain = this.ParcelBufferToolService.ParcelCenterPointData.DBFProperties;
    tempLayerObjPropObj.DBFProperties = this.ParcelBufferToolService.ParcelCenterPointData.DBFProperties;
    tempLayerObjPropObj.DetailPanelProperties = this.ParcelBufferToolService.ParcelCenterPointData.DetailPanelProperties;
    tempLayerObjPropObj["DisplayName"] = displayName ? displayName : this.ParcelBufferToolService.ParcelCenterPointData.EnergyLayerDisplayName;
    return tempLayerObjPropObj;
  }

  CreateParcelTempLayerBoundriesObject(tableName: string, displayName: string) {
    let tempLayerObjPropObj = this.ParcelBufferToolService.GetCommonParcelTempObj();
    tempLayerObjPropObj.DataSetID = this.ParcelData.DataSetBoundryID;
    tempLayerObjPropObj.EnergyLayerID = this.ParcelData.DataSetBoundryID;
    tempLayerObjPropObj.DataSetName = displayName ? displayName : this.ParcelBufferToolService.ParcelCenterPointData.LayerName;
    tempLayerObjPropObj.Description = "Site Selection - " + displayName ? displayName : this.ParcelBufferToolService.ParcelCenterPointData.LayerName;

    tempLayerObjPropObj.IconType = "RoundedRectangle";
    tempLayerObjPropObj.StrokeThicknessPercent = 10;
    tempLayerObjPropObj.StrokeColor = "FF120103";
    tempLayerObjPropObj.FillColor = "00F8F0F0";
    tempLayerObjPropObj.FillOpacity = 0;
    tempLayerObjPropObj.SizePercent = 100;
    tempLayerObjPropObj.Opacity = 1;
    tempLayerObjPropObj.DetailPanelPropertiesMain = this.ParcelBufferToolService.ParcelCenterPointData.DBFPropertiesBoundries;
    tempLayerObjPropObj.DBFProperties = this.ParcelBufferToolService.ParcelCenterPointData.DBFPropertiesBoundries;
    tempLayerObjPropObj.DetailPanelProperties = this.ParcelBufferToolService.ParcelCenterPointData.BoundriesParecelDetailPanelProperties;

    tempLayerObjPropObj.RepresentationType = "Area";
    tempLayerObjPropObj.TableName = tableName;
    tempLayerObjPropObj.LayerTypeID = "9";

    tempLayerObjPropObj["DisplayName"] = displayName ? displayName : this.ParcelBufferToolService.ParcelCenterPointData.EnergyLayerDisplayName;
    return tempLayerObjPropObj;
  }

  SetTree(temp, tempLayerObjPropObj, tempLayerBoundryObjPropObj, layerOrder) {
    this.ParcelBufferToolService.RemovelayerFromTree(temp.DataSetID, temp.DataSetBoundryID);
    this.ParcelBufferToolService.AddLayeronTempVariable(tempLayerObjPropObj, tempLayerBoundryObjPropObj);
    let Treedatalist = [];
    for (let tableName of layerOrder) {
      if (tableName.startsWith("ParcelPoints"))
        Treedatalist.push(this.ParcelBufferToolService.getsingaleTree(tempLayerObjPropObj));
      else
        Treedatalist.push(this.ParcelBufferToolService.getsingaleTree(tempLayerBoundryObjPropObj));
    }
    return Treedatalist;
  }

  ClearFilters() {
    this.selectedState = [];
    this.selectedCounty = [];
    this.Counties = [];
    this.PropertyTypes = [];
    this.isDisabledSiteCounty = true;
    this.isDisabledSiteProperty = true;
  }

  GetPropertyTypeFilterValue(filterTotalLength) {
    let filter = "";
    if (this.selectedProperties.length > 0) {
      if (this.selectedProperties.length != this.PropertyTypes.length) {
        for (var propertyType of this.selectedProperties) {
          if (propertyType.item_text) {
            let newFilter = "USECDSTDSC=" + propertyType.item_text + "#OR#";
            if (propertyType.item_text.indexOf("'") != -1)
              newFilter = "USECDSTDSC=" + propertyType.item_text.replace(/[']/g, "\"") + "#OR#";
            filterTotalLength += newFilter.length;
            // if (filterTotalLength <= 4500)
            filter += newFilter;
            // else
            //   break;
          }
        }
        filter = filter.substring(0, filter.length - 4);
        if (filter.indexOf(";") != -1)
          filter = filter.replace(/[;]/g, "#semicolon#");
      }
    }
    return filter;
  }

  GetLOTSZARUNTFilterValue() {
    let filter = "";
    let LOTSZARUNTFilterValue = "AC"
    filter = "LOTSZARUNT=" + LOTSZARUNTFilterValue;
    return filter;
  }

  GetLOTSZARNUMFilterValue(fromValue, toValue) {
    let filter = "";
    filter += "LOTSZARNUM >= " + fromValue + "; LOTSZARNUM<=" + toValue;
    return filter;
  }

  GetTransmissionLineAndSubstationFilterValue() {
    let filter = "";
    let stateName = '';
    if (this.selectedState.length == 1)
      stateName = this.UtilityService.toTitleCase(this.selectedState[0].item_text);
    let county = '';
    if (this.selectedCounty.length == 1)
      county = this.UtilityService.toTitleCase(this.selectedCounty[0].item_text);
    let transmissionRadius = this.transmissionMiles * 1609.34;
    let substationRadius = this.substationMiles * 1609.34;
    if (this.isTransmissonLines) {
      let selectedLine = [];
      this.chkTransmissionLines.map((e) => {
        if (e.isChecked)
          selectedLine.push(e);
      });
      if (selectedLine.length > 0) {
        if (selectedLine.length == 6) {
          filter += "DWITHIN(the_geom, collectGeometries(queryCollection('BaseMaps:" + this.energyData.TransmissionLineTable + "','the_geom','VOLT_CAT = ''DC'' OR STATE_NAME = ''" + stateName + "'' AND COUNTY = ''" + county + "''')), " + transmissionRadius + ", meters)";
        }
        else {
          for (var line of selectedLine) {
            filter += "DWITHIN(the_geom, collectGeometries(queryCollection('BaseMaps:" + this.energyData.TransmissionLineTable + "','the_geom','VOLT_CAT = ''DC'' OR VOLT_CAT = ''" + line.value + "'' AND STATE_NAME = ''" + stateName + "'' AND COUNTY = ''" + county + "''')), " + transmissionRadius + ", meters) or ";
          }
          filter = filter.substring(0, filter.length - 4);
        }
      }
    }
    if (this.isSubstations) {
      if (filter.length > 0)
        filter += " or ";
      filter += "DWITHIN(the_geom, collectGeometries(queryCollection('BaseMaps:" + this.energyData.SubstationTable + "','the_geom','STATE_NAME = ''" + stateName + "'' AND COUNTY = ''" + county + "''')), " + substationRadius + ", meters)";
    }
    return filter;
  }

  GetCenterPointFilterValue(fromValue, toValue) {
    let filter = "";
    filter += this.GetTransmissionLineAndSubstationFilterValue();

    if (filter.length > 0)
      filter += ";";
    filter += this.GetLOTSZARUNTFilterValue();

    if (filter.length > 0)
      filter += ";";
    filter += this.GetLOTSZARNUMFilterValue(fromValue, toValue);

    if (filter.length > 0)
      filter += ";";
    filter += this.GetPropertyTypeFilterValue(filter.length);

    return filter;
  }

  GetBoundariesFilterValue(fromValue, toValue) {
    let filter = "";
    filter += this.GetTransmissionLineAndSubstationFilterValue();

    // if (filter.length > 0)
    //   filter += ";";
    // filter += this.GetLOTSZARUNTFilterValue();

    if (filter.length > 0)
      filter += ";";
    filter += this.GetLOTSZARNUMFilterValue(fromValue, toValue);

    if (filter.length > 0)
      filter += ";";
    filter += this.GetPropertyTypeFilterValue(filter.length);

    return filter;
  }

  DisableSearch() {
    if (!this.siteSelectionForm.valid && this.isDisabled_btnCreateLayer)
      return true;
    else if (this.siteSelectionForm.valid && !this.isDisabled_btnCreateLayer)
      return false;
    else if (!this.siteSelectionForm.valid && !this.isDisabled_btnCreateLayer)
      return true;
    else if (this.siteSelectionForm.valid && this.isDisabled_btnCreateLayer)
      return true;
  }

  chkChildOptChange(line) {
    line.isChecked = !line.isChecked;
    let allCheckedValues = this.chkTransmissionLines.map(x => x.isChecked).filter((v, i, a) => a.indexOf(v) === i);
    if (allCheckedValues.length == 1) {
      if (allCheckedValues[0] && !this.isTransmissonLines)
        this.isTransmissonLines = true;
      else if (!allCheckedValues[0] && this.isTransmissonLines)
        this.isTransmissonLines = false;
    }
    else {
      let allChkValues = this.chkTransmissionLines.map(x => x.isChecked);
      let trueCount = 0;
      let falseCount = 0;
      for (var value of allChkValues) {
        if (value)
          trueCount += 1;
        else
          falseCount += 1;
      }
      if (trueCount == 1 && !this.isTransmissonLines)
        this.isTransmissonLines = true;
    }
  }

  chkTransmissionChange() {
    this.isTransmissonLines = !this.isTransmissonLines;
    if (this.isTransmissonLines) {
      for (var value of this.chkTransmissionLines) {
        if (!value.isChecked)
          value.isChecked = true;
      }
    }
    else {
      for (var value of this.chkTransmissionLines) {
        if (value.isChecked)
          value.isChecked = false;
      }
    }
  }

  isMinimizedTool: boolean = false;
  ToggleMinimize() {
    this.isMinimizedTool = !this.isMinimizedTool;
    let elem = document.getElementsByClassName('siteSelection');
    if (elem && elem.length > 0) {
      if (this.isMinimizedTool == true) {
        elem[0].classList.add('minimizedTool');
      } else {
        elem[0].classList.remove('minimizedTool');
      }
    }
  }
}
