import { Component, OnInit, Injector } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AuthenticationService } from '../../../../services/auth.service';
import { MapServiceService } from '../../../../services/map-service.service';
import { environment } from '../../../../../environments/environment';
import { IntelligenceService } from '../../../../services/Intelligence.service';
import { UtilityService } from '../../../../services/Utility.service';

import { GlobalSearchServiceService } from '../../../../services/GlobalSearchService';
import { CondensedComponent } from '../../../../../app/@pages/layouts/condensed/condensed.component';
import { CompanyPorfileDetailModalComponent } from '../../../../intelligence/company-profile-detail-modal/company-profile-detail-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { tempLayerDataProp } from '../../../../models/layer-data-prop';
import { HttpRequestService } from '../../../../services/all-http-request.service';
import { LocalDataService } from '../../../../services/localdata.service';
declare var $: any;
@Component({
  selector: 'app-global-search-result',
  templateUrl: './global-search-result.component.html',
  styleUrls: ['./global-search-result.component.scss']
})
export class GlobalSearchResultComponent implements OnInit {
  CondensedComponent: CondensedComponent
  constructor(
    private injector: Injector,
    public bsModalRef: BsModalRef,
    private authServices: AuthenticationService,
    private MapServiceService: MapServiceService,
    private GlobalSearchServiceService: GlobalSearchServiceService,
    private IntelligenceService: IntelligenceService,
    private modalService: NgbModal,
    private UtilityService: UtilityService,
    private httpService: HttpRequestService,
    private LocalDataService: LocalDataService
  ) {
    setTimeout(() => this.CondensedComponent = injector.get(CondensedComponent));
    this.MapServiceService.globalsearchData$.subscribe(() => { this.ngOnInit() });
  }
  treestatus = "Individual";
  FeatureType = "GlobalSearch";
  searchedText: any = '';
  dataLayerResults: any = [];
  dataResults: any = [
    {
      DataName: 'Pipelines',
      Displayname: [{
        Displayname: 'Owner',
        Displayname1: 'Operator',
        Displayname2: 'System Name',
        Totalcount: 0,
        Totalcount1: 0,
        Totalcount2: 0,
        fieldName: "OWNER",
        fieldName1: "OPERATOR",
        fieldName2: "SYSTEM",
        TableName: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpipelines : '',
        // DBFProperties: this.authServices.GetSystemParameterValue("PipelinesSearchDBFProperties"),
        DBFProperties: "MSID,OWNER,NUMOWNERS,LEASED,OPERATOR,COMMODITY,COMMODITY2,PRIMBATCH1,SECBATCH1,PRIMBATCH2,SECBATCH2,LINETYPE,SYSTEM,DIAMETER,MDIAMETER,STATUS,CORRIDOR,SEGMENTNUM,TX_T4,TX_P5,UPDATED,UPDATED_SP,METACODE,LASTOWNER,LASTOPER,MILEAGE,COUNTRY,STATE_NAME,COUNTY,RELEASE_DT,INSERVICE,systype",                
        // //DetailPanelProperties: this.authServices.GetSystemParameterValue("PipelinesSearchDetailPanelProperties"),
        // DetailPanelProperties:"Owner=OWNER,Operator=OPERATOR,Commodity=COMMODITY,Commodity2=COMMODITY2,Line Type=LINETYPE,System=SYSTEM,Diameter=DIAMETER,Status=STATUS,Mileage=MILEAGE,Country=COUNTRY,State=STATE_NAME,County=COUNTY,MSID=MSID,Primary Batch=PRIMBATCH1,Secondary Batch=SECBATCH1,In Service Date=INSERVICE,TX_T4=TX_T4,TX_P5=TX_P5",        
        DetailPanelProperties:"Owner=OWNER,Operator=OPERATOR,Commodity=COMMODITY,Commodity2=COMMODITY2,Line Type=LINETYPE,System=SYSTEM,Diameter=DIAMETER,Status=STATUS,Mileage=MILEAGE,Country=COUNTRY,State=STATE_NAME,County=COUNTY",
        tempLayerDataPropList: [],
        // DataSetID: parseInt("10000" + 0),
        DataSetID: 765,
        isEnergyLayer: true,
        EnergyLayerDisplayName: "Pipelines search results",
        EnergyLayerID: 765
      }]

    },
    {
      DataName: 'Facilities',
      Displayname: [{
        Displayname: 'Owner',
        Displayname1: 'Operator',
        Displayname2: 'Facility Name',
        Totalcount: 0,
        Totalcount1: 0,
        Totalcount2: 0,
        fieldName: "OWNER",
        fieldName1: "OPERATOR",
        fieldName2: "FACNAME",
        TableName: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xfacilities : '',
        // DBFProperties: this.authServices.GetSystemParameterValue(""),
        // DetailPanelProperties: this.authServices.GetSystemParameterValue("FacilitiesSearchDetailPanelProperties"),
        DBFProperties: "FACNAME,FACTYPE,OWNER,OPERATOR,STATUS,CAPACITY,STATE_NAME,COUNTRY,COUNTY,COMMODITY,MSID,UPDATED,UPDATED_SP,LASTOWNER,LASTOPER,elevationfeet",
        DetailPanelProperties: "Facility Name=FACNAME,Facility Type=FACTYPE,Status=STATUS,Capacity=CAPACITY,Owner=OWNER,Operator=OPERATOR,Country=COUNTRY,State=STATE_NAME,County=COUNTY,Commodity=COMMODITY",
        tempLayerDataPropList: [],
        // DataSetID: parseInt("10000" + 1),
        DataSetID: 764,
        isEnergyLayer: true,
        EnergyLayerDisplayName: "Facilities search results",
        EnergyLayerID: 764
      }]

    },
    {
      DataName: 'Power Plants',
      Displayname: [{
        Displayname: 'Owner',
        Displayname1: 'Operator',
        Displayname2: 'Plant Name',
        Totalcount: 0,
        Totalcount1: 0,
        Totalcount2: 0,
        fieldName: "OWNER",
        fieldName1: "OPERATOR",
        fieldName2: "FACNAME",
        TableName: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpowerplants : '',
        // DBFProperties: this.AuthServices.GetSystemParameterValue(""),
        DBFProperties: "FACNAME,OWNER,OPERATOR,NAME_CAP,STATUS,PRIMEMOVER,PRIMEFUEL,STATE_NAME,COUNTRY,COUNTY,LEASED,YRINSTALL,NUMUNITS,PROP_CAP,EIA_CD,UPDATED,UPDT_SP,LASTOWNER,LASTOPER,elevationfeet",
        //DetailPanelProperties: this.AuthServices.GetSystemParameterValue("PowerPlantsSearchDetailPanelProperties"),
        DetailPanelProperties: "Facility Name=FACNAME,Owner=OWNER,Operator=OPERATOR,Capacity=NAME_CAP,Status=STATUS,Prime Mover=PRIMEMOVER,Prime Fuel=PRIMEFUEL,State=STATE_NAME,Country=COUNTRY,County=COUNTY",
        tempLayerDataPropList: [],
        //DataSetID: parseInt("10000" + 2),
        DataSetID: 766,
        isEnergyLayer: true,
        EnergyLayerDisplayName: "Power Plants search results",
        EnergyLayerID: 766
      }]

    },
    {
      DataName: 'Substations',
      Displayname: [{
        Displayname: 'Owner',
        Displayname1: 'Operator',
        Displayname2: 'Substation Name',
        Totalcount: 0,
        Totalcount1: 0,
        Totalcount2: 0,
        fieldName: "OWNER",
        fieldName1: "OPERATOR",
        fieldName2: "SUBNAME",
        TableName: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xsubstations : '',
        // DBFProperties: this.AuthServices.GetSystemParameterValue(""),
        DBFProperties: "SUBNAME,SUBTYPE,STATUS,OWNER,OPERATOR,STATE_NAME,COUNTY,COUNTRY,PRIMVOLT,SECVOLT,TERTVOLT,MSID,UPDATED,UPDT_SP,LASTOWNER,LASTOPER",
        //DetailPanelProperties: this.AuthServices.GetSystemParameterValue("SubstationsSearchDetailPanelProperties"),
        DetailPanelProperties: "Name=SUBNAME,Type=SUBTYPE,Status=STATUS,Owner=OWNER,Operator=OPERATOR,Primary Voltage=PRIMVOLT,Secondary Voltage=SECVOLT,Tertiary Voltage=TERTVOLT,State=STATE_NAME,County=COUNTY,Country=COUNTRY",
        tempLayerDataPropList: [],
        // DataSetID: parseInt("10000" + 3)
        DataSetID: 956,
        isEnergyLayer: true,
        EnergyLayerDisplayName: "Substations search results",
        EnergyLayerID: 956
      }]

    },
    {
      DataName: 'Transmission Lines',
      Displayname: [{
        Displayname: 'Owner',
        Displayname1: 'Operator',
        Displayname2: '',
        Totalcount: 0,
        Totalcount1: 0,
        Totalcount2: 0,
        fieldName: "OWNER",
        fieldName1: "OPERATOR",
        fieldName2: "",
        TableName: this.LocalDataService.GetXTableNames() ? this.LocalDataService.GetXTableNames().xpowerlines : '',
        //DBFProperties: this.AuthServices.GetSystemParameterValue(""),
        DBFProperties: "OWNER,OPERATOR,VOLTAGE,TYPE,STATUS,CORRIDOR,VOLT_CAT,COUNTRY,STATE_NAME,COUNTY,MILEAGE,MSID,RANGE,NUMOWNERS,UPDATED,UPDT_SP,METACODE,LASTOWNER,LASTOPER,RELEASE_DT",
        //DetailPanelProperties: this.AuthServices.GetSystemParameterValue("TransmissionLinesSearchDetailPanelProperties"),
        DetailPanelProperties: "Owner=OWNER,Operator=OPERATOR,Voltage=VOLTAGE,Type=TYPE,Status=STATUS,Corridor=CORRIDOR,Voltage Category=VOLT_CAT,Country=COUNTRY,State=STATE_NAME,County=COUNTY,Mileage=MILEAGE,MSID=MSID,Range=RANGE,Last Owner=LASTOWNER,Last Operator=LASTOPER",
        tempLayerDataPropList: [],
        //DataSetID: parseInt("10000" + 4),
        DataSetID: 922,
        isEnergyLayer: true,
        EnergyLayerDisplayName: "Transmission Lines search results",
        EnergyLayerID: 922
      }],

    },
  ]
  currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
  LoginId: any = '';
  EnergyLayerCount = 0;
  LayerLoader: boolean = false;
  GlobalSearchCategoryID = -12;

