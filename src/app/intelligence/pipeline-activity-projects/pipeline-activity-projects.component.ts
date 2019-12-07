import { Component, OnInit } from '@angular/core';
import { IntelligenceService } from '../../services/Intelligence.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyPorfileDetailModalComponent } from '../company-profile-detail-modal/company-profile-detail-modal.component'
import { PipelineActivityProjectModalComponent } from '../pipeline-activity-project-modal/pipeline-activity-project-modal.component';
import { HttpRequestService } from '../../services/all-http-request.service';
import { environment } from '../../../environments/environment';
import { MapServiceService } from '../../services/map-service.service';
@Component({
  selector: 'app-pipeline-activity-projects',
  templateUrl: './pipeline-activity-projects.component.html',
  styleUrls: ['./pipeline-activity-projects.component.scss']
})
export class PipelineActivityProjectsComponent implements OnInit {

  constructor(public IntelligenceService: IntelligenceService,
    private modalService: NgbModal,
    private httpRequest: HttpRequestService,
    private MapServiceService: MapServiceService) { }
  private AllpipelineActivityListdata;
  AllPipelinefilterOptionValue: any = {
    state: [],
    commodities: [],
    ProjectStatus: [],
    selectedPipelineCompanyNameList: []
  };
  selectedPipelineAllFilters: any = {
    state: [],
    commodities: [],
    ProjectStatus: []
  };
  selectedPipelineCompanyName = '';

  public pipelineFilter;
  public rowSelection;

  private gridApi;
  private gridColumnApi;
  public PipelineActivityrowData: any = [];
  public PipelinecolumnDefs;
  public paginationPageSize;
  public paginationNumberFormatter;
  LoaderLink = environment.ImagespreviewPath + "LayerLibraryLoader.gif";
  overlayLoadingTemplate = '<img src="' + this.LoaderLink + '" width="106px" />'
  overlayNoRowsTemplate = '<img src="' + this.LoaderLink + '" width="106px" />'

