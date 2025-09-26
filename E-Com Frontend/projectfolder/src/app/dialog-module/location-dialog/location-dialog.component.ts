// import { MapsAPILoader } from '@agm/core/services/maps-api-loader/maps-api-loader';
import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, EventEmitter, Inject, NgZone, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OfferBannerComponent } from 'src/app/layout/offer-banner/offer-banner.component';
import { ApiService } from 'src/app/service/api.service';
import { CommonService } from 'src/app/service/common.service';
import { CreateProfileComponent } from '../create-profile/create-profile.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.scss']
})
export class LocationDialogComponent {

  @ViewChild('search') public searchElementRef: any;
  [x: string]: any;
  lat: any
  lng: any
  zoom = 15;
  address: any;
  patchAddress: any
  createlong: any
  createlat: any
  userData: any
  patchValueData: any
  postal: any
  channelId: string = '';
  city:any;
  locality:any;
  district:any;
  private geoCoder!: google.maps.Geocoder;

  selectedMessage: any;

  constructor(public dialog: MatDialog,
    private api: ApiService,
    private toaster: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private commonService: CommonService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private activatedRoute: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<LocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
  }
  @ViewChild('search1')
  public search1ElementRef!: ElementRef;


  ngOnInit() {
    const localUserData: any = localStorage.getItem('Aiwa-user-web');
    this.lat = sessionStorage.getItem('latitude')
    this.lng = sessionStorage.getItem('longitude')

    this.getAddress(this.lat, this.lng)
    this.userData = JSON.parse(localUserData)

    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();
      let autocomplete1 = new google.maps.places.Autocomplete(
        this.search1ElementRef.nativeElement
      );
      autocomplete1.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place = autocomplete1.getPlace();
          if (!place.geometry || !place.geometry.location) {
            return;
          }
          this.lat = place?.geometry?.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 12;
          this.patchAddress = place.formatted_address;
          this.setMarkerPosition();
        });
      });
    });

    // this.mapsAPILoader.load().then(() => {
    //   this.setCurrentLocation();
    //   this.geoCoder = new google.maps.Geocoder();

    //   let autocomplete1 = new google.maps.places.Autocomplete(
    //     this.search1ElementRef.nativeElement
    //   );
    //   autocomplete1.addListener('place_changed', () => {
    //     this.ngZone.run(() => {
    //       let place = autocomplete1.getPlace();

    //       if (!place.geometry) {
    //         return
    //       }


    //       this.createlat = this.lat,
    //         this.createlong = this.lat
    //       this.zoom = 12;
    //       this.patchAddress = place.formatted_address
    //     });
    //   });
    // });


  }
  // private setCurrentLocation() {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.lat = position.coords.latitude;
  //       this.lng = position.coords.longitude;
  //       this.zoom = 8;
  //       this.getAddress(this.lat, this.lng);
  //     });
  //   }
  // }
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.lat, this.lng);
        this.setMarkerPosition();      
      });
    }
  }
  private setMarkerPosition() {
    if (this.lat && this.lng) {
      this['map'].panTo({ lat: this.lat, lng: this.lng });
    }
  }

  // markerDragEnd($event: any) {
  //   this.lat = $event.coords.lat;
  //   this.lng = $event.coords.lng;

  //   this.getAddress(this.lat, this.lng)
  //     .then((res: any) => {

  //       this.createlat = this.lat
  //       this.createlong = this.lat

  //     })
  //     .catch((err: any) => {
  //       alert('Please Enable location');
  //     });
  // }
  markerDragEnd($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng)
      .then((res: any) => {
        this.createlat = this.lat;
        this.createlong = this.lng; 
      })
      .catch((err: any) => {
        alert('Please Enable location');
      });
  }
  getAddress(latitude: any, longitude: any) {
    return new Promise((resolve, reject) => {
      this.geoCoder.geocode(
        { location: { lat: latitude, lng: longitude } },
        (results: any, status: any) => {
          if (status === 'OK') {
            if (results[0]) {
              this.patchAddress = results[0].formatted_address;
              this.zoom = 6;
              for (var i = 0; i < results[0].address_components.length; i++) {
                for (
                  var j = 0;
                  j < results[0].address_components[i].types.length;
                  j++
                ) {
                  if (
                    results[0].address_components[i].types[j] == 'postal_code'
                  ) {
                    this.postal = results[0].address_components[i].long_name;
                  }
                  else if (results[0].address_components[i].types[j] == "locality") {
                    this.city = results[0].address_components[i].long_name;
                  } else if (results[0].address_components[i].types[j] == "sublocality") {
                    this.locality = results[0].address_components[i].long_name;
                  }  
                  else if (results[0].address_components[i].types[j] == "administrative_area_level_2") {
                    this.district = results[0].address_components[i].long_name; // Get the district
                  }
                }
              } 
              if (this.patchValueData) {
              } else {
                this.address = results[0].formatted_address;
                resolve(this.address);
              }
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
  onclick() {
    this.setCurrentLocation();
  }
  // getAddress(latitude: any, longitude: any) {
  //   return new Promise((resolve, reject) => {
  //     this.geoCoder.geocode(
  //       { location: { lat: latitude, lng: longitude } },
  //       (results: any, status: any) => {
  //         if (status === 'OK') {
  //           if (results[0]) {
  //             this.patchAddress = results[0].formatted_address;
  //             // sessionStorage.setItem('address', this.patchAddress);

  //             this.zoom = 6;
  //             for (var i = 0; i < results[0].address_components.length; i++) {
  //               for (
  //                 var j = 0;
  //                 j < results[0].address_components[i].types.length;
  //                 j++
  //               ) {
  //                 if (
  //                   results[0].address_components[i].types[j] == 'postal_code'
  //                 ) {
  //                   this.postal = results[0].address_components[i].long_name;
  //                 }
  //               }
  //             }

  //             if (this.patchValueData) {

  //             } else {
  //               this.address = results[0].formatted_address;
  //               resolve(this.address);

  //             }
  //           } else {
  //             reject('Geocoder failed due to: ' + status);
  //           }
  //         } else {
  //           reject('Geocoder failed due to: ' + status);
  //         }
  //       }
  //     );
  //   });
  // }

  // onclick() {
  //   this.setCurrentLocation();
  // }

  offerbanner() {
    this.dialog.open(OfferBannerComponent, {
      disableClose: true,
    })
  }
  getLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: any) => {
            if (position) {
              this.lat = position.coords.latitude;
              this.lng = position.coords.longitude;
              let returnValue = {
                lat: this.lat,
                lng: this.lng,
              };
              resolve(returnValue);
            }
          },
          (error: any) => reject(error)
        );
      } else {
        alert("Geolocation is not supported by this browser.");
        reject("Geolocation is not supported by this browser.");
      }
    });
  }
  // updateData: any
  // addLocation() {
  //   let data = {
  //     _id: this.userData._id,
  //     name: this.data.name,
  //     email: this.data.email,
  //     address: this.patchAddress,
  //     // channelId: this.channelId || "Baqala",
  //     latitude: 26.4499,
  //     longitude: 80.3319,
  //     firstName: this.userData.firstName,
  //     lastName: this.userData.lastName,
  //     countryCode: "+966",
  //     phoneNumber: this.userData.phoneNumber,
  //     profileImg: this.userData.profileImg,
  //     businessDetails: {
  //       businessName: this.data.businessName,
  //       VATNumber: this.userData.VATNumber,
  //       addressProofFront: this.userData.addressProofFront,
  //       addressProofBack: this.userData.addressProofBack,
  //       CRDocumentFront: this.userData.CRDocumentFront,
  //       CRDocumentBack: this.userData.CRDocumentBack,
  //       VATDocFront: this.userData.VATDocFront,
  //       VATDocBack: this.userData.VATDocBack,
  //       IDProofFront: this.userData.IDProofFront,
  //       IDProofBack: this.userData.IDProofBack,
  //       shopImageFront: this.userData.shopImageFront,
  //       shopImageBack: this.userData.shopImageBack

  //     }
  //   }
  //   this.api.patch('auth/update/profile', data).subscribe({
  //     next: (res: any) => {
  //       this.updateData = res.data

  //       sessionStorage.setItem('isLogin', 'true')
  //       this.commonService.setRegisterButtonHideShow(true);
  //       this.dialog.open(OfferBannerComponent, {
  //         disableClose: true,
  //       })



  //     },
  //     error: (err: any) => {
  //       this.toaster.error(err.error.message);
  //     },
  //   });
  // }
  addressdata:any;
  updateData: any;
  addLocation(): void {
    const deliveryAddress = {
      // "userId": this.userData._id,
      // "type": 1,
    "address": this.patchAddress,
    "district": this.district,
    "locality": this.locality,
    "postalCode": this.postal,
    "city": this.city,
    "buildingNumber": 1,
    "secondryNumber": 2,
    "latitude": this.lat,
    "longitude": this.lng
    };
    this.api.post(`address/add`, deliveryAddress).pipe(
      switchMap((res: any) => {
        this.toaster.success('Address Added Successfully');
        this.addressdata = res.data._id;
        let data = {
          _id: this.userData._id,
          name: this.data.name,
          email: this.data.email,
          address: this.addressdata,
          // channelId: this.channelId || "Baqala",
          latitude: this.lat,
          longitude: this.lng,
          firstName: this.userData.firstName,
          lastName: this.userData.lastName,
          countryCode: "+966",
          phoneNumber: this.userData.phoneNumber,
          profileImg: this.userData.profileImg,
          businessDetails: {
            businessName: this.data.businessName,
            VATNumber: this.userData.VATNumber,
            addressProofFront: this.userData.addressProofFront,
            addressProofBack: this.userData.addressProofBack,
            CRDocumentFront: this.userData.CRDocumentFront,
            CRDocumentBack: this.userData.CRDocumentBack,
            VATDocFront: this.userData.VATDocFront,
            VATDocBack: this.userData.VATDocBack,
            IDProofFront: this.userData.IDProofFront,
            IDProofBack: this.userData.IDProofBack,
            shopImageFront: this.userData.shopImageFront,
            shopImageBack: this.userData.shopImageBack
    
          }
        }
        console.log("data of payload is",data);
        return this.api.patch('auth/update/profile', data);
      })
    ).subscribe({
      next: (res: any) => {
        // this.loginData = res.data;
        this.updateData = res.data

        sessionStorage.setItem('isLogin', 'true')
        this.commonService.setRegisterButtonHideShow(true);
        this.dialog.open(OfferBannerComponent, {
          disableClose: true,
        })
      },
      error: (err: any) => {
        this.toaster.error(err.error.message);
        // this.toaster.error('Something went wrong during profile update');
      },
    });
  }
  createBack() {
    this.dialogRef.close()
    this.dialog.open(CreateProfileComponent, {
      width: '550px',
      maxWidth: "90vw",
      panelClass: "auth-dialog-layout",
      disableClose: true
    })
  }

  selectChannel(event: any) {
    console.log('===============', event.value)
    this.channelId = event.value;
  }

}
