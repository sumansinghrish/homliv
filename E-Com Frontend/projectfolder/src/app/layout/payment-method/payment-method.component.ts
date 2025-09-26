import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent {
  constructor(
    private dialogRef: MatDialogRef<PaymentMethodComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  close(type: string = '') {
    this.dialogRef.close({ paymentType: type ? type : '' });
  }
}
