import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JobService } from './job.service';

describe('JobService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JobService],
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  // it('should be created', inject([JobService], (service: JobService) => {
  //   expect(service).toBeTruthy();
  // }));

  fit('frontend_JobService_should create a job', inject([JobService, HttpTestingController], (service: JobService, httpMock: HttpTestingController) => {
    const mockJob = { title: 'Software Engineer', dept: 'IT', location: 'Remote', responsibility: 'Develop software', qualification: 'Bachelor\'s degree', deadline: new Date(), category: 'IT' };

    service['createJob'](mockJob).subscribe(response => {
      expect(response).toBeTruthy();
      // Add more assertions based on your API response
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/job`);
    expect(req.request.method).toBe('POST');
    req.flush({}); // Mock successful response
  }));

  fit('frontend_JobService_should create a job by passing Authorization', inject([JobService, HttpTestingController], (service: JobService, httpMock: HttpTestingController) => {
    const mockJob = { title: 'Software Engineer', dept: 'IT', location: 'Remote', responsibility: 'Develop software', qualification: 'Bachelor\'s degree', deadline: new Date(), category: 'IT' };

    service['createJob'](mockJob).subscribe(response => {
      expect(response).toBeTruthy();
      // Add more assertions based on your API response
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/job`);
    expect(req.request.headers.has('Authorization')).toEqual(true);
    req.flush({}); // Mock successful response
  }));

  fit('frontend_JobService_should get jobs', inject([JobService, HttpTestingController], (service: JobService, httpMock: HttpTestingController) => {
    service['getJobs']().subscribe(response => {
      expect(response).toBeTruthy();
      // Add more assertions based on your API response
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/job`);
    expect(req.request.method).toBe('GET');
    req.flush({}); // Mock successful response
  }));

  fit('frontend_JobService_should get a job by title', inject([JobService, HttpTestingController], (service: JobService, httpMock: HttpTestingController) => {
    const jobTitle = 'Software Engineer';

    service['getJobByTitle'](jobTitle).subscribe(response => {
      expect(response).toBeTruthy();
      // Add more assertions based on your API response
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/job/${jobTitle}`);
    expect(req.request.method).toBe('GET');
    req.flush({}); // Mock successful response
  }));

  fit('frontend_JobService_should get premium jobs', inject([JobService, HttpTestingController], (service: JobService, httpMock: HttpTestingController) => {
    service['getPremiumJobs']().subscribe(response => {
      expect(response).toBeTruthy();
      // Add more assertions based on your API response
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/job/premiumjobs`);
    expect(req.request.method).toBe('GET');
    req.flush({}); // Mock successful response
  }));
});
