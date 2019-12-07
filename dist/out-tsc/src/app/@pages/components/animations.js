"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var pgAnimations = (function () {
    function pgAnimations() {
    }
    pgAnimations.slideInOut = core_1.trigger('slideInOut', [
        core_1.state('true', core_1.style({ height: '0px' })),
        core_1.state('false', core_1.style({ height: '*' })),
        core_1.transition('1 => 0', core_1.animate('500ms ease-in')),
        core_1.transition('0 => 1', core_1.animate('500ms ease-out'))
    ]);
    pgAnimations.fadeIn = core_1.trigger('fadeIn', [
        core_1.state('void', core_1.style({ opacity: 0 })),
        core_1.state('true', core_1.style({ opacity: 1 })),
        core_1.state('false', core_1.style({ opacity: 0 })),
        core_1.transition('* => true', core_1.animate('150ms cubic-bezier(0.0, 0.0, 0.2, 1)')),
        core_1.transition('* => void', core_1.animate('150ms cubic-bezier(0.4, 0.0, 1, 1)')),
    ]);
    return pgAnimations;
}());
exports.pgAnimations = pgAnimations;
//# sourceMappingURL=animations.js.map