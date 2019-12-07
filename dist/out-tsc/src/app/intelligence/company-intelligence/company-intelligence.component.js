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
require("rxjs/add/operator/map");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var company_profile_detail_modal_component_1 = require("../company-profile-detail-modal/company-profile-detail-modal.component");
var all_http_request_service_1 = require("../../services/all-http-request.service");
var map_service_service_1 = require("../../services/map-service.service");
var environment_1 = require("../../../environments/environment");
var CompanyIntelligenceComponent = (function () {
    function CompanyIntelligenceComponent(IntelligenceService, modalService, httpRequest, MapServiceService) {
        this.IntelligenceService = IntelligenceService;
        this.modalService = modalService;
        this.httpRequest = httpRequest;
        this.MapServiceService = MapServiceService;
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
        this.AllfilterOptionValue = {
            state: [],
            commodities: [],
            entities: [],
            entityType: [],
            businessLine: [],
            selectedCompanyNameList: [],
        };
        this.selectedAllFilters = {
            state: [],
            commodities: [],
            entities: [],
            entityType: [],
            businessLine: []
        };
        this.selectedCompanyName = "";
        this.CompanyrowData = [];
        this.LoaderLink = this.ImageURLPath + "LayerLibraryLoader.gif";
        this.overlayLoadingTemplate = '<img src="' + this.LoaderLink + '" width="106px" />';
        this.overlayNoRowsTemplate = '<img src="' + this.LoaderLink + '" width="106px" />';
        this.take = 3000;
        this.skip = 0;
    }
    CompanyIntelligenceComponent.prototype.ngOnInit = function () {
        this.GenerateCompanycolumns();
        this.GetAllCompanyOptions();
        this.GetSuggestiveCompanyData();
    };
    CompanyIntelligenceComponent.prototype.GetSuggestiveCompanyData = function () {
        var _this = this;
        this.httpRequest._NodeGetSuggestiveCompanyData().subscribe(function (res) {
            var data = res.json();
            if (data._Issuccess) {
                var Compnaynamelist = data.GetSuggestiveCompanyNameResults;
                _this.AllfilterOptionValue.selectedCompanyNameList.push(Compnaynamelist);
            }
            else {
                console.log(data.errormsg);
            }
        }, function (error) {
            console.log(error);
        });
    };
    CompanyIntelligenceComponent.prototype.SearchDisplayGridData = function (CompanyName) {
        var _this = this;
        var SearchCompanyData = this.AllCompnayListdata.filter(function (el) {
            if (el.CompanyName.toLowerCase().indexOf(CompanyName.toLowerCase().trim()) > -1) {
                return el;
            }
        });
        this.CompanyrowData = null;
        setTimeout(function () {
            if (SearchCompanyData.length > 0) {
                _this.CompanyrowData = SearchCompanyData;
            }
            else {
                _this.CompanyrowData = _this.fillBlanckRowinGrid();
            }
        }, 1000);
    };
    CompanyIntelligenceComponent.prototype.typeaheadOnSelect = function (event) {
        if (event) {
            var CompanyName_1 = event.value;
            this.selectedCompanyName = event.value;
            var CompanyID = this.AllCompnayListdata.filter(function (el) {
                if (el.CompanyName.toLowerCase() == CompanyName_1.toLowerCase()) {
                    return el.CompanyID;
                }
            });
            if (CompanyID) {
                var Id = CompanyID[0].CompanyID;
                this.OpenInnewtab(Id);
            }
            this.SearchDisplayGridData(CompanyName_1);
        }
    };
    CompanyIntelligenceComponent.prototype.searchCompnayName = function () {
        if (this.selectedCompanyName) {
            this.SearchDisplayGridData(this.selectedCompanyName);
        }
    };
    CompanyIntelligenceComponent.prototype.GetAllCompanyList = function (Take, skip) {
        var _this = this;
        this.httpRequest._NodeGetAllCompnayList(Take, skip).subscribe(function (data) {
            var ListofCompnayData = data.CompanyList;
            if (Take == 0 && _this.CompanyrowData.length == 0) {
                _this.CompanyrowData = ListofCompnayData;
            }
            else {
                Array.prototype.push.apply(_this.CompanyrowData, ListofCompnayData);
            }
            if (!_this.AllCompnayListdata)
                _this.AllCompnayListdata = [];
            Array.prototype.push.apply(_this.AllCompnayListdata, ListofCompnayData);
            _this.GenerateCompanycolumns();
        }, function (error) {
            console.log(error);
            _this.GenerateCompanycolumns();
        });
    };
    CompanyIntelligenceComponent.prototype.GetAllCompanyOptions = function () {
        var _this = this;
        this.httpRequest._NodeGetAllCompanyOptions().subscribe(function (res) {
            var data = res.json();
            if (data._Issuccess) {
                var filteropList = data.GetAllCompanyOptions;
                for (var c in filteropList.Commodities) {
                    if (filteropList.Commodities[c].commodity == "Asph") {
                        filteropList.Commodities[c].commodity = "Asphalt";
                    }
                    else if (filteropList.Commodities[c].commodity == "Ethl") {
                        filteropList.Commodities[c].commodity = "Ethanol";
                    }
                    else if (filteropList.Commodities[c].commodity == "Misc") {
                        filteropList.Commodities[c].commodity = "Miscellaneous";
                    }
                }
                for (var e in filteropList.Entities) {
                    filteropList.Entities[e].entity = _this.IntelligenceService.setEnitiesName(filteropList.Entities[e].entity);
                }
                for (var et in filteropList.EntityType) {
                    if (filteropList.EntityType[et].entityType == "HoldingCo") {
                        filteropList.EntityType[et].entityType = "Holding Company";
                    }
                }
                _this.AllfilterOptionValue.state.push(filteropList.state);
                _this.AllfilterOptionValue.commodities.push(filteropList.Commodities);
                _this.AllfilterOptionValue.entities.push(filteropList.Entities);
                _this.AllfilterOptionValue.entityType.push(filteropList.EntityType);
                _this.AllfilterOptionValue.businessLine.push(filteropList.BusinessLine);
            }
            else {
                console.log(data.errormsg);
            }
        }, function (error) {
            console.log(error);
        });
    };
    CompanyIntelligenceComponent.prototype.GenerateCompanycolumns = function () {
        var CompanyNamewidth = 350;
        var width = 197;
        if (window.screen.width > 1366) {
            CompanyNamewidth = 350;
            width = 200;
        }
        else if (window.screen.width < 1366) {
            CompanyNamewidth = 300;
            width = 100;
        }
        else if (window.screen.width == 1366) {
            CompanyNamewidth = 300;
            width = 150;
        }
        this.columnDefs = [
            {
                headerName: "CompanyID",
                field: "CompanyID",
                width: 10,
                filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                hide: true,
            },
            {
                headerName: 'Name',
                field: 'CompanyName',
                width: CompanyNamewidth,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                cellRenderer: function (params) {
                    var _object = params.data.CompanyName;
                    var id = params.data.CompanyID;
                    return "<a style='color: blue;' href='javascript:void(0)' data-action-type='CompanyName'>" + _object + "</a>";
                }
            },
            {
                headerName: "Owned Plants",
                field: "powerPlantOwned",
                width: width,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" },
            },
            {
                headerName: "Operated Plants",
                field: "powerPlantOperated",
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                width: width,
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "Owned Facilities",
                field: "FacilityOwned",
                width: width,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "Operated Facilities",
                field: "FacilityOperated",
                width: width,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "City",
                field: "PhyCity",
                width: width,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "State",
                field: "PhyState",
                width: width,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "Country",
                field: "PhyCountry",
                width: width,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            }
        ];
        this.paginationPageSize = 100;
        this.paginationNumberFormatter = function (params) {
            return params.value.toLocaleString();
        };
    };
    CompanyIntelligenceComponent.prototype.OpenInnewtab = function (CompanyID) {
        // let URL = "../../assets/CompanyProfileDetail.html";    
        // URL = URL + "?t=" + CompanyID;    
        // window.open(URL, '_blank', 'location=yes,height=600,width=1200,scrollbars=yes,status=yes');
        var URL = "/assets/CompanyProfileDetail.html";
        URL = window.location.origin + URL + "?t=" + CompanyID;
        var modalRef = this.modalService.open(company_profile_detail_modal_component_1.CompanyPorfileDetailModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "CompanyProfileviewDetail" });
        modalRef.componentInstance.URL = URL;
    };
    CompanyIntelligenceComponent.prototype.onRowClicked = function (e) {
        if (e.event.target !== undefined) {
            var data = e.data;
            var actionType = e.event.target.getAttribute("data-action-type");
            switch (actionType) {
                case "CompanyName":
                    return this.OpenInnewtab(data.CompanyID);
            }
        }
    };
    CompanyIntelligenceComponent.prototype.onGridReady_Test = function (params) {
        var _this = this;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.onPageSizeChanged();
        this.httpRequest._NodeGetAllJsonCompnayList().subscribe(function (res) {
            var data = res.json();
            var ListofCompnayData = data.CompanyList;
            _this.skip = _this.skip + _this.take;
            if (data._Issuccess) {
                _this.CompanyrowData = ListofCompnayData;
                _this.AllCompnayListdata = ListofCompnayData;
                // setTimeout(() => {
                //   this.httpRequest._NodeGetAllCompnayList(this.take + 12000, this.skip).subscribe(res => {
                //     let data = res.json();
                //     if (data._Issuccess) {
                //       let List = data.CompanyList;
                //       // if (!this.AllCompnayListdata)
                //       //   this.AllCompnayListdata = []
                //       // Array.prototype.push.apply(this.AllCompnayListdata, List);              
                //       this.SetAllCompanyListonGrid(List);
                //     }
                //   }, error => {
                //     console.log(error);
                //   });
                // }, 3000);
            }
            else {
                _this.CompanyrowData = _this.fillBlanckRowinGrid();
            }
        }, function (error) {
            console.log(error);
            setTimeout(function () {
                _this.CompanyrowData = _this.fillBlanckRowinGrid();
            }, 500);
        });
    };
    CompanyIntelligenceComponent.prototype.onGridReady = function (params) {
        var _this = this;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.onPageSizeChanged();
        if (!this.MapServiceService._CompanyProfile.getValue()) {
            this.httpRequest._NodeGetAllCompnayList(this.take, (this.skip)).subscribe(function (res) {
                var data = res.json();
                _this.skip = _this.skip + _this.take;
                if (data._Issuccess) {
                    var ListofCompnayData = data.CompanyList;
                    _this.CompanyrowData = ListofCompnayData;
                    _this.AllCompnayListdata = ListofCompnayData;
                    _this.setDataintoservice(ListofCompnayData);
                    setTimeout(function () {
                        _this.httpRequest._NodeGetAllCompnayList(_this.take + 12000, _this.skip).subscribe(function (res) {
                            var data = res.json();
                            if (data._Issuccess) {
                                var List = data.CompanyList;
                                // if (!this.AllCompnayListdata)
                                //   this.AllCompnayListdata = []
                                // Array.prototype.push.apply(this.AllCompnayListdata, List);    
                                _this.setDataintoservice(List);
                                // this.SetAllCompanyListonGrid(List);
                                _this.resetCompanyGrid();
                            }
                        }, function (error) {
                            console.log(error);
                        });
                    }, 3000);
                }
                else {
                    _this.CompanyrowData = _this.fillBlanckRowinGrid();
                }
            }, function (error) {
                console.log(error);
                setTimeout(function () {
                    _this.CompanyrowData = _this.fillBlanckRowinGrid();
                }, 2000);
            });
        }
        else {
            this.CompanyrowData = this.MapServiceService._CompanyProfile.getValue();
            this.AllCompnayListdata = this.MapServiceService._CompanyProfile.getValue();
        }
    };
    CompanyIntelligenceComponent.prototype.SetAllCompanyListonGrid = function (ListofCompnayData) {
        if (!this.AllCompnayListdata)
            this.AllCompnayListdata = [];
        Array.prototype.push.apply(this.AllCompnayListdata, ListofCompnayData);
        this.resetCompanyGrid();
    };
    CompanyIntelligenceComponent.prototype.onPageSizeChanged = function () {
        var value = document.getElementById("page-size")["value"];
        this.gridApi.paginationSetPageSize(Number(value));
    };
    CompanyIntelligenceComponent.prototype.setDataintoservice = function (data) {
        if (!this.MapServiceService._CompanyProfile.getValue()) {
            this.MapServiceService.setCompanyProfileData(data);
        }
        else {
            Array.prototype.push.apply(this.MapServiceService._CompanyProfile.getValue(), data);
        }
    };
    CompanyIntelligenceComponent.prototype.Clearallfilters = function () {
        this.selectedAllFilters.state.length = 0;
        this.selectedAllFilters.commodities.length = 0;
        this.selectedAllFilters.entities.length = 0;
        this.selectedAllFilters.entityType.length = 0;
        this.selectedAllFilters.businessLine.length = 0;
        this.selectedCompanyName = "";
        this.resetCompanyGrid();
    };
    CompanyIntelligenceComponent.prototype.resetCompanyGrid = function () {
        var _this = this;
        this.CompanyrowData = null;
        setTimeout(function () {
            _this.CompanyrowData = _this.AllCompnayListdata;
        }, 500);
    };
    CompanyIntelligenceComponent.prototype.CompanyApplyfilter = function () {
        var _this = this;
        var state = "";
        var commodities = "";
        var businessLine = "";
        var entities = "";
        var entityType = "";
        for (var _i = 0, _a = this.selectedAllFilters.state; _i < _a.length; _i++) {
            var s = _a[_i];
            if (state == '') {
                state = s.statecode;
            }
            else {
                state += "," + s.statecode;
            }
        }
        for (var _b = 0, _c = this.selectedAllFilters.commodities; _b < _c.length; _b++) {
            var c = _c[_b];
            if (commodities == '') {
                commodities = c.commodityNumber;
            }
            else {
                commodities += "," + c.commodityNumber;
            }
        }
        for (var _d = 0, _e = this.selectedAllFilters.commodities; _d < _e.length; _d++) {
            var c = _e[_d];
            if (commodities == '') {
                commodities = c.commodityNumber;
            }
            else {
                commodities += "," + c.commodityNumber;
            }
        }
        for (var _f = 0, _g = this.selectedAllFilters.businessLine; _f < _g.length; _f++) {
            var b = _g[_f];
            if (businessLine == '') {
                businessLine = b.businessLineNumber;
            }
            else {
                businessLine += "," + b.businessLineNumber;
            }
        }
        for (var _h = 0, _j = this.selectedAllFilters.entities; _h < _j.length; _h++) {
            var e = _j[_h];
            if (entities == '') {
                entities = e.entityNumber;
            }
            else {
                entities += "," + e.entityNumber;
            }
        }
        for (var _k = 0, _l = this.selectedAllFilters.entityType; _k < _l.length; _k++) {
            var et = _l[_k];
            if (entityType == '') {
                entityType = et.entityTypeNumber;
            }
            else {
                entityType += "," + et.entityTypeNumber;
            }
        }
        if (state || commodities || businessLine || entities || entityType) {
            this.httpRequest._NodeGetCompanySearchResult(state, commodities, entities, entityType, businessLine).subscribe(function (data) {
                if (data._Issuccess) {
                    var searchres_1 = data.FilterCompanyList;
                    _this.CompanyrowData = null;
                    if (searchres_1.length > 0) {
                        setTimeout(function () {
                            _this.CompanyrowData = searchres_1;
                        }, 500);
                    }
                    else {
                        setTimeout(function () {
                            _this.CompanyrowData = _this.fillBlanckRowinGrid();
                        }, 500);
                    }
                }
                else {
                    _this.CompanyrowData = null;
                    setTimeout(function () {
                        _this.CompanyrowData = _this.fillBlanckRowinGrid();
                    }, 500);
                }
            }, function (error) {
                //this.resetCompanyGrid();
                _this.CompanyrowData = null;
                setTimeout(function () {
                    _this.CompanyrowData = _this.fillBlanckRowinGrid();
                }, 500);
                console.log(error);
            });
        }
        else {
            //this.resetCompanyGrid();
            this.CompanyrowData = null;
            setTimeout(function () {
                _this.CompanyrowData = _this.fillBlanckRowinGrid();
            }, 500);
        }
    };
    CompanyIntelligenceComponent.prototype.fillBlanckRowinGrid = function () {
        var data = [];
        var CompanyKeys = {
            CompanyID: '',
            CompanyName: '',
            Inactive: '',
            CompanyTypeID: '',
            PhyAddress: '',
            PhyCity: '',
            PhyState: '',
            PhyZip: '',
            PhyCountry: '',
            MailingAddress: '',
            MailingCity: '',
            MailingState: '',
            MailingZip: '',
            MailingCountry: '',
            CO_ID: '',
            UtilityID: '',
            powerPlantOwned: '',
            powerPlantOperated: '',
            FERCID: '',
            FacilityOwned: '',
            FacilityOperated: '',
        };
        data.push(CompanyKeys);
        return data;
    };
    CompanyIntelligenceComponent = __decorate([
        core_1.Component({
            selector: 'app-company-intelligence',
            templateUrl: './company-intelligence.component.html',
            styleUrls: ['./company-intelligence.component.scss']
        }),
        __metadata("design:paramtypes", [Intelligence_service_1.IntelligenceService,
            ng_bootstrap_1.NgbModal,
            all_http_request_service_1.HttpRequestService,
            map_service_service_1.MapServiceService])
    ], CompanyIntelligenceComponent);
    return CompanyIntelligenceComponent;
}());
exports.CompanyIntelligenceComponent = CompanyIntelligenceComponent;
//# sourceMappingURL=company-intelligence.component.js.map