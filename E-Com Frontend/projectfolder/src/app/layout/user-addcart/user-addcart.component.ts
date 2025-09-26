import { Component } from '@angular/core';
import { SelectLocationComponent } from 'src/app/dialog-module/select-location/select-location.component';
import { MatDialog } from '@angular/material/dialog';
import { PromoCodeComponent } from 'src/app/dialog-module/promo-code/promo-code.component';
import { OrderCompleteComponent } from '../addcart/order-complete/order-complete.component';
import { AddAddressComponent } from 'src/app/dialog-module/add-address/add-address.component';
import { SavedLocationComponent } from 'src/app/dialog-module/saved-location/saved-location.component';

@Component({
  selector: 'app-user-addcart',
  templateUrl: './user-addcart.component.html',
  styleUrls: ['./user-addcart.component.scss']
})
export class UserAddcartComponent {

  constructor(
    public dialog: MatDialog,
  ) { }

  selectLocation() {
    const closedDialog = this.dialog.open(SelectLocationComponent, {
      disableClose: true,
      height: "100vh",
      maxHeight: "100vh",
      width: '500px',
      maxWidth: "90vw",
      panelClass: "side-dialog",
      position: { right: "0px", top: "0px" },
    })
    closedDialog.afterClosed().subscribe({
      
    })
  }

  addAddress() {
    const closedDialog = this.dialog.open(AddAddressComponent, {
      disableClose: true,
      height: "100vh",
      maxHeight: "100vh",
      width: '500px',
      maxWidth: "90vw",
      position: { right: "0px", top: "0px" },
    })
    closedDialog.afterClosed().subscribe({
      
    })
  }


  promocode() {
    this.dialog.open(PromoCodeComponent, {
      disableClose: true,
      height: "100vh",
      maxHeight: "100vh",
      width: '500px',
      maxWidth: "90vw",
      panelClass: "side-dialog",
      position: { right: "0px", top: "0px" },
    })

  }

  openorderComplete() {
    this.dialog.open(OrderCompleteComponent, {
      disableClose: true,
      width: '500px',
      maxWidth: "90vw",
      panelClass: "order-comp",
    })
  }
}
