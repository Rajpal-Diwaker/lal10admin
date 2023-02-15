import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationRoutingModule } from './notification-routing.module';
import { ListComponent } from './list/list.component';
import { UpdateComponent } from './update/update.component';
import { LayoutModule } from '../layout/layout.module';
import { SharedModule } from '../_shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { paginationModule } from '../_shared/pagination.module';
import { multiSelectModule } from '../_shared/multidropselect.module';
import { UsernotificationComponent } from './usernotification/usernotification.component';
@NgModule({
  declarations: [ListComponent, UpdateComponent, UsernotificationComponent],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    LayoutModule,
    SharedModule,
    ComponentsModule,
    paginationModule,
    multiSelectModule
  ]
})
export class NotificationModule { }
