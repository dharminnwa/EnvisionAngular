import { Component, OnInit, Injector } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { UtilityService } from '../../../../services/Utility.service';
import { environment } from '../../../../../environments/environment';
import { AuthenticationService } from '../../../../services/auth.service';
import { MapServiceService } from '../../../../services/map-service.service';
import { HttpRequestService } from '../../../../services/all-http-request.service';
import { tempLayerDataProp } from '../../../../models/layer-data-prop';
import { CondensedComponent } from '../condensed.component';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-create-layer',
  templateUrl: './create-layer.component.html',
  styleUrls: ['./create-layer.component.scss']
})
export class CreateLayerComponent implements OnInit {
  CondensedComponent: CondensedComponent;
  activeTab: number = 1;
  ImageURLPath: string = environment.ImagespreviewPath;
  treestatus = "GroupLayer";
  FeatureType = "CreateLayer";
  constructor(public bsModalRef: BsModalRef,
    public UtilityService: UtilityService,
    public MapServiceService: MapServiceService,
    public injector: Injector,
    public authServices: AuthenticationService,
    public httpRequestService: HttpRequestService,
    public authenticationService: AuthenticationService) {
    setTimeout(() => this.CondensedComponent = injector.get(CondensedComponent));
  }
  ngOnInit() {
    this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
    this.Draggable();
  }

  Draggable() {
    setTimeout(() => {
      $('.modal-dialog').draggable({
        handle: ".modal-header"
      });
    }, 10);
  }

  changeTab(tabNumber: number) {
    this.activeTab = tabNumber;
  }

  GetCommonTempObj(dataResult) {
    let tempLayerObjPropObj = new tempLayerDataProp();
    tempLayerObjPropObj.TreeStatus = dataResult.TreeStatus;
    tempLayerObjPropObj.Description = dataResult.Description;
    tempLayerObjPropObj.UploadedBy = this.authServices.getLoggedinUserId();
    tempLayerObjPropObj.Tags = dataResult.Tags;
    tempLayerObjPropObj.PreviewImage = dataResult.PreviewImage;
    tempLayerObjPropObj.IconType = dataResult.IconType;
    tempLayerObjPropObj.StrokeThicknessPercent = 10;
    tempLayerObjPropObj.StrokeColor = 'FF' + this.UtilityService.getRandomColor();
    tempLayerObjPropObj.FillColor = tempLayerObjPropObj.StrokeColor;
    tempLayerObjPropObj.SizePercent = 100;
    tempLayerObjPropObj.Opacity = 1;
    tempLayerObjPropObj.RepresentationType = dataResult.IconType;
    tempLayerObjPropObj.TableName = dataResult.TableName;
    tempLayerObjPropObj.LayerTypeID = dataResult.LayerTypeId;
    tempLayerObjPropObj.DBFProperties = dataResult.DBFProperties;
    tempLayerObjPropObj.DetailPanelProperties = dataResult.DetailPanelProperties;
    tempLayerObjPropObj.DetailPanelPropertiesMain = dataResult.DBFProperties;
    return tempLayerObjPropObj;
  }

  GetParentTempObject(TreeName, DataSet): tempLayerDataProp {
    let tempLayerObjPropObj = this.GetCommonTempObj(DataSet);
    tempLayerObjPropObj.DataSetID = DataSet.DataSetID;
    tempLayerObjPropObj.EnergyLayerID = tempLayerObjPropObj.DataSetID;
    tempLayerObjPropObj.IsIconDisabled = 'True';
    tempLayerObjPropObj.DataSetName = DataSet.DataSetName + TreeName;
    return tempLayerObjPropObj;
  }

