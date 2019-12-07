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
var map_service_service_1 = require("../../../../services/map-service.service");
var environment_1 = require("../../../../../environments/environment");
var Intelligence_service_1 = require("../../../../services/Intelligence.service");
var Utility_service_1 = require("../../../../services/Utility.service");
var GlobalSearchService_1 = require("../../../../services/GlobalSearchService");
var condensed_component_1 = require("../../../../../app/@pages/layouts/condensed/condensed.component");
var company_profile_detail_modal_component_1 = require("../../../../intelligence/company-profile-detail-modal/company-profile-detail-modal.component");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var layer_data_prop_1 = require("../../../../models/layer-data-prop");
var all_http_request_service_1 = require("../../../../services/all-http-request.service");
var localdata_service_1 = require("../../../../services/localdata.service");
var GlobalSearchResultComponent = (function () {
    function GlobalSearchResultComponent(injector, bsModalRef, authServices, MapServiceService, GlobalSearchServiceService, IntelligenceService, modalService, UtilityService, httpService, LocalDataService) {
        var _this = this;
        this.injector = injector;
        this.bsModalRef = bsModalRef;
        this.authServices = authServices;
        this.MapServiceService = MapServiceService;
        this.GlobalSearchServiceService = GlobalSearchServiceService;
        this.IntelligenceService = IntelligenceService;
        this.modalService = modalService;
        this.UtilityService = UtilityService;
        this.httpService = httpService;
        this.LocalDataService = LocalDataService;
        this.treestatus = "Individual";
        this.FeatureType = "GlobalSearch";
        this.searchedText = '';
        this.dataLayerResults = [];
        this.dataResults = [
            {
                DataName: 'Pipelines',
                Displayname: [{
                        Displayname: 'Owner',
                        Displayname1: 'Operator',
                        Displayname2: 'System Name',
                        Totalcount: 0,
                        Totalcount1: 0,
                        Totalcount2: 0,
                        fieldName: "OWNER",
                        fieldName1: "OPERATOR",
                        fieldName2: "SYSTEM",
                        TableName: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpipelines : '',
                        DBFProperties: this.authServices.GetSystemParameterValue("PipelinesSearchDBFProperties"),
                        DetailPanelProperties: this.authServices.GetSystemParameterValue("PipelinesSearchDetailPanelProperties"),
                        tempLayerDataPropList: [],
                        // DataSetID: parseInt("10000" + 0),
                        DataSetID: 765,
                        isEnergyLayer: true,
                        EnergyLayerDisplayName: "Pipelines search results",
                        EnergyLayerID: 765
                    }]
            },
            {
                DataName: 'Facilities',
                Displayname: [{
                        Displayname: 'Owner',
                        Displayname1: 'Operator',
                        Displayname2: 'Facility Name',
                        Totalcount: 0,
                        Totalcount1: 0,
                        Totalcount2: 0,
                        fieldName: "OWNER",
                        fieldName1: "OPERATOR",
                        fieldName2: "FACNAME",
                        TableName: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xfacilities : '',
                        DBFProperties: this.authServices.GetSystemParameterValue(""),
                        DetailPanelProperties: this.authServices.GetSystemParameterValue("FacilitiesSearchDetailPanelProperties"),
                        tempLayerDataPropList: [],
                        // DataSetID: parseInt("10000" + 1),
                        DataSetID: 764,
                        isEnergyLayer: true,
                        EnergyLayerDisplayName: "Facilities search results",
                        EnergyLayerID: 764
                    }]
            },
            {
                DataName: 'Power Plants',
                Displayname: [{
                        Displayname: 'Owner',
                        Displayname1: 'Operator',
                        Displayname2: 'Plant Name',
                        Totalcount: 0,
                        Totalcount1: 0,
                        Totalcount2: 0,
                        fieldName: "OWNER",
                        fieldName1: "OPERATOR",
                        fieldName2: "FACNAME",
                        TableName: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpowerplants : '',
                        DBFProperties: this.authServices.GetSystemParameterValue(""),
                        DetailPanelProperties: this.authServices.GetSystemParameterValue("PowerPlantsSearchDetailPanelProperties"),
                        tempLayerDataPropList: [],
                        //DataSetID: parseInt("10000" + 2),
                        DataSetID: 766,
                        isEnergyLayer: true,
                        EnergyLayerDisplayName: "Power Plants search results",
                        EnergyLayerID: 766
                    }]
            },
            {
                DataName: 'Substations',
                Displayname: [{
                        Displayname: 'Owner',
                        Displayname1: 'Operator',
                        Displayname2: 'Substation Name',
                        Totalcount: 0,
                        Totalcount1: 0,
                        Totalcount2: 0,
                        fieldName: "OWNER",
                        fieldName1: "OPERATOR",
                        fieldName2: "SUBNAME",
                        TableName: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xsubstations : '',
                        DBFProperties: this.authServices.GetSystemParameterValue(""),
                        DetailPanelProperties: this.authServices.GetSystemParameterValue("SubstationsSearchDetailPanelProperties"),
                        tempLayerDataPropList: [],
                        // DataSetID: parseInt("10000" + 3)
                        DataSetID: 956,
                        isEnergyLayer: true,
                        EnergyLayerDisplayName: "Substations search results",
                        EnergyLayerID: 956
                    }]
            },
            {
                DataName: 'Transmission Lines',
                Displayname: [{
                        Displayname: 'Owner',
                        Displayname1: 'Operator',
                        Displayname2: '',
                        Totalcount: 0,
                        Totalcount1: 0,
                        Totalcount2: 0,
                        fieldName: "OWNER",
                        fieldName1: "OPERATOR",
                        fieldName2: "",
                        TableName: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpowerlines : '',
                        DBFProperties: this.authServices.GetSystemParameterValue(""),
                        DetailPanelProperties: this.authServices.GetSystemParameterValue("TransmissionLinesSearchDetailPanelProperties"),
                        tempLayerDataPropList: [],
                        //DataSetID: parseInt("10000" + 4),
                        DataSetID: 922,
                        isEnergyLayer: true,
                        EnergyLayerDisplayName: "Transmission Lines search results",
                        EnergyLayerID: 922
                    }],
            },
        ];
        this.currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
        this.LoginId = '';
        this.EnergyLayerCount = 0;
        this.LayerLoader = false;
        this.GlobalSearchCategoryID = -12;
        this.CompanyLoader = false;
        this.allCompnayListdata = [];
        this.filteredCompanyList = [];
        this.filteredCompanyListCount = 0;
        this.companyProfMsg = '';
        this.EnergyLayerMsg = '';
        this.EmptyTextMsg = 'No Data for empty search';
        this.loaderImage = environment_1.environment.ImagespreviewPath + "LayerLibraryLoader.gif";
        this.tempLayerDataPropList = [];
        setTimeout(function () { return _this.CondensedComponent = injector.get(condensed_component_1.CondensedComponent); });
        this.MapServiceService.globalsearchData$.subscribe(function () { _this.ngOnInit(); });
    }
    GlobalSearchResultComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
        this.searchedText = $('#txtGlobalSearch').val();
        this.SetModalId();
        if (this.searchedText != "") {
            this.companyProfMsg = '';
            this.EnergyLayerMsg = 'No Data Found';
            this.GetEnergyLayerDataResults();
            this.GetFilteredCompanyProfileData();
        }
        else {
            this.ClearData();
        }
        this.RemoveActivetemptreeLayer();
        setTimeout(function () {
            _this.getAllTempLayerList();
        }, 1000);
    };
    GlobalSearchResultComponent.prototype.ClearData = function () {
        this.companyProfMsg = this.EmptyTextMsg;
        this.EnergyLayerMsg = this.EmptyTextMsg;
        this.filteredCompanyListCount = 0;
        this.EnergyLayerCount = 0;
        this.dataLayerResults = [];
        this.filteredCompanyList = [];
    };
    //#region CompanyProfile
    GlobalSearchResultComponent.prototype.GetFilteredCompanyProfileData = function () {
        var _this = this;
        this.CompanyLoader = true;
        var sText = this.searchedText.toLowerCase().trim();
        this.httpService._NodeGetFilterdCompanyList(sText).subscribe(function (data) {
            if (data && data._Issuccess == true) {
                // this.allCompnayListdata = data.CompanyList;
                _this.filteredCompanyList = data.CompanyList;
                _this.filteredCompanyListCount = data.CompanyList.length;
            }
            _this.CompanyLoader = false;
        }, function (error) {
            _this.CompanyLoader = false;
        });
    };
    GlobalSearchResultComponent.prototype.OpenCompanyDetails = function (CompanyID) {
        var URL = "/assets/CompanyProfileDetail.html";
        URL = window.location.origin + URL + "?t=" + CompanyID;
        var modalRef = this.modalService.open(company_profile_detail_modal_component_1.CompanyPorfileDetailModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "CompanyProfileviewDetail" });
        modalRef.componentInstance.URL = URL;
    };
    //#endregion
    //#region EnergyLayer
    GlobalSearchResultComponent.prototype.GetEnergyLayerDataResults = function () {
        var _this = this;
        if (!this.MapServiceService._GlobalsearchLayerList.getValue() || this.IsExistsornot(this.GlobalSearchCategoryID) == false) {
            this.LayerLoader = true;
            this.LoginId = this.authServices.getLoggedinUserId();
            this.httpService._NodeGetglobalSearchEnergylayer(this.LoginId, "Energy Layer Group", this.searchedText, 500, 0).subscribe(function (data) {
                _this.LayerLoader = false;
                // let LayersLibrary = data.json();
                // let res = JSON.parse(LayersLibrary);
                var res = data.json();
                if (res.errormsg == "") {
                    res["IsLoaded"] = true;
                    var layer = res.LayerLibrary.map(function (el) {
                        if (el.PreviewImage) {
                            el.PreviewImage = _this.MapServiceService.getPreviewImageLink(el.PreviewImage);
                        }
                        var o = Object.assign({}, el);
                        o.ViewData = 'View Data';
                        o.Addtomap = 'Add to map';
                        return o;
                    });
                    var DefaultLayer = [
                        {
                            CategoryID: _this.GlobalSearchCategoryID,
                            LayerLibrary: layer,
                            Totalcount: parseInt(res.TotalCount),
                            searchedText: _this.searchedText
                        }
                    ];
                    if (_this.MapServiceService._GlobalsearchLayerList.getValue()) {
                        _this.MapServiceService._GlobalsearchLayerList.getValue().length = 0;
                        Array.prototype.push.apply(_this.MapServiceService._GlobalsearchLayerList.getValue(), DefaultLayer);
                    }
                    else {
                        _this.MapServiceService.setGlobaleSearchEnergyLayer(DefaultLayer);
                    }
                    // this.EnergyLayerCount = this.dataLayerResults.length;
                    _this.DisplayLayres(_this.GlobalSearchCategoryID);
                }
                else {
                    _this.LayerLoader = false;
                    console.log(res.error);
                }
            }, function (error) {
                _this.LayerLoader = false;
                console.log(error);
            });
        }
        else {
            this.DisplayLayres(this.GlobalSearchCategoryID);
        }
    };
    GlobalSearchResultComponent.prototype.IsExistsornot = function (categoryId) {
        var isActive = false;
        if (this.MapServiceService._GlobalsearchLayerList.getValue()) {
            for (var _i = 0, _a = this.MapServiceService._GlobalsearchLayerList.getValue(); _i < _a.length; _i++) {
                var a = _a[_i];
                if (a.CategoryID == categoryId && this.searchedText == a.searchedText) {
                    isActive = true;
                }
            }
        }
        return isActive;
    };
    GlobalSearchResultComponent.prototype.DisplayLayres = function (categoryId) {
        var isActive = false;
        var LayerList;
        if (this.MapServiceService._GlobalsearchLayerList.getValue()) {
            for (var _i = 0, _a = this.MapServiceService._GlobalsearchLayerList.getValue(); _i < _a.length; _i++) {
                var a = _a[_i];
                if (a.CategoryID == categoryId) {
                    isActive = true;
                    LayerList = a;
                }
            }
        }
        if (isActive == true) {
            //this.MapServiceService.setActiveLayerslist(DefaultLayer);
            this.dataLayerResults.length = 0;
            //this.dataLayerResults.push(LayerList.LayerLibrary);
            Array.prototype.push.apply(this.dataLayerResults, LayerList.LayerLibrary);
            this.EnergyLayerCount = this.dataLayerResults.length;
            // this.DisplayingCount = this.ActiveMapLayersLibrary[0].LayerLibrary.length;
        }
        this.LayerLoader = false;
    };
    GlobalSearchResultComponent.prototype.GlobalSearchAddtomapClick = function (LayerId, CategoryId) {
        if (this.MapServiceService._GlobalsearchLayerList.getValue()) {
            for (var _i = 0, _a = this.MapServiceService._GlobalsearchLayerList.getValue(); _i < _a.length; _i++) {
                var a = _a[_i];
                if (a.CategoryID == CategoryId) {
                    var IsLoaded = false;
                    var _loop_1 = function (e) {
                        if (e.EnergyLayerID == LayerId && !IsLoaded) {
                            IsLoaded = true;
                            if (e.Addtomap == 'Add to map') {
                                e.Addtomap = 'Remove from map';
                                this_1.CondensedComponent.GetTreeData(LayerId);
                            }
                            else {
                                e.Addtomap = 'Add to map';
                                var EnergyLayerID_1 = e.EnergyLayerID + 'RemoveTreeData';
                                setTimeout(function () {
                                    var element = document.getElementById(EnergyLayerID_1);
                                    element.click();
                                }, 1000);
                            }
                        }
                    };
                    var this_1 = this;
                    for (var _b = 0, _c = a.LayerLibrary; _b < _c.length; _b++) {
                        var e = _c[_b];
                        _loop_1(e);
                    }
                }
            }
        }
    };
    GlobalSearchResultComponent.prototype.getAllTempLayerList = function () {
        try {
            this.MapServiceService.LayerIndex.getValue().value = this.currentIndexVal + 1;
            this.currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
            for (var t = 0; t < this.dataResults.length; t++) {
                if (!this.authServices.ShowOilAndGasUIBasedOnRole() && (this.dataResults[t].DataName.toLowerCase() == "pipelines" || this.dataResults[t].DataName.toLowerCase() == "facilities"))
                    this.dataResults[t].DataName = "";
                if (!this.authServices.ShowElectricPowerUIBasedOnRole() && (this.dataResults[t].DataName.toLowerCase() == "power plants" || this.dataResults[t].DataName.toLowerCase() == "substations" || this.dataResults[t].DataName.toLowerCase() == "transmission lines"))
                    this.dataResults[t].DataName = "";
                var _objtemp = this.dataResults[t];
                var DataSetName = this.dataResults[t].DataName;
                if (DataSetName) {
                    var temp = this.dataResults[t].Displayname[0];
                    var filterval = this.searchedText == '' ? '' : this.searchedText;
                    var tempLayerObjPropObj = new layer_data_prop_1.tempLayerDataProp();
                    if (DataSetName == "Pipelines") {
                        tempLayerObjPropObj.RepresentationType = "Line";
                        tempLayerObjPropObj.IconType = "Line";
                        tempLayerObjPropObj.SizePercent = 100;
                        tempLayerObjPropObj.StrokeThicknessPercent = 5;
                        tempLayerObjPropObj.Opacity = 1;
                    }
                    if (DataSetName == "Facilities") {
                        tempLayerObjPropObj.RepresentationType = "Point";
                        tempLayerObjPropObj.IconType = "Storage";
                        tempLayerObjPropObj.SizePercent = 50;
                        tempLayerObjPropObj.StrokeThicknessPercent = 18;
                        tempLayerObjPropObj.Opacity = 1;
                    }
                    if (DataSetName == "Power Plants") {
                        tempLayerObjPropObj.RepresentationType = "Point";
                        tempLayerObjPropObj.IconType = "Rectangle";
                        tempLayerObjPropObj.SizePercent = 50;
                        tempLayerObjPropObj.StrokeThicknessPercent = 5;
                        tempLayerObjPropObj.Opacity = 1;
                    }
                    if (DataSetName == "Substations") {
                        tempLayerObjPropObj.RepresentationType = "Point";
                        tempLayerObjPropObj.IconType = "Pentagram";
                        tempLayerObjPropObj.SizePercent = 50;
                        tempLayerObjPropObj.StrokeThicknessPercent = 5;
                        tempLayerObjPropObj.Opacity = 1;
                    }
                    if (DataSetName == "Transmission Lines") {
                        tempLayerObjPropObj.RepresentationType = "Line";
                        tempLayerObjPropObj.IconType = "Line";
                        tempLayerObjPropObj.SizePercent = 100;
                        tempLayerObjPropObj.StrokeThicknessPercent = 5;
                        tempLayerObjPropObj.Opacity = 1;
                    }
                    if (this.searchedText) {
                        tempLayerObjPropObj.DataSetName = DataSetName + " - " + this.searchedText;
                        tempLayerObjPropObj.Description = DataSetName + " - " + this.searchedText;
                        tempLayerObjPropObj.Tags = DataSetName + " - " + this.searchedText;
                    }
                    else {
                        tempLayerObjPropObj.DataSetName = DataSetName;
                        tempLayerObjPropObj.Description = DataSetName;
                        tempLayerObjPropObj.Tags = DataSetName;
                    }
                    tempLayerObjPropObj.DataSetID = temp.DataSetID;
                    tempLayerObjPropObj.EnergyLayerID = tempLayerObjPropObj.DataSetID;
                    tempLayerObjPropObj.EnergyParentID = 0;
                    tempLayerObjPropObj.ParentDataSetID = 0;
                    tempLayerObjPropObj["DisplayName"] = temp.EnergyLayerDisplayName;
                    tempLayerObjPropObj.isEnergyLayer = temp.isEnergyLayer;
                    tempLayerObjPropObj.TableName = temp.TableName;
                    tempLayerObjPropObj.DetailPanelPropertiesMain = temp.DBFProperties;
                    tempLayerObjPropObj.DBFProperties = temp.DBFProperties;
                    tempLayerObjPropObj.DetailPanelProperties = temp.DetailPanelProperties;
                    tempLayerObjPropObj.StrokeColor = "FF" + this.UtilityService.getRandomColor();
                    //tempLayerObjPropObj.FillColor = "FF" + this.MapServiceService.getRandomColor();
                    tempLayerObjPropObj.FillColor = tempLayerObjPropObj.StrokeColor;
                    tempLayerObjPropObj.UploadedBy = this.authServices.getLoggedinUserId();
                    tempLayerObjPropObj.Layerindexval = this.currentIndexVal;
                    tempLayerObjPropObj.FeatureType = this.FeatureType;
                    this.dataResults[t].Displayname[0].tempLayerDataPropList = [];
                    this.dataResults[t].Displayname[0].tempLayerDataPropList.push(tempLayerObjPropObj);
                    var defaultfilter = '';
                    var cqlfilter = '';
                    var Filterval = '';
                    if (temp.fieldName) {
                        if (filterval) {
                            if (Filterval) {
                                Filterval += '#OR#' + temp.fieldName + "#LIKE#" + filterval;
                            }
                            else {
                                Filterval = temp.fieldName + "#LIKE#" + filterval;
                            }
                            defaultfilter = ' (' + temp.fieldName + ' ILIKE ' + "'%25" + encodeURIComponent(filterval) + "%25')";
                            cqlfilter = '&CQL_FILTER=(' + defaultfilter + ')';
                        }
                        this.gettotalcount(t, "Totalcount", tempLayerObjPropObj, cqlfilter);
                    }
                    if (temp.fieldName1) {
                        if (filterval) {
                            if (Filterval) {
                                Filterval += '#OR#' + temp.fieldName1 + "#LIKE#" + filterval;
                            }
                            else {
                                Filterval = temp.fieldName1 + "#LIKE#" + filterval;
                            }
                            defaultfilter = ' (' + temp.fieldName1 + ' ILIKE ' + "'%25" + encodeURIComponent(filterval) + "%25')";
                            cqlfilter = '&CQL_FILTER=(' + defaultfilter + ')';
                        }
                        this.gettotalcount(t, "Totalcount1", tempLayerObjPropObj, cqlfilter);
                    }
                    if (temp.fieldName2) {
                        if (filterval) {
                            if (Filterval) {
                                Filterval += '#OR#' + temp.fieldName2 + "#LIKE#" + filterval;
                            }
                            else {
                                Filterval = temp.fieldName2 + "#LIKE#" + filterval;
                            }
                            defaultfilter = ' (' + temp.fieldName2 + ' ILIKE ' + "'%25" + encodeURIComponent(filterval) + "%25')";
                            cqlfilter = '&CQL_FILTER=(' + defaultfilter + ')';
                        }
                        this.gettotalcount(t, "Totalcount2", tempLayerObjPropObj, cqlfilter);
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    GlobalSearchResultComponent.prototype.gettotalcount = function (t, TotalCountofFieldname, tempLayerObjPropObj, CQL_FILTER) {
        var _this = this;
        var UserId = this.authServices.getLoggedinUserId();
        this.httpService._NodegetLayerData(tempLayerObjPropObj, 0, 1, CQL_FILTER, '', '', UserId)
            .then(function (data) {
            var Data = data;
            if (Data["totalFeatures"]) {
                // if (data['_body'].indexOf('totalFeatures') > 0) {
                var total = Data.totalFeatures;
                _this.dataResults[t].Displayname[0][TotalCountofFieldname] = total;
            }
        }).catch(function (ex) {
            console.log(ex);
        });
    };
    //#endregion
    GlobalSearchResultComponent.prototype.SetModalId = function () {
        var _this = this;
        setTimeout(function () {
            if (!document.getElementById('globalSearchModal')) {
                var modalDiv = document.getElementsByClassName('globalSearch-modal')[0];
                var modalElement = $(modalDiv).parents('.modal');
                $(modalElement).attr('id', 'globalSearchModal');
                _this.SetModal('globalSearchModal');
                $('.modal-dialog').draggable({
                    handle: ".modal-header"
                });
            }
        }, 100);
    };
    GlobalSearchResultComponent.prototype.SetModal = function (modalname) {
        $("#" + modalname + " .modal-dialog").css({
            position: 'fixed',
            width: $("#" + modalname + " .modal-content").width(),
            height: $("#" + modalname + " .modal-content").height(), margin: '0px'
        });
        $("#" + modalname).css({
            position: 'fixed',
            width: $("#" + modalname + " .modal-dialog").width(),
            height: $("#" + modalname + " .modal-dialog").height()
        });
        $('.modal').css('background', 'rgba(0,0,0,0)');
        $("#" + modalname).css({
            left: ($(window).width() - $('#' + modalname).outerWidth()) / 2,
            top: ($(window).height() - $('#' + modalname).outerHeight()) / 2,
        });
        $('.modal-backdrop').hide();
        setTimeout(function () {
            $("#" + modalname).css({
                height: '0px',
                top: ($(window).height() - $('#' + modalname).outerHeight()) / 2,
            });
        }, 500);
    };
    GlobalSearchResultComponent.prototype.Showallresultsonmap = function () {
        var Treedatalist = [];
        for (var s = 0; s < this.dataResults.length; s++) {
            var DataSetName = this.dataResults[s].DataName;
            if (DataSetName) {
                var temp = this.dataResults[s].Displayname[0];
                var tempobj = this.dataResults[s].Displayname[0].tempLayerDataPropList[0];
                Treedatalist.push(this.getsingaleTree(tempobj));
                var filterval = this.searchedText == '' ? '' : this.searchedText;
                var Filterval = '';
                if (temp.fieldName) {
                    if (filterval) {
                        if (Filterval) {
                            Filterval += '#OR#' + temp.fieldName + "#LIKE#" + filterval;
                        }
                        else {
                            Filterval = temp.fieldName + "#LIKE#" + filterval;
                        }
                    }
                }
                if (temp.fieldName1) {
                    if (filterval) {
                        if (Filterval) {
                            Filterval += '#OR#' + temp.fieldName1 + "#LIKE#" + filterval;
                        }
                        else {
                            Filterval = temp.fieldName1 + "#LIKE#" + filterval;
                        }
                    }
                }
                if (temp.fieldName2) {
                    if (filterval) {
                        if (Filterval) {
                            Filterval += '#OR#' + temp.fieldName2 + "#LIKE#" + filterval;
                        }
                        else {
                            Filterval = temp.fieldName2 + "#LIKE#" + filterval;
                        }
                    }
                }
                tempobj.FilterValue = Filterval;
                tempobj.TreeStatus = this.treestatus;
                if (tempobj.DBFProperties != 'undefined' && tempobj.DBFProperties == '' && tempobj.DetailPanelProperties != 'undefined' && tempobj.DetailPanelProperties != '') {
                    var DetailPanelPro = tempobj.DetailPanelProperties.split(',');
                    if (DetailPanelPro.length > 0) {
                        for (var _i = 0, DetailPanelPro_1 = DetailPanelPro; _i < DetailPanelPro_1.length; _i++) {
                            var prop = DetailPanelPro_1[_i];
                            var p = prop.split("=");
                            tempobj.DBFProperties += p[1] + ',';
                        }
                        tempobj.DBFProperties = tempobj.DBFProperties.substring(0, tempobj.DBFProperties.length - 1);
                        ;
                    }
                }
                //tempobj.Layerindexval = this.currentIndexVal;
                this.AddLayeronTempVariable(tempobj);
            }
        }
        if (Treedatalist.length > 0) {
            this.CondensedComponent.SetTemporaryTreeNode(Treedatalist);
        }
        this.CloseGlobalSearchResultModal();
    };
    GlobalSearchResultComponent.prototype.getsingaleTree = function (tempobj) {
        var Tree = {
            Id: tempobj.DataSetID,
            Name: tempobj.DataSetName,
            activeCount: 0,
            IconUrl: environment_1.environment.GetLayerIconURL + "/icongenerate/get/?Id=" + tempobj.DataSetID + "&URLType=CustomStyleIcon&FillColor=" + tempobj.FillColor + "&IconType=" + tempobj.IconType + "&StrokeColor=" + tempobj.StrokeColor + "&SizePercent=" + tempobj.SizePercent + "&StrokeThicknessPercent=" + tempobj.StrokeThicknessPercent + "&Opacity=" + tempobj.Opacity,
            IsChecked: true,
            treestatus: this.treestatus,
            FeatureType: this.FeatureType
        };
        return Tree;
    };
    GlobalSearchResultComponent.prototype.RemoveActivetemptreeLayer = function () {
        var _loop_2 = function (t) {
            var _objtemp = this_2.dataResults[t];
            var DataSetName = this_2.dataResults[t].DataName;
            var temp = this_2.dataResults[t].Displayname[0];
            this_2.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
            var treeUI = this_2.MapServiceService._TemporaryTreeUI.getValue();
            if (DataSetName) {
                // if (temp.DataSetID >= 100000 && temp.DataSetID <= 200006) {
                var TempTreeData = treeUI.treeModel.getNodeById(temp.DataSetID);
                if (TempTreeData && TempTreeData.data && !TempTreeData.data.IsChecked) {
                    var EnergyLayerID_2 = temp.DataSetID + 'RemovetemporaryTreeData';
                    setTimeout(function () {
                        var element = document.getElementById(EnergyLayerID_2);
                        if (element) {
                            element.click();
                        }
                    }, 500);
                }
                // }
            }
        };
        var this_2 = this;
        for (var t = 0; t < this.dataResults.length; t++) {
            _loop_2(t);
        }
    };
    GlobalSearchResultComponent.prototype.CountClick = function (fieldName, dataName) {
        var selectedDataResult = [];
        var Treedatalist = [];
        this.dataResults.map(function (d) {
            if (d.DataName && d.DataName != '' && d.DataName != undefined && d.DataName.toLowerCase() == dataName.toLowerCase()) {
                selectedDataResult.push(d);
            }
        });
        for (var s = 0; s < selectedDataResult.length; s++) {
            var DataSetName = selectedDataResult[s].DataName;
            if (DataSetName) {
                var tempobj = selectedDataResult[s].Displayname[0].tempLayerDataPropList[0];
                if (this.searchedText != "" && fieldName)
                    tempobj.FilterValue = fieldName + "#LIKE#" + this.searchedText;
                tempobj.TreeStatus = this.treestatus;
                if (tempobj.DBFProperties != 'undefined' && tempobj.DBFProperties == '' && tempobj.DetailPanelProperties != 'undefined' && tempobj.DetailPanelProperties != '') {
                    var DetailPanelPro = tempobj.DetailPanelProperties.split(',');
                    if (DetailPanelPro.length > 0) {
                        for (var _i = 0, DetailPanelPro_2 = DetailPanelPro; _i < DetailPanelPro_2.length; _i++) {
                            var prop = DetailPanelPro_2[_i];
                            var p = prop.split("=");
                            tempobj.DBFProperties += p[1] + ',';
                        }
                        tempobj.DBFProperties = tempobj.DBFProperties.substring(0, tempobj.DBFProperties.length - 1);
                        ;
                    }
                }
                this.AddLayeronTempVariable(tempobj);
                Treedatalist.push(this.getsingaleTree(tempobj));
            }
        }
        if (Treedatalist.length > 0) {
            this.CondensedComponent.SetTemporaryTreeNode(Treedatalist);
        }
        this.CloseGlobalSearchResultModal();
    };
    GlobalSearchResultComponent.prototype.CloseGlobalSearchResultModal = function () {
        var globalSearchClosebtn = document.getElementById("btnglobalSearchClose");
        if (globalSearchClosebtn != null)
            globalSearchClosebtn.click();
    };
    GlobalSearchResultComponent.prototype.AddLayeronTempVariable = function (tempobj) {
        // if (this.MapServiceService.LayerIndex.getValue()) {
        //   let currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
        //   tempobj["Layerindexval"] = currentIndexVal;
        //   // this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
        // }
        this.MapServiceService.temporaryLayer.push(tempobj);
    };
    GlobalSearchResultComponent = __decorate([
        core_1.Component({
            selector: 'app-global-search-result',
            templateUrl: './global-search-result.component.html',
            styleUrls: ['./global-search-result.component.scss']
        }),
        __metadata("design:paramtypes", [core_1.Injector,
            ngx_bootstrap_1.BsModalRef,
            auth_service_1.AuthenticationService,
            map_service_service_1.MapServiceService,
            GlobalSearchService_1.GlobalSearchServiceService,
            Intelligence_service_1.IntelligenceService,
            ng_bootstrap_1.NgbModal,
            Utility_service_1.UtilityService,
            all_http_request_service_1.HttpRequestService,
            localdata_service_1.LocalDataService])
    ], GlobalSearchResultComponent);
    return GlobalSearchResultComponent;
}());
exports.GlobalSearchResultComponent = GlobalSearchResultComponent;
//# sourceMappingURL=global-search-result.component.js.map