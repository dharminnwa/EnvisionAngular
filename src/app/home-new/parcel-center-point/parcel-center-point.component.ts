import { Component, OnInit, Injector } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
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
  selector: 'app-parcel-center-point',
  templateUrl: './parcel-center-point.component.html',
  styleUrls: ['./parcel-center-point.component.scss']
})
export class ParcelCenterPointComponent implements OnInit {
  constructor(
    private AuthServices: AuthenticationService,
    private MapServiceService: MapServiceService,
    private httpService: HttpRequestService,
    private utilityService: UtilityService,
    private injector: Injector
  ) { setTimeout(() => this.CondensedComponent = injector.get(CondensedComponent)); }
  ImageURLPath: string = environment.ImagespreviewPath;
  CondensedComponent: CondensedComponent
  LayerLoader: boolean = false;
  StateModelList: any = [];

  States = [];
  Counties = [];
  selectedState = [];
  selectedCountries = [];
  dropdownSettingsSingle = {};
  dropdownSettingsMulty = {};
  Treedatalist = [];
  txtParcelfilter: string;
  ParcelCenterPointData = {
    //DataSetID: "200005",
    DataSetID: "10937",
    PreviewImage: "http://mapsearch360.com/images/datasetimage.png",
    LayerName: "",
    TableName: "",
    // DBFProperties: "PARCELAPN,FIPS,TAXAPN,STHSNUM,STDIR,STSTNAME,STSUFFIX,STQUADRANT,STUNITPRFX,STUNITNUM,STCITY,STSTATE,STZIP,STZIP4,GEOSOURCE,ADDRSCORE,OWN1,OWN2,MHSNUMB,MPREDIR,MSTNAME,MMODE,MQUADRNT,MUNITPRFX,MUNITNUM,MCITY,MSTATE,MZIP,MZIP4,LEGAL1,USECDSTDSC,USECDSTD,MQUADRANT,STNAME,CUSECDDSC,CUSECDSTD,LOTSZARNUM,LOTSZARUNT,ORGLOTSZAR,TAXSOURCE,TAXAMOUNT,TAXYEAR,ASSESSDATE,LATESTSALE,ASSESSAMT,LOTSZAR",    
    // DetailPanelProperties: "APN=TAXAPN,Owner=OWN1,Owner2=OWN2,Site Num=STHSNUM,Site Dir=STDIR,Site Name=STSTNAME,Site Unit=STUNITNUM,City=STCITY,State=STSTATE,Zip=STZIP,Legal=LEGAL1,Use Code=USECDSTD,Code Description=USECDSTDSC,MQUADRANT=MQUADRANT,CUSECDDSC=CUSECDDSC,CUSECDSTD=CUSECDSTD,LOTSZARNUM=LOTSZARNUM,LOTSZARUNT=LOTSZARUNT,ORGLOTSZAR=ORGLOTSZAR,TAXSOURCE=TAXSOURCE,TAXAMOUNT=TAXAMOUNT,TAXYEAR=TAXYEAR,=ASSESSDATEASSESSDATE,LATESTSALE=LATESTSALE,ASSESSAMT=ASSESSAMT",
    DBFProperties: "PARCELAPN,FIPS,TAXAPN,STHSNUM,STDIR,STSTNAME,STSUFFIX,STQUADRANT,STUNITPRFX,STUNITNUM,STCITY,STSTATE,STZIP,STZIP4,GEOSOURCE,ADDRSCORE,OWN1,OWN2,MHSNUMB,MPREDIR,MSTNAME,MMODE,MQUADRNT,MUNITPRFX,MUNITNUM,MCITY,MSTATE,MZIP,MZIP4,LEGAL1,USECDSTDSC,USECDSTD,MQUADRANT,STNAME,CUSECDDSC,CUSECDSTD,LOTSZARNUM,LOTSZARUNT,ORGLOTSZAR,TAXSOURCE,TAXAMOUNT,TAXYEAR,ASSESSDATE,LATESTSALE,ASSESSAMT,LOTSZAR",
    DetailPanelProperties: "APN=TAXAPN,Owner=OWN1,Owner2=OWN2,Street Num=STHSNUM,Street Dir=STDIR,Street Name=STSTNAME,Street Unit=STUNITNUM,City=STCITY,State=STSTATE,Zip=STZIP,Legal=LEGAL1,Use Code=USECDSTD,Code Description=USECDSTDSC,Lot Size Area=LOTSZARNUM,Lot Size Area Unit=LOTSZARUNT,Tax Source=TAXSOURCE,Tax Amount=TAXAMOUNT,Tax Year=TAXYEAR,Assessment Year=ASSESSDATE,Latest Sale=LATESTSALE,Assessment Amount=ASSESSAMT",
    ZoomMin: "15",
    ZoomMax: "20",
    FilterValue: "",
    isEnergyLayer: true,
    EnergyLayerDisplayName: "Parcel search results",
    EnergyLayerID: "10937"
    // ZoomMin: null,
    // ZoomMax: null

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

    this.StateModelList = this.MapServiceService.parcelStateData.getValue();
    if (this.StateModelList != null && this.StateModelList.length > 0) {
      for (let i = 0; i < this.StateModelList.length; i++) {
        this.States.push({ 'item_id': this.StateModelList[i].ID, 'item_text': this.StateModelList[i].StateName, 'counties': this.StateModelList[i].counties });
      }
    }
    else {
      if (this.AuthServices.ShowParcelLookupWidgetUIBasedOnRole())
        this.GetParcelStateData();
    }

    this._permissionsSubscription = this.MapServiceService.sitePermissions.subscribe(data => {
      if (data)
        this.ShowWidgetBasedOnRole();
    });

    setTimeout(() => {
      this.DisableButtons();
    }, 1000);
  }

