import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSettingRoutingModule } from './app-setting-routing.module';
import { ListComponent } from './list/list.component';
import { UpdateComponent } from './update/update.component';
import { ComponentsModule } from '../components/components.module';
import { LayoutModule } from '../layout/layout.module';
import { multiSelectModule } from '../_shared/multidropselect.module';
import { paginationModule } from '../_shared/pagination.module';
import { SharedModule } from '../_shared/shared.module';

@NgModule({
  declarations: [ListComponent, UpdateComponent],
  imports: [
    CommonModule,
    AppSettingRoutingModule,
    LayoutModule,
    SharedModule,
    ComponentsModule,
    paginationModule,
    multiSelectModule
  ]
})
export class AppSettingModule { }
