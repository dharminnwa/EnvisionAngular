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
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var auth_service_1 = require("./auth.service");
var AuthInterceptorService = (function () {
    function AuthInterceptorService(AuthServices) {
        this.AuthServices = AuthServices;
    }
    AuthInterceptorService.prototype.intercept = function (request, next) {
        var _this = this;
        if (request.url.includes('/User/LogInUser')) {
            return next.handle(request);
        }
        var token = this.AuthServices.GetAuthTokan();
        //set the content type, accept type and token in API. This only handle the API request.
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: token
                }
            });
        }
        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }
        return next.handle(request).pipe(operators_1.tap(function (event) {
            if (event instanceof http_1.HttpResponse) {
                if (event.body.Authorization_success == false) {
                    _this.AuthServices.resirecttoLogin_ReloadthePage();
                }
                // else {
                //     console.log(event.status);
                // }
            }
        }, function (error) {
            // http response status code
            console.log("----response----");
            console.log("status code:");
            console.log(error.status);
            console.log(error.message);
            console.log("--- end of response---");
            //this.AuthServices.resirecttoLogin_ReloadthePage();
        }));
    };
    AuthInterceptorService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [auth_service_1.AuthenticationService])
    ], AuthInterceptorService);
    return AuthInterceptorService;
}());
exports.AuthInterceptorService = AuthInterceptorService;
//# sourceMappingURL=auth-interceptor.service.js.map