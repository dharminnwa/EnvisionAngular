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
var modal_1 = require("ngx-bootstrap/modal");
var save_draw_tools_component_1 = require("../save-draw-tools/save-draw-tools.component");
var ConfirmDrawToolsComponent = (function () {
    function ConfirmDrawToolsComponent(bsModalRef, injector, bsModalService) {
        this.bsModalRef = bsModalRef;
        this.injector = injector;
        this.bsModalService = bsModalService;
        this.close = new core_1.EventEmitter();
    }
    ConfirmDrawToolsComponent.prototype.ngOnInit = function () {
        $('.modal-backdrop').show();
        $('#draw-tools').css("z-index", "99");
    };
    ConfirmDrawToolsComponent.prototype.CloseModal = function () {
        $('.modal-backdrop').hide();
        $('#draw-tools').css("z-index", "");
        this.bsModalRef.hide();
        // this.parentBsModelRef.hide();
        this.close.emit(true);
    };
    ConfirmDrawToolsComponent.prototype.saveDrawToolData = function () {
        var _this = this;
        this.bsModalRef.hide();
        var config = { class: 'modal-sm modal-dialog-centered', backdrop: 'static', animated: false };
        var bsModalRef = this.bsModalService.show(save_draw_tools_component_1.SaveDrawToolsComponent, config);
        bsModalRef.content.isSaved.take(1).subscribe(function (value) {
            if (value == true)
                _this.close.emit(true);
        });
        if (this.EditLayerId)
            bsModalRef.content.EditLayerId = this.EditLayerId;
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ConfirmDrawToolsComponent.prototype, "close", void 0);
    ConfirmDrawToolsComponent = __decorate([
        core_1.Component({
            selector: 'app-confirm-draw-tools',
            templateUrl: './confirm-draw-tools.component.html',
            styleUrls: ['./confirm-draw-tools.component.scss']
        }),
        __metadata("design:paramtypes", [modal_1.BsModalRef,
            core_1.Injector,
            modal_1.BsModalService])
    ], ConfirmDrawToolsComponent);
    return ConfirmDrawToolsComponent;
}());
exports.ConfirmDrawToolsComponent = ConfirmDrawToolsComponent;
//# sourceMappingURL=confirm-draw-tools.component.js.map