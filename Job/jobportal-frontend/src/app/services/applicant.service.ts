import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application } from '../model/application';
import { JobPosting } from '../model/job-posting';
import { JobPayment } from '../model/job-payment';
import { environment } from '../../environments/environment';

// Applicant profiles, job applications and payments.
@Injectable({
  providedIn: 'root'
})
export class ApplicantService {

  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // ---- Applicant profile ----

  createApplicant(applicant: JobPosting): Observable<JobPosting> {
    return this.http.post<JobPosting>(`${this.base}/api/applicants`, applicant);
  }

  getApplicant(id: number): Observable<JobPosting> {
    return this.http.get<JobPosting>(`${this.base}/api/applicants/${id}`);
  }

  getApplicantByEmail(email: string): Observable<JobPosting> {
    return this.http.get<JobPosting>(`${this.base}/api/applicants/by-email`, { params: { email } });
  }

  // ---- Resume ----

  uploadResume(applicantId: number, file: File): Observable<JobPosting> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<JobPosting>(`${this.base}/api/applicants/${applicantId}/resume`, formData);
  }

  // ---- Resume ----

  viewResume(applicantId: number): Observable<Blob> {
    return this.http.get(`${this.base}/api/applicants/${applicantId}/resume`, { responseType: 'blob' });
  }

  // ---- Applications ----

  applyToJob(applicantId: number, jobId: number): Observable<Application> {
    return this.http.post<Application>(`${this.base}/api/applicants/${applicantId}/apply/${jobId}`, {});
  }

  getMyApplications(applicantId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.base}/api/applicants/${applicantId}/applications`);
  }

  // ---- Applications (admin) ----

  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.base}/api/admin/applications`);
  }

  updateApplicationStatus(applicationId: number, status: string): Observable<Application> {
    return this.http.put<Application>(`${this.base}/api/admin/applications/${applicationId}/status`, { status });
  }

  deleteApplication(applicationId: number): Observable<any> {
    return this.http.delete(`${this.base}/api/admin/applications/${applicationId}`);
  }

  getApplicants(): Observable<JobPosting[]> {
    return this.http.get<JobPosting[]>(`${this.base}/api/admin/applicants`);
  }

  deleteApplicant(id: number): Observable<any> {
    return this.http.delete(`${this.base}/api/admin/applicants/${id}`);
  }

  // ---- Payments ----

  // Payment is tied to a job. The backend validates that totalAmount is
  // exactly the job's applicationFee and updates any existing payment for
  // this applicant instead of inserting a duplicate.
  createPayment(applicantId: number, jobId: number, payment: JobPayment): Observable<JobPayment> {
    return this.http.post<JobPayment>(
      `${this.base}/api/applicants/${applicantId}/jobs/${jobId}/payments`, payment);
  }

  getPayment(id: number): Observable<JobPayment> {
    return this.http.get<JobPayment>(`${this.base}/api/payments/${id}`);
  }
}