  CompanyLoader: boolean = false;
  allCompnayListdata: any = [];
  filteredCompanyList: any = [];
  filteredCompanyListCount = 0;
  companyProfMsg = '';
  EnergyLayerMsg = '';
  EmptyTextMsg = 'No Data for empty search';
  loaderImage: any = environment.ImagespreviewPath + "LayerLibraryLoader.gif";

  ngOnInit() {
    this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
    this.searchedText = $('#txtGlobalSearch').val();
    this.SetModalId();
    if (this.searchedText != "") {
      this.companyProfMsg = '';
      this.EnergyLayerMsg = 'No Data Found';
      this.GetEnergyLayerDataResults();
      this.GetFilteredCompanyProfileData();
    }
    else {
      this.ClearData();
    }
    this.RemoveActivetemptreeLayer();
    setTimeout(() => {
      this.getAllTempLayerList();
    }, 1000);

  }

  ClearData() {
    this.companyProfMsg = this.EmptyTextMsg;
    this.EnergyLayerMsg = this.EmptyTextMsg;
    this.filteredCompanyListCount = 0;
    this.EnergyLayerCount = 0;
    this.dataLayerResults = [];
    this.filteredCompanyList = [];
  }

  //#region CompanyProfile
  GetFilteredCompanyProfileData() {
    this.CompanyLoader = true;
    let sText = this.searchedText.toLowerCase().trim();
    this.httpService._NodeGetFilterdCompanyList(sText).subscribe(data => {
      if (data && data._Issuccess == true) {
        // this.allCompnayListdata = data.CompanyList;
        this.filteredCompanyList = data.CompanyList;
        this.filteredCompanyListCount = data.CompanyList.length;
      }
      this.CompanyLoader = false;
    }, error => {
      this.CompanyLoader = false;
    });
  }

