import { Component, OnInit, OnDestroy, ViewChild, HostListener, AfterViewInit, Input, ViewEncapsulation, Injector } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions, TreeNode } from 'angular-tree-component';
import { MapServiceService } from '../services/map-service.service';
import { AuthenticationService } from '../services/auth.service';
import { CondensedComponent } from '../../app/@pages/layouts/condensed/condensed.component';
import * as _ from 'lodash';
import { UtilityService } from '../services/Utility.service';
import { HttpRequestService } from '../services/all-http-request.service';
import { environment } from '../../environments/environment';
import { GoogleMapPage } from '../maps/google/google.component';

declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-map-search-data',
  templateUrl: './map-search-data.component.html',
  styleUrls: ['./map-search-data.component.scss'],
  providers: [NgbModal]
})

export class MapSearchDataComponent implements OnInit {
  CondensedComponent: CondensedComponent
  GoogleMapPage: GoogleMapPage
  constructor(
    private injector: Injector,
    private activeModal: NgbActiveModal,
    private MapServiceService: MapServiceService,
    public AuthServices: AuthenticationService,
    public UtilityService: UtilityService,
    private httpService: HttpRequestService,
  ) {
    // setTimeout(() => {
    this.CondensedComponent = injector.get(CondensedComponent);
    this.GoogleMapPage = injector.get(GoogleMapPage);
    // });

  }
  public ImageURLPath: string = environment.ImagespreviewPath;
  public nodes;
  totalCount = 0;
  DisplayingCount = 0;
  NormalViewContent = true;
  ReducedViewContent = false;
  ImageListviewContent = false;
  LayerLoader = false;
  LoginId = '';
  Searchtext = '';
  isFilteredData: boolean = false;

  showDefaultCategoryId: number = 1;
  @ViewChild('maplayertree') maplayertree;
  ActiveMapLayersLibrary: any = [];
  actionMapping: IActionMapping = {
    mouse: {
      click: (tree, node, $event) => {
        this.OnLayerclick(node, node.data.Id);
      }
    }
  };
  options: ITreeOptions = {
    displayField: 'Name',
    isExpandedField: 'expanded',
    idField: 'Id',
    hasChildrenField: 'children',
    useTriState: false,
    useCheckbox: false,
    actionMapping: this.actionMapping,
  };

