import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { OtpComponent } from '../otp/otp.component';
import { VerifyOtpComponent } from 'src/app/salepanel/create-dialog/verify-otp/verify-otp.component';

@Component({
  selector: 'app-select-channel',
  templateUrl: './select-channel.component.html',
  styleUrls: ['./select-channel.component.scss']
})
export class SelectChannelComponent {

  selectedChannel!:string;
  constructor(public dialog: MatDialog,
    private api: ApiService,
    private toaster: ToastrService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any


  ) {
    const localData: any = localStorage.getItem('Aiwa-user-web');
    this.channelIds = JSON.parse(localData).channelId;
    this.channelId = this.channelIds[0]
    this.selectedChannel = this.channelIds[0];
  }
  channelIds:any[]=[];
  channelId: string = 'Baqala'
  selectChannel(event: any) {
    this.channelId = event.value;
  }

  clasification: string = 'A'
  selectClassification(event: any) {
    this.clasification = event.value;
  }

  otpDialog() {
    sessionStorage.setItem('selectChannelData', JSON.stringify({
      channelId: this.channelId,
      clasification: this.clasification
    }))
    this.dialog.open(VerifyOtpComponent, {
      width: '550px',
      maxWidth: "90vw",
      panelClass: "auth-dialog-layout",
      disableClose: true,
      data: {
        channelId: this.channelId,
        classification: this.clasification,
        accessToken: this.data.accessToken
      }
    })

  }

}
