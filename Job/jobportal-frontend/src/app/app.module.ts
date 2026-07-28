import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { JobPaymentComponent } from './job-payment/job-payment.component';
import { JobPostingComponent } from './job-posting/job-posting.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AdminComponent } from './admin/admin.component';
import { AdminnavbarComponent } from './adminnavbar/adminnavbar.component';
import { UserComponent } from './user/user.component';
import { UsernavbarComponent } from './usernavbar/usernavbar.component';
import { ManageJobComponent } from './manage-job/manage-job.component';
import { FreecategoryComponent } from './freecategory/freecategory.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PremiumcategoryComponent } from './premiumcategory/premiumcategory.component';
import { AdminapplicationComponent } from './adminapplication/adminapplication.component';
import { PaymentsComponent } from './payments/payments.component';
import { ApplicationComponent } from './application/application.component';
import { FreejobpostingComponent } from './freejobposting/freejobposting.component';
import { EditJobComponent } from './edit-job/edit-job.component';
import { UpdateJobComponent } from './update-job/update-job.component';
import { AuthInterceptor } from './auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    JobPaymentComponent,
    JobPostingComponent,
    ProfileComponent,
    HomeComponent,
    NavbarComponent,
    AdminComponent,
    AdminnavbarComponent,
    UserComponent,
    UsernavbarComponent,
    ManageJobComponent,
    FreecategoryComponent,
    HomepageComponent,
    PremiumcategoryComponent,
    AdminapplicationComponent,
    PaymentsComponent,
    ApplicationComponent,
    FreejobpostingComponent,
    EditJobComponent,
    UpdateJobComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
