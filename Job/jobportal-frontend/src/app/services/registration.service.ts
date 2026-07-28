import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserProfile } from '../model/user-profile';

export interface AuthResponse {
  token: string;
  email: string;
  roles: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private url = environment.apiBaseUrl + '/auth/';

  constructor(private http: HttpClient) { }

  // Registration: role is decided by the backend (always USER), so no roles field is sent
  postUser(obj: any): Observable<any> {
    return this.http.post<any>(this.url + 'register', obj);
  }

  // Login: only email + password. The role comes back from the server inside the response.
  generateToken(obj: { email: string, password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.url + 'login', obj).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('roles', res.roles);
        localStorage.setItem('email', res.email);
      })
    );
  }

  // ---- Own profile ----

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.url + 'me');
  }

  updateProfile(payload: { username: string, mobileNumber: string }): Observable<any> {
    return this.http.put(this.url + 'me', payload);
  }

  changePassword(payload: { currentPassword: string, newPassword: string }): Observable<any> {
    return this.http.put(this.url + 'password', payload);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('email');
    localStorage.removeItem('applicantId');
    localStorage.removeItem('pendingJobId');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  getRole(): string | null {
    return localStorage.getItem('roles');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  // ---- Applicant profile id, remembered after the profile is created ----

  setApplicantId(id: number): void {
    localStorage.setItem('applicantId', String(id));
  }

  getApplicantId(): number | null {
    const id = localStorage.getItem('applicantId');
    return id ? Number(id) : null;
  }

  // ---- Job the user clicked Apply on, before filling the profile form ----

  setPendingJobId(id: number): void {
    localStorage.setItem('pendingJobId', String(id));
  }

  getPendingJobId(): number | null {
    const id = localStorage.getItem('pendingJobId');
    return id ? Number(id) : null;
  }

  clearPendingJobId(): void {
    localStorage.removeItem('pendingJobId');
  }
}
