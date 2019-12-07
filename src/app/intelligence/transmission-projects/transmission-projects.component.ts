import { Component, OnInit } from '@angular/core';
import { IntelligenceService } from '../../services/Intelligence.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyPorfileDetailModalComponent } from '../company-profile-detail-modal/company-profile-detail-modal.component';
import { TransmissionProjectDetailModalComponent } from '../transmission-project-detail-modal/transmission-project-detail-modal.component';
import { HttpRequestService } from '../../services/all-http-request.service';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';
import { MapServiceService } from '../../services/map-service.service';
@Component({
  selector: 'app-transmission-projects',
  templateUrl: './transmission-projects.component.html',
  styleUrls: ['./transmission-projects.component.scss']
})

export class TransmissionProjectsComponent implements OnInit {

  constructor(public IntelligenceService: IntelligenceService,
    private modalService: NgbModal,
    private httpRequest: HttpRequestService,
    private MapServiceService: MapServiceService) { }
  private AllTransmissionProjectListdata;
  AllTransmissionfilterOptionValue: any = {
    ProjectStatus: [],
    YearInService: [],
    NERCRegion: [],
    ISO_RTO: [],
    Voltagetype: [],
    selectedTransmissionCompanyNameorSponesorList: [],
  };
  selectedAllTransmissionFilters: any = {
    ProjectStatus: [],
    YearInService: [],
    NERCRegion: [],
    ISO_RTO: [],
    Voltagetype: [],
  };
  selectedCompanyorSponsorName = '';
  selectedTransmissionpage_sorting = "Project Name";
  LineMilesFrom = "0";
  LineMilesTo = "99999"
  VoltagekVFrom = "0";
  VoltagekVTo = "99999";
  LoaderLink = environment.ImagespreviewPath + "LayerLibraryLoader.gif";
  overlayLoadingTemplate = '<img src="' + this.LoaderLink + '" width="106px" />';
  overlayNoRowsTemplate = '<img src="' + this.LoaderLink + '" width="106px" />';

  public transFilter;
  public rowSelection;

  private transgridApi;
  private transgridColumnApi;
  public TransmissionProjectrowData: any = [];
  public TransmissionProjectcolumnDefs;
  public transmissionpaginationPageSize: number = 100;
  public paginationNumberFormatter;

  ngOnInit() {
    setTimeout(() => {
      this.GetTrasnmissionFilterOption();
      this.GetSuggestiveTransmissionProjectData();
      this.GenerateTransmissionProjectcolumns();
    }, 2000);
  }

  GetTrasnmissionFilterOption() {
    this.httpRequest._NodeGetAllTransmissionProjectFilterOptions().subscribe(res => {
      let data = res.json();
      if (data._Issuccess) {
        let filteropList = data.FilterOptions;
        this.AllTransmissionfilterOptionValue.ProjectStatus.push(filteropList.ProjectStatus);
        this.AllTransmissionfilterOptionValue.YearInService.push(filteropList.ServiceYear);
        this.AllTransmissionfilterOptionValue.NERCRegion.push(filteropList.NERC);
        this.AllTransmissionfilterOptionValue.ISO_RTO.push(filteropList.ISORTO);
        this.AllTransmissionfilterOptionValue.Voltagetype.push(filteropList.VoltageType);
      }
    }, error => { console.log(error) });
  }

  GetSuggestiveTransmissionProjectData() {
    this.httpRequest.GetSuggestiveTransmissionProjectDataResults().subscribe(res => {
      let data = res.json();
      if (data._Issuccess) {
        let CompnaynameorSponsornamelist = data.SuggestiveProjectData;
        this.AllTransmissionfilterOptionValue.selectedTransmissionCompanyNameorSponesorList.push(CompnaynameorSponsornamelist);
      }
    }, error => {
      console.log(error);
    });
  }

  onTransmissionGridReady(params) {
    this.transgridApi = params.api;
    this.transgridColumnApi = params.columnApi;
    if (!this.MapServiceService._TransmissionProjectData.getValue()) {
      this.httpRequest.GetTransmissionProjectsData().subscribe(res => {
        let data = res.json();
        if (data._Issuccess) {
          let List = data.TransmissionData;
          this.MapServiceService.setTransmissionProjectdata(List);
          this.TransmissionProjectrowData = List;
          this.AllTransmissionProjectListdata = List;
          this.onTransmissionPageSizeChanged();
        } else {
          this.TransmissionProjectrowData = this.fillBlankTransmissionProjectRowinGrid();
        }

      }, error => {
        console.log(error);
      });
    }
    else {
      this.TransmissionProjectrowData = this.MapServiceService._TransmissionProjectData.getValue();
      this.AllTransmissionProjectListdata = this.MapServiceService._TransmissionProjectData.getValue();
      this.onTransmissionPageSizeChanged();
    }

  }

