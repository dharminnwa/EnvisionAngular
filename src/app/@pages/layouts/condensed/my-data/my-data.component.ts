import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../../services/auth.service';
import { stringify } from '@angular/compiler/src/util';
import { CookieService } from 'ngx-cookie-service';
import { CondensedComponent } from '../../condensed/condensed.component'
import { MapServiceService } from '../../../../services/map-service.service';
import { GoogleMapPage } from '../../../../maps/google/google.component';
import { EditMyDataComponent } from './edit-mydata/edit-mydata.component';
import { HttpRequestService } from '../../../../services/all-http-request.service';
import { UtilityService } from '../../../../services/Utility.service';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.component.html',
  styleUrls: ['./my-data.component.scss']
})

export class MyDataComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal,
    public AuthServices: AuthenticationService,
    private CondensedComponent: CondensedComponent,
    public cookieService: CookieService,
    public MapServiceService: MapServiceService,
    public GoogleMapPage: GoogleMapPage,
    private modalService: NgbModal,
    private httpService: HttpRequestService,
    private UtilityService: UtilityService) { }
  fileType = [];
  selectedfileType = [];
  dropdownSettings = {};
  LayerLoader = false;
  showDefaultCategoryId = 0;
  LoginUserGuId = '';
  ActivePrivateLayersLibrary: any = [
    {
      CategoryID: 0,
      TotalCount: 0,
      LayerLibrary: [],
    }
  ];
  MydataSearchtext = '';
  ImageURLPath: string = environment.ImagespreviewPath;
  @Input() hideSomePart = true;

  // ActivePrivateLayersLibrary=[
  //   {
  //     CategoryID: 0,
  //     TotalCount: layer.length,
  //     LayerLibrary: layer,
  //   }
  // ];
  ngOnInit() {
    this.FillFileTypes();
    this.setMyDataLayer();
  }

  FillFileTypes() {
    this.fileType = [
      { item_extention: '', item_text: 'My Layers' },
      { item_extention: '.zip,.shp', item_text: 'ShapeFile' },
      { item_extention: '.kml,.kmz', item_text: 'KML' },
      { item_extention: '.xls,.xlsx,.csv', item_text: 'Locations' },
      { item_extention: '.png,.jpg,.ico,.bmp,.pdf', item_text: 'Image' },
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_extention',
      textField: 'item_text',
      enableCheckAll: false,
      maxHeight: 120,
      itemsShowLimit: 1,
    };
  }

  setMyDataLayer() {
    this.LayerLoader = true;
    this.LoginUserGuId = this.AuthServices.getLoggedinUserId();
    if (!this.MapServiceService.MyDataLayerLibrary.getValue()) {
      this.httpService._NodeGetMyDataLibrary(this.LoginUserGuId).subscribe(data => {
        let res = data;
        let MyDataRes = res;
        if (MyDataRes._Issuccess == true) {
          if (this.GoogleMapPage.privateLayer.length > 0) {
            let privateLayerDataSetIds = this.GoogleMapPage.privateLayer.map(a => a.DataSetID);
            MyDataRes["IsLoaded"] = true;
            let layer = MyDataRes.LayerLibrary.map((el) => {
              var o = Object.assign({}, el);
              o.Delete = 'Delete';
              o.Edit = 'Edit';
              if (privateLayerDataSetIds.indexOf(el.DataSetID) != -1) {
                o.Addtomap = 'Remove from map';
              }
              else {
                o.Addtomap = 'Add to map';
              }
              return o;
            });
            let DefaultLayer = [
              {
                CategoryID: 0,
                TotalCount: layer.length,
                DisplayingCount: layer.length,
                LayerLibrary: layer,
              }
            ];
            this.MapServiceService.setMyDataLayerLibrary(DefaultLayer);
            this.DisplayLayres(this.showDefaultCategoryId);
          }
          else {
            MyDataRes["IsLoaded"] = true;
            let layer = MyDataRes.LayerLibrary.map((el) => {
              var o = Object.assign({}, el);
              o.Delete = 'Delete';
              o.Edit = 'Edit';
              o.Addtomap = 'Add to map';
              return o;
            });
            let DefaultLayer = [
              {
                CategoryID: 0,
                TotalCount: layer.length,
                DisplayingCount: layer.length,
                LayerLibrary: layer,
              }
            ];
            this.MapServiceService.setMyDataLayerLibrary(DefaultLayer);
            this.DisplayLayres(this.showDefaultCategoryId);
          }
          let _JsonAllActiveMapLayes = JSON.stringify(this.MapServiceService.MyDataLibrary.getValue());
          if (localStorage.getItem("AllActivePrivateLayersLibrary") == null)
            localStorage.setItem("AllActivePrivateLayersLibrary", _JsonAllActiveMapLayes);
        }
        else {
          console.log(res.errorms);
        }
        // if (this.MapServiceService.MydataLibraryCount.getValue().length > 0) {
        //   let count = this.MapServiceService.MydataLibraryCount.getValue()[0].total;
        //   this.totalCount = count;
        //   //this.totalCount = this.MapServiceService.MydataLibraryCount.getValue();
        //   this.DisplayingCount = this.totalCount;
        // }
        this.LayerLoader = false;
      }, error => {
        console.log(error);
        this.LayerLoader = false;
      })
    }
    else {
      this.DisplayLayres(this.showDefaultCategoryId);
      // this.totalCount = this.MapServiceService.MydataLibraryCount.getValue()[0].total;
      // this.DisplayingCount = this.totalCount;
      this.LayerLoader = false;
    }
  }

  DisplayLayres(categoryId) {
    let isActive = false;
    let LayerList;
    if (this.MapServiceService.MyDataLibrary.getValue()) {
      for (let a of this.MapServiceService.MyDataLibrary.getValue()) {
        if (a.CategoryID == categoryId) {
          isActive = true;
          LayerList = a;
        }
      }
    }
    if (isActive == true) {
      //this.MapServiceService.setActiveLayerslist(DefaultLayer);
      this.ActivePrivateLayersLibrary.length = 0;
      this.ActivePrivateLayersLibrary.push(LayerList);
      this.ActivePrivateLayersLibrary[0].LayerLibrary.forEach(el => {
        if (this.GoogleMapPage.privateLayer.length > 0) {
          let privateLayerDataSetIds = this.GoogleMapPage.privateLayer.map(a => a.DataSetID);
            if (privateLayerDataSetIds.indexOf(el.DataSetID) != -1) {
              el.Addtomap = 'Remove from map';
            }
            else {
              el.Addtomap = 'Add to map';
            }
        }
        else {
            el.Addtomap = 'Add to map';
        }
      });
    }
    this.LayerLoader = false;
  }

  OpenAddDataModal() {
    this.CondensedComponent.OpenAddadtaModal();
  }

  AddtomapClick(LayerId, CategoryId) {
    if (this.MapServiceService.MyDataLibrary.getValue()) {
      for (let a of this.MapServiceService.MyDataLibrary.getValue()) {
        if (a.CategoryID == CategoryId) {
          for (let e of a.LayerLibrary) {
            if (e.DataSetID == LayerId) {
              let treeUI = this.MapServiceService._PrivateTreeUI.getValue();
              if (e.Addtomap == 'Add to map') {
                e.Addtomap = 'Remove from map';
                this.CondensedComponent.GetPrivateLayerTreeData(LayerId);
              } else {
                e.Addtomap = 'Add to map';
                let layerRemoveButtonID = e.DataSetID + 'RemoveTreeData';
                let Removeexistnode = treeUI.treeModel.getNodeById(e.DataSetID);
                if (Removeexistnode.data["children"]) {
                  if (Removeexistnode.data["children"].length > 1) {
                    for (let removelayer of Removeexistnode.data["children"]) {
                      setTimeout(() => {
                        layerRemoveButtonID = removelayer.Id + 'RemoveTreeData';
                        let element: HTMLElement = document.getElementById(layerRemoveButtonID) as HTMLElement;
                        element.click();
                      }, 200);
                    }
                  } else {
                    setTimeout(() => {
                      let element: HTMLElement = document.getElementById(layerRemoveButtonID) as HTMLElement;
                      element.click();
                    }, 200);
                  }
                } else {
                  setTimeout(() => {
                    let element: HTMLElement = document.getElementById(layerRemoveButtonID) as HTMLElement;
                    element.click();
                  }, 200);
                }
              }
            }

          }

        }
      }
    }
  }

  DeleteClick(LayerId) {
    if (this.GoogleMapPage.privateLayer.length > 0) {
      let privateLayerList = this.GoogleMapPage.privateLayer;
      let filteredData = privateLayerList.filter(item => LayerId == item.DataSetID);
      if (filteredData.length == 1)
        this.UtilityService.ActiveLayerData(LayerId, 'RemoveTreeData');
    }
    this.CondensedComponent.RemoveLayerFromMyDataLibrary(LayerId);
  }

  SearchData() {
    let SearchData = this.MydataSearchtext.trim();
    let Data: any = [];
    let categoryId = this.ActivePrivateLayersLibrary[0].CategoryID;
    //localStorage.clear();
    if (localStorage.getItem("AllActivePrivateLayersLibrary")) {
      let AllActivePrivateLayers = JSON.parse(localStorage.getItem("AllActivePrivateLayersLibrary"));
      if (AllActivePrivateLayers) {
        for (let a of AllActivePrivateLayers) {
          if (a.CategoryID == categoryId) {
            if (this.MapServiceService.MyDataLibrary.getValue()) {
              for (let e of this.MapServiceService.MyDataLibrary.getValue()) {
                if (e.CategoryID == categoryId) {
                  e.LayerLibrary.length = 0;
                  Array.prototype.push.apply(e.LayerLibrary, a.LayerLibrary);
                }
              }
              this.MapServiceService.MyDataLibrary.getValue()[0].TotalCount = a.TotalCount;
              this.MapServiceService.MyDataLibrary.getValue()[0].DisplayingCount = a.DisplayingCount;
            }
          }
        }
      }
    }
    if (SearchData && this.selectedfileType.length == 0) {
      Data = this.ActivePrivateLayersLibrary[0].LayerLibrary.filter((el) => {
        if (((el.DataSetName.toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1) || (el.Description != null && el.Description.toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1))) {
          return el;
        }
      });
      this.ActivePrivateLayersLibrary[0].LayerLibrary.length = 0;
      Array.prototype.push.apply(this.ActivePrivateLayersLibrary[0].LayerLibrary, Data);
      this.ActivePrivateLayersLibrary[0].TotalCount = Data.length;
      this.ActivePrivateLayersLibrary[0].DisplayingCount = Data.length;
    }
    else if (SearchData == "" && this.selectedfileType.length > 0) {
      let selectedfileExtentions = [];
      let result = this.selectedfileType.map(a => a.item_extention);
      for (let i = 0; i < result.length; i++) {
        if (result[i].indexOf(',') > -1) {
          let extentions = result[i].split(',');
          for (let j = 0; j < extentions.length; j++) {
            selectedfileExtentions.push(extentions[j].toLocaleString());
          }
        }
        else {
          selectedfileExtentions.push(result[i].toLocaleString());
        }
      }
      Data = this.ActivePrivateLayersLibrary[0].LayerLibrary.filter((el) => {
        if (selectedfileExtentions.indexOf(el.UploadFileType.toLocaleLowerCase()) > -1) {
          return el;
        }
      });
      this.ActivePrivateLayersLibrary[0].LayerLibrary.length = 0;
      Array.prototype.push.apply(this.ActivePrivateLayersLibrary[0].LayerLibrary, Data);
      this.ActivePrivateLayersLibrary[0].TotalCount = Data.length;
      this.ActivePrivateLayersLibrary[0].DisplayingCount = Data.length;
    }
    else if (SearchData && this.selectedfileType.length > 0) {
      let selectedfileExtentions = [];
      let result = this.selectedfileType.map(a => a.item_extention);
      for (let i = 0; i < result.length; i++) {
        if (result[i].indexOf(',') > -1) {
          let extentions = result[i].split(',');
          for (let j = 0; j < extentions.length; j++) {
            selectedfileExtentions.push(extentions[j].toLocaleString());
          }
        }
        else {
          selectedfileExtentions.push(result[i].toLocaleString());
        }
      }
      Data = this.ActivePrivateLayersLibrary[0].LayerLibrary.filter((el) => {
        if (((el.DataSetName.toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1) || (el.Description != null && el.Description.toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1)) && (selectedfileExtentions.indexOf(el.UploadFileType.toLocaleLowerCase()) > -1)) {
          return el;
        }
      });
      this.ActivePrivateLayersLibrary[0].LayerLibrary.length = 0;
      Array.prototype.push.apply(this.ActivePrivateLayersLibrary[0].LayerLibrary, Data);
      this.ActivePrivateLayersLibrary[0].TotalCount = Data.length;
      this.ActivePrivateLayersLibrary[0].DisplayingCount = Data.length;
    }
    else {
      this.ResetDataLayer();
    }
    //let _JsonAllActiveMapLayes = JSON.stringify(this.ActivePrivateLayersLibrary);
    //if(localStorage.getItem("test")!=null)
    //localStorage.setItem("AllActivePrivateLayersLibrary", _JsonAllActiveMapLayes);

  }

  onItemSelectChange(item: any) {
    this.SearchData();
  }

  ResetDataLayer() {
    this.LayerLoader = true;
    this.MydataSearchtext = '';
    this.selectedfileType = [];
    let categoryId = this.ActivePrivateLayersLibrary[0].CategoryID;
    if (localStorage.getItem("AllActivePrivateLayersLibrary")) {
      let AllActivePrivateLayers = JSON.parse(localStorage.getItem("AllActivePrivateLayersLibrary"));
      if (AllActivePrivateLayers) {
        for (let a of AllActivePrivateLayers) {
          if (a.CategoryID == categoryId) {
            if (this.MapServiceService.MyDataLibrary.getValue()) {
              for (let e of this.MapServiceService.MyDataLibrary.getValue()) {
                if (e.CategoryID == categoryId) {
                  e.LayerLibrary.length = 0;
                  Array.prototype.push.apply(e.LayerLibrary, a.LayerLibrary);
                }
              }
              this.MapServiceService.MyDataLibrary.getValue()[0].TotalCount = a.TotalCount;
              this.MapServiceService.MyDataLibrary.getValue()[0].DisplayingCount = a.DisplayingCount;
            }
          }
        }
      }
    }
    this.LayerLoader = false;
    //this.DisplayLayres(categoryId);
  }

  OpenEditMyDataModal(LayerId) {
    let ids = [LayerId];
    let privateLayerData: any;
    if (this.MapServiceService.MyDataLayerLibrary.getValue()) {
      let myDataLibraryList = this.MapServiceService.MyDataLayerLibrary.getValue()[0].LayerLibrary;
      let filteredData = myDataLibraryList.filter(item => ids.indexOf(item.DataSetID) > -1);
      if (filteredData.length == 1) {
        privateLayerData = filteredData[0];
      }
    }
    const editModalRef = this.modalService.open(EditMyDataComponent, { size: 'lg', backdropClass: 'adddata-backdrop', backdrop: 'static', centered: true, windowClass: 'editMydata-modal' });
    editModalRef.componentInstance.PrivateLayerData = privateLayerData;
  }
}
