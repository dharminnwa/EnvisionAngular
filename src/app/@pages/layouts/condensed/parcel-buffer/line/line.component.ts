import { Component, OnInit, Injector } from '@angular/core';
import { UtilityService } from '../../../../../services/Utility.service';
import { AuthenticationService } from '../../../../../services/auth.service';
import { HttpRequestService } from '../../../../../services/all-http-request.service';
import { ParcelBufferToolService } from '../../../../../services/ParcelBufferTool.service';
import { MapServiceService } from '../../../../../services/map-service.service';
import { Subscription } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { CondensedComponent } from '../../condensed.component';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {

  latLngChangeSub: Subscription;
  latLng: any;
  displayLatLng: string = '';
  msg: string = 'Click to add point, Double-click to finish';
  errMsg: string = '';
  distanceType: any = 'ft'; // ft = Feet, mi = Miles, m - Meters, km = Kilometers
  distance: number = 50;
  Treedatalist: any[] = [];
  CondensedComponent: CondensedComponent;

  constructor(public bsModalRef: BsModalRef,
    private mapService: MapServiceService,
    public parcelBufferToolService: ParcelBufferToolService,
    private httpRequestService: HttpRequestService,
    private authService: AuthenticationService,
    private utilityService: UtilityService,
    private injector: Injector) {
    setTimeout(() => this.CondensedComponent = injector.get(CondensedComponent));
  }

  ngOnInit() {
    this.mapService.SetModal('parcelBuffer');
    this.latLngChangeSub = this.parcelBufferToolService.LineLatLngs.subscribe(x => {
      if (x) {
        this.latLng = x;
        // this.DrawCircleBasedonLatLng(x);
        this.setLatLngs();
      } else {
        this.latLng = null;
        this.displayLatLng = '';
        // this.RemoveCirclefromMap();
      }
    })
  }

  ngOnDestroy() {
    this.latLngChangeSub.unsubscribe();
  }

  setLatLngs() {
    if (this.latLng && this.latLng.length > 0) {
      for (let i = 0; i < this.latLng.length; i++) {
        let latLng = this.latLng[i];
        this.displayLatLng = this.displayLatLng + (i + 1);
        this.displayLatLng += ':';
        this.displayLatLng += ' ' + latLng.lat().toFixed(6);
        this.displayLatLng += ', ' + latLng.lng().toFixed(6);
        this.displayLatLng += '\n';
      }
    }
  }

  searchData() {
    if (this.latLng && this.latLng.length > 0 && this.distance > 0) {
      let points = [];
      this.latLng.forEach(latLng => {
        if (latLng && latLng.lat && latLng.lng) {
          let item = {
            lat: latLng.lat(),
            lng: latLng.lng()
          }
          points.push(item);
        }
      })
      let data = {
        points: points,
        distanceMeter: this.getRadius(),
        userId: this.authService.getLoggedinUserId()
      }
      this.errMsg = '';
      this.httpRequestService.GetLocationFromLineString(data).subscribe(data => {
        if (data._Issuccess == true) {
          if (data && data.States && data.States.length > 0) {
            let states = data.States;
            let userData = this.authService.GetUserData();
            if (userData && userData.LayerCategoriesRoles) {
              let accessStates = userData.LayerCategoriesRoles;
              let isAccess = undefined;
              states.forEach(state => {
                let stateName = state.state_name;
                let access = accessStates.find(x => x == stateName);
                if (access)
                  isAccess = true;
                else
                  isAccess = false;
              });
              if (isAccess == true) {
                this.LoadParcelStates(states);
                this.msg = 'Click Clear button and Begin a new Search';
              } else {
                this.errMsg = 'Your Company does not have access to parcel data in this area: ' + states[0].state_name + ' Click Clear button to begin a new search.';
                this.parcelBufferToolService.DisableDrawingModeLine();
              }
            }
          } else {
            this.errMsg = 'No Parcel Data Found please click Clear button and Begin a new Search';
          }
        }
      })
    }
  }

  LoadParcelStates(states: any[]) {
    if (states && states.length && states.length > 0) {
      this.Treedatalist = [];
      let currentIndexVal = this.mapService.LayerIndex.getValue().value + 1;
      for (let i = 0; i < states.length; i++) {
        let state = states[i];
        if (state.fips) {
          let tableNameParcel = 'Parcels_' + state.fips; // Boundries
          let tableNameParcelPoints = 'ParcelPoints_' + state.fips; // Points
          let tempLayerObjPropObj = this.parcelBufferToolService.GetParcelTempLayerObject(tableNameParcelPoints, state, i);
          let tempLayerBoundriesObjPropObj = this.parcelBufferToolService.GetParcelTempLayerBoundriesObject(tableNameParcel, state, i);
          tempLayerObjPropObj.FilterValue = this.GetFilterValue("Point");
          tempLayerBoundriesObjPropObj.FilterValue = this.GetFilterValue("Line");
          let Treedatalist = this.parcelBufferToolService.SetTree(this.parcelBufferToolService.ParcelCenterPointData, tempLayerObjPropObj, tempLayerBoundriesObjPropObj, currentIndexVal);
          if (Treedatalist && Treedatalist.length > 0) {
            Treedatalist.forEach(item => {
              this.Treedatalist.push(item);
            });
          }
          this.parcelBufferToolService.ZoomToPoint(this.latLng[this.latLng.length - 1]);
          this.parcelBufferToolService.DisableDrawingModeLine();
        }
      }
      if (this.Treedatalist.length > 0) {
        this.CondensedComponent.SetTemporaryTreeNodeForWidget(this.Treedatalist);
      }
    }
  }

  GetFilterValue(layerType) {
    let filterVal = '';
    filterVal += 'DWITHIN(the_geom,LINESTRING(';
    for (let i = 0; i < this.latLng.length; i++) {
      let latLng = this.latLng[i];
      filterVal += latLng.lng() + " " + latLng.lat()
      if (this.latLng.length - 1 != i) {
        filterVal += ', '
      }
    }
    let radius = this.getRadius();
    if (radius < 300) {
      if (layerType == "Point")
        filterVal += '), 350 ,meters)';
      else
        filterVal += '),' + radius + ',meters)';
    } else {
      filterVal += '),' + radius + ',meters)';
    }

    return filterVal;
  }

  ClearData(isEnebleDrawTool: boolean = true) {
    this.msg = 'Click to add point, Double Click to finish';
    this.parcelBufferToolService.RemoveOldLine(true);
    this.parcelBufferToolService.RemovelayerFromTree(this.parcelBufferToolService.ParcelCenterPointData.DataSetID, this.parcelBufferToolService.ParcelCenterPointData.DataSetBoundryID);
    this.distance = 50;
    this.distanceType = 'ft';
    this.displayLatLng = '';
    this.latLng = undefined;
    this.parcelBufferToolService.DisableDrawingModeLine();
    if (isEnebleDrawTool)
      this.parcelBufferToolService.InitLineForParcelBuffer();
  }

  getRadius() {
    let radius = 0;
    if (this.distanceType == 'ft') {
      radius = this.distance * 0.3048;
    } else if (this.distanceType == 'mi') {
      radius = this.distance * 1609.34;
    } else if (this.distanceType == 'm') {
      radius = this.distance;
    } else if (this.distanceType == 'km') {
      radius = this.distance * 1000;
    }
    return radius;
  }

}
