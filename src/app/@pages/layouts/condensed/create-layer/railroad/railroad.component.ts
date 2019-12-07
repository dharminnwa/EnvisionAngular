import { Component, OnInit, Injector } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

import { MapServiceService } from '../../../../../services/map-service.service';
import { UtilityService } from '../../../../../services/Utility.service';

import { CondensedComponent } from '../../../../../../app/@pages/layouts/condensed/condensed.component';
import { environment } from '../../../../../../environments/environment';
import * as _ from 'lodash';
import { HttpRequestService } from '../../../../../services/all-http-request.service';
import { CreateLayerComponent } from '../create-layer.component';
import { AuthenticationService } from '../../../../../services/auth.service';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-railroad',
  templateUrl: './railroad.component.html',
  styleUrls: ['./railroad.component.scss']
})
export class RailroadComponent extends CreateLayerComponent implements OnInit {
  CondensedComponent: CondensedComponent;
  railRoadLoader: boolean = false;
  // constructor(
  //   public bsModalRef: BsModalRef,
  //   private MapServiceService: MapServiceService,
  //   private injector: Injector,
  //   private UtilityService: UtilityService,
  //   private httpRequestService: HttpRequestService,
  //   private authenticationService: AuthenticationService) {
  //   setTimeout(() => this.CondensedComponent = injector.get(CondensedComponent));
  // }
  public targetCountry: Array<any> = [];
  public sourceCountry: Array<any> = [
    // { id: "71", name: "USA", isChecked: false },
    // { id: "72", name: "Canada", isChecked: false },
  ];

  public isSourceListSelectAllRailOwner: boolean = false;
  public isTargetListSelectAllRailOwner: boolean = false;
  public targetRailOwner: Array<any> = [];
  public sourceRailOwner: Array<any> = [];
  private AllRailroadList = {
    country: [],
    OwConnections: []
  }
  public ColorByOwner: string = 'Owner';
  ImageURLPath: string = environment.ImagespreviewPath;

  dataResult = {
    Description: 'Railroad wizard result',
    DataSetID: "200008",
    TreeStatus: 'GroupLayer',
    Tags: 'Railroad wizard result',
    PreviewImage: 'http://mapsearch360.com/images/datasetimage.png',
    IconType: 'Line',
    TableName: 'us_rail',
    TableNameUs: 'us_rail',
    TableNameCa: 'ca_rail',
    TableNameAllCountry: 'all_rail',
    LayerTypeId: '9',
    DBFProperties: 'RAILROAD,owner_code,owner,TR,PASSENGER,MILITARY,FRA_REG,CLASS,MILES',
    DetailPanelProperties: 'Rail=RAILROAD,Owner=owner, Miles=MILES, Class=CLASS',
    DBFPropertiesUs: 'RAILROAD,owner_code,owner,TR,PASSENGER,MILITARY,FRA_REG,CLASS,MILES',
    DetailPanelPropertiesUs: 'Rail=RAILROAD,Owner=owner, Miles=MILES, Class=CLASS',
    DBFPropertiesCa: 'owner,f_code,prov_en,prov_fr,owner_code',
    DetailPanelPropertiesCa: 'Code=f_code,Owner=owner',
    DBFPropertiesAll: 'owner,owner_code,country,OBJECTID',
    DetailPanelPropertiesAll: 'Owner=owner,Owner Code=owner_code,Country=country',
    OwnerFieldName: "owner",
    CountryFieldName: "country",
    DataSetName: "Railroads by "
  }
  ngOnInit() {
    this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
    // setTimeout(() => {
    this.RailRoadInit();
    // this.onSearchChangeforRailroadevent();
    // }, 1500);
  }

