import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListingComponent } from './listing/listing.component';
import { AddComponent } from './add/add.component';
import { AllproductComponent } from './allproduct/allproduct.component';

const routes: Routes = [
  { path: '', component: ListingComponent },
  { path: 'add', component: AddComponent },
  { path: 'allProduct', component: AllproductComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdealRoutingModule { }
