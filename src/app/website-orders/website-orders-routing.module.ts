import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { GenerateInvoiceComponent } from './generate-invoice/generate-invoice.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'details', component: DetailsComponent },
  { path: 'generateInvoice', component: GenerateInvoiceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteOrdersRoutingModule { }
