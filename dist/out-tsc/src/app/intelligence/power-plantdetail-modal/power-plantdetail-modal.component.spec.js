"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var power_plantdetail_modal_component_1 = require("./power-plantdetail-modal.component");
describe('PowerPlantdetailModalComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [power_plantdetail_modal_component_1.PowerPlantdetailModalComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(power_plantdetail_modal_component_1.PowerPlantdetailModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=power-plantdetail-modal.component.spec.js.map