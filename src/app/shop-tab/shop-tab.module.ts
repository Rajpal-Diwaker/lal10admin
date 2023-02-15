import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopTabRoutingModule } from './shop-tab-routing.module';
import { GetListComponent } from './get-list/get-list.component';
import { EditShopComponent } from './edit-shop/edit-shop.component';
import { LayoutModule } from '../layout/layout.module';
import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../_shared/shared.module';
import { RangebarModule } from '../_shared/rangebar.module';
import { paginationModule } from '../_shared/pagination.module';
import { SelectModule } from '../_shared/select.module';
@NgModule({
  declarations: [GetListComponent, EditShopComponent],
  imports: [
    CommonModule,
    ShopTabRoutingModule,
    LayoutModule,
    ComponentsModule,
    SharedModule,
    RangebarModule,
    paginationModule,
    SelectModule
  ]
})
export class ShopTabModule { }
