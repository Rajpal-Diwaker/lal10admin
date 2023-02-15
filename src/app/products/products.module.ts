import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { ListingComponent } from './listing/listing.component';
import { AddComponent } from './add/add.component';
import { SharedModule } from '../_shared/shared.module';
import { LayoutModule } from '../layout/layout.module';
import { ComponentsModule } from '../components/components.module';
import { GroupsComponent } from './groups/groups.component';
import { GroupsaddComponent } from './groupsadd/groupsadd.component';
import { RangebarModule } from '../_shared/rangebar.module';
import { paginationModule } from '../_shared/pagination.module';
import { QuillModule } from 'ngx-quill'
import { SelectModule } from '../_shared/select.module';
@NgModule({
  declarations: [ ListingComponent, AddComponent, GroupsComponent, GroupsaddComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    LayoutModule,
    ComponentsModule,
    RangebarModule,
    paginationModule,
    QuillModule,
    SelectModule
  ]
})
export class ProductsModule { }
