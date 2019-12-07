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
var all_http_request_service_1 = require("../../../../../services/all-http-request.service");
var map_service_service_1 = require("../../../../../services/map-service.service");
var draw_tools_service_1 = require("../../../../../services/draw-tools.service");
var auth_service_1 = require("../../../../../services/auth.service");
var ConfirmDeleteDrawToolComponent = (function () {
    function ConfirmDeleteDrawToolComponent(bsModalRef, httpService, mapService, drawingToolService, authService) {
        this.bsModalRef = bsModalRef;
        this.httpService = httpService;
        this.mapService = mapService;
        this.drawingToolService = drawingToolService;
        this.authService = authService;
        this.isShared = false;
        this.isDelete = new core_1.EventEmitter();
    }
    ConfirmDeleteDrawToolComponent.prototype.ngOnInit = function () {
    };
    ConfirmDeleteDrawToolComponent.prototype.CloseModal = function () {
        this.bsModalRef.hide();
    };
    ConfirmDeleteDrawToolComponent.prototype.DeleteDrawTool = function () {
        var _this = this;
        this.bsModalRef.hide();
        if (this.layerId && !this.isShared) {
            this.drawingToolService.RemoveAddedLayer(this.layerId);
            this.httpService._NodeDeleteDrawTools(this.layerId).subscribe(function (data) {
                if (data && data._Issuccess == true) {
                    var drawData = _this.mapService.DrawToolTreenode.getValue();
                    if (drawData && drawData.length > 0) {
                        var drawIndex = drawData.findIndex(function (x) { return x.EditableLayerID == _this.layerId; });
                        if (drawIndex > -1) {
                            drawData.splice(drawIndex, 1);
                            _this.mapService.DrawToolTreenode.next(drawData);
                        }
                    }
                }
            });
        }
        else if (this.layerId && this.isShared) {
            this.drawingToolService.RemoveAddedLayer(this.layerId);
            var userId = this.authService.getLoggedinUserId();
            var data = {
                HTML_EditableLayerID: this.layerId,
                UserGuid: userId
            };
            this.httpService._NodeDeleteSharedDrawTools(data).subscribe(function (data) {
                if (data && data._Issuccess == true)
                    _this.isDelete.emit(true);
            });
        }
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ConfirmDeleteDrawToolComponent.prototype, "isDelete", void 0);
    ConfirmDeleteDrawToolComponent = __decorate([
        core_1.Component({
            selector: 'app-confirm-delete-draw-tool',
            templateUrl: './confirm-delete-draw-tool.component.html',
            styleUrls: ['./confirm-delete-draw-tool.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            all_http_request_service_1.HttpRequestService,
            map_service_service_1.MapServiceService,
            draw_tools_service_1.DrawingToolService,
            auth_service_1.AuthenticationService])
    ], ConfirmDeleteDrawToolComponent);
    return ConfirmDeleteDrawToolComponent;
}());
exports.ConfirmDeleteDrawToolComponent = ConfirmDeleteDrawToolComponent;
//# sourceMappingURL=confirm-delete-draw-tool.component.js.map