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
var dashboard_service_1 = require("../../services/dashboard.service");
var auth_service_1 = require("../../services/auth.service");
var all_http_request_service_1 = require("../../services/all-http-request.service");
var layer_data_prop_1 = require("../../models/layer-data-prop");
var map_service_service_1 = require("../../services/map-service.service");
var Utility_service_1 = require("../../services/Utility.service");
var layouts_1 = require("../../@pages/layouts");
var environment_prod_1 = require("../../../environments/environment.prod");
var _ = require("lodash");
var localdata_service_1 = require("../../services/localdata.service");
var AssetLookupComponent = (function () {
    function AssetLookupComponent(dashboardService, AuthServices, httpRequestService, MapServiceService, utilityService, LocalDataService, injector) {
        var _this = this;
        this.dashboardService = dashboardService;
        this.AuthServices = AuthServices;
        this.httpRequestService = httpRequestService;
        this.MapServiceService = MapServiceService;
        this.utilityService = utilityService;
        this.LocalDataService = LocalDataService;
        this.injector = injector;
        this.ImageURLPath = environment_prod_1.environment.ImagespreviewPath;
        this.LayerLoader = false;
        this.Facilities = [];
        this.States = [];
        this.Commodities = [];
        this.Commodities2 = [];
        this.FuelType = [];
        this.Status = [];
        this.States2 = [];
        this.PowerPlant_States = [];
        this.substation_States = [];
        this.TransmissionLine_States = [];
        this.Status2 = [];
        this.TransmissionLine_Status2 = [];
        this.PrimeMover = [];
        this.Voltage = [];
        this.Type = [];
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
        this.Treedatalist = [];
        this.TabEnum = Object.freeze({ "Facilities": "Facilities", "Pipelines": "Pipelines", "PowerPlants": "Power Plants", "Substations": "Substations", "TransmissionLines": "Transmission Lines" });
        this.activeTab = this.TabEnum.Facilities;
        this.searchFacilities = "";
        this.searchPowerPlants = '';
        this.searchTransmissionLines = '';
        this.searchSubstations = '';
        this.dropdownSettings = {};
        this.dropdownSettingsFacility = {};
        this.dropdownSettingsStates = {};
        this.searchPipelines = "";
        this.isTransmissionPipeline = false;
        this.isGatheringPipeline = false;
        this.isDistributionPipeline = false;
        this.isMapsearchConnectionPipeline = false;
        this.dataResults = [
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
                        DBFProperties: this.AuthServices.GetSystemParameterValue("PipelinesSearchDBFProperties"),
                        DetailPanelProperties: this.AuthServices.GetSystemParameterValue("PipelinesSearchDetailPanelProperties"),
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
                        DBFProperties: this.AuthServices.GetSystemParameterValue(""),
                        DetailPanelProperties: this.AuthServices.GetSystemParameterValue("FacilitiesSearchDetailPanelProperties"),
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
                        DBFProperties: this.AuthServices.GetSystemParameterValue(""),
                        DetailPanelProperties: this.AuthServices.GetSystemParameterValue("PowerPlantsSearchDetailPanelProperties"),
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
                        DBFProperties: this.AuthServices.GetSystemParameterValue(""),
                        DetailPanelProperties: this.AuthServices.GetSystemParameterValue("SubstationsSearchDetailPanelProperties"),
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
                        DBFProperties: this.AuthServices.GetSystemParameterValue(""),
                        DetailPanelProperties: this.AuthServices.GetSystemParameterValue("TransmissionLinesSearchDetailPanelProperties"),
                        // DataSetID: parseInt("20000" + 4),
                        DataSetID: 922,
                        isEnergyLayer: true,
                        EnergyLayerDisplayName: "Transmission Lines search results",
                        EnergyLayerID: 922
                    }],
            },
        ];
        setTimeout(function () { return _this.CondensedComponent = injector.get(layouts_1.CondensedComponent); });
    }
    AssetLookupComponent.prototype.ngOnInit = function () {
        var _this = this;
        //this.FillStaticData();
        if (this.States.length == 0) {
            if (!this.AuthServices.ShowOilAndGasUIBasedOnRole() && !this.AuthServices.ShowElectricPowerUIBasedOnRole()) {
            }
            else {
                this.GetAssetData();
                this.GetPipelineandAllTabData();
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
        this._permissionsSubscription = this.MapServiceService.sitePermissions.subscribe(function (data) {
            if (data)
                _this.ShowWidgetBasedOnRole();
        });
    };
    AssetLookupComponent.prototype.ngOnDestroy = function () {
        if (this._permissionsSubscription)
            this._permissionsSubscription.unsubscribe();
    };
    // Start Facilities
    AssetLookupComponent.prototype.GetAssetData = function () {
        var _this = this;
        this.LayerLoader = true;
        this.httpRequestService._NodeGetAssetLookupData().subscribe(function (data) {
            if (data._Issuccess) {
                var jsonData = data;
                _this.AllFacilitiesData = jsonData;
                _this.Facilities = [];
                if (jsonData.FacilityData && jsonData.FacilityData.length > 0) {
                    for (var f = 0; f < jsonData.FacilityData.length; f++) {
                        _this.Facilities.push({ 'item_id': (f + 1), 'item_text': jsonData.FacilityData[f].FACTYPE.trim() });
                    }
                }
                _this.FillFacilityComodityandstate(jsonData.AllComodity, jsonData.AllState);
            }
            _this.LayerLoader = false;
        }, function (error) {
            console.log(error);
            _this.LayerLoader = false;
        });
    };
    AssetLookupComponent.prototype.FillFacilityComodityandstate = function (ComodityList, StateList, FACTypeListData) {
        if (FACTypeListData === void 0) { FACTypeListData = []; }
        if (ComodityList && ComodityList.length > 0) {
            this.Commodities = [];
            this.selectedCommoditiesFL = [];
            ComodityList = _.sortBy(ComodityList);
            for (var c = 0; c < ComodityList.length; c++) {
                this.Commodities.push({ 'item_id': (c + 1), 'item_text': ComodityList[c].trim() });
            }
        }
        if (StateList && StateList.length > 0) {
            this.States = [];
            this.selectedStatesFL = [];
            StateList = _.sortBy(StateList);
            for (var s = 0; s < StateList.length; s++) {
                if (StateList[s].trim()) {
                    this.States.push({ 'item_id': (s + 1), 'item_text': StateList[s].trim() });
                }
            }
        }
        if (FACTypeListData && FACTypeListData.length > 0) {
            this.Facilities = [];
            FACTypeListData = _.sortBy(FACTypeListData);
            for (var f = 0; f < FACTypeListData.length; f++) {
                this.Facilities.push({ 'item_id': (f + 1), 'item_text': FACTypeListData[f].trim() });
            }
        }
    };
    AssetLookupComponent.prototype.ClearFilters = function () {
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
    };
    AssetLookupComponent.prototype.OnItemSelectCommodity = function (Item) {
        var _this = this;
        this.selectedCommoditiesFL;
        this.selectedStatesFL;
        this.States;
        var FACCommodity = "";
        var FACState = "";
        var FACType = "";
        if (this.selectedCommoditiesFL.length == 0 && this.selectedStatesFL.length == 0 && this.selectedFacilities.length > 0) {
            for (var i = 0; i < this.AllFacilitiesData.FacilityData.length; i++) {
                var FactypeData = this.AllFacilitiesData.FacilityData[i];
                var selectedval = this.selectedFacilities.filter(function (factyp) {
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
                var FACCommodityList = FACCommodity.split(',');
                var FACStateList = FACState.split(',');
                var FACCommodityListData_1 = [];
                FACCommodityList.forEach(function (c) {
                    if (c.trim())
                        FACCommodityListData_1.push(c.trim());
                });
                var FACStateListData_1 = [];
                FACStateList.forEach(function (s) {
                    if (s.trim())
                        FACStateListData_1.push(s.trim());
                });
                FACCommodityListData_1 = _.uniq(FACCommodityListData_1);
                FACStateListData_1 = _.uniq(FACStateListData_1);
                this.FillFacilityComodityandstate(FACCommodityListData_1, FACStateListData_1);
            }
        }
        else if (this.selectedStatesFL.length > 0 && this.selectedCommoditiesFL.length == 0 && this.selectedFacilities.length == 0) {
            var selectedStateval = "";
            this.selectedStatesFL.forEach(function (e) {
                if (selectedStateval) {
                    selectedStateval = e.item_text;
                }
                else {
                    selectedStateval += "," + e.item_text;
                }
            });
            if (selectedStateval) {
                this.httpRequestService._NodeGetTypeandComoditybasedonStateData(selectedStateval).subscribe(function (data) {
                    var Jsondata = data;
                    if (Jsondata._Issuccess) {
                        _this.FillFacilityComodityandstate(Jsondata.Commodity, [], Jsondata.FacilittyType);
                    }
                }, function (error) {
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
            var Comodity_1 = '';
            var Factype_1 = '';
            this.selectedCommoditiesFL.forEach(function (commo) {
                if (Comodity_1) {
                    Comodity_1 += "," + commo.item_text.trim();
                }
                else {
                    Comodity_1 = commo.item_text.trim();
                }
            });
            this.selectedFacilities.forEach(function (factyp) {
                if (Factype_1) {
                    Factype_1 += "," + factyp.item_text.trim();
                }
                else {
                    Factype_1 = factyp.item_text.trim();
                }
            });
            if (Factype_1 && Comodity_1) {
                this.httpRequestService._NodeGetComodityStateData(Comodity_1, Factype_1).subscribe(function (data) {
                    var StateData = data;
                    if (StateData._Issuccess) {
                        if (StateData.commoditystate) {
                            _this.FillFacilityComodityandstate([], StateData.commoditystate);
                        }
                    }
                }, function (error) {
                    console.log(error);
                });
            }
        }
        else if (this.selectedCommoditiesFL.length == 0 && this.selectedFacilities.length > 0 && this.selectedStatesFL.length > 0) {
            var State_1 = '';
            var Factype_2 = '';
            this.selectedStatesFL.forEach(function (state) {
                if (State_1) {
                    State_1 += "," + state.item_text.trim();
                }
                else {
                    State_1 = state.item_text.trim();
                }
            });
            this.selectedFacilities.forEach(function (factyp) {
                if (Factype_2) {
                    Factype_2 += "," + factyp.item_text.trim();
                }
                else {
                    Factype_2 = factyp.item_text.trim();
                }
            });
            if (Factype_2 && State_1) {
                this.httpRequestService._NodeGetCommoditybasedonStateandTypeData(State_1, Factype_2).subscribe(function (data) {
                    var StateData = data;
                    if (StateData._Issuccess) {
                        if (StateData.Commodity) {
                            _this.FillFacilityComodityandstate(StateData.Commodity, []);
                        }
                    }
                }, function (error) {
                    console.log(error);
                });
            }
        }
        else if (this.selectedStatesFL.length > 0 && this.selectedCommoditiesFL.length > 0 && this.selectedFacilities.length == 0) {
            var State_2 = '';
            var Commodity_1 = '';
            this.selectedStatesFL.forEach(function (state) {
                if (State_2) {
                    State_2 += "," + state.item_text.trim();
                }
                else {
                    State_2 = state.item_text.trim();
                }
            });
            this.selectedCommoditiesFL.forEach(function (commo) {
                if (Commodity_1) {
                    Commodity_1 += "," + commo.item_text.trim();
                }
                else {
                    Commodity_1 = commo.item_text.trim();
                }
            });
            if (Commodity_1 && State_2) {
                this.httpRequestService._NodeGetGetFactypeBasedonStateandCommodity(State_2, Commodity_1).subscribe(function (data) {
                    var StateData = data;
                    if (StateData._Issuccess) {
                        if (StateData.Factype) {
                            _this.FillFacilityComodityandstate([], [], StateData.Factype);
                        }
                    }
                }, function (error) {
                    console.log(error);
                });
            }
        }
        else if (this.selectedCommoditiesFL.length == 0 && this.selectedStatesFL.length == 0 && this.selectedFacilities.length == 0) {
            var AllFactype = [];
            this.AllFacilitiesData.FacilityData.forEach(function (factyp) {
                AllFactype.push(factyp.FACTYPE);
            });
            this.FillFacilityComodityandstate(this.AllFacilitiesData.AllComodity, this.AllFacilitiesData.AllState, AllFactype);
        }
    };
    // End Facilities Tab 
    // Start Pipeline 
    AssetLookupComponent.prototype.GetPipelineandAllTabData = function () {
        var _this = this;
        this.LayerLoader = true;
        this.httpRequestService._NodeGetPiplelineandothertabData().subscribe(function (data) {
            if (data._Issuccess) {
                var jsonData = data;
                _this.AllPipleLineData = jsonData;
                _this.FillPipelineCommodity_StateandStatus(jsonData.AllCommodity, jsonData.Allstate, jsonData.AllStatus);
                _this.FillPowerPlant_primefuel_primemoverandState_name(jsonData.PowerPlant_primefuel, jsonData.PowerPlant_primemover, jsonData.powerplant_State_name);
                _this.FillSubstation_Status_SubtypeandState_name(jsonData.substations_Status, jsonData.substations_Subtype, jsonData.substations_State_Name);
                _this.FillTransmissionLine_Status_volt_catandState_name(jsonData.powerline_status, jsonData.powerline_volt_cat, jsonData.powerline_state_name);
            }
            _this.LayerLoader = false;
        }, function (error) {
            console.log(error);
            _this.LayerLoader = false;
        });
    };
    AssetLookupComponent.prototype.FillPipelineCommodity_StateandStatus = function (ComodityList, StateList, StatusList) {
        if (ComodityList && ComodityList.length > 0) {
            this.Commodities2 = [];
            this.selectedCommoditiesPL = [];
            ComodityList = _.sortBy(ComodityList);
            for (var c = 0; c < ComodityList.length; c++) {
                this.Commodities2.push({ 'item_id': (c + 1), 'item_text': ComodityList[c].trim() });
            }
        }
        if (StateList && StateList.length > 0) {
            this.States2 = [];
            this.selectedStatesPL = [];
            StateList = _.sortBy(StateList);
            for (var s = 0; s < StateList.length; s++) {
                if (StateList[s].trim()) {
                    this.States2.push({ 'item_id': (s + 1), 'item_text': StateList[s].trim() });
                }
            }
        }
        if (StatusList && StatusList.length > 0) {
            this.Status = [];
            this.selectedStatusPL = [];
            StatusList = _.sortBy(StatusList);
            for (var f = 0; f < StatusList.length; f++) {
                this.Status.push({ 'item_id': (f + 1), 'item_text': StatusList[f].trim() });
            }
        }
    };
    AssetLookupComponent.prototype.onPipelineItemSelect = function (Item) {
        var _this = this;
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
            this.selectedCommoditiesPL.forEach(function (c) {
                if (filterCommodity) {
                    filterCommodity += "," + c.item_text.trim();
                }
                else {
                    filterCommodity = c.item_text.trim();
                }
            });
        }
        if (this.selectedStatesPL.length > 0) {
            this.selectedStatesPL.forEach(function (s) {
                if (filterstate) {
                    filterstate += "," + s.item_text.trim();
                }
                else {
                    filterstate = s.item_text.trim();
                }
            });
        }
        if (this.selectedStatusPL.length > 0) {
            this.selectedStatusPL.forEach(function (s) {
                if (filterStatus) {
                    filterStatus += "," + s.item_text.trim();
                }
                else {
                    filterStatus = s.item_text.trim();
                }
            });
        }
        if (this.selectedCommoditiesPL.length == 0 && this.selectedStatesPL.length == 0 && this.selectedStatusPL.length == 0) {
            this.FillPipelineCommodity_StateandStatus(this.AllPipleLineData.AllCommodity, this.AllPipleLineData.Allstate, this.AllPipleLineData.AllStatus);
        }
        else {
            this.httpRequestService._NodeGetPiplelineDatabasedonFiltervalue(filterCommodity, filterstate, filterStatus).subscribe(function (data) {
                var Jsondata = data;
                if (Jsondata._Issuccess) {
                    _this.FillPipelineCommodity_StateandStatus(Jsondata.Commodity, Jsondata.state, Jsondata.Status);
                }
            }, function (error) {
                console.log(error);
            });
        }
    };
    // End Pipeline 
    //Power Plant
    AssetLookupComponent.prototype.FillPowerPlant_primefuel_primemoverandState_name = function (PrimefuelList, PrimemoverList, StatenameList) {
        if (PrimefuelList && PrimefuelList.length > 0) {
            this.FuelType = [];
            this.selectedFuelTypes = [];
            PrimefuelList = _.sortBy(PrimefuelList);
            for (var c = 0; c < PrimefuelList.length; c++) {
                this.FuelType.push({ 'item_id': (c + 1), 'item_text': PrimefuelList[c].trim() });
            }
        }
        if (PrimemoverList && PrimemoverList.length > 0) {
            this.PrimeMover = [];
            this.selectedPrimeMover = [];
            PrimemoverList = _.sortBy(PrimemoverList);
            for (var s = 0; s < PrimemoverList.length; s++) {
                if (PrimemoverList[s].trim()) {
                    this.PrimeMover.push({ 'item_id': (s + 1), 'item_text': PrimemoverList[s].trim() });
                }
            }
        }
        if (StatenameList && StatenameList.length > 0) {
            this.PowerPlant_States = [];
            this.selectedStatesPP = [];
            StatenameList = _.sortBy(StatenameList);
            for (var f = 0; f < StatenameList.length; f++) {
                if (StatenameList[f].trim())
                    this.PowerPlant_States.push({ 'item_id': (f + 1), 'item_text': StatenameList[f].trim() });
            }
        }
    };
    AssetLookupComponent.prototype.onpowerplantItemselect = function (Item) {
        var _this = this;
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
            this.selectedFuelTypes.forEach(function (c) {
                if (filterfueltype) {
                    filterfueltype += "," + c.item_text.trim();
                }
                else {
                    filterfueltype = c.item_text.trim();
                }
            });
        }
        if (this.selectedStatesPP.length > 0) {
            this.selectedStatesPP.forEach(function (s) {
                if (filterstate) {
                    filterstate += "," + s.item_text.trim();
                }
                else {
                    filterstate = s.item_text.trim();
                }
            });
        }
        if (this.selectedPrimeMover.length > 0) {
            this.selectedPrimeMover.forEach(function (s) {
                if (filterPrimemover) {
                    filterPrimemover += "," + s.item_text.trim();
                }
                else {
                    filterPrimemover = s.item_text.trim();
                }
            });
        }
        if (this.selectedFuelTypes.length == 0 && this.selectedStatesPP.length == 0 && this.selectedPrimeMover.length == 0) {
            this.FillPowerPlant_primefuel_primemoverandState_name(this.AllPipleLineData.PowerPlant_primefuel, this.AllPipleLineData.PowerPlant_primemover, this.AllPipleLineData.powerplant_State_name);
        }
        else {
            this.httpRequestService._NodeGetPowerPlantDatabasedonFiltervalue(filterfueltype, filterPrimemover, filterstate).subscribe(function (data) {
                var Jsondata = data;
                if (Jsondata._Issuccess) {
                    _this.FillPowerPlant_primefuel_primemoverandState_name(Jsondata.Fueltype, Jsondata.PrimeMover, Jsondata.state);
                }
            }, function (error) {
                console.log(error);
            });
        }
    };
    // End PowerPlant
    //Start Substation
    AssetLookupComponent.prototype.FillSubstation_Status_SubtypeandState_name = function (StatusList, SubtypeList, StatenameList) {
        if (StatusList && StatusList.length > 0) {
            this.Status2 = [];
            this.selectedStatusSS = [];
            StatusList = _.sortBy(StatusList);
            for (var c = 0; c < StatusList.length; c++) {
                this.Status2.push({ 'item_id': (c + 1), 'item_text': StatusList[c].trim() });
            }
        }
        if (SubtypeList && SubtypeList.length > 0) {
            this.Type = [];
            this.selectedTypes = [];
            SubtypeList = _.sortBy(SubtypeList);
            for (var s = 0; s < SubtypeList.length; s++) {
                if (SubtypeList[s].trim()) {
                    this.Type.push({ 'item_id': (s + 1), 'item_text': SubtypeList[s].trim() });
                }
            }
        }
        if (StatenameList && StatenameList.length > 0) {
            this.substation_States = [];
            this.selectedStatesSS = [];
            StatenameList = _.sortBy(StatenameList);
            for (var f = 0; f < StatenameList.length; f++) {
                if (StatenameList[f].trim())
                    this.substation_States.push({ 'item_id': (f + 1), 'item_text': StatenameList[f].trim() });
            }
        }
    };
    AssetLookupComponent.prototype.onsubstationItemselect = function (Item) {
        var _this = this;
        this.Status2;
        this.selectedStatusSS;
        this.Type;
        this.selectedTypes;
        this.substation_States;
        this.selectedStatesSS;
        this.AllPipleLineData;
        var filterstatus = '';
        var filterstate = '';
        var filtertype = '';
        if (this.selectedStatusSS.length > 0) {
            this.selectedStatusSS.forEach(function (c) {
                if (filterstatus) {
                    filterstatus += "," + c.item_text.trim();
                }
                else {
                    filterstatus = c.item_text.trim();
                }
            });
        }
        if (this.selectedStatesSS.length > 0) {
            this.selectedStatesSS.forEach(function (s) {
                if (filterstate) {
                    filterstate += "," + s.item_text.trim();
                }
                else {
                    filterstate = s.item_text.trim();
                }
            });
        }
        if (this.selectedTypes.length > 0) {
            this.selectedTypes.forEach(function (s) {
                if (filtertype) {
                    filtertype += "," + s.item_text.trim();
                }
                else {
                    filtertype = s.item_text.trim();
                }
            });
        }
        if (this.selectedStatusSS.length == 0 && this.selectedStatesSS.length == 0 && this.selectedTypes.length == 0) {
            this.FillSubstation_Status_SubtypeandState_name(this.AllPipleLineData.substations_Status, this.AllPipleLineData.substations_Subtype, this.AllPipleLineData.substations_State_Name);
        }
        else {
            this.httpRequestService._NodeGetSubstationDatabasedonFiltervalue(filterstatus, filtertype, filterstate).subscribe(function (data) {
                var Jsondata = data;
                if (Jsondata._Issuccess) {
                    _this.FillSubstation_Status_SubtypeandState_name(Jsondata.Status, Jsondata.Subtype, Jsondata.state);
                }
            }, function (error) {
                console.log(error);
            });
        }
    };
    //End Substation
    //Start TransmissionLine
    AssetLookupComponent.prototype.FillTransmissionLine_Status_volt_catandState_name = function (StatusList, volt_catList, StatenameList) {
        if (StatusList && StatusList.length > 0) {
            this.TransmissionLine_Status2 = [];
            this.selectedStatusTL = [];
            StatusList = _.sortBy(StatusList);
            for (var c = 0; c < StatusList.length; c++) {
                this.TransmissionLine_Status2.push({ 'item_id': (c + 1), 'item_text': StatusList[c].trim() });
            }
        }
        if (volt_catList && volt_catList.length > 0) {
            this.Voltage = [];
            this.selectedVoltage = [];
            volt_catList = _.sortBy(volt_catList);
            for (var s = 0; s < volt_catList.length; s++) {
                if (volt_catList[s].trim()) {
                    this.Voltage.push({ 'item_id': (s + 1), 'item_text': volt_catList[s].trim() });
                }
            }
        }
        if (StatenameList && StatenameList.length > 0) {
            this.TransmissionLine_States = [];
            this.selectedStatesTL = [];
            StatenameList = _.sortBy(StatenameList);
            for (var f = 0; f < StatenameList.length; f++) {
                if (StatenameList[f].trim())
                    this.TransmissionLine_States.push({ 'item_id': (f + 1), 'item_text': StatenameList[f].trim() });
            }
        }
    };
    AssetLookupComponent.prototype.onTransmissionLineItemselect = function (Item) {
        var _this = this;
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
            this.selectedStatusTL.forEach(function (c) {
                if (filterstatus) {
                    filterstatus += "," + c.item_text.trim();
                }
                else {
                    filterstatus = c.item_text.trim();
                }
            });
        }
        if (this.selectedStatesTL.length > 0) {
            this.selectedStatesTL.forEach(function (s) {
                if (filterstate) {
                    filterstate += "," + s.item_text.trim();
                }
                else {
                    filterstate = s.item_text.trim();
                }
            });
        }
        if (this.selectedVoltage.length > 0) {
            this.selectedVoltage.forEach(function (s) {
                if (filterVoltage) {
                    filterVoltage += "," + s.item_text.trim();
                }
                else {
                    filterVoltage = s.item_text.trim();
                }
            });
        }
        if (this.selectedStatusTL.length == 0 && this.selectedStatesTL.length == 0 && this.selectedVoltage.length == 0) {
            this.FillTransmissionLine_Status_volt_catandState_name(this.AllPipleLineData.powerline_status, this.AllPipleLineData.powerline_volt_cat, this.AllPipleLineData.powerline_state_name);
        }
        else {
            this.httpRequestService._NodeGetTransmissionDatabasedonFiltervalue(filterstatus, filterVoltage, filterstate).subscribe(function (data) {
                var Jsondata = data;
                if (Jsondata._Issuccess) {
                    _this.FillTransmissionLine_Status_volt_catandState_name(Jsondata.Status, Jsondata.voltage, Jsondata.state);
                }
            }, function (error) {
                console.log(error);
            });
        }
    };
    //End TransmissionLine
    AssetLookupComponent.prototype.onItemSelect = function ($event) {
    };
    AssetLookupComponent.prototype.onSelectAll = function ($event) {
    };
    AssetLookupComponent.prototype.FillStaticData = function () {
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
    };
    AssetLookupComponent.prototype.ShowWidgetBasedOnRole = function () {
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
                var powerPlantsTab = document.getElementById('powerPlantsTabHeader');
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
                var facilityTab = document.getElementById('facilitiesTabHeader');
                if (facilityTab != null) {
                    facilityTab.click();
                }
            }
        }
    };
    AssetLookupComponent.prototype.SearchAssets = function () {
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
    };
    AssetLookupComponent.prototype.SetFacilitiesFilter = function () {
        var CurrentTab = this.TabEnum.Facilities;
        var selectedDataResult = [];
        this.dataResults.map(function (d) {
            if (d.DataName && d.DataName != '' && d.DataName != undefined && d.DataName.toLowerCase() == CurrentTab.toLowerCase()) {
                selectedDataResult.push(d);
            }
        });
        var temp = selectedDataResult[0].Displayname[0];
        var tempLayerObjPropObj = this.GetTempLayerObject(CurrentTab, temp);
        tempLayerObjPropObj.RepresentationType = "Point";
        tempLayerObjPropObj.IconType = "Storage";
        tempLayerObjPropObj.SizePercent = 50;
        tempLayerObjPropObj.StrokeThicknessPercent = 18;
        var filterValue = '';
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
    };
    AssetLookupComponent.prototype.setPipelinesFilter = function () {
        var CurrentTab = this.TabEnum.Pipelines;
        var selectedDataResult = [];
        this.dataResults.map(function (d) {
            if (d.DataName && d.DataName != '' && d.DataName != undefined && d.DataName.toLowerCase() == CurrentTab.toLowerCase()) {
                selectedDataResult.push(d);
            }
        });
        var temp = selectedDataResult[0].Displayname[0];
        var tempLayerObjPropObj = this.GetTempLayerObject(CurrentTab, temp);
        tempLayerObjPropObj.RepresentationType = "Line";
        tempLayerObjPropObj.IconType = "Line";
        tempLayerObjPropObj.SizePercent = 100;
        tempLayerObjPropObj.StrokeThicknessPercent = 5;
        var filterValue = '';
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
    };
    AssetLookupComponent.prototype.setPowerPlantFilter = function () {
        var CurrentTab = this.TabEnum.PowerPlants;
        var selectedDataResult = [];
        this.dataResults.map(function (d) {
            if (d.DataName && d.DataName != '' && d.DataName != undefined && d.DataName.toLowerCase() == CurrentTab.toLowerCase()) {
                selectedDataResult.push(d);
            }
        });
        var temp = selectedDataResult[0].Displayname[0];
        var tempLayerObjPropObj = this.GetTempLayerObject(CurrentTab, temp);
        tempLayerObjPropObj.RepresentationType = "Point";
        tempLayerObjPropObj.IconType = "Rectangle";
        tempLayerObjPropObj.SizePercent = 50;
        tempLayerObjPropObj.StrokeThicknessPercent = 5;
        var filterValue = '';
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
    };
    AssetLookupComponent.prototype.setSubstationsFilter = function () {
        var CurrentTab = this.TabEnum.Substations;
        var selectedDataResult = [];
        this.dataResults.map(function (d) {
            if (d.DataName && d.DataName != '' && d.DataName != undefined && d.DataName.toLowerCase() == CurrentTab.toLowerCase()) {
                selectedDataResult.push(d);
            }
        });
        var temp = selectedDataResult[0].Displayname[0];
        var tempLayerObjPropObj = this.GetTempLayerObject(CurrentTab, temp);
        tempLayerObjPropObj.RepresentationType = "Point";
        tempLayerObjPropObj.IconType = "Pentagram";
        tempLayerObjPropObj.SizePercent = 50;
        tempLayerObjPropObj.StrokeThicknessPercent = 5;
        var filterValue = '';
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
    };
    AssetLookupComponent.prototype.setTransmissionLines = function () {
        var CurrentTab = this.TabEnum.TransmissionLines;
        var selectedDataResult = [];
        this.dataResults.map(function (d) {
            if (d.DataName && d.DataName != '' && d.DataName != undefined && d.DataName.toLowerCase() == CurrentTab.toLowerCase()) {
                selectedDataResult.push(d);
            }
        });
        var temp = selectedDataResult[0].Displayname[0];
        var tempLayerObjPropObj = this.GetTempLayerObject(CurrentTab, temp);
        tempLayerObjPropObj.RepresentationType = "Line";
        tempLayerObjPropObj.IconType = "Line";
        tempLayerObjPropObj.SizePercent = 100;
        tempLayerObjPropObj.StrokeThicknessPercent = 5;
        var filterValue = '';
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
    };
    AssetLookupComponent.prototype.AddLayeronTempVariable = function (tempobj) {
        if (this.MapServiceService.LayerIndex.getValue()) {
            var currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
            tempobj["Layerindexval"] = currentIndexVal;
            this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
        }
        this.MapServiceService.temporaryLayer.push(tempobj);
    };
    AssetLookupComponent.prototype.RemovelayerFromTree = function (DatasetId) {
        var tempLayerTreeData = this.MapServiceService.TemporaryTreeNode.getValue();
        var facilitiesData = tempLayerTreeData.find(function (x) { return x.Id == DatasetId; });
        if (facilitiesData)
            this.utilityService.ActiveLayerData(DatasetId, 'RemovetemporaryTreeData');
        var dataToRemoveIndexes = [];
        var _loop_1 = function (i) {
            var treeItem = this_1.Treedatalist[i];
            if (treeItem.Id == DatasetId)
                return "continue";
            var item = tempLayerTreeData.find(function (y) { return y.Id == treeItem.Id; });
            if (!item) {
                dataToRemoveIndexes.push(i);
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.Treedatalist.length; i++) {
            _loop_1(i);
        }
        if (dataToRemoveIndexes.length > 0) {
            dataToRemoveIndexes.reverse();
            for (var i = 0; i < dataToRemoveIndexes.length; i++) {
                var index = dataToRemoveIndexes[i];
                this.Treedatalist.splice(index, 1);
            }
        }
    };
    AssetLookupComponent.prototype.getsingaleTree = function (tempobj) {
        var Tree = {
            Id: tempobj.DataSetID,
            Name: tempobj.DataSetName,
            activeCount: 0,
            IconUrl: environment_prod_1.environment.GetLayerIconURL + "/icongenerate/get/?Id=" + tempobj.DataSetID + "&URLType=CustomStyleIcon&FillColor=" + tempobj.FillColor + "&IconType=" + tempobj.IconType + "&StrokeColor=" + tempobj.StrokeColor + "&SizePercent=" + tempobj.SizePercent + "&StrokeThicknessPercent=" + tempobj.StrokeThicknessPercent + "&Opacity=" + tempobj.Opacity,
            IsChecked: true,
        };
        return Tree;
    };
    AssetLookupComponent.prototype.SetEqualOrFilterFromArray = function (fieldName, List, equalVal) {
        if (equalVal === void 0) { equalVal = '#EQUAL#'; }
        var filterVal = '';
        if (List && List.length > 0) {
            for (var _i = 0, List_1 = List; _i < List_1.length; _i++) {
                var item = List_1[_i];
                filterVal += fieldName + equalVal + item.item_text + "#OR#";
            }
        }
        return filterVal;
    };
    AssetLookupComponent.prototype.SetEaualOrFiterForSingleVal = function (fieldName, Value, ValueToCheck) {
        if (ValueToCheck === void 0) { ValueToCheck = true; }
        var filterValue = '';
        if (ValueToCheck)
            filterValue += fieldName + '#EQUAL#' + Value + '#OR#';
        return filterValue;
    };
    AssetLookupComponent.prototype.GetTempLayerObject = function (ActiveTab, temp) {
        var tempLayerObjPropObj = new layer_data_prop_1.tempLayerDataProp();
        var activeTab = ActiveTab;
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
        var TreeName = '';
        if (activeTab == this.TabEnum.Facilities && this.searchFacilities) {
            TreeName = activeTab + " - " + this.searchFacilities;
        }
        else if (activeTab == this.TabEnum.Pipelines && this.searchPipelines) {
            TreeName = activeTab + " - " + this.searchPipelines;
        }
        else if (activeTab == this.TabEnum.PowerPlants && this.searchPowerPlants) {
            TreeName = activeTab + " - " + this.searchPowerPlants;
        }
        else if (activeTab == this.TabEnum.Substations && this.searchSubstations) {
            TreeName = activeTab + " - " + this.searchSubstations;
        }
        else if (activeTab == this.TabEnum.TransmissionLines && this.searchTransmissionLines) {
            TreeName = activeTab + " - " + this.searchTransmissionLines;
        }
        else {
            TreeName = activeTab;
        }
        tempLayerObjPropObj.DataSetName = TreeName;
        tempLayerObjPropObj.Description = TreeName;
        tempLayerObjPropObj.Tags = TreeName;
        tempLayerObjPropObj.TreeStatus = "Individual";
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
        tempLayerObjPropObj.isEnergyLayer = temp.isEnergyLayer;
        tempLayerObjPropObj["DisplayName"] = temp.EnergyLayerDisplayName;
        tempLayerObjPropObj.EnergyLayerID = temp.EnergyLayerID;
        return tempLayerObjPropObj;
    };
    AssetLookupComponent.prototype.SetTree = function (temp, tempLayerObjPropObj) {
        this.RemovelayerFromTree(temp.DataSetID);
        this.AddLayeronTempVariable(tempLayerObjPropObj);
        var TreeIndex = this.Treedatalist.findIndex(function (x) { return x.Id == temp.DataSetID; });
        var temptreeNode = this.MapServiceService.TemporaryTreeNode.getValue();
        var _loop_2 = function (TempTreeNodeIndex) {
            var treenodeindex = this_2.Treedatalist.findIndex(function (x) { return x.Id == TempTreeNodeIndex.Id; });
            if (treenodeindex != -1)
                this_2.Treedatalist.splice(treenodeindex, 1);
        };
        var this_2 = this;
        for (var _i = 0, temptreeNode_1 = temptreeNode; _i < temptreeNode_1.length; _i++) {
            var TempTreeNodeIndex = temptreeNode_1[_i];
            _loop_2(TempTreeNodeIndex);
        }
        if (TreeIndex != -1)
            this.Treedatalist.splice(TreeIndex, 1);
        this.Treedatalist.push(this.getsingaleTree(tempLayerObjPropObj));
    };
    AssetLookupComponent = __decorate([
        core_1.Component({
            selector: 'app-asset-lookup',
            templateUrl: './asset-lookup.component.html',
            styleUrls: ['./asset-lookup.component.scss']
        }),
        __metadata("design:paramtypes", [dashboard_service_1.DashboardService,
            auth_service_1.AuthenticationService,
            all_http_request_service_1.HttpRequestService,
            map_service_service_1.MapServiceService,
            Utility_service_1.UtilityService,
            localdata_service_1.LocalDataService,
            core_1.Injector])
    ], AssetLookupComponent);
    return AssetLookupComponent;
}());
exports.AssetLookupComponent = AssetLookupComponent;
//# sourceMappingURL=asset-lookup.component.js.map