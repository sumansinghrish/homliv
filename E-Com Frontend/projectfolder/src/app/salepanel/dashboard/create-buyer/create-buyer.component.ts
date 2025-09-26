import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { ToastrService } from 'ngx-toastr';
import { OpenLocationComponent } from 'src/app/dialog-module/open-location/open-location.component';
import { AddAddressComponent } from 'src/app/dialog-module/add-address/add-address.component';
import { switchMap } from 'rxjs';
@Component({
  selector: 'app-create-buyer',
  templateUrl: './create-buyer.component.html',
  styleUrls: ['./create-buyer.component.scss']
})
export class CreateBuyerComponent {
  imgChange: boolean = false;
  multiple1: never[] = [];
  uploadProfileImage: any;
  profile_image: any;
  userForm: FormGroup;
  loginData: any
  submitted: boolean = false;
  latitude1!: number;
  longitude1!: number;
  zoom!: number;
  address: any;
  nationalAddress: any;
  selectedMessage: any;
  private geoCoder: any;
  patchAddress: any
  createlong: any
  createlat: any
  userData: any
  patchValueData: any
  postal: any
  addressProofFront: string = '';
  addressProofBack: string = '';
  CRDocumentFront: string = '';
  CRDocumentBack: string = '';
  VATDocFront: string = '';
  VATDocBack: string = '';
  IDProofFront: string = '';
  IDProofBack: string = '';
  shopImageFront: string = '';
  shopImageBack: string = '';
  nationalAddressdata:any
  @ViewChild('search1')
  public search1ElementRef!: ElementRef;
  // @ViewChild('nationaAddress')
  // public nationaAddressElementRef!: ElementRef;

