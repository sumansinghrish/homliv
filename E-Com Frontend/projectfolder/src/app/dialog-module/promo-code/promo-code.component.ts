import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-promo-code',
  templateUrl: './promo-code.component.html',
  styleUrls: ['./promo-code.component.scss']
})
export class PromoCodeComponent {
  promocode:any;
  lastdate:any;
  promocodedata:any[]=[]
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<PromoCodeComponent>){
    // console.log("promocode is ???????",this.data);
    this.promocodedata=this.data;
  }
  proceed(event:any){
    this.dialogRef.close(event);
  }

}
