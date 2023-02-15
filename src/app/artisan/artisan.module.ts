import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtisanRoutingModule } from './artisan-routing.module';
import { ListingComponent } from './listing/listing.component';
import { LayoutModule } from '../layout/layout.module';
import { AddComponent } from './add/add.component';
import { SharedModule } from '../_shared/shared.module';
import { paginationModule } from '../_shared/pagination.module';
import { ComponentsModule } from '../components/components.module';
import { multiSelectModule } from '../_shared/multidropselect.module';
import { GetGroupListComponent } from './get-group-list/get-group-list.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { SelectModule } from '../_shared/select.module';

@NgModule({
  declarations: [ListingComponent, AddComponent, GetGroupListComponent, AddGroupComponent],
  imports: [
    CommonModule,
    ArtisanRoutingModule,
    LayoutModule,
    SharedModule,
    ComponentsModule,
    paginationModule,
    multiSelectModule,
    SelectModule
  ]
})
export class ArtisanModule { }
