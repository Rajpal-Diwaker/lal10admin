import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { UpdateComponent } from './update/update.component';
import { UsernotificationComponent } from './usernotification/usernotification.component';
const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'update', component: UpdateComponent },
  { path: 'user', component: UsernotificationComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
