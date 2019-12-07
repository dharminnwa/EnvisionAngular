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
var Utility_service_1 = require("../../../../services/Utility.service");
var feedback_1 = require("../../../../models/feedback");
var auth_service_1 = require("../../../../services/auth.service");
var all_http_request_service_1 = require("../../../../services/all-http-request.service");
var MapLayerFeedbackComponent = (function () {
    function MapLayerFeedbackComponent(activeModal, utilityService, authService, httpRequestService) {
        this.activeModal = activeModal;
        this.utilityService = utilityService;
        this.authService = authService;
        this.httpRequestService = httpRequestService;
        this.message = '';
    }
    MapLayerFeedbackComponent.prototype.ngOnInit = function () {
        this.utilityService.CloseModalOnRouteChange(this.activeModal);
        this.Draggable();
        this.InitObject();
    };
    MapLayerFeedbackComponent.prototype.Draggable = function () {
        setTimeout(function () {
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
        }, 10);
    };
    MapLayerFeedbackComponent.prototype.InitObject = function () {
        this.feedback = new feedback_1.Feedback();
        this.feedback.Timestamp = new Date();
        this.feedback.IP = '';
        this.feedback.Host = window.location.hostname;
        this.feedback.UserId = this.authService.getLoggedinUserId();
        this.feedback.User = this.authService.GetUsername();
        if (this.data && this.data.energyLayer) {
            var energyLayer = this.data.energyLayer;
            this.feedback.EnergyLayer = energyLayer.DisplayName ? energyLayer.DisplayName : '';
            this.feedback.NodeSqlId = energyLayer.EnergyLayerID ? energyLayer.EnergyLayerID : '';
            this.feedback.EnergyLayerGuid = energyLayer.EnergyLayerGUID ? energyLayer.EnergyLayerGUID : '';
        }
        if (this.data.clickLocation && this.data.clickLocation.lat && this.data.clickLocation.lng) {
            var clickLoc = this.data.clickLocation;
            this.feedback.Clicklocation = "(Lat: " + clickLoc.lat() + ", Long: " + clickLoc.lng() + ")";
        }
        this.feedback.Company = '';
        this.feedback.Description = '';
        if (this.data && this.data.infoData && this.data.infoData.data) {
            var infoData = this.data.infoData.data;
            this.feedback.MSID = infoData.MSID ? infoData.MSID : '';
            this.feedback.ObjectId = infoData.OBJECTID ? infoData.OBJECTID : 0;
        }
        this.feedback.DataSet = '';
        this.feedback.ShapeName = '';
    };
    MapLayerFeedbackComponent.prototype.SendFeedback = function () {
        var _this = this;
        if (this.message.trim() == '')
            return;
        this.feedback.Message = this.message;
        this.httpRequestService._NodeSendLayerFeedback(this.feedback).subscribe(function (data) {
            _this.activeModal.dismiss();
        }, function (error) {
            _this.activeModal.dismiss();
            console.log(error);
        });
    };
    MapLayerFeedbackComponent = __decorate([
        core_1.Component({
            selector: 'app-map-layer-feedback',
            templateUrl: './map-layer-feedback.component.html',
            styleUrls: ['./map-layer-feedback.component.scss']
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal,
            Utility_service_1.UtilityService,
            auth_service_1.AuthenticationService,
            all_http_request_service_1.HttpRequestService])
    ], MapLayerFeedbackComponent);
    return MapLayerFeedbackComponent;
}());
exports.MapLayerFeedbackComponent = MapLayerFeedbackComponent;
//# sourceMappingURL=map-layer-feedback.component.js.map