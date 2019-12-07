import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';

import { MapServiceService } from '../../../../services/map-service.service';
import { AuthenticationService } from '../../../../services/auth.service';
import { MessageService } from '../../../../@pages/components/message/message.service';
import { MapLayerService } from '../../../../services/MapLayer-service';
import { PrivateMapLayerService } from '../../../../services/private-maplayer-service';
import { UtilityService } from '../../../../services/Utility.service';

import { GoogleMapPage } from '../../../../maps/google/google.component';

import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { DeleteExternalsymbolsComponent } from './delete-externalsymbols/delete-externalsymbols.component';

import * as _ from 'lodash';
import { HttpRequestService } from '../../../../services/all-http-request.service';
import { StoredData } from '../../../../maps/maps-tab-data/maps-tab-data.component';
import { MyMapService } from '../../../../services/my-map.service';
import { MapLayernewService } from '../../../../services/MapLayer-new-service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-map-layer-styles',
  templateUrl: './map-layer-styles.component.html',
  styleUrls: ['./map-layer-styles.component.scss']
})
export class MapLayerStylesComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private MapServiceService: MapServiceService,
    private AuthenticationService: AuthenticationService,
    private _notification: MessageService,
    private MapLayerService: MapLayerService,
    private MapLayerNewService: MapLayernewService,
    private GoogleMapPage: GoogleMapPage,
    private bsModalService: BsModalService,
    private PrivateMapLayerService: PrivateMapLayerService,
    private UtilityService: UtilityService,
    private httpRequest: HttpRequestService,
    public myMapService: MyMapService, ) { }
  @Input() Nodedata: any;
  @Input() Node: any;
  @Input() ActiveEnergyLayerList: any;
  @Input() LayerType: string;
  LayerName = "";
  LayerDescription = "";
  LayerIsShared = false;
  public LayerStyleVisibleList = {
    TitleName: 'Point',
    Border: '#8db3e2',
    Color: '#8db3e2',
    Size: 50,
    Thickness: 10,
    Transparency: 0,
    defaultIconURL: '',
    EnergyLayerId: 0,
    UserId: this.AuthenticationService.getLoggedinUserId()
  }
  isFloodHazardZones: boolean = false;
  LayerTypesEnum = Object.freeze({ "EL": "EnergyLayer", "PL": "PrivateLayer" });
  private IconsnameList = ["Circle", "Rectangle", "RoundedRectangle", "Rhombus", "TriangleUp", "TriangleDown", "TriangleRight", "TriangleLeft", "Pentagon", "Pentagram", "AsphaltRefinery", "ChemicalPlant", "DehydrationPlant", "DeliveryPoint", "GasProcessingPlant", "IndustrialPlant"
    , "LNGTerminal", "LPGFractionator", "Mine", "NaturalGasMarketingHub", "Refinery", "Storage"
    , "TruckUnloader", "UndergroundStorage", "Airport", "BullsEye", "CheckeredCircle", "CheckeredSquare"
    , "Pointer", "HalfCircle", "HalfSquare", "OilDerrick"];
  iconType = "Point";
  IconList = [];
  iconUrl = environment.GetLayerIconURL + "/icongenerate/get/?";
  defaultIconURL = "";
  LabelField = "";
  ImageURLPath: string = environment.ImagespreviewPath;
  imagesmapsearch360 = this.ImageURLPath;
  CustomeiconList = [this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/54.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/53.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/55.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/56.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/88.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/89.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/90.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/91.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/92.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/93.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/94.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/95.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/96.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/97.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/98.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/99.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/103.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/105.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/107.png"
    , this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/113.png"];
  CustomeSymbols = [];
  ngOnInit() {
    this.UtilityService.CloseModalOnRouteChange(this.activeModal);
    setTimeout(() => {
      this.FillColorandCorderColor();
      this.UtilityService.HovereventForMapSearchData();
    }, 100);
    let EnergyLayerID = this.Node['data'].Id;
    let parentid = this.Node['parent'].data.Id;
    let TabDatalist = this.MapServiceService._GridTabData.value;
    this.LayerStyleVisibleList.defaultIconURL = this.Nodedata.IconUrl;
    this.defaultIconURL = this.Nodedata.IconUrl
    let IsActive = true;
    for (let tabdata of TabDatalist) {
      for (let el of tabdata.energyLayer) {
        if (el.treestatus === "GroupLayer") {
          if (el.EnergyParentID == parseInt(parentid) && el.treestatus === "GroupLayer" && el.EnergyLayerID == parseInt(EnergyLayerID)) {
            IsActive = false;
            if (el.EnergyLayerStylesByUserModel.length > 0) {
              this.setIcononPointbtn(el.EnergyLayerStylesByUserModel[0]);
            } else { this.setIcononPointbtn(el); }
            this.SetLayerProperies(el);
            switch (this.LayerType) {
              case this.LayerTypesEnum.PL:
                this.SetLayerDetails(el);
                break;
            }
          }
        }
        else if (el.treestatus === "Individual") {
          switch (this.LayerType) {
            case this.LayerTypesEnum.EL:
              if (el.EnergyParentID == parseInt(parentid) && el.treestatus === "Individual" && el.EnergyLayerID == parseInt(EnergyLayerID)) {
                IsActive = false;
                if (el.EnergyLayerStylesByUserModel.length > 0) {
                  this.SetRepresentationTypeForEnergyLayerStyle(el);
                  this.setIcononPointbtn(el.EnergyLayerStylesByUserModel[0]);
                } else { this.setIcononPointbtn(el); }
                this.SetLayerProperies(el);
              }
              break;
            case this.LayerTypesEnum.PL:
              if (/* el.EnergyParentID == parseInt(parentid) && */ el.treestatus === "Individual" && el.EnergyLayerID == parseInt(EnergyLayerID)) {
                IsActive = false;
                if (el.EnergyLayerStylesByUserModel.length > 0) {
                  this.setIcononPointbtn(el.EnergyLayerStylesByUserModel[0]);
                } else { this.setIcononPointbtn(el); }
                this.SetLayerProperies(el);
                this.SetLayerDetails(el);
              }
              break;
          }
        }
      }
    }
    if (IsActive == true) {
      for (let el of this.ActiveEnergyLayerList) {
        if (el.treestatus === "GroupLayer") {
          if (el.EnergyParentID == parseInt(parentid) && el.treestatus === "GroupLayer" && el.EnergyLayerID == parseInt(EnergyLayerID)) {
            if (el.EnergyLayerStylesByUserModel.length > 0) {
              this.setIcononPointbtn(el.EnergyLayerStylesByUserModel[0]);
            } else { this.setIcononPointbtn(el); }
            this.SetLayerProperies(el);
            switch (this.LayerType) {
              case this.LayerTypesEnum.PL:
                this.SetLayerDetails(el);
                break;
            }
          }
        }
        else if (el.treestatus === "Individual") {
          switch (this.LayerType) {
            case this.LayerTypesEnum.EL:
              if (el.EnergyParentID == parseInt(parentid) && el.treestatus === "Individual" && el.EnergyLayerID == parseInt(EnergyLayerID)) {
                if (el.EnergyLayerStylesByUserModel.length > 0) {
                  this.SetRepresentationTypeForEnergyLayerStyle(el);
                  this.setIcononPointbtn(el.EnergyLayerStylesByUserModel[0]);
                } else { this.setIcononPointbtn(el); }
                this.SetLayerProperies(el);
              }
              break;
            case this.LayerTypesEnum.PL:
              if (/* el.EnergyParentID == parseInt(parentid) && */ el.treestatus === "Individual" && el.EnergyLayerID == parseInt(EnergyLayerID)) {
                if (el.EnergyLayerStylesByUserModel.length > 0) {
                  this.setIcononPointbtn(el.EnergyLayerStylesByUserModel[0]);
                } else { this.setIcononPointbtn(el); }
                this.SetLayerProperies(el);
                this.SetLayerDetails(el);
              }
              break;
          }
        }
      }
    }

  }
  //OnlyForPointLayer
  SetRepresentationTypeForEnergyLayerStyle(energyLayer) {
    if (!energyLayer.EnergyLayerStylesByUserModel[0].RepresentationType) {
      if (energyLayer.RepresentationType.toLowerCase() == "point")
        energyLayer.EnergyLayerStylesByUserModel[0].RepresentationType = energyLayer.RepresentationType;
    }
  }

  FillColorandCorderColor() {
    $('#Fillcolorlayer').colorpicker({
      color: this.LayerStyleVisibleList.Color,
      history: false,
      transparentColor: false,
      defaultPalette: 'theme',
      displayIndicator: false,
      strings: "Theme Colors,Standard Colors,More Colors,Theme Colors,Back to Palette,History,Pas encore d'historique."
    });
    $("#Fillcolorlayer").on("change.color", (event, color) => {
      let colorval = $("#Fillcolorlayer").val();
      this.LayerStyleVisibleList.Color = colorval;
      this.SetcurrentVal(colorval, "Color");
      // $('#title').css('background-color', color);
    });
    //FillBorderlayer
    $('#FillBorderlayer').colorpicker({
      color: this.LayerStyleVisibleList.Border,
      history: false,
      transparentColor: false,
      defaultPalette: 'theme',
      displayIndicator: false,
      strings: "Theme Colors,Standard Colors,More Colors,Theme Colors,Back to Palette,History,Pas encore d'historique."
    });
    $("#FillBorderlayer").on("change.color", (event, color) => {
      let colorval = $("#FillBorderlayer").val();
      this.LayerStyleVisibleList.Border = colorval;
      this.SetcurrentVal(colorval, "border");
      // $('#title').css('background-color', color);
    });
  }
  setIcononPointbtn(EnergyLayer) {
    let image = this.Nodedata.IconUrl;
    if (image.indexOf(this.imagesmapsearch360) >= 0) {
      this.iconType = "ExternalIcon";
    }
    else {
      let splitedval = image.split('?');
      let urlval = splitedval[1].split('&');
      for (let urlpro of urlval) {
        let URLsplitedval = urlpro.split('=');
        if (URLsplitedval[0] == "IconType") {
          this.iconType = URLsplitedval[1];
        }
      }
    }
    this.iconType = this.UtilityService.getIconType(this.iconType);
    if (!EnergyLayer.EnergyLayerID)
      this.LayerStyleVisibleList.EnergyLayerId = EnergyLayer.EnergyLayerId;
    else
      this.LayerStyleVisibleList.EnergyLayerId = EnergyLayer.EnergyLayerID;
    if (EnergyLayer.IconType == "RoundedRectangle" && EnergyLayer.RepresentationType == "Point") {
      this.iconType = "Point";
    }
    if (this.iconType == "Point") {
      this.LayerStyleVisibleList.TitleName = "Point";
      this.setValueinControls(EnergyLayer);
      this.updateEnvisionIcons(EnergyLayer);
    }
    else if (this.iconType == "Line") {
      this.LayerStyleVisibleList.TitleName = "Line";
      this.setValueinControls(EnergyLayer);
      this.UpdateEnvisionLineIcon(EnergyLayer);
    }
    else if (this.iconType == "Area" || this.iconType == "RoundedRectangle") {
      this.LayerStyleVisibleList.TitleName = "Area";
      this.setValueinControls(EnergyLayer);
    }
  }
  UpdateEnvisionLineIcon(EnergyLayer) {
    let list = [];
    let opacity = EnergyLayer["Opacity"];
    let fillColor = EnergyLayer["FillColor"];
    let strokeColor = EnergyLayer["StrokeColor"];
    let strokeThicknessPercentage = EnergyLayer["StrokeThicknessPercent"];
    let sizePercentage = EnergyLayer["SizePercent"];
    // for (let i = 0; i < this.IconsnameList.length; i++) {
    this.IconList = [];
    let imgURL = this.generateIconUrl(0, "Line", EnergyLayer, opacity, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage);
    list.push(imgURL);
    imgURL = this.generateIconUrl(1, "DashLine", EnergyLayer, opacity, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage);
    list.push(imgURL);
    //}
    this.IconList.push(list);
  }
  updateEnvisionIcons(EnergyLayer) {
    let list = [];
    let opacity = EnergyLayer["Opacity"];
    let fillColor = EnergyLayer["FillColor"];
    let strokeColor = EnergyLayer["StrokeColor"];
    let strokeThicknessPercentage = EnergyLayer["StrokeThicknessPercent"];
    let sizePercentage = EnergyLayer["SizePercent"];
    opacity = this.LayerStyleVisibleList.Transparency;
    for (let i = 0; i < this.IconsnameList.length; i++) {
      let imgURL = this.generateIconUrl(i, this.IconsnameList[i], EnergyLayer, opacity, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage);
      list.push(imgURL);
    }
    this.IconList.push(list);
  }
  SelectIcon(SelectedIconicon) {

    if (SelectedIconicon.indexOf(this.imagesmapsearch360) >= 0 || SelectedIconicon.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0) {
      this.LayerStyleVisibleList.defaultIconURL = SelectedIconicon;
      this.defaultIconURL = SelectedIconicon;
      setTimeout(() => {
        let ImageId = document.getElementById("pointImage");
        ImageId.style.opacity = "" + this.UtilityService.GetOpacityFromPercentage(this.LayerStyleVisibleList.Transparency);
        ImageId.style.width = Math.round(parseInt("" + this.LayerStyleVisibleList.Size) * 30 / 100) + "px";
      }, 100);
    }
    else {
      this.LayerStyleVisibleList.defaultIconURL = SelectedIconicon;
      this.defaultIconURL = SelectedIconicon;
      let ImageId = document.getElementById("pointImage");
      ImageId.style.opacity = "";
      ImageId.style.width = "";
    }
  }
  SelectLineIcon(SelectedIconicon) {
    this.LayerStyleVisibleList.defaultIconURL = SelectedIconicon;
    this.defaultIconURL = SelectedIconicon;
  }
  setValueinControls(layer) {
    this.LayerStyleVisibleList.Size = (parseInt(layer["SizePercent"]));
    this.LayerStyleVisibleList.Thickness = (parseInt(layer["StrokeThicknessPercent"]));
    this.LayerStyleVisibleList.Transparency = this.UtilityService.GetOpacityFromPercentage(layer["Opacity"]);
    this.LayerStyleVisibleList.Transparency = layer["Opacity"];
    this.LayerStyleVisibleList.Color = "#" + this.UtilityService.GetHexValueWithAlpha(layer["FillColor"]);
    if (this.LayerStyleVisibleList.TitleName == "Point") {
      this.LayerStyleVisibleList.Border = "#" + this.UtilityService.GetHexValueWithAlpha(layer["StrokeColor"]);
    }
    else if (this.LayerStyleVisibleList.TitleName == "Line")
      this.LayerStyleVisibleList.Color = "#" + this.UtilityService.GetHexValueWithAlpha(layer["StrokeColor"]);
    if (this.LayerStyleVisibleList.TitleName == "Area") {
      this.LayerStyleVisibleList.Border = "#" + this.UtilityService.GetHexValueWithAlpha(layer["StrokeColor"]);
    }
    let val = '' + layer["Opacity"];
    if (val.length > 4) {
      this.LayerStyleVisibleList.Transparency = 0;
    }
    else {
      this.LayerStyleVisibleList.Transparency = parseInt(((1 - this.LayerStyleVisibleList.Transparency) * 100).toFixed(0));

    }
    if (this.LayerStyleVisibleList.Transparency == 0) {
      this.UtilityService.SetDefaultIconImagestyle(layer["SizePercent"], 1, this.imagesmapsearch360);
    }
    else {
      this.UtilityService.SetDefaultIconImagestyle(layer["SizePercent"], this.LayerStyleVisibleList.Transparency, this.imagesmapsearch360);
    }
    this.LayerStyleVisibleList["layerStyle"] = {
      opacity: layer["Opacity"],
      fillColor: layer["FillColor"],
      strokeColor: layer["StrokeColor"],
      strokeThicknessPercentage: layer["StrokeThicknessPercent"],
      sizePercentage: layer["SizePercent"],
    }
    this.setExternaliconUploaded();
  }

  generateIconUrl(id, type, EnergyLayer, opacity, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage) {
    let layer = EnergyLayer
    let iconIdValue = id;
    let iconTypeValue = type;
    let and = "&";
    let iconURL = this.iconUrl;
    let urlType = "CustomStyleIcon";
    let seperator = "&amp;";
    let iconId = "10";
    let iconType = "Circle";
    if (iconIdValue != undefined) {
      iconURL += "Id=" + iconIdValue + and;
    }
    if (urlType != undefined) {
      iconURL += "URLType=" + urlType + and;
    }
    if (fillColor != undefined) {
      iconURL += "FillColor=" + this.UtilityService.GetAlphaValue(opacity) + this.UtilityService.GetHexValueWithAlpha(fillColor) + and;
    }
    if (iconTypeValue != undefined) {
      iconURL += "IconType=" + iconTypeValue + and;
    }
    if (strokeColor != undefined) {
      iconURL += "StrokeColor=" + this.UtilityService.GetAlphaValue(opacity) + this.UtilityService.GetHexValueWithAlpha(strokeColor) + and;
    }
    if (sizePercentage != undefined) {
      iconURL += "SizePercent=" + (parseInt(sizePercentage)) + and;
    }
    if (strokeThicknessPercentage != undefined) {
      iconURL += "StrokeThicknessPercent=" + strokeThicknessPercentage + and;
    }
    if (opacity != undefined) {
      iconURL += "Opacity=" + this.UtilityService.GetOpacityFromPercentage(opacity);
    }
    return iconURL;
  }


  ThicknesshandleChange(event: any) {
    this.SetcurrentVal(event, "Thickness");
  }
  TransparencyhandleChange(event: any) {

    this.SetcurrentVal(event, "Transparency");
  }
  SizehandleChange(event: any) {
    this.SetcurrentVal(event, "Size");
  }
  pckBorderChange(event: any) {
    this.SetcurrentVal(event.value, "border");
  }
  pckcolorChange(event: any) {
    this.SetcurrentVal(event.value, "Color");
  }
  SetcurrentVal(StyleVal, StyleName) {
    let opacity = this.LayerStyleVisibleList["layerStyle"]["opacity"];
    opacity = this.LayerStyleVisibleList.Transparency;
    let fillColor = this.LayerStyleVisibleList["layerStyle"]["fillColor"];
    fillColor = _.toUpper(this.LayerStyleVisibleList.Color);
    let strokeColor = this.LayerStyleVisibleList["layerStyle"]["strokeColor"];
    strokeColor = _.toUpper(this.LayerStyleVisibleList.Border);
    let strokeThicknessPercentage = this.LayerStyleVisibleList["layerStyle"]["strokeThicknessPercentage"];
    strokeThicknessPercentage = this.LayerStyleVisibleList.Thickness;
    let sizePercentage = this.LayerStyleVisibleList["layerStyle"]["sizePercentage"];
    sizePercentage = this.LayerStyleVisibleList.Size;
    let defaultIconURL = this.LayerStyleVisibleList.defaultIconURL;
    //defaultIconURL = this.defaultIconURL;
    if (defaultIconURL.indexOf(this.imagesmapsearch360) >= 0) {
      let url1 = defaultIconURL;
      this.LayerStyleVisibleList.defaultIconURL = "";
      this.LayerStyleVisibleList.defaultIconURL = defaultIconURL;
      this.defaultIconURL = url1;
      let ImageId = document.getElementById("pointImage");
      ImageId.style.opacity = "" + this.UtilityService.GetOpacityFromPercentage(this.LayerStyleVisibleList.Transparency);
      ImageId.style.width = Math.round(parseInt("" + this.LayerStyleVisibleList.Size) * 30 / 100) + "px";
    } else {
      let splitedval = defaultIconURL.split('?');
      let val = splitedval[1].split('&');
      let URL = splitedval[0];
      let parameter = "";
      for (let iconstyle of val) {
        let s = iconstyle.split('=');
        let key = s[0];
        let val1 = s[1];
        if (key == "StrokeThicknessPercent") {
          val1 = strokeThicknessPercentage;
        }
        else if (key == "SizePercent" && this.LayerStyleVisibleList.TitleName == "Line") {
          val1 = sizePercentage;
        }
        else if (key == "SizePercent" && this.LayerStyleVisibleList.TitleName == "Point") {
          val1 = sizePercentage;
        }
        else if (key == "SizePercent" && this.LayerStyleVisibleList.TitleName == "Area") {
          val1 = "100";
        }
        else if (key == "Opacity") {
          val1 = "" + this.UtilityService.GetOpacityFromPercentage(opacity);
        }
        else if (key == "FillColor") {
          let color = this.UtilityService.GetAlphaValue(opacity) + this.UtilityService.GetHexValueWithAlpha(fillColor);
          color = _.toUpper(color);
          val1 = color;
        }
        else if (key == "StrokeColor" && this.LayerStyleVisibleList.TitleName == "Point") {
          let bordercolor = this.UtilityService.GetAlphaValue(opacity) + this.UtilityService.GetHexValueWithAlpha(strokeColor);
          bordercolor = _.toUpper(bordercolor);
          val1 = bordercolor
        }
        else if (key == "StrokeColor" && this.LayerStyleVisibleList.TitleName == "Line") {
          let color = this.UtilityService.GetAlphaValue(opacity) + this.UtilityService.GetHexValueWithAlpha(fillColor);
          color = _.toUpper(color);
          val1 = color;
        }
        else if (key == "StrokeColor" && this.LayerStyleVisibleList.TitleName == "Area") {
          let bordercolor = this.UtilityService.GetAlphaValue(opacity) + this.UtilityService.GetHexValueWithAlpha(strokeColor);
          bordercolor = _.toUpper(bordercolor);
          val1 = bordercolor
        }

        if (parameter == "") {
          parameter = key + "=" + val1;
        }
        else {
          parameter += "&" + key + "=" + val1;
        }
      }
      if (URL.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0) {
        let url1 = URL + "?" + parameter;
        this.LayerStyleVisibleList.defaultIconURL = "";
        this.LayerStyleVisibleList.defaultIconURL = URL + "?" + parameter;
        this.defaultIconURL = url1;

      } else {
        let url1 = this.iconUrl + parameter;
        this.LayerStyleVisibleList.defaultIconURL = "";
        this.LayerStyleVisibleList.defaultIconURL = this.iconUrl + parameter;
        this.defaultIconURL = url1;
      }
    }
    if (StyleName == "Thickness") {
      strokeThicknessPercentage = StyleVal;
    }
    else if (StyleName == "Transparency") {
      opacity = StyleVal;
    }
    else if (StyleName == "Size") {
      sizePercentage = StyleVal;
    }
    else if (StyleName == "border") {
      strokeColor = _.toUpper(StyleVal);
    }
    else if (StyleName == "Color" && this.LayerStyleVisibleList.TitleName == "Point") {
      fillColor = _.toUpper(StyleVal);
    }
    else if (StyleName == "Color" && this.LayerStyleVisibleList.TitleName == "Line") {
      strokeColor = _.toUpper(StyleVal);
    }
    else if (StyleName == "Color" && this.LayerStyleVisibleList.TitleName == "Area") {
      fillColor = _.toUpper(StyleVal);
    }
    if (this.LayerStyleVisibleList.TitleName == "Line") {
      strokeColor = fillColor
    }
    let list = [];
    this.IconList = [];
    if (this.LayerStyleVisibleList.TitleName == 'Point') {
      this.UtilityService.SetDefaultIconImagestyle(sizePercentage, opacity, this.imagesmapsearch360);
      for (let i = 0; i < this.IconsnameList.length; i++) {
        let imgURL = this.generateIconUrl(i, this.IconsnameList[i], this.LayerStyleVisibleList["layerStyle"], opacity, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage);
        list.push(imgURL);
      }
    }
    else if (this.LayerStyleVisibleList.TitleName == 'Line') {
      let imgURL = this.generateIconUrl(0, "Line", this.LayerStyleVisibleList["layerStyle"], opacity, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage);
      list.push(imgURL);
      imgURL = this.generateIconUrl(12, "DashLine", this.LayerStyleVisibleList["layerStyle"], opacity, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage);
      list.push(imgURL);
    }
    this.IconList.push(list);
  }
  SaveStyle() {
    this.LayerStyleVisibleList;
    let IconType = '';
    let externaliconURL = "";
    let defaultIconURL = this.LayerStyleVisibleList.defaultIconURL;
    if (defaultIconURL.indexOf(this.imagesmapsearch360) >= 0 || defaultIconURL.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0) {
      IconType = "ExternalIcon";
      externaliconURL = defaultIconURL;
      if (externaliconURL.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0) {
        let splitedval = defaultIconURL.split('?');
        let val = splitedval[1].split('&');
        for (let iconstyle of val) {
          let s = iconstyle.split('=');
          let key = s[0];
          let val1 = s[1];
          if (key == "ExternalIconId") {
            externaliconURL = val1;
          }
        }
      }
      else {
        let SplitExicon = externaliconURL.split('/');
        externaliconURL = SplitExicon[SplitExicon.length - 1];
      }
    } else {
      let splitedval = defaultIconURL.split('?');
      let val = splitedval[1].split('&');
      for (let iconstyle of val) {
        let s = iconstyle.split('=');
        let key = s[0];
        let val1 = s[1];
        if (key == "IconType") {
          IconType = val1;
        }
      }
    }
    let DetailPanelProperties = '';
    let list = this.getISTrueProperties();
    for (let propval of list) {
      let textpropval = propval.value;
      let txtpropval = document.getElementById('txt' + propval.pro)['value'];
      if (textpropval != txtpropval && txtpropval) {
        propval.value = txtpropval;
      }
      if (DetailPanelProperties == "") {
        DetailPanelProperties = propval.value + "=" + propval.pro;
      }
      else {
        DetailPanelProperties += "," + propval.value + "=" + propval.pro;
      }

    }
    let EnergyLayerStylesByUser = {
      EnergyLayerId: this.LayerStyleVisibleList.EnergyLayerId,
      UserId: this.LayerStyleVisibleList.UserId,
      IconType: IconType,
      StrokeThicknessPercent: this.LayerStyleVisibleList.Thickness,
      StrokeColor: this.UtilityService.GetAlphaValue(this.LayerStyleVisibleList.Transparency) + this.UtilityService.GetHexValueWithAlpha(this.LayerStyleVisibleList.Border),
      FillColor: this.UtilityService.GetAlphaValue(this.LayerStyleVisibleList.Transparency) + this.UtilityService.GetHexValueWithAlpha(this.LayerStyleVisibleList.Color),
      SizePercent: this.LayerStyleVisibleList.Size,
      Opacity: this.UtilityService.GetOpacityFromPercentage(this.LayerStyleVisibleList.Transparency),
      DetailPanelProperties: encodeURIComponent(DetailPanelProperties),
      LabelField: this.LabelField,
      mapId: this.myMapService.isCustomMapLoaded == true ? this.myMapService.loadedMapData.CustomMaps[0].CustomMapId : null
    }
    if (IconType == "Line" || IconType == "DashLine") {
      EnergyLayerStylesByUser.StrokeColor = this.UtilityService.GetAlphaValue(this.LayerStyleVisibleList.Transparency) + this.UtilityService.GetHexValueWithAlpha(this.LayerStyleVisibleList.Color)
    }
    if (IconType == "Area") {
      EnergyLayerStylesByUser.SizePercent = 100;
    }
    let JsonUserstyle = JSON.stringify(EnergyLayerStylesByUser);

    this.httpRequest._NodeSaveLayerstylebyUser(JsonUserstyle, externaliconURL).subscribe(data => {
      let Res = data;
      if (Res._Issuccess == true) {
        let ResEnergyLayerStylesByUser = Res.EnergyLayerStylesByUser[0];
        let treeUI = this.MapServiceService._TreeUI.getValue()
        if (treeUI.treeModel.nodes) {
          let existnode = treeUI.treeModel.getNodeById(this.LayerStyleVisibleList.EnergyLayerId);
          if (existnode) {
            if (ResEnergyLayerStylesByUser.IconType == "ExternalIcon" && ResEnergyLayerStylesByUser.ExternalIconId) {
              let EnergyLayerID = ResEnergyLayerStylesByUser.EnergyLayerId;
              let url = this.UtilityService.GetDefaultExternalIcon(ResEnergyLayerStylesByUser.ExternalIconId);
              if (url.indexOf(this.imagesmapsearch360 + '01)AngularEnvision%20Images') >= 0) {
                existnode.data.IconUrl = url;
              }
              else {
                let externaliconlist = this.MapServiceService.ExternalIconList.value;
                if (externaliconlist) {
                  for (let exicon of externaliconlist) {
                    if (exicon.Id == ResEnergyLayerStylesByUser.ExternalIconId) {
                      let URL = this.UtilityService.GetDefaultExternalIcon(exicon.Id);
                      if (URL == "") {
                        URL = this.imagesmapsearch360 + "EnvisionAngularUsersIcon/" + exicon.UploadedBy + "/" + exicon.Id + exicon.Extension;
                        existnode.data.IconUrl = URL;
                        break;
                      }
                    }
                  }
                }
                else {
                  existnode.data.IconUrl = externaliconURL;
                }
                if (!existnode.data.IconUrl) {
                  existnode.data.IconUrl = this.CustomeiconList[3];
                }
              }
              let TreeImageIcon = document.getElementById(EnergyLayerID + "TreeCostomelayerIconImage");
              if (TreeImageIcon) {
                let src = TreeImageIcon.getAttribute('src');
                let srcWidth = "100";
                let srcOpacity = "1";
                srcWidth = ResEnergyLayerStylesByUser.SizePercent;
                srcOpacity = "" + ResEnergyLayerStylesByUser.Opacity;
                srcWidth = Math.round(parseInt(srcWidth) * 30 / 100) + "px";
                if (srcOpacity == "0") {
                  srcOpacity = "1";
                }
                setTimeout(() => {
                  let id = '#' + EnergyLayerID + 'TreeCostomelayerIconImage';
                  $(id).attr('style', 'width:' + srcWidth + " !important ;opacity :" + srcOpacity + " !important;");
                }, 500);

              }
            } else {
              existnode.data.IconUrl = this.LayerStyleVisibleList.defaultIconURL;
            }
            setTimeout(() => {
              treeUI.treeModel.update();
            }, 500);
            let EnergyLayerID = this.Node['data'].Id;
            let parentid = this.Node['parent'].data.Id;
            let TabList = this.MapServiceService._GridTabData.value;
            for (let t = 0; t < TabList.length; t++) {
              for (let s of TabList[t].energyLayer) {
                if (TabList[t].ActiveClass == " active") {
                  if (((s.EnergyParentID == parseInt(parentid)) && (s.EnergyLayerID == parseInt(EnergyLayerID)))) {
                    s.EnergyLayerStylesByUserModel.length = 0
                    s.EnergyLayerStylesByUserModel.push(ResEnergyLayerStylesByUser);
                    let Gridcolumns = this.MapServiceService.GenerateColumns(s);
                    Array.prototype.push.apply(this.MapServiceService.GridColumns.getValue(), Gridcolumns);
                    this.MapServiceService.setGridMapcolumns(Gridcolumns);
                    if (!existnode.data.IsChecked) {
                      if (existnode.data.FeatureType == "CustomMap") {
                        this.MapLayerNewService.LoadCustomMapLayers();
                      } else {
                        this.MapLayerService.removemapLayer(s);
                      }
                    }
                  }
                }
                for (let s of TabList[t].energyLayer) {
                  if (((s.EnergyParentID == parseInt(parentid)) && (s.EnergyLayerID == parseInt(EnergyLayerID)))) {
                    s.EnergyLayerStylesByUserModel.length = 0
                    s.EnergyLayerStylesByUserModel.push(ResEnergyLayerStylesByUser);
                    if (!existnode.data.IsChecked) {
                      if (existnode.data.FeatureType == "CustomMap") {
                        this.MapLayerNewService.LoadCustomMapLayers();
                      } else {
                        setTimeout(() => {
                          this.MapLayerService.loadmapLayers(s);
                        }, 550);
                      }
                      this.GoogleMapPage.BindActiveGridData();
                      //this.resetGridColumns();
                    }
                  }
                }
                if (existnode.data.LayerType == "GroupLayer" && existnode.data.FeatureType != "CustomMap") {
                  this.MapLayerNewService.LoadMapLayers();
                }
              }
            }
            if (this.isFloodHazardZones == true) {
              for (let el of this.ActiveEnergyLayerList) {
                if (!el.TableName && el.DetailPanelProperties.toString().indexOf('BaseUri==') != -1 && el.DetailPanelPropertiesMain.toString().indexOf('BaseUri==') != -1) {
                  if (!existnode.data.IsChecked) {
                    el.EnergyLayerStylesByUserModel.length = 0
                    el.EnergyLayerStylesByUserModel.push(ResEnergyLayerStylesByUser);
                    this.MapLayerService.removemapLayer(el);
                    this.MapLayerService.loadmapLayers(el);
                  }
                }
              }
            }
          }
        }
      }
      else {
        console.log(Res.errormsg);
      }

    }, error => {
      console.log(error);
    });
  }
  SaveMyLayerStyle() {
    this.LayerStyleVisibleList;
    let IconType = '';
    let externaliconURL = "";
    let defaultIconURL = this.LayerStyleVisibleList.defaultIconURL;
    if (defaultIconURL.indexOf(this.imagesmapsearch360) >= 0 || defaultIconURL.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0) {
      IconType = "ExternalIcon";
      externaliconURL = defaultIconURL;
      if (externaliconURL.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0) {
        let splitedval = defaultIconURL.split('?');
        let val = splitedval[1].split('&');
        for (let iconstyle of val) {
          let s = iconstyle.split('=');
          let key = s[0];
          let val1 = s[1];
          if (key == "ExternalIconId") {
            externaliconURL = val1;
          }
        }
      }
      else {
        let SplitExicon = externaliconURL.split('/');
        externaliconURL = SplitExicon[SplitExicon.length - 1];
      }
    } else {
      let splitedval = defaultIconURL.split('?');
      let val = splitedval[1].split('&');
      for (let iconstyle of val) {
        let s = iconstyle.split('=');
        let key = s[0];
        let val1 = s[1];
        if (key == "IconType") {
          IconType = val1;
        }
      }
    }
    let DetailPanelProperties = '';
    let list = this.getISTrueProperties();
    for (let propval of list) {
      let textpropval = propval.value;
      let txtpropval = document.getElementById('txt' + propval.pro)['value'];
      if (textpropval != txtpropval && txtpropval) {
        propval.value = txtpropval;
      }
      if (DetailPanelProperties == "") {
        DetailPanelProperties = propval.value + "=" + propval.pro;
      }
      else {
        DetailPanelProperties += "," + propval.value + "=" + propval.pro;
      }

    }
    let LayerStylesByUser = {
      DataSetID: this.LayerStyleVisibleList.EnergyLayerId,
      UploadedBy: this.LayerStyleVisibleList.UserId,
      IconType: IconType,
      StrokeThicknessPercent: this.LayerStyleVisibleList.Thickness,
      StrokeColor: this.UtilityService.GetAlphaValue(this.LayerStyleVisibleList.Transparency) + this.UtilityService.GetHexValueWithAlpha(this.LayerStyleVisibleList.Border),
      FillColor: this.UtilityService.GetAlphaValue(this.LayerStyleVisibleList.Transparency) + this.UtilityService.GetHexValueWithAlpha(this.LayerStyleVisibleList.Color),
      SizePercent: this.LayerStyleVisibleList.Size,
      Opacity: this.UtilityService.GetOpacityFromPercentage(this.LayerStyleVisibleList.Transparency),
      DetailPanelProperties: encodeURIComponent(DetailPanelProperties),
      LabelField: this.LabelField,
      DataSetName: this.LayerName,
      Description: this.LayerDescription,
      IsPublic: this.LayerIsShared
    }
    if (IconType == "Line" || IconType == "DashLine") {
      LayerStylesByUser.StrokeColor = this.UtilityService.GetAlphaValue(this.LayerStyleVisibleList.Transparency) + this.UtilityService.GetHexValueWithAlpha(this.LayerStyleVisibleList.Color)
    }
    if (IconType == "Area") {
      LayerStylesByUser.SizePercent = 100;
    }
    if (LayerStylesByUser.DataSetID == 0) {
      LayerStylesByUser.DataSetID = this.Node['data'].Id;
    }
    let JsonUserstyle = JSON.stringify(LayerStylesByUser);
    this.httpRequest._NodeSavePrivateLayerstylebyUser(JsonUserstyle, externaliconURL).subscribe(data => {
      let Res = data;
      if (Res._Issuccess == true) {
        let privateTreeUI = this.MapServiceService._PrivateTreeUI.getValue()
        if (privateTreeUI.treeModel.nodes) {
          let existnode = privateTreeUI.treeModel.getNodeById(this.LayerStyleVisibleList.EnergyLayerId);
          if (existnode) {
            if (Res.PrivateLayerStyles.IconType == "ExternalIcon" && Res.PrivateLayerStyles.ExternalIconId) {
              let EnergyLayerID = Res.PrivateLayerStyles.EnergyLayerId;
              let url = this.UtilityService.GetDefaultExternalIcon(Res.PrivateLayerStyles.ExternalIconId);
              if (url.indexOf(this.imagesmapsearch360 + '01)AngularEnvision%20Images') >= 0) {
                existnode.data.IconUrl = url;
              }
              else {
                let externaliconlist = this.MapServiceService.ExternalIconList.value;
                if (externaliconlist) {
                  for (let exicon of externaliconlist) {
                    if (exicon.Id == Res.PrivateLayerStyles.ExternalIconId) {
                      let URL = this.UtilityService.GetDefaultExternalIcon(exicon.Id);
                      if (URL == "") {
                        URL = this.imagesmapsearch360 + "EnvisionAngularUsersIcon/" + exicon.UploadedBy + "/" + exicon.Id + exicon.Extension;
                        existnode.data.IconUrl = URL;
                        break;
                      }
                    }
                  }
                }
                else {
                  existnode.data.IconUrl = externaliconURL;
                }
                if (!existnode.data.IconUrl) {
                  existnode.data.IconUrl = this.CustomeiconList[3];
                }
              }
              let TreeImageIcon = document.getElementById(EnergyLayerID + "TreeCostomelayerIconImage");
              if (TreeImageIcon) {
                let src = TreeImageIcon.getAttribute('src');
                let srcWidth = "100";
                let srcOpacity = "1";
                srcWidth = Res.PrivateLayerStyles.SizePercent;
                srcOpacity = "" + Res.PrivateLayerStyles.Opacity;
                srcWidth = Math.round(parseInt(srcWidth) * 30 / 100) + "px";
                if (srcOpacity == "0") {
                  srcOpacity = "1";
                }
                setTimeout(() => {
                  let id = '#' + EnergyLayerID + 'TreeCostomelayerIconImage';
                  $(id).attr('style', 'width:' + srcWidth + " !important ;opacity :" + srcOpacity + " !important;");
                }, 500);

              }
            } else {
              existnode.data.IconUrl = this.LayerStyleVisibleList.defaultIconURL;
            }

            existnode.data.Name = Res.PrivateLayerStyles.DataSetName;

            setTimeout(() => {
              privateTreeUI.treeModel.update();
            }, 500);

            let PrivateEnergyLayerID = this.Node['data'].Id;
            let parentid = this.Node['parent'].data.Id;

            this.LayerStyleVisibleList.EnergyLayerId = PrivateEnergyLayerID;
            let TabList = this.MapServiceService._GridTabData.getValue();
            for (let t = 0; t < TabList.length; t++) {
              if (TabList[t].parentID > 0 && !TabList[t].parentName) {
                parentid = 0
              }
              for (let s of TabList[t].energyLayer) {
                if (TabList[t].ActiveClass == " active") {
                  if (((s.EnergyParentID == parseInt(parentid)) && (s.EnergyLayerID == parseInt(PrivateEnergyLayerID)))) {
                    TabList[t].DisplayName = Res.PrivateLayerStyles.DataSetName;
                    s.EnergyLayerStylesByUserModel.length = 0;
                    s.EnergyLayerStylesByUserModel.push(Res.PrivateLayerStyles);
                    let Gridcolumns = this.MapServiceService.GenerateColumns(s);
                    Array.prototype.push.apply(this.MapServiceService.GridColumns.getValue(), Gridcolumns);
                    this.MapServiceService.setGridMapcolumns(Gridcolumns);
                    if (!existnode.data.IsChecked) {                      
                      if (existnode.data.FeatureType == "CustomMap") {
                        this.MapLayerNewService.LoadCustomMapLayers();
                      } else {
                        this.PrivateMapLayerService.RemoveMapLayer(s);
                      }
                    }                    
                  }
                }
              }
              for (let s of TabList[t].energyLayer) {
                if (((s.EnergyParentID == parseInt(parentid)) && (s.EnergyLayerID == parseInt(PrivateEnergyLayerID)))) {
                  s.EnergyLayerStylesByUserModel.length = 0
                  s.EnergyLayerStylesByUserModel.push(Res.PrivateLayerStyles);
                  if (!existnode.data.IsChecked) {                    
                    if (existnode.data.FeatureType == "CustomMap") {
                      this.MapLayerNewService.LoadCustomMapLayers();
                    } else {
                      setTimeout(() => {
                        this.PrivateMapLayerService.LoadPrivateMapLayers(s);
                      }, 550);
                    }
                    this.GoogleMapPage.BindTemporaryLayerActiveGridData();

                  }                  
                }
              }
              if (existnode.data.LayerType == "GroupLayer" && existnode.data.FeatureType != "CustomMap") {
                this.MapLayerNewService.LoadMapLayers();
              }
            }
          }
        }
      }
      else {
        console.log(Res.errormsg);
      }

    }, error => {
      console.log(error);
    });
  }

  SaveMyLayerStyle_test() {
    this.LayerStyleVisibleList;
    let IconType = '';
    let externaliconURL = "";
    let defaultIconURL = this.LayerStyleVisibleList.defaultIconURL;
    if (defaultIconURL.indexOf(this.imagesmapsearch360) >= 0 || defaultIconURL.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0) {
      IconType = "ExternalIcon";
      externaliconURL = defaultIconURL;
      if (externaliconURL.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0) {
        let splitedval = defaultIconURL.split('?');
        let val = splitedval[1].split('&');
        for (let iconstyle of val) {
          let s = iconstyle.split('=');
          let key = s[0];
          let val1 = s[1];
          if (key == "ExternalIconId") {
            externaliconURL = "http://images.mapsearch360.com/01)AngularEnvision%20Images/ExternalIconId/" + val1 + ".png";
          }
        }
      }
      else {
        let SplitExicon = externaliconURL.split('/');
        externaliconURL = SplitExicon[SplitExicon.length - 1];
      }
    } else {
      let splitedval = defaultIconURL.split('?');
      let val = splitedval[1].split('&');
      for (let iconstyle of val) {
        let s = iconstyle.split('=');
        let key = s[0];
        let val1 = s[1];
        if (key == "IconType") {
          IconType = val1;
        }
      }
    }
    let DetailPanelProperties = '';
    let list = this.getISTrueProperties();
    for (let propval of list) {
      let textpropval = propval.value;
      let txtpropval = document.getElementById('txt' + propval.pro)['value'];
      if (textpropval != txtpropval && txtpropval) {
        propval.value = txtpropval;
      }
      if (DetailPanelProperties == "") {
        DetailPanelProperties = propval.value + "=" + propval.pro;
      }
      else {
        DetailPanelProperties += "," + propval.value + "=" + propval.pro;
      }

    }
    let LayerStylesByUser = {
      DataSetID: this.LayerStyleVisibleList.EnergyLayerId,
      UploadedBy: this.LayerStyleVisibleList.UserId,
      IconType: IconType,
      StrokeThicknessPercent: this.LayerStyleVisibleList.Thickness,
      StrokeColor: this.UtilityService.GetAlphaValue(this.LayerStyleVisibleList.Transparency) + this.UtilityService.GetHexValueWithAlpha(this.LayerStyleVisibleList.Border),
      FillColor: this.UtilityService.GetAlphaValue(this.LayerStyleVisibleList.Transparency) + this.UtilityService.GetHexValueWithAlpha(this.LayerStyleVisibleList.Color),
      SizePercent: this.LayerStyleVisibleList.Size,
      Opacity: this.UtilityService.GetOpacityFromPercentage(this.LayerStyleVisibleList.Transparency),
      DetailPanelProperties: encodeURIComponent(DetailPanelProperties),
      LabelField: this.LabelField,
      DataSetName: this.LayerName,
      Description: this.LayerDescription,
      IsPublic: this.LayerIsShared
    }
    if (IconType == "Line" || IconType == "DashLine") {
      LayerStylesByUser.StrokeColor = this.UtilityService.GetAlphaValue(this.LayerStyleVisibleList.Transparency) + this.UtilityService.GetHexValueWithAlpha(this.LayerStyleVisibleList.Color)
    }
    if (IconType == "Area") {
      LayerStylesByUser.SizePercent = 100;
    }
    if (LayerStylesByUser.DataSetID == 0) {
      LayerStylesByUser.DataSetID = this.Node['data'].Id;
    }
    let JsonUserstyle = JSON.stringify(LayerStylesByUser);
    this.httpRequest._NodeSavePrivateLayerstylebyUser(JsonUserstyle, externaliconURL).subscribe(data => {
      let Res = data;
      if (Res._Issuccess == true) {
        let privateTreeUI = this.MapServiceService._PrivateTreeUI.getValue()
        if (privateTreeUI.treeModel.nodes) {
          let existnode = privateTreeUI.treeModel.getNodeById(this.LayerStyleVisibleList.EnergyLayerId);
          if (existnode) {
            if (Res.PrivateLayerStyles.IconType == "ExternalIcon" && Res.PrivateLayerStyles.ExternalIconId) {
              let EnergyLayerID = Res.PrivateLayerStyles.EnergyLayerId;
              let url = this.UtilityService.GetDefaultExternalIcon(Res.PrivateLayerStyles.ExternalIconId);
              if (url.indexOf(this.imagesmapsearch360 + '01)AngularEnvision%20Images') >= 0) {
                existnode.data.IconUrl = url;
              }
              else {
                let externaliconlist = this.MapServiceService.ExternalIconList.value;
                if (externaliconlist) {
                  for (let exicon of externaliconlist) {
                    if (exicon.Id == Res.PrivateLayerStyles.ExternalIconId) {
                      let URL = this.UtilityService.GetDefaultExternalIcon(exicon.Id);
                      if (URL == "") {
                        URL = this.imagesmapsearch360 + "EnvisionAngularUsersIcon/" + exicon.UploadedBy + "/" + exicon.Id + exicon.Extension;
                        existnode.data.IconUrl = URL;
                        break;
                      }
                    }
                  }
                }
                else {
                  existnode.data.IconUrl = externaliconURL;
                }
                if (!existnode.data.IconUrl) {
                  existnode.data.IconUrl = this.CustomeiconList[3];
                }
              }
              let TreeImageIcon = document.getElementById(EnergyLayerID + "TreeCostomelayerIconImage");
              if (TreeImageIcon) {
                let src = TreeImageIcon.getAttribute('src');
                let srcWidth = "100";
                let srcOpacity = "1";
                srcWidth = Res.PrivateLayerStyles.SizePercent;
                srcOpacity = "" + Res.PrivateLayerStyles.Opacity;
                srcWidth = Math.round(parseInt(srcWidth) * 30 / 100) + "px";
                if (srcOpacity == "0") {
                  srcOpacity = "1";
                }
                setTimeout(() => {
                  let id = '#' + EnergyLayerID + 'TreeCostomelayerIconImage';
                  $(id).attr('style', 'width:' + srcWidth + " !important ;opacity :" + srcOpacity + " !important;");
                }, 500);

              }
            } else {
              existnode.data.IconUrl = this.LayerStyleVisibleList.defaultIconURL;
            }

            existnode.data.Name = Res.PrivateLayerStyles.DataSetName;

            setTimeout(() => {
              privateTreeUI.treeModel.update();
            }, 500);

            let PrivateEnergyLayerID = this.Node['data'].Id;
            let parentid = this.Node['parent'].data.Id;
            this.LayerStyleVisibleList.EnergyLayerId = PrivateEnergyLayerID;
            let TabList = this.MapServiceService._GridTabData.getValue();
            for (let t = 0; t < TabList.length; t++) {
              for (let s of TabList[t].energyLayer) {
                if ((/*(s.EnergyParentID == parseInt(parentid)) &&*/ (s.EnergyLayerID == parseInt(PrivateEnergyLayerID)))) {
                  TabList[t].DisplayName = Res.PrivateLayerStyles.DataSetName;
                  s.EnergyLayerStylesByUserModel.length = 0;
                  s.EnergyLayerStylesByUserModel.push(Res.PrivateLayerStyles);
                  if (!existnode.data.IsChecked) {
                    this.PrivateMapLayerService.RemoveMapLayer(s);
                  }
                }
              }
              for (let s of TabList[t].energyLayer) {
                if ((/* (s.EnergyParentID == parseInt(parentid)) && */ (s.EnergyLayerID == parseInt(PrivateEnergyLayerID)))) {
                  s.EnergyLayerStylesByUserModel.length = 0
                  s.EnergyLayerStylesByUserModel.push(Res.PrivateLayerStyles);
                  if (!existnode.data.IsChecked) {
                    this.PrivateMapLayerService.LoadPrivateMapLayers(s);
                    this.GoogleMapPage.BindTemporaryLayerActiveGridData();
                    //this.resetGridColumns();
                  }
                }
              }
            }
          }
        }
      }
      else {
        console.log(Res.errormsg);
      }

    }, error => {
      console.log(error);
    });
  }

  resetGridColumns() {
    let gridcolumns = this.MapServiceService.GridColumns.getValue();
    let gridOptions = this.MapServiceService.GridApi.getValue();
    let columnApi = gridOptions.columnApi;
    let TabList = this.MapServiceService._GridTabData.getValue();
    for (let t = 0; t < TabList.length; t++) {
      if (TabList[t].ActiveClass == " active") {
        let list = this.getISTrueProperties();
        for (let gridindex in gridcolumns) {
          for (let proval of this.displayProperties) {
            let colkey = proval.pro;
            let colDisplayval = proval.value;
            if (gridcolumns[gridindex].field === colkey) {
              gridcolumns[gridindex].headerName = colDisplayval;
              gridcolumns[gridindex]['hide'] = !proval.Added;
            }
            //columnApi.setColumnVisible(colkey, proval.Added);
            // var makeCol = columnApi.getColumn(colkey)
            // makeCol.colDef.headerName = colDisplayval;
          }
        }
        gridOptions.api.refreshHeader();
      }
    }
  }
  removenotification() {
    setTimeout(() => {
      this._notification.remove();
    }, 5000);
  }
  DisplayNotification(type, msg, Position1) {
    this._notification.create(
      type,
      msg,
      {
        Position: Position1,
        Style: "flip",
        Duration: 0
      });
  }
  displayProperties = [];
  SetLayerProperies(energyLayer) {
    this.displayProperties = [];
    let DBFProperties = energyLayer["DBFProperties"];
    let DetailPanelProperties = energyLayer["DetailPanelProperties"];
    let labelfeild = '';
    if (energyLayer["IsLabelVisible"] == 1)
      labelfeild = energyLayer["LabelField"];
    if (energyLayer.EnergyLayerStylesByUserModel.length > 0) {
      DetailPanelProperties = energyLayer.EnergyLayerStylesByUserModel[0]['DetailPanelProperties'];
      if (!energyLayer.EnergyLayerStylesByUserModel[0]['DetailPanelProperties']) {
        DetailPanelProperties = energyLayer["DetailPanelProperties"];
      }
      if (energyLayer.EnergyLayerStylesByUserModel[0]["IsLabelVisible"] == 1)
        labelfeild = energyLayer.EnergyLayerStylesByUserModel[0]["LabelField"];
    }
    if (!energyLayer.TableName && energyLayer.DetailPanelProperties.toString().indexOf('BaseUri==') != -1 && energyLayer.DetailPanelPropertiesMain.toString().indexOf('BaseUri==') != -1) {
      this.isFloodHazardZones = true;
    }
    if (this.isFloodHazardZones == false) {
      let splitedDBFProperties = DBFProperties.split(',');
      let splitedDetailPanelProperties = DetailPanelProperties.split(',');
      splitedDBFProperties = Array.from(new Set(splitedDBFProperties));
      splitedDetailPanelProperties = Array.from(new Set(splitedDetailPanelProperties));
      for (let splitval of splitedDBFProperties) {
        let proval;
        if (splitval.indexOf('=') >= 0) {
          let splitdbf = splitval.split('=');
          proval = {
            pro: splitdbf[1],
            value: splitdbf[1],
            Added: false
          }
        }
        else {
          proval = {
            pro: splitval,
            value: splitval,
            Added: false
          }
        }
        this.displayProperties.push(proval);
      }
      for (let splitvaldpp of splitedDetailPanelProperties) {
        let splitproval = splitvaldpp.split('=');
        let provalue = splitproval[0];
        let pro = splitproval[1];
        for (let x in this.displayProperties) {
          if (this.displayProperties[x].pro == pro) {
            this.displayProperties[x].value = provalue;
            this.displayProperties[x].Added = true;
          }
        }
      }
    }
    setTimeout(() => {
      this.fillePropertyIndefault();
      if (labelfeild) {
        this.LabelField = labelfeild;
        $('#chk' + this.LabelField).prop('checked', true);
      }
    }, 1000);

  }

  SetLayerDetails(energyLayer) {
    this.LayerName = energyLayer.DataSetName;
    this.LayerDescription = energyLayer.Description;
    this.LayerIsShared = energyLayer.IsPublic;
  }
  fillePropertyIndefault() {
    let list = this.getISTrueProperties();
    if (list.length > 0) {
      for (let Property of list) {
        this.PropertyValue(Property.pro, true);
        this.CreateHTMLForProperties(Property.pro, Property.value);
      }
    }

  }
  AddProperty() {
    let list = this.displayProperties.filter((el) => {
      return el.Added == false;
    });
    if (list.length > 0) {
      let Property = list[0];
      this.PropertyValue(Property.pro, true);
      this.UpdateProperty(Property.pro, Property.value);
      this.CreateHTMLForProperties(Property.pro, Property.value);
    }
  }
  PropertyValue(pro, val) {
    for (let x in this.displayProperties) {
      if (this.displayProperties[x].pro == pro) {
        this.displayProperties[x].Added = val;
      }
    }
  }
  getISTrueProperties() {
    let list = this.displayProperties.filter((el) => {
      return el.Added == true;
    });
    return list;
  }
  UpdateProperty(pro, value) {
    for (let x in this.displayProperties) {
      if (this.displayProperties[x].Added == true && this.displayProperties[x].pro != pro) {
        var select = this.displayProperties[x].pro;
        $('#dropdown' + select + ' option[value=' + pro + ']').remove();
      }
    }
  }
  CreateHTMLForProperties(pro, value) {
    let dataRow = ' <div class="row form-group m-0 p-0"  style=" font-size: 12px; " id="FullDiv' + pro + '"><div class="col-md-1 m-0 p-2"  style=" font-size: 12px; " ><button type="button" data-Pro="' + pro + '" data-vale="' + value + '" class="btn btn-default btn-xs removeProperty"><i class="fa fa-trash fa-2x" style = "color: #5995f7;"  style=" font-size: 12px; "> </i></button></div>';
    dataRow += '<div class="col-md-6 m-0 p-2" ><input type="text" class="form-control txtPropertiestextbox" size = "40" value="' + value + '" id="txt' + pro + '"  style=" font-size: 12px; "> </div>';
    dataRow += '<div class="col-md-4 m-0 p-2" ><select id="dropdown' + pro + '" class="form-control SelectProperty" style = "width:100%;font-size: 11.5px;" ><option selected value="' + pro + '">' + pro + '</option></select></div><div class="col-md-1 m-0 p-2 text-center ProdLable">'
    dataRow += '<div class="checkbox check-primary"><input type="checkbox" value="0" class="Propertiescheckbox" data-Pro=' + pro + ' data-vale=' + value + ' id="chk' + pro + '"  style=" font-size: 12px; "><label for="chk' + pro + '" class="m-0 p-0"  style=" font-size: 12px; "></label></div></div></div>';
    $("#PropertiesData").append(dataRow);
    this.FillDropdownProperties(pro, value);
    this.LoadPropertiesEvent();
  }
  FillDropdownProperties(pro, value) {
    for (var i = 0; i < this.displayProperties.length; i++) {
      if (this.displayProperties[i].Added == false) {
        $("#dropdown" + pro).append("<option value=" + this.displayProperties[i].pro + ">" + this.displayProperties[i].pro + "</option>");
      }
    }
  }
  LoadPropertiesEvent() {
    $('.Propertiescheckbox').off("change").on('change', (e) => {

      if (e.currentTarget.checked == true) {
        let prop = e.currentTarget.getAttribute('data-Pro');
        this.LabelField = prop;
      }
      else {
        this.LabelField = '';
      }
      $('.Propertiescheckbox').not(e.currentTarget).prop('checked', false);
    });
    $('.removeProperty').off("click").on('click', (e) => {
      let pro = e.currentTarget.getAttribute("data-Pro");
      let value = e.currentTarget.getAttribute("data-vale");
      let fulldivId = e.currentTarget.getAttribute("data-fullDivId");
      this.PropertyValue(pro, false);
      for (var i = 0; i < this.displayProperties.length; i++) {
        if (this.displayProperties[i].Added == true) {
          $("#dropdown" + this.displayProperties[i].pro).append("<option value=" + pro + ">" + pro + "</option>");
        }
      }
      $('#FullDiv' + pro).remove();
    });
    let previousselectedvalue = '';
    for (var i = 0; i < this.displayProperties.length; i++) {
      if (this.displayProperties[i].Added == true) {
        var sel = $("#dropdown" + this.displayProperties[i].pro);
        sel.data("prev", sel.val());
      }
    }
    $('.SelectProperty').off("change").on('change', (e) => {
      let preval = $(e.currentTarget).data("prev");
      let currentval = e.currentTarget.value;
      this.PropertyValue(preval, false);
      this.PropertyValue(currentval, true);
      for (var i = 0; i < this.displayProperties.length; i++) {
        if (this.displayProperties[i].Added == true) {
          $("#dropdown" + this.displayProperties[i].pro).append("<option value=" + preval + ">" + preval + "</option>");
          $('#dropdown' + this.displayProperties[i].pro + ' option[value=' + currentval + ']').remove();
        }
      }
      let newid = "dropdown" + currentval;
      e.currentTarget.id = newid;
      let textboxif = "txt" + preval;
      document.getElementById(textboxif).setAttribute("id", "txt" + currentval);
      var sel = $("#" + e.currentTarget.id);
      sel.data("prev", currentval);
    });
  }
  removeClassformTab() {
    $($('.MapLayerstyle .tab-wrapper')[0]).attr('style', '');
  }

  Addclassfromtab() {
    $($('.MapLayerstyle .tab-wrapper')[0]).attr('style', 'overflow: inherit !important');
    //$($('.MapLayerstyle .tab-wrapper')[0]).attr('style', 'overflow: inherit !important');
    // $(document).click((e) => {
    //   
    //   if (e.currentTarget.id == '_btnPoint' || e.currentTarget.id == "_IdEnergySymbols" ||
    //     e.currentTarget.id == "CustomSymbols" || e.currentTarget.id == "EnvisionSymbols") {

    //   }
    //   else {
    //     $($('.MapLayerstyle .tab-wrapper')[0]).attr('style', '');
    //   }
    // });

  }


  uploadSymbol(event) {
    var x = document.getElementById("OploadSymbolFile");
    if (x['files'].length == 0) {
      alert('Select Symbol.');
    } else {
      let Uploadedfile = x['files'][0];
      let fileSize = false;
      let type = false;
      let size = Uploadedfile.size;
      if (size >= 102400) {
        alert('The Image Is too big');
        //fileSize = true;
      }
      else {
        fileSize = true;
      }
      if (Uploadedfile.type.indexOf('png') >= 0 || Uploadedfile.type.indexOf('gif') >= 0
        || Uploadedfile.type.indexOf('jpg') >= 0
        || Uploadedfile.type.indexOf('icon') >= 0) {
        type = true;
      }
      else {
        alert('Select Only .png, .gif, .jpg, .icon');
        type = false;
      }
      if (fileSize == true && type == true) {
        var input = event.target;
        var reader = new FileReader();
        reader.onload = (e) => {

          var dataURL = reader.result;
          // this.CustomeSymbols.push(dataURL);
          let ExternalIcons = {
            UserId: this.LayerStyleVisibleList.UserId,
            base64Icon: "" + dataURL,
            FileName: Uploadedfile.name,
            RightLevel: "User",
            Extension: Uploadedfile.type
          }
          this.httpRequest._NodeSaveCustomSymbols(ExternalIcons).subscribe(data => {
            //let res = JSON.parse(data.json());
            let res = data;
            if (res._Issuccess) {
              let URL = this.imagesmapsearch360 + "EnvisionAngularUsersIcon/" + res.ExternalIcon.UploadedBy + "/" + res.ExternalIcon.Id + res.ExternalIcon.Extension;
              let icon = this.MapServiceService.ExternalIconList.value;
              if (icon) {
                this.MapServiceService.ExternalIconList.getValue().push(res.ExternalIcon);
              }
              else {
                let icon = [res.ExternalIcon];
                this.MapServiceService.setExternalIconList(icon);
              }
              this.CustomeSymbols.push(URL);
              setTimeout(() => {
                this.UtilityService.SetDefaultIconImagestyle(this.LayerStyleVisibleList.Size, this.LayerStyleVisibleList.Transparency, this.imagesmapsearch360);
                let iconstyle = document.getElementById('ExIcon');
                if (iconstyle) { iconstyle.style.display = "block"; }
              }, 1000);
            } else {
              alert(res.errormsg);
            }

          }, error => {
            console.log(error);
          });
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
  }

  setExternaliconUploaded() {
    let Iconlist = this.MapServiceService.ExternalIconList.value;
    if (Iconlist) {
      for (let e of Iconlist) {
        let URL = this.UtilityService.GetDefaultExternalIcon(e.id);
        if (URL == "") {
          URL = this.imagesmapsearch360 + "EnvisionAngularUsersIcon/" + e.UploadedBy + "/" + e.Id + e.Extension;
          this.CustomeSymbols.push(URL);
        }
      }
    }
    let iconstyle = document.getElementById('ExIcon');
    if (this.CustomeSymbols.length > 0) {
      if (iconstyle) {
        iconstyle.style.display = "block";
      }
    }
    else {
      if (iconstyle) {
        iconstyle.style.display = "none";
      }
    }
  }
  RemoveExternalSymbols(Customeimgicon) {
    const initialState = {
      UserID: this.AuthenticationService.getLoggedinUserId(),
      IconURL: Customeimgicon
    };
    this.bsModalService.show(DeleteExternalsymbolsComponent, { class: 'modal-sm Tool-modal modal-dialog-centered', backdrop: 'static', animated: false, initialState });

  }
}

