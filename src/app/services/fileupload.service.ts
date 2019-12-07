import { Injectable } from '@angular/core';
import { MapServiceService } from './map-service.service';
import { CondensedComponent } from '../@pages/layouts';
import { GoogleMapPage } from '../maps/google/google.component';
import { HttpRequestService } from './all-http-request.service';
import { AuthenticationService } from './auth.service';
@Injectable()
export class FileuploadService {
    constructor(
        private MapServiceService: MapServiceService,
        private CondensedComponent: CondensedComponent,
        private GoogleMapPage: GoogleMapPage,
        private httpService: HttpRequestService,
        private authenticationService: AuthenticationService
    ) { }

    LoadLayersOfUploadedFiles(layerData: any) {
        let addDataClose = document.getElementById('btnAddDataclose');
        addDataClose.click();
        //this.MapServiceService.GetPrivateLayerData(layerData.result.MapLayers, 0, 1, '', '', '')
        if (layerData.result.MapLayers.length == 1) {
            layerData.result.MapLayers = layerData.result.MapLayers[0];
            layerData.result.MapLayers["TableName"] = layerData.result.MapLayers["TableName"].toLowerCase();
            let UserID = this.authenticationService.getLoggedinUserId();
            this.httpService._NodeGetPrivateLayerData(layerData.result.MapLayers, 0, 1, '', '', '',UserID)
                .subscribe(data => {
                    if (!layerData.result.TreeData[0]["activeCount"]) {
                        layerData.result.TreeData[0]["activeCount"] = 0;
                    }
                    this.CondensedComponent.setprivatetreenodes(layerData);
                    //if (data['_body'].indexOf('totalFeatures') > 0) {
                    if (data['totalFeatures']) {
                        if (!layerData.result.MapLayers["Layerindexval"] && this.MapServiceService.LayerIndex.getValue()) {
                            let currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
                            layerData.result.MapLayers["Layerindexval"] = currentIndexVal;
                            this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
                        }
                        if (!layerData.result.MapLayers["treestatus"]) {
                            layerData.result.MapLayers["treestatus"] = "Individual";
                        }
                        let detailPanelPropertyMain = layerData.result.MapLayers["DBFProperties"];
                        if (layerData.result.MapLayers["DBFProperties"] && !layerData.result.MapLayers["DetailPanelPropertiesMain"]) {
                            layerData.result.MapLayers["DBFProperties"] = layerData.result.MapLayers["DetailPanelProperties"];
                            layerData.result.MapLayers["DetailPanelPropertiesMain"] = detailPanelPropertyMain;
                        }
                        if (!layerData.result.MapLayers["EnergyParentID"]) {
                            layerData.result.MapLayers["EnergyParentID"] = 0;
                        }
                        if (!layerData.result.MapLayers["EnergyLayerID"]) {
                            layerData.result.MapLayers["EnergyLayerID"] = layerData.result.MapLayers["DataSetID"];
                        }
                        if (!layerData.result.MapLayers["EnergyLayerStylesByUserModel"]) {
                            layerData.result.MapLayers["EnergyLayerStylesByUserModel"] = [];
                        }
                        this.GoogleMapPage.privateLayer.push(layerData.result.MapLayers);
                        let MyDataLibraryClearButton: HTMLElement = document.getElementById('btnMyDataClear') as HTMLElement;
                        if (MyDataLibraryClearButton != null) {
                            MyDataLibraryClearButton.click();
                        }
                        this.CondensedComponent.AddLayerToMyDataLibrary(layerData.result.MapLayers);
                        //this.CondensedComponent.PrivateLayerVisible();
                        setTimeout(() => {
                            let Treeecheckboxlement: HTMLElement = document.getElementById(layerData.result.MapLayers.DataSetID + 'LoadlayerinPrivateTreeData') as HTMLElement;
                            if (Treeecheckboxlement != null)
                                Treeecheckboxlement.click();
                        }, 2500);
                    }
                }, error => {
                    console.log(error);
                });
        }
    }

    LoadKmlLayerOfUploadedFiles(layerData: any) {
        let addDataClose = document.getElementById('btnAddDataclose');
        addDataClose.click();
        if (!layerData.result.TreeData[0]["activeCount"]) {
            layerData.result.TreeData[0]["activeCount"] = 0;
        }
        this.CondensedComponent.setprivatetreenodes(layerData);
        if (layerData.result.MapLayers.length == 1) {
            layerData.result.MapLayers = layerData.result.MapLayers[0];
            if (!layerData.result.MapLayers["Layerindexval"] && this.MapServiceService.LayerIndex.getValue()) {
                let currentIndexVal = this.MapServiceService.LayerIndex.getValue().value;
                layerData.result.MapLayers["Layerindexval"] = currentIndexVal;
                this.MapServiceService.LayerIndex.getValue().value = currentIndexVal + 1;
            }
            if (!layerData.result.MapLayers["treestatus"]) {
                layerData.result.MapLayers["treestatus"] = "Individual";
            }
            let detailPanelPropertyMain = layerData.result.MapLayers["DBFProperties"];
            if (layerData.result.MapLayers["DBFProperties"] && !layerData.result.MapLayers["DetailPanelPropertiesMain"]) {
                layerData.result.MapLayers["DBFProperties"] = layerData.result.MapLayers["DetailPanelProperties"];
                layerData.result.MapLayers["DetailPanelPropertiesMain"] = detailPanelPropertyMain;
            }
            if (!layerData.result.MapLayers["EnergyParentID"]) {
                layerData.result.MapLayers["EnergyParentID"] = 0;
            }
            if (!layerData.result.MapLayers["EnergyLayerID"]) {
                layerData.result.MapLayers["EnergyLayerID"] = layerData.result.MapLayers["DataSetID"];
            }
            if (!layerData.result.MapLayers["EnergyLayerStylesByUserModel"]) {
                layerData.result.MapLayers["EnergyLayerStylesByUserModel"] = [];
            }
            this.GoogleMapPage.privateLayer.push(layerData.result.MapLayers);
            let MyDataLibraryClearButton: HTMLElement = document.getElementById('btnMyDataClear') as HTMLElement;
            if (MyDataLibraryClearButton != null) {
                MyDataLibraryClearButton.click();
            }
            this.CondensedComponent.AddLayerToMyDataLibrary(layerData.result.MapLayers);
            //this.CondensedComponent.PrivateLayerVisible();
            setTimeout(() => {
                let Treeecheckboxlement: HTMLElement = document.getElementById(layerData.result.MapLayers.DataSetID + 'LoadlayerinPrivateTreeData') as HTMLElement;
                if (Treeecheckboxlement == null) {
                    setTimeout(() => { Treeecheckboxlement.click(); }, 1000);
                }
                else
                    Treeecheckboxlement.click();
            }, 2500);
        }
    }
}