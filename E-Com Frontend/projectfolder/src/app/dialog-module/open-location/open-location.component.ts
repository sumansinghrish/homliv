import { MapsAPILoader } from '@agm/core';
import { Component, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-open-location',
  templateUrl: './open-location.component.html',
  styleUrls: ['./open-location.component.scss']
})
export class OpenLocationComponent {

  lat!: number;
  lng!: number;
  address!: string;
  patchAddress!: string;
  geoCoder: any = null;
  constructor(
    private dialogRef: MatDialogRef<OpenLocationComponent>,
    public dialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      // const autocomplete1 = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      // autocomplete1.addListener('place_changed', () => {
      //   this.ngZone.run(() => {
      //     const place: any = autocomplete1.getPlace();
      //     if (place.geometry) {
      //       this.lat = place.geometry.location.lat();
      //       this.lng = place.geometry.location.lng();
      //       this.patchAddress = place.formatted_address || '';
      //       this.getAddress(this.lat, this.lng);
      //     } else {
      //       console.log('No geometry information available');
      //     }
      //   });
      // });
    });
    // this.getAddress(this.lat, this.lng);
    // this.userData = JSON.parse(localUserData);

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
                this.address = results[0].formatted_address;
                resolve(this.address);
                // }
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
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.getAddress(this.lat, this.lng);
      });
    }
  }

  markerDragEnd($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng)
      .then((res: any) => { })
      .catch((err: any) => {
        alert('Please Enable location');
      });
  }

  close() {
    this.dialogRef.close({ address: this.patchAddress, lat: this.lat, lng: this.lng });
  }
}
