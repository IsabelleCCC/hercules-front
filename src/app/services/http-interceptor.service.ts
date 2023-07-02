import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token')

    if(token){
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    }

    return next.handle(req).pipe(catchError(error => this.errorHandler(error, req, next)))
  }

  private errorHandler(response: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
    if (response.status == 401) {
      this.router.navigateByUrl('/login')
    }else if (response.status == 403) {
      this.router.navigateByUrl('/login')
    }

    return throwError(() => response)
  }
}
