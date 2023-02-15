import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListingComponent } from './listing/listing.component';
import { AddComponent } from './add/add.component';
import { GenerateEnquiriesComponent } from './generate-enquiries/generate-enquiries.component';
import { EmailEnquiriesComponent } from './email-enquiries/email-enquiries.component';
// import { GetEnquiriesListComponent } from './get-enquiries-list/get-enquiries-list.component';
import { GenerateLeadEnquiriesComponent } from './generate-lead-enquiries/generate-lead-enquiries.component';


const routes: Routes = [
  { path: '', component: ListingComponent },
  { path: 'add', component: AddComponent },
  { path: 'emailGenerateEnq', component: GenerateEnquiriesComponent },
  { path: 'emailEnq', component: EmailEnquiriesComponent },
  // { path: 'generateEnqList', component: GetEnquiriesListComponent },
  { path: 'addLeadEnquiries', component: GenerateLeadEnquiriesComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnquiriesRoutingModule { }
