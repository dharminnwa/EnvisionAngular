"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var google_component_1 = require("./google/google.component");
exports.MapsRoutes = [
    {
        path: '',
        children: [{
                path: 'google',
                component: google_component_1.GoogleMapPage
            },
            {
                path: 'google/:type',
                component: google_component_1.GoogleMapPage
            }]
    }
];
//# sourceMappingURL=maps.routing.js.map