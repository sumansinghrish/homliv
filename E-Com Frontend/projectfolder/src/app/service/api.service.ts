import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment';
import { NavigationEnd, Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private history: string[] = [];
  constructor(private http: HttpClient, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.history.push(this.router.url);
    });
  }

  getPreviousUrl(): string | null {
    this.history.pop();
    return this.history.length > 0 ? this.history[this.history.length - 1] : null;
  }

  baseurl = environment.baseUrl;

  homeEvent$ = new Subject<void>();
  profileEvent = new Subject<void>();

  profileEvent$ = this.profileEvent.asObservable();

  homeEvent = this.homeEvent$.asObservable();

  get(url: any) {
    return this.http.get(`${this.baseurl}/user/${url}`);
  }

  post(url: any, data: any) {
    return this.http.post(`${this.baseurl}/user/${url}`, data);
  }
  put(url: any, data: any) {
    return this.http.put(`${this.baseurl}/user/${url}`, data);
  }
  patch(url: any, data: any) {
    return this.http.patch(`${this.baseurl}/user/${url}`, data);
  }

  delete(url: any, data: any) {
    return this.http.delete(`${this.baseurl}/user/${url}`, data);
  }

  post1(url: any, data: any) {
    return this.http.post(`${this.baseurl}/salesMan/${url}`, data);
  }
  patch1(url: any, data: any) {
    return this.http.patch(`${this.baseurl}/salesMan/${url}`, data);
  }
  get1(url: any) {
    return this.http.get(`${this.baseurl}/salesMan/${url}`);
  }

  put1(url: any, data: any) {
    return this.http.put(`${this.baseurl}/salesMan/${url}`, data);
  }

  delete1(url: any) {
    return this.http.delete(`${this.baseurl}/salesMan/${url}`);
  }
  post2(url: any, data: any) {
    return this.http.post(`${this.baseurl}/user/${url}`, data);
  }
  get2(url: any) {
    return this.http.get(`${this.baseurl}/user/${url}`);
  }
  get3(url: any) {
    return this.http.get(`${this.baseurl}/${url}`);
  }
  getbanner(url: any) {
    return this.http.get(`${this.baseurl}/${url}`);
  }
  isLogin() {
    var token;
    token = localStorage.getItem("Aiwa-user-web");
    if (token) return true;
    else return false;
  }


}


