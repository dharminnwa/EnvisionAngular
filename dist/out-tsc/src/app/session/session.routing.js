"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var login_component_1 = require("./login/login.component");
// import { RegisterPageComponent } from './register/register.component';
var error_component_1 = require("./error/error.component");
var lockscreen_component_1 = require("./lockscreen/lockscreen.component");
exports.SessionRoute = [
    {
        path: '',
        children: [{
                path: 'login',
                component: login_component_1.LoginComponent
            },
            // {
            //   path: 'register',
            //   component: RegisterPageComponent
            // },
            {
                path: 'error/:type',
                component: error_component_1.ErrorComponent
            }, {
                path: 'lock',
                component: lockscreen_component_1.LockscreenComponent
            }]
    }
];
//# sourceMappingURL=session.routing.js.map