  ngOnDestroy() {
    if (this._permissionsSubscription)
      this._permissionsSubscription.unsubscribe();
  }

  GetParcelStateData() {
    this.LayerLoader = true;
    let UserId = this.AuthServices.getLoggedinUserId();
    this.httpService._NodeGetParcelStates(UserId).subscribe(data => {      
      if (data._Issuccess) {
        var jsonData = data.ParcelStateData;
        this.States = [];
        this.StateModelList = jsonData;
        this.MapServiceService.setParcelStates(jsonData);
        for (let i = 0; i < jsonData.length; i++) {
          this.States.push({ 'item_id': jsonData[i].ID, 'item_text': jsonData[i].StateName, 'counties': jsonData[i].counties, 'TableLayerName': jsonData[i].LayerTableName });
        }
      }
      this.LayerLoader = false;
    },
      error => {
        console.log(error);
        this.LayerLoader = false;
      });
  }

  onSelectState(item: any) {
    this.Counties = [];
    this.selectedCountries = [];
    let StateModel = this.StateModelList.filter(m => m.ID === item.item_id);
    if (StateModel) {
      let cts = StateModel[0].counties;
      this.Counties = [];
      for (let i = 0; i < cts.length; i++) {
        if (cts[i]["LayerTableName"]) {
          this.Counties.push({ 'item_id': i, 'item_text': cts[i].County });
        }
      }
    }
    (<HTMLInputElement>document.getElementById("ddCounties")).classList.remove('disabled');
  }

  DisableSearch() {
    (<HTMLInputElement>document.getElementById("btnSearch")).disabled = true;
  }

  EnableSearch() {
    (<HTMLInputElement>document.getElementById("btnSearch")).disabled = false;
  }

  ClearFilters() {
    this.Counties = [];
    this.selectedState = [];
    this.selectedCountries = [];
    this.txtParcelfilter = "";
  }
  DisableButtons() {
    this.Counties = [];
    this.selectedCountries = [];
    if (document.getElementById("btnSearch"))
      (<HTMLInputElement>document.getElementById("btnSearch")).disabled = true;
    if (document.getElementById("ddCounties"))
      (<HTMLInputElement>document.getElementById("ddCounties")).classList.add('disabled');
  }

  ShowWidgetBasedOnRole() {
    if (!this.AuthServices.ShowParcelLookupWidgetUIBasedOnRole()) {
      $("#ParcelsTabHeader").parent().parent().addClass("disabled disable-tab");
      $("#parcelLookupCard .card-header").addClass("disable-cardHeader");
      $("#parcelLookupCard .card-body").addClass("disable-cardBody");
      $("#parcelLookupCard .card-body .tab-content-wrapper").addClass("disable-cardBody");
      $("#parcelLookupCard").addClass("disabled");
    }
  }
  SearchParcelLookup() {
    let ParcelData = this.MapServiceService.parcelStateData.getValue();
    if (ParcelData.length > 0) {
      for (let i = 0; i < ParcelData.length; i++) {
        var statelist = ParcelData[i];
        if (statelist.ID == this.selectedState[0].item_id && statelist.StateName == this.selectedState[0].item_text) {
          let GetCountyList = statelist.counties.filter(m => m.County == this.selectedCountries[0].item_text);
          if (GetCountyList != null && GetCountyList.length > 0) {
            if (GetCountyList[0]["LayerTableName"]) {
              this.MapServiceService.ParcelCenterLookupZoom = false;
              let tempLayerObjPropObj = this.GetParcelTempLayerObject(GetCountyList);
              this.SetTree(this.ParcelCenterPointData, tempLayerObjPropObj);
              if (this.Treedatalist.length > 0) {
                this.CondensedComponent.Redirect('maps');
                this.CondensedComponent.SetTemporaryTreeNodeForWidget(this.Treedatalist);
              }
            }
          }
        }
      }
    }
  }

