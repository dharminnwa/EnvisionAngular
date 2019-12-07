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
var condensed_component_1 = require("../../condensed.component");
var auth_service_1 = require("../../../../../services/auth.service");
var constants_1 = require("../../../../../models/constants");
var message_service_1 = require("../../../../components/message/message.service");
var EditMyMapComponent = (function () {
    function EditMyMapComponent(bsModalRef, httpRequestService, mapServiceService, Injector, AuthServices, _notification) {
        this.bsModalRef = bsModalRef;
        this.httpRequestService = httpRequestService;
        this.mapServiceService = mapServiceService;
        this.Injector = Injector;
        this.AuthServices = AuthServices;
        this._notification = _notification;
        this.editMapDescriptionText = "";
        this.EditmapNameText = "";
        this.isShared = false;
        this.condensedComponent = Injector.get(condensed_component_1.CondensedComponent);
    }
    EditMyMapComponent.prototype.ngOnInit = function () {
        this.editMapDescriptionText = this.MapData.Description;
        this.EditmapNameText = this.MapData.Name;
        this.isShared = this.MapData.IsPublic;
        this.mapServiceService.SharedUserList = [];
        if (this.MapData) {
            this.GetSharedUserList();
        }
    };
    EditMyMapComponent.prototype.IsSharedChanged = function () {
        this.isShared = !this.isShared;
    };
    EditMyMapComponent.prototype.GetSharedUserList = function () {
        var _this = this;
        if (this.mapServiceService.SharedUserList.length == 0) {
            var UserID = this.AuthServices.getLoggedinUserId();
            this.httpRequestService._NodeGetListOfCompnayUserList(UserID, this.MapData.CustomMapId).subscribe(function (res) {
                var Data = res;
                if (Data._Issuccess) {
                    _this.mapServiceService.SharedUserList = Data.Data.filter(function (x) { return x.DisplayName != ""; });
                    if (Data.CustomMaps_CooperativeUser && Data.CustomMaps_CooperativeUser.length > 0) {
                        var SelectedList = [];
                        Data.Data.forEach(function (element) {
                            Data.CustomMaps_CooperativeUser.map(function (e) {
                                if (e.UserGuid == element.UserId && e.MapID == _this.MapData.CustomMapId) {
                                    SelectedList.push(element);
                                }
                            });
                        });
                        if (SelectedList.length > 0) {
                            _this.SelectedUser = SelectedList;
                        }
                    }
                }
            }, function (error) {
                console.log(error);
            });
        }
    };
    EditMyMapComponent.prototype.SaveEditmymap = function () {
        var _this = this;
        var Data = {
            CustomMapId: this.MapData.CustomMapId,
            Name: this.EditmapNameText,
            Description: this.editMapDescriptionText,
            IsPublic: this.isShared,
            SelectedUser: this.SelectedUser
        };
        if (!Data.SelectedUser)
            Data.SelectedUser = "";
        this.httpRequestService._NodeSaveSharedMymap(Data).subscribe(function (res) {
            if (res._Issuccess) {
                _this.mapServiceService._UserMapData.getValue().filter(function (m) { return m.Type == 'mymap'; }).forEach(function (element) {
                    if (element.CustomMapId == _this.MapData.CustomMapId) {
                        element.Name = _this.EditmapNameText;
                        element.Description = _this.editMapDescriptionText;
                        element.IsPublic = _this.isShared;
                    }
                });
                _this._notification.create(constants_1.NotificationColor.Success, "The map saved successfully!", {
                    Position: constants_1.NotificationPosition.TopRight,
                    Style: constants_1.NotificationStyle.Simple,
                    Duration: constants_1.NotificationDuration
                });
            }
            else {
                _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                    Position: constants_1.NotificationPosition.TopRight,
                    Style: constants_1.NotificationStyle.Simple,
                    Duration: constants_1.NotificationDuration
                });
            }
        }, function (error) {
            console.log(error);
            _this._notification.create(constants_1.NotificationColor.Danger, "There is some issue to save map!", {
                Position: constants_1.NotificationPosition.TopRight,
                Style: constants_1.NotificationStyle.Simple,
                Duration: constants_1.NotificationDuration
            });
        });
    };
    EditMyMapComponent = __decorate([
        core_1.Component({
            selector: 'app-edit-my-map',
            templateUrl: './edit-my-map.component.html',
            styleUrls: ['./edit-my-map.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            all_http_request_service_1.HttpRequestService,
            map_service_service_1.MapServiceService,
            core_1.Injector,
            auth_service_1.AuthenticationService,
            message_service_1.MessageService])
    ], EditMyMapComponent);
    return EditMyMapComponent;
}());
exports.EditMyMapComponent = EditMyMapComponent;
//# sourceMappingURL=edit-my-map.component.js.map