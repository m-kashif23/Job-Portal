import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Manage } from '../model/manage';
import { JobService } from '../services/job.service';
import { ApplicantService } from '../services/applicant.service';
import { RegistrationService } from '../services/registration.service';

@Component({
  selector: 'app-freecategory',
  templateUrl: './freecategory.component.html',
  styleUrls: ['./freecategory.component.css']
})
export class FreecategoryComponent implements OnInit {

  categories: Manage[] = [];
  appliedJobIds = new Set<number>();

  constructor(private service: JobService,
              private applicantService: ApplicantService,
              private auth: RegistrationService,
              private router: Router) { }

  ngOnInit() {
    this.get();
  }

  get() {
    // Filtering now happens on the server: GET /api/jobs/category/free
    this.service.getFreeJobs().subscribe(x => {
      this.categories = x;
    });

    // Mark jobs already applied to so "Apply" isn't offered again for them
    const applicantId = this.auth.getApplicantId();
    if (applicantId) {
      this.applicantService.getMyApplications(applicantId).subscribe(apps => {
        this.appliedJobIds = new Set(apps.filter(a => a.job).map(a => a.job.id));
      });
    }
  }

  hasApplied(job: Manage): boolean {
    return this.appliedJobIds.has(job.id);
  }

  apply(job: Manage) {
    const applicantId = this.auth.getApplicantId();
    if (applicantId) {
      // Profile already exists: apply directly
      this.applicantService.applyToJob(applicantId, job.id).subscribe({
        next: () => {
          this.appliedJobIds.add(job.id);
          alert('Applied successfully');
          this.router.navigate(['/application']);
        },
        error: (err) => alert(err?.error?.message || 'Could not apply')
      });
    } else {
      // No profile yet: remember the job and collect profile details first
      this.auth.setPendingJobId(job.id);
      this.router.navigate(['/freejob']);
    }
  }
}
