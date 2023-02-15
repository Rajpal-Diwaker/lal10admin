import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebsiteOrdersRoutingModule } from './website-orders-routing.module';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { LayoutModule } from '../layout/layout.module';
import { SharedModule } from '../_shared/shared.module';
import { MaterialModule } from '../_shared/material.module';
import { ComponentsModule } from '../components/components.module';
import { paginationModule } from '../_shared/pagination.module';
import { multiSelectModule } from '../_shared/multidropselect.module';
import { GenerateInvoiceComponent } from './generate-invoice/generate-invoice.component';

@NgModule({
  declarations: [ListComponent, DetailsComponent, GenerateInvoiceComponent],
  imports: [
    CommonModule,
    WebsiteOrdersRoutingModule,
    LayoutModule,
    SharedModule,
    ComponentsModule,
    paginationModule,
    multiSelectModule,
    MaterialModule
  ]
})
export class WebsiteOrdersModule { }
