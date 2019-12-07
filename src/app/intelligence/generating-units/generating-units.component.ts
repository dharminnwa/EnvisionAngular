import { Component, OnInit } from '@angular/core';
import { IntelligenceService } from '../../services/Intelligence.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PowerPlantdetailModalComponent } from '../power-plantdetail-modal/power-plantdetail-modal.component';
import { OperatingUtilitydetailModalComponent } from '../operating-utilitydetail-modal/operating-utilitydetail-modal.component'
import { HttpRequestService } from '../../services/all-http-request.service';
import { environment } from '../../../environments/environment';
import { MapServiceService } from '../../services/map-service.service';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-generating-units',
  templateUrl: './generating-units.component.html',
  styleUrls: ['./generating-units.component.scss'],
  providers: [NgbModal]
})
export class GeneratingUnitsComponent implements OnInit {

  constructor(public IntelligenceService: IntelligenceService,
    private modalService: NgbModal,
    private httpRequest: HttpRequestService,
    private MapServiceService: MapServiceService) { }

  private AllGeneratingUnitListdata;
  AllGeneratingUnitfilterOptionValue: any = {
    state: [],
    nercRegion: [],
    primeMover: [],
    status: [],
    primaryFuelType: [],
    selectedGeneratingUnitNameList: [],
  };
  selectedAllGeneratingUnitFilters: any = {
    state: [],
    nercRegion: [],
    primeMover: [],
    status: [],
    primaryFuelType: []
  };

  selectedGeneratingUnitName = '';;
  OnlineYearFrom = "1856";
  OnlineYearTo = "2030";
  NameplateCapacityFrom = "0";
  NameplateCapacityTo = "99999";
  SummerCapacityFrom = "0";
  SummerCapacityTo = "99999";

  public GenUnitFilter;
  public rowSelection;
  public content;

  private gridApi;
  private gridColumnApi;
  public GeneratingUnitsrowData: any = [];
  public GeneratingUnitsColumnDefs;
  public paginationPageSize;
  public paginationNumberFormatter;
  private PowerPlantModelURL = "../../assets/PowerPlantdetail.html";
  // private statusDisplay = [
  //   { 'statusValue': 'Proposed', 'Status': 'Pending Approval' },
  //   { 'statusValue': 'Idle/Inactive', 'Status': 'Out of Service ST' },
  //   { 'statusValue': 'Active', 'Status': 'Operating' },
  //   { 'statusValue': 'Proposed', 'Status': 'Other Planned' },
  //   { 'statusValue': 'Proposed', 'Status': 'Planned' },
  //   { 'statusValue': 'Active', 'Status': 'Standby' },
  //   { 'statusValue': 'Proposed', 'Status': 'Regulatory Appr' },
  //   { 'statusValue': 'Proposed', 'Status': 'Testing' },
  //   { 'statusValue': 'Under Construction', 'Status': 'Under Constr <50%' },
  //   { 'statusValue': 'Under Construction', 'Status': 'Under Constr >50%' },
  // ];

  LoaderLink = environment.ImagespreviewPath + "LayerLibraryLoader.gif";
  overlayLoadingTemplate = '<img src="' + this.LoaderLink + '" width="106px" />';
  overlayNoRowsTemplate = '<img src="' + this.LoaderLink + '" width="106px" />';

  ngOnInit() {
    setTimeout(() => {
      this.GetAllGeneratingUnitOptions();
      this.GetSuggestiveGeneratingUnitData();
      this.GenerateGeneratingUnitcolumns();
    }, 4000);

  }

  GetAllGeneratingUnitOptions() {
    this.httpRequest._NodeGetAllGeneratingUnitOptions().subscribe(res => {
      let data = res.json();
      if (data._Issuccess) {
        let filteropList = data.FilterOptionData;
        for (var i = filteropList.nerc.length - 1; i >= 0; --i) {
          if (filteropList.nerc[i].NERCRegionCode == "" || filteropList.nerc[i].NERCRegionCode == null) {
            filteropList.nerc.splice(i, 1);
          }
        }
        this.AllGeneratingUnitfilterOptionValue.state.push(filteropList.sates);
        this.AllGeneratingUnitfilterOptionValue.nercRegion.push(filteropList.nerc);
        this.AllGeneratingUnitfilterOptionValue.primeMover.push(filteropList.primeMover);
        this.AllGeneratingUnitfilterOptionValue.status.push(filteropList.statusDisplay);
        this.AllGeneratingUnitfilterOptionValue.primaryFuelType.push(filteropList.fuelType);
      }
    }, error => {
      console.log(error);
    });
  }

