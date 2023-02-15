import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { LisitngComponent } from './lisitng/lisitng.component';
import { ListAppOnboardingComponent } from './list-app-onboarding/list-app-onboarding.component';
import { AddAppOnboardingComponent } from './add-app-onboarding/add-app-onboarding.component';
import { TypeOfStoreComponent } from './type-of-store/type-of-store.component';
import { HowYouHereComponent } from './how-you-here/how-you-here.component';
import { ImportantForcustomerComponent } from './important-forcustomer/important-forcustomer.component';
import { KindOfstoreComponent } from './kind-ofstore/kind-ofstore.component';

const routes: Routes = [
  { path: '', component: LisitngComponent },
  { path: 'add', component: AddComponent },
  // { path: 'type-of-store', component: TypeOfStoreComponent },
  { path: 'how-you-here', component: HowYouHereComponent },
  { path: 'important-for-customer', component: ImportantForcustomerComponent },
  { path: 'kind-of-store', component: KindOfstoreComponent },
  { path: 'add-app-onboarding', component: AddAppOnboardingComponent },
  { path: 'app-onboarding-list', component: ListAppOnboardingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
