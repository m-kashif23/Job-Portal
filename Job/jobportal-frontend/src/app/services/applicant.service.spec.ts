import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApplicantService } from './applicant.service';

describe('ApplicantService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApplicantService],
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));
  fit('frontend_ApplicantService_should create an applicant by passing Authorization', inject([ApplicantService, HttpTestingController], (service: ApplicantService, httpMock: HttpTestingController) => {
    const mockApplicant = { applicantName: 'John Doe', jobTitle: 'Software Engineer', status: 'Applied' };

    service['createApplicant'](mockApplicant).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/applicant`);
    expect(req.request.headers.has('Authorization')).toEqual(true);
    req.flush({});
  }));

  fit('frontend_ApplicantService_should create an applicant', inject([ApplicantService, HttpTestingController], (service: ApplicantService, httpMock: HttpTestingController) => {
    const mockApplicant = { applicantName: 'John Doe', jobTitle: 'Software Engineer', status: 'Applied' };

    service['createApplicant'](mockApplicant).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/applicant`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  }));

  fit('frontend_ApplicantService_should get all jobs for an applicant', inject([ApplicantService, HttpTestingController], (service: ApplicantService, httpMock: HttpTestingController) => {
    service['getAllJobs']().subscribe(response => {
      expect(response).toBeTruthy();
      // expect(response.length).toBe(0);
      expect(response).toEqual({});

    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/applicant/job`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  }));
});
