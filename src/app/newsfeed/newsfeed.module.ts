import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsfeedRoutingModule } from './newsfeed-routing.module';
import { ListingComponent } from './listing/listing.component';
import { AddComponent } from './add/add.component';
import { LayoutModule } from '../layout/layout.module';
import { SharedModule } from '../_shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { AppFeedsListComponent } from './app-feeds-list/app-feeds-list.component';
import { AppFeedsAddComponent } from './app-feeds-add/app-feeds-add.component';
@NgModule({
  declarations: [ListingComponent, AddComponent, AppFeedsListComponent, AppFeedsAddComponent],
  imports: [
    CommonModule,
    NewsfeedRoutingModule,
    LayoutModule,
    SharedModule,
    ComponentsModule
  ]
})
export class NewsfeedModule { }
