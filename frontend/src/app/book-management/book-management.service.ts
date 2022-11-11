import { environment } from './../../environments/environment.prod';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class BookManagementService {
  constructor(public http: HttpClient) {
  }

  private URL: string = environment.baseUrl;

  getbookstoreList(params: any): Observable<any> {
    return this.http.get(this.URL + '/book/class/' + params);
  }
  deleteBook(params: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: params,
    };
    return this.http.delete(this.URL + '/book', options);
  }
  deletePublication(params: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: params,
    };
    return this.http.delete(this.URL + '/publication', options);
  }
  getPublicationList(): Observable<any> {
    return this.http.get(this.URL + '/publication');
  }
  updateBookDetails(params: any): Observable<any> {
    return this.http.put(this.URL + '/book',  params);
  }
  updatePublicationDetails(params: any): Observable<any> {
    return this.http.put(this.URL + '/publication',  params);
  }
}
