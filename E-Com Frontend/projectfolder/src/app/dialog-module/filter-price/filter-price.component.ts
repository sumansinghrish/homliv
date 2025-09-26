import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-filter-price',
  templateUrl: './filter-price.component.html',
  styleUrls: ['./filter-price.component.scss']
})
export class FilterPriceComponent {

  loginData: any;
  brandData: any;
  filterData: any;
  filteredData: any;
  pushModuleAccess: any = [];
  submitted: boolean = false;
  startPrice:any;
  endPrice:any;

  constructor(public dialog: MatDialog,
    private api: ApiService,
    private toaster: ToastrService,
    public dialogRef: MatDialogRef<FilterPriceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  filterForm: FormGroup = new FormGroup({
    startPrice: new FormControl(10, [Validators.required, Validators.min(10)]),
    endPrice: new FormControl(1000000, [Validators.required, Validators.max(1000000)]),
    brands: new FormArray([]),
  });

  ngOnInit() {
    this.getBrandList();
    console.log('====this.data======',this.data)
    this.filteredData = this.data
  }


  onPriceChange(minValue:any,maxValue:any) {
    this.startPrice=minValue;
    this.endPrice=maxValue;
    // const startPrice = this.filterForm.get('startPrice')?.value
    // const endPrice = this.filterForm.get('endPrice')?.value;

  }

  onCheckboxChange(event: any, value: any = []) {
    if (event.checked) {
      this.pushModuleAccess.push(value);
    } else {
      this.pushModuleAccess = this.deleteElementByValue(this.pushModuleAccess, value);
    }
  }

  deleteElementByValue(arr: any, value: any) {
    return arr.filter((item: any) => item !== value);
  }

  getBrandList() {
    this.api.get1('auth/brandList').subscribe({
      next: (res: any) => {
        this.brandData = res.data;
      },
      error: (err: any) => {
        this.toaster.error(err.error.message);
      },
    });
  }

  upadteFilterData() {
    this.submitted = true;

    let data = {
      startPrice: this.startPrice,
      endPrice: this.endPrice,
      brands: this.pushModuleAccess
    };

    console.log(data)
    this.dialogRef.close(data);

    return
    this.api.post('product/productList', data).subscribe({
      next: (res: any) => {
        this.filterData = res.data;
        // localStorage.setItem('Aiwa-user-web', JSON.stringify(res.data));
      },
      error: (err: any) => {
        this.toaster.error(err.error.message)
      },
    });
  }


  clearFilter() {
    window.location.reload();
    // this.filterForm.reset({
    //   // startPrice: 10,
    //   // endPrice: 1000000,
    //   // brands: []
    // });
    // this.pushModuleAccess = [];
    // this.filterData = null;
  }


  minValue: number = 0;
  maxValue: number = 10000;
  options: Options = {
    floor: 0,
    ceil: 10000,
    translate: (value: number): string => {
      return 'SAR' + value;
    }
  };
  

}



