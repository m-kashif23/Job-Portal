import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RegistrationService } from './services/registration.service';

// Attaches "Authorization: Bearer <token>" to every request except the public
// /auth/register and /auth/login endpoints (and their aliases), and redirects
// to /login when the backend answers 401 (expired/invalid token).
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: RegistrationService, private router: Router) { }

  private isPublicAuthUrl(url: string): boolean {
    return /\/auth\/(register|addNewUser|login|generateToken)(\?|$)/.test(url);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    const isPublic = this.isPublicAuthUrl(req.url);

    if (token && !isPublic) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !isPublic) {
          this.auth.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }
}
