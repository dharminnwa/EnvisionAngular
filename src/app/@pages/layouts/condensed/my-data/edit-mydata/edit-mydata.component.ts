import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from '../../../../../services/Utility.service';
import { HttpRequestService } from '../../../../../services/all-http-request.service';
import { MapServiceService } from '../../../../../services/map-service.service';

@Component({
    selector: 'edit-mydata-modal',
    templateUrl: './edit-mydata.component.html',
    styleUrls: ['./edit-mydata.component.scss']
})
export class EditMyDataComponent implements OnInit {
    @Input() PrivateLayerData: any;
    FormName = '';
    FormDescription = '';
    isShare: boolean = false;
    public LayerStyleVisibleList = {
        TitleName: 'Point',
        Border: '#8db3e2',
        Color: '#8db3e2',
        Size: 50,
        Thickness: 10,
        Transparency: 0,
        defaultIconURL: ''
    }

    constructor(public activeModal: NgbActiveModal,
        private utilityService: UtilityService,
        private httpService: HttpRequestService,
        private MapServiceService: MapServiceService
    ) { }

    ngOnInit() {
        this.utilityService.CloseModalOnRouteChange(this.activeModal);
        this.LayerStyleVisibleList.TitleName = this.PrivateLayerData.RepresentationType.toLowerCase() != "none" || this.PrivateLayerData.RepresentationType != null ? this.PrivateLayerData.RepresentationType : "Point";
        this.setValueinControls(this.PrivateLayerData);
        this.SetValueInFormData(this.PrivateLayerData);
        //this.LayerStyleVisibleList.defaultIconURL = 
    }

    SetValueInFormData(layer) {
        this.FormName = layer.DataSetName;
        this.FormDescription = layer.Description != null ? layer.Description : "";
        this.isShare = layer.IsPublic;
    }

    setValueinControls(layer) {

        this.LayerStyleVisibleList.Size = (parseInt(layer["SizePercent"]));
        this.LayerStyleVisibleList.Thickness = (parseInt(layer["StrokeThicknessPercent"]));
        this.LayerStyleVisibleList.Transparency = this.getOpacityFromPercentage(layer["Opacity"]);
        this.LayerStyleVisibleList.Color = "#" + this.getHexValueWithAlpha(layer["FillColor"]);
        if (this.LayerStyleVisibleList.TitleName == "Point")
            this.LayerStyleVisibleList.Border = "#" + this.getHexValueWithAlpha(layer["StrokeColor"]);
        else if (this.LayerStyleVisibleList.TitleName == "Line")
            this.LayerStyleVisibleList.Color = "#" + this.getHexValueWithAlpha(layer["StrokeColor"]);
        // let encolor = "#" + this.getHexValueWithAlpha(layer["FillColor"]);
        // let enborder = "#" + this.getHexValueWithAlpha(layer["StrokeColor"]);
        // this.Border = "#" + this.getHexValueWithAlpha(layer["StrokeColor"]);
        // this.color = "#" + this.getHexValueWithAlpha(layer["FillColor"]);

        this.LayerStyleVisibleList["layerStyle"] = {
            opacity: layer["Opacity"],
            fillColor: layer["FillColor"],
            strokeColor: layer["StrokeColor"],
            strokeThicknessPercentage: layer["StrokeThicknessPercent"],
            sizePercentage: layer["SizePercent"],
        }
    }

    getOpacityFromPercentage(percentage) {
        let opacityPoint = 1;
        if (parseInt(percentage) > 0) {
            opacityPoint = 1 - (parseInt(percentage) / 100);
        }
        return opacityPoint;
    }

    getHexValueWithAlpha(color) {
        color = color.replace('#', '');
        if (color.length == 8) {
            color = color.substring(2);
        }
        return color;
    }

    SaveMyData() {
        let layerData = {
            DataSetName: this.FormName,
            Description: this.FormDescription,
            userId: this.PrivateLayerData.UploadedBy,
            layerId: this.PrivateLayerData.DataSetID,
            isShare: this.isShare
        }
        this.httpService._NodeUpdateMyDataLayer(layerData).subscribe(data => {
            if (data._Issuccess == true) {
                let myLibraryData = this.MapServiceService.MyDataLayerLibrary.getValue();
                if (myLibraryData && myLibraryData[0].LayerLibrary && myLibraryData[0].LayerLibrary.length > 0) {
                    let layerData = myLibraryData[0].LayerLibrary;
                    let item = layerData.find(x => x.DataSetID == this.PrivateLayerData.DataSetID);
                    if (item) {
                        item.DataSetName = this.FormName;
                        item.Description = this.FormDescription;
                        item.IsPublic = this.isShare;
                        this.MapServiceService.setMyDataLayerLibrary(myLibraryData);
                        this.UpdatePrivateTreeData();
                        this.UpdateGridTabData();
                    }
                }
                this.activeModal.dismiss();
            }
        })
    }

    UpdatePrivateTreeData() {
        let privateTreeUI = this.MapServiceService._PrivateTreeUI.getValue()
        if (privateTreeUI.treeModel.nodes) {
            let existnode = privateTreeUI.treeModel.getNodeById(this.PrivateLayerData.DataSetID);
            if (existnode) {
                existnode.data.Name = this.FormName;
            }
        }
        setTimeout(() => {
            privateTreeUI.treeModel.update();
        }, 500);
    }

    UpdateGridTabData() {
        let TabDatalist = this.MapServiceService._GridTabData.value;
        var isBreakParentLoop = false;
        for (let tabdata of TabDatalist) {
            for (let el of tabdata.energyLayer) {
                if (el.DataSetID == this.PrivateLayerData.DataSetID) {
                    el.DataSetName = this.FormName;
                    el.Description = this.FormDescription;
                    el.IsPublic = this.isShare;
                    tabdata.DisplayName = this.FormName;
                    tabdata.Title = this.FormName;
                    isBreakParentLoop = true;
                    break;
                }
            }
            if (isBreakParentLoop)
                break;
        }
    }
}