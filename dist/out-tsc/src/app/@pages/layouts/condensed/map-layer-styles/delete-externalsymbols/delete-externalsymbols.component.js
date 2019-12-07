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
var map_service_service_1 = require("../../../../../services/map-service.service");
var Utility_service_1 = require("../../../../../services/Utility.service");
var all_http_request_service_1 = require("../../../../../services/all-http-request.service");
var DeleteExternalsymbolsComponent = (function () {
    function DeleteExternalsymbolsComponent(BsModalRef, MapServiceService, UtilityService, httpRequest) {
        this.BsModalRef = BsModalRef;
        this.MapServiceService = MapServiceService;
        this.UtilityService = UtilityService;
        this.httpRequest = httpRequest;
    }
    DeleteExternalsymbolsComponent.prototype.ngOnInit = function () {
        this.UtilityService.CloseModalOnRouteChange(this.BsModalRef);
    };
    DeleteExternalsymbolsComponent.prototype.deleteIcon = function () {
        var _this = this;
        this.IconURL;
        this.UserID;
        var filenamewithex = this.IconURL.replace(/^.*[\\\/]/, '');
        var id = filenamewithex.split('.').slice(0, -1).join('.');
        this.httpRequest._NodeDeleteExternalSysmbols(this.UserID, filenamewithex, id).subscribe(function (data) {
            var res = data;
            if (res._Issuccess) {
                var ExternalIconlist = _this.MapServiceService.ExternalIconList.value;
                var index = ExternalIconlist.findIndex(function (x) { return x.Id == res.ExternalIcon.IconID; });
                if (index != -1) {
                    ExternalIconlist.splice(index, 1);
                }
                var Closebtnid_1 = document.getElementById('btndeleteExIconClose');
                Closebtnid_1.click();
                setTimeout(function () {
                    Closebtnid_1 = null;
                    Closebtnid_1 = document.getElementById('_btnMapLayerclosePopup');
                    if (Closebtnid_1 != null) {
                        Closebtnid_1.click();
                    }
                }, 1000);
                // for (let i of ExternalIconlist) {
                //   if ((i.Id == res.ExternalIcon.Id) && res.ExternalIcon.IsDeleted == true) {
                //     continue;
                //   }
                //   else {
                //     exicon.push(i);
                //   }
                // }
                // if (exicon.length > 0) {
                //   this.MapServiceService.ExternalIconList.value.length = 0;
                //   this.MapServiceService.ExternalIconList.getValue().push(exicon);
                // }
            }
            else {
                alert(res.errormsg);
            }
        }, function (error) {
            console.log(error);
        });
    };
    DeleteExternalsymbolsComponent = __decorate([
        core_1.Component({
            selector: 'app-delete-externalsymbols',
            templateUrl: './delete-externalsymbols.component.html',
            styleUrls: ['./delete-externalsymbols.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            map_service_service_1.MapServiceService,
            Utility_service_1.UtilityService,
            all_http_request_service_1.HttpRequestService])
    ], DeleteExternalsymbolsComponent);
    return DeleteExternalsymbolsComponent;
}());
exports.DeleteExternalsymbolsComponent = DeleteExternalsymbolsComponent;
//# sourceMappingURL=delete-externalsymbols.component.js.map