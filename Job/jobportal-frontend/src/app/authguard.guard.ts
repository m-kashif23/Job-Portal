import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { RegistrationService } from './services/registration.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard implements CanActivate {

  constructor(private ser: RegistrationService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    // Token-based check (survives page refresh, unlike the old in-memory boolean)
    if (!this.ser.isLoggedIn()) {
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    // Optional role check, driven by route data: { role: 'ADMIN' }
    const requiredRole = next.data['role'];
    if (requiredRole && this.ser.getRole() !== requiredRole) {
      return this.router.createUrlTree([this.ser.isAdmin() ? '/admin' : '/user']);
    }

    return true;
  }
}
