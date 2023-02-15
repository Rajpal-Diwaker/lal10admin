import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard'

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', loadChildren: './user/user.module#UserModule' },
  /* m 3.1 */
  { path: 'artisan', canActivate: [AuthGuard], loadChildren: './artisan/artisan.module#ArtisanModule' },
  { path: 'products', canActivate: [AuthGuard], loadChildren: './products/products.module#ProductsModule' },
  { path: 'cms', canActivate: [AuthGuard], loadChildren: './cms/cms.module#CMSModule' },
  { path: 'onboarding', canActivate: [AuthGuard], loadChildren: './onboarding/onboarding.module#OnboardingModule' },
  { path: 'options', canActivate: [AuthGuard], loadChildren: './options/options.module#OptionsModule' },


  { path: 'enquiries', canActivate: [AuthGuard], loadChildren: './enquiries/enquiries.module#EnquiriesModule' },
  { path: 'generated-enquiry', canActivate: [AuthGuard], loadChildren: './generated-enquiry/generated-enquiry.module#GeneratedEnquiryModule' },
  { path: 'websiteOrders', canActivate: [AuthGuard], loadChildren: './website-orders/website-orders.module#WebsiteOrdersModule' },
  { path: 'orders', canActivate: [AuthGuard], loadChildren: './orders/orders.module#OrdersModule' },
  { path: 'newsfeed', canActivate: [AuthGuard], loadChildren: './newsfeed/newsfeed.module#NewsfeedModule' },
  { path: 'ideal', canActivate: [AuthGuard], loadChildren: './ideal/ideal.module#IdealModule' },
  { path: 'avenue', canActivate: [AuthGuard], loadChildren: './avenue/avenue.module#AvenueModule' },
  { path: 'awards', canActivate: [AuthGuard], loadChildren: './awards/awards.module#AwardsModule' },
  { path: 'shop', canActivate: [AuthGuard], loadChildren: './shop-tab/shop-tab.module#ShopTabModule' },
  { path: 'managecategory', canActivate: [AuthGuard], loadChildren: './manage-category/manage-category.module#ManageCategoryModule' },

  { path: 'notification', canActivate: [AuthGuard], loadChildren: './notification/notification.module#NotificationModule' },
  { path: 'subadmin', canActivate: [AuthGuard], loadChildren: './sub-admin/sub-admin.module#SubAdminModule' },
  { path: 'gallery', canActivate: [AuthGuard], loadChildren: './gallery/gallery.module#GalleryModule' },
  { path: 'my-profile', canActivate: [AuthGuard], loadChildren: './my-profile/my-profile.module#MyProfileModule' },
  { path: 'app-setting', canActivate: [AuthGuard], loadChildren: './app-setting/app-setting.module#AppSettingModule' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules, scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
