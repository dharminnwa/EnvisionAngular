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
var root_component_1 = require("../root/root.component");
var CorporateLayout = (function (_super) {
    __extends(CorporateLayout, _super);
    function CorporateLayout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.menuLinks = [
            {
                label: "Dashboard",
                details: "12 New Updates",
                routerLink: "dashboard",
                iconType: "pg",
                iconName: "home",
                thumbNailClass: "text-white"
            },
            {
                label: "Email",
                details: "234 New Emails",
                routerLink: "email/list",
                iconType: "pg",
                iconName: "mail"
            },
            {
                label: "Social",
                routerLink: "social",
                iconType: "pg",
                iconName: "social"
            },
            {
                label: "Builder",
                routerLink: "builder/corporate-builder",
                iconType: "pg",
                iconName: "layouts"
            },
            {
                label: "Layouts",
                iconType: "pg",
                iconName: "layouts2",
                toggle: "close",
                submenu: [
                    {
                        label: "Default",
                        routerLink: "layouts/default",
                        iconType: "letter",
                        iconName: "dl",
                    },
                    {
                        label: "Secondary",
                        routerLink: "layouts/secondary",
                        iconType: "letter",
                        iconName: "sl",
                    },
                    {
                        label: "Boxed",
                        routerLink: "layouts/boxed-alt",
                        iconType: "letter",
                        iconName: "bl",
                    }
                ]
            },
            {
                label: "UI Elements",
                iconType: "letter",
                iconName: "Ui",
                toggle: "close",
                submenu: [
                    {
                        label: "Color",
                        routerLink: "ui/color",
                        iconType: "letter",
                        iconName: "c",
                    },
                    {
                        label: "Typography",
                        routerLink: "ui/typography",
                        iconType: "letter",
                        iconName: "t",
                    },
                    {
                        label: "Icons",
                        routerLink: "ui/icons",
                        iconType: "letter",
                        iconName: "i",
                    },
                    {
                        label: "Buttons",
                        routerLink: "ui/buttons",
                        iconType: "letter",
                        iconName: "b",
                    },
                    {
                        label: "Notifications",
                        routerLink: "ui/notifications",
                        iconType: "letter",
                        iconName: "n",
                    },
                    {
                        label: "Modals",
                        routerLink: "ui/modal",
                        iconType: "letter",
                        iconName: "m",
                    },
                    {
                        label: "Progress & Activity",
                        routerLink: "ui/progress",
                        iconType: "letter",
                        iconName: "pa",
                    },
                    {
                        label: "Tabs & Accordians",
                        routerLink: "ui/tabs",
                        iconType: "letter",
                        iconName: "a",
                    },
                    {
                        label: "Sliders",
                        routerLink: "ui/sliders",
                        iconType: "letter",
                        iconName: "s",
                    },
                    {
                        label: "Treeview",
                        routerLink: "ui/tree",
                        iconType: "letter",
                        iconName: "tv",
                    }
                ]
            },
            {
                label: "Forms",
                iconType: "pg",
                iconName: "form",
                toggle: "close",
                submenu: [
                    {
                        label: "Form Elements",
                        routerLink: "forms/elements",
                        iconType: "letter",
                        iconName: "fe",
                    },
                    {
                        label: "Form Layouts",
                        routerLink: "forms/layouts",
                        iconType: "letter",
                        iconName: "fl",
                    },
                    {
                        label: "Form Wizard",
                        routerLink: "forms/wizard",
                        iconType: "letter",
                        iconName: "fq",
                    }
                ]
            },
            {
                label: "Cards",
                routerLink: "cards",
                iconType: "pg",
                iconName: "grid"
            },
            {
                label: "Views",
                routerLink: "views",
                iconType: "pg",
                iconName: "ui"
            },
            {
                label: "Tables",
                iconType: "pg",
                iconName: "tables",
                toggle: "close",
                submenu: [
                    {
                        label: "Basic Tables",
                        routerLink: "tables/basic",
                        iconType: "letter",
                        iconName: "bt",
                    },
                    {
                        label: "Advance Tables",
                        routerLink: "tables/advance",
                        iconType: "letter",
                        iconName: "dt",
                    }
                ]
            },
            {
                label: "Maps",
                iconType: "pg",
                iconName: "map",
                toggle: "close",
                submenu: [
                    {
                        label: "Google Maps",
                        routerLink: "maps/google/with-header",
                        iconType: "letter",
                        iconName: "gm",
                    }
                ]
            },
            {
                label: "Charts",
                routerLink: "charts",
                iconType: "pg",
                iconName: "charts"
            },
            {
                label: "Extra",
                iconType: "pg",
                iconName: "bag",
                toggle: "close",
                submenu: [
                    {
                        label: "Invoice",
                        routerLink: "extra/invoice",
                        iconType: "letter",
                        iconName: "in",
                    },
                    {
                        label: "404 Page",
                        routerLink: "session/error/404",
                        iconType: "letter",
                        iconName: "pg",
                    },
                    {
                        label: "500 Page",
                        routerLink: "session/error/500",
                        iconType: "letter",
                        iconName: "pg",
                    },
                    {
                        label: "Login",
                        routerLink: "session/login",
                        iconType: "letter",
                        iconName: "l",
                    },
                    {
                        label: "Register",
                        routerLink: "session/register",
                        iconType: "letter",
                        iconName: "re",
                    },
                    {
                        label: "Lockscreen",
                        routerLink: "session/lock",
                        iconType: "letter",
                        iconName: "ls",
                    },
                    {
                        label: "Gallery",
                        routerLink: "extra/gallery",
                        iconType: "letter",
                        iconName: "gl",
                    },
                    {
                        label: "Timeline",
                        routerLink: "extra/timeline",
                        iconType: "letter",
                        iconName: "t",
                    }
                ]
            },
            {
                label: "Docs",
                externalLink: "https://docs.pages.revox.io/v/angular/",
                target: "_blank",
                iconType: "pg",
                iconName: "note"
            },
            {
                label: "Changelog",
                externalLink: "http://changelog.pages.revox.io/",
                target: "_blank",
                iconType: "letter",
                iconName: "Cl"
            },
        ];
        return _this;
    }
    CorporateLayout.prototype.ngOnInit = function () {
        //this.changeLayout("menu-pin");
        // this.changeLayout("menu-behind");
        //Will sidebar close on screens below 1024
        this.autoHideMenuPin();
    };
    CorporateLayout = __decorate([
        core_1.Component({
            selector: 'corporate-layout',
            templateUrl: './corporate.component.html',
            styleUrls: ['./corporate.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], CorporateLayout);
    return CorporateLayout;
}(root_component_1.RootLayout));
exports.CorporateLayout = CorporateLayout;
//# sourceMappingURL=corporate.component.js.map