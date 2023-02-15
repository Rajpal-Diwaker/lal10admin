import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutingModule } from './gallery-routing.module';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { ComponentsModule } from '../components/components.module';
import { LayoutModule } from '../layout/layout.module';
import { multiSelectModule } from '../_shared/multidropselect.module';
import { paginationModule } from '../_shared/pagination.module';
import { SharedModule } from '../_shared/shared.module';

@NgModule({
  declarations: [ListComponent, ViewComponent],
  imports: [
    CommonModule,
    GalleryRoutingModule,
    LayoutModule,
    SharedModule,
    ComponentsModule,
    paginationModule,
    multiSelectModule
  ]
})
export class GalleryModule { }
