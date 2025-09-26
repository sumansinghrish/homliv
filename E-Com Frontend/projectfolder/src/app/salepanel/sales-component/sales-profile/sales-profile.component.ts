import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sales-profile',
  templateUrl: './sales-profile.component.html',
  styleUrls: ['./sales-profile.component.scss']
})
export class SalesProfileComponent {

  loginData: any;
  submitted: boolean = false;

  profileImg: any;
  constructor(
    private api: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    // private toaster: ToastrService // @Inject(MAT_DIALOG_DATA) public data: any
  ) { }



  ngOnInit() {

    this.getProfile()
  }



  UpdateProfile: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    // lastName: new FormControl('' ,Validators.required),
    email: new FormControl('', Validators.required),
    countryCode: new FormControl(''),
    phoneNumber: new FormControl('', Validators.required),
    profileImg: new FormControl(''),


  });

  get f() {
    return this.UpdateProfile.controls;
  }


  telInputObject(obj: any) {
    obj.setCountry("om");
  }

  url: any = '';
  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.url = event?.target?.result;
      };
    }
  }

  profiledata: any
  getProfile() {
    this.api.get1("auth/getProfile").subscribe({
      next: (res: any) => {
        this.profiledata = res.data
        this.url = this.profiledata.profileImg
        this.profileImage = this.profiledata.profileImg

        this.UpdateProfile.patchValue({
          name: this.profiledata.name,
          phoneNumber: this.profiledata.phoneNumber,
          email: this.profiledata.email,
          countryCode: this.profiledata.countryCode

        })


      }, error: (err: any) => {

      },
    })
  }


  img: any;
  imgChange: boolean = false;
  multiple1: never[] = [];
  uploadProfileImage: any;
  images: any;
  isImageChange = false;

  uploadFile(event: any) {
    this.isImageChange = true;
    this.multiple1 = [];
    this.uploadProfileImage = event.target.files[0];

    this.uploadImage(this.uploadProfileImage);

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
  uploadImage(img: any) {

    let data = new FormData();
    data.append('upload_salesman_file', img);
    this.api.post1('auth/uploadFile', data).subscribe((res: any) => {
      this.profileImage = res.data;

    });
  }



  onSubmit(): void {
    this.submitted = true;

    if (this.UpdateProfile.invalid) {
      return
    }
    let data = {
      ...this.UpdateProfile.value,
      profileImg: this.profileImage
    }

    this.api.patch1('auth/updateProfile', data).subscribe({
      next: (res: any) => {
        this.loginData = res.data;
      },
      error: (err: any) => {
      },
    });
  }


}
