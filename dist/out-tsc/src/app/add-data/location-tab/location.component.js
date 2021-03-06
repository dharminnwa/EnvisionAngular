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
var fileupload_service_1 = require("../../services/fileupload.service");
var auth_service_1 = require("../../services/auth.service");
var all_http_request_service_1 = require("../../services/all-http-request.service");
var Utility_service_1 = require("../../services/Utility.service");
var LocationComponent = (function () {
    function LocationComponent(fileService, AuthServices, httpService, utilityService) {
        this.fileService = fileService;
        this.AuthServices = AuthServices;
        this.httpService = httpService;
        this.utilityService = utilityService;
        this.uploadedFiles = [];
        this.loginUserData = this.AuthServices.GetUserData();
    }
    ;
    LocationComponent.prototype.onUpload = function (event) {
        for (var _i = 0, _a = event.files; _i < _a.length; _i++) {
            var file = _a[_i];
            this.uploadedFiles.push(file);
        }
        this.uploadFileToActivity();
    };
    LocationComponent.prototype.uploadFileToActivity = function () {
        var _this = this;
        this.httpService.PostFile(this.uploadedFiles, this.loginUserData, "Coordinates").subscribe(function (data) {
            _this.uploadedFiles = [];
            var resultData = data.json();
            if (resultData["_Issuccess"]) {
                _this.fileService.LoadLayersOfUploadedFiles(resultData);
                _this.utilityService.ShowSuccessMsg('Locations Uploaded Successfully.');
            }
            else {
                _this.uploadedFiles = [];
                if (resultData.errorMsg) {
                    console.log(resultData["errorMsg"]);
                    _this.utilityService.ShowErrorMsg(resultData.errorMsg);
                }
            }
        }, function (error) {
            _this.uploadedFiles = [];
            console.log(error);
            _this.utilityService.ShowErrorMsg(error);
        });
    };
    LocationComponent = __decorate([
        core_1.Component({
            selector: 'location-tab',
            templateUrl: './location.component.html',
            styleUrls: ['./location.component.scss'],
            providers: [fileupload_service_1.FileuploadService]
        }),
        __metadata("design:paramtypes", [fileupload_service_1.FileuploadService,
            auth_service_1.AuthenticationService,
            all_http_request_service_1.HttpRequestService,
            Utility_service_1.UtilityService])
    ], LocationComponent);
    return LocationComponent;
}());
exports.LocationComponent = LocationComponent;
//# sourceMappingURL=location.component.js.map