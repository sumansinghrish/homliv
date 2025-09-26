import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-all-category',
  templateUrl: './all-category.component.html',
  styleUrls: ['./all-category.component.scss']
})
export class AllCategoryComponent {
  channelID!: string
  categoryList: category[] = [];
  customerAcess:boolean=false
  constructor(
    private api: ApiService,
    private router: Router
  ) {
    const localData = localStorage.getItem(`customerData`);
    if (localData) {
      this.channelID = JSON.parse(localData).channelId;
    }
    // console.log("channel is",localData)
    if(localData==undefined || localData==null){
      this.customerAcess=true;
      const storedData = localStorage.getItem("Aiwa-user-web");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // console.log("channel is....",parsedData)
        this.channelID = parsedData.channelId;
      }
      else{
        this.channelID="Baqala";
      }
      
    }

    this.getCategoryList();
  }

  getCategoryList() {
    const data = {
      channelId: this.channelID,
    };
    this.api.post1('auth/categoryList', data).subscribe({
      next: (res: any) => {
        this.categoryList = res.data;
      },
      error: (err: any) => {
      },
    });
  }

  reDirect(_id: any) {
    this.router.navigateByUrl('/product-lists', { state: { cat: _id } })
  }

}

interface category {
  _id: string,
  nameAr: string,
  nameEn: string,
  nameHi: string,
  nameUr: string,
  catImg: string,
  channelId: string,
  createdAt: number,
}