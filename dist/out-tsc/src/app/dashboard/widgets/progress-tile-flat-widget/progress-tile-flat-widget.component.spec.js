"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var progress_tile_flat_widget_component_1 = require("./progress-tile-flat-widget.component");
describe('ProgressTileFlatWidgetComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [progress_tile_flat_widget_component_1.ProgressTileFlatWidgetComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(progress_tile_flat_widget_component_1.ProgressTileFlatWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=progress-tile-flat-widget.component.spec.js.map