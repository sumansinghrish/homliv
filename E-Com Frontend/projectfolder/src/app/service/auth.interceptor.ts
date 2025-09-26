import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toaster: ToastrService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
      const regExp = new RegExp(/assets/g, 'i');
      if (request.headers.get('IsInterceptorAllowed') == 'false') {
        const newHeaders = request.headers.delete('IsInterceptorAllowed');
        const newRequest = request.clone({ headers: newHeaders });
        return next.handle(newRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            if (
              error.error &&
              (error.error?.message == 'No token Provided' ||
                error.error?.message == 'Access token missing' ||
                error.status === 401 || error.error?.message == 'Your account has been blocked by admin')
            ) {
              if (error?.error?.message === "Your account has been blocked by admin") {
                this.toaster.error("Your account has been blocked by the administrator. Please contact your administrator.");
              }
              localStorage.removeItem('Aiwa-user-web');
              this.router.navigate(['/home']);
            }
            return throwError(error);
          })
        );
      }

      let url = request.url;
      let currentUserToken = "";
      try {
        const localData = localStorage.getItem('Aiwa-user-web') || "";
        if (localData) {
          currentUserToken = JSON.parse(localData).accessToken;
        }
      } catch (error) {
        localStorage.removeItem('Aiwa-user-web');
      }

      request = request.clone({
        headers: request.headers.set('accesstoken', currentUserToken),
        url: url,
      });

      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (
            error.error &&
            (error.error?.message == 'No token Provided' ||
              error.error?.message == 'Invalid Access Token' ||
              error.status === 401 || error.error?.message == 'Your account has been blocked by admin')
          ) {
            if (error?.error?.message === "Your account has been blocked by admin") {
              this.toaster.error("Your account has been blocked by the administrator. Please contact your administrator.");

            }
            localStorage.removeItem('Aiwa-user-web');
            this.router.navigate(['/']);
           
          }
          return throwError(error);
        })
      );
    } catch (error) {
    }
    return next.handle(request);
  }
}
