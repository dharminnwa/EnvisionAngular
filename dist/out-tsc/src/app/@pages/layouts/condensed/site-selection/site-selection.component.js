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
var ngx_bootstrap_1 = require("ngx-bootstrap");
var auth_service_1 = require("../../../../services/auth.service");
var dashboard_service_1 = require("../../../../services/dashboard.service");
var map_service_service_1 = require("../../../../services/map-service.service");
var Utility_service_1 = require("../../../../services/Utility.service");
var all_http_request_service_1 = require("../../../../services/all-http-request.service");
var condensed_component_1 = require("../../../../../app/@pages/layouts/condensed/condensed.component");
var ParcelBufferTool_service_1 = require("../../../../services/ParcelBufferTool.service");
var forms_1 = require("@angular/forms");
var localdata_service_1 = require("../../../../services/localdata.service");
var SiteSelectionComponent = (function () {
    function SiteSelectionComponent(injector, bsModalRef, authServices, dashboardService, MapServiceService, UtilityService, httpService, ParcelBufferToolService, formBuilder, httpRequestService, LocalDataService) {
        var _this = this;
        this.injector = injector;
        this.bsModalRef = bsModalRef;
        this.authServices = authServices;
        this.dashboardService = dashboardService;
        this.MapServiceService = MapServiceService;
        this.UtilityService = UtilityService;
        this.httpService = httpService;
        this.ParcelBufferToolService = ParcelBufferToolService;
        this.formBuilder = formBuilder;
        this.httpRequestService = httpRequestService;
        this.LocalDataService = LocalDataService;
        this.LayerLoader = false;
        this.States = [];
        this.Counties = [];
        this.PropertyTypes = [];
        this.selectedState = [];
        this.selectedCounty = [];
        this.selectedProperties = [];
        this.ddSettingsSingle = {};
        this.ddSettingsMulty = {};
        this.StateModelList = [];
        this.isDisabledSiteCounty = true;
        this.isDisabledSiteProperty = true;
        this.isDisabled_btnCreateLayer = true;
        this.sizeOfPropertyFrom = '0';
        this.sizeOfPropertyTo = '5';
        this.ParcelData = {
            DataSetID: "200015",
            DataSetBoundryID: "200016",
        };
        this.energyData = {
            FloodHazardZonesTablePrefix: "s_fld_haz_ar_fema_",
            WetlandsTablePostfix: "_wetlands",
            TransmissionLineTable: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpowerlines : '',
            SubstationTable: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xsubstations : ''
        };
        this.isTransmissonLines = true;
        this.isSubstations = true;
        this.targetSelectAll = [];
        this.transmissionMiles = 3;
        this.substationMiles = 3;
        this.milesOptions = [0.5, 1, 2, 3];
        this.msgPointLayerCount = "";
        this.msgBoundriesLayerCount = "";
        this.controls = { sizeOfPropertyFrom: 0, sizeOfPropertyTo: 5 };
        this.selectedOptTransmission = 3;
        this.selectedOptSubstation = { value: 3, label: '3' };
        this.optionsTrans = [
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
        ];
        this.optionsSubstation = [
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
        ];
        this.chkTransmissionLines = [
            { name: '< 69 kv', value: '<69 kV', isChecked: true },
            { name: '69-138 kv', value: '69-138 kV', isChecked: true },
            { name: '139-230 kv', value: '139-230 kV', isChecked: true },
            { name: '231-345 kv', value: '231-345 kV', isChecked: true },
            { name: '346-500 kv', value: '346-500 kV', isChecked: true },
            { name: '501-765 kv', value: '501-765 kV', isChecked: true },
        ];
        this.isMinimizedTool = false;
        setTimeout(function () { return _this.CondensedComponent = injector.get(condensed_component_1.CondensedComponent); });
    }
    SiteSelectionComponent.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () {
            var modalDiv = document.getElementsByClassName('siteSelection')[0];
            var modalElement = $(modalDiv).parents('.modal');
            $(modalElement).attr('id', 'siteSelection');
            _this.MapServiceService.SetModal('siteSelection');
            _this.Draggable();
        }, 100);
        this.siteSelectionForm = this.formBuilder.group({
            ddlState: [''],
            ddlCounty: [''],
            ddlProperty: [''],
            txtSizeOfPropertyFrom: ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern('^[0-9.]*$')])],
            txtSizeOfPropertyTo: ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern('^[0-9.]*$')])],
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
            for (var i = 0; i < this.StateModelList.length; i++) {
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
            this.msgPointLayerCount = this.MapServiceService.siteSelectionData.loadedToolsData.msgPointLayerCount;
        }
    };
    Object.defineProperty(SiteSelectionComponent.prototype, "siteSelection", {
        get: function () { return this.siteSelectionForm.controls; },
        enumerable: true,
        configurable: true
    });
    SiteSelectionComponent.prototype.GetSiteStateData = function () {
        var _this = this;
        this.LayerLoader = true;
        var UserId = this.authServices.getLoggedinUserId();
        this.httpService._NodeGetParcelStates(UserId).subscribe(function (data) {
            if (data._Issuccess && data.parcelStateData.length > 0) {
                var jsonData = data.parcelStateData;
                _this.States = [];
                _this.StateModelList = jsonData;
                for (var i = 0; i < jsonData.length; i++) {
                    _this.States.push({ 'item_id': jsonData[i].ID, 'item_text': jsonData[i].StateName });
                }
                _this.MapServiceService.setParcelStates(_this.StateModelList);
            }
            _this.LayerLoader = false;
        }, function (error) {
            console.log(error);
            _this.LayerLoader = false;
        });
    };
    SiteSelectionComponent.prototype.Draggable = function () {
        setTimeout(function () {
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
        }, 10);
    };
    SiteSelectionComponent.prototype.onStateChange = function () {
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
            var selectedItem_1 = this.selectedState[0];
            var StateModel = this.StateModelList.filter(function (m) { return m.ID === selectedItem_1.item_id; });
            if (StateModel) {
                var cts = StateModel[0].counties;
                this.Counties = [];
                this.selectedCounty = [];
                if (cts && cts.length > 0) {
                    cts.sort();
                    for (var _i = 0, cts_1 = cts; _i < cts_1.length; _i++) {
                        var county = cts_1[_i];
                        if (county)
                            this.Counties.push({ 'item_id': county.ID, 'item_text': county.County, 'FIPS': county.FIPS, 'statecode': county.State });
                    }
                    if (this.isDisabledSiteCounty)
                        this.isDisabledSiteCounty = false;
                }
            }
        }
    };
    SiteSelectionComponent.prototype.onCountryChange = function (isCallingFromInit) {
        var _this = this;
        this.PropertyTypes = [];
        this.selectedProperties = [];
        if (!this.isDisabledSiteProperty)
            this.isDisabledSiteProperty = true;
        this.isDisabled_btnCreateLayer = true;
        if (this.selectedCounty.length > 0) {
            var selectedCountyItem_1 = this.selectedCounty[0];
            var filterCountyItem = this.Counties.filter(function (pe) { return pe.item_id === selectedCountyItem_1.item_id; })[0];
            if ((!filterCountyItem.FIPS.startsWith("0")) && filterCountyItem.FIPS <= 9999) {
                filterCountyItem.FIPS = '0' + filterCountyItem.FIPS;
            }
            var tableName = 'ParcelPoints_' + filterCountyItem.FIPS;
            this.httpService._NodeGetSiteSelectionProperties(tableName).subscribe(function (data) {
                if (data._Issuccess && data.PropertyTypes.length > 0) {
                    var propertyTypes = data.PropertyTypes;
                    _this.selectedProperties = [];
                    _this.PropertyTypes = [];
                    for (var i = 0; i < propertyTypes.length; i++) {
                        _this.PropertyTypes.push({ 'item_id': i, 'item_text': propertyTypes[i].USECDSTDSC });
                    }
                    if (_this.isDisabledSiteProperty)
                        _this.isDisabledSiteProperty = false;
                    if (isCallingFromInit && _this.MapServiceService.siteSelectionData.isLayerLoaded && _this.MapServiceService.siteSelectionData.loadedToolsData && _this.MapServiceService.siteSelectionData.loadedToolsData.ddlProperty) {
                        _this.selectedProperties = _this.MapServiceService.siteSelectionData.loadedToolsData.ddlProperty;
                        if (_this.selectedProperties.length > 0)
                            _this.onPropertyChange();
                    }
                }
            }, function (error) {
                console.log(error);
            });
        }
    };
    SiteSelectionComponent.prototype.onPropertyChange = function () {
        if (this.selectedProperties.length > 0) {
            if (this.isDisabled_btnCreateLayer)
                this.isDisabled_btnCreateLayer = false;
        }
        else {
            if (!this.isDisabled_btnCreateLayer)
                this.isDisabled_btnCreateLayer = true;
        }
    };
    SiteSelectionComponent.prototype.onPropertyAllChange = function (item) {
        if (item.length > 0) {
            if (this.isDisabled_btnCreateLayer)
                this.isDisabled_btnCreateLayer = false;
        }
        else {
            if (!this.isDisabled_btnCreateLayer)
                this.isDisabled_btnCreateLayer = true;
        }
    };
    SiteSelectionComponent.prototype.CreateLayer = function () {
        var _this = this;
        var Treedatalist = [];
        this.msgPointLayerCount = "";
        this.msgBoundriesLayerCount = "";
        var UserId = this.authServices.getLoggedinUserId();
        var selectedCounty = this.Counties.filter(function (pe) { return pe.item_id === _this.selectedCounty[0].item_id; })[0];
        var parcelCenterPointDisplayName = selectedCounty.statecode + " - " + selectedCounty.item_text + " Centerpoints";
        var parcelCenterPointTableName = "ParcelPoints_" + selectedCounty.FIPS;
        var parcelBoundariesDisplayName = selectedCounty.statecode + " - " + selectedCounty.item_text + " Boundaries";
        var parcelBoundariesTableName = "Parcels_" + selectedCounty.FIPS;
        var tempLayerCenterPointObjPropObj = this.CreateParcelTempLayerCenterPointObject(parcelCenterPointTableName, parcelCenterPointDisplayName);
        var tempLayerCenterPointObjPropObjFilterValue = this.GetCenterPointFilterValue(this.sizeOfPropertyFrom, this.sizeOfPropertyTo);
        var tempLayerBoundariesObjPropObj = this.CreateParcelTempLayerBoundriesObject(parcelBoundariesTableName, parcelBoundariesDisplayName);
        var tempLayerBoundariesObjPropObjFilterValue = this.GetBoundariesFilterValue(this.sizeOfPropertyFrom, this.sizeOfPropertyTo);
        var centerPointFilter = decodeURIComponent(this.MapServiceService.CreateCQL_Filter(tempLayerCenterPointObjPropObjFilterValue, ' and'));
        var boundariesFilter = decodeURIComponent(this.MapServiceService.CreateCQL_Filter(tempLayerBoundariesObjPropObjFilterValue, ' and'));
        var centerPointData = {
            energyLayer: tempLayerCenterPointObjPropObj,
            startIndex: 0,
            maxFeatures: 1,
            CQL_FILTER: centerPointFilter,
            sortBy: '',
            bbox: '',
            UserId: UserId
        };
        var boundriesData = {
            energyLayer: tempLayerBoundariesObjPropObj,
            startIndex: 0,
            maxFeatures: 1,
            CQL_FILTER: boundariesFilter,
            sortBy: '',
            bbox: '',
            UserId: UserId
        };
        var requestBodies = [
            centerPointData,
            boundriesData
        ];
        this.httpService._NodeGetParcelsCount(requestBodies).subscribe(function (data) {
            if (data.length == 2) {
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var result = data_1[_i];
                    if (result.TabelName.startsWith("ParcelPoints")) {
                        if (result.TotalFeature == 0)
                            _this.msgPointLayerCount = "0 results found for points.";
                    }
                    else {
                        if (result.TotalFeature == 0)
                            _this.msgBoundriesLayerCount = "0 results found for boundaries.";
                    }
                }
                _this.RemoveEnergyLayers();
                if (!_this.msgPointLayerCount && !_this.msgBoundriesLayerCount) {
                    _this.LoadEnergyLayers();
                    _this.ZoomMap();
                }
                var TreeList = _this.SetTree(_this.ParcelData, tempLayerCenterPointObjPropObj, tempLayerBoundariesObjPropObj);
                if (TreeList && TreeList.length > 0) {
                    TreeList.forEach(function (item) {
                        Treedatalist.push(item);
                    });
                }
                if (Treedatalist.length > 0) {
                    _this.CondensedComponent.SetTemporaryTreeNodeForWidget(Treedatalist);
                }
                _this.MapServiceService.siteSelectionData.isLayerLoaded = true;
                _this.SaveToolsData();
            }
        }, function (error) {
            console.error(error);
        });
        // setTimeout(() => {
        //   this.LoadParcelsLayers();
        // }, 2000);
        //
        var ssFilterData = this.GetFilterDataForLog();
        this.httpRequestService._NodeInsertSiteSelectionLogs(ssFilterData, UserId).subscribe(function (data) { });
    };
    SiteSelectionComponent.prototype.GetFilterDataForLog = function () {
        var stateName = this.selectedState[0].item_text;
        var countyName = this.selectedCounty[0].item_text;
        var size = this.sizeOfPropertyFrom + "-" + this.sizeOfPropertyTo;
        var propeties = this.selectedProperties;
        var selectedLines = this.chkTransmissionLines.filter(function (x) { return x.isChecked == true; });
        var filterLogData = {
            StateName: stateName,
            CountyName: countyName,
            Size: size,
            Propeties: propeties,
            SelectedLines: selectedLines,
            Substation: this.isSubstations
        };
        return filterLogData;
    };
    SiteSelectionComponent.prototype.SaveToolsData = function () {
        var toolData = {
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
        };
        this.MapServiceService.siteSelectionData.loadedToolsData = toolData;
    };
    SiteSelectionComponent.prototype.ClearToolsData = function () {
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
        var toolData = {
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
        };
        this.MapServiceService.siteSelectionData.loadedToolsData = toolData;
    };
    SiteSelectionComponent.prototype.ZoomMap = function () {
        var _this = this;
        var county = this.UtilityService.toTitleCase(this.selectedCounty[0].item_text);
        var stateCode = this.Counties.filter(function (pe) { return pe.item_id === _this.selectedCounty[0].item_id; })[0].statecode;
        var geocoder = new google.maps.Geocoder();
        var map = this.MapServiceService._mapdata.getValue();
        geocoder.geocode({ 'address': county + ", " + stateCode + ", USA" }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.fitBounds(results[0].geometry.viewport);
                map.setZoom(10);
            }
        });
    };
    SiteSelectionComponent.prototype.LoadParcelsLayers = function () {
        var _this = this;
        var Treedatalist = [];
        var selectedCounty = this.Counties.filter(function (pe) { return pe.item_id === _this.selectedCounty[0].item_id; })[0];
        var parcelCenterPointTableName = "ParcelPoints_" + selectedCounty.FIPS;
        var parcelCenterPointDisplayName = selectedCounty.statecode + " - " + selectedCounty.item_text + " Centerpoints";
        var tempLayerCenterPointObjPropObj = this.CreateParcelTempLayerCenterPointObject(parcelCenterPointTableName, parcelCenterPointDisplayName);
        tempLayerCenterPointObjPropObj.FilterValue = this.GetCenterPointFilterValue(this.sizeOfPropertyFrom, this.sizeOfPropertyTo);
        var parcelBoundariesTableName = "Parcels_" + selectedCounty.FIPS;
        var parcelBoundariesDisplayName = selectedCounty.statecode + " - " + selectedCounty.item_text + " Boundaries";
        var tempLayerBoundariesObjPropObj = this.CreateParcelTempLayerBoundriesObject(parcelBoundariesTableName, parcelBoundariesDisplayName);
        tempLayerBoundariesObjPropObj.FilterValue = this.GetBoundariesFilterValue(this.sizeOfPropertyFrom, this.sizeOfPropertyTo);
        var TreeList = this.SetTree(this.ParcelData, tempLayerCenterPointObjPropObj, tempLayerBoundariesObjPropObj);
        if (TreeList && TreeList.length > 0) {
            TreeList.forEach(function (item) {
                Treedatalist.push(item);
            });
        }
        if (Treedatalist.length > 0) {
            this.CondensedComponent.SetTemporaryTreeNodeForWidget(Treedatalist);
        }
    };
    SiteSelectionComponent.prototype.RemoveEnergyLayers = function () {
        var _this = this;
        if (this.MapServiceService.siteSelectionData.isLayerLoaded && this.MapServiceService.siteSelectionData.loadedEnergyLayerIds) {
            var _loop_1 = function (i) {
                var layerId = this_1.MapServiceService.siteSelectionData.loadedEnergyLayerIds[i];
                var treeUI = this_1.MapServiceService._TreeUI.getValue();
                var EnergyLayerID = layerId + 'RemoveTreeData';
                var Removeexistnode = treeUI.treeModel.getNodeById(layerId);
                if (Removeexistnode.data["children"]) {
                    if (Removeexistnode.data["children"].length > 1) {
                        var _loop_2 = function (removelayer) {
                            setTimeout(function () {
                                EnergyLayerID = removelayer.Id + 'RemoveTreeData';
                                var element = document.getElementById(EnergyLayerID);
                                element.click();
                                if (i == _this.MapServiceService.siteSelectionData.loadedEnergyLayerIds.length - 1)
                                    _this.MapServiceService.siteSelectionData.loadedEnergyLayerIds = null;
                            }, 200);
                        };
                        for (var _i = 0, _a = Removeexistnode.data["children"]; _i < _a.length; _i++) {
                            var removelayer = _a[_i];
                            _loop_2(removelayer);
                        }
                    }
                    else {
                        setTimeout(function () {
                            var element = document.getElementById(EnergyLayerID);
                            element.click();
                            if (i == _this.MapServiceService.siteSelectionData.loadedEnergyLayerIds.length - 1)
                                _this.MapServiceService.siteSelectionData.loadedEnergyLayerIds = null;
                        }, 200);
                    }
                }
                else {
                    setTimeout(function () {
                        var element = document.getElementById(EnergyLayerID);
                        element.click();
                        if (i == _this.MapServiceService.siteSelectionData.loadedEnergyLayerIds.length - 1)
                            _this.MapServiceService.siteSelectionData.loadedEnergyLayerIds = null;
                    }, 200);
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.MapServiceService.siteSelectionData.loadedEnergyLayerIds.length; i++) {
                _loop_1(i);
            }
        }
    };
    SiteSelectionComponent.prototype.LoadEnergyLayers = function () {
        var _this = this;
        this.MapServiceService.siteSelectionData.isLayerLoaded = false;
        this.MapServiceService.siteSelectionData.loadedEnergyLayerIds = null;
        var stateName = this.selectedState[0].item_text.toLowerCase();
        var stateCode = this.Counties.filter(function (pe) { return pe.item_id === _this.selectedCounty[0].item_id; })[0].statecode.toLowerCase();
        var floodHazardZonesLayerTableName = this.energyData.FloodHazardZonesTablePrefix + stateName;
        var wetlandsLayerTableName = stateCode + this.energyData.WetlandsTablePostfix;
        var tableNames = [];
        if (this.isSubstations)
            tableNames.push(this.energyData.SubstationTable);
        if (this.isTransmissonLines)
            tableNames.push(this.energyData.TransmissionLineTable);
        tableNames.push(wetlandsLayerTableName);
        tableNames.push(floodHazardZonesLayerTableName);
        this.httpRequestService._NodeGetEnergyLayersIDS(tableNames).subscribe(function (data) {
            var energyLayerIds = [];
            if (_this.isTransmissonLines)
                energyLayerIds.push(data.EnergyLayersIDS.filter(function (m) { return m.TableName === _this.energyData.TransmissionLineTable; })[0].EnergyLayerID);
            if (_this.isSubstations)
                energyLayerIds.push(data.EnergyLayersIDS.filter(function (m) { return m.TableName === _this.energyData.SubstationTable; })[0].EnergyLayerID);
            var wetlandsLayers = data.EnergyLayersIDS.filter(function (m) { return m.TableName.indexOf(wetlandsLayerTableName) > -1; });
            for (var _i = 0, wetlandsLayers_1 = wetlandsLayers; _i < wetlandsLayers_1.length; _i++) {
                var layer = wetlandsLayers_1[_i];
                energyLayerIds.push(layer.EnergyLayerID);
            }
            energyLayerIds.push(data.EnergyLayersIDS.filter(function (m) { return m.TableName === floodHazardZonesLayerTableName; })[0].EnergyLayerID);
            for (var _a = 0, energyLayerIds_1 = energyLayerIds; _a < energyLayerIds_1.length; _a++) {
                var layerId = energyLayerIds_1[_a];
                _this.CondensedComponent.GetTreeData(layerId, [], [], 0, true);
            }
            _this.MapServiceService.siteSelectionData.loadedEnergyLayerIds = energyLayerIds;
        }, function (error) {
            console.log(error);
        });
    };
    SiteSelectionComponent.prototype.CreateParcelTempLayerCenterPointObject = function (tableName, displayName) {
        var tempLayerObjPropObj = this.ParcelBufferToolService.GetCommonParcelTempObj();
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
    };
    SiteSelectionComponent.prototype.CreateParcelTempLayerBoundriesObject = function (tableName, displayName) {
        var tempLayerObjPropObj = this.ParcelBufferToolService.GetCommonParcelTempObj();
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
    };
    SiteSelectionComponent.prototype.SetTree = function (temp, tempLayerObjPropObj, tempLayerBoundryObjPropObj) {
        this.ParcelBufferToolService.RemovelayerFromTree(temp.DataSetID, temp.DataSetBoundryID);
        this.ParcelBufferToolService.AddLayeronTempVariable(tempLayerObjPropObj, tempLayerBoundryObjPropObj);
        var Treedatalist = [];
        Treedatalist.push(this.ParcelBufferToolService.getsingaleTree(tempLayerObjPropObj));
        Treedatalist.push(this.ParcelBufferToolService.getsingaleTree(tempLayerBoundryObjPropObj));
        return Treedatalist;
    };
    SiteSelectionComponent.prototype.ClearFilters = function () {
        this.selectedState = [];
        this.selectedCounty = [];
        this.Counties = [];
        this.PropertyTypes = [];
        this.isDisabledSiteCounty = true;
        this.isDisabledSiteProperty = true;
    };
    SiteSelectionComponent.prototype.GetPropertyTypeFilterValue = function (filterTotalLength) {
        var filter = "";
        if (this.selectedProperties.length > 0) {
            if (this.selectedProperties.length != this.PropertyTypes.length) {
                for (var _i = 0, _a = this.selectedProperties; _i < _a.length; _i++) {
                    var propertyType = _a[_i];
                    if (propertyType.item_text) {
                        var newFilter = "USECDSTDSC=" + propertyType.item_text + "#OR#";
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
    };
    SiteSelectionComponent.prototype.GetLOTSZARUNTFilterValue = function () {
        var filter = "";
        var LOTSZARUNTFilterValue = "AC";
        filter = "LOTSZARUNT=" + LOTSZARUNTFilterValue;
        return filter;
    };
    SiteSelectionComponent.prototype.GetLOTSZARNUMFilterValue = function (fromValue, toValue) {
        var filter = "";
        filter += "LOTSZARNUM >= " + fromValue + "; LOTSZARNUM<=" + toValue;
        return filter;
    };
    SiteSelectionComponent.prototype.GetTransmissionLineAndSubstationFilterValue = function () {
        var filter = "";
        var stateName = '';
        if (this.selectedState.length == 1)
            stateName = this.UtilityService.toTitleCase(this.selectedState[0].item_text);
        var county = '';
        if (this.selectedCounty.length == 1)
            county = this.UtilityService.toTitleCase(this.selectedCounty[0].item_text);
        var transmissionRadius = this.transmissionMiles * 1609.34;
        var substationRadius = this.substationMiles * 1609.34;
        if (this.isTransmissonLines) {
            var selectedLine_1 = [];
            this.chkTransmissionLines.map(function (e) {
                if (e.isChecked)
                    selectedLine_1.push(e);
            });
            if (selectedLine_1.length > 0) {
                if (selectedLine_1.length == 6) {
                    filter += "DWITHIN(the_geom, collectGeometries(queryCollection('BaseMaps:" + this.energyData.TransmissionLineTable + "','the_geom','VOLT_CAT = ''DC'' OR STATE_NAME = ''" + stateName + "'' AND COUNTY = ''" + county + "''')), " + transmissionRadius + ", meters)";
                }
                else {
                    for (var _i = 0, selectedLine_2 = selectedLine_1; _i < selectedLine_2.length; _i++) {
                        var line = selectedLine_2[_i];
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
    };
    SiteSelectionComponent.prototype.GetCenterPointFilterValue = function (fromValue, toValue) {
        var filter = "";
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
    };
    SiteSelectionComponent.prototype.GetBoundariesFilterValue = function (fromValue, toValue) {
        var filter = "";
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
    };
    SiteSelectionComponent.prototype.DisableSearch = function () {
        if (!this.siteSelectionForm.valid && this.isDisabled_btnCreateLayer)
            return true;
        else if (this.siteSelectionForm.valid && !this.isDisabled_btnCreateLayer)
            return false;
        else if (!this.siteSelectionForm.valid && !this.isDisabled_btnCreateLayer)
            return true;
        else if (this.siteSelectionForm.valid && this.isDisabled_btnCreateLayer)
            return true;
    };
    SiteSelectionComponent.prototype.chkChildOptChange = function (line) {
        line.isChecked = !line.isChecked;
        var allCheckedValues = this.chkTransmissionLines.map(function (x) { return x.isChecked; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
        if (allCheckedValues.length == 1) {
            if (allCheckedValues[0] && !this.isTransmissonLines)
                this.isTransmissonLines = true;
            else if (!allCheckedValues[0] && this.isTransmissonLines)
                this.isTransmissonLines = false;
        }
        else {
            var allChkValues = this.chkTransmissionLines.map(function (x) { return x.isChecked; });
            var trueCount = 0;
            var falseCount = 0;
            for (var _i = 0, allChkValues_1 = allChkValues; _i < allChkValues_1.length; _i++) {
                var value = allChkValues_1[_i];
                if (value)
                    trueCount += 1;
                else
                    falseCount += 1;
            }
            if (trueCount == 1 && !this.isTransmissonLines)
                this.isTransmissonLines = true;
        }
    };
    SiteSelectionComponent.prototype.chkTransmissionChange = function () {
        this.isTransmissonLines = !this.isTransmissonLines;
        if (this.isTransmissonLines) {
            for (var _i = 0, _a = this.chkTransmissionLines; _i < _a.length; _i++) {
                var value = _a[_i];
                if (!value.isChecked)
                    value.isChecked = true;
            }
        }
        else {
            for (var _b = 0, _c = this.chkTransmissionLines; _b < _c.length; _b++) {
                var value = _c[_b];
                if (value.isChecked)
                    value.isChecked = false;
            }
        }
    };
    SiteSelectionComponent.prototype.ToggleMinimize = function () {
        this.isMinimizedTool = !this.isMinimizedTool;
        var elem = document.getElementsByClassName('siteSelection');
        if (elem && elem.length > 0) {
            if (this.isMinimizedTool == true) {
                elem[0].classList.add('minimizedTool');
            }
            else {
                elem[0].classList.remove('minimizedTool');
            }
        }
    };
    SiteSelectionComponent = __decorate([
        core_1.Component({
            selector: 'app-site-selection',
            templateUrl: './site-selection.component.html',
            styleUrls: ['./site-selection.component.scss']
        }),
        __metadata("design:paramtypes", [core_1.Injector,
            ngx_bootstrap_1.BsModalRef,
            auth_service_1.AuthenticationService,
            dashboard_service_1.DashboardService,
            map_service_service_1.MapServiceService,
            Utility_service_1.UtilityService,
            all_http_request_service_1.HttpRequestService,
            ParcelBufferTool_service_1.ParcelBufferToolService,
            forms_1.FormBuilder,
            all_http_request_service_1.HttpRequestService,
            localdata_service_1.LocalDataService])
    ], SiteSelectionComponent);
    return SiteSelectionComponent;
}());
exports.SiteSelectionComponent = SiteSelectionComponent;
//# sourceMappingURL=site-selection.component.js.map