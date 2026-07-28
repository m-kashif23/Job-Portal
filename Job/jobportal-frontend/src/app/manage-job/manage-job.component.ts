import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Manage } from '../model/manage';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-manage-job',
  templateUrl: './manage-job.component.html',
  styleUrls: ['./manage-job.component.css']
})
export class ManageJobComponent implements OnInit {

  manageForm: FormGroup;
  manages: Manage[] = [];

  constructor(private fb: FormBuilder, private manageService: JobService) {
    // deadLine uses <input type="date"> which produces yyyy-MM-dd, exactly what
    // the backend LocalDate expects. The old dd-mm-yyyy regex validator (which was
    // also wired incorrectly as an async validator) is gone.
    this.manageForm = this.fb.group({
      jobTitle: ['', Validators.required],
      department: ['', Validators.required],
      location: ['', Validators.required],
      responsibility: ['', Validators.required],
      qualification: ['', Validators.required],
      deadLine: ['', Validators.required],
      applicationFee: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });

    // Free jobs have no application fee: lock it to 0 and stop asking for it
    this.manageForm.get('category').valueChanges.subscribe(category => {
      const fee = this.manageForm.get('applicationFee');
      if (category === 'free') {
        fee.setValue(0);
        fee.disable();
      } else {
        fee.enable();
        if (fee.value === 0) {
          fee.setValue('');
        }
      }
    });
  }

  ngOnInit(): void {
    this.loadManage();
  }

  loadManage(): void {
    this.manageService.getJobs().subscribe(manages => {
      this.manages = manages;
    });
  }

  onSubmit(): void {
    if (this.manageForm.invalid) {
      this.manageForm.markAllAsTouched();
      return;
    }
    this.manageService.addJob(this.manageForm.getRawValue()).subscribe({
      next: () => {
        this.loadManage();
        this.manageForm.reset();
      },
      error: (err) => alert(err?.error?.message || 'Failed to add job.')
    });
  }

  onCancel(): void {
    this.manageForm.reset();
  }

  deleteJob(manageId: number): void {
    if (!confirm('Delete this job? All applications for it will also be removed.')) {
      return;
    }
    this.manageService.deleteJob(manageId).subscribe({
      next: () => {
        this.manages = this.manages.filter(m => m.id !== manageId);
      },
      error: (err) => alert(err?.error?.message || 'Failed to delete job.')
    });
  }
}
