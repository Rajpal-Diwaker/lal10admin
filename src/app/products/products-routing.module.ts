import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListingComponent } from './listing/listing.component';
import { AddComponent } from './add/add.component';
import { GroupsComponent } from './groups/groups.component';
import { GroupsaddComponent } from './groupsadd/groupsadd.component';

const routes: Routes = [
  { path: '', component: ListingComponent },
  { path: 'add', component: AddComponent },
  { path: 'group', component: GroupsComponent },
  { path: 'add-group', component: GroupsaddComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
