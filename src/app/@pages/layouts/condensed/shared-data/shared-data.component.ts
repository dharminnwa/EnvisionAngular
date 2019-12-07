import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';
import { HttpRequestService } from '../../../../services/all-http-request.service';
import { MapServiceService } from '../../../../services/map-service.service';
import { AuthenticationService } from '../../../../services/auth.service';
import { CondensedComponent } from '../../condensed/condensed.component'
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-shared-data',
  templateUrl: './shared-data.component.html',
  styleUrls: ['./shared-data.component.scss']
})
export class SharedDataComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
    public httpRequestService: HttpRequestService,
    public mapServiceService: MapServiceService,
    public authServices: AuthenticationService,
    private CondensedComponent: CondensedComponent) { }
  ShowLoader: boolean = false;
  fileType = [];
  selectedfileType = [];
  dropdownSettings = {};
  @Input() hideSomePart = true;
  sharedDataSearchtext = '';
  sharedDataList = [];
  displayingCount = 0;
  ImageURLPath = environment.ImagespreviewPath;
  ngOnInit() {
    this.FillFileTypes();
    this.GetSharedData();
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

  GetSharedData() {
    let userSearch = this.mapServiceService._SharedLayersUserSearch.getValue();
    if (userSearch == null) {
      let userSearch = {
        searchText: '',
        searchFileType: []
      }
      this.mapServiceService.setSharedLayersUserSearch(userSearch);
      this.sharedDataSearchtext = userSearch.searchText;
      this.selectedfileType = userSearch.searchFileType;
    }
    else {
      if (userSearch.searchText)
        this.sharedDataSearchtext = userSearch.searchText;
      if (userSearch.searchFileType.length > 0)
        this.selectedfileType = userSearch.searchFileType;
    }
    var existingSharedDataList = this.mapServiceService._SharedData.getValue();
    if (existingSharedDataList == null) {
      let userId = this.authServices.getLoggedinUserId();
      this.ShowLoader = true;
      this.httpRequestService._NodeGetSharedData(userId).subscribe(data => {
        this.ShowLoader = false;
        if (data._Issuccess) {
          var sharedData = data.SharedData;
          if (sharedData.length > 0) {
            let list = sharedData.map((el) => {
              var o = Object.assign({}, el);
              o.Addtomap = 'Add to map';
              o.isVisible = true;
              return o;
            });
            this.mapServiceService.setSharedData(list);
            this.sharedDataList = this.mapServiceService._SharedData.getValue();
            let displayingLength = this.sharedDataList.map(x => x.isVisible);
            this.displayingCount = displayingLength.reduce(function (n, val) {
              return n + (val === true);
            }, 0);
          }
        }
      },
        error => {
          console.log(error);
          this.ShowLoader = false;
        });
    }
    else {
      this.sharedDataList = existingSharedDataList;
      let displayingLength = this.sharedDataList.map(x => x.isVisible);
      this.displayingCount = displayingLength.reduce(function (n, val) {
        return n + (val === true);
      }, 0);
    }
  }

  ResetFilter() {
    this.selectedfileType = [];
    if (this.mapServiceService._SharedLayersUserSearch.getValue()) {
      let userSearch = this.mapServiceService._SharedLayersUserSearch.getValue();
      userSearch.searchFileType = [];
    }
    this.ResetSharedData();
  }

  SearchSharedData() {
    let searchData = this.sharedDataSearchtext ? this.sharedDataSearchtext.trim() : '';
    if (this.mapServiceService._SharedLayersUserSearch.getValue()) {
      let userSearch = this.mapServiceService._SharedLayersUserSearch.getValue();
      userSearch.searchText = searchData ? searchData : '';
      userSearch.searchFileType = this.selectedfileType;
    }
    if (searchData && this.selectedfileType.length == 0) {
      this.sharedDataList.map((el) => {
        if (el && el.DataSetName && el.DataSetName != '') {
          if (((el.DataSetName.toLowerCase().indexOf(searchData.toLowerCase()) > -1)
            || (el.Description && el.Description.toLowerCase().indexOf(searchData.toLowerCase()) > -1))) {
            el.isVisible = true;
          }
          else
            el.isVisible = false;
        }
      });
      let displayingLength = this.sharedDataList.map(x => x.isVisible);
      this.displayingCount = displayingLength.reduce(function (n, val) {
        return n + (val === true);
      }, 0);
    }
    else if (searchData == "" && this.selectedfileType.length > 0) {
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
      this.sharedDataList.map((el) => {
        if (selectedfileExtentions.indexOf(el.UploadFileType.toLocaleLowerCase()) > -1) {
          el.isVisible = true;
        }
        else
          el.isVisible = false;
      });
      let displayingLength = this.sharedDataList.map(x => x.isVisible);
      this.displayingCount = displayingLength.reduce(function (n, val) {
        return n + (val === true);
      }, 0);
    }
    else if (searchData && this.selectedfileType.length > 0) {
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
      this.sharedDataList.map((el) => {
        if (((el.DataSetName.toLocaleLowerCase().indexOf(searchData.toLocaleLowerCase()) > -1) || (el.Description && el.Description.toLocaleLowerCase().indexOf(searchData.toLocaleLowerCase()) > -1)) && (selectedfileExtentions.indexOf(el.UploadFileType.toLocaleLowerCase()) > -1)) {
          el.isVisible = true;
        }
        else
          el.isVisible = false;
      });
      let displayingLength = this.sharedDataList.map(x => x.isVisible);
      this.displayingCount = displayingLength.reduce(function (n, val) {
        return n + (val === true);
      }, 0);
    }
    else {
      this.ResetSharedData();
    }
  }

  ResetSharedData() {
    this.sharedDataList.map((el) => {
      if (!el.isVisible)
        el.isVisible = true;
    });
    let displayingLength = this.sharedDataList.map(x => x.isVisible);
    this.displayingCount = displayingLength.reduce(function (n, val) {
      return n + (val === true);
    }, 0);
    if (this.mapServiceService._SharedLayersUserSearch.getValue()) {
      let userSearch = this.mapServiceService._SharedLayersUserSearch.getValue();
      userSearch.searchText = '';
    }
    this.sharedDataSearchtext = '';
  }

  onItemSelectChange(item: any) {
    this.SearchSharedData();
  }

  ClearSearchText() {
    if (this.mapServiceService._SharedLayersUserSearch.getValue()) {
      let userSearch = this.mapServiceService._SharedLayersUserSearch.getValue();
      userSearch.searchText = '';
    }
    this.sharedDataSearchtext = '';
    this.SearchSharedData();
  }

  AddtomapClick(LayerId) {
    if (this.mapServiceService._SharedData.getValue()) {
      for (let layer of this.mapServiceService._SharedData.getValue()) {
        if (layer.DataSetID == LayerId) {
          let treeUI = this.mapServiceService._SharedTreeUI.getValue();
          if (layer.Addtomap == 'Add to map') {
            layer.Addtomap = 'Remove from map';
            this.CondensedComponent.GetSharedLayerTreeData(LayerId, [], [], 0, layer.UserId);
          } else {
            layer.Addtomap = 'Add to map';
            let layerRemoveButtonID = layer.DataSetID + 'RemoveTreeData';
            let Removeexistnode = treeUI.treeModel.getNodeById(layer.DataSetID);
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
