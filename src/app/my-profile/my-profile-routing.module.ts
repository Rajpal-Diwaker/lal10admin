import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { BusinessComponent } from './business/business.component';
import { PasswordComponent } from './password/password.component';

const routes: Routes = [
  { path: 'profile', component: ProfileComponent },
  { path: 'business', component: BusinessComponent },
  { path: 'password', component: PasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyProfileRoutingModule { }
