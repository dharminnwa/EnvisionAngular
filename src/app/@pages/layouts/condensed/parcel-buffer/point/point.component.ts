import { Component, OnInit, Injector } from '@angular/core';
import { ParcelBufferToolService } from '../../../../../services/ParcelBufferTool.service';
import { MapServiceService } from '../../../../../services/map-service.service';
import { HttpRequestService } from '../../../../../services/all-http-request.service';
import { AuthenticationService } from '../../../../../services/auth.service';
import { UtilityService } from '../../../../../services/Utility.service';
import { CondensedComponent } from '../../condensed.component';
import { Subscription } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
declare var google: any;
@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.scss']
})
export class PointComponent implements OnInit {

  lat: number;
  lng: number;
  latLng: any;
  distanceType: any = 'ft'; // ft = Feet, mi = Miles, m - Meters, km = Kilometers
  distance: number = 50;
  activeCircle: any;
  errMsg: string = '';
  msg: string = 'Click to add point';
  Treedatalist: any[] = [];
  CondensedComponent: CondensedComponent
  latLngChangeSub: Subscription;

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
    // this.parcelBufferToolService.InitPointForParcelBuffer();
    this.mapService.SetModal('parcelBuffer');
    this.latLngChangeSub = this.parcelBufferToolService.PointLatLngs.subscribe(x => {
      if (x && x.lat && x.lng) {
        this.lat = x.lat().toFixed(6);
        this.lng = x.lng().toFixed(6);
        this.latLng = x;
        this.DrawCircleBasedonLatLng(x);
      } else {
        this.lat = null;
        this.lng = null;
        this.latLng = null;
        this.RemoveCirclefromMap();
      }
    })
  }

  ngOnDestroy() {
    this.latLngChangeSub.unsubscribe();
  }

  DrawCircleBasedonLatLng(latLng) {
    let map = this.mapService._mapdata.getValue();
    this.RemoveCirclefromMap();
    setTimeout(() => {
      var circle = new google.maps.Circle({
        strokeColor: '#FFFF00',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0,
        map: map,
        center: latLng,
        radius: this.getRadius(),
        clickable: false
      });
      this.activeCircle = circle;
      // circle.setMap(map);
    }, 200);
    // let center = { lat: this.latLng.lat(), lng: this.latLng.lng() };
    // var myOptions = {
    //   center: center,
    // };
    // map.setOptions(myOptions);
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

  distanceChange(value) {
    if (this.activeCircle && this.activeCircle.setRadius)
      this.activeCircle.setRadius(this.getRadius());
  }

  distanceTypeChange(value) {
    if (this.activeCircle && this.activeCircle.setRadius)
      this.activeCircle.setRadius(this.getRadius());
  }

  RemoveCirclefromMap() {
    if (this.activeCircle) {
      this.activeCircle.setMap(null);
      this.activeCircle = undefined;
    }
  }

  searchData() {
    if (this.latLng && this.distance > 0) {
      let data = {
        lat: this.latLng.lat(),
        lng: this.latLng.lng(),
        distanceMeter: this.getRadius(),
        userId: this.authService.getLoggedinUserId()
      }
      this.errMsg = '';
      this.httpRequestService.GetLocationFromLatLng(data).subscribe(data => {
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
                this.parcelBufferToolService.DisableDrawingMode();
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
          tempLayerObjPropObj.FilterValue = this.GetFilterValue();
          tempLayerBoundriesObjPropObj.FilterValue = this.GetFilterValue();
          let Treedatalist = this.parcelBufferToolService.SetTree(this.parcelBufferToolService.ParcelCenterPointData, tempLayerObjPropObj, tempLayerBoundriesObjPropObj, currentIndexVal);
          if (Treedatalist && Treedatalist.length > 0) {
            Treedatalist.forEach(item => {
              this.Treedatalist.push(item);
            });
          }

          this.parcelBufferToolService.ZoomToPoint(this.latLng, this.getRadius());
          this.parcelBufferToolService.DisableDrawingMode();
        }
      }

      if (this.Treedatalist.length > 0) {
        this.CondensedComponent.SetTemporaryTreeNodeForWidget(this.Treedatalist);
      }
    }
  }

  ClearData(isEnebleDrawTool: boolean = true) {
    this.msg = 'Click to add point';
    this.RemoveCirclefromMap();
    this.parcelBufferToolService.RemoveOldPoints(true);
    this.parcelBufferToolService.RemovelayerFromTree(this.parcelBufferToolService.ParcelCenterPointData.DataSetID, this.parcelBufferToolService.ParcelCenterPointData.DataSetBoundryID);
    this.lat = null;
    this.lng = null;
    this.latLng = undefined;
    this.distance = 50;
    this.distanceType = 'ft';
    this.parcelBufferToolService.DisableDrawingMode();
    if (isEnebleDrawTool)
      this.parcelBufferToolService.InitPointForParcelBuffer();
  }

  GetFilterValue() {
    let filterVal = '';
    filterVal += '( DWITHIN(the_geom,Point(' + (this.latLng.lng() - this.GetLngDistanceDiffrence()) + ' ' + this.latLng.lat() + '),' + this.getRadius() + ',meters) or DWITHIN(the_geom,Point(' + (this.latLng.lng() + this.GetLngDistanceDiffrence()) + ' ' + this.latLng.lat() + '),' + this.getRadius() + ',meters) or DWITHIN(the_geom,Point(' + this.latLng.lng() + ' ' + this.latLng.lat() + '),' + this.getRadius() + ',meters) )';
    filterVal += 'and ( DWITHIN(the_geom,Point(' + (this.latLng.lng() - this.GetLngDistanceDiffrence()) + ' ' + (this.latLng.lat() - this.GetDistanceDiffrence()) + '),' + this.getRadius() + ',meters) or DWITHIN(the_geom,Point(' + (this.latLng.lng() + this.GetLngDistanceDiffrence()) + ' ' + (this.latLng.lat() - this.GetDistanceDiffrence()) + '),' + this.getRadius() + ',meters) or DWITHIN(the_geom,Point(' + this.latLng.lng() + ' ' + (this.latLng.lat() - this.GetDistanceDiffrence()) + '),' + this.getRadius() + ',meters) )';
    filterVal += 'and ( DWITHIN(the_geom,Point(' + (this.latLng.lng() - this.GetLngDistanceDiffrence()) + ' ' + (this.latLng.lat() + this.GetDistanceDiffrence()) + '),' + this.getRadius() + ',meters) or DWITHIN(the_geom,Point(' + (this.latLng.lng() + this.GetLngDistanceDiffrence()) + ' ' + (this.latLng.lat() + this.GetDistanceDiffrence()) + '),' + this.getRadius() + ',meters) or DWITHIN(the_geom,Point(' + this.latLng.lng() + ' ' + (this.latLng.lat() + this.GetDistanceDiffrence()) + '),' + this.getRadius() + ',meters) )';
    return filterVal;
  }

  GetDistanceDiffrence() {
    let degree = this.getRadiusWithDegree();
    // this.GetSNBasedOnLat(this.latLng.lat());
    let medianVal = (0.000002 * this.getRadius()) - (0.000001 * this.getRadius())
    let val = (medianVal * degree) / 33;
    return val;
    // return (0.000002 * this.getRadius()) - (0.000001 * this.getRadius());
  }

  GetLngDistanceDiffrence() {
    let degree = this.getRadiusWithDegree();
    let MedianVal = (0.000002 * this.getRadius()) / 2;
    let val = (MedianVal * degree) / 33;
    return val;
    // return (0.000002 * this.getRadius()) / 2;
  }

  getRadiusWithDegree() {
    let degree = this.getDD2DMS(this.latLng.lat());
    let degreeMts = Math.cos(degree) * 111325;
    let val = Math.abs(degreeMts) / 1000000;
    if (!degree || degree == NaN)
      return 1;
    return degree;
  }

  getDD2DMS(dms): any {
    var sign = 1, Abs = 0;
    var days, minutes, secounds, direction;

    if (dms < 0) { sign = -1; }
    Abs = Math.abs(Math.round(dms * 1000000.));
    //Math.round is used to eliminate the small error caused by rounding in the computer:
    //e.g. 0.2 is not the same as 0.20000000000284
    //Error checks
    if (Abs > (90 * 1000000)) {
      //alert(" Degrees Latitude must be in the range of -90. to 90. ");
      return false;
    }

    days = Math.floor(Abs / 1000000);
    minutes = Math.floor(((Abs / 1000000) - days) * 60);
    secounds = (Math.floor(((((Abs / 1000000) - days) * 60) - minutes) * 100000) * 60 / 100000).toFixed();
    days = days * sign;
    direction = days < 0 ? 'S' : 'N';

    //else return value     
    return (days * sign);
    // return (days * sign) + 'º ' + minutes + "' " + secounds + "'' " + direction;
  }

}
