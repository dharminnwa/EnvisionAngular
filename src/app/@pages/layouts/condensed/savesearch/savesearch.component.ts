import { Component, OnInit, Input, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapServiceService } from '../../../../services/map-service.service';
import { AuthenticationService } from '../../../../services/auth.service';
import { CondensedComponent } from '../..';
import { UtilityService } from '../../../../services/Utility.service';
import { HttpRequestService } from '../../../../services/all-http-request.service';
import { tempLayerDataProp } from '../../../../models/layer-data-prop';
import { MyMapService } from '../../../../services/my-map.service';
import { ParcelBufferToolService } from '../../../../services/ParcelBufferTool.service';

@Component({
  selector: 'app-savesearch',
  templateUrl: './savesearch.component.html',
  styleUrls: ['./savesearch.component.scss']
})
export class SavesearchComponent implements OnInit {
  CondensedComponent: CondensedComponent
  constructor(
    public activeModal: NgbActiveModal,
    private MapService: MapServiceService,
    private AuthenticationService: AuthenticationService,
    private injector: Injector,
    private utilityService: UtilityService,
    private httpService: HttpRequestService,
    private myMapService: MyMapService,
    private parcelBufferService: ParcelBufferToolService

  ) { this.CondensedComponent = injector.get(CondensedComponent) }

