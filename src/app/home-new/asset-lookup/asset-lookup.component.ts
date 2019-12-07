import { Component, OnInit, Injector } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthenticationService } from '../../services/auth.service';
import { HttpRequestService } from '../../services/all-http-request.service';
import { tempLayerDataProp } from '../../models/layer-data-prop';
import { MapServiceService } from '../../services/map-service.service';
import { UtilityService } from '../../services/Utility.service';
import { CondensedComponent } from '../../@pages/layouts';
import { environment } from '../../../environments/environment.prod';
declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { LocalDataService } from '../../services/localdata.service';
@Component({
  selector: 'app-asset-lookup',
  templateUrl: './asset-lookup.component.html',
  styleUrls: ['./asset-lookup.component.scss']
})
export class AssetLookupComponent implements OnInit {
  ImageURLPath: string = environment.ImagespreviewPath;
  CondensedComponent: CondensedComponent
  LayerLoader: boolean = false;
  AllFacilitiesData: any;
  AllPipleLineData: any;
  Facilities = [];
  States = [];
  Commodities = [];
  Commodities2 = [];
  FuelType = [];
  Status = [];
  States2 = [];
  PowerPlant_States = [];
  substation_States = [];
  TransmissionLine_States = [];
  Status2 = [];
  TransmissionLine_Status2 = [];
  PrimeMover = [];
  Voltage = [];
  Type = [];

  selectedFacilities = [];
  selectedCommoditiesFL = [];
  selectedStatesFL = [];
  selectedCommoditiesPL = [];
  selectedStatusPL = [];
  selectedStatesPL = [];
  selectedFuelTypes = [];
  selectedPrimeMover = [];
  selectedStatesPP = [];
  selectedStatusSS = [];
  selectedTypes = [];
  selectedStatesSS = [];
  selectedStatusTL = [];
  selectedVoltage = [];
  selectedStatesTL = [];
  Treedatalist = [];

  TabEnum = Object.freeze({ "Facilities": "Facilities", "Pipelines": "Pipelines", "PowerPlants": "Power Plants", "Substations": "Substations", "TransmissionLines": "Transmission Lines" });
  activeTab = this.TabEnum.Facilities;
  searchFacilities = "";

  searchPowerPlants: string = '';
  searchTransmissionLines: string = '';
  searchSubstations: string = '';

  dropdownSettings = {};
  dropdownSettingsFacility = {};
  dropdownSettingsStates = {};
  assetData: any;

  searchPipelines: string = "";
  isTransmissionPipeline: boolean = false;
  isGatheringPipeline: boolean = false;
  isDistributionPipeline: boolean = false;
  isMapsearchConnectionPipeline: boolean = false;
  _permissionsSubscription: Subscription;
  dataResults: any = [
    {
      DataName: 'Pipelines',
      Displayname: [{
        LinetypeFieldName: "LINETYPE",
        CommodityFieldName: "COMMODITY",
        StateFieldName: "STATE_NAME",
        StatusFieldName: "STATUS",
        OwnerFieldName: "OWNER",
        OperatorFieldName: "OPERATOR",
        SystemFieldName: "SYSTEM",
        TableName: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpipelines : '',
        TransmissionValue: "Transmission/trunk line",
        GatheringValue: "Gathering system field line",
        LocalDistributionValue: "Local distribution",
        MapsearchConnectionValue: "MAPSearch connection line",
        //DBFProperties: this.AuthServices.GetSystemParameterValue("PipelinesSearchDBFProperties"),        
        DBFProperties: "MSID,OWNER,NUMOWNERS,LEASED,OPERATOR,COMMODITY,COMMODITY2,PRIMBATCH1,SECBATCH1,PRIMBATCH2,SECBATCH2,LINETYPE,SYSTEM,DIAMETER,MDIAMETER,STATUS,CORRIDOR,SEGMENTNUM,TX_T4,TX_P5,UPDATED,UPDATED_SP,METACODE,LASTOWNER,LASTOPER,MILEAGE,COUNTRY,STATE_NAME,COUNTY,RELEASE_DT,INSERVICE,systype",        
        //DetailPanelProperties: this.AuthServices.GetSystemParameterValue("PipelinesSearchDetailPanelProperties"),
        DetailPanelProperties:"Owner=OWNER,Operator=OPERATOR,Commodity=COMMODITY,Commodity2=COMMODITY2,Line Type=LINETYPE,System=SYSTEM,Diameter=DIAMETER,Status=STATUS,Mileage=MILEAGE,Country=COUNTRY,State=STATE_NAME,County=COUNTY",
        //DataSetID: parseInt("20000" + 0),
        DataSetID: 765,
        isEnergyLayer: true,
        EnergyLayerDisplayName: "Pipelines search results",
        EnergyLayerID: 765
        
      }]

    },
    {
      DataName: 'Facilities',
      Displayname: [{
        OwnerFieldName: "OWNER",
        OperatorFieldName: "OPERATOR",
        FacilityNameFieldName: "FACNAME",
        FacilityTypeFieldName: "FACTYPE",
        CommodityFieldName: "COMMODITY",
        StateFieldName: "STATE_NAME",
        TableName: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xfacilities : '',
        //DBFProperties: this.AuthServices.GetSystemParameterValue(""),
        DBFProperties: "FACNAME,FACTYPE,OWNER,OPERATOR,STATUS,CAPACITY,STATE_NAME,COUNTRY,COUNTY,COMMODITY,MSID,UPDATED,UPDATED_SP,LASTOWNER,LASTOPER,elevationfeet",
        DetailPanelProperties: "Facility Name=FACNAME,Facility Type=FACTYPE,Status=STATUS,Capacity=CAPACITY,Owner=OWNER,Operator=OPERATOR,Country=COUNTRY,State=STATE_NAME,County=COUNTY,Commodity=COMMODITY",
        //DetailPanelProperties: this.AuthServices.GetSystemParameterValue("FacilitiesSearchDetailPanelProperties"),
        //DataSetID: parseInt("20000" + 1),
        DataSetID: 764,
        isEnergyLayer: true,
        EnergyLayerDisplayName: "Facilities search results",
        EnergyLayerID: 764
      }]

    },
    {
      DataName: 'Power Plants',
      Displayname: [{
        OwnerFieldName: "OWNER",
        OperatorFieldName: "OPERATOR",
        FacilityNameFieldName: "FACNAME",
        FuelTypeField: "PRIMEFUEL",
        PrimeMoverField: "PRIMEMOVER",
        StateFieldName: "STATE_NAME",
        TableName: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpowerplants : '',
        // DBFProperties: this.AuthServices.GetSystemParameterValue(""),
        DBFProperties: "FACNAME,OWNER,OPERATOR,NAME_CAP,STATUS,PRIMEMOVER,PRIMEFUEL,STATE_NAME,COUNTRY,COUNTY,LEASED,YRINSTALL,NUMUNITS,PROP_CAP,EIA_CD,UPDATED,UPDT_SP,LASTOWNER,LASTOPER,elevationfeet",
        //DetailPanelProperties: this.AuthServices.GetSystemParameterValue("PowerPlantsSearchDetailPanelProperties"),
        DetailPanelProperties: "Facility Name=FACNAME,Owner=OWNER,Operator=OPERATOR,Capacity=NAME_CAP,Status=STATUS,Prime Mover=PRIMEMOVER,Prime Fuel=PRIMEFUEL,State=STATE_NAME,Country=COUNTRY,County=COUNTY",
        
        //DataSetID: parseInt("20000" + 2),
        DataSetID: 766,
        isEnergyLayer: true,
        EnergyLayerDisplayName: "Power Plants search results",
        EnergyLayerID: 766
      }]

    },
    {
      DataName: 'Substations',
      Displayname: [{
        StatusFieldName: 'STATUS',
        SubTypeFieldName: 'SUBTYPE',
        StateNameFieldName: 'STATE_NAME',
        OwnerFieldName: "OWNER",
        OperatorFieldName: "OPERATOR",
        SubnameFieldName: "SUBNAME",
        TableName: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xsubstations : '',
        // DBFProperties: this.AuthServices.GetSystemParameterValue(""),
        DBFProperties: "SUBNAME,SUBTYPE,STATUS,OWNER,OPERATOR,STATE_NAME,COUNTY,COUNTRY,PRIMVOLT,SECVOLT,TERTVOLT,MSID,UPDATED,UPDT_SP,LASTOWNER,LASTOPER",
        //DetailPanelProperties: this.AuthServices.GetSystemParameterValue("SubstationsSearchDetailPanelProperties"),
        DetailPanelProperties: "Name=SUBNAME,Type=SUBTYPE,Status=STATUS,Owner=OWNER,Operator=OPERATOR,Primary Voltage=PRIMVOLT,Secondary Voltage=SECVOLT,Tertiary Voltage=TERTVOLT,State=STATE_NAME,County=COUNTY,Country=COUNTRY",
        //DataSetID: parseInt("20000" + 3),
        DataSetID: 956,
        isEnergyLayer: true,
        EnergyLayerDisplayName: "Substations search results",
        EnergyLayerID: 956
      }]

    },
    {
      DataName: 'Transmission Lines',
      Displayname: [{
        StatusFieldName: 'STATUS',
        VoltageFieldName: 'VOLT_CAT',
        StateNameFieldName: 'STATE_NAME',
        OwnerFieldName: "OWNER",
        OperatorFieldName: "OPERATOR",
        TableName: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpowerlines : '',
        //DBFProperties: this.AuthServices.GetSystemParameterValue(""),
        DBFProperties: "OWNER,OPERATOR,VOLTAGE,TYPE,STATUS,CORRIDOR,VOLT_CAT,COUNTRY,STATE_NAME,COUNTY,MILEAGE,MSID,RANGE,NUMOWNERS,UPDATED,UPDT_SP,METACODE,LASTOWNER,LASTOPER,RELEASE_DT",
        //DetailPanelProperties: this.AuthServices.GetSystemParameterValue("TransmissionLinesSearchDetailPanelProperties"),
        DetailPanelProperties: "Owner=OWNER,Operator=OPERATOR,Voltage=VOLTAGE,Type=TYPE,Status=STATUS,Corridor=CORRIDOR,Voltage Category=VOLT_CAT,Country=COUNTRY,State=STATE_NAME,County=COUNTY,Mileage=MILEAGE,MSID=MSID,Range=RANGE,Last Owner=LASTOWNER,Last Operator=LASTOPER",
        // DataSetID: parseInt("20000" + 4),
        DataSetID: 922,
        isEnergyLayer: true,
        EnergyLayerDisplayName: "Transmission Lines search results",
        EnergyLayerID: 922

      }],

    },
  ]

