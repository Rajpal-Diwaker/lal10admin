import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { app_strings } from '../_constants/app_strings';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private userService: UserService,
              private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(evt => {
        if (evt instanceof HttpResponse) {
          this.userService.hideLoder();
          if (evt.status === 201) {
            this.userService.success(evt.body.message);
          }
          if (evt.body.code === '402') {
            this.userService.error(evt.body.message);
          }
        }
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          this.userService.hideLoder();
          try {
            this.userService.hideLoder();
            if (err.error.type === 'error') {
              if (!navigator.onLine) {
                this.userService.error(app_strings.NO_INTERNET_CONNECTION);
                return;
              }
              this.userService.error(app_strings.ERROR_OCCURRED);
            }
          } catch (e) {
            this.userService.error(app_strings.ERROR_OCCURRED);
          }
        }
        return of(err);
      }));
  }
}
