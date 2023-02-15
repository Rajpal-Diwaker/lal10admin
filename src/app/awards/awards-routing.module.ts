import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListingComponent } from './listing/listing.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  { path: '', component: ListingComponent },
  { path: 'details', component: DetailsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AwardsRoutingModule { }
