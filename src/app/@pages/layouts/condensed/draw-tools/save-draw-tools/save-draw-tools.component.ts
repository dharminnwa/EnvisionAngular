import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DrawingToolService } from '../../../../../services/draw-tools.service';
import { AuthenticationService } from '../../../../../services/auth.service';
import { DrawToolItem } from '../../../../../models/draw-tool-item';
import { HttpRequestService } from '../../../../../services/all-http-request.service';
import { MapServiceService } from '../../../../../services/map-service.service';
import { UtilityService } from '../../../../../services/Utility.service';
import { MessageService } from '../../../../components/message/message.service';
import { NotificationColor, NotificationPosition, NotificationStyle, NotificationDuration } from '../../../../../models/constants';
import { CondensedComponent } from '../../condensed.component';
declare var $: any;

@Component({
  selector: 'app-save-draw-tools',
  templateUrl: './save-draw-tools.component.html',
  styleUrls: ['./save-draw-tools.component.scss']
})
export class SaveDrawToolsComponent implements OnInit {

  layerName: string;
  description: string = '';
  userId: string;
  EditLayerId: any;
  isShared: boolean = false;
  isDeletedAllLayers: boolean = false;
  isLoading: boolean = false;
  condensedComponent: CondensedComponent;
  @Output() isSaved = new EventEmitter();

  constructor(public bsModalRef: BsModalRef,
    private drawToolsService: DrawingToolService,
    private authService: AuthenticationService,
    private allHttpRequestService: HttpRequestService,
    private mapService: MapServiceService,
    private utilityService: UtilityService,
    private _notification: MessageService,
    private injector: Injector) {
    this.condensedComponent = injector.get(CondensedComponent);
  }

  ngOnInit() {
    $('.modal-backdrop').show();
    $('#draw-tools').css("z-index", "99");
    this.userId = this.authService.getLoggedinUserId();
    setTimeout(() => {
      let drawingLayers = this.mapService.DrawToolTreenode.getValue();
      if (drawingLayers && drawingLayers.length > 0) {
        let selectedItem = drawingLayers.find(x => x.EditableLayerID == this.EditLayerId);
        if (selectedItem && selectedItem.Name) {
          this.layerName = selectedItem.Name;
          this.description = selectedItem.Description;
          if (selectedItem.isShared)
            this.isShared = true;
          else
            this.isShared = false;
        } else {
          this.SetSharedLayerData();
        }
      } else {
        this.SetSharedLayerData();
      }
      if (this.EditLayerId)
        this.isDeletedAllLayers = this.getAllDeletedLayers();
    }, 100);
  }

  SetSharedLayerData() {
    let sharedDrawToolsNode = this.mapService.SharedDrawToolTreenode.getValue();
    if (sharedDrawToolsNode && sharedDrawToolsNode.length > 0) {
      let selectedSharedDrawTool = sharedDrawToolsNode.find(x => x.EditableLayerID == this.EditLayerId);
      if (selectedSharedDrawTool) {
        this.layerName = selectedSharedDrawTool.Name;
        this.description = selectedSharedDrawTool.Description;
        if (selectedSharedDrawTool.isShared)
          this.isShared = true;
        else
          this.isShared = false;
      }
    }
  }

  CloseModal() {
    $('.modal-backdrop').hide();
    $('#draw-tools').css("z-index", "");
    this.bsModalRef.hide();
  }

  saveDrawToolData() {
    if (this.EditLayerId)
      this.UpdateDrawingLayer();
    else
      this.SaveDrawingLayer();
  }

  SaveDrawingLayer() {
    this.isLoading = true;
    let layers = this.getDrawToolsLayer();
    let userId = this.authService.getLoggedinUserId();
    let layerId = 0;
    if (this.EditLayerId)
      layerId = this.EditLayerId;
    let data = {
      editableLayer: {
        Name: this.layerName,
        Description: this.description,
        UserGuid: userId,
        isShared: this.isShared
      },
      layers: layers,
      LayerId: layerId
    };
    this.allHttpRequestService._NodeSaveDrawTools(data).subscribe(data => {
      this.isLoading = false;
      if (data._Issuccess == true) {
        this.CloseModal();
        this.isSaved.emit(true);
        let drawToolsNode = this.mapService.DrawToolTreenode.getValue();
        if (!drawToolsNode)
          drawToolsNode = [];
        let savedItem = data.layer;
        if (savedItem) {
          savedItem['isChecked'] = false;
          drawToolsNode.push(savedItem);
          this.mapService.setDrawToolTreenode(drawToolsNode);
          this.showSuccessMsg("Draw Tools Saved Successfully");

          setTimeout(() => {
            let newCheckbox = $('#' + savedItem.EditableLayerID + 'LoadlayerinDrawToolData');
            if (newCheckbox) {
              newCheckbox.click();
              setTimeout(() => {
                this.utilityService.OpenCloseDrawToolLayerAreaOnSidebar(true);
              }, 150);
            }
          }, 100);
        }
      } else {
        if (data.errMsg)
          this.showErr(data.errMsg);
      }
    })
  }

  UpdateDrawingLayer() {
    this.isLoading = true;
    let layers = this.getUpdatedDrawToolsLayer();
    let userId = this.authService.getLoggedinUserId();
    let data = {
      editableLayer: {
        Name: this.layerName,
        Description: this.description,
        UserGuid: userId,
        isShared: this.isShared
      },
      layerID: this.EditLayerId,
      layers: layers
    };
    this.allHttpRequestService._NodeUpdateDrawTools(data).subscribe(data => {
      this.isLoading = false;
      if (data._Issuccess == true) {
        let newLayerData = this.drawToolsService.AllDrawingLayerList.getValue();
        if (newLayerData && newLayerData.length > 0) {
          this.SaveDrawingLayer();
        } else {
          this.CloseModal();
          this.isSaved.emit(true);
        }
        let drawToolsNode = this.mapService.DrawToolTreenode.getValue();
        let selectedDrawTool = drawToolsNode.find(x => x.EditableLayerID == this.EditLayerId);
        if (selectedDrawTool) {
          selectedDrawTool.Name = this.layerName;
          selectedDrawTool.Description = this.description;
          this.mapService.setDrawToolTreenode(drawToolsNode);
        } else {
          let sharedDrawToolsNode = this.mapService.SharedDrawToolTreenode.getValue();
          let selectedSharedDrawTool = sharedDrawToolsNode.find(x => x.EditableLayerID == this.EditLayerId);
          if (selectedSharedDrawTool) {
            selectedSharedDrawTool.Name = this.layerName;
            selectedSharedDrawTool.Description = this.description;
            this.mapService.setSharedDrawToolTreenode(sharedDrawToolsNode);
          }
        }
        this.showSuccessMsg("Draw Tools Updated Successfully");
        setTimeout(() => {
          let newCheckbox = $('#' + this.EditLayerId + 'LoadlayerinDrawToolData');
          if (newCheckbox) {
            newCheckbox.click();
            setTimeout(() => {
              this.utilityService.OpenCloseDrawToolLayerAreaOnSidebar(true);
            }, 150);
          }
        }, 300);
      } else {
        if (data.errMsg)
          this.showErr(data.errMsg);
      }
    })
  }

  getCommonDrawToolObj() {
    let obj = new DrawToolItem();
    obj.FontSize = 0;
    obj.UserId = this.userId;
    obj.Visible = 0;
    obj.IsDeleted = 0;
    obj.LineStyle = "Solid";
    return obj;
  }

  getDrawToolsLayer() {
    let layer = [];
    let toolsItem = this.drawToolsService.AllDrawingLayerList.getValue();
    if (toolsItem && toolsItem.length > 0) {
      for (let i = 0; i < toolsItem.length; i++) {
        let obj: DrawToolItem = this.getCommonDrawToolObj();
        let item = toolsItem[i];
        obj = this.getDrawToolObj(obj, item.DrawingManagerId, item.DrawingItem);
        layer.push(obj)
      }
    }
    return layer;
  }

  getUpdatedDrawToolsLayer() {
    let layer = [];
    let updatedLayer = this.drawToolsService.AllEditedLayerList.getValue();
    if (updatedLayer && updatedLayer.length > 0) {
      for (let i = 0; i < updatedLayer.length; i++) {
        let obj: DrawToolItem = this.getCommonDrawToolObj();
        let item = updatedLayer[i];
        obj = this.getUpdatedDrawToolObj(obj, item);
        layer.push(obj)
      }
    }
    return layer;
  }

