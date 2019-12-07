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
var PipelineActivityComponent = (function () {
    function PipelineActivityComponent(httpRequest, MapServiceService) {
        this.httpRequest = httpRequest;
        this.MapServiceService = MapServiceService;
        this.plActivities = [];
    }
    PipelineActivityComponent.prototype.ngOnInit = function () {
        this.plActivities = this.MapServiceService.pipeActivityData.getValue();
        if (!this.plActivities) {
            this.GetPipelineActivityLinks();
        }
    };
    PipelineActivityComponent.prototype.GetPipelineActivityLinks = function () {
        var _this = this;
        this.httpRequest._NodeGetPipelineActivities().subscribe(function (data) {
            if (data._Issuccess) {
                var jsonData = data.PipelineActivitiesData;
                _this.plActivities = jsonData;
                _this.MapServiceService.setPipeActivity(_this.plActivities);
            }
        }, function (error) {
            console.log(error);
        });
    };
    PipelineActivityComponent = __decorate([
        core_1.Component({
            selector: 'app-pipeline-activity',
            templateUrl: './pipeline-activity.component.html',
            styleUrls: ['./pipeline-activity.component.scss']
        }),
        __metadata("design:paramtypes", [all_http_request_service_1.HttpRequestService, map_service_service_1.MapServiceService])
    ], PipelineActivityComponent);
    return PipelineActivityComponent;
}());
exports.PipelineActivityComponent = PipelineActivityComponent;
//# sourceMappingURL=pipeline-activity.component.js.map