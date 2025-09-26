import { Component } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';
@Component({
  selector: 'app-offer-banner',
  templateUrl: './offer-banner.component.html',
  styleUrls: ['./offer-banner.component.scss']
})
export class OfferBannerComponent {
  bannerdata:any
  bannerimage:any;
  userData:any;
  channelId:any;
  showdata:boolean=false;

  constructor(private api: ApiService, private toaster: ToastrService,private router: Router){
    const localUserData: any = localStorage.getItem('Aiwa-user-web');
    this.userData = JSON.parse(localUserData);
    this.channelId=this.userData.channelId;
    console.log("user data is",this.userData)
  }
  ngOnInit(){
    this.api.getbanner(`common/banners/2/${this.channelId}`).subscribe({
      next:(res:any) =>{
        this.showdata=true;
        this.bannerdata=res.data;
        this.bannerimage=this.bannerdata[0].image;
        // console.log("Banner data is",this.bannerimage)
      },
      error :(err:any) =>{
        this.router.navigateByUrl("/home");
        location.reload()
        // this.bannerimage='assets/image/pop_up_offer.png'
        // this.toaster.error(err.error.message);
      }
    })
  }
  reloadPage() {
    window.location.reload();
}
}
