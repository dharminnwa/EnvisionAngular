import { Component, OnInit, Injector } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

import { MapServiceService } from '../../../../../services/map-service.service';
import { environment } from '../../../../../../environments/environment';
import { AuthenticationService } from '../../../../../services/auth.service';
import { UtilityService } from '../../../../../services/Utility.service';

import { CondensedComponent } from '../../../../../../app/@pages/layouts/condensed/condensed.component';

import * as _ from 'lodash';
import { tempLayerDataProp } from '../../../../../models/layer-data-prop';
import { HttpRequestService } from '../../../../../services/all-http-request.service';
import { CreateLayerComponent } from '../create-layer.component';

declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss']
})
export class PipelineComponent extends CreateLayerComponent implements OnInit {
  // CondensedComponent: CondensedComponent;
  // constructor(public bsModalRef: BsModalRef,
  //   public UtilityService: UtilityService,
  //   public MapServiceService: MapServiceService,
  //   public injector: Injector,
  //   public authServices: AuthenticationService,
  //   public httpRequestService: HttpRequestService
  // ) { 
  //   super(bsModalRef,UtilityService,MapServiceService,injector,authServices,httpRequestService); 
  // }
  public targetCommodities: Array<any> = [];
  public sourceCommodities: Array<any> = [];

  public targetOwner: Array<any> = [];
  public sourceOwner: Array<any> = [];
  public ColorByOwner: string = 'Owner';
  public ColorByOperator: string = 'Operator';
  public ColorBySystem: string = 'System';

  public targetOperator: Array<any> = [];
  public sourceOperator: Array<any> = [];
  
  public targetSystem: Array<any> = [];
  public sourceSystem: Array<any> = [];
  private AllPipelinecomodityList = {
    Commodities: [],
    OpConnections: [],
    OwConnections: [],
    SysConnections: [],
  }
  public PipelineLoader: boolean = true;
  public ActivePipelineTab: string = "Owner";
  public tempLayerDataPropList: any = [];

  dataResult = {
    Description: 'Pipelines wizard result',
    DataSetID: "200008",
    TreeStatus: 'GroupLayer',
    Tags: 'Pipelines wizard result',
    PreviewImage: 'http://mapsearch360.com/images/datasetimage.png',
    IconType: 'Line',
    TableName: 'import_xpipelines_2015_11_30',
    LayerTypeId: '9',
    DBFProperties: 'MSID,OWNER,NUMOWNERS,LEASED,OPERATOR,COMMODITY,COMMODITY2,PRIMBATCH1,SECBATCH1,PRIMBATCH2,SECBATCH2,LINETYPE,SYSTEM,DIAMETER,MDIAMETER,STATUS,CORRIDOR,SEGMENTNUM,TX_T4,TX_P5,UPDATED,UPDATED_SP,METACODE,LASTOWNER,LASTOPER,MILEAGE,COUNTRY,STATE_NAME,COUNTY,RELEASE_DT,SYSTYPE',
    DetailPanelProperties: 'Owner=OWNER,Operator=OPERATOR,Commodity=COMMODITY,Commodity2=COMMODITY2,Line Type=LINETYPE,System=SYSTEM,Diameter=DIAMETER,Status=STATUS,Mileage=MILEAGE,Country=COUNTRY,State=STATE_NAME,County=COUNTY',
    OwnerFieldName: "OWNER",
    CommodityFieldName: "COMMODITY",
    OperatorFieldName: "OPERATOR",
    SystemFieldName: "SYSTEM",
    DataSetName: "Pipelines by "
  }


  ImageURLPath: string = environment.ImagespreviewPath;
  ngOnInit() {
    try {
      this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
      let PipelinecreateToolListData = this.MapServiceService.PipelineCreateLayer.getValue();
      if (PipelinecreateToolListData != null) {
        // setTimeout(() => {
        this.setPipleLineresData(PipelinecreateToolListData);
        this.PipelineLoader = false;
        // }, 500);
      } else {
        let UserId = this.authServices.getLoggedinUserId();
        this.httpRequestService._NodeGetPipelineWizardData(UserId).subscribe(data => {
          if (data.errormsg == "" || data.errormsg == {}) {
            let PipleLineres = data;
            if (PipleLineres.Commodities.length > 0) {
              if (!PipelinecreateToolListData) {
                this.MapServiceService.setPipelinecreatetool(PipleLineres);
              }
              this.setPipleLineresData(PipleLineres);
              this.PipelineLoader = false;
            }
            else {
              alert("Please try again!..")
            }
          } else {
            console.log(data.errormsg);
          }
        }, error => {
          console.log(error);
        });
      }
    }
    catch (e) {
      console.log(e);
    }
    // setTimeout(() => {
    //   this.onSearchChangeevent();
    // }, 1000);
  }

