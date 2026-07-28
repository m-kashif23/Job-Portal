import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumcategoryComponent } from './premiumcategory.component';

describe('PremiumcategoryComponent', () => {
  let component: PremiumcategoryComponent;
  let fixture: ComponentFixture<PremiumcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremiumcategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
