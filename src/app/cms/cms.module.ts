import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CMSRoutingModule } from './cms-routing.module';
import { AddComponent } from './add/add.component';
import { LayoutModule } from '../layout/layout.module';
import { SharedModule } from '../_shared/shared.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { FaqsComponent } from './faqs/faqs.component';
import { PatchMesssageComponent } from './patch-messsage/patch-messsage.component';
import { BannerComponent } from './banner/banner.component';
import { UspComponent } from './usp/usp.component';
import { ManageIndustriesComponent } from './manage-industries/manage-industries.component';
import { UpdateClientComponent } from './update-client/update-client.component';
import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from '../_shared/material.module';
import { InfographicsComponent } from './infographics/infographics.component';
import { ExhibitionUserListComponent } from './exhibition-user-list/exhibition-user-list.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { CareersComponent } from './careers/careers.component';
import { BlogsComponent } from './blogs/blogs.component';
import { TeamComponent } from './team/team.component';
import { ReturnPolicyComponent } from './return-policy/return-policy.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { QuillModule } from 'ngx-quill'

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [AddComponent, SidebarComponent, TestimonialsComponent, FaqsComponent, PatchMesssageComponent, BannerComponent, UspComponent, ManageIndustriesComponent, UpdateClientComponent, InfographicsComponent, ExhibitionUserListComponent, CatalogueComponent, CareersComponent, BlogsComponent, TeamComponent, ReturnPolicyComponent, PrivacyPolicyComponent],
  imports: [
    CommonModule,
    CMSRoutingModule,
    LayoutModule,
    SharedModule,
    ComponentsModule,
    MaterialModule,
    QuillModule
  ]
})
export class CMSModule { }
