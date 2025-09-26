import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { HomeComponent } from './home/home.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DialogModuleModule } from '../dialog-module/dialog-module.module';
import { OfferBannerComponent } from './offer-banner/offer-banner.component';
import { AsideComponentComponent } from './aside-component/aside-component.component';
import { ProfileComponent } from './aside-component/profile/profile.component';
import { ProfileListsComponent } from './aside-component/profile-lists/profile-lists.component';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { AgmCoreModule } from '@agm/core';
import { AddcartComponent } from './addcart/addcart.component';
import { ProductListsComponent } from './product-lists/product-lists.component';
import { RouterModule } from '@angular/router';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { OrderCompleteComponent } from './addcart/order-complete/order-complete.component';
import { ProductDetailsComponent } from './home/product-details/product-details.component';
import { AllCategoryComponent } from './home/all-category/all-category.component';
import { CategoriesDetailComponent } from './home/categories-detail/categories-detail.component';
import { UserProductDetailComponent } from './home/user-product-detail/user-product-detail.component';
import { UserAddcartComponent } from './user-addcart/user-addcart.component';
import { AddcartuserComponent } from './addcart/addcartuser/addcartuser.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HomeComponent,
    OfferBannerComponent,
    AsideComponentComponent,
    ProfileComponent,
    ProfileListsComponent,
    AddcartComponent,
    ProductListsComponent,
    PaymentMethodComponent,
    OrderCompleteComponent,
    ProductDetailsComponent,
    AllCategoryComponent,
    CategoriesDetailComponent,
    UserProductDetailComponent,
    UserAddcartComponent,
    AddcartuserComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    MaterialModule,
    CarouselModule,
    DialogModuleModule, 
    Ng2TelInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    RouterModule,
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyBkPugcJ44sXBxNLtpjhtcKMkMgwTLXe_g',
      apiKey: 'AIzaSyCiArmJWjopiPLTUCnkLbNZV8J7m76Mpqs',
      libraries: ['places','geometry', 'drawing']
    }),
  ]
})
export class LayoutModule { }
