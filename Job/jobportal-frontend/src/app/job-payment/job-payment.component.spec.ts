import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPaymentComponent } from './job-payment.component';

describe('JobPaymentComponent', () => {
  let component: JobPaymentComponent;
  let fixture: ComponentFixture<JobPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
