import { Routes } from '@angular/router';
//Layouts
import { CondensedComponent, BlankComponent } from './@pages/layouts';
//Sample Pages
import { AuthGuard } from './guards/auth.guard';
import { IntelligenceComponent } from './intelligence/intelligence.component';

export const AppRoutes: Routes = [
  {
    path: '',
    // redirectTo: '/envision/maps/google',
    redirectTo: '/envision/maps',
    pathMatch: 'full'
  },

  {
    path: 'envision',
    canActivate: [AuthGuard],
    component: CondensedComponent,
    children: [
      {
        path: 'maps',
        component: BlankComponent
      },
      {
        path: 'home',
        component: BlankComponent
      },
      {
        path: 'home-new',
        component: BlankComponent
      },
      {
        path: '',
        component: BlankComponent
      },
      {
        path: 'intelligence',
        component: IntelligenceComponent
      },
    ],
  },
  {
    path: 'envision',
    component: BlankComponent,
    children: [{
      path: 'session',
      loadChildren: 'app/session/session.module#SessionModule'
    }]
  }
];
