import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { FilterPriceComponent } from 'src/app/dialog-module/filter-price/filter-price.component';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-lists-products',
  templateUrl: './lists-products.component.html',
  styleUrls: ['./lists-products.component.scss']
})
export class ListsProductsComponent {
  subCatId: any;
  channelid: any;
  channelId: any
  categoryListData: any
  categoryid: any
  SubcategoryListData: any
  productListData: any
  subcategoryid: any
  stateData: any[] = [];
  patchValueData: any;
  longitude:any;
  latitide:any;
  selectedCategoryIndex: any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private api: ApiService,
    private toaster: ToastrService,
    private route: ActivatedRoute
  ) {
    const customerDataFromLocalStorage = localStorage.getItem('customerData');
    if (customerDataFromLocalStorage) {
      let data = JSON.parse(customerDataFromLocalStorage);
      this.patchValueData = data;
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      const state = window.history.state;
      if (state && state.brand) {
        this.stateData = [state.brand];
      }
      if (state && state.cat) {
        this.categoryid = state.cat;
      }
    });
    // const storedData = localStorage.getItem('Aiwa-user-web');
    // if (storedData) {
    //   const parsedData = JSON.parse(storedData);
    //   this.channelid = parsedData.channelId;
    // }
    const localData = localStorage.getItem(`customerData`);
    if (localData) {
      this.channelid = JSON.parse(localData).channelId;
    }
    this.longitude = sessionStorage.getItem('longitude');
    this.latitide = sessionStorage.getItem('latitude');
    this.categoryList()
    // this.productList()
  }

  categoryList() {
    const data = {
      channelId: this.channelid,
    };
    this.api.post1("auth/categoryList", data).subscribe({
      next: (res: any) => {
        this.categoryListData = res.data;
        this.updateSelectedCategoryIndex();
        // this.productList();
      },
      error: (err: any) => {
        // this.toaster.error(err.error.message);
      },
    });
  }

  updateSelectedCategoryIndex() {
    if (this.categoryid) {
      const index = this.categoryListData.findIndex(
        (item: any) => item._id === this.categoryid
      );
      if (index !== -1) {
        this.selectedCategoryIndex = index;
      } else {
        this.selectedCategoryIndex = 0; // fallback to first index if not found
      }
      this.subcategoryList(this.categoryid);
    }
  }

  onCategoryChange(event: any) {
    // console.log('=====cate=========', this.categoryListData[event.index], event.index)
    this.categoryid = this.categoryListData[event.index]._id;
    this.subCatId = null;
    this.subcategoryList(this.categoryid);
    // this.updateProductList();
  }

  subcategoryList(id: any) {
    const data = {
      categoryId: id,
    };
    this.api.post1("auth/subCategory/list", data).subscribe({
      next: (res: any) => {
        this.SubcategoryListData = res.data;
        if (this.SubcategoryListData.length > 0) {
          this.updateProductList(this.SubcategoryListData[0]._id);
        } else {
        this.updateProductList(null);
        }
        // this.productList();
      },
      error: (err: any) => {
      },
    });
  }

  onSubCategoryChange(event: any) {
    this.subCatId = this.SubcategoryListData[event.index]?._id;
    this.updateProductList(this.subCatId);
  }

  productList(startPrice:any,endPrice:any) {
    const data = {
      channelId: this.channelid ? this.channelid :"Baqala" ,
      categoryId: this.categoryid,
      brands: this.stateData,
      lat: this.latitide,
      long: this.longitude,
      startPrice: startPrice,
      endPrice:endPrice,
      subCategoryId: this.subCatId ? this.subCatId : null,
    };
    // console.log("brand lits is",data);
    this.productListData = [];
    this.api.post("product/productList", data).subscribe({
      next: (res: any) => {
        this.productListData = res.data;
      },
      error: (err: any) => {
        this.productListData = [];
      },
    });
  }

  updateProductList(subCategoryId: string | null = null) {
    const data = {
      channelId: this.channelid ? this.channelid :"Baqala" ,
      categoryId: this.categoryid,
      lat: this.latitide,
      long: this.longitude,
      // brands: this.stateData,
      // categoryId: this.categoryid,
      subCategoryId: subCategoryId,
    };
    this.productListData = [];
    this.api.post("product/productList", data).subscribe({
      next: (res: any) => {
        this.productListData = res.data;
        // console.log("this.productListData >>>>>",this.productListData)
      },
      error: (err: any) => {
        this.productListData = [];
      },
    });
  }

  filterPrice() {
    const dialogRef = this.dialog.open(FilterPriceComponent, {
      width: "500px",
      height: "100vh",
      maxHeight: "100vh",
      maxWidth: "90vw",
      panelClass: "side-dialog",
      position: { right: "0px", top: "0px" },
      disableClose: true,
      data: {
        category: this.categoryListData,
        subCategory: this.SubcategoryListData,
        brand: this.stateData
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (data: any) => {
        // console.log("Brand data is",data)
        this.stateData = data?.brands ? data.brands : [];
        this.productList(data.startPrice,data.endPrice);
      },
      error: (e) => {
        // console.log('e', e);
      }
    })
  }
  goToDetailspage(item: any) {
    item.loginType="Salesman";
    item.detailstype="prductdetails";
    sessionStorage.setItem('selectedProduct', JSON.stringify(item));
    this.router.navigateByUrl(`/home/product-details/${item._id}/2`,{ state: { selectedProduct: item } });
  }

  // goToDetailspage(item: any) {
  //   item.loginType="Salesman";
  //   sessionStorage.setItem('selectedProduct', JSON.stringify(item));
  //   this.router.navigateByUrl(`/home/product-details/${item._id}/2`);
  // }

  logOutSalesManUser() {
    localStorage.removeItem("customerData")
    this.router.navigateByUrl("/salepanel/dashboard")
  }
}
