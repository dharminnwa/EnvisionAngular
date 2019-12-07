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
var Utility_service_1 = require("../../../../services/Utility.service");
var environment_1 = require("../../../../../environments/environment");
var auth_service_1 = require("../../../../services/auth.service");
var map_service_service_1 = require("../../../../services/map-service.service");
var all_http_request_service_1 = require("../../../../services/all-http-request.service");
var layer_data_prop_1 = require("../../../../models/layer-data-prop");
var condensed_component_1 = require("../condensed.component");
var CreateLayerComponent = (function () {
    function CreateLayerComponent(bsModalRef, UtilityService, MapServiceService, injector, authServices, httpRequestService, authenticationService) {
        var _this = this;
        this.bsModalRef = bsModalRef;
        this.UtilityService = UtilityService;
        this.MapServiceService = MapServiceService;
        this.injector = injector;
        this.authServices = authServices;
        this.httpRequestService = httpRequestService;
        this.authenticationService = authenticationService;
        this.activeTab = 1;
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
        this.treestatus = "GroupLayer";
        this.FeatureType = "CreateLayer";
        setTimeout(function () { return _this.CondensedComponent = injector.get(condensed_component_1.CondensedComponent); });
    }
    CreateLayerComponent.prototype.ngOnInit = function () {
        this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
        this.Draggable();
    };
    CreateLayerComponent.prototype.Draggable = function () {
        setTimeout(function () {
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
        }, 10);
    };
    CreateLayerComponent.prototype.changeTab = function (tabNumber) {
        this.activeTab = tabNumber;
    };
    CreateLayerComponent.prototype.GetCommonTempObj = function (dataResult) {
        var tempLayerObjPropObj = new layer_data_prop_1.tempLayerDataProp();
        tempLayerObjPropObj.TreeStatus = dataResult.TreeStatus;
        tempLayerObjPropObj.Description = dataResult.Description;
        tempLayerObjPropObj.UploadedBy = this.authServices.getLoggedinUserId();
        tempLayerObjPropObj.Tags = dataResult.Tags;
        tempLayerObjPropObj.PreviewImage = dataResult.PreviewImage;
        tempLayerObjPropObj.IconType = dataResult.IconType;
        tempLayerObjPropObj.StrokeThicknessPercent = 10;
        tempLayerObjPropObj.StrokeColor = 'FF' + this.UtilityService.getRandomColor();
        tempLayerObjPropObj.FillColor = tempLayerObjPropObj.StrokeColor;
        tempLayerObjPropObj.SizePercent = 100;
        tempLayerObjPropObj.Opacity = 1;
        tempLayerObjPropObj.RepresentationType = dataResult.IconType;
        tempLayerObjPropObj.TableName = dataResult.TableName;
        tempLayerObjPropObj.LayerTypeID = dataResult.LayerTypeId;
        tempLayerObjPropObj.DBFProperties = dataResult.DBFProperties;
        tempLayerObjPropObj.DetailPanelProperties = dataResult.DetailPanelProperties;
        tempLayerObjPropObj.DetailPanelPropertiesMain = dataResult.DBFProperties;
        return tempLayerObjPropObj;
    };
    CreateLayerComponent.prototype.GetParentTempObject = function (TreeName, DataSet) {
        var tempLayerObjPropObj = this.GetCommonTempObj(DataSet);
        tempLayerObjPropObj.DataSetID = DataSet.DataSetID;
        tempLayerObjPropObj.EnergyLayerID = tempLayerObjPropObj.DataSetID;
        tempLayerObjPropObj.IsIconDisabled = 'True';
        tempLayerObjPropObj.DataSetName = DataSet.DataSetName + TreeName;
        return tempLayerObjPropObj;
    };
    CreateLayerComponent.prototype.SetChildrenNodesByList = function (list, parentNode, singleValFilterName, mulValFilterName, MulValFilterList, DataSet, isRailRoadFilter) {
        if (isRailRoadFilter === void 0) { isRailRoadFilter = false; }
        var childList = [];
        for (var i = 0; i < list.length; i++) {
            var node = list[i];
            var tempObj = this.GetCommonTempObj(DataSet);
            tempObj.DataSetID = "600000" + (i + 1);
            tempObj.EnergyLayerID = tempObj.DataSetID;
            tempObj.IsIconDisabled = "False";
            tempObj.DataSetName = node.name;
            tempObj.ParentDataSetID = DataSet.DataSetID;
            tempObj.EnergyParentID = DataSet.DataSetID;
            var filterval = this.GetFilterVal(singleValFilterName, node.name, mulValFilterName, MulValFilterList);
            if (isRailRoadFilter == true)
                filterval = this.GetRailRoadFilter(singleValFilterName, node.name, mulValFilterName, MulValFilterList, parentNode, tempObj, DataSet, list);
            tempObj.FilterValue = filterval;
            childList.push(tempObj);
            this.AddLayeronTempVariable(tempObj);
        }
        var currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
        this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
        this.GenrateTree(childList, parentNode);
        this.MapServiceService.setCreateLayerParentObj(parentNode);
        $(".pace").css("display", "block");
    };
    CreateLayerComponent.prototype.AddLayeronTempVariable = function (tempobj) {
        if (this.MapServiceService.LayerIndex.getValue()) {
            var currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
            tempobj["Layerindexval"] = currentIndexVal;
        }
        this.MapServiceService.temporaryLayer.push(tempobj);
    };
    CreateLayerComponent.prototype.GetFilterVal = function (singleValOp, singleVal, mulValOp, mulvals) {
        var equalOp = "#EQUAL#";
        // equalOp = '#LIKE#';
        var filterVal = '';
        if (singleValOp && singleVal)
            filterVal += singleValOp + equalOp + singleVal;
        filterVal += ';';
        if (mulValOp && mulvals && mulvals.length > 0) {
            for (var i = 0; i < mulvals.length; i++) {
                var item = mulvals[i];
                filterVal += mulValOp + equalOp + item.name;
                if (i + 1 != mulvals.length)
                    filterVal += '#OR#';
            }
        }
        return filterVal;
    };
    CreateLayerComponent.prototype.GenrateTree = function (childList, parentNode) {
        var childrennodelist = this.getChildrenTree(childList);
        var Tree = {
            Id: parentNode.DataSetID,
            Name: parentNode.DataSetName,
            children: childrennodelist,
            activeCount: 0,
            isSave: true,
            treestatus: this.treestatus,
            FeatureType: this.FeatureType
        };
        var treeList = [];
        treeList.push(Tree);
        this.CondensedComponent.SetTemporaryTreeNode(treeList);
        this.bsModalRef.hide();
        // $(".pace").css("display", "block");
    };
    CreateLayerComponent.prototype.RemoveExistingTempData = function (DataSetID) {
        var _this = this;
        var tempTree = this.MapServiceService.TemporaryTreeNode.getValue();
        if (tempTree && tempTree.length > 0) {
            var existingTreeIndex = tempTree.findIndex(function (x) { return x.Id == DataSetID; });
            if (existingTreeIndex > -1) {
                // tempTree.splice(existingTreeIndex, 1);
                if (tempTree[existingTreeIndex] && tempTree[existingTreeIndex].children && tempTree[existingTreeIndex].children.length > 0) {
                    var childData = JSON.parse(JSON.stringify(tempTree[existingTreeIndex].children));
                    childData.forEach(function (x) {
                        _this.UtilityService.ActiveLayerData(x.Id, 'RemovetemporaryTreeData');
                    });
                }
                tempTree.splice(existingTreeIndex, 1);
            }
        }
    };
    CreateLayerComponent.prototype.getChildrenTree = function (list) {
        var TreeChildNode = [];
        if (list.length > 0) {
            for (var t = 0; t < list.length; t++) {
                if (t < 25) {
                    var TargetListval = list[t];
                    TargetListval.id = TargetListval.DataSetID;
                    var TreeProp = {
                        IconUrl: environment_1.environment.GetLayerIconURL + "/icongenerate/get/?Id=" + TargetListval.DataSetID + "&URLType=CustomStyleIcon&FillColor=" + TargetListval.StrokeColor + "&IconType=" + TargetListval.IconType + "&StrokeColor=" + TargetListval.StrokeColor + "&SizePercent=" + TargetListval.SizePercent + "&StrokeThicknessPercent=" + TargetListval.StrokeThicknessPercent + "&Opacity=1",
                        Id: TargetListval.DataSetID,
                        IsChecked: true,
                        Name: TargetListval.DataSetName,
                        isSave: false,
                        treestatus: this.treestatus,
                        FeatureType: this.FeatureType
                    };
                    TreeChildNode.push(TreeProp);
                }
                else {
                    break;
                }
            }
        }
        return TreeChildNode;
    };
    CreateLayerComponent.prototype.GetRailRoadFilter = function (singleValOp, singleVal, mulValOp, mulvals, parentObj, childObj, DataSet, singleValList) {
        var filterVal = '';
        var selectedCountry = 0; // 1: US, 2: Canada, 3: All Rails
        var TableName = DataSet.TableName;
        if (parentObj.DataSetName.includes('Owner')) {
            if (mulvals && mulvals.length == 1) {
                if (mulvals[0].name == "Canada") {
                    TableName = DataSet.TableNameCa;
                    selectedCountry = 2;
                }
                else if (mulvals[0].name == "United States") {
                    TableName = DataSet.TableNameUs;
                    selectedCountry = 1;
                }
                filterVal = this.GetSingleValFilterForRailRoad(singleValOp, singleVal);
            }
            else if (mulvals && mulvals.length == 2) {
                selectedCountry = 3;
                TableName = DataSet.TableNameAllCountry;
                filterVal = this.GetFilterVal(singleValOp, singleVal, mulValOp, mulvals);
            }
        }
        else if (parentObj.DataSetName.includes('Country')) {
            if (singleValList && singleValList.length == 1) {
                if (singleValList[0].name == "Canada") {
                    TableName = DataSet.TableNameCa;
                    selectedCountry = 2;
                }
                else if (singleValList[0].name == "United States") {
                    TableName = DataSet.TableNameUs;
                    selectedCountry = 1;
                }
                filterVal = this.GetSingleValFilterForRailRoad(mulValOp, mulvals, true);
            }
            else if (singleValList && singleValList.length == 2) {
                TableName = DataSet.TableNameAllCountry;
                selectedCountry = 3;
                filterVal = this.GetFilterVal(singleValOp, singleVal, mulValOp, mulvals);
            }
        }
        if (selectedCountry == 1) {
            this.SetDBFProperties(parentObj, childObj, DataSet.DBFPropertiesUs, DataSet.DetailPanelPropertiesUs);
        }
        else if (selectedCountry == 2) {
            this.SetDBFProperties(parentObj, childObj, DataSet.DBFPropertiesCa, DataSet.DetailPanelPropertiesCa);
        }
        else if (selectedCountry == 3) {
            this.SetDBFProperties(parentObj, childObj, DataSet.DBFPropertiesAll, DataSet.DetailPanelPropertiesAll);
        }
        parentObj.TableName = TableName;
        childObj.TableName = TableName;
        return filterVal;
    };
    CreateLayerComponent.prototype.GetSingleValFilterForRailRoad = function (ValOp, Val, isList) {
        if (isList === void 0) { isList = false; }
        var filterVal = '';
        var equalOp = "#EQUAL#";
        if (isList == false) {
            if (ValOp && Val)
                filterVal += ValOp + equalOp + Val;
        }
        else {
            if (ValOp && Val && Val.length > 0) {
                for (var i = 0; i < Val.length; i++) {
                    var item = Val[i];
                    filterVal += ValOp + equalOp + item.name;
                    if (i + 1 != Val.length)
                        filterVal += '#OR#';
                }
            }
        }
        return filterVal;
    };
    CreateLayerComponent.prototype.SetDBFProperties = function (parentObj, childObj, DBFProp, DetailPanelProp) {
        if (parentObj) {
            parentObj.DBFProperties = DBFProp;
            parentObj.DetailPanelProperties = DetailPanelProp;
            parentObj.DetailPanelPropertiesMain = DBFProp;
        }
        if (childObj) {
            childObj.DBFProperties = DBFProp;
            childObj.DetailPanelProperties = DetailPanelProp;
            childObj.DetailPanelPropertiesMain = DBFProp;
        }
    };
    CreateLayerComponent = __decorate([
        core_1.Component({
            selector: 'app-create-layer',
            templateUrl: './create-layer.component.html',
            styleUrls: ['./create-layer.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            Utility_service_1.UtilityService,
            map_service_service_1.MapServiceService,
            core_1.Injector,
            auth_service_1.AuthenticationService,
            all_http_request_service_1.HttpRequestService,
            auth_service_1.AuthenticationService])
    ], CreateLayerComponent);
    return CreateLayerComponent;
}());
exports.CreateLayerComponent = CreateLayerComponent;
//# sourceMappingURL=create-layer.component.js.map