  constructor(public dialog: MatDialog,
    private router: Router,
    private api: ApiService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) {
    const sessionData: any = sessionStorage.getItem('selectChannelData');
    const sessionSelectChannelData = JSON.parse(sessionData)
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email]],
      address: ['',],
      channelId: [sessionSelectChannelData.channelId, [Validators.required]],
      classification: [sessionSelectChannelData.clasification, Validators.required],
      firstName: ['Baqala'],
      lastName: ['Baqala'],
      latitude: [26.4499, Validators.required],
      longitude: [80.3319, Validators.required],
      countryCode: ['+966', Validators.required],
      phoneNumber: ['', Validators.required],
      nationalAddress: ['',Validators.required],
      businessDetails: this.fb.group({
        businessName: ['', Validators.required],
        CRNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        VATNumber: new FormControl<string>('', {
          validators: [Validators.required, Validators.minLength(15), Validators.maxLength(15)],
        }),
      })
    });
  }

  ngOnInit() {
    const localUserData: any = localStorage.getItem('Aiwa-user-web')
    let localSellerData: any = localStorage.getItem('verify-otp-seller-web')
    localSellerData = JSON.parse(localSellerData)

    this.userForm.patchValue({
      phoneNumber: localSellerData.phoneNumber
    })

    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      let autocomplete1 = new google.maps.places.Autocomplete(
        this.search1ElementRef.nativeElement
      );
      // let autocompleteForNationalAddress = new google.maps.places.Autocomplete(
      //   this.nationaAddressElementRef.nativeElement
      // );
      autocomplete1.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: any = autocomplete1.getPlace();
          this.address = place.formatted_address
          this.createlat = this.latitude1
          this.createlong = this.longitude1
          this.zoom = 12;
          this.userForm.patchValue({
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
          })
        });
      });

      // autocompleteForNationalAddress.addListener('place_changed', () => {
      //   this.ngZone.run(() => {
      //     const place = autocompleteForNationalAddress.getPlace();
      //     if (place.formatted_address) {
      //       this.nationalAddress = place.formatted_address;
      //     }
      //   });
      // });
    });
    if (this.selectedMessage) {
    }
  }
  crNumberValidator(control: any) {
    const value = control.value;
    if (value && (!/^\d{10}$/.test(value))) {
      return { invalidCrNumber: true };
    }
    return null;
  }

  getAddress(latitude: any, longitude: any) {
    return new Promise((resolve, reject) => {
      this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: any, status: any) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 6;
            for (var i = 0; i < results[0].address_components.length; i++) {
              for (var j = 0; j < results[0].address_components[i].types.length; j++) {
                if (results[0].address_components[i].types[j] == "postal_code") {
                  this.postal = results[0].address_components[i].long_name;
                }
              }
            }
            this.address = results[0].formatted_address;
            resolve(this.address);
          } else {
            reject('Geocoder failed due to: ' + status);
          }
        } else {
          reject('Geocoder failed due to: ' + status);
        }
      });
    })
  }

  get f() {
    return this.userForm.controls;
  }

  onKeyPress(event: any) {
    const charCode = event.charCode;
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 32) {
      return;
    } else {
      event.preventDefault();
    }
  }

  telInputObject(obj: any) {
    obj.setCountry("om");
  }
  multipleFiles1(event: any) {
    this.imgChange = true
    this.multiple1 = [];
    var multipleFiles = event.target.files;
    this.uploadProfileImage = event.target.files[0]
    if (multipleFiles) {
      for (var file of multipleFiles) {
        var multipleReader = new FileReader();
        multipleReader.onload = (e: any) => {
          this.profile_image = e.target.result;
        }
        multipleReader.readAsDataURL(file); 234567845676543
      }
    }
  }
  img: any;
  images: any;
  isImageChange = false;
  coverImage: any
  uploadImage(img: any, type: string) {
    let data = new FormData();
    data.append('upload_salesman_file', img);
    this.api.post1('auth/uploadFile', data).subscribe((res: any) => {
      if (type === 'addressFront') {
        this.addressProofFront = res.data;
      } else if (type === 'addressback') {
        this.addressProofBack = res.data;
      } else if (type === 'CRFront') {
        this.CRDocumentFront = res.data;
      } else if (type === 'CRBack') {
        this.CRDocumentBack = res.data;
      } else if (type === 'VATFront') {
        this.VATDocFront = res.data;
      } else if (type === 'VATBack') {
        this.VATDocBack = res.data;
      } else if (type === 'IDFront') {
        this.IDProofFront = res.data;
      } else if (type === 'IDBack') {
        this.IDProofBack = res.data;
      } else if (type === 'shopFront') {
        this.shopImageFront = res.data;
      } else if (type === 'shopBack') {
        this.shopImageBack = res.data;
      }
    })
  }
  uploadFile(event: any, type: string) {
    this.isImageChange = true;
    this.multiple1 = [];
    this.uploadProfileImage = event.target.files[0];
    this.uploadImage(this.uploadProfileImage, type);
    if (event.target.files) {
      for (const file of event.target.files) {
        this.readAndProcessFile(file);
      }
    }
  }

  readAndProcessFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.images = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  profileImage: any;
  imageUploaded: boolean = false;

  addressdata:any;
  onSubmit(): void {
    const verifyOtpData: any = localStorage.getItem('verify-otp-seller-web');
    const parseData = JSON.parse(verifyOtpData);
    this.userForm.value.address=this.address
  
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    if (!this.address) {
      this.toaster.error('Please Enter Address');
      return;
    }
    if (!this.nationalAddressid) {
      this.toaster.error('Please Enter National Address');
      return;
    }
    if (!this.addressProofFront) {
      this.toaster.error('Please upload National Address Proof Document front side');
      return;
    }
    if (!this.CRDocumentFront) {
      this.toaster.error('Please upload CR document front side');
      return;
    }
    if (!this.VATDocFront) {
      this.toaster.error('Please upload VAT Document front side');
      return;
    }
  
    const deliveryAddress = {
      "userId": parseData._id,
      "type": 1,
      "district": '',
      "streetName": '',
      "buildingNumber": '',
      "secondryNumber": '',
      "postalCode": '',
      "address": this.address,
      "city": '',
      "latitude": this.userForm.value.latitude,
      "longitude": this.userForm.value.longitude
    };
  
    // Use switchMap to chain the API calls
    this.api.post1(`address/add`, deliveryAddress).pipe(
      switchMap((res: any) => {
        this.toaster.success('Address Added Successfully');
        this.addressdata = res.data._id;
  
        // Prepare the second API payload after address is successfully added
        let data = {
          _id: parseData._id,
          profileImg: this.profileImage1,
          name: this.userForm.value.name,
          email: this.userForm.value.email,
          address: this.addressdata,
          nationalAddress: this.nationalAddressid,
          latitude: this.userForm.value.latitude,
          channelId: this.userForm.value.channelId,
          classification: this.userForm.value.classification,
          firstName: this.userForm.value.firstName,
          lastName: this.userForm.value.lastName,
          longitude: this.userForm.value.longitude,
          countryCode: this.userForm.value.countryCode,
          phoneNumber: this.userForm.value.phoneNumber,
          businessDetails: {
            businessName: this.userForm.value.businessDetails.businessName,
            VATNumber: this.userForm.value.businessDetails.VATNumber,
            CRNumber: this.userForm.value.businessDetails.CRNumber,
            addressProofFront: this.addressProofFront,
            addressProofBack: this.addressProofBack,
            CRDocumentFront: this.CRDocumentFront,
            CRDocumentBack: this.CRDocumentBack,
            VATDocFront: this.VATDocFront,
            VATDocBack: this.VATDocBack,
            IDProofFront: this.IDProofFront,
            IDProofBack: this.IDProofBack,
            shopImageFront: this.shopImageFront,
            shopImageBack: this.shopImageBack
          }
        };
  
        // Return the second API call
        return this.api.patch1('auth/update/user/profile', data);
      })
    ).subscribe({
      next: (res: any) => {
        this.loginData = res.data;
        localStorage.removeItem('verify-otp-seller-web');
        localStorage.removeItem('selectChannelData');
        this.router.navigateByUrl("/salepanel/dashboard");
      },
      error: (err: any) => {
        this.toaster.error('Something went wrong during profile update');
      }
    });
  }

  uploadFile1(event: any) {
    this.isImageChange = true;
    this.multiple1 = [];
    this.uploadProfileImage = event.target.files[0];

    this.uploadImage1(this.uploadProfileImage);

    if (event.target.files) {
      for (const file of event.target.files) {
        this.readAndProcessFile(file);
      }
    }
  }
  readAndProcessFile1(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.images = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  profileImage1: any;

  uploadImage1(img: any) {

    let data = new FormData();
    data.append('upload_salesman_file', img);
    this.api.post1('auth/uploadFile', data).subscribe((res: any) => {
      this.profileImage1 = res.data;

    });
  }

  mylocationDialog() {
    const dialogRef = this.dialog.open(OpenLocationComponent, {
      disableClose: true,
      height: "100vh",
      maxHeight: "100vh",
      width: '700px',
      maxWidth: "90vw",
      panelClass: "side-dialog-openlocation",
      position: { right: "0px", top: "0px" },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.address) {
        this.address = result.address;
        this.userForm.patchValue({
          latitude: result.lat,
          longitude: result.lng
        });
      }
    });
  }

  // const selectedProduct = sessionStorage.getItem('selectedProduct');
  // if (selectedProduct) {
  //   // Parse the JSON string back into an object
  //   this.product = JSON.parse(selectedProduct);
  //   this.sellingPrice=this.product?.sellingPrice;
  //   this.discountPrice=this.product?.discountPrice;
  //   console.log('Product details from session:>>>>>>', this.product);
  //   console.log("his.sellingPrice",this.sellingPrice)
  // }
  nationalAddressid:any
  addAddress() {
    // if(this.nationalAddressid){}
    var item={
      // userId:this.patchValueData._id,
      nationalAddressid:this.nationalAddressid
    }

  const dialogRef = this.dialog.open(AddAddressComponent,{
    data:item,
    panelClass: 'addADdress',
  });
  dialogRef.afterClosed().subscribe(patchAddress => {
    if(patchAddress){
      this.nationalAddressid=patchAddress.id;
      this.userForm.patchValue({
        nationalAddress : patchAddress.nationaAddress
      })
    }
    });
  }
}