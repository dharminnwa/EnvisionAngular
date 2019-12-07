"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var operating_utilitydetail_modal_component_1 = require("./operating-utilitydetail-modal.component");
describe('OperatingUtilitydetailModalComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [operating_utilitydetail_modal_component_1.OperatingUtilitydetailModalComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(operating_utilitydetail_modal_component_1.OperatingUtilitydetailModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=operating-utilitydetail-modal.component.spec.js.map