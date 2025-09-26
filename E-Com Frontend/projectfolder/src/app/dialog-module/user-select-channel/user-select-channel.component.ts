import { Component, Inject } from '@angular/core';
import { VerifyOtpComponent } from 'src/app/salepanel/create-dialog/verify-otp/verify-otp.component';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-user-select-channel',
  templateUrl: './user-select-channel.component.html',
  styleUrls: ['./user-select-channel.component.scss']
})
export class UserSelectChannelComponent {
  channelId:any;
  showValidationMessage:boolean= true; 
  constructor(public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) {}
  selectChannel(event: any) {
    this.channelId = event.value;
    this.showValidationMessage = false;
  }
  otpDialog() {
    this.data.channelId=this.channelId
    this.data.actiontype="create user";
    // console.log("user type is >>>>",this.data)
    this.dialog.open(VerifyOtpComponent, {
      width: '550px',
      maxWidth: "90vw",
      panelClass: "auth-dialog-layout",
      disableClose: true,
      data:this.data
    })

  }

}
