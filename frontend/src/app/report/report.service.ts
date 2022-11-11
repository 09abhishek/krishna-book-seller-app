import { environment } from './../../environments/environment.prod';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ReportService {
  constructor(public http: HttpClient) {
  }

  private URL: string = environment.baseUrl;

  getcollectionReport(params: any): Observable<any> {
    return this.http.get(this.URL + '/billing/search', {params});
  }

  getGrandcollectionReport(params: any): Observable<any> {
    return this.http.get(this.URL + '/billing/grand-total', {params});
  }
  getbookstoreList(params: any): Observable<any> {
    return this.http.get(this.URL + '/book/class/' + params);
  }
  getPublicationReportList(): Observable<any> {
    return this.http.get(this.URL + '/publication');
  }
  getBookReportList(): Observable<any> {
    return this.http.get(this.URL + '/book');
  }
}
