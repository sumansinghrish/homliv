// import { Component } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PromoCodeComponent } from 'src/app/dialog-module/promo-code/promo-code.component';
import { SavedLocationComponent } from 'src/app/dialog-module/saved-location/saved-location.component';
import { OrderCompleteComponent } from '../order-complete/order-complete.component';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { SelectLocationComponent } from 'src/app/dialog-module/select-location/select-location.component';
import { Router } from '@angular/router';

import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { PaymentMethodComponent } from '../../payment-method/payment-method.component';
import { AddAddressComponent } from 'src/app/dialog-module/add-address/add-address.component';
import { CommonService } from 'src/app/service/common.service';
import { SavedAddressComponent } from 'src/app/dialog-module/saved-address/saved-address.component';

@Component({
  selector: 'app-addcartuser',
  templateUrl: './addcartuser.component.html',
  styleUrls: ['./addcartuser.component.scss']
})
export class AddcartuserComponent {
  state = 1;
  min = -Infinity;
  max = Infinity;
  userID!: string | null;
  userData: any;
  cartData: any;
  minCartValue: any;
  paymentType: string = '';
  billingAddressId!: string;
  shippingAddressId!: string;
  isBothAddressSame: boolean = false;
  suggestedProductData: any[] = [];
  disableIncrementButton: boolean = false;
  disableDecrementButton: boolean = false;
  checkoutButtonDisabled: boolean = false;
  deliveryChargesData: any;
  lat: any;
  long: any;
  nationalAddressid:any;
  billingaddress:any;
  deliveryAddress:any;
  // deliveryAddressdetails:any;
  deliveryAddressId:string='';
  nationalAddressdata2:any;
  coupenlistdata:any;
  applypromocode:any;
  couponId:any;
  coupendiscount:number=0;
  amountAfterDiscount:any;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private toaster: ToastrService,
    private apiService: ApiService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    const localData = localStorage.getItem(`Aiwa-user-web`);
    this.lat = sessionStorage.getItem(`latitude`);
    this.long = sessionStorage.getItem(`longitude`);
    if (localData) {
      this.userData = JSON.parse(localData);
      this.userID = this.userData._id
      this.nationalAddressid=this.userData.nationalAddress?._id;
      this.deliveryAddressId=this.userData.address?._id;
    }
    this.getCartData();
    this.getMinCartValue();
    this.getSuggestedProductList();
    this.getDeliveryChargesList();
    // this.getBillingAddress();
    this.getDeliveryAddress();
    this.getCoupenlist();
  }

  getCartData() {
    this.apiService.get2(`product/showCart`, ).subscribe({
      next: (res: any) => {
        // this.commonService.setUpdateCartValue(true);
        this.cartData = res.data;
        console.log("cart data is<<<<<<",this.cartData)
        console.log(this.cartData)
        let totalAmount: any = 0;
        this.cartData?.cartRecord?.forEach((ele: any) => {
          ele.sellingPrice = (ele.unitPrice) - (ele.unitPrice / 100) * ele.discount;
          ele.price = ele.sellingPrice * ele.quantity;
          totalAmount += ele.price
        });
        this.cartData['totalPrice'] = Number(totalAmount.toFixed(2));
      },
      error: (e) => {
      }
    });
  }
  getCoupenlist(){
    this.apiService.get2(`product/coupon/list?channelId=Whole Sale`, ).subscribe({
      next: (res: any) => {
        this.coupenlistdata = res.data;
        console.log("coupen list data is>>>>",this.coupenlistdata)
      },
      error: (e) => {
      }
    });
  }
  nationalAddressdata:any;
  getBillingAddress(){
    this.apiService.post2(`address/getAddressDetails`,{_id:this.nationalAddressid}).subscribe({
      next: (res: any) => {
        this.billingaddress = res.data;
        this.nationalAddressdata=`${res.data.address}, ${res.data.district}, ${res.data.streetName}, ${res.data.postalCode}, ${res.data.city}, ${res.data.buildingNumber}, ${res.data.secondryNumber}`
        this.nationalAddressdata2=`${res.data.address}, ${res.data.district}, ${res.data.streetName}, ${res.data.postalCode}, ${res.data.city}, ${res.data.buildingNumber}, ${res.data.secondryNumber}`
        // console.log("Billing Address is>>>>>>",this.billingaddress)
      },
      error: (e) => {
      }
    })
  }
  getDeliveryAddress(){
    this.apiService.post2(`address/getAddressDetails`,{_id:this.deliveryAddressId}).subscribe({
      next: (res: any) => {
        // this.billingaddress = res.data;
        this.deliveryAddress=`${res.data.address}`
        // console.log("Billing Address is>>>>>>",this.billingaddress)
      },
      error: (e) => {
      }
    })
  }
  getMinCartValue() {
    this.apiService.get2(`product/getMinCartValue?channelId=${this.userData.channelId}`).subscribe({
      next: (res: any) => {
        this.minCartValue = res.data;
      },
      error: (e) => {
      }
    })
  }

  totalAmountWithDeliveryFee(totalAmount: number, deliveryCharge: number,coupendiscount:any) {
    return Number(totalAmount) + Number(deliveryCharge) -coupendiscount;
  }

  deliveryFee(deliveryChargesData: any) {
    const { isOfferPriceUpdate, offerPrice, deliveryCharges } = deliveryChargesData || {};
    if (isOfferPriceUpdate == true) {
      return offerPrice > 0 ? offerPrice : 'Free';
    }
    return deliveryCharges > 0 ? deliveryCharges : 'Free';
  }

  increment(item: any) {
    item.quantity += 1;
    if (item.quantity > item.productId.availableQuantity) item.quantity = item.productId.availableQuantity;
    this.changeQuantity({ "cartId": item._id, "status": 1 });
    return item.quantity;
  }

  decrement(item: any) {
    item.quantity -= 1;
    if (item.quantity < 0) item.quantity = 0;
    this.changeQuantity({ "cartId": item._id, "status": 0 });
    return item.quantity;
  }

  changeQuantity(data: any) {
    this.apiService.post2(`product/changeQuantity`, data).subscribe({
      next: (res: any) => {
        this.getCartData();
      },
      error: (e) => {
      }
    });
  }
  // applycode(){
  //   this.apiService.post2(`product/apply/coupon`,{couponCode:this.applypromocode,amount:this.cartData?.totalPrice}).subscribe({
  //     next: (couponRes: any) => {
  //       this.coupendiscount=couponRes?.data?.discountAmount ? couponRes?.data?.discountAmount:0;
  //       this.amountAfterDiscount=couponRes?.data?.amountAfterDiscount;
  //       // const dialogRef = this.dialog.open(OrderCompleteComponent, { width: '450px' });
  //       // dialogRef.afterClosed().subscribe(result => {
  //       //   // this.router.navigate([`/salepanel/dashboard/customer-list/place-order`]);
  //       // });
  //     },
  //     error: (couponError) => {
  //       this.toaster.error(couponError.error.message);
  //     }
  //   });
  //   // console.log("dceew")
  // }

  selectLocation(type: number) {
    const closedDialog = this.dialog.open(SelectLocationComponent, {
      disableClose: true,
      height: "100vh",
      maxHeight: "100vh",
      width: '500px',
      maxWidth: "90vw",
      panelClass: "side-dialog",
      position: { right: "0px", top: "0px" },
      data: { type }
    })
    closedDialog.afterClosed().subscribe({
      next: (res) => {
        if (res.type === 1) {
          this.shippingAddressId = res._id;
        } else {
          this.billingAddressId = res._id;
        }
      }
    })
  }

  bothAddressSame(target: any) {
    this.isBothAddressSame = target.checked;
    if(target.checked){
      this.nationalAddressdata=this.deliveryAddress;
    }
    else{
      this.nationalAddressdata=this.nationalAddressdata2;
    }
   
  }

  getSuggestedProductList() {
    this.apiService.post2(`product/productSuggetionsCart`, { latitude:this.lat,longitude: this.long}).subscribe({
      next: (res: any) => {
        this.suggestedProductData = res.data;
      },
      error: (e) => {
      }
    })
  }

  getDeliveryChargesList() {
    this.apiService.post2(`product/deliveryCharges`, {lat : Number(this.lat), long : Number(this.long) , channelId : this.userData.channelId}).subscribe({
      next: (res: any) => {
        this.deliveryChargesData = res.data;
        console.log("delivery charges is",this.deliveryChargesData)
      },
      error: (e) => {
      }
    });
  }

  promocode() {
   const dialogRef = this.dialog.open(PromoCodeComponent, {
      disableClose: true,
      height: "100vh",
      maxHeight: "100vh",
      width: '500px',
      maxWidth: "90vw",
      panelClass: "side-dialog",
      position: { right: "0px", top: "0px" },
      data:this.coupenlistdata
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.applypromocode=result.promoCode;
        this.couponId=result._id;
          this.apiService.post2(`product/apply/coupon`,{couponCode:this.applypromocode,amount:this.cartData?.totalPrice}).subscribe({
            next: (couponRes: any) => {
              this.coupendiscount=couponRes?.data?.discountAmount ? couponRes?.data?.discountAmount:0;
              this.amountAfterDiscount=couponRes?.data?.amountAfterDiscount;
              // const dialogRef = this.dialog.open(OrderCompleteComponent, { width: '450px' });
              // dialogRef.afterClosed().subscribe(result => {
              //   // this.router.navigate([`/salepanel/dashboard/customer-list/place-order`]);
              // });
            },
            error: (couponError) => {
              this.toaster.error(couponError.error.message);
            }
          });
          // console.log("dceew")
        
      }   
    });

  }

  redirect(route: string, isHome = true) {
    const previous = this.apiService.getPreviousUrl();
    if (previous) {
      this.router.navigate([previous]);
    } else {
      route = isHome ? route : `/salepanel/dashboard/customer-list/place-order`;
      this.router.navigate([route]);
    }
  }

  deleteCartItem(item: any) {
    this.apiService.post2(`product/removeFromCart`, { "cartId": item._id }).subscribe({
      next: (res: any) => {
        this.commonService.setUpdateCartValue(true);
        this.getCartData();
      },
      error: (e) => {
      }
    });
  }

  openorderComplete(): void | any {
    if (this.isBothAddressSame && !this.deliveryAddressId) {
      this.toaster.error(`Please select a delivery address to place the order.`);
      return;
    }
     if (!this.isBothAddressSame && (!this.nationalAddressid || !this.deliveryAddressId)) {
      this.toaster.error(`Please select delivery and billing address to place the order.`);
      return;
    }
    if (!this.paymentType) {
      return this.toaster.error(`Please select payment type to place the order.`);
    }

    const data = {
      // "userId": this.userID,
      "channelId": this.userData.channelId,
      "cartIds": this.cartData?.cartRecord?.map((ele: any) => ele?._id),
      "deliveryCharge": this.deliveryChargesData?.deliveryCharges,
      "discountAmount": 0,
      "transactionId": "trans1234",
      // "couponId":this.couponId,
      // "price": Number(this.cartData?.totalPrice || 0+ this.deliveryChargesData?.deliveryCharges || 0),
      // "price": Number((this.amountAfterDiscount?this.amountAfterDiscount:this.cartData?.totalPrice)+ (this.deliveryChargesData?.isOfferPriceUpdate ? this.deliveryChargesData?.offerPrice  || 0 :this.deliveryChargesData?.deliveryCharges || 0)),
      "price": Number((this.cartData?.totalPrice - this.coupendiscount)+ (this.deliveryChargesData?.isOfferPriceUpdate ? this.deliveryChargesData?.offerPrice  || 0 :this.deliveryChargesData?.deliveryCharges || 0)),
      "currency": "SAR",
      // "shippingAddressId": this.shippingAddressId,
      "shippingAddressId": this.deliveryAddressId,
      // "billingAddressId": this.isBothAddressSame == true ? this.shippingAddressId : this.billingAddressId,
      "billingAddressId":this.isBothAddressSame == true ? this.deliveryAddressId :this.nationalAddressid,
      "paymentOptions": this.paymentType,
      "couponId": this.couponId,
      "cardId": "",
      "paymentResponse": []
    }
    this.apiService.post2(`product/placeOrder`, data).subscribe({
      next: (res: any) => {
        this.commonService.setUpdateCartValue(true);
        const dialogRef = this.dialog.open(OrderCompleteComponent,
          { width: '450px' }
        );
        dialogRef.afterClosed().subscribe(result => {
          this.router.navigateByUrl("/home");
          // this.router.navigate([`/salepanel/dashboard/customer-list/place-order`]);
        });

      },
      error: (e) => {
        this.toaster.error(e.error.message)
      }
    });

    
// this.apiService.post2(`product/placeOrder`, data).subscribe({
//     next: (res: any) => {
//       this.commonService.setUpdateCartValue(true);
//       this.apiService.get2(`product/applyCoupon?couponCode=${this.couponId}&amount=${this.cartData?.totalPrice}`).subscribe({
//         next: (couponRes: any) => {
//           const dialogRef = this.dialog.open(OrderCompleteComponent, { width: '450px' });
//           dialogRef.afterClosed().subscribe(result => {
//             this.router.navigate([`/salepanel/dashboard/customer-list/place-order`]);
//           });
//         },
//         error: (couponError) => {
//           this.toaster.error(couponError.error.message);
//         }
//       });
//     },
//     error: (e) => {
//       this.toaster.error(e.error.message);
//     }
//   }); 

  }

  checkAvailaleQuentity(stocks: number) {
    this.checkoutButtonDisabled = stocks <= 0 ? true : false;
    return stocks
  }

  openPaymentDailog() {
    const dialogRef = this.dialog.open(PaymentMethodComponent,
      {
        width: '600px',
        height: '400px',
        panelClass: 'custom-dialog-container-payment-method'
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      this.paymentType = result.paymentType ? result.paymentType : '';
    });
  }

  addBillingAddress() {
    const dialogRef = this.dialog.open(AddAddressComponent,
      {
        width: '500px',
        height: '580px',
        panelClass: 'custom-container-add-address'
      }

    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 50;
  bufferValue = 75;
  // nationalAddressId:any;
  // deliveryAddressId:any;
  savedAddress(type:any) {
    const dialogRef = this.dialog.open(SavedLocationComponent,{
      disableClose: true,
        height: "100vh",
        maxHeight: "100vh",
        width: '500px',
        maxWidth: "90vw",
        panelClass: "side-dialog",
        position: { right: "0px", top: "0px" },
        data:type
    });
    if(type==2){
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.nationalAddressdata=`${result.address}, ${result.district}, ${result.streetName}, ${result.postalCode}, ${result.city}, ${result.buildingNumber}, ${result.secondryNumber}`;
          this.nationalAddressdata2=`${result.address}, ${result.district}, ${result.streetName}, ${result.postalCode}, ${result.city}, ${result.buildingNumber}, ${result.secondryNumber}`;
          this.nationalAddressid=result._id;
          // console.log("Dialog data is>>>>>>>>",this.nationalAddressdata);
          // console.log(`Dialog result: ${result}`);
        }   
      });
    }
    if(type==1){
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.deliveryAddress=`${result.address}, ${result.district}, ${result.streetName}, ${result.postalCode}, ${result.city}, ${result.buildingNumber}, ${result.secondryNumber}`;
          this.deliveryAddressId=result._id;
          // console.log("Dialog data is>>>>>>>>",this.deliveryAddress);
          // console.log(`Dialog result: ${result}`);
        }   
      });
    }
  }
  goToDetailspage(item: any) {
    item.loginType="User";
    item.detailstype="Cart";
    sessionStorage.setItem('selectedProduct', JSON.stringify(item));
    this.router.navigateByUrl(`/home/product-details/${item._id}/1`,{ state: { selectedProduct: item } });
  }

}
