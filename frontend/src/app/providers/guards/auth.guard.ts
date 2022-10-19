/*
 * spurtcommerce
 * version 3.0
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
import { Injectable } from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    return this.checkLogin(state.url);
  }
  // CheckLogin
  checkLogin(url: string): Promise<boolean> | boolean {
    let currentUser: any;
      currentUser = localStorage.getItem('token');
    if (currentUser) {
      if (url === '/login') {
        // Navigate to the login page with extras
        this.router.navigate(['/dashboard']);
        return false;
      }
      return true;
    } else {
      if (url === '/login') {
        return true;
      }
    }
    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }
}
