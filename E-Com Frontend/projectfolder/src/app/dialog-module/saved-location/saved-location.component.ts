import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { SelectUserlocationComponent } from '../select-userlocation/select-userlocation.component';
import { UserAddAddressComponent } from '../user-add-address/user-add-address.component';
@Component({
  selector: 'app-saved-location',
  templateUrl: './saved-location.component.html',
  styleUrls: ['./saved-location.component.scss']
})
export class SavedLocationComponent {
  savedLocationData: any[] = [];
  Addresstype:any;
  passAddressData:any;
  constructor(
    private dialogRef: MatDialogRef<SavedLocationComponent>,
    public dialog: MatDialog,
    private api: ApiService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.Addresstype=this.data;
    console.log("type is",this.data);
    this.getSavedLocationBasedOnType()
  }

  getSavedLocationBasedOnType() {
    const localUserData: any = localStorage.getItem('verify-otp-seller-web');
    const data = {
      // "userId": JSON.parse(localUserData)._id,
      "type": this.data
    }
    console.log("Seller data is >>>>>",data);
    this.api.post(`address/getAllAddress`, data).subscribe({
      next: (res: any) => {
        this.savedLocationData = res.data;
      },
      error: (e) => {
      }
    })
  }

  selecedLocation(data: any) {
    this.dialogRef.close({ ...data, isEdit: false });
  }

  editLocation(item:any) {
    const closedDialog = this.dialog.open(SelectUserlocationComponent, {
      disableClose: true,
      height: "100vh",
      maxHeight: "100vh",
      width: '500px',
      maxWidth: "90vw",
      panelClass: "side-dialog",
      position: { right: "0px", top: "0px" },
      data: { item }
    })
    closedDialog.afterClosed().subscribe({
      next: (res) => {
        this.getSavedLocationBasedOnType();
      }
    })
  }  

  // editLocation(item: any) {
  //   this.dialogRef.close({ ...item, isEdit: true });
  // }
  selectLocation(type: number) {
    const closedDialog = this.dialog.open(SelectUserlocationComponent, {
      disableClose: true,
      height: "100vh",
      maxHeight: "100vh",
      width: '500px',
      maxWidth: "90vw",
      panelClass: "side-dialog",
      position: { right: "0px", top: "0px" },
      data: { type }
    })
    closedDialog.afterClosed().subscribe({
      next: (res) => {
        this.getSavedLocationBasedOnType();
        // if (res.type === 1) {
        //   this.shippingAddressId = res._id;
        // } else {
        //   this.billingAddressId = res._id;
        // }
      }
    })
  }
  editaddress(data:any) {
    console.log("eidt data is",data)
    var item={
      userId:data?.userId,
      nationalAddressid:data._id
    }
    const dialogRef = this.dialog.open(UserAddAddressComponent,{
      data:item,
      panelClass: 'addADdress'
      
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getSavedLocationBasedOnType()
      // console.log(`Dialog result: ${result}`);
    });
  }
  addAddress() {
    console.log()
    const dialogRef = this.dialog.open(UserAddAddressComponent,
      {
        width: '500px',
        height: '580px',
        panelClass: 'custom-container-add-address',
        data: this.passAddressData
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      this.getSavedLocationBasedOnType();
      console.log(`Dialog result: ${result}`);

    });
  }

  deleteLocation(item: any) {
    this.api.delete1(`address/delete?_id=${item._id}`).subscribe({
      next: (res: any) => {
        this.getSavedLocationBasedOnType();
      },
      error: (e) => {
      }
    })
  }
}
