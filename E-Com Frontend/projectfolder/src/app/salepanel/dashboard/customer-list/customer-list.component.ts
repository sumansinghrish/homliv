import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { CommonService } from 'src/app/service/common.service';


@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  constructor(public dialog: MatDialog,
    private router: Router,
    private api: ApiService,
    private toaster: ToastrService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.customerList()
  }


  onTabChanged(typeId: any) {
    this.type = typeId;

    this.customerList();
  }



  // onSearch(event: any) {
  //   this.search = event.target.value;
  //   this.sellerListApi();
  // }

  type: number = 1
  customerListData: any
  submitted: boolean = false;
  customerList() {
    const data = {
      type: this.type,
    };
    this.api.post1('auth/get/customer/list', data).subscribe({
      next: (res: any) => {
        this.customerListData = res.data;

      },
      error: (err: any) => {
        this.toaster.error(err.error.message);
      },
    });
  }


  userStatus: any
  acceptFilterList: any
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();

    // If the input field is empty after trimming, fetch all data
    if (filterValue === '') {
      this.customerList(); // Assuming this method fetches all data from the API
    } else {
      this.customerListData = this.customerListData.filter((user: any) => {
        const fullName = user.name ? user.name.toLowerCase() : '';
        return fullName.includes(filterValue);
      });
    }

    // console.log(filterValue);
  }



  placeOrder(_id: any) {
    if (_id) {
      localStorage.removeItem("customerData");
      localStorage.setItem("customerData", JSON.stringify(_id));
      this.commonService.setUpdateCartValue(true);
      this.router.navigateByUrl('/salepanel/dashboard/customer-list/place-order', { state: { data: _id } })
    }
  }

  click(_id: any) {
    if (_id) {
      this.router.navigateByUrl('salepanel/dashboard/customer-list/buyer-detail', { state: { data: _id } })
    }
  }




} 
