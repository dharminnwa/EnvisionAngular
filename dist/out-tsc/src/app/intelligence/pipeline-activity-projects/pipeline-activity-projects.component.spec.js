"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var pipeline_activity_projects_component_1 = require("./pipeline-activity-projects.component");
describe('PipelineActivityProjectsComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [pipeline_activity_projects_component_1.PipelineActivityProjectsComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(pipeline_activity_projects_component_1.PipelineActivityProjectsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=pipeline-activity-projects.component.spec.js.map