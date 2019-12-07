"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var transmission_project_detail_modal_component_1 = require("./transmission-project-detail-modal.component");
describe('TransmissionProjectDetailModalComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [transmission_project_detail_modal_component_1.TransmissionProjectDetailModalComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(transmission_project_detail_modal_component_1.TransmissionProjectDetailModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=transmission-project-detail-modal.component.spec.js.map