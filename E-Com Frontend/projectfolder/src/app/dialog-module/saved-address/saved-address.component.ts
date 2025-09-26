import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { SelectLocationComponent } from '../select-location/select-location.component';
import { AddAddressComponent } from '../add-address/add-address.component';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-saved-address',
  templateUrl: './saved-address.component.html',
  styleUrls: ['./saved-address.component.scss']
})
export class SavedAddressComponent {
  [x: string]: any;
  userData:any;
  userID:any;
  nationalAddressid:any;
  billingaddress:any;
  nationalAddressdata:any;
  Addresstype:any;
  constructor(public dialog: MatDialog,private apiService: ApiService,private dialogRe: MatDialogRef<SavedAddressComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.Addresstype=this.data.type
  }
  ngOnInit(){
    const localData = localStorage.getItem(`customerData`);
    if (localData) {
      this.userData = JSON.parse(localData);
      this.userID = this.userData._id
      this.nationalAddressid=this.userData.nationalAddress;
    }
    this.getSavedLocationBasedOnType();
  }
  selecedLocation() {
    const dialogRef = this.dialog.open(SelectLocationComponent,{
      height: "100vh",
        maxHeight: "100vh",
        width: '500px',
        maxWidth: "90vw",
        panelClass: "side-dialog",
        position: { right: "0px", top: "0px" },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  // this.dialogRef.close({ ...data, isEdit: false });
  newselectedLocation(data:any) {
    var element=data
    this.dialogRe.close(element);
    // const dialogRef = this.dialog.open(SelectLocationComponent,{
    //   height: "100vh",
    //     maxHeight: "100vh",
    //     width: '500px',
    //     maxWidth: "90vw",
    //     panelClass: "side-dialog",
    //     position: { right: "0px", top: "0px" },
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
  getSavedLocationBasedOnType() {
    const localUserData: any = localStorage.getItem('customerData');
    if(this.Addresstype==1){
      var data = {
        "userId": JSON.parse(localUserData)?._id,
        "type": 1
      }
    }else{
       var data = {
        "userId": JSON.parse(localUserData)?._id,
        "type": 2
      }
    }
  
    this.apiService.post1(`address/list`, data).subscribe({
      next: (res: any) => {
          this.billingaddress = res.data;
          console.log("Alll address data is>>>>>>",this.billingaddress);
        this.nationalAddressdata=`${res.data.address}, ${res.data.district}, ${res.data.streetName}, ${res.data.postalCode}, ${res.data.city}, ${res.data.buildingNumber}, ${res.data.secondryNumber}`
        console.log("Alll address data is",this.billingaddress)
        // this.savedLocationData = res.data;
      },
      error: (e) => {
      }
    })
  }

  deleteLocation(item: any) {
    this.apiService.delete1(`address/delete?_id=${item._id}`).subscribe({
      next: (res: any) => {
        this.getSavedLocationBasedOnType();
      },
      error: (e) => {
      }
    })
  }

 
  editLocation(item:any) {
    const closedDialog = this.dialog.open(SelectLocationComponent, {
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
        // if (res.type === 1) {
        //   this.shippingAddressId = res._id;
        // } else {
        //   this.billingAddressId = res._id;
        // }
      }
    })
  }  
  selectLocation(type: number) {
    const closedDialog = this.dialog.open(SelectLocationComponent, {
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
      userId:data?.userId?._id,
      nationalAddressid:data._id
    }
    const dialogRef = this.dialog.open(AddAddressComponent,{
      data:item,
      panelClass: 'addADdress'
      
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getSavedLocationBasedOnType()
      // console.log(`Dialog result: ${result}`);
    });
  }
  addaddress() {

    // var item={
    //   userId:this.userID,
    //   nationalAddressid:this.nationalAddressid
    // }
    const dialogRef = this.dialog.open(AddAddressComponent,{
      panelClass: 'addADdress',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getSavedLocationBasedOnType()
      // console.log(`Dialog result: ${result}`);
    });
  }
}
