import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubAdminRoutingModule } from './sub-admin-routing.module';
import { ListComponent } from './list/list.component';
import { UpdateComponent } from './update/update.component';
import { LayoutModule } from '../layout/layout.module';
import { SharedModule } from '../_shared/shared.module';
import { paginationModule } from '../_shared/pagination.module';
import { multiSelectModule } from '../_shared/multidropselect.module';
import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from '../_shared/material.module';
import { CreateSubadminComponent } from './create-subadmin/create-subadmin.component';

@NgModule({
  declarations: [ListComponent, UpdateComponent, CreateSubadminComponent],
  imports: [
    CommonModule,
    SubAdminRoutingModule,
    LayoutModule,
    MaterialModule,
    SharedModule,
    ComponentsModule,
    paginationModule,
    multiSelectModule
  ]
})
export class SubAdminModule { }
