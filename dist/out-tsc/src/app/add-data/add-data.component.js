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
var ngx_bootstrap_1 = require("ngx-bootstrap");
var Utility_service_1 = require("../services/Utility.service");
var AddDataComponent = (function () {
    function AddDataComponent(bsModalRef, utilityService) {
        this.bsModalRef = bsModalRef;
        this.utilityService = utilityService;
        this.uploadedFiles = [];
        utilityService.CloseModalOnRouteChange(bsModalRef);
    }
    ;
    AddDataComponent.prototype.onUpload = function (event) {
        for (var _i = 0, _a = event.files; _i < _a.length; _i++) {
            var file = _a[_i];
            this.uploadedFiles.push(file);
        }
    };
    AddDataComponent = __decorate([
        core_1.Component({
            selector: 'add-data-modal',
            templateUrl: './add-data.component.html',
            styleUrls: ['./add-data.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            Utility_service_1.UtilityService])
    ], AddDataComponent);
    return AddDataComponent;
}());
exports.AddDataComponent = AddDataComponent;
//# sourceMappingURL=add-data.component.js.map