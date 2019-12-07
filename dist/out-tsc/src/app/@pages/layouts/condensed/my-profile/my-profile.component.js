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
var map_service_service_1 = require("../../../../services/map-service.service");
var base_map_service_1 = require("../../../../services/base-map.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var Utility_service_1 = require("../../../../services/Utility.service");
var all_http_request_service_1 = require("../../../../services/all-http-request.service");
var auth_service_1 = require("../../../../services/auth.service");
var MyProfileComponent = (function () {
    function MyProfileComponent(BaseMapService, MapServiceService, bsModalRef, utilityService, httpRequestService, authenticationService) {
        this.BaseMapService = BaseMapService;
        this.MapServiceService = MapServiceService;
        this.bsModalRef = bsModalRef;
        this.utilityService = utilityService;
        this.httpRequestService = httpRequestService;
        this.authenticationService = authenticationService;
        this.UserName = "";
        this.DisplayName = "";
        this.EmailAddress = "";
        this.ChangePwdnote = "ENvision password must contain a minimum of seven characters, including one nonalphanumeric character:(~!@#$%^*--+='|\(){}[]:;>,.?/).";
        this.OldPassword = "";
        this.NewPassword = "";
        this.ConfirmNewPassword = "";
        this.ValidationError = "";
        this.IsChangepwdSuccessfulmsg = "";
        this.TabEnum = Object.freeze({ "UserDetails": "UserDetails", "Mapsettings": "Mapsettings", "ChangePassword": "ChangePassword" });
        this.ActiveTab = this.TabEnum.UserDetails;
    }
    MyProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.IsChangepwdSuccessfulmsg = "";
        this.ValidationError = "";
        setTimeout(function () {
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
            _this.GetUserDetails();
        }, 100);
    };
    MyProfileComponent.prototype.GetUserDetails = function () {
        var _this = this;
        this.IsChangepwdSuccessfulmsg = "";
        this.ValidationError = "";
        if (this.MapServiceService.MyProfileUserDetails.length == 0) {
            var UserId = this.authenticationService.getLoggedinUserId();
            this.httpRequestService._NodeGetUserDetails(UserId).subscribe(function (data) {
                if (data._Issuccess) {
                    if (data.UserData.length > 0) {
                        _this.MapServiceService.MyProfileUserDetails = data.UserData;
                        _this.UserName = _this.MapServiceService.MyProfileUserDetails[0].UserName;
                        _this.DisplayName = _this.MapServiceService.MyProfileUserDetails[0].DisplayName;
                        _this.EmailAddress = _this.MapServiceService.MyProfileUserDetails[0].Email;
                    }
                }
            }, function (error) {
                console.log(error);
            });
        }
        else {
            this.UserName = this.MapServiceService.MyProfileUserDetails[0].UserName;
            this.DisplayName = this.MapServiceService.MyProfileUserDetails[0].DisplayName;
            this.EmailAddress = this.MapServiceService.MyProfileUserDetails[0].Email;
        }
    };
    MyProfileComponent.prototype.Saveclick = function (SaveMapsetting) {
        var _this = this;
        this.IsChangepwdSuccessfulmsg = "";
        this.ValidationError = "";
        if (document.getElementById("tabUserDetails").parentElement.classList.contains('active'))
            this.ActiveTab = this.TabEnum.UserDetails;
        if (document.getElementById("tabMapsettings").parentElement.classList.contains('active'))
            this.ActiveTab = this.TabEnum.Mapsettings;
        if (document.getElementById("tabChangepassword").parentElement.classList.contains('active'))
            this.ActiveTab = this.TabEnum.ChangePassword;
        switch (this.ActiveTab) {
            case "Mapsettings":
                var List_1 = this.MapServiceService.BaseMapData.getValue();
                if (List_1 && List_1.BaseMapData) {
                    var activeBasemap = List_1.BaseMapData.filter(function (m) { return m.IsDefault == true; })[0];
                    var BaseMapProviderID = activeBasemap.BaseMapProviderID;
                    var UserId = this.authenticationService.getLoggedinUserId();
                    this.httpRequestService._NodeSaveMapsettings(UserId, BaseMapProviderID).subscribe(function (data) {
                        if (data._Issuccess) {
                            if (data.MapSettingData[0].BaseMapProviderID == activeBasemap.BaseMapProviderID)
                                activeBasemap = List_1.BaseMapData.filter(function (m) { return m.BaseMapProviderID == data.MapSettingData[0].BaseMapProviderID; })[0];
                            activeBasemap.IsDefault = true;
                            List_1.MapSettingData = data.MapSettingData;
                            _this.BaseMapService.setBasemap(activeBasemap);
                        }
                    }, function (error) {
                        console.log(error);
                    });
                }
                break;
            case "ChangePassword":
                if (this.NewPassword.length >= 6 && this.ConfirmNewPassword.length >= 6 && this.NewPassword === this.ConfirmNewPassword) {
                    var letters = /^[0-9a-zA-Z]+$/;
                    var nonalphanumeric = "~!@#$%^*--+='|\(){}[]:;>,.?/";
                    var regex = " -_*(!@#$%^&*()_-={}[]:\"<>,.?/~`";
                    var stripped = this.NewPassword.replace(/[A-Za-z0-9]/g, '');
                    var crmstripped = this.ConfirmNewPassword.replace(/[A-Za-z0-9]/g, '');
                    // if (this.NewPassword.match(letters) && this.ConfirmNewPassword.match(letters)) {
                    if (regex.indexOf(stripped) > 0 && regex.indexOf(crmstripped) > 0) {
                        this.ValidationError = "";
                        var oldtext = this.OldPassword;
                        var newtext = this.NewPassword;
                        var UserId = this.authenticationService.getLoggedinUserId();
                        this.httpRequestService._NodeChangePassword(oldtext, newtext, UserId).subscribe(function (data) {
                            if (data.IsSuccessful) {
                                _this.ValidationError = "";
                                _this.IsChangepwdSuccessfulmsg = "Password changed successfully!";
                            }
                            else {
                                _this.ValidationError = "";
                                _this.ValidationError = data.ErrorMessage;
                            }
                            _this.OldPassword = "";
                            _this.NewPassword = "";
                            _this.ConfirmNewPassword = "";
                        }, function (error) {
                            console.log(error);
                        });
                    }
                    else {
                        this.ValidationError = "Non alpha numeric characters in 'newPassword' needs to be greater than or equal to '1'.";
                    }
                    // } else {
                    //   this.ValidationError = "Error occured during change!";
                    // }
                }
                else {
                    this.ValidationError = "The length of parameter 'newPassword' needs to be greater or equal to '7'.";
                }
                break;
        }
    };
    MyProfileComponent.prototype.SaveMapsetting = function () {
    };
    MyProfileComponent.prototype.close = function () {
        this.bsModalRef.hide();
    };
    __decorate([
        core_1.ViewChild("TabHeading"),
        __metadata("design:type", Object)
    ], MyProfileComponent.prototype, "TabHeading", void 0);
    MyProfileComponent = __decorate([
        core_1.Component({
            selector: 'app-my-profile',
            templateUrl: './my-profile.component.html',
            styleUrls: ['./my-profile.component.scss']
        }),
        __metadata("design:paramtypes", [base_map_service_1.BaseMapService,
            map_service_service_1.MapServiceService,
            ngx_bootstrap_1.BsModalRef,
            Utility_service_1.UtilityService,
            all_http_request_service_1.HttpRequestService,
            auth_service_1.AuthenticationService])
    ], MyProfileComponent);
    return MyProfileComponent;
}());
exports.MyProfileComponent = MyProfileComponent;
//# sourceMappingURL=my-profile.component.js.map