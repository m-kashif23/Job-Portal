import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminapplicationComponent } from './adminapplication.component';

describe('AdminapplicationComponent', () => {
  let component: AdminapplicationComponent;
  let fixture: ComponentFixture<AdminapplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminapplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminapplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
