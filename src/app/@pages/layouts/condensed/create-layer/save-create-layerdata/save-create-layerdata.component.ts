import { Component, OnInit, Input, Injector } from '@angular/core';
import { UtilityService } from '../../../../../services/Utility.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapServiceService } from '../../../../../services/map-service.service';
import { AuthenticationService } from '../../../../../services/auth.service';
import { HttpRequestService } from '../../../../../services/all-http-request.service';
import { CondensedComponent } from '../../condensed.component';

@Component({
  selector: 'app-save-create-layerdata',
  templateUrl: './save-create-layerdata.component.html',
  styleUrls: ['./save-create-layerdata.component.scss']
})
export class SaveCreateLayerdataComponent implements OnInit {

  LayerName = "";
  CondensedComponent: CondensedComponent;
  @Input() temporaryLayer: any;
  @Input() temporaryLayerID: any;
  constructor(public utilityService: UtilityService,
    public activeModal: NgbActiveModal,
    private MapService: MapServiceService,
    private AuthenticationService: AuthenticationService,
    private httpService: HttpRequestService,
    private injector: Injector) {
    this.CondensedComponent = injector.get(CondensedComponent);
  }

  ngOnInit() {
    this.utilityService.CloseModalOnRouteChange(this.activeModal);
    if (this.temporaryLayer && this.temporaryLayer.data && this.temporaryLayer.data.Name)
      this.LayerName = this.temporaryLayer.data.Name;
  }

  SaveLayer() {
    let parentNode = this.MapService.CreateLayerParentObj.getValue();
    if (parentNode) {
      let childLayers = [];
      this.MapService.temporaryLayer.map((t) => {
        if (t.ParentDataSetID == parentNode.DataSetID) {
          t.IsPublic = "False";
          t.IsEnabled = "True";
          t.SortNumber = "1";
          t.LayerTypeID = "9";
          t.IsSaveSearch = "False";
          t.IsLabelVisible = "False";
          childLayers.push(t);
        }
      });
      parentNode.DataSetName = this.LayerName;
      parentNode.IsPublic = "False";
      parentNode.IsEnabled = "True";
      parentNode.SortNumber = "True";
      parentNode.LayerTypeID = "9";
      parentNode.IsSaveSearch = "False";
      parentNode.IsLabelVisible = "False";
      let postData = {
        childs: childLayers,
        parent: parentNode
      }
      this.httpService._NodeSaveCreatedLayer(postData).subscribe(data => {
      let resdatasetsData = data.json();
      let res = resdatasetsData;
      if (res._Issuccess && res.errormsg == "") {
        let insertedDataSetID = res.DataSetData[0].DataSetID;
        setTimeout(() => {
          let tempTree = this.MapService.TemporaryTreeNode.getValue();
          let treeNode = tempTree.find(x => x.Id == this.temporaryLayerID);
          if (treeNode && treeNode.children && treeNode.children.length > 0) {
            let childElements = JSON.parse(JSON.stringify(treeNode.children));
            childElements.forEach(item => {
              let EnergyLayerID = item.Id + 'RemovetemporaryTreeData';
              let element: HTMLElement = document.getElementById(EnergyLayerID) as HTMLElement;
              if (element) {
                element.click();
              }
            });
          }
        }, 1000);
        this.CondensedComponent.GetPrivateLayerTreeData(insertedDataSetID);
        this.CloseSaveSearchResultModal();
        this.CondensedComponent.AddLayerToMyDataLibrary(res.DataSetData[0]);
      }
      });
    }
  }


  CloseSaveSearchResultModal() {
    this.activeModal.dismiss('Cross click');
  }

}
