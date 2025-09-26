import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { FilterPriceComponent } from "src/app/dialog-module/filter-price/filter-price.component";
import { ApiService } from "src/app/service/api.service";

@Component({
  selector: "app-product-lists",
  templateUrl: "./product-lists.component.html",
  styleUrls: ["./product-lists.component.scss"],
})
export class ProductListsComponent {
  channelid: any;
  categoryListData: any;
  categoryid: any;
  SubcategoryListData: any;
  productListData: any;
  subCatId: any;
  stateData: any;
  usrefilterproductlist:boolean=false;
  selectedCategoryIndex: number = 0;
  longitude:any;
  latitide:any;
  elementData:any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private api: ApiService,
    private toaster: ToastrService,
    private route: ActivatedRoute
  ) {
    this.elementData=router.getCurrentNavigation()?.extras.state;
    // if(this.elementData){

    // }
    // console.log(this.elementData,">>>>>>>>>>")
   
  }

  

  ngOnInit() {
    // const selectedProduct = sessionStorage.getItem('productlisting');
    // if (selectedProduct) {
    //   this.usrefilterproductlist=true
    //   // Parse the JSON string back into an object
    //   this.productListData = JSON.parse(selectedProduct);
   
    // }
    if(this.elementData?.length>0){
      this.productListData=this.elementData;
      this.usrefilterproductlist=true;
      // window.history.back()
    }
    else{
      this.usrefilterproductlist=false;
    }
    // console.log(this.elementData,"all  merge data")

    this.route.paramMap.subscribe(() => {
      const state = window.history.state;
      if (state && state.brand) {
        this.stateData = state.brand;
      }
      if (state && state.cat) {
        this.categoryid = state.cat;
      }
    });

    const storedData = localStorage.getItem("Aiwa-user-web");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log("parse data is",parsedData)
      this.longitude = parsedData?.address?.longitude;
      this.latitide=parsedData?.address?.latitude;
      // console.log("channel is",parsedData)
      this.channelid = parsedData.channelId;
    }
    // this.longitude = sessionStorage.getItem('longitude');
    // this.latitide = sessionStorage.getItem('latitude');
    this.categoryList();
  }

  categoryList() {
    const data = {
      channelId: this.channelid ? this.channelid : "Baqala",
    };
    this.api.post1("auth/categoryList", data).subscribe({
      next: (res: any) => {
        this.categoryListData = res.data;
        this.updateSelectedCategoryIndex();
      },
      error: (err: any) => {
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
      },
      error: (err: any) => {
      },
    });
  }

  onCategoryChange(event: any) {
    this.categoryid = this.categoryListData[event.index]._id;
    this.subCatId = null;
    this.subcategoryList(this.categoryid);
    // this.updateProductList();
  }

  onSubCategoryChange(event: any) {
    const selectedSubcategory = this.SubcategoryListData[event.index];
    this.subCatId = selectedSubcategory._id;
    // console.log("event is",this.subCatId)
    // this.subCatId = this.SubcategoryListData[event.index]._id;
    this.updateProductList(this.subCatId);
  }

  // productList() {
  //   const data = {
  //     channelId: this.channelid ? this.channelid :"Baqala" ,
  //     brands: this.stateData,
  //     categoryId: this.categoryid,
  //     lat: this.latitide,
  //     long: this.longitude,
  //     subCategoryId: this.subCatId ? this.subCatId : null,
  //   };
  //   this.api.post("product/productList", data).subscribe({
  //     next: (res: any) => {
  //       this.productListData = res.data;
  //       // console.log("product is????",this.productListData)       
  //     },
  //     error: (err: any) => {
  //     },
  //   });
  // }
  productList(startPrice:any,endPrice:any) {
    const data = {
      channelId: this.channelid ? this.channelid :"Baqala" ,
      categoryId: this.categoryid,
      // brands: this.stateData,
      lat: this.latitide,
      long: this.longitude,
      startPrice: startPrice,
      endPrice:endPrice,
      subCategoryId: this.subCatId ? this.subCatId : null,
      ...(this.stateData.length > 0 && { brands: this.stateData })
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
      subCategoryId: subCategoryId,
    };
    this.api.post("product/productList", data).subscribe({
      next: (res: any) => {
        this.productListData = res.data;
        // console.log("list is update is",this.productListData)
      },
      error: (err: any) => {
      },
    });
  }
  // filterPrice() {
  //   this.dialog.open(FilterPriceComponent, {
  //     width: "500px",
  //     height: "100vh",
  //     maxHeight: "100vh",
  //     maxWidth: "90vw",
  //     panelClass: "side-dialog",
  //     position: { right: "0px", top: "0px" },
  //     disableClose: true,
  //     data: this.productListData,
  //   });
  // }


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


  // goToDetailspage(item: any) {
  //   sessionStorage.setItem('selectedProduct', JSON.stringify(item));
  //   this.router.navigateByUrl(`/home/product-details/${item._id}/1`);
  // }
  goToDetailspage(item: any) {
    item.loginType="User";
    item.detailstype="prductdetails";
    sessionStorage.setItem('selectedProduct', JSON.stringify(item));
    this.router.navigateByUrl(`/home/product-details/${item._id}/1`,{ state: { selectedProduct: item } });
  }
}