  SetChildrenNodesByList(list: any[], parentNode, singleValFilterName: string, mulValFilterName: string, MulValFilterList: any[], DataSet, isRailRoadFilter: boolean = false) {
    let childList = [];
    for (let i = 0; i < list.length; i++) {
      let node = list[i];
      let tempObj = this.GetCommonTempObj(DataSet);
      tempObj.DataSetID = "600000" + (i + 1);
      tempObj.EnergyLayerID = tempObj.DataSetID;
      tempObj.IsIconDisabled = "False";
      tempObj.DataSetName = node.name;
      tempObj.ParentDataSetID = DataSet.DataSetID;
      tempObj.EnergyParentID = DataSet.DataSetID;
      let filterval = this.GetFilterVal(singleValFilterName, node.name, mulValFilterName, MulValFilterList);
      if (isRailRoadFilter == true)
        filterval = this.GetRailRoadFilter(singleValFilterName, node.name, mulValFilterName, MulValFilterList, parentNode, tempObj, DataSet, list);
      tempObj.FilterValue = filterval;
      childList.push(tempObj);
      this.AddLayeronTempVariable(tempObj);
    }
    let currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
    this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
    this.GenrateTree(childList, parentNode);
    this.MapServiceService.setCreateLayerParentObj(parentNode);
    $(".pace").css("display", "block");
  }

  AddLayeronTempVariable(tempobj) {
    if (this.MapServiceService.LayerIndex.getValue()) {
      let currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
      tempobj["Layerindexval"] = currentIndexVal;
    }
    this.MapServiceService.temporaryLayer.push(tempobj);
  }

  GetFilterVal(singleValOp: string, singleVal: string, mulValOp: string, mulvals: any[]) {
    let equalOp = "#EQUAL#";
   // equalOp = '#LIKE#';
    let filterVal = '';
    if (singleValOp && singleVal)
      filterVal += singleValOp + equalOp + singleVal;
    filterVal += ';'
    if (mulValOp && mulvals && mulvals.length > 0) {
      for (let i = 0; i < mulvals.length; i++) {
        let item = mulvals[i];
        filterVal += mulValOp + equalOp + item.name;
        if (i + 1 != mulvals.length)
          filterVal += '#OR#';
      }
    }
    return filterVal;
  }

  GenrateTree(childList, parentNode) {
    let childrennodelist = this.getChildrenTree(childList);
    let Tree = {
      Id: parentNode.DataSetID,
      Name: parentNode.DataSetName,
      children: childrennodelist,
      activeCount: 0,
      isSave: true,
      treestatus: this.treestatus,
      FeatureType: this.FeatureType
    }
    let treeList = [];
    treeList.push(Tree);
    this.CondensedComponent.SetTemporaryTreeNode(treeList);
    this.bsModalRef.hide();
    // $(".pace").css("display", "block");
  }

  RemoveExistingTempData(DataSetID) {
    let tempTree = this.MapServiceService.TemporaryTreeNode.getValue();
    if (tempTree && tempTree.length > 0) {
      let existingTreeIndex = tempTree.findIndex(x => x.Id == DataSetID);
      if (existingTreeIndex > -1) {
        // tempTree.splice(existingTreeIndex, 1);
        if (tempTree[existingTreeIndex] && tempTree[existingTreeIndex].children && tempTree[existingTreeIndex].children.length > 0) {
          let childData = JSON.parse(JSON.stringify(tempTree[existingTreeIndex].children));
          childData.forEach(x => {
            this.UtilityService.ActiveLayerData(x.Id, 'RemovetemporaryTreeData');
          });
        }
        tempTree.splice(existingTreeIndex, 1);
      }
    }
  }

  getChildrenTree(list) {
    let TreeChildNode = [];
    if (list.length > 0) {
      for (let t = 0; t < list.length; t++) {
        if (t < 25) {
          let TargetListval = list[t];
          TargetListval.id = TargetListval.DataSetID;
          let TreeProp = {
            IconUrl: environment.GetLayerIconURL + "/icongenerate/get/?Id=" + TargetListval.DataSetID + "&URLType=CustomStyleIcon&FillColor=" + TargetListval.StrokeColor + "&IconType=" + TargetListval.IconType + "&StrokeColor=" + TargetListval.StrokeColor + "&SizePercent=" + TargetListval.SizePercent + "&StrokeThicknessPercent=" + TargetListval.StrokeThicknessPercent + "&Opacity=1",
            Id: TargetListval.DataSetID,
            IsChecked: true,
            Name: TargetListval.DataSetName,
            isSave: false,
            treestatus: this.treestatus,
            FeatureType: this.FeatureType
          }
          TreeChildNode.push(TreeProp);
        }
        else {
          break;
        }
      }
    }
    return TreeChildNode;
  }

