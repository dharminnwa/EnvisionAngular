"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var root_component_1 = require("../@pages/layouts/root/root.component");
var pipeline_activity_projects_component_1 = require("./pipeline-activity-projects/pipeline-activity-projects.component");
var IntelligenceComponent = (function (_super) {
    __extends(IntelligenceComponent, _super);
    function IntelligenceComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // PipelineActivityComponent: PipelineActivityProjectsComponent
    IntelligenceComponent.prototype.ngOnInit = function () {
        setTimeout(function () {
            $(".page-container").css('padding-left', '0px');
            // this.PipelineActivityComponent = this.Injector.get(PipelineActivityProjectsComponent);
        }, 100);
    };
    IntelligenceComponent = __decorate([
        core_1.Component({
            selector: 'app-intelligence',
            templateUrl: './intelligence.component.html',
            styleUrls: ['./intelligence.component.scss'],
            providers: [pipeline_activity_projects_component_1.PipelineActivityProjectsComponent]
        })
    ], IntelligenceComponent);
    return IntelligenceComponent;
}(root_component_1.RootLayout));
exports.IntelligenceComponent = IntelligenceComponent;
//# sourceMappingURL=intelligence.component.js.map