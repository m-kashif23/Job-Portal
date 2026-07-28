import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicantService } from '../services/applicant.service';
import { RegistrationService } from '../services/registration.service';
import { JobPosting } from '../model/job-posting';

// Premium-job flow: collect the applicant profile, then continue to payment.
// The application itself is created after the payment succeeds.
@Component({
  selector: 'app-job-posting',
  templateUrl: './job-posting.component.html',
  styleUrls: ['./job-posting.component.css']
})
export class JobPostingComponent implements OnInit {

  jobForm: FormGroup;
  selectedResume: File | null = null;

  constructor(private fb: FormBuilder,
              private jobService: ApplicantService,
              private auth: RegistrationService,
              private router: Router) {
    this.jobForm = this.fb.group({
      applicantName: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^(\+\d{1,3}\s?)?\d{9,12}$/)]],
      // Locked to the signed-in account's email: the backend rejects any other email here
      email: [{ value: this.auth.getEmail() || '', disabled: true }, [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
  }

  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedResume = input.files && input.files.length ? input.files[0] : null;
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    const profile = this.jobForm.getRawValue();
    this.jobService.createApplicant(profile).subscribe({
      next: (created) => this.toPayment(created),
      error: (err) => {
        if (err.status === 409) {
          this.jobService.getApplicantByEmail(profile.email).subscribe({
            next: (existing) => this.toPayment(existing),
            error: () => alert('Could not load existing profile')
          });
        } else {
          alert(err?.error?.message || 'Could not create profile');
        }
      }
    });
  }

  private toPayment(applicant: JobPosting) {
    this.auth.setApplicantId(applicant.id);
    if (this.selectedResume && applicant.id) {
      this.jobService.uploadResume(applicant.id, this.selectedResume).subscribe({
        error: (err) => alert(err?.error?.message || 'Could not upload resume')
      });
    }
    this.router.navigate(['/jobpayment']);
  }

  onCancel(): void {
    this.jobForm.reset();
  }
}
