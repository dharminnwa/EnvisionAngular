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
var IntelligenceService = (function () {
    function IntelligenceService() {
    }
    IntelligenceService.prototype.setEnitiesName = function (SortName) {
        if (SortName == "Fac Own") {
            return "Facility Owner";
        }
        else if (SortName == "Fac Opr") {
            return "Facility Operator";
        }
        else if (SortName == "Sys Own") {
            return "System Owner";
        }
        else if (SortName == "Sys Opr") {
            return "System Operator";
        }
        else if (SortName == "PL Own") {
            return "Pipeline Owner";
        }
        else if (SortName == "PL Opr") {
            return "Pipeline Operator";
        }
        else if (SortName == "Trans Own") {
            return "Transmission Owner";
        }
        else {
            return SortName;
        }
    };
    IntelligenceService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], IntelligenceService);
    return IntelligenceService;
}());
exports.IntelligenceService = IntelligenceService;
//# sourceMappingURL=Intelligence.service.js.map