  onTransmissionPageSizeChanged() {
    let value = document.getElementById("Transmissionpage-size")["value"];
    this.transgridApi.paginationSetPageSize(Number(value));
  }

  getSortedName() {
    let value = document.getElementById("Transmissionpage-sorting")["value"];
    return value;
  }

  onTransmissionPagesorting() {

    this.TransmissionProjectcolumnDefs = null;
    this.TransmissionProjectrowData = null;
    setTimeout(() => {
      this.GenerateTransmissionProjectcolumns();
      this.TransmissionProjectrowData = this.AllTransmissionProjectListdata;
    }, 2000);
  }

  GenerateTransmissionProjectcolumns() {
    let TransProjectName1Visible = false;
    let TransProjectName2Visible = false;
    let ProjectGroupVisible = false;
    let ProjectPartnersVisible = false;
    let BuildStartVisible = false;
    let CompYearVisible = false;
    let VoltageTypeVisible = false;
    let InterstateVisible = false;
    let NERCVisible = false;
    let ISOVisible = false;
    let OriginPointVisible = false;
    let DestiPointVisible = false;
    let EstCostVisible = false;
    let ServiceYearVisible = false;
    let FromVisible = false;
    let ToVisible = false;
    // if (this.selectedTransmissionpage_sorting == "Project Name") {
    //   TransProjectName1Visible = true;
    //   BuildStartVisible = true;
    //   ProjectGroupVisible = true;
    //   EstCostVisible = true;
    //   ServiceYearVisible = true;
    //   FromVisible = true;
    //   ToVisible = true;
    // }
    // if (this.selectedTransmissionpage_sorting == "Sponsor") {
    //   TransProjectName1Visible = true;
    //   //TransProjectName2Visible = false;
    //   ProjectPartnersVisible = true;
    //   EstCostVisible = true;
    //   ServiceYearVisible = true;
    //   FromVisible = true;
    //   ToVisible = true;
    // }
    // if (this.selectedTransmissionpage_sorting == "Year") {
    //   TransProjectName1Visible = true;
    //   CompYearVisible = true;
    //   VoltageTypeVisible = true;
    //   InterstateVisible = true;
    //   BuildStartVisible = true;
    //   EstCostVisible = true;
    // }
    // if (this.selectedTransmissionpage_sorting == "NERC Region") {
    //   NERCVisible = true;
    //   ISOVisible = true;
    //   TransProjectName1Visible = true;
    //   OriginPointVisible = true;
    //   DestiPointVisible = true;
    //   FromVisible = true;
    //   ToVisible = true;
    // }
    TransProjectName1Visible = true;
    BuildStartVisible = true;
    ProjectGroupVisible = true;
    EstCostVisible = true;
    ServiceYearVisible = true;
    FromVisible = true;
    ToVisible = true;
    ProjectPartnersVisible = true;
    CompYearVisible = true;
    VoltageTypeVisible = true;
    InterstateVisible = true;
    NERCVisible = true;
    ISOVisible = true;
    OriginPointVisible = true;
    DestiPointVisible = true;

    this.TransmissionProjectcolumnDefs = [
      {
        headerName: "TransProjectID",
        field: "TransProjectID",
        width: 10,
        filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        hide: true,

      },
      {
        headerName: "Project Name",
        field: 'TransProjectName',
        hide: !TransProjectName1Visible,
        width: 300,
        cellRenderer: (params) => {
          let _object = params.data.TransProjectName;
          let id = params.data.TransProjectID;
          let DisplayImage = params.data.DisplayImage;
          let html = '';
          if (DisplayImage != null && DisplayImage == true) {
            html = '&nbsp;&nbsp;&nbsp<i class="fa fa-map-marker fa-lg" aria-hidden="true" style="color: red;"></i>';
          }
          return "<a style='color: blue;' href='javascript:void(0)' data-action-type='ProjectName'  data-action-id=" + id + " >" + _object + "</a>" + html;
        },
        filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],

      },
      {
        headerName: "Project Sponsor", field: 'ProjectSponsor',
        hide: false,
        width: 300,
        filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        cellRenderer: (params) => {
          let _object = params.data.ProjectSponsor;
          let id = params.data.CompanyID;
          return "<a style='color: blue;' href='javascript:void(0)'  data-action-type='ProjectSponsor'  data-action-id=" + id + ">" + _object + "</a>"
        }
      },
      { headerName: "NERC Region", field: 'NERC', hide: !NERCVisible, width: 200 },
      { headerName: "ISO RTO", field: 'ISO', hide: !ISOVisible, width: 200 },
      { headerName: "Scheduled Completion Year", field: 'YearCompletion', hide: !CompYearVisible, width: 200 },
      {
        headerName: "Project Name", field: 'TransProjectName', hide: !TransProjectName2Visible, width: 150, filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
      },
      {
        headerName: "Line Miles", field: 'LineMiles', hide: false, width: 100, filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
      },
      {
        headerName: "Voltage (KV)", field: 'Voltage', hide: false, width: 150, filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
      },
      {
        headerName: "Voltage Type", field: 'VoltageType', hide: !VoltageTypeVisible, width: 150, filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
      },
      {
        headerName: "Origin Point", field: 'OriginPoint', hide: !OriginPointVisible, width: 150, filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
      },
      {
        headerName: "Destination Point", field: 'DestinationPoint', hide: !DestiPointVisible, width: 150, filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
      },
      {
        headerName: "Interstate", field: 'InterstateVal', hide: !InterstateVisible, width: 150, filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
      },
      {
        headerName: "From", field: 'From', hide: !FromVisible, width: 80, filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
      },
      {
        headerName: "To", field: 'To', hide: !ToVisible, width: 80, filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
      },
      {
        headerName: "Project Status", field: 'ProjectStatus', hide: false, width: 150, filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
      },
      {
        headerName: "Build Start", field: 'BuildYear', hide: !BuildStartVisible, width: 100, filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
      },
      {
        headerName: "Year In Service", field: 'ServiceYear', hide: !ServiceYearVisible, width: 150, filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
      },
      {
        headerName: "Estimated Costs ($/M)", field: 'EstimatedCosts', hide: !EstCostVisible, width: 150, filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
      },
      {
        headerName: "Project Group", field: 'ProjectGroup', hide: !ProjectGroupVisible, width: 100, filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
      },
      {
        headerName: "Project Partners", field: 'ProjectPartners', hide: !ProjectPartnersVisible, width: 100, filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
      }
    ];
    this.transmissionpaginationPageSize = 100;
    this.paginationNumberFormatter = (params) => {
      return params.value.toLocaleString();
    };
  }

  ClearTransmissionProjectAllfilters() {
    this.selectedAllTransmissionFilters.ProjectStatus.length = 0;
    this.selectedAllTransmissionFilters.YearInService.length = 0;
    this.selectedAllTransmissionFilters.NERCRegion.length = 0;
    this.selectedAllTransmissionFilters.ISO_RTO.length = 0;
    this.selectedAllTransmissionFilters.Voltagetype.length = 0;
    this.LineMilesFrom = "0";
    this.LineMilesTo = "99999"
    this.VoltagekVFrom = "0";
    this.VoltagekVTo = "99999";
    this.selectedCompanyorSponsorName = "";
    this.selectedTransmissionpage_sorting = "Project Name";
    this.resetTransmissionProjectGrid();
  }

  resetTransmissionProjectGrid() {
    this.TransmissionProjectcolumnDefs = null;
    this.TransmissionProjectrowData = null;
    setTimeout(() => {
      this.GenerateTransmissionProjectcolumns();
      this.TransmissionProjectrowData = this.AllTransmissionProjectListdata;
    }, 2000);
  }

  onTransmissionProjectRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");
      switch (actionType) {
        case "ProjectSponsor":
          let id = e.event.target.getAttribute("data-action-id");
          // let cmpname = e.event.target.getAttribute("data-actione-Companyname");
          return this.OpenProjectSponsorInnewtab(id);
        case "ProjectName":
          return this.OpenProjectNAmeInNewTab(data.TransProjectID);

      }
    }
  }

  OpenProjectSponsorInnewtab(CompanyID) {
    // let URL = "../../assets/CompanyProfileDetail.html";
    // URL = URL + "?t=" + CompanyID;
    // window.open(URL, '_blank', 'location=yes,height=600,width=1200,scrollbars=yes,status=yes');

    let URL = "/assets/CompanyProfileDetail.html";
    URL = window.location.origin + URL + "?t=" + CompanyID;
    const modalRef = this.modalService.open(CompanyPorfileDetailModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "CompanyProfileviewDetail" });
    modalRef.componentInstance.URL = URL;

  }

  OpenProjectNAmeInNewTab(Id) {
    // let URL = "../../assets/TransmissionProjectGridSummary.html";    
    // URL = URL + "?t=" + Id;
    // window.open(URL, '_blank', 'location=yes,height=600,width=1200,scrollbars=yes,status=yes');

    let URL = "/assets/TransmissionProjectGridSummary.html";
    URL = window.location.origin + URL + "?t=" + Id;
    const modalRef = this.modalService.open(TransmissionProjectDetailModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "CompanyProfileviewDetail" });
    modalRef.componentInstance.URL = URL;
  }

  TransmissionProjectApplyfilter() {
    var LineMilesRange = [], LineMilesRangeFrom = parseFloat(this.LineMilesFrom), LineMilesRangeTo = parseFloat(this.LineMilesTo);
    var VoltageRange = [], VoltageRangeFrom = parseFloat(this.VoltagekVFrom), VoltageRangeTo = parseFloat(this.VoltagekVTo);

    if (this.selectedAllTransmissionFilters) {
      let ProjectStatus = [];
      let YearInService = [];
      let NERCRegion = [];
      let ISO = [];
      let VoltageType = [];

      let ProjectStatusData;
      let YearInServiceData;
      let NERCRegionData;
      let ISOData;
      let VoltageTypeData;

      for (let s of this.selectedAllTransmissionFilters.ProjectStatus) {
        ProjectStatus.push(s.ProjectStatus);
      }
      for (let s of this.selectedAllTransmissionFilters.YearInService) {
        YearInService.push(s.ServiceYear);
      }
      for (let s of this.selectedAllTransmissionFilters.NERCRegion) {
        NERCRegion.push(s.NERC);
      }
      for (let s of this.selectedAllTransmissionFilters.ISO_RTO) {
        let iso = s.ISO;
        if (s.iso == 'Null') {
          iso = null;
        }
        ISO.push(iso);
      }
      for (let s of this.selectedAllTransmissionFilters.Voltagetype) {
        VoltageType.push(s.VoltageType);
      }

      if (this.selectedAllTransmissionFilters.ProjectStatus.length > 0) {
        ProjectStatusData = this.AllTransmissionProjectListdata.filter((el) => {
          if (el.ProjectStatus != null && el.ProjectStatus != undefined && ProjectStatus.indexOf(el.ProjectStatus.trim()) > -1)
            return el;
        });
      } else { ProjectStatusData = this.AllTransmissionProjectListdata }
      if (this.selectedAllTransmissionFilters.YearInService.length > 0) {
        YearInServiceData = ProjectStatusData.filter((el) => {
          if (el.ServiceYear != null && el.ServiceYear != undefined && YearInService.indexOf(el.ServiceYear) > -1)
            return el;
        });
      } else { YearInServiceData = ProjectStatusData }
      if (this.selectedAllTransmissionFilters.NERCRegion.length > 0) {
        NERCRegionData = YearInServiceData.filter((el) => {
          if (el.NERC != null && el.NERC != undefined && NERCRegion.indexOf(el.NERC.trim()) > -1)
            return el;
        });
      } else { NERCRegionData = YearInServiceData }
      if (this.selectedAllTransmissionFilters.ISO_RTO.length > 0) {
        ISOData = NERCRegionData.filter((el) => {
          if (el.ISO != null && el.ISO != undefined && ISO.indexOf(el.ISO.trim()) > -1)
            return el;
        });
      } else { ISOData = NERCRegionData }
      if (this.selectedAllTransmissionFilters.Voltagetype.length > 0) {
        VoltageTypeData = ISOData.filter((el) => {
          if (el.VoltageType != null && el.VoltageType != undefined && VoltageType.indexOf(el.VoltageType.trim()) > -1)
            return el;
        });
      } else { VoltageTypeData = ISOData }

      for (var i = 0, LineMileslen = VoltageTypeData.length; i < LineMileslen; ++i) {
        var item = VoltageTypeData[i];
        if (item["LineMiles"] >= LineMilesRangeFrom && item["LineMiles"] <= LineMilesRangeTo) {
          LineMilesRange.push(item);
        }
      }
      for (var i = 0, Voltagelen = LineMilesRange.length; i < Voltagelen; ++i) {
        var item = LineMilesRange[i];
        if (item["Voltage"] >= VoltageRangeFrom && item["Voltage"] <= VoltageRangeTo) {
          VoltageRange.push(item);
        }
      }

      if (VoltageRange.length > 0) {
        this.TransmissionProjectrowData = null;
        setTimeout(() => {
          this.TransmissionProjectrowData = VoltageRange;
        }, 1000);
      }
      else {
        setTimeout(() => { this.TransmissionProjectrowData = this.fillBlankTransmissionProjectRowinGrid(); }, 1000);
      }
    } else {
      for (var i = 0, LineMileslen = this.AllTransmissionProjectListdata.length; i < LineMileslen; ++i) {
        var item = this.AllTransmissionProjectListdata[i];
        if (item["LineMiles"] >= LineMilesRangeFrom && item["LineMiles"] <= LineMilesRangeTo) {
          LineMilesRange.push(item);
        }
      }
      for (var i = 0, Voltagelen = LineMilesRange.length; i < Voltagelen; ++i) {
        var item = LineMilesRange[i];
        if (item["Voltage"] >= VoltageRangeFrom && item["Voltage"] <= VoltageRangeTo) {
          VoltageRange.push(item);
        }
      }
    }
    // else { this.resetTransmissionProjectGrid(); }
  }

  fillBlankTransmissionProjectRowinGrid() {
    let TransmissionProjectKeys = {
      TransProjectID: "",
      TransProjectName: "",
      ProjectSponsor: ""
    }
    let data = []
    data.push(TransmissionProjectKeys)
    return data;
  }

  searchTransmissionProjectNameOrSponsor() {
    if (this.selectedCompanyorSponsorName) {
      this.SearchTransmissionProjectData(this.selectedCompanyorSponsorName);
    }
  }

  SearchTransmissionProjectData(SearchTransmissionData) {
    let SearchTransmissionProjectData = this.AllTransmissionProjectListdata.filter((el) => {
      if (el.TransProjectName != null && el.ProjectSponsor != null) {
        if (el.TransProjectName.toLowerCase().indexOf(SearchTransmissionData.toLowerCase().trim()) > -1 || el.ProjectSponsor.toLowerCase().indexOf(SearchTransmissionData.toLowerCase().trim()) > -1) {
          return el;
        }
      }
    });
    this.TransmissionProjectrowData = null
    setTimeout(() => {
      if (SearchTransmissionProjectData.length > 0) {
        this.TransmissionProjectrowData = SearchTransmissionProjectData;
      }
      else {
        this.TransmissionProjectrowData = this.fillBlankTransmissionProjectRowinGrid();
      }
    }, 1000);
  }

  TransmissionProjectTypeheadOnSelect(event) {
    if (event) {
      let val = event.value;
      this.GetTransmissionProjectNameorsponsorId_basedon_search_Value(val);
    }
  }

  GetTransmissionProjectNameorsponsorId_basedon_search_Value(Name) {
    if (Name) {
      let TransProjectID = this.AllTransmissionProjectListdata.filter((el) => {
        if (el.TransProjectName == Name) {
          return el.TransProjectID;
        }
      });
      if (TransProjectID.length > 0) {
        let Id = TransProjectID[0].TransProjectID;
        this.OpenProjectNAmeInNewTab(Id);
        this.searchTransmissionProjectNameOrSponsor();
      }
      else {
        let compnayID = this.AllTransmissionProjectListdata.filter((el) => {
          if (el.ProjectSponsor == Name) {
            return el.TransProjectID;
          }
        });
        if (compnayID.length > 0) {
          let cmpnameid;
          let ProjectSponsor = compnayID[0].ProjectSponsor;
          let cmpid = compnayID[0].CompanyID;
          ProjectSponsor = ProjectSponsor.split('|');
          cmpid = cmpid.split(',');
          for (let i = 0; i < ProjectSponsor.length; i++) {
            let cmpName = ProjectSponsor[i];
            let id = parseInt(cmpid[i]);
            if (cmpName == Name) {
              cmpnameid = id;
            }
          }
          if (cmpnameid) {
            this.OpenProjectSponsorInnewtab(cmpnameid)
            this.searchTransmissionProjectNameOrSponsor();
          }
          else {
            this.searchTransmissionProjectNameOrSponsor()
          }
        }
        else {
          this.searchTransmissionProjectNameOrSponsor()
        }
      }
    }
  }
}
