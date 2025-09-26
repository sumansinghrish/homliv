import { Component, HostListener } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { LoginComponent } from "src/app/dialog-module/login/login.component";
import { SelectLocationComponent } from "src/app/dialog-module/select-location/select-location.component";
import { ApiService } from "src/app/service/api.service";
import { CommonService } from "src/app/service/common.service";
import { MatBadgeModule } from '@angular/material/badge';
import { SelectUserlocationComponent } from "src/app/dialog-module/select-userlocation/select-userlocation.component";
interface Item {
  icon: string;
  name: string;
}

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  isSticky: boolean = false;

  isUserCustomer: boolean = true;
  isUserPartner: boolean = true;
  selerData: any;
  hideShowRegisterButton: boolean = false;
  salesManData: any;
  userProfile: any;
  customerProfile: any = null;
  cartDataItemCount: number = 0;
  Addresstype:number=1;
  nationalAddressdata:any;
  deliveryaddress:any;
  deliveryAddressdata:any;
  salesmandata1:any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private api: ApiService,
    private commonService: CommonService
  ) {
    // sessionStorage.setItem('salesmanlogin', 'salesmanuserlogin');

    this.setUserAsPartner();
    this.salesmandata1=sessionStorage.getItem("salesmanlogin");
    this.selerData = localStorage.getItem("Aiwa-user-web");
    this.selerData = JSON.parse(this.selerData);
    if(this.selerData){
      this.deliveryAddressdata=this.selerData?.address?.address;
    }

    this.commonService.getRegisterButtonHideShow().subscribe({
      next: (data: boolean) => {
        this.hideShowRegisterButton = data;
      },
    });
  }

  @HostListener("window:scroll", ["$event"])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 100;
  }

  ngOnInit() {
    this.deliveryaddress = sessionStorage.getItem('patchAddress');
    // this.getCartData2();
    // console.log("delivery address is",this.deliveryaddress)
   }
  ngAfterViewInit() {
    if (this.customerProfile) {
      this.commonService.getUpdateCartValue().subscribe({
        next: (res) => {
          this.getCartData();
        }
      })
    }
    if(this.salesmandata1=='userlogin'){
      this.commonService.getUpdateCartValue().subscribe({
        next: (res) => {
          this.getCartData2()
          // this.getCartData();
        }
      })

   
    }
  }
  ngDoCheck() {

    const customer = localStorage.getItem('customerData');
    this.customerProfile = customer ? JSON.parse(customer) : null;
    this.selerData = localStorage.getItem("Aiwa-user-web");
    this.selerData = JSON.parse(this.selerData);
    // if(this.salesManData.isBlocked == false){
    //   localStorage.removeItem("Aiwa-user-web");
    //   this.router.navigateByUrl("/home");
    // }
    // this.selerData = localStorage.getItem("Aiwa-user-web");
  }

  setUserAsPartner() {
    this.isUserPartner = true;
  }

  getCartData() {
    this.api.post1(`product/showCart`, { userId: this.customerProfile._id }).subscribe({
      next: (res: any) => {
        this.cartDataItemCount = res.data?.cartRecord?.length;
      },
      error: (e) => {
      }
    });
  }
  cartDataItemCount2:any;
  getCartData2() {
    this.api.get2(`product/showCart`, ).subscribe({
      next: (res: any) => {
        // this.commonService.setUpdateCartValue(true);
    this.cartDataItemCount2=res?.data?.count;
 
      },
      error: (e) => {
      }
    });
  }


  logout() {
    this.cartDataItemCount2='';
    localStorage.removeItem("Aiwa-user-web");
    localStorage.removeItem("customerData");
    sessionStorage.removeItem("salesmanlogin")
    // location.reload()
    this.router.navigateByUrl("/home");
  }

  logout1() {
    this.cartDataItemCount2='';
    localStorage.removeItem("Aiwa-user-web");
    localStorage.removeItem("customerData");
    sessionStorage.removeItem("salesmanlogin")
    sessionStorage.removeItem("isLogin");
    this.commonService.setRegisterButtonHideShow(false);
    // location.reload()
    this.router.navigateByUrl("/home").then(() => {
      // Reload the location after the navigation is complete
      location.reload();
    });

    // this.router.navigateByUrl("/home");
    // location.reload()
  }

  loginDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(LoginComponent, {
      width: "550px",
      maxWidth: "90vw",
      panelClass: "auth-dialog-layout",
      disableClose: true,
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  // selectLocation() {
  //   this.dialog.open(SelectLocationComponent, {
  //     width: "500px",
  //     height: "100vh",
  //     maxHeight: "100vh",
  //     maxWidth: "90vw",
  //     panelClass: "side-dialog",
  //     position: { right: "0px", top: "0px" },
  //     disableClose: true,
  //   });
  // }

  selectLocation(item:any) {
    const closedDialog=this.dialog.open(SelectUserlocationComponent, {
      width: "500px",
      height: "100vh",
      maxHeight: "100vh",
      maxWidth: "90vw",
      panelClass: "side-dialog",
      position: { right: "0px", top: "0px" },
      disableClose: true,
      data:{item}
    });
    closedDialog.afterClosed().subscribe({
      next: (res) => {
        this.deliveryAddressdata=res.address
        // console.log("Response is>>>>>>> address",res);
        // this.getSavedLocationBasedOnType();
      }
    })
  }

  searchproduct(event:any){
    let value = event.target.value.trim().toLocaleLowerCase();
    if(value.length>3){
      this.api.post2(`product/searchProducts`, { name: value}).subscribe({
        next: (res: any) => {
          // sessionStorage.setItem('productlisting', JSON.stringify(res.data));
          this.router.navigateByUrl("/product-lists",{state:res.data});

          // this.router.navigateByUrl(`/admin/order-mgmt/more-details/${element._id}`,{state:element})
          this.cartDataItemCount = res.data?.cartRecord?.length;
        },
        error: (e) => {
        }
      });
    }
   
  }


  allItems: Item[] = [
    {
      name: "English",
      icon: "assets/image/allicon/english.png",
    },
    {
      name: "Arabic",
      icon: "assets/image/allicon/arabic.png",
    },
    {
      name: "Urdu",
      icon: "assets/image/allicon/urdu.png",
    },
    {
      name: "Hindi",
      icon: "assets/image/allicon/hindi.png",
    },
  ];

  sallerItems: Item[] = [
    {
      name: "",
      icon: "assets/image/allicon/english.png",
    },
    {
      name: "",
      icon: "assets/image/allicon/arabic.png",
    },
    {
      name: "",
      icon: "assets/image/allicon/urdu.png",
    },
    {
      name: "",
      icon: "assets/image/allicon/hindi.png",
    },
  ];

  selected = this.allItems[0];
  selected2 = this.sallerItems[0];

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
}
