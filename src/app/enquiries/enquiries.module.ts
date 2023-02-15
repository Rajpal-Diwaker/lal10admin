import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnquiriesRoutingModule } from './enquiries-routing.module';
import { ListingComponent } from './listing/listing.component';
import { AddComponent } from './add/add.component';
import { LayoutModule } from '../layout/layout.module';
import { GenerateEnquiriesComponent } from './generate-enquiries/generate-enquiries.component';
import { EmailEnquiriesComponent } from './email-enquiries/email-enquiries.component';
import { ComponentsModule } from '../components/components.module';
// import { GetEnquiriesListComponent } from './get-enquiries-list/get-enquiries-list.component';
import { GenerateLeadEnquiriesComponent } from './generate-lead-enquiries/generate-lead-enquiries.component';
import { SharedModule } from '../_shared/shared.module';
import { paginationModule } from '../_shared/pagination.module';
import { multiSelectModule } from '../_shared/multidropselect.module';
import { autoCompleteModule } from '../_shared/autocomplete.module';
import { MaterialModule } from '../_shared/material.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SelectModule } from '../_shared/select.module';
@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [ListingComponent, AddComponent, GenerateEnquiriesComponent, EmailEnquiriesComponent, GenerateLeadEnquiriesComponent],
  imports: [
    CommonModule,
    EnquiriesRoutingModule,
    LayoutModule,
    ComponentsModule,
    SharedModule,
    multiSelectModule,
    paginationModule,
    autoCompleteModule,
    MaterialModule,
    SelectModule
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'en-IN'}]
})
export class EnquiriesModule { }
