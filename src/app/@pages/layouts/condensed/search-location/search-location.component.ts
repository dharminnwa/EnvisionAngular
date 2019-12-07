import { Component, OnInit } from '@angular/core';
import { MapServiceService } from '../../../../services/map-service.service';
import { BsModalRef } from 'ngx-bootstrap';
import { UtilityService } from '../../../../services/Utility.service';

declare var $: any;
declare var google: any;
@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent implements OnInit {
  public map: any;
  public allMarkers = [];
  public searchlocmarker: any;
  constructor(
    public MapServiceService: MapServiceService,
    public bsModalRef: BsModalRef,
    private UtilityService: UtilityService
  ) { }
  ngOnInit() {
    this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
    setTimeout(() => {
      $('.pac-container').css('z-index', 9999);
    }, 500);
    this.map = this.MapServiceService._mapdata.getValue();
    this.Draggable();
    this.searchLocation();
  }

  searchLocation() {
    // var options = {
    //   types: ['(cities)'],
    //   componentRestrictions: { country: "us" }
    // };
    var input = document.getElementById('txtlocation');
    let searchBox = new google.maps.places.SearchBox(input);
    this.searchlocmarker = new google.maps.Marker({
      map: this.map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8.5,
        fillColor: "#F00",
        fillOpacity: 0.6,
        strokeWeight: 1
      },
      // anchorPoint: new google.maps.Point(0, -29)
    });

    google.maps.event.addListener(searchBox, 'places_changed', () => {
      searchBox.set(this.map, null);
      var places = searchBox.getPlaces();
      var bounds = new google.maps.LatLngBounds();
      var i;
      var place;
      if (places.length > 0) {
        for (i = 0; i <= places.length; i++) {
          place = places[i];
          if (place != undefined && place.name != undefined) {
            this.searchlocmarker.setVisible(false);
            if (place.geometry.viewport) {
              this.map.fitBounds(place.geometry.viewport);
            } else {
              this.map.setCenter(place.geometry.location);
              this.map.setZoom(15);
            }
            this.searchlocmarker.setPosition(place.geometry.location);
            this.searchlocmarker.setVisible(true);

            this.searchlocmarker.bindTo(this.map, searchBox, this.map);
            this.allMarkers.push(this.searchlocmarker);
            // google.maps.event.addListener(this.searchlocmarker, 'map_changed', function () {
            //   if (!this.getMap()) {
            //     this.unbindAll();
            //   }
            // });
            bounds.extend(place.geometry.location);
            $("#txtlocation").val(place.formatted_address);
          }
        }
      }
    });
  }

  Draggable() {
    setTimeout(() => {
      $('.modal-dialog').draggable({
        handle: ".modal-header"
      });
    }, 10);
  }

  CloseModal() {
    this.RemoveAllMarkers();
    this.bsModalRef.hide();
  }

  RemoveAllMarkers() {
    for (let i = 0; i < this.allMarkers.length; i++) {
      this.allMarkers[i].setMap(null);
    }
    this.allMarkers = [];
  }
}
