import { Component, OnInit, Injector } from '@angular/core';
import { AuthenticationService } from '../../services/auth.service';
import { MapServiceService } from '../../services/map-service.service';
import { HttpRequestService } from '../../services/all-http-request.service';
import { tempLayerDataProp } from '../../models/layer-data-prop';
import { UtilityService } from '../../services/Utility.service';
import { environment } from '../../../environments/environment';
import { CondensedComponent } from '../../@pages/layouts';
import { Subscription } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-well-lookup',
  templateUrl: './well-lookup.component.html',
  styleUrls: ['./well-lookup.component.scss']
})
export class WellLookupComponent implements OnInit {
  CondensedComponent: CondensedComponent;
  constructor(
    private AuthServices: AuthenticationService,
    private MapServiceService: MapServiceService,
    private httpService: HttpRequestService,
    private utilityService: UtilityService,
    private injector: Injector
  ) { setTimeout(() => this.CondensedComponent = injector.get(CondensedComponent)); }
  isShowCounties: boolean;
  isShowType: boolean;
  isShowStatus: boolean;
  isDisabledCounties: boolean;
  isDisabledType: boolean;
  isDisabledStatus: boolean;
  ImageURLPath: string = environment.ImagespreviewPath;
  LayerLoader: boolean = false;
  States = [];
  StateModelList: any = [];
  Counties = [];
  WellTypes = [];
  WellStatuses = [];
  searchWellsLookup: string = '';

  selectedState = [];
  selectedCountries = [];
  selectedWellTypes = [];
  selectedWellStatuses = [];

  dropdownSettingsSingle = {};
  dropdownSettingsMulty = {};

  WellLookupData = {
    //DataSetID: "200006",
    DataSetID: "964",
    PreviewImage: "http://mapsearch360.com/images/datasetimage.png",
    ApiFieldName: "API",
    OperatorFieldName: "Operator",
    WellNameFieldName: "WellName",
    LeaseNameFieldName: "LeaseName",
    LeaseFieldName: "Lease",
    WellTypeFieldName: "WellType",
    StatusFieldName: "Status",
    WellStatusFieldName: "WellStatus",
    CountyFieldName: "County",
    isEnergyLayer: true,
    EnergyLayerDisplayName: "Wells search results",
    EnergyLayerID: "964"
  }
  _permissionsSubscription: Subscription;

