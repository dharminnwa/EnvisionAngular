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
var Utility_service_1 = require("../../services/Utility.service");
var PipelineActivityProjectModalComponent = (function () {
    function PipelineActivityProjectModalComponent(activeModal, utilityService) {
        this.activeModal = activeModal;
        this.utilityService = utilityService;
        this.PipelineActivityProjectlURL = "";
    }
    PipelineActivityProjectModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.utilityService.CloseModalOnRouteChange(this.activeModal);
        this.PipelineActivityProjectlURL = this.URL;
        setTimeout(function () {
            $("#PipelineActivityProjectModelIframe").attr("src", _this.PipelineActivityProjectlURL);
        }, 500);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], PipelineActivityProjectModalComponent.prototype, "URL", void 0);
    PipelineActivityProjectModalComponent = __decorate([
        core_1.Component({
            selector: 'app-pipeline-activity-project-modal',
            templateUrl: './pipeline-activity-project-modal.component.html',
            styleUrls: ['./pipeline-activity-project-modal.component.scss']
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal, Utility_service_1.UtilityService])
    ], PipelineActivityProjectModalComponent);
    return PipelineActivityProjectModalComponent;
}());
exports.PipelineActivityProjectModalComponent = PipelineActivityProjectModalComponent;
//# sourceMappingURL=pipeline-activity-project-modal.component.js.map