  setPipleLineresData(PipleLineres) {
    let OwenerIndexval = 0;
    let OperatorIndexval = 0;
    let systemindexval = 0;
    for (let i = 0; i < PipleLineres.Commodities.length; i++) {
      let Commodityval = PipleLineres.Commodities[i];
      let propcomodity = {
        id: "" + i,
        name: Commodityval.Name,
        isChecked: false
      }
      this.sourceCommodities.push(propcomodity);
      this.AllPipelinecomodityList.Commodities.push(propcomodity);
      if (PipleLineres.Commodities[i].OwConnections.length > 0) {
        for (let o = 0; o < PipleLineres.Commodities[i].OwConnections.length; o++) {
          let Ownerval = PipleLineres.Commodities[i].OwConnections[o];
          let propowner = {
            ComodityId: "" + i,
            id: "" + OwenerIndexval,
            name: Ownerval,
            isChecked: false
          }
          // this.sourceOwner.push(propowner);
          this.AllPipelinecomodityList.OwConnections.push(propowner);
          OwenerIndexval++;
        }
      }
      
      if (PipleLineres.Commodities[i].OpConnections.length > 0) {
        for (let op = 0; op < PipleLineres.Commodities[i].OpConnections.length; op++) {
          let Operatorval = PipleLineres.Commodities[i].OpConnections[op];
          let proOperator = {
            ComodityId: "" + i,
            id: "" + OperatorIndexval,
            name: Operatorval,
            isChecked: false
          }
          //this.sourceOperator.push(proOperator);
          this.AllPipelinecomodityList.OpConnections.push(proOperator);
          OperatorIndexval++;
        }
      }
      if (PipleLineres.Commodities[i].SysConnections.length > 0) {
        for (let s = 0; s < PipleLineres.Commodities[i].SysConnections.length; s++) {
          let Systemval = PipleLineres.Commodities[i].SysConnections[s];
          let proSystem = {
            ComodityId: "" + i,
            id: "" + systemindexval,
            name: Systemval,
            isChecked: false
          }
          //this.sourceSystem.push(proSystem);
          this.AllPipelinecomodityList.SysConnections.push(proSystem);
          systemindexval++;
        }
      }
    }
    this.BindAllPicklist();
  }
  setPipelineActiveTab(Activetab) {
    this.ActivePipelineTab = Activetab;
  }
  BindAllPicklist() {

    this.sourceOwner = [];
    this.sourceOperator = [];
    this.sourceSystem = [];
    var wonitems = this.AllPipelinecomodityList.OwConnections.map(i => {
      return i;
    });
    wonitems = _.sortBy(wonitems, "name");
    wonitems = _.uniqBy(wonitems, "name");
    this.sourceOwner = wonitems;
    var opitems = this.AllPipelinecomodityList.OpConnections.map(i => {
      return i;
    });
    opitems = _.sortBy(opitems, "name");
    opitems = _.uniqBy(opitems, "name");
    this.sourceOperator = opitems;

    var sysitems = this.AllPipelinecomodityList.SysConnections.map(i => {
      return i;
    });
    sysitems = _.sortBy(sysitems, "name");
    sysitems = _.uniqBy(sysitems, "name");
    this.sourceSystem = sysitems;
    // this.sourceSystem.push(sysitems);
  }