  GetRailRoadFilter(singleValOp: string, singleVal: string, mulValOp: string, mulvals: any[], parentObj: tempLayerDataProp, childObj: tempLayerDataProp, DataSet: any, singleValList: any[]) {
    let filterVal = '';
    let selectedCountry = 0; // 1: US, 2: Canada, 3: All Rails
    let TableName = DataSet.TableName;
    if (parentObj.DataSetName.includes('Owner')) {
      if (mulvals && mulvals.length == 1) {
        if (mulvals[0].name == "Canada") {
          TableName = DataSet.TableNameCa;
          selectedCountry = 2;
        } else if (mulvals[0].name == "United States") {
          TableName = DataSet.TableNameUs;
          selectedCountry = 1;
        }
        filterVal = this.GetSingleValFilterForRailRoad(singleValOp, singleVal);
      } else if (mulvals && mulvals.length == 2) {
        selectedCountry = 3;
        TableName = DataSet.TableNameAllCountry;
        filterVal = this.GetFilterVal(singleValOp, singleVal, mulValOp, mulvals);
      }
    } else if (parentObj.DataSetName.includes('Country')) {
      if (singleValList && singleValList.length == 1) {
        if (singleValList[0].name == "Canada") {
          TableName = DataSet.TableNameCa;
          selectedCountry = 2;
        } else if (singleValList[0].name == "United States") {
          TableName = DataSet.TableNameUs;
          selectedCountry = 1;
        }
        filterVal = this.GetSingleValFilterForRailRoad(mulValOp, mulvals, true);
      } else if (singleValList && singleValList.length == 2) {
        TableName = DataSet.TableNameAllCountry;
        selectedCountry = 3;
        filterVal = this.GetFilterVal(singleValOp, singleVal, mulValOp, mulvals);
      }
    }
    if (selectedCountry == 1) {
      this.SetDBFProperties(parentObj, childObj, DataSet.DBFPropertiesUs, DataSet.DetailPanelPropertiesUs);
    } else if (selectedCountry == 2) {
      this.SetDBFProperties(parentObj, childObj, DataSet.DBFPropertiesCa, DataSet.DetailPanelPropertiesCa);
    } else if (selectedCountry == 3) {
      this.SetDBFProperties(parentObj, childObj, DataSet.DBFPropertiesAll, DataSet.DetailPanelPropertiesAll);
    }
    parentObj.TableName = TableName;
    childObj.TableName = TableName;
    return filterVal;
  }

  GetSingleValFilterForRailRoad(ValOp: any, Val: any, isList = false) {
    let filterVal = '';
    let equalOp = "#EQUAL#"
    if (isList == false) {
      if (ValOp && Val)
        filterVal += ValOp + equalOp + Val;
    } else {
      if (ValOp && Val && Val.length > 0) {
        for (let i = 0; i < Val.length; i++) {
          let item = Val[i];
          filterVal += ValOp + equalOp + item.name;
          if (i + 1 != Val.length)
            filterVal += '#OR#';
        }
      }
    }
    return filterVal;
  }

  SetDBFProperties(parentObj: tempLayerDataProp, childObj: tempLayerDataProp, DBFProp: string, DetailPanelProp: string) {
    if (parentObj) {
      parentObj.DBFProperties = DBFProp;
      parentObj.DetailPanelProperties = DetailPanelProp;
      parentObj.DetailPanelPropertiesMain = DBFProp;
    }
    if (childObj) {
      childObj.DBFProperties = DBFProp;
      childObj.DetailPanelProperties = DetailPanelProp;
      childObj.DetailPanelPropertiesMain = DBFProp;
    }
  }
}
