import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OTPVerifyComponent } from '../otp-verify/otp-verify.component';

@Component({
  selector: 'app-update-number',
  templateUrl: './update-number.component.html',
  styleUrls: ['./update-number.component.scss']
})
export class UpdateNumberComponent {

  loginData: any;
  submitted: boolean = false;
  constructor(public dialog: MatDialog,
    private api: ApiService,
    private toaster: ToastrService,

    private router: Router,
    public dialogRef: MatDialogRef<UpdateNumberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  updateMobilePhone: FormGroup = new FormGroup({
    countryCode: new FormControl('+966'),
    mobileNumber: new FormControl('', Validators.required),
  });

  get f() {
    return this.updateMobilePhone.controls;
  }
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Replace non-numeric characters
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  Updatenumber() {
    this.submitted = true;

    if (this.updateMobilePhone.invalid) {
      return;
    }
    let data = this.updateMobilePhone.value;
    this.api.post('auth/send/otp/change/mobile', data).subscribe({
      next: (res: any) => {
        this.loginData = res.data;
        this.toaster.success("OTP Sent Sucessfully");
        this.dialogRef.close()
        this.dialog.open(OTPVerifyComponent, {
          width: '550px',
          maxWidth: "90vw",
          panelClass: "auth-dialog-layout",
          disableClose: true,
          data: { isUpdateComponentOpen: false }
        })

      },
      error: (err: any) => {
        this.toaster.error(err.error.message)
      },
    });
  }

}
