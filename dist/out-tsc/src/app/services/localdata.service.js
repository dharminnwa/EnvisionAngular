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
var LocalDataService = (function () {
    function LocalDataService() {
        this.userDataString = 'User';
    }
    LocalDataService.prototype.setUserData = function (value) {
        this.setItem(this.userDataString, value);
    };
    LocalDataService.prototype.getUserData = function () {
        return this.getItem(this.userDataString);
    };
    LocalDataService.prototype.setItem = function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };
    LocalDataService.prototype.getItem = function (key) {
        var data = localStorage.getItem(key);
        if (data == undefined || data == "undefined" || data == null)
            return null;
        return JSON.parse(data);
    };
    LocalDataService.prototype.GetXTableNames = function () {
        var tableNames = null;
        var UserData = this.getUserData();
        if (UserData) {
            if (UserData.IsApproved == true) {
                tableNames = UserData.xTableNames;
            }
            return tableNames;
        }
    };
    LocalDataService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], LocalDataService);
    return LocalDataService;
}());
exports.LocalDataService = LocalDataService;
//# sourceMappingURL=localdata.service.js.map