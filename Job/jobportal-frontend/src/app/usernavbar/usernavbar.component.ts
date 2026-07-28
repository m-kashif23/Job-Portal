import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration.service';

@Component({
  selector: 'app-usernavbar',
  templateUrl: './usernavbar.component.html',
  styleUrls: ['./usernavbar.component.css']
})
export class UsernavbarComponent implements OnInit {

  constructor(private auth: RegistrationService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.auth.logout(); // clears the JWT; before, "Log Out" only navigated away
    this.router.navigate(['/home']);
  }
}
