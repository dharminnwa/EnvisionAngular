"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var root_component_1 = require("../root/root.component");
var modal_1 = require("ngx-bootstrap/modal");
var ngx_cookie_service_1 = require("ngx-cookie-service");
var toggler_service_1 = require("../../services/toggler.service");
var auth_service_1 = require("../../../services/auth.service");
var MapLayer_service_1 = require("../../../services/MapLayer-service");
var condensed_service_1 = require("../../../services/condensed-service");
var map_service_service_1 = require("../../../services/map-service.service");
var MapLayer_new_service_1 = require("../../../services/MapLayer-new-service");
var map_layer_info_service_1 = require("../../../services/map-layer-info.service");
var private_maplayer_service_1 = require("../../../services/private-maplayer-service");
var CreateLayerToolService_1 = require("../../../services/CreateLayerToolService");
var elevation_profile_service_1 = require("../../../services/elevation-profile.service");
var Utility_service_1 = require("../../../services/Utility.service");
var private_maplayer_service_New_1 = require("../../../services/private-maplayer-service_New");
var google_component_1 = require("../../../maps/google/google.component");
var cartographic_tool_component_1 = require("./cartographic-tool/cartographic-tool.component");
var map_layer_styles_component_1 = require("./map-layer-styles/map-layer-styles.component");
var create_layer_component_1 = require("./create-layer/create-layer.component");
var parcel_buffer_component_1 = require("./parcel-buffer/parcel-buffer.component");
var site_selection_component_1 = require("./site-selection/site-selection.component");
var show_legend_component_1 = require("./show-legend/show-legend.component");
var global_search_result_component_1 = require("./global-search-result/global-search-result.component");
var savesearch_component_1 = require("./savesearch/savesearch.component");
var basemap_component_1 = require("./basemap/basemap.component");
var companies_component_1 = require("../../../manage-companies/companies.component");
var users_component_1 = require("../../../manage-users/users.component");
var add_data_component_1 = require("../../../add-data/add-data.component");
var mymaps_component_1 = require("./mymaps/mymaps.component");
var search_location_component_1 = require("./search-location/search-location.component");
var reverse_geocode_component_1 = require("./reverse-geocode/reverse-geocode.component");
var measure_distance_component_1 = require("./measure-distance/measure-distance.component");
var elevation_profile_component_1 = require("./elevation-profile/elevation-profile.component");
var save_image_component_1 = require("./save-image/save-image.component");
var book_marks_component_1 = require("./book-marks/book-marks.component");
var map_search_data_component_1 = require("../../../map-search-data/map-search-data.component");
var all_http_request_service_1 = require("../../../services/all-http-request.service");
var environment_1 = require("../../../../environments/environment");
var my_profile_component_1 = require("./my-profile/my-profile.component");
var base_map_service_1 = require("../../../services/base-map.service");
var my_map_service_1 = require("../../../services/my-map.service");
var mymap_confirmation_component_1 = require("./mymap-confirmation/mymap-confirmation.component");
var message_service_1 = require("../../components/message/message.service");
var constants_1 = require("../../../models/constants");
var save_create_layerdata_component_1 = require("./create-layer/save-create-layerdata/save-create-layerdata.component");
var logout_confirmation_component_1 = require("./logout-confirmation/logout-confirmation.component");
var draw_tools_service_1 = require("../../../services/draw-tools.service");
var confirm_delete_draw_tool_component_1 = require("./draw-tools/confirm-delete-draw-tool/confirm-delete-draw-tool.component");
var localdata_service_1 = require("../../../services/localdata.service");
var CondensedComponent = (function (_super) {
    __extends(CondensedComponent, _super);
    function CondensedComponent(GoogleMapPage, cookieService, http, route, router, toggler, AuthServices, MapLayerService, condensedService, MapServiceService, MapLayerInfoService, modalService, PrivateMapLayerService, MapLayernewService, bsModalService, CreateLayerToolService, elevationProfileService, UtilityService, httpRequestService, Injector, baseMapService, myMapService, _notification, drawToolService, localDataService, PrivateMapLayerService_new) {
        var _this = _super.call(this, cookieService, http, route, router, toggler, AuthServices, MapLayerService, condensedService, MapServiceService, MapLayerInfoService, modalService, PrivateMapLayerService, MapLayernewService, bsModalService, CreateLayerToolService, UtilityService, httpRequestService, Injector, baseMapService, myMapService, PrivateMapLayerService_new) || this;
        _this.GoogleMapPage = GoogleMapPage;
        _this.cookieService = cookieService;
        _this.http = http;
        _this.route = route;
        _this.router = router;
        _this.toggler = toggler;
        _this.AuthServices = AuthServices;
        _this.MapLayerService = MapLayerService;
        _this.condensedService = condensedService;
        _this.MapServiceService = MapServiceService;
        _this.MapLayerInfoService = MapLayerInfoService;
        _this.modalService = modalService;
        _this.PrivateMapLayerService = PrivateMapLayerService;
        _this.MapLayernewService = MapLayernewService;
        _this.bsModalService = bsModalService;
        _this.CreateLayerToolService = CreateLayerToolService;
        _this.elevationProfileService = elevationProfileService;
        _this.UtilityService = UtilityService;
        _this.httpRequestService = httpRequestService;
        _this.Injector = Injector;
        _this.baseMapService = baseMapService;
        _this.myMapService = myMapService;
        _this._notification = _notification;
        _this.drawToolService = drawToolService;
        _this.localDataService = localDataService;
        _this.PrivateMapLayerService_new = PrivateMapLayerService_new;
        _this.nodetreechecked = true;
        _this.nodes = [];
        //public privateNodes: any = [{"Id":28447,"Name":"Subs_Updated_SP","IconUrl":"http://energymapit.com/en/Handlers/IconImage.ashx?Id=28447&URLType=CustomStyleIcon&FillColor=ffff4500&IconType=Circle&StrokeColor=ff2e8b57&SizePercent=70&StrokeThicknessPercent=10&Opacity=1","IsChecked":true}];
        _this.privateNodes = [];
        _this.sharedNodes = [];
        _this.temporaryLayerNodes = [];
        _this.drawToolsNodes = [];
        _this.sharedDrawToolsNodes = [];
        _this.mapDataType = '';
        // IsLegend: boolean = false;  
        _this.Area_LayerIndex = 1;
        _this.starting_LineIndexval = 50;
        _this.starting_PointIndexval = 50;
        _this.LayerIndexval = 150;
        _this.Line_LayerIndexval = _this.Area_LayerIndex + _this.starting_LineIndexval;
        _this.Point_LayerIndex = _this.Line_LayerIndexval + _this.starting_PointIndexval;
        _this.isEditMapTitle = false;
        _this.mapTitle = '';
        _this.ImageURLPath = environment_1.environment.ImagespreviewPath;
        _this.actionMapping = {
            mouse: {
                click: function (tree, node, $event) {
                    try {
                        var eventElem = undefined;
                        if ($event.toElement) {
                            eventElem = $event.toElement;
                        }
                        else if ($event.srcElement) {
                            eventElem = $event.srcElement;
                        }
                        if (eventElem) {
                            if ($(eventElem.children).length > 0) {
                                if ($(eventElem.children[0].firstChild.nextElementSibling).attr('class') == "CheckboxStatus ng-star-inserted") {
                                    _this.checked(node, !node.data.IsChecked);
                                }
                                else if ($(eventElem.children[0].firstChild.nextElementSibling).attr('class') == "privateCheckboxStatus ng-star-inserted") {
                                    _this.privateLayerChecked(node, node.data.IsChecked);
                                }
                                else if ($(eventElem.children[0].firstChild.nextElementSibling).attr('class') == "sharedCheckboxStatus ng-star-inserted") {
                                    _this.sharedLayerChecked(node, node.data.IsChecked);
                                }
                                else if ($(eventElem.children[0].firstChild.nextElementSibling).attr('class') == "temporaryLayerCheckboxStatus ng-star-inserted") {
                                    _this.Temporarychecked(node, node.data.IsChecked);
                                }
                            }
                            else {
                                if ($(eventElem).attr('class') == "privateCheckboxStatus ng-star-inserted") {
                                    _this.privateLayerChecked(node, node.data.IsChecked);
                                }
                                if ($(eventElem).attr('class') == "sharedCheckboxStatus ng-star-inserted") {
                                    _this.sharedLayerChecked(node, node.data.IsChecked);
                                }
                                if ($(eventElem).attr('class') == "temporaryLayerCheckboxStatus ng-star-inserted") {
                                    _this.Temporarychecked(node, node.data.IsChecked);
                                }
                            }
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
        };
        _this.options = {
            displayField: 'Name',
            isExpandedField: 'expanded',
            idField: 'Id',
            hasChildrenField: 'children',
            actionMapping: _this.actionMapping,
            useTriState: false,
            useCheckbox: false
        };
        _this.groupLayerCountID = [];
        _this.treeList = [];
        _this.isExternalIcon = false;
        _this.privateTreeList = [];
        _this.sharedTreeList = [];
        return _this;
    }
    CondensedComponent.prototype.ngAfterViewInit = function () {
    };
    CondensedComponent.prototype.onSelect = function (event) {
    };
    CondensedComponent.prototype.onDeselect = function (event) {
    };
    CondensedComponent.prototype.Onimgclick = function (id, nodeData, node) {
        var layerType = "EnergyLayer";
        if (!nodeData['children']) {
            var applyclass = 'MapLayerstyle';
            if (window.screen.width < 500) {
                applyclass = '';
            }
            var modalRef = this.modalService.open(map_layer_styles_component_1.MapLayerStylesComponent, { backdropClass: 'light-blue-backdrop', windowClass: applyclass });
            modalRef.componentInstance.Nodedata = nodeData;
            modalRef.componentInstance.Node = node;
            modalRef.componentInstance.ActiveEnergyLayerList = this.GoogleMapPage.energyLayer;
            modalRef.componentInstance.LayerType = layerType;
        }
    };
    CondensedComponent.prototype.OnPrivateLayerimgclick = function (id, nodeData, node) {
        var privateLayerList = this.GoogleMapPage.privateLayer;
        if (privateLayerList && privateLayerList.length > 0) {
            var curItem = privateLayerList.find(function (x) { return x.DataSetID == nodeData.Id; });
            if (curItem && curItem.UploadFileType && (curItem.UploadFileType.indexOf('kml') != -1 || curItem.UploadFileType.indexOf('kmz') != -1))
                return;
        }
        var layerType = "PrivateLayer";
        if (!nodeData['children']) {
            var applyclass = 'MapLayerstyle';
            if (window.screen.width < 500) {
                applyclass = '';
            }
            var modalRef = this.modalService.open(map_layer_styles_component_1.MapLayerStylesComponent, { backdropClass: 'light-blue-backdrop', windowClass: applyclass });
            modalRef.componentInstance.Nodedata = nodeData;
            modalRef.componentInstance.Node = node;
            modalRef.componentInstance.ActiveEnergyLayerList = this.GoogleMapPage.privateLayer;
            modalRef.componentInstance.LayerType = layerType;
        }
    };
    CondensedComponent.prototype.OnSharedLayerimgclick = function (id, nodeData, node) {
        var sharedLayerList = this.GoogleMapPage.sharedLayer;
        if (sharedLayerList && sharedLayerList.length > 0) {
            var curItem = sharedLayerList.find(function (x) { return x.DataSetID == nodeData.Id; });
            if (curItem && curItem.UploadFileType && (curItem.UploadFileType.indexOf('kml') != -1 || curItem.UploadFileType.indexOf('kmz') != -1))
                return;
        }
        var layerType = "PrivateLayer";
        if (!nodeData['children']) {
            var applyclass = 'MapLayerstyle';
            if (window.screen.width < 500) {
                applyclass = '';
            }
            var modalRef = this.modalService.open(map_layer_styles_component_1.MapLayerStylesComponent, { backdropClass: 'light-blue-backdrop', windowClass: applyclass });
            modalRef.componentInstance.Nodedata = nodeData;
            modalRef.componentInstance.Node = node;
            modalRef.componentInstance.ActiveEnergyLayerList = this.GoogleMapPage.sharedLayer;
            modalRef.componentInstance.LayerType = layerType;
        }
    };
    CondensedComponent.prototype.hideActiveCountForKml = function (nodeData) {
        var privateLayerList = this.GoogleMapPage.privateLayer;
        if (privateLayerList && privateLayerList.length > 0) {
            var curItem = privateLayerList.find(function (x) { return x.DataSetID == nodeData.Id; });
            if (curItem && curItem.UploadFileType && (curItem.UploadFileType.indexOf('kml') != -1 || curItem.UploadFileType.indexOf('kmz') != -1))
                return "d-none";
            else
                return "d-block";
        }
        var sharedLayerList = this.GoogleMapPage.sharedLayer;
        if (sharedLayerList && sharedLayerList.length > 0) {
            var curItem = sharedLayerList.find(function (x) { return x.DataSetID == nodeData.Id; });
            if (curItem && curItem.UploadFileType && (curItem.UploadFileType.indexOf('kml') != -1 || curItem.UploadFileType.indexOf('kmz') != -1))
                return "d-none";
            else
                return "d-block";
        }
    };
    CondensedComponent.prototype.Ontemporaryimgcloseclick = function (node, Ischecked, id) {
        if (node.data.FeatureType && (node.data.FeatureType == "CreateLayer" || node.data.FeatureType == "GlobalSearch")) {
            var nodeToDelete = this.temporaryLayertree.treeModel.getNodeById(id);
            this.condensedService.removeNode(nodeToDelete);
            this.RemoveTemporaryTreeNodeData(nodeToDelete);
            this.temporaryLayertree.treeModel.update();
            this.GoogleMapPage.RemoveTabForTemporaryLayer(node);
            //this.GoogleMapPage.RemoveTemporaryLayersBasedOnId(id);
            this.GoogleMapPage.RemoveLayerFromTemporaryLayerList(id);
            if (node.data.FeatureType == "CreateLayer") {
                this.MapLayernewService.LoadGroupMapLayers();
            }
            else if (node.data.FeatureType == "GlobalSearch" || node.data.FeatureType == "ParcelBufferSection") {
                this.MapLayernewService.LoadIndividualGroupMapLayer(node.data.FeatureType);
            }
        }
        else {
            var nodeToDelete = this.temporaryLayertree.treeModel.getNodeById(id);
            this.condensedService.removeNode(nodeToDelete);
            this.RemoveTemporaryTreeNodeData(nodeToDelete);
            this.temporaryLayertree.treeModel.update();
            this.GoogleMapPage.RemoveTabForTemporaryLayer(node);
            this.GoogleMapPage.RemoveTemporaryLayersBasedOnId(id);
            this.GoogleMapPage.RemoveLayerFromTemporaryLayerList(id);
        }
        this.MapLayerInfoService.RemoveInfoBoxByIds(id);
        var isToggleIcon = this.MapServiceService.TemporaryTreeNode.getValue().length > 0 ? true : false;
        this.SidebarLayerGroupIconVisible('temporaryLayerArea', isToggleIcon);
    };
    CondensedComponent.prototype.RemoveTemporaryTreeNodeData = function (nodeToDelete) {
        for (var i = 0; i < this.temporaryLayerNodes.length; i++) {
            if (this.temporaryLayerNodes[i].children) {
                for (var c = 0; c < this.temporaryLayerNodes[i].children.length; c++) {
                    if (this.temporaryLayerNodes[i].children[c]['children']) {
                        for (var c1 = 0; c1 < this.temporaryLayerNodes[i].children[c].children.length; c1++) {
                            if (this.temporaryLayerNodes[i].children[c]['children'][c1]['children']) {
                                if (this.temporaryLayerNodes[i].children[c]['children'][c1]['children'].length == 0) {
                                    nodeToDelete = this.temporaryLayertree.treeModel.getNodeById(this.temporaryLayerNodes[i].children[c]['children'][0]['Id']);
                                    this.condensedService.removeNode(nodeToDelete);
                                }
                            }
                        }
                    }
                    if (this.temporaryLayerNodes[i].children) {
                        if (this.temporaryLayerNodes[i].children[c]["children"]) {
                            if (this.temporaryLayerNodes[i].children[c].children.length == 0) {
                                nodeToDelete = this.temporaryLayertree.treeModel.getNodeById(this.temporaryLayerNodes[i].children[c].Id);
                                this.condensedService.removeNode(nodeToDelete);
                            }
                        }
                    }
                }
                if (this.temporaryLayerNodes[i].children.length == 0) {
                    nodeToDelete = this.temporaryLayertree.treeModel.getNodeById(this.temporaryLayerNodes[i].Id);
                    this.condensedService.removeNode(nodeToDelete);
                }
            }
        }
    };
    CondensedComponent.prototype.Onimgcloseclick = function (node, Ischecked, id) {
        this.tree.treeModel.update();
        var nodeToDelete = this.tree.treeModel.getNodeById(id);
        this.condensedService.removeNode(nodeToDelete);
        var IsGroupLayer = false;
        var GroupLayerId = 0;
        if (nodeToDelete && nodeToDelete.parent) {
            if (nodeToDelete.parent.data.LayerType) {
                if (nodeToDelete.parent.data.LayerType == "GroupLayer") {
                    IsGroupLayer = true;
                    GroupLayerId = nodeToDelete.parent.data.Id;
                }
            }
        }
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].children) {
                for (var c = 0; c < this.nodes[i].children.length; c++) {
                    if (this.nodes[i].children[c]['children']) {
                        for (var c1 = 0; c1 < this.nodes[i].children[c].children.length; c1++) {
                            if (this.nodes[i].children[c]['children'][c1]['children']) {
                                if (this.nodes[i].children[c]['children'][c1]['children'].length == 0) {
                                    nodeToDelete = this.tree.treeModel.getNodeById(this.nodes[i].children[c]['children'][0]['Id']);
                                    this.condensedService.removeNode(nodeToDelete);
                                }
                            }
                        }
                    }
                    if (this.nodes[i].children) {
                        if (this.nodes[i].children[c]["children"]) {
                            if (this.nodes[i].children[c].children.length == 0) {
                                nodeToDelete = this.tree.treeModel.getNodeById(this.nodes[i].children[c].Id);
                                this.condensedService.removeNode(nodeToDelete);
                            }
                        }
                    }
                }
                if (this.nodes[i].children.length == 0) {
                    nodeToDelete = this.tree.treeModel.getNodeById(this.nodes[i].Id);
                    this.condensedService.removeNode(nodeToDelete);
                }
            }
        }
        this.tree.treeModel.update();
        this.GoogleMapPage.removeTab(node);
        this.GoogleMapPage.removeLayersFromMap(id);
        this.RemoveLayerToMapandMapserachLibrary(id);
        this.MapLayernewService.recentFilters = {
            cqlFilter: '',
            sldBody: '',
            id: ''
        };
        // this.MapLayernewService.LoadMapLayers();
        if (IsGroupLayer && GroupLayerId > 0) {
            this.RemoveLayerToMapandMapserachLibrary(GroupLayerId);
        }
        if (node.data.FeatureType == "SiteSelection")
            this.MapLayernewService.LoadIndividualGroupMapLayer(node.data.FeatureType);
        this.MapLayerInfoService.RemoveInfoBoxByIds(id);
        var isToggleIcon = this.MapServiceService.TreeNodes.getValue().length > 0 ? true : false;
        this.SidebarLayerGroupIconVisible('energyLayerArea', isToggleIcon);
    };
    CondensedComponent.prototype.OnimgPrivatecloseclick = function (node, Ischecked, id) {
        var nodeToDelete = this.privatetree.treeModel.getNodeById(id);
        this.condensedService.removePrivateNode(nodeToDelete);
        for (var i = 0; i < this.privateNodes.length; i++) {
            if (this.privateNodes[i].children) {
                for (var c = 0; c < this.privateNodes[i].children.length; c++) {
                    if (this.privateNodes[i].children[c]['children']) {
                        for (var c1 = 0; c1 < this.privateNodes[i].children[c].children.length; c1++) {
                            if (this.privateNodes[i].children[c]['children'][c1]['children']) {
                                if (this.privateNodes[i].children[c]['children'][c1]['children'].length == 0) {
                                    nodeToDelete = this.privatetree.treeModel.getNodeById(this.privateNodes[i].children[c]['children'][0]['Id']);
                                    this.condensedService.removePrivateNode(nodeToDelete);
                                }
                            }
                        }
                    }
                    if (this.privateNodes[i].children) {
                        if (this.privateNodes[i].children[c]["children"]) {
                            if (this.privateNodes[i].children[c].children.length == 0) {
                                nodeToDelete = this.privatetree.treeModel.getNodeById(this.privateNodes[i].children[c].Id);
                                this.condensedService.removePrivateNode(nodeToDelete);
                            }
                        }
                    }
                }
                if (this.privateNodes[i].children.length == 0) {
                    nodeToDelete = this.privatetree.treeModel.getNodeById(this.privateNodes[i].Id);
                    this.condensedService.removePrivateNode(nodeToDelete);
                }
            }
        }
        // this.condensedService.removePrivateNode(nodeToDelete);
        this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
        this.GoogleMapPage.RemovePrivateLayerFromMap(id);
        this.GoogleMapPage.RemoveTabForPrivateLayer(node);
        this.RemovePrivateLayerToMapandMyDataLibrary(node);
        this.GoogleMapPage.RemoveLayerFromPrivateLayerList(id);
        var isToggleIcon = this.MapServiceService.PrivateTreeNode.getValue().length > 0 ? true : false;
        this.SidebarLayerGroupIconVisible('privateLayerArea', isToggleIcon);
        this.MapLayerInfoService.RemoveInfoBoxByIds(id);
    };
    CondensedComponent.prototype.OnimgSharedCloseClick = function (node, Ischecked, id) {
        var nodeToDelete = this.sharedtree.treeModel.getNodeById(id);
        this.condensedService.removePrivateNode(nodeToDelete);
        for (var i = 0; i < this.sharedNodes.length; i++) {
            if (this.sharedNodes[i].children) {
                for (var c = 0; c < this.sharedNodes[i].children.length; c++) {
                    if (this.sharedNodes[i].children[c]['children']) {
                        for (var c1 = 0; c1 < this.sharedNodes[i].children[c].children.length; c1++) {
                            if (this.sharedNodes[i].children[c]['children'][c1]['children']) {
                                if (this.sharedNodes[i].children[c]['children'][c1]['children'].length == 0) {
                                    nodeToDelete = this.sharedtree.treeModel.getNodeById(this.sharedNodes[i].children[c]['children'][0]['Id']);
                                    this.condensedService.removePrivateNode(nodeToDelete);
                                }
                            }
                        }
                    }
                    if (this.sharedNodes[i].children) {
                        if (this.sharedNodes[i].children[c]["children"]) {
                            if (this.sharedNodes[i].children[c].children.length == 0) {
                                nodeToDelete = this.sharedtree.treeModel.getNodeById(this.sharedNodes[i].children[c].Id);
                                this.condensedService.removePrivateNode(nodeToDelete);
                            }
                        }
                    }
                }
                if (this.sharedNodes[i].children.length == 0) {
                    nodeToDelete = this.sharedtree.treeModel.getNodeById(this.sharedNodes[i].Id);
                    this.condensedService.removePrivateNode(nodeToDelete);
                }
            }
        }
        this.MapServiceService._SharedTreeUI.getValue().treeModel.update();
        this.GoogleMapPage.RemoveSharedLayersBasedOnId(id);
        this.GoogleMapPage.RemoveTabForSharedLayer(node);
        this.RemoveSharedLayerToMapandSharedDataLibrary(node);
        this.GoogleMapPage.RemoveLayerFromSharedLayerList(id);
        var isToggleIcon = this.MapServiceService._SharedTreeNode.getValue().length > 0 ? true : false;
        this.SidebarLayerGroupIconVisible('sharedLayerArea', isToggleIcon);
        this.MapLayerInfoService.RemoveInfoBoxByIds(id);
    };
    CondensedComponent.prototype.isLoadIndividualLayer = function (node) {
        if (node.data.FeatureType == "CustomMap")
            return false;
        if (node.data.FeatureType == "SiteSelection")
            return false;
        return true;
    };
    CondensedComponent.prototype.checked = function (node, checked) {
        var _this = this;
        node.data.IsChecked = checked;
        var isLoadIndividualLayer = this.isLoadIndividualLayer(node);
        if (checked == true) {
            node.data.IsChecked = true;
            this.GoogleMapPage.removeTab(node);
            if (node.data.LayerType && node.data.LayerType == 'IndividualLayer' && isLoadIndividualLayer)
                this.GoogleMapPage.RemoveLayesBasedOnid(node.data.Id);
            this.MapLayerInfoService.RemoveInfoBoxByIds(node.data.Id);
        }
        else {
            node.data.IsChecked = false;
            this.GoogleMapPage.bindtab(node);
            if (node.data.LayerType && node.data.LayerType == 'IndividualLayer' && isLoadIndividualLayer)
                this.GoogleMapPage.addlayesbasedonId(node.data.Id);
        }
        //   this.MapLayernewService.LoadMapLayers();
        if (node.data.LayerType == 'GroupLayer' && isLoadIndividualLayer) {
            this.MapLayernewService.LoadGroupMapLayers();
            var IsPerantId;
            if (node.data.IsChecked == true) {
                var existingGroupLayerIndex = this.groupLayerCountID.findIndex(function (x) { return x.parentId == node.parent.data.Id; });
                if (existingGroupLayerIndex > -1)
                    this.groupLayerCountID.splice(existingGroupLayerIndex, 1);
            }
            else {
                IsPerantId = this.groupLayerCountID.find(function (x) { return x.parentId == node.parent.data.Id; });
                if (!IsPerantId) {
                    this.groupLayerCountID.push({ parentId: node.parent.data.Id });
                    this.GoogleMapPage.getTotalCount();
                    this.GoogleMapPage.RefreshAG_GridView();
                }
            }
        }
        if (node.data.FeatureType == "CustomMap")
            this.MapLayernewService.LoadCustomMapLayers();
        if (node.data.FeatureType == "SiteSelection")
            this.MapLayernewService.LoadIndividualGroupMapLayer(node.data.FeatureType);
        setTimeout(function () {
            _this.MapServiceService.GetLegendData();
        }, 100);
    };
    CondensedComponent.prototype.IsAllowedForGroupLayer = function (nodeData) {
        if (nodeData.FeatureType) {
            var featureType_1 = nodeData.FeatureType;
            var isAccess = constants_1.AllowedValuesForGroupLayer.find(function (val) { return val == featureType_1; });
            if (isAccess)
                return true;
        }
        return false;
    };
    CondensedComponent.prototype.Temporarychecked = function (node, checked) {
        var _this = this;
        node.data.IsChecked = checked;
        if (node.data.FeatureType && (node.data.FeatureType == "CreateLayer" || node.data.FeatureType == "GlobalSearch" || node.data.FeatureType == "ParcelBufferSection")) {
            if (node.data.FeatureType == "CreateLayer") {
                if (checked == true) {
                    node.data.IsChecked = false;
                    // this.GoogleMapPage.AddTemporaryLayerBasedOnId(node.data.Id);
                    this.GoogleMapPage.BindTabForTemporaryLayer(node);
                    //this.PrivateMapLayerService_new.LoadGroupMapLayers_Private();
                }
                else {
                    node.data.IsChecked = true;
                    //this.GoogleMapPage.RemoveTemporaryLayersBasedOnId(node.data.Id);
                    this.GoogleMapPage.RemoveTabForTemporaryLayer(node);
                    //this.MapLayerInfoService.RemoveInfoBoxByIds(node.data.Id);
                }
                this.MapLayernewService.LoadGroupMapLayers();
            }
            else if (node.data.FeatureType == "GlobalSearch" || node.data.FeatureType == "ParcelBufferSection") {
                if (checked == true) {
                    node.data.IsChecked = false;
                    // this.GoogleMapPage.AddTemporaryLayerBasedOnId(node.data.Id);
                    this.GoogleMapPage.BindTabForTemporaryLayer(node);
                }
                else {
                    node.data.IsChecked = true;
                    // this.GoogleMapPage.RemoveTemporaryLayersBasedOnId(node.data.Id);
                    this.GoogleMapPage.RemoveTabForTemporaryLayer(node);
                }
                this.MapLayernewService.LoadIndividualGroupMapLayer(node.data.FeatureType);
            }
        }
        else if (node.data.FeatureType == "CustomMap") {
            if (checked == true) {
                node.data.IsChecked = false;
                // this.GoogleMapPage.AddTemporaryLayerBasedOnId(node.data.Id);
                this.GoogleMapPage.BindTabForTemporaryLayer(node);
            }
            else {
                node.data.IsChecked = true;
                // this.GoogleMapPage.RemoveTemporaryLayersBasedOnId(node.data.Id);
                this.GoogleMapPage.RemoveTabForTemporaryLayer(node);
            }
            this.MapLayernewService.LoadCustomMapLayers();
        }
        else {
            if (checked == true) {
                node.data.IsChecked = false;
                this.GoogleMapPage.AddTemporaryLayerBasedOnId(node.data.Id);
                this.GoogleMapPage.BindTabForTemporaryLayer(node);
            }
            else {
                node.data.IsChecked = true;
                this.GoogleMapPage.RemoveTemporaryLayersBasedOnId(node.data.Id);
                this.GoogleMapPage.RemoveTabForTemporaryLayer(node);
            }
        }
        if (node.data.LayerType == "GroupLayer" || node.data.treestatus == "GroupLayer") {
            var IsPerantId;
            if (node.data.IsChecked == true) {
                var existingGroupLayerIndex = this.groupLayerCountID.findIndex(function (x) { return x.parentId == node.parent.data.Id; });
                if (existingGroupLayerIndex > -1)
                    this.groupLayerCountID.splice(existingGroupLayerIndex, 1);
                this.GoogleMapPage.RefreshAG_GridView();
            }
            else {
                IsPerantId = this.groupLayerCountID.find(function (x) { return x.parentId == node.parent.data.Id; });
                if (!IsPerantId) {
                    this.groupLayerCountID.push({ parentId: node.parent.data.Id });
                    this.GoogleMapPage.getTotalCount();
                    this.GoogleMapPage.RefreshAG_GridView();
                }
            }
        }
        this.MapLayerInfoService.RemoveInfoBoxByIds(node.data.Id);
        setTimeout(function () {
            _this.MapServiceService.GetLegendData();
        }, 100);
    };
    CondensedComponent.prototype.privateLayerChecked = function (node, checked) {
        var _this = this;
        node.data.IsChecked = checked;
        var isKML = this.isKMLLayer(node.data.Id, true);
        if (checked == true) {
            node.data.IsChecked = false;
            this.GoogleMapPage.BindTabForPrivateLayer(node);
            if (node.data && node.data.LayerType == "IndividualLayer" && (node.data.FeatureType != "CustomMap" || isKML)) {
                this.GoogleMapPage.AddPrivateLayerBasedOnId(node.data.Id);
            }
        }
        else {
            node.data.IsChecked = true;
            this.GoogleMapPage.RemoveTabForPrivateLayer(node);
            if (node.data && node.data.LayerType == "IndividualLayer" && (node.data.FeatureType != "CustomMap" || isKML)) {
                this.GoogleMapPage.RemovePrivateLayersBasedOnId(node.data.Id);
            }
            this.MapLayerInfoService.RemoveInfoBoxByIds(node.data.Id);
        }
        if (node.data && node.data.LayerType == "GroupLayer") {
            this.MapLayernewService.LoadGroupMapLayers();
            var IsPerantId;
            if (node.data.IsChecked == true) {
                var existingGroupLayerIndex = this.groupLayerCountID.findIndex(function (x) { return x.parentId == node.parent.data.Id; });
                if (existingGroupLayerIndex > -1)
                    this.groupLayerCountID.splice(existingGroupLayerIndex, 1);
            }
            else {
                IsPerantId = this.groupLayerCountID.find(function (x) { return x.parentId == node.parent.data.Id; });
                if (!IsPerantId) {
                    this.groupLayerCountID.push({ parentId: node.parent.data.Id });
                    this.GoogleMapPage.getTotalCount();
                    this.GoogleMapPage.RefreshAG_GridView();
                }
            }
        }
        if (node.data.FeatureType == "CustomMap")
            this.MapLayernewService.LoadCustomMapLayers();
        setTimeout(function () {
            _this.MapServiceService.GetLegendData();
        }, 100);
    };
    CondensedComponent.prototype.sharedLayerChecked = function (node, checked) {
        var _this = this;
        node.data.IsChecked = checked;
        var isKML = this.isKMLLayer(node.data.Id, false);
        if (checked == true) {
            node.data.IsChecked = false;
            this.GoogleMapPage.BindTabForSharedLayer(node);
            if (node.data && node.data.LayerType == "IndividualLayer" && (node.data.FeatureType != "CustomMap" || isKML)) {
                this.GoogleMapPage.AddSharedLayerBasedOnId(node.data.Id);
            }
        }
        else {
            node.data.IsChecked = true;
            this.GoogleMapPage.RemoveTabForSharedLayer(node);
            if (node.data && node.data.LayerType == "IndividualLayer" && (node.data.FeatureType != "CustomMap" || isKML)) {
                this.GoogleMapPage.RemoveSharedLayersBasedOnId(node.data.Id);
            }
            this.MapLayerInfoService.RemoveInfoBoxByIds(node.data.Id);
        }
        if (node.data && node.data.LayerType == "GroupLayer" && node.data.FeatureType != "CustomMap")
            this.MapLayernewService.LoadGroupMapLayers();
        var IsParentId;
        if (node.data.IsChecked == true) {
            var existingGroupLayerIndex = this.groupLayerCountID.findIndex(function (x) { return x.parentId == node.parent.data.Id; });
            if (existingGroupLayerIndex > -1)
                this.groupLayerCountID.splice(existingGroupLayerIndex, 1);
        }
        else {
            IsParentId = this.groupLayerCountID.find(function (x) { return x.parentId == node.parent.data.Id; });
            if (!IsParentId) {
                this.groupLayerCountID.push({ parentId: node.parent.data.Id });
                this.GoogleMapPage.getTotalCount();
                this.GoogleMapPage.RefreshAG_GridView();
            }
        }
        if (node.data.FeatureType == "CustomMap")
            this.MapLayernewService.LoadCustomMapLayers();
        setTimeout(function () {
            _this.MapServiceService.GetLegendData();
        }, 100);
    };
    CondensedComponent.prototype.isKMLLayer = function (id, isPrivateLayer) {
        var layer;
        if (isPrivateLayer) {
            layer = this.GoogleMapPage.privateLayer.find(function (x) { return x.DataSetID == id; });
        }
        else {
            layer = this.GoogleMapPage.sharedLayer.find(function (x) { return x.DataSetID == id; });
        }
        if (layer && layer.UploadFileType && (layer.UploadFileType == ".kml" || layer.UploadFileType == ".kmz")) {
            return true;
        }
        return false;
    };
    CondensedComponent.prototype.ngOnInit = function () {
        // this.MapLayerInfoService.feedbackMethodCalled$.subscribe(x => {
        var _this = this;
        //   this.OpenMapLayerFeedback(x)
        // });
        var userId = this.AuthServices.getLoggedinUserId();
        this.AuthServices.DeleteTempImgData(userId);
        this.MapServiceService.getMapTitledata().subscribe(function (x) {
            _this.mapTitle = x;
        });
        this.MapServiceService.DrawToolTreenode.subscribe(function (data) {
            if (data != null)
                _this.drawToolsNodes = data;
        });
        this.MapServiceService.setMapTitledata('');
        setTimeout(function () {
            _this.MapServiceService.setTreenode(_this.nodes);
            _this.MapServiceService.setTreeUI(_this.tree);
            _this.MapServiceService.setPrivateTreenode(_this.privateNodes);
            _this.MapServiceService.setDrawToolTreenode(_this.drawToolsNodes);
            _this.MapServiceService.setPrivateTreeUI(_this.privatetree);
            _this.MapServiceService.setTemporaryTreenode(_this.temporaryLayerNodes);
            _this.MapServiceService.setTemporaryTreeUI(_this.temporaryLayertree);
            _this.MapServiceService.setSharedTreenode(_this.sharedNodes);
            _this.MapServiceService.setSharedTreeUI(_this.sharedtree);
            _this.MapServiceService.setLayerIndex({ value: _this.LayerIndexval });
            _this.toggleMenuDrawerOpen();
        }, 1000);
        this._footer = false;
        setTimeout(function () {
            $(".page-container").css('padding-left', '0px');
            _this.UtilityService.closeAllPopupmodalbaseonclass();
        }, 100);
        this.GetDrawToolsData();
        this.GetUserRoles();
        this.setSharedLayer();
    };
    CondensedComponent.prototype.setSharedLayer = function () {
        var _this = this;
        this.MapServiceService.SharedDrawToolTreenode.subscribe(function (x) {
            if (x && x.length >= 0)
                _this.sharedDrawToolsNodes = x;
        });
    };
    CondensedComponent.prototype.SetLayerIndexvalue = function (index) {
        if (index["treestatus"] == "Individual") {
            if (!index["Layerindexval"] && this.MapServiceService.LayerIndex.getValue()) {
                var currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
                if (index.RepresentationType == "Line") {
                    index["Layerindexval"] = this.Line_LayerIndexval;
                    this.Line_LayerIndexval++;
                }
                else if (index.RepresentationType == "Point" || index.RepresentationType == "Circle") {
                    index["Layerindexval"] = this.Point_LayerIndex;
                    this.Point_LayerIndex++;
                }
                else if (index.RepresentationType == "Area" || index.RepresentationType == "Shape") {
                    index["Layerindexval"] = this.Area_LayerIndex;
                    this.Area_LayerIndex++;
                }
                else {
                    index["Layerindexval"] = currentIndexVal;
                    this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
                }
            }
        }
        else if (index["treestatus"] == "GroupLayer") {
            if (!index["Layerindexval"] && this.MapServiceService.LayerIndex.getValue()) {
                var currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
                if (index.RepresentationType == "Line") {
                    index["Layerindexval"] = this.Line_LayerIndexval;
                }
                else if (index.RepresentationType == "Point" || index.RepresentationType == "Circle") {
                    index["Layerindexval"] = this.Point_LayerIndex;
                }
                else if (index.RepresentationType == "Area" || index.RepresentationType == "Shape") {
                    index["Layerindexval"] = this.Area_LayerIndex;
                }
                else {
                    index["Layerindexval"] = currentIndexVal;
                    this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
                }
            }
        }
        return index;
    };
    CondensedComponent.prototype.GetTreeData = function (TreeId, defaultCheckedLayersList, layerOrder, mapIdForMapGridFilter, isSiteSelectionTools) {
        var _this = this;
        if (layerOrder === void 0) { layerOrder = []; }
        if (mapIdForMapGridFilter === void 0) { mapIdForMapGridFilter = 0; }
        if (isSiteSelectionTools === void 0) { isSiteSelectionTools = false; }
        var Userid = this.AuthServices.getLoggedinUserId();
        var param = TreeId;
        if (TreeId.ParentLayerId && TreeId.Childs)
            TreeId = TreeId.Childs.toString();
        this.httpRequestService._NodeGetTreeLayer(TreeId, Userid, mapIdForMapGridFilter, isSiteSelectionTools).subscribe(function (data) {
            var res = data;
            var treedata = res;
            var iconlist = _this.MapServiceService.ExternalIconList.getValue();
            if (!iconlist && !_this.isExternalIcon) {
                _this.httpRequestService._NodeGetExternalIcon(Userid).subscribe(function (data) {
                    var Exres = data;
                    if (Exres._Issuccess) {
                        _this.isExternalIcon = true;
                        if (Exres.ExternalIcon.length > 0) {
                            if (!iconlist) {
                                _this.MapServiceService.setExternalIconList(Exres.ExternalIcon);
                            }
                        }
                    }
                }, function (error) {
                    console.log(error);
                });
            }
            _this.MapServiceService._TreeUI.getValue().treeModel.update();
            var nodes = _this.MapServiceService.GetAllChildNodeData();
            if (nodes != undefined && nodes.length > 0) {
                if (nodes[0]["activeCount"] == undefined) {
                    nodes[0]["activeCount"] = 0;
                }
            }
            if (treedata.result.MapLayers.length > 0) {
                _this.Line_LayerIndexval++;
                _this.Point_LayerIndex++;
                _this.Area_LayerIndex++;
            }
            var MapLayers = treedata.result.MapLayers.map(function (el) {
                var o = Object.assign({}, el);
                if (treedata.result.MapLayers.length > 1) {
                    o.treestatus = 'GroupLayer';
                }
                else {
                    o.treestatus = 'Individual';
                }
                o = _this.SetLayerIndexvalue(o);
                return o;
            });
            for (var _i = 0, MapLayers_1 = MapLayers; _i < MapLayers_1.length; _i++) {
                var layer = MapLayers_1[_i];
                if (layer["LayerGridFilterModel"] && layer.LayerGridFilterModel.length > 0 && mapIdForMapGridFilter > 0) {
                    var selectedFilterLayer = [];
                    layer.LayerGridFilterModel.map(function (e) {
                        if (e.MapId == mapIdForMapGridFilter)
                            selectedFilterLayer.push(e);
                    });
                    if (selectedFilterLayer.length > 0) {
                        var GridFilterValue = selectedFilterLayer[0].cqlFilter;
                        if (GridFilterValue) {
                            if (layer.FilterValue) {
                                layer.FilterValue += ";" + GridFilterValue;
                                break;
                            }
                            else {
                                layer.FilterValue = GridFilterValue;
                                break;
                            }
                        }
                    }
                }
            }
            if (layerOrder.length > 0) {
                Array.prototype.push.apply(_this.GoogleMapPage.energyLayer, MapLayers);
                if (param.ParentLayerId && param.Childs)
                    _this.treeList.push({ Id: param.ParentLayerId, Data: treedata });
                else
                    _this.treeList.push({ Id: TreeId, Data: treedata });
                if (_this.treeList.length == layerOrder.length) {
                    var treeListInOrder = [];
                    for (var _a = 0, layerOrder_1 = layerOrder; _a < layerOrder_1.length; _a++) {
                        var id = layerOrder_1[_a];
                        _this.treeList.map(function (e) {
                            if (e.Id == id)
                                treeListInOrder.push(e);
                        });
                    }
                    _this.treeList = [];
                    for (var _b = 0, treeListInOrder_1 = treeListInOrder; _b < treeListInOrder_1.length; _b++) {
                        var treeData = treeListInOrder_1[_b];
                        nodes = _this.MapServiceService.GetAllChildNodeData();
                        if (nodes.length == 0) {
                            Array.prototype.push.apply(_this.MapServiceService.TreeNodes.getValue(), treeData.Data.result.TreeData);
                            _this.MapServiceService._TreeUI.getValue().treeModel.update();
                        }
                        else
                            _this.settreenodes(treeData.Data);
                    }
                }
            }
            else {
                if (nodes.length == 0) {
                    Array.prototype.push.apply(_this.MapServiceService.TreeNodes.getValue(), treedata.result.TreeData);
                    Array.prototype.push.apply(_this.GoogleMapPage.energyLayer, MapLayers);
                    _this.MapServiceService._TreeUI.getValue().treeModel.update();
                }
                else {
                    _this.settreenodes(treedata);
                    Array.prototype.push.apply(_this.GoogleMapPage.energyLayer, MapLayers);
                }
            }
            if (_this.GoogleMapPage.energyLayer.length > 0) {
                for (var _c = 0, _d = _this.GoogleMapPage.energyLayer; _c < _d.length; _c++) {
                    var index = _d[_c];
                    if (!index["isEnergyLayer"])
                        index["isEnergyLayer"] = true;
                    index = _this.UtilityService.setTableAndfiltervalueinEnergyLayers(index);
                }
            }
            setTimeout(function () {
                _this.MapServiceService._TreeUI.getValue().treeModel.update();
                _this.MapServiceService._TreeUI.getValue().treeModel.expandAll();
                _this.UtilityService.OpenCloseEnergyLayerAreaOnSidebar(true);
                if (MapLayers.length > 1) {
                    for (var _i = 0, MapLayers_2 = MapLayers; _i < MapLayers_2.length; _i++) {
                        var mindex = MapLayers_2[_i];
                        if (defaultCheckedLayersList && defaultCheckedLayersList.length > 0) {
                            if (defaultCheckedLayersList.indexOf(mindex.EnergyLayerGUID.toLowerCase()) != -1)
                                _this.ActiveLayerOnmap(mindex.EnergyLayerID);
                        }
                        else
                            _this.ActiveLayerOnmap(mindex.EnergyLayerID);
                    }
                }
                else {
                    if (defaultCheckedLayersList && defaultCheckedLayersList.length > 0) {
                        if (defaultCheckedLayersList.indexOf(MapLayers[0].EnergyLayerGUID.toLowerCase()) != -1)
                            _this.ActiveLayerOnmap(TreeId);
                    }
                    else
                        _this.ActiveLayerOnmap(TreeId);
                }
                var isToggleIcon = _this.MapServiceService.TreeNodes.getValue().length > 0 ? true : false;
                _this.SidebarLayerGroupIconVisible('energyLayerArea', isToggleIcon);
            }, 500);
        }, function (error) {
            console.log(error);
        });
    };
    CondensedComponent.prototype.ActiveLayerOnmap = function (EnergyLayerID) {
        var _this = this;
        setTimeout(function () {
            var TreeImageIcon = document.getElementById(EnergyLayerID + "TreeCostomelayerIconImage");
            if (TreeImageIcon) {
                var src = TreeImageIcon.getAttribute('src');
                var srcWidth = "100";
                var srcOpacity = "1";
                if (src.indexOf('http://energymapit.com/en/Handlers/IconImage.ashx') >= 0) {
                    if (src) {
                        var splitedval = src.split('?');
                        var val = splitedval[1].split('&');
                        for (var _i = 0, val_1 = val; _i < val_1.length; _i++) {
                            var iconstyle = val_1[_i];
                            var s = iconstyle.split('=');
                            var key = s[0];
                            var val1 = s[1];
                            if (key == "SizePercent") {
                                srcWidth = val1;
                            }
                            else if (key == "Opacity") {
                                srcOpacity = val1;
                            }
                        }
                    }
                }
                if (src.indexOf(environment_1.environment.ImagespreviewPath) >= 0) {
                    for (var _a = 0, _b = _this.GoogleMapPage.energyLayer; _a < _b.length; _a++) {
                        var layer = _b[_a];
                        if (layer.EnergyLayerID == EnergyLayerID) {
                            if (layer.EnergyLayerStylesByUserModel.length > 0) {
                                var userstyle = layer.EnergyLayerStylesByUserModel[0];
                                srcWidth = userstyle['SizePercent'];
                                srcOpacity = userstyle['Opacity'];
                            }
                        }
                    }
                }
                srcWidth = Math.round(parseInt(srcWidth) * 20 / 100) + "px";
                var opacityPoint = 1;
                if (parseInt(srcOpacity) > 0) {
                    opacityPoint = 1 - (parseInt(srcOpacity) / 100);
                }
                srcOpacity = "" + parseFloat(opacityPoint.toFixed(2));
                $("#" + EnergyLayerID + "TreeCostomelayerIconImage").attr('style', 'width:' + srcWidth + ";opacity:" + srcOpacity + ";");
            }
            _this.MapServiceService._TreeUI.getValue().treeModel.update();
            _this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
            _this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
            _this.UtilityService.ActiveLayerData(EnergyLayerID, "LoadlayerinTreeData");
        }, 500);
    };
    CondensedComponent.prototype.GetPrivateLayerTreeData = function (TreeId, defaultCheckedLayersList, layerOrder, mapIdForMapGridFilter, userIdForSharedLayers) {
        var _this = this;
        if (layerOrder === void 0) { layerOrder = []; }
        if (mapIdForMapGridFilter === void 0) { mapIdForMapGridFilter = 0; }
        if (userIdForSharedLayers === void 0) { userIdForSharedLayers = ''; }
        var loggedInUserId = this.AuthServices.getLoggedinUserId();
        var userId = this.AuthServices.getLoggedinUserId();
        if (userIdForSharedLayers != '')
            userId = userIdForSharedLayers;
        var privateparam = TreeId;
        if (TreeId.ParentLayerId && TreeId.Childs) {
            var parentId = TreeId.ParentLayerId;
            var childIds = TreeId.Childs.toString();
            this.httpRequestService._NodeGetPrivateGroupTreeLayer(parentId, childIds, userId, loggedInUserId, mapIdForMapGridFilter).subscribe(function (data) {
                _this.SetPrivateLayerOnTree(data, mapIdForMapGridFilter, layerOrder, privateparam, TreeId, defaultCheckedLayersList);
            }, function (error) {
                console.log(error);
            });
        }
        else {
            this.httpRequestService._NodeGetPrivateTreeLayer(TreeId, userId, loggedInUserId, mapIdForMapGridFilter).subscribe(function (data) {
                _this.SetPrivateLayerOnTree(data, mapIdForMapGridFilter, layerOrder, privateparam, TreeId, defaultCheckedLayersList);
            }, function (error) {
                console.log(error);
            });
        }
    };
    CondensedComponent.prototype.SetPrivateLayerOnTree = function (treedata, mapIdForMapGridFilter, layerOrder, param, TreeId, defaultCheckedLayersList) {
        var _this = this;
        var privateNodesData = this.MapServiceService.PrivateTreeNode.getValue();
        if (treedata.result.TreeData.length > 0 && !treedata.result.TreeData[0]["activeCount"]) {
            treedata.result.TreeData[0]["activeCount"] = 0;
        }
        if (treedata.result.MapLayers.length > 0) {
            this.Line_LayerIndexval++;
            this.Point_LayerIndex++;
            this.Area_LayerIndex++;
        }
        var PrivateMapLayers = treedata.result.MapLayers.map(function (el) {
            //var o = Object.assign({}, el);
            // if (treedata.result.MapLayers.length > 1) {
            //   o.treestatus = 'GroupLayer';
            // } else {
            //   o.treestatus = 'Individual';
            //   if (treedata.result.MapLayers.length == 1 && (treedata.result.MapLayers[0].ParentDataSetID != null || treedata.result.MapLayers[0].ParentDataSetID != undefined))
            //     o.treestatus = 'GroupLayer';
            // }
            el = _this.SetLayerIndexvalue(el);
            return el;
        });
        for (var i = 0; i < PrivateMapLayers.length; i++) {
            if (!PrivateMapLayers[i]["isPrivateLayer"])
                PrivateMapLayers[i]["isPrivateLayer"] = true;
            if (!PrivateMapLayers[i]["TableName"])
                PrivateMapLayers[i]["TableName"] = null;
            if (PrivateMapLayers[i]["TableName"] && PrivateMapLayers[i]["UploadFileType"])
                PrivateMapLayers[i]["TableName"] = PrivateMapLayers[i]["TableName"].toLowerCase();
            //PrivateMapLayers[i]["TableName"] = (PrivateMapLayers[i]["TableName"] != null || PrivateMapLayers[i]["TableName"] != undefined) ? PrivateMapLayers[i]["TableName"] : null;
            var detailPanelPropertyMain = PrivateMapLayers[i]["DBFProperties"];
            if (PrivateMapLayers[i]["DBFProperties"] && !PrivateMapLayers[i]["DetailPanelPropertiesMain"]) {
                // treedata.result.MapLayers["DBFProperties"] = treedata.result.MapLayers["DetailPanelProperties"];
                PrivateMapLayers[i]["DetailPanelPropertiesMain"] = detailPanelPropertyMain;
            }
            if (!PrivateMapLayers[i]["EnergyParentID"]) {
                PrivateMapLayers[i]["EnergyParentID"] = 0;
            }
            if (!PrivateMapLayers[i]["EnergyLayerID"]) {
                PrivateMapLayers[i]["EnergyLayerID"] = PrivateMapLayers[i]["DataSetID"];
            }
            if (!PrivateMapLayers[i]["EnergyLayerStylesByUserModel"]) {
                PrivateMapLayers[i]["EnergyLayerStylesByUserModel"] = [];
            }
            if (PrivateMapLayers[i]["LayerGridFilterModel"] && PrivateMapLayers[i].LayerGridFilterModel.length > 0 && mapIdForMapGridFilter == 0) {
                //var GridFilterValue = "";
                var selectedFilterLayer = [];
                PrivateMapLayers[i].LayerGridFilterModel.map(function (e) {
                    if (!e.MapId)
                        selectedFilterLayer.push(e);
                });
                if (selectedFilterLayer.length > 0) {
                    var filterValue = selectedFilterLayer[0].cqlFilter;
                    if (filterValue) {
                        if (PrivateMapLayers[i].FilterValue) {
                            PrivateMapLayers[i].FilterValue += ";" + filterValue;
                        }
                        else {
                            PrivateMapLayers[i].FilterValue = filterValue;
                        }
                    }
                }
            }
            else if (PrivateMapLayers[i]["LayerGridFilterModel"] && PrivateMapLayers[i].LayerGridFilterModel.length > 0 && mapIdForMapGridFilter > 0) {
                var selectedFilterLayer = [];
                PrivateMapLayers[i].LayerGridFilterModel.map(function (e) {
                    if (e.MapId == mapIdForMapGridFilter)
                        selectedFilterLayer.push(e);
                });
                if (selectedFilterLayer.length > 0) {
                    var filterValue = selectedFilterLayer[0].cqlFilter;
                    if (filterValue) {
                        if (PrivateMapLayers[i].FilterValue) {
                            PrivateMapLayers[i].FilterValue += ";" + filterValue;
                        }
                        else {
                            PrivateMapLayers[i].FilterValue = filterValue;
                        }
                    }
                }
            }
            PrivateMapLayers[i] = this.UtilityService.setTableAndfiltervaluein_Private_EnergyLayers(PrivateMapLayers[i]);
        }
        //let MapLayers = treedata.result.MapLayers;
        if (layerOrder.length > 0) {
            Array.prototype.push.apply(this.GoogleMapPage.privateLayer, PrivateMapLayers);
            if (param.ParentLayerId && param.Childs)
                this.privateTreeList.push({ Id: param.ParentLayerId, Data: treedata });
            else
                this.privateTreeList.push({ Id: TreeId, Data: treedata });
            if (this.privateTreeList.length == layerOrder.length) {
                var treeListInOrder = [];
                for (var _i = 0, layerOrder_2 = layerOrder; _i < layerOrder_2.length; _i++) {
                    var id = layerOrder_2[_i];
                    this.privateTreeList.map(function (e) {
                        if (e.Id == id)
                            treeListInOrder.push(e);
                    });
                }
                this.privateTreeList = [];
                for (var _a = 0, treeListInOrder_2 = treeListInOrder; _a < treeListInOrder_2.length; _a++) {
                    var treeData = treeListInOrder_2[_a];
                    privateNodesData = this.MapServiceService.PrivateTreeNode.getValue();
                    if (privateNodesData.length == 0) {
                        Array.prototype.push.apply(this.MapServiceService.PrivateTreeNode.getValue(), treeData.Data.result.TreeData);
                        this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
                    }
                    else
                        this.setprivatetreenodes(treeData.Data);
                }
            }
        }
        else {
            if (privateNodesData.length == 0) {
                Array.prototype.push.apply(this.MapServiceService.PrivateTreeNode.getValue(), treedata.result.TreeData);
                Array.prototype.push.apply(this.GoogleMapPage.privateLayer, PrivateMapLayers);
                this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
            }
            else {
                this.setprivatetreenodes(treedata);
                Array.prototype.push.apply(this.GoogleMapPage.privateLayer, PrivateMapLayers);
            }
        }
        if (this.GoogleMapPage.privateLayer.length > 0) {
            for (var _b = 0, _c = this.GoogleMapPage.privateLayer; _b < _c.length; _b++) {
                var index = _c[_b];
                // if (!index["Layerindexval"] && this.MapServiceService.LayerIndex.getValue()) {
                //   let currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
                //   index["Layerindexval"] = currentIndexVal;
                //   this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
                // }
                index = this.UtilityService.setTableAndfiltervalueinEnergyLayers(index);
            }
        }
        setTimeout(function () {
            _this.MapServiceService._PrivateTreeUI.getValue().treeModel.expandAll();
            _this.UtilityService.OpenClosePrivateLayerAreaOnSidebar(true);
            if (PrivateMapLayers.length > 0 && PrivateMapLayers[0].ParentDataSetID) {
                for (var _i = 0, PrivateMapLayers_1 = PrivateMapLayers; _i < PrivateMapLayers_1.length; _i++) {
                    var pvtLayer = PrivateMapLayers_1[_i];
                    if (defaultCheckedLayersList && defaultCheckedLayersList.length > 0) {
                        if (defaultCheckedLayersList.indexOf(pvtLayer.DataSetGUID.toLowerCase()) != -1)
                            _this.UtilityService.ActiveLayerData(pvtLayer.EnergyLayerID, "LoadlayerinPrivateTreeData");
                    }
                    else
                        _this.UtilityService.ActiveLayerData(pvtLayer.EnergyLayerID, "LoadlayerinPrivateTreeData");
                }
            }
            else {
                if (defaultCheckedLayersList && defaultCheckedLayersList.length > 0) {
                    if (defaultCheckedLayersList.indexOf(PrivateMapLayers[0].DataSetGUID.toLowerCase()) != -1)
                        _this.UtilityService.ActiveLayerData(TreeId, "LoadlayerinPrivateTreeData");
                }
                else
                    _this.UtilityService.ActiveLayerData(TreeId, "LoadlayerinPrivateTreeData");
            }
        }, 1000);
        if (this._menuDrawerOpen == false) {
            this.toggleMenuDrawerOpen();
        }
        var isToggleIcon = this.MapServiceService.PrivateTreeNode.getValue().length > 0 ? true : false;
        this.SidebarLayerGroupIconVisible('privateLayerArea', isToggleIcon);
    };
    CondensedComponent.prototype.GetSharedLayerTreeData = function (TreeId, defaultCheckedLayersList, layerOrder, mapIdForMapGridFilter, userIdForSharedLayers) {
        var _this = this;
        if (layerOrder === void 0) { layerOrder = []; }
        if (mapIdForMapGridFilter === void 0) { mapIdForMapGridFilter = 0; }
        if (userIdForSharedLayers === void 0) { userIdForSharedLayers = ''; }
        var loggedInUserId = this.AuthServices.getLoggedinUserId();
        var userId = this.AuthServices.getLoggedinUserId();
        if (userIdForSharedLayers != '')
            userId = userIdForSharedLayers;
        var sharedparam = TreeId;
        if (TreeId.ParentLayerId && TreeId.Childs) {
            var parentId = TreeId.ParentLayerId;
            var childIds = TreeId.Childs.toString();
            this.httpRequestService._NodeGetPrivateGroupTreeLayer(parentId, childIds, userId, loggedInUserId, mapIdForMapGridFilter).subscribe(function (data) {
                _this.SetSharedLayerOnTree(data, mapIdForMapGridFilter, layerOrder, sharedparam, TreeId, defaultCheckedLayersList);
            }, function (error) {
                console.log(error);
            });
        }
        else {
            this.httpRequestService._NodeGetPrivateTreeLayer(TreeId, userId, loggedInUserId, mapIdForMapGridFilter).subscribe(function (data) {
                _this.SetSharedLayerOnTree(data, mapIdForMapGridFilter, layerOrder, sharedparam, TreeId, defaultCheckedLayersList);
            }, function (error) {
                console.log(error);
            });
        }
    };
    CondensedComponent.prototype.SetSharedLayerOnTree = function (treedata, mapIdForMapGridFilter, layerOrder, param, TreeId, defaultCheckedLayersList) {
        var _this = this;
        var sharedNodesData = this.MapServiceService._SharedTreeNode.getValue();
        if (treedata.result.TreeData.length > 0 && !treedata.result.TreeData[0]["activeCount"]) {
            treedata.result.TreeData[0]["activeCount"] = 0;
        }
        var SharedMapLayers = treedata.result.MapLayers.map(function (el) {
            var o = Object.assign({}, el);
            if (treedata.result.MapLayers.length > 1) {
                o.treestatus = 'GroupLayer';
            }
            else {
                o.treestatus = 'Individual';
                if (treedata.result.MapLayers.length == 1 && (treedata.result.MapLayers[0].ParentDataSetID != null || treedata.result.MapLayers[0].ParentDataSetID != undefined))
                    o.treestatus = 'GroupLayer';
            }
            return o;
        });
        for (var i = 0; i < SharedMapLayers.length; i++) {
            if (!SharedMapLayers[i]["isPrivateLayer"])
                SharedMapLayers[i]["isPrivateLayer"] = true;
            if (!SharedMapLayers[i]["TableName"])
                SharedMapLayers[i]["TableName"] = null;
            if (SharedMapLayers[i]["TableName"] && SharedMapLayers[i]["UploadFileType"])
                SharedMapLayers[i]["TableName"] = SharedMapLayers[i]["TableName"].toLowerCase();
            var detailPanelPropertyMain = SharedMapLayers[i]["DBFProperties"];
            if (SharedMapLayers[i]["DBFProperties"] && !SharedMapLayers[i]["DetailPanelPropertiesMain"]) {
                SharedMapLayers[i]["DetailPanelPropertiesMain"] = detailPanelPropertyMain;
            }
            if (!SharedMapLayers[i]["EnergyParentID"]) {
                SharedMapLayers[i]["EnergyParentID"] = 0;
            }
            if (!SharedMapLayers[i]["EnergyLayerID"]) {
                SharedMapLayers[i]["EnergyLayerID"] = SharedMapLayers[i]["DataSetID"];
            }
            if (!SharedMapLayers[i]["EnergyLayerStylesByUserModel"]) {
                SharedMapLayers[i]["EnergyLayerStylesByUserModel"] = [];
            }
            if (SharedMapLayers[i]["LayerGridFilterModel"] && SharedMapLayers[i].LayerGridFilterModel.length > 0 && mapIdForMapGridFilter == 0) {
                var selectedFilterLayer = [];
                SharedMapLayers[i].LayerGridFilterModel.map(function (e) {
                    if (!e.MapId)
                        selectedFilterLayer.push(e);
                });
                if (selectedFilterLayer.length > 0) {
                    var filterValue = selectedFilterLayer[0].cqlFilter;
                    if (filterValue) {
                        if (SharedMapLayers[i].FilterValue) {
                            SharedMapLayers[i].FilterValue += ";" + filterValue;
                        }
                        else {
                            SharedMapLayers[i].FilterValue = filterValue;
                        }
                    }
                }
            }
            else if (SharedMapLayers[i]["LayerGridFilterModel"] && SharedMapLayers[i].LayerGridFilterModel.length > 0 && mapIdForMapGridFilter > 0) {
                var selectedFilterLayer = [];
                SharedMapLayers[i].LayerGridFilterModel.map(function (e) {
                    if (e.MapId == mapIdForMapGridFilter)
                        selectedFilterLayer.push(e);
                });
                if (selectedFilterLayer.length > 0) {
                    var filterValue = selectedFilterLayer[0].cqlFilter;
                    if (filterValue) {
                        if (SharedMapLayers[i].FilterValue) {
                            SharedMapLayers[i].FilterValue += ";" + filterValue;
                        }
                        else {
                            SharedMapLayers[i].FilterValue = filterValue;
                        }
                    }
                }
            }
            SharedMapLayers[i] = this.UtilityService.setTableAndfiltervaluein_Private_EnergyLayers(SharedMapLayers[i]);
        }
        //let MapLayers = treedata.result.MapLayers;
        if (layerOrder.length > 0) {
            Array.prototype.push.apply(this.GoogleMapPage.sharedLayer, SharedMapLayers);
            if (param.ParentLayerId && param.Childs)
                this.sharedTreeList.push({ Id: param.ParentLayerId, Data: treedata });
            else
                this.sharedTreeList.push({ Id: TreeId, Data: treedata });
            if (this.sharedTreeList.length == layerOrder.length) {
                var treeListInOrder = [];
                for (var _i = 0, layerOrder_3 = layerOrder; _i < layerOrder_3.length; _i++) {
                    var id = layerOrder_3[_i];
                    this.sharedTreeList.map(function (e) {
                        if (e.Id == id)
                            treeListInOrder.push(e);
                    });
                }
                this.sharedTreeList = [];
                for (var _a = 0, treeListInOrder_3 = treeListInOrder; _a < treeListInOrder_3.length; _a++) {
                    var treeData = treeListInOrder_3[_a];
                    sharedNodesData = this.MapServiceService._SharedTreeNode.getValue();
                    if (sharedNodesData.length == 0) {
                        Array.prototype.push.apply(this.MapServiceService._SharedTreeNode.getValue(), treeData.Data.result.TreeData);
                        this.MapServiceService._SharedTreeUI.getValue().treeModel.update();
                    }
                    else
                        this.setsharedtreenodes(treeData.Data);
                }
            }
        }
        else {
            if (sharedNodesData.length == 0) {
                Array.prototype.push.apply(this.MapServiceService._SharedTreeNode.getValue(), treedata.result.TreeData);
                Array.prototype.push.apply(this.GoogleMapPage.sharedLayer, SharedMapLayers);
                this.MapServiceService._SharedTreeUI.getValue().treeModel.update();
            }
            else {
                this.setsharedtreenodes(treedata);
                Array.prototype.push.apply(this.GoogleMapPage.sharedLayer, SharedMapLayers);
            }
        }
        if (this.GoogleMapPage.sharedLayer.length > 0) {
            for (var _b = 0, _c = this.GoogleMapPage.sharedLayer; _b < _c.length; _b++) {
                var index = _c[_b];
                if (!index["Layerindexval"] && this.MapServiceService.LayerIndex.getValue()) {
                    var currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
                    index["Layerindexval"] = currentIndexVal;
                    this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
                }
                index = this.UtilityService.setTableAndfiltervalueinEnergyLayers(index);
            }
        }
        setTimeout(function () {
            _this.MapServiceService._SharedTreeUI.getValue().treeModel.expandAll();
            _this.UtilityService.OpenCloseSharedLayerAreaOnSidebar(true);
            if (SharedMapLayers.length > 0 && SharedMapLayers[0].ParentDataSetID) {
                for (var _i = 0, SharedMapLayers_1 = SharedMapLayers; _i < SharedMapLayers_1.length; _i++) {
                    var srdLayer = SharedMapLayers_1[_i];
                    if (defaultCheckedLayersList && defaultCheckedLayersList.length > 0) {
                        if (defaultCheckedLayersList.indexOf(srdLayer.DataSetGUID.toLowerCase()) != -1)
                            _this.UtilityService.ActiveLayerData(srdLayer.EnergyLayerID, "LoadlayerinSharedTreeData");
                    }
                    else
                        _this.UtilityService.ActiveLayerData(srdLayer.EnergyLayerID, "LoadlayerinSharedTreeData");
                }
            }
            else {
                if (defaultCheckedLayersList && defaultCheckedLayersList.length > 0) {
                    if (defaultCheckedLayersList.indexOf(SharedMapLayers[0].DataSetGUID.toLowerCase()) != -1)
                        _this.UtilityService.ActiveLayerData(TreeId, "LoadlayerinSharedTreeData");
                }
                else
                    _this.UtilityService.ActiveLayerData(TreeId, "LoadlayerinSharedTreeData");
            }
        }, 1000);
        if (this._menuDrawerOpen == false) {
            this.toggleMenuDrawerOpen();
        }
        var isToggleIcon = this.MapServiceService._SharedTreeNode.getValue().length > 0 ? true : false;
        this.SidebarLayerGroupIconVisible('sharedLayerArea', isToggleIcon);
    };
    CondensedComponent.prototype.RemoveLayerFromMyDataLibrary = function (LayerId) {
        var _this = this;
        this.httpRequestService._NodeRemoveDataFromDataSet(LayerId).subscribe(function (data) {
            if (_this.MapServiceService.MyDataLibrary.getValue()) {
                var ids_1 = [LayerId];
                var LayerLibrarys = _this.MapServiceService.MyDataLibrary.getValue()[0].LayerLibrary;
                var filteredData = LayerLibrarys.filter(function (item) { return ids_1.indexOf(item.DataSetID) > -1; });
                if (filteredData.length == 1) {
                    var index = LayerLibrarys.indexOf(filteredData[0]);
                    LayerLibrarys.splice(index, 1);
                }
                _this.MapServiceService.MyDataLibrary.getValue()[0].TotalCount = _this.MapServiceService.MyDataLibrary.getValue()[0].LayerLibrary.length;
                _this.MapServiceService.MyDataLibrary.getValue()[0].DisplayingCount = _this.MapServiceService.MyDataLibrary.getValue()[0].LayerLibrary.length;
                var jsonAllActiveMapLayes = JSON.stringify(_this.MapServiceService.MyDataLibrary.getValue());
                if (localStorage.getItem("AllActivePrivateLayersLibrary") != null) {
                    localStorage.setItem("AllActivePrivateLayersLibrary", jsonAllActiveMapLayes);
                }
            }
        });
    };
    CondensedComponent.prototype.setprivatetreenodes = function (treedata) {
        // this.MapServiceService.PrivateTreeNode.getValue().push(treedata.result.TreeData[0]);
        Array.prototype.push.apply(this.MapServiceService.PrivateTreeNode.getValue(), treedata.result.TreeData);
        this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
        // if (this._menuDrawerOpen == false) {
        //   this.toggleMenuDrawerOpen();
        // }
        this.UtilityService.OpenClosePrivateLayerAreaOnSidebar(true);
    };
    CondensedComponent.prototype.setsharedtreenodes = function (treedata) {
        Array.prototype.push.apply(this.MapServiceService._SharedTreeNode.getValue(), treedata.result.TreeData);
        this.MapServiceService._SharedTreeUI.getValue().treeModel.update();
        this.UtilityService.OpenCloseSharedLayerAreaOnSidebar(true);
    };
    CondensedComponent.prototype.settreenodes = function (treedata) {
        // setTimeout(() => {
        var treeUI = this.MapServiceService._TreeUI.getValue();
        if (treeUI.treeModel.nodes) {
            if (treeUI.treeModel.nodes.length >= 1) {
                for (var i = 0; i < treedata.result.TreeData.length; i++) {
                    var nodedata = treedata.result.TreeData[i];
                    if (nodedata["children"]) {
                        for (var c = 0; c < nodedata["children"].length; c++) {
                            if (nodedata["children"][c]["children"]) {
                                var cid = nodedata["children"][c].Id;
                                var existnode = treeUI.treeModel.getNodeById(cid);
                                if (!existnode) {
                                    var iId = nodedata.Id;
                                    var existnodeiId = treeUI.treeModel.getNodeById(iId);
                                    if (existnodeiId) {
                                        if (existnodeiId.data["children"]) {
                                            existnodeiId.data["children"].push(nodedata["children"][c]);
                                        }
                                    }
                                    if (!existnodeiId) {
                                        treeUI.treeModel.nodes.push(nodedata);
                                    }
                                }
                                else {
                                    if (nodedata["children"][c]["children"]) {
                                        for (var ccid = 0; ccid < nodedata["children"][c]["children"].length; ccid++) {
                                            var ccnodeid = nodedata["children"][c]["children"][ccid].Id;
                                            var existnodeiccId = treeUI.treeModel.getNodeById(ccnodeid);
                                            if (!existnodeiccId) {
                                                existnode.data["children"].push(nodedata["children"][c]["children"][ccid]);
                                            }
                                            else {
                                                if (nodedata["children"][c]["children"][ccid]["children"]) {
                                                    if (nodedata["children"][c]["children"][ccid]["children"].length == 1) {
                                                        existnodeiccId.data["children"].push(nodedata["children"][c]["children"][ccid]["children"][0]);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                var nodesid = nodedata.Id;
                                var existnodesId = treeUI.treeModel.getNodeById(nodesid);
                                if (existnodesId) {
                                    existnodesId.data["children"].push(nodedata["children"][c]);
                                }
                                if (!existnodesId) {
                                    treeUI.treeModel.nodes.push(nodedata);
                                }
                            }
                        }
                    }
                }
            }
            else {
                this.nodes = treedata.result.TreeData;
            }
        }
        else {
            this.nodes = treedata.result.TreeData;
        }
        treeUI.treeModel.update();
        // this.GoogleMapPage.AddLayersToMap(this.energylayer);
        // }, 2000);
    };
    CondensedComponent.prototype.OpenCompanyModal = function () {
        this.modalService.open(companies_component_1.CompaniesComponent, { size: 'lg', centered: true, backdrop: 'static', windowClass: 'company-modal' });
    };
    CondensedComponent.prototype.OpenUserModal = function () {
        this.modalService.open(users_component_1.UsersComponent, { size: 'lg', centered: true, backdrop: 'static', windowClass: 'user-modal' });
    };
    CondensedComponent.prototype.dropdownToggleEvent = function (event) {
        event.currentTarget.click();
    };
    CondensedComponent.prototype.profiledropdownToggleEvent = function (event) {
        //event.currentTarget.children[0].click();
    };
    CondensedComponent.prototype.openCollapseMenu = function () {
        var collapsedElement = document.getElementsByClassName('collapsed')[0];
        if (collapsedElement != undefined) {
            collapsedElement.click();
        }
    };
    CondensedComponent.prototype.Redirect = function (routeName) {
        if (routeName === 'intelligence') {
            this.router.navigateByUrl('/envision/intelligence');
            $(".page-container").css('padding-left', '0px');
        }
        else if (routeName === 'maps') {
            this.router.navigateByUrl('/envision/maps');
            $(".page-container").css('padding-left', '0px');
        }
        else if (routeName === 'home') {
            this.router.navigateByUrl('/envision/home');
            $(".page-container").css('padding-left', '0px');
        }
        else if (routeName === 'home-new') {
            this.router.navigateByUrl('/envision/home-new');
            $(".page-container").css('padding-left', '0px');
        }
    };
    CondensedComponent.prototype.mapsearchData = function (tabId) {
        var _this = this;
        if (tabId === void 0) { tabId = 1; }
        this.mapDataType = 'MapsearchData';
        if (tabId == 1) {
            this.mapDataType = 'MapsearchData';
        }
        else if (tabId == 2) {
            this.mapDataType = 'myData';
        }
        else if (tabId == 3) {
            this.mapDataType = 'SharedData';
        }
        var LoginId = this.AuthServices.getLoggedinUserId();
        if (!this.MapServiceService.MapsearchLayersCategory.getValue()) {
            this.httpService._NodeGetLayerCategoey(LoginId, "Energy Layer Group", 0).subscribe(function (data) {
                // let LayersLibrary = JSON.stringify(data);
                // let res = JSON.parse(LayersLibrary);
                var LayersLibrary = data;
                var res = LayersLibrary;
                if (res.errormsg == "") {
                    res["IsLoaded"] = true;
                    _this.MapServiceService.setMapsearchLayersCategory(res);
                    _this.OpenMapsearchDataLibrary();
                    if (res.LayerLibrary && res.LayerLibrary.length > 0) {
                        if (res.LayerLibrary[0]["CategoryChilds"]) {
                            if (res.LayerLibrary[0].CategoryChilds.length > 0) {
                                _this.MapServiceService.showDefaultCategoryId = res.LayerLibrary[0].CategoryChilds[0].CategoryID;
                            }
                            else {
                                _this.MapServiceService.showDefaultCategoryId = res.LayerLibrary[0].CategoryID;
                            }
                        }
                        else {
                            _this.MapServiceService.showDefaultCategoryId = res.LayerLibrary[0].CategoryID;
                        }
                    }
                    else {
                        _this.MapServiceService.showDefaultCategoryId = res.LayerLibrary[0].CategoryID;
                    }
                }
                else {
                    //console.log(res.errorms);
                    _this.OpenMapsearchDataLibrary();
                }
            }, function (error) {
                console.log(error);
            });
        }
        else {
            this.OpenMapsearchDataLibrary();
        }
        // if (!this.MapServiceService.MapsearchLayersCategory.getValue()) {
        //   this.MapServiceService.GetLayersCategory(LoginId, "Energy Layer Group", 0).subscribe(data => {
        //     let LayersLibrary = data.json();
        //     let res = JSON.parse(LayersLibrary);
        //     if (res.errormsg == "") {
        //       res["IsLoaded"] = true;
        //       this.MapServiceService.setMapsearchLayersCategory(res);
        //       this.OpenMapsearchDataLibrary();
        //       if (res.LayerLibrary && res.LayerLibrary[0].length > 0 && res.LayerLibrary[0][0].CategoryChilds.length > 0) {
        //         this.MapServiceService.showDefaultCategoryId = res.LayerLibrary[0][0].CategoryChilds[0].CategoryID;
        //       }
        //       else {
        //         this.MapServiceService.showDefaultCategoryId = res.LayerLibrary[0][0].CategoryID;
        //       }
        //     }
        //     else {
        //       //console.log(res.errorms);
        //       this.OpenMapsearchDataLibrary();
        //     }
        //     this.mapDataType = 'mapsearchData';
        //   }, error => {
        //     console.log(error);
        //   })
        // }
        // else {
        //   this.OpenMapsearchDataLibrary();
        // }
    };
    CondensedComponent.prototype.OpenMapsearchDataLibrary = function () {
        var activeModal = this.modalService.open(map_search_data_component_1.MapSearchDataComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false, windowClass: "xlModal" });
        activeModal.componentInstance.modalName = this.mapDataType;
    };
    CondensedComponent.prototype.RemoveLayerToMapandMapserachLibrary = function (LayerId) {
        if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
            for (var _i = 0, _a = this.MapServiceService.EnergyLayerLibrary.getValue(); _i < _a.length; _i++) {
                var a = _a[_i];
                for (var _b = 0, _c = a.LayerLibrary; _b < _c.length; _b++) {
                    var e = _c[_b];
                    if (e.EnergyLayerID == LayerId) {
                        if (e.Addtomap != 'Add to map') {
                            e.Addtomap = 'Add to map';
                        }
                    }
                }
            }
        }
        if (this.MapServiceService._GlobalsearchLayerList.getValue()) {
            for (var _d = 0, _e = this.MapServiceService._GlobalsearchLayerList.getValue(); _d < _e.length; _d++) {
                var a = _e[_d];
                for (var _f = 0, _g = a.LayerLibrary; _f < _g.length; _f++) {
                    var e = _g[_f];
                    if (e.EnergyLayerID == LayerId) {
                        if (e.Addtomap != 'Add to map') {
                            e.Addtomap = 'Add to map';
                        }
                    }
                }
            }
        }
    };
    CondensedComponent.prototype.RemovePrivateLayerToMapandMyDataLibrary = function (node) {
        var LayerId = node.data.Id;
        var LayerParentId = '';
        if (node.parent && node.parent.data && node.parent.data.Id)
            LayerParentId = node.parent.data.Id;
        if (this.MapServiceService.MyDataLibrary.getValue()) {
            for (var _i = 0, _a = this.MapServiceService.MyDataLibrary.getValue(); _i < _a.length; _i++) {
                var a = _a[_i];
                for (var _b = 0, _c = a.LayerLibrary; _b < _c.length; _b++) {
                    var e = _c[_b];
                    if (e.DataSetID == LayerId || e.DataSetID == LayerParentId) {
                        if (e.Addtomap != 'Add to map') {
                            e.Addtomap = 'Add to map';
                        }
                    }
                }
            }
        }
    };
    CondensedComponent.prototype.RemoveSharedLayerToMapandSharedDataLibrary = function (node) {
        var LayerId = node.data.Id;
        var LayerParentId = '';
        if (node.parent && node.parent.data && node.parent.data.Id)
            LayerParentId = node.parent.data.Id;
        if (this.MapServiceService._SharedData.getValue()) {
            for (var _i = 0, _a = this.MapServiceService._SharedData.getValue(); _i < _a.length; _i++) {
                var layer = _a[_i];
                if (layer.DataSetID == LayerId || layer.DataSetID == LayerParentId) {
                    if (layer.Addtomap != 'Add to map') {
                        layer.Addtomap = 'Add to map';
                    }
                }
            }
        }
    };
    CondensedComponent.prototype.AddLayerToMyDataLibrary = function (AddedLayerData) {
        if (this.MapServiceService.MyDataLibrary.getValue()) {
            var UploaderDisplayName = void 0;
            if (!AddedLayerData["Delete"] && !AddedLayerData["Edit"] && !AddedLayerData["Addtomap"]) {
                AddedLayerData["Delete"] = 'Delete';
                AddedLayerData["Edit"] = 'Edit';
                AddedLayerData["Addtomap"] = 'Remove from map';
            }
            if (!AddedLayerData["LayerType"]) {
                AddedLayerData["LayerType"] = "Private Layer";
            }
            UploaderDisplayName = this.AuthServices.GetUsername();
            if (!AddedLayerData["UploaderDisplayName"]) {
                AddedLayerData["UploaderDisplayName"] = UploaderDisplayName;
            }
            for (var _i = 0, _a = this.MapServiceService.MyDataLibrary.getValue(); _i < _a.length; _i++) {
                var a = _a[_i];
                a.LayerLibrary.push(AddedLayerData);
            }
            this.MapServiceService.MyDataLibrary.getValue()[0].TotalCount = this.MapServiceService.MyDataLibrary.getValue()[0].LayerLibrary.length;
            this.MapServiceService.MyDataLibrary.getValue()[0].DisplayingCount = this.MapServiceService.MyDataLibrary.getValue()[0].LayerLibrary.length;
            // this.MapServiceService.MydataLibraryCount.getValue().push(this.MapServiceService.MyDataLibrary.getValue()[0].LayerLibrary.length);
            this.UtilityService.SortByKeyDesc(this.MapServiceService.MyDataLibrary.getValue()[0].LayerLibrary, "ModifiedDate");
            var jsonAllActiveMapLayes = JSON.stringify(this.MapServiceService.MyDataLibrary.getValue());
            if (localStorage.getItem("AllActivePrivateLayersLibrary") != null) {
                localStorage.setItem("AllActivePrivateLayersLibrary", jsonAllActiveMapLayes);
            }
        }
    };
    CondensedComponent.prototype.OpenBaseMap = function () {
        this.bsModalService.show(basemap_component_1.BasemapComponent, { class: 'modal-lg modal-dialog-centered xlModal', animated: false, backdrop: 'static' });
    };
    CondensedComponent.prototype.OpenMyProfile = function () {
        this.bsModalService.show(my_profile_component_1.MyProfileComponent, { class: 'modal-lg modal-dialog-centered xlModal', animated: false, backdrop: 'static' });
    };
    CondensedComponent.prototype.OpenAddadtaModal = function () {
        this.bsModalService.show(add_data_component_1.AddDataComponent, { class: 'modal-lg modal-dialog-centered adddata-modal', animated: false, backdrop: 'static' });
    };
    CondensedComponent.prototype.OpenMyMaps = function () {
        var activeModal = this.modalService.open(mymaps_component_1.MymapsComponent, { size: 'lg', centered: true, backdrop: 'static', windowClass: "myMaps-modal" });
        activeModal.componentInstance.modalName = 'myMap';
    };
    CondensedComponent.prototype.OpenSharedMaps = function () {
        var activeModal = this.modalService.open(mymaps_component_1.MymapsComponent, { size: 'lg', centered: true, backdrop: 'static', windowClass: "myMaps-modal" });
        activeModal.componentInstance.modalName = 'sharedMap';
    };
    CondensedComponent.prototype.OpenMyData = function () {
        this.mapsearchData(2);
    };
    CondensedComponent.prototype.OpenSharedData = function () {
        this.mapsearchData(3);
    };
    CondensedComponent.prototype.SearchLocation = function () {
        this.CloseOpenedDropdownMenu();
        this.bsModalService.show(search_location_component_1.SearchLocationComponent, { class: 'modal-sm Tool-modal modal-dialog-centered', backdrop: 'static', animated: false });
    };
    CondensedComponent.prototype.ReverseGeoCode = function () {
        this.CloseOpenedDropdownMenu();
        this.bsModalService.show(reverse_geocode_component_1.ReverseGeocodeComponent, { class: 'modal-sm Tool-modal reverseGeocode', backdrop: 'static', animated: false });
    };
    CondensedComponent.prototype.MeasureDistance = function () {
        this.CloseOpenedDropdownMenu();
        this.bsModalService.show(measure_distance_component_1.MeasureDistanceComponent, { class: 'modal-sm mesure-distance Tool-modal modal-dialog-centered', backdrop: 'static', animated: false });
    };
    CondensedComponent.prototype.ElevationProfile = function () {
        this.CloseOpenedDropdownMenu();
        this.bsModalService.show(elevation_profile_component_1.ElevationProfileComponent, { class: 'modal-sm elevationProfile modal-dialog-centered', backdrop: 'static', animated: false });
        this.elevationProfileService.DrawToolsForElevation();
    };
    CondensedComponent.prototype.OpenSaveImage = function () {
        this.bsModalService.show(save_image_component_1.SaveImageComponent, { class: 'modal-lg Tool-modal modal-dialog-centered', backdrop: 'static', animated: false });
    };
    CondensedComponent.prototype.OpenBookmark = function () {
        this.bsModalService.show(book_marks_component_1.BookMarksComponent, { class: 'modal-lg Tool-modal modal-dialog-centered', backdrop: 'static', animated: false });
    };
    CondensedComponent.prototype.OpenLogoutConfirmation = function () {
        this.bsModalService.show(logout_confirmation_component_1.LogoutConfirmationComponent, { class: 'modal-md logout-confirmation modal-dialog-centered', backdrop: 'static', animated: false });
    };
    CondensedComponent.prototype.OpenPrivateLayerAreaOnSidebar = function () {
        var collapsedElement = document.getElementById('privateLayerArea');
        var cc = collapsedElement.querySelector('.card-header');
        if (collapsedElement.children[0].getAttribute("aria-expanded") == "false")
            cc.click();
    };
    CondensedComponent.prototype.RemoveChildChildNodeData = function (list, idInstance) {
        var _loop_1 = function (a) {
            var Treeecheckboxlement = document.getElementById(list[a].Id + idInstance);
            if (Treeecheckboxlement == null) {
                setTimeout(function () { Treeecheckboxlement.click(); }, 1000);
            }
            else
                Treeecheckboxlement.click();
        };
        for (var a = 0; a < list.length; a++) {
            _loop_1(a);
        }
    };
    CondensedComponent.prototype.BlankMap = function () {
        var _this = this;
        //Remove Energy Layers
        var nodeList = [];
        nodeList = this.MapServiceService.GetAllChildNodeData();
        if (nodeList.length > 0) {
            var nodeListData = JSON.parse(JSON.stringify(nodeList));
            var _loop_2 = function (a) {
                var Treeecheckboxlement = document.getElementById(nodeListData[a].Id + 'RemoveTreeData');
                if (Treeecheckboxlement == null) {
                    setTimeout(function () { Treeecheckboxlement.click(); }, 1000);
                }
                else
                    Treeecheckboxlement.click();
            };
            for (var a = 0; a < nodeListData.length; a++) {
                _loop_2(a);
            }
        }
        //Remove Private Layers
        // let pvtLegendList = this.MapServiceService.PrivateTreeNode.getValue();
        var pvtLegendList = this.UtilityService.GetChildNodeData(this.MapServiceService.PrivateTreeNode.getValue());
        if (pvtLegendList != null && pvtLegendList.length > 0) {
            if (pvtLegendList.length > 0) {
                var pvtLayerData = JSON.parse(JSON.stringify(pvtLegendList));
                var _loop_3 = function (a) {
                    // if (pvtLayerData[a].children && pvtLayerData[a].children.length > 0) {
                    //   this.RemoveChildChildNodeData(pvtLayerData[a].children,'RemoveTreeData');
                    //   continue;
                    // }
                    var Treeecheckboxlement = document.getElementById(pvtLayerData[a].Id + 'RemoveTreeData');
                    if (Treeecheckboxlement == null) {
                        setTimeout(function () { Treeecheckboxlement.click(); }, 1000);
                    }
                    else
                        Treeecheckboxlement.click();
                };
                for (var a = 0; a < pvtLayerData.length; a++) {
                    _loop_3(a);
                }
            }
        }
        //Remove Shared Layers
        var srdLegendList = this.UtilityService.GetChildNodeData(this.MapServiceService._SharedTreeNode.getValue());
        if (srdLegendList != null && srdLegendList.length > 0) {
            if (srdLegendList.length > 0) {
                var srdLayerData = JSON.parse(JSON.stringify(srdLegendList));
                var _loop_4 = function (a) {
                    var Treeecheckboxlement = document.getElementById(srdLayerData[a].Id + 'RemoveTreeData');
                    if (Treeecheckboxlement == null) {
                        setTimeout(function () { Treeecheckboxlement.click(); }, 1000);
                    }
                    else
                        Treeecheckboxlement.click();
                };
                for (var a = 0; a < srdLayerData.length; a++) {
                    _loop_4(a);
                }
            }
        }
        // Remove Temporary Layers
        var tempLayerList = this.MapServiceService.TemporaryTreeNode.getValue();
        if (tempLayerList != null && tempLayerList.length > 0) {
            if (tempLayerList.length > 0) {
                var tempLayerListData = JSON.parse(JSON.stringify(tempLayerList));
                var _loop_5 = function (a) {
                    if (tempLayerListData[a].Id == "200008") {
                        if (tempLayerListData[a].children && tempLayerListData[a].children.length > 0)
                            this_1.RemoveChildChildNodeData(tempLayerListData[a].children, 'RemovetemporaryTreeData');
                        return "continue";
                    }
                    var Treeecheckboxlement = document.getElementById(tempLayerListData[a].Id + 'RemovetemporaryTreeData');
                    if (Treeecheckboxlement == null) {
                        setTimeout(function () { Treeecheckboxlement.click(); }, 1000);
                    }
                    else
                        Treeecheckboxlement.click();
                };
                var this_1 = this;
                for (var a = 0; a < tempLayerListData.length; a++) {
                    _loop_5(a);
                }
            }
        }
        this.MapServiceService.LodedGridData.next([]);
        $('.infoBox').remove();
        this.SetDefaultMap();
        // var closeDrawingTool = document.getElementById('CloseDrawingTool');
        // if (closeDrawingTool != undefined) { closeDrawingTool.click(); }
        this.drawToolService.RemoveAllLayersFromMap();
        // RemoveParcelBuffer If Exist
        var closeParcelBuffer = document.getElementById('parcelBufferClose');
        if (closeParcelBuffer != undefined) {
            closeParcelBuffer.click();
        }
        //remove my map data
        this.myMapService.isCustomMapLoaded = false;
        this.myMapService.loadedMapData = null;
        this.isEditMapTitle = false;
        this.MapServiceService.setMapTitledata('');
        //remove site selection data
        this.MapServiceService.siteSelectionData.isLayerLoaded = false;
        this.MapServiceService.siteSelectionData.loadedEnergyLayerIds = null;
        this.MapServiceService.siteSelectionData.loadedToolsData = null;
        //clear savedgeodatarequest
        this.httpRequestService.geoRequestSavedData.next([]);
        this.ShowLegends(true);
        setTimeout(function () {
            _this.MapServiceService.GetLegendData();
        }, 100);
        this.LayerIndexval = 100;
        this.MapServiceService.LayerIndex.getValue().value = 100;
        this.Area_LayerIndex = 1;
        this.Line_LayerIndexval = this.Area_LayerIndex + this.starting_LineIndexval;
        this.Point_LayerIndex = this.Line_LayerIndexval + this.starting_PointIndexval;
        //delete temp image data
        var userId = this.AuthServices.getLoggedinUserId();
        this.AuthServices.DeleteTempImgData(userId);
    };
    CondensedComponent.prototype.SetDefaultMap = function () {
        var List = this.MapServiceService.BaseMapData.getValue();
        var activeBasemap;
        if (List.BaseMapData && List.BaseMapData.length > 0)
            List.BaseMapData.forEach(function (el) { el.IsDefault = false; });
        if (List.MapSettingData && List.MapSettingData.length > 0) {
            var Id_1 = List.MapSettingData[0].BaseMapProviderID;
            activeBasemap = List.BaseMapData.filter(function (m) { return m.BaseMapProviderID == Id_1; })[0];
            activeBasemap.IsDefault = true;
        }
        else {
            activeBasemap = List.BaseMapData.filter(function (m) { return m.IsDefault == true; })[0];
        }
        if (activeBasemap)
            this.baseMapService.setBasemap(activeBasemap, 5);
        else {
            var defaultMap = this.MapServiceService._mapdata.getValue();
            var center = { lat: 39.5, lng: -98.35 };
            var myOptions = {
                zoom: 5,
                center: center,
                mapTypeId: 'hybrid',
                maxZoom: 21,
                minZoom: 4
            };
            defaultMap.setOptions(myOptions);
        }
    };
    // DrawTools() {
    //   this.CloseOpenedDropdownMenu();
    //   this.MapServiceService.DrawTools();
    // }
    CondensedComponent.prototype.CartoGraphicTools = function () {
        this.bsModalService.show(cartographic_tool_component_1.CartographicToolComponent, { class: 'modal-sm Tool-modal modal-dialog-centered', backdrop: 'static', animated: false });
    };
    CondensedComponent.prototype.PrivateLayerVisible = function () {
        var _this = this;
        setTimeout(function () {
            var privateNodeList = _this.GoogleMapPage.privateLayer;
            var pvtLayerArea = document.getElementById('privateLayerArea');
            if (privateNodeList != null && privateNodeList != undefined && privateNodeList.length > 0 && pvtLayerArea != undefined) {
                pvtLayerArea.classList.remove('hide');
            }
            else {
                pvtLayerArea.classList.add('hide');
            }
        }, 1000);
    };
    CondensedComponent.prototype.SidebarLayerGroupIconVisible = function (groupID, isToggleIcon) {
        setTimeout(function () {
            var LayerArea = document.getElementById(groupID);
            if (LayerArea != undefined) {
                if (isToggleIcon && LayerArea != undefined) {
                    LayerArea.classList.add('showIcon');
                }
                else {
                    LayerArea.classList.remove('showIcon');
                }
            }
        }, 1000);
    };
    CondensedComponent.prototype.OpenCreateLayer = function () {
        var config = { class: 'modal-lg modal-dialog-centered Data-modal', backdrop: 'static', animated: false };
        this.bsModalService.show(create_layer_component_1.CreateLayerComponent, config);
    };
    // OpenMapLayerFeedback(data) {
    //   let activeModel = this.modalService.open(MapLayerFeedbackComponent, { size: 'sm', centered: true, keyboard: false, backdrop: 'static', windowClass: 'feedback-modal' });
    //   activeModel.componentInstance.data = data;
    // }
    CondensedComponent.prototype.OpenParcelBuffer = function () {
        var config = { class: 'modal-sm parcelBuffer modal-dialog-centered', backdrop: 'static', animated: false };
        this.bsModalService.show(parcel_buffer_component_1.ParcelBufferComponent, config);
    };
    CondensedComponent.prototype.OpenDrawTools = function () {
        this.GoogleMapPage.OpenDrawTools();
    };
    CondensedComponent.prototype.OpenSiteSelection = function () {
        var config = { class: 'modal-lg siteSelection', backdrop: 'static', animated: false };
        this.bsModalService.show(site_selection_component_1.SiteSelectionComponent, config);
    };
    CondensedComponent.prototype.ShowLegends = function (hideLegend) {
        var _this = this;
        if (hideLegend === void 0) { hideLegend = false; }
        if ($('#ToggleLegend').text().trim() == 'Show Legend' && hideLegend == false) {
            this.bsModalService.show(show_legend_component_1.ShowLegendComponent, { class: 'modal-sm LegendModal slide-right', backdrop: 'static', animated: false });
            setTimeout(function () { _this.GoogleMapPage.SetLegendBasedOnGrid(); }, 100);
            $('#ToggleLegend').text('Hide Legend');
        }
        else {
            if ($('#LegendModal').length > 0) {
                $('#LegendModal').remove();
            }
            $('#ToggleLegend').text('Show Legend');
        }
    };
    CondensedComponent.prototype.SetTemporaryTreeNode = function (TreeList) {
        var _this = this;
        if (TreeList.children != undefined && TreeList.children.length > 0) {
            this.MapServiceService.TemporaryTreeNode.getValue().push(TreeList);
        }
        else {
            Array.prototype.push.apply(this.MapServiceService.TemporaryTreeNode.getValue(), TreeList);
        }
        this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
        setTimeout(function () {
            _this.MapServiceService._TemporaryTreeUI.getValue().treeModel.expandAll();
            _this.UtilityService.OpenCloseTemporaryLayerAreaOnSidebar(true);
            var treeUI = _this.MapServiceService._TemporaryTreeUI.getValue();
            var _loop_6 = function (t) {
                var treeval = TreeList[t];
                // if (treeval.Id >= 100000 && treeval.Id <= 100006) {        
                var TempTreeData = treeUI.treeModel.getNodeById(treeval.Id);
                // if (TempTreeData && TempTreeData.data && !TempTreeData.data.IsChecked) {
                //   continue;
                // }
                if (treeval.Id == 200008 && treeval.children && treeval.children.length > 0) {
                    for (var i = 0; i < treeval.children.length; i++) {
                        var childElement = treeval.children[i];
                        _this.UtilityService.ActiveLayerData(childElement.Id, "LoadlayerintemporaryTreeData");
                    }
                    return "continue";
                }
                setTimeout(function () {
                    _this.UtilityService.ActiveLayerData(treeval.Id, "LoadlayerintemporaryTreeData");
                }, 500);
                // }
            };
            for (var t = 0; t < TreeList.length; t++) {
                _loop_6(t);
            }
        }, 1000);
        var isToggleIcon = this.MapServiceService.TemporaryTreeNode.getValue().length > 0 ? true : false;
        this.SidebarLayerGroupIconVisible('temporaryLayerArea', isToggleIcon);
    };
    CondensedComponent.prototype.SetTemporaryTreeNodeForWidget = function (TreeList) {
        var _this = this;
        setTimeout(function () {
            Array.prototype.push.apply(_this.MapServiceService.TemporaryTreeNode.getValue(), TreeList);
            _this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
            var isToggleIcon = _this.MapServiceService.TemporaryTreeNode.getValue().length > 0 ? true : false;
            _this.SidebarLayerGroupIconVisible('temporaryLayerArea', isToggleIcon);
            _this.MapServiceService._TemporaryTreeUI.getValue().treeModel.expandAll();
            _this.UtilityService.OpenCloseTemporaryLayerAreaOnSidebar(true);
            var treeUI = _this.MapServiceService._TemporaryTreeUI.getValue();
            var _loop_7 = function (t) {
                var treeval = TreeList[t];
                // if (treeval.Id >= 100000 && treeval.Id <= 200006) {
                var TempTreeData = treeUI.treeModel.getNodeById(treeval.Id);
                // if (TempTreeData && TempTreeData.data && TempTreeData.data.IsChecked) {
                //   continue;
                // }
                setTimeout(function () {
                    _this.UtilityService.ActiveLayerData(treeval.Id, "LoadlayerintemporaryTreeData");
                }, 500);
                //}
            };
            for (var t = 0; t < TreeList.length; t++) {
                _loop_7(t);
            }
        }, 500);
    };
    CondensedComponent.prototype.GlobalSearch = function () {
        var globalSearchModalElement = document.getElementById('globalSearchModal');
        var globalSearchText = $('#txtGlobalSearch').val();
        if (globalSearchText != '' && globalSearchText != undefined && globalSearchText != null) {
            this.MapServiceService.setGlobalSearchText(globalSearchText);
            if (!globalSearchModalElement) {
                this.bsModalService.show(global_search_result_component_1.GlobalSearchResultComponent, { class: 'modal-lg globalSearch-modal modal-dialog-centered', backdrop: 'static', animated: false });
            }
            else {
                this.MapServiceService.GlobalSearchResult();
            }
        }
        else {
            this.MapServiceService.setGlobalSearchText(null);
        }
    };
    CondensedComponent.prototype.ClearGlobalSearch = function () {
        this.searchText = '';
        this.MapServiceService.setGlobalSearchText(null);
        var selectedItem = this.MapServiceService.ActiveSearchDataLibrary.getValue();
        selectedItem.searchText = '';
        this.MapServiceService.setActiveSearchDataLibrary(selectedItem);
    };
    CondensedComponent.prototype.SaveTemporaryLayer = function (temporaryLayer, ID) {
        if (temporaryLayer && temporaryLayer.data && temporaryLayer.data.Id && temporaryLayer.data.Id == "200008") {
            var saveModal = this.modalService.open(save_create_layerdata_component_1.SaveCreateLayerdataComponent, { size: 'lg', centered: true, backdrop: 'static', windowClass: "SaveCreatelayerModal" });
            saveModal.componentInstance.temporaryLayer = temporaryLayer;
            saveModal.componentInstance.temporaryLayerID = ID;
            return;
        }
        var modalRef = this.modalService.open(savesearch_component_1.SavesearchComponent, { size: 'sm', centered: true, backdrop: 'static', windowClass: "SaveSearchModal" });
        modalRef.componentInstance.temporaryLayer = temporaryLayer;
        modalRef.componentInstance.temporaryLayerID = ID;
        modalRef.componentInstance.StatusOfSaveLayers = "temporaryLayer";
    };
    CondensedComponent.prototype.CloseOpenedDropdownMenu = function () {
        document.getElementById("dropdownMenu").style.display = 'none';
        setTimeout(function () {
            document.getElementById("dropdownMenu").removeAttribute('style');
        }, 500);
    };
    CondensedComponent.prototype.ToggleMapTitle = function () {
        this.isEditMapTitle = !this.isEditMapTitle;
        if (this.mapTitle)
            this.MapServiceService.setMapTitledata(this.mapTitle.trim());
    };
    CondensedComponent.prototype.OpenMyMapConfirmationModal = function (isSharedMap) {
        var bsModalRef = this.bsModalService.show(mymap_confirmation_component_1.MyMapConfirmationComponent, { class: 'modal-lg myMapConfirmation modal-dialog-centered', backdrop: 'static', animated: false });
        bsModalRef.content.isSharedMap = isSharedMap;
    };
    CondensedComponent.prototype.SaveMap = function () {
        var _this = this;
        if (this.mapTitle) {
            this.MapServiceService.setMapTitledata(this.mapTitle.trim());
            if (this.myMapService.isCustomMapLoaded == false) {
                this.httpRequestService._NodeCheckMapName(this.MapServiceService.getMapTitledata().getValue()).subscribe(function (data) {
                    if (data._Issuccess && data.isMapNameExists == false) {
                        var CustomMap = _this.myMapService.GetCustomMapData();
                        var EnergyLayers = _this.GoogleMapPage.energyLayer.map(function (obj) { return obj.EnergyLayerID; });
                        var PrivateLayers = _this.GoogleMapPage.privateLayer.map(function (obj) { return obj.DataSetID; });
                        var DefaultCheckedLayer = _this.myMapService.GetDefaultCheckedLayers(_this.GoogleMapPage.energyLayer, _this.GoogleMapPage.privateLayer, _this.GoogleMapPage.sharedLayer);
                        var sharedLayer = _this.GoogleMapPage.sharedLayer.map(function (obj) { return obj.DataSetID; });
                        if (sharedLayer && sharedLayer.length > 0) {
                            PrivateLayers.push.apply(PrivateLayers, sharedLayer);
                        }
                        var LayerGridFilters = _this.myMapService.GetLayerGridFilter();
                        var EnergyLayersStylebyuser = [];
                        var LegendOrder;
                        if ($('#ToggleLegend').text().trim() == 'Hide Legend') {
                            LegendOrder = _this.GoogleMapPage.energyLayer.map(function (obj) { return obj.EnergyLayerGUID; });
                            if (LegendOrder.length > 0) {
                                LegendOrder = LegendOrder.join('#');
                            }
                            CustomMap["LegendOrder"] = LegendOrder;
                        }
                        _this.GoogleMapPage.energyLayer.forEach(function (s) {
                            if (s.EnergyLayerStylesByUserModel && s.EnergyLayerStylesByUserModel.length > 0) {
                                EnergyLayersStylebyuser.push(s.EnergyLayerStylesByUserModel[0].Id);
                            }
                        });
                        if (PrivateLayers.length > 0) {
                            var PrivateParentIds = _this.GoogleMapPage.privateLayer.map(function (obj) { return obj.ParentDataSetID; }).filter(function (obj) { return obj; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
                            if (PrivateParentIds.length > 0) {
                                PrivateLayers = PrivateLayers.concat(PrivateParentIds);
                                if (DefaultCheckedLayer.length > 0) {
                                    var ParentIds = [];
                                    _this.GoogleMapPage.privateLayer.map(function (e) {
                                        if (e.ParentDataSetID) {
                                            ParentIds.push({ DataSetID: e.DataSetID, ParentDataSetID: e.ParentDataSetID });
                                        }
                                    });
                                    var needToAddGUIDOfDataSetID = [];
                                    for (var _i = 0, PrivateParentIds_1 = PrivateParentIds; _i < PrivateParentIds_1.length; _i++) {
                                        var id = PrivateParentIds_1[_i];
                                        var allChildLayers = [];
                                        ParentIds.map(function (e) {
                                            if (e.ParentDataSetID == id)
                                                allChildLayers.push(e);
                                        });
                                        var checkedChildLayers = [];
                                        for (var _a = 0, allChildLayers_1 = allChildLayers; _a < allChildLayers_1.length; _a++) {
                                            var child = allChildLayers_1[_a];
                                            DefaultCheckedLayer.map(function (e) {
                                                if (e.DataSetID == child.DataSetID)
                                                    checkedChildLayers.push(child);
                                            });
                                        }
                                        if (checkedChildLayers.length == allChildLayers.length) {
                                            needToAddGUIDOfDataSetID.push(allChildLayers[0].ParentDataSetID);
                                        }
                                    }
                                    if (needToAddGUIDOfDataSetID.length > 0) {
                                        _this.httpRequestService._NodeGetGUIDOfDataSets(needToAddGUIDOfDataSetID).subscribe(function (data) {
                                            if (data._Issuccess && data.result.length > 0) {
                                                for (var _i = 0, _a = data.result; _i < _a.length; _i++) {
                                                    var layer = _a[_i];
                                                    DefaultCheckedLayer.push({ DataSetID: layer.DataSetID, GUID: layer.DataSetGUID });
                                                }
                                                DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                                                _this.httpRequestService._NodeSaveMyMap(CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(function (data) {
                                                    if (data._Issuccess) {
                                                        var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                                        _this.myMapService.AddMapInUserMapList(mapData);
                                                        _this.myMapService.loadedMapData = data.CustomMapData;
                                                        _this.myMapService.isCustomMapLoaded = true;
                                                        _this.isEditMapTitle = false;
                                                        _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                                            Position: constants_1.NotificationPosition.TopRight,
                                                            Style: constants_1.NotificationStyle.Simple,
                                                            Duration: constants_1.NotificationDuration
                                                        });
                                                    }
                                                }, function (error) {
                                                    _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                                        Position: constants_1.NotificationPosition.TopRight,
                                                        Style: constants_1.NotificationStyle.Simple,
                                                        Duration: constants_1.NotificationDuration
                                                    });
                                                });
                                            }
                                        }, function (error) {
                                            _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                                Position: constants_1.NotificationPosition.TopRight,
                                                Style: constants_1.NotificationStyle.Simple,
                                                Duration: constants_1.NotificationDuration
                                            });
                                        });
                                    }
                                    else {
                                        DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                                        _this.httpRequestService._NodeSaveMyMap(CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(function (data) {
                                            if (data._Issuccess) {
                                                var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                                _this.myMapService.AddMapInUserMapList(mapData);
                                                _this.myMapService.loadedMapData = data.CustomMapData;
                                                _this.myMapService.isCustomMapLoaded = true;
                                                _this.isEditMapTitle = false;
                                                _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                                    Position: constants_1.NotificationPosition.TopRight,
                                                    Style: constants_1.NotificationStyle.Simple,
                                                    Duration: constants_1.NotificationDuration
                                                });
                                            }
                                        }, function (error) {
                                            _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                                Position: constants_1.NotificationPosition.TopRight,
                                                Style: constants_1.NotificationStyle.Simple,
                                                Duration: constants_1.NotificationDuration
                                            });
                                        });
                                    }
                                }
                                else {
                                    DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                                    _this.httpRequestService._NodeSaveMyMap(CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(function (data) {
                                        if (data._Issuccess) {
                                            var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                            _this.myMapService.AddMapInUserMapList(mapData);
                                            _this.myMapService.loadedMapData = data.CustomMapData;
                                            _this.myMapService.isCustomMapLoaded = true;
                                            _this.isEditMapTitle = false;
                                            _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                                Position: constants_1.NotificationPosition.TopRight,
                                                Style: constants_1.NotificationStyle.Simple,
                                                Duration: constants_1.NotificationDuration
                                            });
                                        }
                                    }, function (error) {
                                        _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                            Position: constants_1.NotificationPosition.TopRight,
                                            Style: constants_1.NotificationStyle.Simple,
                                            Duration: constants_1.NotificationDuration
                                        });
                                    });
                                }
                            }
                            else {
                                DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                                _this.httpRequestService._NodeSaveMyMap(CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(function (data) {
                                    if (data._Issuccess) {
                                        var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                        _this.myMapService.AddMapInUserMapList(mapData);
                                        _this.myMapService.loadedMapData = data.CustomMapData;
                                        _this.myMapService.isCustomMapLoaded = true;
                                        _this.isEditMapTitle = false;
                                        _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                            Position: constants_1.NotificationPosition.TopRight,
                                            Style: constants_1.NotificationStyle.Simple,
                                            Duration: constants_1.NotificationDuration
                                        });
                                    }
                                }, function (error) {
                                    _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                        Position: constants_1.NotificationPosition.TopRight,
                                        Style: constants_1.NotificationStyle.Simple,
                                        Duration: constants_1.NotificationDuration
                                    });
                                });
                            }
                        }
                        else {
                            DefaultCheckedLayer = DefaultCheckedLayer.map(function (obj) { return obj.GUID; });
                            _this.httpRequestService._NodeSaveMyMap(CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(function (data) {
                                if (data._Issuccess) {
                                    var mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                                    _this.myMapService.AddMapInUserMapList(mapData);
                                    _this.myMapService.loadedMapData = data.CustomMapData;
                                    _this.myMapService.isCustomMapLoaded = true;
                                    _this.isEditMapTitle = false;
                                    _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                                        Position: constants_1.NotificationPosition.TopRight,
                                        Style: constants_1.NotificationStyle.Simple,
                                        Duration: constants_1.NotificationDuration
                                    });
                                }
                            }, function (error) {
                                _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                                    Position: constants_1.NotificationPosition.TopRight,
                                    Style: constants_1.NotificationStyle.Simple,
                                    Duration: constants_1.NotificationDuration
                                });
                            });
                        }
                    }
                    else if (data._Issuccess && data.isMapNameExists) {
                        _this._notification.create(constants_1.NotificationColor.Danger, "The name of the map is used by another map!", {
                            Position: constants_1.NotificationPosition.TopRight,
                            Style: constants_1.NotificationStyle.Simple,
                            Duration: constants_1.NotificationDuration
                        });
                    }
                }, function (error) {
                    _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                        Position: constants_1.NotificationPosition.TopRight,
                        Style: constants_1.NotificationStyle.Simple,
                        Duration: constants_1.NotificationDuration
                    });
                });
            }
            else {
                var userId = this.AuthServices.getLoggedinUserId();
                var isSharedMaps = false;
                if (this.myMapService.loadedMapData.CustomMaps && this.myMapService.loadedMapData.CustomMaps[0].UserId.toLowerCase() != userId.toLowerCase())
                    isSharedMaps = true;
                this.OpenMyMapConfirmationModal(isSharedMaps);
                this.isEditMapTitle = false;
            }
        }
    };
    CondensedComponent.prototype.Logout = function () {
        var EnergyLayers = this.GoogleMapPage.energyLayer.map(function (obj) { return obj.EnergyLayerID; });
        var PrivateLayers = this.GoogleMapPage.privateLayer.map(function (obj) { return obj.DataSetID; });
        if (this.myMapService.isCustomMapLoaded == false && (EnergyLayers.length > 0 || PrivateLayers.length > 0)) {
            this.OpenLogoutConfirmation();
        }
        else {
            this.AuthServices.LogoutUserProfile();
        }
    };
    CondensedComponent.prototype.blankmaptitle = function () {
        if (this.myMapService.isCustomMapLoaded == false)
            this.mapTitle = "";
        this.isEditMapTitle = false;
    };
    CondensedComponent.prototype.GetDrawToolsData = function () {
        var _this = this;
        var userId = this.AuthServices.getLoggedinUserId();
        this.httpRequestService._NodeGetDrawTools(userId).subscribe(function (data) {
            if (data._Issuccess == true) {
                data.DrawTools.forEach(function (item) {
                    item['isChecked'] = false;
                });
                _this.drawToolsNodes = data.DrawTools;
                var isToggleIcon = false;
                var drawToolData = _this.MapServiceService.DrawToolTreenode.getValue();
                _this.MapServiceService.setDrawToolTreenode(_this.drawToolsNodes);
                if ((drawToolData && drawToolData.length > 0) || _this.sharedDrawToolsNodes.length > 0)
                    isToggleIcon = true;
                _this.SidebarLayerGroupIconVisible('drawToolArea', isToggleIcon);
            }
        });
        var custId = this.AuthServices.getCustomerId();
        this.httpRequestService._NodeGetSharedDrawTools(userId, custId).subscribe(function (data) {
            if (data && data._Issuccess == true) {
                data.layers.forEach(function (item) {
                    item['isChecked'] = false;
                });
                _this.sharedDrawToolsNodes = data.layers;
                var isToggleIcon = false;
                var drawToolData = _this.MapServiceService.DrawToolTreenode.getValue();
                _this.MapServiceService.setSharedDrawToolTreenode(_this.sharedDrawToolsNodes);
                if (drawToolData.length > 0 || _this.sharedDrawToolsNodes.length > 0)
                    isToggleIcon = true;
                _this.SidebarLayerGroupIconVisible('drawToolArea', isToggleIcon);
            }
        });
    };
    CondensedComponent.prototype.GetUserRoles = function () {
        var _this = this;
        var userId = this.AuthServices.getLoggedinUserId();
        this.httpRequestService._NodeGetUserRoles(userId).subscribe(function (data) {
            if (data && data._Issuccess == true && (!data.errormsg)) {
                var existingUserData = _this.AuthServices.GetUserData();
                if (existingUserData) {
                    existingUserData.CustomerRoles = data.result.CustomerRoles;
                    existingUserData.LayerCategoriesRoles = data.result.LayerCategoriesRoles;
                    _this.localDataService.setUserData(existingUserData);
                }
            }
            _this.MapServiceService.setSitePermissions(data.result);
        });
    };
    CondensedComponent.prototype.DrawToolsCheckedChange = function (item) {
        if (item) {
            if (item.isChecked == true) {
                if (item.EditableLayerID != this.editDrawToolId)
                    this.drawToolService.AddDrawingLayer(item.EditableLayerID);
            }
            else {
                if (item.EditableLayerID == this.editDrawToolId) {
                    this.editDrawToolId = undefined;
                    return;
                }
                this.drawToolService.RemoveAddedLayer(item.EditableLayerID);
            }
        }
    };
    CondensedComponent.prototype.DeleteDrawTool = function (id) {
        var _this = this;
        var config = { class: 'modal-sm modal-dialog-centered', backdrop: 'static', animated: false };
        var bsModalRef = this.bsModalService.show(confirm_delete_draw_tool_component_1.ConfirmDeleteDrawToolComponent, config);
        bsModalRef.content.layerId = id;
        setTimeout(function () {
            var isToggleIcon = _this.MapServiceService.DrawToolTreenode.getValue().length > 0 ? true : false;
            _this.SidebarLayerGroupIconVisible('drawToolArea', isToggleIcon);
        }, 2000);
    };
    CondensedComponent.prototype.DeleteSharedDrawTool = function (id, index) {
        var _this = this;
        var config = { class: 'modal-sm modal-dialog-centered', backdrop: 'static', animated: false };
        var bsModalRef = this.bsModalService.show(confirm_delete_draw_tool_component_1.ConfirmDeleteDrawToolComponent, config);
        bsModalRef.content.layerId = id;
        bsModalRef.content.isShared = true;
        bsModalRef.content.isDelete.take(1).subscribe(function (value) {
            if (value == true)
                _this.sharedDrawToolsNodes.splice(index, 1);
        });
        setTimeout(function () {
            var isToggleIcon = _this.MapServiceService.DrawToolTreenode.getValue().length > 0 ? true : false;
            _this.SidebarLayerGroupIconVisible('drawToolArea', isToggleIcon);
        }, 2000);
    };
    CondensedComponent.prototype.EditDrawTool = function (id) {
        this.editDrawToolId = id;
        var items = this.MapServiceService.DrawToolTreenode.getValue();
        var selectedEditItem = items.find(function (x) { return x.EditableLayerID == id; });
        if (!selectedEditItem) {
            var sharedItems = this.MapServiceService.SharedDrawToolTreenode.getValue();
            selectedEditItem = sharedItems.find(function (x) { return x.EditableLayerID == id; });
        }
        var checkbox = $('#' + id + 'LoadlayerinDrawToolData');
        if (selectedEditItem && selectedEditItem.isChecked == false) {
            if (checkbox) {
                checkbox.click();
            }
        }
        else if (selectedEditItem && selectedEditItem.isChecked == true) {
            this.drawToolService.RemoveAddedLayer(id);
        }
        this.GoogleMapPage.OpenDrawTools(id);
    };
    CondensedComponent.prototype.DeleteSharedLayerNode = function (id) {
        var layers = this.MapServiceService.SharedDrawToolTreenode.getValue();
        var index = layers.findIndex(function (x) { return x.EditableLayerID == id; });
        if (index > -1)
            layers.splice(index, 1);
        this.MapServiceService.setSharedDrawToolTreenode(layers);
    };
    __decorate([
        core_1.ViewChild('tree'),
        __metadata("design:type", Object)
    ], CondensedComponent.prototype, "tree", void 0);
    __decorate([
        core_1.ViewChild('privatetree'),
        __metadata("design:type", Object)
    ], CondensedComponent.prototype, "privatetree", void 0);
    __decorate([
        core_1.ViewChild('sharedtree'),
        __metadata("design:type", Object)
    ], CondensedComponent.prototype, "sharedtree", void 0);
    __decorate([
        core_1.ViewChild('temporaryLayertree'),
        __metadata("design:type", Object)
    ], CondensedComponent.prototype, "temporaryLayertree", void 0);
    CondensedComponent = __decorate([
        core_1.Component({
            selector: 'condensed-layout',
            templateUrl: './condensed.component.html',
            styleUrls: ['./condensed.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [ng_bootstrap_1.NgbModal] //, ElevationPofileService
        }),
        __metadata("design:paramtypes", [google_component_1.GoogleMapPage,
            ngx_cookie_service_1.CookieService,
            http_1.Http,
            router_1.ActivatedRoute,
            router_1.Router,
            toggler_service_1.pagesToggleService,
            auth_service_1.AuthenticationService,
            MapLayer_service_1.MapLayerService,
            condensed_service_1.condensedService,
            map_service_service_1.MapServiceService,
            map_layer_info_service_1.MapLayerInfoService,
            ng_bootstrap_1.NgbModal,
            private_maplayer_service_1.PrivateMapLayerService,
            MapLayer_new_service_1.MapLayernewService,
            modal_1.BsModalService,
            CreateLayerToolService_1.CreateLayerToolService,
            elevation_profile_service_1.ElevationPofileService,
            Utility_service_1.UtilityService,
            all_http_request_service_1.HttpRequestService,
            core_1.Injector,
            base_map_service_1.BaseMapService,
            my_map_service_1.MyMapService,
            message_service_1.MessageService,
            draw_tools_service_1.DrawingToolService,
            localdata_service_1.LocalDataService,
            private_maplayer_service_New_1.PrivateMapLayerService_new])
    ], CondensedComponent);
    return CondensedComponent;
}(root_component_1.RootLayout));
exports.CondensedComponent = CondensedComponent;
//# sourceMappingURL=condensed.component.js.map