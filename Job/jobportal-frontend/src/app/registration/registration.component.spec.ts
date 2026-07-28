import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { RegistrationComponent } from './registration.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';


describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let debugElement: DebugElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, RouterTestingModule],
      declarations: [RegistrationComponent],
    }).compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent) as any;
    component = fixture.componentInstance as any;
    fixture.detectChanges();
    debugElement = fixture.debugElement;

  });

//   fit('should create the RegistrationComponent', () => {
//     expect(component).toBeTruthy();
//   });

  // fit('should have empty username, password, confirmPassword & role initially on register page', () => {
  //   expect(component.username).toBe('');
  //   expect(component.password).toBe('');
  //   expect(component.confirmPassword).toBe('');
  //   expect(component.role).toBe('');
  // });

  // fit('should call register method on form submission', () => {
  //   spyOn(component, 'register');

  //   const button = fixture.nativeElement.querySelector('button');
  //   component.username = 'testUser';
  //   component.password = 'Test@123';
  //   component.confirmPassword = 'Test@123';
  //   component.role = 'ADMIN';
  //   fixture.detectChanges();

  //   button.click();

  //   expect(component.register).toHaveBeenCalled();
  // });

  fit('frontend_RegistrationComponent_should_show_username_required_error_message_on_register_page', fakeAsync(() => {
    const usernameInput = debugElement.query(By.css('#username'));
    usernameInput.nativeElement.value = ''; // Set an empty value
    usernameInput.nativeElement.dispatchEvent(new Event('input')); // Trigger input event
    fixture.detectChanges();

    tick(); // Advance time to handle async operations

    const errorMessage = debugElement.query(By.css('.error-message'));
    // console.log(errorMessage);


    expect(errorMessage.nativeElement.textContent).toContain('Username is required');
  }));

  fit('frontend_should_show_Email_Invalid_error_message_on_register_page_RegistrationComponent', fakeAsync(() => {
    const emailInput = debugElement.query(By.css('#email'));
    emailInput.nativeElement.value = 12345678; // Set an empty value
    emailInput.nativeElement.dispatchEvent(new Event('input')); // Trigger input event
    fixture.detectChanges();

    tick(); // Advance time to handle async operations

    const errorMessage = debugElement.query(By.css('.error-message'));

    expect(errorMessage.nativeElement.textContent).toContain('Invalid email format');
  }));

  fit('frontend_should_show_MobileNumber_Invalid_error_message_on_register_page_RegistrationComponent', fakeAsync(() => {
    const mobileInput = debugElement.query(By.css('#mobile'));
    mobileInput.nativeElement.value = 12345678; // Set an empty value
    mobileInput.nativeElement.dispatchEvent(new Event('input')); // Trigger input event
    fixture.detectChanges();

    tick(); // Advance time to handle async operations

    const errorMessage = debugElement.query(By.css('.error-message'));

    expect(errorMessage.nativeElement.textContent).toContain('Invalid mobile number format');
  }));

  fit('frontend_RegistrationComponent_should_show_password_required_error_message_on_register_page', fakeAsync(() => {
    const passwordInput = debugElement.query(By.css('#password'));
    passwordInput.nativeElement.value = ''; // Set an empty value
    passwordInput.nativeElement.dispatchEvent(new Event('input')); // Trigger input event
    fixture.detectChanges();

    tick(); // Advance time to handle async operations

    const errorMessage = debugElement.query(By.css('.error-message'));

    expect(errorMessage.nativeElement.textContent).toContain('Password is required');
  }));

  fit('frontend_RegistrationComponent_should_show_password_complexity_error_message_on_register_page_RegistrationComponent', fakeAsync(() => {
    const passwordInput = debugElement.query(By.css('#password'));
    passwordInput.nativeElement.value = 'weakpassword'; // Set a weak password
    passwordInput.nativeElement.dispatchEvent(new Event('input')); // Trigger input event
    fixture.detectChanges();

    tick(); // Advance time to handle async operations

    const errorMessage = debugElement.query(By.css('.error-message'));

    expect(errorMessage.nativeElement.textContent).toContain('Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character');
  }));

  fit('frontend_should_show_confirm_password_required_error_message_on_register_page_RegistrationComponent', fakeAsync(() => {
    const confirmPasswordInput = debugElement.query(By.css('#confirmPassword'));
    confirmPasswordInput.nativeElement.value = ''; // Set an empty value
    confirmPasswordInput.nativeElement.dispatchEvent(new Event('input')); // Trigger input event
    fixture.detectChanges();

    tick(); // Advance time to handle async operations

    const errorMessage = debugElement.query(By.css('.error-message'));

    expect(errorMessage.nativeElement.textContent).toContain('Confirm Password is required');
  }));

  fit('frontend_should_show_passwords_mismatch_error_message_on_register_page_RegistrationComponent', fakeAsync(() => {
    const passwordInput = debugElement.query(By.css('#password'));
    passwordInput.nativeElement.value = 'Test@123'; // Set a password
    passwordInput.nativeElement.dispatchEvent(new Event('input')); // Trigger input event

    const confirmPasswordInput = debugElement.query(By.css('#confirmPassword'));
    confirmPasswordInput.nativeElement.value = 'differentPassword'; // Set a different confirm password
    confirmPasswordInput.nativeElement.dispatchEvent(new Event('input')); // Trigger input event

    fixture.detectChanges();

    tick(); // Advance time to handle async operations

    const errorMessage = debugElement.query(By.css('.error-message'));

    expect(errorMessage.nativeElement.textContent).toContain('Passwords do not match');
  }));
//*************************** */
  // it('Week5_Day4_should navigate to organizer on organizer register', () => {
  //   spyOn(authService, 'register').and.returnValue(of({ role: 'ORGANIZER' }));
  //   const router = TestBed.inject(Router); // Inject Router
  //   spyOn(router, 'navigate'); // Spy on router's navigate method

  //   component.username = 'testUser';
  //   component.password = 'Test@123';
  //   component.confirmPassword = 'Test@123';
  //   component.role = 'ORGANIZER';
  //   component.register();

  //   expect(router.navigate).toHaveBeenCalledWith(['/organizer']); // Use router's navigate method
  // });

  // it('Week5_Day4_should navigate to admin on admin register', () => {
  //   spyOn(authService, 'register').and.returnValue(of({ role: 'ADMIN' }));
  //   const router = TestBed.inject(Router); // Inject Router
  //   spyOn(router, 'navigate'); // Spy on router's navigate method

  //   component.username = 'testUser';
  //   component.password = 'Test@123';
  //   component.confirmPassword = 'Test@123';
  //   component.role = 'ADMIN';
  //   component.register();

  //   expect(router.navigate).toHaveBeenCalledWith(['/admin']); // Use router's navigate method
  // });




});
