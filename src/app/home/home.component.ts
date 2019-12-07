import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WidgetModalComponent } from './widget-modal/widget-modal.component';
import { condensedService } from '../services/condensed-service';
import { MapServiceService } from '../services/map-service.service';
declare var $: any;
declare var jquery: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class HomeComponent implements OnInit {

  constructor(private modalService: NgbModal, private MapServiceService: MapServiceService) { }

  searchFacilitiesOptions = [
    { value: 'One', label: 'One' },
    { value: 'Two', label: 'Two' },
  ];
  selectedMultipleFacilities;
  searchCommoditiesOptions = [
    { value: 'Crude Oil', label: 'Crude Oil' },
    { value: 'Natural Gas', label: 'Natural Gas' },
    { value: 'LPG/NGL', label: 'LPG/NGL' },
    { value: 'Petrochemical', label: 'Petrochemical' },
    { value: 'Refined Products', label: 'Refined Products' }
  ];
  selectedMultipleCommodities;
  searchStatesOptions = [
    { value: 'Alabama', label: 'Alabama' },
    { value: 'Alaska', label: 'Alaska' },
    { value: 'Arizona', label: 'Arizona' },
    { value: 'Arkansas', label: 'Arkansas' },
    { value: 'California', label: 'California' },
    { value: 'Colorado', label: 'Colorado' },
    { value: 'Connecticut', label: 'Connecticut' },
    { value: 'Delaware', label: 'Delaware' },
    { value: 'District of Columbia', label: 'District of Columbia' },
    { value: 'Florida', label: 'Florida' },
    { value: 'California', label: 'California' },
    { value: 'California', label: 'California' }
  ];
  selectedMultipleStates;

  public restoreClass: string = "fa fa-window-restore";
  public panelClass: string = "panel panel-default col-md-4";
  public PanelContainerClass: string = "col-md-12";
  public restoredPanel: any = { Id: 0, Title: '' }

  public IsOpen: boolean = false;

  public panelArray = [
    { Id: 1, Title: 'Parcel Centerpint Lookup' },
    { Id: 2, Title: 'Latest Industry News' },
    { Id: 3, Title: 'Envision 101' },
    { Id: 4, Title: 'PipeLine Activity Reports' },
    { Id: 5, Title: 'Latest Electric Industry news' },
    { Id: 6, Title: 'Fincial markets' },
  ];

  ngOnInit() {
    this.InitDraggble();
  }

  InitDraggble() {
    var panelList = $('#draggablePanelList');
    panelList.sortable({
      handle: '.panel-heading',
      update: (e) => {
        $('.panel', panelList).each((index, elem) => {
          var $listItem = $(elem),
            newIndex = $listItem.index();
        });
      }
    });
  }

  ResizePanel(event) {
    var target = event.target || event.srcElement || event.currentTarget as HTMLElement;
    var panelElement = $(target.parentElement.parentElement);
    if (panelElement != undefined) {
      if (target.className.includes('restore')) {
        this.IsOpen = true;
        this.PanelContainerClass = "col-md-3";
        this.panelClass = "panel panel-default col-md-12";
        let selectedIndex: number = parseInt(panelElement.attr('data-index'));
        if (selectedIndex >= 0) {
          let tempPanel: any = { Id: 0, Title: '' }
          if (this.restoredPanel.Id > 0) {
            tempPanel = this.restoredPanel;
          }
          this.restoredPanel = this.panelArray[selectedIndex];
          this.panelArray.splice(selectedIndex, 1);

          if (tempPanel.Id > 0) {
            this.panelArray.unshift(tempPanel);
            tempPanel = { Id: 0, Title: '' };
          }
        }
      }
      else if (target.className.includes('minimize')) {
        this.IsOpen = false;
        this.PanelContainerClass = "col-md-12";
        this.panelClass = "panel panel-default col-md-4"
        this.panelArray.unshift(this.restoredPanel);
        this.restoredPanel = '';
      }
    }
  }

  openWidgetModal() {
    this.MapServiceService.setHomeWidgetArray(this.panelArray);
    const ref = this.modalService.open(WidgetModalComponent, { size: 'lg', centered: true, keyboard: false });
    ref.result.then((result) => {
      this.panelArray = result;
    })
  }
  SearchAssest() {
    this.selectedMultipleFacilities;
  }
}