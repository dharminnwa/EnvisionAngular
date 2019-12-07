import { Component, OnInit } from '@angular/core';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap';
import { MapServiceService } from '../../../../services/map-service.service';
import { UtilityService } from '../../../../services/Utility.service';
import { environment } from '../../../../../environments/environment';
import { DrawingToolService } from '../../../../services/draw-tools.service';
import { Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { SaveDrawToolsComponent } from './save-draw-tools/save-draw-tools.component';
import { ConfirmDrawToolsComponent } from './confirm-draw-tools/confirm-draw-tools.component';
declare var $: any;
declare var google: any;

@Component({
  selector: 'app-draw-tools',
  templateUrl: './draw-tools.component.html',
  styleUrls: ['./draw-tools.component.scss']
})
export class DrawToolsComponent implements OnInit {
  public EditLayerId;
  isEditDrawTool: boolean = false;
  private IconsnameList = ["Circle", "Rectangle", "RoundedRectangle", "Rhombus", "TriangleUp", "TriangleDown", "TriangleRight", "TriangleLeft", "Pentagon", "Pentagram", "AsphaltRefinery", "ChemicalPlant", "DehydrationPlant", "DeliveryPoint", "GasProcessingPlant", "IndustrialPlant"
    , "LNGTerminal", "LPGFractionator", "Mine", "NaturalGasMarketingHub", "Refinery", "Storage"
    , "TruckUnloader", "UndergroundStorage", "Airport", "BullsEye", "CheckeredCircle", "CheckeredSquare"
    , "Pointer", "HalfCircle", "HalfSquare", "OilDerrick"];
  iconUrl = environment.GetLayerIconURL + "/icongenerate/get/?";
  IconList: any[] = [];
  public LayerStyleVisibleList = {
    Border: '#8db3e2',
    Color: '#8db3e2',
    Size: 50,
    Thickness: 10,
    Transparency: 0,
    labelSize: '14px'
  }
  public freehandpolygonStyleIcon: any = [];
  public triangleStyleIcon: any[] = [];
  public leftarrowStyleIcon: any[] = [];
  public rightarrowStyleIcon: any[] = [];
  public uparrowStyleIcon: any[] = [];
  public downarrowStyleIcon: any[] = [];
  public rectangleStyleIcon: any[] = [];
  public circleStyleIcon: any = [];
  public freehandpolylineStyleIcon: any = [];
  public polygonStyleIcon: any = [];
  activeDrawtool: number = 1;
  selectedIcon: string;
  selectedIconIndex: number = 0;
  FreehandPolygonselectedIcon: string;
  FreehandPolygonselectedIconIndex: number = 0;
  FreehandPolyLineselectedIcon: string;
  FreehandPolyLineselectedIconIndex: number = 0;
  PolygonselectedIcon: string;
  PolygonSelectedIconIndex: number = 0;

  TriangleselectedIcon: string;
  LeftarrowselectedIcon: string;
  RighttarrowselectedIcon: string;
  UparrowselectedIcon: string;
  DownarrowselectedIcon: string;
  TriangleselectedIconIndex: number = 0;
  LeftarrowselectedIconIndex: number = 0;
  RightarrowselectedIconIndex: number = 0;
  UparrowselectedIconIndex: number = 0;
  DownarrowselectedIconIndex: number = 0;
  RectangleselectedIcon: string;
  RectangleselectedIconIndex: number = 0;
  CircleselectedIcon: string;
  CircleselectedIconIndex: number = 0;
  removedPoints: any[] = [];
  textlabel: string = 'Label';
  editItem: any;

  _routerEvents: Subscription;
  _EditItemEvents: Subscription;
  _NewAddedItemEvent: Subscription;
  constructor(public bsModalRef: BsModalRef,
    private mapService: MapServiceService,
    private UtilityService: UtilityService,
    public drawingToolService: DrawingToolService,
    private router: Router,
    private bsModalService: BsModalService) { }

  ngOnInit() {
    setTimeout(() => {
      if (this.EditLayerId) {
        this.LoadEditableLayer();
        this._EditItemEvents = this.drawingToolService.selectedEditLayer.subscribe(item => {
          this.editItem = item;
          this.UpdateSelectedItem();
        })
      }
    }, 100);

    this._NewAddedItemEvent = this.drawingToolService.currentlySelectedIcon.subscribe(item => {

      if (item)

        this.UpdateItemForNewItem(item);
    });
    this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
    this._routerEvents = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.CloseModal();
      }
    });
    setTimeout(() => {
      var modalDiv = document.getElementsByClassName('drawTools')[0];
      var modalElement = $(modalDiv).parents('.modal');
      $(modalElement).attr('id', 'draw-tools');
      this.mapService.SetModal('draw-tools');
    }, 100);
    this.Draggable();
    this.SetIcons(true);
    setTimeout(() => {
      this.FillColorandCorderColor();
    }, 200);
    if (this.drawingToolService.AllDrawingLayerList.getValue() == null)
      this.drawingToolService.AllDrawingLayerList.next([]);
  }

  ngOnDestroy() {
    if (this._routerEvents)
      this._routerEvents.unsubscribe();
    if (this._EditItemEvents)
      this._EditItemEvents.unsubscribe();
    if (this._NewAddedItemEvent)
      this._NewAddedItemEvent.unsubscribe();
  }

  UpdateItemForNewItem(item) {
    if (item) {
      // if (item.DrawingManagerId > 0) {
      //   this.activeDrawtool = item.DrawingManagerId;
      //   this.editItem = item.layer;
      //   setTimeout(() => { this.FillColorandCorderColor(); }, 100);
      // }
      if (item.DrawingManagerId == 1) {
        this.activeDrawtool = 1;
        this.editItem = item.layer;
        setTimeout(() => { this.FillColorandCorderColor(); }, 100);
      }
      else if (item.DrawingManagerId == 2) {
        this.activeDrawtool = 2;
        this.editItem = item.layer;
        setTimeout(() => { this.FillColorandCorderColor(); }, 100);
      }
      else if (item.DrawingManagerId == 3) {
        this.activeDrawtool = 3;
        this.editItem = item.layer;
        setTimeout(() => { this.FillColorandCorderColor(); }, 100);
      }
      else if (item.DrawingManagerId == 4) {
        this.activeDrawtool = 4;
        this.editItem = item.layer;
        setTimeout(() => { this.FillColorandCorderColor(); }, 100);
      }
      else if (item.DrawingManagerId == 5) {
        this.activeDrawtool = 5;
        this.editItem = item.layer;
        setTimeout(() => { this.FillColorandCorderColor(); }, 100);
      }
      else if (item.DrawingManagerId == 6) {
        this.activeDrawtool = 6;
        this.editItem = item.layer;
        setTimeout(() => { this.FillColorandCorderColor(); }, 100);
      }
      else if (item.DrawingManagerId == 7) {
        this.activeDrawtool = 7;
        this.editItem = item.layer;
        setTimeout(() => { this.FillColorandCorderColor(); }, 100);
      }
      else if (item.DrawingManagerId == 8) {
        this.activeDrawtool = 8;
        this.editItem = item.layer;
        setTimeout(() => { this.FillColorandCorderColor(); }, 100);
      }
      else if (item.DrawingManagerId == 9) {
        this.activeDrawtool = 9;
        this.editItem = item.layer;
        setTimeout(() => { this.FillColorandCorderColor(); }, 100);
      }
      else if (item.DrawingManagerId == 10) {
        this.activeDrawtool = 10;
        this.editItem = item.layer;
        setTimeout(() => { this.FillColorandCorderColor(); }, 100);
      }
      else if (item.DrawingManagerId == 11) {
        this.activeDrawtool = 11;
        this.editItem = item.layer;
        setTimeout(() => { this.FillColorandCorderColor(); }, 100);
      }
      else if (item.DrawingManagerId == 12) {
        this.activeDrawtool = 12;
        this.editItem = item.layer;
        setTimeout(() => { this.FillColorandCorderColor(); }, 100);
      }
      else if (item.DrawingManagerId == 13) {
        this.activeDrawtool = 13;
        this.editItem = item.layer;
        setTimeout(() => { this.FillColorandCorderColor(); }, 100);
      }
      else if (item.DrawingManagerId == 14) {
        this.activeDrawtool = 14;
        this.editItem = item.layer;
        setTimeout(() => { this.FillColorandCorderColor(); }, 100);
      }
    }
  }

  SetIcons(isInit: boolean = false) {

    let list = [];
    let fillColor = 'FF';
    fillColor += this.LayerStyleVisibleList.Color.replace('#', '');
    let strokeColor = 'FF';
    strokeColor += this.LayerStyleVisibleList.Border.replace('#', '');
    let strokeThicknessPercentage = this.LayerStyleVisibleList.Thickness;
    let sizePercentage = this.LayerStyleVisibleList.Size;
    this.IconList = [];
    for (let i = 0; i < this.IconsnameList.length; i++) {
      let imgURL = this.generateIconUrl(i, this.IconsnameList[i], this.LayerStyleVisibleList.Transparency, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage);
      this.IconList.push(imgURL);
    }
    if (isInit)
      this.drawingToolService.InitPoint(this.selectedIcon);
    if (!this.editItem) {
      this.SelectIcon(this.selectedIconIndex);
    } else {
      if (this.EditLayerId)
        this.UpdatePointIcon(this.selectedIconIndex);
      else
        this.UpdateSelectedPointIcon(this.selectedIconIndex);
    }
  }

  Draggable() {
    setTimeout(() => {
      $('.modal-dialog').draggable({
        handle: ".modal-header"
      });
    }, 10);
  }


  CloseModal() {
    if (this.EditLayerId) {
      let newCheckbox = $('#' + this.EditLayerId + 'LoadlayerinDrawToolData');
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
    this.drawingToolService.DisableDrawingModeLeftArrow();
    this.drawingToolService.DisableDrawingModeRightArrow();
    this.drawingToolService.DisableDrawingModeUpArrow();
    this.drawingToolService.DisableDrawingModeDownArrow();
    this.drawingToolService.CloseDrawToolsForRectangle();
    this.drawingToolService.CloseDrawToolsForCircle();
    this.drawingToolService.CloseDrawToolsForPolygon();
    this.drawingToolService.CloseDrawToolsForLabel();
    this.drawingToolService.AllDrawingLayerList.next([]);
    if (this.isEditDrawTool) {
      this.drawingToolService.RemoveAddedLayer(this.EditLayerId);
      this.drawingToolService.selectedEditLayer.next(null);
      // this.drawingToolService.AllLodedLayersOnMap.next(null);
      this.drawingToolService.AllEditedLayerList.next([]);
    }
  }

  FillColorandCorderColor() {
    $('#Fillcolorlayer').colorpicker({
      color: this.LayerStyleVisibleList.Color,
      history: false,
      transparentColor: true,
      defaultPalette: 'theme',
      displayIndicator: false,
      strings: "Theme Colors,Standard Colors,More Colors,Theme Colors,Back to Palette,History,Pas encore d'historique."
    });
    $("#Fillcolorlayer").off("change.color").on("change.color", (event, color) => {
      let colorval = $("#Fillcolorlayer").val();
      this.LayerStyleVisibleList.Color = colorval;
      this.LayerStyleChange();
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
    $("#FillBorderlayer").off("change.color").on("change.color", (event, color) => {
      let colorval = $("#FillBorderlayer").val();
      this.LayerStyleVisibleList.Border = colorval;
      this.LayerStyleChange();
      //this.SetIcons();
      // $('#title').css('background-color', color);
    });
  }

  generateIconUrl(id, type, opacity, fillColor, strokeColor, strokeThicknessPercentage, sizePercentage) {
    opacity = 1 - (opacity / 100);
    let iconIdValue = id;
    let iconTypeValue = type;
    let and = "&";
    let iconURL = this.iconUrl;
    let urlType = "CustomStyleIcon";
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
  }

  SetDrawingTool(id: number) {

    this.activeDrawtool = id;
    this.DisableOtherDrawingTool(id);
    this.drawingToolService.DisableOtherSelectedDrawTools();
    this.EnableDrawingTool(id);
    if (id == 0) {
      this.drawingToolService.selectedEditLayer.next(null);
      if (!this.EditLayerId) {
        this.editItem = undefined;
        this.drawingToolService.currentlySelectedIcon.next(null);
        this.drawingToolService.DisableMap();
      }
    }
  }

  DisableOtherDrawingTool(drawingToolId: number) {
    let pointTool = this.drawingToolService.pointTool.getValue();
    if (pointTool && pointTool.DrawingManagerId && pointTool.DrawingManagerId != drawingToolId)
      this.drawingToolService.DisableDrawingModeforPoint();
    let lineTool = this.drawingToolService.lineTool.getValue();
    if (lineTool && lineTool.DrawingManagerId && lineTool.DrawingManagerId != drawingToolId)
      this.drawingToolService.DisableDrawingModeLine();
    let freehandpolygoneTool = this.drawingToolService.freehandpolygoneTool.getValue();
    if (freehandpolygoneTool && freehandpolygoneTool.DrawingManagerId && freehandpolygoneTool.DrawingManagerId != drawingToolId)
      this.drawingToolService.DisableFreehandpolygon();
    let freehandpolylineTool = this.drawingToolService.freehandpolylineTool.getValue();
    if (freehandpolylineTool && freehandpolylineTool.DrawingManagerId && freehandpolylineTool.DrawingManagerId != drawingToolId)
      this.drawingToolService.DisableFreehandpolyline();
    let polyLineTool = this.drawingToolService.polyLineTool.getValue();
    if (polyLineTool && polyLineTool.DrawingManagerId && polyLineTool.DrawingManagerId != drawingToolId)
      this.drawingToolService.DisableDrawingModeforPolyLine();
    let triangleTool = this.drawingToolService.triangleTool.getValue();
    if (triangleTool && triangleTool.DrawingManagerId && triangleTool.DrawingManagerId != drawingToolId)
      this.drawingToolService.DisableDrawingModeTriangle();
    let rectangleTool = this.drawingToolService.RectangleTool.getValue();
    if (rectangleTool && rectangleTool.DrawingManagerId && rectangleTool.DrawingManagerId != drawingToolId)
      this.drawingToolService.DisableDrawingModeforRectangle();
    let circleTool = this.drawingToolService.CircleTool.getValue();
    if (circleTool && circleTool.DrawingManagerId && circleTool.DrawingManagerId != drawingToolId)
      this.drawingToolService.DisableDrawingModeforCircle();
    let polygonTool = this.drawingToolService.PolygonTool.getValue();
    if (polygonTool && polygonTool.DrawingManagerId && polygonTool.DrawingManagerId != drawingToolId)
      this.drawingToolService.DisableDrawingModeforPolygon();
    let labelTool = this.drawingToolService.LabelTool.getValue();
    if (labelTool && labelTool.DrawingManagerId && labelTool.DrawingManagerId != drawingToolId)
      this.drawingToolService.DisableDrawingModeforLabel();
      let leftarrowTool = this.drawingToolService.leftarrowTool.getValue();
    if (leftarrowTool && leftarrowTool.DrawingManagerId && leftarrowTool.DrawingManagerId != drawingToolId)
      this.drawingToolService.DisableDrawingModeLeftArrow();
      let rightarrowTool = this.drawingToolService.righttarrowTool.getValue();
    if (rightarrowTool && rightarrowTool.DrawingManagerId && rightarrowTool.DrawingManagerId != drawingToolId)
      this.drawingToolService.DisableDrawingModeRightArrow();
      let uparrowTool = this.drawingToolService.uparrowTool.getValue();
    if (uparrowTool && uparrowTool.DrawingManagerId && uparrowTool.DrawingManagerId != drawingToolId)
      this.drawingToolService.DisableDrawingModeUpArrow();
      let downarrowTool = this.drawingToolService.downarrowTool.getValue();
    if (downarrowTool && downarrowTool.DrawingManagerId && downarrowTool.DrawingManagerId != drawingToolId)
      this.drawingToolService.DisableDrawingModeDownArrow();
  }

  EnableDrawingTool(drawingToolId: number) {
    if (drawingToolId > 0) {
      this.drawingToolService.EnableMap();
    }

    if (drawingToolId == 1) {
      this.LayerStyleVisibleList.Border = '#8db3e2';
      this.LayerStyleVisibleList.Color = '#8db3e2';
      this.LayerStyleVisibleList.Size = 50;
      this.LayerStyleVisibleList.Thickness = 10;
      this.LayerStyleVisibleList.Transparency = 0;
      this.drawingToolService.InitPoint(this.selectedIcon);
      setTimeout(() => {
        this.FillColorandCorderColor();
      }, 100);
    } else if (drawingToolId == 2) {
      this.LayerStyleVisibleList.Color = '#8db3e2';
      this.LayerStyleVisibleList.Thickness = 15;
      this.LayerStyleVisibleList.Transparency = 0;
      this.InitLineTool();
      if (this.freehandpolylineStyleIcon.length == 0)
        this.CreateFreehandpolylineIcon();
      setTimeout(() => {
        this.FillColorandCorderColor();
        this.SelectlineIcon(this.FreehandPolyLineselectedIconIndex, this.freehandpolylineStyleIcon[this.FreehandPolyLineselectedIconIndex]);
      }, 100);
    } else if (drawingToolId == 3) {
      this.LayerStyleVisibleList.Color = '#8db3e2';
      this.LayerStyleVisibleList.Thickness = 15;
      this.LayerStyleVisibleList.Transparency = 0;
      let opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
      this.drawingToolService.InitPolyLineTool(this.LayerStyleVisibleList.Color, opacity, this.LayerStyleVisibleList.Thickness);
      if (this.freehandpolylineStyleIcon.length == 0)
        this.CreateFreehandpolylineIcon();
      setTimeout(() => {
        this.FillColorandCorderColor();
        this.SelectlineIcon(this.FreehandPolyLineselectedIconIndex, this.freehandpolylineStyleIcon[this.FreehandPolyLineselectedIconIndex]);
      }, 100);
    } else if (drawingToolId == 4) {
      this.LayerStyleVisibleList.Color = '#8db3e2';
      this.LayerStyleVisibleList.Thickness = 15;
      this.LayerStyleVisibleList.Transparency = 0;
      if (this.freehandpolylineStyleIcon.length == 0)
        this.CreateFreehandpolylineIcon();
      setTimeout(() => {
        this.FillColorandCorderColor();
        this.SelectlineIcon(this.FreehandPolyLineselectedIconIndex, this.freehandpolylineStyleIcon[this.FreehandPolyLineselectedIconIndex]);
        //this.FreehandPolyLineselectedIcon = this.freehandpolylineStyleIcon[this.FreehandPolyLineselectedIconIndex].Icon;
      }, 100);
    } else if (drawingToolId == 5) {
      this.LayerStyleVisibleList.Border = '#8db3e2';
      this.LayerStyleVisibleList.Color = '#8db3e2';
      this.LayerStyleVisibleList.Size = 50;
      this.LayerStyleVisibleList.Thickness = 10;
      this.LayerStyleVisibleList.Transparency = 0;
      if (this.triangleStyleIcon.length == 0)
        this.CreateTriangleIcon();
      setTimeout(() => {
        this.FillColorandCorderColor();
        this.SelectTriangleIcon(this.TriangleselectedIconIndex, this.triangleStyleIcon[this.TriangleselectedIconIndex]);
      }, 100);
    } else if (drawingToolId == 6) {
      this.LayerStyleVisibleList.Border = '#8db3e2';
      this.LayerStyleVisibleList.Color = '#8db3e2';
      this.LayerStyleVisibleList.Size = 50;
      this.LayerStyleVisibleList.Thickness = 10;
      this.LayerStyleVisibleList.Transparency = 0;
      let opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
      this.drawingToolService.InitRectangleTool(this.LayerStyleVisibleList.Color, opacity, this.LayerStyleVisibleList.Thickness);
      if (this.rectangleStyleIcon.length == 0)
        this.CreateRectangleIcon();
      setTimeout(() => {
        this.FillColorandCorderColor();
        this.SelectRectangleIcon(this.RectangleselectedIconIndex, this.rectangleStyleIcon[this.RectangleselectedIconIndex]);
      }, 100);
    } else if (drawingToolId == 7) {

      this.LayerStyleVisibleList.Border = '#8db3e2';
      this.LayerStyleVisibleList.Color = '#8db3e2';
      this.LayerStyleVisibleList.Size = 50;
      this.LayerStyleVisibleList.Thickness = 10;
      this.LayerStyleVisibleList.Transparency = 0;
      let opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
      this.drawingToolService.InitCircleTool(this.LayerStyleVisibleList.Color, opacity, this.LayerStyleVisibleList.Thickness);
      if (this.circleStyleIcon.length == 0)
        this.CreateCircleIcon();
      setTimeout(() => {
        this.FillColorandCorderColor();
        this.SelectCircleIcon(this.CircleselectedIconIndex, this.circleStyleIcon[this.CircleselectedIconIndex]);
      }, 100);
    } else if (drawingToolId == 8) {
      this.LayerStyleVisibleList.Border = '#8db3e2';
      this.LayerStyleVisibleList.Color = '#8db3e2';
      this.LayerStyleVisibleList.Size = 70;
      this.LayerStyleVisibleList.Thickness = 35;
      this.LayerStyleVisibleList.Transparency = 0;
      let opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
      this.drawingToolService.InitPolygonTool(this.LayerStyleVisibleList.Color, opacity, this.LayerStyleVisibleList.Thickness);
      if (this.polygonStyleIcon.length == 0)
        this.CreateFreehandpolygonIcon();
      setTimeout(() => {
        this.FillColorandCorderColor();
        this.SelectPolygonIcon(this.PolygonSelectedIconIndex, this.polygonStyleIcon[this.PolygonSelectedIconIndex]);
      }, 100);
    } else if (drawingToolId == 9) {
      this.LayerStyleVisibleList.Thickness = 5;
      this.LayerStyleVisibleList.Transparency = 50;
      if (this.freehandpolygonStyleIcon.length == 0)
        this.CreateFreehandpolygonIcon();
      setTimeout(() => {
        this.FillColorandCorderColor();
        this.SelectFreehandpolygonIcon(this.FreehandPolygonselectedIconIndex, this.freehandpolygonStyleIcon[this.FreehandPolygonselectedIconIndex]);
        //this.FreehandPolygonselectedIcon = this.freehandpolygonStyleIcon[this.FreehandPolygonselectedIconIndex].Icon;
        //this.drawingToolService.InitdrawFreeHand(this.LayerStyleVisibleList);
      }, 100);
    } else if (drawingToolId == 10) {
      this.LayerStyleVisibleList.Color = '#8db3e2';
      this.LayerStyleVisibleList.Size = 30;
      this.LayerStyleVisibleList.Transparency = 10;
      this.LayerStyleVisibleList.labelSize = (10 + (this.LayerStyleVisibleList.Size / 5)) + 'px';
      let opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
      this.drawingToolService.InitLabelTool(this.textlabel, this.LayerStyleVisibleList.Color, this.LayerStyleVisibleList.labelSize, opacity);
      setTimeout(() => {
        this.FillColorandCorderColor();
      }, 100);
    } else if (drawingToolId == 11) {
      this.LayerStyleVisibleList.Border = '#8db3e2';
      this.LayerStyleVisibleList.Color = '#8db3e2';
      this.LayerStyleVisibleList.Size = 50;
      this.LayerStyleVisibleList.Thickness = 10;
      this.LayerStyleVisibleList.Transparency = 0;
      if (this.leftarrowStyleIcon.length == 0)
        this.CreateLeftArrowIcon();
      setTimeout(() => {
        this.FillColorandCorderColor();
        this.SelectLeftarrowIcon(this.LeftarrowselectedIconIndex, this.leftarrowStyleIcon[this.LeftarrowselectedIconIndex]);
      }, 100);
    } else if (drawingToolId == 12) {
      this.LayerStyleVisibleList.Border = '#8db3e2';
      this.LayerStyleVisibleList.Color = '#8db3e2';
      this.LayerStyleVisibleList.Size = 50;
      this.LayerStyleVisibleList.Thickness = 10;
      this.LayerStyleVisibleList.Transparency = 0;
      if (this.rightarrowStyleIcon.length == 0)
        this.CreateRightArrowIcon();
      setTimeout(() => {
        this.FillColorandCorderColor();
        this.SelectRightarrowIcon(this.RightarrowselectedIconIndex, this.rightarrowStyleIcon[this.RightarrowselectedIconIndex]);
      }, 100);
    } else if (drawingToolId == 13) {
      this.LayerStyleVisibleList.Border = '#8db3e2';
      this.LayerStyleVisibleList.Color = '#8db3e2';
      this.LayerStyleVisibleList.Size = 50;
      this.LayerStyleVisibleList.Thickness = 10;
      this.LayerStyleVisibleList.Transparency = 0;
      if (this.uparrowStyleIcon.length == 0)
        this.CreateUpArrowIcon();
      setTimeout(() => {
        this.FillColorandCorderColor();
        this.SelectUparrowIcon(this.UparrowselectedIconIndex, this.uparrowStyleIcon[this.UparrowselectedIconIndex]);
      }, 100);
    } else if (drawingToolId == 14) {
      this.LayerStyleVisibleList.Border = '#8db3e2';
      this.LayerStyleVisibleList.Color = '#8db3e2';
      this.LayerStyleVisibleList.Size = 50;
      this.LayerStyleVisibleList.Thickness = 10;
      this.LayerStyleVisibleList.Transparency = 0;
      if (this.downarrowStyleIcon.length == 0)
        this.CreateDownArrowIcon();
      setTimeout(() => {
        this.FillColorandCorderColor();
        this.SelectDownarrowIcon(this.DownarrowselectedIconIndex, this.downarrowStyleIcon[this.DownarrowselectedIconIndex]);
      }, 100);
    }
  }

  SelectIcon(index) {
    this.selectedIcon = this.IconList[index];
    this.selectedIconIndex = index;
    if (!this.editItem) {
      let Marker = this.drawingToolService.pointTool.getValue();
      if (Marker) {
        let options = {
          markerOptions: {
            icon: { url: this.selectedIcon },
            draggable: true,
            clickable: true
          }
        }
        Marker.DrawingTool.setOptions(options);
      }
    } else {
      this.SetIcons();
    }
  }

  UpdatePointIcon(index) {
    this.selectedIcon = this.IconList[index];
    this.selectedIconIndex = index;
    if (this.editItem && this.editItem.mapItem) {
      let selectedMarker = this.editItem.mapItem;
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
  }

  UpdateSelectedPointIcon(index) {
    this.selectedIcon = this.IconList[index];
    this.selectedIconIndex = index;
    if (this.editItem) {
      let selectedMarker = this.editItem;
      if (selectedMarker && selectedMarker.setIcon) {
        selectedMarker.setIcon({ url: this.selectedIcon });
      }
    }
  }

  setPolyLineOptions() {
    let polylineTool = this.drawingToolService.polyLineTool.getValue();
    if (polylineTool) {
      let options = {
        polylineOptions: {
          strokeColor: this.LayerStyleVisibleList.Color,
          strokeOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
          strokeWeight: this.LayerStyleVisibleList.Thickness / 10
        }
      }
      polylineTool.DrawingTool.setOptions(options);
      if (this.editItem) {
        let selectedPolyLine = this.editItem;
        selectedPolyLine.setOptions(options.polylineOptions);
      }
    }
  }

  setFreehandLineOptions() {
    let freelineTool = this.drawingToolService.freehandpolylineTool.getValue();
    if (freelineTool) {
      let options = {
        polylineOptions: {
          strokeColor: this.LayerStyleVisibleList.Color,
          strokeOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
          strokeWeight: this.LayerStyleVisibleList.Thickness / 10
        }
      }
      if (this.editItem) {
        let selectedPolyLine = this.editItem;
        selectedPolyLine.setOptions(options.polylineOptions);
      }
      // freelineTool.DrawingTool.setOptions(options);
    }
  }

  setTriangleOptions() {
    let TriangleTool = this.drawingToolService.triangleTool.getValue();
    if (TriangleTool) {
      let options = {
        rectangleOptions: {
          strokeColor: this.LayerStyleVisibleList.Border,
          fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
          strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
          fillColor: this.LayerStyleVisibleList.Color
        }
      }

      if (this.editItem) {
        let selectedPolyLine = this.editItem;
        selectedPolyLine.setOptions(options.rectangleOptions);
      }
      // TriangleTool.DrawingTool.setOptions(options);
    }
  }

  setLeftarrowOptions() {
    let TriangleTool = this.drawingToolService.leftarrowTool.getValue();
    if (TriangleTool) {
      let options = {
        rectangleOptions: {
          strokeColor: this.LayerStyleVisibleList.Border,
          fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
          strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
          fillColor: this.LayerStyleVisibleList.Color
        }
      }

      if (this.editItem) {
        let selectedPolyLine = this.editItem;
        selectedPolyLine.setOptions(options.rectangleOptions);
      }
      // TriangleTool.DrawingTool.setOptions(options);
    }
  }

  setRightarrowOptions() {
    let TriangleTool = this.drawingToolService.righttarrowTool.getValue();
    if (TriangleTool) {
      let options = {
        rectangleOptions: {
          strokeColor: this.LayerStyleVisibleList.Border,
          fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
          strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
          fillColor: this.LayerStyleVisibleList.Color
        }
      }

      if (this.editItem) {
        let selectedPolyLine = this.editItem;
        selectedPolyLine.setOptions(options.rectangleOptions);
      }
      // TriangleTool.DrawingTool.setOptions(options);
    }
  }

  setUparrowOptions() {
    let TriangleTool = this.drawingToolService.uparrowTool.getValue();
    if (TriangleTool) {
      let options = {
        rectangleOptions: {
          strokeColor: this.LayerStyleVisibleList.Border,
          fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
          strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
          fillColor: this.LayerStyleVisibleList.Color
        }
      }

      if (this.editItem) {
        let selectedPolyLine = this.editItem;
        selectedPolyLine.setOptions(options.rectangleOptions);
      }
      // TriangleTool.DrawingTool.setOptions(options);
    }
  }

  setDownarrowOptions() {
    let TriangleTool = this.drawingToolService.downarrowTool.getValue();
    if (TriangleTool) {
      let options = {
        rectangleOptions: {
          strokeColor: this.LayerStyleVisibleList.Border,
          fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
          strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
          fillColor: this.LayerStyleVisibleList.Color
        }
      }

      if (this.editItem) {
        let selectedPolyLine = this.editItem;
        selectedPolyLine.setOptions(options.rectangleOptions);
      }
      // TriangleTool.DrawingTool.setOptions(options);
    }
  }

  setRectangleOptions() {
    if (!this.editItem) {
      let RectangleTool = this.drawingToolService.RectangleTool.getValue();
      if (RectangleTool) {
        let options = {
          rectangleOptions: {
            strokeColor: this.LayerStyleVisibleList.Border,
            fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
            strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
            fillColor: this.LayerStyleVisibleList.Color
          }
        }
        RectangleTool.DrawingTool.setOptions(options);
      }
    } else {
      let RectangleTool = this.editItem.mapItem;
      let options = {
        strokeColor: this.LayerStyleVisibleList.Border,
        fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
        strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
        fillColor: this.LayerStyleVisibleList.Color
      }
      if (RectangleTool) {
        RectangleTool.setOptions(options);
        this.editItem.savedItem.BackColor = this.LayerStyleVisibleList.Color;
        this.editItem.savedItem.Color = this.LayerStyleVisibleList.Border;
        this.editItem.savedItem.StrokeThickness = this.LayerStyleVisibleList.Thickness / 10;
        this.editItem.savedItem.Opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
        this.drawingToolService.UpdateEditObj(this.editItem.savedItem, this.editItem.mapItem);
      }

      this.editItem.setOptions(options);

    }

    this.RectangleselectedIcon = this.generateIconUrl(this.RectangleselectedIconIndex, "Rectangle", this.LayerStyleVisibleList.Transparency, 'FF' + this.LayerStyleVisibleList.Color.replace('#', '').toUpperCase(), 'FF' + this.LayerStyleVisibleList.Border.replace('#', '').toUpperCase(), this.LayerStyleVisibleList.Thickness, 70);
  }

  setCircleOptions() {
    if (!this.editItem) {
      let CircleTool = this.drawingToolService.CircleTool.getValue();
      if (CircleTool) {
        let options = {
          circleOptions: {
            strokeColor: this.LayerStyleVisibleList.Border,
            fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
            strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
            fillColor: this.LayerStyleVisibleList.Color
          }
        }
        CircleTool.DrawingTool.setOptions(options);
      }
    } else {
      let CircleTool = this.editItem.mapItem;
      let options = {
        strokeColor: this.LayerStyleVisibleList.Border,
        fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
        strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
        fillColor: this.LayerStyleVisibleList.Color
      }
      if (CircleTool) {
        CircleTool.setOptions(options);
        this.editItem.savedItem.BackColor = this.LayerStyleVisibleList.Color;
        this.editItem.savedItem.Color = this.LayerStyleVisibleList.Border;
        this.editItem.savedItem.StrokeThickness = this.LayerStyleVisibleList.Thickness / 10;
        this.editItem.savedItem.Opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
        this.drawingToolService.UpdateEditObj(this.editItem.savedItem, this.editItem.mapItem);
      } else {
        this.editItem.setOptions(options);
      }
    }
    this.CircleselectedIcon = this.generateIconUrl(this.CircleselectedIconIndex, "Circle", this.LayerStyleVisibleList.Transparency, 'FF' + this.LayerStyleVisibleList.Color.replace('#', '').toUpperCase(), 'FF' + this.LayerStyleVisibleList.Border.replace('#', '').toUpperCase(), this.LayerStyleVisibleList.Thickness, 70);
  }

  setPolygonOptions() {
    if (!this.editItem) {
      let PolygonTool = this.drawingToolService.PolygonTool.getValue();
      if (PolygonTool) {
        let options = {
          polygonOptions: {
            strokeColor: this.LayerStyleVisibleList.Border,
            fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
            strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
            fillColor: this.LayerStyleVisibleList.Color
          }
        }
        PolygonTool.DrawingTool.setOptions(options);
      }
    } else {
      let PolygonTool = this.editItem.mapItem;
      // if (PolygonTool) {
      let options = {
        strokeColor: this.LayerStyleVisibleList.Border,
        fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
        strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
        fillColor: this.LayerStyleVisibleList.Color
      }
      if (PolygonTool) {
        PolygonTool.setOptions(options);
        this.editItem.savedItem.BackColor = this.LayerStyleVisibleList.Color;
        this.editItem.savedItem.Color = this.LayerStyleVisibleList.Border;
        this.editItem.savedItem.StrokeThickness = this.LayerStyleVisibleList.Thickness / 10;
        this.editItem.savedItem.Opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
        this.drawingToolService.UpdateEditObj(this.editItem.savedItem, this.editItem.mapItem);
      } else {
        this.editItem.setOptions(options);
      }
      // }
    }
    this.PolygonselectedIcon = this.generateIconUrl(this.PolygonSelectedIconIndex, "Pentagon", this.LayerStyleVisibleList.Transparency, 'FF' + this.LayerStyleVisibleList.Color.replace('#', '').toUpperCase(), 'FF' + this.LayerStyleVisibleList.Border.replace('#', '').toUpperCase(), this.LayerStyleVisibleList.Thickness / 10, 100);
  }

  setFreehandPolygonOptions() {
    if (!this.editItem) {
      let PolygonTool = this.drawingToolService.PolygonTool.getValue();
      if (PolygonTool) {
        let options = {
          polygonOptions: {
            strokeColor: this.LayerStyleVisibleList.Border,
            fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
            strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
            fillColor: this.LayerStyleVisibleList.Color
          }
        }
        PolygonTool.DrawingTool.setOptions(options);
      }
    } else {
      let PolygonTool = this.editItem.mapItem;
      // if (PolygonTool) {
      let options = {
        strokeColor: this.LayerStyleVisibleList.Border,
        fillOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
        strokeWeight: this.LayerStyleVisibleList.Thickness / 10,
        fillColor: this.LayerStyleVisibleList.Color
      }
      if (PolygonTool) {
        PolygonTool.setOptions(options);
        this.editItem.savedItem.BackColor = this.LayerStyleVisibleList.Color;
        this.editItem.savedItem.Color = this.LayerStyleVisibleList.Border;
        this.editItem.savedItem.StrokeThickness = this.LayerStyleVisibleList.Thickness / 10;
        this.editItem.savedItem.Opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
        this.drawingToolService.UpdateEditObj(this.editItem.savedItem, this.editItem.mapItem);
      } else {
        this.editItem.setOptions(options);
      }
      // }
    }
    this.PolygonselectedIcon = this.generateIconUrl(this.PolygonSelectedIconIndex, "Pentagon", this.LayerStyleVisibleList.Transparency, 'FF' + this.LayerStyleVisibleList.Color.replace('#', '').toUpperCase(), 'FF' + this.LayerStyleVisibleList.Border.replace('#', '').toUpperCase(), this.LayerStyleVisibleList.Thickness / 10, 100);
  }

  setLabelOptions() {
    this.LayerStyleVisibleList.labelSize = (10 + (this.LayerStyleVisibleList.Size / 5)) + 'px';
    if (!this.editItem) {
      let LabelTool = this.drawingToolService.LabelTool.getValue();
      let opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
      if (LabelTool) {
        let options = {
          markerOptions: {
            opacity: opacity,
            icon: 'https://node.envisionmaps.net/Images/transparent.png',
            label: { color: this.LayerStyleVisibleList.Color, fontSize: this.LayerStyleVisibleList.labelSize, text: this.textlabel }
          }
        }
        LabelTool.DrawingTool.setOptions(options);
      }
    } else {
      let Label = this.editItem.mapItem;
      let opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
      // if (Label) {
      let options = {
        opacity: opacity,
        label: { color: this.LayerStyleVisibleList.Color, fontSize: this.LayerStyleVisibleList.labelSize, text: this.textlabel }
      }
      if (Label) {
        Label.setOptions(options);
        this.editItem.savedItem.Color = this.LayerStyleVisibleList.Color;
        this.editItem.savedItem.FontSize = (10 + (this.LayerStyleVisibleList.Size / 5));
        this.editItem.savedItem.Opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
        this.editItem.savedItem.Name = this.textlabel;
        this.drawingToolService.UpdateEditObj(this.editItem.savedItem, this.editItem.mapItem);
        this.editItem.setOptions(options);
      } else {
        this.editItem.setOptions(options);
      }

      // }
    }
  }

  UndoPoint() {
    let AllDrawingLayerList = this.drawingToolService.AllDrawingLayerList.getValue();
    if (AllDrawingLayerList.length > 0) {
      AllDrawingLayerList[AllDrawingLayerList.length - 1].DrawingItem.setMap(null);
      AllDrawingLayerList.splice(AllDrawingLayerList.length - 1, 1);
    }
  }

  ClearPoints() {
    let AllDrawingLayerList = this.drawingToolService.AllDrawingLayerList.getValue();
    if (AllDrawingLayerList.length > 0) {
      AllDrawingLayerList.forEach(x => {
        x.DrawingItem.setMap(null);
      });
    }
    this.drawingToolService.AllDrawingLayerList.getValue().length = 0;
  }

  ChangeLineDrawSettings() {
    if (!this.editItem) {
      this.drawingToolService.DisableDrawingModeLine();
      this.InitLineTool();
    } else {
      let polylineTool = this.editItem.mapItem;
      let options = {
        strokeColor: this.LayerStyleVisibleList.Color,
        strokeOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
        strokeWeight: this.LayerStyleVisibleList.Thickness / 10
      }
      if (polylineTool) {
        // let options = {
        //   strokeColor: this.LayerStyleVisibleList.Color,
        //   strokeOpacity: 1 - (this.LayerStyleVisibleList.Transparency / 100),
        //   strokeWeight: this.LayerStyleVisibleList.Thickness / 10
        // }
        polylineTool.setOptions(options);
        this.editItem.savedItem.BackColor = this.LayerStyleVisibleList.Color;
        this.editItem.savedItem.StrokeThickness = this.LayerStyleVisibleList.Thickness / 10;
        this.editItem.savedItem.Opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
        this.drawingToolService.UpdateEditObj(this.editItem.savedItem, this.editItem.mapItem);
      }
      if (this.editItem) {
        let selectedLine = this.editItem;
        selectedLine.setOptions(options);
      }
    }
  }

  ChangeTriangleSettings() {
    this.drawingToolService.DisableDrawingModeTriangle();
    let opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
    let borderWidth = this.LayerStyleVisibleList.Thickness / 10;
    let color = "FF" + this.LayerStyleVisibleList.Color.replace('#', '').toUpperCase();
    let borderColor = "FF" + this.LayerStyleVisibleList.Border.replace('#', '').toUpperCase();
    this.TriangleselectedIcon = this.generateIconUrl(this.TriangleselectedIconIndex, "TriangleUp", this.LayerStyleVisibleList.Transparency, color, borderColor, 25, 100);
    this.drawingToolService.InitTriangle(this.LayerStyleVisibleList.Color, this.LayerStyleVisibleList.Border, borderWidth, opacity);
  }

  ChangeLeftarrowSettings() {
    this.drawingToolService.DisableDrawingModeLeftArrow();
    let opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
    let borderWidth = this.LayerStyleVisibleList.Thickness / 10;
    let color = "FF" + this.LayerStyleVisibleList.Color.replace('#', '').toUpperCase();
    let borderColor = "FF" + this.LayerStyleVisibleList.Border.replace('#', '').toUpperCase();
    this.LeftarrowselectedIcon = this.generateIconUrl(this.LeftarrowselectedIconIndex, "TriangleUp", this.LayerStyleVisibleList.Transparency, color, borderColor, 25, 100);
    this.drawingToolService.InitLeftArrow(this.LayerStyleVisibleList.Color, this.LayerStyleVisibleList.Border, borderWidth, opacity);
  }

  ChangeRightarrowSettings() {
    this.drawingToolService.DisableDrawingModeRightArrow();
    let opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
    let borderWidth = this.LayerStyleVisibleList.Thickness / 10;
    let color = "FF" + this.LayerStyleVisibleList.Color.replace('#', '').toUpperCase();
    let borderColor = "FF" + this.LayerStyleVisibleList.Border.replace('#', '').toUpperCase();
    this.RighttarrowselectedIcon = this.generateIconUrl(this.RightarrowselectedIconIndex, "TriangleUp", this.LayerStyleVisibleList.Transparency, color, borderColor, 25, 100);
    this.drawingToolService.InitRightArrow(this.LayerStyleVisibleList.Color, this.LayerStyleVisibleList.Border, borderWidth, opacity);
  }

  ChangeUparrowSettings() {
    this.drawingToolService.DisableDrawingModeUpArrow();
    let opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
    let borderWidth = this.LayerStyleVisibleList.Thickness / 10;
    let color = "FF" + this.LayerStyleVisibleList.Color.replace('#', '').toUpperCase();
    let borderColor = "FF" + this.LayerStyleVisibleList.Border.replace('#', '').toUpperCase();
    this.UparrowselectedIcon = this.generateIconUrl(this.UparrowselectedIconIndex, "TriangleUp", this.LayerStyleVisibleList.Transparency, color, borderColor, 25, 100);
    this.drawingToolService.InitUpArrow(this.LayerStyleVisibleList.Color, this.LayerStyleVisibleList.Border, borderWidth, opacity);
  }

  ChangeDownarrowSettings() {
    this.drawingToolService.DisableDrawingModeDownArrow();
    let opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
    let borderWidth = this.LayerStyleVisibleList.Thickness / 10;
    let color = "FF" + this.LayerStyleVisibleList.Color.replace('#', '').toUpperCase();
    let borderColor = "FF" + this.LayerStyleVisibleList.Border.replace('#', '').toUpperCase();
    this.DownarrowselectedIcon = this.generateIconUrl(this.DownarrowselectedIconIndex, "TriangleUp", this.LayerStyleVisibleList.Transparency, color, borderColor, 25, 100);
    this.drawingToolService.InitDownArrow(this.LayerStyleVisibleList.Color, this.LayerStyleVisibleList.Border, borderWidth, opacity);
  }

  InitLineTool() {
    let opacity = 1 - (this.LayerStyleVisibleList.Transparency / 100);
    let borderWidth = this.LayerStyleVisibleList.Thickness / 10;
    this.drawingToolService.InitLine(this.LayerStyleVisibleList.Color, borderWidth, opacity);
  }

  LayerStyleChange() {
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
        this.setFreehandLineOptions();
        break;
      case 5:
        this.ChangeTriangleSettings();
        this.setTriangleOptions();
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
        this.setFreehandPolygonOptions();
        // this.FreehandPolygonselectedIcon = this.generateIconUrl(this.PolygonSelectedIconIndex, "Pentagon", this.LayerStyleVisibleList.Transparency, 'FF' + this.LayerStyleVisibleList.Color.replace('#', '').toUpperCase(), 'FF' + this.LayerStyleVisibleList.Border.replace('#', '').toUpperCase(), this.LayerStyleVisibleList.Thickness / 10, 100);
        break;
      case 10:
        this.setLabelOptions();
        break;
      case 11:
        this.ChangeLeftarrowSettings();
        this.setLeftarrowOptions();
        break;
      case 12:
        this.ChangeRightarrowSettings();
        this.setRightarrowOptions();
        break;  
      case 13:
        this.ChangeUparrowSettings();
        this.setUparrowOptions();
        break;
      case 14:
        this.ChangeDownarrowSettings();
        this.setDownarrowOptions();
        break;        
    }
  }
  CreateFreehandpolygonIcon() {
    for (let i = 0; i < 2; i++) {
      let color = this.UtilityService.getRandomColor();
      var freehabdpolineStyle = {
        Color: color,
        Border: color,
        Size: 100,
        Thickness: 35,
        Transparency: 50,
        Icon: ""
      }
      if (i < 10) {
        freehabdpolineStyle.Transparency = 50;
      } else if (i < 20 && i > 10) {
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

  }

  CreateTriangleIcon() {
    for (let i = 0; i < 2; i++) {
      let color = this.UtilityService.getRandomColor();
      var freehabdpolineStyle = {
        Color: color,
        Border: color,
        Size: 100,
        Thickness: 25,
        Transparency: 10,
        Icon: ""
      }
      if (i < 10) {
        freehabdpolineStyle.Transparency = 50;
      } else if (i < 20 && i > 10) {
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
  }

  CreateLeftArrowIcon() {
    for (let i = 0; i < 2; i++) {
      let color = this.UtilityService.getRandomColor();
      var freehabdpolineStyle = {
        Color: color,
        Border: color,
        Size: 100,
        Thickness: 25,
        Transparency: 10,
        Icon: ""
      }
      if (i < 10) {
        freehabdpolineStyle.Transparency = 50;
      } else if (i < 20 && i > 10) {
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
      this.leftarrowStyleIcon.push(freehabdpolineStyle);
    }
    // this.SelectTriangleIcon(this.TriangleselectedIconIndex, this.triangleStyleIcon[this.TriangleselectedIconIndex]);
  }

  CreateRightArrowIcon() {
    for (let i = 0; i < 2; i++) {
      let color = this.UtilityService.getRandomColor();
      var freehabdpolineStyle = {
        Color: color,
        Border: color,
        Size: 100,
        Thickness: 25,
        Transparency: 10,
        Icon: ""
      }
      if (i < 10) {
        freehabdpolineStyle.Transparency = 50;
      } else if (i < 20 && i > 10) {
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
      this.rightarrowStyleIcon.push(freehabdpolineStyle);
    }
    // this.SelectTriangleIcon(this.TriangleselectedIconIndex, this.triangleStyleIcon[this.TriangleselectedIconIndex]);
  }

  CreateUpArrowIcon() {
    for (let i = 0; i < 2; i++) {
      let color = this.UtilityService.getRandomColor();
      var freehabdpolineStyle = {
        Color: color,
        Border: color,
        Size: 100,
        Thickness: 25,
        Transparency: 10,
        Icon: ""
      }
      if (i < 10) {
        freehabdpolineStyle.Transparency = 50;
      } else if (i < 20 && i > 10) {
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
      this.uparrowStyleIcon.push(freehabdpolineStyle);
    }
    // this.SelectTriangleIcon(this.TriangleselectedIconIndex, this.triangleStyleIcon[this.TriangleselectedIconIndex]);
  }

  CreateDownArrowIcon() {
    for (let i = 0; i < 2; i++) {
      let color = this.UtilityService.getRandomColor();
      var freehabdpolineStyle = {
        Color: color,
        Border: color,
        Size: 100,
        Thickness: 25,
        Transparency: 10,
        Icon: ""
      }
      if (i < 10) {
        freehabdpolineStyle.Transparency = 50;
      } else if (i < 20 && i > 10) {
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
      this.downarrowStyleIcon.push(freehabdpolineStyle);
    }
    // this.SelectTriangleIcon(this.TriangleselectedIconIndex, this.triangleStyleIcon[this.TriangleselectedIconIndex]);
  }

  CreateRectangleIcon() {
    for (let i = 0; i < 2; i++) {
      let color = this.UtilityService.getRandomColor();
      var rectangleStyle = {
        Color: color,
        Border: color,
        Size: 70,
        Thickness: 25,
        Transparency: 10,
        Icon: ""
      }
      if (i < 10) {
        rectangleStyle.Transparency = 50;
      } else if (i < 20 && i > 10) {
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
  }

  CreateCircleIcon() {
    for (let i = 0; i < 2; i++) {
      let color = this.UtilityService.getRandomColor();
      var circleStyle = {
        Color: color,
        Border: color,
        Size: 70,
        Thickness: 25,
        Transparency: 10,
        Icon: ""
      }
      if (i < 10) {
        circleStyle.Transparency = 50;
      } else if (i < 20 && i > 10) {
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
  }

  CreateFreehandpolylineIcon() {
    for (let i = 0; i < 2; i++) {
      let color = this.UtilityService.getRandomColor();
      var freehabdpolineStyle = {
        Color: color,
        Border: color,
        Size: 100,
        Thickness: 5,
        Transparency: 50,
        Icon: ""
      }
      if (i <= 10) {
        freehabdpolineStyle.Transparency = 0;
        freehabdpolineStyle.Thickness = 25;
      } else if (i <= 20 && i > 10) {
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
  }
  SelectFreehandpolygonIcon(index, objicon) {
    this.FreehandPolygonselectedIcon = this.freehandpolygonStyleIcon[index].Icon;
    this.FreehandPolygonselectedIconIndex = index;
    this.LayerStyleVisibleList.Border = objicon.Border;
    this.LayerStyleVisibleList.Thickness = objicon.Thickness;
    this.LayerStyleVisibleList.Color = objicon.Color;
    $("#Fillcolorlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Color.replace('#', ''));
    $("#FillBorderlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Border.replace('#', ''));
    this.LayerStyleVisibleList.Thickness = objicon.Thickness;
    this.LayerStyleVisibleList.Transparency = objicon.Transparency;
  }

  SelectTriangleIcon(index, objicon) {
    this.TriangleselectedIcon = this.triangleStyleIcon[index].Icon;
    this.TriangleselectedIconIndex = index;
    this.LayerStyleVisibleList.Border = objicon.Border;
    this.LayerStyleVisibleList.Color = objicon.Color;
    this.LayerStyleVisibleList.Thickness = objicon.Thickness;
    this.LayerStyleVisibleList.Transparency = objicon.Transparency;
    $("#Fillcolorlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Color.replace('#', ''));
    $("#FillBorderlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Border.replace('#', ''));
  }

  SelectLeftarrowIcon(index, objicon) {
    this.LeftarrowselectedIcon = this.leftarrowStyleIcon[index].Icon;
    this.LeftarrowselectedIconIndex = index;
    this.LayerStyleVisibleList.Border = objicon.Border;
    this.LayerStyleVisibleList.Color = objicon.Color;
    this.LayerStyleVisibleList.Thickness = objicon.Thickness;
    this.LayerStyleVisibleList.Transparency = objicon.Transparency;
    $("#Fillcolorlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Color.replace('#', ''));
    $("#FillBorderlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Border.replace('#', ''));
  }

  SelectRightarrowIcon(index, objicon) {
    this.RighttarrowselectedIcon = this.rightarrowStyleIcon[index].Icon;
    this.RightarrowselectedIconIndex = index;
    this.LayerStyleVisibleList.Border = objicon.Border;
    this.LayerStyleVisibleList.Color = objicon.Color;
    this.LayerStyleVisibleList.Thickness = objicon.Thickness;
    this.LayerStyleVisibleList.Transparency = objicon.Transparency;
    $("#Fillcolorlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Color.replace('#', ''));
    $("#FillBorderlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Border.replace('#', ''));
  }

  SelectUparrowIcon(index, objicon) {
    this.UparrowselectedIcon = this.uparrowStyleIcon[index].Icon;
    this.UparrowselectedIconIndex = index;
    this.LayerStyleVisibleList.Border = objicon.Border;
    this.LayerStyleVisibleList.Color = objicon.Color;
    this.LayerStyleVisibleList.Thickness = objicon.Thickness;
    this.LayerStyleVisibleList.Transparency = objicon.Transparency;
    $("#Fillcolorlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Color.replace('#', ''));
    $("#FillBorderlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Border.replace('#', ''));
  }

  SelectDownarrowIcon(index, objicon) {
    this.DownarrowselectedIcon = this.downarrowStyleIcon[index].Icon;
    this.DownarrowselectedIconIndex = index;
    this.LayerStyleVisibleList.Border = objicon.Border;
    this.LayerStyleVisibleList.Color = objicon.Color;
    this.LayerStyleVisibleList.Thickness = objicon.Thickness;
    this.LayerStyleVisibleList.Transparency = objicon.Transparency;
    $("#Fillcolorlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Color.replace('#', ''));
    $("#FillBorderlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Border.replace('#', ''));
  }

  SelectRectangleIcon(index, objicon) {
    this.RectangleselectedIcon = this.rectangleStyleIcon[index].Icon;
    this.RectangleselectedIconIndex = index;
    this.LayerStyleVisibleList.Border = objicon.Border;
    this.LayerStyleVisibleList.Color = objicon.Color;
    this.LayerStyleVisibleList.Thickness = objicon.Thickness;
    this.LayerStyleVisibleList.Transparency = objicon.Transparency;
    $("#Fillcolorlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Color.replace('#', ''));
    $("#FillBorderlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Border.replace('#', ''));
  }

  SelectCircleIcon(index, objicon) {
    this.CircleselectedIcon = this.circleStyleIcon[index].Icon;
    this.CircleselectedIconIndex = index;
    this.LayerStyleVisibleList.Border = objicon.Border;
    this.LayerStyleVisibleList.Color = objicon.Color;
    this.LayerStyleVisibleList.Thickness = objicon.Thickness;
    this.LayerStyleVisibleList.Transparency = objicon.Transparency;
    $("#Fillcolorlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Color.replace('#', ''));
    $("#FillBorderlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Border.replace('#', ''));
  }

  SelectPolygonIcon(index, objicon) {
    this.PolygonselectedIcon = this.polygonStyleIcon[index].Icon;
    this.PolygonSelectedIconIndex = index;
    this.LayerStyleVisibleList.Border = objicon.Border;
    this.LayerStyleVisibleList.Color = objicon.Color;
    this.LayerStyleVisibleList.Thickness = objicon.Thickness;
    this.LayerStyleVisibleList.Transparency = objicon.Transparency;
    $("#Fillcolorlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Color.replace('#', ''));
    $("#FillBorderlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Border.replace('#', ''));
  }

  SelectlineIcon(index, objicon) {
    this.FreehandPolyLineselectedIcon = this.freehandpolylineStyleIcon[index].Icon;
    this.FreehandPolyLineselectedIconIndex = index;
    this.LayerStyleVisibleList.Border = objicon.Border;
    this.LayerStyleVisibleList.Color = objicon.Color;
    $("#Fillcolorlayer").colorpicker("val", "#" + this.LayerStyleVisibleList.Color.replace('#', ''));
    this.LayerStyleVisibleList.Thickness = objicon.Thickness;
    this.LayerStyleVisibleList.Transparency = objicon.Transparency;
    if (this.activeDrawtool == 2) {
      this.ChangeLineDrawSettings();
    } else if (this.activeDrawtool == 3) {
      this.setPolyLineOptions();
    }

  }

  SaveTools() {
    const config: ModalOptions = { class: 'modal-sm modal-dialog-centered', backdrop: 'static', animated: false };
    let bsModalRef = this.bsModalService.show(SaveDrawToolsComponent, config);
    bsModalRef.content.isSaved.take(1).subscribe((value) => {
      if (value == true)
        this.CloseModal();
    });
  }

  OpenConfirmModal() {
    // if(this.EditLayerId) {

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
    const config: ModalOptions = { class: 'modal-sm modal-dialog-centered', backdrop: 'static', animated: false };
    let bsModalRef = this.bsModalService.show(ConfirmDrawToolsComponent, config);
    bsModalRef.content.close.take(1).subscribe((value) => {
      if (value == true)
        this.CloseModal();
    });
    if (this.EditLayerId)
      bsModalRef.content.EditLayerId = this.EditLayerId;
  }

  LoadEditableLayer() {
    this.isEditDrawTool = true;
    this.drawingToolService.DisableDrawingModeforPoint();
    this.activeDrawtool = 0;
    this.drawingToolService.AddDrawingLayer(this.EditLayerId, true);
  }

  UpdateSelectedItem() {
    debugger;
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
    else if (this.editItem.savedItem.ShapeType == 'Polygon' || this.editItem.savedItem.ShapeType == 'Triangle' || this.editItem.savedItem.ShapeType == 'LeftArrow' || this.editItem.savedItem.ShapeType == 'RightArrow' || this.editItem.savedItem.ShapeType == 'UpArrow' || this.editItem.savedItem.ShapeType == 'DownArrow')
      this.LoadEditForPolygon();
    else if (this.editItem.savedItem.ShapeType == 'Label')
      this.LoadEditForLabel();
  }

  LoadEditForPoint() {
    this.activeDrawtool = 1;
    this.LayerStyleVisibleList.Border = this.editItem.savedItem.Color.replace('#FF', '#');
    this.LayerStyleVisibleList.Color = this.editItem.savedItem.BackColor.replace('#FF', '#');
    this.LayerStyleVisibleList.Size = this.editItem.savedItem.FontSize;
    this.LayerStyleVisibleList.Thickness = this.editItem.savedItem.StrokeThickness;
    this.LayerStyleVisibleList.Transparency = 100 - (this.editItem.savedItem.Opacity * 100);
    let index = this.IconsnameList.findIndex(x => x == this.editItem.savedItem.SubType);
    if (index > -1)
      this.selectedIconIndex = index;
    this.SetIcons();
    setTimeout(() => {
      this.FillColorandCorderColor();
    }, 100);
  }

  LoadEditForLine() {
    this.activeDrawtool = 2;
    this.LayerStyleVisibleList.Color = this.editItem.savedItem.BackColor;
    this.LayerStyleVisibleList.Thickness = this.editItem.savedItem.StrokeThickness * 10;
    this.LayerStyleVisibleList.Transparency = 100 - (this.editItem.savedItem.Opacity * 100);
    if (this.freehandpolylineStyleIcon.length == 0)
      this.CreateFreehandpolylineIcon();
    setTimeout(() => {
      this.FillColorandCorderColor();
    }, 100);
  }

  LoadEditForRectangle() {
    this.activeDrawtool = 6;
    this.LayerStyleVisibleList.Border = this.editItem.savedItem.Color;
    this.LayerStyleVisibleList.Color = this.editItem.savedItem.BackColor;
    this.LayerStyleVisibleList.Thickness = this.editItem.savedItem.StrokeThickness * 10;
    this.LayerStyleVisibleList.Transparency = 100 - (this.editItem.savedItem.Opacity * 100);
    if (this.rectangleStyleIcon.length == 0)
      this.CreateRectangleIcon();
    setTimeout(() => {
      this.FillColorandCorderColor();
    }, 100);
  }

  LoadEditForCircle() {
    this.activeDrawtool = 7;
    this.LayerStyleVisibleList.Border = this.editItem.savedItem.Color;
    this.LayerStyleVisibleList.Color = this.editItem.savedItem.BackColor;
    this.LayerStyleVisibleList.Thickness = this.editItem.savedItem.StrokeThickness * 10;
    this.LayerStyleVisibleList.Transparency = 100 - (this.editItem.savedItem.Opacity * 100);
    if (this.circleStyleIcon.length == 0)
      this.CreateCircleIcon();
    setTimeout(() => {
      this.FillColorandCorderColor();
    }, 100);
  }

  LoadEditForPolygon() {
    this.activeDrawtool = 8;
    this.LayerStyleVisibleList.Border = this.editItem.savedItem.Color;
    this.LayerStyleVisibleList.Color = this.editItem.savedItem.BackColor;
    this.LayerStyleVisibleList.Thickness = this.editItem.savedItem.StrokeThickness * 10;
    this.LayerStyleVisibleList.Transparency = 100 - (this.editItem.savedItem.Opacity * 100);
    if (this.freehandpolygonStyleIcon.length == 0)
      this.CreateFreehandpolygonIcon();
    setTimeout(() => {
      this.FillColorandCorderColor();
    }, 100);
  }

  LoadEditForLabel() {
    this.activeDrawtool = 10;
    this.LayerStyleVisibleList.Color = this.editItem.savedItem.Color;
    this.LayerStyleVisibleList.Size = this.editItem.savedItem.FontSize;
    this.LayerStyleVisibleList.Transparency = 100 - (this.editItem.savedItem.Opacity * 100);

    this.LayerStyleVisibleList.labelSize = this.editItem.savedItem.FontSize + 'px';
    this.LayerStyleVisibleList.Size = (this.editItem.savedItem.FontSize - 10) * 5;
    this.textlabel = this.editItem.savedItem.Name;

    setTimeout(() => {
      this.FillColorandCorderColor();
    }, 100);
  }

  DeleteSelectedTool() {
    if (this.editItem && this.editItem.savedItem) {
      this.editItem.savedItem['IsDeleted'] = 1;
      this.editItem.mapItem.setMap(null);
      this.drawingToolService.UpdateEditObj(this.editItem.savedItem, this.editItem.mapItem);
      this.drawingToolService.selectedEditLayer.next(null);
    }
  }

  UpdateTools() {
    const config: ModalOptions = { class: 'modal-sm modal-dialog-centered', backdrop: 'static', animated: false };
    let bsModalRef = this.bsModalService.show(SaveDrawToolsComponent, config);
    bsModalRef.content.isSaved.take(1).subscribe((value) => {
      if (value == true)
        this.CloseModal();
    });
    bsModalRef.content.EditLayerId = this.EditLayerId;
  }
}

