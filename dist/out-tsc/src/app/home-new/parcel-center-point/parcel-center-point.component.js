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
var ParcelCenterPointComponent = (function () {
    function ParcelCenterPointComponent(AuthServices, MapServiceService, httpService, utilityService, injector) {
        var _this = this;
        this.AuthServices = AuthServices;
        this.MapServiceService = MapServiceService;
        this.httpService = httpService;
        this.utilityService = utilityService;
        this.injector = injector;
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
        this.LayerLoader = false;
        this.StateModelList = [];
        this.States = [];
        this.Counties = [];
        this.selectedState = [];
        this.selectedCountries = [];
        this.dropdownSettingsSingle = {};
        this.dropdownSettingsMulty = {};
        this.Treedatalist = [];
        this.ParcelCenterPointData = {
            //DataSetID: "200005",
            DataSetID: "10937",
            PreviewImage: "http://mapsearch360.com/images/datasetimage.png",
            LayerName: "",
            TableName: "",
            DBFProperties: "PARCELAPN,FIPS,TAXAPN,STHSNUM,STDIR,STSTNAME,STSUFFIX,STQUADRANT,STUNITPRFX,STUNITNUM,STCITY,STSTATE,STZIP,STZIP4,GEOSOURCE,ADDRSCORE,OWN1,OWN2,MHSNUMB,MPREDIR,MSTNAME,MMODE,MQUADRNT,MUNITPRFX,MUNITNUM,MCITY,MSTATE,MZIP,MZIP4,LEGAL1,USECDSTDSC,USECDSTD,MQUADRANT,STNAME,CUSECDDSC,CUSECDSTD,LOTSZARNUM,LOTSZARUNT,ORGLOTSZAR,TAXSOURCE,TAXAMOUNT,TAXYEAR,ASSESSDATE,LATESTSALE,ASSESSAMT,LOTSZAR",
            DetailPanelProperties: "APN=TAXAPN,Owner=OWN1,Owner2=OWN2,Site Num=STHSNUM,Site Dir=STDIR,Site Name=STSTNAME,Site Unit=STUNITNUM,City=STCITY,State=STSTATE,Zip=STZIP,Legal=LEGAL1,Use Code=USECDSTD,Code Description=USECDSTDSC,MQUADRANT=MQUADRANT,CUSECDDSC=CUSECDDSC,CUSECDSTD=CUSECDSTD,LOTSZARNUM=LOTSZARNUM,LOTSZARUNT=LOTSZARUNT,ORGLOTSZAR=ORGLOTSZAR,TAXSOURCE=TAXSOURCE,TAXAMOUNT=TAXAMOUNT,TAXYEAR=TAXYEAR,=ASSESSDATEASSESSDATE,LATESTSALE=LATESTSALE,ASSESSAMT=ASSESSAMT",
            ZoomMin: "15",
            ZoomMax: "20",
            FilterValue: "",
            isEnergyLayer: true,
            EnergyLayerDisplayName: "Parcel search results",
            EnergyLayerID: "10937"
            // ZoomMin: null,
            // ZoomMax: null
        };
        setTimeout(function () { return _this.CondensedComponent = injector.get(layouts_1.CondensedComponent); });
    }
    ParcelCenterPointComponent.prototype.ngOnInit = function () {
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
        this.StateModelList = this.MapServiceService.parcelStateData.getValue();
        if (this.StateModelList != null && this.StateModelList.length > 0) {
            for (var i = 0; i < this.StateModelList.length; i++) {
                this.States.push({ 'item_id': this.StateModelList[i].ID, 'item_text': this.StateModelList[i].StateName, 'counties': this.StateModelList[i].counties });
            }
        }
        else {
            if (this.AuthServices.ShowParcelLookupWidgetUIBasedOnRole())
                this.GetParcelStateData();
        }
        this._permissionsSubscription = this.MapServiceService.sitePermissions.subscribe(function (data) {
            if (data)
                _this.ShowWidgetBasedOnRole();
        });
        setTimeout(function () {
            _this.DisableButtons();
        }, 1000);
    };
    ParcelCenterPointComponent.prototype.ngOnDestroy = function () {
        if (this._permissionsSubscription)
            this._permissionsSubscription.unsubscribe();
    };
    ParcelCenterPointComponent.prototype.GetParcelStateData = function () {
        var _this = this;
        this.LayerLoader = true;
        var UserId = this.AuthServices.getLoggedinUserId();
        this.httpService._NodeGetParcelStates(UserId).subscribe(function (data) {
            if (data._Issuccess) {
                var jsonData = data.ParcelStateData;
                _this.States = [];
                _this.StateModelList = jsonData;
                _this.MapServiceService.setParcelStates(jsonData);
                for (var i = 0; i < jsonData.length; i++) {
                    _this.States.push({ 'item_id': jsonData[i].ID, 'item_text': jsonData[i].StateName, 'counties': jsonData[i].counties, 'TableLayerName': jsonData[i].LayerTableName });
                }
            }
            _this.LayerLoader = false;
        }, function (error) {
            console.log(error);
            _this.LayerLoader = false;
        });
    };
    ParcelCenterPointComponent.prototype.onSelectState = function (item) {
        this.Counties = [];
        this.selectedCountries = [];
        var StateModel = this.StateModelList.filter(function (m) { return m.ID === item.item_id; });
        if (StateModel) {
            var cts = StateModel[0].counties;
            this.Counties = [];
            for (var i = 0; i < cts.length; i++) {
                if (cts[i]["LayerTableName"]) {
                    this.Counties.push({ 'item_id': i, 'item_text': cts[i].County });
                }
            }
        }
        document.getElementById("ddCounties").classList.remove('disabled');
    };
    ParcelCenterPointComponent.prototype.DisableSearch = function () {
        document.getElementById("btnSearch").disabled = true;
    };
    ParcelCenterPointComponent.prototype.EnableSearch = function () {
        document.getElementById("btnSearch").disabled = false;
    };
    ParcelCenterPointComponent.prototype.ClearFilters = function () {
        this.Counties = [];
        this.selectedState = [];
        this.selectedCountries = [];
    };
    ParcelCenterPointComponent.prototype.DisableButtons = function () {
        this.Counties = [];
        this.selectedCountries = [];
        if (document.getElementById("btnSearch"))
            document.getElementById("btnSearch").disabled = true;
        if (document.getElementById("ddCounties"))
            document.getElementById("ddCounties").classList.add('disabled');
    };
    ParcelCenterPointComponent.prototype.ShowWidgetBasedOnRole = function () {
        if (!this.AuthServices.ShowParcelLookupWidgetUIBasedOnRole()) {
            $("#ParcelsTabHeader").parent().parent().addClass("disabled disable-tab");
            $("#parcelLookupCard .card-header").addClass("disable-cardHeader");
            $("#parcelLookupCard .card-body").addClass("disable-cardBody");
            $("#parcelLookupCard .card-body .tab-content-wrapper").addClass("disable-cardBody");
            $("#parcelLookupCard").addClass("disabled");
        }
    };
    ParcelCenterPointComponent.prototype.SearchParcelLookup = function () {
        var _this = this;
        var ParcelData = this.MapServiceService.parcelStateData.getValue();
        if (ParcelData.length > 0) {
            for (var i = 0; i < ParcelData.length; i++) {
                var statelist = ParcelData[i];
                if (statelist.ID == this.selectedState[0].item_id && statelist.StateName == this.selectedState[0].item_text) {
                    var GetCountyList = statelist.counties.filter(function (m) { return m.County == _this.selectedCountries[0].item_text; });
                    if (GetCountyList != null && GetCountyList.length > 0) {
                        if (GetCountyList[0]["LayerTableName"]) {
                            this.MapServiceService.ParcelCenterLookupZoom = false;
                            var tempLayerObjPropObj = this.GetParcelTempLayerObject(GetCountyList);
                            this.SetTree(this.ParcelCenterPointData, tempLayerObjPropObj);
                            if (this.Treedatalist.length > 0) {
                                this.CondensedComponent.Redirect('maps');
                                this.CondensedComponent.SetTemporaryTreeNodeForWidget(this.Treedatalist);
                            }
                        }
                    }
                }
            }
        }
    };
    ParcelCenterPointComponent.prototype.SetTree = function (temp, tempLayerObjPropObj) {
        this.RemovelayerFromTree(temp.DataSetID);
        this.AddLayeronTempVariable(tempLayerObjPropObj);
        this.Treedatalist = [];
        this.Treedatalist.push(this.getsingaleTree(tempLayerObjPropObj));
    };
    ParcelCenterPointComponent.prototype.AddLayeronTempVariable = function (tempobj) {
        if (this.MapServiceService.LayerIndex.getValue()) {
            var currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
            tempobj["Layerindexval"] = currentIndexVal;
            this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
        }
        this.MapServiceService.temporaryLayer.push(tempobj);
    };
    ParcelCenterPointComponent.prototype.RemovelayerFromTree = function (DatasetId) {
        var tempLayerTreeData = this.MapServiceService.TemporaryTreeNode.getValue();
        var ParcelData = tempLayerTreeData.find(function (x) { return x.Id == DatasetId; });
        if (ParcelData)
            this.utilityService.ActiveLayerData(DatasetId, 'RemovetemporaryTreeData');
        this.Treedatalist = [];
        // for (let i = 0; i < this.Treedatalist.length; i++) {
        //   let treeItem = this.Treedatalist[i];
        //   if (treeItem.Id == DatasetId)
        //     continue;
        //   let item = tempLayerTreeData.find(y => y.Id == treeItem.Id);
        //   if (!item) {
        //     this.Treedatalist.splice(i, 1);
        //   }
        // }
    };
    ParcelCenterPointComponent.prototype.getsingaleTree = function (tempobj) {
        var Tree = {
            Id: tempobj.DataSetID,
            Name: tempobj.DataSetName,
            activeCount: 0,
            IconUrl: environment_1.environment.GetLayerIconURL + "/icongenerate/get/?Id=" + tempobj.DataSetID + "&URLType=CustomStyleIcon&FillColor=" + tempobj.FillColor + "&IconType=" + tempobj.IconType + "&StrokeColor=" + tempobj.StrokeColor + "&SizePercent=" + tempobj.SizePercent + "&StrokeThicknessPercent=" + tempobj.StrokeThicknessPercent + "&Opacity=" + tempobj.Opacity,
            IsChecked: true,
        };
        return Tree;
    };
    ParcelCenterPointComponent.prototype.GetParcelTempLayerObject = function (selCounty) {
        var selectedCounty = selCounty[0];
        this.ParcelCenterPointData.LayerName = selectedCounty.County + " County," + selectedCounty.State + " Parcel";
        this.ParcelCenterPointData.TableName = selectedCounty.LayerTableName.split(':')[1].replace("#", "");
        if (this.txtParcelfilter)
            this.ParcelCenterPointData.FilterValue = "TAXAPN#LIKE#" + this.txtParcelfilter + "#OR#OWN1#LIKE#" + this.txtParcelfilter + "#OR#STZIP#LIKE#" + this.txtParcelfilter;
        else
            this.ParcelCenterPointData.FilterValue = "";
        var tempLayerObjPropObj = new layer_data_prop_1.tempLayerDataProp();
        tempLayerObjPropObj.DataSetID = this.ParcelCenterPointData.DataSetID;
        tempLayerObjPropObj.EnergyLayerID = tempLayerObjPropObj.DataSetID;
        tempLayerObjPropObj.DataSetName = this.ParcelCenterPointData.LayerName;
        tempLayerObjPropObj.Description = this.ParcelCenterPointData.LayerName;
        tempLayerObjPropObj.UploadedBy = this.AuthServices.getLoggedinUserId();
        tempLayerObjPropObj.Tags = this.ParcelCenterPointData.LayerName;
        tempLayerObjPropObj.IsPublic = "false";
        tempLayerObjPropObj.PreviewImage = this.ParcelCenterPointData.PreviewImage;
        tempLayerObjPropObj.IconType = "Circle";
        tempLayerObjPropObj.StrokeThicknessPercent = 5;
        tempLayerObjPropObj.StrokeColor = "FF" + this.utilityService.getRandomColor();
        tempLayerObjPropObj.FillColor = tempLayerObjPropObj.StrokeColor;
        tempLayerObjPropObj.SizePercent = 55;
        tempLayerObjPropObj.Opacity = 1;
        tempLayerObjPropObj.IsEnabled = "true";
        tempLayerObjPropObj.SortNumber = "1";
        tempLayerObjPropObj.Count = "0";
        tempLayerObjPropObj.RepresentationType = "Point";
        tempLayerObjPropObj.TableName = this.ParcelCenterPointData.TableName;
        tempLayerObjPropObj.FilterValue = this.ParcelCenterPointData.FilterValue;
        tempLayerObjPropObj.LayerTypeID = "9";
        tempLayerObjPropObj.DetailPanelPropertiesMain = this.ParcelCenterPointData.DBFProperties;
        tempLayerObjPropObj.DBFProperties = this.ParcelCenterPointData.DBFProperties;
        tempLayerObjPropObj.DetailPanelProperties = this.ParcelCenterPointData.DetailPanelProperties;
        tempLayerObjPropObj.IsSaveSearch = "true";
        tempLayerObjPropObj.IsLabelVisible = "false";
        tempLayerObjPropObj.ZoomMin = this.ParcelCenterPointData.ZoomMin;
        tempLayerObjPropObj.ZoomMax = this.ParcelCenterPointData.ZoomMax;
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
        tempLayerObjPropObj.isEnergyLayer = this.ParcelCenterPointData.isEnergyLayer;
        tempLayerObjPropObj["DisplayName"] = this.ParcelCenterPointData.EnergyLayerDisplayName;
        tempLayerObjPropObj.EnergyLayerID = this.ParcelCenterPointData.EnergyLayerID;
        return tempLayerObjPropObj;
    };
    ParcelCenterPointComponent = __decorate([
        core_1.Component({
            selector: 'app-parcel-center-point',
            templateUrl: './parcel-center-point.component.html',
            styleUrls: ['./parcel-center-point.component.scss']
        }),
        __metadata("design:paramtypes", [auth_service_1.AuthenticationService,
            map_service_service_1.MapServiceService,
            all_http_request_service_1.HttpRequestService,
            Utility_service_1.UtilityService,
            core_1.Injector])
    ], ParcelCenterPointComponent);
    return ParcelCenterPointComponent;
}());
exports.ParcelCenterPointComponent = ParcelCenterPointComponent;
//# sourceMappingURL=parcel-center-point.component.js.map