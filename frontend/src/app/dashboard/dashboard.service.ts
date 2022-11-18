import { environment } from './../../environments/environment.prod';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class DashboardService {
  constructor(public http: HttpClient) {
  }

  private URL: string = environment.baseUrl;

  searchInvoice(params: any): Observable<any> {
    return this.http.get(this.URL + '/billing/search', {params});
  }
  dailyCollectionInvoice(params: any): Observable<any> {
    return this.http.get(this.URL + '/billing/grand-total', {params});
  }
  userList(): Observable<any> {
    return this.http.get(this.URL + '/users');
  }
  totalInvoice(): Observable<any> {
    return this.http.get(this.URL + '/billing/count');
  }
  getBookByClass(params: any): Observable<any> {
    return this.http.get(this.URL + `/book/class/${params}`);
  }
  getLatestInvoice(): Observable<any> {
    return this.http.get(this.URL + '/billing/latest-invoices');
  }
}
