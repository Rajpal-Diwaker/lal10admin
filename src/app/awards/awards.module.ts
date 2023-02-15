import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AwardsRoutingModule } from './awards-routing.module';
import { ListingComponent } from './listing/listing.component';
import { DetailsComponent } from './details/details.component';
import { LayoutModule } from '../layout/layout.module';
import { SharedModule } from '../_shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { multiSelectModule } from '../_shared/multidropselect.module';
import { paginationModule } from '../_shared/pagination.module';


@NgModule({
  declarations: [ListingComponent, DetailsComponent],
  imports: [
    CommonModule,
    AwardsRoutingModule,
    LayoutModule,
    SharedModule,
    ComponentsModule,
    paginationModule,
    multiSelectModule
  ]
})
export class AwardsModule { }
