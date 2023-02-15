import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyProfileRoutingModule } from './my-profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { BusinessComponent } from './business/business.component';
import { PasswordComponent } from './password/password.component';
import { LayoutModule } from '../layout/layout.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../_shared/shared.module';

@NgModule({
  declarations: [ProfileComponent, BusinessComponent, PasswordComponent],
  imports: [
    CommonModule,
    MyProfileRoutingModule,
    LayoutModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class MyProfileModule { }
