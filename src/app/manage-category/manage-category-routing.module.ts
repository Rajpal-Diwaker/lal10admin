import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCategoryComponent } from './add-category/add-category.component';
import { GetListComponent } from './get-list/get-list.component';
import { SubAdminRequestComponent } from './sub-admin-request/sub-admin-request.component';
import { GetSubCategoryComponent } from './get-sub-category/get-sub-category.component';
import { AddSubCategoryComponent } from './add-sub-category/add-sub-category.component';
import { GetSubSubCategoryComponent } from './get-sub-sub-category/get-sub-sub-category.component';
import { CreateSubSubCategoryComponent } from './create-sub-sub-category/create-sub-sub-category.component';
const routes: Routes = [
  { path: '', component: GetListComponent },
  { path: 'add', component: AddCategoryComponent },
  { path: 'edit', component: AddCategoryComponent },
  { path: 'subadminrequest', component: SubAdminRequestComponent },
  { path: 'getsubcategory', component: GetSubCategoryComponent },
  { path: 'subCategory', component: AddSubCategoryComponent },
  { path: 'editSubCategory', component: AddSubCategoryComponent },
  { path: 'getsubsubcategory', component: GetSubSubCategoryComponent },
  { path: 'updatesubsubcategory', component: CreateSubSubCategoryComponent },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCategoryRoutingModule { }
