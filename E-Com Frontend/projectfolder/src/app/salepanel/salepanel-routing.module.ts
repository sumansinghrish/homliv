import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalepanelComponent } from './salepanel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateBuyerComponent } from './dashboard/create-buyer/create-buyer.component';
import { SalesComponentComponent } from './sales-component/sales-component.component';
import { SalesProfileComponent } from './sales-component/sales-profile/sales-profile.component';
import { AuthGuard } from '../service/auth.guard';
import { CustomerListComponent } from './dashboard/customer-list/customer-list.component';
import { BuyerDetailsComponent } from './dashboard/customer-list/buyer-details/buyer-details.component';
import { PlaceOrderComponent } from './dashboard/customer-list/place-order/place-order.component';
import { ListsProductsComponent } from './dashboard/customer-list/lists-products/lists-products.component';

const routes: Routes = [
  {path:'', component:SalepanelComponent, children:[
    {path:'', redirectTo:'dashboard', pathMatch:'full'},
    {path:'dashboard', component:DashboardComponent, canActivate: [AuthGuard]},
    {path:'create-buyer', component:CreateBuyerComponent, canActivate: [AuthGuard]},
    {path:'dashboard/customer-list', component:CustomerListComponent , canActivate: [AuthGuard]},
    {path:'dashboard/customer-list/buyer-detail', component:BuyerDetailsComponent , canActivate: [AuthGuard]},
    {path:'buyer-detail/editdetail', component:BuyerDetailsComponent , canActivate: [AuthGuard]},
    {path:'dashboard/customer-list/place-order', component:PlaceOrderComponent , canActivate: [AuthGuard]},
    {path:'dashboard/list-products', component:ListsProductsComponent, canActivate: [AuthGuard]},



    {path:'', component:SalesComponentComponent, children:[
      {path:'sales-porfile', component:SalesProfileComponent , canActivate: [AuthGuard]},



    ]}


  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalepanelRoutingModule { }

