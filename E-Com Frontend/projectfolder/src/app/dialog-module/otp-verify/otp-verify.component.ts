import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { CommonService } from 'src/app/service/common.service';
import { UpdateNumberComponent } from '../update-number/update-number.component';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.scss']
})
export class OTPVerifyComponent {
  selerData
  otp: any;
  channelId:any;
  otpButtonDisabled: boolean = false;
  constructor(
    public dialog: MatDialog,
    private api: ApiService,
    private router: Router,
    private toaster: ToastrService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<OTPVerifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.selerData = localStorage.getItem('Aiwa-user-web');
    this.selerData = JSON.parse(this.selerData)
    if(this.selerData){
      this.channelId=this.selerData.channelId
    }
  }

  onOtpChange(otp: string) {
    this.otp = otp;
  }
  ngOnInit() {
    this.timer()

  }

  OtpVerfy() {
    if (this.otp == null || this.otp == undefined || this.otp == '') {
      this.toaster.error('Please Enter OTP  ');
      return;
    }
    if (this.data?.isUpdateComponentOpen == true) {
      if (this.otp) {
        this.api.post('auth/verify/otp/current/mobile', { otp: parseInt(this.otp),channelId:this.channelId }).subscribe({
          next: (res: any) => {
            localStorage.setItem('Aiwa-user-web', JSON.stringify(res.data));
            this.dialog.closeAll()
            this.dialog.open(UpdateNumberComponent, {
              width: '550px',
              maxWidth: "90vw",
              panelClass: "auth-dialog-layout",
              disableClose: true,
              // data:
            })
          },
          error: (err: any) => {
            this.toaster.error(err.error.message)
          },
        });
      }
    } else {
      this.AfterNewNumberOtpVerfy();
    }
  }


  AfterNewNumberOtpVerfy() {
    this.api.post('auth/verify/otp/change/mobile', { otp: parseInt(this.otp),channelId:this.channelId }).subscribe({
      next: (res: any) => {
        this.dialog.closeAll();
        this.getProfile()
        location.reload()
      },
      error: (err: any) => {
        this.toaster.error(err.error.message)
      },
    });
  }

  getProfile() {
    this.api.get("auth/profile").subscribe({
      next: (res: any) => {
        localStorage.setItem('Aiwa-user-web', JSON.stringify(res.data));
      }, error: (err: any) => {
      },
    })
  }

  disablePaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  timer1: number = 0;
  countdownTimer: any;
  startTimer() {
    this.timer1 = 30;
    this.countdownTimer = setInterval(() => {
      if (this.timer1 > 0) {
        this.timer1--;
      } else {
        clearInterval(this.countdownTimer);
      }
    }, 1000); 
  }

  maskNumber(num: number) {
    let numStr = num.toString();
    if (numStr.length > 2) {
      numStr = '*'.repeat(numStr.length - 2) + numStr.slice(-2);
    }
    return numStr;
  }
  counter: any
  showTimer: boolean = false
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