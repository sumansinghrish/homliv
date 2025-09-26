import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/service/api.service";
import { CommonService } from "src/app/service/common.service";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.scss"],
})
export class ProductDetailsComponent {
  id: any;
  productImg: any[] = [];
  type: any;
  selectedProductImage: string = '';
  sellingPrice:any;
  product:any;
  discountPrice:any;
  logintype:any;
  elementData:any;
  detailstype:any;
  suggestion:boolean=false;
  showHide() {
    this.showHide;
  }
  patchValueData: any;
  getid: any;
  constructor(
    private router: Router,
    private api: ApiService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private commonService: CommonService,
  ) {
    this.elementData=router.getCurrentNavigation()?.extras.state;
    // console.log("cdesdfew",this.elementData)
    // this.route.paramMap.subscribe((params) => {
    //   let data = window.history.state.data;
    //   this.patchValueData = data;
    //   console.log(this.patchValueData )
    // });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params["_id"];
      this.type = params["type"];
      // console.log("THIS IS ROUTE TYPE : ", this.type)
      this.productDetails(this.id);
    });
    const selectedProduct = sessionStorage.getItem('selectedProduct');
    // const selectedProduct = this.elementData?.selectedProduct;
    if (selectedProduct) {
      this.product = JSON.parse(selectedProduct);
      this.sellingPrice=this.product?.sellingPrice;
      this.discountPrice=this.product?.discountPrice;
      this.logintype=this.product?.loginType;
      this.detailstype=this.product?.detailstype;
      // this.sellingPrice=selectedProduct?.sellingPrice;
      // this.discountPrice=selectedProduct?.discountPrice;
      // this.logintype=selectedProduct?.loginType;
      // this.detailstype=selectedProduct?.detailstype;
      // if(this.detailstype=='suggestions'){
      //   this.suggestion=true;
      // }
    }
  }

  productDetailsData: any;
  productDetails(id: any) {
    this.api.get(`product/details/${id}`).subscribe({
      next: (res: any) => {
        this.productDetailsData = res.data;
        // console.log("product details is",this.productDetailsData)
        this.productImg = this.productDetailsData.subCatImg;
        this.selectedProductImage = this.productDetailsData.subCatImg[0];
        this.productBuyLimit = this.productDetailsData.availableQuantity;
      },
      error: (err: any) => {
        this.toaster.error(err.error.message);
      },
    });
  }


  selectProductImage(url: string) {
    this.selectedProductImage = url;
  }

  // addCart() {  
  //   const localData = localStorage.getItem('customerData');
  //   const userId = localData ? JSON.parse(localData)._id : null;
  //   const longitude=localData ? JSON.parse(localData).longitude : null;
  //   const latitude=localData ? JSON.parse(localData).latitude : null;
  //   // console.log("long lat is",longitude ,latitude);
  //   const data = {
  //     userId,
  //     productId: this.productDetailsData._id,
  //     quantity: this.productQuantity,
  //     lat: latitude,
  //     long: longitude
  //   }
  //   this.api.post1(`product/addToCart`, data).subscribe({
  //     next: (res: any) => {
  //       this.commonService.setUpdateCartValue(true);
  //       this.toaster.success(res.message);
  //       this.router.navigateByUrl("/addcart");

  //     },
  //     error: (e) => {
  //       this.toaster.error(e.error.message);
  //     }
  //   })
  // }
  addCart() {  
    if(this.logintype!='User'){
    const localData = localStorage.getItem('customerData');
    const userId = localData ? JSON.parse(localData)._id : null;
    const longitude=localData ? JSON.parse(localData).longitude : null;
    const latitude=localData ? JSON.parse(localData).latitude : null;
    // console.log("long lat is",longitude ,latitude);
    const data = {
      userId,
      productId: this.productDetailsData._id,
      quantity: this.productQuantity,
      lat: latitude,
      long: longitude
    }
    this.api.post1(`product/addToCart`, data).subscribe({
      next: (res: any) => {
        this.commonService.setUpdateCartValue(true);
        this.toaster.success(res.message);
        this.router.navigateByUrl("/addcart");

      },
      error: (e) => {
        this.toaster.error(e.error.message);
      }
    })
  }
  else{
    const localData = localStorage.getItem('Aiwa-user-web');
    const userId = localData ? JSON.parse(localData)._id : null;
    const longitude=localData ? JSON.parse(localData).address?.longitude : null;
    const latitude=localData ? JSON.parse(localData).address?.latitude : null;
    // console.log("long lat is",longitude ,latitude);
    const data = {
      userId,
      productId: this.productDetailsData._id,
      quantity: this.productQuantity,
      lat: latitude,
      long: longitude
    }
    this.api.post2(`product/addToCart`, data).subscribe({
      next: (res: any) => {
        this.commonService.setUpdateCartValue(true);
        this.toaster.success(res.message);
        this.router.navigateByUrl("/addcartuser");

      },
      error: (e) => {
        this.toaster.error(e.error.message);
      }
    })
  }
  }
  productBuyLimit: number = 0;
  productQuantity: number = 1;
  min = -Infinity;
  max = Infinity;
  disableIncrementButton: boolean = false;
  disableDecrementButton: boolean = false;

  increment(count = 1) {

    if (this.productQuantity > 0) {
      this.disableDecrementButton = false;
    }
    this.disableIncrementButton = false;
    this.productQuantity += count;
    if (this.productQuantity > this.max) this.productQuantity = this.max;
    if (this.productBuyLimit < this.productQuantity) {
      this.disableIncrementButton = true;
      this.productQuantity--;
      return;
    }
    return this.productQuantity;
  }

  decrement(count = 1) {
    this.disableIncrementButton = false;
    if (this.productQuantity === 1) {
      this.disableDecrementButton = true;
      return;
    }
    this.disableDecrementButton = false;
    this.productQuantity -= count;
    if (this.productQuantity < 0) this.productQuantity = 0;
    return this.productQuantity;
  }

  goToBack() {
    if (this.type == 1) {
      this.router.navigateByUrl('/product-lists')
    } else {
      this.router.navigateByUrl('/salepanel/dashboard/list-products')
    }
  }
  goToBack2() {
    if (this.type == 1) {
      this.router.navigateByUrl('/home')
    } else {
      this.router.navigateByUrl('/salepanel/dashboard/list-products')
    }
  }
  goToBack3(){
    if (this.type == 1) {
      this.router.navigateByUrl('/addcartuser')
    } else {
      this.router.navigateByUrl('/salepanel/dashboard/list-products')
    }
  }
}
