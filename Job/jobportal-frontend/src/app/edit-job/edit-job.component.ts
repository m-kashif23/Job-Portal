import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Manage } from '../model/manage';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.css']
})
export class EditJobComponent implements OnInit {

  categories: Manage[] = [];

  constructor(private service: JobService, private router: Router) { }

  ngOnInit() {
    this.get();
  }

  get() {
    this.service.getJobs().subscribe(x => {
      this.categories = x;
    });
  }

  deleteJob(jobId: number): void {
    this.service.deleteJob(jobId).subscribe(() => {
      this.get();
    });
  }

  editManage(id: number) {
    this.router.navigate(['/updateManage', id]);
  }
}
