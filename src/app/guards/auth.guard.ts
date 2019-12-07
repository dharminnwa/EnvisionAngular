import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalDataService } from '../services/localdata.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router : Router,
    private localDataService: LocalDataService) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean {
      let user = this.localDataService.getUserData();
      if (user && user.UserName) {
        return true;
      } else {
        this.router.navigate(['/envision/session/login']);
        return false;
      }
  }
}
