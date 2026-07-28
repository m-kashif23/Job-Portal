import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicantService } from '../services/applicant.service';
import { RegistrationService } from '../services/registration.service';
import { JobPosting } from '../model/job-posting';

// Free-job flow: collect the applicant profile, then apply directly (no payment)
@Component({
  selector: 'app-freejobposting',
  templateUrl: './freejobposting.component.html',
  styleUrls: ['./freejobposting.component.css']
})
export class FreejobpostingComponent implements OnInit {

  jobform: FormGroup;
  selectedResume: File | null = null;

  constructor(private fb: FormBuilder,
              private service: ApplicantService,
              private auth: RegistrationService,
              private router: Router) {
    this.jobform = this.fb.group({
      applicantName: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^(\+\d{1,3}\s?)?\d{9,12}$/)]],
      // Locked to the signed-in account's email: the backend rejects any other email here
      email: [{ value: this.auth.getEmail() || '', disabled: true }, [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
  }

  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedResume = input.files && input.files.length ? input.files[0] : null;
  }

  onSubmit() {
    if (this.jobform.invalid) {
      this.jobform.markAllAsTouched();
      return;
    }

    const profile = this.jobform.getRawValue();
    this.service.createApplicant(profile).subscribe({
      next: (created) => this.applyWith(created),
      error: (err) => {
        if (err.status === 409) {
          // Profile already exists for this email: reuse it
          this.service.getApplicantByEmail(profile.email).subscribe({
            next: (existing) => this.applyWith(existing),
            error: () => alert('Could not load existing profile')
          });
        } else {
          alert(err?.error?.message || 'Could not create profile');
        }
      }
    });
  }

  private applyWith(applicant: JobPosting) {
    this.auth.setApplicantId(applicant.id);
    if (this.selectedResume && applicant.id) {
      this.service.uploadResume(applicant.id, this.selectedResume).subscribe({
        error: (err) => alert(err?.error?.message || 'Could not upload resume')
      });
    }
    const jobId = this.auth.getPendingJobId();
    if (!jobId) {
      this.router.navigate(['/freecategory']);
      return;
    }
    this.service.applyToJob(applicant.id, jobId).subscribe({
      next: () => {
        this.auth.clearPendingJobId();
        alert('Applied successfully');
        this.router.navigate(['/application']);
      },
      error: (err) => alert(err?.error?.message || 'Could not apply')
    });
  }

  onCancel(): void {
    this.jobform.reset();
  }
}
