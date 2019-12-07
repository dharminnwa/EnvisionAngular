import { Component, OnInit } from '@angular/core';
import { IntelligenceService } from '../../services/Intelligence.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PowerPlantdetailModalComponent } from '../power-plantdetail-modal/power-plantdetail-modal.component';
import { OperatingUtilitydetailModalComponent } from '../operating-utilitydetail-modal/operating-utilitydetail-modal.component'
import { HttpRequestService } from '../../services/all-http-request.service';
import { environment } from '../../../environments/environment';
import { MapServiceService } from '../../services/map-service.service';
@Component({
  selector: 'app-power-plants',
  templateUrl: './power-plants.component.html',
  styleUrls: ['./power-plants.component.scss']
})
export class PowerPlantsComponent implements OnInit {

  constructor(public IntelligenceService: IntelligenceService,
    private modalService: NgbModal,
    private httpRequest: HttpRequestService,
    private MapServiceService: MapServiceService) { }

  private AllPowerPlantListdata;
  AllPowerPlantFilterOptionValue: any = {
    State: [],
    NERCRegion: [],
    PrimaryPlantFuel: [],
    Sector: [],
    ISO_RTO: [],
    selectedPowerPlantNameOrUtilityList: [],
  };
  selectedAllPowerPlantFilters: any = {
    State: [],
    NERCRegion: [],
    PrimaryPlantFuel: [],
    Sector: [],
    ISO_RTO: [],
  };
  selectedPowerPlantNameOrUtility = '';
  CapacityFrom = "0";
  CapacityTo = "99999"
  NetGenerationFrom = "0";
  NetGenerationTo = "99999";
  Regulated = true;
  NonRegulated = true;

  LoaderLink = environment.ImagespreviewPath + "LayerLibraryLoader.gif";
  overlayLoadingTemplate = '<img src="' + this.LoaderLink + '" width="106px" />';
  overlayNoRowsTemplate = '<img src="' + this.LoaderLink + '" width="106px" />';

  public powerFilter;
  public rowSelection;

  private gridApi;
  private gridColumnApi;
  public PowerPlantrowData: any = [];
  public PowerPlantcolumnDefs;
  public paginationPageSize;
  public paginationNumberFormatter;

  ngOnInit() {
    setTimeout(() => {
      this.GetTrasnmissionFilterOption();
      this.GetSuggestivePowerplantData();
      this.GeneratePowerPlantcolumns();
    }, 2000);

  }

  GetTrasnmissionFilterOption() {
    this.httpRequest._NodeGetAllPowerPlantFilterOptions().subscribe(res => {
      let data = res.json();
      if (data._Issuccess) {
        let filteropList = data.FilterOptionData;
        this.AllPowerPlantFilterOptionValue.State.push(filteropList.sates);
        this.AllPowerPlantFilterOptionValue.NERCRegion.push(filteropList.nerc);
        this.AllPowerPlantFilterOptionValue.PrimaryPlantFuel.push(filteropList.fuelType);
        this.AllPowerPlantFilterOptionValue.Sector.push(filteropList.sector);
        this.AllPowerPlantFilterOptionValue.ISO_RTO.push(filteropList.isO_RTO);
      }
    }, error => { console.log(error) });
  }

  GetSuggestivePowerplantData() {
    this.httpRequest._NodeGetSuggestivePowerplantResults().subscribe(res => {
      let data = res.json();
      if (data._Issuccess) {
        let PowerPlantNameOrUtilityList = data.SuggestivePowerplantData;
        this.AllPowerPlantFilterOptionValue.selectedPowerPlantNameOrUtilityList.push(PowerPlantNameOrUtilityList);
      }
    }, error => {
      console.log(error);
    });
  }

  onPowerPlantGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.onPowerPlantPageSizeChanged();
    if (!this.MapServiceService._PowerPlantData.getValue()) {
      this.httpRequest._NodeGetPowerPlantsData().subscribe(res => {
        let data = res.json();
        if (data._Issuccess) {
          let List = data.PowerPlantsData;
          this.MapServiceService.setPowerPlantdata(List);
          this.PowerPlantrowData = List;
          this.AllPowerPlantListdata = List;
        }
      }, error => {
        console.log(error);
      });
    } else {
      this.PowerPlantrowData = this.MapServiceService._PowerPlantData.getValue();
      this.AllPowerPlantListdata = this.MapServiceService._PowerPlantData.getValue();
    }
  }

  onPowerPlantPageSizeChanged() {
    let value = document.getElementById("PowerPlantpage-size")["value"];
    this.gridApi.paginationSetPageSize(Number(value));
  }

  GeneratePowerPlantcolumns() {
    this.PowerPlantcolumnDefs = [
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
          let id = params.data.PowerID;
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
        width: 90,
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "NERC",
        field: "NERC",
        width: 90,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "ISO/RTO",
        field: "ISO_RTO",
        width: 110,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "Transmission Grid Owner",
        field: "TransmissionGridOwner",
        width: 265,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "Regulated (Y/N)",
        field: "Regulated",
        width: 150,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "Sector",
        field: "Sector",
        width: 120,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "Primary Fuel",
        field: "PrimaryFuel",
        width: 130,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      },
      {
        headerName: "Capacity MW",
        field: "CapacityMW",
        width: 130,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        filterParams: { newRowsAction: "keep" }
      }];
    this.paginationPageSize = 100;
    this.paginationNumberFormatter = (params) => {
      return params.value.toLocaleString();
    };
  }

  ClearPowerPlantAllfilters() {
    this.selectedAllPowerPlantFilters.State.length = 0;
    this.selectedAllPowerPlantFilters.NERCRegion.length = 0;
    this.selectedAllPowerPlantFilters.PrimaryPlantFuel.length = 0;
    this.selectedAllPowerPlantFilters.Sector.length = 0;
    this.selectedAllPowerPlantFilters.ISO_RTO.length = 0;
    this.CapacityFrom = "0";
    this.CapacityTo = "99999"
    this.NetGenerationFrom = "0";
    this.NetGenerationTo = "99999";
    this.selectedPowerPlantNameOrUtility = "";
    this.resetPowerPlantGrid();
  }

  resetPowerPlantGrid() {
    this.PowerPlantcolumnDefs = null;
    this.PowerPlantrowData = null;
    setTimeout(() => {
      this.GeneratePowerPlantcolumns();
      this.PowerPlantrowData = this.AllPowerPlantListdata;
    }, 2000);
  }

  onPowerPlantRowClicked(e) {
    if (e.event.target !== undefined) {

      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");
      switch (actionType) {
        case "powerPlant":
          return this.OpenPowerPlantInnewtab(data.PowerID, data.CompanyID);
        case "operatingUtility":
          return this.OpenOperatingUtilityInNewTab(data.CompanyID);

      }
    }
  }

  OpenPowerPlantInnewtab(PowerID, CompanyID) {
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

  searchPowerPlantNameOrUtility() {
    if (this.selectedPowerPlantNameOrUtility) {
      this.SearchPowerPlantData(this.selectedPowerPlantNameOrUtility);
    }
  }

  SearchPowerPlantData(SearchPlantData) {
    let SearchPowerPlantData = this.AllPowerPlantListdata.filter((el) => {
      if (el.PowerPlant != null && el.OperatingUtility != null) {
        if (el.PowerPlant.toLowerCase().indexOf(SearchPlantData.toLowerCase().trim()) > -1 || el.OperatingUtility.toLowerCase().indexOf(SearchPlantData.toLowerCase().trim()) > -1) {
          return el;
        }
      }
    });
    this.PowerPlantrowData = null
    setTimeout(() => {
      if (SearchPowerPlantData.length > 0) {
        this.PowerPlantrowData = SearchPowerPlantData;
      }
      else {
        this.PowerPlantrowData = this.fillBlankPowerPlantRowinGrid();
      }
    }, 1000);
  }

  fillBlankPowerPlantRowinGrid() {
    let PowerPlantKeys = {
      powerID: "",
      powerPlant: "",
      operatingUtility: "",
      companyID: ""
    }
    let data = []
    data.push(PowerPlantKeys)
    return data;
  }

  PowerPlantTypeheadOnSelect(event) {
    if (event) {
      let val = event.value;
      this.GetPowerPlantorUtility_basedon_search_Value(val);
    }
  }

  GetPowerPlantorUtility_basedon_search_Value(Name) {
    if (Name) {
      let companyID = this.AllPowerPlantListdata.filter((el) => {
        if (el.OperatingUtility == Name) {
          return el.CompanyID;
        }
      });
      if (companyID.length > 0) {
        let CompanyID = companyID[0].companyID;
        this.OpenOperatingUtilityInNewTab(CompanyID);
        this.searchPowerPlantNameOrUtility();
      }
      else {
        let PowerID = this.AllPowerPlantListdata.filter((el) => {
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
            let id = parseInt(PowerID);
            if (cmpName == Name) {
              cmpnameid = id;
            }
          }
          if (cmpnameid) {
            this.OpenPowerPlantInnewtab(powerID, company_ID)
            this.searchPowerPlantNameOrUtility();
          }
          else {
            this.searchPowerPlantNameOrUtility()
          }
        }
        else {
          this.searchPowerPlantNameOrUtility()
        }
      }
    }
  }

  PowerPlantApplyfilter() {
    var CapacityRange = [], CapacityRangeFrom = parseFloat(this.CapacityFrom), CapacityRangeTo = parseFloat(this.CapacityTo);
    if (this.selectedAllPowerPlantFilters) {
      let State = [];
      let NERCRegion = [];
      let PrimaryPlantFuel = [];
      let Sector = [];
      let ISO_RTO = [];

      let StateData;
      let NERCRegionData;
      let PrimaryPlantFuelData;
      let SectorData;
      let ISO_RTOData;

      for (let s of this.selectedAllPowerPlantFilters.State) {
        State.push(s.StateCode);
      }
      for (let s of this.selectedAllPowerPlantFilters.NERCRegion) {
        NERCRegion.push(s.NERCRegionCode);
      }
      for (let s of this.selectedAllPowerPlantFilters.PrimaryPlantFuel) {
        PrimaryPlantFuel.push(s.PrimaryFuel);
      }
      for (let s of this.selectedAllPowerPlantFilters.Sector) {
        Sector.push(s.Sector);
      }
      for (let s of this.selectedAllPowerPlantFilters.ISO_RTO) {
        ISO_RTO.push(s.ISO_RTO);
      }

      if (this.selectedAllPowerPlantFilters.State.length > 0) {
        StateData = this.AllPowerPlantListdata.filter((el) => {
          if (el.State != null && el.State != undefined && State.indexOf(el.State.trim()) > -1)
            return el;
        });
      } else { StateData = this.AllPowerPlantListdata }
      if (this.selectedAllPowerPlantFilters.NERCRegion.length > 0) {
        NERCRegionData = StateData.filter((el) => {
          if (el.NERC != null && el.NERC != undefined && NERCRegion.indexOf(el.NERC.trim()) > -1)
            return el;
        });
      } else { NERCRegionData = StateData }
      if (this.selectedAllPowerPlantFilters.PrimaryPlantFuel.length > 0) {
        PrimaryPlantFuelData = NERCRegionData.filter((el) => {
          if (el.PrimaryFuel != null && el.PrimaryFuel != undefined && PrimaryPlantFuel.indexOf(el.PrimaryFuel.trim()) > -1)
            return el;
        });
      } else { PrimaryPlantFuelData = NERCRegionData }
      if (this.selectedAllPowerPlantFilters.Sector.length > 0) {
        SectorData = PrimaryPlantFuelData.filter((el) => {
          if (el.Sector != null && el.Sector != undefined && Sector.indexOf(el.Sector.trim()) > -1)
            return el;
        });
      } else { SectorData = PrimaryPlantFuelData }
      if (this.selectedAllPowerPlantFilters.ISO_RTO.length > 0) {
        ISO_RTOData = SectorData.filter((el) => {
          if (el.ISO_RTO != null && el.ISO_RTO != undefined && ISO_RTO.indexOf(el.ISO_RTO.trim()) > -1)
            return el;
        });
      } else { ISO_RTOData = SectorData }
      let RegData = ISO_RTOData.filter((el) => {
        if (this.NonRegulated == true && this.Regulated == true)
          return el;
        else if (this.NonRegulated == false)
          return el.Regulated == "Yes";
        else
          return el.Regulated == "No";
      });
      let CapacityData;
      if (CapacityRangeFrom >= 0 && CapacityRangeTo >= 0) {
        CapacityData = RegData.filter((el) => {
          return parseInt(el.CapacityMW) >= CapacityRangeFrom && parseInt(el.CapacityMW) <= CapacityRangeTo
        })
      }
      else
        CapacityData = RegData;

      // for (var i = 0, capacityLen = ISO_RTOData.length; i < capacityLen; ++i) {
      //   var item = ISO_RTOData[i];
      //   if (item["capacityMW"] >= CapacityRangeFrom && item["capacityMW"] <= CapacityRangeTo) {
      //     CapacityRange.push(item);
      //   }
      // }

      if (CapacityData.length > 0) {
        this.PowerPlantrowData = null;
        setTimeout(() => {
          this.PowerPlantrowData = CapacityData;
        }, 1000);
      }
      else {
        this.PowerPlantrowData = null
        setTimeout(() => { this.PowerPlantrowData = this.fillBlankPowerPlantRowinGrid(); }, 1000);
      }
    } else {
      for (var i = 0, capacityLen = this.AllPowerPlantListdata.length; i < capacityLen; ++i) {
        var item = this.AllPowerPlantListdata[i];
        if (item["CapacityMW"] >= CapacityRangeFrom && item["CapacityMW"] <= CapacityRangeTo) {
          CapacityRange.push(item);
        }
      }

      if (CapacityRange.length > 0) {
        this.PowerPlantrowData = null;
        setTimeout(() => {
          this.PowerPlantrowData = CapacityRange;
        }, 1000);
      }
      else {
        this.PowerPlantrowData = null
        setTimeout(() => { this.PowerPlantrowData = this.fillBlankPowerPlantRowinGrid(); }, 1000);
      }
    }
  }

  chkRegulatedChanged(event) {
    if (this.Regulated == false && this.NonRegulated == false) {
      this.NonRegulated = true;
    }
  }

  chkNonRegulatedChanged(event) {
    if (this.Regulated == false && this.NonRegulated == false) {
      this.Regulated = true;
    }
  }
}