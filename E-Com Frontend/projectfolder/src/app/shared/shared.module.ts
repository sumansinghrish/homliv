import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from '../material/material.module';
import { DialogModuleModule } from '../dialog-module/dialog-module.module';
import { MatBadgeModule } from '@angular/material/badge';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MaterialModule,
    DialogModuleModule,
    MatBadgeModule
  ],
  exports:[
    HeaderComponent,
    FooterComponent
  ]

})
export class SharedModule { }
