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
var map_service_service_1 = require("../../services/map-service.service");
var all_http_request_service_1 = require("../../services/all-http-request.service");
var TransmissionProjectComponent = (function () {
    function TransmissionProjectComponent(httpService, MapServiceService) {
        this.httpService = httpService;
        this.MapServiceService = MapServiceService;
        this.LayerLoader = false;
        this.transProjects = [];
    }
    TransmissionProjectComponent.prototype.ngOnInit = function () {
        this.transProjects = this.MapServiceService.transProjectData.getValue();
        if (!this.transProjects) {
            this.GetTransProjectLinks();
        }
    };
    TransmissionProjectComponent.prototype.GetTransProjectLinks = function () {
        var _this = this;
        this.LayerLoader = true;
        this.httpService._NodeGetTransProjects().subscribe(function (data) {
            if (data._Issuccess) {
                var jsonData = data.TransProjectsData;
                _this.transProjects = jsonData;
                _this.MapServiceService.setTransProject(_this.transProjects);
            }
            _this.LayerLoader = false;
        }, function (error) {
            console.log(error);
            _this.LayerLoader = false;
        });
    };
    TransmissionProjectComponent = __decorate([
        core_1.Component({
            selector: 'app-transmission-project',
            templateUrl: './transmission-project.component.html',
            styleUrls: ['./transmission-project.component.scss']
        }),
        __metadata("design:paramtypes", [all_http_request_service_1.HttpRequestService, map_service_service_1.MapServiceService])
    ], TransmissionProjectComponent);
    return TransmissionProjectComponent;
}());
exports.TransmissionProjectComponent = TransmissionProjectComponent;
//# sourceMappingURL=transmission-project.component.js.map