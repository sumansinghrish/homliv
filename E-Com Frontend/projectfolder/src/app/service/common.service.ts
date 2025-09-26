import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private registerButtonHideShow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private updateCartValue: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
    this.registerButtonHideShow.next(sessionStorage.getItem('isLogin') == 'true' ? true : false);
  }
  // Set the value
  setRegisterButtonHideShow(value: any): void {
    this.registerButtonHideShow.next(value);
  }

  // Get the current value
  // getData(): any {
  //   return this.dataSubject.getValue();
  // }

  // Get the observable to subscribe to
  getRegisterButtonHideShow() {
    return this.registerButtonHideShow.asObservable();
  }

  setUpdateCartValue(value: boolean): void {
    this.updateCartValue.next(value);
  }

  getUpdateCartValue() {
    return this.updateCartValue.asObservable();
  }
}
