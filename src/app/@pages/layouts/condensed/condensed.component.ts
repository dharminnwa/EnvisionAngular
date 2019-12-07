import { Component, OnInit, ViewChild, ViewEncapsulation, Injector } from '@angular/core';
import { Http } from '@angular/http';
import { Router, Event, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RootLayout } from '../root/root.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { CookieService } from 'ngx-cookie-service';
import { TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions, TreeNode } from 'angular-tree-component';


import { pagesToggleService } from '../../services/toggler.service';
import { AuthenticationService } from '../../../services/auth.service';
import { MapLayerService } from '../../../services/MapLayer-service';
import { condensedService } from '../../../services/condensed-service';
import { MapServiceService } from '../../../services/map-service.service';
import { MapLayernewService } from '../../../services/MapLayer-new-service';
import { MapLayerInfoService } from '../../../services/map-layer-info.service';
import { PrivateMapLayerService } from '../../../services/private-maplayer-service';
import { CreateLayerToolService } from '../../../services/CreateLayerToolService';
import { ElevationPofileService } from '../../../services/elevation-profile.service';
import { UtilityService } from '../../../services/Utility.service';
import { PrivateMapLayerService_new } from '../../../services/private-maplayer-service_New';

import { GoogleMapPage } from '../../../maps/google/google.component';
import { CartographicToolComponent } from './cartographic-tool/cartographic-tool.component';
import { MapLayerStylesComponent } from './map-layer-styles/map-layer-styles.component'
import { MapLayerFeedbackComponent } from './map-layer-feedback/map-layer-feedback.component';
import { CreateLayerComponent } from './create-layer/create-layer.component';
import { ParcelBufferComponent } from './parcel-buffer/parcel-buffer.component';
import { SiteSelectionComponent } from './site-selection/site-selection.component';
import { ShowLegendComponent } from './show-legend/show-legend.component';
import { GlobalSearchResultComponent } from './global-search-result/global-search-result.component';
import { SavesearchComponent } from './savesearch/savesearch.component';
import { BasemapComponent } from './basemap/basemap.component';
import { CompaniesComponent } from '../../../manage-companies/companies.component';
import { UsersComponent } from '../../../manage-users/users.component';
import { AddDataComponent } from '../../../add-data/add-data.component';
import { MymapsComponent } from './mymaps/mymaps.component';
import { SearchLocationComponent } from './search-location/search-location.component';
import { ReverseGeocodeComponent } from './reverse-geocode/reverse-geocode.component';
import { MeasureDistanceComponent } from './measure-distance/measure-distance.component';
import { ElevationProfileComponent } from './elevation-profile/elevation-profile.component';
import { SaveImageComponent } from './save-image/save-image.component';
import { BookMarksComponent } from './book-marks/book-marks.component';
import { MapSearchDataComponent } from '../../../map-search-data/map-search-data.component';

import * as _ from 'lodash';
import { HttpRequestService } from '../../../services/all-http-request.service';
import { environment } from '../../../../environments/environment';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { BaseMapService } from '../../../services/base-map.service';
import { MyMapService } from '../../../services/my-map.service';
import { MyMapConfirmationComponent } from './mymap-confirmation/mymap-confirmation.component';
import { MessageService } from '../../components/message/message.service';
import { NotificationColor, NotificationPosition, NotificationStyle, NotificationDuration, AllowedValuesForGroupLayer } from '../../../models/constants';
import { SaveCreateLayerdataComponent } from './create-layer/save-create-layerdata/save-create-layerdata.component';
import { LogoutConfirmationComponent } from './logout-confirmation/logout-confirmation.component';
import { DrawToolsComponent } from './draw-tools/draw-tools.component';
import { DrawingToolService } from '../../../services/draw-tools.service';
import { ConfirmDeleteDrawToolComponent } from './draw-tools/confirm-delete-draw-tool/confirm-delete-draw-tool.component';
import { LocalDataService } from '../../../services/localdata.service';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'condensed-layout',
  templateUrl: './condensed.component.html',
  styleUrls: ['./condensed.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModal]//, ElevationPofileService
})
export class CondensedComponent extends RootLayout implements OnInit {
  public UserName: string;
  nodetreechecked: boolean = true;
  public nodes: any = [];
  //public privateNodes: any = [{"Id":28447,"Name":"Subs_Updated_SP","IconUrl":"http://energymapit.com/en/Handlers/IconImage.ashx?Id=28447&URLType=CustomStyleIcon&FillColor=ffff4500&IconType=Circle&StrokeColor=ff2e8b57&SizePercent=70&StrokeThicknessPercent=10&Opacity=1","IsChecked":true}];
  public privateNodes: any = [];
  public sharedNodes: any = [];
  public temporaryLayerNodes: any = [];
  public drawToolsNodes: any = [];
  public sharedDrawToolsNodes: any[] = [];
  public mapDataType = '';
  bsModalRef: BsModalRef;
  // IsLegend: boolean = false;  
  public Area_LayerIndex = 1
  public starting_LineIndexval = 50;
  public starting_PointIndexval = 50;
  public LayerIndexval = 150;
  public Line_LayerIndexval = this.Area_LayerIndex + this.starting_LineIndexval;
  public Point_LayerIndex = this.Line_LayerIndexval + this.starting_PointIndexval;



  public Roles;
  public isEditMapTitle: boolean = false;
  public mapTitle: string = '';
  searchText: string;
  ImageURLPath: string = environment.ImagespreviewPath;
  editDrawToolId;
  constructor(public GoogleMapPage: GoogleMapPage,
    public cookieService: CookieService,
    public http: Http,
    public route: ActivatedRoute,
    public router: Router,
    public toggler: pagesToggleService,
    public AuthServices: AuthenticationService,
    public MapLayerService: MapLayerService,
    public condensedService: condensedService,
    public MapServiceService: MapServiceService,
    public MapLayerInfoService: MapLayerInfoService,
    public modalService: NgbModal,
    public PrivateMapLayerService: PrivateMapLayerService,
    public MapLayernewService: MapLayernewService,
    private bsModalService: BsModalService,
    public CreateLayerToolService: CreateLayerToolService,
    public elevationProfileService: ElevationPofileService,
    public UtilityService: UtilityService,
    private httpRequestService: HttpRequestService,
    public Injector: Injector,
    public baseMapService: BaseMapService,
    public myMapService: MyMapService,
    private _notification: MessageService,
    private drawToolService: DrawingToolService,
    private localDataService: LocalDataService,
    public PrivateMapLayerService_new: PrivateMapLayerService_new

  ) {
    super(cookieService, http, route, router, toggler, AuthServices, MapLayerService, condensedService, MapServiceService, MapLayerInfoService, modalService, PrivateMapLayerService, MapLayernewService, bsModalService, CreateLayerToolService, UtilityService, httpRequestService, Injector, baseMapService, myMapService, PrivateMapLayerService_new);
  }

  @ViewChild('tree') tree;
  @ViewChild('privatetree') privatetree;
  @ViewChild('sharedtree') sharedtree;
  @ViewChild('temporaryLayertree') temporaryLayertree;

  actionMapping: IActionMapping = {
    mouse: {
      click: (tree, node, $event) => {
        try {
          let eventElem = undefined;
          if ($event.toElement) {
            eventElem = $event.toElement
          } else if ($event.srcElement) {
            eventElem = $event.srcElement;
          }
          if (eventElem) {
            if ($(eventElem.children).length > 0) {
              if ($(eventElem.children[0].firstChild.nextElementSibling).attr('class') == "CheckboxStatus ng-star-inserted") {
                this.checked(node, !node.data.IsChecked)
              }
              else if ($(eventElem.children[0].firstChild.nextElementSibling).attr('class') == "privateCheckboxStatus ng-star-inserted") {
                this.privateLayerChecked(node, node.data.IsChecked);
              }
              else if ($(eventElem.children[0].firstChild.nextElementSibling).attr('class') == "sharedCheckboxStatus ng-star-inserted") {
                this.sharedLayerChecked(node, node.data.IsChecked);
              }
              else if ($(eventElem.children[0].firstChild.nextElementSibling).attr('class') == "temporaryLayerCheckboxStatus ng-star-inserted") {
                this.Temporarychecked(node, node.data.IsChecked);
              }
            }
            else {
              if ($(eventElem).attr('class') == "privateCheckboxStatus ng-star-inserted") {
                this.privateLayerChecked(node, node.data.IsChecked);
              }
              if ($(eventElem).attr('class') == "sharedCheckboxStatus ng-star-inserted") {
                this.sharedLayerChecked(node, node.data.IsChecked);
              }
              if ($(eventElem).attr('class') == "temporaryLayerCheckboxStatus ng-star-inserted") {
                this.Temporarychecked(node, node.data.IsChecked);
              }
            }
          }
        } catch (e) { console.log(e) }
      }
    }
  };
  options: ITreeOptions = {
    displayField: 'Name',
    isExpandedField: 'expanded',
    idField: 'Id',
    hasChildrenField: 'children',
    actionMapping: this.actionMapping,
    useTriState: false,
    useCheckbox: false
  };



  ngAfterViewInit() {
  }

  onSelect(event) {
  }

  onDeselect(event) {
  }

  Onimgclick(id: any, nodeData: any, node: any) {
    let layerType = "EnergyLayer";
    if (!nodeData['children']) {
      let applyclass = 'MapLayerstyle';
      if (window.screen.width < 500) {
        applyclass = '';
      }
      const modalRef = this.modalService.open(MapLayerStylesComponent, { backdropClass: 'light-blue-backdrop', windowClass: applyclass });
      modalRef.componentInstance.Nodedata = nodeData;
      modalRef.componentInstance.Node = node;
      modalRef.componentInstance.ActiveEnergyLayerList = this.GoogleMapPage.energyLayer;
      modalRef.componentInstance.LayerType = layerType;
    }
  }

  OnPrivateLayerimgclick(id: any, nodeData: any, node: any) {
    let privateLayerList = this.GoogleMapPage.privateLayer;
    if (privateLayerList && privateLayerList.length > 0) {
      let curItem = privateLayerList.find(x => x.DataSetID == nodeData.Id);
      if (curItem && curItem.UploadFileType && (curItem.UploadFileType.indexOf('kml') != -1 || curItem.UploadFileType.indexOf('kmz') != -1))
        return;
    }
    let layerType = "PrivateLayer";
    if (!nodeData['children']) {
      let applyclass = 'MapLayerstyle';
      if (window.screen.width < 500) {
        applyclass = '';
      }
      const modalRef = this.modalService.open(MapLayerStylesComponent, { backdropClass: 'light-blue-backdrop', windowClass: applyclass });
      modalRef.componentInstance.Nodedata = nodeData;
      modalRef.componentInstance.Node = node;
      modalRef.componentInstance.ActiveEnergyLayerList = this.GoogleMapPage.privateLayer;
      modalRef.componentInstance.LayerType = layerType;
    }
  }

