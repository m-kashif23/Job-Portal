import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreejobpostingComponent } from './freejobposting.component';

describe('FreejobpostingComponent', () => {
  let component: FreejobpostingComponent;
  let fixture: ComponentFixture<FreejobpostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreejobpostingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreejobpostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
