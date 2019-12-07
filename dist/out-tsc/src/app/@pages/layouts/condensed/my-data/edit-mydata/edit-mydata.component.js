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
var Utility_service_1 = require("../../../../../services/Utility.service");
var all_http_request_service_1 = require("../../../../../services/all-http-request.service");
var map_service_service_1 = require("../../../../../services/map-service.service");
var EditMyDataComponent = (function () {
    function EditMyDataComponent(activeModal, utilityService, httpService, MapServiceService) {
        this.activeModal = activeModal;
        this.utilityService = utilityService;
        this.httpService = httpService;
        this.MapServiceService = MapServiceService;
        this.FormName = '';
        this.FormDescription = '';
        this.isShare = false;
        this.LayerStyleVisibleList = {
            TitleName: 'Point',
            Border: '#8db3e2',
            Color: '#8db3e2',
            Size: 50,
            Thickness: 10,
            Transparency: 0,
            defaultIconURL: ''
        };
    }
    EditMyDataComponent.prototype.ngOnInit = function () {
        this.utilityService.CloseModalOnRouteChange(this.activeModal);
        this.LayerStyleVisibleList.TitleName = this.PrivateLayerData.RepresentationType.toLowerCase() != "none" || this.PrivateLayerData.RepresentationType != null ? this.PrivateLayerData.RepresentationType : "Point";
        this.setValueinControls(this.PrivateLayerData);
        this.SetValueInFormData(this.PrivateLayerData);
        //this.LayerStyleVisibleList.defaultIconURL = 
    };
    EditMyDataComponent.prototype.SetValueInFormData = function (layer) {
        this.FormName = layer.DataSetName;
        this.FormDescription = layer.Description != null ? layer.Description : "";
        this.isShare = layer.IsPublic;
    };
    EditMyDataComponent.prototype.setValueinControls = function (layer) {
        this.LayerStyleVisibleList.Size = (parseInt(layer["SizePercent"]));
        this.LayerStyleVisibleList.Thickness = (parseInt(layer["StrokeThicknessPercent"]));
        this.LayerStyleVisibleList.Transparency = this.getOpacityFromPercentage(layer["Opacity"]);
        this.LayerStyleVisibleList.Color = "#" + this.getHexValueWithAlpha(layer["FillColor"]);
        if (this.LayerStyleVisibleList.TitleName == "Point")
            this.LayerStyleVisibleList.Border = "#" + this.getHexValueWithAlpha(layer["StrokeColor"]);
        else if (this.LayerStyleVisibleList.TitleName == "Line")
            this.LayerStyleVisibleList.Color = "#" + this.getHexValueWithAlpha(layer["StrokeColor"]);
        // let encolor = "#" + this.getHexValueWithAlpha(layer["FillColor"]);
        // let enborder = "#" + this.getHexValueWithAlpha(layer["StrokeColor"]);
        // this.Border = "#" + this.getHexValueWithAlpha(layer["StrokeColor"]);
        // this.color = "#" + this.getHexValueWithAlpha(layer["FillColor"]);
        this.LayerStyleVisibleList["layerStyle"] = {
            opacity: layer["Opacity"],
            fillColor: layer["FillColor"],
            strokeColor: layer["StrokeColor"],
            strokeThicknessPercentage: layer["StrokeThicknessPercent"],
            sizePercentage: layer["SizePercent"],
        };
    };
    EditMyDataComponent.prototype.getOpacityFromPercentage = function (percentage) {
        var opacityPoint = 1;
        if (parseInt(percentage) > 0) {
            opacityPoint = 1 - (parseInt(percentage) / 100);
        }
        return opacityPoint;
    };
    EditMyDataComponent.prototype.getHexValueWithAlpha = function (color) {
        color = color.replace('#', '');
        if (color.length == 8) {
            color = color.substring(2);
        }
        return color;
    };
    EditMyDataComponent.prototype.SaveMyData = function () {
        var _this = this;
        var layerData = {
            DataSetName: this.FormName,
            Description: this.FormDescription,
            userId: this.PrivateLayerData.UploadedBy,
            layerId: this.PrivateLayerData.DataSetID,
            isShare: this.isShare
        };
        this.httpService._NodeUpdateMyDataLayer(layerData).subscribe(function (data) {
            if (data._Issuccess == true) {
                var myLibraryData = _this.MapServiceService.MyDataLayerLibrary.getValue();
                if (myLibraryData && myLibraryData[0].LayerLibrary && myLibraryData[0].LayerLibrary.length > 0) {
                    var layerData_1 = myLibraryData[0].LayerLibrary;
                    var item = layerData_1.find(function (x) { return x.DataSetID == _this.PrivateLayerData.DataSetID; });
                    if (item) {
                        item.DataSetName = _this.FormName;
                        item.Description = _this.FormDescription;
                        item.IsPublic = _this.isShare;
                        _this.MapServiceService.setMyDataLayerLibrary(myLibraryData);
                        _this.UpdatePrivateTreeData();
                        _this.UpdateGridTabData();
                    }
                }
                _this.activeModal.dismiss();
            }
        });
    };
    EditMyDataComponent.prototype.UpdatePrivateTreeData = function () {
        var privateTreeUI = this.MapServiceService._PrivateTreeUI.getValue();
        if (privateTreeUI.treeModel.nodes) {
            var existnode = privateTreeUI.treeModel.getNodeById(this.PrivateLayerData.DataSetID);
            if (existnode) {
                existnode.data.Name = this.FormName;
            }
        }
        setTimeout(function () {
            privateTreeUI.treeModel.update();
        }, 500);
    };
    EditMyDataComponent.prototype.UpdateGridTabData = function () {
        var TabDatalist = this.MapServiceService._GridTabData.value;
        var isBreakParentLoop = false;
        for (var _i = 0, TabDatalist_1 = TabDatalist; _i < TabDatalist_1.length; _i++) {
            var tabdata = TabDatalist_1[_i];
            for (var _a = 0, _b = tabdata.energyLayer; _a < _b.length; _a++) {
                var el = _b[_a];
                if (el.DataSetID == this.PrivateLayerData.DataSetID) {
                    el.DataSetName = this.FormName;
                    el.Description = this.FormDescription;
                    el.IsPublic = this.isShare;
                    tabdata.DisplayName = this.FormName;
                    tabdata.Title = this.FormName;
                    isBreakParentLoop = true;
                    break;
                }
            }
            if (isBreakParentLoop)
                break;
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], EditMyDataComponent.prototype, "PrivateLayerData", void 0);
    EditMyDataComponent = __decorate([
        core_1.Component({
            selector: 'edit-mydata-modal',
            templateUrl: './edit-mydata.component.html',
            styleUrls: ['./edit-mydata.component.scss']
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal,
            Utility_service_1.UtilityService,
            all_http_request_service_1.HttpRequestService,
            map_service_service_1.MapServiceService])
    ], EditMyDataComponent);
    return EditMyDataComponent;
}());
exports.EditMyDataComponent = EditMyDataComponent;
//# sourceMappingURL=edit-mydata.component.js.map