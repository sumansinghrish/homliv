import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.scss']
})
export class OrderCompleteComponent {
  constructor(
    private dialogRef: MatDialogRef<OrderCompleteComponent>,
  ) {

  }
  close() {
    this.dialogRef.close();
  }
}
