import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './home/home.component';
import { AsideComponentComponent } from './aside-component/aside-component.component';
import { ProfileComponent } from './aside-component/profile/profile.component';
import { AuthGuard } from '../service/auth.guard';
import { ProductDetailsComponent } from './home/product-details/product-details.component';
import { AddcartComponent } from './addcart/addcart.component';
import { ProductListsComponent } from './product-lists/product-lists.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { AllCategoryComponent } from './home/all-category/all-category.component';
import { CategoriesDetailComponent } from './home/categories-detail/categories-detail.component';
import { UserProductDetailComponent } from './home/user-product-detail/user-product-detail.component';
import { UserAddcartComponent } from './user-addcart/user-addcart.component';
import { AddcartuserComponent } from './addcart/addcartuser/addcartuser.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'home/categories-detail', component: CategoriesDetailComponent },
      { path: 'home/user-prod-details', component: UserProductDetailComponent },
      { path: 'home/product-details/:_id/:type', component: ProductDetailsComponent },
      { path: 'addcart', component: AddcartComponent },
      { path: 'addcartuser', component: AddcartuserComponent },
      { path: 'user-addcart', component: UserAddcartComponent },
      { path: 'product-lists', component:ProductListsComponent},
      { path: 'payment-method', component:PaymentMethodComponent},
      { path: 'all-category', component:AllCategoryComponent},
      {
        path: '', component: AsideComponentComponent, children: [
          { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
