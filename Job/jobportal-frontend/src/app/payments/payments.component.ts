import { Component, OnInit } from '@angular/core';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  payments: any[] = [];

  constructor(private service: JobService) { }

  ngOnInit() {
    this.getpayments();
  }

  getpayments() {
    this.service.getPayments().subscribe({
      next: (x) => this.payments = x,
      error: (err) => alert(err?.error?.message || 'Could not load payments.')
    });
  }

  deletePayment(id: number) {
    if (!confirm('Delete this payment record?')) {
      return;
    }
    this.service.deletePayment(id).subscribe({
      next: () => {
        this.payments = this.payments.filter(p => p.id !== id);
      },
      error: (err) => alert(err?.error?.message || 'Failed to delete payment.')
    });
  }
}