  OnSharedLayerimgclick(id: any, nodeData: any, node: any) {
    let sharedLayerList = this.GoogleMapPage.sharedLayer;
    if (sharedLayerList && sharedLayerList.length > 0) {
      let curItem = sharedLayerList.find(x => x.DataSetID == nodeData.Id);
      if (curItem && curItem.UploadFileType && (curItem.UploadFileType.indexOf('kml') != -1 || curItem.UploadFileType.indexOf('kmz') != -1))
        return;
    }
    let layerType = "PrivateLayer";
    if (!nodeData['children']) {
      let applyclass = 'MapLayerstyle';
      if (window.screen.width < 500) {
        applyclass = '';
      }
      const modalRef = this.modalService.open(MapLayerStylesComponent, { backdropClass: 'light-blue-backdrop', windowClass: applyclass });
      modalRef.componentInstance.Nodedata = nodeData;
      modalRef.componentInstance.Node = node;
      modalRef.componentInstance.ActiveEnergyLayerList = this.GoogleMapPage.sharedLayer;
      modalRef.componentInstance.LayerType = layerType;
    }
  }


  hideActiveCountForKml(nodeData: any) {
    let privateLayerList = this.GoogleMapPage.privateLayer;
    if (privateLayerList && privateLayerList.length > 0) {
      let curItem = privateLayerList.find(x => x.DataSetID == nodeData.Id);
      if (curItem && curItem.UploadFileType && (curItem.UploadFileType.indexOf('kml') != -1 || curItem.UploadFileType.indexOf('kmz') != -1))
        return "d-none";
      else
        return "d-block";
    }
    let sharedLayerList = this.GoogleMapPage.sharedLayer;
    if (sharedLayerList && sharedLayerList.length > 0) {
      let curItem = sharedLayerList.find(x => x.DataSetID == nodeData.Id);
      if (curItem && curItem.UploadFileType && (curItem.UploadFileType.indexOf('kml') != -1 || curItem.UploadFileType.indexOf('kmz') != -1))
        return "d-none";
      else
        return "d-block";
    }
  }


  Ontemporaryimgcloseclick(node: any, Ischecked: any, id: any) {
    if (node.data.FeatureType && (node.data.FeatureType == "CreateLayer" || node.data.FeatureType == "GlobalSearch")) {
      let nodeToDelete = this.temporaryLayertree.treeModel.getNodeById(id);
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
    } else {
      let nodeToDelete = this.temporaryLayertree.treeModel.getNodeById(id);
      this.condensedService.removeNode(nodeToDelete);
      this.RemoveTemporaryTreeNodeData(nodeToDelete);
      this.temporaryLayertree.treeModel.update();
      this.GoogleMapPage.RemoveTabForTemporaryLayer(node);
      this.GoogleMapPage.RemoveTemporaryLayersBasedOnId(id);
      this.GoogleMapPage.RemoveLayerFromTemporaryLayerList(id);
    }
    this.MapLayerInfoService.RemoveInfoBoxByIds(id);
    let isToggleIcon = this.MapServiceService.TemporaryTreeNode.getValue().length > 0 ? true : false;
    this.SidebarLayerGroupIconVisible('temporaryLayerArea', isToggleIcon);
  }

