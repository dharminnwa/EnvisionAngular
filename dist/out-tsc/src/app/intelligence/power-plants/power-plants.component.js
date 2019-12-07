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
var Intelligence_service_1 = require("../../services/Intelligence.service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var power_plantdetail_modal_component_1 = require("../power-plantdetail-modal/power-plantdetail-modal.component");
var operating_utilitydetail_modal_component_1 = require("../operating-utilitydetail-modal/operating-utilitydetail-modal.component");
var all_http_request_service_1 = require("../../services/all-http-request.service");
var environment_1 = require("../../../environments/environment");
var map_service_service_1 = require("../../services/map-service.service");
var PowerPlantsComponent = (function () {
    function PowerPlantsComponent(IntelligenceService, modalService, httpRequest, MapServiceService) {
        this.IntelligenceService = IntelligenceService;
        this.modalService = modalService;
        this.httpRequest = httpRequest;
        this.MapServiceService = MapServiceService;
        this.AllPowerPlantFilterOptionValue = {
            State: [],
            NERCRegion: [],
            PrimaryPlantFuel: [],
            Sector: [],
            ISO_RTO: [],
            selectedPowerPlantNameOrUtilityList: [],
        };
        this.selectedAllPowerPlantFilters = {
            State: [],
            NERCRegion: [],
            PrimaryPlantFuel: [],
            Sector: [],
            ISO_RTO: [],
        };
        this.selectedPowerPlantNameOrUtility = '';
        this.CapacityFrom = "0";
        this.CapacityTo = "99999";
        this.NetGenerationFrom = "0";
        this.NetGenerationTo = "99999";
        this.Regulated = true;
        this.NonRegulated = true;
        this.LoaderLink = environment_1.environment.ImagespreviewPath + "LayerLibraryLoader.gif";
        this.overlayLoadingTemplate = '<img src="' + this.LoaderLink + '" width="106px" />';
        this.overlayNoRowsTemplate = '<img src="' + this.LoaderLink + '" width="106px" />';
        this.PowerPlantrowData = [];
    }
    PowerPlantsComponent.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.GetTrasnmissionFilterOption();
            _this.GetSuggestivePowerplantData();
            _this.GeneratePowerPlantcolumns();
        }, 2000);
    };
    PowerPlantsComponent.prototype.GetTrasnmissionFilterOption = function () {
        var _this = this;
        this.httpRequest._NodeGetAllPowerPlantFilterOptions().subscribe(function (res) {
            var data = res.json();
            if (data._Issuccess) {
                var filteropList = data.FilterOptionData;
                _this.AllPowerPlantFilterOptionValue.State.push(filteropList.sates);
                _this.AllPowerPlantFilterOptionValue.NERCRegion.push(filteropList.nerc);
                _this.AllPowerPlantFilterOptionValue.PrimaryPlantFuel.push(filteropList.fuelType);
                _this.AllPowerPlantFilterOptionValue.Sector.push(filteropList.sector);
                _this.AllPowerPlantFilterOptionValue.ISO_RTO.push(filteropList.isO_RTO);
            }
        }, function (error) { console.log(error); });
    };
    PowerPlantsComponent.prototype.GetSuggestivePowerplantData = function () {
        var _this = this;
        this.httpRequest._NodeGetSuggestivePowerplantResults().subscribe(function (res) {
            var data = res.json();
            if (data._Issuccess) {
                var PowerPlantNameOrUtilityList = data.SuggestivePowerplantData;
                _this.AllPowerPlantFilterOptionValue.selectedPowerPlantNameOrUtilityList.push(PowerPlantNameOrUtilityList);
            }
        }, function (error) {
            console.log(error);
        });
    };
    PowerPlantsComponent.prototype.onPowerPlantGridReady = function (params) {
        var _this = this;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.onPowerPlantPageSizeChanged();
        if (!this.MapServiceService._PowerPlantData.getValue()) {
            this.httpRequest._NodeGetPowerPlantsData().subscribe(function (res) {
                var data = res.json();
                if (data._Issuccess) {
                    var List = data.PowerPlantsData;
                    _this.MapServiceService.setPowerPlantdata(List);
                    _this.PowerPlantrowData = List;
                    _this.AllPowerPlantListdata = List;
                }
            }, function (error) {
                console.log(error);
            });
        }
        else {
            this.PowerPlantrowData = this.MapServiceService._PowerPlantData.getValue();
            this.AllPowerPlantListdata = this.MapServiceService._PowerPlantData.getValue();
        }
    };
    PowerPlantsComponent.prototype.onPowerPlantPageSizeChanged = function () {
        var value = document.getElementById("PowerPlantpage-size")["value"];
        this.gridApi.paginationSetPageSize(Number(value));
    };
    PowerPlantsComponent.prototype.GeneratePowerPlantcolumns = function () {
        this.PowerPlantcolumnDefs = [
            {
                headerName: "powerID",
                field: "PowerID",
                width: 10,
                filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                hide: true,
            },
            {
                headerName: 'Operating Utility',
                field: 'OperatingUtility',
                width: 265,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                cellRenderer: function (params) {
                    var _object = params.data.OperatingUtility;
                    var id = params.data.PowerID;
                    return "<a style='color: blue;' href='javascript:void(0)' data-action-type='operatingUtility'>" + _object + "</a>";
                }
            },
            {
                headerName: "Power Plant",
                field: "PowerPlant",
                width: 265,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                //filterParams: { newRowsAction: "keep" },
                cellRenderer: function (params) {
                    var html = "";
                    var powerPlant = params.data.PowerPlant;
                    var cmpid = params.data.CompanyID;
                    if (powerPlant != null && cmpid != null) {
                        powerPlant = powerPlant.split('|');
                        for (var i = 0; i < powerPlant.length; i++) {
                            var cmpName = powerPlant[i];
                            var id = cmpid;
                            if (powerPlant.length > 0) {
                                id = parseInt(cmpid[i]);
                            }
                            if (html == "") {
                                html = "<div><a style='color: blue;' href='javascript:void(0)' data-action-type='powerPlant' data-action-id=" + id + " data-actione-Companyname=" + cmpName + ">" + cmpName + "</a>";
                            }
                            else {
                                html += " , " + "<a style='color: blue;' href='javascript:void(0)' data-action-type='powerPlant' data-action-id=" + id + " data-actione-Companyname=" + cmpName + ">" + cmpName + "</a>";
                            }
                        }
                        html += "</div>";
                    }
                    return html;
                }
            },
            {
                headerName: "State",
                field: "State",
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                width: 90,
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "NERC",
                field: "NERC",
                width: 90,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "ISO/RTO",
                field: "ISO_RTO",
                width: 110,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "Transmission Grid Owner",
                field: "TransmissionGridOwner",
                width: 265,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "Regulated (Y/N)",
                field: "Regulated",
                width: 150,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "Sector",
                field: "Sector",
                width: 120,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "Primary Fuel",
                field: "PrimaryFuel",
                width: 130,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "Capacity MW",
                field: "CapacityMW",
                width: 130,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            }
        ];
        this.paginationPageSize = 100;
        this.paginationNumberFormatter = function (params) {
            return params.value.toLocaleString();
        };
    };
    PowerPlantsComponent.prototype.ClearPowerPlantAllfilters = function () {
        this.selectedAllPowerPlantFilters.State.length = 0;
        this.selectedAllPowerPlantFilters.NERCRegion.length = 0;
        this.selectedAllPowerPlantFilters.PrimaryPlantFuel.length = 0;
        this.selectedAllPowerPlantFilters.Sector.length = 0;
        this.selectedAllPowerPlantFilters.ISO_RTO.length = 0;
        this.CapacityFrom = "0";
        this.CapacityTo = "99999";
        this.NetGenerationFrom = "0";
        this.NetGenerationTo = "99999";
        this.selectedPowerPlantNameOrUtility = "";
        this.resetPowerPlantGrid();
    };
    PowerPlantsComponent.prototype.resetPowerPlantGrid = function () {
        var _this = this;
        this.PowerPlantcolumnDefs = null;
        this.PowerPlantrowData = null;
        setTimeout(function () {
            _this.GeneratePowerPlantcolumns();
            _this.PowerPlantrowData = _this.AllPowerPlantListdata;
        }, 2000);
    };
    PowerPlantsComponent.prototype.onPowerPlantRowClicked = function (e) {
        if (e.event.target !== undefined) {
            var data = e.data;
            var actionType = e.event.target.getAttribute("data-action-type");
            switch (actionType) {
                case "powerPlant":
                    return this.OpenPowerPlantInnewtab(data.PowerID, data.CompanyID);
                case "operatingUtility":
                    return this.OpenOperatingUtilityInNewTab(data.CompanyID);
            }
        }
    };
    PowerPlantsComponent.prototype.OpenPowerPlantInnewtab = function (PowerID, CompanyID) {
        // let URL = "../../assets/PowerPlantdetail.html";
        // URL = URL + "?p=" + PowerID + "&c=" + CompanyID + "&Type=Power";
        // window.open(URL, '_blank', 'location=yes,height=600,width=1200,scrollbars=yes,status=yes');
        var URL = "/assets/PowerPlantdetail.html";
        URL = window.location.origin + URL + "?p=" + PowerID + "&c=" + CompanyID + "&Type=Power";
        var modalRef = this.modalService.open(power_plantdetail_modal_component_1.PowerPlantdetailModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "powerplant" });
        modalRef.componentInstance.URL = URL;
    };
    PowerPlantsComponent.prototype.OpenOperatingUtilityInNewTab = function (companyID) {
        // let URL = "../../assets/OperatingUtilitydetail.html";    
        // URL = URL + "?t=" + companyID;
        // window.open(URL, '_blank', 'location=yes,height=600,width=1200,scrollbars=yes,status=yes');
        var URL = "/assets/OperatingUtilitydetail.html";
        URL = window.location.origin + URL + "?t=" + companyID;
        var modalRef = this.modalService.open(operating_utilitydetail_modal_component_1.OperatingUtilitydetailModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "powerplant" });
        modalRef.componentInstance.URL = URL;
    };
    PowerPlantsComponent.prototype.searchPowerPlantNameOrUtility = function () {
        if (this.selectedPowerPlantNameOrUtility) {
            this.SearchPowerPlantData(this.selectedPowerPlantNameOrUtility);
        }
    };
    PowerPlantsComponent.prototype.SearchPowerPlantData = function (SearchPlantData) {
        var _this = this;
        var SearchPowerPlantData = this.AllPowerPlantListdata.filter(function (el) {
            if (el.PowerPlant != null && el.OperatingUtility != null) {
                if (el.PowerPlant.toLowerCase().indexOf(SearchPlantData.toLowerCase().trim()) > -1 || el.OperatingUtility.toLowerCase().indexOf(SearchPlantData.toLowerCase().trim()) > -1) {
                    return el;
                }
            }
        });
        this.PowerPlantrowData = null;
        setTimeout(function () {
            if (SearchPowerPlantData.length > 0) {
                _this.PowerPlantrowData = SearchPowerPlantData;
            }
            else {
                _this.PowerPlantrowData = _this.fillBlankPowerPlantRowinGrid();
            }
        }, 1000);
    };
    PowerPlantsComponent.prototype.fillBlankPowerPlantRowinGrid = function () {
        var PowerPlantKeys = {
            powerID: "",
            powerPlant: "",
            operatingUtility: "",
            companyID: ""
        };
        var data = [];
        data.push(PowerPlantKeys);
        return data;
    };
    PowerPlantsComponent.prototype.PowerPlantTypeheadOnSelect = function (event) {
        if (event) {
            var val = event.value;
            this.GetPowerPlantorUtility_basedon_search_Value(val);
        }
    };
    PowerPlantsComponent.prototype.GetPowerPlantorUtility_basedon_search_Value = function (Name) {
        if (Name) {
            var companyID = this.AllPowerPlantListdata.filter(function (el) {
                if (el.OperatingUtility == Name) {
                    return el.CompanyID;
                }
            });
            if (companyID.length > 0) {
                var CompanyID = companyID[0].companyID;
                this.OpenOperatingUtilityInNewTab(CompanyID);
                this.searchPowerPlantNameOrUtility();
            }
            else {
                var PowerID = this.AllPowerPlantListdata.filter(function (el) {
                    if (el.PowerPlant == Name) {
                        return el.PowerPlant;
                    }
                });
                if (PowerID.length > 0) {
                    var cmpnameid = void 0;
                    var powerPlant = PowerID[0].PowerPlant;
                    var powerID = PowerID[0].PowerID;
                    var company_ID = PowerID[0].CompanyID;
                    powerPlant = powerPlant.split('|');
                    for (var i = 0; i < powerPlant.length; i++) {
                        var cmpName = powerPlant[i];
                        var id = parseInt(PowerID);
                        if (cmpName == Name) {
                            cmpnameid = id;
                        }
                    }
                    if (cmpnameid) {
                        this.OpenPowerPlantInnewtab(powerID, company_ID);
                        this.searchPowerPlantNameOrUtility();
                    }
                    else {
                        this.searchPowerPlantNameOrUtility();
                    }
                }
                else {
                    this.searchPowerPlantNameOrUtility();
                }
            }
        }
    };
    PowerPlantsComponent.prototype.PowerPlantApplyfilter = function () {
        var _this = this;
        var CapacityRange = [], CapacityRangeFrom = parseFloat(this.CapacityFrom), CapacityRangeTo = parseFloat(this.CapacityTo);
        if (this.selectedAllPowerPlantFilters) {
            var State_1 = [];
            var NERCRegion_1 = [];
            var PrimaryPlantFuel_1 = [];
            var Sector_1 = [];
            var ISO_RTO_1 = [];
            var StateData = void 0;
            var NERCRegionData = void 0;
            var PrimaryPlantFuelData = void 0;
            var SectorData = void 0;
            var ISO_RTOData = void 0;
            for (var _i = 0, _a = this.selectedAllPowerPlantFilters.State; _i < _a.length; _i++) {
                var s = _a[_i];
                State_1.push(s.StateCode);
            }
            for (var _b = 0, _c = this.selectedAllPowerPlantFilters.NERCRegion; _b < _c.length; _b++) {
                var s = _c[_b];
                NERCRegion_1.push(s.NERCRegionCode);
            }
            for (var _d = 0, _e = this.selectedAllPowerPlantFilters.PrimaryPlantFuel; _d < _e.length; _d++) {
                var s = _e[_d];
                PrimaryPlantFuel_1.push(s.PrimaryFuel);
            }
            for (var _f = 0, _g = this.selectedAllPowerPlantFilters.Sector; _f < _g.length; _f++) {
                var s = _g[_f];
                Sector_1.push(s.Sector);
            }
            for (var _h = 0, _j = this.selectedAllPowerPlantFilters.ISO_RTO; _h < _j.length; _h++) {
                var s = _j[_h];
                ISO_RTO_1.push(s.ISO_RTO);
            }
            if (this.selectedAllPowerPlantFilters.State.length > 0) {
                StateData = this.AllPowerPlantListdata.filter(function (el) {
                    if (el.State != null && el.State != undefined && State_1.indexOf(el.State.trim()) > -1)
                        return el;
                });
            }
            else {
                StateData = this.AllPowerPlantListdata;
            }
            if (this.selectedAllPowerPlantFilters.NERCRegion.length > 0) {
                NERCRegionData = StateData.filter(function (el) {
                    if (el.NERC != null && el.NERC != undefined && NERCRegion_1.indexOf(el.NERC.trim()) > -1)
                        return el;
                });
            }
            else {
                NERCRegionData = StateData;
            }
            if (this.selectedAllPowerPlantFilters.PrimaryPlantFuel.length > 0) {
                PrimaryPlantFuelData = NERCRegionData.filter(function (el) {
                    if (el.PrimaryFuel != null && el.PrimaryFuel != undefined && PrimaryPlantFuel_1.indexOf(el.PrimaryFuel.trim()) > -1)
                        return el;
                });
            }
            else {
                PrimaryPlantFuelData = NERCRegionData;
            }
            if (this.selectedAllPowerPlantFilters.Sector.length > 0) {
                SectorData = PrimaryPlantFuelData.filter(function (el) {
                    if (el.Sector != null && el.Sector != undefined && Sector_1.indexOf(el.Sector.trim()) > -1)
                        return el;
                });
            }
            else {
                SectorData = PrimaryPlantFuelData;
            }
            if (this.selectedAllPowerPlantFilters.ISO_RTO.length > 0) {
                ISO_RTOData = SectorData.filter(function (el) {
                    if (el.ISO_RTO != null && el.ISO_RTO != undefined && ISO_RTO_1.indexOf(el.ISO_RTO.trim()) > -1)
                        return el;
                });
            }
            else {
                ISO_RTOData = SectorData;
            }
            var RegData = ISO_RTOData.filter(function (el) {
                if (_this.NonRegulated == true && _this.Regulated == true)
                    return el;
                else if (_this.NonRegulated == false)
                    return el.Regulated == "Yes";
                else
                    return el.Regulated == "No";
            });
            var CapacityData_1;
            if (CapacityRangeFrom >= 0 && CapacityRangeTo >= 0) {
                CapacityData_1 = RegData.filter(function (el) {
                    return parseInt(el.CapacityMW) >= CapacityRangeFrom && parseInt(el.CapacityMW) <= CapacityRangeTo;
                });
            }
            else
                CapacityData_1 = RegData;
            // for (var i = 0, capacityLen = ISO_RTOData.length; i < capacityLen; ++i) {
            //   var item = ISO_RTOData[i];
            //   if (item["capacityMW"] >= CapacityRangeFrom && item["capacityMW"] <= CapacityRangeTo) {
            //     CapacityRange.push(item);
            //   }
            // }
            if (CapacityData_1.length > 0) {
                this.PowerPlantrowData = null;
                setTimeout(function () {
                    _this.PowerPlantrowData = CapacityData_1;
                }, 1000);
            }
            else {
                this.PowerPlantrowData = null;
                setTimeout(function () { _this.PowerPlantrowData = _this.fillBlankPowerPlantRowinGrid(); }, 1000);
            }
        }
        else {
            for (var i = 0, capacityLen = this.AllPowerPlantListdata.length; i < capacityLen; ++i) {
                var item = this.AllPowerPlantListdata[i];
                if (item["CapacityMW"] >= CapacityRangeFrom && item["CapacityMW"] <= CapacityRangeTo) {
                    CapacityRange.push(item);
                }
            }
            if (CapacityRange.length > 0) {
                this.PowerPlantrowData = null;
                setTimeout(function () {
                    _this.PowerPlantrowData = CapacityRange;
                }, 1000);
            }
            else {
                this.PowerPlantrowData = null;
                setTimeout(function () { _this.PowerPlantrowData = _this.fillBlankPowerPlantRowinGrid(); }, 1000);
            }
        }
    };
    PowerPlantsComponent.prototype.chkRegulatedChanged = function (event) {
        if (this.Regulated == false && this.NonRegulated == false) {
            this.NonRegulated = true;
        }
    };
    PowerPlantsComponent.prototype.chkNonRegulatedChanged = function (event) {
        if (this.Regulated == false && this.NonRegulated == false) {
            this.Regulated = true;
        }
    };
    PowerPlantsComponent = __decorate([
        core_1.Component({
            selector: 'app-power-plants',
            templateUrl: './power-plants.component.html',
            styleUrls: ['./power-plants.component.scss']
        }),
        __metadata("design:paramtypes", [Intelligence_service_1.IntelligenceService,
            ng_bootstrap_1.NgbModal,
            all_http_request_service_1.HttpRequestService,
            map_service_service_1.MapServiceService])
    ], PowerPlantsComponent);
    return PowerPlantsComponent;
}());
exports.PowerPlantsComponent = PowerPlantsComponent;
//# sourceMappingURL=power-plants.component.js.map