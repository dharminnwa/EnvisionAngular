import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { MapServiceService } from '../../../../services/map-service.service';
import { Subject } from 'rxjs';
import { MapLayerInfoService } from '../../../../services/map-layer-info.service';
import { UtilityService } from '../../../../services/Utility.service';
import { environment } from '../../../../../environments/environment';
declare var $: any;
declare var google: any;
@Component({
  selector: 'app-reverse-geocode',
  templateUrl: './reverse-geocode.component.html',
  styleUrls: ['./reverse-geocode.component.scss']
})
export class ReverseGeocodeComponent implements OnInit {
  ImageURLPath: string = environment.ImagespreviewPath;
  lat: any = 36.65874;
  lng: any = -96.78954;
  mymap: any;
  streetAddress: any = '';
  image = new google.maps.MarkerImage(this.ImageURLPath + "tools/pushpinRed.PNG",
    new google.maps.Size(24, 46),
    new google.maps.Point(0, 0),
    new google.maps.Point(12, 46),
    new google.maps.Size(24, 46)
  );
  revGeocodeMarker: any = null;
  constructor(
    private bsModalRef: BsModalRef,
    private mapServiceService: MapServiceService,
    private mapLayerInfoService: MapLayerInfoService,
    private UtilityService: UtilityService
  ) { }

  ngOnInit() {
    this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
    this.Draggable();
    this.ClearMarkers();
    this.mymap = this.mapServiceService._mapdata.getValue();
    this.mymap.addListener('click', (location) => {
      var reverseGeocodeModal = document.getElementById('reverseGeocode');
      if (reverseGeocodeModal != undefined && reverseGeocodeModal != null) {
        this.SetLocationpin(location);
      }
    });

    setTimeout(() => {
      var modalDiv = document.getElementsByClassName('reverseGeocode')[0];
      var modalElement = $(modalDiv).parents('.modal');
      $(modalElement).attr('id', 'reverseGeocode');
      this.SetModal('reverseGeocode');
      this.CollapseDesclaimer();
    }, 100);
  }

  SetLocationpin(location: any) {
    this.ClearMarkers();
    var reverseGeocodeModal = document.getElementById('reverseGeocode');
    if (reverseGeocodeModal != null) {
      var position = location.latLng;
      this.revGeocodeMarker = new google.maps.Marker({
        map: this.mymap,
        icon: this.image,
        position: position,
      });
      this.revGeocodeMarker.setMap(this.mymap);
      this.lat = position.lat().toFixed(6);
      this.lng = position.lng().toFixed(6);
    }
  }

  SearchStreetAddress() {
    this.ClearMarkers();
    var latlng = new google.maps.LatLng(this.lat, this.lng);
    var geocoder = geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          this.revGeocodeMarker = new google.maps.Marker({
            icon: this.image,
            position: latlng,
            map: this.mymap,
          });
          this.mymap.setCenter(latlng);
          this.mymap.setZoom(17);
          this.streetAddress = results[0].formatted_address;
        }
      }
    });
  }

  Draggable() {
    setTimeout(() => {
      $('.modal-dialog').draggable({
        handle: ".modal-header",
      });
    }, 10);
  }

  ClearMarkers() {
    if (this.revGeocodeMarker != undefined && this.revGeocodeMarker != null && this.mymap) {
      this.revGeocodeMarker.setMap(null);
      this.revGeocodeMarker = null;
    }
    this.streetAddress = '';
  }

  SetModal(modalname) {
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
      left: ($(window).width() - $('#' + modalname).outerWidth()),
      top: 200
    });
    $('.modal-backdrop').hide();
  }

  CollapseDesclaimer() {
    var collapseControl = $('#reverseGeocodeDesc').find('.card-collapse .pg');
    if (collapseControl != undefined && collapseControl.length > 0) {
      $(collapseControl[0]).click();
    }
  }

  CloseGeoCode() {
    google.maps.event.clearListeners(this.mymap, 'click');
    this.mymap.addListener('click', (event) => {
      this.mapLayerInfoService.onClickMarker(event);
    });
    this.ClearMarkers();
    this.bsModalRef.hide();
  }
}
