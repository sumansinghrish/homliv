// import { Component } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, Inject, NgZone, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
@Component({
  selector: 'app-user-add-address',
  templateUrl: './user-add-address.component.html',
  styleUrls: ['./user-add-address.component.scss']
})
export class UserAddAddressComponent {
  existAddress!: string;
  addressForm!: FormGroup;
  submitted: boolean = false;
  private geoCoder!: google.maps.Geocoder;
  lat: any
  lng: any;
  zoom = 15;
  patchAddress:any;
  patchValueData: any
  postal: any;
  address: any;
  userdata:any;
  userId:any;
  nationalAddressid:any;
  nationalAddressdata:any;
  addressId:string='';
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserAddAddressComponent>,
    public dialog: MatDialog,
    private api:ApiService,
    private ngZone: NgZone,
    private mapsAPILoader:MapsAPILoader,
    private toaster: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const customerDataFromLocal = localStorage.getItem('customerData');
    if (customerDataFromLocal) {
      this.existAddress = JSON.parse(customerDataFromLocal).nationalAddress;
      this.userId=JSON.parse(customerDataFromLocal)._id
      // console.log('======existAddress========', this.existAddress)
    }
    console.log(">>>>>>>>>>>>>>>>>",data)
    if(customerDataFromLocal==undefined || customerDataFromLocal==null){
      this.userId=this.data?.userId;
      this.nationalAddressid=this.data?.nationalAddressid
    }
    if(this.data?.nationalAddressid){
      this.getBillingAddress(this.data?.nationalAddressid).then(() => {
        this.addressForm.patchValue({
          address: this.nationalAddressdata?.address,
          district: this.nationalAddressdata?.district,
          locality: this.nationalAddressdata?.locality,
          postalCode: this.nationalAddressdata?.postalCode,
          latitude:this.nationalAddressdata?.latitude,
          longitude:this.nationalAddressdata?.longitude,
          city: this.nationalAddressdata?.city,
          buildingNumber: this.nationalAddressdata?.buildingNumber,
          secondryNumber: this.nationalAddressdata?.secondryNumber,
        });
        this.addressId=this.nationalAddressdata?._id;
      });
    }
  }
  @ViewChild('search1'    )
  public search1ElementRef!: ElementRef;
  ngOnInit(): void {
    const uselist  = localStorage.getItem('verify-otp-seller-web');
    if (uselist) {
      this.userdata = JSON.parse(uselist);
      this.userId=this.userdata._id;
      console.log('useraddress is======existAddress========', this.userdata)
    }
    console.log('00000000000', this.data)
    this.addressForm = this.fb.group({
      address: ['', Validators.required],
      latitude:['',Validators.required],
      longitude:['',Validators.required],
      district: ['', Validators.required],
      locality:['', Validators.required],
      postalCode: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(5)]], 
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]], 
      buildingNumber: ['',[Validators.minLength(4), Validators.maxLength(4)]], 
      secondryNumber: ['',[Validators.minLength(4), Validators.maxLength(4)]],
    });
    this.mapsAPILoader.load().then(() => {
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
          this.addressForm.patchValue({
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
          })
          this.zoom = 12;
          this.patchAddress = place.formatted_address;
        });
      });
    });
  }
  getBillingAddress(nationalAddressid:any){
    return new Promise((resolve, reject) => {
    this.api.get2(`address/list/${nationalAddressid}`).subscribe({
      next: (res: any) => {
        resolve(res.data)
        this.nationalAddressdata = res.data[0];
        console.log("Billing Address is>>>>>>",this.nationalAddressdata)
      },
      error: (e) => {
        reject(e)
      }
    })
  })
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
  allowOnlyAlphabets(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.keyCode);
    if (!/^[a-zA-Z ]*$/.test(inputChar)) {
      event.preventDefault();
    }
  }

  onKeyPress(event: any) {
    const charCode = event.charCode;
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 32) {
      return;
    } else {
      event.preventDefault();
    }
  }
  hasError(controlName: string, errorName: string) {
    return this.addressForm.controls[controlName].hasError(errorName);
  }

  addAddress(){
    this.submitted = true;

    if (this.addressForm.invalid) {
      return
    }
    var nationaAddress=this.addressForm.value;

    var data=this.addressForm.value;
    data.address=this.patchAddress?this.patchAddress:this.addressForm.value.address;
    // data.userId=this.userId;

    // data.type=2;
    // const deliveryAddress = {
    // "address": this.patchAddress,
    // "district": this.district,
    // "locality": this.locality,
    // "postalCode": this.postal,
    // "city": this.city,
    // "buildingNumber": 1,
    // "secondryNumber": 2,
    // "latitude": this.lat,
    // "longitude": this.lng
    // };

    if(this.addressId==''){
      this.api.post(`address/add`, data).subscribe({
        next: (res: any) => {
          this.toaster.success('Address Added Sucessfully');
          var addressdata={
            nationaAddress:this.patchAddress,
            id:res.data._id
          }
          this.dialogRef.close(addressdata);
        },
        error: (e) => {
          this.toaster.error('Something went wrong');
        }
      });
    }
   else{
    data._id=this.addressId
    this.api.put(`address/edit`, data).subscribe({
      next: (res: any) => {
        this.toaster.success('Address Updated Sucessfully');
        var addressdata={
          nationaAddress:this.patchAddress,
          id:res.data._id
        }
        this.dialogRef.close(addressdata);
      },
      error: (e) => {
        this.toaster.error('Something went wrong');
      }
    });
   }
  }
  get f() {
    return this.addressForm.controls;
  }

}