  RailRoadInit() {
    let RailraodcreateToolListData = this.MapServiceService.RailRoadCreateLayer.getValue();
    if (RailraodcreateToolListData != null) {
      // setTimeout(() => {
      this.setRailRoadData(RailraodcreateToolListData);
      //this.PipelineLoader = false;
      // }, 300);
    } else {
      this.railRoadLoader = true;
      let Userid = this.authenticationService.getLoggedinUserId();
      this.httpRequestService._NodeGetRailWizardData(Userid).subscribe(data => {
        if (data.errormsg == "" || data.errormsg == {}) {
          let Railwizard = data;
          if (Railwizard.Countries.length > 0) {
            if (!RailraodcreateToolListData) {
              this.MapServiceService.setRailroadcreatetool(Railwizard);
            }
            this.setRailRoadData(Railwizard);
          } else {
            alert("Please try again!");
          }
        } else {
          console.log(data.errormsg);
        }
        this.railRoadLoader = false;
      }, error => {
        console.log(error);
      });
    }
  }

  setRailRoadData(Railwizard) {
    let OwenerIndexval = 0;
    for (let r = 0; r < Railwizard.Countries.length; r++) {
      let Railwizardvalue = Railwizard.Countries[r];
      let propCountry = {
        id: "" + r,
        name: Railwizardvalue.Name,
        isChecked: false
      }
      this.sourceCountry.push(propCountry);
      this.AllRailroadList.country.push(propCountry);
      if (Railwizard.Countries[r].OwConnections.length > 0) {
        for (let o = 0; o < Railwizard.Countries[r].OwConnections.length; o++) {
          let Ownerval = Railwizard.Countries[r].OwConnections[o];
          if (Ownerval) {
            let propowner = {
              ComodityId: "" + r,
              id: "" + OwenerIndexval,
              name: Ownerval,
              isChecked: false
            }
            this.AllRailroadList.OwConnections.push(propowner);
            OwenerIndexval++;
          }

        }
      }
    }
    this.BindAllRailRoad();
  }

  OnChangeCountryList(list: any[]) {
    this.targetCountry = list;
    this.SetValuebasedonSelectCountry(this.targetCountry);
  }

  OnChangeOwnerList(list: any[]) {
    this.targetRailOwner = list;
  }

  SetValuebasedonSelectCountry(CountryList) {

    if (CountryList.length > 0) {
      let OwnerListlist = [];
      // this.targetRailOwner = [];
      this.sourceRailOwner = [];
      for (let tc = 0; tc < CountryList.length; tc++) {
        let tcval = CountryList[tc];
        for (let ow = 0; ow < this.AllRailroadList.OwConnections.length; ow++) {
          let Owval = this.AllRailroadList.OwConnections[ow];
          if (tcval.id == Owval.ComodityId) {
            OwnerListlist.push(Owval);
          }
        }
      }
      this.sourceRailOwner = [];
      OwnerListlist = _.uniqBy(OwnerListlist, "name");
      OwnerListlist = _.sortBy(OwnerListlist, "name");
      this.sourceRailOwner = OwnerListlist;
    }
    else {
      this.BindAllRailRoad();
    }
  }

  BindAllRailRoad() {
    let wonitems = _.unionBy(this.AllRailroadList.OwConnections, "name");
    wonitems = _.sortBy(wonitems, "name");
    this.sourceRailOwner = wonitems;
  }

  CreateLayerForRailRoadOwner() {
    this.RemoveExistingTempData(this.dataResult.DataSetID);
    let tempObjParent = this.GetParentTempObject(this.ColorByOwner, this.dataResult);
    if (this.ColorByOwner == 'Owner') {
      this.SetChildrenNodesByList(this.targetRailOwner, tempObjParent, this.dataResult.OwnerFieldName, this.dataResult.CountryFieldName, this.targetCountry, this.dataResult, true);
    } else { // Color by Commodity
      this.SetChildrenNodesByList(this.targetCountry, tempObjParent, this.dataResult.CountryFieldName, this.dataResult.OwnerFieldName, this.targetRailOwner, this.dataResult, true);
    }
  }
}
