import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { PatchMesssageComponent } from './patch-messsage/patch-messsage.component';
import { BannerComponent } from './banner/banner.component';
import { UspComponent } from './usp/usp.component';
import { ManageIndustriesComponent } from './manage-industries/manage-industries.component';
import { FaqsComponent } from './faqs/faqs.component';
import { UpdateClientComponent } from './update-client/update-client.component';
import { InfographicsComponent } from './infographics/infographics.component';
import { ExhibitionUserListComponent } from './exhibition-user-list/exhibition-user-list.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { CareersComponent } from './careers/careers.component';
import { BlogsComponent } from './blogs/blogs.component';
import { TeamComponent } from './team/team.component';
import { ReturnPolicyComponent } from './return-policy/return-policy.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const routes: Routes = [
  { path: '', component: AddComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'faqs', component: FaqsComponent },
  // { path: 'patch-message', component: PatchMesssageComponent },
  { path: 'banner', component: BannerComponent },
  // { path: 'usp', component: UspComponent },
  { path: 'manage-industries', component: ManageIndustriesComponent },
  { path: 'updateClient', component: UpdateClientComponent },
  { path: 'infographics', component: InfographicsComponent },
  { path: 'exhibitionUserList', component: ExhibitionUserListComponent },
  /* 13 oct2020 */
  // { path: 'Catalogue', component: CatalogueComponent },
  { path: 'Careers', component: CareersComponent },
  { path: 'blogs', component: BlogsComponent },
  // { path: 'team', component: TeamComponent },
  { path: 'returnPolicy', component: ReturnPolicyComponent },
  { path: 'privacypolicy', component: PrivacyPolicyComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CMSRoutingModule { }
