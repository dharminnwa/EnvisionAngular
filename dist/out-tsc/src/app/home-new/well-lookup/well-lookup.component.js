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
var auth_service_1 = require("../../services/auth.service");
var map_service_service_1 = require("../../services/map-service.service");
var all_http_request_service_1 = require("../../services/all-http-request.service");
var layer_data_prop_1 = require("../../models/layer-data-prop");
var Utility_service_1 = require("../../services/Utility.service");
var environment_1 = require("../../../environments/environment");
var layouts_1 = require("../../@pages/layouts");
var WellLookupComponent = (function () {
    function WellLookupComponent(AuthServices, MapServiceService, httpService, utilityService, injector) {
        var _this = this;
        this.AuthServices = AuthServices;
        this.MapServiceService = MapServiceService;
        this.httpService = httpService;
        this.utilityService = utilityService;
        this.injector = injector;
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
        this.LayerLoader = false;
        this.States = [];
        this.StateModelList = [];
        this.Counties = [];
        this.WellTypes = [];
        this.WellStatuses = [];
        this.searchWellsLookup = '';
        this.selectedState = [];
        this.selectedCountries = [];
        this.selectedWellTypes = [];
        this.selectedWellStatuses = [];
        this.dropdownSettingsSingle = {};
        this.dropdownSettingsMulty = {};
        this.WellLookupData = {
            //DataSetID: "200006",
            DataSetID: "964",
            PreviewImage: "http://mapsearch360.com/images/datasetimage.png",
            ApiFieldName: "API",
            OperatorFieldName: "Operator",
            WellNameFieldName: "WellName",
            LeaseNameFieldName: "LeaseName",
            LeaseFieldName: "Lease",
            WellTypeFieldName: "WellType",
            StatusFieldName: "Status",
            WellStatusFieldName: "WellStatus",
            CountyFieldName: "County",
            isEnergyLayer: true,
            EnergyLayerDisplayName: "Wells search results",
            EnergyLayerID: "964"
        };
        setTimeout(function () { return _this.CondensedComponent = injector.get(layouts_1.CondensedComponent); });
    }
    WellLookupComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dropdownSettingsSingle = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            maxHeight: 120,
        };
        this.dropdownSettingsMulty = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            maxHeight: 120,
            itemsShowLimit: 2,
            disabled: true,
            enableCheckAll: false,
        };
        this.StateModelList = this.MapServiceService.wellStateData.getValue();
        if (this.StateModelList != null && this.StateModelList.length > 0) {
            for (var i = 0; i < this.StateModelList.length; i++) {
                this.States.push({ 'item_id': this.StateModelList[i].StateID, 'item_text': this.StateModelList[i].StateName });
            }
        }
        else {
            if (this.AuthServices.ShowWellLookupWidgetUIBasedOnRole())
                this.GetWellStateData();
        }
        this._permissionsSubscription = this.MapServiceService.sitePermissions.subscribe(function (data) {
            if (data)
                _this.ShowWidgetBasedOnRole();
        });
        setTimeout(function () {
            _this.ClearFilters();
        }, 1000);
    };
    WellLookupComponent.prototype.ngOnDestroy = function () {
        if (this._permissionsSubscription)
            this._permissionsSubscription.unsubscribe();
    };
    WellLookupComponent.prototype.onItemSelect = function (item) {
    };
    WellLookupComponent.prototype.onSelectAll = function (items) {
    };
    WellLookupComponent.prototype.GetWellStateData = function () {
        var _this = this;
        this.LayerLoader = true;
        this.httpService._NodeGetWellStates().subscribe(function (data) {
            if (data._Issuccess) {
                var jsonData = data.WellsstateData;
                _this.States = [];
                _this.StateModelList = jsonData;
                for (var i = 0; i < jsonData.length; i++) {
                    _this.States.push({ 'item_id': jsonData[i].StateID, 'item_text': jsonData[i].StateProvince });
                }
                _this.MapServiceService.setWellStates(_this.StateModelList);
            }
            _this.LayerLoader = false;
        }, function (error) {
            console.log(error);
            _this.LayerLoader = false;
        });
    };
    WellLookupComponent.prototype.onSelectState = function (item) {
        var StateModel = this.StateModelList.filter(function (m) { return m.StateID === item.item_id; });
        if (StateModel) {
            var cts = StateModel[0].Counties;
            var wTypes = StateModel[0].WellType;
            var wStatuses = StateModel[0].WellStatus;
            this.Counties = [];
            this.WellTypes = [];
            this.WellStatuses = [];
            if (cts != null && cts.length > 0) {
                cts.sort();
                for (var i = 0; i < cts.length; i++) {
                    if (cts[i]) {
                        this.Counties.push({ 'item_id': i, 'item_text': cts[i] });
                    }
                }
                this.isShowCounties = true;
                this.isDisabledCounties = false;
                // (<HTMLInputElement>document.getElementById("ddWellCounty")).classList.remove('hide', 'disabled');
            }
            else {
                this.isShowCounties = false;
                // (<HTMLInputElement>document.getElementById("ddWellCounty")).classList.add('hide');
            }
            if (wTypes != null && wTypes.length > 0) {
                wTypes.sort();
                for (var i = 0; i < wTypes.length; i++) {
                    if (wTypes[i]) {
                        this.WellTypes.push({ 'item_id': i, 'item_text': wTypes[i] });
                    }
                }
                this.isShowType = true;
                this.isDisabledType = false;
                // (<HTMLInputElement>document.getElementById("ddWellType")).classList.remove('hide', 'disabled');
            }
            else {
                this.isShowType = false;
                // (<HTMLInputElement>document.getElementById("ddWellType")).classList.add('hide');
            }
            if (wStatuses != null && wStatuses.length > 0) {
                wStatuses.sort();
                for (var i = 0; i < wStatuses.length; i++) {
                    if (wStatuses[i]) {
                        this.WellStatuses.push({ 'item_id': i, 'item_text': wStatuses[i] });
                    }
                }
                this.isShowStatus = true;
                this.isDisabledStatus = false;
                // (<HTMLInputElement>document.getElementById("ddWellStatus")).classList.remove('hide', 'disabled')
            }
            else {
                this.isShowStatus = false;
                // (<HTMLInputElement>document.getElementById("ddWellStatus")).classList.add('hide');
            }
        }
    };
    WellLookupComponent.prototype.ClearFilters = function () {
        this.selectedState = [];
        this.Counties = [];
        this.WellTypes = [];
        this.WellStatuses = [];
        this.selectedState = [];
        this.selectedCountries = [];
        this.selectedWellTypes = [];
        this.selectedWellStatuses = [];
        this.searchWellsLookup = '';
        this.isDisabledCounties = true;
        this.isDisabledStatus = true;
        this.isDisabledType = true;
        this.isShowCounties = true;
        this.isShowStatus = true;
        this.isShowType = true;
        // (<HTMLInputElement>document.getElementById("ddWellType")).classList.add('disabled');
        // (<HTMLInputElement>document.getElementById("ddWellStatus")).classList.add('disabled');
        // (<HTMLInputElement>document.getElementById("ddWellCounty")).classList.add('disabled');
        // (<HTMLInputElement>document.getElementById("ddWellType")).classList.remove('hide');
        // (<HTMLInputElement>document.getElementById("ddWellStatus")).classList.remove('hide');
        // (<HTMLInputElement>document.getElementById("ddWellCounty")).classList.remove('hide');
    };
    WellLookupComponent.prototype.ShowWidgetBasedOnRole = function () {
        if (!this.AuthServices.ShowWellLookupWidgetUIBasedOnRole()) {
            $("#OilAndGasTabHeader").parent().parent().addClass("disabled disable-tab");
            $("#wellLookupCard .card-header").addClass("disable-cardHeader");
            $("#wellLookupCard .card-body").addClass("disable-cardBody");
            $("#wellLookupCard .card-body .tab-content-wrapper").addClass("disable-cardBody");
            $("#wellLookupCard").addClass("disabled");
        }
    };
    WellLookupComponent.prototype.SearchAssets = function () {
        if (this.selectedState && this.selectedState.length > 0) {
            var state_1 = this.selectedState[0];
            var StateModel = this.StateModelList.find(function (x) { return x.StateID == state_1.item_id; });
            if (StateModel) {
                var tempDataObj = this.getTempObject(StateModel);
                var filter = this.getFilter(StateModel);
                tempDataObj.FilterValue = filter;
                this.SetTree(this.WellLookupData, tempDataObj);
                var tree = [];
                tree.push(this.getsingaleTree(tempDataObj));
                if (tree.length > 0) {
                    this.CondensedComponent.Redirect('maps');
                    this.CondensedComponent.SetTemporaryTreeNodeForWidget(tree);
                }
            }
        }
    };
    WellLookupComponent.prototype.getFilter = function (StateProps) {
        var _this = this;
        var filterValue = '';
        var PropertiesArr = StateProps.DetailPanelPropertiesMain.split(',');
        if (this.searchWellsLookup && StateProps && StateProps.DetailPanelPropertiesMain) {
            if (PropertiesArr && PropertiesArr.length > 0) {
                PropertiesArr.forEach(function (x) {
                    if (x.toLowerCase() == 'API'.toLowerCase())
                        filterValue += _this.WellLookupData.ApiFieldName + '#LIKE#' + _this.searchWellsLookup + '#OR#';
                    if (x.toLowerCase() == 'Operator'.toLowerCase())
                        filterValue += _this.WellLookupData.OperatorFieldName + '#LIKE#' + _this.searchWellsLookup + '#OR#';
                    if (x.toLowerCase() == 'Lease'.toLowerCase())
                        filterValue += _this.WellLookupData.LeaseFieldName + '#LIKE#' + _this.searchWellsLookup + '#OR#';
                    if (x.toLowerCase() == 'LeaseName'.toLowerCase())
                        filterValue += _this.WellLookupData.LeaseNameFieldName + '#LIKE#' + _this.searchWellsLookup + '#OR#';
                    if (x.toLowerCase() == 'WellName'.toLowerCase())
                        filterValue += _this.WellLookupData.WellNameFieldName + '#LIKE#' + _this.searchWellsLookup + '#OR#';
                });
                if (filterValue)
                    filterValue += ';';
            }
            // filterValue = this.WellLookupData.ApiFieldName + '#LIKE#' + this.searchWellsLookup + '#OR#' + this.WellLookupData.OperatorFieldName + '#LIKE#' + this.searchWellsLookup + '#OR#' + this.WellLookupData.LeaseNameFieldName + '#LIKE#' + this.searchWellsLookup + ';';
        }
        filterValue += this.SetEqualOrFilterFromArray(this.WellLookupData.WellTypeFieldName, this.selectedWellTypes, '#LIKE#');
        filterValue += ';';
        var statusFieldName = PropertiesArr.find(function (x) { return x == 'Status' || x == 'WellStatus'; });
        if (statusFieldName == 'WellStatus') {
            filterValue += this.SetEqualOrFilterFromArray(this.WellLookupData.WellStatusFieldName, this.selectedWellStatuses, '#LIKE#');
        }
        else if (statusFieldName == 'Status') {
            filterValue += this.SetEqualOrFilterFromArray(this.WellLookupData.StatusFieldName, this.selectedWellStatuses, '#LIKE#');
        }
        filterValue += ';';
        filterValue += this.SetEqualOrFilterFromArray(this.WellLookupData.CountyFieldName, this.selectedCountries, '#LIKE#');
        return filterValue;
    };
    WellLookupComponent.prototype.SetEqualOrFilterFromArray = function (fieldName, List, equalVal) {
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
    WellLookupComponent.prototype.getsingaleTree = function (tempobj) {
        var Tree = {
            Id: tempobj.DataSetID,
            Name: tempobj.DataSetName,
            activeCount: 0,
            IconUrl: environment_1.environment.GetLayerIconURL + "/icongenerate/get/?Id=" + tempobj.DataSetID + "&URLType=CustomStyleIcon&FillColor=" + tempobj.FillColor + "&IconType=" + tempobj.IconType + "&StrokeColor=" + tempobj.StrokeColor + "&SizePercent=" + tempobj.SizePercent + "&StrokeThicknessPercent=" + tempobj.StrokeThicknessPercent + "&Opacity=" + tempobj.Opacity,
            IsChecked: true,
        };
        return Tree;
    };
    WellLookupComponent.prototype.SetTree = function (temp, tempLayerObjPropObj) {
        this.RemovelayerFromTree(temp.DataSetID);
        this.AddLayeronTempVariable(tempLayerObjPropObj);
    };
    WellLookupComponent.prototype.RemovelayerFromTree = function (DatasetId) {
        var tempLayerTreeData = this.MapServiceService.TemporaryTreeNode.getValue();
        var facilitiesData = tempLayerTreeData.find(function (x) { return x.Id == DatasetId; });
        if (facilitiesData)
            this.utilityService.ActiveLayerData(DatasetId, 'RemovetemporaryTreeData');
    };
    WellLookupComponent.prototype.AddLayeronTempVariable = function (tempobj) {
        if (this.MapServiceService.LayerIndex.getValue()) {
            var currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
            tempobj["Layerindexval"] = currentIndexVal;
            this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
        }
        this.MapServiceService.temporaryLayer.push(tempobj);
    };
    WellLookupComponent.prototype.getTempObject = function (State) {
        var tempLayerObjPropObj = new layer_data_prop_1.tempLayerDataProp();
        tempLayerObjPropObj.RepresentationType = "Point";
        tempLayerObjPropObj.IconType = "Circle";
        tempLayerObjPropObj.SizePercent = 50;
        tempLayerObjPropObj.StrokeThicknessPercent = 5;
        tempLayerObjPropObj.Opacity = 1;
        tempLayerObjPropObj.DataSetID = this.WellLookupData.DataSetID;
        tempLayerObjPropObj.EnergyLayerID = tempLayerObjPropObj.DataSetID;
        tempLayerObjPropObj.TableName = State.WMSLayer;
        tempLayerObjPropObj.DetailPanelPropertiesMain = State.DetailPanelPropertiesMain;
        tempLayerObjPropObj.DBFProperties = State.DBFProperties;
        tempLayerObjPropObj.DetailPanelProperties = State.DetailPanelProperties;
        tempLayerObjPropObj.StrokeColor = "FF" + this.utilityService.getRandomColor();
        tempLayerObjPropObj.FillColor = tempLayerObjPropObj.StrokeColor;
        tempLayerObjPropObj.UploadedBy = this.AuthServices.getLoggedinUserId();
        var TreeName = 'Wells ';
        if (this.searchWellsLookup) {
            TreeName += "- " + this.searchWellsLookup + ' ';
        }
        else {
            TreeName += "- " + State.StateProvince + ' ';
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
        tempLayerObjPropObj.isEnergyLayer = this.WellLookupData.isEnergyLayer;
        tempLayerObjPropObj["DisplayName"] = this.WellLookupData.EnergyLayerDisplayName;
        tempLayerObjPropObj.EnergyLayerID = this.WellLookupData.EnergyLayerID;
        return tempLayerObjPropObj;
    };
    WellLookupComponent = __decorate([
        core_1.Component({
            selector: 'app-well-lookup',
            templateUrl: './well-lookup.component.html',
            styleUrls: ['./well-lookup.component.scss']
        }),
        __metadata("design:paramtypes", [auth_service_1.AuthenticationService,
            map_service_service_1.MapServiceService,
            all_http_request_service_1.HttpRequestService,
            Utility_service_1.UtilityService,
            core_1.Injector])
    ], WellLookupComponent);
    return WellLookupComponent;
}());
exports.WellLookupComponent = WellLookupComponent;
//# sourceMappingURL=well-lookup.component.js.map