  @Input() modalName;
  Totalcount: number = 25;
  Take: number = this.Totalcount;
  skip: number = this.Take;
  activeCategoryID: number = this.showDefaultCategoryId;
  activeParentCategoryID: number;
  ngOnInit() {
    this.UtilityService.CloseModalOnRouteChange(this.activeModal);
    let MapsearchLayesrLibraryres = this.MapServiceService.MapsearchLayersCategory.getValue();
    if (MapsearchLayesrLibraryres) {
      if (MapsearchLayesrLibraryres.IsLoaded == true) {
        // let LayersCategory = MapsearchLayesrLibraryres.LayerLibrary[0];
        let LayersCategory = MapsearchLayesrLibraryres.LayerLibrary;
        if (LayersCategory.length > 0) {
          this.showDefaultCategoryId = parseInt(LayersCategory[0].CategoryID);
          this.activeCategoryID = this.showDefaultCategoryId;
        }
        let list = [{
          Id: 0,
          Name: 'All',
          ParentCategoryID: '0'
          // ParentCategoryID: c.ParentCategoryID,
          // OrderNumber: c.OrderNumber
        }];
        for (let c of LayersCategory) {
          let treelist = {
            Id: c.CategoryID,
            Name: c.CategoryName,
            ParentCategoryID: c.ParentCategoryID
            // ParentCategoryID: c.ParentCategoryID,
            // OrderNumber: c.OrderNumber
          }
          if (c.CategoryChilds.length > 0) {
            treelist["children"] = [];
            for (let cc of c.CategoryChilds) {
              let childtreelist = {
                Id: cc.CategoryID,
                Name: cc.CategoryName,
                ParentCategoryID: cc.ParentCategoryID
              }
              treelist["children"].push(childtreelist);
            }
          }
          list.push(treelist);
        }
        list = list.filter(m => m.Name != 'Company' && m.Name != 'All');
        this.nodes = list;
        this.LayerLoader = true;
        if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
          // setTimeout(() => {
          this.DisplayLayres(this.showDefaultCategoryId, true);
          // }, 2000);
        }
        else {
          // setTimeout(() => {
          this.setMapserachLayer();
          // }, 2000);
        }
      }
    }
    setTimeout(() => {
      $('.modal-dialog').draggable({
        handle: ".modal-header"
      });
      this.SwitchTab();
    }, 100);

  }
  setMapserachLayer() {
    this.LoginId = this.AuthServices.getUserId();
    if (!this.MapServiceService.EnergyLayerLibrary.getValue()) {
      this.httpService._NodeGetEnergyLayerLibrary(this.LoginId, "Energy Layer Group", this.showDefaultCategoryId, this.showDefaultCategoryId != 0 ? 10000 : 25, 0).subscribe(data => {
        let LayersLibrary: any = data
        let res = LayersLibrary;
        if (res.errormsg == "") {
          if (this.GoogleMapPage.energyLayer.length > 0) {
            let energyLayerDataSetIds = this.GoogleMapPage.energyLayer.map(a => a.EnergyLayerID);
            res["IsLoaded"] = true;
            let layer = res.LayerLibrary.map((el) => {
              if (el.PreviewImage) {
                el.PreviewImage = this.MapServiceService.getPreviewImageLink(el.PreviewImage);
              }
              var o = Object.assign({}, el);
              o.ViewData = 'View Data';
              o.isVisible = true;
              if (energyLayerDataSetIds.indexOf(el.EnergyLayerID) != -1) {
                o.Addtomap = 'Remove from map';
              }
              else {
                o.Addtomap = 'Add to map';
              }
              return o;
            });
            let DefaultLayer = [
              {
                CategoryID: this.showDefaultCategoryId,
                LayerLibrary: layer,
                Totalcount: parseInt(res.TotalCount)
              }
            ];
            this.MapServiceService.setMapSearchEnergyLayerLibrary(DefaultLayer);
            this.DisplayLayres(this.showDefaultCategoryId, true);
          }
          else {
            res["IsLoaded"] = true;
            let layer = res.LayerLibrary.map((el) => {
              if (el.PreviewImage) {
                el.PreviewImage = this.MapServiceService.getPreviewImageLink(el.PreviewImage);
              }
              var o = Object.assign({}, el);
              o.ViewData = 'View Data';
              o.Addtomap = 'Add to map';
              o.isVisible = true;
              return o;
            });
            let DefaultLayer = [
              {
                CategoryID: this.showDefaultCategoryId,
                LayerLibrary: layer,
                Totalcount: parseInt(res.TotalCount)
              }
            ];
            this.MapServiceService.setMapSearchEnergyLayerLibrary(DefaultLayer);
            this.DisplayLayres(this.showDefaultCategoryId, true);
          }
        }
        else {
          console.log(res.errorms);
        }

      }, error => {
        console.log(error);
      })
    }
    else {
      this.DisplayLayres(this.showDefaultCategoryId, true);
    }

  }
  DisplayLayres(categoryId, isFromInit = false) {
    if (isFromInit == true) {
      //Set Search Text if User Global search any value
      let globalSearchText = this.MapServiceService.GlobalSearchText.getValue();
      let isGlobalSearch = false;
      if (globalSearchText != null) {
        isGlobalSearch = true;
        this.Searchtext = globalSearchText;
      }
      let selectedCategory = this.MapServiceService.ActiveSearchDataLibrary.getValue();
      if (selectedCategory && selectedCategory.categoryId) {
        this.activeCategoryID = selectedCategory.categoryId;
        this.activeParentCategoryID = selectedCategory.parentCategoryId;
        if (isGlobalSearch == false)
          this.Searchtext = selectedCategory.searchText;
        this.DisplayLayres(selectedCategory.categoryId);
        return;
      }
    }
    let isActive = false;
    let LayerList;
    let mainList = this.MapServiceService.EnergyLayerLibrary.getValue();
    if (mainList) {
      for (let a of mainList) {
        if (a.CategoryID == categoryId) {
          isActive = true;
          LayerList = a;
        }
        if (a.CategoryID == 0) {
          this.Take = a.LayerLibrary.length;
        }
      }
    }
    if (isActive == true) {
      //this.MapServiceService.setActiveLayerslist(DefaultLayer);
      this.ActiveMapLayersLibrary.length = 0;
      this.ActiveMapLayersLibrary.push(LayerList);
      this.ActiveMapLayersLibrary[0].LayerLibrary.forEach(el => {
        el.isVisible = true;
        if (this.GoogleMapPage.energyLayer.length > 0) {
          let energyLayerDataSetIds = this.GoogleMapPage.energyLayer.map(a => a.EnergyLayerID);
          if (el.PreviewImage) {
            el.PreviewImage = this.MapServiceService.getPreviewImageLink(el.PreviewImage);
          }
          if (energyLayerDataSetIds.indexOf(el.EnergyLayerID) != -1) {
            el.Addtomap = 'Remove from map';
          }
          else {
            el.Addtomap = 'Add to map';
          }
        }
        else {
          if (el.PreviewImage) {
            el.PreviewImage = this.MapServiceService.getPreviewImageLink(el.PreviewImage);
          }
          el.Addtomap = 'Add to map';
        }
      });
      this.totalCount = this.ActiveMapLayersLibrary[0].Totalcount;
      this.DisplayingCount = this.ActiveMapLayersLibrary[0].LayerLibrary.length;
    }
    this.LayerLoader = false;

    if (this.Searchtext) {
      this.SearchData();
    }
  }
  showNormalView() {
    this.LayerLoader = true;
    this.ReducedViewContent = false;
    this.ImageListviewContent = false;
    this.NormalViewContent = true;
    this.LayerLoader = false;
  }
  showReducedView() {
    this.LayerLoader = true;
    this.NormalViewContent = false;
    this.ImageListviewContent = false;
    this.ReducedViewContent = true;
    this.LayerLoader = false;
  }
  showImageListview() {
    this.LayerLoader = true;
    this.NormalViewContent = false;
    this.ReducedViewContent = false;
    this.ImageListviewContent = true;
    this.LayerLoader = false;
  }

  OnLayerclick(node: any, Categoryid: any) {
    this.activeCategoryID = Categoryid;
    this.activeParentCategoryID = node.data.ParentCategoryID;
    let selectedItem: ActiveLibrary = {
      categoryId: this.activeCategoryID,
      searchText: this.Searchtext,
      parentCategoryId: node.data.ParentCategoryID
    };
    this.MapServiceService.setActiveSearchDataLibrary(selectedItem);
    if (node && node.hasChildren) {
      if (node.isCollapsed) {
        node.expand();
        if (node.data && node.data.children && node.data.children.length > 0) {
          this.activeParentCategoryID = node.data.children[0].ParentCategoryID;
          Categoryid = node.data.children[0].Id;
        }
        this.activeCategoryID = Categoryid;
      } else {
        node.collapse();
        return;
      }
    }

    this.LayerLoader = true;
    let isActive = false;
    if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
      for (let a of this.MapServiceService.EnergyLayerLibrary.getValue()) {
        if (a.CategoryID == Categoryid) {
          isActive = true;
        }
      }
    }
    if (isActive == false) {
      this.ActiveMapLayersLibrary.length = 0
      this.totalCount = 0;
      this.DisplayingCount = 0;
      this.LoginId = this.AuthServices.getUserId();
      this.httpService._NodeGetEnergyLayerLibrary(this.LoginId, "Energy Layer Group", Categoryid, this.Totalcount, 0).subscribe(data => {
        let LayersLibrary: any = data;
        let res = LayersLibrary;
        if (res.errormsg == "") {
          if (this.GoogleMapPage.energyLayer.length > 0) {
            let energyLayerDataSetIds = this.GoogleMapPage.energyLayer.map(a => a.EnergyLayerID);
            res["IsLoaded"] = true;
            let layer = res.LayerLibrary.map((el) => {
              if (el.PreviewImage) {
                el.PreviewImage = this.MapServiceService.getPreviewImageLink(el.PreviewImage);
              }
              var o = Object.assign({}, el);
              o.ViewData = 'View Data';
              o.isVisible = true;
              if (energyLayerDataSetIds.indexOf(el.EnergyLayerID) != -1) {
                o.Addtomap = 'Remove from map';
              }
              else {
                o.Addtomap = 'Add to map';
              }
              return o;
            });
            let DefaultLayer = [
              {
                CategoryID: Categoryid,
                LayerLibrary: layer,
                Totalcount: parseInt(res.TotalCount)
              }
            ];

            if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
              Array.prototype.push.apply(this.MapServiceService.EnergyLayerLibrary.getValue(), DefaultLayer);
            }
            else {
              this.MapServiceService.setMapSearchEnergyLayerLibrary(DefaultLayer);
            }
            this.DisplayLayres(Categoryid);
          }
          else {
            res["IsLoaded"] = true;
            let layer = res.LayerLibrary.map((el) => {
              if (el.PreviewImage) {
                el.PreviewImage = this.MapServiceService.getPreviewImageLink(el.PreviewImage);
              }
              var o = Object.assign({}, el);
              o.ViewData = 'View Data';
              o.Addtomap = 'Add to map';
              o.isVisible = true;
              return o;
            });
            let DefaultLayer = [
              {
                CategoryID: Categoryid,
                LayerLibrary: layer,
                Totalcount: parseInt(res.TotalCount)
              }
            ];

            if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
              Array.prototype.push.apply(this.MapServiceService.EnergyLayerLibrary.getValue(), DefaultLayer);
            }
            else {
              this.MapServiceService.setMapSearchEnergyLayerLibrary(DefaultLayer);
            }
            this.DisplayLayres(Categoryid);
          }
        }
        else {
          console.log(res.errorms);
          this.LayerLoader = false;
        }
      }, error => {
        console.log(error);
        this.LayerLoader = false;
      });
    }
    else {
      this.DisplayLayres(Categoryid);
    }
  }
  ViewDataClick(LayerId, CategoryId) {

  }

  SearchData() {
    const SearchData = this.Searchtext.trim();
    let selectedItem: ActiveLibrary = {
      categoryId: this.activeCategoryID,
      searchText: this.Searchtext,
      parentCategoryId: this.activeParentCategoryID
    };
    this.MapServiceService.setActiveSearchDataLibrary(selectedItem);
    if (SearchData) {
      this.isFilteredData = true;
      this.Searchtext = SearchData;
      this.ActiveMapLayersLibrary[0].LayerLibrary.forEach(el => {
        if (((el.LayerName.toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1) || ((el.DisplayName).toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1) ||
          (!el.Tags && el.Tags.toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1))) {
          el.isVisible = true;
        } else {
          el.isVisible = false;
        }
      });
      let displayingLength = this.ActiveMapLayersLibrary[0].LayerLibrary.filter(x => x.isVisible).length;
      if (displayingLength > -1) {
        this.DisplayingCount = displayingLength;
        this.totalCount = displayingLength;
      } else {
        this.DisplayingCount = 0;
        this.totalCount = 0;
      }
      this.MapServiceService.setGlobalSearchText(SearchData);
    }
    else {
      this.ResetDataLayer();
    }
  }

  ResetDataLayer() {
    this.LayerLoader = true;
    this.Searchtext = '';
    let categoryId = this.ActiveMapLayersLibrary[0].CategoryID;
    this.LoginId = this.AuthServices.getUserId();
    this.ActiveMapLayersLibrary[0].LayerLibrary.forEach(el => {
      el.isVisible = true;
    });
    this.MapServiceService.setGlobalSearchText(null);
    let selectedItem: ActiveLibrary = {
      categoryId: this.activeCategoryID,
      searchText: this.Searchtext,
      parentCategoryId: this.activeParentCategoryID
    };
    this.MapServiceService.setActiveSearchDataLibrary(selectedItem);
    this.DisplayLayres(categoryId);
    this.isFilteredData = false;
  }
  AddtomapClick(LayerId, CategoryId) {
    if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
      for (let a of this.MapServiceService.EnergyLayerLibrary.getValue()) {
        if (a.CategoryID == CategoryId) {
          let IsLoaded = false;
          for (let e of a.LayerLibrary) {
            if (e.EnergyLayerID == LayerId && !IsLoaded) {
              IsLoaded = true;
              let treeUI = this.MapServiceService._TreeUI.getValue();
              if (e.Addtomap == 'Add to map') {
                e.Addtomap = 'Remove from map';
                let Addtomapexistnode = treeUI.treeModel.getNodeById(e.EnergyLayerID);
                if (Addtomapexistnode == undefined) {
                  this.CondensedComponent.GetTreeData(LayerId);
                }
              } else {
                e.Addtomap = 'Add to map';
                let EnergyLayerID = e.EnergyLayerID + 'RemoveTreeData';
                let Removeexistnode = treeUI.treeModel.getNodeById(e.EnergyLayerID);
                if (Removeexistnode.data["children"]) {
                  if (Removeexistnode.data["children"].length > 0) {
                    for (let removelayer of Removeexistnode.data["children"]) {
                      setTimeout(() => {
                        EnergyLayerID = removelayer.Id + 'RemoveTreeData';
                        let element: HTMLElement = document.getElementById(EnergyLayerID) as HTMLElement;
                        element.click();
                      }, 200);
                    }
                  } else {
                    setTimeout(() => {
                      let element: HTMLElement = document.getElementById(EnergyLayerID) as HTMLElement;
                      element.click();
                    }, 200);
                  }
                } else {
                  setTimeout(() => {
                    let element: HTMLElement = document.getElementById(EnergyLayerID) as HTMLElement;
                    element.click();
                  }, 200);
                }

              }
            }

          }
          // Group Layer Code
          let selectedCategory = a.LayerLibrary.find(x => x.EnergyLayerID == LayerId);
          // IF Child Layer
          if (selectedCategory && selectedCategory.EnergyParentID) {
            let parentlayer = a.LayerLibrary.find(x => x.EnergyLayerID == selectedCategory.EnergyParentID);
            if (parentlayer) {
              if (parentlayer && selectedCategory.Addtomap != 'Add to map' && parentlayer.Addtomap == 'Add to map') {
                parentlayer.Addtomap = 'Remove from map';
              }
              if (selectedCategory.Addtomap == 'Add to map') {
                let SameParentCategoryList = a.LayerLibrary.filter(x => x.EnergyParentID == selectedCategory.EnergyParentID);
                let childLayersThatAddedToMap = SameParentCategoryList.filter(x => x.Addtomap != 'Add to map');
                if (childLayersThatAddedToMap && childLayersThatAddedToMap.length == 0) {
                  parentlayer.Addtomap = 'Add to map';
                }
                if (childLayersThatAddedToMap && childLayersThatAddedToMap.length > 0) {
                  parentlayer.Addtomap = 'Remove from map';
                  setTimeout(() => {
                    parentlayer.Addtomap = 'Remove from map';
                  }, 220);
                }
              }
            }
          }
          let ChildCategoryList = a.LayerLibrary.filter(x => x.EnergyParentID == LayerId);
          // IF Parent Layer
          if (ChildCategoryList && ChildCategoryList.length > 0) {
            for (let i = 0; i < ChildCategoryList.length; i++) {
              let category = ChildCategoryList[i];
              if (selectedCategory && selectedCategory.Addtomap == 'Add to map') {
                category.Addtomap = 'Add to map';
              } else {
                category.Addtomap = 'Remove from map';
              }
            }
          }
        }
      }

    }
  }

  SwitchTab() {
    if (this.modalName == "MapsearchData") {
      let MapsearchDataTab: HTMLElement = document.getElementById('MapsearchDatatitle') as HTMLElement;
      MapsearchDataTab.click();
    } else if (this.modalName == "myData") {
      let MyDataTab: HTMLElement = document.getElementById('MyDatatitle') as HTMLElement;
      MyDataTab.click();
    }
    else if (this.modalName == "SharedData") {
      let SharedDataTab: HTMLElement = document.getElementById('SharedDatatitle') as HTMLElement;
      SharedDataTab.click();
    }
  }

  onScroll() {

    if (this.ActiveMapLayersLibrary[0].CategoryID == 0) {
      this.LayerLoader = true;
      this.LoginId = this.AuthServices.getUserId();
      this.Take = this.Take + this.Totalcount;
      this.skip = this.Take - this.Totalcount;
      let take = this.Totalcount;
      if (take <= this.ActiveMapLayersLibrary[0].Totalcount) {
        this.httpService._NodeGetEnergyLayerLibrary(this.LoginId, "Energy Layer Group", 0, take, this.skip).subscribe(data => {
          let Data: any = data;
          let LayersLibrary = Data;
          let res = LayersLibrary;
          if (res.errormsg == "") {
            let layer = res.LayerLibrary[0].map((el) => {
              if (el.PreviewImage) {
                el.PreviewImage = this.MapServiceService.getPreviewImageLink(el.PreviewImage);
              }
              var o = Object.assign({}, el);
              o.ViewData = 'View Data';
              o.Addtomap = 'Add to map';
              o.isVisible = true;
              return o;
            });
            if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
              for (let a of this.MapServiceService.EnergyLayerLibrary.getValue()) {
                if (a.CategoryID == 0) {
                  Array.prototype.push.apply(a.LayerLibrary, layer);
                  Array.prototype.push.apply(this.ActiveMapLayersLibrary[0].LayerLibrary, data);
                  this.totalCount = this.ActiveMapLayersLibrary[0].Totalcount;
                  this.DisplayingCount = this.ActiveMapLayersLibrary[0].LayerLibrary.length;
                }
              }
            }
          }
          this.LayerLoader = false;
        }, error => {
          this.LayerLoader = false;
          console.log(error);
        });
      }
    }
  }
  CloseMapsearchdata() {
    this.activeModal.dismiss('Cross click');
  }
}

export class ActiveLibrary {
  categoryId: any;
  searchText: string;
  parentCategoryId: any;
}