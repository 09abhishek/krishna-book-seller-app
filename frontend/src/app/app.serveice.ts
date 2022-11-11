import { environment } from './../environments/environment';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppService {
  constructor(public http: HttpClient) {
  }

  private URL: string = environment.baseUrl;

  doLogin(params: any): Observable<any> {
    return this.http.post(this.URL + '/auth/login', params);
  }
  doLogout(params: any): Observable<any> {
    return this.http.post(this.URL + '/auth/logout', params);
  }
  getUserDetails(params: any): Observable<any> {
    return this.http.get(this.URL + '/users/' + params);
  }
}
