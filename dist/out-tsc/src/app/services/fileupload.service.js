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
var map_service_service_1 = require("./map-service.service");
var layouts_1 = require("../@pages/layouts");
var google_component_1 = require("../maps/google/google.component");
var all_http_request_service_1 = require("./all-http-request.service");
var auth_service_1 = require("./auth.service");
var FileuploadService = (function () {
    function FileuploadService(MapServiceService, CondensedComponent, GoogleMapPage, httpService, authenticationService) {
        this.MapServiceService = MapServiceService;
        this.CondensedComponent = CondensedComponent;
        this.GoogleMapPage = GoogleMapPage;
        this.httpService = httpService;
        this.authenticationService = authenticationService;
    }
    FileuploadService.prototype.LoadLayersOfUploadedFiles = function (layerData) {
        var _this = this;
        var addDataClose = document.getElementById('btnAddDataclose');
        addDataClose.click();
        //this.MapServiceService.GetPrivateLayerData(layerData.result.MapLayers, 0, 1, '', '', '')
        if (layerData.result.MapLayers.length == 1) {
            layerData.result.MapLayers = layerData.result.MapLayers[0];
            layerData.result.MapLayers["TableName"] = layerData.result.MapLayers["TableName"].toLowerCase();
            var UserID = this.authenticationService.getLoggedinUserId();
            this.httpService._NodeGetPrivateLayerData(layerData.result.MapLayers, 0, 1, '', '', '', UserID)
                .subscribe(function (data) {
                if (!layerData.result.TreeData[0]["activeCount"]) {
                    layerData.result.TreeData[0]["activeCount"] = 0;
                }
                _this.CondensedComponent.setprivatetreenodes(layerData);
                //if (data['_body'].indexOf('totalFeatures') > 0) {
                if (data['totalFeatures']) {
                    if (!layerData.result.MapLayers["Layerindexval"] && _this.MapServiceService.LayerIndex.getValue()) {
                        var currentIndexVal = _this.MapServiceService.LayerIndex.getValue().value;
                        layerData.result.MapLayers["Layerindexval"] = currentIndexVal;
                        _this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
                    }
                    if (!layerData.result.MapLayers["treestatus"]) {
                        layerData.result.MapLayers["treestatus"] = "Individual";
                    }
                    var detailPanelPropertyMain = layerData.result.MapLayers["DBFProperties"];
                    if (layerData.result.MapLayers["DBFProperties"] && !layerData.result.MapLayers["DetailPanelPropertiesMain"]) {
                        layerData.result.MapLayers["DBFProperties"] = layerData.result.MapLayers["DetailPanelProperties"];
                        layerData.result.MapLayers["DetailPanelPropertiesMain"] = detailPanelPropertyMain;
                    }
                    if (!layerData.result.MapLayers["EnergyParentID"]) {
                        layerData.result.MapLayers["EnergyParentID"] = 0;
                    }
                    if (!layerData.result.MapLayers["EnergyLayerID"]) {
                        layerData.result.MapLayers["EnergyLayerID"] = layerData.result.MapLayers["DataSetID"];
                    }
                    if (!layerData.result.MapLayers["EnergyLayerStylesByUserModel"]) {
                        layerData.result.MapLayers["EnergyLayerStylesByUserModel"] = [];
                    }
                    _this.GoogleMapPage.privateLayer.push(layerData.result.MapLayers);
                    var MyDataLibraryClearButton = document.getElementById('btnMyDataClear');
                    if (MyDataLibraryClearButton != null) {
                        MyDataLibraryClearButton.click();
                    }
                    _this.CondensedComponent.AddLayerToMyDataLibrary(layerData.result.MapLayers);
                    //this.CondensedComponent.PrivateLayerVisible();
                    setTimeout(function () {
                        var Treeecheckboxlement = document.getElementById(layerData.result.MapLayers.DataSetID + 'LoadlayerinPrivateTreeData');
                        if (Treeecheckboxlement != null)
                            Treeecheckboxlement.click();
                    }, 2500);
                }
            }, function (error) {
                console.log(error);
            });
        }
    };
    FileuploadService.prototype.LoadKmlLayerOfUploadedFiles = function (layerData) {
        var addDataClose = document.getElementById('btnAddDataclose');
        addDataClose.click();
        if (!layerData.result.TreeData[0]["activeCount"]) {
            layerData.result.TreeData[0]["activeCount"] = 0;
        }
        this.CondensedComponent.setprivatetreenodes(layerData);
        if (layerData.result.MapLayers.length == 1) {
            layerData.result.MapLayers = layerData.result.MapLayers[0];
            if (!layerData.result.MapLayers["Layerindexval"] && this.MapServiceService.LayerIndex.getValue()) {
                var currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
                layerData.result.MapLayers["Layerindexval"] = currentIndexVal;
                this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
            }
            if (!layerData.result.MapLayers["treestatus"]) {
                layerData.result.MapLayers["treestatus"] = "Individual";
            }
            var detailPanelPropertyMain = layerData.result.MapLayers["DBFProperties"];
            if (layerData.result.MapLayers["DBFProperties"] && !layerData.result.MapLayers["DetailPanelPropertiesMain"]) {
                layerData.result.MapLayers["DBFProperties"] = layerData.result.MapLayers["DetailPanelProperties"];
                layerData.result.MapLayers["DetailPanelPropertiesMain"] = detailPanelPropertyMain;
            }
            if (!layerData.result.MapLayers["EnergyParentID"]) {
                layerData.result.MapLayers["EnergyParentID"] = 0;
            }
            if (!layerData.result.MapLayers["EnergyLayerID"]) {
                layerData.result.MapLayers["EnergyLayerID"] = layerData.result.MapLayers["DataSetID"];
            }
            if (!layerData.result.MapLayers["EnergyLayerStylesByUserModel"]) {
                layerData.result.MapLayers["EnergyLayerStylesByUserModel"] = [];
            }
            this.GoogleMapPage.privateLayer.push(layerData.result.MapLayers);
            var MyDataLibraryClearButton = document.getElementById('btnMyDataClear');
            if (MyDataLibraryClearButton != null) {
                MyDataLibraryClearButton.click();
            }
            this.CondensedComponent.AddLayerToMyDataLibrary(layerData.result.MapLayers);
            //this.CondensedComponent.PrivateLayerVisible();
            setTimeout(function () {
                var Treeecheckboxlement = document.getElementById(layerData.result.MapLayers.DataSetID + 'LoadlayerinPrivateTreeData');
                if (Treeecheckboxlement == null) {
                    setTimeout(function () { Treeecheckboxlement.click(); }, 1000);
                }
                else
                    Treeecheckboxlement.click();
            }, 2500);
        }
    };
    FileuploadService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [map_service_service_1.MapServiceService,
            layouts_1.CondensedComponent,
            google_component_1.GoogleMapPage,
            all_http_request_service_1.HttpRequestService,
            auth_service_1.AuthenticationService])
    ], FileuploadService);
    return FileuploadService;
}());
exports.FileuploadService = FileuploadService;
//# sourceMappingURL=fileupload.service.js.map