  RemoveTemporaryTreeNodeData(nodeToDelete) {
    for (let i = 0; i < this.temporaryLayerNodes.length; i++) {
      if (this.temporaryLayerNodes[i].children) {
        for (let c = 0; c < this.temporaryLayerNodes[i].children.length; c++) {
          if (this.temporaryLayerNodes[i].children[c]['children']) {
            for (let c1 = 0; c1 < this.temporaryLayerNodes[i].children[c].children.length; c1++) {
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
  }
  Onimgcloseclick(node: any, Ischecked: any, id: any) {
    this.tree.treeModel.update();
    let nodeToDelete = this.tree.treeModel.getNodeById(id);
    this.condensedService.removeNode(nodeToDelete);
    let IsGroupLayer = false;
    let GroupLayerId = 0;
    if (nodeToDelete && nodeToDelete.parent) {
      if (nodeToDelete.parent.data.LayerType) {
        if (nodeToDelete.parent.data.LayerType == "GroupLayer") {
          IsGroupLayer = true;
          GroupLayerId = nodeToDelete.parent.data.Id;
        }
      }
    }

    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].children) {
        for (let c = 0; c < this.nodes[i].children.length; c++) {
          if (this.nodes[i].children[c]['children']) {
            for (let c1 = 0; c1 < this.nodes[i].children[c].children.length; c1++) {
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
    if (node.data.FeatureType == "SiteSelection") {
      this.MapLayernewService.LoadIndividualGroupMapLayer(node.data.FeatureType);
    }
    if (node.data.FeatureType == "CustomMap") {
      this.MapLayernewService.LoadCustomMapLayers();
    }
    this.MapLayerInfoService.RemoveInfoBoxByIds(id);
    let isToggleIcon = this.MapServiceService.TreeNodes.getValue().length > 0 ? true : false;
    this.SidebarLayerGroupIconVisible('energyLayerArea', isToggleIcon);
  }

  OnimgPrivatecloseclick(node: any, Ischecked: any, id: any) {
    let nodeToDelete = this.privatetree.treeModel.getNodeById(id);
    this.condensedService.removePrivateNode(nodeToDelete);

    for (let i = 0; i < this.privateNodes.length; i++) {
      if (this.privateNodes[i].children) {
        for (let c = 0; c < this.privateNodes[i].children.length; c++) {
          if (this.privateNodes[i].children[c]['children']) {
            for (let c1 = 0; c1 < this.privateNodes[i].children[c].children.length; c1++) {
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
    let isToggleIcon = this.MapServiceService.PrivateTreeNode.getValue().length > 0 ? true : false;
    this.SidebarLayerGroupIconVisible('privateLayerArea', isToggleIcon);
    this.MapLayerInfoService.RemoveInfoBoxByIds(id);
    if (node.data.FeatureType == "CustomMap") {
      this.MapLayernewService.LoadCustomMapLayers();
    }
  }

  OnimgSharedCloseClick(node: any, Ischecked: any, id: any) {
    let nodeToDelete = this.sharedtree.treeModel.getNodeById(id);
    this.condensedService.removePrivateNode(nodeToDelete);

    for (let i = 0; i < this.sharedNodes.length; i++) {
      if (this.sharedNodes[i].children) {
        for (let c = 0; c < this.sharedNodes[i].children.length; c++) {
          if (this.sharedNodes[i].children[c]['children']) {
            for (let c1 = 0; c1 < this.sharedNodes[i].children[c].children.length; c1++) {
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
    let isToggleIcon = this.MapServiceService._SharedTreeNode.getValue().length > 0 ? true : false;
    this.SidebarLayerGroupIconVisible('sharedLayerArea', isToggleIcon);
    this.MapLayerInfoService.RemoveInfoBoxByIds(id);
    if (node.data.FeatureType == "CustomMap")
      this.MapLayernewService.LoadCustomMapLayers();
  }

  isLoadIndividualLayer(node): boolean {
    if (node.data.FeatureType == "CustomMap")
      return false;
    if (node.data.FeatureType == "SiteSelection")
      return false;
    return true;
  }

  groupLayerCountID = [];
  checked(node: any, checked: any) {
    node.data.IsChecked = checked;
    let isLoadIndividualLayer = this.isLoadIndividualLayer(node);
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
        let existingGroupLayerIndex = this.groupLayerCountID.findIndex(x => x.parentId == node.parent.data.Id);
        if (existingGroupLayerIndex > -1)
          this.groupLayerCountID.splice(existingGroupLayerIndex, 1);
        this.GoogleMapPage.getTotalCount();
      } else {
        IsPerantId = this.groupLayerCountID.find(x => x.parentId == node.parent.data.Id);
        if (!IsPerantId) {
          this.groupLayerCountID.push({ parentId: node.parent.data.Id });
          this.GoogleMapPage.getTotalCount();
          this.GoogleMapPage.RefreshAG_GridView();
        }
      }
    }
    if (node.data.FeatureType == "CustomMap") {
      this.MapLayernewService.LoadCustomMapLayers();
      if (node.data.Id == '10939' && node.data.Name == "Flood Hazard Zones") {
        if (checked == true)
          this.GoogleMapPage.RemoveLayesBasedOnid(node.data.Id);
        else
          this.GoogleMapPage.addlayesbasedonId(node.data.Id);
      }
    }
    if (node.data.FeatureType == "SiteSelection")
      this.MapLayernewService.LoadIndividualGroupMapLayer(node.data.FeatureType);
    setTimeout(() => {
      this.MapServiceService.GetLegendData();
    }, 100);

  }


  IsAllowedForGroupLayer(nodeData): boolean {
    if (nodeData.FeatureType) {
      let featureType = nodeData.FeatureType;
      let isAccess = AllowedValuesForGroupLayer.find(val => val == featureType);
      if (isAccess)
        return true;
    }
    return false;
  }

  Temporarychecked(node: any, checked: any) {
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
    } else if (node.data.FeatureType == "CustomMap") {
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
    } else {
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
        let existingGroupLayerIndex = this.groupLayerCountID.findIndex(x => x.parentId == node.parent.data.Id);
        if (existingGroupLayerIndex > -1)
          this.groupLayerCountID.splice(existingGroupLayerIndex, 1);
        this.GoogleMapPage.RefreshAG_GridView();
        this.GoogleMapPage.getTotalCount();
      } else {
        IsPerantId = this.groupLayerCountID.find(x => x.parentId == node.parent.data.Id);
        if (!IsPerantId) {
          this.groupLayerCountID.push({ parentId: node.parent.data.Id });
          this.GoogleMapPage.getTotalCount();
          this.GoogleMapPage.RefreshAG_GridView();
        }
      }
    }
    this.MapLayerInfoService.RemoveInfoBoxByIds(node.data.Id);
    setTimeout(() => {
      this.MapServiceService.GetLegendData();
    }, 100);
  }

  privateLayerChecked(node: any, checked: any) {
    node.data.IsChecked = checked;
    let isKML = this.isKMLLayer(node.data.Id, true);
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
    if (node.data && node.data.LayerType == "GroupLayer" && node.data.FeatureType != "CustomMap") {
      this.MapLayernewService.LoadGroupMapLayers();
      var IsPerantId;
      if (node.data.IsChecked == true) {
        let existingGroupLayerIndex = this.groupLayerCountID.findIndex(x => x.parentId == node.parent.data.Id);
        if (existingGroupLayerIndex > -1)
          this.groupLayerCountID.splice(existingGroupLayerIndex, 1);
        this.GoogleMapPage.getTotalCount();
      } else {
        IsPerantId = this.groupLayerCountID.find(x => x.parentId == node.parent.data.Id);
        if (!IsPerantId) {
          this.groupLayerCountID.push({ parentId: node.parent.data.Id });
          this.GoogleMapPage.getTotalCount();
          this.GoogleMapPage.RefreshAG_GridView();
        }
      }
    }
    if (node.data.FeatureType == "CustomMap")
      this.MapLayernewService.LoadCustomMapLayers();
    setTimeout(() => {
      this.MapServiceService.GetLegendData();
    }, 100);
  }
  sharedLayerChecked(node: any, checked: any) {
    node.data.IsChecked = checked;
    let isKML = this.isKMLLayer(node.data.Id, false);
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
      let existingGroupLayerIndex = this.groupLayerCountID.findIndex(x => x.parentId == node.parent.data.Id);
      if (existingGroupLayerIndex > -1)
        this.groupLayerCountID.splice(existingGroupLayerIndex, 1);
      this.GoogleMapPage.getTotalCount();
    } else {
      IsParentId = this.groupLayerCountID.find(x => x.parentId == node.parent.data.Id);
      if (!IsParentId) {
        this.groupLayerCountID.push({ parentId: node.parent.data.Id });
        this.GoogleMapPage.getTotalCount();
        this.GoogleMapPage.RefreshAG_GridView();
      }
    }
    if (node.data.FeatureType == "CustomMap")
      this.MapLayernewService.LoadCustomMapLayers();
    setTimeout(() => {
      this.MapServiceService.GetLegendData();
    }, 100);
  }

  isKMLLayer(id: string, isPrivateLayer: boolean) {
    let layer;
    if (isPrivateLayer) {
      layer = this.GoogleMapPage.privateLayer.find(x => x.DataSetID == id);
    } else {
      layer = this.GoogleMapPage.sharedLayer.find(x => x.DataSetID == id);
    }
    if (layer && layer.UploadFileType && (layer.UploadFileType == ".kml" || layer.UploadFileType == ".kmz")) {
      return true;
    }
    return false;
  }


  ngOnInit() {

    // this.MapLayerInfoService.feedbackMethodCalled$.subscribe(x => {

    //   this.OpenMapLayerFeedback(x)
    // });
    let userId = this.AuthServices.getLoggedinUserId();
    this.AuthServices.DeleteTempImgData(userId);
    this.MapServiceService.getMapTitledata().subscribe(x => {
      this.mapTitle = x;
    });
    this.MapServiceService.DrawToolTreenode.subscribe(data => {
      if (data != null)
        this.drawToolsNodes = data;
    })
    this.MapServiceService.setMapTitledata('');
    setTimeout(() => {
      this.MapServiceService.setTreenode(this.nodes);
      this.MapServiceService.setTreeUI(this.tree);
      this.MapServiceService.setPrivateTreenode(this.privateNodes);
      this.MapServiceService.setDrawToolTreenode(this.drawToolsNodes);
      this.MapServiceService.setPrivateTreeUI(this.privatetree);
      this.MapServiceService.setTemporaryTreenode(this.temporaryLayerNodes);
      this.MapServiceService.setTemporaryTreeUI(this.temporaryLayertree);
      this.MapServiceService.setSharedTreenode(this.sharedNodes);
      this.MapServiceService.setSharedTreeUI(this.sharedtree);
      this.MapServiceService.setLayerIndex({ value: this.LayerIndexval });
      this.toggleMenuDrawerOpen();
      this.GetExternalIconList();
    }, 1000);
    this._footer = false;
    setTimeout(() => {
      $(".page-container").css('padding-left', '0px');
      this.UtilityService.closeAllPopupmodalbaseonclass();
    }, 100);
    this.GetDrawToolsData();
    this.GetUserRoles();
    this.setSharedLayer();
  }

  setSharedLayer() {
    this.MapServiceService.SharedDrawToolTreenode.subscribe(x => {
      if (x && x.length >= 0)
        this.sharedDrawToolsNodes = x;
    })
  }

  treeList = [];
  isExternalIcon = false;
  SetLayerIndexvalue(index) {
    if (index["treestatus"] == "Individual") {
      if (!index["Layerindexval"] && this.MapServiceService.LayerIndex.getValue()) {
        let currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
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
        let currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
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
  }
  GetExternalIconList() {
    let Userid = this.AuthServices.getLoggedinUserId();
    let iconlist = this.MapServiceService.ExternalIconList.getValue();
    if (!iconlist && !this.isExternalIcon) {
      this.httpRequestService._NodeGetExternalIcon(Userid).subscribe(data => {
        let Exres = data;
        if (Exres._Issuccess) {
          this.isExternalIcon = true;
          if (Exres.ExternalIcon.length > 0) {
            if (!iconlist) {
              this.MapServiceService.setExternalIconList(Exres.ExternalIcon);
            }
          }
        }
      }, error => {
        console.log(error);
      });
    }
  }
  GetTreeData(TreeId, defaultCheckedLayersList?: any, layerOrder: any[] = [], mapIdForMapGridFilter: number = 0, isSiteSelectionTools: boolean = false, userIdForSharedLayers: string = '') {
    let Userid = this.AuthServices.getLoggedinUserId();
    if (userIdForSharedLayers != '')
    Userid = userIdForSharedLayers;
    var param = TreeId;
    if (TreeId.ParentLayerId && TreeId.Childs)
      TreeId = TreeId.Childs.toString();
    this.httpRequestService._NodeGetTreeLayer(TreeId, Userid, mapIdForMapGridFilter, isSiteSelectionTools).subscribe(data => {
      let res: any = data;
      let treedata = res;
      this.MapServiceService._TreeUI.getValue().treeModel.update();
      let nodes = this.MapServiceService.GetAllChildNodeData();
      if (nodes != undefined && nodes.length > 0) {
        if (nodes[0]["activeCount"] == undefined) {
          nodes[0]["activeCount"] = 0;
        }
      }
      if (treedata.result.MapLayers.length > 0) {
        this.Line_LayerIndexval++;
        this.Point_LayerIndex++;
        this.Area_LayerIndex++;
      }
      let MapLayers = treedata.result.MapLayers.map((el) => {
        var o = Object.assign({}, el);
        if (treedata.result.MapLayers.length > 1) {
          o.treestatus = 'GroupLayer';
        } else {
          o.treestatus = 'Individual';
        }
        o = this.SetLayerIndexvalue(o);
        return o;
      });
      for (var layer of MapLayers) {
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
              } else {
                layer.FilterValue = GridFilterValue;
                break;
              }
            }
          }
        }
      }
      if (layerOrder.length > 0) {
        Array.prototype.push.apply(this.GoogleMapPage.energyLayer, MapLayers);
        if (param.ParentLayerId && param.Childs)
          this.treeList.push({ Id: param.ParentLayerId, Data: treedata });
        else
          this.treeList.push({ Id: TreeId, Data: treedata });
        if (this.treeList.length == layerOrder.length) {
          var treeListInOrder = [];
          for (var id of layerOrder) {
            this.treeList.map(function (e) {
              if (e.Id == id)
                treeListInOrder.push(e);
            })
          }
          this.treeList = [];
          for (var treeData of treeListInOrder) {
            nodes = this.MapServiceService.GetAllChildNodeData();
            if (nodes.length == 0) {
              Array.prototype.push.apply(this.MapServiceService.TreeNodes.getValue(), treeData.Data.result.TreeData);
              this.MapServiceService._TreeUI.getValue().treeModel.update();
            }
            else
              this.settreenodes(treeData.Data);
          }
        }
      }
      else {
        if (nodes.length == 0) {
          Array.prototype.push.apply(this.MapServiceService.TreeNodes.getValue(), treedata.result.TreeData);
          Array.prototype.push.apply(this.GoogleMapPage.energyLayer, MapLayers);
          this.MapServiceService._TreeUI.getValue().treeModel.update();
        }
        else {
          this.settreenodes(treedata);
          Array.prototype.push.apply(this.GoogleMapPage.energyLayer, MapLayers);
        }
      }
      if (this.GoogleMapPage.energyLayer.length > 0) {
        for (let index of this.GoogleMapPage.energyLayer) {
          if (!index["isEnergyLayer"])
            index["isEnergyLayer"] = true;
          index = this.UtilityService.setTableAndfiltervalueinEnergyLayers(index);
        }
      }
      setTimeout(() => {
        this.MapServiceService._TreeUI.getValue().treeModel.update();
        this.MapServiceService._TreeUI.getValue().treeModel.expandAll();
        this.UtilityService.OpenCloseEnergyLayerAreaOnSidebar(true);
        if (MapLayers.length > 1) {
          for (let mindex of MapLayers) {
            if (defaultCheckedLayersList && defaultCheckedLayersList.length > 0) {
              if (defaultCheckedLayersList.indexOf(mindex.EnergyLayerGUID.toLowerCase()) != -1)
                this.ActiveLayerOnmap(mindex.EnergyLayerID);
            }
            else {
              if (mapIdForMapGridFilter == 0)
                this.ActiveLayerOnmap(mindex.EnergyLayerID);
            }

          }
        } else {
          if (defaultCheckedLayersList && defaultCheckedLayersList.length > 0) {
            if (defaultCheckedLayersList.indexOf(MapLayers[0].EnergyLayerGUID.toLowerCase()) != -1)
              this.ActiveLayerOnmap(TreeId);
          }
          else {
            if (mapIdForMapGridFilter == 0)
              this.ActiveLayerOnmap(TreeId);
          }

        }
        let isToggleIcon = this.MapServiceService.TreeNodes.getValue().length > 0 ? true : false;
        this.SidebarLayerGroupIconVisible('energyLayerArea', isToggleIcon);
      }, 500);
    },
      error => {
        console.log(error);
      });
  }
  ActiveLayerOnmap(EnergyLayerID) {
    setTimeout(() => {
      let TreeImageIcon = document.getElementById(EnergyLayerID + "TreeCostomelayerIconImage");
      if (TreeImageIcon) {
        let src = TreeImageIcon.getAttribute('src');
        let srcWidth = "100";
        let srcOpacity = "1";
        if (src.indexOf('http://energymapit.com/en/Handlers/IconImage.ashx') >= 0) {
          if (src) {
            let splitedval = src.split('?');
            let val = splitedval[1].split('&');
            for (let iconstyle of val) {
              let s = iconstyle.split('=');
              let key = s[0];
              let val1 = s[1];
              if (key == "SizePercent") {
                srcWidth = val1;
              }
              else if (key == "Opacity") {
                srcOpacity = val1;
              }
            }
          }
        }
        if (src.indexOf(environment.ImagespreviewPath) >= 0) {
          for (let layer of this.GoogleMapPage.energyLayer) {
            if (layer.EnergyLayerID == EnergyLayerID) {
              if (layer.EnergyLayerStylesByUserModel.length > 0) {
                let userstyle = layer.EnergyLayerStylesByUserModel[0];
                srcWidth = userstyle['SizePercent'];
                srcOpacity = userstyle['Opacity'];
              }
            }
          }

        }
        srcWidth = Math.round(parseInt(srcWidth) * 20 / 100) + "px";
        let opacityPoint = 1;
        if (parseInt(srcOpacity) > 0) {
          opacityPoint = 1 - (parseInt(srcOpacity) / 100);
        }
        srcOpacity = "" + parseFloat(opacityPoint.toFixed(2));
        $("#" + EnergyLayerID + "TreeCostomelayerIconImage").attr('style', 'width:' + srcWidth + ";opacity:" + srcOpacity + ";");

      }
      this.MapServiceService._TreeUI.getValue().treeModel.update();
      this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
      this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
      this.UtilityService.ActiveLayerData(EnergyLayerID, "LoadlayerinTreeData");
    }, 500);
  }

  GetPrivateLayerTreeData(TreeId, defaultCheckedLayersList?: any, layerOrder: any[] = [], mapIdForMapGridFilter: number = 0, userIdForSharedLayers: string = '') {    
    let loggedInUserId = this.AuthServices.getLoggedinUserId();
    let userId = this.AuthServices.getLoggedinUserId();
    if (userIdForSharedLayers != '')
      userId = userIdForSharedLayers;
    var privateparam = TreeId;
    if (TreeId.ParentLayerId && TreeId.Childs) {
      let parentId = TreeId.ParentLayerId;
      let childIds = TreeId.Childs.toString();
      this.httpRequestService._NodeGetPrivateGroupTreeLayer(parentId, childIds, userId, loggedInUserId, mapIdForMapGridFilter).subscribe(data => {
        this.SetPrivateLayerOnTree(data, mapIdForMapGridFilter, layerOrder, privateparam, TreeId, defaultCheckedLayersList);
      },
        error => {
          console.log(error);
        });
    }
    else {
      this.httpRequestService._NodeGetPrivateTreeLayer(TreeId, userId, loggedInUserId, mapIdForMapGridFilter).subscribe(data => {
        this.SetPrivateLayerOnTree(data, mapIdForMapGridFilter, layerOrder, privateparam, TreeId, defaultCheckedLayersList);
      },
        error => {
          console.log(error);
        });
    }
  }


  privateTreeList = [];
  SetPrivateLayerOnTree(treedata, mapIdForMapGridFilter, layerOrder, param, TreeId, defaultCheckedLayersList) {    
    let privateNodesData = this.MapServiceService.PrivateTreeNode.getValue();
    if (treedata.result.TreeData.length > 0 && !treedata.result.TreeData[0]["activeCount"]) {
      treedata.result.TreeData[0]["activeCount"] = 0;
    }
    if (treedata.result.MapLayers.length > 0) {
      this.Line_LayerIndexval++;
      this.Point_LayerIndex++;
      this.Area_LayerIndex++;
    }
    let PrivateMapLayers = treedata.result.MapLayers.map((el) => {
      //var o = Object.assign({}, el);
      // if (treedata.result.MapLayers.length > 1) {
      //   o.treestatus = 'GroupLayer';
      // } else {
      //   o.treestatus = 'Individual';
      //   if (treedata.result.MapLayers.length == 1 && (treedata.result.MapLayers[0].ParentDataSetID != null || treedata.result.MapLayers[0].ParentDataSetID != undefined))
      //     o.treestatus = 'GroupLayer';
      // }
      el = this.SetLayerIndexvalue(el);
      return el;
    });
    for (let i = 0; i < PrivateMapLayers.length; i++) {
      if (!PrivateMapLayers[i]["isPrivateLayer"])
        PrivateMapLayers[i]["isPrivateLayer"] = true;
      if (!PrivateMapLayers[i]["TableName"])
        PrivateMapLayers[i]["TableName"] = null;
      if (PrivateMapLayers[i]["TableName"] && PrivateMapLayers[i]["UploadFileType"])
        PrivateMapLayers[i]["TableName"] = PrivateMapLayers[i]["TableName"].toLowerCase();
      //PrivateMapLayers[i]["TableName"] = (PrivateMapLayers[i]["TableName"] != null || PrivateMapLayers[i]["TableName"] != undefined) ? PrivateMapLayers[i]["TableName"] : null;
      let detailPanelPropertyMain = PrivateMapLayers[i]["DBFProperties"];
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
              // PrivateMapLayers[i].FilterValue += ";" + filterValue;
              var splitedval = PrivateMapLayers[i].FilterValue.split(';');
              if (splitedval.length > 0) {
                var Joinfilter = splitedval.filter(x => x).join(';');
                var lastfour = Joinfilter.substr(Joinfilter.length - 4);
                if (lastfour == "#OR#") {
                  PrivateMapLayers[i].FilterValue = Joinfilter + filterValue;
                } else {
                  PrivateMapLayers[i].FilterValue += ";" + filterValue;
                }
              } else {
                PrivateMapLayers[i].FilterValue += ";" + filterValue;
              }
            } else {
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
              //PrivateMapLayers[i].FilterValue += ";" + filterValue;
              var splitedval = PrivateMapLayers[i].FilterValue.split(';');
              if (splitedval.length > 0) {
                var Joinfilter = splitedval.filter(x => x).join(';');
                var lastfour = Joinfilter.substr(Joinfilter.length - 4);
                if (lastfour == "#OR#") {
                  PrivateMapLayers[i].FilterValue = Joinfilter + filterValue;
                } else {
                  PrivateMapLayers[i].FilterValue += ";" + filterValue;
                }
              } else {
                PrivateMapLayers[i].FilterValue += ";" + filterValue;
              }
            } else {
              PrivateMapLayers[i].FilterValue = filterValue;
            }
          }
        }
        else if (selectedFilterLayer.length == 0 && PrivateMapLayers[i].LayerGridFilterModel.length == 1) {
          var filterValue = PrivateMapLayers[i].LayerGridFilterModel[0].cqlFilter;
          if (filterValue) {
            if (PrivateMapLayers[i].FilterValue) {
              //PrivateMapLayers[i].FilterValue += ";" + filterValue;
              var splitedval = PrivateMapLayers[i].FilterValue.split(';');
              if (splitedval.length > 0) {
                var Joinfilter = splitedval.filter(x => x).join(';');
                var lastfour = Joinfilter.substr(Joinfilter.length - 4);
                if (lastfour == "#OR#") {
                  PrivateMapLayers[i].FilterValue = Joinfilter + filterValue;
                } else {
                  PrivateMapLayers[i].FilterValue += ";" + filterValue;
                }
              } else {
                PrivateMapLayers[i].FilterValue += ";" + filterValue;
              }
            } else {
              PrivateMapLayers[i].FilterValue = filterValue;
            }
          }
        }

      }
      PrivateMapLayers[i] = this.UtilityService.setTableAndfiltervaluein_Private_EnergyLayers(PrivateMapLayers[i])
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
        for (var id of layerOrder) {
          this.privateTreeList.map(function (e) {
            if (e.Id == id)
              treeListInOrder.push(e);
          })
        }
        this.privateTreeList = [];
        for (var treeData of treeListInOrder) {
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
      for (let index of this.GoogleMapPage.privateLayer) {
        // if (!index["Layerindexval"] && this.MapServiceService.LayerIndex.getValue()) {
        //   let currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
        //   index["Layerindexval"] = currentIndexVal;
        //   this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
        // }
        index = this.UtilityService.setTableAndfiltervalueinEnergyLayers(index);
      }
    }
    setTimeout(() => {
      this.MapServiceService._PrivateTreeUI.getValue().treeModel.expandAll();
      this.UtilityService.OpenClosePrivateLayerAreaOnSidebar(true);
      if (PrivateMapLayers.length > 0 && PrivateMapLayers[0].ParentDataSetID) {
        for (let pvtLayer of PrivateMapLayers) {
          if (defaultCheckedLayersList && defaultCheckedLayersList.length > 0) {
            if (defaultCheckedLayersList.indexOf(pvtLayer.DataSetGUID.toLowerCase()) != -1)
              this.UtilityService.ActiveLayerData(pvtLayer.EnergyLayerID, "LoadlayerinPrivateTreeData");
          }
          else {
            if (mapIdForMapGridFilter == 0)
              this.UtilityService.ActiveLayerData(pvtLayer.EnergyLayerID, "LoadlayerinPrivateTreeData");
          }
        }
      } else {
        if (defaultCheckedLayersList && defaultCheckedLayersList.length > 0) {
          if (defaultCheckedLayersList.indexOf(PrivateMapLayers[0].DataSetGUID.toLowerCase()) != -1)
            this.UtilityService.ActiveLayerData(TreeId, "LoadlayerinPrivateTreeData");
        }
        else {
          if (mapIdForMapGridFilter == 0)
            this.UtilityService.ActiveLayerData(TreeId, "LoadlayerinPrivateTreeData");
        }
      }
    }, 1000);
    if (this._menuDrawerOpen == false) {
      this.toggleMenuDrawerOpen();
    }

    let isToggleIcon = this.MapServiceService.PrivateTreeNode.getValue().length > 0 ? true : false;
    this.SidebarLayerGroupIconVisible('privateLayerArea', isToggleIcon);
  }

  GetSharedLayerTreeData(TreeId, defaultCheckedLayersList?: any, layerOrder: any[] = [], mapIdForMapGridFilter: number = 0, userIdForSharedLayers: string = '') {
    let loggedInUserId = this.AuthServices.getLoggedinUserId();
    let userId = this.AuthServices.getLoggedinUserId();
    if (userIdForSharedLayers != '')
      userId = userIdForSharedLayers;
    var sharedparam = TreeId;
    if (TreeId.ParentLayerId && TreeId.Childs) {
      let parentId = TreeId.ParentLayerId;
      let childIds = TreeId.Childs.toString();
      this.httpRequestService._NodeGetPrivateGroupTreeLayer(parentId, childIds, userId, loggedInUserId, mapIdForMapGridFilter).subscribe(data => {
        this.SetSharedLayerOnTree(data, mapIdForMapGridFilter, layerOrder, sharedparam, TreeId, defaultCheckedLayersList);
      },
        error => {
          console.log(error);
        });
    }
    else {
      this.httpRequestService._NodeGetPrivateTreeLayer(TreeId, userId, loggedInUserId, mapIdForMapGridFilter).subscribe(data => {
        this.SetSharedLayerOnTree(data, mapIdForMapGridFilter, layerOrder, sharedparam, TreeId, defaultCheckedLayersList);
      },
        error => {
          console.log(error);
        });
    }
  }


  sharedTreeList = [];
  SetSharedLayerOnTree(treedata, mapIdForMapGridFilter, layerOrder, param, TreeId, defaultCheckedLayersList) {
    let sharedNodesData = this.MapServiceService._SharedTreeNode.getValue();
    if (treedata.result.TreeData.length > 0 && !treedata.result.TreeData[0]["activeCount"]) {
      treedata.result.TreeData[0]["activeCount"] = 0;
    }
    let SharedMapLayers = treedata.result.MapLayers.map((el) => {
      var o = Object.assign({}, el);
      if (treedata.result.MapLayers.length > 1) {
        o.treestatus = 'GroupLayer';
      } else {
        o.treestatus = 'Individual';
        if (treedata.result.MapLayers.length == 1 && (treedata.result.MapLayers[0].ParentDataSetID != null || treedata.result.MapLayers[0].ParentDataSetID != undefined))
          o.treestatus = 'GroupLayer';
      }
      return o;
    });
    for (let i = 0; i < SharedMapLayers.length; i++) {
      if (!SharedMapLayers[i]["isPrivateLayer"])
        SharedMapLayers[i]["isPrivateLayer"] = true;
      if (!SharedMapLayers[i]["TableName"])
        SharedMapLayers[i]["TableName"] = null;
      if (SharedMapLayers[i]["TableName"] && SharedMapLayers[i]["UploadFileType"])
        SharedMapLayers[i]["TableName"] = SharedMapLayers[i]["TableName"].toLowerCase();
      let detailPanelPropertyMain = SharedMapLayers[i]["DBFProperties"];
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
              //SharedMapLayers[i].FilterValue += ";" + filterValue;
              var splitedval = SharedMapLayers[i].FilterValue.split(';');
              if (splitedval.length > 0) {
                var Joinfilter = splitedval.filter(x => x).join(';');
                var lastfour = Joinfilter.substr(Joinfilter.length - 4);
                if (lastfour == "#OR#") {
                  SharedMapLayers[i].FilterValue = Joinfilter + filterValue;
                } else {
                  SharedMapLayers[i].FilterValue += ";" + filterValue;
                }
              } else {
                SharedMapLayers[i].FilterValue += ";" + filterValue;
              }
            } else {
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
              var splitedval = SharedMapLayers[i].FilterValue.split(';');
              if (splitedval.length > 0) {
                var Joinfilter = splitedval.filter(x => x).join(';');
                var lastfour = Joinfilter.substr(Joinfilter.length - 4);
                if (lastfour == "#OR#") {
                  SharedMapLayers[i].FilterValue = Joinfilter + filterValue;
                } else {
                  SharedMapLayers[i].FilterValue += ";" + filterValue;
                }
              } else {
                SharedMapLayers[i].FilterValue += ";" + filterValue;
              }
            } else {
              SharedMapLayers[i].FilterValue = filterValue;
            }
          }
        }

      }
      SharedMapLayers[i] = this.UtilityService.setTableAndfiltervaluein_Private_EnergyLayers(SharedMapLayers[i])
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
        for (var id of layerOrder) {
          this.sharedTreeList.map(function (e) {
            if (e.Id == id)
              treeListInOrder.push(e);
          })
        }
        this.sharedTreeList = [];
        for (var treeData of treeListInOrder) {
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
      for (let index of this.GoogleMapPage.sharedLayer) {
        if (!index["Layerindexval"] && this.MapServiceService.LayerIndex.getValue()) {
          let currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
          index["Layerindexval"] = currentIndexVal;
          this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
        }
        index = this.UtilityService.setTableAndfiltervalueinEnergyLayers(index);
      }
    }
    setTimeout(() => {
      this.MapServiceService._SharedTreeUI.getValue().treeModel.expandAll();
      this.UtilityService.OpenCloseSharedLayerAreaOnSidebar(true);
      if (SharedMapLayers.length > 0 && SharedMapLayers[0].ParentDataSetID) {
        for (let srdLayer of SharedMapLayers) {
          if (defaultCheckedLayersList && defaultCheckedLayersList.length > 0) {
            if (defaultCheckedLayersList.indexOf(srdLayer.DataSetGUID.toLowerCase()) != -1)
              this.UtilityService.ActiveLayerData(srdLayer.EnergyLayerID, "LoadlayerinSharedTreeData");
          }
          else {
            if (mapIdForMapGridFilter == 0)
              this.UtilityService.ActiveLayerData(srdLayer.EnergyLayerID, "LoadlayerinSharedTreeData");
          }

        }
      } else {
        if (defaultCheckedLayersList && defaultCheckedLayersList.length > 0) {
          if (defaultCheckedLayersList.indexOf(SharedMapLayers[0].DataSetGUID.toLowerCase()) != -1)
            this.UtilityService.ActiveLayerData(TreeId, "LoadlayerinSharedTreeData");
        }
        else {
          if (mapIdForMapGridFilter == 0)
            this.UtilityService.ActiveLayerData(TreeId, "LoadlayerinSharedTreeData");
        }
      }
    }, 1000);
    if (this._menuDrawerOpen == false) {
      this.toggleMenuDrawerOpen();
    }

    let isToggleIcon = this.MapServiceService._SharedTreeNode.getValue().length > 0 ? true : false;
    this.SidebarLayerGroupIconVisible('sharedLayerArea', isToggleIcon);
  }


  RemoveLayerFromMyDataLibrary(LayerId) {
    this.httpRequestService._NodeRemoveDataFromDataSet(LayerId).subscribe(data => {
      if (this.MapServiceService.MyDataLibrary.getValue()) {
        let ids = [LayerId];
        let LayerLibrarys = this.MapServiceService.MyDataLibrary.getValue()[0].LayerLibrary
        let filteredData = LayerLibrarys.filter(item => ids.indexOf(item.DataSetID) > -1);
        if (filteredData.length == 1) {
          var index = LayerLibrarys.indexOf(filteredData[0]);
          LayerLibrarys.splice(index, 1);
        }
        this.MapServiceService.MyDataLibrary.getValue()[0].TotalCount = this.MapServiceService.MyDataLibrary.getValue()[0].LayerLibrary.length;
        this.MapServiceService.MyDataLibrary.getValue()[0].DisplayingCount = this.MapServiceService.MyDataLibrary.getValue()[0].LayerLibrary.length;
        let jsonAllActiveMapLayes = JSON.stringify(this.MapServiceService.MyDataLibrary.getValue());
        if (localStorage.getItem("AllActivePrivateLayersLibrary") != null) {
          localStorage.setItem("AllActivePrivateLayersLibrary", jsonAllActiveMapLayes);
        }
      }
    });

  }

  setprivatetreenodes(treedata) {
    // this.MapServiceService.PrivateTreeNode.getValue().push(treedata.result.TreeData[0]);
    Array.prototype.push.apply(this.MapServiceService.PrivateTreeNode.getValue(), treedata.result.TreeData);
    this.MapServiceService._PrivateTreeUI.getValue().treeModel.update();
    // if (this._menuDrawerOpen == false) {
    //   this.toggleMenuDrawerOpen();
    // }
    this.UtilityService.OpenClosePrivateLayerAreaOnSidebar(true);
  }

  setsharedtreenodes(treedata) {
    Array.prototype.push.apply(this.MapServiceService._SharedTreeNode.getValue(), treedata.result.TreeData);
    this.MapServiceService._SharedTreeUI.getValue().treeModel.update();
    this.UtilityService.OpenCloseSharedLayerAreaOnSidebar(true);
  }


  settreenodes(treedata) {
    // setTimeout(() => {
    let treeUI = this.MapServiceService._TreeUI.getValue();
    if (treeUI.treeModel.nodes) {
      if (treeUI.treeModel.nodes.length >= 1) {
        for (let i = 0; i < treedata.result.TreeData.length; i++) {
          let nodedata = treedata.result.TreeData[i];
          if (nodedata["children"]) {
            for (let c = 0; c < nodedata["children"].length; c++) {
              if (nodedata["children"][c]["children"]) {
                let cid = nodedata["children"][c].Id;
                let existnode = treeUI.treeModel.getNodeById(cid);
                if (!existnode) {
                  let iId = nodedata.Id;
                  let existnodeiId = treeUI.treeModel.getNodeById(iId);
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
                    for (let ccid = 0; ccid < nodedata["children"][c]["children"].length; ccid++) {
                      let ccnodeid = nodedata["children"][c]["children"][ccid].Id;
                      let existnodeiccId = treeUI.treeModel.getNodeById(ccnodeid);
                      if (!existnodeiccId) {
                        existnode.data["children"].push(nodedata["children"][c]["children"][ccid])
                      }
                      else {
                        if (nodedata["children"][c]["children"][ccid]["children"]) {
                          if (nodedata["children"][c]["children"][ccid]["children"].length == 1) {
                            existnodeiccId.data["children"].push(nodedata["children"][c]["children"][ccid]["children"][0])
                          }
                        }
                      }

                    }

                  }

                }

              }
              else {
                let nodesid = nodedata.Id;
                let existnodesId = treeUI.treeModel.getNodeById(nodesid);
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
      } else {
        this.nodes = treedata.result.TreeData;
      }
    }
    else {
      this.nodes = treedata.result.TreeData;
    }
    treeUI.treeModel.update();
    // this.GoogleMapPage.AddLayersToMap(this.energylayer);
    // }, 2000);
  }

  OpenCompanyModal() {
    this.modalService.open(CompaniesComponent, { size: 'lg', centered: true, backdrop: 'static', windowClass: 'company-modal' });
  }

  OpenUserModal() {
    this.modalService.open(UsersComponent, { size: 'lg', centered: true, backdrop: 'static', windowClass: 'user-modal' });
  }
  dropdownToggleEvent(event) {
    event.currentTarget.click();
  }

  profiledropdownToggleEvent(event) {
    //event.currentTarget.children[0].click();
  }
  openCollapseMenu() {
    let collapsedElement = document.getElementsByClassName('collapsed')[0] as HTMLElement;
    if (collapsedElement != undefined) {
      collapsedElement.click();
    }
  }
  Redirect(routeName: string) {
    if (routeName === 'intelligence') {
      this.router.navigateByUrl('/envision/intelligence');
      $(".page-container").css('padding-left', '0px');
    } else if (routeName === 'maps') {
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

  }
  mapsearchData(tabId: number = 1) {
    this.mapDataType = 'MapsearchData';
    if (tabId == 1) {
      this.mapDataType = 'MapsearchData';
    } else if (tabId == 2) {
      this.mapDataType = 'myData';
    } else if (tabId == 3) {
      this.mapDataType = 'SharedData';
    }
    let LoginId = this.AuthServices.getLoggedinUserId();
    if (!this.MapServiceService.MapsearchLayersCategory.getValue()) {
      this.httpService._NodeGetLayerCategory(LoginId, "Energy Layer Group", 0).subscribe(data => {
        // let LayersLibrary = JSON.stringify(data);
        // let res = JSON.parse(LayersLibrary);       
        let LayersLibrary: any = data;
        let res = LayersLibrary;
        if (res.errormsg == "") {
          res["IsLoaded"] = true;
          this.MapServiceService.setMapsearchLayersCategory(res);
          this.OpenMapsearchDataLibrary();
          if (res.LayerLibrary && res.LayerLibrary.length > 0) {
            if (res.LayerLibrary[0]["CategoryChilds"]) {
              if (res.LayerLibrary[0].CategoryChilds.length > 0) {
                this.MapServiceService.showDefaultCategoryId = res.LayerLibrary[0].CategoryChilds[0].CategoryID;
              }
              else {
                this.MapServiceService.showDefaultCategoryId = res.LayerLibrary[0].CategoryID;
              }
            }
            else {
              this.MapServiceService.showDefaultCategoryId = res.LayerLibrary[0].CategoryID;
            }
          }
          else {
            this.MapServiceService.showDefaultCategoryId = res.LayerLibrary[0].CategoryID;
          }
        }
        else {
          //console.log(res.errorms);
          this.OpenMapsearchDataLibrary();
        }
      }, error => {
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
  }
  OpenMapsearchDataLibrary() {
    const activeModal = this.modalService.open(MapSearchDataComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false, windowClass: "xlModal" });
    activeModal.componentInstance.modalName = this.mapDataType;
  }

  RemoveLayerToMapandMapserachLibrary(LayerId) {
    if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
      for (let a of this.MapServiceService.EnergyLayerLibrary.getValue()) {
        for (let e of a.LayerLibrary) {
          if (e.EnergyLayerID == LayerId) {
            if (e.Addtomap != 'Add to map') {
              e.Addtomap = 'Add to map';
            }
          }
        }
      }
    }
    if (this.MapServiceService._GlobalsearchLayerList.getValue()) {
      for (let a of this.MapServiceService._GlobalsearchLayerList.getValue()) {
        for (let e of a.LayerLibrary) {
          if (e.EnergyLayerID == LayerId) {
            if (e.Addtomap != 'Add to map') {
              e.Addtomap = 'Add to map';
            }
          }
        }
      }
    }
  }

  RemovePrivateLayerToMapandMyDataLibrary(node) {
    let LayerId = node.data.Id;
    let LayerParentId = '';
    if (node.parent && node.parent.data && node.parent.data.Id)
      LayerParentId = node.parent.data.Id;
    if (this.MapServiceService.MyDataLibrary.getValue()) {
      for (let a of this.MapServiceService.MyDataLibrary.getValue()) {
        for (let e of a.LayerLibrary) {
          if (e.DataSetID == LayerId || e.DataSetID == LayerParentId) {

            if (e.Addtomap != 'Add to map') {
              e.Addtomap = 'Add to map';
            }
          }
        }
      }
    }
  }

  RemoveSharedLayerToMapandSharedDataLibrary(node) {
    let LayerId = node.data.Id;
    let LayerParentId = '';
    if (node.parent && node.parent.data && node.parent.data.Id)
      LayerParentId = node.parent.data.Id;
    if (this.MapServiceService._SharedData.getValue()) {
      for (let layer of this.MapServiceService._SharedData.getValue()) {
        if (layer.DataSetID == LayerId || layer.DataSetID == LayerParentId) {
          if (layer.Addtomap != 'Add to map') {
            layer.Addtomap = 'Add to map';
          }
        }
      }
    }
  }


  AddLayerToMyDataLibrary(AddedLayerData: any) {
    if (this.MapServiceService.MyDataLibrary.getValue()) {
      let UploaderDisplayName;
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
      for (let a of this.MapServiceService.MyDataLibrary.getValue()) {
        a.LayerLibrary.push(AddedLayerData);
      }
      this.MapServiceService.MyDataLibrary.getValue()[0].TotalCount = this.MapServiceService.MyDataLibrary.getValue()[0].LayerLibrary.length;
      this.MapServiceService.MyDataLibrary.getValue()[0].DisplayingCount = this.MapServiceService.MyDataLibrary.getValue()[0].LayerLibrary.length;
      // this.MapServiceService.MydataLibraryCount.getValue().push(this.MapServiceService.MyDataLibrary.getValue()[0].LayerLibrary.length);
      this.UtilityService.SortByKeyDesc(this.MapServiceService.MyDataLibrary.getValue()[0].LayerLibrary, "ModifiedDate");
      let jsonAllActiveMapLayes = JSON.stringify(this.MapServiceService.MyDataLibrary.getValue());
      if (localStorage.getItem("AllActivePrivateLayersLibrary") != null) {
        localStorage.setItem("AllActivePrivateLayersLibrary", jsonAllActiveMapLayes);
      }
    }
  }

  OpenBaseMap() {
    this.bsModalService.show(BasemapComponent, { class: 'modal-lg modal-dialog-centered xlModal', animated: false, backdrop: 'static' });
  }
  OpenMyProfile() {
    this.bsModalService.show(MyProfileComponent, { class: 'modal-lg modal-dialog-centered xlModal', animated: false, backdrop: 'static' });
  }
  OpenAddadtaModal() {
    this.bsModalService.show(AddDataComponent, { class: 'modal-lg modal-dialog-centered adddata-modal', animated: false, backdrop: 'static' });
  }

  OpenMyMaps() {
    const activeModal = this.modalService.open(MymapsComponent, { size: 'lg', centered: true, backdrop: 'static', windowClass: "myMaps-modal" });
    activeModal.componentInstance.modalName = 'myMap';
  }

  OpenSharedMaps() {
    const activeModal = this.modalService.open(MymapsComponent, { size: 'lg', centered: true, backdrop: 'static', windowClass: "myMaps-modal" });
    activeModal.componentInstance.modalName = 'sharedMap';
  }

  OpenMyData() {
    this.mapsearchData(2);
  }

  OpenSharedData() {
    this.mapsearchData(3);
  }

  SearchLocation() {
    this.CloseOpenedDropdownMenu();
    this.bsModalService.show(SearchLocationComponent, { class: 'modal-sm Tool-modal modal-dialog-centered', backdrop: 'static', animated: false });
  }

  ReverseGeoCode() {
    this.CloseOpenedDropdownMenu();
    this.bsModalService.show(ReverseGeocodeComponent, { class: 'modal-sm Tool-modal reverseGeocode', backdrop: 'static', animated: false });
  }

  MeasureDistance() {
    this.CloseOpenedDropdownMenu();
    this.bsModalService.show(MeasureDistanceComponent, { class: 'modal-sm mesure-distance Tool-modal modal-dialog-centered', backdrop: 'static', animated: false });
  }
  ElevationProfile() {
    this.CloseOpenedDropdownMenu();
    this.bsModalService.show(ElevationProfileComponent, { class: 'modal-sm elevationProfile modal-dialog-centered', backdrop: 'static', animated: false });
    this.elevationProfileService.DrawToolsForElevation();
  }

  OpenSaveImage() {
    this.bsModalService.show(SaveImageComponent, { class: 'modal-lg Tool-modal modal-dialog-centered', backdrop: 'static', animated: false });
  }
  OpenBookmark() {
    this.bsModalService.show(BookMarksComponent, { class: 'modal-lg Tool-modal modal-dialog-centered', backdrop: 'static', animated: false });
  }

  OpenLogoutConfirmation() {
    this.bsModalService.show(LogoutConfirmationComponent, { class: 'modal-md logout-confirmation modal-dialog-centered', backdrop: 'static', animated: false });
  }

  OpenPrivateLayerAreaOnSidebar() {
    let collapsedElement = document.getElementById('privateLayerArea') as HTMLElement;
    let cc = collapsedElement.querySelector('.card-header') as HTMLElement;
    if (collapsedElement.children[0].getAttribute("aria-expanded") == "false")
      cc.click();
  }

  RemoveChildChildNodeData(list, idInstance) {
    for (let a = 0; a < list.length; a++) {
      let Treeecheckboxlement: HTMLElement = document.getElementById(list[a].Id + idInstance) as HTMLElement;
      if (Treeecheckboxlement == null) {
        setTimeout(() => { Treeecheckboxlement.click(); }, 1000);
      }
      else
        Treeecheckboxlement.click();
    }
  }

  BlankMap() {
    //Remove Energy Layers
    let nodeList = [];
    nodeList = this.MapServiceService.GetAllChildNodeData();
    if (nodeList.length > 0) {
      let nodeListData = JSON.parse(JSON.stringify(nodeList));
      for (let a = 0; a < nodeListData.length; a++) {
        let Treeecheckboxlement: HTMLElement = document.getElementById(nodeListData[a].Id + 'RemoveTreeData') as HTMLElement;
        if (Treeecheckboxlement == null) {
          setTimeout(() => { Treeecheckboxlement.click(); }, 1000);
        }
        else
          Treeecheckboxlement.click();
      }
    }

    //Remove Private Layers
    // let pvtLegendList = this.MapServiceService.PrivateTreeNode.getValue();
    let pvtLegendList = this.UtilityService.GetChildNodeData(this.MapServiceService.PrivateTreeNode.getValue());
    if (pvtLegendList != null && pvtLegendList.length > 0) {
      if (pvtLegendList.length > 0) {
        let pvtLayerData = JSON.parse(JSON.stringify(pvtLegendList));
        for (let a = 0; a < pvtLayerData.length; a++) {
          // if (pvtLayerData[a].children && pvtLayerData[a].children.length > 0) {
          //   this.RemoveChildChildNodeData(pvtLayerData[a].children,'RemoveTreeData');
          //   continue;
          // }
          let Treeecheckboxlement: HTMLElement = document.getElementById(pvtLayerData[a].Id + 'RemoveTreeData') as HTMLElement;
          if (Treeecheckboxlement == null) {
            setTimeout(() => { Treeecheckboxlement.click(); }, 1000);
          }
          else
            Treeecheckboxlement.click();
        }
      }
    }

    //Remove Shared Layers
    let srdLegendList = this.UtilityService.GetChildNodeData(this.MapServiceService._SharedTreeNode.getValue());
    if (srdLegendList != null && srdLegendList.length > 0) {
      if (srdLegendList.length > 0) {
        let srdLayerData = JSON.parse(JSON.stringify(srdLegendList));
        for (let a = 0; a < srdLayerData.length; a++) {
          let Treeecheckboxlement: HTMLElement = document.getElementById(srdLayerData[a].Id + 'RemoveTreeData') as HTMLElement;
          if (Treeecheckboxlement == null) {
            setTimeout(() => { Treeecheckboxlement.click(); }, 1000);
          }
          else
            Treeecheckboxlement.click();
        }
      }
    }


    // Remove Temporary Layers
    let tempLayerList = this.MapServiceService.TemporaryTreeNode.getValue();
    if (tempLayerList != null && tempLayerList.length > 0) {
      if (tempLayerList.length > 0) {
        let tempLayerListData = JSON.parse(JSON.stringify(tempLayerList));
        for (let a = 0; a < tempLayerListData.length; a++) {
          if (tempLayerListData[a].Id == "200008") {
            if (tempLayerListData[a].children && tempLayerListData[a].children.length > 0)
              this.RemoveChildChildNodeData(tempLayerListData[a].children, 'RemovetemporaryTreeData');
            continue;
          }
          let Treeecheckboxlement: HTMLElement = document.getElementById(tempLayerListData[a].Id + 'RemovetemporaryTreeData') as HTMLElement;
          if (Treeecheckboxlement == null) {
            setTimeout(() => { Treeecheckboxlement.click(); }, 1000);
          }
          else
            Treeecheckboxlement.click();
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
    if (closeParcelBuffer != undefined) { closeParcelBuffer.click(); }

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
    setTimeout(() => {
      this.MapServiceService.GetLegendData();
    }, 100);
    this.LayerIndexval = 100;
    this.MapServiceService.LayerIndex.getValue().value = 100;
    this.Area_LayerIndex = 1;
    this.Line_LayerIndexval = this.Area_LayerIndex + this.starting_LineIndexval;
    this.Point_LayerIndex = this.Line_LayerIndexval + this.starting_PointIndexval;

    this.MapLayernewService.ClearAllRecentData();

    //delete temp image data
    let userId = this.AuthServices.getLoggedinUserId();
    this.AuthServices.DeleteTempImgData(userId);
    $('.gm-style .gm-style-cc').css({
      'top': '',
      'left': ''
    });
  }

  SetDefaultMap() {
    let List = this.MapServiceService.BaseMapData.getValue();
    let activeBasemap;
    if (List.BaseMapData && List.BaseMapData.length > 0)
      List.BaseMapData.forEach((el) => { el.IsDefault = false; })
    if (List.MapSettingData && List.MapSettingData.length > 0) {
      let Id = List.MapSettingData[0].BaseMapProviderID;
      activeBasemap = List.BaseMapData.filter(m => m.BaseMapProviderID == Id)[0];
      activeBasemap.IsDefault = true;
    } else {
      activeBasemap = List.BaseMapData.filter(m => m.IsDefault == true)[0];
    }
    if (activeBasemap)
      this.baseMapService.setBasemap(activeBasemap, 5);
    else {
      let defaultMap: any = this.MapServiceService._mapdata.getValue();
      let center = { lat: 39.5, lng: -98.35 };
      var myOptions = {
        zoom: 5,
        center: center,
        mapTypeId: 'hybrid',
        maxZoom: 21,
        minZoom: 4
      };
      defaultMap.setOptions(myOptions);
    }

  }
  // DrawTools() {
  //   this.CloseOpenedDropdownMenu();
  //   this.MapServiceService.DrawTools();
  // }
  CartoGraphicTools() {
    this.bsModalService.show(CartographicToolComponent, { class: 'modal-sm Tool-modal modal-dialog-centered', backdrop: 'static', animated: false });
  }
  PrivateLayerVisible() {
    setTimeout(() => {
      let privateNodeList = this.GoogleMapPage.privateLayer;
      let pvtLayerArea = document.getElementById('privateLayerArea');
      if (privateNodeList != null && privateNodeList != undefined && privateNodeList.length > 0 && pvtLayerArea != undefined) {
        pvtLayerArea.classList.remove('hide');
      }
      else {
        pvtLayerArea.classList.add('hide');
      }
    }, 1000);
  }

  SidebarLayerGroupIconVisible(groupID: any, isToggleIcon: any) {
    setTimeout(() => {
      let LayerArea = document.getElementById(groupID);
      if (LayerArea != undefined) {
        if (isToggleIcon && LayerArea != undefined) {
          LayerArea.classList.add('showIcon');
        }
        else {
          LayerArea.classList.remove('showIcon');
        }
      }
    }, 1000);
  }

  OpenCreateLayer() {
    const config: ModalOptions = { class: 'modal-lg modal-dialog-centered Data-modal', backdrop: 'static', animated: false };
    this.bsModalService.show(CreateLayerComponent, config);
  }

  // OpenMapLayerFeedback(data) {
  //   let activeModel = this.modalService.open(MapLayerFeedbackComponent, { size: 'sm', centered: true, keyboard: false, backdrop: 'static', windowClass: 'feedback-modal' });
  //   activeModel.componentInstance.data = data;
  // }

  OpenParcelBuffer() {
    const config: ModalOptions = { class: 'modal-sm parcelBuffer modal-dialog-centered', backdrop: 'static', animated: false };
    this.bsModalService.show(ParcelBufferComponent, config);
  }

  OpenDrawTools() {
    this.GoogleMapPage.OpenDrawTools();
  }

  OpenSiteSelection() {
    const config: ModalOptions = { class: 'modal-lg siteSelection', backdrop: 'static', animated: false };
    this.bsModalService.show(SiteSelectionComponent, config);
  }

  ShowLegends(hideLegend = false) {
    if ($('#ToggleLegend').text().trim() == 'Show Legend' && hideLegend == false) {
      this.bsModalService.show(ShowLegendComponent, { class: 'modal-sm LegendModal slide-right', backdrop: 'static', animated: false });
      setTimeout(() => { this.GoogleMapPage.SetLegendBasedOnGrid(); }, 100);
      $('#ToggleLegend').text('Hide Legend');
    }
    else {
      if ($('#LegendModal').length > 0) { $('#LegendModal').remove(); }
      $('#ToggleLegend').text('Show Legend');
    }
  }
  SetTemporaryTreeNode(TreeList) {
    if (TreeList.children != undefined && TreeList.children.length > 0) {
      this.MapServiceService.TemporaryTreeNode.getValue().push(TreeList);
    }
    else {
      Array.prototype.push.apply(this.MapServiceService.TemporaryTreeNode.getValue(), TreeList);
    }
    this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
    setTimeout(() => {
      this.MapServiceService._TemporaryTreeUI.getValue().treeModel.expandAll();
      this.UtilityService.OpenCloseTemporaryLayerAreaOnSidebar(true);
      let treeUI = this.MapServiceService._TemporaryTreeUI.getValue();
      for (let t = 0; t < TreeList.length; t++) {
        const treeval = TreeList[t];
        // if (treeval.Id >= 100000 && treeval.Id <= 100006) {        
        let TempTreeData = treeUI.treeModel.getNodeById(treeval.Id);
        // if (TempTreeData && TempTreeData.data && !TempTreeData.data.IsChecked) {
        //   continue;
        // }
        if (treeval.Id == 200008 && treeval.children && treeval.children.length > 0) {
          for (let i = 0; i < treeval.children.length; i++) {
            let childElement = treeval.children[i];
            this.UtilityService.ActiveLayerData(childElement.Id, "LoadlayerintemporaryTreeData");
          }
          continue;
        }
        setTimeout(() => {
          this.UtilityService.ActiveLayerData(treeval.Id, "LoadlayerintemporaryTreeData");
        }, 500);
        // }
      }
    }, 1000);
    let isToggleIcon = this.MapServiceService.TemporaryTreeNode.getValue().length > 0 ? true : false;
    this.SidebarLayerGroupIconVisible('temporaryLayerArea', isToggleIcon);
  }

  SetTemporaryTreeNodeForWidget(TreeList) {
    setTimeout(() => {
      Array.prototype.push.apply(this.MapServiceService.TemporaryTreeNode.getValue(), TreeList);
      this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
      let isToggleIcon = this.MapServiceService.TemporaryTreeNode.getValue().length > 0 ? true : false;
      this.SidebarLayerGroupIconVisible('temporaryLayerArea', isToggleIcon);
      this.MapServiceService._TemporaryTreeUI.getValue().treeModel.expandAll();
      this.UtilityService.OpenCloseTemporaryLayerAreaOnSidebar(true);
      let treeUI = this.MapServiceService._TemporaryTreeUI.getValue();
      for (let t = 0; t < TreeList.length; t++) {
        const treeval = TreeList[t];
        // if (treeval.Id >= 100000 && treeval.Id <= 200006) {
        let TempTreeData = treeUI.treeModel.getNodeById(treeval.Id);
        // if (TempTreeData && TempTreeData.data && TempTreeData.data.IsChecked) {
        //   continue;
        // }
        setTimeout(() => {
          this.UtilityService.ActiveLayerData(treeval.Id, "LoadlayerintemporaryTreeData");
        }, 500);
        //}
      }
    }, 500);
  }

  GlobalSearch() {
    var globalSearchModalElement = document.getElementById('globalSearchModal');
    var globalSearchText = $('#txtGlobalSearch').val();
    if (globalSearchText != '' && globalSearchText != undefined && globalSearchText != null) {
      this.MapServiceService.setGlobalSearchText(globalSearchText);
      if (!globalSearchModalElement) {
        this.bsModalService.show(GlobalSearchResultComponent, { class: 'modal-lg globalSearch-modal modal-dialog-centered', backdrop: 'static', animated: false });
      }
      else {
        this.MapServiceService.GlobalSearchResult();
      }
    } else {
      this.MapServiceService.setGlobalSearchText(null);
    }
  }

  ClearGlobalSearch() {
    this.searchText = '';
    this.MapServiceService.setGlobalSearchText(null);
    let selectedItem = this.MapServiceService.ActiveSearchDataLibrary.getValue();
    selectedItem.searchText = '';
    this.MapServiceService.setActiveSearchDataLibrary(selectedItem);
  }

  SaveTemporaryLayer(temporaryLayer: any, ID: any) {
    if (temporaryLayer && temporaryLayer.data && temporaryLayer.data.Id && temporaryLayer.data.Id == "200008") {
      const saveModal = this.modalService.open(SaveCreateLayerdataComponent, { size: 'lg', centered: true, backdrop: 'static', windowClass: "SaveCreatelayerModal" });
      saveModal.componentInstance.temporaryLayer = temporaryLayer;
      saveModal.componentInstance.temporaryLayerID = ID;
      return;
    }
    const modalRef = this.modalService.open(SavesearchComponent, { size: 'sm', centered: true, backdrop: 'static', windowClass: "SaveSearchModal" });
    modalRef.componentInstance.temporaryLayer = temporaryLayer;
    modalRef.componentInstance.temporaryLayerID = ID;
    modalRef.componentInstance.StatusOfSaveLayers = "temporaryLayer";
  }

  CloseOpenedDropdownMenu() {
    document.getElementById("dropdownMenu").style.display = 'none';
    setTimeout(() => {
      document.getElementById("dropdownMenu").removeAttribute('style');
    }, 500);
  }

  ToggleMapTitle() {
    this.isEditMapTitle = !this.isEditMapTitle;
    if (this.mapTitle)
      this.MapServiceService.setMapTitledata(this.mapTitle.trim());
  }

  OpenMyMapConfirmationModal(isSharedMap: boolean) {
    let bsModalRef = this.bsModalService.show(MyMapConfirmationComponent, { class: 'modal-lg myMapConfirmation modal-dialog-centered', backdrop: 'static', animated: false });
    bsModalRef.content.isSharedMap = isSharedMap;
  }


  SaveMap() {
    if (this.mapTitle) {
      this.MapServiceService.setMapTitledata(this.mapTitle.trim());
      if (this.myMapService.isCustomMapLoaded == false) {
        this.httpRequestService._NodeCheckMapName(this.MapServiceService.getMapTitledata().getValue()).subscribe(data => {
          if (data._Issuccess && data.isMapNameExists == false) {
            var CustomMap = this.myMapService.GetCustomMapData();
            var EnergyLayers = this.GoogleMapPage.energyLayer.map(obj => obj.EnergyLayerID);
            var PrivateLayers = this.GoogleMapPage.privateLayer.map(obj => obj.DataSetID);
            var DefaultCheckedLayer = this.myMapService.GetDefaultCheckedLayers(this.GoogleMapPage.energyLayer, this.GoogleMapPage.privateLayer, this.GoogleMapPage.sharedLayer);
            var sharedLayer = this.GoogleMapPage.sharedLayer.map(obj => obj.DataSetID);
            if (sharedLayer && sharedLayer.length > 0) {
              PrivateLayers.push(...sharedLayer);
            }
            var LayerGridFilters = this.myMapService.GetLayerGridFilter();
            var EnergyLayersStylebyuser = [];
            var LegendOrder;
            if ($('#ToggleLegend').text().trim() == 'Hide Legend') {
              LegendOrder = this.GoogleMapPage.energyLayer.map(obj => obj.EnergyLayerGUID);
              if (LegendOrder.length > 0) {
                LegendOrder = LegendOrder.join('#');
              }
              CustomMap["LegendOrder"] = LegendOrder;
            }
            this.GoogleMapPage.energyLayer.forEach((s) => {
              if (s.EnergyLayerStylesByUserModel && s.EnergyLayerStylesByUserModel.length > 0) {
                EnergyLayersStylebyuser.push(s.EnergyLayerStylesByUserModel[0].Id);
              }
            });
            if (PrivateLayers.length > 0) {
              var PrivateParentIds = this.GoogleMapPage.privateLayer.map(obj => obj.ParentDataSetID).filter(obj => obj).filter((v, i, a) => a.indexOf(v) === i);
              if (PrivateParentIds.length > 0) {
                PrivateLayers = PrivateLayers.concat(PrivateParentIds);
                if (DefaultCheckedLayer.length > 0) {
                  var ParentIds = [];
                  this.GoogleMapPage.privateLayer.map(function (e) {
                    if (e.ParentDataSetID) {
                      ParentIds.push({ DataSetID: e.DataSetID, ParentDataSetID: e.ParentDataSetID });
                    }
                  });
                  var needToAddGUIDOfDataSetID = [];
                  for (var id of PrivateParentIds) {
                    var allChildLayers = [];
                    ParentIds.map(function (e) {
                      if (e.ParentDataSetID == id)
                        allChildLayers.push(e);
                    });

                    var checkedChildLayers = [];
                    for (var child of allChildLayers) {
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
                    this.httpRequestService._NodeGetGUIDOfDataSets(needToAddGUIDOfDataSetID).subscribe(data => {
                      if (data._Issuccess && data.result.length > 0) {
                        for (var layer of data.result) {
                          DefaultCheckedLayer.push({ DataSetID: layer.DataSetID, GUID: layer.DataSetGUID });
                        }
                        DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                        this.httpRequestService._NodeSaveMyMap(CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(data => {
                          if (data._Issuccess) {
                            const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                            this.myMapService.AddMapInUserMapList(mapData);
                            this.myMapService.loadedMapData = data.CustomMapData;
                            this.myMapService.isCustomMapLoaded = true;
                            this.isEditMapTitle = false;
                            this._notification.create(
                              NotificationColor.Success,
                              "The map saved successfully!",
                              {
                                Position: NotificationPosition.TopRight,
                                Style: NotificationStyle.Simple,
                                Duration: NotificationDuration
                              });
                          }
                        },
                          error => {
                            this._notification.create(
                              NotificationColor.Danger,
                              "There is some issue to save map!",
                              {
                                Position: NotificationPosition.TopRight,
                                Style: NotificationStyle.Simple,
                                Duration: NotificationDuration
                              });
                          });
                      }
                    }, error => {
                      this._notification.create(
                        NotificationColor.Danger,
                        "There is some issue to save map!",
                        {
                          Position: NotificationPosition.TopRight,
                          Style: NotificationStyle.Simple,
                          Duration: NotificationDuration
                        });
                    });
                  }
                  else {
                    DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                    this.httpRequestService._NodeSaveMyMap(CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(data => {
                      if (data._Issuccess) {
                        const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                        this.myMapService.AddMapInUserMapList(mapData);
                        this.myMapService.loadedMapData = data.CustomMapData;
                        this.myMapService.isCustomMapLoaded = true;
                        this.isEditMapTitle = false;
                        this._notification.create(
                          NotificationColor.Success,
                          "The map saved successfully!",
                          {
                            Position: NotificationPosition.TopRight,
                            Style: NotificationStyle.Simple,
                            Duration: NotificationDuration
                          });
                      }
                    },
                      error => {
                        this._notification.create(
                          NotificationColor.Danger,
                          "There is some issue to save map!",
                          {
                            Position: NotificationPosition.TopRight,
                            Style: NotificationStyle.Simple,
                            Duration: NotificationDuration
                          });
                      });

                  }

                }
                else {
                  DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                  this.httpRequestService._NodeSaveMyMap(CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(data => {
                    if (data._Issuccess) {
                      const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                      this.myMapService.AddMapInUserMapList(mapData);
                      this.myMapService.loadedMapData = data.CustomMapData;
                      this.myMapService.isCustomMapLoaded = true;
                      this.isEditMapTitle = false;
                      this._notification.create(
                        NotificationColor.Success,
                        "The map saved successfully!",
                        {
                          Position: NotificationPosition.TopRight,
                          Style: NotificationStyle.Simple,
                          Duration: NotificationDuration
                        });
                    }
                  },
                    error => {
                      this._notification.create(
                        NotificationColor.Danger,
                        "There is some issue to save map!",
                        {
                          Position: NotificationPosition.TopRight,
                          Style: NotificationStyle.Simple,
                          Duration: NotificationDuration
                        });
                    });
                }

              }
              else {
                DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
                this.httpRequestService._NodeSaveMyMap(CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(data => {
                  if (data._Issuccess) {
                    const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                    this.myMapService.AddMapInUserMapList(mapData);
                    this.myMapService.loadedMapData = data.CustomMapData;
                    this.myMapService.isCustomMapLoaded = true;
                    this.isEditMapTitle = false;
                    this._notification.create(
                      NotificationColor.Success,
                      "The map saved successfully!",
                      {
                        Position: NotificationPosition.TopRight,
                        Style: NotificationStyle.Simple,
                        Duration: NotificationDuration
                      });
                  }
                },
                  error => {
                    this._notification.create(
                      NotificationColor.Danger,
                      "There is some issue to save map!",
                      {
                        Position: NotificationPosition.TopRight,
                        Style: NotificationStyle.Simple,
                        Duration: NotificationDuration
                      });
                  });
              }
            }
            else {
              DefaultCheckedLayer = DefaultCheckedLayer.map(obj => obj.GUID);
              this.httpRequestService._NodeSaveMyMap(CustomMap, EnergyLayers, PrivateLayers, DefaultCheckedLayer, LayerGridFilters, EnergyLayersStylebyuser).subscribe(data => {
                if (data._Issuccess) {
                  const mapData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps[0]));
                  this.myMapService.AddMapInUserMapList(mapData);
                  this.myMapService.loadedMapData = data.CustomMapData;
                  this.myMapService.isCustomMapLoaded = true;
                  this.isEditMapTitle = false;
                  this._notification.create(
                    NotificationColor.Success,
                    "The map saved successfully!",
                    {
                      Position: NotificationPosition.TopRight,
                      Style: NotificationStyle.Simple,
                      Duration: NotificationDuration
                    });
                }
              },
                error => {
                  this._notification.create(
                    NotificationColor.Danger,
                    "There is some issue to save map!",
                    {
                      Position: NotificationPosition.TopRight,
                      Style: NotificationStyle.Simple,
                      Duration: NotificationDuration
                    });
                });
            }
          }
          else if (data._Issuccess && data.isMapNameExists) {
            this._notification.create(
              NotificationColor.Danger,
              "The name of the map is used by another map!",
              {
                Position: NotificationPosition.TopRight,
                Style: NotificationStyle.Simple,
                Duration: NotificationDuration
              });
          }
        }, error => {
          this._notification.create(
            NotificationColor.Danger,
            "There is some issue to save map!",
            {
              Position: NotificationPosition.TopRight,
              Style: NotificationStyle.Simple,
              Duration: NotificationDuration
            });
        });
      }
      else {
        let userId = this.AuthServices.getLoggedinUserId();
        let isSharedMaps = false;
        if (this.myMapService.loadedMapData.CustomMaps && this.myMapService.loadedMapData.CustomMaps[0].UserId.toLowerCase() != userId.toLowerCase())
          isSharedMaps = true;
        this.OpenMyMapConfirmationModal(isSharedMaps);
        this.isEditMapTitle = false;
      }
    }
  }

  Logout() {
    var EnergyLayers = this.GoogleMapPage.energyLayer.map(obj => obj.EnergyLayerID);
    var PrivateLayers = this.GoogleMapPage.privateLayer.map(obj => obj.DataSetID);
    if (this.myMapService.isCustomMapLoaded == false && (EnergyLayers.length > 0 || PrivateLayers.length > 0)) {
      this.OpenLogoutConfirmation();
    }
    else {
      this.AuthServices.LogoutUserProfile();
    }
  }

  blankmaptitle() {
    if (this.myMapService.isCustomMapLoaded == false)
      this.mapTitle = "";
    this.isEditMapTitle = false;
  }

  GetDrawToolsData() {
    let userId = this.AuthServices.getLoggedinUserId();
    this.httpRequestService._NodeGetDrawTools(userId).subscribe(data => {
      if (data._Issuccess == true) {
        data.DrawTools.forEach(item => {
          item['isChecked'] = false;
        });
        this.drawToolsNodes = data.DrawTools;
        let isToggleIcon = false;
        let drawToolData = this.MapServiceService.DrawToolTreenode.getValue();
        this.MapServiceService.setDrawToolTreenode(this.drawToolsNodes);
        if ((drawToolData && drawToolData.length > 0) || this.sharedDrawToolsNodes.length > 0)
          isToggleIcon = true;
        this.SidebarLayerGroupIconVisible('drawToolArea', isToggleIcon);
      }
    });
    let custId = this.AuthServices.getCustomerId();
    this.httpRequestService._NodeGetSharedDrawTools(userId, custId).subscribe(data => {
      if (data && data._Issuccess == true) {
        data.layers.forEach(item => {
          item['isChecked'] = false;
        });
        this.sharedDrawToolsNodes = data.layers;
        let isToggleIcon = false;
        let drawToolData = this.MapServiceService.DrawToolTreenode.getValue();
        this.MapServiceService.setSharedDrawToolTreenode(this.sharedDrawToolsNodes);
        if (drawToolData.length > 0 || this.sharedDrawToolsNodes.length > 0)
          isToggleIcon = true;
        this.SidebarLayerGroupIconVisible('drawToolArea', isToggleIcon);
      }
    });
  }

  GetUserRoles() {
    let userId = this.AuthServices.getLoggedinUserId();
    this.httpRequestService._NodeGetUserRoles(userId).subscribe(data => {
      if (data && data._Issuccess == true && (!data.errormsg)) {
        let existingUserData = this.AuthServices.GetUserData();
        if (existingUserData) {
          existingUserData.CustomerRoles = data.result.CustomerRoles;
          existingUserData.LayerCategoriesRoles = data.result.LayerCategoriesRoles;
          this.localDataService.setUserData(existingUserData);
        }
      }
      this.MapServiceService.setSitePermissions(data.result);
    });
  }

  DrawToolsCheckedChange(item) {
    if (item) {
      if (item.isChecked == true) {
        if (item.EditableLayerID != this.editDrawToolId)
          this.drawToolService.AddDrawingLayer(item.EditableLayerID);
      } else {
        if (item.EditableLayerID == this.editDrawToolId) {
          this.editDrawToolId = undefined;
          return;
        }
        this.drawToolService.RemoveAddedLayer(item.EditableLayerID);
      }
    }
  }

  DeleteDrawTool(id) {
    const config: ModalOptions = { class: 'modal-sm modal-dialog-centered', backdrop: 'static', animated: false };
    let bsModalRef = this.bsModalService.show(ConfirmDeleteDrawToolComponent, config);
    bsModalRef.content.layerId = id;
    setTimeout(() => {
      let isToggleIcon = this.MapServiceService.DrawToolTreenode.getValue().length > 0 ? true : false;
      this.SidebarLayerGroupIconVisible('drawToolArea', isToggleIcon);
    }, 2000);
  }

  DeleteSharedDrawTool(id, index) {
    const config: ModalOptions = { class: 'modal-sm modal-dialog-centered', backdrop: 'static', animated: false };
    let bsModalRef = this.bsModalService.show(ConfirmDeleteDrawToolComponent, config);
    bsModalRef.content.layerId = id;
    bsModalRef.content.isShared = true;
    bsModalRef.content.isDelete.take(1).subscribe((value) => {
      if (value == true)
        this.sharedDrawToolsNodes.splice(index, 1);
    });
    setTimeout(() => {
      let isToggleIcon = this.MapServiceService.DrawToolTreenode.getValue().length > 0 ? true : false;
      this.SidebarLayerGroupIconVisible('drawToolArea', isToggleIcon);
    }, 2000);
  }

  EditDrawTool(id) {
    this.editDrawToolId = id;
    let items = this.MapServiceService.DrawToolTreenode.getValue();
    let selectedEditItem = items.find(x => x.EditableLayerID == id);
    if (!selectedEditItem) {
      let sharedItems = this.MapServiceService.SharedDrawToolTreenode.getValue();
      selectedEditItem = sharedItems.find(x => x.EditableLayerID == id);
    }
    let checkbox = $('#' + id + 'LoadlayerinDrawToolData');
    if (selectedEditItem && selectedEditItem.isChecked == false) {
      if (checkbox) {
        checkbox.click();
      }
    } else if (selectedEditItem && selectedEditItem.isChecked == true) {
      this.drawToolService.RemoveAddedLayer(id);
    }
    this.GoogleMapPage.OpenDrawTools(id);
  }

  DeleteSharedLayerNode(id) {
    let layers = this.MapServiceService.SharedDrawToolTreenode.getValue();
    let index = layers.findIndex(x => x.EditableLayerID == id);
    if (index > -1)
      layers.splice(index, 1);
    this.MapServiceService.setSharedDrawToolTreenode(layers);
  }
}

