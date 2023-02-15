import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageCategoryRoutingModule } from './manage-category-routing.module';
import { GetListComponent } from './get-list/get-list.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { GetSubCategoryComponent } from './get-sub-category/get-sub-category.component';
import { SubAdminRequestComponent } from './sub-admin-request/sub-admin-request.component';
import { LayoutModule } from '../layout/layout.module';
import { SharedModule } from '../_shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { paginationModule } from '../_shared/pagination.module';
import { multiSelectModule } from '../_shared/multidropselect.module';
import { AddSubCategoryComponent } from './add-sub-category/add-sub-category.component';
import { GetSubSubCategoryComponent } from './get-sub-sub-category/get-sub-sub-category.component';
import { CreateSubSubCategoryComponent } from './create-sub-sub-category/create-sub-sub-category.component';

@NgModule({
  declarations: [GetListComponent, AddCategoryComponent, GetSubCategoryComponent, SubAdminRequestComponent, AddSubCategoryComponent, GetSubSubCategoryComponent, CreateSubSubCategoryComponent],
  imports: [
    CommonModule,
    ManageCategoryRoutingModule,
    LayoutModule,
    SharedModule,
    ComponentsModule,
    paginationModule,
    multiSelectModule
  ]
})
export class ManageCategoryModule { }
