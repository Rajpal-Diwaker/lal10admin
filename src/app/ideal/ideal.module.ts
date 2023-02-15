import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IdealRoutingModule } from './ideal-routing.module';
import { AddComponent } from './add/add.component';
import { ListingComponent } from './listing/listing.component';
import { SharedModule } from '../_shared/shared.module';
import { LayoutModule } from '../layout/layout.module';
import { ComponentsModule } from '../components/components.module';
import { RangebarModule } from '../_shared/rangebar.module';
import { paginationModule } from '../_shared/pagination.module';
import { AllproductComponent } from './allproduct/allproduct.component';
import { SelectModule } from '../_shared/select.module';

@NgModule({
  declarations: [AddComponent, ListingComponent, AllproductComponent],
  imports: [
    CommonModule,
    IdealRoutingModule,
    LayoutModule,
    ComponentsModule,
    SharedModule,
    RangebarModule,
    paginationModule,
    SelectModule
  ]
})
export class IdealModule { }