  getUpdatedDrawToolObj(commonobj: DrawToolItem, item) {
    if (item && item.updatedItem && item.mapItem) {
      let savedItem = item.updatedItem;
      if (savedItem.ShapeType == 'Point')
        commonobj = this.getObjforPoint(commonobj, item.mapItem);
      else if (savedItem.ShapeType == 'Line')
        commonobj = this.getObjforLine(commonobj, item.mapItem);
      else if (savedItem.ShapeType == 'Rectangle')
        commonobj = this.getObjforRectangle(commonobj, item.mapItem);
      else if (savedItem.ShapeType == 'Circle')
        commonobj = this.getObjforCircle(commonobj, item.mapItem);
      else if (savedItem.ShapeType == 'Polygon' || savedItem.ShapeType == 'Triangle' || savedItem.ShapeType == 'LeftArrow' || savedItem.ShapeType == 'RightArrow' || savedItem.ShapeType == 'UpArrow' || savedItem.ShapeType == 'DownArrow')
        commonobj = this.getObjforPolygon(commonobj, item.mapItem);
      else if (savedItem.ShapeType == 'Label')
        commonobj = this.getObjforLabel(commonobj, item.mapItem);
      commonobj['Id'] = savedItem.Id;
      commonobj['IsDeleted'] = savedItem.IsDeleted;
    }
    return commonobj;
  }

  getDrawToolObj(commonobj: DrawToolItem, drawingId: number, drawingItem: any) {
    if (drawingId == 1) {
      commonobj = this.getObjforPoint(commonobj, drawingItem);
    } else if (drawingId == 2 || drawingId == 3 || drawingId == 4) {
      commonobj = this.getObjforLine(commonobj, drawingItem);
      if (drawingId == 3)
        commonobj.SubType = 'PolyLine'
      if (drawingId == 4)
        commonobj.SubType = 'FreehandPolyLine'
    } else if (drawingId == 5 || drawingId == 8 || drawingId == 9 || drawingId == 11 || drawingId == 12 || drawingId == 13 || drawingId == 14) {
      commonobj = this.getObjforPolygon(commonobj, drawingItem);
      if (drawingId == 5) {
        commonobj.ShapeType = 'Triangle';
        commonobj.Name = 'Triangle';
        commonobj.Description = 'Triangle';
        commonobj.SubType = 'Triangle';
      }
      if (drawingId == 9) {
        commonobj.Name = 'Freehand Polygon';
        commonobj.Description = 'Freehand Polygon';
        commonobj.SubType = 'FreehandPolygon';
      }
      if (drawingId == 11) {
        commonobj.ShapeType = 'LeftArrow';
        commonobj.Name = 'LeftArrow';
        commonobj.Description = 'LeftArrow';
        commonobj.SubType = 'LeftArrow';
      }
      if (drawingId == 12) {
        commonobj.ShapeType = 'RightArrow';
        commonobj.Name = 'RightArrow';
        commonobj.Description = 'RightArrow';
        commonobj.SubType = 'RightArrow';
      }
      if (drawingId == 13) {
        commonobj.ShapeType = 'UpArrow';
        commonobj.Name = 'UpArrow';
        commonobj.Description = 'UpArrow';
        commonobj.SubType = 'UpArrow';
      }
      if (drawingId == 14) {
        commonobj.ShapeType = 'DownArrow';
        commonobj.Name = 'DownArrow';
        commonobj.Description = 'DownArrow';
        commonobj.SubType = 'DownArrow';
      }
    } else if (drawingId == 6) {
      commonobj = this.getObjforRectangle(commonobj, drawingItem);
    } else if (drawingId == 7) {
      commonobj = this.getObjforCircle(commonobj, drawingItem);
    } else if (drawingId == 10) {
      commonobj = this.getObjforLabel(commonobj, drawingItem);
    }
    return commonobj;
  }

