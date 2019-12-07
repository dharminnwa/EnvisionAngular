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
var ngx_bootstrap_1 = require("ngx-bootstrap");
var map_service_service_1 = require("../../../../services/map-service.service");
var Utility_service_1 = require("../../../../services/Utility.service");
var environment_1 = require("../../../../../environments/environment");
var draw_tools_service_1 = require("../../../../services/draw-tools.service");
var router_1 = require("@angular/router");
var save_draw_tools_component_1 = require("./save-draw-tools/save-draw-tools.component");
var confirm_draw_tools_component_1 = require("./confirm-draw-tools/confirm-draw-tools.component");
var DrawToolsComponent = (function () {
    function DrawToolsComponent(bsModalRef, mapService, UtilityService, drawingToolService, router, bsModalService) {
        this.bsModalRef = bsModalRef;
        this.mapService = mapService;
        this.UtilityService = UtilityService;
        this.drawingToolService = drawingToolService;
        this.router = router;
        this.bsModalService = bsModalService;
        this.isEditDrawTool = false;
        this.IconsnameList = ["Circle", "Rectangle", "RoundedRectangle", "Rhombus", "TriangleUp", "TriangleDown", "TriangleRight", "TriangleLeft", "Pentagon", "Pentagram", "AsphaltRefinery", "ChemicalPlant", "DehydrationPlant", "DeliveryPoint", "GasProcessingPlant", "IndustrialPlant",
            "LNGTerminal", "LPGFractionator", "Mine", "NaturalGasMarketingHub", "Refinery", "Storage",
            "TruckUnloader", "UndergroundStorage", "Airport", "BullsEye", "CheckeredCircle", "CheckeredSquare",
            "Pointer", "HalfCircle", "HalfSquare", "OilDerrick"];
        this.iconUrl = environment_1.environment.GetLayerIconURL + "/icongenerate/get/?";
        this.IconList = [];
        this.LayerStyleVisibleList = {
            Border: '#8db3e2',
            Color: '#8db3e2',
            Size: 50,
            Thickness: 10,
            Transparency: 0,
            labelSize: '14px'
        };
        this.freehandpolygonStyleIcon = [];
        this.triangleStyleIcon = [];
        this.rectangleStyleIcon = [];
        this.circleStyleIcon = [];
        this.freehandpolylineStyleIcon = [];
        this.polygonStyleIcon = [];
        this.activeDrawtool = 1;
        this.selectedIconIndex = 0;
        this.FreehandPolygonselectedIconIndex = 0;
        this.FreehandPolyLineselectedIconIndex = 0;
        this.PolygonSelectedIconIndex = 0;
        this.TriangleselectedIconIndex = 0;
        this.RectangleselectedIconIndex = 0;
        this.CircleselectedIconIndex = 0;
        this.removedPoints = [];
        this.textlabel = 'Label';
    }
    DrawToolsComponent.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.EditLayerId) {
                _this.LoadEditableLayer();
                _this._EditItemEvents = _this.drawingToolService.selectedEditLayer.subscribe(function (item) {
                    _this.editItem = item;
                    _this.UpdateSelectedItem();
                });
            }
        }, 100);
        this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
        this._routerEvents = this.router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationStart) {
                _this.CloseModal();
            }
        });
        setTimeout(function () {
            var modalDiv = document.getElementsByClassName('drawTools')[0];
            var modalElement = $(modalDiv).parents('.modal');
            $(modalElement).attr('id', 'draw-tools');
            _this.mapService.SetModal('draw-tools');
        }, 100);
        this.Draggable();
        this.SetIcons(true);
        setTimeout(function () {
            _this.FillColorandCorderColor();
        }, 200);
        if (this.drawingToolService.AllDrawingLayerList.getValue() == null)
            this.drawingToolService.AllDrawingLayerList.next([]);
    };
    DrawToolsComponent.prototype.ngOnDestroy = function () {
        if (this._routerEvents)
            this._routerEvents.unsubscribe();
        if (this._EditItemEvents)
            this._EditItemEvents.unsubscribe();
    };
    DrawToolsComponent.prototype.SetIcons = function (isInit) {
        if (isInit === void 0) { isInit = false; }
        var list = [];
        var fillColor = 'FF';
        fillColor += this.LayerStyleVisibleList.Color.replace('#', '');
        var strokeColor = 'FF';
        strokeColor += this.LayerStyleVisibleList.Border.replace('#', '');
        var strokeThicknessPercentage = this.LayerStyleVisibleList.Thickness;
        var sizePercentage = this.LayerStyleVisibleList.Size;
        this.IconList = [];
        for (var i = 0; i < this.IconsnameList.length; i++) {
            var imgURL = this.generateIconUrl(i, this.IconsnameList[i], this.LayerStyleVisibleList.Transparency, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage);
            this.IconList.push(imgURL);
        }
        if (isInit)
            this.drawingToolService.InitPoint(this.selectedIcon);
        if (!this.editItem)
            this.SelectIcon(this.selectedIconIndex);
        else
            this.UpdatePointIcon(this.selectedIconIndex);
    };
    DrawToolsComponent.prototype.Draggable = function () {
        setTimeout(function () {
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
        }, 10);
    };
    DrawToolsComponent.prototype.CloseModal = function () {
        if (this.EditLayerId) {
            var newCheckbox = $('#' + this.EditLayerId + 'LoadlayerinDrawToolData');
            if (newCheckbox) {
                newCheckbox.prop("disabled", false);
                newCheckbox.click();
            }
        }
        this.mapService.isDrawToolsOpened.next(false);
        this.bsModalRef.hide();
        this.drawingToolService.CloseDrawToolsForPoint();
        this.ClearPoints();
        this.drawingToolService.CloseDrawToolsForLine();
        this.drawingToolService.DisableFreehandpolygon();
        this.drawingToolService.DisableFreehandpolyline();
        this.drawingToolService.CloseDrawToolsForPolyLine();
        this.drawingToolService.DisableDrawingModeTriangle();
        this.drawingToolService.CloseDrawToolsForRectangle();
        this.drawingToolService.CloseDrawToolsForCircle();
        this.drawingToolService.CloseDrawToolsForPolygon();
        this.drawingToolService.CloseDrawToolsForLabel();
        this.drawingToolService.AllDrawingLayerList.next([]);
        if (this.isEditDrawTool) {
            this.drawingToolService.RemoveAddedLayer(this.EditLayerId);
            this.drawingToolService.selectedEditLayer.next(null);
            this.drawingToolService.AllLodedLayersOnMap.next(null);
            this.drawingToolService.AllEditedLayerList.next([]);
        }
    };
    DrawToolsComponent.prototype.FillColorandCorderColor = function () {
        var _this = this;
        $('#Fillcolorlayer').colorpicker({
            color: this.LayerStyleVisibleList.Color,
            history: false,
            transparentColor: true,
            defaultPalette: 'theme',
            displayIndicator: false,
            strings: "Theme Colors,Standard Colors,More Colors,Theme Colors,Back to Palette,History,Pas encore d'historique."
        });
        $("#Fillcolorlayer").off("change.color").on("change.color", function (event, color) {
            var colorval = $("#Fillcolorlayer").val();
            _this.LayerStyleVisibleList.Color = colorval;
            _this.LayerStyleChange();
            //this.SetIcons();
            // this.SetcurrentVal(colorval, "Color");
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
        $("#FillBorderlayer").off("change.color").on("change.color", function (event, color) {
            var colorval = $("#FillBorderlayer").val();
            _this.LayerStyleVisibleList.Border = colorval;
            _this.LayerStyleChange();
            //this.SetIcons();
            // $('#title').css('background-color', color);
        });
    };
    DrawToolsComponent.prototype.generateIconUrl = function (id, type, opacity, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage) {
        opacity = 1 - (opacity / 100);
        var iconIdValue = id;
        var iconTypeValue = type;
        var and = "&";
        var iconURL = this.iconUrl;
        var urlType = "CustomStyleIcon";
        if (iconIdValue != undefined) {
            iconURL += "Id=" + iconIdValue + and;
        }
        if (urlType != undefined) {
            iconURL += "URLType=" + urlType + and;
        }
        if (fillColor != undefined) {
            iconURL += "FillColor=" + fillColor + and;
        }
        if (iconTypeValue != undefined) {
            iconURL += "IconType=" + iconTypeValue + and;
        }
        if (strokeColor != undefined) {
            iconURL += "StrokeColor=" + strokeColor + and;
        }
        if (sizePercentage != undefined) {
            iconURL += "SizePercent=" + (parseInt(sizePercentage)) + and;
        }
        if (strokeThicknessPercentage != undefined) {
            iconURL += "StrokeThicknessPercent=" + strokeThicknessPercentage + and;
        }
        if (opacity != undefined) {
            iconURL += "Opacity=" + opacity;
        }
        return iconURL;
    };
    DrawToolsComponent.prototype.SetDrawingTool = function (id) {
        this.activeDrawtool = id;
        this.DisableOtherDrawingTool(id);
        this.EnableDrawingTool(id);
        if (id == 0)
            this.drawingToolService.selectedEditLayer.next(null);
    };
    DrawToolsComponent.prototype.DisableOtherDrawingTool = function (drawingToolId) {
        var pointTool = this.drawingToolService.pointTool.getValue();
        if (pointTool && pointTool.DrawingManagerId && pointTool.DrawingManagerId != drawingToolId)
            this.drawingToolService.DisableDrawingModeforPoint();
        var lineTool = this.drawingToolService.lineTool.getValue();
        if (lineTool && lineTool.DrawingManagerId && lineTool.DrawingManagerId != drawingToolId)
            this.drawingToolService.DisableDrawingModeLine();
        var freehandpolygoneTool = this.drawingToolService.freehandpolygoneTool.getValue();
        if (freehandpolygoneTool && freehandpolygoneTool.DrawingManagerId && freehandpolygoneTool.DrawingManagerId != drawingToolId)
            this.drawingToolService.DisableFreehandpolygon();
        var freehandpolylineTool = this.drawingToolService.freehandpolylineTool.getValue();
        if (freehandpolylineTool && freehandpolylineTool.DrawingManagerId && freehandpolylineTool.DrawingManagerId != drawingToolId)
            this.drawingToolService.DisableFreehandpolyline();
        var polyLineTool = this.drawingToolService.polyLineTool.getValue();
        if (polyLineTool && polyLineTool.DrawingManagerId && polyLineTool.DrawingManagerId != drawingToolId)
            this.drawingToolService.DisableDrawingModeforPolyLine();
        var triangleTool = this.drawingToolService.triangleTool.getValue();
        if (triangleTool && triangleTool.DrawingManagerId && triangleTool.DrawingManagerId != drawingToolId)
            this.drawingToolService.DisableDrawingModeTriangle();
        var rectangleTool = this.drawingToolService.RectangleTool.getValue();
        if (rectangleTool && rectangleTool.DrawingManagerId && rectangleTool.DrawingManagerId != drawingToolId)
            this.drawingToolService.DisableDrawingModeforRectangle();
        var circleTool = this.drawingToolService.CircleTool.getValue();
        if (circleTool && circleTool.DrawingManagerId && circleTool.DrawingManagerId != drawingToolId)
            this.drawingToolService.DisableDrawingModeforCircle();
        var polygonTool = this.drawingToolService.PolygonTool.getValue();
        if (polygonTool && polygonTool.DrawingManagerId && polygonTool.DrawingManagerId != drawingToolId)
            this.drawingToolService.DisableDrawingModeforPolygon();
        var labelTool = this.drawingToolService.LabelTool.getValue();
        if (labelTool && labelTool.DrawingManagerId && labelTool.DrawingManagerId != drawingToolId)
            this.drawingToolService.DisableDrawingModeforLabel();
    };
    DrawToolsComponent.prototype.EnableDrawingTool = function (drawingToolId) {
        var _this = this;
        if (drawingToolId == 1) {
            this.LayerStyleVisibleList.Border = '#8db3e2';
            this.LayerStyleVisibleList.Color = '#8db3e2';
            this.LayerStyleVisibleList.Size = 50;
            this.LayerStyleVisibleList.Thickness = 10;
            this.LayerStyleVisibleList.Transparency = 0;
            this.drawingToolService.InitPoint(this.selectedIcon);
            setTimeout(function () {
                _this.FillColorandCorderColor();
            }, 100);
        }
        else if (drawingToolId == 2) {
            this.LayerStyleVisibleList.Color = '#8db3e2';
            this.LayerStyleVisibleList.Thickness = 15;
            this.LayerStyleVisibleList.Transparency = 0;
            this.InitLineTool();
            if (this.freehandpolylineStyleIcon.length == 0)
                this.CreateFreehandpolylineIcon();
            setTimeout(function () {
                _this.FillColorandCorderColor();
                _this.SelectlineIcon(_this.FreehandPolyLineselectedIconIndex, _this.freehandpolylineStyleIcon[_this.FreehandPolyLineselectedIconIndex]);
            }, 100);
        }
        else if (drawingToolId == 3) {
            this.LayerStyleVisibleList.Color = '#8db3e2';
            this.LayerStyleVisibleList.Thickness = 15;
            this.LayerStyleVisibleList.Transparency = 0;
            var opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
            this.drawingToolService.InitPolyLineTool(this.LayerStyleVisibleList.Color, opacity, this.LayerStyleVisibleList.Thickness);
            if (this.freehandpolylineStyleIcon.length == 0)
                this.CreateFreehandpolylineIcon();
            setTimeout(function () {
                _this.FillColorandCorderColor();
                _this.SelectlineIcon(_this.FreehandPolyLineselectedIconIndex, _this.freehandpolylineStyleIcon[_this.FreehandPolyLineselectedIconIndex]);
            }, 100);
        }
        else if (drawingToolId == 4) {
            this.LayerStyleVisibleList.Color = '#8db3e2';
            this.LayerStyleVisibleList.Thickness = 15;
            this.LayerStyleVisibleList.Transparency = 0;
            if (this.freehandpolylineStyleIcon.length == 0)
                this.CreateFreehandpolylineIcon();
            setTimeout(function () {
                _this.FillColorandCorderColor();
                _this.SelectlineIcon(_this.FreehandPolyLineselectedIconIndex, _this.freehandpolylineStyleIcon[_this.FreehandPolyLineselectedIconIndex]);
                //this.FreehandPolyLineselectedIcon = this.freehandpolylineStyleIcon[this.FreehandPolyLineselectedIconIndex].Icon;
            }, 100);
        }
        else if (drawingToolId == 5) {
            this.LayerStyleVisibleList.Border = '#8db3e2';
            this.LayerStyleVisibleList.Color = '#8db3e2';
            this.LayerStyleVisibleList.Size = 50;
            this.LayerStyleVisibleList.Thickness = 10;
            this.LayerStyleVisibleList.Transparency = 0;
            if (this.triangleStyleIcon.length == 0)
                this.CreateTriangleIcon();
            setTimeout(function () {
                _this.FillColorandCorderColor();
                _this.SelectTriangleIcon(_this.TriangleselectedIconIndex, _this.triangleStyleIcon[_this.TriangleselectedIconIndex]);
            }, 100);
        }
        else if (drawingToolId == 6) {
            this.LayerStyleVisibleList.Border = '#8db3e2';
            this.LayerStyleVisibleList.Color = '#8db3e2';
            this.LayerStyleVisibleList.Size = 50;
            this.LayerStyleVisibleList.Thickness = 10;
            this.LayerStyleVisibleList.Transparency = 0;
            var opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
            this.drawingToolService.InitRectangleTool(this.LayerStyleVisibleList.Color, opacity, this.LayerStyleVisibleList.Thickness);
            if (this.rectangleStyleIcon.length == 0)
                this.CreateRectangleIcon();
            setTimeout(function () {
                _this.FillColorandCorderColor();
                _this.SelectRectangleIcon(_this.RectangleselectedIconIndex, _this.rectangleStyleIcon[_this.RectangleselectedIconIndex]);
            }, 100);
        }
        else if (drawingToolId == 7) {
            this.LayerStyleVisibleList.Border = '#8db3e2';
            this.LayerStyleVisibleList.Color = '#8db3e2';
            this.LayerStyleVisibleList.Size = 50;
            this.LayerStyleVisibleList.Thickness = 10;
            this.LayerStyleVisibleList.Transparency = 0;
            var opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
            this.drawingToolService.InitCircleTool(this.LayerStyleVisibleList.Color, opacity, this.LayerStyleVisibleList.Thickness);
            if (this.circleStyleIcon.length == 0)
                this.CreateCircleIcon();
            setTimeout(function () {
                _this.FillColorandCorderColor();
                _this.SelectCircleIcon(_this.CircleselectedIconIndex, _this.circleStyleIcon[_this.CircleselectedIconIndex]);
            }, 100);
        }
        else if (drawingToolId == 8) {
            this.LayerStyleVisibleList.Border = '#8db3e2';
            this.LayerStyleVisibleList.Color = '#8db3e2';
            this.LayerStyleVisibleList.Size = 70;
            this.LayerStyleVisibleList.Thickness = 35;
            this.LayerStyleVisibleList.Transparency = 0;
            var opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
            this.drawingToolService.InitPolygonTool(this.LayerStyleVisibleList.Color, opacity, this.LayerStyleVisibleList.Thickness);
            if (this.polygonStyleIcon.length == 0)
                this.CreateFreehandpolygonIcon();
            setTimeout(function () {
                _this.FillColorandCorderColor();
                _this.SelectPolygonIcon(_this.PolygonSelectedIconIndex, _this.polygonStyleIcon[_this.PolygonSelectedIconIndex]);
            }, 100);
        }
        else if (drawingToolId == 9) {
            this.LayerStyleVisibleList.Thickness = 5;
            this.LayerStyleVisibleList.Transparency = 50;
            if (this.freehandpolygonStyleIcon.length == 0)
                this.CreateFreehandpolygonIcon();
            setTimeout(function () {
                _this.FillColorandCorderColor();
                _this.SelectFreehandpolygonIcon(_this.FreehandPolygonselectedIconIndex, _this.freehandpolygonStyleIcon[_this.FreehandPolygonselectedIconIndex]);
                //this.FreehandPolygonselectedIcon = this.freehandpolygonStyleIcon[this.FreehandPolygonselectedIconIndex].Icon;
                //this.drawingToolService.InitdrawFreeHand(this.LayerStyleVisibleList);
            }, 100);
        }
        else if (drawingToolId == 10) {
            this.LayerStyleVisibleList.Color = '#8db3e2';
            this.LayerStyleVisibleList.Size = 30;
            this.LayerStyleVisibleList.Transparency = 10;
            this.LayerStyleVisibleList.labelSize = (10 + (this.LayerStyleVisibleList.Size / 5)) + 'px';
            var opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
            this.drawingToolService.InitLabelTool(this.textlabel, this.LayerStyleVisibleList.Color, this.LayerStyleVisibleList.labelSize, opacity);
            setTimeout(function () {
                _this.FillColorandCorderColor();
            }, 100);
        }
    };
    DrawToolsComponent.prototype.SelectIcon = function (index) {
        this.selectedIcon = this.IconList[index];
        this.selectedIconIndex = index;
        if (!this.editItem) {
            var Marker = this.drawingToolService.pointTool.getValue();
            if (Marker) {
                var options = {
                    markerOptions: {
                        icon: { url: this.selectedIcon }
                    }
                };
                Marker.DrawingTool.setOptions(options);
            }
        }
        else {
            this.SetIcons();
        }
    };
    DrawToolsComponent.prototype.UpdatePointIcon = function (index) {
        this.selectedIcon = this.IconList[index];
        this.selectedIconIndex = index;
        if (this.editItem && this.editItem.mapItem) {
            var selectedMarker = this.editItem.mapItem;
            if (selectedMarker && selectedMarker.setIcon) {
                selectedMarker.setIcon({ url: this.selectedIcon });
                this.editItem.savedItem.BackColor = this.LayerStyleVisibleList.Color.replace('#', '#FF');
                this.editItem.savedItem.Color = this.LayerStyleVisibleList.Border.replace('#', '#FF');
                this.editItem.savedItem.StrokeThickness = this.LayerStyleVisibleList.Thickness;
                this.editItem.savedItem.FontSize = this.LayerStyleVisibleList.Size;
                this.editItem.savedItem.SubType = this.IconsnameList[index];
                this.drawingToolService.UpdateEditObj(this.editItem.savedItem, this.editItem.mapItem);
            }
        }
    };
    DrawToolsComponent.prototype.setPolyLineOptions = function () {
        var polylineTool = this.drawingToolService.polyLineTool.getValue();
        if (polylineTool) {
            var options = {
                polylineOptions: {
                    strokeColor: this.LayerStyleVisibleList.Color,
                    strokeOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
                    strokeWeight: this.LayerStyleVisibleList.Thickness / 10
                }
            };
            polylineTool.DrawingTool.setOptions(options);
        }
    };
    DrawToolsComponent.prototype.setRectangleOptions = function () {
        if (!this.editItem) {
            var RectangleTool = this.drawingToolService.RectangleTool.getValue();
            if (RectangleTool) {
                var options = {
                    rectangleOptions: {
                        strokeColor: this.LayerStyleVisibleList.Border,
                        fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
                        strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
                        fillColor: this.LayerStyleVisibleList.Color
                    }
                };
                RectangleTool.DrawingTool.setOptions(options);
            }
        }
        else {
            var RectangleTool = this.editItem.mapItem;
            if (RectangleTool) {
                var options = {
                    strokeColor: this.LayerStyleVisibleList.Border,
                    fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
                    strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
                    fillColor: this.LayerStyleVisibleList.Color
                };
                RectangleTool.setOptions(options);
                this.editItem.savedItem.BackColor = this.LayerStyleVisibleList.Color;
                this.editItem.savedItem.Color = this.LayerStyleVisibleList.Border;
                this.editItem.savedItem.StrokeThickness = this.LayerStyleVisibleList.Thickness / 10;
                this.editItem.savedItem.Opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
                this.drawingToolService.UpdateEditObj(this.editItem.savedItem, this.editItem.mapItem);
            }
        }
        this.RectangleselectedIcon = this.generateIconUrl(this.RectangleselectedIconIndex, "Rectangle", this.LayerStyleVisibleList.Transparency, 'FF' + this.LayerStyleVisibleList.Color.replace('#', '').toUpperCase(), 'FF' + this.LayerStyleVisibleList.Border.replace('#', '').toUpperCase(), this.LayerStyleVisibleList.Thickness, 70);
    };
    DrawToolsComponent.prototype.setCircleOptions = function () {
        if (!this.editItem) {
            var CircleTool = this.drawingToolService.CircleTool.getValue();
            if (CircleTool) {
                var options = {
                    circleOptions: {
                        strokeColor: this.LayerStyleVisibleList.Border,
                        fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
                        strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
                        fillColor: this.LayerStyleVisibleList.Color
                    }
                };
                CircleTool.DrawingTool.setOptions(options);
            }
        }
        else {
            var CircleTool = this.editItem.mapItem;
            if (CircleTool) {
                var options = {
                    strokeColor: this.LayerStyleVisibleList.Border,
                    fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
                    strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
                    fillColor: this.LayerStyleVisibleList.Color
                };
                CircleTool.setOptions(options);
                this.editItem.savedItem.BackColor = this.LayerStyleVisibleList.Color;
                this.editItem.savedItem.Color = this.LayerStyleVisibleList.Border;
                this.editItem.savedItem.StrokeThickness = this.LayerStyleVisibleList.Thickness / 10;
                this.editItem.savedItem.Opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
                this.drawingToolService.UpdateEditObj(this.editItem.savedItem, this.editItem.mapItem);
            }
        }
        this.CircleselectedIcon = this.generateIconUrl(this.CircleselectedIconIndex, "Circle", this.LayerStyleVisibleList.Transparency, 'FF' + this.LayerStyleVisibleList.Color.replace('#', '').toUpperCase(), 'FF' + this.LayerStyleVisibleList.Border.replace('#', '').toUpperCase(), this.LayerStyleVisibleList.Thickness, 70);
    };
    DrawToolsComponent.prototype.setPolygonOptions = function () {
        if (!this.editItem) {
            var PolygonTool = this.drawingToolService.PolygonTool.getValue();
            if (PolygonTool) {
                var options = {
                    polygonOptions: {
                        strokeColor: this.LayerStyleVisibleList.Border,
                        fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
                        strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
                        fillColor: this.LayerStyleVisibleList.Color
                    }
                };
                PolygonTool.DrawingTool.setOptions(options);
            }
        }
        else {
            var PolygonTool = this.editItem.mapItem;
            if (PolygonTool) {
                var options = {
                    strokeColor: this.LayerStyleVisibleList.Border,
                    fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
                    strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
                    fillColor: this.LayerStyleVisibleList.Color
                };
                PolygonTool.setOptions(options);
                this.editItem.savedItem.BackColor = this.LayerStyleVisibleList.Color;
                this.editItem.savedItem.Color = this.LayerStyleVisibleList.Border;
                this.editItem.savedItem.StrokeThickness = this.LayerStyleVisibleList.Thickness / 10;
                this.editItem.savedItem.Opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
                this.drawingToolService.UpdateEditObj(this.editItem.savedItem, this.editItem.mapItem);
            }
        }
        this.PolygonselectedIcon = this.generateIconUrl(this.PolygonSelectedIconIndex, "Pentagon", this.LayerStyleVisibleList.Transparency, 'FF' + this.LayerStyleVisibleList.Color.replace('#', '').toUpperCase(), 'FF' + this.LayerStyleVisibleList.Border.replace('#', '').toUpperCase(), this.LayerStyleVisibleList.Thickness / 10, 100);
    };
    DrawToolsComponent.prototype.setLabelOptions = function () {
        this.LayerStyleVisibleList.labelSize = (10 + (this.LayerStyleVisibleList.Size / 5)) + 'px';
        if (!this.editItem) {
            var LabelTool = this.drawingToolService.LabelTool.getValue();
            var opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
            if (LabelTool) {
                var options = {
                    markerOptions: {
                        opacity: opacity,
                        icon: 'https://node.envisionmaps.net/Images/transparent.png',
                        label: { color: this.LayerStyleVisibleList.Color, fontSize: this.LayerStyleVisibleList.labelSize, text: this.textlabel }
                    }
                };
                LabelTool.DrawingTool.setOptions(options);
            }
        }
        else {
            var Label = this.editItem.mapItem;
            var opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
            if (Label) {
                var options = {
                    opacity: opacity,
                    label: { color: this.LayerStyleVisibleList.Color, fontSize: this.LayerStyleVisibleList.labelSize, text: this.textlabel }
                };
                Label.setOptions(options);
                this.editItem.savedItem.Color = this.LayerStyleVisibleList.Color;
                this.editItem.savedItem.FontSize = (10 + (this.LayerStyleVisibleList.Size / 5));
                this.editItem.savedItem.Opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
                this.editItem.savedItem.Name = this.textlabel;
                this.drawingToolService.UpdateEditObj(this.editItem.savedItem, this.editItem.mapItem);
            }
        }
    };
    DrawToolsComponent.prototype.UndoPoint = function () {
        var AllDrawingLayerList = this.drawingToolService.AllDrawingLayerList.getValue();
        if (AllDrawingLayerList.length > 0) {
            AllDrawingLayerList[AllDrawingLayerList.length - 1].DrawingItem.setMap(null);
            AllDrawingLayerList.splice(AllDrawingLayerList.length - 1, 1);
        }
    };
    DrawToolsComponent.prototype.ClearPoints = function () {
        var AllDrawingLayerList = this.drawingToolService.AllDrawingLayerList.getValue();
        if (AllDrawingLayerList.length > 0) {
            AllDrawingLayerList.forEach(function (x) {
                x.DrawingItem.setMap(null);
            });
        }
        this.drawingToolService.AllDrawingLayerList.getValue().length = 0;
    };
    DrawToolsComponent.prototype.ChangeLineDrawSettings = function () {
        if (!this.editItem) {
            this.drawingToolService.DisableDrawingModeLine();
            this.InitLineTool();
        }
        else {
            var polylineTool = this.editItem.mapItem;
            if (polylineTool) {
                var options = {
                    strokeColor: this.LayerStyleVisibleList.Color,
                    strokeOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
                    strokeWeight: this.LayerStyleVisibleList.Thickness / 10
                };
                polylineTool.setOptions(options);
                this.editItem.savedItem.BackColor = this.LayerStyleVisibleList.Color;
                this.editItem.savedItem.StrokeThickness = this.LayerStyleVisibleList.Thickness / 10;
                this.editItem.savedItem.Opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
                this.drawingToolService.UpdateEditObj(this.editItem.savedItem, this.editItem.mapItem);
            }
        }
    };
    DrawToolsComponent.prototype.ChangeTriangleSettings = function () {
        this.drawingToolService.DisableDrawingModeTriangle();
        var opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
        var borderWidth = this.LayerStyleVisibleList.Thickness / 10;
        var color = "FF" + this.LayerStyleVisibleList.Color.replace('#', '').toUpperCase();
        var borderColor = "FF" + this.LayerStyleVisibleList.Border.replace('#', '').toUpperCase();
        this.TriangleselectedIcon = this.generateIconUrl(this.TriangleselectedIconIndex, "TriangleUp", this.LayerStyleVisibleList.Transparency, color, borderColor, 25, 100);
        this.drawingToolService.InitTriangle(this.LayerStyleVisibleList.Color, this.LayerStyleVisibleList.Border, borderWidth, opacity);
    };
    DrawToolsComponent.prototype.InitLineTool = function () {
        var opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
        var borderWidth = this.LayerStyleVisibleList.Thickness / 10;
        this.drawingToolService.InitLine(this.LayerStyleVisibleList.Color, borderWidth, opacity);
    };
    DrawToolsComponent.prototype.LayerStyleChange = function () {
        switch (this.activeDrawtool) {
            case 1:
                this.SetIcons();
                break;
            case 2:
                this.ChangeLineDrawSettings();
                break;
            case 3:
                this.setPolyLineOptions();
                break;
            case 4:
                this.drawingToolService.DisableFreehandpolyline();
                this.drawingToolService.InitdrawFreeHandpolyline(this.LayerStyleVisibleList);
                break;
            case 5:
                this.ChangeTriangleSettings();
                break;
            case 6:
                this.setRectangleOptions();
                break;
            case 7:
                this.setCircleOptions();
                break;
            case 8:
                this.setPolygonOptions();
                break;
            case 9:
                this.drawingToolService.DisableFreehandpolygon();
                this.drawingToolService.InitdrawFreeHand(this.LayerStyleVisibleList);
                this.FreehandPolygonselectedIcon = this.generateIconUrl(this.PolygonSelectedIconIndex, "Pentagon", this.LayerStyleVisibleList.Transparency, 'FF' + this.LayerStyleVisibleList.Color.replace('#', '').toUpperCase(), 'FF' + this.LayerStyleVisibleList.Border.replace('#', '').toUpperCase(), this.LayerStyleVisibleList.Thickness / 10, 100);
                break;
            case 10:
                this.setLabelOptions();
                break;
        }
    };
    DrawToolsComponent.prototype.CreateFreehandpolygonIcon = function () {
        for (var i = 0; i < 53; i++) {
            var color = this.UtilityService.getRandomColor();
            var freehabdpolineStyle = {
                Color: color,
                Border: color,
                Size: 100,
                Thickness: 35,
                Transparency: 50,
                Icon: ""
            };
            if (i < 10) {
                freehabdpolineStyle.Transparency = 50;
            }
            else if (i < 20 && i > 10) {
                freehabdpolineStyle.Transparency = 75;
            }
            else if (i < 30 && i > 20) {
                freehabdpolineStyle.Transparency = 50;
            }
            else if (i < 40 && i > 30) {
                freehabdpolineStyle.Transparency = 75;
            }
            else if (i < 50 && i > 40) {
                freehabdpolineStyle.Transparency = 50;
            }
            freehabdpolineStyle.Icon = this.generateIconUrl(i, "Pentagon", freehabdpolineStyle.Transparency, "FF" + freehabdpolineStyle.Color, "FF" + freehabdpolineStyle.Border, freehabdpolineStyle.Thickness / 10, freehabdpolineStyle.Size);
            this.freehandpolygonStyleIcon.push(freehabdpolineStyle);
            this.polygonStyleIcon.push(freehabdpolineStyle);
        }
    };
    DrawToolsComponent.prototype.CreateTriangleIcon = function () {
        for (var i = 0; i < 53; i++) {
            var color = this.UtilityService.getRandomColor();
            var freehabdpolineStyle = {
                Color: color,
                Border: color,
                Size: 100,
                Thickness: 25,
                Transparency: 10,
                Icon: ""
            };
            if (i < 10) {
                freehabdpolineStyle.Transparency = 50;
            }
            else if (i < 20 && i > 10) {
                freehabdpolineStyle.Transparency = 25;
            }
            else if (i < 30 && i > 20) {
                freehabdpolineStyle.Transparency = 50;
            }
            else if (i < 40 && i > 30) {
                freehabdpolineStyle.Transparency = 25;
            }
            else if (i < 50 && i > 40) {
                freehabdpolineStyle.Transparency = 50;
            }
            freehabdpolineStyle.Icon = this.generateIconUrl(i, "TriangleUp", freehabdpolineStyle.Transparency, "FF" + freehabdpolineStyle.Color, "FF" + freehabdpolineStyle.Border, 25, freehabdpolineStyle.Size);
            this.triangleStyleIcon.push(freehabdpolineStyle);
        }
        // this.SelectTriangleIcon(this.TriangleselectedIconIndex, this.triangleStyleIcon[this.TriangleselectedIconIndex]);
    };
    DrawToolsComponent.prototype.CreateRectangleIcon = function () {
        for (var i = 0; i < 53; i++) {
            var color = this.UtilityService.getRandomColor();
            var rectangleStyle = {
                Color: color,
                Border: color,
                Size: 70,
                Thickness: 25,
                Transparency: 10,
                Icon: ""
            };
            if (i < 10) {
                rectangleStyle.Transparency = 50;
            }
            else if (i < 20 && i > 10) {
                rectangleStyle.Transparency = 25;
            }
            else if (i < 30 && i > 20) {
                rectangleStyle.Transparency = 50;
            }
            else if (i < 40 && i > 30) {
                rectangleStyle.Transparency = 25;
            }
            else if (i < 50 && i > 40) {
                rectangleStyle.Transparency = 50;
            }
            rectangleStyle.Icon = this.generateIconUrl(i, "Rectangle", rectangleStyle.Transparency, "FF" + rectangleStyle.Color, "FF" + rectangleStyle.Border, rectangleStyle.Thickness, rectangleStyle.Size);
            this.rectangleStyleIcon.push(rectangleStyle);
        }
        // this.SelectRectangleIcon(this.RectangleselectedIconIndex, this.rectangleStyleIcon[this.RectangleselectedIconIndex]);
    };
    DrawToolsComponent.prototype.CreateCircleIcon = function () {
        for (var i = 0; i < 53; i++) {
            var color = this.UtilityService.getRandomColor();
            var circleStyle = {
                Color: color,
                Border: color,
                Size: 70,
                Thickness: 25,
                Transparency: 10,
                Icon: ""
            };
            if (i < 10) {
                circleStyle.Transparency = 50;
            }
            else if (i < 20 && i > 10) {
                circleStyle.Transparency = 25;
            }
            else if (i < 30 && i > 20) {
                circleStyle.Transparency = 50;
            }
            else if (i < 40 && i > 30) {
                circleStyle.Transparency = 25;
            }
            else if (i < 50 && i > 40) {
                circleStyle.Transparency = 50;
            }
            circleStyle.Icon = this.generateIconUrl(i, "Circle", circleStyle.Transparency, "FF" + circleStyle.Color, "FF" + circleStyle.Border, circleStyle.Thickness, circleStyle.Size);
            this.circleStyleIcon.push(circleStyle);
        }
    };
    DrawToolsComponent.prototype.CreateFreehandpolylineIcon = function () {
        for (var i = 0; i < 53; i++) {
            var color = this.UtilityService.getRandomColor();
            var freehabdpolineStyle = {
                Color: color,
                Border: color,
                Size: 100,
                Thickness: 5,
                Transparency: 50,
                Icon: ""
            };
            if (i <= 10) {
                freehabdpolineStyle.Transparency = 0;
                freehabdpolineStyle.Thickness = 25;
            }
            else if (i <= 20 && i > 10) {
                freehabdpolineStyle.Transparency = 5;
                freehabdpolineStyle.Thickness = 35;
            }
            else if (i <= 30 && i > 20) {
                freehabdpolineStyle.Transparency = 10;
                freehabdpolineStyle.Thickness = 55;
            }
            else if (i <= 40 && i > 30) {
                freehabdpolineStyle.Transparency = 15;
                freehabdpolineStyle.Thickness = 75;
            }
            else if (i <= 53 && i > 40) {
                freehabdpolineStyle.Transparency = 20;
                freehabdpolineStyle.Thickness = 90;
            }
            freehabdpolineStyle.Icon = this.generateIconUrl(i, "Line", freehabdpolineStyle.Transparency, "FF" + freehabdpolineStyle.Color, "FF" + freehabdpolineStyle.Border, freehabdpolineStyle.Thickness, freehabdpolineStyle.Size);
            this.freehandpolylineStyleIcon.push(freehabdpolineStyle);
        }
    };
    DrawToolsComponent.prototype.SelectFreehandpolygonIcon = function (index, objicon) {
        this.FreehandPolygonselectedIcon = this.freehandpolygonStyleIcon[index].Icon;
        this.FreehandPolygonselectedIconIndex = index;
        this.LayerStyleVisibleList.Border = objicon.Border;
        this.LayerStyleVisibleList.Thickness = objicon.Thickness;
        this.LayerStyleVisibleList.Color = objicon.Color;
        $("#Fillcolorlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Color.replace('#', ''));
        $("#FillBorderlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Border.replace('#', ''));
        this.LayerStyleVisibleList.Thickness = objicon.Thickness;
        this.LayerStyleVisibleList.Transparency = objicon.Transparency;
    };
    DrawToolsComponent.prototype.SelectTriangleIcon = function (index, objicon) {
        this.TriangleselectedIcon = this.triangleStyleIcon[index].Icon;
        this.TriangleselectedIconIndex = index;
        this.LayerStyleVisibleList.Border = objicon.Border;
        this.LayerStyleVisibleList.Color = objicon.Color;
        this.LayerStyleVisibleList.Thickness = objicon.Thickness;
        this.LayerStyleVisibleList.Transparency = objicon.Transparency;
        $("#Fillcolorlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Color.replace('#', ''));
        $("#FillBorderlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Border.replace('#', ''));
    };
    DrawToolsComponent.prototype.SelectRectangleIcon = function (index, objicon) {
        this.RectangleselectedIcon = this.rectangleStyleIcon[index].Icon;
        this.RectangleselectedIconIndex = index;
        this.LayerStyleVisibleList.Border = objicon.Border;
        this.LayerStyleVisibleList.Color = objicon.Color;
        this.LayerStyleVisibleList.Thickness = objicon.Thickness;
        this.LayerStyleVisibleList.Transparency = objicon.Transparency;
        $("#Fillcolorlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Color.replace('#', ''));
        $("#FillBorderlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Border.replace('#', ''));
    };
    DrawToolsComponent.prototype.SelectCircleIcon = function (index, objicon) {
        this.CircleselectedIcon = this.circleStyleIcon[index].Icon;
        this.CircleselectedIconIndex = index;
        this.LayerStyleVisibleList.Border = objicon.Border;
        this.LayerStyleVisibleList.Color = objicon.Color;
        this.LayerStyleVisibleList.Thickness = objicon.Thickness;
        this.LayerStyleVisibleList.Transparency = objicon.Transparency;
        $("#Fillcolorlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Color.replace('#', ''));
        $("#FillBorderlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Border.replace('#', ''));
    };
    DrawToolsComponent.prototype.SelectPolygonIcon = function (index, objicon) {
        this.PolygonselectedIcon = this.polygonStyleIcon[index].Icon;
        this.PolygonSelectedIconIndex = index;
        this.LayerStyleVisibleList.Border = objicon.Border;
        this.LayerStyleVisibleList.Color = objicon.Color;
        this.LayerStyleVisibleList.Thickness = objicon.Thickness;
        this.LayerStyleVisibleList.Transparency = objicon.Transparency;
        $("#Fillcolorlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Color.replace('#', ''));
        $("#FillBorderlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Border.replace('#', ''));
    };
    DrawToolsComponent.prototype.SelectlineIcon = function (index, objicon) {
        this.FreehandPolyLineselectedIcon = this.freehandpolylineStyleIcon[index].Icon;
        this.FreehandPolyLineselectedIconIndex = index;
        this.LayerStyleVisibleList.Border = objicon.Border;
        this.LayerStyleVisibleList.Color = objicon.Color;
        $("#Fillcolorlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Color.replace('#', ''));
        this.LayerStyleVisibleList.Thickness = objicon.Thickness;
        this.LayerStyleVisibleList.Transparency = objicon.Transparency;
        if (this.activeDrawtool == 2) {
            this.ChangeLineDrawSettings();
        }
        else if (this.activeDrawtool == 3) {
            this.setPolyLineOptions();
        }
    };
    DrawToolsComponent.prototype.SaveTools = function () {
        var _this = this;
        var config = { class: 'modal-sm modal-dialog-centered', backdrop: 'static', animated: false };
        var bsModalRef = this.bsModalService.show(save_draw_tools_component_1.SaveDrawToolsComponent, config);
        bsModalRef.content.isSaved.take(1).subscribe(function (value) {
            if (value == true)
                _this.CloseModal();
        });
    };
    DrawToolsComponent.prototype.OpenConfirmModal = function () {
        // if(this.EditLayerId) {
        var _this = this;
        // let bsModalRef = this.bsModalService.show(SaveDrawToolsComponent, config);
        // bsModalRef.content.isSaved.take(1).subscribe((value) => {
        //   if (value == true)
        //     this.CloseModal();
        // });
        // bsModalRef.content.EditLayerId = this.EditLayerId;
        // } else
        if (this.drawingToolService.AllDrawingLayerList.getValue().length == 0 && !this.EditLayerId) {
            this.CloseModal();
            return;
        }
        var config = { class: 'modal-sm modal-dialog-centered', backdrop: 'static', animated: false };
        var bsModalRef = this.bsModalService.show(confirm_draw_tools_component_1.ConfirmDrawToolsComponent, config);
        bsModalRef.content.close.take(1).subscribe(function (value) {
            if (value == true)
                _this.CloseModal();
        });
        if (this.EditLayerId)
            bsModalRef.content.EditLayerId = this.EditLayerId;
    };
    DrawToolsComponent.prototype.LoadEditableLayer = function () {
        this.isEditDrawTool = true;
        this.drawingToolService.DisableDrawingModeforPoint();
        this.activeDrawtool = 0;
        this.drawingToolService.AddDrawingLayer(this.EditLayerId, true);
    };
    DrawToolsComponent.prototype.UpdateSelectedItem = function () {
        if (!this.editItem)
            return;
        this.DisableOtherDrawingTool(0);
        if (this.editItem.savedItem.ShapeType == 'Point')
            this.LoadEditForPoint();
        else if (this.editItem.savedItem.ShapeType == 'Line')
            this.LoadEditForLine();
        else if (this.editItem.savedItem.ShapeType == 'Rectangle')
            this.LoadEditForRectangle();
        else if (this.editItem.savedItem.ShapeType == 'Circle')
            this.LoadEditForCircle();
        else if (this.editItem.savedItem.ShapeType == 'Polygon' || this.editItem.savedItem.ShapeType == 'Triangle')
            this.LoadEditForPolygon();
        else if (this.editItem.savedItem.ShapeType == 'Label')
            this.LoadEditForLabel();
    };
    DrawToolsComponent.prototype.LoadEditForPoint = function () {
        var _this = this;
        this.activeDrawtool = 1;
        this.LayerStyleVisibleList.Border = this.editItem.savedItem.Color.replace('#FF', '#');
        this.LayerStyleVisibleList.Color = this.editItem.savedItem.BackColor.replace('#FF', '#');
        this.LayerStyleVisibleList.Size = this.editItem.savedItem.FontSize;
        this.LayerStyleVisibleList.Thickness = this.editItem.savedItem.StrokeThickness;
        this.LayerStyleVisibleList.Transparency = 100 - (this.editItem.savedItem.Opacity * 100);
        var index = this.IconsnameList.findIndex(function (x) { return x == _this.editItem.savedItem.SubType; });
        if (index > -1)
            this.selectedIconIndex = index;
        this.SetIcons();
        setTimeout(function () {
            _this.FillColorandCorderColor();
        }, 100);
    };
    DrawToolsComponent.prototype.LoadEditForLine = function () {
        var _this = this;
        this.activeDrawtool = 2;
        this.LayerStyleVisibleList.Color = this.editItem.savedItem.BackColor;
        this.LayerStyleVisibleList.Thickness = this.editItem.savedItem.StrokeThickness * 10;
        this.LayerStyleVisibleList.Transparency = 100 - (this.editItem.savedItem.Opacity * 100);
        if (this.freehandpolylineStyleIcon.length == 0)
            this.CreateFreehandpolylineIcon();
        setTimeout(function () {
            _this.FillColorandCorderColor();
        }, 100);
    };
    DrawToolsComponent.prototype.LoadEditForRectangle = function () {
        var _this = this;
        this.activeDrawtool = 6;
        this.LayerStyleVisibleList.Border = this.editItem.savedItem.Color;
        this.LayerStyleVisibleList.Color = this.editItem.savedItem.BackColor;
        this.LayerStyleVisibleList.Thickness = this.editItem.savedItem.StrokeThickness * 10;
        this.LayerStyleVisibleList.Transparency = 100 - (this.editItem.savedItem.Opacity * 100);
        if (this.rectangleStyleIcon.length == 0)
            this.CreateRectangleIcon();
        setTimeout(function () {
            _this.FillColorandCorderColor();
        }, 100);
    };
    DrawToolsComponent.prototype.LoadEditForCircle = function () {
        var _this = this;
        this.activeDrawtool = 7;
        this.LayerStyleVisibleList.Border = this.editItem.savedItem.Color;
        this.LayerStyleVisibleList.Color = this.editItem.savedItem.BackColor;
        this.LayerStyleVisibleList.Thickness = this.editItem.savedItem.StrokeThickness * 10;
        this.LayerStyleVisibleList.Transparency = 100 - (this.editItem.savedItem.Opacity * 100);
        if (this.circleStyleIcon.length == 0)
            this.CreateCircleIcon();
        setTimeout(function () {
            _this.FillColorandCorderColor();
        }, 100);
    };
    DrawToolsComponent.prototype.LoadEditForPolygon = function () {
        var _this = this;
        this.activeDrawtool = 8;
        this.LayerStyleVisibleList.Border = this.editItem.savedItem.Color;
        this.LayerStyleVisibleList.Color = this.editItem.savedItem.BackColor;
        this.LayerStyleVisibleList.Thickness = this.editItem.savedItem.StrokeThickness * 10;
        this.LayerStyleVisibleList.Transparency = 100 - (this.editItem.savedItem.Opacity * 100);
        if (this.freehandpolygonStyleIcon.length == 0)
            this.CreateFreehandpolygonIcon();
        setTimeout(function () {
            _this.FillColorandCorderColor();
        }, 100);
    };
    DrawToolsComponent.prototype.LoadEditForLabel = function () {
        var _this = this;
        this.activeDrawtool = 10;
        this.LayerStyleVisibleList.Color = this.editItem.savedItem.Color;
        this.LayerStyleVisibleList.Size = this.editItem.savedItem.FontSize;
        this.LayerStyleVisibleList.Transparency = 100 - (this.editItem.savedItem.Opacity * 100);
        this.LayerStyleVisibleList.labelSize = this.editItem.savedItem.FontSize + 'px';
        this.LayerStyleVisibleList.Size = (this.editItem.savedItem.FontSize - 10) * 5;
        this.textlabel = this.editItem.savedItem.Name;
        setTimeout(function () {
            _this.FillColorandCorderColor();
        }, 100);
    };
    DrawToolsComponent.prototype.DeleteSelectedTool = function () {
        if (this.editItem && this.editItem.savedItem) {
            this.editItem.savedItem['IsDeleted'] = 1;
            this.editItem.mapItem.setMap(null);
            this.drawingToolService.UpdateEditObj(this.editItem.savedItem, this.editItem.mapItem);
            this.drawingToolService.selectedEditLayer.next(null);
        }
    };
    DrawToolsComponent.prototype.UpdateTools = function () {
        var _this = this;
        var config = { class: 'modal-sm modal-dialog-centered', backdrop: 'static', animated: false };
        var bsModalRef = this.bsModalService.show(save_draw_tools_component_1.SaveDrawToolsComponent, config);
        bsModalRef.content.isSaved.take(1).subscribe(function (value) {
            if (value == true)
                _this.CloseModal();
        });
        bsModalRef.content.EditLayerId = this.EditLayerId;
    };
    DrawToolsComponent = __decorate([
        core_1.Component({
            selector: 'app-draw-tools',
            templateUrl: './draw-tools.component.html',
            styleUrls: ['./draw-tools.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            map_service_service_1.MapServiceService,
            Utility_service_1.UtilityService,
            draw_tools_service_1.DrawingToolService,
            router_1.Router,
            ngx_bootstrap_1.BsModalService])
    ], DrawToolsComponent);
    return DrawToolsComponent;
}());
exports.DrawToolsComponent = DrawToolsComponent;
//# sourceMappingURL=draw-tools.component.js.map