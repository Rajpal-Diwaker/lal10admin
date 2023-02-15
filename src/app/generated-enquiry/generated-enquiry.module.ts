import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../layout/layout.module';
import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../_shared/shared.module';
import { paginationModule } from '../_shared/pagination.module';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { EstimateOrderComponent } from './estimate-order/estimate-order.component';
import { multiSelectModule } from '../_shared/multidropselect.module';
import { ArtisanResponseComponent } from './artisan-response/artisan-response.component';
import { ChatComponent } from './chat/chat.component';
import { LogisticDetailComponent } from './logistic-detail/logistic-detail.component';
import { GalleryListComponent } from './gallery-list/gallery-list.component';
import { GalleryDetailComponent } from './gallery-detail/gallery-detail.component';
import { autoCompleteModule } from '../_shared/autocomplete.module';
import { MaterialModule } from '../_shared/material.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { GeneratedEnquiryRoutingModule } from './generated-enquiry-routing.module';
import { ListingComponent } from './listing/listing.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [ListingComponent, EditComponent,
    PurchaseOrderComponent, EstimateOrderComponent, ArtisanResponseComponent, ChatComponent, LogisticDetailComponent, GalleryListComponent, GalleryDetailComponent],
  imports: [
    CommonModule,
    GeneratedEnquiryRoutingModule,
    LayoutModule,
    ComponentsModule,
    SharedModule,
    multiSelectModule,
    paginationModule,
    autoCompleteModule,
    MaterialModule
  ]
})
export class GeneratedEnquiryModule { }