  getObjforPoint(obj: DrawToolItem, drawingItem) {
    obj.ShapeType = 'Point';
    if (drawingItem.getIcon) {
      let icon = drawingItem.getIcon();
      if (icon && icon.url) {
        let iconObj = this.ObjectFromURL(icon.url);
        if (iconObj) {
          if (iconObj.IconType) {
            obj.SubType = iconObj.IconType;
            obj.Name = iconObj.IconType;
            obj.Description = iconObj.IconType;
          }
          if (iconObj.FillColor)
            obj.BackColor = '#' + iconObj.FillColor;
          if (iconObj.StrokeColor)
            obj.Color = '#' + iconObj.StrokeColor;
          if (iconObj.StrokeThicknessPercent)
            obj.StrokeThickness = iconObj.StrokeThicknessPercent;
          if (iconObj.Opacity)
            obj.Opacity = iconObj.Opacity;
          if (iconObj.SizePercent)
            obj.FontSize = iconObj.SizePercent;
        }
      }
    }
    if (drawingItem.position)
      obj.ShapeGeo = 'POINT (' + drawingItem.position.lng() + ' ' + drawingItem.position.lat() + ')';
    return obj;
  }

  getObjforLine(obj: DrawToolItem, drawingItem) {
    obj.ShapeType = 'Line';
    obj.SubType = 'Line';
    obj.Name = 'Line';
    obj.Description = 'Line';
    if (drawingItem.strokeColor) {
      obj.Color = drawingItem.strokeColor;
      obj.BackColor = drawingItem.strokeColor;
    }
    if (drawingItem.strokeWeight)
      obj.StrokeThickness = drawingItem.strokeWeight;
    if (drawingItem.strokeOpacity)
      obj.Opacity = drawingItem.strokeOpacity;
    let path = drawingItem.getPath().getArray();
    obj.ShapeGeo = this.getLineStringFromPathArray(path);
    return obj;
  }

  getObjforPolygon(obj: DrawToolItem, drawingItem) {
    obj.ShapeType = 'Polygon';
    obj.Name = 'Polygon';
    obj.Description = 'Polygon';
    obj.SubType = 'Polygon';
    if (drawingItem.strokeColor)
      obj.Color = drawingItem.strokeColor;
    if (drawingItem.fillColor)
      obj.BackColor = drawingItem.fillColor;

    if (drawingItem.strokeWeight)
      obj.StrokeThickness = drawingItem.strokeWeight;
    if (drawingItem.fillOpacity)
      obj.Opacity = drawingItem.fillOpacity;
    let path = drawingItem.getPath().getArray();
    obj.ShapeGeo = this.getLineStringFromPathArray(path);
    return obj;
  }

  getObjforRectangle(obj: DrawToolItem, drawingItem) {
    obj.ShapeType = 'Rectangle';
    obj.Name = 'Rectangle';
    obj.Description = 'Rectangle';
    if (drawingItem.strokeColor)
      obj.Color = drawingItem.strokeColor;
    if (drawingItem.fillColor)
      obj.BackColor = drawingItem.fillColor;

    if (drawingItem.strokeWeight)
      obj.StrokeThickness = drawingItem.strokeWeight;
    if (drawingItem.fillOpacity)
      obj.Opacity = drawingItem.fillOpacity;

    if (drawingItem && drawingItem.getBounds()) {
      let lineString = 'LINESTRING (';
      var bounds = drawingItem.getBounds();
      var start = bounds.getNorthEast();
      var end = bounds.getSouthWest();
      lineString += start.lng() + ' ' + start.lat() + ', ';
      lineString += end.lng() + ' ' + end.lat() + ')';
      obj.ShapeGeo = lineString;
    }
    return obj;
  }

  getObjforCircle(obj: DrawToolItem, drawingItem) {
    obj.ShapeType = 'Circle';
    obj.Name = 'Circle';
    obj.Description = 'Circle';
    if (drawingItem.strokeColor)
      obj.Color = drawingItem.strokeColor;
    if (drawingItem.fillColor)
      obj.BackColor = drawingItem.fillColor;
    if (drawingItem.strokeWeight)
      obj.StrokeThickness = drawingItem.strokeWeight;
    if (drawingItem.fillOpacity)
      obj.Opacity = drawingItem.fillOpacity;
    if (drawingItem.radius)
      obj.Radius = drawingItem.radius;
    if (drawingItem && drawingItem.center) {
      obj.ShapeGeo = 'POINT (' + drawingItem.center.lng() + ' ' + drawingItem.center.lat() + ')';
    }
    return obj;
  }

