import { Component, OnInit } from '@angular/core';
import { ApplicantService } from '../services/applicant.service';
import { RegistrationService } from '../services/registration.service';
import { Application } from '../model/application';

// Shows the logged-in user's own applications.
// On a fresh login localStorage has no applicantId yet (it was only set after
// filling the profile form), which made this page show "no applications" even
// when the user had some. Now the profile is resolved from the logged-in
// email, remembered, and the applications load right away.
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {

  applications: Application[] = [];
  hasProfile = true;

  constructor(private service: ApplicantService, private auth: RegistrationService) { }

  ngOnInit() {
    this.get();
  }

  get() {
    const applicantId = this.auth.getApplicantId();
    if (applicantId) {
      this.load(applicantId);
      return;
    }

    // Fresh login: recover the profile from the logged-in email
    const email = localStorage.getItem('email');
    if (!email) {
      this.hasProfile = false;
      return;
    }

    this.service.getApplicantByEmail(email).subscribe({
      next: (applicant) => {
        this.auth.setApplicantId(applicant.id);
        this.load(applicant.id);
      },
      error: () => {
        // No profile created yet: genuinely no applications
        this.hasProfile = false;
      }
    });
  }

  private load(applicantId: number) {
    this.hasProfile = true;
    this.service.getMyApplications(applicantId).subscribe({
      next: (x) => this.applications = x,
      error: (err) => alert(err?.error?.message || 'Could not load your applications.')
    });
  }
}
