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
require("rxjs/add/operator/map");
var router_1 = require("@angular/router");
var ngx_cookie_service_1 = require("ngx-cookie-service");
var map_service_service_1 = require("./map-service.service");
var all_http_request_service_1 = require("./all-http-request.service");
var localdata_service_1 = require("./localdata.service");
var AuthenticationService = (function () {
    function AuthenticationService(router, cookieService, MapServiceService, httpService, localDataService) {
        this.router = router;
        this.cookieService = cookieService;
        this.MapServiceService = MapServiceService;
        this.httpService = httpService;
        this.localDataService = localDataService;
    }
    /****************start  Node js  API Logout method  */
    AuthenticationService.prototype.LogoutUserProfile = function () {
        var _this = this;
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            // var UserData = JSON.parse(this.cookieService.get('UserName'));
            if (UserData.IsApproved == true) {
                this.DeleteTempImgData(UserData.UserGuid);
                var LoginHandlerId = UserData.LoginHandlerId;
                this.httpService._NodeLogout(LoginHandlerId, this.getLoggedinUserId()).subscribe(function (data) {
                    var Userjson = JSON.stringify(data);
                    var LogoutUser = JSON.parse(Userjson);
                    if (LogoutUser.isSuccess == true) {
                        _this.resirecttoLogin_ReloadthePage();
                    }
                    else {
                        _this.resirecttoLogin_ReloadthePage();
                    }
                }, function (error) {
                    console.log(error);
                    _this.resirecttoLogin_ReloadthePage();
                });
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        }
        else {
            this.resirecttoLogin_ReloadthePage();
        }
    };
    /****************End  Node js  API Logout method  */
    /****************start Web API Logout method  */
    AuthenticationService.prototype.LogoutUserProfile_Test = function () {
        var _this = this;
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            // var UserData = JSON.parse(this.cookieService.get('UserName'));
            if (UserData.IsApproved == true) {
                var LoginHandlerId = UserData.LoginHandlerId;
                this.httpService.Logout(LoginHandlerId).subscribe(function (data) {
                    var Userjson = data.json();
                    var LogoutUser = JSON.parse(Userjson);
                    if (LogoutUser.isSuccess == true) {
                        _this.resirecttoLogin_ReloadthePage();
                    }
                    else {
                        _this.resirecttoLogin_ReloadthePage();
                    }
                }, function (error) {
                    _this.resirecttoLogin_ReloadthePage();
                });
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        }
        else {
            this.resirecttoLogin_ReloadthePage();
        }
    };
    /****************End Web API Logout methods */
    AuthenticationService.prototype.resirecttoLogin = function () {
        this.router.navigateByUrl('/envision/session/login');
    };
    AuthenticationService.prototype.reloadpage = function () {
        setTimeout(function () {
            document.location.reload();
        }, 1000);
    };
    AuthenticationService.prototype.GetAuthTokan = function () {
        var Tokan = '';
        if (this.cookieService.check("HTMLENvisionToken")) {
            Tokan = this.cookieService.get('HTMLENvisionToken');
        }
        return Tokan;
    };
    AuthenticationService.prototype.GetUserData = function () {
        var UserDataList;
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            // let UserData = JSON.parse(this.cookieService.get('UserName'));
            if (UserData.IsApproved == true) {
                UserDataList = UserData;
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        }
        return UserDataList;
    };
    AuthenticationService.prototype.GetUsername = function () {
        var Username = "";
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            // var UserData = JSON.parse(this.cookieService.get('UserName'));
            if (UserData.IsApproved == true) {
                Username = UserData.UserName;
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        }
        else {
            this.resirecttoLogin_ReloadthePage();
        }
        return Username;
    };
    AuthenticationService.prototype.GetMyProfileUserDetails = function () {
        var UserDetails = {
            UserName: '',
            DisplayName: '',
            EmailAddress: ''
        };
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            // var UserData = JSON.parse(this.cookieService.get('UserName'));
            if (UserData.IsApproved == true) {
                UserDetails.UserName = UserData.UserName;
                UserDetails.DisplayName = UserData.DisplayName;
                UserDetails.EmailAddress = UserData.EMailAddress;
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        }
        else {
            this.resirecttoLogin_ReloadthePage();
        }
        return UserDetails;
    };
    AuthenticationService.prototype.getUserId = function () {
        var LoginId = '';
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            // var UserData = JSON.parse(this.cookieService.get('UserName'));
            if (UserData.IsApproved == true) {
                LoginId = UserData.LoginHandlerId;
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        }
        else {
            this.resirecttoLogin_ReloadthePage();
        }
        return LoginId;
    };
    AuthenticationService.prototype.getCustomerId = function () {
        var CustomerId = '';
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            if (UserData.IsApproved == true) {
                CustomerId = UserData.CustomerId;
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        }
        else {
            this.resirecttoLogin_ReloadthePage();
        }
        return CustomerId;
    };
    AuthenticationService.prototype.getLoggedinUserId = function () {
        var LoginId = '';
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            // if (this.cookieService.check("UserName")) {
            // var UserData = JSON.parse(this.cookieService.get('UserName'));
            if (UserData.IsApproved == true) {
                LoginId = UserData.UserGuid;
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        }
        else {
            this.resirecttoLogin_ReloadthePage();
        }
        return LoginId;
    };
    AuthenticationService.prototype.SetSystemParameter = function (sys) {
        if (this.MapServiceService._Systemperlst.getValue() == null) {
            this.MapServiceService.setSystemParameterList(sys);
        }
        else {
            this.MapServiceService._Systemperlst.getValue().length = 0;
            Array.prototype.push.apply(this.MapServiceService._Systemperlst.getValue(), sys);
        }
    };
    AuthenticationService.prototype.getSystemParameter = function () {
        var SystemParameter;
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            // var UserData = JSON.parse(this.cookieService.get('UserName'));     
            if (UserData.IsApproved == true) {
                if (this.MapServiceService._SystemParameterList) {
                    if (this.MapServiceService._SystemParameterList.getValue()) {
                        SystemParameter = this.MapServiceService._SystemParameterList.getValue();
                    }
                    else {
                        SystemParameter = JSON.parse(localStorage.getItem("SystemParameterlst"));
                    }
                }
                else {
                    this.resirecttoLogin_ReloadthePage();
                }
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        }
        else {
            this.resirecttoLogin_ReloadthePage();
        }
        return SystemParameter;
    };
    AuthenticationService.prototype.GetSystemParameterValue = function (SystemParameterName) {
        var SystemParameterValue = "";
        var sys = this.getSystemParameter();
        for (var s = 0; s < sys.length; s++) {
            var p = sys[s];
            if (p.SystemParameterName == SystemParameterName) {
                SystemParameterValue = p.SystemParameterValue;
            }
        }
        return SystemParameterValue;
    };
    AuthenticationService.prototype.resirecttoLogin_ReloadthePage = function () {
        this.resirecttoLogin();
        this.DeleteAllObjects();
        //this.reloadpage();                
    };
    AuthenticationService.prototype.DeleteTempImgData = function (userId) {
        this.httpService._NodeDeleteGeoImageProp(userId).subscribe(function (x) { }, function (error) { console.log(error); });
    };
    AuthenticationService.prototype.DeleteAllObjects = function () {
        localStorage.clear();
        this.cookieService.deleteAll();
        this.MapServiceService.DestroyAllObjects();
    };
    /*    ---------------------------     */
    /*     Comapny Users Permissions      */
    /*    ---------------------------     */
    AuthenticationService.prototype.ShowAddDataUIBasedOnRole = function () {
        try {
            var userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                var Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Upload Rights") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        }
        catch (e) {
            console.log(e);
            this.resirecttoLogin_ReloadthePage();
        }
    };
    AuthenticationService.prototype.ShowSharedRightsUIBaedOnRole = function () {
        try {
            var userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                var Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Shared Rights") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        }
        catch (e) {
            console.log(e);
            this.resirecttoLogin_ReloadthePage();
        }
    };
    AuthenticationService.prototype.ShowCompanyIntelligenceUIBasedOnRole = function () {
        try {
            var userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                var Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("CompanyProfile") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        }
        catch (e) {
            console.log(e);
            this.resirecttoLogin_ReloadthePage();
        }
    };
    AuthenticationService.prototype.ShowPipelineActivityUIBasedOnRole = function () {
        try {
            var userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                var Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("PipelineActivity") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        }
        catch (e) {
            console.log(e);
            this.resirecttoLogin_ReloadthePage();
        }
    };
    AuthenticationService.prototype.ShowTransmissionUIBasedOnRole = function () {
        try {
            var userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                var Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Transmission") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        }
        catch (e) {
            console.log(e);
            this.resirecttoLogin_ReloadthePage();
        }
    };
    AuthenticationService.prototype.ShowPowerPlantsUIBasedOnRole = function () {
        try {
            var userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                var Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("PowerPlants") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        }
        catch (e) {
            console.log(e);
            this.resirecttoLogin_ReloadthePage();
        }
    };
    AuthenticationService.prototype.ShowGeneratingUnitUIBasedOnRole = function () {
        try {
            var userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                var Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("GHub") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        }
        catch (e) {
            console.log(e);
            this.resirecttoLogin_ReloadthePage();
        }
    };
    AuthenticationService.prototype.ShowParcelBufferToolUIBasedOnRole = function () {
        try {
            var userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                var Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Parcel Buffer Tool Rights") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        }
        catch (e) {
            console.log(e);
            this.resirecttoLogin_ReloadthePage();
        }
    };
    AuthenticationService.prototype.ShowOilAndGasUIBasedOnRole = function () {
        try {
            var userData = this.GetUserData();
            if (userData && userData.LayerCategoriesRoles) {
                var Roles = userData.LayerCategoriesRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Oil and Gas") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        }
        catch (e) {
            console.log(e);
            this.resirecttoLogin_ReloadthePage();
        }
    };
    AuthenticationService.prototype.ShowElectricPowerUIBasedOnRole = function () {
        try {
            var userData = this.GetUserData();
            if (userData && userData.LayerCategoriesRoles) {
                var Roles = userData.LayerCategoriesRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Electric Power") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        }
        catch (e) {
            console.log(e);
            this.resirecttoLogin_ReloadthePage();
        }
    };
    AuthenticationService.prototype.ShowParcelLookupWidgetUIBasedOnRole = function () {
        try {
            var userData = this.GetUserData();
            if (userData && userData.LayerCategoriesRoles) {
                var Roles = userData.LayerCategoriesRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Parcel Data") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        }
        catch (e) {
            console.log(e);
            this.resirecttoLogin_ReloadthePage();
        }
    };
    AuthenticationService.prototype.ShowWellLookupWidgetUIBasedOnRole = function () {
        try {
            var userData = this.GetUserData();
            if (userData && userData.LayerCategoriesRoles) {
                var Roles = userData.LayerCategoriesRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Wells") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        }
        catch (e) {
            console.log(e);
            this.resirecttoLogin_ReloadthePage();
        }
    };
    AuthenticationService.prototype.ShowExportDataGridRightsUIBasedOnRole = function () {
        try {
            var userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                var Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Export Data Grid Rights") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        }
        catch (e) {
            console.log(e);
            this.resirecttoLogin_ReloadthePage();
        }
    };
    AuthenticationService.prototype.ShowRailWizardcreateLayerRightsUIBasedOnRole = function () {
        try {
            var userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                var Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Rail Wizard") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        }
        catch (e) {
            console.log(e);
            this.resirecttoLogin_ReloadthePage();
        }
    };
    AuthenticationService.prototype.ShowPipelineWizardcreateLayerRightsUIBasedOnRole = function () {
        try {
            var userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                var Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Pipeline Wizard") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        }
        catch (e) {
            console.log(e);
            this.resirecttoLogin_ReloadthePage();
        }
    };
    AuthenticationService.prototype.ShowSiteSelectionWizardRightsRightsUIBasedOnRole = function () {
        try {
            var userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                var Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Site Selection Wizard Rights") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        }
        catch (e) {
            console.log(e);
            this.resirecttoLogin_ReloadthePage();
        }
    };
    AuthenticationService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router,
            ngx_cookie_service_1.CookieService,
            map_service_service_1.MapServiceService,
            all_http_request_service_1.HttpRequestService,
            localdata_service_1.LocalDataService])
    ], AuthenticationService);
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=auth.service.js.map