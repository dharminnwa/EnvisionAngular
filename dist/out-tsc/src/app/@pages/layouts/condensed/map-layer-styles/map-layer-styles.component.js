"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var environment_1 = require("../../../../../environments/environment");
var map_service_service_1 = require("../../../../services/map-service.service");
var auth_service_1 = require("../../../../services/auth.service");
var message_service_1 = require("../../../../@pages/components/message/message.service");
var MapLayer_service_1 = require("../../../../services/MapLayer-service");
var private_maplayer_service_1 = require("../../../../services/private-maplayer-service");
var Utility_service_1 = require("../../../../services/Utility.service");
var google_component_1 = require("../../../../maps/google/google.component");
var modal_1 = require("ngx-bootstrap/modal");
var delete_externalsymbols_component_1 = require("./delete-externalsymbols/delete-externalsymbols.component");
var _ = require("lodash");
var all_http_request_service_1 = require("../../../../services/all-http-request.service");
var my_map_service_1 = require("../../../../services/my-map.service");
var MapLayer_new_service_1 = require("../../../../services/MapLayer-new-service");
var MapLayerStylesComponent = (function () {
    function MapLayerStylesComponent(activeModal, MapServiceService, AuthenticationService, _notification, MapLayerService, MapLayerNewService, GoogleMapPage, bsModalService, PrivateMapLayerService, UtilityService, httpRequest, myMapService) {
        this.activeModal = activeModal;
        this.MapServiceService = MapServiceService;
        this.AuthenticationService = AuthenticationService;
        this._notification = _notification;
        this.MapLayerService = MapLayerService;
        this.MapLayerNewService = MapLayerNewService;
        this.GoogleMapPage = GoogleMapPage;
        this.bsModalService = bsModalService;
        this.PrivateMapLayerService = PrivateMapLayerService;
        this.UtilityService = UtilityService;
        this.httpRequest = httpRequest;
        this.myMapService = myMapService;
        this.LayerName = "";
        this.LayerDescription = "";
        this.LayerIsShared = false;
        this.LayerStyleVisibleList = {
            TitleName: 'Point',
            Border: '#8db3e2',
            Color: '#8db3e2',
            Size: 50,
            Thickness: 10,
            Transparency: 0,
            defaultIconURL: '',
            EnergyLayerId: 0,
            UserId: this.AuthenticationService.getLoggedinUserId()
        };
        this.isFloodHazardZones = false;
        this.LayerTypesEnum = Object.freeze({ "EL": "EnergyLayer", "PL": "PrivateLayer" });
        this.IconsnameList = ["Circle", "Rectangle", "RoundedRectangle", "Rhombus", "TriangleUp", "TriangleDown", "TriangleRight", "TriangleLeft", "Pentagon", "Pentagram", "AsphaltRefinery", "ChemicalPlant", "DehydrationPlant", "DeliveryPoint", "GasProcessingPlant", "IndustrialPlant",
            "LNGTerminal", "LPGFractionator", "Mine", "NaturalGasMarketingHub", "Refinery", "Storage",
            "TruckUnloader", "UndergroundStorage", "Airport", "BullsEye", "CheckeredCircle", "CheckeredSquare",
            "Pointer", "HalfCircle", "HalfSquare", "OilDerrick"];
        this.iconType = "Point";
        this.IconList = [];
        this.iconUrl = environment_1.environment.GetLayerIconURL + "/icongenerate/get/?";
        this.defaultIconURL = "";
        this.LabelField = "";
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
        this.imagesmapsearch360 = this.ImageURLPath;
        this.CustomeiconList = [this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/54.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/53.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/55.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/56.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/88.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/89.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/90.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/91.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/92.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/93.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/94.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/95.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/96.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/97.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/98.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/99.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/103.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/105.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/107.png",
            this.imagesmapsearch360 + "01)AngularEnvision%20Images/ExternalIconId/113.png"];
        this.CustomeSymbols = [];
        this.displayProperties = [];
    }
    MapLayerStylesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.UtilityService.CloseModalOnRouteChange(this.activeModal);
        setTimeout(function () {
            _this.FillColorandCorderColor();
            _this.UtilityService.HovereventForMapSearchData();
        }, 100);
        var EnergyLayerID = this.Node['data'].Id;
        var parentid = this.Node['parent'].data.Id;
        var TabDatalist = this.MapServiceService._GridTabData.value;
        this.LayerStyleVisibleList.defaultIconURL = this.Nodedata.IconUrl;
        this.defaultIconURL = this.Nodedata.IconUrl;
        var IsActive = true;
        for (var _i = 0, TabDatalist_1 = TabDatalist; _i < TabDatalist_1.length; _i++) {
            var tabdata = TabDatalist_1[_i];
            for (var _a = 0, _b = tabdata.energyLayer; _a < _b.length; _a++) {
                var el = _b[_a];
                if (el.treestatus === "GroupLayer") {
                    if (el.EnergyParentID == parseInt(parentid) && el.treestatus === "GroupLayer" && el.EnergyLayerID == parseInt(EnergyLayerID)) {
                        IsActive = false;
                        if (el.EnergyLayerStylesByUserModel.length > 0) {
                            this.setIcononPointbtn(el.EnergyLayerStylesByUserModel[0]);
                        }
                        else {
                            this.setIcononPointbtn(el);
                        }
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
                                }
                                else {
                                    this.setIcononPointbtn(el);
                                }
                                this.SetLayerProperies(el);
                            }
                            break;
                        case this.LayerTypesEnum.PL:
                            if (el.treestatus === "Individual" && el.EnergyLayerID == parseInt(EnergyLayerID)) {
                                IsActive = false;
                                if (el.EnergyLayerStylesByUserModel.length > 0) {
                                    this.setIcononPointbtn(el.EnergyLayerStylesByUserModel[0]);
                                }
                                else {
                                    this.setIcononPointbtn(el);
                                }
                                this.SetLayerProperies(el);
                                this.SetLayerDetails(el);
                            }
                            break;
                    }
                }
            }
        }
        if (IsActive == true) {
            for (var _c = 0, _d = this.ActiveEnergyLayerList; _c < _d.length; _c++) {
                var el = _d[_c];
                if (el.treestatus === "GroupLayer") {
                    if (el.EnergyParentID == parseInt(parentid) && el.treestatus === "GroupLayer" && el.EnergyLayerID == parseInt(EnergyLayerID)) {
                        if (el.EnergyLayerStylesByUserModel.length > 0) {
                            this.setIcononPointbtn(el.EnergyLayerStylesByUserModel[0]);
                        }
                        else {
                            this.setIcononPointbtn(el);
                        }
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
                                }
                                else {
                                    this.setIcononPointbtn(el);
                                }
                                this.SetLayerProperies(el);
                            }
                            break;
                        case this.LayerTypesEnum.PL:
                            if (el.treestatus === "Individual" && el.EnergyLayerID == parseInt(EnergyLayerID)) {
                                if (el.EnergyLayerStylesByUserModel.length > 0) {
                                    this.setIcononPointbtn(el.EnergyLayerStylesByUserModel[0]);
                                }
                                else {
                                    this.setIcononPointbtn(el);
                                }
                                this.SetLayerProperies(el);
                                this.SetLayerDetails(el);
                            }
                            break;
                    }
                }
            }
        }
    };
    //OnlyForPointLayer
    MapLayerStylesComponent.prototype.SetRepresentationTypeForEnergyLayerStyle = function (energyLayer) {
        if (!energyLayer.EnergyLayerStylesByUserModel[0].RepresentationType) {
            if (energyLayer.RepresentationType.toLowerCase() == "point")
                energyLayer.EnergyLayerStylesByUserModel[0].RepresentationType = energyLayer.RepresentationType;
        }
    };
    MapLayerStylesComponent.prototype.FillColorandCorderColor = function () {
        var _this = this;
        $('#Fillcolorlayer').colorpicker({
            color: this.LayerStyleVisibleList.Color,
            history: false,
            transparentColor: true,
            defaultPalette: 'theme',
            displayIndicator: false,
            strings: "Theme Colors,Standard Colors,More Colors,Theme Colors,Back to Palette,History,Pas encore d'historique."
        });
        $("#Fillcolorlayer").on("change.color", function (event, color) {
            var colorval = $("#Fillcolorlayer").val();
            _this.LayerStyleVisibleList.Color = colorval;
            _this.SetcurrentVal(colorval, "Color");
            // $('#title').css('background-color', color);
        });
        //FillBorderlayer
        $('#FillBorderlayer').colorpicker({
            color: this.LayerStyleVisibleList.Border,
            history: false,
            transparentColor: true,
            defaultPalette: 'theme',
            displayIndicator: false,
            strings: "Theme Colors,Standard Colors,More Colors,Theme Colors,Back to Palette,History,Pas encore d'historique."
        });
        $("#FillBorderlayer").on("change.color", function (event, color) {
            var colorval = $("#FillBorderlayer").val();
            _this.LayerStyleVisibleList.Border = colorval;
            _this.SetcurrentVal(colorval, "border");
            // $('#title').css('background-color', color);
        });
    };
    MapLayerStylesComponent.prototype.setIcononPointbtn = function (EnergyLayer) {
        var image = this.Nodedata.IconUrl;
        if (image.indexOf(this.imagesmapsearch360) >= 0) {
            this.iconType = "ExternalIcon";
        }
        else {
            var splitedval = image.split('?');
            var urlval = splitedval[1].split('&');
            for (var _i = 0, urlval_1 = urlval; _i < urlval_1.length; _i++) {
                var urlpro = urlval_1[_i];
                var URLsplitedval = urlpro.split('=');
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
    };
    MapLayerStylesComponent.prototype.UpdateEnvisionLineIcon = function (EnergyLayer) {
        var list = [];
        var opacity = EnergyLayer["Opacity"];
        var fillColor = EnergyLayer["FillColor"];
        var strokeColor = EnergyLayer["StrokeColor"];
        var strokeThicknessPercentage = EnergyLayer["StrokeThicknessPercent"];
        var sizePercentage = EnergyLayer["SizePercent"];
        // for (let i = 0; i < this.IconsnameList.length; i++) {
        this.IconList = [];
        var imgURL = this.generateIconUrl(0, "Line", EnergyLayer, opacity, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage);
        list.push(imgURL);
        imgURL = this.generateIconUrl(1, "DashLine", EnergyLayer, opacity, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage);
        list.push(imgURL);
        //}
        this.IconList.push(list);
    };
    MapLayerStylesComponent.prototype.updateEnvisionIcons = function (EnergyLayer) {
        var list = [];
        var opacity = EnergyLayer["Opacity"];
        var fillColor = EnergyLayer["FillColor"];
        var strokeColor = EnergyLayer["StrokeColor"];
        var strokeThicknessPercentage = EnergyLayer["StrokeThicknessPercent"];
        var sizePercentage = EnergyLayer["SizePercent"];
        opacity = this.LayerStyleVisibleList.Transparency;
        for (var i = 0; i < this.IconsnameList.length; i++) {
            var imgURL = this.generateIconUrl(i, this.IconsnameList[i], EnergyLayer, opacity, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage);
            list.push(imgURL);
        }
        this.IconList.push(list);
    };
    MapLayerStylesComponent.prototype.SelectIcon = function (SelectedIconicon) {
        var _this = this;
        if (SelectedIconicon.indexOf(this.imagesmapsearch360) >= 0 || SelectedIconicon.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0) {
            this.LayerStyleVisibleList.defaultIconURL = SelectedIconicon;
            this.defaultIconURL = SelectedIconicon;
            setTimeout(function () {
                var ImageId = document.getElementById("pointImage");
                ImageId.style.opacity = "" + _this.UtilityService.GetOpacityFromPercentage(_this.LayerStyleVisibleList.Transparency);
                ImageId.style.width = Math.round(parseInt("" + _this.LayerStyleVisibleList.Size) * 30 / 100) + "px";
            }, 100);
        }
        else {
            this.LayerStyleVisibleList.defaultIconURL = SelectedIconicon;
            this.defaultIconURL = SelectedIconicon;
            var ImageId = document.getElementById("pointImage");
            ImageId.style.opacity = "";
            ImageId.style.width = "";
        }
    };
    MapLayerStylesComponent.prototype.SelectLineIcon = function (SelectedIconicon) {
        this.LayerStyleVisibleList.defaultIconURL = SelectedIconicon;
        this.defaultIconURL = SelectedIconicon;
    };
    MapLayerStylesComponent.prototype.setValueinControls = function (layer) {
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
        var val = '' + layer["Opacity"];
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
        };
        this.setExternaliconUploaded();
    };
    MapLayerStylesComponent.prototype.generateIconUrl = function (id, type, EnergyLayer, opacity, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage) {
        var layer = EnergyLayer;
        var iconIdValue = id;
        var iconTypeValue = type;
        var and = "&";
        var iconURL = this.iconUrl;
        var urlType = "CustomStyleIcon";
        var seperator = "&amp;";
        var iconId = "10";
        var iconType = "Circle";
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
    };
    MapLayerStylesComponent.prototype.ThicknesshandleChange = function (event) {
        this.SetcurrentVal(event, "Thickness");
    };
    MapLayerStylesComponent.prototype.TransparencyhandleChange = function (event) {
        this.SetcurrentVal(event, "Transparency");
    };
    MapLayerStylesComponent.prototype.SizehandleChange = function (event) {
        this.SetcurrentVal(event, "Size");
    };
    MapLayerStylesComponent.prototype.pckBorderChange = function (event) {
        this.SetcurrentVal(event.value, "border");
    };
    MapLayerStylesComponent.prototype.pckcolorChange = function (event) {
        this.SetcurrentVal(event.value, "Color");
    };
    MapLayerStylesComponent.prototype.SetcurrentVal = function (StyleVal, StyleName) {
        var opacity = this.LayerStyleVisibleList["layerStyle"]["opacity"];
        opacity = this.LayerStyleVisibleList.Transparency;
        var fillColor = this.LayerStyleVisibleList["layerStyle"]["fillColor"];
        fillColor = _.toUpper(this.LayerStyleVisibleList.Color);
        var strokeColor = this.LayerStyleVisibleList["layerStyle"]["strokeColor"];
        strokeColor = _.toUpper(this.LayerStyleVisibleList.Border);
        var strokeThicknessPercentage = this.LayerStyleVisibleList["layerStyle"]["strokeThicknessPercentage"];
        strokeThicknessPercentage = this.LayerStyleVisibleList.Thickness;
        var sizePercentage = this.LayerStyleVisibleList["layerStyle"]["sizePercentage"];
        sizePercentage = this.LayerStyleVisibleList.Size;
        var defaultIconURL = this.LayerStyleVisibleList.defaultIconURL;
        //defaultIconURL = this.defaultIconURL;
        if (defaultIconURL.indexOf(this.imagesmapsearch360) >= 0) {
            var url1 = defaultIconURL;
            this.LayerStyleVisibleList.defaultIconURL = "";
            this.LayerStyleVisibleList.defaultIconURL = defaultIconURL;
            this.defaultIconURL = url1;
            var ImageId = document.getElementById("pointImage");
            ImageId.style.opacity = "" + this.UtilityService.GetOpacityFromPercentage(this.LayerStyleVisibleList.Transparency);
            ImageId.style.width = Math.round(parseInt("" + this.LayerStyleVisibleList.Size) * 30 / 100) + "px";
        }
        else {
            var splitedval = defaultIconURL.split('?');
            var val = splitedval[1].split('&');
            var URL_1 = splitedval[0];
            var parameter = "";
            for (var _i = 0, val_1 = val; _i < val_1.length; _i++) {
                var iconstyle = val_1[_i];
                var s = iconstyle.split('=');
                var key = s[0];
                var val1 = s[1];
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
                    var color = this.UtilityService.GetAlphaValue(opacity) + this.UtilityService.GetHexValueWithAlpha(fillColor);
                    color = _.toUpper(color);
                    val1 = color;
                }
                else if (key == "StrokeColor" && this.LayerStyleVisibleList.TitleName == "Point") {
                    var bordercolor = this.UtilityService.GetAlphaValue(opacity) + this.UtilityService.GetHexValueWithAlpha(strokeColor);
                    bordercolor = _.toUpper(bordercolor);
                    val1 = bordercolor;
                }
                else if (key == "StrokeColor" && this.LayerStyleVisibleList.TitleName == "Line") {
                    var color = this.UtilityService.GetAlphaValue(opacity) + this.UtilityService.GetHexValueWithAlpha(fillColor);
                    color = _.toUpper(color);
                    val1 = color;
                }
                else if (key == "StrokeColor" && this.LayerStyleVisibleList.TitleName == "Area") {
                    var bordercolor = this.UtilityService.GetAlphaValue(opacity) + this.UtilityService.GetHexValueWithAlpha(strokeColor);
                    bordercolor = _.toUpper(bordercolor);
                    val1 = bordercolor;
                }
                if (parameter == "") {
                    parameter = key + "=" + val1;
                }
                else {
                    parameter += "&" + key + "=" + val1;
                }
            }
            if (URL_1.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0) {
                var url1 = URL_1 + "?" + parameter;
                this.LayerStyleVisibleList.defaultIconURL = "";
                this.LayerStyleVisibleList.defaultIconURL = URL_1 + "?" + parameter;
                this.defaultIconURL = url1;
            }
            else {
                var url1 = this.iconUrl + parameter;
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
            strokeColor = fillColor;
        }
        var list = [];
        this.IconList = [];
        if (this.LayerStyleVisibleList.TitleName == 'Point') {
            this.UtilityService.SetDefaultIconImagestyle(sizePercentage, opacity, this.imagesmapsearch360);
            for (var i = 0; i < this.IconsnameList.length; i++) {
                var imgURL = this.generateIconUrl(i, this.IconsnameList[i], this.LayerStyleVisibleList["layerStyle"], opacity, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage);
                list.push(imgURL);
            }
        }
        else if (this.LayerStyleVisibleList.TitleName == 'Line') {
            var imgURL = this.generateIconUrl(0, "Line", this.LayerStyleVisibleList["layerStyle"], opacity, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage);
            list.push(imgURL);
            imgURL = this.generateIconUrl(12, "DashLine", this.LayerStyleVisibleList["layerStyle"], opacity, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage);
            list.push(imgURL);
        }
        this.IconList.push(list);
    };
    MapLayerStylesComponent.prototype.SaveStyle = function () {
        var _this = this;
        this.LayerStyleVisibleList;
        var IconType = '';
        var externaliconURL = "";
        var defaultIconURL = this.LayerStyleVisibleList.defaultIconURL;
        if (defaultIconURL.indexOf(this.imagesmapsearch360) >= 0 || defaultIconURL.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0) {
            IconType = "ExternalIcon";
            externaliconURL = defaultIconURL;
            if (externaliconURL.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0) {
                var splitedval = defaultIconURL.split('?');
                var val = splitedval[1].split('&');
                for (var _i = 0, val_2 = val; _i < val_2.length; _i++) {
                    var iconstyle = val_2[_i];
                    var s = iconstyle.split('=');
                    var key = s[0];
                    var val1 = s[1];
                    if (key == "ExternalIconId") {
                        externaliconURL = val1;
                    }
                }
            }
            else {
                var SplitExicon = externaliconURL.split('/');
                externaliconURL = SplitExicon[SplitExicon.length - 1];
            }
        }
        else {
            var splitedval = defaultIconURL.split('?');
            var val = splitedval[1].split('&');
            for (var _a = 0, val_3 = val; _a < val_3.length; _a++) {
                var iconstyle = val_3[_a];
                var s = iconstyle.split('=');
                var key = s[0];
                var val1 = s[1];
                if (key == "IconType") {
                    IconType = val1;
                }
            }
        }
        var DetailPanelProperties = '';
        var list = this.getISTrueProperties();
        for (var _b = 0, list_1 = list; _b < list_1.length; _b++) {
            var propval = list_1[_b];
            var textpropval = propval.value;
            var txtpropval = document.getElementById('txt' + propval.pro)['value'];
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
        var EnergyLayerStylesByUser = {
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
        };
        if (IconType == "Line" || IconType == "DashLine") {
            EnergyLayerStylesByUser.StrokeColor = this.UtilityService.GetAlphaValue(this.LayerStyleVisibleList.Transparency) + this.UtilityService.GetHexValueWithAlpha(this.LayerStyleVisibleList.Color);
        }
        if (IconType == "Area") {
            EnergyLayerStylesByUser.SizePercent = 100;
        }
        var JsonUserstyle = JSON.stringify(EnergyLayerStylesByUser);
        this.httpRequest._NodeSaveLayerstylebyUser(JsonUserstyle, externaliconURL).subscribe(function (data) {
            var Res = data;
            if (Res._Issuccess == true) {
                var ResEnergyLayerStylesByUser = Res.EnergyLayerStylesByUser[0];
                var treeUI_1 = _this.MapServiceService._TreeUI.getValue();
                if (treeUI_1.treeModel.nodes) {
                    var existnode = treeUI_1.treeModel.getNodeById(_this.LayerStyleVisibleList.EnergyLayerId);
                    if (existnode) {
                        if (ResEnergyLayerStylesByUser.IconType == "ExternalIcon" && ResEnergyLayerStylesByUser.ExternalIconId) {
                            var EnergyLayerID_1 = ResEnergyLayerStylesByUser.EnergyLayerId;
                            var url = _this.UtilityService.GetDefaultExternalIcon(ResEnergyLayerStylesByUser.ExternalIconId);
                            if (url.indexOf(_this.imagesmapsearch360 + '01)AngularEnvision%20Images') >= 0) {
                                existnode.data.IconUrl = url;
                            }
                            else {
                                var externaliconlist = _this.MapServiceService.ExternalIconList.value;
                                if (externaliconlist) {
                                    for (var _i = 0, externaliconlist_1 = externaliconlist; _i < externaliconlist_1.length; _i++) {
                                        var exicon = externaliconlist_1[_i];
                                        if (exicon.Id == ResEnergyLayerStylesByUser.ExternalIconId) {
                                            var URL_2 = _this.UtilityService.GetDefaultExternalIcon(exicon.Id);
                                            if (URL_2 == "") {
                                                URL_2 = _this.imagesmapsearch360 + "EnvisionAngularUsersIcon/" + exicon.UploadedBy + "/" + exicon.Id + exicon.Extension;
                                                existnode.data.IconUrl = URL_2;
                                                break;
                                            }
                                        }
                                    }
                                }
                                else {
                                    existnode.data.IconUrl = externaliconURL;
                                }
                                if (!existnode.data.IconUrl) {
                                    existnode.data.IconUrl = _this.CustomeiconList[3];
                                }
                            }
                            var TreeImageIcon = document.getElementById(EnergyLayerID_1 + "TreeCostomelayerIconImage");
                            if (TreeImageIcon) {
                                var src = TreeImageIcon.getAttribute('src');
                                var srcWidth_1 = "100";
                                var srcOpacity_1 = "1";
                                srcWidth_1 = ResEnergyLayerStylesByUser.SizePercent;
                                srcOpacity_1 = "" + ResEnergyLayerStylesByUser.Opacity;
                                srcWidth_1 = Math.round(parseInt(srcWidth_1) * 30 / 100) + "px";
                                if (srcOpacity_1 == "0") {
                                    srcOpacity_1 = "1";
                                }
                                setTimeout(function () {
                                    var id = '#' + EnergyLayerID_1 + 'TreeCostomelayerIconImage';
                                    $(id).attr('style', 'width:' + srcWidth_1 + " !important ;opacity :" + srcOpacity_1 + " !important;");
                                }, 500);
                            }
                        }
                        else {
                            existnode.data.IconUrl = _this.LayerStyleVisibleList.defaultIconURL;
                        }
                        setTimeout(function () {
                            treeUI_1.treeModel.update();
                        }, 500);
                        var EnergyLayerID = _this.Node['data'].Id;
                        var parentid = _this.Node['parent'].data.Id;
                        var TabList = _this.MapServiceService._GridTabData.value;
                        for (var t = 0; t < TabList.length; t++) {
                            for (var _a = 0, _b = TabList[t].energyLayer; _a < _b.length; _a++) {
                                var s = _b[_a];
                                if (TabList[t].ActiveClass == " active") {
                                    if (((s.EnergyParentID == parseInt(parentid)) && (s.EnergyLayerID == parseInt(EnergyLayerID)))) {
                                        s.EnergyLayerStylesByUserModel.length = 0;
                                        s.EnergyLayerStylesByUserModel.push(ResEnergyLayerStylesByUser);
                                        var Gridcolumns = _this.MapServiceService.GenerateColumns(s);
                                        Array.prototype.push.apply(_this.MapServiceService.GridColumns.getValue(), Gridcolumns);
                                        _this.MapServiceService.setGridMapcolumns(Gridcolumns);
                                        if (!existnode.data.IsChecked) {
                                            _this.MapLayerService.removemapLayer(s);
                                        }
                                    }
                                }
                                for (var _c = 0, _d = TabList[t].energyLayer; _c < _d.length; _c++) {
                                    var s_1 = _d[_c];
                                    if (((s_1.EnergyParentID == parseInt(parentid)) && (s_1.EnergyLayerID == parseInt(EnergyLayerID)))) {
                                        s_1.EnergyLayerStylesByUserModel.length = 0;
                                        s_1.EnergyLayerStylesByUserModel.push(ResEnergyLayerStylesByUser);
                                        if (!existnode.data.IsChecked) {
                                            _this.MapLayerService.loadmapLayers(s_1);
                                            _this.GoogleMapPage.BindActiveGridData();
                                            //this.resetGridColumns();
                                        }
                                    }
                                }
                                _this.MapLayerNewService.LoadMapLayers();
                            }
                        }
                        if (_this.isFloodHazardZones == true) {
                            for (var _e = 0, _f = _this.ActiveEnergyLayerList; _e < _f.length; _e++) {
                                var el = _f[_e];
                                if (!el.TableName && el.DetailPanelProperties.toString().indexOf('BaseUri==') != -1 && el.DetailPanelPropertiesMain.toString().indexOf('BaseUri==') != -1) {
                                    if (!existnode.data.IsChecked) {
                                        el.EnergyLayerStylesByUserModel.length = 0;
                                        el.EnergyLayerStylesByUserModel.push(ResEnergyLayerStylesByUser);
                                        _this.MapLayerService.removemapLayer(el);
                                        _this.MapLayerService.loadmapLayers(el);
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
        }, function (error) {
            console.log(error);
        });
    };
    MapLayerStylesComponent.prototype.SaveMyLayerStyle = function () {
        var _this = this;
        this.LayerStyleVisibleList;
        var IconType = '';
        var externaliconURL = "";
        var defaultIconURL = this.LayerStyleVisibleList.defaultIconURL;
        if (defaultIconURL.indexOf(this.imagesmapsearch360) >= 0 || defaultIconURL.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0) {
            IconType = "ExternalIcon";
            externaliconURL = defaultIconURL;
            if (externaliconURL.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0) {
                var splitedval = defaultIconURL.split('?');
                var val = splitedval[1].split('&');
                for (var _i = 0, val_4 = val; _i < val_4.length; _i++) {
                    var iconstyle = val_4[_i];
                    var s = iconstyle.split('=');
                    var key = s[0];
                    var val1 = s[1];
                    if (key == "ExternalIconId") {
                        externaliconURL = val1;
                    }
                }
            }
            else {
                var SplitExicon = externaliconURL.split('/');
                externaliconURL = SplitExicon[SplitExicon.length - 1];
            }
        }
        else {
            var splitedval = defaultIconURL.split('?');
            var val = splitedval[1].split('&');
            for (var _a = 0, val_5 = val; _a < val_5.length; _a++) {
                var iconstyle = val_5[_a];
                var s = iconstyle.split('=');
                var key = s[0];
                var val1 = s[1];
                if (key == "IconType") {
                    IconType = val1;
                }
            }
        }
        var DetailPanelProperties = '';
        var list = this.getISTrueProperties();
        for (var _b = 0, list_2 = list; _b < list_2.length; _b++) {
            var propval = list_2[_b];
            var textpropval = propval.value;
            var txtpropval = document.getElementById('txt' + propval.pro)['value'];
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
        var LayerStylesByUser = {
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
        };
        if (IconType == "Line" || IconType == "DashLine") {
            LayerStylesByUser.StrokeColor = this.UtilityService.GetAlphaValue(this.LayerStyleVisibleList.Transparency) + this.UtilityService.GetHexValueWithAlpha(this.LayerStyleVisibleList.Color);
        }
        if (IconType == "Area") {
            LayerStylesByUser.SizePercent = 100;
        }
        if (LayerStylesByUser.DataSetID == 0) {
            LayerStylesByUser.DataSetID = this.Node['data'].Id;
        }
        var JsonUserstyle = JSON.stringify(LayerStylesByUser);
        this.httpRequest._NodeSavePrivateLayerstylebyUser(JsonUserstyle, externaliconURL).subscribe(function (data) {
            var Res = data;
            if (Res._Issuccess == true) {
                var privateTreeUI_1 = _this.MapServiceService._PrivateTreeUI.getValue();
                if (privateTreeUI_1.treeModel.nodes) {
                    var existnode = privateTreeUI_1.treeModel.getNodeById(_this.LayerStyleVisibleList.EnergyLayerId);
                    if (existnode) {
                        if (Res.PrivateLayerStyles.IconType == "ExternalIcon" && Res.PrivateLayerStyles.ExternalIconId) {
                            var EnergyLayerID_2 = Res.PrivateLayerStyles.EnergyLayerId;
                            var url = _this.UtilityService.GetDefaultExternalIcon(Res.PrivateLayerStyles.ExternalIconId);
                            if (url.indexOf(_this.imagesmapsearch360 + '01)AngularEnvision%20Images') >= 0) {
                                existnode.data.IconUrl = url;
                            }
                            else {
                                var externaliconlist = _this.MapServiceService.ExternalIconList.value;
                                if (externaliconlist) {
                                    for (var _i = 0, externaliconlist_2 = externaliconlist; _i < externaliconlist_2.length; _i++) {
                                        var exicon = externaliconlist_2[_i];
                                        if (exicon.Id == Res.PrivateLayerStyles.ExternalIconId) {
                                            var URL_3 = _this.UtilityService.GetDefaultExternalIcon(exicon.Id);
                                            if (URL_3 == "") {
                                                URL_3 = _this.imagesmapsearch360 + "EnvisionAngularUsersIcon/" + exicon.UploadedBy + "/" + exicon.Id + exicon.Extension;
                                                existnode.data.IconUrl = URL_3;
                                                break;
                                            }
                                        }
                                    }
                                }
                                else {
                                    existnode.data.IconUrl = externaliconURL;
                                }
                                if (!existnode.data.IconUrl) {
                                    existnode.data.IconUrl = _this.CustomeiconList[3];
                                }
                            }
                            var TreeImageIcon = document.getElementById(EnergyLayerID_2 + "TreeCostomelayerIconImage");
                            if (TreeImageIcon) {
                                var src = TreeImageIcon.getAttribute('src');
                                var srcWidth_2 = "100";
                                var srcOpacity_2 = "1";
                                srcWidth_2 = Res.PrivateLayerStyles.SizePercent;
                                srcOpacity_2 = "" + Res.PrivateLayerStyles.Opacity;
                                srcWidth_2 = Math.round(parseInt(srcWidth_2) * 30 / 100) + "px";
                                if (srcOpacity_2 == "0") {
                                    srcOpacity_2 = "1";
                                }
                                setTimeout(function () {
                                    var id = '#' + EnergyLayerID_2 + 'TreeCostomelayerIconImage';
                                    $(id).attr('style', 'width:' + srcWidth_2 + " !important ;opacity :" + srcOpacity_2 + " !important;");
                                }, 500);
                            }
                        }
                        else {
                            existnode.data.IconUrl = _this.LayerStyleVisibleList.defaultIconURL;
                        }
                        existnode.data.Name = Res.PrivateLayerStyles.DataSetName;
                        setTimeout(function () {
                            privateTreeUI_1.treeModel.update();
                        }, 500);
                        var PrivateEnergyLayerID = _this.Node['data'].Id;
                        var parentid = _this.Node['parent'].data.Id;
                        _this.LayerStyleVisibleList.EnergyLayerId = PrivateEnergyLayerID;
                        var TabList = _this.MapServiceService._GridTabData.getValue();
                        for (var t = 0; t < TabList.length; t++) {
                            if (TabList[t].parentID > 0 && !TabList[t].parentName) {
                                parentid = 0;
                            }
                            for (var _a = 0, _b = TabList[t].energyLayer; _a < _b.length; _a++) {
                                var s = _b[_a];
                                if (TabList[t].ActiveClass == " active") {
                                    if (((s.EnergyParentID == parseInt(parentid)) && (s.EnergyLayerID == parseInt(PrivateEnergyLayerID)))) {
                                        TabList[t].DisplayName = Res.PrivateLayerStyles.DataSetName;
                                        s.EnergyLayerStylesByUserModel.length = 0;
                                        s.EnergyLayerStylesByUserModel.push(Res.PrivateLayerStyles);
                                        var Gridcolumns = _this.MapServiceService.GenerateColumns(s);
                                        Array.prototype.push.apply(_this.MapServiceService.GridColumns.getValue(), Gridcolumns);
                                        _this.MapServiceService.setGridMapcolumns(Gridcolumns);
                                        if (!existnode.data.IsChecked) {
                                            _this.PrivateMapLayerService.RemoveMapLayer(s);
                                        }
                                    }
                                }
                            }
                            for (var _c = 0, _d = TabList[t].energyLayer; _c < _d.length; _c++) {
                                var s = _d[_c];
                                if (((s.EnergyParentID == parseInt(parentid)) && (s.EnergyLayerID == parseInt(PrivateEnergyLayerID)))) {
                                    s.EnergyLayerStylesByUserModel.length = 0;
                                    s.EnergyLayerStylesByUserModel.push(Res.PrivateLayerStyles);
                                    if (!existnode.data.IsChecked) {
                                        _this.PrivateMapLayerService.LoadPrivateMapLayers(s);
                                        _this.GoogleMapPage.BindTemporaryLayerActiveGridData();
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
        }, function (error) {
            console.log(error);
        });
    };
    MapLayerStylesComponent.prototype.SaveMyLayerStyle_test = function () {
        var _this = this;
        this.LayerStyleVisibleList;
        var IconType = '';
        var externaliconURL = "";
        var defaultIconURL = this.LayerStyleVisibleList.defaultIconURL;
        if (defaultIconURL.indexOf(this.imagesmapsearch360) >= 0 || defaultIconURL.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0) {
            IconType = "ExternalIcon";
            externaliconURL = defaultIconURL;
            if (externaliconURL.indexOf("http://energymapit.com/en/Handlers/IconImage.ashx") >= 0) {
                var splitedval = defaultIconURL.split('?');
                var val = splitedval[1].split('&');
                for (var _i = 0, val_6 = val; _i < val_6.length; _i++) {
                    var iconstyle = val_6[_i];
                    var s = iconstyle.split('=');
                    var key = s[0];
                    var val1 = s[1];
                    if (key == "ExternalIconId") {
                        externaliconURL = "http://images.mapsearch360.com/01)AngularEnvision%20Images/ExternalIconId/" + val1 + ".png";
                    }
                }
            }
            else {
                var SplitExicon = externaliconURL.split('/');
                externaliconURL = SplitExicon[SplitExicon.length - 1];
            }
        }
        else {
            var splitedval = defaultIconURL.split('?');
            var val = splitedval[1].split('&');
            for (var _a = 0, val_7 = val; _a < val_7.length; _a++) {
                var iconstyle = val_7[_a];
                var s = iconstyle.split('=');
                var key = s[0];
                var val1 = s[1];
                if (key == "IconType") {
                    IconType = val1;
                }
            }
        }
        var DetailPanelProperties = '';
        var list = this.getISTrueProperties();
        for (var _b = 0, list_3 = list; _b < list_3.length; _b++) {
            var propval = list_3[_b];
            var textpropval = propval.value;
            var txtpropval = document.getElementById('txt' + propval.pro)['value'];
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
        var LayerStylesByUser = {
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
        };
        if (IconType == "Line" || IconType == "DashLine") {
            LayerStylesByUser.StrokeColor = this.UtilityService.GetAlphaValue(this.LayerStyleVisibleList.Transparency) + this.UtilityService.GetHexValueWithAlpha(this.LayerStyleVisibleList.Color);
        }
        if (IconType == "Area") {
            LayerStylesByUser.SizePercent = 100;
        }
        if (LayerStylesByUser.DataSetID == 0) {
            LayerStylesByUser.DataSetID = this.Node['data'].Id;
        }
        var JsonUserstyle = JSON.stringify(LayerStylesByUser);
        this.httpRequest._NodeSavePrivateLayerstylebyUser(JsonUserstyle, externaliconURL).subscribe(function (data) {
            var Res = data;
            if (Res._Issuccess == true) {
                var privateTreeUI_2 = _this.MapServiceService._PrivateTreeUI.getValue();
                if (privateTreeUI_2.treeModel.nodes) {
                    var existnode = privateTreeUI_2.treeModel.getNodeById(_this.LayerStyleVisibleList.EnergyLayerId);
                    if (existnode) {
                        if (Res.PrivateLayerStyles.IconType == "ExternalIcon" && Res.PrivateLayerStyles.ExternalIconId) {
                            var EnergyLayerID_3 = Res.PrivateLayerStyles.EnergyLayerId;
                            var url = _this.UtilityService.GetDefaultExternalIcon(Res.PrivateLayerStyles.ExternalIconId);
                            if (url.indexOf(_this.imagesmapsearch360 + '01)AngularEnvision%20Images') >= 0) {
                                existnode.data.IconUrl = url;
                            }
                            else {
                                var externaliconlist = _this.MapServiceService.ExternalIconList.value;
                                if (externaliconlist) {
                                    for (var _i = 0, externaliconlist_3 = externaliconlist; _i < externaliconlist_3.length; _i++) {
                                        var exicon = externaliconlist_3[_i];
                                        if (exicon.Id == Res.PrivateLayerStyles.ExternalIconId) {
                                            var URL_4 = _this.UtilityService.GetDefaultExternalIcon(exicon.Id);
                                            if (URL_4 == "") {
                                                URL_4 = _this.imagesmapsearch360 + "EnvisionAngularUsersIcon/" + exicon.UploadedBy + "/" + exicon.Id + exicon.Extension;
                                                existnode.data.IconUrl = URL_4;
                                                break;
                                            }
                                        }
                                    }
                                }
                                else {
                                    existnode.data.IconUrl = externaliconURL;
                                }
                                if (!existnode.data.IconUrl) {
                                    existnode.data.IconUrl = _this.CustomeiconList[3];
                                }
                            }
                            var TreeImageIcon = document.getElementById(EnergyLayerID_3 + "TreeCostomelayerIconImage");
                            if (TreeImageIcon) {
                                var src = TreeImageIcon.getAttribute('src');
                                var srcWidth_3 = "100";
                                var srcOpacity_3 = "1";
                                srcWidth_3 = Res.PrivateLayerStyles.SizePercent;
                                srcOpacity_3 = "" + Res.PrivateLayerStyles.Opacity;
                                srcWidth_3 = Math.round(parseInt(srcWidth_3) * 30 / 100) + "px";
                                if (srcOpacity_3 == "0") {
                                    srcOpacity_3 = "1";
                                }
                                setTimeout(function () {
                                    var id = '#' + EnergyLayerID_3 + 'TreeCostomelayerIconImage';
                                    $(id).attr('style', 'width:' + srcWidth_3 + " !important ;opacity :" + srcOpacity_3 + " !important;");
                                }, 500);
                            }
                        }
                        else {
                            existnode.data.IconUrl = _this.LayerStyleVisibleList.defaultIconURL;
                        }
                        existnode.data.Name = Res.PrivateLayerStyles.DataSetName;
                        setTimeout(function () {
                            privateTreeUI_2.treeModel.update();
                        }, 500);
                        var PrivateEnergyLayerID = _this.Node['data'].Id;
                        var parentid = _this.Node['parent'].data.Id;
                        _this.LayerStyleVisibleList.EnergyLayerId = PrivateEnergyLayerID;
                        var TabList = _this.MapServiceService._GridTabData.getValue();
                        for (var t = 0; t < TabList.length; t++) {
                            for (var _a = 0, _b = TabList[t].energyLayer; _a < _b.length; _a++) {
                                var s = _b[_a];
                                if (((s.EnergyLayerID == parseInt(PrivateEnergyLayerID)))) {
                                    TabList[t].DisplayName = Res.PrivateLayerStyles.DataSetName;
                                    s.EnergyLayerStylesByUserModel.length = 0;
                                    s.EnergyLayerStylesByUserModel.push(Res.PrivateLayerStyles);
                                    if (!existnode.data.IsChecked) {
                                        _this.PrivateMapLayerService.RemoveMapLayer(s);
                                    }
                                }
                            }
                            for (var _c = 0, _d = TabList[t].energyLayer; _c < _d.length; _c++) {
                                var s = _d[_c];
                                if (((s.EnergyLayerID == parseInt(PrivateEnergyLayerID)))) {
                                    s.EnergyLayerStylesByUserModel.length = 0;
                                    s.EnergyLayerStylesByUserModel.push(Res.PrivateLayerStyles);
                                    if (!existnode.data.IsChecked) {
                                        _this.PrivateMapLayerService.LoadPrivateMapLayers(s);
                                        _this.GoogleMapPage.BindTemporaryLayerActiveGridData();
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
        }, function (error) {
            console.log(error);
        });
    };
    MapLayerStylesComponent.prototype.resetGridColumns = function () {
        var gridcolumns = this.MapServiceService.GridColumns.getValue();
        var gridOptions = this.MapServiceService.GridApi.getValue();
        var columnApi = gridOptions.columnApi;
        var TabList = this.MapServiceService._GridTabData.getValue();
        for (var t = 0; t < TabList.length; t++) {
            if (TabList[t].ActiveClass == " active") {
                var list = this.getISTrueProperties();
                for (var gridindex in gridcolumns) {
                    for (var _i = 0, _a = this.displayProperties; _i < _a.length; _i++) {
                        var proval = _a[_i];
                        var colkey = proval.pro;
                        var colDisplayval = proval.value;
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
    };
    MapLayerStylesComponent.prototype.removenotification = function () {
        var _this = this;
        setTimeout(function () {
            _this._notification.remove();
        }, 5000);
    };
    MapLayerStylesComponent.prototype.DisplayNotification = function (type, msg, Position1) {
        this._notification.create(type, msg, {
            Position: Position1,
            Style: "flip",
            Duration: 0
        });
    };
    MapLayerStylesComponent.prototype.SetLayerProperies = function (energyLayer) {
        var _this = this;
        this.displayProperties = [];
        var DBFProperties = energyLayer["DBFProperties"];
        var DetailPanelProperties = energyLayer["DetailPanelProperties"];
        var labelfeild = '';
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
            var splitedDBFProperties = DBFProperties.split(',');
            var splitedDetailPanelProperties = DetailPanelProperties.split(',');
            splitedDBFProperties = Array.from(new Set(splitedDBFProperties));
            splitedDetailPanelProperties = Array.from(new Set(splitedDetailPanelProperties));
            for (var _i = 0, splitedDBFProperties_1 = splitedDBFProperties; _i < splitedDBFProperties_1.length; _i++) {
                var splitval = splitedDBFProperties_1[_i];
                var proval = void 0;
                if (splitval.indexOf('=') >= 0) {
                    var splitdbf = splitval.split('=');
                    proval = {
                        pro: splitdbf[1],
                        value: splitdbf[1],
                        Added: false
                    };
                }
                else {
                    proval = {
                        pro: splitval,
                        value: splitval,
                        Added: false
                    };
                }
                this.displayProperties.push(proval);
            }
            for (var _a = 0, splitedDetailPanelProperties_1 = splitedDetailPanelProperties; _a < splitedDetailPanelProperties_1.length; _a++) {
                var splitvaldpp = splitedDetailPanelProperties_1[_a];
                var splitproval = splitvaldpp.split('=');
                var provalue = splitproval[0];
                var pro = splitproval[1];
                for (var x in this.displayProperties) {
                    if (this.displayProperties[x].pro == pro) {
                        this.displayProperties[x].value = provalue;
                        this.displayProperties[x].Added = true;
                    }
                }
            }
        }
        setTimeout(function () {
            _this.fillePropertyIndefault();
            if (labelfeild) {
                _this.LabelField = labelfeild;
                $('#chk' + _this.LabelField).prop('checked', true);
            }
        }, 1000);
    };
    MapLayerStylesComponent.prototype.SetLayerDetails = function (energyLayer) {
        this.LayerName = energyLayer.DataSetName;
        this.LayerDescription = energyLayer.Description;
        this.LayerIsShared = energyLayer.IsPublic;
    };
    MapLayerStylesComponent.prototype.fillePropertyIndefault = function () {
        var list = this.getISTrueProperties();
        if (list.length > 0) {
            for (var _i = 0, list_4 = list; _i < list_4.length; _i++) {
                var Property = list_4[_i];
                this.PropertyValue(Property.pro, true);
                this.CreateHTMLForProperties(Property.pro, Property.value);
            }
        }
    };
    MapLayerStylesComponent.prototype.AddProperty = function () {
        var list = this.displayProperties.filter(function (el) {
            return el.Added == false;
        });
        if (list.length > 0) {
            var Property = list[0];
            this.PropertyValue(Property.pro, true);
            this.UpdateProperty(Property.pro, Property.value);
            this.CreateHTMLForProperties(Property.pro, Property.value);
        }
    };
    MapLayerStylesComponent.prototype.PropertyValue = function (pro, val) {
        for (var x in this.displayProperties) {
            if (this.displayProperties[x].pro == pro) {
                this.displayProperties[x].Added = val;
            }
        }
    };
    MapLayerStylesComponent.prototype.getISTrueProperties = function () {
        var list = this.displayProperties.filter(function (el) {
            return el.Added == true;
        });
        return list;
    };
    MapLayerStylesComponent.prototype.UpdateProperty = function (pro, value) {
        for (var x in this.displayProperties) {
            if (this.displayProperties[x].Added == true && this.displayProperties[x].pro != pro) {
                var select = this.displayProperties[x].pro;
                $('#dropdown' + select + ' option[value=' + pro + ']').remove();
            }
        }
    };
    MapLayerStylesComponent.prototype.CreateHTMLForProperties = function (pro, value) {
        var dataRow = ' <div class="row form-group m-0 p-0"  style=" font-size: 12px; " id="FullDiv' + pro + '"><div class="col-md-1 m-0 p-2"  style=" font-size: 12px; " ><button type="button" data-Pro="' + pro + '" data-vale="' + value + '" class="btn btn-default btn-xs removeProperty"><i class="fa fa-trash fa-2x" style = "color: #5995f7;"  style=" font-size: 12px; "> </i></button></div>';
        dataRow += '<div class="col-md-6 m-0 p-2" ><input type="text" class="form-control txtPropertiestextbox" size = "40" value="' + value + '" id="txt' + pro + '"  style=" font-size: 12px; "> </div>';
        dataRow += '<div class="col-md-4 m-0 p-2" ><select id="dropdown' + pro + '" class="form-control SelectProperty" style = "width:100%;font-size: 11.5px;" ><option selected value="' + pro + '">' + pro + '</option></select></div><div class="col-md-1 m-0 p-2 text-center ProdLable">';
        dataRow += '<div class="checkbox check-primary"><input type="checkbox" value="0" class="Propertiescheckbox" data-Pro=' + pro + ' data-vale=' + value + ' id="chk' + pro + '"  style=" font-size: 12px; "><label for="chk' + pro + '" class="m-0 p-0"  style=" font-size: 12px; "></label></div></div></div>';
        $("#PropertiesData").append(dataRow);
        this.FillDropdownProperties(pro, value);
        this.LoadPropertiesEvent();
    };
    MapLayerStylesComponent.prototype.FillDropdownProperties = function (pro, value) {
        for (var i = 0; i < this.displayProperties.length; i++) {
            if (this.displayProperties[i].Added == false) {
                $("#dropdown" + pro).append("<option value=" + this.displayProperties[i].pro + ">" + this.displayProperties[i].pro + "</option>");
            }
        }
    };
    MapLayerStylesComponent.prototype.LoadPropertiesEvent = function () {
        var _this = this;
        $('.Propertiescheckbox').off("change").on('change', function (e) {
            if (e.currentTarget.checked == true) {
                var prop = e.currentTarget.getAttribute('data-Pro');
                _this.LabelField = prop;
            }
            else {
                _this.LabelField = '';
            }
            $('.Propertiescheckbox').not(e.currentTarget).prop('checked', false);
        });
        $('.removeProperty').off("click").on('click', function (e) {
            var pro = e.currentTarget.getAttribute("data-Pro");
            var value = e.currentTarget.getAttribute("data-vale");
            var fulldivId = e.currentTarget.getAttribute("data-fullDivId");
            _this.PropertyValue(pro, false);
            for (var i = 0; i < _this.displayProperties.length; i++) {
                if (_this.displayProperties[i].Added == true) {
                    $("#dropdown" + _this.displayProperties[i].pro).append("<option value=" + pro + ">" + pro + "</option>");
                }
            }
            $('#FullDiv' + pro).remove();
        });
        var previousselectedvalue = '';
        for (var i = 0; i < this.displayProperties.length; i++) {
            if (this.displayProperties[i].Added == true) {
                var sel = $("#dropdown" + this.displayProperties[i].pro);
                sel.data("prev", sel.val());
            }
        }
        $('.SelectProperty').off("change").on('change', function (e) {
            var preval = $(e.currentTarget).data("prev");
            var currentval = e.currentTarget.value;
            _this.PropertyValue(preval, false);
            _this.PropertyValue(currentval, true);
            for (var i = 0; i < _this.displayProperties.length; i++) {
                if (_this.displayProperties[i].Added == true) {
                    $("#dropdown" + _this.displayProperties[i].pro).append("<option value=" + preval + ">" + preval + "</option>");
                    $('#dropdown' + _this.displayProperties[i].pro + ' option[value=' + currentval + ']').remove();
                }
            }
            var newid = "dropdown" + currentval;
            e.currentTarget.id = newid;
            var textboxif = "txt" + preval;
            document.getElementById(textboxif).setAttribute("id", "txt" + currentval);
            var sel = $("#" + e.currentTarget.id);
            sel.data("prev", currentval);
        });
    };
    MapLayerStylesComponent.prototype.removeClassformTab = function () {
        $($('.MapLayerstyle .tab-wrapper')[0]).attr('style', '');
    };
    MapLayerStylesComponent.prototype.Addclassfromtab = function () {
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
    };
    MapLayerStylesComponent.prototype.uploadSymbol = function (event) {
        var _this = this;
        var x = document.getElementById("OploadSymbolFile");
        if (x['files'].length == 0) {
            alert('Select Symbol.');
        }
        else {
            var Uploadedfile_1 = x['files'][0];
            var fileSize = false;
            var type = false;
            var size = Uploadedfile_1.size;
            if (size >= 102400) {
                alert('The Image Is too big');
                //fileSize = true;
            }
            else {
                fileSize = true;
            }
            if (Uploadedfile_1.type.indexOf('png') >= 0 || Uploadedfile_1.type.indexOf('gif') >= 0
                || Uploadedfile_1.type.indexOf('jpg') >= 0
                || Uploadedfile_1.type.indexOf('icon') >= 0) {
                type = true;
            }
            else {
                alert('Select Only .png, .gif, .jpg, .icon');
                type = false;
            }
            if (fileSize == true && type == true) {
                var input = event.target;
                var reader = new FileReader();
                reader.onload = function (e) {
                    var dataURL = reader.result;
                    // this.CustomeSymbols.push(dataURL);
                    var ExternalIcons = {
                        UserId: _this.LayerStyleVisibleList.UserId,
                        base64Icon: "" + dataURL,
                        FileName: Uploadedfile_1.name,
                        RightLevel: "User",
                        Extension: Uploadedfile_1.type
                    };
                    _this.httpRequest._NodeSaveCustomSymbols(ExternalIcons).subscribe(function (data) {
                        //let res = JSON.parse(data.json());
                        var res = data;
                        if (res._Issuccess) {
                            var URL_5 = _this.imagesmapsearch360 + "EnvisionAngularUsersIcon/" + res.ExternalIcon.UploadedBy + "/" + res.ExternalIcon.Id + res.ExternalIcon.Extension;
                            var icon = _this.MapServiceService.ExternalIconList.value;
                            if (icon) {
                                _this.MapServiceService.ExternalIconList.getValue().push(res.ExternalIcon);
                            }
                            else {
                                var icon_1 = [res.ExternalIcon];
                                _this.MapServiceService.setExternalIconList(icon_1);
                            }
                            _this.CustomeSymbols.push(URL_5);
                            setTimeout(function () {
                                _this.UtilityService.SetDefaultIconImagestyle(_this.LayerStyleVisibleList.Size, _this.LayerStyleVisibleList.Transparency, _this.imagesmapsearch360);
                                var iconstyle = document.getElementById('ExIcon');
                                if (iconstyle) {
                                    iconstyle.style.display = "block";
                                }
                            }, 1000);
                        }
                        else {
                            alert(res.errormsg);
                        }
                    }, function (error) {
                        console.log(error);
                    });
                };
                reader.readAsDataURL(input.files[0]);
            }
        }
    };
    MapLayerStylesComponent.prototype.setExternaliconUploaded = function () {
        var Iconlist = this.MapServiceService.ExternalIconList.value;
        if (Iconlist) {
            for (var _i = 0, Iconlist_1 = Iconlist; _i < Iconlist_1.length; _i++) {
                var e = Iconlist_1[_i];
                var URL_6 = this.UtilityService.GetDefaultExternalIcon(e.id);
                if (URL_6 == "") {
                    URL_6 = this.imagesmapsearch360 + "EnvisionAngularUsersIcon/" + e.UploadedBy + "/" + e.Id + e.Extension;
                    this.CustomeSymbols.push(URL_6);
                }
            }
        }
        var iconstyle = document.getElementById('ExIcon');
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
    };
    MapLayerStylesComponent.prototype.RemoveExternalSymbols = function (Customeimgicon) {
        var initialState = {
            UserID: this.AuthenticationService.getLoggedinUserId(),
            IconURL: Customeimgicon
        };
        this.bsModalService.show(delete_externalsymbols_component_1.DeleteExternalsymbolsComponent, { class: 'modal-sm Tool-modal modal-dialog-centered', backdrop: 'static', animated: false, initialState: initialState });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MapLayerStylesComponent.prototype, "Nodedata", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MapLayerStylesComponent.prototype, "Node", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MapLayerStylesComponent.prototype, "ActiveEnergyLayerList", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], MapLayerStylesComponent.prototype, "LayerType", void 0);
    MapLayerStylesComponent = __decorate([
        core_1.Component({
            selector: 'app-map-layer-styles',
            templateUrl: './map-layer-styles.component.html',
            styleUrls: ['./map-layer-styles.component.scss']
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal,
            map_service_service_1.MapServiceService,
            auth_service_1.AuthenticationService,
            message_service_1.MessageService,
            MapLayer_service_1.MapLayerService,
            MapLayer_new_service_1.MapLayernewService,
            google_component_1.GoogleMapPage,
            modal_1.BsModalService,
            private_maplayer_service_1.PrivateMapLayerService,
            Utility_service_1.UtilityService,
            all_http_request_service_1.HttpRequestService,
            my_map_service_1.MyMapService])
    ], MapLayerStylesComponent);
    return MapLayerStylesComponent;
}());
exports.MapLayerStylesComponent = MapLayerStylesComponent;
//# sourceMappingURL=map-layer-styles.component.js.map