  ngOnInit() {
    this.dropdownSettingsSingle = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      maxHeight: 120,
    };
    this.dropdownSettingsMulty = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      maxHeight: 120,
      itemsShowLimit: 2,
      disabled: true,
      enableCheckAll: false,
    };

    this.StateModelList = this.MapServiceService.wellStateData.getValue();
    if (this.StateModelList != null && this.StateModelList.length > 0) {
      for (let i = 0; i < this.StateModelList.length; i++) {
        this.States.push({ 'item_id': this.StateModelList[i].StateID, 'item_text': this.StateModelList[i].StateName });
      }
    }
    else {
      if (this.AuthServices.ShowWellLookupWidgetUIBasedOnRole())
        this.GetWellStateData();
    }
    this._permissionsSubscription = this.MapServiceService.sitePermissions.subscribe(data => {
      if (data)
        this.ShowWidgetBasedOnRole();
    });
    setTimeout(() => {
      this.ClearFilters();
    }, 1000);
  }

  ngOnDestroy() {
    if (this._permissionsSubscription)
      this._permissionsSubscription.unsubscribe();
  }

  onItemSelect(item) {

  }

  onSelectAll(items) {

  }

  GetWellStateData() {
    this.LayerLoader = true;
    this.httpService._NodeGetWellStates().subscribe(data => {      
      if (data._Issuccess) {
        var jsonData = data.WellsstateData;
        this.States = [];
        this.StateModelList = jsonData;
        for (let i = 0; i < jsonData.length; i++) {
          this.States.push({ 'item_id': jsonData[i].StateID, 'item_text': jsonData[i].StateProvince });
        }
        this.MapServiceService.setWellStates(this.StateModelList)
      }
      this.LayerLoader = false;
    },
      error => {
        console.log(error);
        this.LayerLoader = false;
      });
  }

  onSelectState(item: any) {
    let StateModel = this.StateModelList.filter(m => m.StateID === item.item_id);
    if (StateModel) {
      let cts = StateModel[0].Counties;
      let wTypes = StateModel[0].WellType;
      let wStatuses = StateModel[0].WellStatus;

      this.Counties = [];
      this.WellTypes = [];
      this.WellStatuses = [];

      if (cts != null && cts.length > 0) {
        cts.sort();
        for (let i = 0; i < cts.length; i++) {
          if (cts[i]) {
            this.Counties.push({ 'item_id': i, 'item_text': cts[i] });
          }
        }
        this.isShowCounties = true;
        this.isDisabledCounties = false;
        // (<HTMLInputElement>document.getElementById("ddWellCounty")).classList.remove('hide', 'disabled');
      }
      else {
        this.isShowCounties = false;
        // (<HTMLInputElement>document.getElementById("ddWellCounty")).classList.add('hide');
      }

      if (wTypes != null && wTypes.length > 0) {
        wTypes.sort();
        for (let i = 0; i < wTypes.length; i++) {
          if (wTypes[i]) {
            this.WellTypes.push({ 'item_id': i, 'item_text': wTypes[i] });
          }
        }
        this.isShowType = true;
        this.isDisabledType = false;
        // (<HTMLInputElement>document.getElementById("ddWellType")).classList.remove('hide', 'disabled');
      }
      else {
        this.isShowType = false;
        // (<HTMLInputElement>document.getElementById("ddWellType")).classList.add('hide');
      }

      if (wStatuses != null && wStatuses.length > 0) {
        wStatuses.sort();
        for (let i = 0; i < wStatuses.length; i++) {
          if (wStatuses[i]) {
            this.WellStatuses.push({ 'item_id': i, 'item_text': wStatuses[i] });
          }
        }
        this.isShowStatus = true;
        this.isDisabledStatus = false;
        // (<HTMLInputElement>document.getElementById("ddWellStatus")).classList.remove('hide', 'disabled')
      }
      else {
        this.isShowStatus = false;
        // (<HTMLInputElement>document.getElementById("ddWellStatus")).classList.add('hide');
      }
    }
  }

  ClearFilters() {
    this.selectedState = [];
    this.Counties = [];
    this.WellTypes = [];
    this.WellStatuses = [];

    this.selectedState = [];
    this.selectedCountries = [];
    this.selectedWellTypes = [];
    this.selectedWellStatuses = [];
    this.searchWellsLookup = '';

    this.isDisabledCounties = true;
    this.isDisabledStatus = true;
    this.isDisabledType = true;
    this.isShowCounties = true;
    this.isShowStatus = true;
    this.isShowType = true;
    // (<HTMLInputElement>document.getElementById("ddWellType")).classList.add('disabled');
    // (<HTMLInputElement>document.getElementById("ddWellStatus")).classList.add('disabled');
    // (<HTMLInputElement>document.getElementById("ddWellCounty")).classList.add('disabled');
    // (<HTMLInputElement>document.getElementById("ddWellType")).classList.remove('hide');
    // (<HTMLInputElement>document.getElementById("ddWellStatus")).classList.remove('hide');
    // (<HTMLInputElement>document.getElementById("ddWellCounty")).classList.remove('hide');
  }

  ShowWidgetBasedOnRole() {
    if (!this.AuthServices.ShowWellLookupWidgetUIBasedOnRole()) {
      $("#OilAndGasTabHeader").parent().parent().addClass("disabled disable-tab");
      $("#wellLookupCard .card-header").addClass("disable-cardHeader");
      $("#wellLookupCard .card-body").addClass("disable-cardBody");
      $("#wellLookupCard .card-body .tab-content-wrapper").addClass("disable-cardBody");
      $("#wellLookupCard").addClass("disabled");
    }

  }

  SearchAssets() {
    if (this.selectedState && this.selectedState.length > 0) {
      let state = this.selectedState[0];
      let StateModel = this.StateModelList.find(x => x.StateID == state.item_id);
      if (StateModel) {
        let tempDataObj = this.getTempObject(StateModel);
        let filter = this.getFilter(StateModel);
        tempDataObj.FilterValue = filter;
        this.SetTree(this.WellLookupData, tempDataObj);
        let tree = [];
        tree.push(this.getsingaleTree(tempDataObj));
        if (tree.length > 0) {
          this.CondensedComponent.Redirect('maps');
          this.CondensedComponent.SetTemporaryTreeNodeForWidget(tree);
        }
      }
    }
  }

  getFilter(StateProps) {
    let filterValue = '';
    let PropertiesArr = StateProps.DetailPanelPropertiesMain.split(',');
    if (this.searchWellsLookup && StateProps && StateProps.DetailPanelPropertiesMain) {
      if (PropertiesArr && PropertiesArr.length > 0) {
        PropertiesArr.forEach(x => {
          if (x.toLowerCase() == 'API'.toLowerCase())
            filterValue += this.WellLookupData.ApiFieldName + '#LIKE#' + this.searchWellsLookup + '#OR#';
          if (x.toLowerCase() == 'Operator'.toLowerCase())
            filterValue += this.WellLookupData.OperatorFieldName + '#LIKE#' + this.searchWellsLookup + '#OR#';
          if (x.toLowerCase() == 'Lease'.toLowerCase())
            filterValue += this.WellLookupData.LeaseFieldName + '#LIKE#' + this.searchWellsLookup + '#OR#';
          if (x.toLowerCase() == 'LeaseName'.toLowerCase())
            filterValue += this.WellLookupData.LeaseNameFieldName + '#LIKE#' + this.searchWellsLookup + '#OR#';
          if (x.toLowerCase() == 'WellName'.toLowerCase())
            filterValue += this.WellLookupData.WellNameFieldName + '#LIKE#' + this.searchWellsLookup + '#OR#';
        });
        if (filterValue)
          filterValue += ';'
      }
      // filterValue = this.WellLookupData.ApiFieldName + '#LIKE#' + this.searchWellsLookup + '#OR#' + this.WellLookupData.OperatorFieldName + '#LIKE#' + this.searchWellsLookup + '#OR#' + this.WellLookupData.LeaseNameFieldName + '#LIKE#' + this.searchWellsLookup + ';';
    }
    filterValue += this.SetEqualOrFilterFromArray(this.WellLookupData.WellTypeFieldName, this.selectedWellTypes, '#LIKE#');
    filterValue += ';';
    let statusFieldName = PropertiesArr.find(x => x == 'Status' || x == 'WellStatus');
    if (statusFieldName == 'WellStatus') {
      filterValue += this.SetEqualOrFilterFromArray(this.WellLookupData.WellStatusFieldName, this.selectedWellStatuses, '#LIKE#');
    } else if (statusFieldName == 'Status') {
      filterValue += this.SetEqualOrFilterFromArray(this.WellLookupData.StatusFieldName, this.selectedWellStatuses, '#LIKE#');
    }
    filterValue += ';';
    filterValue += this.SetEqualOrFilterFromArray(this.WellLookupData.CountyFieldName, this.selectedCountries, '#LIKE#');
    return filterValue;
  }

  SetEqualOrFilterFromArray(fieldName, List, equalVal = '#EQUAL#') {
    let filterVal = '';
    if (List && List.length > 0) {
      for (let item of List) {
        filterVal += fieldName + equalVal + item.item_text + "#OR#";
      }
    }
    return filterVal;
  }

  getsingaleTree(tempobj) {
    let Tree = {
      Id: tempobj.DataSetID,
      Name: tempobj.DataSetName,
      activeCount: 0,
      IconUrl: environment.GetLayerIconURL + "/icongenerate/get/?Id=" + tempobj.DataSetID + "&URLType=CustomStyleIcon&FillColor=" + tempobj.FillColor + "&IconType=" + tempobj.IconType + "&StrokeColor=" + tempobj.StrokeColor + "&SizePercent=" + tempobj.SizePercent + "&StrokeThicknessPercent=" + tempobj.StrokeThicknessPercent + "&Opacity=" + tempobj.Opacity,
      IsChecked: true,
    }
    return Tree
  }

  SetTree(temp, tempLayerObjPropObj) {
    this.RemovelayerFromTree(temp.DataSetID);
    this.AddLayeronTempVariable(tempLayerObjPropObj);
  }

  RemovelayerFromTree(DatasetId) {
    let tempLayerTreeData = this.MapServiceService.TemporaryTreeNode.getValue();
    let facilitiesData = tempLayerTreeData.find(x => x.Id == DatasetId);
    if (facilitiesData)
      this.utilityService.ActiveLayerData(DatasetId, 'RemovetemporaryTreeData');
  }

  AddLayeronTempVariable(tempobj) {
    if (this.MapServiceService.LayerIndex.getValue()) {
      let currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
      tempobj["Layerindexval"] = currentIndexVal;
      this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
    }
    this.MapServiceService.temporaryLayer.push(tempobj);
  }


  getTempObject(State) {
    let tempLayerObjPropObj = new tempLayerDataProp();
    tempLayerObjPropObj.RepresentationType = "Point";
    tempLayerObjPropObj.IconType = "Circle";
    tempLayerObjPropObj.SizePercent = 50;
    tempLayerObjPropObj.StrokeThicknessPercent = 5;
    tempLayerObjPropObj.Opacity = 1;
    tempLayerObjPropObj.DataSetID = this.WellLookupData.DataSetID;
    tempLayerObjPropObj.EnergyLayerID = tempLayerObjPropObj.DataSetID;
    tempLayerObjPropObj.TableName = State.WMSLayer;
    tempLayerObjPropObj.DetailPanelPropertiesMain = State.DetailPanelPropertiesMain;
    tempLayerObjPropObj.DBFProperties = State.DBFProperties;
    tempLayerObjPropObj.DetailPanelProperties = State.DetailPanelProperties;
    tempLayerObjPropObj.StrokeColor = "FF" + this.utilityService.getRandomColor();
    tempLayerObjPropObj.FillColor = tempLayerObjPropObj.StrokeColor;
    tempLayerObjPropObj.UploadedBy = this.AuthServices.getLoggedinUserId();

    let TreeName = 'Wells ';
    if (this.searchWellsLookup) {
      TreeName += "- " + this.searchWellsLookup + ' ';
    } else {
      TreeName += "- " + State.StateProvince + ' ';
    }
    tempLayerObjPropObj.DataSetName = TreeName;
    tempLayerObjPropObj.Description = TreeName;
    tempLayerObjPropObj.Tags = TreeName;

    tempLayerObjPropObj.TreeStatus = "Individual";
    if (tempLayerObjPropObj.DBFProperties != 'undefined' && tempLayerObjPropObj.DBFProperties == '' && tempLayerObjPropObj.DetailPanelProperties != 'undefined' && tempLayerObjPropObj.DetailPanelProperties != '') {
      let DetailPanelPro = tempLayerObjPropObj.DetailPanelProperties.split(',');
      if (DetailPanelPro.length > 0) {
        for (let prop of DetailPanelPro) {
          let p = prop.split("=");
          tempLayerObjPropObj.DBFProperties += p[1] + ',';
        }
        tempLayerObjPropObj.DBFProperties = tempLayerObjPropObj.DBFProperties.substring(0, tempLayerObjPropObj.DBFProperties.length - 1);;
      }
    }
    tempLayerObjPropObj.isEnergyLayer = this.WellLookupData.isEnergyLayer;
    tempLayerObjPropObj["DisplayName"] = this.WellLookupData.EnergyLayerDisplayName;
    tempLayerObjPropObj.EnergyLayerID = this.WellLookupData.EnergyLayerID;
    return tempLayerObjPropObj;
  }
}