  ngOnInit() {
    setTimeout(() => {
      this.GetAllPipelineActivityFilterOptions();
      this.GetSuggestiveCompanyData();
      this.GeneratePipelinecolumns();
    }, 2000);

  }
  Clearallfilters() {
    this.selectedPipelineAllFilters.state.length = 0;
    this.selectedPipelineAllFilters.commodities.length = 0;
    this.selectedPipelineAllFilters.ProjectStatus.length = 0;
    this.selectedPipelineCompanyName = "";
    this.resetPiplelineActivityGrid();


  }
  GetSuggestiveCompanyData() {
    this.httpRequest._NodeGetSuggestivePipelineActivityResults().subscribe(res => {
      let data = res.json();
      if (data._Issuccess) {
        let Pipelinenamelist = data.GetSuggestivePipelineActivityResults;
        this.AllPipelinefilterOptionValue.selectedPipelineCompanyNameList.push(Pipelinenamelist);
      } else {
        console.log(data.errormsg);
      }
    }, error => {
      console.log(error);
    });
  }
  PipelineActicvtytypeaheadOnSelect(event) {
    if (event) {
      let val = event.value;
      this.GetProjectNameorsponsorId_basedon_search_Value(val);
      // let CompanyID = this.AllCompnayListdata.filter((el) => {
      //   if (el.CompanyName.toLowerCase() == CompanyName.toLowerCase()) {
      //     return el.CompanyID;
      //   }
      // });
      // if (CompanyID) {
      //   var Id = CompanyID[0].CompanyID;
      //   this.OpenInnewtab(Id);
      // }
      // this.SearchDisplayGridData(CompanyName);
    }
  }
  GetAllPipelineActivityFilterOptions() {
    this.httpRequest._NodeGetPiplelinefilterOptions().subscribe(res => {
      let data = res.json();
      if (data._Issuccess) {
        let filteropList = data.GetAllCompanyOptions;
        let comoditylist = [];
        let projectstatuslist = [];
        for (let c of filteropList.Commodities) {
          let comodityval = {
            comodity: c.Commodity
          }
          comoditylist.push(comodityval);
        }
        for (let p of filteropList.Projectstatus) {
          let projectstatusval = {
            projectstatusval: p.Status
          }
          if (projectstatusval.projectstatusval == null) {
            projectstatusval.projectstatusval = "Null";
          }
          projectstatuslist.push(projectstatusval)
        }
        this.AllPipelinefilterOptionValue.commodities.push(comoditylist);
        this.AllPipelinefilterOptionValue.ProjectStatus.push(projectstatuslist);
        this.AllPipelinefilterOptionValue.state.push(filteropList.state);
      } else {
        console.log(data.errormsg);
      }
    }, error => {
      console.log(error);
    });
  }
  GeneratePipelinecolumns() {
    this.PipelinecolumnDefs = [
      {
        headerName: "IndustryUpdateID",
        field: "IndustryUpdateID",
        width: 10,
        filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        hide: true,
      },
      {
        headerName: 'Project Name',
        field: 'ProjectName',
        width: 450,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        cellRenderer: (params) => {
          let _object = params.data.ProjectName;
          let id = params.data.IndustryUpdateID;
          return "<a style='color: blue;' href='javascript:void(0)' data-action-type='ProjectName'>" + _object + "</a>"
        }
      },
      {
        headerName: "Project Sponsor",
        field: "HoldingCompany",
        width: 450,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        //filterParams: { newRowsAction: "keep" },
        cellRenderer: (params) => {

          let html = "";
          let HoldingCompany = params.data.HoldingCompany;
          let cmpid = params.data.CompanyID;
          if (HoldingCompany != null && cmpid != null) {
            HoldingCompany = HoldingCompany.split('|');
            cmpid = cmpid.split(',');
            for (let i = 0; i < HoldingCompany.length; i++) {
              let cmpName = HoldingCompany[i];
              let id = parseInt(cmpid[i]);
              if (html == "") {
                html = "<div><a style='color: blue;' href='javascript:void(0)' data-action-type='ProjectSponsor' data-action-id=" + id + " data-actione-Companyname=" + cmpName + ">" + cmpName + "</a>"
              } else {
                html += " , " + "<a style='color: blue;' href='javascript:void(0)' data-action-type='ProjectSponsor' data-action-id=" + id + " data-actione-Companyname=" + cmpName + ">" + cmpName + "</a>"
              }
            }
            html += "</div>";

          }
          return html;
          //return "<a style='color: blue;' href='javascript:void(0)' data-action-type='ProjectSponsor'>" + _object + "</a>"
        }
      },
      {
        headerName: "Project Status",
        field: "Status",
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        width: 250,
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "Commodity",
        field: "Commodities",
        width: 250,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "State",
        field: "StateName",
        width: 250,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      }];
    this.paginationPageSize = 100;
    this.paginationNumberFormatter = (params) => {
      return params.value.toLocaleString();
    };
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.onPipelineActicityPageSizeChanged();
    if (!this.MapServiceService._PipelineActivityData.getValue()) {
      this.httpRequest._NodeGetPipelineActivityGridDataURL().subscribe(res => {
        let data = res.json();
        let ListofPipelineActivity = data.ListofIndustryUpdates;
        this.MapServiceService.setPipelineActivityData(ListofPipelineActivity);
        this.PipelineActivityrowData = ListofPipelineActivity;
        this.AllpipelineActivityListdata = ListofPipelineActivity;
      }, error => {
        console.log(error);
        this.PipelineActivityrowData = this.fillBlanckPipelineRowinGrid();
      });
    } else {
      this.PipelineActivityrowData = this.MapServiceService._PipelineActivityData.getValue();
      this.AllpipelineActivityListdata = this.MapServiceService._PipelineActivityData.getValue();
    }
  }
  onPipelineActicityPageSizeChanged() {
    let value = document.getElementById("PileLineActivitypage-size")["value"];
    this.gridApi.paginationSetPageSize(Number(value));
  }
  resetPiplelineActivityGrid() {
    this.PipelineActivityrowData = null;
    setTimeout(() => {
      this.PipelineActivityrowData = this.AllpipelineActivityListdata;
    }, 2000);
  }
  onPipelineActicityRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");
      switch (actionType) {
        case "ProjectSponsor":
          let id = e.event.target.getAttribute("data-action-id");
          let cmpname = e.event.target.getAttribute("data-actione-Companyname");
          return this.OpenProjectSponsorInnewtab(id);
        case "ProjectName":
          return this.OpenProjectNAmeInNewTab(data.IndustryUpdateID);

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
    // let URL = "../../assets/PipelineActivityProjectName.html";
    // URL = URL + "?t=" + Id;
    // window.open(URL, '_blank', 'location=yes,height=600,width=1200,scrollbars=yes,status=yes');

    let URL = "/assets/PipelineActivityProjectName.html";
    URL = window.location.origin + URL + "?t=" + Id;
    const modalRef = this.modalService.open(PipelineActivityProjectModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "CompanyProfileviewDetail" });
    modalRef.componentInstance.URL = URL;

  }
  searchCompnayName() {
    if (this.selectedPipelineCompanyName) {
      this.SearchPipelineActivityData(this.selectedPipelineCompanyName);
    }
  }
  SearchPipelineActivityData(SearchActivityData) {
    let SearchPipelineData = this.AllpipelineActivityListdata.filter((el) => {
      if (el.ProjectName != null && el.HoldingCompany != null) {
        if (el.ProjectName.toLowerCase().indexOf(SearchActivityData.toLowerCase().trim()) > -1 || el.HoldingCompany.toLowerCase().indexOf(SearchActivityData.toLowerCase().trim()) > -1) {
          return el;
        }
      }
    });
    this.PipelineActivityrowData = null
    setTimeout(() => {
      if (SearchPipelineData.length > 0) {
        this.PipelineActivityrowData = SearchPipelineData;
      }
      else {
        this.PipelineActivityrowData = this.fillBlanckPipelineRowinGrid();
      }
    }, 1000);
  }

  fillBlanckPipelineRowinGrid() {
    let PipelineKeys = {
      IndustryUpdateID: "",
      ProjectName: "",
      HoldingCompany: "",
      Status: "",
      Commodities: "",
      StateName: "",
    }
    let data = []
    data.push(PipelineKeys)
    return data;
  }

  PipelineActivityApplyfilter() {

    if (this.selectedPipelineAllFilters) {
      let state = [];
      let ProjectStatus = [];
      let Comodity = [];
      let StateData;
      let ComodityList;
      let ActivitytStatusData;
      for (let s of this.selectedPipelineAllFilters.state) {
        state.push(s.stateProvince);
      }
      for (let p of this.selectedPipelineAllFilters.ProjectStatus) {
        let projectstatusval = p.projectstatusval
        if (p.projectstatusval == 'Null') {
          projectstatusval = null;
        }
        ProjectStatus.push(projectstatusval);
      }
      for (let c of this.selectedPipelineAllFilters.commodities) {

        Comodity.push(c.comodity);
      }
      if (this.selectedPipelineAllFilters.state.length > 0) {
        StateData = this.AllpipelineActivityListdata.filter((el) => {
          if (el.StateName != null && el.StateName != undefined && state.indexOf(el.StateName.trim()) > -1)
            return el;
        });
      }
      else {
        StateData = this.AllpipelineActivityListdata;
      }
      if (this.selectedPipelineAllFilters.commodities.length > 0) {
        ComodityList = StateData.filter((el) => {
          if (el.Commodities != null && el.Commodities != undefined && Comodity.indexOf(el.Commodities.trim()) > -1)
            return el;
        });
      } else { ComodityList = StateData }
      if (this.selectedPipelineAllFilters.ProjectStatus.length > 0) {
        ActivitytStatusData = ComodityList.filter((el) => {
          if (el.Status != null && el.Status != undefined && ProjectStatus.indexOf(el.Status.trim()) > -1)
            return el;
          else if (el.Status == null || el.Status == undefined)
            return el;
        });
      }
      else {
        ActivitytStatusData = ComodityList;
      }
      if (ActivitytStatusData.length > 0) {
        this.PipelineActivityrowData = null;
        setTimeout(() => {
          this.PipelineActivityrowData = ActivitytStatusData;
        }, 1000);
      }
      else {
        this.PipelineActivityrowData = null
        setTimeout(() => { this.PipelineActivityrowData = this.fillBlanckPipelineRowinGrid(); }, 1000);
      }

    } else { this.resetPiplelineActivityGrid(); }
  }
  GetProjectNameorsponsorId_basedon_search_Value(Name) {
    if (Name) {
      let IndustryUpdateID = this.AllpipelineActivityListdata.filter((el) => {
        if (el.ProjectName == Name) {
          return el.IndustryUpdateID;
        }
      });
      if (IndustryUpdateID.length > 0) {
        let Id = IndustryUpdateID[0].IndustryUpdateID;
        this.OpenProjectNAmeInNewTab(Id);
        this.searchCompnayName();
      }
      else {
        let compnayID = this.AllpipelineActivityListdata.filter((el) => {
          if (el.HoldingCompany == Name) {
            return el.IndustryUpdateID;
          }
        });
        if (compnayID.length > 0) {
          let cmpnameid;
          let HoldingCompany = compnayID[0].HoldingCompany;
          let cmpid = compnayID[0].CompanyID;
          HoldingCompany = HoldingCompany.split('|');
          cmpid = cmpid.split(',');
          for (let i = 0; i < HoldingCompany.length; i++) {
            let cmpName = HoldingCompany[i];
            let id = parseInt(cmpid[i]);
            if (cmpName == Name) {
              cmpnameid = id;
            }
          }
          if (cmpnameid) {
            this.OpenProjectSponsorInnewtab(cmpnameid)
            //showCompanyDataModalTest(cmpnameid);
          }
          else {
            this.searchCompnayName()
          }
        }
        else {
          this.searchCompnayName()
        }
      }
    }
  }
}