  SetTree(temp, tempLayerObjPropObj) {
    this.RemovelayerFromTree(temp.DataSetID);
    this.AddLayeronTempVariable(tempLayerObjPropObj);
    this.Treedatalist = [];
    this.Treedatalist.push(this.getsingaleTree(tempLayerObjPropObj));
  }
  AddLayeronTempVariable(tempobj) {
    if (this.MapServiceService.LayerIndex.getValue()) {
      let currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
      tempobj["Layerindexval"] = currentIndexVal;
      this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
    }
    this.MapServiceService.temporaryLayer.push(tempobj);
  }
  RemovelayerFromTree(DatasetId) {
    let tempLayerTreeData = this.MapServiceService.TemporaryTreeNode.getValue();
    let ParcelData = tempLayerTreeData.find(x => x.Id == DatasetId);
    if (ParcelData)
      this.utilityService.ActiveLayerData(DatasetId, 'RemovetemporaryTreeData');
    this.Treedatalist = [];
    // for (let i = 0; i < this.Treedatalist.length; i++) {
    //   let treeItem = this.Treedatalist[i];
    //   if (treeItem.Id == DatasetId)
    //     continue;
    //   let item = tempLayerTreeData.find(y => y.Id == treeItem.Id);
    //   if (!item) {
    //     this.Treedatalist.splice(i, 1);
    //   }
    // }

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

  GetParcelTempLayerObject(selCounty) {
    let selectedCounty = selCounty[0];
    this.ParcelCenterPointData.LayerName = selectedCounty.County + " County," + selectedCounty.State + " Parcel";
    this.ParcelCenterPointData.TableName = selectedCounty.LayerTableName.split(':')[1].replace("#", "");
    if (this.txtParcelfilter)
      this.ParcelCenterPointData.FilterValue = "TAXAPN#LIKE#" + this.txtParcelfilter + "#OR#OWN1#LIKE#" + this.txtParcelfilter + "#OR#STZIP#LIKE#" + this.txtParcelfilter;
    else
      this.ParcelCenterPointData.FilterValue = "";
    let tempLayerObjPropObj = new tempLayerDataProp();
    tempLayerObjPropObj.DataSetID = this.ParcelCenterPointData.DataSetID;
    tempLayerObjPropObj.EnergyLayerID = tempLayerObjPropObj.DataSetID;
    tempLayerObjPropObj.DataSetName = this.ParcelCenterPointData.LayerName;
    tempLayerObjPropObj.Description = this.ParcelCenterPointData.LayerName;
    tempLayerObjPropObj.UploadedBy = this.AuthServices.getLoggedinUserId();
    tempLayerObjPropObj.Tags = this.ParcelCenterPointData.LayerName;
    tempLayerObjPropObj.IsPublic = "false";
    tempLayerObjPropObj.PreviewImage = this.ParcelCenterPointData.PreviewImage;
    tempLayerObjPropObj.IconType = "Circle";
    tempLayerObjPropObj.StrokeThicknessPercent = 5;
    tempLayerObjPropObj.StrokeColor = "FF" + this.utilityService.getRandomColor();
    tempLayerObjPropObj.FillColor = tempLayerObjPropObj.StrokeColor;
    tempLayerObjPropObj.SizePercent = 55;
    tempLayerObjPropObj.Opacity = 1;
    tempLayerObjPropObj.IsEnabled = "true";
    tempLayerObjPropObj.SortNumber = "1";
    tempLayerObjPropObj.Count = "0";
    tempLayerObjPropObj.RepresentationType = "Point";
    tempLayerObjPropObj.TableName = this.ParcelCenterPointData.TableName;
    tempLayerObjPropObj.FilterValue = this.ParcelCenterPointData.FilterValue;
    tempLayerObjPropObj.LayerTypeID = "9";
    tempLayerObjPropObj.DetailPanelPropertiesMain = this.ParcelCenterPointData.DBFProperties;
    tempLayerObjPropObj.DBFProperties = this.ParcelCenterPointData.DBFProperties;
    tempLayerObjPropObj.DetailPanelProperties = this.ParcelCenterPointData.DetailPanelProperties;
    tempLayerObjPropObj.IsSaveSearch = "true";
    tempLayerObjPropObj.IsLabelVisible = "false"
    tempLayerObjPropObj.ZoomMin = this.ParcelCenterPointData.ZoomMin;
    tempLayerObjPropObj.ZoomMax = this.ParcelCenterPointData.ZoomMax;
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
    tempLayerObjPropObj.isEnergyLayer = this.ParcelCenterPointData.isEnergyLayer;
    tempLayerObjPropObj["DisplayName"] = this.ParcelCenterPointData.EnergyLayerDisplayName;
    tempLayerObjPropObj.EnergyLayerID = this.ParcelCenterPointData.EnergyLayerID;
    return tempLayerObjPropObj;
  }
}
