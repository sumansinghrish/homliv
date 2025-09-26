import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UpdateNumberComponent } from 'src/app/dialog-module/update-number/update-number.component';
import { OTPVerifyComponent } from 'src/app/dialog-module/otp-verify/otp-verify.component';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  loginData: any;
  submitted: boolean = false;
  userForm: FormGroup;
  imgChange: boolean = false;
  multiple1: never[] = [];
  uploadProfileImage: any;
  profile_image: any;
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

  latitude1!: number;
  longitude1!: number;
  zoom!: number;
  address: any;
  selectedMessage: any;
  private geoCoder: any;

  patchAddress: any
  createlong: any
  createlat: any
  userData: any
  patchValueData: any;
  longitude:any;
  latitide:any;
  @ViewChild('search1')
  public search1ElementRef!: ElementRef;
  postal: any

  constructor(
    private api: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private toaster: ToastrService // @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      name: [''],
      email: [''],
      address: ['', Validators.required],
      channelId: ['Baqala',],
      firstName: ['',],
      lastName: [''],
      latitude: ['',],
      longitude: ['',],
      countryCode: ['+966'],
      phoneNumber: [''],
      businessDetails: this.fb.group({
        businessName: ['', Validators.required],
        // CRNumber: new FormControl<string>('', {
        //   validators: [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
        // }),
        // VATNumber: new FormControl<string>('', {
        //   validators: [Validators.required, Validators.minLength(15), Validators.maxLength(15)],
        // }),

        CRNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        VATNumber: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(15)]]
      })
    });
  }

  get g() {
    return this.userForm.controls;
  }


  ngOnInit() {
  
    this.longitude = sessionStorage.getItem('longitude');
    this.latitide = sessionStorage.getItem('latitude');
    const localUserData: any = localStorage.getItem('Aiwa-user-web')
    this.userData = JSON.parse(localUserData)

    this.getProfile()
    this.getnumber()
    this.addressProofFront = this.userData?.businessDetails?.addressProofFront
    this.addressProofBack = this.userData?.businessDetails?.addressProofBack
    this.CRDocumentFront = this.userData.businessDetails?.CRDocumentFront
    this.CRDocumentBack = this.userData.businessDetails?.CRDocumentBack
    this.VATDocFront = this.userData.businessDetails?.VATDocFront
    this.VATDocBack = this.userData.businessDetails?.VATDocBack
    this.IDProofFront = this.userData.businessDetails?.IDProofFront
    this.IDProofBack = this.userData.businessDetails?.IDProofBack
    this.shopImageFront = this.userData.businessDetails?.shopImageFront
    this.shopImageBack = this.userData.businessDetails?.shopImageBack
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      let autocomplete1 = new google.maps.places.Autocomplete(
        this.search1ElementRef.nativeElement
      );
      autocomplete1.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place = autocomplete1.getPlace();

          this.userForm.patchValue({
            address: place.formatted_address
          })

          let reg = this.patchValueData
          this.createlat = this.latitude1
          this.createlong = this.longitude1

          this.getAddress(this.latitude1, this.longitude1)
            .then((res: any) => {

            })
            .catch((err: any) => {
              alert('Please Enable location');
            });
          this.zoom = 12;
        });
      });
    });

    if (this.selectedMessage) {


    }
  }
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude1 = position.coords.latitude;
        this.longitude1 = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude1, this.longitude1);
      });
    }
  }

  markerDragEnd($event: any) {
    this.latitude1 = $event.coords.lat;
    this.longitude1 = $event.coords.lng;

    this.getAddress(this.latitude1, this.longitude1)
      .then((res: any) => {
        this.createlat = this.latitude1
        this.createlong = this.longitude1

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
                }
              }
              if (this.patchValueData) {
              } else {
                this.address = results[0].formatted_address;

                resolve(this.address);
                this.patchAddress = this.address;
              }
              sessionStorage.setItem('address', this.address);
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

  telInputObject(obj: any) {
    obj.setCountry("om");
  }

  UpdateProfile: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),

    email: new FormControl('',),
    countryCode: new FormControl('+91'),
    phoneNumber: new FormControl('', Validators.required),
    profileImg: new FormControl('')
  });

  onKeyPress(event: any) {
    const charCode = event.charCode;
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 32) {

      return;
    } else {
      event.preventDefault();
    }
  }
  get f() {
    return this.UpdateProfile.controls;
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
        multipleReader.readAsDataURL(file);
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

  Submitbissness(): void {
    this.submitted = true;
    console.log('-------------------',this.userForm)
    if (this.userForm.invalid) {
      return
    }
    if (!this.addressProofFront ) {
      this.toaster.error('Please upload  National Address Proof Document front side');
      return;
    }
    if (!this.CRDocumentFront) {
      this.toaster.error('Please upload CR document front side');
      return;
    }

    if (!this.VATDocFront) {
      this.toaster.error('Please upload VAT Document  front side');
      return;
    }

    // if (!this.addressProofFront || !this.addressProofBack) {
    //   this.toaster.error('Please upload  National Address Proof Document front side and back side');
    //   return;
    // }
    // if (!this.CRDocumentFront || !this.CRDocumentBack) {
    //   this.toaster.error('Please upload CR document front side and back side');
    //   return;
    // }

    // if (!this.VATDocFront || !this.VATDocBack) {
    //   this.toaster.error('Please upload VAT Document  front side and back side');
    //   return;
    // }
    let data = {
      _id: this.userData._id,
      profileImg: this.profiledata.profileImg,
      name: this.profiledata.name,
      email: this.profiledata.email,
      address: this.addressid,
      latitude: this.latitide,
      channelId: this.userForm.value.channelId,
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      longitude: this.longitude,
      countryCode: this.userForm.value.countryCode,
      phoneNumber: this.profiledata.phoneNumber,
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

    this.api.patch('auth/update/profile', data).subscribe({
      next: (res: any) => {
        this.loginData = res.data;
        this.toaster.success("Profile Updated Successfully")
        localStorage.removeItem('verify-otp-seller-web');
        localStorage.setItem('Aiwa-user-web', JSON.stringify(this.loginData))
        this.getProfile();
        this.router.navigateByUrl("/profile");
      },

      error: (err: any) => {
        this.toaster.error(err.error.message);
      },
    });
  }



  addressid:any;
  profiledata: any
  getProfile() {
    this.api.get("auth/profile").subscribe({
      next: (res: any) => {
        this.profiledata = res.data
        console.log("profilke data is>>>>",this.profiledata);
        this.addressid=this.profiledata?.address?._id;
        localStorage.setItem('Aiwa-user-web', JSON.stringify(this.profiledata));

        this.UpdateProfile.patchValue({
          name: this.profiledata.name,
          lastName: this.profiledata.lastName,
          phoneNumber: this.profiledata.phoneNumber,
          email: this.profiledata.email,


        })

        this.userForm.patchValue({
          businessDetails: {
            businessName: this.profiledata.businessDetails?.businessName,
            VATNumber: this.profiledata.businessDetails?.VATNumber,
            CRNumber:this.profiledata.businessDetails?.CRNumber

          },
          
          address: this.profiledata.address?.address,
       


        })

        this.profileImage = this.profiledata.profileImg


      }, error: (err: any) => {


      },
    })
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.UpdateProfile.invalid) {
      return
    }

    let data = {
      ...this.UpdateProfile.value,
      _id: this.userData._id,
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      address: this.profiledata?.address,
      channelId: this.userData.channelId,
      latitude: this.latitide,
      longitude: this.longitude,
      profileImg: this.profileImage,
      businessDetails: {
        businessName: this.profiledata?.businessDetails?.businessName,
        VATNumber: this.profiledata?.businessDetails?.VATNumber,
        CRNumber:this.profiledata?.businessDetails?.CRNumber,
        addressProofFront: this.profiledata?.businessDetails?.addressProofFront,
        addressProofBack: this.profiledata?.businessDetails?.addressProofBack,
        CRDocumentFront: this.profiledata.businessDetails?.CRDocumentFront,
        CRDocumentBack: this.profiledata?.businessDetails?.CRDocumentBack,
        VATDocFront: this.profiledata?.businessDetails?.VATDocFront,
        VATDocBack: this.profiledata?.businessDetails?.VATDocBack,
        IDProofFront: this.profiledata?.businessDetails?.IDProofFront,
        IDProofBack: this.profiledata?.businessDetails?.IDProofBack,
        shopImageFront: this.profiledata?.businessDetails?.shopImageFront,
        shopImageBack: this.profiledata?.businessDetails?.shopImageBack

      }
    }

    this.api.patch('auth/update/profile', data).subscribe({
      next: (res: any) => {
        this.loginData = res.data;
        this.toaster.success("Profile Updated Successfully");
        this.submitted = false
      },
      error: (err: any) => {
      },
    });
  }


  number: any
  getnumber() {
    this.api.get("auth/send/otp/current/mobile").subscribe({
      next: (res: any) => {
        this.number = res
      }, error: (err: any) => {
      },
    })
  }

  updateMobile() {
    const data = this.dialog.open(OTPVerifyComponent, {
      width: '550px',
      maxWidth: "90vw",
      panelClass: "auth-dialog-layout",
      disableClose: true,
      data: { isUpdateComponentOpen: true }
    })
  }


  // upload profile images




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
  profileImage: any;
  imageUploaded: boolean = false;
  uploadImage1(img: any) {

    let data = new FormData();
    data.append('upload_user_file', img);
    this.api.post('auth/uploadFile', data).subscribe((res: any) => {
      this.profileImage = res.data;

    });
  }



}
