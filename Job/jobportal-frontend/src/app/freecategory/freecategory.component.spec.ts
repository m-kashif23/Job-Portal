import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecategoryComponent } from './freecategory.component';

describe('FreecategoryComponent', () => {
  let component: FreecategoryComponent;
  let fixture: ComponentFixture<FreecategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreecategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
