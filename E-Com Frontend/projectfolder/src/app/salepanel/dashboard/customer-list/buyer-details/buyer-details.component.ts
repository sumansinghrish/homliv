import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { OpenLocationComponent } from 'src/app/dialog-module/open-location/open-location.component';
import { AddAddressComponent } from 'src/app/dialog-module/add-address/add-address.component';
import { switchMap } from 'rxjs';


@Component({
  selector: 'app-buyer-details',
  templateUrl: './buyer-details.component.html',
  styleUrls: ['./buyer-details.component.scss']
})
export class BuyerDetailsComponent {
  patchValueData: any
  userForm!: FormGroup;
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
  profileImg: any;
  imgChange: boolean = false;
  multiple1: never[] = [];
  uploadProfileImage: any;
  private geoCoder: any;
  address: any;
  nationalAddress: any;
  formatedAddress:string='';
  @ViewChild('search1')
  public search1ElementRef!: ElementRef;

  // @ViewChild('nationaAddress')
  // public nationaAddressElementRef!: ElementRef;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private api: ApiService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) {
    this.route.paramMap.subscribe((params) => {
      let data = window.history.state.data;
      this.patchValueData = data;
      // console.log(data)
    });
  }
  ngOnInit() {
    this.userForm = this.fb.group({
      _id: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [, Validators.email]],
      address: [''],
      channelId: ['', Validators.required],
      // classification: ["A", Validators.required],
      firstName: ['Baqala'],
      lastName: ['Baqala'],
      nationalAddress:['',Validators.required],
      latitude: [26.4499, Validators.required],
      longitude: [80.3319, Validators.required],
      countryCode: ['+966', Validators.required],
      phoneNumber: ['', Validators.required],

      businessDetails: this.fb.group({
        businessName: ['', Validators.required],
        CRNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        VATNumber: new FormControl<string>('', {
          validators: [Validators.required, Validators.minLength(15), Validators.maxLength(15)],
        }),
      })
    });
    this.Submitbissness();
    // this.getBillingAddress()
    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();
      let autocomplete1 = new google.maps.places.Autocomplete(
        this.search1ElementRef.nativeElement
      );
      autocomplete1.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: any = autocomplete1.getPlace();
          this.address = place.formatted_address;
          this.formatedAddress=place.formatted_address
          this.userForm.patchValue({
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
          })
        });
      });
    });
  }
  get f() {
    return this.userForm.controls;
  }
  billingaddress:any;
  nationalAddressdata:any;
  deliveryAddress:any

  // getBillingAddress() {
  //   return new Promise<void>((resolve, reject) => {
  //     if (this.patchValueData?.nationalAddress?._id !== undefined && this.patchValueData?.address?._id !== undefined) {
  //       this.api.post1(`address/getAddressDetails`, { _id: this.patchValueData.nationalAddress }).subscribe({
  //         next: (res: any) => {
  //           this.billingaddress = res.data.address;
  //           this.nationalAddressdata = `${res.data.address}, ${res.data.district}, ${res.data.streetName}, ${res.data.postalCode}, ${res.data.city}, ${res.data.buildingNumber}, ${res.data.secondryNumber}`;
  //           console.log("Billing Address is>>>>>>", this.billingaddress);
  //           this.api.post1(`address/getAddressDetails`, { _id: this.patchValueData.address }).subscribe({
  //             next: (res2: any) => {
  //               this.deliveryAddress = `${res2.data.address}`;
  //               console.log("Second API response>>>>>>", this.deliveryAddress);
  //               resolve(); // No value passed to resolve
  //               this.Submitbissness();
  //             },
  //             error: (e2) => {
  //               reject(); // No value passed to reject
  //             }
  //           });
  //         },
  //         error: (e) => {
  //           this.Submitbissness();
  //           reject(); // No value passed to reject
  //         }
  //       });
  //     } else if (this.patchValueData?.address._id !== undefined) {
  //       this.api.post1(`address/getAddressDetails`, { _id: this.patchValueData.address }).subscribe({
  //         next: (res: any) => {
  //           this.deliveryAddress = `${res.data.address}`;
  //           console.log("Address is>>>>>>", this.deliveryAddress);
  //           resolve(); // No value passed to resolve
  //           this.Submitbissness();
  //         },
  //         error: (e) => {
  //           reject(); // No value passed to reject
  //         }
  //       });
  //     } else {
  //       reject(); // No value passed to reject
  //     }
  //   });
  // }

  nationalAddressid1:any;
  Submitbissness() {
    this.nationalAddressdata=this.patchValueData?.nationalAddress?.address;
    this.deliveryAddress=this.patchValueData?.address?.address;
    this.nationalAddressid1=this.patchValueData?.nationalAddress?._id;
    this.address=this.deliveryAddress;
      this.userForm.patchValue({
        _id: this.patchValueData._id,
        name: this.patchValueData.name,
        email: this.patchValueData.email,
        address: this.deliveryAddress,
        latitude: this.patchValueData.latitude,
        channelId: this.patchValueData.channelId,
        firstName: this.patchValueData.firstName,
        lastName: this.patchValueData.lastName,
        longitude: this.patchValueData.longitude,
        countryCode: this.patchValueData.countryCode,
        phoneNumber: this.patchValueData.phoneNumber,
        nationalAddress: this.nationalAddressdata,
        businessDetails: {
          businessName: this.patchValueData.businessDetails.businessName,
          VATNumber: this.patchValueData.businessDetails.VATNumber,
          CRNumber: this.patchValueData.businessDetails.CRNumber,
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
      })
    this.addressProofFront = this.patchValueData.businessDetails.addressProofFront
    this.addressProofBack = this.patchValueData.businessDetails.addressProofBack
    this.CRDocumentFront = this.patchValueData.businessDetails.CRDocumentFront
    this.CRDocumentBack = this.patchValueData.businessDetails.CRDocumentBack
    this.VATDocFront = this.patchValueData.businessDetails.VATDocFront
    this.VATDocBack = this.patchValueData.businessDetails.VATDocBack
    this.IDProofFront = this.patchValueData.businessDetails.IDProofFront
    this.IDProofBack = this.patchValueData.businessDetails.IDProofBack
    this.shopImageFront = this.patchValueData.businessDetails.shopImageFront
    this.shopImageBack = this.patchValueData.businessDetails.shopImageBack
    this.profileImage = this.patchValueData.profileImg
  }
  submitted: boolean = false;
  editBuyer(): void {
    this.submitted = true;
    if (this.userForm.invalid) {
      return
    }
    if (!this.address) {
      this.toaster.error('Please Enter Address');
      return;
    }
    // if (!this.nationalAddress) {
    //   this.toaster.error('Please Enter National Address');
    //   return;
    // }
    if (!this.addressProofFront) {
      this.toaster.error('Please upload  National Address Proof Document front side');
      return;
    }
    if (!this.CRDocumentFront) {
      this.toaster.error('Please upload CR document front side ');
      return;
    }
    if (!this.VATDocFront) {
      this.toaster.error('Please upload VAT Document  front side ');
      return;
    }
    if(this.nationalAddressid!=='' || this.nationalAddressid==undefined){
      this.userForm.value.nationalAddress=this.nationalAddressid
    }
    else{
      this.userForm.value.nationalAddress=this.nationalAddressid1
    }
    const deliveryAddress = {
      "userId": this.patchValueData?._id,
      "type": 1,
      "district": '',
      "streetName": '',
      "buildingNumber": '',
      "secondryNumber": '',
      "postalCode": '',
      "address": this.formatedAddress,
      "city": '',
      "latitude": this.userForm.value.latitude,
      "longitude": this.userForm.value.longitude
    };
  
  if(this.formatedAddress!='' || this.formatedAddress==undefined){
    this.api.put1(`address/edit`, {...deliveryAddress,_id:this.patchValueData?.address?._id}).pipe(
      switchMap((res: any) => {
        this.toaster.success('Address Updated Successfully');
        let data = {
          ...this.userForm.value,
          profileImg: this.profileImage,
          address: this.patchValueData.address,
          // nationalAddress: this.nationalAddress,
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
        this.toaster.success("Buyer Updated Successfully")
        this.patchValueData = res.data
        this.router.navigateByUrl("/salepanel/dashboard/customer-list")
      },
      error: (err: any) => {
        this.toaster.error(err.error.message);
        // this.toaster.error('Something went wrong during profile update');
      }
    });
  }
  else{
    let data = {
      ...this.userForm.value,
      profileImg: this.profileImage,
      address: this.patchValueData.address?._id,
      // nationalAddress: this.nationalAddress,
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
    this.api.patch1('auth/update/user/profile', data).subscribe({
      next: (res: any) => {
        this.toaster.success("Buyer Updated Successfully")
        this.patchValueData = res.data
        this.router.navigateByUrl("/salepanel/dashboard/customer-list")
      },
      error: (err: any) => {
        this.toaster.error(err.error.message);
      },
    });
  }
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
          this.profileImg = e.target.result;
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
  profileImage: any = '';
  imageUploaded: boolean = false;
  uploadImage1(img: any) {

    let data = new FormData();
    data.append('upload_user_file', img);
    this.api.post('auth/uploadFile', data).subscribe((res: any) => {
      this.profileImage = res.data;

    });
  }

  mylocationDialog() {
    const dialogRef = this.dialog.open(OpenLocationComponent, {
      disableClose: true,
      height: "100vh",
      maxHeight: "100vh",
      width: '500px',
      maxWidth: "100%",
      panelClass: ['side-dialog', 'dumy'],
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
  nationalAddressid:string='';
  addAddress() {
    var item={
      userId:this.patchValueData._id,
      nationalAddressid:this.nationalAddressid1
    }
    const dialogRef = this.dialog.open(AddAddressComponent,{
      data:item,
      panelClass: 'addADdress',
    });
    dialogRef.afterClosed().subscribe(patchAddress => {
      console.log("Address is",patchAddress)
      if(patchAddress){
        this.nationalAddressid=patchAddress.id
        if(patchAddress?.nationaAddress){
          this.userForm.patchValue({
            nationalAddress : patchAddress?.nationaAddress
          })
        }
      }
      // console.log(`Dialog result: ${result}`);
    });
  }

}