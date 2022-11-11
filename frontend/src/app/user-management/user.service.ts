import { environment } from './../../environments/environment.prod';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UserService {
  constructor(public http: HttpClient) {
  }

  private URL: string = environment.baseUrl;

  register(params: any): Observable<any> {
    return this.http.post(this.URL + '/auth/register', params);
  }
  getUserList(): Observable<any> {
    return this.http.get(this.URL + '/users');
  }
  deleteUser(params: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: params,
    };
    return this.http.delete(this.URL + '/users', options);
  }
  updateUser(params: any): Observable<any> {
    return this.http.put(this.URL + '/users', params);
  }
  getUserDetails(params: any): Observable<any> {
    return this.http.get(this.URL + '/users/' + params);
  }
}
