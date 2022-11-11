import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  protected userTokenDetail: any = {};

  constructor(private router: Router, private messageService: MessageService) {
    console.log('intercept');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.userTokenDetail = localStorage.getItem('token') ? localStorage.getItem('token') : false;
    if (this.userTokenDetail) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.userTokenDetail}`
        }
      });
    }
    return next.handle(req).pipe(
      map((responsedata: any) => {
        if (responsedata instanceof HttpResponse) {
          const response = responsedata.body;
          if (response && response.message && response.message !== '' && req.method !== 'GET') {
            this.showNotificationSuccess('Success', response.message);
          }
        }
        return responsedata;
      }),
      catchError(response => {
        switch (response.status) {
          case 401:
            this.handleUnauthorized(response);
            break;
          case 502:
            this.handleServerError502();
            break;
          case 403:
            this.handleForbidden();
            break;

          case 404:
            this.handleNotFound(response);
            break;

          case 500:
            this.handleServerError();
            break;
          case 409:
            this.handleErrorMessages(response.error.meta);
            break;
          case 0:
            this.handleServerError502();
            break;
          default:
            break;
        }
        return throwError(response);
      })
    );
  }

  public handleServerError502() {
  }


  /**
   * Shows notification errors when server response status is 401 and redirects user to login page
   *
   * @ param responseBody
   */
  private handleUnauthorized(responseBody: any): void {
    this.showNotificationError('', 'unauthorized');
    this.router.navigate(['/login']);
    localStorage.clear();
  }

  /**
   * Shows notification errors when server response status is 403
   */
  private handleForbidden(): void {
    this.messageService.add({severity:'error', summary: 'Error', detail: 'ServerError403'});
    this.router.navigate(['/login']);
  }

  /**
   * Shows notification errors when server response status is 404
   *
   * @ param responseBody
   */
  private handleNotFound(responseBody: any): void {
    const message = 'Page Not Found',
      title = '404';

    this.showNotificationError(title, message);
  }

  /**
   * Shows notification errors when server response status is 500
   */
  private handleServerError(): void {
    const message = 'Internal Server Error',
      title = '500';

    this.showNotificationError(title, message);
  }

  /**
   * Parses server response and shows notification errors with translated messages
   *
   * @ param response
   */
  private handleErrorMessages(response: any): void {
    if (!response) {
      return;
    }
    this.showNotificationError('Error', response.message);
  }


  /**
   * Shows error notification with given title and message
   *
   * @ param title
   * @ param message
   */
  private showNotificationError(title: string, message: string): void {
    this.messageService.add({severity:'error', summary: 'Error', detail: message});
  }

  /**
   * Shows success notification with given title and message
   *
   * @ param title
   * @ param message
   */
  private showNotificationSuccess(title: string, message: string): void {
    this.messageService.add({severity:'success', summary: 'Success', detail: message});
  }
}
