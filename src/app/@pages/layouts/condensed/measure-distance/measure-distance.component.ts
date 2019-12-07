import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { UtilityService } from '../../../../services/Utility.service';
import { MapServiceService } from '../../../../services/map-service.service';
import { MesureDistanceService } from '../../../../services/mesure-distance.service';
declare var $: any;
declare var google: any;

@Component({
  selector: 'app-measure-distance',
  templateUrl: './measure-distance.component.html',
  styleUrls: ['./measure-distance.component.scss']
})
export class MeasureDistanceComponent implements OnInit {

  isMesureDistance: boolean = false;
  isMesureArea: boolean = false;

  distanceLatLngs: any[] = [];
  distanceInMeters: any = 0;
  distanceInFeet: any = 0;
  distanceInKM: any = 0;
  distanceInMiles: any = 0;

  areaLatLngs: any[] = [];
  areaInMeters: any = 0;
  areaInKm:any = 0;
  areaInMile: any = 0;
  areaInAcres: any = 0;

  constructor(
    public bsModalRef: BsModalRef,
    private UtilityService: UtilityService,
    private mapService: MapServiceService,
    private mesureDistanceService: MesureDistanceService
  ) { }
  menuLinks = [
    {
      label: "Dashboard",
      details: "12 New Updates",
      routerLink: "dashboard",
      iconType: "pg",
      iconName: "home",
      thumbNailClass: "bg-success"
    },
    {
      label: "Email",
      details: "234 New Emails",
      routerLink: "email/list",
      iconType: "pg",
      iconName: "mail"
    },];
  ngOnInit() {
    this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
    setTimeout(() => {
      var modalDiv = document.getElementsByClassName('mesure-distance')[0];
      var modalElement = $(modalDiv).parents('.modal');
      $(modalElement).attr('id', 'mesure-distance');

      this.mapService.SetModal('mesure-distance');
    }, 100);
    this.Draggable();
    this.mesureDistanceService.getDistanceData().subscribe(x => {
      this.distanceLatLngs = x;
      this.MesureDistance(this.distanceLatLngs);
    })

    this.mesureDistanceService.getAreaData().subscribe(x => {
      this.areaLatLngs = x;
      this.MesureArea(this.areaLatLngs);
    })
  }

  Draggable() {
    setTimeout(() => {
      $('.modal-dialog').draggable({
        handle: ".modal-header"
      });
    }, 10);
  }

  ToggleMesureDistance() {
    this.isMesureDistance = !this.isMesureDistance;
    if (this.isMesureDistance == true) {
      this.isMesureArea = false;
      this.mesureDistanceService.DrawToolsForMesureDistance();
      this.mesureDistanceService.CloseDrawToolsForArea();
    } else {
      this.mesureDistanceService.CloseDrawToolsForDistance();
    }
    this.ResetAllValues();
  }

  ToggleMesureArea() {
    this.isMesureArea = !this.isMesureArea;
    if (this.isMesureArea == true) {
      this.isMesureDistance = false;
      this.mesureDistanceService.DrawToolsForMesureArea();
      this.mesureDistanceService.CloseDrawToolsForDistance();
    } else {
      this.mesureDistanceService.CloseDrawToolsForArea();
    }
    this.ResetAllValues();
  }
  
  ResetAllValues(){
    this.distanceInMeters = 0;
    this.distanceInFeet = 0;
    this.distanceInKM = 0;
    this.distanceInMiles = 0;

    this.areaInMeters = 0;
    this.areaInKm = 0;
    this.areaInMile = 0;
    this.areaInAcres = 0;
  }

  CloseModal() {
    this.mesureDistanceService.CloseDrawToolsForDistance();
    this.mesureDistanceService.CloseDrawToolsForArea();
    this.bsModalRef.hide();
  }

  MesureArea(data) {
    if (data && data.length > 1) {
      this.areaInMeters = google.maps.geometry.spherical.computeArea(data);
      this.areaInKm = this.areaInMeters / 1e+6;
      this.areaInMile = this.areaInMeters / 2.59e+6;
      this.areaInAcres = this.areaInMeters / 4046.856;
    }
  }

  MesureDistance(data) {
    if (data && data.length > 1) {
      if (data.length == 2) {
        this.distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(data[0], data[1]);
      } else {
        this.distanceInMeters = 0;
        for (let i = 0; i < data.length - 1; i++) {
          let element = [];
          element.push(data[i]);
          element.push(data[i + 1]);
          let result = google.maps.geometry.spherical.computeDistanceBetween(element[0], element[1]);
          this.distanceInMeters = this.distanceInMeters + result;
        }
      }
      this.distanceInFeet = this.distanceInMeters * 3.28084;
      this.distanceInKM = this.distanceInMeters / 1000;
      this.distanceInMiles = this.distanceInMeters / 1609.344;
    }
  }
}

