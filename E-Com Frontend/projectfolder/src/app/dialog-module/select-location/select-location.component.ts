import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SavedLocationComponent } from '../saved-location/saved-location.component';
import { MapsAPILoader } from '@agm/core';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { AddAddressComponent } from '../add-address/add-address.component';

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss']
})
export class SelectLocationComponent implements OnInit {
  lat: any
  lng: any
  zoom = 25;
  postal: any;
  address: any;
  city!: string;
  userData: any;
  createlat: any;
  createlong: any;
  locality!: string;
  patchAddress: any;
  patchValueData: any;
  passAddressData: any;
  isSelectFromSave: any = null;
  isEditLocation: boolean = false;
  latitude:any;
  longitude:any;
  editlocation:string='';
  private geoCoder!: google.maps.Geocoder;
  @ViewChild('search', { static: true }) searchElementRef!: ElementRef;
  constructor(
    private dialogRef: MatDialogRef<SelectLocationComponent>,
    public dialog: MatDialog,
    private api: ApiService,
    private toastr: ToastrService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    console.log("data is>>>>>>",this.data);
    if(this.data?.item){
      this.longitude=this.data.item?.longitude;
      this.latitude=this.data.item?.latitude;
      this.editlocation=this.data.item?._id;
      // this.getAddress(this.data.item.latitude,this.data.item.longitude)
      // this.patchAddress=this.data.item.address

    }
  }

  ngOnInit(): void {
    const localUserData: any = localStorage.getItem('customerData');
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
    // this.getAddress(this.lat, this.lng);
    this.userData = JSON.parse(localUserData);

  }

  getAddress(latitude: any, longitude: any) {
    return new Promise((resolve, reject) => {
      if (this.geoCoder) {
        this.geoCoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results: any, status: any) => {
            if (status === 'OK') {
              if (results[0]) {
                this.patchAddress = results[0].formatted_address;
                this.passAddressData = results[0];
                console.log('=====',results)
                this.zoom = 20;
                // results[0].address_components[0].
                this.postal = '';
                this.city = '';
                this.locality = '';
                for (let i = 0; i < results[0].address_components.length; i++) {
                  for (let j = 0; j < results[0].address_components[i].types.length; j++) {
                    if (results[0].address_components[i].types[j] == 'postal_code') {
                      this.postal = results[0].address_components[i].long_name;
                    } else if (results[0].address_components[i].types[j] == "locality") {
                      this.city = results[0].address_components[i].long_name;
                    } else if (results[0].address_components[i].types[j] == "sublocality") {
                      this.locality = results[0].address_components[i].long_name;
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
      }
    });
  }

  setCurrentLocation() {
    this.isSelectFromSave = this.isEditLocation ? this.isSelectFromSave : null;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 15;
        if(this.data?.item?.longitude){
          this.getAddress(this.latitude, this.longitude);
        }
        else{
          this.getAddress(this.lat, this.lng);
        }
        
      });
    }
  }

  markerDragEnd($event: any) {
    this.isSelectFromSave = this.isEditLocation ? this.isSelectFromSave : null;
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng)
      .then((res: any) => {
        this.createlat = this.lat
        this.createlong = this.lng
      })
      .catch((err: any) => {
        alert('Please Enable location');
      });
  }

  close() {
    if (this.isEditLocation) {
      this.editLocation();
    } else {
      if (!this.isSelectFromSave) {
        this.addLocation();
      } else {
        this.dialogRef.close(this.isSelectFromSave);
      }
    }
  }
  addLocation() {
    const data = {
      "userId": this.userData._id,
      "type": this.data?.type?this.data?.type:this.data?.item.type,
      "district":'',
      "streetName":'',
      "buildingNumber": '',
      "secondryNumber": '',
      "postalCode": this.postal,
      "address": this.address,
      // "locality": this.locality,
      "city": this.city,
      "latitude": this.lat,
      "longitude": this.lng
    }

    // userId: Joi.string().required(),
    // type: Joi.number().required(),
    // district: Joi.string().required(),
    // city: Joi.string().required(),
    // streetName: Joi.string().required(),
    // postalCode: Joi.string().required(),
    // address: Joi.string().required(),
    // buildingNumber: Joi.string().required(),
    // secondryNumber: Joi.string().required(),
    // latitude: Joi.number().required(),
    // longitude: Joi.number().required(),

    console.log("location data is",data);
    if(this.editlocation==''||this.editlocation==undefined){
      this.api.post1(`address/add`, data).subscribe({
        next: (res: any) => {
          this.toastr.success('Location Added Sucessfully');
          this.dialogRef.close(res.data);
        },
        error: (e) => {
          this.toastr.error('Something went wrong');
        }
      });
    }
    else{ 
      this.api.put1(`address/edit`, {...data,_id:this.editlocation}).subscribe({
        next: (res: any) => {
          this.toastr.success('Location Added Sucessfully');
          this.dialogRef.close(res.data);
        },
        error: (e) => {
          this.toastr.error('Something went wrong');
        }
      });
    }
  
  }

  editLocation() {
    const data = {
      "_id": this.isSelectFromSave?._id,
      "userId": this.userData._id,
      "type": this.data.type,
      "postalCode": this.postal,
      "address": this.address,
      "locality": this.locality,
      "city": this.city,
      "latitude": this.lat,
      "longitude": this.lng
    }
    this.api.put1(`address/edit`, data).subscribe({
      next: (res: any) => {
        this.dialogRef.close(res.data);
      },
      error: (e) => {
      }
    });
  }

  savedLocation(type:any) {
    const dialogClosed = this.dialog.open(SavedLocationComponent, {
      disableClose: true,
      height: "100vh",
      maxHeight: "100vh",
      width: '500px',
      maxWidth: "90vw",
      panelClass: "side-dialog",
      position: { right: "0px", top: "0px" },
      data: type
    });
    dialogClosed.afterClosed().subscribe({
      next: (res: any) => {
        this.isEditLocation = res?.isEdit;
        if (res?._id) {
          this.isSelectFromSave = res;
          const event = {
            coords: {
              lat: res.latitude,
              lng: res.longitude
            }
          }
          this.markerDragEnd(event);
        }
      }
    })

  }

  addAddress() {
    console.log()
    const dialogRef = this.dialog.open(AddAddressComponent,
      {
        width: '500px',
        height: '580px',
        panelClass: 'custom-container-add-address',
        data: this.passAddressData
      }

    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
