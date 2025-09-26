// import { Component } from '@angular/core';
import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SavedLocationComponent } from '../saved-location/saved-location.component';
import { MapsAPILoader } from '@agm/core';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { AddAddressComponent } from '../add-address/add-address.component';

@Component({
  selector: 'app-select-userlocation',
  templateUrl: './select-userlocation.component.html',
  styleUrls: ['./select-userlocation.component.scss']
})
export class SelectUserlocationComponent {

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
  district:any;
  private geoCoder!: google.maps.Geocoder;
  @ViewChild('search', { static: true }) searchElementRef!: ElementRef;
  constructor(
    private dialogRef: MatDialogRef<SelectUserlocationComponent>,
    public dialog: MatDialog,
    private api: ApiService,
    private toastr: ToastrService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    if(this.data?.item){
      this.longitude=this.data.item?.longitude;
      this.latitude=this.data.item?.latitude;
      this.editlocation=this.data.item?._id;
    }
  }
  ngOnInit(): void {
    var localUserData: any = localStorage.getItem('customerData');
    if(localUserData==null){
      localUserData=localStorage.getItem('Aiwa-user-web')
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
    this.userData = JSON.parse(localUserData);
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


  setCurrentLocation() {
    this.isSelectFromSave = this.isEditLocation ? this.isSelectFromSave : null;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 15;
        if(this.data?.item?.longitude){
          const event = {
            coords: {
              lat: this.latitude,
              lng: this.longitude
            }
          }

          this.getAddress(this.latitude, this.longitude);
          this.markerDragEnd(event)
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
    debugger
    const data = {
      // "_id":this.editlocation,
      "address": this.address,
      "district": this.district,
      "locality": this.locality,
      "postalCode": this.postal,
      "city": this.city,
      "buildingNumber": 1,
      "secondryNumber": 2,
      "latitude": this.lat,
      "longitude": this.lng
    }
    console.log("location data is",data);
    if(this.editlocation==''||this.editlocation==undefined){
      this.api.post2(`address/add`, data).subscribe({
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
      const data = {
        "_id":this.editlocation,
        "address": this.address,
        "district": this.district,
        "locality": this.locality,
        "postalCode": this.postal,
        "city": this.city,
        "buildingNumber": 1,
        "secondryNumber": 2,
        "latitude": this.lat,
        "longitude": this.lng
      }
      this.api.put(`address/edit`, data).subscribe({
        next: (res: any) => {
          this.toastr.success('Location Updated Sucessfully');
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
        debugger
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
