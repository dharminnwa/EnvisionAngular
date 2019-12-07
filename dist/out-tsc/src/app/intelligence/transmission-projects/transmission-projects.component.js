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
var transmission_project_detail_modal_component_1 = require("../transmission-project-detail-modal/transmission-project-detail-modal.component");
var all_http_request_service_1 = require("../../services/all-http-request.service");
var environment_1 = require("../../../environments/environment");
var map_service_service_1 = require("../../services/map-service.service");
var TransmissionProjectsComponent = (function () {
    function TransmissionProjectsComponent(IntelligenceService, modalService, httpRequest, MapServiceService) {
        this.IntelligenceService = IntelligenceService;
        this.modalService = modalService;
        this.httpRequest = httpRequest;
        this.MapServiceService = MapServiceService;
        this.AllTransmissionfilterOptionValue = {
            ProjectStatus: [],
            YearInService: [],
            NERCRegion: [],
            ISO_RTO: [],
            Voltagetype: [],
            selectedTransmissionCompanyNameorSponesorList: [],
        };
        this.selectedAllTransmissionFilters = {
            ProjectStatus: [],
            YearInService: [],
            NERCRegion: [],
            ISO_RTO: [],
            Voltagetype: [],
        };
        this.selectedCompanyorSponsorName = '';
        this.selectedTransmissionpage_sorting = "Project Name";
        this.LineMilesFrom = "0";
        this.LineMilesTo = "99999";
        this.VoltagekVFrom = "0";
        this.VoltagekVTo = "99999";
        this.LoaderLink = environment_1.environment.ImagespreviewPath + "LayerLibraryLoader.gif";
        this.overlayLoadingTemplate = '<img src="' + this.LoaderLink + '" width="106px" />';
        this.overlayNoRowsTemplate = '<img src="' + this.LoaderLink + '" width="106px" />';
        this.TransmissionProjectrowData = [];
        this.transmissionpaginationPageSize = 100;
    }
    TransmissionProjectsComponent.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.GetTrasnmissionFilterOption();
            _this.GetSuggestiveTransmissionProjectData();
            _this.GenerateTransmissionProjectcolumns();
        }, 2000);
    };
    TransmissionProjectsComponent.prototype.GetTrasnmissionFilterOption = function () {
        var _this = this;
        this.httpRequest._NodeGetAllTransmissionProjectFilterOptions().subscribe(function (res) {
            var data = res.json();
            if (data._Issuccess) {
                var filteropList = data.FilterOptions;
                _this.AllTransmissionfilterOptionValue.ProjectStatus.push(filteropList.ProjectStatus);
                _this.AllTransmissionfilterOptionValue.YearInService.push(filteropList.ServiceYear);
                _this.AllTransmissionfilterOptionValue.NERCRegion.push(filteropList.NERC);
                _this.AllTransmissionfilterOptionValue.ISO_RTO.push(filteropList.ISORTO);
                _this.AllTransmissionfilterOptionValue.Voltagetype.push(filteropList.VoltageType);
            }
        }, function (error) { console.log(error); });
    };
    TransmissionProjectsComponent.prototype.GetSuggestiveTransmissionProjectData = function () {
        var _this = this;
        this.httpRequest.GetSuggestiveTransmissionProjectDataResults().subscribe(function (res) {
            var data = res.json();
            if (data._Issuccess) {
                var CompnaynameorSponsornamelist = data.SuggestiveProjectData;
                _this.AllTransmissionfilterOptionValue.selectedTransmissionCompanyNameorSponesorList.push(CompnaynameorSponsornamelist);
            }
        }, function (error) {
            console.log(error);
        });
    };
    TransmissionProjectsComponent.prototype.onTransmissionGridReady = function (params) {
        var _this = this;
        this.transgridApi = params.api;
        this.transgridColumnApi = params.columnApi;
        if (!this.MapServiceService._TransmissionProjectData.getValue()) {
            this.httpRequest.GetTransmissionProjectsData().subscribe(function (res) {
                var data = res.json();
                if (data._Issuccess) {
                    var List = data.TransmissionData;
                    _this.MapServiceService.setTransmissionProjectdata(List);
                    _this.TransmissionProjectrowData = List;
                    _this.AllTransmissionProjectListdata = List;
                    _this.onTransmissionPageSizeChanged();
                }
                else {
                    _this.TransmissionProjectrowData = _this.fillBlankTransmissionProjectRowinGrid();
                }
            }, function (error) {
                console.log(error);
            });
        }
        else {
            this.TransmissionProjectrowData = this.MapServiceService._TransmissionProjectData.getValue();
            this.AllTransmissionProjectListdata = this.MapServiceService._TransmissionProjectData.getValue();
            this.onTransmissionPageSizeChanged();
        }
    };
    TransmissionProjectsComponent.prototype.onTransmissionPageSizeChanged = function () {
        var value = document.getElementById("Transmissionpage-size")["value"];
        this.transgridApi.paginationSetPageSize(Number(value));
    };
    TransmissionProjectsComponent.prototype.getSortedName = function () {
        var value = document.getElementById("Transmissionpage-sorting")["value"];
        return value;
    };
    TransmissionProjectsComponent.prototype.onTransmissionPagesorting = function () {
        var _this = this;
        this.TransmissionProjectcolumnDefs = null;
        this.TransmissionProjectrowData = null;
        setTimeout(function () {
            _this.GenerateTransmissionProjectcolumns();
            _this.TransmissionProjectrowData = _this.AllTransmissionProjectListdata;
        }, 2000);
    };
    TransmissionProjectsComponent.prototype.GenerateTransmissionProjectcolumns = function () {
        var TransProjectName1Visible = false;
        var TransProjectName2Visible = false;
        var ProjectGroupVisible = false;
        var ProjectPartnersVisible = false;
        var BuildStartVisible = false;
        var CompYearVisible = false;
        var VoltageTypeVisible = false;
        var InterstateVisible = false;
        var NERCVisible = false;
        var ISOVisible = false;
        var OriginPointVisible = false;
        var DestiPointVisible = false;
        var EstCostVisible = false;
        var ServiceYearVisible = false;
        var FromVisible = false;
        var ToVisible = false;
        // if (this.selectedTransmissionpage_sorting == "Project Name") {
        //   TransProjectName1Visible = true;
        //   BuildStartVisible = true;
        //   ProjectGroupVisible = true;
        //   EstCostVisible = true;
        //   ServiceYearVisible = true;
        //   FromVisible = true;
        //   ToVisible = true;
        // }
        // if (this.selectedTransmissionpage_sorting == "Sponsor") {
        //   TransProjectName1Visible = true;
        //   //TransProjectName2Visible = false;
        //   ProjectPartnersVisible = true;
        //   EstCostVisible = true;
        //   ServiceYearVisible = true;
        //   FromVisible = true;
        //   ToVisible = true;
        // }
        // if (this.selectedTransmissionpage_sorting == "Year") {
        //   TransProjectName1Visible = true;
        //   CompYearVisible = true;
        //   VoltageTypeVisible = true;
        //   InterstateVisible = true;
        //   BuildStartVisible = true;
        //   EstCostVisible = true;
        // }
        // if (this.selectedTransmissionpage_sorting == "NERC Region") {
        //   NERCVisible = true;
        //   ISOVisible = true;
        //   TransProjectName1Visible = true;
        //   OriginPointVisible = true;
        //   DestiPointVisible = true;
        //   FromVisible = true;
        //   ToVisible = true;
        // }
        TransProjectName1Visible = true;
        BuildStartVisible = true;
        ProjectGroupVisible = true;
        EstCostVisible = true;
        ServiceYearVisible = true;
        FromVisible = true;
        ToVisible = true;
        ProjectPartnersVisible = true;
        CompYearVisible = true;
        VoltageTypeVisible = true;
        InterstateVisible = true;
        NERCVisible = true;
        ISOVisible = true;
        OriginPointVisible = true;
        DestiPointVisible = true;
        this.TransmissionProjectcolumnDefs = [
            {
                headerName: "TransProjectID",
                field: "TransProjectID",
                width: 10,
                filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                hide: true,
            },
            {
                headerName: "Project Name",
                field: 'TransProjectName',
                hide: !TransProjectName1Visible,
                width: 300,
                cellRenderer: function (params) {
                    var _object = params.data.TransProjectName;
                    var id = params.data.TransProjectID;
                    var DisplayImage = params.data.DisplayImage;
                    var html = '';
                    if (DisplayImage != null && DisplayImage == true) {
                        html = '&nbsp;&nbsp;&nbsp<i class="fa fa-map-marker fa-lg" aria-hidden="true" style="color: red;"></i>';
                    }
                    return "<a style='color: blue;' href='javascript:void(0)' data-action-type='ProjectName'  data-action-id=" + id + " >" + _object + "</a>" + html;
                },
                filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            },
            {
                headerName: "Project Sponsor", field: 'ProjectSponsor',
                hide: false,
                width: 300,
                filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                cellRenderer: function (params) {
                    var _object = params.data.ProjectSponsor;
                    var id = params.data.CompanyID;
                    return "<a style='color: blue;' href='javascript:void(0)'  data-action-type='ProjectSponsor'  data-action-id=" + id + ">" + _object + "</a>";
                }
            },
            { headerName: "NERC Region", field: 'NERC', hide: !NERCVisible, width: 200 },
            { headerName: "ISO RTO", field: 'ISO', hide: !ISOVisible, width: 200 },
            { headerName: "Scheduled Completion Year", field: 'YearCompletion', hide: !CompYearVisible, width: 200 },
            {
                headerName: "Project Name", field: 'TransProjectName', hide: !TransProjectName2Visible, width: 150, filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            },
            {
                headerName: "Line Miles", field: 'LineMiles', hide: false, width: 100, filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            },
            {
                headerName: "Voltage (KV)", field: 'Voltage', hide: false, width: 150, filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            },
            {
                headerName: "Voltage Type", field: 'VoltageType', hide: !VoltageTypeVisible, width: 150, filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            },
            {
                headerName: "Origin Point", field: 'OriginPoint', hide: !OriginPointVisible, width: 150, filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            },
            {
                headerName: "Destination Point", field: 'DestinationPoint', hide: !DestiPointVisible, width: 150, filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            },
            {
                headerName: "Interstate", field: 'InterstateVal', hide: !InterstateVisible, width: 150, filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            },
            {
                headerName: "From", field: 'From', hide: !FromVisible, width: 80, filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            },
            {
                headerName: "To", field: 'To', hide: !ToVisible, width: 80, filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            },
            {
                headerName: "Project Status", field: 'ProjectStatus', hide: false, width: 150, filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            },
            {
                headerName: "Build Start", field: 'BuildYear', hide: !BuildStartVisible, width: 100, filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            },
            {
                headerName: "Year In Service", field: 'ServiceYear', hide: !ServiceYearVisible, width: 150, filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            },
            {
                headerName: "Estimated Costs ($/M)", field: 'EstimatedCosts', hide: !EstCostVisible, width: 150, filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            },
            {
                headerName: "Project Group", field: 'ProjectGroup', hide: !ProjectGroupVisible, width: 100, filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            },
            {
                headerName: "Project Partners", field: 'ProjectPartners', hide: !ProjectPartnersVisible, width: 100, filterParams: { newRowsAction: "keep" },
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            }
        ];
        this.transmissionpaginationPageSize = 100;
        this.paginationNumberFormatter = function (params) {
            return params.value.toLocaleString();
        };
    };
    TransmissionProjectsComponent.prototype.ClearTransmissionProjectAllfilters = function () {
        this.selectedAllTransmissionFilters.ProjectStatus.length = 0;
        this.selectedAllTransmissionFilters.YearInService.length = 0;
        this.selectedAllTransmissionFilters.NERCRegion.length = 0;
        this.selectedAllTransmissionFilters.ISO_RTO.length = 0;
        this.selectedAllTransmissionFilters.Voltagetype.length = 0;
        this.LineMilesFrom = "0";
        this.LineMilesTo = "99999";
        this.VoltagekVFrom = "0";
        this.VoltagekVTo = "99999";
        this.selectedCompanyorSponsorName = "";
        this.selectedTransmissionpage_sorting = "Project Name";
        this.resetTransmissionProjectGrid();
    };
    TransmissionProjectsComponent.prototype.resetTransmissionProjectGrid = function () {
        var _this = this;
        this.TransmissionProjectcolumnDefs = null;
        this.TransmissionProjectrowData = null;
        setTimeout(function () {
            _this.GenerateTransmissionProjectcolumns();
            _this.TransmissionProjectrowData = _this.AllTransmissionProjectListdata;
        }, 2000);
    };
    TransmissionProjectsComponent.prototype.onTransmissionProjectRowClicked = function (e) {
        if (e.event.target !== undefined) {
            var data = e.data;
            var actionType = e.event.target.getAttribute("data-action-type");
            switch (actionType) {
                case "ProjectSponsor":
                    var id = e.event.target.getAttribute("data-action-id");
                    // let cmpname = e.event.target.getAttribute("data-actione-Companyname");
                    return this.OpenProjectSponsorInnewtab(id);
                case "ProjectName":
                    return this.OpenProjectNAmeInNewTab(data.TransProjectID);
            }
        }
    };
    TransmissionProjectsComponent.prototype.OpenProjectSponsorInnewtab = function (CompanyID) {
        // let URL = "../../assets/CompanyProfileDetail.html";
        // URL = URL + "?t=" + CompanyID;
        // window.open(URL, '_blank', 'location=yes,height=600,width=1200,scrollbars=yes,status=yes');
        var URL = "/assets/CompanyProfileDetail.html";
        URL = window.location.origin + URL + "?t=" + CompanyID;
        var modalRef = this.modalService.open(company_profile_detail_modal_component_1.CompanyPorfileDetailModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "CompanyProfileviewDetail" });
        modalRef.componentInstance.URL = URL;
    };
    TransmissionProjectsComponent.prototype.OpenProjectNAmeInNewTab = function (Id) {
        // let URL = "../../assets/TransmissionProjectGridSummary.html";    
        // URL = URL + "?t=" + Id;
        // window.open(URL, '_blank', 'location=yes,height=600,width=1200,scrollbars=yes,status=yes');
        var URL = "/assets/TransmissionProjectGridSummary.html";
        URL = window.location.origin + URL + "?t=" + Id;
        var modalRef = this.modalService.open(transmission_project_detail_modal_component_1.TransmissionProjectDetailModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "CompanyProfileviewDetail" });
        modalRef.componentInstance.URL = URL;
    };
    TransmissionProjectsComponent.prototype.TransmissionProjectApplyfilter = function () {
        var _this = this;
        var LineMilesRange = [], LineMilesRangeFrom = parseFloat(this.LineMilesFrom), LineMilesRangeTo = parseFloat(this.LineMilesTo);
        var VoltageRange = [], VoltageRangeFrom = parseFloat(this.VoltagekVFrom), VoltageRangeTo = parseFloat(this.VoltagekVTo);
        if (this.selectedAllTransmissionFilters) {
            var ProjectStatus_1 = [];
            var YearInService_1 = [];
            var NERCRegion_1 = [];
            var ISO_1 = [];
            var VoltageType_1 = [];
            var ProjectStatusData = void 0;
            var YearInServiceData = void 0;
            var NERCRegionData = void 0;
            var ISOData = void 0;
            var VoltageTypeData = void 0;
            for (var _i = 0, _a = this.selectedAllTransmissionFilters.ProjectStatus; _i < _a.length; _i++) {
                var s = _a[_i];
                ProjectStatus_1.push(s.ProjectStatus);
            }
            for (var _b = 0, _c = this.selectedAllTransmissionFilters.YearInService; _b < _c.length; _b++) {
                var s = _c[_b];
                YearInService_1.push(s.ServiceYear);
            }
            for (var _d = 0, _e = this.selectedAllTransmissionFilters.NERCRegion; _d < _e.length; _d++) {
                var s = _e[_d];
                NERCRegion_1.push(s.NERC);
            }
            for (var _f = 0, _g = this.selectedAllTransmissionFilters.ISO_RTO; _f < _g.length; _f++) {
                var s = _g[_f];
                var iso = s.ISO;
                if (s.iso == 'Null') {
                    iso = null;
                }
                ISO_1.push(iso);
            }
            for (var _h = 0, _j = this.selectedAllTransmissionFilters.Voltagetype; _h < _j.length; _h++) {
                var s = _j[_h];
                VoltageType_1.push(s.VoltageType);
            }
            if (this.selectedAllTransmissionFilters.ProjectStatus.length > 0) {
                ProjectStatusData = this.AllTransmissionProjectListdata.filter(function (el) {
                    if (el.ProjectStatus != null && el.ProjectStatus != undefined && ProjectStatus_1.indexOf(el.ProjectStatus.trim()) > -1)
                        return el;
                });
            }
            else {
                ProjectStatusData = this.AllTransmissionProjectListdata;
            }
            if (this.selectedAllTransmissionFilters.YearInService.length > 0) {
                YearInServiceData = ProjectStatusData.filter(function (el) {
                    if (el.ServiceYear != null && el.ServiceYear != undefined && YearInService_1.indexOf(el.ServiceYear) > -1)
                        return el;
                });
            }
            else {
                YearInServiceData = ProjectStatusData;
            }
            if (this.selectedAllTransmissionFilters.NERCRegion.length > 0) {
                NERCRegionData = YearInServiceData.filter(function (el) {
                    if (el.NERC != null && el.NERC != undefined && NERCRegion_1.indexOf(el.NERC.trim()) > -1)
                        return el;
                });
            }
            else {
                NERCRegionData = YearInServiceData;
            }
            if (this.selectedAllTransmissionFilters.ISO_RTO.length > 0) {
                ISOData = NERCRegionData.filter(function (el) {
                    if (el.ISO != null && el.ISO != undefined && ISO_1.indexOf(el.ISO.trim()) > -1)
                        return el;
                });
            }
            else {
                ISOData = NERCRegionData;
            }
            if (this.selectedAllTransmissionFilters.Voltagetype.length > 0) {
                VoltageTypeData = ISOData.filter(function (el) {
                    if (el.VoltageType != null && el.VoltageType != undefined && VoltageType_1.indexOf(el.VoltageType.trim()) > -1)
                        return el;
                });
            }
            else {
                VoltageTypeData = ISOData;
            }
            for (var i = 0, LineMileslen = VoltageTypeData.length; i < LineMileslen; ++i) {
                var item = VoltageTypeData[i];
                if (item["LineMiles"] >= LineMilesRangeFrom && item["LineMiles"] <= LineMilesRangeTo) {
                    LineMilesRange.push(item);
                }
            }
            for (var i = 0, Voltagelen = LineMilesRange.length; i < Voltagelen; ++i) {
                var item = LineMilesRange[i];
                if (item["Voltage"] >= VoltageRangeFrom && item["Voltage"] <= VoltageRangeTo) {
                    VoltageRange.push(item);
                }
            }
            if (VoltageRange.length > 0) {
                this.TransmissionProjectrowData = null;
                setTimeout(function () {
                    _this.TransmissionProjectrowData = VoltageRange;
                }, 1000);
            }
            else {
                setTimeout(function () { _this.TransmissionProjectrowData = _this.fillBlankTransmissionProjectRowinGrid(); }, 1000);
            }
        }
        else {
            for (var i = 0, LineMileslen = this.AllTransmissionProjectListdata.length; i < LineMileslen; ++i) {
                var item = this.AllTransmissionProjectListdata[i];
                if (item["LineMiles"] >= LineMilesRangeFrom && item["LineMiles"] <= LineMilesRangeTo) {
                    LineMilesRange.push(item);
                }
            }
            for (var i = 0, Voltagelen = LineMilesRange.length; i < Voltagelen; ++i) {
                var item = LineMilesRange[i];
                if (item["Voltage"] >= VoltageRangeFrom && item["Voltage"] <= VoltageRangeTo) {
                    VoltageRange.push(item);
                }
            }
        }
        // else { this.resetTransmissionProjectGrid(); }
    };
    TransmissionProjectsComponent.prototype.fillBlankTransmissionProjectRowinGrid = function () {
        var TransmissionProjectKeys = {
            TransProjectID: "",
            TransProjectName: "",
            ProjectSponsor: ""
        };
        var data = [];
        data.push(TransmissionProjectKeys);
        return data;
    };
    TransmissionProjectsComponent.prototype.searchTransmissionProjectNameOrSponsor = function () {
        if (this.selectedCompanyorSponsorName) {
            this.SearchTransmissionProjectData(this.selectedCompanyorSponsorName);
        }
    };
    TransmissionProjectsComponent.prototype.SearchTransmissionProjectData = function (SearchTransmissionData) {
        var _this = this;
        var SearchTransmissionProjectData = this.AllTransmissionProjectListdata.filter(function (el) {
            if (el.TransProjectName != null && el.ProjectSponsor != null) {
                if (el.TransProjectName.toLowerCase().indexOf(SearchTransmissionData.toLowerCase().trim()) > -1 || el.ProjectSponsor.toLowerCase().indexOf(SearchTransmissionData.toLowerCase().trim()) > -1) {
                    return el;
                }
            }
        });
        this.TransmissionProjectrowData = null;
        setTimeout(function () {
            if (SearchTransmissionProjectData.length > 0) {
                _this.TransmissionProjectrowData = SearchTransmissionProjectData;
            }
            else {
                _this.TransmissionProjectrowData = _this.fillBlankTransmissionProjectRowinGrid();
            }
        }, 1000);
    };
    TransmissionProjectsComponent.prototype.TransmissionProjectTypeheadOnSelect = function (event) {
        if (event) {
            var val = event.value;
            this.GetTransmissionProjectNameorsponsorId_basedon_search_Value(val);
        }
    };
    TransmissionProjectsComponent.prototype.GetTransmissionProjectNameorsponsorId_basedon_search_Value = function (Name) {
        if (Name) {
            var TransProjectID = this.AllTransmissionProjectListdata.filter(function (el) {
                if (el.TransProjectName == Name) {
                    return el.TransProjectID;
                }
            });
            if (TransProjectID.length > 0) {
                var Id = TransProjectID[0].TransProjectID;
                this.OpenProjectNAmeInNewTab(Id);
                this.searchTransmissionProjectNameOrSponsor();
            }
            else {
                var compnayID = this.AllTransmissionProjectListdata.filter(function (el) {
                    if (el.ProjectSponsor == Name) {
                        return el.TransProjectID;
                    }
                });
                if (compnayID.length > 0) {
                    var cmpnameid = void 0;
                    var ProjectSponsor = compnayID[0].ProjectSponsor;
                    var cmpid = compnayID[0].CompanyID;
                    ProjectSponsor = ProjectSponsor.split('|');
                    cmpid = cmpid.split(',');
                    for (var i = 0; i < ProjectSponsor.length; i++) {
                        var cmpName = ProjectSponsor[i];
                        var id = parseInt(cmpid[i]);
                        if (cmpName == Name) {
                            cmpnameid = id;
                        }
                    }
                    if (cmpnameid) {
                        this.OpenProjectSponsorInnewtab(cmpnameid);
                        this.searchTransmissionProjectNameOrSponsor();
                    }
                    else {
                        this.searchTransmissionProjectNameOrSponsor();
                    }
                }
                else {
                    this.searchTransmissionProjectNameOrSponsor();
                }
            }
        }
    };
    TransmissionProjectsComponent = __decorate([
        core_1.Component({
            selector: 'app-transmission-projects',
            templateUrl: './transmission-projects.component.html',
            styleUrls: ['./transmission-projects.component.scss']
        }),
        __metadata("design:paramtypes", [Intelligence_service_1.IntelligenceService,
            ng_bootstrap_1.NgbModal,
            all_http_request_service_1.HttpRequestService,
            map_service_service_1.MapServiceService])
    ], TransmissionProjectsComponent);
    return TransmissionProjectsComponent;
}());
exports.TransmissionProjectsComponent = TransmissionProjectsComponent;
//# sourceMappingURL=transmission-projects.component.js.map