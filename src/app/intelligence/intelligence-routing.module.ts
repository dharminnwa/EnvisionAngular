import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntelligenceComponent } from './intelligence.component';

export const intelligenceRoutes: Routes = [
  {
    path: 'intelligence',
    children: [{
      path: '',
      component: IntelligenceComponent
    }]
    
  }
];

