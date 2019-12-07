"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blankpage_component_1 = require("./blankpage/blankpage.component");
//import { TimelineComponent } from './timeline/timeline.component';
//import { InvoiceComponent } from './invoice/invoice.component';
//import { GalleryComponent } from './gallery/gallery.component';
//Routes
exports.ExtraRouts = [
    {
        path: '',
        children: [{
                path: 'blank',
                component: blankpage_component_1.BlankpageComponent
            },
        ]
    }
];
//# sourceMappingURL=extra.routing.js.map