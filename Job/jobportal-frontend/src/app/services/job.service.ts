import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobPayment } from '../model/job-payment';
import { Manage } from '../model/manage';
import { Application } from '../model/application';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class JobService {

  private baseUrl = environment.apiBaseUrl + '/api';

  constructor(private http: HttpClient) { }

  // ---------------- Jobs ----------------

  getJobs(): Observable<Manage[]> {
    return this.http.get<Manage[]>(`${this.baseUrl}/jobs`);
  }

  getJobById(id: number): Observable<Manage> {
    return this.http.get<Manage>(`${this.baseUrl}/jobs/${id}`);
  }

  getFreeJobs(): Observable<Manage[]> {
    return this.http.get<Manage[]>(`${this.baseUrl}/jobs/category/free`);
  }

  getPremiumJobs(): Observable<Manage[]> {
    return this.http.get<Manage[]>(`${this.baseUrl}/jobs/category/premium`);
  }

  // ---------------- Admin: jobs ----------------

  addJob(job: Manage): Observable<Manage> {
    return this.http.post<Manage>(`${this.baseUrl}/admin/jobs`, job);
  }

  updateJob(id: number, job: Manage): Observable<Manage> {
    return this.http.put<Manage>(`${this.baseUrl}/admin/jobs/${id}`, job);
  }

  deleteJob(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/admin/jobs/${id}`);
  }

  // ---------------- Admin: applications ----------------

  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/admin/applications`);
  }

  updateApplicationStatus(applicationId: number, status: string): Observable<Application> {
    return this.http.put<Application>(
      `${this.baseUrl}/admin/applications/${applicationId}/status`,
      { status }
    );
  }

  deleteApplication(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/admin/applications/${id}`);
  }

  // ---------------- Payments ----------------

  // Payment is tied to a job. The backend validates that totalAmount
  // is exactly the job's applicationFee.
  makePayment(applicantId: number, jobId: number, payment: JobPayment): Observable<JobPayment> {
    return this.http.post<JobPayment>(
      `${this.baseUrl}/applicants/${applicantId}/jobs/${jobId}/payments`,
      payment
    );
  }

  getPayments(): Observable<JobPayment[]> {
    return this.http.get<JobPayment[]>(`${this.baseUrl}/admin/payments`);
  }

  deletePayment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/admin/payments/${id}`);
  }
}