  constructor(public dashboardService: DashboardService,
    public AuthServices: AuthenticationService,
    private httpRequestService: HttpRequestService,
    private MapServiceService: MapServiceService,
    private utilityService: UtilityService,
    private LocalDataService: LocalDataService,
    private injector: Injector) {
    setTimeout(() => this.CondensedComponent = injector.get(CondensedComponent));
  }

  ngOnInit() {
    //this.FillStaticData();
    if (this.States.length == 0) {
      if (!this.AuthServices.ShowOilAndGasUIBasedOnRole() && !this.AuthServices.ShowElectricPowerUIBasedOnRole()) {
      }
      else {
        this.GetAssetData();
        this.GetPipelineandAllTabData()
      }

    }

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: false,
      maxHeight: 120,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
    };

    this._permissionsSubscription = this.MapServiceService.sitePermissions.subscribe(data => {
      if (data)
        this.ShowWidgetBasedOnRole();
    })
  }

  ngOnDestroy() {
    if (this._permissionsSubscription)
      this._permissionsSubscription.unsubscribe();
  }
  // Start Facilities
  GetAssetData() {
    this.LayerLoader = true;
    this.httpRequestService._NodeGetAssetLookupData().subscribe(data => {


      if (data._Issuccess) {
        var jsonData = data;
        this.AllFacilitiesData = jsonData;
        this.Facilities = [];
        if (jsonData.FacilityData && jsonData.FacilityData.length > 0) {
          for (let f = 0; f < jsonData.FacilityData.length; f++) {
            this.Facilities.push({ 'item_id': (f + 1), 'item_text': jsonData.FacilityData[f].FACTYPE.trim() });
          }
        }
        this.FillFacilityComodityandstate(jsonData.AllComodity, jsonData.AllState);
      }
      this.LayerLoader = false;
    },
      error => {
        console.log(error);
        this.LayerLoader = false;
      });
  }
  FillFacilityComodityandstate(ComodityList, StateList, FACTypeListData = []) {
    if (ComodityList && ComodityList.length > 0) {
      this.Commodities = [];
      this.selectedCommoditiesFL = [];
      ComodityList = _.sortBy(ComodityList)
      for (let c = 0; c < ComodityList.length; c++) {
        this.Commodities.push({ 'item_id': (c + 1), 'item_text': ComodityList[c].trim() });
      }
    }
    if (StateList && StateList.length > 0) {
      this.States = [];
      this.selectedStatesFL = [];
      StateList = _.sortBy(StateList);
      for (let s = 0; s < StateList.length; s++) {
        if (StateList[s].trim()) {
          this.States.push({ 'item_id': (s + 1), 'item_text': StateList[s].trim() });
        }
      }
    }
    if (FACTypeListData && FACTypeListData.length > 0) {
      this.Facilities = [];
      FACTypeListData = _.sortBy(FACTypeListData);
      for (let f = 0; f < FACTypeListData.length; f++) {
        this.Facilities.push({ 'item_id': (f + 1), 'item_text': FACTypeListData[f].trim() });
      }
    }

  }
  ClearFilters() {
    this.selectedFacilities = [];
    this.selectedCommoditiesFL = [];
    this.selectedStatesFL = [];
    this.selectedCommoditiesPL = [];
    this.selectedStatusPL = [];
    this.selectedStatesPL = [];
    this.selectedFuelTypes = [];
    this.selectedPrimeMover = [];
    this.selectedStatesPP = [];
    this.selectedStatusSS = [];
    this.selectedTypes = [];
    this.selectedStatesSS = [];
    this.selectedStatusTL = [];
    this.selectedVoltage = [];
    this.selectedStatesTL = [];

    this.searchFacilities = '';
    this.searchPipelines = '';
    this.searchPowerPlants = '';
    this.searchTransmissionLines = '';
    this.searchSubstations = '';

    this.isTransmissionPipeline = false;
    this.isGatheringPipeline = false;
    this.isDistributionPipeline = false;
    this.isMapsearchConnectionPipeline = false;
    this.FillFacilityComodityandstate(this.AllFacilitiesData.AllComodity, this.AllFacilitiesData.AllState);
    this.FillPipelineCommodity_StateandStatus(this.AllPipleLineData.AllCommodity, this.AllPipleLineData.Allstate, this.AllPipleLineData.AllStatus);
    this.FillPowerPlant_primefuel_primemoverandState_name(this.AllPipleLineData.PowerPlant_primefuel, this.AllPipleLineData.PowerPlant_primemover, this.AllPipleLineData.powerplant_State_name);
    this.FillSubstation_Status_SubtypeandState_name(this.AllPipleLineData.substations_Status, this.AllPipleLineData.substations_Subtype, this.AllPipleLineData.substations_State_Name);
    this.FillTransmissionLine_Status_volt_catandState_name(this.AllPipleLineData.powerline_status, this.AllPipleLineData.powerline_volt_cat, this.AllPipleLineData.powerline_state_name);
  }
  OnItemSelectCommodity(Item: any) {
    this.selectedCommoditiesFL;
    this.selectedStatesFL;
    this.States;
    var FACCommodity = "";
    var FACState = "";
    var FACType = "";
    if (this.selectedCommoditiesFL.length == 0 && this.selectedStatesFL.length == 0 && this.selectedFacilities.length > 0) {
      for (let i = 0; i < this.AllFacilitiesData.FacilityData.length; i++) {
        var FactypeData = this.AllFacilitiesData.FacilityData[i];
        let selectedval = this.selectedFacilities.filter((factyp) => {
          if (factyp.item_text == FactypeData.FACTYPE)
            return factyp;
        });
        if (selectedval.length > 0) {
          if (FACCommodity)
            FACCommodity += " , " + FactypeData.FACCommodity.join(',');
          else
            FACCommodity = FactypeData.FACCommodity.join(',');
          if (FACState)
            FACState += " , " + FactypeData.FACState.join(',');
          else
            FACState = FactypeData.FACState.join(',');
        }
      }
      if (FACCommodity && FACState) {
        let FACCommodityList = FACCommodity.split(',');
        let FACStateList = FACState.split(',');
        let FACCommodityListData = [];
        FACCommodityList.forEach((c) => {
          if (c.trim())
            FACCommodityListData.push(c.trim());
        });
        let FACStateListData = [];
        FACStateList.forEach((s) => {
          if (s.trim())
            FACStateListData.push(s.trim());
        });
        FACCommodityListData = _.uniq(FACCommodityListData);
        FACStateListData = _.uniq(FACStateListData);
        this.FillFacilityComodityandstate(FACCommodityListData, FACStateListData);
      }
    }
    else if (this.selectedStatesFL.length > 0 && this.selectedCommoditiesFL.length == 0 && this.selectedFacilities.length == 0) {
      var selectedStateval = "";
      this.selectedStatesFL.forEach((e) => {
        if (selectedStateval) {
          selectedStateval = e.item_text;
        } else {
          selectedStateval += "," + e.item_text;
        }
      });
      if (selectedStateval) {
        this.httpRequestService._NodeGetTypeandComoditybasedonStateData(selectedStateval).subscribe(data => {

          var Jsondata = data;
          if (Jsondata._Issuccess) {
            this.FillFacilityComodityandstate(Jsondata.Commodity, [], Jsondata.FacilittyType);
          }
        }, error => {
          console.log(error);
        });
      }

      // for (var stateof of this.selectedStatesFL) {
      //   for (let i = 0; i < this.AllFacilitiesData.FacilityData.length; i++) {
      //     var FactypeData = this.AllFacilitiesData.FacilityData[i];
      //     let Joinstate = FactypeData.FACState.join(',');
      //     if (Joinstate.indexOf(stateof.item_text.trim()) >= 0) {
      //       if (FACType)
      //         FACType += " , " + FactypeData.FACTYPE;
      //       else
      //         FACType = FactypeData.FACTYPE;
      //       if (FACCommodity)
      //         FACCommodity += " , " + FactypeData.FACCommodity.join(',');
      //       else
      //         FACCommodity = FactypeData.FACCommodity.join(',');
      //     }
      //   }
      // }
      // if (FACCommodity && FACType) {
      //   let FACCommodityList = FACCommodity.split(',');
      //   let FACTypeList = FACType.split(',');
      //   let FACCommodityListData = [];
      //   FACCommodityList.forEach((c) => {
      //     if (c.trim())
      //       FACCommodityListData.push(c.trim());
      //   });
      //   let FACTypeListData = [];
      //   FACTypeList.forEach((s) => {
      //     if (s.trim())
      //       FACTypeListData.push(s.trim());
      //   });
      //   FACCommodityListData = _.uniq(FACCommodityListData);
      //   FACTypeListData = _.uniq(FACTypeListData);
      //   this.FillFacilityComodityandstate(FACCommodityListData, [], FACTypeListData);

      // }
    }
    else if (this.selectedCommoditiesFL.length > 0 && this.selectedFacilities.length > 0 && this.selectedStatesFL.length == 0) {
      let Comodity = '';
      let Factype = '';
      this.selectedCommoditiesFL.forEach((commo) => {
        if (Comodity) {
          Comodity += "," + commo.item_text.trim();
        } else {
          Comodity = commo.item_text.trim();
        }
      });
      this.selectedFacilities.forEach((factyp) => {
        if (Factype) {
          Factype += "," + factyp.item_text.trim();
        } else {
          Factype = factyp.item_text.trim();
        }
      });
      if (Factype && Comodity) {
        this.httpRequestService._NodeGetComodityStateData(Comodity, Factype).subscribe(data => {

          var StateData = data;
          if (StateData._Issuccess) {
            if (StateData.commoditystate) {
              this.FillFacilityComodityandstate([], StateData.commoditystate);
            }
          }
        }, error => {
          console.log(error);
        });
      }
    }
    else if (this.selectedCommoditiesFL.length == 0 && this.selectedFacilities.length > 0 && this.selectedStatesFL.length > 0) {
      let State = '';
      let Factype = '';
      this.selectedStatesFL.forEach((state) => {
        if (State) {
          State += "," + state.item_text.trim();
        } else {
          State = state.item_text.trim();
        }
      });
      this.selectedFacilities.forEach((factyp) => {
        if (Factype) {
          Factype += "," + factyp.item_text.trim();
        } else {
          Factype = factyp.item_text.trim();
        }
      });
      if (Factype && State) {
        this.httpRequestService._NodeGetCommoditybasedonStateandTypeData(State, Factype).subscribe(data => {

          var StateData = data;
          if (StateData._Issuccess) {
            if (StateData.Commodity) {
              this.FillFacilityComodityandstate(StateData.Commodity, []);
            }
          }
        }, error => {
          console.log(error);
        });
      }
    }
    else if (this.selectedStatesFL.length > 0 && this.selectedCommoditiesFL.length > 0 && this.selectedFacilities.length == 0) {
      let State = '';
      let Commodity = '';
      this.selectedStatesFL.forEach((state) => {
        if (State) {
          State += "," + state.item_text.trim();
        } else {
          State = state.item_text.trim();
        }
      });
      this.selectedCommoditiesFL.forEach((commo) => {
        if (Commodity) {
          Commodity += "," + commo.item_text.trim();
        } else {
          Commodity = commo.item_text.trim();
        }
      });
      if (Commodity && State) {
        this.httpRequestService._NodeGetGetFactypeBasedonStateandCommodity(State, Commodity).subscribe(data => {

          var StateData = data;
          if (StateData._Issuccess) {
            if (StateData.Factype) {
              this.FillFacilityComodityandstate([], [], StateData.Factype);
            }
          }
        }, error => {
          console.log(error);
        });
      }
    }
    else if (this.selectedCommoditiesFL.length == 0 && this.selectedStatesFL.length == 0 && this.selectedFacilities.length == 0) {
      var AllFactype = [];
      this.AllFacilitiesData.FacilityData.forEach((factyp) => {
        AllFactype.push(factyp.FACTYPE);
      });
      this.FillFacilityComodityandstate(this.AllFacilitiesData.AllComodity, this.AllFacilitiesData.AllState, AllFactype);
    }
  }
  // End Facilities Tab 

  // Start Pipeline 
  GetPipelineandAllTabData() {
    this.LayerLoader = true;
    this.httpRequestService._NodeGetPiplelineandothertabData().subscribe(data => {

      if (data._Issuccess) {
        var jsonData = data;
        this.AllPipleLineData = jsonData;
        this.FillPipelineCommodity_StateandStatus(jsonData.AllCommodity, jsonData.Allstate, jsonData.AllStatus);
        this.FillPowerPlant_primefuel_primemoverandState_name(jsonData.PowerPlant_primefuel, jsonData.PowerPlant_primemover, jsonData.powerplant_State_name);
        this.FillSubstation_Status_SubtypeandState_name(jsonData.substations_Status, jsonData.substations_Subtype, jsonData.substations_State_Name);
        this.FillTransmissionLine_Status_volt_catandState_name(jsonData.powerline_status, jsonData.powerline_volt_cat, jsonData.powerline_state_name);
      }
      this.LayerLoader = false;
    },
      error => {
        console.log(error);
        this.LayerLoader = false;
      });
  }
  FillPipelineCommodity_StateandStatus(ComodityList, StateList, StatusList) {
    if (ComodityList && ComodityList.length > 0) {
      this.Commodities2 = [];
      this.selectedCommoditiesPL = [];
      ComodityList = _.sortBy(ComodityList)
      for (let c = 0; c < ComodityList.length; c++) {
        this.Commodities2.push({ 'item_id': (c + 1), 'item_text': ComodityList[c].trim() });
      }
    }
    if (StateList && StateList.length > 0) {
      this.States2 = [];
      this.selectedStatesPL = [];
      StateList = _.sortBy(StateList);
      for (let s = 0; s < StateList.length; s++) {
        if (StateList[s].trim()) {
          this.States2.push({ 'item_id': (s + 1), 'item_text': StateList[s].trim() });
        }
      }
    }
    if (StatusList && StatusList.length > 0) {
      this.Status = [];
      this.selectedStatusPL = [];
      StatusList = _.sortBy(StatusList);
      for (let f = 0; f < StatusList.length; f++) {
        this.Status.push({ 'item_id': (f + 1), 'item_text': StatusList[f].trim() });
      }
    }

  }
  onPipelineItemSelect(Item: any) {
    this.Commodities2;
    this.States2;
    this.Status;
    this.selectedCommoditiesPL;
    this.selectedStatesPL;
    this.selectedStatusPL;
    this.AllPipleLineData;
    var filterCommodity = '';
    var filterstate = '';
    var filterStatus = '';
    if (this.selectedCommoditiesPL.length > 0) {
      this.selectedCommoditiesPL.forEach((c) => {
        if (filterCommodity) {
          filterCommodity += "," + c.item_text.trim();
        } else {
          filterCommodity = c.item_text.trim();
        }
      });
    }
    if (this.selectedStatesPL.length > 0) {
      this.selectedStatesPL.forEach((s) => {
        if (filterstate) {
          filterstate += "," + s.item_text.trim();
        } else {
          filterstate = s.item_text.trim();
        }
      });
    }
    if (this.selectedStatusPL.length > 0) {
      this.selectedStatusPL.forEach((s) => {
        if (filterStatus) {
          filterStatus += "," + s.item_text.trim();
        } else {
          filterStatus = s.item_text.trim();
        }
      });
    }
    if (this.selectedCommoditiesPL.length == 0 && this.selectedStatesPL.length == 0 && this.selectedStatusPL.length == 0) {
      this.FillPipelineCommodity_StateandStatus(this.AllPipleLineData.AllCommodity, this.AllPipleLineData.Allstate, this.AllPipleLineData.AllStatus);
    } else {
      this.httpRequestService._NodeGetPiplelineDatabasedonFiltervalue(filterCommodity, filterstate, filterStatus).subscribe(data => {

        var Jsondata = data;
        if (Jsondata._Issuccess) {
          this.FillPipelineCommodity_StateandStatus(Jsondata.Commodity, Jsondata.state, Jsondata.Status);
        }
      }, error => {
        console.log(error);
      });
    }
  }
  // End Pipeline 

  //Power Plant
  FillPowerPlant_primefuel_primemoverandState_name(PrimefuelList, PrimemoverList, StatenameList) {
    if (PrimefuelList && PrimefuelList.length > 0) {
      this.FuelType = [];
      this.selectedFuelTypes = [];
      PrimefuelList = _.sortBy(PrimefuelList)
      for (let c = 0; c < PrimefuelList.length; c++) {
        this.FuelType.push({ 'item_id': (c + 1), 'item_text': PrimefuelList[c].trim() });
      }
    }
    if (PrimemoverList && PrimemoverList.length > 0) {
      this.PrimeMover = [];
      this.selectedPrimeMover = [];
      PrimemoverList = _.sortBy(PrimemoverList);
      for (let s = 0; s < PrimemoverList.length; s++) {
        if (PrimemoverList[s].trim()) {
          this.PrimeMover.push({ 'item_id': (s + 1), 'item_text': PrimemoverList[s].trim() });
        }
      }
    }
    if (StatenameList && StatenameList.length > 0) {
      this.PowerPlant_States = [];
      this.selectedStatesPP = [];
      StatenameList = _.sortBy(StatenameList);
      for (let f = 0; f < StatenameList.length; f++) {
        if (StatenameList[f].trim())
          this.PowerPlant_States.push({ 'item_id': (f + 1), 'item_text': StatenameList[f].trim() });
      }
    }

  }
  onpowerplantItemselect(Item: any) {
    this.FuelType;
    this.PowerPlant_States;
    this.PrimeMover;
    this.selectedFuelTypes;
    this.selectedPrimeMover;
    this.selectedStatesPP;
    this.AllPipleLineData;
    var filterfueltype = '';
    var filterstate = '';
    var filterPrimemover = '';
    if (this.selectedFuelTypes.length > 0) {
      this.selectedFuelTypes.forEach((c) => {
        if (filterfueltype) {
          filterfueltype += "," + c.item_text.trim();
        } else {
          filterfueltype = c.item_text.trim();
        }
      });
    }
    if (this.selectedStatesPP.length > 0) {
      this.selectedStatesPP.forEach((s) => {
        if (filterstate) {
          filterstate += "," + s.item_text.trim();
        } else {
          filterstate = s.item_text.trim();
        }
      });
    }
    if (this.selectedPrimeMover.length > 0) {
      this.selectedPrimeMover.forEach((s) => {
        if (filterPrimemover) {
          filterPrimemover += "," + s.item_text.trim();
        } else {
          filterPrimemover = s.item_text.trim();
        }
      });
    }
    if (this.selectedFuelTypes.length == 0 && this.selectedStatesPP.length == 0 && this.selectedPrimeMover.length == 0) {
      this.FillPowerPlant_primefuel_primemoverandState_name(this.AllPipleLineData.PowerPlant_primefuel, this.AllPipleLineData.PowerPlant_primemover, this.AllPipleLineData.powerplant_State_name);
    } else {
      this.httpRequestService._NodeGetPowerPlantDatabasedonFiltervalue(filterfueltype, filterPrimemover, filterstate).subscribe(data => {

        var Jsondata = data;
        if (Jsondata._Issuccess) {
          this.FillPowerPlant_primefuel_primemoverandState_name(Jsondata.Fueltype, Jsondata.PrimeMover, Jsondata.state);
        }
      }, error => {
        console.log(error);
      });
    }
  }
  // End PowerPlant

  //Start Substation
  FillSubstation_Status_SubtypeandState_name(StatusList, SubtypeList, StatenameList) {
    if (StatusList && StatusList.length > 0) {
      this.Status2 = [];
      this.selectedStatusSS = [];
      StatusList = _.sortBy(StatusList)
      for (let c = 0; c < StatusList.length; c++) {
        this.Status2.push({ 'item_id': (c + 1), 'item_text': StatusList[c].trim() });
      }
    }
    if (SubtypeList && SubtypeList.length > 0) {
      this.Type = [];
      this.selectedTypes = [];
      SubtypeList = _.sortBy(SubtypeList);
      for (let s = 0; s < SubtypeList.length; s++) {
        if (SubtypeList[s].trim()) {
          this.Type.push({ 'item_id': (s + 1), 'item_text': SubtypeList[s].trim() });
        }
      }
    }
    if (StatenameList && StatenameList.length > 0) {
      this.substation_States = [];
      this.selectedStatesSS = [];
      StatenameList = _.sortBy(StatenameList);
      for (let f = 0; f < StatenameList.length; f++) {
        if (StatenameList[f].trim())
          this.substation_States.push({ 'item_id': (f + 1), 'item_text': StatenameList[f].trim() });
      }
    }
  }
  onsubstationItemselect(Item: any) {
    this.Status2;
    this.selectedStatusSS;
    this.Type;
    this.selectedTypes;
    this.substation_States;
    this.selectedStatesSS
    this.AllPipleLineData;
    var filterstatus = '';
    var filterstate = '';
    var filtertype = '';
    if (this.selectedStatusSS.length > 0) {
      this.selectedStatusSS.forEach((c) => {
        if (filterstatus) {
          filterstatus += "," + c.item_text.trim();
        } else {
          filterstatus = c.item_text.trim();
        }
      });
    }
    if (this.selectedStatesSS.length > 0) {
      this.selectedStatesSS.forEach((s) => {
        if (filterstate) {
          filterstate += "," + s.item_text.trim();
        } else {
          filterstate = s.item_text.trim();
        }
      });
    }
    if (this.selectedTypes.length > 0) {
      this.selectedTypes.forEach((s) => {
        if (filtertype) {
          filtertype += "," + s.item_text.trim();
        } else {
          filtertype = s.item_text.trim();
        }
      });
    }
    if (this.selectedStatusSS.length == 0 && this.selectedStatesSS.length == 0 && this.selectedTypes.length == 0) {
      this.FillSubstation_Status_SubtypeandState_name(this.AllPipleLineData.substations_Status, this.AllPipleLineData.substations_Subtype, this.AllPipleLineData.substations_State_Name);
    } else {
      this.httpRequestService._NodeGetSubstationDatabasedonFiltervalue(filterstatus, filtertype, filterstate).subscribe(data => {

        var Jsondata = data;
        if (Jsondata._Issuccess) {
          this.FillSubstation_Status_SubtypeandState_name(Jsondata.Status, Jsondata.Subtype, Jsondata.state);
        }
      }, error => {
        console.log(error);
      });
    }
  }
  //End Substation

  //Start TransmissionLine
  FillTransmissionLine_Status_volt_catandState_name(StatusList, volt_catList, StatenameList) {
    if (StatusList && StatusList.length > 0) {
      this.TransmissionLine_Status2 = [];
      this.selectedStatusTL = [];
      StatusList = _.sortBy(StatusList)
      for (let c = 0; c < StatusList.length; c++) {
        this.TransmissionLine_Status2.push({ 'item_id': (c + 1), 'item_text': StatusList[c].trim() });
      }
    }
    if (volt_catList && volt_catList.length > 0) {
      this.Voltage = [];
      this.selectedVoltage = [];
      volt_catList = _.sortBy(volt_catList);
      for (let s = 0; s < volt_catList.length; s++) {
        if (volt_catList[s].trim()) {
          this.Voltage.push({ 'item_id': (s + 1), 'item_text': volt_catList[s].trim() });
        }
      }
    }
    if (StatenameList && StatenameList.length > 0) {
      this.TransmissionLine_States = [];
      this.selectedStatesTL = [];
      StatenameList = _.sortBy(StatenameList);
      for (let f = 0; f < StatenameList.length; f++) {
        if (StatenameList[f].trim())
          this.TransmissionLine_States.push({ 'item_id': (f + 1), 'item_text': StatenameList[f].trim() });
      }
    }
  }

  onTransmissionLineItemselect(Item: any) {
    this.TransmissionLine_Status2;
    this.selectedStatusTL;
    this.Voltage;
    this.selectedVoltage;
    this.TransmissionLine_States;
    this.selectedStatesTL;
    this.AllPipleLineData;
    var filterstatus = '';
    var filterstate = '';
    var filterVoltage = '';
    if (this.selectedStatusTL.length > 0) {
      this.selectedStatusTL.forEach((c) => {
        if (filterstatus) {
          filterstatus += "," + c.item_text.trim();
        } else {
          filterstatus = c.item_text.trim();
        }
      });
    }
    if (this.selectedStatesTL.length > 0) {
      this.selectedStatesTL.forEach((s) => {
        if (filterstate) {
          filterstate += "," + s.item_text.trim();
        } else {
          filterstate = s.item_text.trim();
        }
      });
    }
    if (this.selectedVoltage.length > 0) {
      this.selectedVoltage.forEach((s) => {
        if (filterVoltage) {
          filterVoltage += "," + s.item_text.trim();
        } else {
          filterVoltage = s.item_text.trim();
        }
      });
    }
    if (this.selectedStatusTL.length == 0 && this.selectedStatesTL.length == 0 && this.selectedVoltage.length == 0) {
      this.FillTransmissionLine_Status_volt_catandState_name(this.AllPipleLineData.powerline_status, this.AllPipleLineData.powerline_volt_cat, this.AllPipleLineData.powerline_state_name);
    } else {
      this.httpRequestService._NodeGetTransmissionDatabasedonFiltervalue(filterstatus, filterVoltage, filterstate).subscribe(data => {

        var Jsondata = data;
        if (Jsondata._Issuccess) {
          this.FillTransmissionLine_Status_volt_catandState_name(Jsondata.Status, Jsondata.voltage, Jsondata.state);
        }
      }, error => {
        console.log(error);
      });
    }


  }
  //End TransmissionLine

  onItemSelect($event) {
  }

  onSelectAll($event) {
  }

  FillStaticData() {
    this.Status = [
      { item_id: 1, item_text: 'Abandoned' },
      { item_id: 2, item_text: 'Active' },
      { item_id: 3, item_text: 'Idle/Inactive' },
      { item_id: 4, item_text: 'Proposed' },
      { item_id: 5, item_text: 'Shutdown' },
      { item_id: 6, item_text: 'Under Construction' },
    ];

    this.Status2 = [
      { item_id: 1, item_text: 'Active' },
      { item_id: 2, item_text: 'Idle/Inactive' },
      { item_id: 3, item_text: 'Proposed' },
      { item_id: 4, item_text: 'Shutdown' },
      { item_id: 5, item_text: 'Terminated/Held' },
      { item_id: 6, item_text: 'Under Construction' },
    ];

    this.Commodities = [
      { item_id: 1, item_text: 'Crude Oil' },
      { item_id: 2, item_text: 'Natural Gas' },
      { item_id: 3, item_text: 'LPG/NGL' },
      { item_id: 4, item_text: 'Petrochemical' },
      { item_id: 5, item_text: 'Refined Products' },
    ];

    this.Commodities2 = [
      { item_id: 1, item_text: 'Crude Oil' },
      { item_id: 2, item_text: 'Natural Gas' },
      { item_id: 3, item_text: 'LPG/NGL' },
      { item_id: 4, item_text: 'Petrochemical' },
      { item_id: 5, item_text: 'Refined Products' },
      { item_id: 6, item_text: 'Specialty Gases' }
    ];

    this.FuelType = [
      { item_id: 1, item_text: 'Biomass' },
      { item_id: 2, item_text: 'Coal' },
      { item_id: 3, item_text: 'Geothermal' },
      { item_id: 4, item_text: 'Hydro' },
      { item_id: 5, item_text: 'Natural Gas' },
      { item_id: 6, item_text: 'Nuclear' },
      { item_id: 7, item_text: 'Fuel Oil' },
      { item_id: 8, item_text: 'Solar' },
      { item_id: 9, item_text: 'Waste' },
      { item_id: 10, item_text: 'Wind' },
      { item_id: 11, item_text: 'Other' },
    ];

    this.Type = [
      { item_id: 1, item_text: 'Bulk Station' },
      { item_id: 2, item_text: 'Capacitor Station' },
      { item_id: 3, item_text: 'Converter Station' },
      { item_id: 4, item_text: 'Distribution Point' },
      { item_id: 5, item_text: 'Line Taps' },
      { item_id: 6, item_text: 'Metering Station' },
      { item_id: 7, item_text: 'Receiving Station' },
      { item_id: 8, item_text: 'Substation' },
      { item_id: 9, item_text: 'Switching Station' },
      { item_id: 10, item_text: 'Switching Yard' },
      { item_id: 11, item_text: 'Terminal Tower' },
      { item_id: 12, item_text: 'Switching Yard' },
      { item_id: 13, item_text: 'Terminal Tower' },
      { item_id: 14, item_text: 'Transformer' }

    ];

    this.PrimeMover = [
      { item_id: 1, item_text: 'CAES' },
      { item_id: 2, item_text: 'Combined Cycle' },
      { item_id: 3, item_text: 'Geothermal' },
      { item_id: 4, item_text: 'Internal Combustion' },
      { item_id: 5, item_text: 'Other' },
      { item_id: 6, item_text: 'Solar' },
      { item_id: 7, item_text: 'Stream' },
      { item_id: 8, item_text: 'Water' },
      { item_id: 9, item_text: 'Wind' }
    ];

    this.Voltage = [
      { item_id: 1, item_text: '<69 kV' },
      { item_id: 2, item_text: '69-138 kV' },
      { item_id: 3, item_text: '139-230 kV' },
      { item_id: 4, item_text: '231-345 kV' },
      { item_id: 5, item_text: '346-500 kV' },
      { item_id: 6, item_text: '501-765 kV' },
      { item_id: 7, item_text: 'DC' },
    ];
  }

  ShowWidgetBasedOnRole() {
    if (!this.AuthServices.ShowOilAndGasUIBasedOnRole() && !this.AuthServices.ShowElectricPowerUIBasedOnRole()) {
      $("#facilitiesTabHeader").parent().parent().addClass("disabled disable-tab");
      $("#pipelinesTabHeader").parent().parent().addClass("disabled disable-tab");
      $("#powerPlantsTabHeader").parent().parent().addClass("disabled disable-tab");
      $("#substationsTabHeader").parent().parent().addClass("disabled disable-tab");
      $("#transmissionLinesTabHeader").parent().parent().addClass("disabled disable-tab");
      $("#assetLookupCard .card-header").addClass("disable-cardHeader");
      $("#assetLookupCard .card-body").addClass("disable-cardBody");
      $("#assetLookupCard .card-body .tab-content-wrapper").addClass("disable-cardBody");
      $("#assetLookupCard").addClass("disabled");

    }
    else if (!this.AuthServices.ShowOilAndGasUIBasedOnRole() && this.AuthServices.ShowElectricPowerUIBasedOnRole()) {
      $("#facilitiesTabHeader").parent().parent().addClass("disabled disable-tab");
      $("#pipelinesTabHeader").parent().parent().addClass("disabled disable-tab");
      if (this.AuthServices.ShowElectricPowerUIBasedOnRole()) {
        let powerPlantsTab: HTMLElement = document.getElementById('powerPlantsTabHeader') as HTMLElement;
        if (powerPlantsTab != null) {
          powerPlantsTab.click();
        }
      }
    }
    else if (!this.AuthServices.ShowElectricPowerUIBasedOnRole() && this.AuthServices.ShowOilAndGasUIBasedOnRole()) {
      $("#powerPlantsTabHeader").parent().parent().addClass("disabled disable-tab");
      $("#substationsTabHeader").parent().parent().addClass("disabled disable-tab");
      $("#transmissionLinesTabHeader").parent().parent().addClass("disabled disable-tab");
      if (this.AuthServices.ShowOilAndGasUIBasedOnRole()) {
        let facilityTab: HTMLElement = document.getElementById('facilitiesTabHeader') as HTMLElement;
        if (facilityTab != null) {
          facilityTab.click();
        }
      }
    }
  }

  SearchAssets() {
    if (document.getElementById("facilitiesTabHeader").parentElement.classList.contains('active'))
      this.activeTab = this.TabEnum.Facilities;
    else if (document.getElementById("pipelinesTabHeader").parentElement.classList.contains('active'))
      this.activeTab = this.TabEnum.Pipelines;
    else if (document.getElementById("powerPlantsTabHeader").parentElement.classList.contains('active'))
      this.activeTab = this.TabEnum.PowerPlants;
    else if (document.getElementById("substationsTabHeader").parentElement.classList.contains('active'))
      this.activeTab = this.TabEnum.Substations;
    else if (document.getElementById("transmissionLinesTabHeader").parentElement.classList.contains('active'))
      this.activeTab = this.TabEnum.TransmissionLines;

    switch (this.activeTab) {
      case this.TabEnum.Facilities:
        this.SetFacilitiesFilter();
        break;
      case this.TabEnum.Pipelines:
        this.setPipelinesFilter();
        break;
      case this.TabEnum.PowerPlants:
        this.setPowerPlantFilter();
        break;
      case this.TabEnum.Substations:
        this.setSubstationsFilter();
        break;
      case this.TabEnum.TransmissionLines:
        this.setTransmissionLines();
        break;
    }
    if (this.Treedatalist.length > 0) {
      this.CondensedComponent.Redirect('maps');
      this.CondensedComponent.SetTemporaryTreeNodeForWidget(this.Treedatalist);
    }
  }

  SetFacilitiesFilter() {
    let CurrentTab = this.TabEnum.Facilities;
    let selectedDataResult = [];
    this.dataResults.map((d) => {
      if (d.DataName && d.DataName != '' && d.DataName != undefined && d.DataName.toLowerCase() == CurrentTab.toLowerCase()) {
        selectedDataResult.push(d);
      }
    });
    let temp = selectedDataResult[0].Displayname[0];
    let tempLayerObjPropObj = this.GetTempLayerObject(CurrentTab, temp);
    tempLayerObjPropObj.RepresentationType = "Point";
    tempLayerObjPropObj.IconType = "Storage";
    tempLayerObjPropObj.SizePercent = 50;
    tempLayerObjPropObj.StrokeThicknessPercent = 18;
    let filterValue = '';
    if (this.searchFacilities) {
      filterValue = temp.OwnerFieldName + '#LIKE#' + this.searchFacilities + '#OR#' + temp.OperatorFieldName + '#LIKE#' + this.searchFacilities + '#OR#' + temp.FacilityNameFieldName + '#LIKE#' + this.searchFacilities;
    }
    if (filterValue)
      filterValue += ';';
    filterValue += this.SetEqualOrFilterFromArray(temp.FacilityTypeFieldName, this.selectedFacilities, '#LIKE#');
    filterValue += ';';
    filterValue += this.SetEqualOrFilterFromArray(temp.CommodityFieldName, this.selectedCommoditiesFL, '#LIKE#');
    filterValue += ';';
    filterValue += this.SetEqualOrFilterFromArray(temp.StateFieldName, this.selectedStatesFL, '#LIKE#');
    tempLayerObjPropObj.FilterValue = filterValue;
    this.SetTree(temp, tempLayerObjPropObj);
  }

  setPipelinesFilter() {
    let CurrentTab = this.TabEnum.Pipelines;
    let selectedDataResult = [];
    this.dataResults.map((d) => {
      if (d.DataName && d.DataName != '' && d.DataName != undefined && d.DataName.toLowerCase() == CurrentTab.toLowerCase()) {
        selectedDataResult.push(d);
      }
    });
    let temp = selectedDataResult[0].Displayname[0];
    let tempLayerObjPropObj = this.GetTempLayerObject(CurrentTab, temp);
    tempLayerObjPropObj.RepresentationType = "Line";
    tempLayerObjPropObj.IconType = "Line";
    tempLayerObjPropObj.SizePercent = 100;
    tempLayerObjPropObj.StrokeThicknessPercent = 5;

    let filterValue = '';
    if (this.searchPipelines) {
      filterValue = temp.OwnerFieldName + '#LIKE#' + this.searchPipelines + '#OR#' + temp.OperatorFieldName + '#LIKE#' + this.searchPipelines + '#OR#' + temp.SystemFieldName + '#LIKE#' + this.searchPipelines;
    }
    if (this.isDistributionPipeline || this.isGatheringPipeline || this.isTransmissionPipeline || this.isMapsearchConnectionPipeline) {
      if (filterValue)
        filterValue += ';';
      filterValue += this.SetEaualOrFiterForSingleVal(temp.LinetypeFieldName, temp.TransmissionValue, this.isTransmissionPipeline);
      filterValue += this.SetEaualOrFiterForSingleVal(temp.LinetypeFieldName, temp.GatheringValue, this.isGatheringPipeline);
      filterValue += this.SetEaualOrFiterForSingleVal(temp.LinetypeFieldName, temp.LocalDistributionValue, this.isDistributionPipeline);
      filterValue += this.SetEaualOrFiterForSingleVal(temp.LinetypeFieldName, temp.MapsearchConnectionValue, this.isMapsearchConnectionPipeline);
    }

    if (filterValue)
      filterValue += ';';
    filterValue += this.SetEqualOrFilterFromArray(temp.CommodityFieldName, this.selectedCommoditiesPL);
    filterValue += ';';
    filterValue += this.SetEqualOrFilterFromArray(temp.StatusFieldName, this.selectedStatusPL);
    filterValue += ';';
    filterValue += this.SetEqualOrFilterFromArray(temp.StateFieldName, this.selectedStatesPL);
    tempLayerObjPropObj.FilterValue = filterValue;
    this.SetTree(temp, tempLayerObjPropObj);
  }

  setPowerPlantFilter() {
    let CurrentTab = this.TabEnum.PowerPlants;
    let selectedDataResult = [];
    this.dataResults.map((d) => {
      if (d.DataName && d.DataName != '' && d.DataName != undefined && d.DataName.toLowerCase() == CurrentTab.toLowerCase()) {
        selectedDataResult.push(d);
      }
    });
    let temp = selectedDataResult[0].Displayname[0];
    let tempLayerObjPropObj = this.GetTempLayerObject(CurrentTab, temp);
    tempLayerObjPropObj.RepresentationType = "Point";
    tempLayerObjPropObj.IconType = "Rectangle";
    tempLayerObjPropObj.SizePercent = 50;
    tempLayerObjPropObj.StrokeThicknessPercent = 5;

    let filterValue = '';
    if (this.searchPowerPlants) {
      filterValue = temp.OwnerFieldName + '#LIKE#' + this.searchPowerPlants + '#OR#' + temp.OperatorFieldName + '#LIKE#' + this.searchPowerPlants + '#OR#' + temp.FacilityNameFieldName + '#LIKE#' + this.searchPowerPlants;
    }
    if (filterValue)
      filterValue += ';';
    filterValue += this.SetEqualOrFilterFromArray(temp.FuelTypeField, this.selectedFuelTypes);
    filterValue += ';';
    filterValue += this.SetEqualOrFilterFromArray(temp.PrimeMoverField, this.selectedPrimeMover);
    filterValue += ';';
    filterValue += this.SetEqualOrFilterFromArray(temp.StateFieldName, this.selectedStatesPP);
    tempLayerObjPropObj.FilterValue = filterValue;
    this.SetTree(temp, tempLayerObjPropObj);
  }

  setSubstationsFilter() {
    let CurrentTab = this.TabEnum.Substations;
    let selectedDataResult = [];
    this.dataResults.map((d) => {
      if (d.DataName && d.DataName != '' && d.DataName != undefined && d.DataName.toLowerCase() == CurrentTab.toLowerCase()) {
        selectedDataResult.push(d);
      }
    });
    let temp = selectedDataResult[0].Displayname[0];
    let tempLayerObjPropObj = this.GetTempLayerObject(CurrentTab, temp);
    tempLayerObjPropObj.RepresentationType = "Point";
    tempLayerObjPropObj.IconType = "Pentagram";
    tempLayerObjPropObj.SizePercent = 50;
    tempLayerObjPropObj.StrokeThicknessPercent = 5;

    let filterValue = '';
    if (this.searchSubstations) {
      filterValue = temp.OwnerFieldName + '#LIKE#' + this.searchSubstations + '#OR#' + temp.OperatorFieldName + '#LIKE#' + this.searchSubstations + '#OR#' + temp.SubnameFieldName + '#LIKE#' + this.searchSubstations;
    }
    if (filterValue)
      filterValue += ';';
    filterValue += this.SetEqualOrFilterFromArray(temp.StatusFieldName, this.selectedStatusSS);
    filterValue += ';';
    filterValue += this.SetEqualOrFilterFromArray(temp.SubTypeFieldName, this.selectedTypes);
    filterValue += ';';
    filterValue += this.SetEqualOrFilterFromArray(temp.StateNameFieldName, this.selectedStatesSS);
    tempLayerObjPropObj.FilterValue = filterValue;
    this.SetTree(temp, tempLayerObjPropObj);
  }

  setTransmissionLines() {
    let CurrentTab = this.TabEnum.TransmissionLines;
    let selectedDataResult = [];
    this.dataResults.map((d) => {
      if (d.DataName && d.DataName != '' && d.DataName != undefined && d.DataName.toLowerCase() == CurrentTab.toLowerCase()) {
        selectedDataResult.push(d);
      }
    });
    let temp = selectedDataResult[0].Displayname[0];
    let tempLayerObjPropObj = this.GetTempLayerObject(CurrentTab, temp);
    tempLayerObjPropObj.RepresentationType = "Line";
    tempLayerObjPropObj.IconType = "Line";
    tempLayerObjPropObj.SizePercent = 100;
    tempLayerObjPropObj.StrokeThicknessPercent = 5;

    let filterValue = '';
    if (this.searchTransmissionLines) {
      filterValue = temp.OwnerFieldName + '#LIKE#' + this.searchTransmissionLines + '#OR#' + temp.OperatorFieldName + '#LIKE#' + this.searchTransmissionLines;
    }
    if (filterValue)
      filterValue += ';';
    filterValue += this.SetEqualOrFilterFromArray(temp.StatusFieldName, this.selectedStatusTL);
    filterValue += ';';
    filterValue += this.SetEqualOrFilterFromArray(temp.VoltageFieldName, this.selectedVoltage);
    filterValue += ';';
    filterValue += this.SetEqualOrFilterFromArray(temp.StateNameFieldName, this.selectedStatesTL);
    tempLayerObjPropObj.FilterValue = filterValue;
    this.SetTree(temp, tempLayerObjPropObj);
  }

  AddLayeronTempVariable(tempobj) {
    if (this.MapServiceService.LayerIndex.getValue()) {
      let currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
      tempobj["Layerindexval"] = currentIndexVal;
      this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
    }
    this.MapServiceService.temporaryLayer.push(tempobj);
  }

  RemovelayerFromTree(DatasetId) {
    let tempLayerTreeData = this.MapServiceService.TemporaryTreeNode.getValue();
    let facilitiesData = tempLayerTreeData.find(x => x.Id == DatasetId);
    if (facilitiesData)
      this.utilityService.ActiveLayerData(DatasetId, 'RemovetemporaryTreeData');

    let dataToRemoveIndexes = [];
    for (let i = 0; i < this.Treedatalist.length; i++) {
      let treeItem = this.Treedatalist[i];
      if (treeItem.Id == DatasetId)
        continue;
      let item = tempLayerTreeData.find(y => y.Id == treeItem.Id);
      if (!item) {
        dataToRemoveIndexes.push(i);
      }
    }
    if (dataToRemoveIndexes.length > 0) {
      dataToRemoveIndexes.reverse();
      for (let i = 0; i < dataToRemoveIndexes.length; i++) {
        let index = dataToRemoveIndexes[i];
        this.Treedatalist.splice(index, 1);
      }
    }
  }

  getsingaleTree(tempobj) {
    let Tree = {
      Id: tempobj.DataSetID,
      Name: tempobj.DataSetName,
      activeCount: 0,
      IconUrl: environment.GetLayerIconURL + "/icongenerate/get/?Id=" + tempobj.DataSetID + "&URLType=CustomStyleIcon&FillColor=" + tempobj.FillColor + "&IconType=" + tempobj.IconType + "&StrokeColor=" + tempobj.StrokeColor + "&SizePercent=" + tempobj.SizePercent + "&StrokeThicknessPercent=" + tempobj.StrokeThicknessPercent + "&Opacity=" + tempobj.Opacity,
      IsChecked: true,
    }
    return Tree
  }

  SetEqualOrFilterFromArray(fieldName, List, equalVal = '#EQUAL#') {
    let filterVal = '';
    if (List && List.length > 0) {
      for (let item of List) {
        filterVal += fieldName + equalVal + item.item_text + "#OR#";
      }
    }
    return filterVal;
  }

  SetEaualOrFiterForSingleVal(fieldName, Value, ValueToCheck: any = true) {
    let filterValue = '';
    if (ValueToCheck)
      filterValue += fieldName + '#EQUAL#' + Value + '#OR#';
    return filterValue;
  }

  GetTempLayerObject(ActiveTab, temp) {
    let tempLayerObjPropObj = new tempLayerDataProp();
    let activeTab = ActiveTab;

    tempLayerObjPropObj.Opacity = 1;
    // tempLayerObjPropObj.IsFromHomeLookup = false;    
    tempLayerObjPropObj.DataSetID = temp.DataSetID;
    tempLayerObjPropObj.EnergyLayerID = tempLayerObjPropObj.DataSetID;
    tempLayerObjPropObj.TableName = temp.TableName;
    tempLayerObjPropObj.DetailPanelPropertiesMain = temp.DBFProperties;
    tempLayerObjPropObj.DBFProperties = temp.DBFProperties;
    tempLayerObjPropObj.DetailPanelProperties = temp.DetailPanelProperties;
    tempLayerObjPropObj.StrokeColor = "FF" + this.utilityService.getRandomColor();
    tempLayerObjPropObj.FillColor = tempLayerObjPropObj.StrokeColor;
    tempLayerObjPropObj.UploadedBy = this.AuthServices.getLoggedinUserId();

    let TreeName = '';
    if (activeTab == this.TabEnum.Facilities && this.searchFacilities) {
      TreeName = activeTab + " - " + this.searchFacilities;
    } else if (activeTab == this.TabEnum.Pipelines && this.searchPipelines) {
      TreeName = activeTab + " - " + this.searchPipelines;
    } else if (activeTab == this.TabEnum.PowerPlants && this.searchPowerPlants) {
      TreeName = activeTab + " - " + this.searchPowerPlants;
    } else if (activeTab == this.TabEnum.Substations && this.searchSubstations) {
      TreeName = activeTab + " - " + this.searchSubstations;
    } else if (activeTab == this.TabEnum.TransmissionLines && this.searchTransmissionLines) {
      TreeName = activeTab + " - " + this.searchTransmissionLines;
    } else {
      TreeName = activeTab;
    }
    tempLayerObjPropObj.DataSetName = TreeName;
    tempLayerObjPropObj.Description = TreeName;
    tempLayerObjPropObj.Tags = TreeName;

    tempLayerObjPropObj.TreeStatus = "Individual";
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
    tempLayerObjPropObj.isEnergyLayer = temp.isEnergyLayer;
    tempLayerObjPropObj["DisplayName"] = temp.EnergyLayerDisplayName;
    tempLayerObjPropObj.EnergyLayerID = temp.EnergyLayerID;
    return tempLayerObjPropObj;
  }

  SetTree(temp, tempLayerObjPropObj) {
    this.RemovelayerFromTree(temp.DataSetID);
    this.AddLayeronTempVariable(tempLayerObjPropObj);
    let TreeIndex = this.Treedatalist.findIndex(x => x.Id == temp.DataSetID);
    let temptreeNode = this.MapServiceService.TemporaryTreeNode.getValue();
    for (let TempTreeNodeIndex of temptreeNode) {
      let treenodeindex = this.Treedatalist.findIndex(x => x.Id == TempTreeNodeIndex.Id);
      if (treenodeindex != -1)
        this.Treedatalist.splice(treenodeindex, 1);
    }
    if (TreeIndex != -1)
      this.Treedatalist.splice(TreeIndex, 1);
    this.Treedatalist.push(this.getsingaleTree(tempLayerObjPropObj));
  }

}