  // GetAllGeneratingUnitList(skip) {
  //   this.httpRequest.GetAllGeneratingUnitList(skip).subscribe(data => {
  //     let ListofGeneratingUnitData = JSON.parse(data.text());
  //     if (skip == 0 && this.GeneratingUnitsrowData.length == 0) {
  //       this.GeneratingUnitsrowData = ListofGeneratingUnitData;
  //     }
  //     else {
  //       Array.prototype.push.apply(this.GeneratingUnitsrowData, ListofGeneratingUnitData);
  //     }
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  GenerateGeneratingUnitcolumns() {
    this.GeneratingUnitsColumnDefs = [
      {
        headerName: "unitID",
        field: "UnitID",
        width: 10,
        filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        hide: true,
      },
      {
        headerName: "powerID",
        field: "PowerID",
        width: 10,
        filterParams: { newRowsAction: "keep" },
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        hide: true,
      },
      {
        headerName: 'Operating Utility',
        field: 'OperatingUtility',
        width: 265,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        cellRenderer: (params) => {
          let _object = params.data.OperatingUtility;
          let CompID = params.data.CompanyID;
          return "<a style='color: blue;' href='javascript:void(0)' data-action-type='operatingUtility'>" + _object + "</a>"
        }
      },
      {
        headerName: "Power Plant",
        field: "PowerPlant",
        width: 265,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        //filterParams: { newRowsAction: "keep" },
        cellRenderer: (params) => {
          let html = "";
          let powerPlant = params.data.PowerPlant;
          var PowerID = params.data.PowerID;
          let cmpid = params.data.CompanyID;
          if (powerPlant != null && cmpid != null) {
            powerPlant = powerPlant.split('|');
            for (let i = 0; i < powerPlant.length; i++) {
              let cmpName = powerPlant[i];
              let id = cmpid;
              if (powerPlant.length > 0) {
                id = parseInt(cmpid[i]);
              }
              if (html == "") {
                html = "<div><a style='color: blue;' href='javascript:void(0)' data-action-type='powerPlant' data-action-id=" + id + " data-actione-Companyname=" + cmpName + ">" + cmpName + "</a>"
              } else {
                html += " , " + "<a style='color: blue;' href='javascript:void(0)' data-action-type='powerPlant' data-action-id=" + id + " data-actione-Companyname=" + cmpName + ">" + cmpName + "</a>"
              }
            }
            html += "</div>";
          }
          return html;
        }
      },
      {
        headerName: "State",
        field: "State",
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        width: 130,
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "Generator",
        field: "Generator",
        width: 150,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "Prime Mover",
        field: "PrimeMover",
        width: 150,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "Status",
        field: "Status",
        width: 130,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "Capacity<br/>(MW)",
        field: "Capacity",
        width: 130,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "Summer Capacity<br/>(MW)",
        field: "SummerCapacity",
        width: 130,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "Online Year",
        field: "OnlineYear",
        width: 130,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "Primary Fuel",
        field: "PrimaryFuel",
        width: 130,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      }];
    this.paginationPageSize = 100;
    this.paginationNumberFormatter = (params) => {
      return params.value.toLocaleString();
    };
  }
  onGeneratingUnitGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.onGeneratingUnitPageSizeChanged();
    if (!this.MapServiceService._GeneratingUnitsData.getValue()) {
      this.httpRequest._NodeGetAllGeneratingUnitList(15000, 0).subscribe(res => {
        let data = res.json();
        if (data._Issuccess) {
          let ListofGeneratingUnitData = data.GetGeneratingUnitsData;
          this.setDataintoGenearatingservice(ListofGeneratingUnitData);
          this.GeneratingUnitsrowData = ListofGeneratingUnitData;
          this.AllGeneratingUnitListdata = ListofGeneratingUnitData;
          setTimeout(() => {
            this.httpRequest._NodeGetAllGeneratingUnitList(20000, 15000).subscribe(res => {
              let data = res.json();
              if (data._Issuccess) {
                let List = data.GetGeneratingUnitsData;
                //Array.prototype.push.apply(ListofGeneratingUnitData, List);
                this.setDataintoGenearatingservice(List);
                // this.GeneratingUnitsrowData = ListofGeneratingUnitData;
                // this.AllGeneratingUnitListdata = ListofGeneratingUnitData;
                this.resetGeneratingUnitGrid();
              }
            }, error => {
            });
          }, 3000);
        }
      }, error => {
        console.log(error);
      });
    }
    else {
      this.GeneratingUnitsrowData = this.MapServiceService._GeneratingUnitsData.getValue();
      this.AllGeneratingUnitListdata = this.MapServiceService._GeneratingUnitsData.getValue();
    }

  }
  setDataintoGenearatingservice(data) {
    if (!this.MapServiceService._GeneratingUnitsData.getValue()) {
      this.MapServiceService.setGeneraryingUnitsdata(data);
    } else {
      Array.prototype.push.apply(this.MapServiceService._GeneratingUnitsData.getValue(), data);

    }
  }
  onGeneratingUnitPageSizeChanged() {
    var value = document.getElementById("GeneratingUnitpage-size")["value"];
    this.gridApi.paginationSetPageSize(Number(value));
  }

  ClearGeneratingUnitallfilters() {
    this.selectedAllGeneratingUnitFilters.state.length = 0;
    this.selectedAllGeneratingUnitFilters.nercRegion.length = 0;
    this.selectedAllGeneratingUnitFilters.primeMover.length = 0;
    this.selectedAllGeneratingUnitFilters.status.length = 0;
    this.selectedAllGeneratingUnitFilters.primaryFuelType.length = 0;

    this.OnlineYearFrom = "1856";
    this.OnlineYearTo = "2030";
    this.NameplateCapacityFrom = "0";
    this.NameplateCapacityTo = "99999";
    this.SummerCapacityFrom = "0";
    this.SummerCapacityTo = "99999";
    this.selectedGeneratingUnitName = "";

    this.resetGeneratingUnitGrid();
  }

  resetGeneratingUnitGrid() {
    this.GeneratingUnitsrowData = null;
    setTimeout(() => {
      this.GeneratingUnitsrowData = this.AllGeneratingUnitListdata;
    }, 2000);
  }




  GeneratingUnitsTypeaheadOnSelect(event, content) {
    if (event) {
      let val = event.value;
      this.GetPowerPlantorUtility_basedon_search_Value(val, content);
    }
  }
  GetPowerPlantorUtility_basedon_search_Value(Name, content) {
    if (Name) {
      let companyID = this.AllGeneratingUnitListdata.filter((el) => {
        if (el.OperatingUtility == Name) {
          return el.CompanyID;
        }
      });
      if (companyID.length > 0) {
        let CompanyID = companyID[0].CompanyID;
        this.OpenOperatingUtilityInNewTab(CompanyID);
        this.searchGeneratingUnitUtilityOrPowerPlant();
      }
      else {
        let PowerID = this.AllGeneratingUnitListdata.filter((el) => {
          if (el.PowerPlant == Name) {
            return el.PowerPlant;
          }
        });
        if (PowerID.length > 0) {
          let cmpnameid;
          let powerPlant = PowerID[0].PowerPlant;
          let powerID = PowerID[0].PowerID;
          let company_ID = PowerID[0].CompanyID;

          powerPlant = powerPlant.split('|');
          for (let i = 0; i < powerPlant.length; i++) {
            let cmpName = powerPlant[i];
            let id = parseInt(powerID);
            if (cmpName == Name) {
              cmpnameid = id;
            }
          }
          if (cmpnameid) {
            this.OpenPowerPlantInnewtab(powerID, company_ID, content)
            this.searchGeneratingUnitUtilityOrPowerPlant();
          }
          else {
            this.searchGeneratingUnitUtilityOrPowerPlant()
          }
        }
        else {
          this.searchGeneratingUnitUtilityOrPowerPlant()
        }
      }
    }
  }
  searchGeneratingUnitUtilityOrPowerPlant() {
    if (this.selectedGeneratingUnitName) {
      this.SearchPowerPlantData(this.selectedGeneratingUnitName);
    }
  }
  SearchPowerPlantData(SearchPlantData) {
    let SearchPowerPlantData = this.AllGeneratingUnitListdata.filter((el) => {
      if (el.PowerPlant != null && el.OperatingUtility != null) {
        if (el.PowerPlant.toLowerCase().indexOf(SearchPlantData.toLowerCase().trim()) > -1 || el.OperatingUtility.toLowerCase().indexOf(SearchPlantData.toLowerCase().trim()) > -1) {
          return el;
        }
      }
    });
    this.GeneratingUnitsrowData = null
    setTimeout(() => {
      if (SearchPowerPlantData.length > 0) {
        this.GeneratingUnitsrowData = SearchPowerPlantData;
      }
      else {
        this.GeneratingUnitsrowData = this.fillBlankGeneratingRowinGrid();
      }
    }, 1000);
  }

  fillBlankGeneratingRowinGrid() {
    let PowerPlantKeys = {
      PowerID: "",
      PowerPlant: "",
      OperatingUtility: "",
      CompanyID: ""
    }
    let data = []
    data.push(PowerPlantKeys)
    return data;
  }
  onGeneratingUnitRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");
      switch (actionType) {
        case "powerPlant":
          return this.OpenPowerPlantInnewtab(data.PowerID, data.CompanyID, e.content);
        case "operatingUtility":
          return this.OpenOperatingUtilityInNewTab(data.CompanyID);

      }
    }
  }
  OpenPowerPlantInnewtab(PowerID, CompanyID, content) {
    // let URL = "../../assets/PowerPlantdetail.html";
    // URL = URL + "?p=" + PowerID + "&c=" + CompanyID + "&Type=Power";
    // window.open(URL, '_blank', 'location=yes,height=600,width=1200,scrollbars=yes,status=yes');

    let URL = "/assets/PowerPlantdetail.html";
    URL = window.location.origin + URL + "?p=" + PowerID + "&c=" + CompanyID + "&Type=Power";
    const modalRef = this.modalService.open(PowerPlantdetailModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "powerplant" });
    modalRef.componentInstance.URL = URL;
  }

  OpenOperatingUtilityInNewTab(companyID) {
    // let URL = "../../assets/OperatingUtilitydetail.html";
    // URL = URL + "?t=" + companyID;
    // window.open(URL, '_blank', 'location=yes,height=600,width=1200,scrollbars=yes,status=yes');

    let URL = "/assets/OperatingUtilitydetail.html";
    URL = window.location.origin + URL + "?t=" + companyID;
    const modalRef = this.modalService.open(OperatingUtilitydetailModalComponent, { size: 'lg', centered: false, backdrop: 'static', windowClass: "powerplant" });
    modalRef.componentInstance.URL = URL;
  }
  GetSuggestiveGeneratingUnitData() {
    this.httpRequest._NodeGetSuggestiveGeneratingUnitsResults().subscribe(res => {
      let data = res.json();
      if (data._Issuccess) {
        let GeneratingUnitUtilityOrPowerPlantList = data.SuggestiveeGeneratingUnitsData;
        this.AllGeneratingUnitfilterOptionValue.selectedGeneratingUnitNameList.push(GeneratingUnitUtilityOrPowerPlantList);
      }
    }, error => {
      console.log(error);
    });
  }
  GeneratingUnitApplyfilter() {    
    if (this.selectedAllGeneratingUnitFilters) {
      let State = [];
      let NERCRegion = [];
      let PrimaryPlantFuel = [];
      let status = [];
      let primaryFuel = [];

      let StateData;
      let NERCRegionData;
      let PrimaryPlantFuelData;
      let statusData;
      let primaryFuelData;

      for (let s of this.selectedAllGeneratingUnitFilters.state) {
        State.push(s.StateCode);
      }
      for (let s of this.selectedAllGeneratingUnitFilters.nercRegion) {
        NERCRegion.push(s.NERCRegionCode);
      }
      for (let s of this.selectedAllGeneratingUnitFilters.primeMover) {
        PrimaryPlantFuel.push(s.PrimeMover);
      }
      for (let s of this.selectedAllGeneratingUnitFilters.status) {
        status.push(s.Status.trim());
      }
      for (let s of this.selectedAllGeneratingUnitFilters.primaryFuelType) {
        primaryFuel.push(s.FuelTypeCode.trim());
      }

      if (this.selectedAllGeneratingUnitFilters.state.length > 0) {
        StateData = this.AllGeneratingUnitListdata.filter((el) => {
          if (el.State != null && el.State != undefined && State.indexOf(el.State.trim()) > -1)
            return el;
        });
      } else { StateData = this.AllGeneratingUnitListdata }
      if (this.selectedAllGeneratingUnitFilters.nercRegion.length > 0) {
        NERCRegionData = StateData.filter((el) => {
          if (el.NERC != null && el.NERC != undefined && NERCRegion.indexOf(el.NERC.trim()) > -1)
            return el;
        });
      } else { NERCRegionData = StateData }
      if (this.selectedAllGeneratingUnitFilters.primeMover.length > 0) {
        PrimaryPlantFuelData = NERCRegionData.filter((el) => {
          if (el.PrimeMover != null && el.PrimeMover != undefined && PrimaryPlantFuel.indexOf(el.PrimeMover.trim()) > -1)
            return el;
        });
      } else { PrimaryPlantFuelData = NERCRegionData }
      if (this.selectedAllGeneratingUnitFilters.status.length > 0) {
        statusData = PrimaryPlantFuelData.filter((el) => {
          if (el.Status != null && el.Status != undefined && status.indexOf(el.Status.trim()) > -1)
            return el;
        });
      } else { statusData = PrimaryPlantFuelData }

      if (this.selectedAllGeneratingUnitFilters.primaryFuelType.length > 0) {
        primaryFuelData = statusData.filter((el) => {
          if (el.PrimaryFuel != null && el.PrimaryFuel != undefined && primaryFuel.indexOf(el.PrimaryFuel.trim()) > -1)
            return el;
        });
      } else { primaryFuelData = statusData }
      let OnlineYearData;
      if (parseInt(this.OnlineYearFrom) >= 0 && parseInt(this.OnlineYearTo) >= 0) {
        OnlineYearData = primaryFuelData.filter((el) => {
          return parseInt(el.OnlineYear) >= parseInt(this.OnlineYearFrom) && parseInt(el.OnlineYear) <= parseInt(this.OnlineYearTo)
        })
      }
      else
        OnlineYearData = primaryFuelData;

      var NamePlateCapacityData;
      if (parseInt(this.NameplateCapacityFrom) >= 0 && parseInt(this.NameplateCapacityTo) >= 0) {
        NamePlateCapacityData = OnlineYearData.filter((el) => {
          return parseInt(el.Capacity) >= parseInt(this.NameplateCapacityFrom) && parseInt(el.Capacity) <= parseInt(this.NameplateCapacityTo)
        })
      }
      else
        NamePlateCapacityData = OnlineYearData;

      var SummerCapacityData;
      if (parseInt(this.SummerCapacityFrom) >= 0 && parseInt(this.SummerCapacityTo) >= 0) {
        SummerCapacityData = NamePlateCapacityData.filter((el) => {
          return parseInt(el.SummerCapacity) >= parseInt(this.SummerCapacityFrom) && parseInt(el.SummerCapacity) <= parseInt(this.SummerCapacityTo)
        })
      }
      else
        SummerCapacityData = NamePlateCapacityData;


      if (SummerCapacityData.length > 0) {
        this.GeneratingUnitsrowData = null;
        setTimeout(() => {
          this.GeneratingUnitsrowData = SummerCapacityData;
        }, 1000);
      }
      else {
        this.GeneratingUnitsrowData = null
        setTimeout(() => { this.GeneratingUnitsrowData = this.fillBlankGeneratingRowinGrid(); }, 1000);
      }
    }
  }
}