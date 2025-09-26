import { MapsAPILoader } from "@agm/core";
import { Component, ElementRef, ViewChild,NgZone } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { OwlOptions } from "ngx-owl-carousel-o";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/service/api.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  storedData: any;
  bannerdata:any;
  bannerimage:any;
  sliderimage:any;
  // sliderimage:any[]=[{
  //   image: 'assets/image/banner-1.jpg'
  // }];
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private api: ApiService,
    private ngZone: NgZone,
    private toaster: ToastrService,
    private mapsAPILoader: MapsAPILoader,
  ) {}

  homeBanner: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 500,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplaySpeed: 1000,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: true,
  };

  topProduct: OwlOptions = {
    loop: false,
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
      400: {
        items: 3,
      },
      740: {
        items: 5,
      },
      1000: {
        items: 8,
        margin: 0,
      },

      1400: {
        items: 8,
        margin: 0,
      },
    },
    nav: true,
  };
  lat: any;
  lng: any;
  currentLat: any;
  channelid: any;
  categoryListData: any;
  suggestedProductData:any[]=[];
  private geoCoder!: google.maps.Geocoder;
  @ViewChild('search', { static: true }) searchElementRef!: ElementRef;
  patchAddress:any;
  zoom=25;
  address:any;
  patchValueData:any;
  isSelectFromSave: any = null;
  useriddata:any;
  // slides = [
  //   {
  //     image: 'assets/image/banner-1.jpg',
  //     alt: 'Banner 1',
  //     discount: '30%',
  //     product: 'Food'
  //   },
  //   {
  //     image: 'assets/image/banner-2.png',
  //     alt: 'Banner 2',
  //     discount: '30%',
  //     product: 'Food'
  //   }
  //   // Add more slides here if needed
  // ];
  ngOnInit() {
    const storedData = localStorage.getItem("Aiwa-user-web");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.useriddata= parsedData._id;
      this.channelid = parsedData.channelId?parsedData.channelId:'Baqala';
      console.log("channel is",this.channelid)
    }
    else{
      this.channelid='Baqala';
    }

    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();
      const autocomplete1 = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete1.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: any = autocomplete1.getPlace();
          if (place.geometry) {
            this.lat = place.geometry.location.lat();
            this.lng = place.geometry.location.lng();
            this.patchAddress = place.formatted_address || '';
            this.getAddress(this.lat, this.lng);
          } else {
            console.log('No geometry information available');
          }
        });
      });
    });
  
    this.getsliderbanner();
    // this.getwebbanner()
    this.getwebbanner()
    this.categoryList()
    this.getLocation();
    this.getBrandList();
   
  }
  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 15;
          this.getAddress(this.lat, this.lng);
      });
    }
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
          this.getSuggestedProductList()
        },
        (error: any) => console.log(error)
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  getAddress(latitude: any, longitude: any) {
    return new Promise((resolve, reject) => {
      this.geoCoder.geocode(
        { location: { lat: latitude, lng: longitude } },
        (results: any, status: any) => {
          if (status === 'OK') {
            if (results[0]) {
              this.patchAddress = results[0].formatted_address;
              sessionStorage.setItem("patchAddress", this.patchAddress);
              this.zoom = 6;
            } else {
              reject('Geocoder failed due to: ' + status);
            }
          } else {
            reject('Geocoder failed due to: ' + status);
          }
        }
      );
    });
  }

  
  getwebbanner(){
    this.api.getbanner(`common/banners/3/${this.channelid}`).subscribe({
      next:(res:any) =>{
        this.bannerdata=res.data;
        this.bannerimage=this.bannerdata[0].image
        // console.log("Banner data is",this.bannerimage)
      },
      error :(err:any) =>{
        this.bannerimage='assets/image/static_banner.png'
        // this.toaster.error(err.error.message);
      }
    })
  }
  getsliderbanner(){
    this.api.getbanner(`common/banners/1/${this.channelid}`).subscribe({
      next:(res:any) =>{
        this.sliderimage=res.data;
        // this.sliderimage=this.bannerdata
        console.log("Banner data is>>>>>>>>>>>>",this.sliderimage)
      },
      error :(err:any) =>{
        this.sliderimage=[{image: 'assets/image/banner-1.jpg'}]
      // this.sliderimage=  {
      //         image: 'assets/image/banner-1.jpg',
      //       }
            // console.log("this.sliderimage ",this.sliderimage)
        // this.toaster.error(err.error.message);
      }
    })
  }
  brandData: any;
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

  goToDetailspage(item: any) {
    item.loginType="User"; 
    item.detailstype="suggestions";
    sessionStorage.setItem('selectedProduct', JSON.stringify(item));
    this.router.navigateByUrl(`/home/product-details/${item._id}/1`,{ state: { selectedProduct: item } });
  }

  categoryList() {
    console.log(this.channelid)
    const data = {
      channelId : this.channelid ? this.channelid :  "Baqala",
    };
    this.api.post1("auth/categoryList", data).subscribe({
      next: (res: any) => {
        this.categoryListData = res.data;
      },
      error: (err: any) => {
        this.toaster.error(err.error.message);
      },
    });
  }
  getSuggestedProductList() {
    this.api.post2(`product/suggestedProducts`, { "channelId": this.channelid,lat:this.lat,long:this.lng,userId:this.useriddata?this.useriddata:''}).subscribe({
      next: (res: any) => {
        this.suggestedProductData = res.data;
      },
      error: (e) => {
      }
    })
  }
  // goToDetailspage(item: any) {
  //   item.loginType="User";
  //   sessionStorage.setItem('selectedProduct', JSON.stringify(item));
  //   this.router.navigateByUrl(`/home/product-details/${item._id}/1`,{ state: { selectedProduct: item } });
  // }

  gotoweeklyproduct(_id: any) {
    this.router.navigateByUrl("/product-lists", { state: { cat: _id } });
  }

  goToProductList(id: any) {
    console.log(id);
    this.router.navigateByUrl("/product-lists", { state: { brand: id } });
  }
}