  SortByKey(array, key) {
    return array.sort((a, b) => {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  OnChangeCommoditiesList(list: any[]) {
    this.targetCommodities = list;
    this.SetValuebasedonSelectComodity(this.targetCommodities);
  }

  OnChangeSystemList(list: any[]) {
    this.targetSystem = list;
  }

  OnChangeOperatorList(list: any[]) {
    this.targetOperator = list;
  }
  OnChangeOwnersList(list: any[]) {
    this.targetOwner = list;
  }

  SetValuebasedonSelectComodity(CommoditiesList) {
    if (CommoditiesList.length > 0) {
      let OwnerListlist = [];
      let Operatorlist = [];
      let Systemlist = [];
      // this.targetOwner = [];
      // this.targetOperator = [];
      // this.targetSystem = [];
      
      for (let tc = 0; tc < CommoditiesList.length; tc++) {
        let tcval = CommoditiesList[tc];
        for (let ow = 0; ow < this.AllPipelinecomodityList.OwConnections.length; ow++) {
          let Owval = this.AllPipelinecomodityList.OwConnections[ow];
          if (tcval.id == Owval.ComodityId) {
            OwnerListlist.push(Owval);
          }
        }
        for (let op = 0; op < this.AllPipelinecomodityList.OpConnections.length; op++) {
          let Opval = this.AllPipelinecomodityList.OpConnections[op];
          if (tcval.id == Opval.ComodityId) {
            Operatorlist.push(Opval);
          }
        }
        for (let sy = 0; sy < this.AllPipelinecomodityList.SysConnections.length; sy++) {
          let syval = this.AllPipelinecomodityList.SysConnections[sy];
          if (tcval.id == syval.ComodityId) {
            Systemlist.push(syval);
          }
        }
      }
      this.sourceOwner = [];
      this.sourceOperator = [];
      this.sourceSystem = [];
      var size = 850;
      var wonitems = OwnerListlist.map(i => {
        return i;
      });
      wonitems = _.uniqBy(wonitems, "name");
      this.sourceOwner = wonitems;

      var opitems = Operatorlist.map(i => {
        return i;
      });
      opitems = _.uniqBy(opitems, "name");
      this.sourceOperator = opitems;

      var sysitems = Systemlist.map(i => {
        return i;
      });
      sysitems = _.uniqBy(sysitems, "name");
      this.sourceSystem = sysitems;
    }
    else {
      this.BindAllPicklist();
    }
  }

  CreateLayerForPipelineOwner() {
    this.RemoveExistingTempData(this.dataResult.DataSetID);
    let tempObjParent = this.GetParentTempObject(this.ColorByOwner, this.dataResult);
    if (this.ColorByOwner == 'Owner') {
      this.SetChildrenNodesByList(this.targetOwner, tempObjParent, this.dataResult.OwnerFieldName, this.dataResult.CommodityFieldName,this.targetCommodities, this.dataResult);
    } else { // Color by Commodity
      this.SetChildrenNodesByList(this.targetCommodities, tempObjParent, this.dataResult.CommodityFieldName, this.dataResult.OwnerFieldName, this.targetOwner, this.dataResult);
    }
  }

  CreateLayerForPipelineOperator() {
    this.RemoveExistingTempData(this.dataResult.DataSetID);
    let tempObjParent = this.GetParentTempObject(this.ColorByOperator, this.dataResult);
    if (this.ColorByOperator == 'Operator') {
      this.SetChildrenNodesByList(this.targetOperator, tempObjParent, this.dataResult.OperatorFieldName, this.dataResult.CommodityFieldName,this.targetCommodities, this.dataResult);
    } else { // Color by Commodity
      this.SetChildrenNodesByList(this.targetCommodities, tempObjParent, this.dataResult.CommodityFieldName, this.dataResult.OperatorFieldName, this.targetOperator, this.dataResult);
    }
  }

  CreateLayerForPipelineSystem() {
    this.RemoveExistingTempData(this.dataResult.DataSetID);
    let tempObjParent = this.GetParentTempObject(this.ColorBySystem, this.dataResult);
    if (this.ColorBySystem == 'System') {
      this.SetChildrenNodesByList(this.targetSystem, tempObjParent, this.dataResult.SystemFieldName, this.dataResult.CommodityFieldName,this.targetCommodities, this.dataResult);
    } else { // Color by Commodity
      this.SetChildrenNodesByList(this.targetCommodities, tempObjParent, this.dataResult.CommodityFieldName, this.dataResult.SystemFieldName, this.targetSystem, this.dataResult);
    }
  }

}
