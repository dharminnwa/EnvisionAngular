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
var GeneratingUnitsComponent = (function () {
    function GeneratingUnitsComponent(IntelligenceService, modalService, httpRequest, MapServiceService) {
        this.IntelligenceService = IntelligenceService;
        this.modalService = modalService;
        this.httpRequest = httpRequest;
        this.MapServiceService = MapServiceService;
        this.AllGeneratingUnitfilterOptionValue = {
            state: [],
            nercRegion: [],
            primeMover: [],
            status: [],
            primaryFuelType: [],
            selectedGeneratingUnitNameList: [],
        };
        this.selectedAllGeneratingUnitFilters = {
            state: [],
            nercRegion: [],
            primeMover: [],
            status: [],
            primaryFuelType: []
        };
        this.selectedGeneratingUnitName = '';
        this.OnlineYearFrom = "1856";
        this.OnlineYearTo = "2030";
        this.NameplateCapacityFrom = "0";
        this.NameplateCapacityTo = "99999";
        this.SummerCapacityFrom = "0";
        this.SummerCapacityTo = "99999";
        this.GeneratingUnitsrowData = [];
        this.PowerPlantModelURL = "../../assets/PowerPlantdetail.html";
        // private statusDisplay = [
        //   { 'statusValue': 'Proposed', 'Status': 'Pending Approval' },
        //   { 'statusValue': 'Idle/Inactive', 'Status': 'Out of Service ST' },
        //   { 'statusValue': 'Active', 'Status': 'Operating' },
        //   { 'statusValue': 'Proposed', 'Status': 'Other Planned' },
        //   { 'statusValue': 'Proposed', 'Status': 'Planned' },
        //   { 'statusValue': 'Active', 'Status': 'Standby' },
        //   { 'statusValue': 'Proposed', 'Status': 'Regulatory Appr' },
        //   { 'statusValue': 'Proposed', 'Status': 'Testing' },
        //   { 'statusValue': 'Under Construction', 'Status': 'Under Constr <50%' },
        //   { 'statusValue': 'Under Construction', 'Status': 'Under Constr >50%' },
        // ];
        this.LoaderLink = environment_1.environment.ImagespreviewPath + "LayerLibraryLoader.gif";
        this.overlayLoadingTemplate = '<img src="' + this.LoaderLink + '" width="106px" />';
        this.overlayNoRowsTemplate = '<img src="' + this.LoaderLink + '" width="106px" />';
    }
    ;
    GeneratingUnitsComponent.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.GetAllGeneratingUnitOptions();
            _this.GetSuggestiveGeneratingUnitData();
            _this.GenerateGeneratingUnitcolumns();
        }, 4000);
    };
    GeneratingUnitsComponent.prototype.GetAllGeneratingUnitOptions = function () {
        var _this = this;
        this.httpRequest._NodeGetAllGeneratingUnitOptions().subscribe(function (res) {
            var data = res.json();
            if (data._Issuccess) {
                var filteropList = data.FilterOptionData;
                for (var i = filteropList.nerc.length - 1; i >= 0; --i) {
                    if (filteropList.nerc[i].NERCRegionCode == "" || filteropList.nerc[i].NERCRegionCode == null) {
                        filteropList.nerc.splice(i, 1);
                    }
                }
                _this.AllGeneratingUnitfilterOptionValue.state.push(filteropList.sates);
                _this.AllGeneratingUnitfilterOptionValue.nercRegion.push(filteropList.nerc);
                _this.AllGeneratingUnitfilterOptionValue.primeMover.push(filteropList.primeMover);
                _this.AllGeneratingUnitfilterOptionValue.status.push(filteropList.statusDisplay);
                _this.AllGeneratingUnitfilterOptionValue.primaryFuelType.push(filteropList.fuelType);
            }
        }, function (error) {
            console.log(error);
        });
    };
    // GetAllGeneratingUnitList(skip) {
    //   this.httpRequest.GetAllGeneratingUnitList(skip).subscribe(data => {
    //     let ListofGeneratingUnitData = JSON.parse(data.text());
    //     if (skip == 0 && this.GeneratingUnitsrowData.length == 0) {
    //       this.GeneratingUnitsrowData = ListofGeneratingUnitData;
    //     }
    //     else {
    //       Array.prototype.push.apply(this.GeneratingUnitsrowData, ListofGeneratingUnitData);
    //     }
    //   }, error => {
    //     console.log(error);
    //   });
    // }
    GeneratingUnitsComponent.prototype.GenerateGeneratingUnitcolumns = function () {
        this.GeneratingUnitsColumnDefs = [
            {
                headerName: "unitID",
                field: "UnitID",
                width: 10,
                filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                hide: true,
            },
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
                    var CompID = params.data.CompanyID;
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
                    var PowerID = params.data.PowerID;
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
                width: 130,
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "Generator",
                field: "Generator",
                width: 150,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "Prime Mover",
                field: "PrimeMover",
                width: 150,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "Status",
                field: "Status",
                width: 130,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "Capacity<br/>(MW)",
                field: "Capacity",
                width: 130,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "Summer Capacity<br/>(MW)",
                field: "SummerCapacity",
                width: 130,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "Online Year",
                field: "OnlineYear",
                width: 130,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "Primary Fuel",
                field: "PrimaryFuel",
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
    GeneratingUnitsComponent.prototype.onGeneratingUnitGridReady = function (params) {
        var _this = this;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.onGeneratingUnitPageSizeChanged();
        if (!this.MapServiceService._GeneratingUnitsData.getValue()) {
            this.httpRequest._NodeGetAllGeneratingUnitList(15000, 0).subscribe(function (res) {
                var data = res.json();
                if (data._Issuccess) {
                    var ListofGeneratingUnitData = data.GetGeneratingUnitsData;
                    _this.setDataintoGenearatingservice(ListofGeneratingUnitData);
                    _this.GeneratingUnitsrowData = ListofGeneratingUnitData;
                    _this.AllGeneratingUnitListdata = ListofGeneratingUnitData;
                    setTimeout(function () {
                        _this.httpRequest._NodeGetAllGeneratingUnitList(20000, 15000).subscribe(function (res) {
                            var data = res.json();
                            if (data._Issuccess) {
                                var List = data.GetGeneratingUnitsData;
                                //Array.prototype.push.apply(ListofGeneratingUnitData, List);
                                _this.setDataintoGenearatingservice(List);
                                // this.GeneratingUnitsrowData = ListofGeneratingUnitData;
                                // this.AllGeneratingUnitListdata = ListofGeneratingUnitData;
                                _this.resetGeneratingUnitGrid();
                            }
                        }, function (error) {
                        });
                    }, 3000);
                }
            }, function (error) {
                console.log(error);
            });
        }
        else {
            this.GeneratingUnitsrowData = this.MapServiceService._GeneratingUnitsData.getValue();
            this.AllGeneratingUnitListdata = this.MapServiceService._GeneratingUnitsData.getValue();
        }
    };
    GeneratingUnitsComponent.prototype.setDataintoGenearatingservice = function (data) {
        if (!this.MapServiceService._GeneratingUnitsData.getValue()) {
            this.MapServiceService.setGeneraryingUnitsdata(data);
        }
        else {
            Array.prototype.push.apply(this.MapServiceService._GeneratingUnitsData.getValue(), data);
        }
    };
    GeneratingUnitsComponent.prototype.onGeneratingUnitPageSizeChanged = function () {
        var value = document.getElementById("GeneratingUnitpage-size")["value"];
        this.gridApi.paginationSetPageSize(Number(value));
    };
    GeneratingUnitsComponent.prototype.ClearGeneratingUnitallfilters = function () {
        this.selectedAllGeneratingUnitFilters.state.length = 0;
        this.selectedAllGeneratingUnitFilters.nercRegion.length = 0;
        this.selectedAllGeneratingUnitFilters.primeMover.length = 0;
        this.selectedAllGeneratingUnitFilters.status.length = 0;
        this.selectedAllGeneratingUnitFilters.primaryFuelType.length = 0;
        this.OnlineYearFrom = "1856";
        this.OnlineYearTo = "2030";
        this.NameplateCapacityFrom = "0";
        this.NameplateCapacityTo = "99999";
        this.SummerCapacityFrom = "0";
        this.SummerCapacityTo = "99999";
        this.selectedGeneratingUnitName = "";
        this.resetGeneratingUnitGrid();
    };
    GeneratingUnitsComponent.prototype.resetGeneratingUnitGrid = function () {
        var _this = this;
        this.GeneratingUnitsrowData = null;
        setTimeout(function () {
            _this.GeneratingUnitsrowData = _this.AllGeneratingUnitListdata;
        }, 2000);
    };
    GeneratingUnitsComponent.prototype.GeneratingUnitsTypeaheadOnSelect = function (event, content) {
        if (event) {
            var val = event.value;
            this.GetPowerPlantorUtility_basedon_search_Value(val, content);
        }
    };
    GeneratingUnitsComponent.prototype.GetPowerPlantorUtility_basedon_search_Value = function (Name, content) {
        if (Name) {
            var companyID = this.AllGeneratingUnitListdata.filter(function (el) {
                if (el.OperatingUtility == Name) {
                    return el.CompanyID;
                }
            });
            if (companyID.length > 0) {
                var CompanyID = companyID[0].CompanyID;
                this.OpenOperatingUtilityInNewTab(CompanyID);
                this.searchGeneratingUnitUtilityOrPowerPlant();
            }
            else {
                var PowerID = this.AllGeneratingUnitListdata.filter(function (el) {
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
                        var id = parseInt(powerID);
                        if (cmpName == Name) {
                            cmpnameid = id;
                        }
                    }
                    if (cmpnameid) {
                        this.OpenPowerPlantInnewtab(powerID, company_ID, content);
                        this.searchGeneratingUnitUtilityOrPowerPlant();
                    }
                    else {
                        this.searchGeneratingUnitUtilityOrPowerPlant();
                    }
                }
                else {
                    this.searchGeneratingUnitUtilityOrPowerPlant();
                }
            }
        }
    };
    GeneratingUnitsComponent.prototype.searchGeneratingUnitUtilityOrPowerPlant = function () {
        if (this.selectedGeneratingUnitName) {
            this.SearchPowerPlantData(this.selectedGeneratingUnitName);
        }
    };
    GeneratingUnitsComponent.prototype.SearchPowerPlantData = function (SearchPlantData) {
        var _this = this;
        var SearchPowerPlantData = this.AllGeneratingUnitListdata.filter(function (el) {
            if (el.PowerPlant != null && el.OperatingUtility != null) {
                if (el.PowerPlant.toLowerCase().indexOf(SearchPlantData.toLowerCase().trim()) > -1 || el.OperatingUtility.toLowerCase().indexOf(SearchPlantData.toLowerCase().trim()) > -1) {
                    return el;
                }
            }
        });
        this.GeneratingUnitsrowData = null;
        setTimeout(function () {
            if (SearchPowerPlantData.length > 0) {
                _this.GeneratingUnitsrowData = SearchPowerPlantData;
            }
            else {
                _this.GeneratingUnitsrowData = _this.fillBlankGeneratingRowinGrid();
            }
        }, 1000);
    };
    GeneratingUnitsComponent.prototype.fillBlankGeneratingRowinGrid = function () {
        var PowerPlantKeys = {
            PowerID: "",
            PowerPlant: "",
            OperatingUtility: "",
            CompanyID: ""
        };
        var data = [];
        data.push(PowerPlantKeys);
        return data;
    };
    GeneratingUnitsComponent.prototype.onGeneratingUnitRowClicked = function (e) {
        if (e.event.target !== undefined) {
            var data = e.data;
            var actionType = e.event.target.getAttribute("data-action-type");
            switch (actionType) {
                case "powerPlant":
                    return this.OpenPowerPlantInnewtab(data.PowerID, data.CompanyID, e.content);
                case "operatingUtility":
                    return this.OpenOperatingUtilityInNewTab(data.CompanyID);
            }
        }
    };
    GeneratingUnitsComponent.prototype.OpenPowerPlantInnewtab = function (PowerID, CompanyID, content) {
        // let URL = "../../assets/PowerPlantdetail.html";
        // URL = URL + "?p=" + PowerID + "&c=" + CompanyID + "&Type=Power";
        // window.open(URL, '_blank', 'location=yes,height=600,width=1200,scrollbars=yes,status=yes');
        var URL = "/assets/PowerPlantdetail.html";
        URL = window.location.origin + URL + "?p=" + PowerID + "&c=" + CompanyID + "&Type=Power";
        var modalRef = this.modalService.open(power_plantdetail_modal_component_1.PowerPlantdetailModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "powerplant" });
        modalRef.componentInstance.URL = URL;
    };
    GeneratingUnitsComponent.prototype.OpenOperatingUtilityInNewTab = function (companyID) {
        // let URL = "../../assets/OperatingUtilitydetail.html";
        // URL = URL + "?t=" + companyID;
        // window.open(URL, '_blank', 'location=yes,height=600,width=1200,scrollbars=yes,status=yes');
        var URL = "/assets/OperatingUtilitydetail.html";
        URL = window.location.origin + URL + "?t=" + companyID;
        var modalRef = this.modalService.open(operating_utilitydetail_modal_component_1.OperatingUtilitydetailModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "powerplant" });
        modalRef.componentInstance.URL = URL;
    };
    GeneratingUnitsComponent.prototype.GetSuggestiveGeneratingUnitData = function () {
        var _this = this;
        this.httpRequest._NodeGetSuggestiveGeneratingUnitsResults().subscribe(function (res) {
            var data = res.json();
            if (data._Issuccess) {
                var GeneratingUnitUtilityOrPowerPlantList = data.SuggestiveeGeneratingUnitsData;
                _this.AllGeneratingUnitfilterOptionValue.selectedGeneratingUnitNameList.push(GeneratingUnitUtilityOrPowerPlantList);
            }
        }, function (error) {
            console.log(error);
        });
    };
    GeneratingUnitsComponent.prototype.GeneratingUnitApplyfilter = function () {
        var _this = this;
        if (this.selectedAllGeneratingUnitFilters) {
            var State_1 = [];
            var NERCRegion_1 = [];
            var PrimaryPlantFuel_1 = [];
            var status_1 = [];
            var primaryFuel_1 = [];
            var StateData = void 0;
            var NERCRegionData = void 0;
            var PrimaryPlantFuelData = void 0;
            var statusData = void 0;
            var primaryFuelData = void 0;
            for (var _i = 0, _a = this.selectedAllGeneratingUnitFilters.state; _i < _a.length; _i++) {
                var s = _a[_i];
                State_1.push(s.StateCode);
            }
            for (var _b = 0, _c = this.selectedAllGeneratingUnitFilters.nercRegion; _b < _c.length; _b++) {
                var s = _c[_b];
                NERCRegion_1.push(s.NERCRegionCode);
            }
            for (var _d = 0, _e = this.selectedAllGeneratingUnitFilters.primeMover; _d < _e.length; _d++) {
                var s = _e[_d];
                PrimaryPlantFuel_1.push(s.PrimeMover);
            }
            for (var _f = 0, _g = this.selectedAllGeneratingUnitFilters.status; _f < _g.length; _f++) {
                var s = _g[_f];
                status_1.push(s.Status.trim());
            }
            for (var _h = 0, _j = this.selectedAllGeneratingUnitFilters.primaryFuelType; _h < _j.length; _h++) {
                var s = _j[_h];
                primaryFuel_1.push(s.FuelTypeCode.trim());
            }
            if (this.selectedAllGeneratingUnitFilters.state.length > 0) {
                StateData = this.AllGeneratingUnitListdata.filter(function (el) {
                    if (el.State != null && el.State != undefined && State_1.indexOf(el.State.trim()) > -1)
                        return el;
                });
            }
            else {
                StateData = this.AllGeneratingUnitListdata;
            }
            if (this.selectedAllGeneratingUnitFilters.nercRegion.length > 0) {
                NERCRegionData = StateData.filter(function (el) {
                    if (el.NERC != null && el.NERC != undefined && NERCRegion_1.indexOf(el.NERC.trim()) > -1)
                        return el;
                });
            }
            else {
                NERCRegionData = StateData;
            }
            if (this.selectedAllGeneratingUnitFilters.primeMover.length > 0) {
                PrimaryPlantFuelData = NERCRegionData.filter(function (el) {
                    if (el.PrimeMover != null && el.PrimeMover != undefined && PrimaryPlantFuel_1.indexOf(el.PrimeMover.trim()) > -1)
                        return el;
                });
            }
            else {
                PrimaryPlantFuelData = NERCRegionData;
            }
            if (this.selectedAllGeneratingUnitFilters.status.length > 0) {
                statusData = PrimaryPlantFuelData.filter(function (el) {
                    if (el.Status != null && el.Status != undefined && status_1.indexOf(el.Status.trim()) > -1)
                        return el;
                });
            }
            else {
                statusData = PrimaryPlantFuelData;
            }
            if (this.selectedAllGeneratingUnitFilters.primaryFuelType.length > 0) {
                primaryFuelData = statusData.filter(function (el) {
                    if (el.PrimaryFuel != null && el.PrimaryFuel != undefined && primaryFuel_1.indexOf(el.PrimaryFuel.trim()) > -1)
                        return el;
                });
            }
            else {
                primaryFuelData = statusData;
            }
            var OnlineYearData = void 0;
            if (parseInt(this.OnlineYearFrom) >= 0 && parseInt(this.OnlineYearTo) >= 0) {
                OnlineYearData = primaryFuelData.filter(function (el) {
                    return parseInt(el.OnlineYear) >= parseInt(_this.OnlineYearFrom) && parseInt(el.OnlineYear) <= parseInt(_this.OnlineYearTo);
                });
            }
            else
                OnlineYearData = primaryFuelData;
            var NamePlateCapacityData;
            if (parseInt(this.NameplateCapacityFrom) >= 0 && parseInt(this.NameplateCapacityTo) >= 0) {
                NamePlateCapacityData = OnlineYearData.filter(function (el) {
                    return parseInt(el.Capacity) >= parseInt(_this.NameplateCapacityFrom) && parseInt(el.Capacity) <= parseInt(_this.NameplateCapacityTo);
                });
            }
            else
                NamePlateCapacityData = OnlineYearData;
            var SummerCapacityData;
            if (parseInt(this.SummerCapacityFrom) >= 0 && parseInt(this.SummerCapacityTo) >= 0) {
                SummerCapacityData = NamePlateCapacityData.filter(function (el) {
                    return parseInt(el.SummerCapacity) >= parseInt(_this.SummerCapacityFrom) && parseInt(el.SummerCapacity) <= parseInt(_this.SummerCapacityTo);
                });
            }
            else
                SummerCapacityData = NamePlateCapacityData;
            if (SummerCapacityData.length > 0) {
                this.GeneratingUnitsrowData = null;
                setTimeout(function () {
                    _this.GeneratingUnitsrowData = SummerCapacityData;
                }, 1000);
            }
            else {
                this.GeneratingUnitsrowData = null;
                setTimeout(function () { _this.GeneratingUnitsrowData = _this.fillBlankGeneratingRowinGrid(); }, 1000);
            }
        }
    };
    GeneratingUnitsComponent = __decorate([
        core_1.Component({
            selector: 'app-generating-units',
            templateUrl: './generating-units.component.html',
            styleUrls: ['./generating-units.component.scss'],
            providers: [ng_bootstrap_1.NgbModal]
        }),
        __metadata("design:paramtypes", [Intelligence_service_1.IntelligenceService,
            ng_bootstrap_1.NgbModal,
            all_http_request_service_1.HttpRequestService,
            map_service_service_1.MapServiceService])
    ], GeneratingUnitsComponent);
    return GeneratingUnitsComponent;
}());
exports.GeneratingUnitsComponent = GeneratingUnitsComponent;
//# sourceMappingURL=generating-units.component.js.map