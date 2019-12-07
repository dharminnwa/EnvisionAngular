"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Layouts
var layouts_1 = require("./@pages/layouts");
//Sample Pages
var auth_guard_1 = require("./guards/auth.guard");
var intelligence_component_1 = require("./intelligence/intelligence.component");
exports.AppRoutes = [
    {
        path: '',
        // redirectTo: '/envision/maps/google',
        redirectTo: '/envision/maps',
        pathMatch: 'full'
    },
    {
        path: 'envision',
        canActivate: [auth_guard_1.AuthGuard],
        component: layouts_1.CondensedComponent,
        children: [
            {
                path: 'maps',
                component: layouts_1.BlankComponent
            },
            {
                path: 'home',
                component: layouts_1.BlankComponent
            },
            {
                path: 'home-new',
                component: layouts_1.BlankComponent
            },
            {
                path: '',
                component: layouts_1.BlankComponent
            },
            {
                path: 'intelligence',
                component: intelligence_component_1.IntelligenceComponent
            },
        ],
    },
    {
        path: 'envision',
        component: layouts_1.BlankComponent,
        children: [{
                path: 'session',
                loadChildren: 'app/session/session.module#SessionModule'
            }]
    }
];
//# sourceMappingURL=app.routing.js.map