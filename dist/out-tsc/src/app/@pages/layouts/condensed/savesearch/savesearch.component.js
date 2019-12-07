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
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var map_service_service_1 = require("../../../../services/map-service.service");
var auth_service_1 = require("../../../../services/auth.service");
var __1 = require("../..");
var Utility_service_1 = require("../../../../services/Utility.service");
var all_http_request_service_1 = require("../../../../services/all-http-request.service");
var layer_data_prop_1 = require("../../../../models/layer-data-prop");
var my_map_service_1 = require("../../../../services/my-map.service");
var ParcelBufferTool_service_1 = require("../../../../services/ParcelBufferTool.service");
var SavesearchComponent = (function () {
    function SavesearchComponent(activeModal, MapService, AuthenticationService, injector, utilityService, httpService, myMapService, parcelBufferService) {
        this.activeModal = activeModal;
        this.MapService = MapService;
        this.AuthenticationService = AuthenticationService;
        this.injector = injector;
        this.utilityService = utilityService;
        this.httpService = httpService;
        this.myMapService = myMapService;
        this.parcelBufferService = parcelBufferService;
        this.LayerName = "";
        this.LayerGroup = "";
        this.isParcelBufferSaveSearch = false;
        this.CondensedComponent = injector.get(__1.CondensedComponent);
    }
    SavesearchComponent.prototype.ngOnInit = function () {
        // Is Index of Parcel Buffer Layer Id
        if (this.temporaryLayerID) {
            if (this.temporaryLayerID.toString().indexOf(this.parcelBufferService.ParcelCenterPointData.DataSetID) != -1 || this.temporaryLayerID.toString().indexOf(this.parcelBufferService.ParcelCenterPointData.DataSetBoundryID) != -1)
                this.isParcelBufferSaveSearch = true;
        }
        this.utilityService.CloseModalOnRouteChange(this.activeModal);
        if (this.StatusOfSaveLayers == "EnergyLayerOrPrivateLayer") {
            this.LayerName = this.FilterEneregyLayer.DisplayName;
        }
        else {
            this.LayerName = this.temporaryLayer.data.Name;
            var i = this.LayerName.indexOf('-');
            this.LayerGroup = this.LayerName.substr(0, i);
        }
    };
    SavesearchComponent.prototype.GetTemporyLayer = function () {
        var _this = this;
        var selectedTemporaryLayer = [];
        this.MapService.temporaryLayer.map(function (t) {
            if (t.DataSetID == parseInt(_this.temporaryLayerID)) {
                selectedTemporaryLayer.push(t);
            }
        });
        var userId = this.AuthenticationService.getLoggedinUserId();
        selectedTemporaryLayer[0].DataSetName = this.LayerName;
        selectedTemporaryLayer[0].Description = this.LayerName;
        selectedTemporaryLayer[0].Tags = this.LayerName;
        selectedTemporaryLayer[0].IsPublic = "False";
        selectedTemporaryLayer[0].IsEnabled = "True";
        selectedTemporaryLayer[0].SortNumber = "1";
        selectedTemporaryLayer[0].Count = "0";
        selectedTemporaryLayer[0].LayerTypeID = "9";
        selectedTemporaryLayer[0].IsSaveSearch = "True";
        selectedTemporaryLayer[0].IsLabelVisible = "False";
        selectedTemporaryLayer[0].PreviewImage = "http://mapsearch360.com/images/datasetimage.png";
        selectedTemporaryLayer[0].UploadedBy = userId;
        return selectedTemporaryLayer;
    };
    SavesearchComponent.prototype.GetEnergyLayerorPrivateLayer = function () {
        var tempLayerObjPropObj = new layer_data_prop_1.tempLayerDataProp();
        if (this.FilterEneregyLayer.energyLayer && this.FilterEneregyLayer.energyLayer[0]) {
            var LayerList = this.FilterEneregyLayer.energyLayer[0];
            var userId = this.AuthenticationService.getLoggedinUserId();
            tempLayerObjPropObj.DataSetName = this.LayerName;
            tempLayerObjPropObj.Description = this.LayerName;
            tempLayerObjPropObj.Tags = this.LayerName;
            tempLayerObjPropObj.IsPublic = "False";
            tempLayerObjPropObj.SortNumber = "1";
            tempLayerObjPropObj.Count = "0";
            tempLayerObjPropObj.LayerTypeID = "9";
            tempLayerObjPropObj.IsSaveSearch = "True";
            tempLayerObjPropObj.IsLabelVisible = "False";
            tempLayerObjPropObj.PreviewImage = "http://mapsearch360.com/images/datasetimage.png";
            tempLayerObjPropObj.UploadedBy = userId;
            tempLayerObjPropObj.IconType = LayerList.IconType;
            tempLayerObjPropObj.StrokeThicknessPercent = LayerList.StrokeThicknessPercent;
            tempLayerObjPropObj.StrokeColor = LayerList.StrokeColor;
            tempLayerObjPropObj.FillColor = LayerList.FillColor;
            tempLayerObjPropObj.SizePercent = LayerList.SizePercent;
            tempLayerObjPropObj.Opacity = LayerList.Opacity;
            tempLayerObjPropObj.IsEnabled = LayerList.IsEnabled;
            tempLayerObjPropObj.RepresentationType = LayerList.RepresentationType;
            tempLayerObjPropObj.TableName = LayerList.TableName;
            tempLayerObjPropObj.FilterValue = LayerList.FilterValue;
            tempLayerObjPropObj.DBFProperties = LayerList.DBFProperties;
            tempLayerObjPropObj.DetailPanelProperties = LayerList.DetailPanelProperties;
        }
        return tempLayerObjPropObj;
    };
    SavesearchComponent.prototype.SaveLayer = function () {
        var _this = this;
        var SaveLayers = null;
        if (this.StatusOfSaveLayers == "EnergyLayerOrPrivateLayer") {
            SaveLayers = this.GetEnergyLayerorPrivateLayer();
        }
        else {
            var TemporaryLayer = this.GetTemporyLayer();
            SaveLayers = TemporaryLayer[0];
        }
        if (this.LayerName && SaveLayers) {
            //this.httpService._NodesaveTemporaryLayer(selectedTemporaryLayer[0]).subscribe(data => {
            this.httpService._NodesaveTemporaryLayer(SaveLayers).subscribe(function (data) {
                var resdatasetsData = data.json();
                var res = resdatasetsData;
                if (res._Issuccess && res.errormsg == "") {
                    var insertedDataSetID_1 = res.DataSetData[0].DataSetID;
                    var EnergyLayerID_1 = _this.temporaryLayerID + 'RemovetemporaryTreeData';
                    setTimeout(function () {
                        var element = document.getElementById(EnergyLayerID_1);
                        if (element) {
                            element.click();
                        }
                    }, 1000);
                    if (res.DataSetData)
                        _this.CondensedComponent.AddLayerToMyDataLibrary(res.DataSetData[0]);
                    if (_this.StatusOfSaveLayers == "EnergyLayerOrPrivateLayer" && _this.FilterEneregyLayer.EnergylayersavegridFilter.mapfilterval) {
                        var xmlFilter = _this.utilityService.ConvertMapGridCqlFilterToXML_new(_this.FilterEneregyLayer.EnergylayersavegridFilter.mapfilterval, _this.FilterEneregyLayer.EnergylayersavegridFilter["mapfilterColumns"]);
                        //xmlFilter = this.utilityService.ConvertMapGridCqlFilterToXML(this.FilterEneregyLayer.EnergylayersavegridFilter.mapfilterval);
                        var layerGridFilter_arry = [];
                        var layerFilter = {
                            LayerId: insertedDataSetID_1,
                            IsEnergyLayer: "false",
                            UserId: _this.AuthenticationService.getLoggedinUserId(),
                            FilterSaveString: xmlFilter
                        };
                        layerGridFilter_arry.push(layerFilter);
                        _this.httpService._NodesaveMapGridFilter(layerGridFilter_arry).subscribe(function (data) {
                            _this.CondensedComponent.GetPrivateLayerTreeData(insertedDataSetID_1);
                        }, function (error) {
                            _this.CondensedComponent.GetPrivateLayerTreeData(insertedDataSetID_1);
                            console.log(error);
                        });
                    }
                    else {
                        _this.CondensedComponent.GetPrivateLayerTreeData(insertedDataSetID_1);
                    }
                    _this.CloseSaveSearchResultModal();
                }
            });
        }
    };
    SavesearchComponent.prototype.CloseSaveSearchResultModal = function () {
        var saveSearchClosebtn = document.getElementById("btnSavesearchClose");
        if (saveSearchClosebtn != null)
            saveSearchClosebtn.click();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SavesearchComponent.prototype, "temporaryLayer", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SavesearchComponent.prototype, "temporaryLayerID", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SavesearchComponent.prototype, "FilterEneregyLayer", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SavesearchComponent.prototype, "FilterEnergyLayerID", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SavesearchComponent.prototype, "StatusOfSaveLayers", void 0);
    SavesearchComponent = __decorate([
        core_1.Component({
            selector: 'app-savesearch',
            templateUrl: './savesearch.component.html',
            styleUrls: ['./savesearch.component.scss']
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal,
            map_service_service_1.MapServiceService,
            auth_service_1.AuthenticationService,
            core_1.Injector,
            Utility_service_1.UtilityService,
            all_http_request_service_1.HttpRequestService,
            my_map_service_1.MyMapService,
            ParcelBufferTool_service_1.ParcelBufferToolService])
    ], SavesearchComponent);
    return SavesearchComponent;
}());
exports.SavesearchComponent = SavesearchComponent;
//# sourceMappingURL=savesearch.component.js.map