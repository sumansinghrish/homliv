import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocationDialogComponent } from '../location-dialog/location-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-continue-for-partner',
  templateUrl: './continue-for-partner.component.html',
  styleUrls: ['./continue-for-partner.component.scss']
})
export class ContinueForPartnerComponent {

  hide = true;
  loginData: any;
  submitted: boolean = false;

  constructor(public dialog: MatDialog,
    private api: ApiService,
    private toaster: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ContinueForPartnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any



  ) { }

  signInsalesForm: FormGroup = new FormGroup({
    password: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required]),
    deviceToken: new FormControl('devicetoken12345 '),
    latitude: new FormControl('26.4499'),
    longitude: new FormControl('80.3319'),
  });


  get f() {
    return this.signInsalesForm.controls;
  }

  saleslogin() {
    this.submitted = true;

    if (this.signInsalesForm.invalid) {
      return;
    }


    let data = this.signInsalesForm.value;


    this.api.post1('auth/login', data).subscribe({
      next: (res: any) => {
        sessionStorage.setItem('salesmanlogin', 'salesmanuserlogin');
        this.loginData = res.data;
        localStorage.setItem('Aiwa-user-web', JSON.stringify(res.data));
        console.log(res.data)
        this.dialogRef.close()
        this.toaster.success("SalesMan Login Sucessfully");
        this.router.navigateByUrl("/salepanel/dashboard")
      },
      error: (err: any) => {
        if (err?.error?.message === "Sales Man Not Found." || err?.error?.message === "Please enter valid password.") {
          this.toaster.error("Please Enter Valid Credentials");
          return
        }
        if (err?.error?.message == "Your account has been blocked by the administrator. Please contact your administrator.") {
          this.toaster.error("Your account has been blocked by the administrator. Please contact your administrator.");
          return
        }
      },
    });
  }


}
