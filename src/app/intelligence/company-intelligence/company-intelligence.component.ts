import { Component, OnInit, OnDestroy, ViewChild, HostListener, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import { IntelligenceService } from '../../services/Intelligence.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyPorfileDetailModalComponent } from '../company-profile-detail-modal/company-profile-detail-modal.component'
import { HttpRequestService } from '../../services/all-http-request.service';
import { MapServiceService } from '../../services/map-service.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-company-intelligence',
  templateUrl: './company-intelligence.component.html',
  styleUrls: ['./company-intelligence.component.scss']
})
export class CompanyIntelligenceComponent implements OnInit {

  constructor(public IntelligenceService: IntelligenceService,
    private modalService: NgbModal,
    private httpRequest: HttpRequestService,
    private MapServiceService: MapServiceService) { }
  ImageURLPath: string = environment.ImagespreviewPath;
  private AllCompnayListdata;
  public companyfilter;
  public rowSelection;
  AllfilterOptionValue: any = {
    state: [],
    commodities: [],
    entities: [],
    entityType: [],
    businessLine: [],
    selectedCompanyNameList: [],
  };
  selectedAllFilters: any = {
    state: [],
    commodities: [],
    entities: [],
    entityType: [],
    businessLine: []
  };
  selectedCompanyName = "";
  private gridApi;
  private gridColumnApi;
  public CompanyrowData: any = [];
  public columnDefs;
  public paginationPageSize;
  public paginationNumberFormatter;
  LoaderLink = this.ImageURLPath + "LayerLibraryLoader.gif"
  overlayLoadingTemplate = '<img src="' + this.LoaderLink + '" width="106px" />'
  overlayNoRowsTemplate = '<img src="' + this.LoaderLink + '" width="106px" />'
  take: number = 3000;
  skip: number = 0;
  ngOnInit() {
    this.GenerateCompanycolumns();
    this.GetAllCompanyOptions();
    this.GetSuggestiveCompanyData();
  }
  GetSuggestiveCompanyData() {
    this.httpRequest._NodeGetSuggestiveCompanyData().subscribe(res => {
      let data = res.json();
      if (data._Issuccess) {
        let Compnaynamelist = data.GetSuggestiveCompanyNameResults;
        this.AllfilterOptionValue.selectedCompanyNameList.push(Compnaynamelist);
      } else {
        console.log(data.errormsg);
      }
    }, error => {
      console.log(error);
    });
  }
  SearchDisplayGridData(CompanyName) {
    let SearchCompanyData = this.AllCompnayListdata.filter((el) => {
      if (el.CompanyName.toLowerCase().indexOf(CompanyName.toLowerCase().trim()) > -1) {
        return el;
      }
    });
    this.CompanyrowData = null
    setTimeout(() => {
      if (SearchCompanyData.length > 0) {
        this.CompanyrowData = SearchCompanyData;
      }
      else {
        this.CompanyrowData = this.fillBlanckRowinGrid();
      }
    }, 1000);
  }
  typeaheadOnSelect(event) {
    if (event) {
      let CompanyName = event.value;
      this.selectedCompanyName = event.value;
      let CompanyID = this.AllCompnayListdata.filter((el) => {
        if (el.CompanyName.toLowerCase() == CompanyName.toLowerCase()) {
          return el.CompanyID;
        }
      });
      if (CompanyID) {
        var Id = CompanyID[0].CompanyID;
        this.OpenInnewtab(Id);
      }
      this.SearchDisplayGridData(CompanyName);
    }
  }
  searchCompnayName() {
    if (this.selectedCompanyName) {
      this.SearchDisplayGridData(this.selectedCompanyName);
    }
  }
  GetAllCompanyList(Take, skip) {
    this.httpRequest._NodeGetAllCompnayList(Take, skip).subscribe(data => {
      let ListofCompnayData = data.CompanyList
      if (Take == 0 && this.CompanyrowData.length == 0) {
        this.CompanyrowData = ListofCompnayData;
      }
      else {
        Array.prototype.push.apply(this.CompanyrowData, ListofCompnayData);
      }
      if (!this.AllCompnayListdata)
        this.AllCompnayListdata = [];
      Array.prototype.push.apply(this.AllCompnayListdata, ListofCompnayData);
      this.GenerateCompanycolumns();
    }, error => {
      console.log(error);
      this.GenerateCompanycolumns();
    });
  }
  GetAllCompanyOptions() {
    this.httpRequest._NodeGetAllCompanyOptions().subscribe(res => {
      let data = res.json();
      if (data._Issuccess) {
        let filteropList = data.GetAllCompanyOptions;
        for (let c in filteropList.Commodities) {
          if (filteropList.Commodities[c].commodity == "Asph") {
            filteropList.Commodities[c].commodity = "Asphalt";
          }
          else if (filteropList.Commodities[c].commodity == "Ethl") {
            filteropList.Commodities[c].commodity = "Ethanol";
          }
          else if (filteropList.Commodities[c].commodity == "Misc") {
            filteropList.Commodities[c].commodity = "Miscellaneous";
          }
        }
        for (let e in filteropList.Entities) {
          filteropList.Entities[e].entity = this.IntelligenceService.setEnitiesName(filteropList.Entities[e].entity);
        }
        for (let et in filteropList.EntityType) {
          if (filteropList.EntityType[et].entityType == "HoldingCo") {
            filteropList.EntityType[et].entityType = "Holding Company";
          }
        }
        this.AllfilterOptionValue.state.push(filteropList.state);
        this.AllfilterOptionValue.commodities.push(filteropList.Commodities);
        this.AllfilterOptionValue.entities.push(filteropList.Entities);
        this.AllfilterOptionValue.entityType.push(filteropList.EntityType);
        this.AllfilterOptionValue.businessLine.push(filteropList.BusinessLine);
      }
      else {
        console.log(data.errormsg);
      }
    }, error => {

      console.log(error);
    });
  }
  GenerateCompanycolumns() {
    let CompanyNamewidth = 350;
    let width = 197;
    if (window.screen.width > 1366) {
      CompanyNamewidth = 350;
      width = 200;
    }
    else if (window.screen.width < 1366) {
      CompanyNamewidth = 300;
      width = 100;
    }
    else if (window.screen.width == 1366) {
      CompanyNamewidth = 300;
      width = 150;
    }
    this.columnDefs = [
      {
        headerName: "CompanyID",
        field: "CompanyID",
        width: 10,
        filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        hide: true,
      },
      {
        headerName: 'Name',
        field: 'CompanyName',
        width: CompanyNamewidth,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        cellRenderer: (params) => {
          let _object = params.data.CompanyName;
          let id = params.data.CompanyID;
          return "<a style='color: blue;' href='javascript:void(0)' data-action-type='CompanyName'>" + _object + "</a>"
        }
      },
      {
        headerName: "Owned Plants",
        field: "powerPlantOwned",
        width: width,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" },
      },
      {
        headerName: "Operated Plants",
        field: "powerPlantOperated",
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        width: width,
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "Owned Facilities",
        field: "FacilityOwned",
        width: width,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "Operated Facilities",
        field: "FacilityOperated",
        width: width,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "City",
        field: "PhyCity",
        width: width,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "State",
        field: "PhyState",
        width: width,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "Country",
        field: "PhyCountry",
        width: width,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      }];
    this.paginationPageSize = 100;
    this.paginationNumberFormatter = (params) => {
      return params.value.toLocaleString();
    };
  }
  OpenInnewtab(CompanyID) {
    // let URL = "../../assets/CompanyProfileDetail.html";    
    // URL = URL + "?t=" + CompanyID;    
    // window.open(URL, '_blank', 'location=yes,height=600,width=1200,scrollbars=yes,status=yes');

    let URL = "/assets/CompanyProfileDetail.html";
    URL = window.location.origin + URL + "?t=" + CompanyID;
    const modalRef = this.modalService.open(CompanyPorfileDetailModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "CompanyProfileviewDetail" });
    modalRef.componentInstance.URL = URL;
  }
  onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");
      switch (actionType) {
        case "CompanyName":
          return this.OpenInnewtab(data.CompanyID);
      }
    }
  }
  onGridReady_Test(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.onPageSizeChanged();
    this.httpRequest._NodeGetAllJsonCompnayList().subscribe(res => {
      let data = res.json();
      let ListofCompnayData = data.CompanyList;
      this.skip = this.skip + this.take;
      if (data._Issuccess) {
        this.CompanyrowData = ListofCompnayData;
        this.AllCompnayListdata = ListofCompnayData;
        // setTimeout(() => {
        //   this.httpRequest._NodeGetAllCompnayList(this.take + 12000, this.skip).subscribe(res => {
        //     let data = res.json();
        //     if (data._Issuccess) {
        //       let List = data.CompanyList;
        //       // if (!this.AllCompnayListdata)
        //       //   this.AllCompnayListdata = []
        //       // Array.prototype.push.apply(this.AllCompnayListdata, List);              
        //       this.SetAllCompanyListonGrid(List);
        //     }
        //   }, error => {
        //     console.log(error);
        //   });
        // }, 3000);
      } else {
        this.CompanyrowData = this.fillBlanckRowinGrid();
      }
    }, error => {
      console.log(error);
      setTimeout(() => {
        this.CompanyrowData = this.fillBlanckRowinGrid();
      }, 500);
    });
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.onPageSizeChanged();
    if (!this.MapServiceService._CompanyProfile.getValue()) {
      this.httpRequest._NodeGetAllCompnayList(this.take, (this.skip)).subscribe(res => {
        let data = res.json();
        this.skip = this.skip + this.take;
        if (data._Issuccess) {
          let ListofCompnayData = data.CompanyList;
          this.CompanyrowData = ListofCompnayData;
          this.AllCompnayListdata = ListofCompnayData;
          this.setDataintoservice(ListofCompnayData);
          setTimeout(() => {
            this.httpRequest._NodeGetAllCompnayList(this.take + 12000, this.skip).subscribe(res => {
              let data = res.json();
              if (data._Issuccess) {
                let List = data.CompanyList;
                // if (!this.AllCompnayListdata)
                //   this.AllCompnayListdata = []
                // Array.prototype.push.apply(this.AllCompnayListdata, List);    
                this.setDataintoservice(List);
                // this.SetAllCompanyListonGrid(List);
                this.resetCompanyGrid();
              }
            }, error => {
              console.log(error);
            });
          }, 3000);
        } else {
          this.CompanyrowData = this.fillBlanckRowinGrid();
        }
      }, error => {
        console.log(error);
        setTimeout(() => {
          this.CompanyrowData = this.fillBlanckRowinGrid();
        }, 2000);
      });
    } else {
      this.CompanyrowData = this.MapServiceService._CompanyProfile.getValue();
      this.AllCompnayListdata = this.MapServiceService._CompanyProfile.getValue();
    }
  }
  SetAllCompanyListonGrid(ListofCompnayData) {
    if (!this.AllCompnayListdata)
      this.AllCompnayListdata = []
    Array.prototype.push.apply(this.AllCompnayListdata, ListofCompnayData);
    this.resetCompanyGrid();
  }
  onPageSizeChanged() {
    var value = document.getElementById("page-size")["value"];
    this.gridApi.paginationSetPageSize(Number(value));
  }
  setDataintoservice(data) {
    if (!this.MapServiceService._CompanyProfile.getValue()) {
      this.MapServiceService.setCompanyProfileData(data);
    } else {
      Array.prototype.push.apply(this.MapServiceService._CompanyProfile.getValue(), data);

    }

  }
  Clearallfilters() {
    this.selectedAllFilters.state.length = 0;
    this.selectedAllFilters.commodities.length = 0;
    this.selectedAllFilters.entities.length = 0;
    this.selectedAllFilters.entityType.length = 0;
    this.selectedAllFilters.businessLine.length = 0;
    this.selectedCompanyName = "";
    this.resetCompanyGrid();


  }
  resetCompanyGrid() {
    this.CompanyrowData = null;
    setTimeout(() => {
      this.CompanyrowData = this.AllCompnayListdata;
    }, 500);
  }
  CompanyApplyfilter() {

    let state = "";
    let commodities = "";
    let businessLine = "";
    let entities = "";
    let entityType = "";
    for (let s of this.selectedAllFilters.state) {
      if (state == '') {
        state = s.statecode;
      }
      else {
        state += "," + s.statecode;
      }
    }
    for (let c of this.selectedAllFilters.commodities) {
      if (commodities == '') {
        commodities = c.commodityNumber;
      }
      else {
        commodities += "," + c.commodityNumber;
      }
    }
    for (let c of this.selectedAllFilters.commodities) {
      if (commodities == '') {
        commodities = c.commodityNumber;
      }
      else {
        commodities += "," + c.commodityNumber;
      }
    }
    for (let b of this.selectedAllFilters.businessLine) {
      if (businessLine == '') {
        businessLine = b.businessLineNumber;
      }
      else {
        businessLine += "," + b.businessLineNumber;
      }
    }
    for (let e of this.selectedAllFilters.entities) {
      if (entities == '') {
        entities = e.entityNumber;
      }
      else {
        entities += "," + e.entityNumber;
      }
    }
    for (let et of this.selectedAllFilters.entityType) {
      if (entityType == '') {
        entityType = et.entityTypeNumber;
      }
      else {
        entityType += "," + et.entityTypeNumber;
      }
    }
    if (state || commodities || businessLine || entities || entityType) {
      this.httpRequest._NodeGetCompanySearchResult(state, commodities, entities, entityType, businessLine).subscribe(data => {
        if (data._Issuccess) {
          let searchres = data.FilterCompanyList
          this.CompanyrowData = null;
          if (searchres.length > 0) {
            setTimeout(() => {
              this.CompanyrowData = searchres;
            }, 500);
          } else {
            setTimeout(() => {
              this.CompanyrowData = this.fillBlanckRowinGrid();
            }, 500);
          }
        }
        else {
          this.CompanyrowData = null;
          setTimeout(() => {
            this.CompanyrowData = this.fillBlanckRowinGrid();
          }, 500);
        }
      }, error => {
        //this.resetCompanyGrid();
        this.CompanyrowData = null
        setTimeout(() => {
          this.CompanyrowData = this.fillBlanckRowinGrid();
        }, 500);
        console.log(error);
      });
    }
    else {
      //this.resetCompanyGrid();
      this.CompanyrowData = null
      setTimeout(() => {
        this.CompanyrowData = this.fillBlanckRowinGrid();
      }, 500);
    }
  }

  fillBlanckRowinGrid() {
    let data = [];
    let CompanyKeys = {
      CompanyID: '',
      CompanyName: '',
      Inactive: '',
      CompanyTypeID: '',
      PhyAddress: '',
      PhyCity: '',
      PhyState: '',
      PhyZip: '',
      PhyCountry: '',
      MailingAddress: '',
      MailingCity: '',
      MailingState: '',
      MailingZip: '',
      MailingCountry: '',
      CO_ID: '',
      UtilityID: '',
      powerPlantOwned: '',
      powerPlantOperated: '',
      FERCID: '',
      FacilityOwned: '',
      FacilityOperated: '',
    }
    data.push(CompanyKeys)
    return data;
  }
}
