import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateSubadminComponent } from './create-subadmin/create-subadmin.component';
import { ListComponent } from './list/list.component';
import { UpdateComponent } from './update/update.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'update', component: UpdateComponent },
  { path: 'create', component: CreateSubadminComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubAdminRoutingModule { }
