import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'', loadChildren:() => import("./layout/layout.module").then((l) =>l.LayoutModule)},
  {path:'salepanel',loadChildren:() => import("./salepanel/salepanel.module").then((s) =>s.SalepanelModule)  }  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
