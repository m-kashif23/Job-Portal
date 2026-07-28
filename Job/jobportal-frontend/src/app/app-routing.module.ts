import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { JobPaymentComponent } from './job-payment/job-payment.component';
import { JobPostingComponent } from './job-posting/job-posting.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AuthguardGuard } from './authguard.guard';
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
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },

  // Any logged-in user
  { path: 'user', component: UserComponent, canActivate: [AuthguardGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthguardGuard] },
  { path: 'homepage', component: HomepageComponent, canActivate: [AuthguardGuard] },
  { path: 'freecategory', component: FreecategoryComponent, canActivate: [AuthguardGuard] },
  { path: 'premiumcategory', component: PremiumcategoryComponent, canActivate: [AuthguardGuard] },
  { path: 'jobposting', component: JobPostingComponent, canActivate: [AuthguardGuard] },
  { path: 'freejob', component: FreejobpostingComponent, canActivate: [AuthguardGuard] },
  { path: 'jobpayment', component: JobPaymentComponent, canActivate: [AuthguardGuard] },
  { path: 'application', component: ApplicationComponent, canActivate: [AuthguardGuard] },

  // Admin only
  { path: 'admin', component: AdminComponent, canActivate: [AuthguardGuard], data: { role: 'ADMIN' } },
  { path: 'managejob', component: ManageJobComponent, canActivate: [AuthguardGuard], data: { role: 'ADMIN' } },
  { path: 'edit', component: EditJobComponent, canActivate: [AuthguardGuard], data: { role: 'ADMIN' } },
  { path: 'updateManage/:id', component: UpdateJobComponent, canActivate: [AuthguardGuard], data: { role: 'ADMIN' } },
  { path: 'adminapplication', component: AdminapplicationComponent, canActivate: [AuthguardGuard], data: { role: 'ADMIN' } },
  { path: 'payments', component: PaymentsComponent, canActivate: [AuthguardGuard], data: { role: 'ADMIN' } },

  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
