import { environment } from './../../environments/environment.prod';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class InvoiceService {
  constructor(public http: HttpClient) {
  }

  private URL: string = environment.baseUrl;

  saveInvoice(params: any): Observable<any> {
    const updateObj = JSON.parse(JSON.stringify(params));
    if (params.invoiceId) {
      delete updateObj['invoiceId'];
      return this.http.put(this.URL + `/billing/invoice/${params.invoiceId}`, updateObj);
    } else {
      return this.http.post(this.URL + '/billing/invoice', params);
    }
  }
  searchInvoice(params: any): Observable<any> {
    return this.http.get(this.URL + '/billing/search', {params});
  }
  getBookList(params: any): Observable<any> {
    return this.http.get(this.URL + `/book/class/${params}`);
  }
  getInvoiceDetails(params: any): Observable<any> {
    return this.http.get(this.URL + `/billing/invoice/${params}`);
  }
  serachInvoiceByBillNo(params: any): Observable<any> {
    return this.http.get(this.URL + `/billing/search/${params.billId}`);
  }
  deleteInvoice(params: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: params,
    };
    return this.http.delete(this.URL + '/billing/delete-invoice', options);
  }
  getInvoiceNo(params: any): Observable<any> {
    return this.http.get(this.URL + '/billing/bill-num');
  }
}
