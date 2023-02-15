import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { ListingComponent } from './listing/listing.component';
import { LayoutModule } from '../layout/layout.module';
import { SharedModule } from '../_shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { paginationModule } from '../_shared/pagination.module';
import { multiSelectModule } from '../_shared/multidropselect.module';
import { OrderChatComponent } from './order-chat/order-chat.component';
import { GenerateOrderComponent } from './generate-order/generate-order.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { LogisticDetailComponent } from './logistic-detail/logistic-detail.component';
import { GalleryListComponent } from './gallery-list/gallery-list.component';
import { GalleryDetailsComponent } from './gallery-details/gallery-details.component';
import { ProductionTrackerComponent } from './production-tracker/production-tracker.component';
import { RangebarModule } from '../_shared/rangebar.module';
import { MaterialModule } from '../_shared/material.module';

@NgModule({
  declarations: [ListingComponent, OrderChatComponent, GenerateOrderComponent, OrderDetailsComponent, LogisticDetailComponent, GalleryListComponent, GalleryDetailsComponent, ProductionTrackerComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    LayoutModule,
    SharedModule,
    ComponentsModule,
    paginationModule,
    multiSelectModule,
    MaterialModule,
    RangebarModule
  ]
})
export class OrdersModule { }
