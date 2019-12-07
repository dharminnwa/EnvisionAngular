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
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var Utility_service_1 = require("../../services/Utility.service");
var TspComponent = (function () {
    function TspComponent(activeModal, utilityService) {
        this.activeModal = activeModal;
        this.utilityService = utilityService;
        this.isSourceListSelectAll = false;
        this.isTargetListSelectAll = false;
        this.sourceCars = [
            { id: "1", name: "A", isChecked: false },
            { id: "2", name: "B", isChecked: false },
            { id: "3", name: "C", isChecked: false },
            { id: "4", name: "D", isChecked: false },
            { id: "5", name: "E", isChecked: false },
            { id: "6", name: "F", isChecked: false },
            { id: "7", name: "G", isChecked: false },
            { id: "8", name: "H", isChecked: false },
            { id: "9", name: "I", isChecked: false },
            { id: "10", name: "J", isChecked: false }
        ];
        this.targetCars = [];
        utilityService.CloseModalOnRouteChange(activeModal);
    }
    TspComponent.prototype.checked = function (e, isCheked) {
        e.isChecked = !isCheked;
    };
    TspComponent.prototype.OnMoveToTarget = function (e) {
        var _this = this;
        if (e.items[0].isChecked == false) {
            if (this.targetCars.length > 0) {
                var indexOfSelectedItem = this.targetCars.indexOf(e.items[0]);
                if (indexOfSelectedItem > -1) {
                    this.targetCars.splice(indexOfSelectedItem, 1);
                    this.sourceCars.push(e.items[0]);
                }
            }
        }
        this.sourceCars.forEach(function (obj) {
            if (obj.isChecked == true) {
                _this.targetCars.push(obj);
            }
        });
        var tempArray = this.sourceCars;
        this.sourceCars = [];
        tempArray.forEach(function (obj) {
            if (obj.isChecked != true) {
                _this.sourceCars.push(obj);
            }
        });
        this.targetCars.forEach(function (obj) {
            if (obj.isChecked == true) {
                obj.isChecked = false;
            }
        });
        this.SortByKey(this.sourceCars, "name");
        this.SortByKey(this.targetCars, "name");
        if (this.isSourceListSelectAll == true)
            this.isSourceListSelectAll = false;
        if (this.isTargetListSelectAll == true)
            this.isTargetListSelectAll = false;
    };
    TspComponent.prototype.OnMoveToSource = function (e) {
        var _this = this;
        if (e.items[0].isChecked == false) {
            if (this.sourceCars.length > 0) {
                var indexOfSelectedItem = this.sourceCars.indexOf(e.items[0]);
                if (indexOfSelectedItem > -1) {
                    this.sourceCars.splice(indexOfSelectedItem, 1);
                    this.targetCars.push(e.items[0]);
                }
            }
        }
        this.targetCars.forEach(function (obj) {
            if (obj.isChecked == true) {
                _this.sourceCars.push(obj);
            }
        });
        var tempArray = this.targetCars;
        this.targetCars = [];
        tempArray.forEach(function (obj) {
            if (obj.isChecked != true) {
                _this.targetCars.push(obj);
            }
        });
        this.sourceCars.forEach(function (obj) {
            if (obj.isChecked == true) {
                obj.isChecked = false;
            }
        });
        this.SortByKey(this.sourceCars, "name");
        this.SortByKey(this.targetCars, "name");
        if (this.isSourceListSelectAll == true)
            this.isSourceListSelectAll = false;
        if (this.isTargetListSelectAll == true)
            this.isTargetListSelectAll = false;
    };
    TspComponent.prototype.SortByKey = function (array, key) {
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    };
    TspComponent.prototype.SourceListSelectAllChange = function (e) {
        if (this.isSourceListSelectAll == false) {
            this.sourceCars.forEach(function (obj) {
                if (obj.isChecked == true) {
                    var Treeecheckboxlement = document.getElementById(obj.id + 'listvalue');
                    Treeecheckboxlement.click();
                }
            });
        }
        else {
            this.sourceCars.forEach(function (obj) {
                if (obj.isChecked == false) {
                    var Treeecheckboxlement = document.getElementById(obj.id + 'listvalue');
                    Treeecheckboxlement.click();
                }
            });
        }
    };
    TspComponent.prototype.TargetListSelectAllChange = function (e) {
        if (this.isTargetListSelectAll == false) {
            this.targetCars.forEach(function (obj) {
                if (obj.isChecked == true) {
                    var Treeecheckboxlement = document.getElementById(obj.id + 'listvalue');
                    Treeecheckboxlement.click();
                }
            });
        }
        else {
            this.targetCars.forEach(function (obj) {
                if (obj.isChecked == false) {
                    var Treeecheckboxlement = document.getElementById(obj.id + 'listvalue');
                    Treeecheckboxlement.click();
                }
            });
        }
    };
    TspComponent = __decorate([
        core_1.Component({
            selector: 'tsp-modal',
            templateUrl: './tsp.component.html',
            styleUrls: ['./tsp.component.scss']
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbActiveModal, Utility_service_1.UtilityService])
    ], TspComponent);
    return TspComponent;
}());
exports.TspComponent = TspComponent;
//# sourceMappingURL=tsp.component.js.map