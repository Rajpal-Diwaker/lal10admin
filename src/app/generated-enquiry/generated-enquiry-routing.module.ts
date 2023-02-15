import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { EstimateOrderComponent } from './estimate-order/estimate-order.component';
import { ArtisanResponseComponent } from './artisan-response/artisan-response.component';
import { ChatComponent } from './chat/chat.component';
import { LogisticDetailComponent } from './logistic-detail/logistic-detail.component';
import { GalleryListComponent } from './gallery-list/gallery-list.component';
import { GalleryDetailComponent } from './gallery-detail/gallery-detail.component';
import { ListingComponent } from './listing/listing.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  { path: '', component: ListingComponent },
  { path: 'purchaseOrder', component: PurchaseOrderComponent },
  { path: 'estimateOrder', component: EstimateOrderComponent },
  { path: 'listArtisan', component: ArtisanResponseComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'gallery', component: GalleryListComponent },
  { path: 'galleryDetails', component: GalleryDetailComponent },
  { path: 'logisticDetails', component: LogisticDetailComponent },
  { path: 'edit', component: EditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneratedEnquiryRoutingModule { }
