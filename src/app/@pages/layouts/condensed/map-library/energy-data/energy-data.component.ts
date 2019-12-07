import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Http } from '@angular/http';
import { MapLayerService } from '../../../../../services/MapLayer-service';
import { MapServiceService } from '../../../../../services/map-service.service';
import { CondensedComponent } from '../../..';
import { HttpRequestService } from '../../../../../services/all-http-request.service';
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'app-energy-data',
  templateUrl: './energy-data.component.html',
  styleUrls: ['./energy-data.component.scss']
})
export class EnergyDataComponent implements OnInit {
  CondensedComponent: CondensedComponent
  constructor(
    public cookieService: CookieService,
    // public http: Http,
    public AuthServices: AuthenticationService,
    // public MapLayerService: MapLayerService,
    // public condensedService: condensedService,
    public MapServiceService: MapServiceService,
    private httpRequest: HttpRequestService
  ) { }

  public nodes;
  totalCount = 0;
  DisplayingCount = 0;
  NormalViewContent = true;
  ReducedViewContent = false;
  ImageListviewContent = false;
  LayerLoader = false;
  LoginId = '';
  Searchtext = '';
  showDefaultCategoryId = 0;
  ActiveMapLayersLibrary: any = [];
  ImageURLPath: string = environment.ImagespreviewPath;
  ngOnInit() {

    this.setMapserachLayer();
  }

  setMapserachLayer() {
    this.LayerLoader = true;
    this.LoginId = this.AuthServices.getUserId();
    if (!this.MapServiceService.EnergyLayerLibrary.getValue()) {
      //this.MapServiceService.GetEnergyLayerLibrary(this.LoginId, "Energy Layer Group", 0,777,0).subscribe(data => {
      this.httpRequest._NodeGetEnergyLayerLibrary(this.LoginId, "Energy Layer Group", 0, 777, 0).subscribe(data => {
        let Data: any = data;
        let LayersLibrary = Data;
        let res = LayersLibrary;
        if (res.errormsg == "") {
          res["IsLoaded"] = true;
          let layer = res.LayerLibrary[0].map((el) => {
            var o = Object.assign({}, el);
            o.ViewData = 'View Data';
            o.Addtomap = 'Add to map';
            return o;
          });
          let DefaultLayer = [
            {
              CategoryID: 0,
              LayerLibrary: layer,
            }
          ];
          this.MapServiceService.setMapSearchEnergyLayerLibrary(DefaultLayer);
          this.DisplayLayres(this.showDefaultCategoryId);
        }
        else {
          console.log(res.errorms);
        }
        this.LayerLoader = false;
      }, error => {
        console.log(error);
        this.LayerLoader = false;
      })
    }
    else {
      this.DisplayLayres(this.showDefaultCategoryId);
    }

  }
  DisplayLayres(categoryId) {
    let isActive = false;
    let LayerList;
    if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
      for (let a of this.MapServiceService.EnergyLayerLibrary.getValue()) {
        if (a.CategoryID == categoryId) {
          isActive = true;
          LayerList = a;
        }
      }
    }
    if (isActive == true) {
      //this.MapServiceService.setActiveLayerslist(DefaultLayer);
      this.ActiveMapLayersLibrary.length = 0;
      this.ActiveMapLayersLibrary.push(LayerList);
      this.totalCount = this.ActiveMapLayersLibrary[0].LayerLibrary.length;
      this.DisplayingCount = this.totalCount;
    }
    this.LayerLoader = false;
  }
  showNormalView() {
    this.LayerLoader = true;
    this.ReducedViewContent = false;
    this.ImageListviewContent = false;
    this.NormalViewContent = true;
    this.LayerLoader = false;
  }

  SearchData() {
    let SearchData = this.Searchtext.trim();
    localStorage.removeItem("AllActiveMapLayes_1");
    if (SearchData) {
      let Data = this.ActiveMapLayersLibrary[0].LayerLibrary.filter((el) => {
        if (((el.LayerName.toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1) || ((el.DisplayName).toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1) ||
          (!el.Tags && el.Tags.toLocaleLowerCase().indexOf(SearchData.toLocaleLowerCase()) > -1))) {
          return el;
        }
      });
      let _JsonAllActiveMapLayes = JSON.stringify(this.ActiveMapLayersLibrary);
      localStorage.setItem("AllActiveMapLayes_1", _JsonAllActiveMapLayes);
      this.ActiveMapLayersLibrary[0].LayerLibrary.length = 0;
      Array.prototype.push.apply(this.ActiveMapLayersLibrary[0].LayerLibrary, Data);
      this.DisplayingCount = this.ActiveMapLayersLibrary[0].LayerLibrary.length;
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
    if (localStorage.getItem("AllActiveMapLayes_1")) {
      let AllActiveMapLayes = JSON.parse(localStorage.getItem("AllActiveMapLayes_1"));
      if (AllActiveMapLayes) {
        for (let a of AllActiveMapLayes) {
          if (a.CategoryID == categoryId) {
            if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
              for (let e of this.MapServiceService.EnergyLayerLibrary.getValue()) {
                if (e.CategoryID == categoryId) {
                  e.LayerLibrary.length = 0;
                  Array.prototype.push.apply(e.LayerLibrary, a.LayerLibrary);
                }
              }
            }
          }
        }
      }
    }
    this.DisplayLayres(categoryId);
  }

  AddtomapClick(LayerId, CategoryId) {
    if (this.MapServiceService.EnergyLayerLibrary.getValue()) {
      for (let a of this.MapServiceService.EnergyLayerLibrary.getValue()) {
        if (a.CategoryID == CategoryId) {
          for (let e of a.LayerLibrary) {
            if (e.EnergyLayerID == LayerId) {
              if (e.Addtomap == 'Add to map') {
                e.Addtomap = 'Remove from map';
                this.CondensedComponent.GetTreeData(LayerId);
                setTimeout(() => {
                  let Treeecheckboxlement: HTMLElement = document.getElementById(e.EnergyLayerID + 'LoadlayerinTreeData') as HTMLElement;
                  if (Treeecheckboxlement == null) {
                    setTimeout(() => { Treeecheckboxlement.click(); }, 1000);
                  }
                  else
                    Treeecheckboxlement.click();
                }, 2500);
              } else {
                e.Addtomap = 'Add to map';
                let EnergyLayerID = e.EnergyLayerID + 'RemoveTreeData';
                setTimeout(() => {
                  let element: HTMLElement = document.getElementById(EnergyLayerID) as HTMLElement;
                  element.click();
                }, 1000);
              }
            }

          }

        }
      }
    }
  }
}
