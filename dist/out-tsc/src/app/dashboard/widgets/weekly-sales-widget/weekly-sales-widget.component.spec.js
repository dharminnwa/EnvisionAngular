"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var weekly_sales_widget_component_1 = require("./weekly-sales-widget.component");
describe('WeeklySalesWidgetComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [weekly_sales_widget_component_1.WeeklySalesWidgetComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(weekly_sales_widget_component_1.WeeklySalesWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=weekly-sales-widget.component.spec.js.map