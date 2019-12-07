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
var toggler_service_1 = require("../../@pages/services/toggler.service");
var ComposeComponentLight = (function () {
    function ComposeComponentLight(toggler) {
        this.toggler = toggler;
        this.editorModules = {
            //https://github.com/KillerCodeMonkey/ngx-quill
            toolbar: [
                [{ 'header': [1, 2, 3, 4, false] }],
                ['bold', 'italic', 'underline'],
                ['link', 'image']
            ]
        };
    }
    ComposeComponentLight.prototype.ngOnInit = function () {
        var _this = this;
        //Async Update -
        //https://blog.angularindepth.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4
        setTimeout(function () {
            _this.toggler.toggleFooter(false);
        });
        //Set Layout Options
        this.toggler.setHeaderClass("light");
        this.toggler.setPageContainer("full-height");
        this.toggler.setContent("full-height");
    };
    ComposeComponentLight = __decorate([
        core_1.Component({
            selector: 'email-compose-light',
            templateUrl: './compose.component.html',
            styleUrls: ['./compose.component.scss']
        }),
        __metadata("design:paramtypes", [toggler_service_1.pagesToggleService])
    ], ComposeComponentLight);
    return ComposeComponentLight;
}());
exports.ComposeComponentLight = ComposeComponentLight;
//# sourceMappingURL=compose.component.js.map