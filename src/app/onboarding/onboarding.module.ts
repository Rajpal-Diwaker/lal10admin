import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { LisitngComponent } from './lisitng/lisitng.component';
import { AddComponent } from './add/add.component';
import { LayoutModule } from '../layout/layout.module';
import { SharedModule } from '../_shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { AddAppOnboardingComponent } from './add-app-onboarding/add-app-onboarding.component';
import { ListAppOnboardingComponent } from './list-app-onboarding/list-app-onboarding.component';
import { SidebarTabComponent } from './sidebar-tab/sidebar-tab.component';
import { TypeOfStoreComponent } from './type-of-store/type-of-store.component';
import { HowYouHereComponent } from './how-you-here/how-you-here.component';
import { KindOfstoreComponent } from './kind-ofstore/kind-ofstore.component';
import { ImportantForcustomerComponent } from './important-forcustomer/important-forcustomer.component';
@NgModule({
  declarations: [LisitngComponent,
    AddComponent,
    AddAppOnboardingComponent,
    ListAppOnboardingComponent,
    SidebarTabComponent,
    TypeOfStoreComponent,
    HowYouHereComponent,
    KindOfstoreComponent,
    ImportantForcustomerComponent],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    LayoutModule,
    SharedModule,
    ComponentsModule
  ]
})
export class OnboardingModule { }
