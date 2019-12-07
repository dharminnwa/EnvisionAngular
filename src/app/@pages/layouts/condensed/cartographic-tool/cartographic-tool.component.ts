import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { MapServiceService } from '../../../../services/map-service.service'
import { UtilityService } from '../../../../services/Utility.service';
import * as _ from 'lodash';

declare var jquery: any;
declare var $: any;
declare var google: any;
@Component({
  selector: 'app-cartographic-tool',
  templateUrl: './cartographic-tool.component.html',
  styleUrls: ['./cartographic-tool.component.scss']
})
export class CartographicToolComponent implements OnInit {
  ScaleUnit: string = 'Km';
  constructor(public bsModalRef: BsModalRef, public MapServiceService: MapServiceService, private UtilityService: UtilityService) { }
  ngOnInit() {
    this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
    let map = this.MapServiceService._mapdata.getValue();
    let scale = $(".gm-style-cc:not(.gmnoprint):contains(' mi')");
    if (scale.length == 0) {
      scale = $(".gm-style-cc:not(.gmnoprint):contains(' ft')");
      if (scale.length == 0) {
        this.ScaleUnit = 'Km';
      } else {
        this.ScaleUnit = 'Mi';
      }
    } else {
      this.ScaleUnit = 'Mi';
    }
    this.setScaleIndicatorVal();
    this.setLatLngVal();
  }

  CheckedLatLong(event: any) {
    var latlongDiv = document.getElementById("getlatlng") as HTMLElement;
    if (event.target.checked) {
      latlongDiv.classList.remove('hide');
    }
    else {
      latlongDiv.classList.add('hide');
    }
  }

  setLatLngVal() {
    let checkbox = $('#chkLatLong');
    var latlongDiv = document.getElementById("getlatlng") as HTMLElement;
    let contains = latlongDiv.classList.contains('hide');
    if (contains)
      checkbox.prop('checked', false);
  }

  setScaleIndicatorVal() {
    let checkbox = $('#chkScale');
    var ccs = $('.gm-style .gm-style-cc');
    let contains = ccs[0].classList.contains('opaciti');
    if (contains)
      checkbox.prop('checked', false);
  }

  CheckedScale(event: any) {
    var ccs = $('.gm-style .gm-style-cc');
    if (event.target.checked) {
      if (ccs != undefined && ccs.length > 0) {
        for (let i = 0; i < ccs.length; i++) {
          ccs[i].classList.remove('opaciti');
        }
      }
    }
    else {
      if (ccs != undefined && ccs.length > 0) {
        for (let i = 0; i < ccs.length; i++) {
          ccs[i].classList.add('opaciti');
        }
      }
    }
  }

  switvhUnit() {    
    var ccs = $('.gm-style .gm-style-cc');    
    if (ccs != undefined && ccs.length > 0) {
      for (let i = 0; i < ccs.length; i++) {
        ccs[i].click();        
      }
    }
  }
}