  LayerName = "";
  LayerGroup = "";
  isParcelBufferSaveSearch: boolean = false;
  @Input() temporaryLayer: any;
  @Input() temporaryLayerID: any;
  @Input() FilterEneregyLayer: any;
  @Input() FilterEnergyLayerID: any;
  @Input() StatusOfSaveLayers: any;
  ngOnInit() {
    // Is Index of Parcel Buffer Layer Id
    if (this.temporaryLayerID) {
      if (this.temporaryLayerID.toString().indexOf(this.parcelBufferService.ParcelCenterPointData.DataSetID) != -1 || this.temporaryLayerID.toString().indexOf(this.parcelBufferService.ParcelCenterPointData.DataSetBoundryID) != -1)
        this.isParcelBufferSaveSearch = true;
    }
    this.utilityService.CloseModalOnRouteChange(this.activeModal);
    if (this.StatusOfSaveLayers == "EnergyLayerOrPrivateLayer") {
      this.LayerName = this.FilterEneregyLayer.DisplayName;
    } else {
      this.LayerName = this.temporaryLayer.data.Name;
      var i = this.LayerName.indexOf('-');
      this.LayerGroup = this.LayerName.substr(0, i);
    }

  }
  GetTemporyLayer() {
    let selectedTemporaryLayer = [];
    this.MapService.temporaryLayer.map((t) => {
      if (t.DataSetID == parseInt(this.temporaryLayerID)) {
        selectedTemporaryLayer.push(t);
      }
    });
    let userId = this.AuthenticationService.getLoggedinUserId();
    selectedTemporaryLayer[0].DataSetName = this.LayerName;
    selectedTemporaryLayer[0].Description = this.LayerName;
    selectedTemporaryLayer[0].Tags = this.LayerName;
    selectedTemporaryLayer[0].IsPublic = "False";
    selectedTemporaryLayer[0].IsEnabled = "True";
    selectedTemporaryLayer[0].SortNumber = "1";
    selectedTemporaryLayer[0].Count = "0";
    selectedTemporaryLayer[0].LayerTypeID = "9";
    selectedTemporaryLayer[0].IsSaveSearch = "True";
    selectedTemporaryLayer[0].IsLabelVisible = "False";
    selectedTemporaryLayer[0].PreviewImage = "http://mapsearch360.com/images/datasetimage.png";
    selectedTemporaryLayer[0].UploadedBy = userId;
    return selectedTemporaryLayer;
  }
  GetEnergyLayerorPrivateLayer() {
    let tempLayerObjPropObj = new tempLayerDataProp();
    if (this.FilterEneregyLayer.energyLayer && this.FilterEneregyLayer.energyLayer[0]) {
      let LayerList = this.FilterEneregyLayer.energyLayer[0];
      let userId = this.AuthenticationService.getLoggedinUserId();
      tempLayerObjPropObj.DataSetName = this.LayerName;
      tempLayerObjPropObj.Description = this.LayerName;
      tempLayerObjPropObj.Tags = this.LayerName;
      tempLayerObjPropObj.IsPublic = "False";
      tempLayerObjPropObj.SortNumber = "1";
      tempLayerObjPropObj.Count = "0";
      tempLayerObjPropObj.LayerTypeID = "9";
      tempLayerObjPropObj.IsSaveSearch = "True";
      tempLayerObjPropObj.IsLabelVisible = "False";
      tempLayerObjPropObj.PreviewImage = "http://mapsearch360.com/images/datasetimage.png";
      tempLayerObjPropObj.UploadedBy = userId;
      tempLayerObjPropObj.IconType = LayerList.IconType;
      tempLayerObjPropObj.StrokeThicknessPercent = LayerList.StrokeThicknessPercent;
      tempLayerObjPropObj.StrokeColor = LayerList.StrokeColor;
      tempLayerObjPropObj.FillColor = LayerList.FillColor;
      tempLayerObjPropObj.SizePercent = LayerList.SizePercent;
      tempLayerObjPropObj.Opacity = LayerList.Opacity
      tempLayerObjPropObj.IsEnabled = LayerList.IsEnabled;
      tempLayerObjPropObj.RepresentationType = LayerList.RepresentationType;
      tempLayerObjPropObj.TableName = LayerList.TableName;
      tempLayerObjPropObj.FilterValue = LayerList.FilterValue;
      tempLayerObjPropObj.DBFProperties = LayerList.DBFProperties;
      tempLayerObjPropObj.DetailPanelProperties = LayerList.DetailPanelProperties;
    }
    return tempLayerObjPropObj;
  }
  SaveLayer() {
    let SaveLayers = null;
    if (this.StatusOfSaveLayers == "EnergyLayerOrPrivateLayer") {
      SaveLayers = this.GetEnergyLayerorPrivateLayer();
    } else {
      let TemporaryLayer = this.GetTemporyLayer();
      SaveLayers = TemporaryLayer[0];
    }
    if (this.LayerName && SaveLayers) {
      //this.httpService._NodesaveTemporaryLayer(selectedTemporaryLayer[0]).subscribe(data => {
      this.httpService._NodesaveTemporaryLayer(SaveLayers).subscribe(data => {
        let resdatasetsData = data.json();
        let res = resdatasetsData;
        if (res._Issuccess && res.errormsg == "") {
          let insertedDataSetID = res.DataSetData[0].DataSetID;
          let EnergyLayerID = null;
          if (this.temporaryLayerID)
            EnergyLayerID = this.temporaryLayerID + 'RemovetemporaryTreeData';
          // else
          //   EnergyLayerID = this.FilterEnergyLayerID + 'RemoveTreeData';
          setTimeout(() => {
            let element: HTMLElement = document.getElementById(EnergyLayerID) as HTMLElement;
            if (element) {
              element.click();
            }
          }, 1000);
          if (res.DataSetData)
            this.CondensedComponent.AddLayerToMyDataLibrary(res.DataSetData[0]);
          if (this.StatusOfSaveLayers == "EnergyLayerOrPrivateLayer" && this.FilterEneregyLayer.EnergylayersavegridFilter.mapfilterval) {
            var xmlFilter = this.utilityService.ConvertMapGridCqlFilterToXML_new(this.FilterEneregyLayer.EnergylayersavegridFilter.mapfilterval, this.FilterEneregyLayer.EnergylayersavegridFilter["mapfilterColumns"]);
            //xmlFilter = this.utilityService.ConvertMapGridCqlFilterToXML(this.FilterEneregyLayer.EnergylayersavegridFilter.mapfilterval);
            let layerGridFilter_arry = [];
            var layerFilter = {
              LayerId: insertedDataSetID,
              IsEnergyLayer: "false",
              UserId: this.AuthenticationService.getLoggedinUserId(),
              FilterSaveString: xmlFilter
            }
            layerGridFilter_arry.push(layerFilter);
            this.httpService._NodesaveMapGridFilter(layerGridFilter_arry).subscribe(data => {
              this.CondensedComponent.GetPrivateLayerTreeData(insertedDataSetID);
            }, error => {
              this.CondensedComponent.GetPrivateLayerTreeData(insertedDataSetID);
              console.log(error);
            });
          } else {
            this.CondensedComponent.GetPrivateLayerTreeData(insertedDataSetID);
          }
          this.CloseSaveSearchResultModal();
        }
      });
    }
  }

  CloseSaveSearchResultModal() {
    let saveSearchClosebtn = document.getElementById("btnSavesearchClose");
    if (saveSearchClosebtn != null)
      saveSearchClosebtn.click();
  }
}
