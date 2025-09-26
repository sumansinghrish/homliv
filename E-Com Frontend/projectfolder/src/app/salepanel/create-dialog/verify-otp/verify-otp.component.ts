import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateProfileComponent } from 'src/app/dialog-module/create-profile/create-profile.component';
import { SelectChannelComponent } from 'src/app/dialog-module/select-channel/select-channel.component';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent {
  otp: any;
  accessToken: any;
  sellerUserData: any;
  otpButtonDisabled: boolean = false;

  onOtpChange(otp: string) {
    this.otp = otp;
  }

  constructor(
    public dialog: MatDialog,
    private api: ApiService,
    private router: Router,
     private toaster: ToastrService,
  @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    console.log("channel data is",this.data);
  }

  ngOnInit() {
    this.timer()
  }
  OtpVerfy() {
    if (this.otp == null || this.otp == undefined || this.otp == '') {
       this.toaster.error('Please Enter OTP  ');
      return;
    }
    if(this.data?.actiontype=='create user'){
      if (this.otp) {
        this.api.post('/auth/verifyOtp', { otp: Number(this.otp), channelId : this.data.channelId}).subscribe({
          next: (res: any) => {
            localStorage.setItem('Aiwa-user-web', JSON.stringify(res.data));
            this.dialog.closeAll()
            this.dialog.open(CreateProfileComponent, {
              width: '550px',
              maxWidth: "90vw",
              panelClass: "auth-dialog-layout",
              disableClose: true,
              // data: this.signInForm.value
            })
            // this.router.navigateByUrl('salepanel/create-buyer')
          },
          error: (err: any) => {
            this.toaster.error(err.error.message);
  
          },
        });
      }
    }
else{
  if (this.otp) {
      this.api.post1('auth/mobile/exist/verifyOtp', { otp: Number(this.otp), accessToken: this.data.accessToken, channelId : this.data.channelId, classification : this.data.classification}).subscribe({
        next: (res: any) => {
          localStorage.setItem('verify-otp-seller-web', JSON.stringify(res.data));
          this.dialog.closeAll()
          this.router.navigateByUrl('salepanel/create-buyer')
        },
        error: (err: any) => {
          this.toaster.error(err.error.message);

        },
      });
    }
}
  
  }


  timer1: number = 0;
  countdownTimer: any;
  startTimer() {
   this.timer1 = 30; // Set the initial timer value
   this.countdownTimer = setInterval(() => {
     if (this.timer1 > 0) {
       this.timer1--;
     } else {
       clearInterval(this.countdownTimer);
     
     }
   }, 1000); // Update the timer every second
 }

 counter:any
 showTimer:boolean=false
 timer() {
   this.counter = 60;
   this.otpButtonDisabled = true;
   let startTimer = setInterval(() => {
     this.counter = this.counter - 1;
     if (this.counter == 0) {
       window.clearInterval(startTimer);
       this.showTimer = false
       this.otpButtonDisabled = false;
     }
   }, 1000);
 }

 getCounterData(counter: number) {
   let returnCounter = `${counter}`;
   if (returnCounter.length == 1) {
     return `0${this.counter}`
   }
   return this.counter;
 }

 resendOtp() {
  if (!this.otpButtonDisabled) {
      this.timer();
      this.toaster.success("OTP resent successfully");
  }
}


}
