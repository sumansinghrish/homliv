import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Ng2TelInputModule} from 'ng2-tel-input';

import { SalepanelRoutingModule } from './salepanel-routing.module';
import { SalepanelComponent } from './salepanel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { CreateBuyerComponent } from './dashboard/create-buyer/create-buyer.component';
import { BuyerAccountComponent } from './create-dialog/buyer-account/buyer-account.component';
import { VerifyOtpComponent } from './create-dialog/verify-otp/verify-otp.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesComponentComponent } from './sales-component/sales-component.component';
import { AsidebarComponent } from './sales-component/asidebar/asidebar.component';
import { SalesProfileComponent } from './sales-component/sales-profile/sales-profile.component';
import { CustomerListComponent } from './dashboard/customer-list/customer-list.component';
import { BuyerDetailsComponent } from './dashboard/customer-list/buyer-details/buyer-details.component';
import { PlaceOrderComponent } from './dashboard/customer-list/place-order/place-order.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { EditBuyerDetailsComponent } from './dashboard/customer-list/buyer-details/edit-buyer-details/edit-buyer-details.component';
import { ListsProductsComponent } from './dashboard/customer-list/lists-products/lists-products.component';


@NgModule({
  declarations: [
    SalepanelComponent,
    DashboardComponent,
    CreateBuyerComponent,
    BuyerAccountComponent,
    VerifyOtpComponent,
    SalesComponentComponent,
    AsidebarComponent,
    SalesProfileComponent,
    CustomerListComponent,
    BuyerDetailsComponent,
    PlaceOrderComponent,
    EditBuyerDetailsComponent,
    ListsProductsComponent,
  ],
  imports: [
    CommonModule,
    SalepanelRoutingModule,
    SharedModule,
    MaterialModule,
    Ng2TelInputModule,
    NgOtpInputModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,

  ]
})
export class SalepanelModule { 
}
