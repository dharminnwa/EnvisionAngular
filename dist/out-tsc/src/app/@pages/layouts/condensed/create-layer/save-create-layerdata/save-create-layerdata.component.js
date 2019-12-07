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
var Utility_service_1 = require("../../../../../services/Utility.service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var map_service_service_1 = require("../../../../../services/map-service.service");
var auth_service_1 = require("../../../../../services/auth.service");
var all_http_request_service_1 = require("../../../../../services/all-http-request.service");
var condensed_component_1 = require("../../condensed.component");
var SaveCreateLayerdataComponent = (function () {
    function SaveCreateLayerdataComponent(utilityService, activeModal, MapService, AuthenticationService, httpService, injector) {
        this.utilityService = utilityService;
        this.activeModal = activeModal;
        this.MapService = MapService;
        this.AuthenticationService = AuthenticationService;
        this.httpService = httpService;
        this.injector = injector;
        this.LayerName = "";
        this.CondensedComponent = injector.get(condensed_component_1.CondensedComponent);
    }
    SaveCreateLayerdataComponent.prototype.ngOnInit = function () {
        this.utilityService.CloseModalOnRouteChange(this.activeModal);
        if (this.temporaryLayer && this.temporaryLayer.data && this.temporaryLayer.data.Name)
            this.LayerName = this.temporaryLayer.data.Name;
    };
    SaveCreateLayerdataComponent.prototype.SaveLayer = function () {
        var _this = this;
        var parentNode = this.MapService.CreateLayerParentObj.getValue();
        if (parentNode) {
            var childLayers_1 = [];
            this.MapService.temporaryLayer.map(function (t) {
                if (t.ParentDataSetID == parentNode.DataSetID) {
                    t.IsPublic = "False";
                    t.IsEnabled = "True";
                    t.SortNumber = "1";
                    t.LayerTypeID = "9";
                    t.IsSaveSearch = "False";
                    t.IsLabelVisible = "False";
                    childLayers_1.push(t);
                }
            });
            parentNode.DataSetName = this.LayerName;
            parentNode.IsPublic = "False";
            parentNode.IsEnabled = "True";
            parentNode.SortNumber = "True";
            parentNode.LayerTypeID = "9";
            parentNode.IsSaveSearch = "False";
            parentNode.IsLabelVisible = "False";
            var postData = {
                childs: childLayers_1,
                parent: parentNode
            };
            this.httpService._NodeSaveCreatedLayer(postData).subscribe(function (data) {
                var resdatasetsData = data.json();
                var res = resdatasetsData;
                if (res._Issuccess && res.errormsg == "") {
                    var insertedDataSetID = res.DataSetData[0].DataSetID;
                    setTimeout(function () {
                        var tempTree = _this.MapService.TemporaryTreeNode.getValue();
                        var treeNode = tempTree.find(function (x) { return x.Id == _this.temporaryLayerID; });
                        if (treeNode && treeNode.children && treeNode.children.length > 0) {
                            var childElements = JSON.parse(JSON.stringify(treeNode.children));
                            childElements.forEach(function (item) {
                                var EnergyLayerID = item.Id + 'RemovetemporaryTreeData';
                                var element = document.getElementById(EnergyLayerID);
                                if (element) {
                                    element.click();
                                }
                            });
                        }
                    }, 1000);
                    _this.CondensedComponent.GetPrivateLayerTreeData(insertedDataSetID);
                    _this.CloseSaveSearchResultModal();
                    _this.CondensedComponent.AddLayerToMyDataLibrary(res.DataSetData[0]);
                }
            });
        }
    };
    SaveCreateLayerdataComponent.prototype.CloseSaveSearchResultModal = function () {
        this.activeModal.dismiss('Cross click');
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SaveCreateLayerdataComponent.prototype, "temporaryLayer", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SaveCreateLayerdataComponent.prototype, "temporaryLayerID", void 0);
    SaveCreateLayerdataComponent = __decorate([
        core_1.Component({
            selector: 'app-save-create-layerdata',
            templateUrl: './save-create-layerdata.component.html',
            styleUrls: ['./save-create-layerdata.component.scss']
        }),
        __metadata("design:paramtypes", [Utility_service_1.UtilityService,
            ng_bootstrap_1.NgbActiveModal,
            map_service_service_1.MapServiceService,
            auth_service_1.AuthenticationService,
            all_http_request_service_1.HttpRequestService,
            core_1.Injector])
    ], SaveCreateLayerdataComponent);
    return SaveCreateLayerdataComponent;
}());
exports.SaveCreateLayerdataComponent = SaveCreateLayerdataComponent;
//# sourceMappingURL=save-create-layerdata.component.js.map