import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  msg = false;          // "User already exists"
  errorMsg = '';        // message from the backend (409 body)
  registrationForm: FormGroup;

  // Role dropdown removed: public registration always creates a USER on the backend
  constructor(private form: FormBuilder, private ser: RegistrationService, private router: Router) {
    this.registrationForm = this.form.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^(\+\d{1,3}\s?)?\d{9,12}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/)]],
      cpassword: ['', [Validators.required]]
    },
    {
      validator: this.passwordMatch
    });
  }

  ngOnInit() {
  }

  passwordMatch(group: FormGroup) {
    const password = group.get('password').value;
    const cpassword = group.get('cpassword').value;
    return password === cpassword ? null : { mismatch: true };
  }

  register() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.msg = false;
    const { cpassword, ...user } = this.registrationForm.value; // don't send cpassword
    this.ser.postUser(user).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.msg = true; // 409: email or username already taken
        this.errorMsg = err?.error?.message || 'User already exists';
      }
    });
  }

  ulogin() {
    this.router.navigate(['/login']);
  }
}
