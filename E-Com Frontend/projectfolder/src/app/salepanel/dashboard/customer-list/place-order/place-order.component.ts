import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { OwlOptions } from "ngx-owl-carousel-o";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/service/api.service";
import { CommonService } from "src/app/service/common.service";

@Component({
  selector: "app-place-order",
  templateUrl: "./place-order.component.html",
  styleUrls: ["./place-order.component.scss"],
})
export class PlaceOrderComponent {
  topProduct: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    margin: 5,
    navSpeed: 700,
    navText: [
      '<img src="assets/image/back_blue.png" alt="ivon" height="16px">',
      '<img src="assets/image/back_blue.png" class="left-icon-2" height="16px">',
    ],
    responsive: {
      0: {
        items: 3,
        margin: 0,
      },
      577: {
        items: 3,
      },
      771: {
        items: 5,
      },
      991: {
        items: 6,
        margin: 0,
      },
      1024: {
        items: 7,
        margin: 0,
      },

      1201: {
        items: 8,
      },
      2200: {
        items: 8,
      },
    },
    nav: true,
  };
  brandData: any;
  channelid: any;
  patchValueData: any;
  categoryListData: any;
  lat: any;
  lng: any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private api: ApiService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    const customerDataFromLocalStorage = localStorage.getItem('customerData');
    if (customerDataFromLocalStorage) {
      let data = JSON.parse(customerDataFromLocalStorage);
      this.patchValueData = data;
    }
  }

  ngOnInit() {
    const storedData = localStorage.getItem("customerData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.channelid = parsedData.channelId;
    }
    this.commonService.setUpdateCartValue(true);
    this.getBrandList();
    this.categoryList();
    this.getLocation();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          if (position) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
          }
          sessionStorage.setItem("latitude", this.lat);
          sessionStorage.setItem("longitude", this.lng);
        },
        (error: any) => console.log(error)
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  
  getBrandList() {
    this.api.get1("auth/brandList").subscribe({
      next: (res: any) => {
        this.brandData = res.data;
      },
      error: (err: any) => {
        this.toaster.error(err.error.message);
      },
    });
  }

  categoryList() {
    const data = {
      channelId: this.patchValueData.channelId,
    };
    this.api.post1("auth/categoryList", data).subscribe({
      next: (res: any) => {
        this.categoryListData = res.data;
        const categoryIds = this.categoryListData.map(
          (category: any) => category._id
        );
        console.log(categoryIds);
      },
      error: (err: any) => {
        this.toaster.error(err.error.message);
      },
    });
  }

  gotoweeklyproduct(_id: any) {
    this.router.navigateByUrl('/salepanel/dashboard/list-products', { state: { cat: _id } })
  }

  goToProductList(id: any) {
    console.log(id)
    this.router.navigateByUrl('/salepanel/dashboard/list-products', { state: { brand: id } })
  }

  logOutSalesManUser() {
    localStorage.removeItem("customerData")
    this.router.navigateByUrl("/salepanel/dashboard")
  }

}
