import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OtpComponent } from '../otp/otp.component';
import { ContinueForPartnerComponent } from '../continue-for-partner/continue-for-partner.component';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserSelectChannelComponent } from '../user-select-channel/user-select-channel.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData: any;
  submitted: boolean = false;
  longitude:any;
  latitide:any;
  constructor(public dialog: MatDialog,
    private api: ApiService,
    private toaster: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
  ngOnInit(){
    this.longitude = sessionStorage.getItem('longitude');
    this.latitide = sessionStorage.getItem('latitude');
  }

  //---------------------------Login Control Form-------------------//
  signInForm: FormGroup = new FormGroup({
    language: new FormControl('2'),
    countryCode: new FormControl('+966'),
    phoneNumber: new FormControl('', Validators.required),
    deviceToken: new FormControl('devicetoken12345 '),
    deviceType: new FormControl('1'),
    latitude: new FormControl(''),
    longitude: new FormControl(''),
  //   latitude: new FormControl('26.4499'),
  // longitude: new FormControl('80.3319'),
  });

  get f() {
    return this.signInForm.controls;
  }

  telInputObject(obj: any) {

    obj.setCountry("om");
  }


  login() {
    this.submitted = true;
    if(this.signInForm.invalid){
      return
    }

    let data = this.signInForm.value;
    data.latitude=this.longitude;
    data.longitude=this.longitude;
    this.api.post('auth/login', data).subscribe({
      next: (res: any) => {
        sessionStorage.setItem('salesmanlogin', 'userlogin');
        this.loginData = res.data;
        localStorage.setItem('Aiwa-user-web', JSON.stringify(res.data));
        this.toaster.success("OTP Sent Sucessfully");
        this.dialogRef.close()
        if(res.data.isOtpVerified==false){
          this.dialog.open(UserSelectChannelComponent, {
            width: '550px',
            maxWidth: "90vw",
            height:"400px",
            panelClass: "auth-dialog-layout",
            disableClose: true,
            data: res.data
          })
        }
        else{
          this.dialog.open(OtpComponent, {
            width: '550px',
            maxWidth: "90vw",
            panelClass: "auth-dialog-layout",
            disableClose: true,
            data: this.signInForm.value
          })
        }
      
      },
      error: (err: any) => {
        this.toaster.error(err.error.message)
      },
    });
  }


  disablePaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  continueDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialogRef.close();
    this.dialog.open(ContinueForPartnerComponent, {
      width: '550px',
      maxWidth: "90vw",
      panelClass: "auth-dialog-layout",
      disableClose: true,
      enterAnimationDuration,
      exitAnimationDuration,
    })
  }

  // userChannel() {
  //   const dialogRef = this.dialog.open(UserSelectChannelComponent,{
  //     width:'400px'
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }
}
