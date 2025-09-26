import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocationDialogComponent } from '../location-dialog/location-dialog.component';
import { ApiService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent {

  constructor( public dialog : MatDialog ,
    private api: ApiService,
   // private toaster: ToastrService,
     private router: Router,
     private fb: FormBuilder
 ){
 }



   //---------------------------create Profile  Form-------------------//
   createprofile: FormGroup = new FormGroup({
    name: new FormControl('',),
    email: new FormControl('',),
    businessName:new FormControl('',Validators.required),
  });

  get f() {
    return this.createprofile.controls;
  }

  submitted: boolean = false;
  onSubmit() {
    this.submitted = true;
    if (this.createprofile.valid) {
      this.dialog.open(LocationDialogComponent,{
        data: this.createprofile.value,
        width: '500px',
        height: "100vh",
        maxHeight: "100vh",
        maxWidth: "90vw",
        panelClass: "side-dialog",
        position: { right: "0px", top: "0px" },
        disableClose:true,
      })
      return
    }
  }

  onKeyPress(event: any) {
    const charCode = event.charCode;
    
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 32) {
    
      return;
    } else {
      event.preventDefault();
    }
  }

}
