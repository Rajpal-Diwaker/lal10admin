import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListingComponent } from './listing/listing.component';
import { AddComponent } from './add/add.component';
import { AppFeedsListComponent } from './app-feeds-list/app-feeds-list.component';
import { AppFeedsAddComponent } from './app-feeds-add/app-feeds-add.component';

const routes: Routes = [
  { path: '', component: ListingComponent },
  { path: 'add', component: AddComponent },
  { path: 'appFeedsList', component: AppFeedsListComponent },
  { path: 'add-app-feeds', component: AppFeedsAddComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsfeedRoutingModule { }
