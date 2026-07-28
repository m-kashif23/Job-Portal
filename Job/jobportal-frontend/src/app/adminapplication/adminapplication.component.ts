import { Component, OnInit } from '@angular/core';
import { ApplicantService } from '../services/applicant.service';
import { Application } from '../model/application';

@Component({
  selector: 'app-adminapplication',
  templateUrl: './adminapplication.component.html',
  styleUrls: ['./adminapplication.component.css']
})
export class AdminapplicationComponent implements OnInit {

  applications: any[] = [];
  status = ['APPLIED', 'SHORTLISTED', 'REJECTED', 'SELECTED'];
  updatingId: number | null = null;

  constructor(private service: ApplicantService) { }

  ngOnInit() {
    this.get();
  }

  get() {
    this.service.getAllApplications().subscribe({
      next: (x) => {
        // Each row gets its own editable copy of the status so the dropdown
        // binds reliably and can be reverted if the server rejects the change
        this.applications = x.map(app => ({ ...app, selectedStatus: app.status }));
      },
      error: (err) => alert(err?.error?.message || 'Could not load applications.')
    });
  }

  changeStatus(item: any, newStatus: string) {
    if (!newStatus || newStatus === item.status) {
      item.selectedStatus = item.status;
      return;
    }
    item.selectedStatus = newStatus;
    this.updatingId = item.id;

    this.service.updateApplicationStatus(item.id, newStatus).subscribe({
      next: (updated) => {
        this.updatingId = null;
        item.status = updated.status;
        item.selectedStatus = updated.status;
      },
      error: (err) => {
        this.updatingId = null;
        item.selectedStatus = item.status; // revert the dropdown
        alert(err?.error?.message || 'Failed to update status. Are you logged in as admin?');
      }
    });
  }

  viewResume(item: any) {
    const applicantId = item.applicant?.id;
    if (!applicantId) {
      return;
    }
    this.service.viewResume(applicantId).subscribe({
      next: (blob) => window.open(window.URL.createObjectURL(blob), '_blank')
    });
  }

  // Deletes the application record only, never the applicant or the job
  delete(id: number) {
    if (!confirm('Delete this application?')) {
      return;
    }
    this.service.deleteApplication(id).subscribe({
      next: () => {
        this.applications = this.applications.filter(a => a.id !== id);
      },
      error: (err) => alert(err?.error?.message || 'Failed to delete application.')
    });
  }
}
