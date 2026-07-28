import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  email = '';
  profileForm: FormGroup;
  passwordForm: FormGroup;

  profileSuccess = false;
  profileError = '';
  passwordSuccess = false;
  passwordError = '';

  constructor(private fb: FormBuilder, private auth: RegistrationService) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^(\+\d{1,3}\s?)?\d{9,12}$/)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', Validators.required]
    }, { validator: this.passwordsMatch });
  }

  ngOnInit(): void {
    this.email = this.auth.getEmail() || '';
    this.auth.getProfile().subscribe({
      next: (profile) => this.profileForm.patchValue({
        username: profile.username,
        mobileNumber: profile.mobileNumber
      })
    });
  }

  passwordsMatch(group: FormGroup) {
    const newPassword = group.get('newPassword').value;
    const confirmNewPassword = group.get('confirmNewPassword').value;
    return newPassword === confirmNewPassword ? null : { mismatch: true };
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.profileSuccess = false;
    this.profileError = '';
    this.auth.updateProfile(this.profileForm.value).subscribe({
      next: () => this.profileSuccess = true,
      error: (err) => this.profileError = err?.error?.message || 'Could not update profile'
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.passwordSuccess = false;
    this.passwordError = '';
    const { confirmNewPassword, ...payload } = this.passwordForm.value;
    this.auth.changePassword(payload).subscribe({
      next: () => {
        this.passwordSuccess = true;
        this.passwordForm.reset();
      },
      error: (err) => this.passwordError = err?.error?.message || 'Could not change password'
    });
  }
}
