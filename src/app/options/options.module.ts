import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OptionsRoutingModule } from './options-routing.module';
import { ListingComponent } from './listing/listing.component';
import { AddComponent } from './add/add.component';
import { LayoutModule } from '../layout/layout.module';
import { SharedModule } from '../_shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { multiSelectModule } from '../_shared/multidropselect.module';

@NgModule({
  declarations: [ListingComponent, AddComponent],
  imports: [
    CommonModule,
    OptionsRoutingModule,
    LayoutModule,
    SharedModule,
    ComponentsModule,
    multiSelectModule
  ]
})
export class OptionsModule { }
