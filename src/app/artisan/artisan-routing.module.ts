import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListingComponent } from './listing/listing.component';
import { AddComponent } from './add/add.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { GetGroupListComponent } from './get-group-list/get-group-list.component';

const routes: Routes = [
  { path: '', component: ListingComponent },
  { path: 'add', component: AddComponent },
  { path: 'addgroup', component: AddGroupComponent },
  { path: 'groupList', component: GetGroupListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtisanRoutingModule { }
