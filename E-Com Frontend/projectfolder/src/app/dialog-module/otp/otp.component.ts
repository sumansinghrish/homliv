import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateProfileComponent } from '../create-profile/create-profile.component';
import { SelectChannelComponent } from '../select-channel/select-channel.component';
import { ApiService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent {
  [x: string]: any;
  selerData
  otp: any;
  otpButtonDisabled: boolean = false;
  constructor(
    public dialog: MatDialog,
    private api: ApiService,
    private router: Router,
    private toaster: ToastrService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<OtpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selerData = localStorage.getItem('Aiwa-user-web');
    // console.log("data is",this.selerData)
    this.selerData = JSON.parse(this.selerData)
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
    if (this.otp) {
      this.api.post('auth/verifyOtp', { otp: parseInt(this.otp),channelId:this.selerData.channelId }).subscribe({
        next: (res: any) => {
          localStorage.setItem('Aiwa-user-web', JSON.stringify(res.data));
          // localStorage.setItem('Aiwa-user-webdata', JSON.stringify(res.data));
          if (res.data?.isProfileCompleted) {
            this.dialog.closeAll();         
            sessionStorage.setItem('isLogin', 'true')          
            this.commonService.setRegisterButtonHideShow(true)
            this.router.navigateByUrl("/home").then(() => {
              // Reload the location after the navigation is complete
              location.reload();
          });
            // this.router.navigateByUrl("/home");
            // location.reload()
          } else {
            this.dialog.closeAll();
            this.dialog.open(CreateProfileComponent, {
              width: '550px',
              maxWidth: "90vw",
              panelClass: "auth-dialog-layout",
              disableClose: true
            })
          }
        },
        error: (err: any) => {
          this.toaster.error(err.error.message)
        },
      });
    }
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
  selectchannel(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(SelectChannelComponent, {
      width: '550px',
      maxWidth: "90vw",
      panelClass: "auth-dialog-layout",
      disableClose: true,
      enterAnimationDuration,
      exitAnimationDuration,
    })

  }
}
