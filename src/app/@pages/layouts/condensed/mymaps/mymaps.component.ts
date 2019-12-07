import { Component, OnInit, Input, Injector } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapLibraryComponent } from '../map-library/map-library.component';
import { ToolsService } from '../../../../services/tools.service';
import { AuthenticationService } from '../../../../services/auth.service';
import { UtilityService } from '../../../../services/Utility.service';
import { HttpRequestService } from '../../../../services/all-http-request.service';
import { MapServiceService } from '../../../../services/map-service.service';
import { environment } from '../../../../../environments/environment';
import { MyMapService } from '../../../../services/my-map.service';
import { BasemapComponent } from '../basemap/basemap.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { CondensedComponent } from '../condensed.component';
import { DeleteMapConfirmationComponent } from './deletemap-confirmation/deletemap-confirmation.component';
import { EditMyMapComponent } from './edit-my-map/edit-my-map.component';

declare var $: any;

@Component({
  selector: 'app-mymaps',
  templateUrl: './mymaps.component.html',
  styleUrls: ['./mymaps.component.scss'],
  providers: [BasemapComponent, BsModalRef]
})
export class MymapsComponent implements OnInit {
  @Input() modalName;
  basemapComponent: BasemapComponent;
  condensedComponent: CondensedComponent;
  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public toolsService: ToolsService,
    private utilityService: UtilityService,
    public authServices: AuthenticationService,
    private httpService: HttpRequestService,
    public mapServiceService: MapServiceService,
    public httpRequestService: HttpRequestService,
    public myMapService: MyMapService,
    public Injector: Injector,
    public bsModalRef: BsModalRef,
    public authenticationService: AuthenticationService,
    public bsModalService: BsModalService
  ) {
    this.basemapComponent = Injector.get(BasemapComponent);
    this.condensedComponent = Injector.get(CondensedComponent);
  }

  ShowLoader: boolean = false;

  AllMyMapList = [];
  AllSharedMapList = [];

  userMapList = [];
  myMapList = [];
  sharedMapList = [];
  searchMyMap: string = '';
  searchSharedMap: string = '';
  ImageURLPath: string = environment.ImagespreviewPath;
  //totalMyMaps: number = 0;
  title: string = "";
  mymaptotalcount = 0;
  SharedmapTotalcount = 0;
  ngOnInit() {

    this.utilityService.CloseModalOnRouteChange(this.activeModal);
    this.Draggable();
    if (this.modalName == 'sharedMap') {
      this.SwitchSharedMap();
    }
    else
      this.title = "My Maps";
    this.GetUserMaps();
  }

  SearchMyMap() {
    let SearchData = this.searchMyMap.trim();
    if (SearchData) {
      this.myMapList = [];
      let _AllMyMapList = this.mapServiceService._UserMapData.getValue().filter(m => m.Type == 'mymap');
      _AllMyMapList.map((el) => {
        if (el && el.Name) {
          if (((el.Name != null && el.Name.toLowerCase().indexOf(SearchData.toLowerCase()) > -1)
            || (el.Description != null && el.Description.toLowerCase().indexOf(SearchData.toLowerCase()) > -1))) {
            el.isVisible = true;
          } else {
            el.isVisible = false;
          }
        }
      });
      this.mymaptotalcount = _AllMyMapList.filter(x => x.isVisible == true).length;
    }
    else {
      this.ResetMyMap();
    }
  }

  SearchSharedMap() {
    let SearchData = this.searchSharedMap.trim();
    if (SearchData) {
      this.sharedMapList = [];
      let _AllSharedMapList = this.mapServiceService._UserMapData.getValue().filter(m => m.Type == 'sharedmap');
      _AllSharedMapList.map((el) => {
        if (el != undefined && el != null && el.Name != '') {
          if (((el.Name != null && el.Name.toLowerCase().indexOf(SearchData.toLowerCase()) > -1)
            || (el.Description != null && el.Description.toLowerCase().indexOf(SearchData.toLowerCase()) > -1))) {
            //this.sharedMapList.push(el);
            el.isVisible = true;
          }
          else {
            el.isVisible = false;
          }
        }
      });
      this.SharedmapTotalcount = _AllSharedMapList.filter(x => x.isVisible == true).length;

    }
    else {
      this.ResetSharedMap();
    }
  }

  ResetMyMap() {
    var _AllMyMapList = this.mapServiceService._UserMapData.getValue().filter(m => m.Type == 'mymap');
    _AllMyMapList.map((el) => { el.isVisible = true; });
    this.myMapList = _AllMyMapList;
    this.mymaptotalcount = this.myMapList.length;
    this.searchMyMap = '';
  }



  ResetSharedMap() {
    var AllSharedMapList = this.mapServiceService._UserMapData.getValue().filter(m => m.Type == 'sharedmap');
    AllSharedMapList.map((el) => { el.isVisible = true; });
    this.sharedMapList = AllSharedMapList;
    this.SharedmapTotalcount = this.sharedMapList.length;
    this.searchSharedMap = '';
  }

  GetUserMaps() {
    this.userMapList = this.mapServiceService._UserMapData.getValue();
    if (this.userMapList == null) {
      let Userid = this.authServices.getLoggedinUserId();
      this.ShowLoader = true;
      this.httpService._NodeGetUserMaps(Userid).subscribe(data => {
        this.ShowLoader = false;
        if (data._Issuccess) {
          var mdata = data.MapbyUSerData;
          mdata = mdata.map((el) => {
            var o = Object.assign({}, el);
            o.isVisible = true;
            return o;
          });
          if (mdata.length > 0) {
            this.userMapList = mdata;
            this.mapServiceService.setUserMap(mdata);
            this.myMapList = this.userMapList.filter(m => m.Type == 'mymap');
            this.sharedMapList = this.userMapList.filter(m => m.Type == 'sharedmap');
            this.mymaptotalcount = this.myMapList.length;
            this.SharedmapTotalcount = this.sharedMapList.length;
            this.AllMyMapList = this.myMapList;
            this.AllSharedMapList = this.sharedMapList;
          }

        }
      },
        error => {
          console.log(error);
          this.ShowLoader = false;
        });
    }
    else {
      var _AllMyMapList = this.mapServiceService._UserMapData.getValue().filter(m => m.Type == 'mymap');
      var _AllsharedMapList = this.mapServiceService._UserMapData.getValue().filter(m => m.Type == 'sharedmap');
      _AllMyMapList.map((el) => { el.isVisible = true; });
      _AllsharedMapList.map((el) => { el.isVisible = true; });
      this.myMapList = _AllMyMapList;
      this.sharedMapList = _AllsharedMapList;
      this.mymaptotalcount = this.myMapList.length;
      this.SharedmapTotalcount = this.sharedMapList.length;
      this.AllMyMapList = this.myMapList;
      this.AllSharedMapList = this.sharedMapList;
    }
  }

  SwitchMyMap() {
    this.title = "My Maps";
    var sharedMap = document.getElementById('shareMapCard') as HTMLElement;
    var myMap = document.getElementById('myMapCard') as HTMLElement;
    myMap.classList.remove("hide");
    sharedMap.classList.add("hide");
  }

  SwitchSharedMap() {
    this.title = "Shared Maps";
    var sharedMap = document.getElementById('shareMapCard') as HTMLElement;
    var myMap = document.getElementById('myMapCard') as HTMLElement;
    myMap.classList.add("hide");
    sharedMap.classList.remove("hide");
  }

  OpenMapLibrary() {
    this.modalService.open(MapLibraryComponent, { size: 'lg', centered: true, backdrop: 'static', windowClass: "mapLibrary-modal" });
    this.activeModal.close();
  }

  Draggable() {
    setTimeout(() => {
      $('.modal-dialog').draggable({
        handle: ".modal-header"
      });
    }, 10);
  }

  ViewMyMap(mapID, sharedMapData: any = null) {
    this.condensedComponent.BlankMap();
    this.activeModal.dismiss('Cross click');
    setTimeout(() => {
      this.httpRequestService._NodeGetMapData(mapID).subscribe(data => {
        if (data._Issuccess) {
          //let UserId = this.authenticationService.getLoggedinUserId();
          let loggedInUserId = this.authenticationService.getLoggedinUserId();
          let UserData = this.authenticationService.GetUserData();
          let UserName = UserData ? UserData.DisplayName : this.authenticationService.GetUsername();

          //Map Settings
          if (data.CustomMapData.CustomMaps.length > 0) {
            var customMapData = data.CustomMapData.CustomMaps[0];
            this.httpRequestService._NodeInsertMyMapLogs(customMapData, loggedInUserId, UserName).subscribe(data => { });

            if (this.mapServiceService._mapdata.getValue()) {
              this.mapServiceService.setMapTitledata(customMapData.Name);
              let map = this.mapServiceService._mapdata.getValue();
              map.setCenter({ lat: customMapData.CenterLatitude, lng: customMapData.CenterLongitude });
              map.setZoom(customMapData.ZoomLevel);
              this.ChangeBaseMapById(customMapData.BaseMapProviderId);
              if (customMapData.LegendOrder) {
                this.condensedComponent.ShowLegends();
              }
            }
          }

          //Energy Layers Settings
          if (data.CustomMapData.CustomMaps_EnergyLayers.length > 0 && data.CustomMapData.CustomMaps.length > 0) {
            var distinctParentIds = data.CustomMapData.CustomMaps_EnergyLayers.map(r => r.EnergyParentID).filter((value, index, self) => self.indexOf(value) === index);
            var individualLayers = [];
            var groupLayers = [];
            var gLayers = [];
            for (var id of distinctParentIds) {
              for (var layer of data.CustomMapData.CustomMaps_EnergyLayers) {
                if (layer.EnergyParentID == id && layer.IsHaschild)
                  gLayers.push(layer.EnergyParentID);
                else if (layer.EnergyParentID == id && !layer.IsHaschild)
                  individualLayers.push(layer.EnergyLayerId);
              }
            }
            var needToRemoveItems = [];
            if (gLayers.length > 0) {
              gLayers = gLayers.filter((value, index, self) => self.indexOf(value) === index);
              for (var layer of gLayers) {
                var childs = [];
                data.CustomMapData.CustomMaps_EnergyLayers.map(function (e) {
                  if (e.EnergyParentID == layer)
                    childs.push(e.EnergyLayerId);
                })
                if (childs.length > 1)
                  groupLayers.push({ ParentLayerId: layer, Childs: childs })
                else if (childs.length == 1) {
                  needToRemoveItems.push(gLayers.indexOf(layer));
                  individualLayers.push(childs[0]);
                }
              }
            }
            if (needToRemoveItems.length > 0) {
              for (var i = needToRemoveItems.length - 1; i >= 0; i--)
                gLayers.splice(needToRemoveItems[i], 1);
            }

            var energyLayersData = JSON.parse(JSON.stringify(data.CustomMapData.CustomMaps_EnergyLayers));
            for (var layer of energyLayersData) {
              if (gLayers.indexOf(layer.EnergyParentID) != -1)
                layer.EnergyLayerId = layer.EnergyParentID;
            }
            var energyLayerOrders = energyLayersData.map(r => r.EnergyLayerId).filter((value, index, self) => self.indexOf(value) === index);
            if (data.CustomMapData.CustomMaps_DefaultCheckedLayers.length > 0) {
              var defauldCheckedGuids = data.CustomMapData.CustomMaps_DefaultCheckedLayers.map(r => r.LayerGuid.toLowerCase());
              if (energyLayerOrders.length > 1) {
                for (var id of energyLayerOrders) {
                  if (individualLayers.indexOf(id) > -1) {
                    if (sharedMapData == null)
                      this.condensedComponent.GetTreeData(id, defauldCheckedGuids, energyLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                    else
                      this.condensedComponent.GetTreeData(id, defauldCheckedGuids, energyLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId, false, sharedMapData.UserId);
                  }
                  else if (gLayers.indexOf(id) > -1) {
                    var selectedGroupLayer = [];
                    groupLayers.map(function (e) {
                      if (e.ParentLayerId == id)
                        selectedGroupLayer.push(e);
                    })
                    if (selectedGroupLayer.length == 1) {
                      setTimeout(() => {
                        if (sharedMapData == null)
                          this.condensedComponent.GetTreeData(selectedGroupLayer[0], defauldCheckedGuids, energyLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                        else
                          this.condensedComponent.GetTreeData(selectedGroupLayer[0], defauldCheckedGuids, energyLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId, false, sharedMapData.UserId);
                      }, 100);

                    }

                  }
                }
              }
              else if (energyLayerOrders.length == 1) {
                if (individualLayers.indexOf(energyLayerOrders[0]) > -1) {
                  setTimeout(() => {
                    if (sharedMapData == null)
                      this.condensedComponent.GetTreeData(energyLayerOrders[0], defauldCheckedGuids, [], data.CustomMapData.CustomMaps[0].CustomMapId);
                    else
                      this.condensedComponent.GetTreeData(energyLayerOrders[0], defauldCheckedGuids, [], data.CustomMapData.CustomMaps[0].CustomMapId, false, sharedMapData.UserId);
                  }, 100);
                }
                else if (gLayers.indexOf(energyLayerOrders[0]) > -1) {
                  var selectedGroupLayer = [];
                  groupLayers.map(function (e) {
                    if (e.ParentLayerId == energyLayerOrders[0])
                      selectedGroupLayer.push(e);
                  })
                  if (selectedGroupLayer.length == 1) {
                    setTimeout(() => {
                      if (sharedMapData == null)
                        this.condensedComponent.GetTreeData(selectedGroupLayer[0], defauldCheckedGuids, [], data.CustomMapData.CustomMaps[0].CustomMapId);
                      else
                        this.condensedComponent.GetTreeData(selectedGroupLayer[0], defauldCheckedGuids, [], data.CustomMapData.CustomMaps[0].CustomMapId, false, sharedMapData.UserId);
                    }, 100);

                  }
                }
              }
            }
            else {
              if (energyLayerOrders.length > 1) {
                for (var id of energyLayerOrders) {
                  if (individualLayers.indexOf(id) > -1) {
                    setTimeout(() => {
                      if (sharedMapData == null)
                        this.condensedComponent.GetTreeData(id, [], energyLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                      else
                        this.condensedComponent.GetTreeData(id, [], energyLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId, false, sharedMapData.UserId);
                    }, 100);
                  }
                  else if (gLayers.indexOf(id) > -1) {
                    var selectedGroupLayer = [];
                    groupLayers.map(function (e) {
                      if (e.ParentLayerId == id)
                        selectedGroupLayer.push(e);
                    })
                    if (selectedGroupLayer.length == 1)
                      setTimeout(() => {
                        if (sharedMapData == null)
                          this.condensedComponent.GetTreeData(selectedGroupLayer[0], [], energyLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                        else
                          this.condensedComponent.GetTreeData(selectedGroupLayer[0], [], energyLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId, false, sharedMapData.UserId);
                      }, 100);

                  }

                }
              }
              else if (energyLayerOrders.length == 1) {
                if (individualLayers.indexOf(energyLayerOrders[0]) > -1) {
                  setTimeout(() => {
                    if (sharedMapData == null)
                      this.condensedComponent.GetTreeData(energyLayerOrders[0], [], [], data.CustomMapData.CustomMaps[0].CustomMapId);
                    else
                      this.condensedComponent.GetTreeData(energyLayerOrders[0], [], [], data.CustomMapData.CustomMaps[0].CustomMapId, false, sharedMapData.UserId);
                  }, 100);
                }
                else if (gLayers.indexOf(energyLayerOrders[0]) > -1) {
                  var selectedGroupLayer = [];
                  groupLayers.map(function (e) {
                    if (e.ParentLayerId == energyLayerOrders[0])
                      selectedGroupLayer.push(e);
                  })
                  if (selectedGroupLayer.length == 1)
                    setTimeout(() => {
                      if (sharedMapData == null)
                        this.condensedComponent.GetTreeData(selectedGroupLayer[0], [], [], data.CustomMapData.CustomMaps[0].CustomMapId);
                      else
                        this.condensedComponent.GetTreeData(selectedGroupLayer[0], [], [], data.CustomMapData.CustomMaps[0].CustomMapId, false, sharedMapData.UserId);
                    }, 100);

                }

              }
            }
          }

          //Private Layers Settings
          if (data.CustomMapData.CustomMaps_DataSets.length > 0 && data.CustomMapData.CustomMaps.length > 0) {
            let privateLayers: any = [];
            data.CustomMapData.CustomMaps_DataSets.map(function (e) {
              if (e.UploadedBy.toLowerCase() == loggedInUserId.toLowerCase()) {
                privateLayers.push(e);
              }
            });
            if (privateLayers.length > 0) {
              var distinctParentIds = privateLayers.map(r => r.ParentDataSetID).filter((value, index, self) => self.indexOf(value) === index).filter(r => r);
              var individualLayers = [];
              var groupLayers = [];
              for (var layer of privateLayers) {
                if (!layer.ParentDataSetID) {
                  if (distinctParentIds.indexOf(layer.DataSetId) == -1)
                    individualLayers.push(layer.DataSetId);
                }
              }

              if (distinctParentIds.length > 0) {
                for (var layer of distinctParentIds) {
                  var childs = [];
                  privateLayers.map(function (e) {
                    if (e.ParentDataSetID == layer)
                      childs.push(e.DataSetId);
                  });
                  groupLayers.push({ ParentLayerId: layer, Childs: childs });
                }
              }

              var privateLayersData = JSON.parse(JSON.stringify(privateLayers));
              for (var layer of privateLayersData) {
                if (distinctParentIds.indexOf(layer.ParentDataSetID) != -1)
                  layer.DataSetId = layer.ParentDataSetID;
              }

              var privateLayerOrders = privateLayersData.map(r => r.DataSetId).filter((value, index, self) => self.indexOf(value) === index);

              if (data.CustomMapData.CustomMaps_DefaultCheckedLayers.length > 0) {
                var defauldCheckedGuids = data.CustomMapData.CustomMaps_DefaultCheckedLayers.map(r => r.LayerGuid.toLowerCase());
                if (privateLayerOrders.length > 1) {
                  for (var id of privateLayerOrders) {
                    if (individualLayers.indexOf(id) > -1)
                      this.condensedComponent.GetPrivateLayerTreeData(id, defauldCheckedGuids, privateLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                    else if (distinctParentIds.indexOf(id) > -1) {
                      var selectedGroupLayer = [];
                      groupLayers.map(function (e) {
                        if (e.ParentLayerId == id)
                          selectedGroupLayer.push(e);
                      })
                      if (selectedGroupLayer.length == 1)
                        this.condensedComponent.GetPrivateLayerTreeData(selectedGroupLayer[0], defauldCheckedGuids, privateLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                    }
                  }
                }
                else if (privateLayerOrders.length == 1) {
                  if (individualLayers.indexOf(privateLayerOrders[0]) > -1)
                    this.condensedComponent.GetPrivateLayerTreeData(privateLayerOrders[0], defauldCheckedGuids, [], data.CustomMapData.CustomMaps[0].CustomMapId);
                  else if (distinctParentIds.indexOf(privateLayerOrders[0]) > -1) {
                    var selectedGroupLayer = [];
                    groupLayers.map(function (e) {
                      if (e.ParentLayerId == privateLayerOrders[0])
                        selectedGroupLayer.push(e);
                    })
                    if (selectedGroupLayer.length == 1)
                      this.condensedComponent.GetPrivateLayerTreeData(selectedGroupLayer[0], defauldCheckedGuids, [], data.CustomMapData.CustomMaps[0].CustomMapId);
                  }
                }
              }
              else {
                if (privateLayerOrders.length > 1) {
                  for (var id of privateLayerOrders) {
                    if (individualLayers.indexOf(id) > -1)
                      this.condensedComponent.GetPrivateLayerTreeData(id, [], privateLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                    else if (distinctParentIds.indexOf(id) > -1) {
                      var selectedGroupLayer = [];
                      groupLayers.map(function (e) {
                        if (e.ParentLayerId == id)
                          selectedGroupLayer.push(e);
                      })
                      if (selectedGroupLayer.length == 1)
                        this.condensedComponent.GetPrivateLayerTreeData(selectedGroupLayer[0], [], privateLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                    }
                  }
                }
                else if (privateLayerOrders.length == 1) {
                  if (individualLayers.indexOf(privateLayerOrders[0]) > -1)
                    this.condensedComponent.GetPrivateLayerTreeData(privateLayerOrders[0], [], [], data.CustomMapData.CustomMaps[0].CustomMapId);
                  else if (distinctParentIds.indexOf(privateLayerOrders[0]) > -1) {
                    var selectedGroupLayer = [];
                    groupLayers.map(function (e) {
                      if (e.ParentLayerId == privateLayerOrders[0])
                        selectedGroupLayer.push(e);
                    })
                    if (selectedGroupLayer.length == 1)
                      this.condensedComponent.GetPrivateLayerTreeData(selectedGroupLayer[0], [], [], data.CustomMapData.CustomMaps[0].CustomMapId);
                  }
                }
              }
            }
          }

          //Shared Layers Settings
          if (data.CustomMapData.CustomMaps_DataSets.length > 0 && data.CustomMapData.CustomMaps.length > 0) {
            let sharedLayers: any = [];
            data.CustomMapData.CustomMaps_DataSets.map(function (e) {
              if (e.UploadedBy.toLowerCase() != loggedInUserId.toLowerCase()) {
                sharedLayers.push(e);
              }
            });
            if (sharedLayers.length > 0) {
              var distinctParentIds = sharedLayers.map(r => r.ParentDataSetID).filter((value, index, self) => self.indexOf(value) === index).filter(r => r);
              var individualLayers = [];
              var groupLayers = [];
              for (var layer of sharedLayers) {
                if (!layer.ParentDataSetID) {
                  if (distinctParentIds.indexOf(layer.DataSetId) == -1)
                    individualLayers.push(layer.DataSetId);
                }
              }

              if (distinctParentIds.length > 0) {
                for (var layer of distinctParentIds) {
                  var childs = [];
                  sharedLayers.map(function (e) {
                    if (e.ParentDataSetID == layer)
                      childs.push(e.DataSetId);
                  });
                  groupLayers.push({ ParentLayerId: layer, Childs: childs });
                }
              }

              var sharedLayersData = JSON.parse(JSON.stringify(sharedLayers));
              for (var layer of sharedLayersData) {
                if (distinctParentIds.indexOf(layer.ParentDataSetID) != -1)
                  layer.DataSetId = layer.ParentDataSetID;
              }

              var sharedLayerOrders = sharedLayersData.map(r => r.DataSetId).filter((value, index, self) => self.indexOf(value) === index);

              if (data.CustomMapData.CustomMaps_DefaultCheckedLayers.length > 0) {
                var defauldCheckedGuids = data.CustomMapData.CustomMaps_DefaultCheckedLayers.map(r => r.LayerGuid.toLowerCase());
                if (sharedLayerOrders.length > 1) {
                  for (var id of sharedLayerOrders) {
                    if (individualLayers.indexOf(id) > -1)
                      this.condensedComponent.GetSharedLayerTreeData(id, defauldCheckedGuids, sharedLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                    else if (distinctParentIds.indexOf(id) > -1) {
                      var selectedGroupLayer = [];
                      groupLayers.map(function (e) {
                        if (e.ParentLayerId == id)
                          selectedGroupLayer.push(e);
                      })
                      if (selectedGroupLayer.length == 1)
                        this.condensedComponent.GetSharedLayerTreeData(selectedGroupLayer[0], defauldCheckedGuids, sharedLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                    }
                  }
                }
                else if (sharedLayerOrders.length == 1) {
                  if (individualLayers.indexOf(sharedLayerOrders[0]) > -1)
                    this.condensedComponent.GetSharedLayerTreeData(sharedLayerOrders[0], defauldCheckedGuids, [], data.CustomMapData.CustomMaps[0].CustomMapId);
                  else if (distinctParentIds.indexOf(sharedLayerOrders[0]) > -1) {
                    var selectedGroupLayer = [];
                    groupLayers.map(function (e) {
                      if (e.ParentLayerId == sharedLayerOrders[0])
                        selectedGroupLayer.push(e);
                    })
                    if (selectedGroupLayer.length == 1)
                      this.condensedComponent.GetSharedLayerTreeData(selectedGroupLayer[0], defauldCheckedGuids, [], data.CustomMapData.CustomMaps[0].CustomMapId);
                  }
                }
              }
              else {
                if (sharedLayerOrders.length > 1) {
                  for (var id of sharedLayerOrders) {
                    if (individualLayers.indexOf(id) > -1)
                      this.condensedComponent.GetSharedLayerTreeData(id, [], sharedLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                    else if (distinctParentIds.indexOf(id) > -1) {
                      var selectedGroupLayer = [];
                      groupLayers.map(function (e) {
                        if (e.ParentLayerId == id)
                          selectedGroupLayer.push(e);
                      })
                      if (selectedGroupLayer.length == 1)
                        this.condensedComponent.GetSharedLayerTreeData(selectedGroupLayer[0], [], sharedLayerOrders, data.CustomMapData.CustomMaps[0].CustomMapId);
                    }
                  }
                }
                else if (sharedLayerOrders.length == 1) {
                  if (individualLayers.indexOf(sharedLayerOrders[0]) > -1)
                    this.condensedComponent.GetSharedLayerTreeData(sharedLayerOrders[0], [], [], data.CustomMapData.CustomMaps[0].CustomMapId);
                  else if (distinctParentIds.indexOf(sharedLayerOrders[0]) > -1) {
                    var selectedGroupLayer = [];
                    groupLayers.map(function (e) {
                      if (e.ParentLayerId == sharedLayerOrders[0])
                        selectedGroupLayer.push(e);
                    })
                    if (selectedGroupLayer.length == 1)
                      this.condensedComponent.GetSharedLayerTreeData(selectedGroupLayer[0], [], [], data.CustomMapData.CustomMaps[0].CustomMapId);
                  }
                }
              }
            }
          }

          this.myMapService.isCustomMapLoaded = true;
          this.myMapService.loadedMapData = data.CustomMapData;
        }
      }, error => {
        console.log(error);
      });
    }, 1000);
  }

  loadLayersOnMapById(id, individualLayers, gLayers, defauldCheckedGuids) {
    setTimeout(() => {
      if (individualLayers.indexOf(id) > -1)
        this.condensedComponent.GetTreeData(id, defauldCheckedGuids);
      else if (gLayers.indexOf(id) > -1)
        this.condensedComponent.GetTreeData(id, defauldCheckedGuids);
    }, 5000)
  }

  ChangeBaseMapById(BaseMapProviderId) {
    let List = this.mapServiceService.BaseMapData.getValue();
    if (List == null) {
      this.ShowLoader = true;
      let UserId = this.authenticationService.getLoggedinUserId();
      this.httpRequestService._NodeGetBaseMapTypes(UserId).subscribe(data => {
        if (data._Issuccess) {
          this.basemapComponent.baseMapList = data.BaseMapData;
          this.basemapComponent.SetDefualtMapBasedonMapsetting(data);
          this.mapServiceService.setBaseMap(data);
        }
        this.ShowLoader = false;
      },
        error => {
          console.log(error);
          this.ShowLoader = false;
        });
    }
    else {
      this.basemapComponent.baseMapList = List.BaseMapData;
      this.basemapComponent.SetDefualtMapBasedonMapsetting(List);
    }
    this.basemapComponent.ChangeBaseMap(BaseMapProviderId);
  }

  openDeleteMapConfirmation(mapID, mapName) {
    const initialState = {
      MapId: mapID,
      MapName: mapName,
    };
    this.bsModalService.show(DeleteMapConfirmationComponent, { class: 'modal-md deletemapConfirmation modal-dialog-centered top-backdrop', backdrop: 'static', animated: false, initialState });
  }

  filterMyMap(itemList) {
    var myMapList = [];
    if (itemList && itemList.length > 0) {
      myMapList = itemList.filter(m => m.Type == 'mymap');
      //this.totalMyMaps = myMapList.length;
    }
    return myMapList;
  }
  EditMyMap(MapData) {
    const initialState = {
      MapData: MapData
    };
    this.bsModalService.show(EditMyMapComponent, { class: 'modal-md EditmymapConfirmation modal-dialog-centered top-backdrop', backdrop: 'static', animated: false, initialState });
  }
}
