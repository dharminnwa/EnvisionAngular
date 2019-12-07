import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MapServiceService } from '../../../../services/map-service.service';
import { ElevationGraphComponent } from './elevation-graph/elevation-graph.component';
import { ElevationPofileService } from '../../../../services/elevation-profile.service';
import { UtilityService } from '../../../../services/Utility.service';

declare var $: any;
@Component({
  selector: 'app-elevation-profile',
  templateUrl: './elevation-profile.component.html',
  styleUrls: ['./elevation-profile.component.scss'],
})
export class ElevationProfileComponent implements OnInit {
  unit;
  constructor(
    public bsModalRef: BsModalRef,
    private bsModalService: BsModalService,
    private mapService: MapServiceService,
    private elevationPofileService: ElevationPofileService,
    private UtilityService: UtilityService
  ) { }

  ngOnInit() {
    this.UtilityService.CloseModalOnRouteChange(this.bsModalRef)
    setTimeout(() => {
      var modalDiv = document.getElementsByClassName('elevationProfile')[0];
      var modalElement = $(modalDiv).parents('.modal');
      $(modalElement).attr('id', 'elevationProfile');
      this.mapService.SetModal('elevationProfile');
      if (!this.mapService._elevationGraphData.getValue()) {
        let elevationColumnChart = [{
          chartType: 'ColumnChart',
          dataTable: [],
          options: { 'title': 'Elevation' },
        }];
        this.mapService.setElevationGraphData(elevationColumnChart);
      }
    }, 100);
    this.Draggable();
  }

  Draggable() {
    setTimeout(() => {
      $('.modal-dialog').draggable({
        handle: ".modal-header"
      });
    }, 10);
  }

  CloseElevationProfile() {
    this.elevationPofileService.CloseDrawToolsForElevation();
    this.bsModalRef.hide();
    this.elevationPofileService.elevationToolMeasurement = "Feet";
  }

  OnMeasurementChange(e) {
    if ((<HTMLInputElement>document.getElementById("optMeter")).checked)
      this.elevationPofileService.elevationToolMeasurement = "Meter";
    else if ((<HTMLInputElement>document.getElementById("optFeet")).checked)
      this.elevationPofileService.elevationToolMeasurement = "Feet";
    this.elevationPofileService.OnMeasurementChange();
  }

  ClearClick() {
    this.elevationPofileService.ClearButtonClick();
  }

}
