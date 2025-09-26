import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BuyerAccountComponent } from '../create-dialog/buyer-account/buyer-account.component';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  [x: string]: any;
  constructor(
    public dialog : MatDialog
  ){

  }
 
  createBuyer(){
    this['dialog'].open(BuyerAccountComponent,{
      width: '550px',
      maxWidth: "90vw",
      panelClass: "auth-dialog-layout",
      disableClose: true,
     
    })
  }


}
