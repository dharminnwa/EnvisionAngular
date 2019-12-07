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
var company_profile_detail_modal_component_1 = require("../company-profile-detail-modal/company-profile-detail-modal.component");
var pipeline_activity_project_modal_component_1 = require("../pipeline-activity-project-modal/pipeline-activity-project-modal.component");
var all_http_request_service_1 = require("../../services/all-http-request.service");
var environment_1 = require("../../../environments/environment");
var map_service_service_1 = require("../../services/map-service.service");
var PipelineActivityProjectsComponent = (function () {
    function PipelineActivityProjectsComponent(IntelligenceService, modalService, httpRequest, MapServiceService) {
        this.IntelligenceService = IntelligenceService;
        this.modalService = modalService;
        this.httpRequest = httpRequest;
        this.MapServiceService = MapServiceService;
        this.AllPipelinefilterOptionValue = {
            state: [],
            commodities: [],
            ProjectStatus: [],
            selectedPipelineCompanyNameList: []
        };
        this.selectedPipelineAllFilters = {
            state: [],
            commodities: [],
            ProjectStatus: []
        };
        this.selectedPipelineCompanyName = '';
        this.PipelineActivityrowData = [];
        this.LoaderLink = environment_1.environment.ImagespreviewPath + "LayerLibraryLoader.gif";
        this.overlayLoadingTemplate = '<img src="' + this.LoaderLink + '" width="106px" />';
        this.overlayNoRowsTemplate = '<img src="' + this.LoaderLink + '" width="106px" />';
    }
    PipelineActivityProjectsComponent.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.GetAllPipelineActivityFilterOptions();
            _this.GetSuggestiveCompanyData();
            _this.GeneratePipelinecolumns();
        }, 2000);
    };
    PipelineActivityProjectsComponent.prototype.Clearallfilters = function () {
        this.selectedPipelineAllFilters.state.length = 0;
        this.selectedPipelineAllFilters.commodities.length = 0;
        this.selectedPipelineAllFilters.ProjectStatus.length = 0;
        this.selectedPipelineCompanyName = "";
        this.resetPiplelineActivityGrid();
    };
    PipelineActivityProjectsComponent.prototype.GetSuggestiveCompanyData = function () {
        var _this = this;
        this.httpRequest._NodeGetSuggestivePipelineActivityResults().subscribe(function (res) {
            var data = res.json();
            if (data._Issuccess) {
                var Pipelinenamelist = data.GetSuggestivePipelineActivityResults;
                _this.AllPipelinefilterOptionValue.selectedPipelineCompanyNameList.push(Pipelinenamelist);
            }
            else {
                console.log(data.errormsg);
            }
        }, function (error) {
            console.log(error);
        });
    };
    PipelineActivityProjectsComponent.prototype.PipelineActicvtytypeaheadOnSelect = function (event) {
        if (event) {
            var val = event.value;
            this.GetProjectNameorsponsorId_basedon_search_Value(val);
            // let CompanyID = this.AllCompnayListdata.filter((el) => {
            //   if (el.CompanyName.toLowerCase() == CompanyName.toLowerCase()) {
            //     return el.CompanyID;
            //   }
            // });
            // if (CompanyID) {
            //   var Id = CompanyID[0].CompanyID;
            //   this.OpenInnewtab(Id);
            // }
            // this.SearchDisplayGridData(CompanyName);
        }
    };
    PipelineActivityProjectsComponent.prototype.GetAllPipelineActivityFilterOptions = function () {
        var _this = this;
        this.httpRequest._NodeGetPiplelinefilterOptions().subscribe(function (res) {
            var data = res.json();
            if (data._Issuccess) {
                var filteropList = data.GetAllCompanyOptions;
                var comoditylist = [];
                var projectstatuslist = [];
                for (var _i = 0, _a = filteropList.Commodities; _i < _a.length; _i++) {
                    var c = _a[_i];
                    var comodityval = {
                        comodity: c.Commodity
                    };
                    comoditylist.push(comodityval);
                }
                for (var _b = 0, _c = filteropList.Projectstatus; _b < _c.length; _b++) {
                    var p = _c[_b];
                    var projectstatusval = {
                        projectstatusval: p.Status
                    };
                    if (projectstatusval.projectstatusval == null) {
                        projectstatusval.projectstatusval = "Null";
                    }
                    projectstatuslist.push(projectstatusval);
                }
                _this.AllPipelinefilterOptionValue.commodities.push(comoditylist);
                _this.AllPipelinefilterOptionValue.ProjectStatus.push(projectstatuslist);
                _this.AllPipelinefilterOptionValue.state.push(filteropList.state);
            }
            else {
                console.log(data.errormsg);
            }
        }, function (error) {
            console.log(error);
        });
    };
    PipelineActivityProjectsComponent.prototype.GeneratePipelinecolumns = function () {
        this.PipelinecolumnDefs = [
            {
                headerName: "IndustryUpdateID",
                field: "IndustryUpdateID",
                width: 10,
                filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                hide: true,
            },
            {
                headerName: 'Project Name',
                field: 'ProjectName',
                width: 450,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                cellRenderer: function (params) {
                    var _object = params.data.ProjectName;
                    var id = params.data.IndustryUpdateID;
                    return "<a style='color: blue;' href='javascript:void(0)' data-action-type='ProjectName'>" + _object + "</a>";
                }
            },
            {
                headerName: "Project Sponsor",
                field: "HoldingCompany",
                width: 450,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                //filterParams: { newRowsAction: "keep" },
                cellRenderer: function (params) {
                    var html = "";
                    var HoldingCompany = params.data.HoldingCompany;
                    var cmpid = params.data.CompanyID;
                    if (HoldingCompany != null && cmpid != null) {
                        HoldingCompany = HoldingCompany.split('|');
                        cmpid = cmpid.split(',');
                        for (var i = 0; i < HoldingCompany.length; i++) {
                            var cmpName = HoldingCompany[i];
                            var id = parseInt(cmpid[i]);
                            if (html == "") {
                                html = "<div><a style='color: blue;' href='javascript:void(0)' data-action-type='ProjectSponsor' data-action-id=" + id + " data-actione-Companyname=" + cmpName + ">" + cmpName + "</a>";
                            }
                            else {
                                html += " , " + "<a style='color: blue;' href='javascript:void(0)' data-action-type='ProjectSponsor' data-action-id=" + id + " data-actione-Companyname=" + cmpName + ">" + cmpName + "</a>";
                            }
                        }
                        html += "</div>";
                    }
                    return html;
                    //return "<a style='color: blue;' href='javascript:void(0)' data-action-type='ProjectSponsor'>" + _object + "</a>"
                }
            },
            {
                headerName: "Project Status",
                field: "Status",
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                width: 250,
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "Commodity",
                field: "Commodities",
                width: 250,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            },
            {
                headerName: "State",
                field: "StateName",
                width: 250,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                filterParams: { newRowsAction: "keep" }
            }
        ];
        this.paginationPageSize = 100;
        this.paginationNumberFormatter = function (params) {
            return params.value.toLocaleString();
        };
    };
    PipelineActivityProjectsComponent.prototype.onGridReady = function (params) {
        var _this = this;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.onPipelineActicityPageSizeChanged();
        if (!this.MapServiceService._PipelineActivityData.getValue()) {
            this.httpRequest._NodeGetPipelineActivityGridDataURL().subscribe(function (res) {
                var data = res.json();
                var ListofPipelineActivity = data.ListofIndustryUpdates;
                _this.MapServiceService.setPipelineActivityData(ListofPipelineActivity);
                _this.PipelineActivityrowData = ListofPipelineActivity;
                _this.AllpipelineActivityListdata = ListofPipelineActivity;
            }, function (error) {
                console.log(error);
                _this.PipelineActivityrowData = _this.fillBlanckPipelineRowinGrid();
            });
        }
        else {
            this.PipelineActivityrowData = this.MapServiceService._PipelineActivityData.getValue();
            this.AllpipelineActivityListdata = this.MapServiceService._PipelineActivityData.getValue();
        }
    };
    PipelineActivityProjectsComponent.prototype.onPipelineActicityPageSizeChanged = function () {
        var value = document.getElementById("PileLineActivitypage-size")["value"];
        this.gridApi.paginationSetPageSize(Number(value));
    };
    PipelineActivityProjectsComponent.prototype.resetPiplelineActivityGrid = function () {
        var _this = this;
        this.PipelineActivityrowData = null;
        setTimeout(function () {
            _this.PipelineActivityrowData = _this.AllpipelineActivityListdata;
        }, 2000);
    };
    PipelineActivityProjectsComponent.prototype.onPipelineActicityRowClicked = function (e) {
        if (e.event.target !== undefined) {
            var data = e.data;
            var actionType = e.event.target.getAttribute("data-action-type");
            switch (actionType) {
                case "ProjectSponsor":
                    var id = e.event.target.getAttribute("data-action-id");
                    var cmpname = e.event.target.getAttribute("data-actione-Companyname");
                    return this.OpenProjectSponsorInnewtab(id);
                case "ProjectName":
                    return this.OpenProjectNAmeInNewTab(data.IndustryUpdateID);
            }
        }
    };
    PipelineActivityProjectsComponent.prototype.OpenProjectSponsorInnewtab = function (CompanyID) {
        // let URL = "../../assets/CompanyProfileDetail.html";
        // URL = URL + "?t=" + CompanyID;
        // window.open(URL, '_blank', 'location=yes,height=600,width=1200,scrollbars=yes,status=yes');
        var URL = "/assets/CompanyProfileDetail.html";
        URL = window.location.origin + URL + "?t=" + CompanyID;
        var modalRef = this.modalService.open(company_profile_detail_modal_component_1.CompanyPorfileDetailModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "CompanyProfileviewDetail" });
        modalRef.componentInstance.URL = URL;
    };
    PipelineActivityProjectsComponent.prototype.OpenProjectNAmeInNewTab = function (Id) {
        // let URL = "../../assets/PipelineActivityProjectName.html";
        // URL = URL + "?t=" + Id;
        // window.open(URL, '_blank', 'location=yes,height=600,width=1200,scrollbars=yes,status=yes');
        var URL = "/assets/PipelineActivityProjectName.html";
        URL = window.location.origin + URL + "?t=" + Id;
        var modalRef = this.modalService.open(pipeline_activity_project_modal_component_1.PipelineActivityProjectModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "CompanyProfileviewDetail" });
        modalRef.componentInstance.URL = URL;
    };
    PipelineActivityProjectsComponent.prototype.searchCompnayName = function () {
        if (this.selectedPipelineCompanyName) {
            this.SearchPipelineActivityData(this.selectedPipelineCompanyName);
        }
    };
    PipelineActivityProjectsComponent.prototype.SearchPipelineActivityData = function (SearchActivityData) {
        var _this = this;
        var SearchPipelineData = this.AllpipelineActivityListdata.filter(function (el) {
            if (el.ProjectName != null && el.HoldingCompany != null) {
                if (el.ProjectName.toLowerCase().indexOf(SearchActivityData.toLowerCase().trim()) > -1 || el.HoldingCompany.toLowerCase().indexOf(SearchActivityData.toLowerCase().trim()) > -1) {
                    return el;
                }
            }
        });
        this.PipelineActivityrowData = null;
        setTimeout(function () {
            if (SearchPipelineData.length > 0) {
                _this.PipelineActivityrowData = SearchPipelineData;
            }
            else {
                _this.PipelineActivityrowData = _this.fillBlanckPipelineRowinGrid();
            }
        }, 1000);
    };
    PipelineActivityProjectsComponent.prototype.fillBlanckPipelineRowinGrid = function () {
        var PipelineKeys = {
            IndustryUpdateID: "",
            ProjectName: "",
            HoldingCompany: "",
            Status: "",
            Commodities: "",
            StateName: "",
        };
        var data = [];
        data.push(PipelineKeys);
        return data;
    };
    PipelineActivityProjectsComponent.prototype.PipelineActivityApplyfilter = function () {
        var _this = this;
        if (this.selectedPipelineAllFilters) {
            var state_1 = [];
            var ProjectStatus_1 = [];
            var Comodity_1 = [];
            var StateData = void 0;
            var ComodityList = void 0;
            var ActivitytStatusData_1;
            for (var _i = 0, _a = this.selectedPipelineAllFilters.state; _i < _a.length; _i++) {
                var s = _a[_i];
                state_1.push(s.stateProvince);
            }
            for (var _b = 0, _c = this.selectedPipelineAllFilters.ProjectStatus; _b < _c.length; _b++) {
                var p = _c[_b];
                var projectstatusval = p.projectstatusval;
                if (p.projectstatusval == 'Null') {
                    projectstatusval = null;
                }
                ProjectStatus_1.push(projectstatusval);
            }
            for (var _d = 0, _e = this.selectedPipelineAllFilters.commodities; _d < _e.length; _d++) {
                var c = _e[_d];
                Comodity_1.push(c.comodity);
            }
            if (this.selectedPipelineAllFilters.state.length > 0) {
                StateData = this.AllpipelineActivityListdata.filter(function (el) {
                    if (el.StateName != null && el.StateName != undefined && state_1.indexOf(el.StateName.trim()) > -1)
                        return el;
                });
            }
            else {
                StateData = this.AllpipelineActivityListdata;
            }
            if (this.selectedPipelineAllFilters.commodities.length > 0) {
                ComodityList = StateData.filter(function (el) {
                    if (el.Commodities != null && el.Commodities != undefined && Comodity_1.indexOf(el.Commodities.trim()) > -1)
                        return el;
                });
            }
            else {
                ComodityList = StateData;
            }
            if (this.selectedPipelineAllFilters.ProjectStatus.length > 0) {
                ActivitytStatusData_1 = ComodityList.filter(function (el) {
                    if (el.Status != null && el.Status != undefined && ProjectStatus_1.indexOf(el.Status.trim()) > -1)
                        return el;
                    else if (el.Status == null || el.Status == undefined)
                        return el;
                });
            }
            else {
                ActivitytStatusData_1 = ComodityList;
            }
            if (ActivitytStatusData_1.length > 0) {
                this.PipelineActivityrowData = null;
                setTimeout(function () {
                    _this.PipelineActivityrowData = ActivitytStatusData_1;
                }, 1000);
            }
            else {
                this.PipelineActivityrowData = null;
                setTimeout(function () { _this.PipelineActivityrowData = _this.fillBlanckPipelineRowinGrid(); }, 1000);
            }
        }
        else {
            this.resetPiplelineActivityGrid();
        }
    };
    PipelineActivityProjectsComponent.prototype.GetProjectNameorsponsorId_basedon_search_Value = function (Name) {
        if (Name) {
            var IndustryUpdateID = this.AllpipelineActivityListdata.filter(function (el) {
                if (el.ProjectName == Name) {
                    return el.IndustryUpdateID;
                }
            });
            if (IndustryUpdateID.length > 0) {
                var Id = IndustryUpdateID[0].IndustryUpdateID;
                this.OpenProjectNAmeInNewTab(Id);
                this.searchCompnayName();
            }
            else {
                var compnayID = this.AllpipelineActivityListdata.filter(function (el) {
                    if (el.HoldingCompany == Name) {
                        return el.IndustryUpdateID;
                    }
                });
                if (compnayID.length > 0) {
                    var cmpnameid = void 0;
                    var HoldingCompany = compnayID[0].HoldingCompany;
                    var cmpid = compnayID[0].CompanyID;
                    HoldingCompany = HoldingCompany.split('|');
                    cmpid = cmpid.split(',');
                    for (var i = 0; i < HoldingCompany.length; i++) {
                        var cmpName = HoldingCompany[i];
                        var id = parseInt(cmpid[i]);
                        if (cmpName == Name) {
                            cmpnameid = id;
                        }
                    }
                    if (cmpnameid) {
                        this.OpenProjectSponsorInnewtab(cmpnameid);
                        //showCompanyDataModalTest(cmpnameid);
                    }
                    else {
                        this.searchCompnayName();
                    }
                }
                else {
                    this.searchCompnayName();
                }
            }
        }
    };
    PipelineActivityProjectsComponent = __decorate([
        core_1.Component({
            selector: 'app-pipeline-activity-projects',
            templateUrl: './pipeline-activity-projects.component.html',
            styleUrls: ['./pipeline-activity-projects.component.scss']
        }),
        __metadata("design:paramtypes", [Intelligence_service_1.IntelligenceService,
            ng_bootstrap_1.NgbModal,
            all_http_request_service_1.HttpRequestService,
            map_service_service_1.MapServiceService])
    ], PipelineActivityProjectsComponent);
    return PipelineActivityProjectsComponent;
}());
exports.PipelineActivityProjectsComponent = PipelineActivityProjectsComponent;
//# sourceMappingURL=pipeline-activity-projects.component.js.map