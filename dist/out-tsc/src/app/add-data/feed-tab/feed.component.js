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
var FeedComponent = (function () {
    function FeedComponent() {
        this.rowGroupPanelShow = "";
        this.columnDefs = [
            {
                headerName: "Add/Remove",
                suppressMenu: true,
                suppressSorting: true,
                width: 100,
                template: "<button type=\"button\" data-action-type=\"view\" class=\"btn btn-link\">\n                 Add\n               </button>\n               "
            },
            {
                headerName: "Delete",
                suppressMenu: true,
                suppressSorting: true,
                width: 100,
                template: "<button type=\"button\" data-action-type=\"view\" class=\"btn btn-link\">\n                 Delete\n               </button>\n               "
            },
            { headerName: 'LayerName', field: 'make', enableRowGroup: true },
            { headerName: 'Description', field: 'model', enableRowGroup: true },
            { headerName: 'Uploaded Date', field: 'price', enableRowGroup: true }
        ];
        this.rowData = [];
        this.gridOptions = {};
        this.rowGroupPanelShow = "always";
    }
    ;
    FeedComponent = __decorate([
        core_1.Component({
            selector: 'feed-tab',
            templateUrl: './feed.component.html',
            styleUrls: ['./feed.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], FeedComponent);
    return FeedComponent;
}());
exports.FeedComponent = FeedComponent;
//# sourceMappingURL=feed.component.js.map