  OpenCompanyDetails(CompanyID: any) {
    let URL = "/assets/CompanyProfileDetail.html";
    URL = window.location.origin + URL + "?t=" + CompanyID;
    const modalRef = this.modalService.open(CompanyPorfileDetailModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "CompanyProfileviewDetail" });
    modalRef.componentInstance.URL = URL;
  }
  //#endregion

  //#region EnergyLayer
  GetEnergyLayerDataResults() {
    if (!this.MapServiceService._GlobalsearchLayerList.getValue() || this.IsExistsornot(this.GlobalSearchCategoryID) == false) {
      this.LayerLoader = true;
      this.LoginId = this.authServices.getLoggedinUserId();
      this.httpService._NodeGetglobalSearchEnergylayer(this.LoginId, "Energy Layer Group", this.searchedText, 500, 0).subscribe(data => {
        this.LayerLoader = false;
        // let LayersLibrary = data.json();
        // let res = JSON.parse(LayersLibrary);
        let res = data.json();
        if (res.errormsg == "") {
          res["IsLoaded"] = true;
          let layer = res.LayerLibrary.map((el) => {
            if (el.PreviewImage) {
              el.PreviewImage = this.MapServiceService.getPreviewImageLink(el.PreviewImage);
            }
            var o = Object.assign({}, el);
            o.ViewData = 'View Data';
            o.Addtomap = 'Add to map';
            return o;
          });
          let DefaultLayer = [
            {
              CategoryID: this.GlobalSearchCategoryID,
              LayerLibrary: layer,
              Totalcount: parseInt(res.TotalCount),
              searchedText: this.searchedText
            }
          ];
          if (this.MapServiceService._GlobalsearchLayerList.getValue()) {
            this.MapServiceService._GlobalsearchLayerList.getValue().length = 0;
            Array.prototype.push.apply(this.MapServiceService._GlobalsearchLayerList.getValue(), DefaultLayer);
          } else {
            this.MapServiceService.setGlobaleSearchEnergyLayer(DefaultLayer);
          }
          // this.EnergyLayerCount = this.dataLayerResults.length;
          this.DisplayLayres(this.GlobalSearchCategoryID);
        }
        else {
          this.LayerLoader = false;
          console.log(res.error);
        }

      }, error => {
        this.LayerLoader = false;
        console.log(error);
      });
    }
    else {
      this.DisplayLayres(this.GlobalSearchCategoryID);
    }
  }

  IsExistsornot(categoryId) {
    let isActive = false;
    if (this.MapServiceService._GlobalsearchLayerList.getValue()) {
      for (let a of this.MapServiceService._GlobalsearchLayerList.getValue()) {
        if (a.CategoryID == categoryId && this.searchedText == a.searchedText) {
          isActive = true;
        }
      }
    }
    return isActive;
  }

  DisplayLayres(categoryId) {
    let isActive = false;
    let LayerList;
    if (this.MapServiceService._GlobalsearchLayerList.getValue()) {
      for (let a of this.MapServiceService._GlobalsearchLayerList.getValue()) {
        if (a.CategoryID == categoryId) {
          isActive = true;
          LayerList = a;
        }
      }
    }
    if (isActive == true) {
      //this.MapServiceService.setActiveLayerslist(DefaultLayer);
      this.dataLayerResults.length = 0;
      //this.dataLayerResults.push(LayerList.LayerLibrary);
      Array.prototype.push.apply(this.dataLayerResults, LayerList.LayerLibrary);
      this.EnergyLayerCount = this.dataLayerResults.length;
      // this.DisplayingCount = this.ActiveMapLayersLibrary[0].LayerLibrary.length;
    }
    this.LayerLoader = false;
  }

  GlobalSearchAddtomapClick(LayerId, CategoryId) {
    if (this.MapServiceService._GlobalsearchLayerList.getValue()) {
      for (let a of this.MapServiceService._GlobalsearchLayerList.getValue()) {
        if (a.CategoryID == CategoryId) {
          let IsLoaded = false;
          for (let e of a.LayerLibrary) {
            if (e.EnergyLayerID == LayerId && !IsLoaded) {
              IsLoaded = true;
              if (e.Addtomap == 'Add to map') {
                e.Addtomap = 'Remove from map';
                this.CondensedComponent.GetTreeData(LayerId);
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
  tempLayerDataPropList: any = [];
  getAllTempLayerList() {
    try {      
      this.MapServiceService.LayerIndex.getValue().value = this.currentIndexVal + 1;
      this.currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
      for (let t = 0; t < this.dataResults.length; t++) {
        if (!this.authServices.ShowOilAndGasUIBasedOnRole() && (this.dataResults[t].DataName.toLowerCase() == "pipelines" || this.dataResults[t].DataName.toLowerCase() == "facilities"))
          this.dataResults[t].DataName = "";
        if (!this.authServices.ShowElectricPowerUIBasedOnRole() && (this.dataResults[t].DataName.toLowerCase() == "power plants" || this.dataResults[t].DataName.toLowerCase() == "substations" || this.dataResults[t].DataName.toLowerCase() == "transmission lines"))
          this.dataResults[t].DataName = "";
        let _objtemp = this.dataResults[t];
        let DataSetName = this.dataResults[t].DataName;
        if (DataSetName) {
          let temp = this.dataResults[t].Displayname[0];
          let filterval = this.searchedText == '' ? '' : this.searchedText;
          let tempLayerObjPropObj = new tempLayerDataProp();
          if (DataSetName == "Pipelines") {
            tempLayerObjPropObj.RepresentationType = "Line";
            tempLayerObjPropObj.IconType = "Line";
            tempLayerObjPropObj.SizePercent = 100;
            tempLayerObjPropObj.StrokeThicknessPercent = 5;
            tempLayerObjPropObj.Opacity = 1;
          }
          if (DataSetName == "Facilities") {
            tempLayerObjPropObj.RepresentationType = "Point";
            tempLayerObjPropObj.IconType = "Storage";
            tempLayerObjPropObj.SizePercent = 50;
            tempLayerObjPropObj.StrokeThicknessPercent = 18;
            tempLayerObjPropObj.Opacity = 1;
          }
          if (DataSetName == "Power Plants") {
            tempLayerObjPropObj.RepresentationType = "Point";
            tempLayerObjPropObj.IconType = "Rectangle";
            tempLayerObjPropObj.SizePercent = 50;
            tempLayerObjPropObj.StrokeThicknessPercent = 5;
            tempLayerObjPropObj.Opacity = 1;
          }
          if (DataSetName == "Substations") {
            tempLayerObjPropObj.RepresentationType = "Point";
            tempLayerObjPropObj.IconType = "Pentagram";
            tempLayerObjPropObj.SizePercent = 50;
            tempLayerObjPropObj.StrokeThicknessPercent = 5;
            tempLayerObjPropObj.Opacity = 1;
          }
          if (DataSetName == "Transmission Lines") {
            tempLayerObjPropObj.RepresentationType = "Line";
            tempLayerObjPropObj.IconType = "Line";
            tempLayerObjPropObj.SizePercent = 100;
            tempLayerObjPropObj.StrokeThicknessPercent = 5;
            tempLayerObjPropObj.Opacity = 1;
          }
          if (this.searchedText) {
            tempLayerObjPropObj.DataSetName = DataSetName + " - " + this.searchedText;
            tempLayerObjPropObj.Description = DataSetName + " - " + this.searchedText;
            tempLayerObjPropObj.Tags = DataSetName + " - " + this.searchedText;
          }
          else {
            tempLayerObjPropObj.DataSetName = DataSetName;
            tempLayerObjPropObj.Description = DataSetName;
            tempLayerObjPropObj.Tags = DataSetName;
          }
          tempLayerObjPropObj.DataSetID = temp.DataSetID;
          tempLayerObjPropObj.EnergyLayerID = tempLayerObjPropObj.DataSetID;
          tempLayerObjPropObj.EnergyParentID = 0;
          tempLayerObjPropObj.ParentDataSetID = 0;
          tempLayerObjPropObj["DisplayName"] = temp.EnergyLayerDisplayName;
          tempLayerObjPropObj.isEnergyLayer = temp.isEnergyLayer;
          tempLayerObjPropObj.TableName = temp.TableName;
          tempLayerObjPropObj.DetailPanelPropertiesMain = temp.DBFProperties;
          tempLayerObjPropObj.DBFProperties = temp.DBFProperties;
          tempLayerObjPropObj.DetailPanelProperties = temp.DetailPanelProperties;
          tempLayerObjPropObj.StrokeColor = "FF" + this.UtilityService.getRandomColor();
          //tempLayerObjPropObj.FillColor = "FF" + this.MapServiceService.getRandomColor();
          tempLayerObjPropObj.FillColor = tempLayerObjPropObj.StrokeColor;
          tempLayerObjPropObj.UploadedBy = this.authServices.getLoggedinUserId();
          tempLayerObjPropObj.Layerindexval = this.currentIndexVal;
          tempLayerObjPropObj.FeatureType = this.FeatureType;
          this.dataResults[t].Displayname[0].tempLayerDataPropList = [];
          this.dataResults[t].Displayname[0].tempLayerDataPropList.push(tempLayerObjPropObj);
          let defaultfilter = '';
          let cqlfilter = '';
          let Filterval = '';
          if (temp.fieldName) {
            if (filterval) {
              if (Filterval) {
                Filterval += '#OR#' + temp.fieldName + "#LIKE#" + filterval;
              }
              else {
                Filterval = temp.fieldName + "#LIKE#" + filterval;
              }
              defaultfilter = ' (' + temp.fieldName + ' ILIKE ' + "'%25" + encodeURIComponent(filterval) + "%25')";
              cqlfilter = '&CQL_FILTER=(' + defaultfilter + ')';
            }
            this.gettotalcount(t, "Totalcount", tempLayerObjPropObj, cqlfilter);
          }
          if (temp.fieldName1) {
            if (filterval) {
              if (Filterval) {
                Filterval += '#OR#' + temp.fieldName1 + "#LIKE#" + filterval;
              }
              else {
                Filterval = temp.fieldName1 + "#LIKE#" + filterval;
              }
              defaultfilter = ' (' + temp.fieldName1 + ' ILIKE ' + "'%25" + encodeURIComponent(filterval) + "%25')";
              cqlfilter = '&CQL_FILTER=(' + defaultfilter + ')';
            }
            this.gettotalcount(t, "Totalcount1", tempLayerObjPropObj, cqlfilter);
          }
          if (temp.fieldName2) {
            if (filterval) {
              if (Filterval) {
                Filterval += '#OR#' + temp.fieldName2 + "#LIKE#" + filterval;
              }
              else {
                Filterval = temp.fieldName2 + "#LIKE#" + filterval;
              }
              defaultfilter = ' (' + temp.fieldName2 + ' ILIKE ' + "'%25" + encodeURIComponent(filterval) + "%25')";
              cqlfilter = '&CQL_FILTER=(' + defaultfilter + ')';
            }
            this.gettotalcount(t, "Totalcount2", tempLayerObjPropObj, cqlfilter);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  gettotalcount(t, TotalCountofFieldname, tempLayerObjPropObj, CQL_FILTER) {
    let UserId = this.authServices.getLoggedinUserId();
    this.httpService._NodegetLayerData(tempLayerObjPropObj, 0, 1, CQL_FILTER, '', '', UserId)
      .then(data => {
        let Data: any = data;
        if (Data["totalFeatures"]) {
          // if (data['_body'].indexOf('totalFeatures') > 0) {
          let total = Data.totalFeatures;
          this.dataResults[t].Displayname[0][TotalCountofFieldname] = total;
        }
      }).catch(ex => {
        console.log(ex);
      });
  }
  //#endregion
  SetModalId() {
    setTimeout(() => {
      if (!document.getElementById('globalSearchModal')) {
        var modalDiv = document.getElementsByClassName('globalSearch-modal')[0];
        var modalElement = $(modalDiv).parents('.modal');
        $(modalElement).attr('id', 'globalSearchModal');
        this.SetModal('globalSearchModal');
        $('.modal-dialog').draggable({
          handle: ".modal-header"
        });
      }
    }, 100);
  }


  SetModal(modalname: any) {
    $("#" + modalname + " .modal-dialog").css({
      position: 'fixed',
      width: $("#" + modalname + " .modal-content").width(),
      height: $("#" + modalname + " .modal-content").height(), margin: '0px'
    });

    $("#" + modalname).css({
      position: 'fixed',
      width: $("#" + modalname + " .modal-dialog").width(),
      height: $("#" + modalname + " .modal-dialog").height()
    });
    $('.modal').css('background', 'rgba(0,0,0,0)');

    $("#" + modalname).css({
      left: ($(window).width() - $('#' + modalname).outerWidth()) / 2,
      top: ($(window).height() - $('#' + modalname).outerHeight()) / 2,
    });
    $('.modal-backdrop').hide();
    setTimeout(() => {
      $("#" + modalname).css({
        height: '0px',
        top: ($(window).height() - $('#' + modalname).outerHeight()) / 2,
      });
    }, 500);
  }

  Showallresultsonmap() {    
    let Treedatalist = [];
    for (let s = 0; s < this.dataResults.length; s++) {
      let DataSetName = this.dataResults[s].DataName;
      if (DataSetName) {
        let temp = this.dataResults[s].Displayname[0];
        if (temp.Totalcount == 0 && temp.Totalcount1 == 0 && temp.Totalcount2 == 0) {
          continue;
        }
        let tempobj = this.dataResults[s].Displayname[0].tempLayerDataPropList[0]
        Treedatalist.push(this.getsingaleTree(tempobj));
        let filterval = this.searchedText == '' ? '' : this.searchedText
        let Filterval = '';
        if (temp.fieldName) {
          if (filterval) {
            if (Filterval) {
              Filterval += '#OR#' + temp.fieldName + "#LIKE#" + filterval;
            }
            else {
              Filterval = temp.fieldName + "#LIKE#" + filterval;
            }
          }

        }
        if (temp.fieldName1) {
          if (filterval) {
            if (Filterval) {
              Filterval += '#OR#' + temp.fieldName1 + "#LIKE#" + filterval;
            }
            else {
              Filterval = temp.fieldName1 + "#LIKE#" + filterval;
            }

          }

        }
        if (temp.fieldName2) {
          if (filterval) {
            if (Filterval) {
              Filterval += '#OR#' + temp.fieldName2 + "#LIKE#" + filterval;
            }
            else {
              Filterval = temp.fieldName2 + "#LIKE#" + filterval;
            }

          }

        }
        tempobj.FilterValue = Filterval;
        tempobj.TreeStatus = this.treestatus;
        if (tempobj.DBFProperties != 'undefined' && tempobj.DBFProperties == '' && tempobj.DetailPanelProperties != 'undefined' && tempobj.DetailPanelProperties != '') {
          let DetailPanelPro = tempobj.DetailPanelProperties.split(',');
          if (DetailPanelPro.length > 0) {
            for (let prop of DetailPanelPro) {
              let p = prop.split("=");
              tempobj.DBFProperties += p[1] + ',';
            }
            tempobj.DBFProperties = tempobj.DBFProperties.substring(0, tempobj.DBFProperties.length - 1);;
          }
        }
        //tempobj.Layerindexval = this.currentIndexVal;
        this.AddLayeronTempVariable(tempobj);
      }
    }

    if (Treedatalist.length > 0) {
      this.CondensedComponent.SetTemporaryTreeNode(Treedatalist);
    }
    this.CloseGlobalSearchResultModal();
  }
  getsingaleTree(tempobj) {
    let Tree = {
      Id: tempobj.DataSetID,
      Name: tempobj.DataSetName,
      activeCount: 0,
      IconUrl: environment.GetLayerIconURL + "/icongenerate/get/?Id=" + tempobj.DataSetID + "&URLType=CustomStyleIcon&FillColor=" + tempobj.FillColor + "&IconType=" + tempobj.IconType + "&StrokeColor=" + tempobj.StrokeColor + "&SizePercent=" + tempobj.SizePercent + "&StrokeThicknessPercent=" + tempobj.StrokeThicknessPercent + "&Opacity=" + tempobj.Opacity,
      IsChecked: true,
      treestatus: this.treestatus,
      FeatureType: this.FeatureType
    }
    return Tree
  }
  RemoveActivetemptreeLayer() {
    for (let t = 0; t < this.dataResults.length; t++) {
      let _objtemp = this.dataResults[t];
      let DataSetName = this.dataResults[t].DataName;
      let temp = this.dataResults[t].Displayname[0];
      this.MapServiceService._TemporaryTreeUI.getValue().treeModel.update();
      let treeUI = this.MapServiceService._TemporaryTreeUI.getValue();
      if (DataSetName) {
        // if (temp.DataSetID >= 100000 && temp.DataSetID <= 200006) {
        let TempTreeData = treeUI.treeModel.getNodeById(temp.DataSetID);
        if (TempTreeData && TempTreeData.data && !TempTreeData.data.IsChecked) {
          let EnergyLayerID = temp.DataSetID + 'RemovetemporaryTreeData';
          setTimeout(() => {
            let element: HTMLElement = document.getElementById(EnergyLayerID) as HTMLElement;
            if (element) {
              element.click();
            }
          }, 500);
        }

        // }
      }

    }
  }

  CountClick(fieldName: any, dataName: any) {
    let selectedDataResult = [];
    let Treedatalist = []
    this.dataResults.map((d) => {
      if (d.DataName && d.DataName != '' && d.DataName != undefined && d.DataName.toLowerCase() == dataName.toLowerCase()) {
        selectedDataResult.push(d);
      }
    });
    for (let s = 0; s < selectedDataResult.length; s++) {
      let DataSetName = selectedDataResult[s].DataName;
      if (DataSetName) {
        let tempobj = selectedDataResult[s].Displayname[0].tempLayerDataPropList[0];
        if (this.searchedText != "" && fieldName)
          tempobj.FilterValue = fieldName + "#LIKE#" + this.searchedText;
        tempobj.TreeStatus = this.treestatus;
        if (tempobj.DBFProperties != 'undefined' && tempobj.DBFProperties == '' && tempobj.DetailPanelProperties != 'undefined' && tempobj.DetailPanelProperties != '') {
          let DetailPanelPro = tempobj.DetailPanelProperties.split(',');
          if (DetailPanelPro.length > 0) {
            for (let prop of DetailPanelPro) {
              let p = prop.split("=");
              tempobj.DBFProperties += p[1] + ',';
            }
            tempobj.DBFProperties = tempobj.DBFProperties.substring(0, tempobj.DBFProperties.length - 1);;
          }
        }
        this.AddLayeronTempVariable(tempobj);
        Treedatalist.push(this.getsingaleTree(tempobj));
      }
    }
    if (Treedatalist.length > 0) {
      this.CondensedComponent.SetTemporaryTreeNode(Treedatalist);
    }
    this.CloseGlobalSearchResultModal();
  }

  CloseGlobalSearchResultModal() {
    let globalSearchClosebtn = document.getElementById("btnglobalSearchClose");
    if (globalSearchClosebtn != null)
      globalSearchClosebtn.click();
  }
  AddLayeronTempVariable(tempobj) {
    // if (this.MapServiceService.LayerIndex.getValue()) {
    //   let currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
    //   tempobj["Layerindexval"] = currentIndexVal;
    //   // this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
    // }
    this.MapServiceService.temporaryLayer.push(tempobj);
  }
}
