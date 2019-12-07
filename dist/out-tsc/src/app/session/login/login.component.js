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
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var ngx_cookie_service_1 = require("ngx-cookie-service");
var auth_service_1 = require("../../services/auth.service");
var Utility_service_1 = require("../../services/Utility.service");
var all_http_request_service_1 = require("../../services/all-http-request.service");
var localdata_service_1 = require("../../services/localdata.service");
var LoginComponent = (function () {
    function LoginComponent(http, route, router, cookieService, AuthService, UtilityService, httpService, localDataService) {
        this.http = http;
        this.route = route;
        this.router = router;
        this.cookieService = cookieService;
        this.AuthService = AuthService;
        this.UtilityService = UtilityService;
        this.httpService = httpService;
        this.localDataService = localDataService;
        this.KeepmeLogin = false;
        this.Invalid = false;
        this.errorMsg = "";
        this.currentYear = 2019;
        var Userdata = this.localDataService.getUserData();
        if (Userdata) {
            // var Userdata = JSON.parse(this.cookieService.get('UserName'));
            // if (Userdata.KeepmeLogin == true) {
            this.router.navigateByUrl('/envision/maps');
            // }
        }
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.UtilityService.closeAllPopupmodalbaseonclass();
        this.currentYear = new Date().getFullYear();
    };
    LoginComponent.prototype.selectionChange = function (input) {
        this.KeepmeLogin = input.checked;
    };
    /************ Start Node js Login Method ************/
    LoginComponent.prototype.UserLogIn = function () {
        var _this = this;
        var UserProfile = {
            UserID: this.userName,
            Pwd: this.password,
            KeepmeLogin: this.KeepmeLogin,
            AutoLogOutTimeInMinutes: 35,
            LoginType: "Firsttime"
        };
        if (this.KeepmeLogin == true) {
            UserProfile.AutoLogOutTimeInMinutes = 168;
        }
        localStorage.clear();
        this.httpService._NodeLogin(UserProfile.UserID, UserProfile.Pwd, UserProfile.KeepmeLogin, UserProfile.LoginType, UserProfile.AutoLogOutTimeInMinutes).subscribe(function (data) {
            var res = JSON.stringify(data);
            var Userres = JSON.parse(res);
            var UserData = Userres.responsedata.result;
            _this.SetDataincookieService(Userres, UserData);
        }, function (error) {
            console.log(error);
            _this.setvalue("Username or Password is Incorrect", true);
        });
    };
    /************ End Node js Login Method ************/
    LoginComponent.prototype.UserLogIn_Test = function () {
        var _this = this;
        var UserProfile = {
            UserID: this.userName,
            Pwd: this.password,
            KeepmeLogin: this.KeepmeLogin,
            AutoLogOutTimeInMinutes: 35,
            LoginType: "Firsttime"
        };
        if (this.KeepmeLogin == true) {
            UserProfile.AutoLogOutTimeInMinutes = 168;
        }
        localStorage.clear();
        this.httpService.Login(UserProfile.UserID, UserProfile.Pwd, UserProfile.KeepmeLogin, UserProfile.LoginType, UserProfile.AutoLogOutTimeInMinutes).subscribe(function (data) {
            var res = data.json();
            var Userres = JSON.parse(res);
            var UserData = Userres.result;
            _this.SetDataincookieService(Userres, UserData);
            // if (Userres.isSuccess == true) {
            //   if (UserData.IsApproved == true && UserData.IsUserLocked == false) {
            //     // 1 day -> 24 hrs
            //     // ? day -> 6 hrs
            //     // (1*6)/24 -> 0.25 i.e. 6hrs        
            //     //let min = 0.30;
            //     let min = 1;
            //     let Expiretime = (1 * min) / 24;
            //     if (this.KeepmeLogin == true) {
            //       UserData["KeepmeLogin"] = this.KeepmeLogin;
            //       min = 120;
            //     }
            //     if (UserData['SystemParameterlst']) {
            //       localStorage.clear();
            //       let SystemParameterlst = JSON.stringify(UserData['SystemParameterlst']);
            //       localStorage.setItem("SystemParameterlst", SystemParameterlst)
            //       this.AuthService.SetSystemParameter(UserData['SystemParameterlst']);
            //       UserData['SystemParameterlst'] = null;
            //     }
            //     this.cookieService.set('UserName', JSON.stringify(UserData), Expiretime);
            //     this.router.navigateByUrl('/envision/maps/google');
            //   }
            //   else if (UserData.IsApproved == false && UserData.IsUserLocked == true) {
            //     let errorMsg = "Incorrect username and/or pw and your account has been locked. Please reset your password using the Forgot Password link below.";
            //     this.setvalue(errorMsg, true);
            //   }
            //   else {
            //     // this.Invalid = true;
            //     // this.errorMsg = "Username or Password is Incorrect";
            //     this.setvalue("Username or Password is Incorrect", true);
            //   }
            // }
            // else {       
            //   this.setvalue("Username or Password is Incorrect", true);
            // }
        }, function (error) {
            console.log(error);
            _this.setvalue("Username or Password is Incorrect", true);
        });
    };
    LoginComponent.prototype.SetDataincookieService = function (Userres, UserData) {
        if (Userres.responsedata.isSuccess == true) {
            if (UserData.IsApproved == true && UserData.IsUserLocked == false) {
                //       1 day -> 24 hrs
                // ? day -> 6 hrs
                // (1*6)/24 -> 0.25 i.e. 6hrs        
                //let min = 0.30;        
                var hour = 1;
                var Expiretime = (1 * hour) / 24;
                if (this.KeepmeLogin == true) {
                    UserData["KeepmeLogin"] = this.KeepmeLogin;
                    hour = 120;
                }
                if (UserData['SystemParameterlst']) {
                    localStorage.clear();
                    var SystemParameterlst = JSON.stringify(UserData['SystemParameterlst']);
                    localStorage.setItem("SystemParameterlst", SystemParameterlst);
                    this.AuthService.SetSystemParameter(UserData['SystemParameterlst']);
                    UserData['SystemParameterlst'] = null;
                }
                this.localDataService.setUserData(UserData);
                // this.cookieService.set('UserName', JSON.stringify(UserData), Expiretime);
                if (Userres["token"]) {
                    var usertoken = Userres.token;
                    this.cookieService.set('HTMLENvisionToken', usertoken);
                }
                this.router.navigateByUrl('/envision/maps');
            }
            else if (UserData.IsApproved == false && UserData.IsUserLocked == true) {
                this.Invalid = true;
                this.errorMsg = "Incorrect username and/or pw and your account has been locked. Please reset your password using the Forgot Password link below.";
            }
            else {
                this.Invalid = true;
                this.errorMsg = "Username or Password is Incorrect";
            }
        }
        else {
            this.Invalid = true;
            this.errorMsg = "Username or Password is Incorrect";
            this.cookieService.delete('UserName');
        }
    };
    LoginComponent.prototype.setvalue = function (errorMsg, Invalid) {
        this.Invalid = Invalid;
        this.errorMsg = errorMsg;
        this.cookieService.delete('UserName');
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss']
        }),
        __metadata("design:paramtypes", [http_1.Http,
            router_1.ActivatedRoute,
            router_1.Router,
            ngx_cookie_service_1.CookieService,
            auth_service_1.AuthenticationService,
            Utility_service_1.UtilityService,
            all_http_request_service_1.HttpRequestService,
            localdata_service_1.LocalDataService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map