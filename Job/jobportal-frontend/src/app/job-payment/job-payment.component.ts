import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicantService } from '../services/applicant.service';
import { JobService } from '../services/job.service';
import { RegistrationService } from '../services/registration.service';

// Payment step of the premium flow.
// - The amount is fixed to the job's application fee: it is loaded from the
//   server, shown read-only, and the backend rejects any other value.
// - Card fields only appear for Credit Card mode, and the card number is
//   validated locally for the simulation but NEVER sent to or stored by the server.
// - Before charging, we verify the job is still open and not already applied to,
//   so a payment record is only created when the application will succeed.
@Component({
  selector: 'app-job-payment',
  templateUrl: './job-payment.component.html',
  styleUrls: ['./job-payment.component.css']
})
export class JobPaymentComponent implements OnInit {

  jobForm: FormGroup;
  processing = false;
  jobTitle = '';

  constructor(private fb: FormBuilder,
              private service: ApplicantService,
              private jobService: JobService,
              private auth: RegistrationService,
              private router: Router) {
    this.jobForm = this.fb.group({
      modeOfPayment: ['', Validators.required],
      cardHolderName: [''],
      cardNumber: [''],
      // Fee comes from the job and cannot be edited
      totalAmount: [{ value: '', disabled: true }, [Validators.required, Validators.min(1)]]
    });

    // Card fields are required only when paying by credit card
    this.jobForm.get('modeOfPayment').valueChanges.subscribe(mode => {
      const holder = this.jobForm.get('cardHolderName');
      const number = this.jobForm.get('cardNumber');
      if (mode === 'Credit Card') {
        holder.setValidators([Validators.required]);
        number.setValidators([Validators.required, Validators.pattern(/^\d{13,19}$/)]);
      } else {
        holder.clearValidators();
        holder.setValue('');
        number.clearValidators();
        number.setValue('');
      }
      holder.updateValueAndValidity();
      number.updateValueAndValidity();
    });
  }

  get isCard(): boolean {
    return this.jobForm.get('modeOfPayment').value === 'Credit Card';
  }

  ngOnInit(): void {
    if (!this.auth.getApplicantId()) {
      this.router.navigate(['/jobposting']);
      return;
    }

    const jobId = this.auth.getPendingJobId();
    if (!jobId) {
      // Payments are always for a specific job's application fee
      alert('No job selected for payment. Choose a premium job first.');
      this.router.navigate(['/premiumcategory']);
      return;
    }

    // Load the job so the fee is fixed by server data, not user input
    this.jobService.getJobById(jobId).subscribe({
      next: (job) => {
        this.jobTitle = job.jobTitle;
        this.jobForm.get('totalAmount').setValue(job.applicationFee);
      },
      error: () => {
        alert('This job is no longer available.');
        this.auth.clearPendingJobId();
        this.router.navigate(['/premiumcategory']);
      }
    });
  }

  onSubmit() {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }
    if (this.processing) { return; }

    const applicantId = this.auth.getApplicantId();
    const jobId = this.auth.getPendingJobId();

    if (!jobId) {
      alert('No job selected for payment. Choose a premium job first.');
      this.router.navigate(['/premiumcategory']);
      return;
    }

    this.processing = true;

    // Pre-check 1: job still exists and the deadline has not passed
    this.jobService.getJobById(jobId).subscribe({
      next: (job) => {
        if (job.deadLine && new Date(job.deadLine) < new Date(new Date().toDateString())) {
          this.fail('The application deadline for this job has passed. No payment was taken.');
          return;
        }
        // Pre-check 2: not already applied
        this.service.getMyApplications(applicantId).subscribe({
          next: (apps) => {
            const duplicate = apps.some(a => a.job && a.job.id === jobId);
            if (duplicate) {
              this.auth.clearPendingJobId();
              this.fail('You have already applied to this job. No payment was taken.');
              this.router.navigate(['/application']);
              return;
            }
            this.charge(applicantId, jobId);
          },
          error: () => this.charge(applicantId, jobId)
        });
      },
      error: () => this.fail('This job is no longer available. No payment was taken.')
    });
  }

  private charge(applicantId: number, jobId: number) {
    // getRawValue() includes the disabled totalAmount control.
    // The card number stays on this device: it is deliberately excluded from the payload.
    const raw = this.jobForm.getRawValue();
    const payment = {
      modeOfPayment: raw.modeOfPayment,
      cardHolderName: raw.cardHolderName || null,
      totalAmount: raw.totalAmount
    };

    this.service.createPayment(applicantId, jobId, payment as any).subscribe({
      next: () => {
        this.service.applyToJob(applicantId, jobId).subscribe({
          next: () => {
            this.processing = false;
            this.auth.clearPendingJobId();
            alert('Payment successful, application submitted');
            this.router.navigate(['/application']);
          },
          error: (err) => this.fail(err?.error?.message || 'Payment was recorded but the application could not be submitted. Contact the admin.')
        });
      },
      error: (err) => this.fail(err?.error?.message || 'Payment failed. Nothing was recorded.')
    });
  }

  private fail(message: string) {
    this.processing = false;
    alert(message);
  }

  onCancel(): void {
    // The amount stays: it is fixed to the job fee
    this.jobForm.patchValue({ modeOfPayment: '', cardHolderName: '', cardNumber: '' });
    this.jobForm.markAsUntouched();
  }
}