  getObjforLabel(obj: DrawToolItem, drawingItem) {
    obj.ShapeType = 'Label';

    obj.SubType = 'Label';
    if (drawingItem && drawingItem.label) {
      if (drawingItem.label.text) {
        obj.Name = drawingItem.label.text;
        obj.Description = drawingItem.label.text;
      }
      if (drawingItem.label.fontSize)
        obj.FontSize = drawingItem.label.fontSize.replace('px', '');
      if (drawingItem.label.color) {
        obj.Color = drawingItem.label.color;
        obj.BackColor = drawingItem.label.color;
      }
    }
    if (drawingItem.opacity) {
      obj.Opacity = drawingItem.opacity;
    }
    if (drawingItem.position)
      obj.ShapeGeo = 'POINT (' + drawingItem.position.lng() + ' ' + drawingItem.position.lat() + ')';
    return obj;
  }

  getLineStringFromPathArray(array) {
    if (array && array.length > 0) {
      let lineString = 'LINESTRING (';
      for (let i = 0; i < array.length; i++) {
        let cords = array[i];
        lineString += cords.lng() + ' ' + cords.lat();
        if (array.length != (i + 1))
          lineString += ', ';
      }
      lineString += ')';
      return lineString;
    }
    return '';
  }

  ObjectFromURL(url) {
    return JSON.parse('{"' + decodeURI(url).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
  }

  showSuccessMsg(msg) {
    this._notification.create(
      NotificationColor.Success,
      msg,
      {
        Position: NotificationPosition.TopRight,
        Style: NotificationStyle.Simple,
        Duration: NotificationDuration
      });
  }

  showErr(msg) {
    this._notification.create(
      NotificationColor.Danger,
      msg,
      {
        Position: NotificationPosition.TopRight,
        Style: NotificationStyle.Simple,
        Duration: NotificationDuration
      });
  }

  getAllDeletedLayers(): boolean {
    let isDeletedAll = false;
    let updatedlayers = this.drawToolsService.AllEditedLayerList.getValue();
    if (updatedlayers && updatedlayers.length > 0) {
      let allLayers = this.drawToolsService.AllLodedLayersOnMap.getValue();
      let currentLayers = allLayers.filter(x => x.layerId == this.EditLayerId);
      if (currentLayers && currentLayers.length == updatedlayers.length) {
        let deletedLayers = updatedlayers.filter(x => x.updatedItem.IsDeleted && x.updatedItem.IsDeleted == 1);
        if (deletedLayers && deletedLayers.length == currentLayers.length) {
          let newLayers = this.drawToolsService.AllDrawingLayerList.getValue();
          if (newLayers.length == 0)
            isDeletedAll = true;
        }
      }
    }
    return isDeletedAll;
  }

  DeleteDrawTools() {
    this.bsModalRef.hide();
    this.isSaved.emit(true);
    if (this.EditLayerId && !this.isShared) {
      this.drawToolsService.RemoveAddedLayer(this.EditLayerId);
      this.allHttpRequestService._NodeDeleteDrawTools(this.EditLayerId).subscribe(data => {
        if (data && data._Issuccess == true) {
          let drawData = this.mapService.DrawToolTreenode.getValue();
          if (drawData && drawData.length > 0) {
            let drawIndex = drawData.findIndex(x => x.EditableLayerID == this.EditLayerId);
            if (drawIndex > -1) {
              drawData.splice(drawIndex, 1);
              this.mapService.DrawToolTreenode.next(drawData);
            }
          }
        }
      })
    } else if (this.EditLayerId && this.isShared) {
      this.drawToolsService.RemoveAddedLayer(this.EditLayerId);
      let userId = this.authService.getLoggedinUserId();
      let data = {
        HTML_EditableLayerID: this.EditLayerId,
        UserGuid: userId
      }
      this.allHttpRequestService._NodeDeleteSharedDrawTools(data).subscribe(data => {
        if (data && data._Issuccess == true)
          this.condensedComponent.DeleteSharedLayerNode(this.EditLayerId);
      })
    }
  }
}
