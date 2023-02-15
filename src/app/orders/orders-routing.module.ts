import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListingComponent } from './listing/listing.component';
import { OrderChatComponent } from './order-chat/order-chat.component';
import { GenerateOrderComponent } from './generate-order/generate-order.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { LogisticDetailComponent } from './logistic-detail/logistic-detail.component';
import { GalleryListComponent } from './gallery-list/gallery-list.component';
import { GalleryDetailsComponent } from './gallery-details/gallery-details.component';
import { ProductionTrackerComponent } from './production-tracker/production-tracker.component';


const routes: Routes = [
  { path: '', component: ListingComponent },
  { path: 'chat', component: OrderChatComponent },
  { path: 'generateOrder', component: GenerateOrderComponent },
  { path: 'orderDetails', component: OrderDetailsComponent },
  { path: 'logisticDetails', component: LogisticDetailComponent },
  { path: 'gallery', component: GalleryListComponent },
  { path: 'galleryDetails', component:GalleryDetailsComponent },
  { path: 'productionTracker', component:ProductionTrackerComponent }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
