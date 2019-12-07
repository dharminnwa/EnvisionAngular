"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compose_component_1 = require("./compose/compose.component");
var list_component_1 = require("./list/list.component");
exports.emailRoute = [
    {
        path: 'light',
        children: [{
                path: 'list',
                component: list_component_1.EmailListComponentLight,
                data: {
                    layoutOption: 'email'
                }
            }, {
                path: 'compose',
                component: compose_component_1.ComposeComponentLight,
                data: {
                    layoutOption: 'email'
                }
            }]
    }
];
//# sourceMappingURL=email.routing.js.map