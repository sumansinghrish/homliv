import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VerifyOtpComponent } from '../verify-otp/verify-otp.component';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { SelectChannelComponent } from 'src/app/dialog-module/select-channel/select-channel.component';


@Component({
  selector: 'app-buyer-account',
  templateUrl: './buyer-account.component.html',
  styleUrls: ['./buyer-account.component.scss']
})
export class BuyerAccountComponent {


  usersalesData: any
  submitted: boolean = false;

  constructor(public dialog: MatDialog,
    private router: Router,
    private api: ApiService,
    private toaster: ToastrService,
  ) { }

  telInputObject(obj: any) {
   
    obj.setCountry("om");
  }



  //---------------------------Login Control Form-------------------//
  userMobileExit: FormGroup = new FormGroup({
    countryCode: new FormControl('+966'),
    phoneNumber: new FormControl('', Validators.required),

  });

  get f() {
    return this.userMobileExit.controls;
  }



  UserMobileExit() {
    this.submitted = true;
    
    let data = this.userMobileExit.value;

    this.api.post1('/auth/check/mobile/exists', data).subscribe({
      next: (res: any) => {
        this.usersalesData = res.message;

        localStorage.setItem('Aiwa-seller-web', JSON.stringify(res.data))
        this.dialog.closeAll();
        this.dialog.open(SelectChannelComponent, {
          width: '550px',
          maxWidth: "90vw",
          panelClass: "auth-dialog-layout",
          disableClose: true,
          data: res.data
        })

      },
      error: (err: any) => {
        this.toaster.error(err.error.message);
      },
    });
  }
}
