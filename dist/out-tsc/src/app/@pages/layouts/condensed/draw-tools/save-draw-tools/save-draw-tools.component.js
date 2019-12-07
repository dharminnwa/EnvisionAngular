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
var modal_1 = require("ngx-bootstrap/modal");
var draw_tools_service_1 = require("../../../../../services/draw-tools.service");
var auth_service_1 = require("../../../../../services/auth.service");
var draw_tool_item_1 = require("../../../../../models/draw-tool-item");
var all_http_request_service_1 = require("../../../../../services/all-http-request.service");
var map_service_service_1 = require("../../../../../services/map-service.service");
var Utility_service_1 = require("../../../../../services/Utility.service");
var message_service_1 = require("../../../../components/message/message.service");
var constants_1 = require("../../../../../models/constants");
var condensed_component_1 = require("../../condensed.component");
var SaveDrawToolsComponent = (function () {
    function SaveDrawToolsComponent(bsModalRef, drawToolsService, authService, allHttpRequestService, mapService, utilityService, _notification, injector) {
        this.bsModalRef = bsModalRef;
        this.drawToolsService = drawToolsService;
        this.authService = authService;
        this.allHttpRequestService = allHttpRequestService;
        this.mapService = mapService;
        this.utilityService = utilityService;
        this._notification = _notification;
        this.injector = injector;
        this.description = '';
        this.isShared = false;
        this.isDeletedAllLayers = false;
        this.isLoading = false;
        this.isSaved = new core_1.EventEmitter();
        this.condensedComponent = injector.get(condensed_component_1.CondensedComponent);
    }
    SaveDrawToolsComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('.modal-backdrop').show();
        $('#draw-tools').css("z-index", "99");
        this.userId = this.authService.getLoggedinUserId();
        setTimeout(function () {
            var drawingLayers = _this.mapService.DrawToolTreenode.getValue();
            if (drawingLayers && drawingLayers.length > 0) {
                var selectedItem = drawingLayers.find(function (x) { return x.EditableLayerID == _this.EditLayerId; });
                if (selectedItem && selectedItem.Name) {
                    _this.layerName = selectedItem.Name;
                    _this.description = selectedItem.Description;
                    if (selectedItem.isShared)
                        _this.isShared = true;
                    else
                        _this.isShared = false;
                }
                else {
                    _this.SetSharedLayerData();
                }
            }
            else {
                _this.SetSharedLayerData();
            }
            if (_this.EditLayerId)
                _this.isDeletedAllLayers = _this.getAllDeletedLayers();
        }, 100);
    };
    SaveDrawToolsComponent.prototype.SetSharedLayerData = function () {
        var _this = this;
        var sharedDrawToolsNode = this.mapService.SharedDrawToolTreenode.getValue();
        if (sharedDrawToolsNode && sharedDrawToolsNode.length > 0) {
            var selectedSharedDrawTool = sharedDrawToolsNode.find(function (x) { return x.EditableLayerID == _this.EditLayerId; });
            if (selectedSharedDrawTool) {
                this.layerName = selectedSharedDrawTool.Name;
                this.description = selectedSharedDrawTool.Description;
                if (selectedSharedDrawTool.isShared)
                    this.isShared = true;
                else
                    this.isShared = false;
            }
        }
    };
    SaveDrawToolsComponent.prototype.CloseModal = function () {
        $('.modal-backdrop').hide();
        $('#draw-tools').css("z-index", "");
        this.bsModalRef.hide();
    };
    SaveDrawToolsComponent.prototype.saveDrawToolData = function () {
        if (this.EditLayerId)
            this.UpdateDrawingLayer();
        else
            this.SaveDrawingLayer();
    };
    SaveDrawToolsComponent.prototype.SaveDrawingLayer = function () {
        var _this = this;
        this.isLoading = true;
        var layers = this.getDrawToolsLayer();
        var userId = this.authService.getLoggedinUserId();
        var layerId = 0;
        if (this.EditLayerId)
            layerId = this.EditLayerId;
        var data = {
            editableLayer: {
                Name: this.layerName,
                Description: this.description,
                UserGuid: userId,
                isShared: this.isShared
            },
            layers: layers,
            LayerId: layerId
        };
        this.allHttpRequestService._NodeSaveDrawTools(data).subscribe(function (data) {
            _this.isLoading = false;
            if (data._Issuccess == true) {
                _this.CloseModal();
                _this.isSaved.emit(true);
                var drawToolsNode = _this.mapService.DrawToolTreenode.getValue();
                if (!drawToolsNode)
                    drawToolsNode = [];
                var savedItem_1 = data.layer;
                if (savedItem_1) {
                    savedItem_1['isChecked'] = false;
                    drawToolsNode.push(savedItem_1);
                    _this.mapService.setDrawToolTreenode(drawToolsNode);
                    _this.showSuccessMsg("Draw Tools Saved Successfully");
                    setTimeout(function () {
                        var newCheckbox = $('#' + savedItem_1.EditableLayerID + 'LoadlayerinDrawToolData');
                        if (newCheckbox) {
                            newCheckbox.click();
                            setTimeout(function () {
                                _this.utilityService.OpenCloseDrawToolLayerAreaOnSidebar(true);
                            }, 150);
                        }
                    }, 100);
                }
            }
            else {
                if (data.errMsg)
                    _this.showErr(data.errMsg);
            }
        });
    };
    SaveDrawToolsComponent.prototype.UpdateDrawingLayer = function () {
        var _this = this;
        this.isLoading = true;
        var layers = this.getUpdatedDrawToolsLayer();
        var userId = this.authService.getLoggedinUserId();
        var data = {
            editableLayer: {
                Name: this.layerName,
                Description: this.description,
                UserGuid: userId,
                isShared: this.isShared
            },
            layerID: this.EditLayerId,
            layers: layers
        };
        this.allHttpRequestService._NodeUpdateDrawTools(data).subscribe(function (data) {
            _this.isLoading = false;
            if (data._Issuccess == true) {
                var newLayerData = _this.drawToolsService.AllDrawingLayerList.getValue();
                if (newLayerData && newLayerData.length > 0) {
                    _this.SaveDrawingLayer();
                }
                else {
                    _this.CloseModal();
                    _this.isSaved.emit(true);
                }
                var drawToolsNode = _this.mapService.DrawToolTreenode.getValue();
                var selectedDrawTool = drawToolsNode.find(function (x) { return x.EditableLayerID == _this.EditLayerId; });
                if (selectedDrawTool) {
                    selectedDrawTool.Name = _this.layerName;
                    selectedDrawTool.Description = _this.description;
                    _this.mapService.setDrawToolTreenode(drawToolsNode);
                }
                else {
                    var sharedDrawToolsNode = _this.mapService.SharedDrawToolTreenode.getValue();
                    var selectedSharedDrawTool = sharedDrawToolsNode.find(function (x) { return x.EditableLayerID == _this.EditLayerId; });
                    if (selectedSharedDrawTool) {
                        selectedSharedDrawTool.Name = _this.layerName;
                        selectedSharedDrawTool.Description = _this.description;
                        _this.mapService.setSharedDrawToolTreenode(sharedDrawToolsNode);
                    }
                }
                _this.showSuccessMsg("Draw Tools Updated Successfully");
                setTimeout(function () {
                    var newCheckbox = $('#' + _this.EditLayerId + 'LoadlayerinDrawToolData');
                    if (newCheckbox) {
                        newCheckbox.click();
                        setTimeout(function () {
                            _this.utilityService.OpenCloseDrawToolLayerAreaOnSidebar(true);
                        }, 150);
                    }
                }, 300);
            }
            else {
                if (data.errMsg)
                    _this.showErr(data.errMsg);
            }
        });
    };
    SaveDrawToolsComponent.prototype.getCommonDrawToolObj = function () {
        var obj = new draw_tool_item_1.DrawToolItem();
        obj.FontSize = 0;
        obj.UserId = this.userId;
        obj.Visible = 0;
        obj.IsDeleted = 0;
        obj.LineStyle = "Solid";
        return obj;
    };
    SaveDrawToolsComponent.prototype.getDrawToolsLayer = function () {
        var layer = [];
        var toolsItem = this.drawToolsService.AllDrawingLayerList.getValue();
        if (toolsItem && toolsItem.length > 0) {
            for (var i = 0; i < toolsItem.length; i++) {
                var obj = this.getCommonDrawToolObj();
                var item = toolsItem[i];
                obj = this.getDrawToolObj(obj, item.DrawingManagerId, item.DrawingItem);
                layer.push(obj);
            }
        }
        return layer;
    };
    SaveDrawToolsComponent.prototype.getUpdatedDrawToolsLayer = function () {
        var layer = [];
        var updatedLayer = this.drawToolsService.AllEditedLayerList.getValue();
        if (updatedLayer && updatedLayer.length > 0) {
            for (var i = 0; i < updatedLayer.length; i++) {
                var obj = this.getCommonDrawToolObj();
                var item = updatedLayer[i];
                obj = this.getUpdatedDrawToolObj(obj, item);
                layer.push(obj);
            }
        }
        return layer;
    };
    SaveDrawToolsComponent.prototype.getUpdatedDrawToolObj = function (commonobj, item) {
        if (item && item.updatedItem && item.mapItem) {
            var savedItem = item.updatedItem;
            if (savedItem.ShapeType == 'Point')
                commonobj = this.getObjforPoint(commonobj, item.mapItem);
            else if (savedItem.ShapeType == 'Line')
                commonobj = this.getObjforLine(commonobj, item.mapItem);
            else if (savedItem.ShapeType == 'Rectangle')
                commonobj = this.getObjforRectangle(commonobj, item.mapItem);
            else if (savedItem.ShapeType == 'Circle')
                commonobj = this.getObjforCircle(commonobj, item.mapItem);
            else if (savedItem.ShapeType == 'Polygon' || savedItem.ShapeType == 'Triangle')
                commonobj = this.getObjforPolygon(commonobj, item.mapItem);
            else if (savedItem.ShapeType == 'Label')
                commonobj = this.getObjforLabel(commonobj, item.mapItem);
            commonobj['Id'] = savedItem.Id;
            commonobj['IsDeleted'] = savedItem.IsDeleted;
        }
        return commonobj;
    };
    SaveDrawToolsComponent.prototype.getDrawToolObj = function (commonobj, drawingId, drawingItem) {
        if (drawingId == 1) {
            commonobj = this.getObjforPoint(commonobj, drawingItem);
        }
        else if (drawingId == 2 || drawingId == 3 || drawingId == 4) {
            commonobj = this.getObjforLine(commonobj, drawingItem);
            if (drawingId == 3)
                commonobj.SubType = 'PolyLine';
            if (drawingId == 4)
                commonobj.SubType = 'FreehandPolyLine';
        }
        else if (drawingId == 5 || drawingId == 8 || drawingId == 9) {
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
        }
        else if (drawingId == 6) {
            commonobj = this.getObjforRectangle(commonobj, drawingItem);
        }
        else if (drawingId == 7) {
            commonobj = this.getObjforCircle(commonobj, drawingItem);
        }
        else if (drawingId == 10) {
            commonobj = this.getObjforLabel(commonobj, drawingItem);
        }
        return commonobj;
    };
    SaveDrawToolsComponent.prototype.getObjforPoint = function (obj, drawingItem) {
        obj.ShapeType = 'Point';
        if (drawingItem.getIcon) {
            var icon = drawingItem.getIcon();
            if (icon && icon.url) {
                var iconObj = this.ObjectFromURL(icon.url);
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
    };
    SaveDrawToolsComponent.prototype.getObjforLine = function (obj, drawingItem) {
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
        var path = drawingItem.getPath().getArray();
        obj.ShapeGeo = this.getLineStringFromPathArray(path);
        return obj;
    };
    SaveDrawToolsComponent.prototype.getObjforPolygon = function (obj, drawingItem) {
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
        var path = drawingItem.getPath().getArray();
        obj.ShapeGeo = this.getLineStringFromPathArray(path);
        return obj;
    };
    SaveDrawToolsComponent.prototype.getObjforRectangle = function (obj, drawingItem) {
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
            var lineString = 'LINESTRING (';
            var bounds = drawingItem.getBounds();
            var start = bounds.getNorthEast();
            var end = bounds.getSouthWest();
            lineString += start.lng() + ' ' + start.lat() + ', ';
            lineString += end.lng() + ' ' + end.lat() + ')';
            obj.ShapeGeo = lineString;
        }
        return obj;
    };
    SaveDrawToolsComponent.prototype.getObjforCircle = function (obj, drawingItem) {
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
    };
    SaveDrawToolsComponent.prototype.getObjforLabel = function (obj, drawingItem) {
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
    };
    SaveDrawToolsComponent.prototype.getLineStringFromPathArray = function (array) {
        if (array && array.length > 0) {
            var lineString = 'LINESTRING (';
            for (var i = 0; i < array.length; i++) {
                var cords = array[i];
                lineString += cords.lng() + ' ' + cords.lat();
                if (array.length != (i + 1))
                    lineString += ', ';
            }
            lineString += ')';
            return lineString;
        }
        return '';
    };
    SaveDrawToolsComponent.prototype.ObjectFromURL = function (url) {
        return JSON.parse('{"' + decodeURI(url).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    };
    SaveDrawToolsComponent.prototype.showSuccessMsg = function (msg) {
        this._notification.create(constants_1.NotificationColor.Success, msg, {
            Position: constants_1.NotificationPosition.TopRight,
            Style: constants_1.NotificationStyle.Simple,
            Duration: constants_1.NotificationDuration
        });
    };
    SaveDrawToolsComponent.prototype.showErr = function (msg) {
        this._notification.create(constants_1.NotificationColor.Danger, msg, {
            Position: constants_1.NotificationPosition.TopRight,
            Style: constants_1.NotificationStyle.Simple,
            Duration: constants_1.NotificationDuration
        });
    };
    SaveDrawToolsComponent.prototype.getAllDeletedLayers = function () {
        var isDeletedAll = false;
        var updatedlayers = this.drawToolsService.AllEditedLayerList.getValue();
        if (updatedlayers && updatedlayers.length > 0) {
            var allLayers = this.drawToolsService.AllLodedLayersOnMap.getValue();
            if (allLayers && allLayers.length == updatedlayers.length) {
                var deletedLayers = updatedlayers.filter(function (x) { return x.updatedItem.IsDeleted && x.updatedItem.IsDeleted == 1; });
                if (deletedLayers && deletedLayers.length == allLayers.length) {
                    var newLayers = this.drawToolsService.AllDrawingLayerList.getValue();
                    if (newLayers.length == 0)
                        isDeletedAll = true;
                }
            }
        }
        return isDeletedAll;
    };
    SaveDrawToolsComponent.prototype.DeleteDrawTools = function () {
        var _this = this;
        this.bsModalRef.hide();
        this.isSaved.emit(true);
        if (this.EditLayerId && !this.isShared) {
            this.drawToolsService.RemoveAddedLayer(this.EditLayerId);
            this.allHttpRequestService._NodeDeleteDrawTools(this.EditLayerId).subscribe(function (data) {
                if (data && data._Issuccess == true) {
                    var drawData = _this.mapService.DrawToolTreenode.getValue();
                    if (drawData && drawData.length > 0) {
                        var drawIndex = drawData.findIndex(function (x) { return x.EditableLayerID == _this.EditLayerId; });
                        if (drawIndex > -1) {
                            drawData.splice(drawIndex, 1);
                            _this.mapService.DrawToolTreenode.next(drawData);
                        }
                    }
                }
            });
        }
        else if (this.EditLayerId && this.isShared) {
            this.drawToolsService.RemoveAddedLayer(this.EditLayerId);
            var userId = this.authService.getLoggedinUserId();
            var data = {
                HTML_EditableLayerID: this.EditLayerId,
                UserGuid: userId
            };
            this.allHttpRequestService._NodeDeleteSharedDrawTools(data).subscribe(function (data) {
                if (data && data._Issuccess == true)
                    _this.condensedComponent.DeleteSharedLayerNode(_this.EditLayerId);
            });
        }
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], SaveDrawToolsComponent.prototype, "isSaved", void 0);
    SaveDrawToolsComponent = __decorate([
        core_1.Component({
            selector: 'app-save-draw-tools',
            templateUrl: './save-draw-tools.component.html',
            styleUrls: ['./save-draw-tools.component.scss']
        }),
        __metadata("design:paramtypes", [modal_1.BsModalRef,
            draw_tools_service_1.DrawingToolService,
            auth_service_1.AuthenticationService,
            all_http_request_service_1.HttpRequestService,
            map_service_service_1.MapServiceService,
            Utility_service_1.UtilityService,
            message_service_1.MessageService,
            core_1.Injector])
    ], SaveDrawToolsComponent);
    return SaveDrawToolsComponent;
}());
exports.SaveDrawToolsComponent = SaveDrawToolsComponent;
//# sourceMappingURL=save-draw-tools.component.js.map