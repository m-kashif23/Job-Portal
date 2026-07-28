import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-update-job',
  templateUrl: './update-job.component.html',
  styleUrls: ['./update-job.component.css']
})
export class UpdateJobComponent implements OnInit {

  manageForm: FormGroup;
  id = 0;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private service: JobService,
              private fBuilder: FormBuilder) {
    this.manageForm = this.fBuilder.group({
      jobTitle: ['', Validators.required],
      department: ['', Validators.required],
      location: ['', Validators.required],
      responsibility: ['', Validators.required],
      qualification: ['', Validators.required],
      deadLine: ['', Validators.required],
      applicationFee: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      this.id = +data['id'];
      // The original fetched the job but never filled the form: patchValue fixes that
      this.service.getJobById(this.id).subscribe((job) => {
        this.manageForm.patchValue(job);
      });
    });
  }

  updateJob() {
    if (this.manageForm.invalid) {
      this.manageForm.markAllAsTouched();
      return;
    }
    this.service.updateJob(this.id, this.manageForm.value).subscribe(() => {
      alert('Updated Successfully');
      this.router.navigate(['/edit']);
    });
  }
}
