import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../_shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutModule } from '../layout/layout.module';
import { ChartsModule } from 'ng2-charts';
import { WebsiteUserComponent } from './website-user/website-user.component';
import { ComponentsModule } from '../components/components.module';
import { UserDetailsComponent } from './user-details/user-details.component';

@NgModule({
  declarations: [LoginComponent, DashboardComponent, WebsiteUserComponent, UserDetailsComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    LayoutModule,
    ChartsModule,
    ComponentsModule
  ]
})
export class UserModule { }
