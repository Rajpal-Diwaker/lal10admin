import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetListComponent } from './get-list/get-list.component';
import { EditShopComponent } from './edit-shop/edit-shop.component';

const routes: Routes = [

  { path: '', component: GetListComponent },
  { path: 'edit', component: EditShopComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopTabRoutingModule { }
