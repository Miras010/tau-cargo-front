import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  fullUrl = environment.apiUrl + '/user';
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + sessionStorage.getItem(environment.apiToken),
  });

  constructor(private http: HttpClient) {
  }

  public getUserData (): Observable<any> {
    return this.http.get(this.fullUrl + '/getInfoByUser', {
      headers: this.headers
    })
  }

  public updateByUser (data: any): Observable<any> {
    return this.http.put(this.fullUrl + '/updateByUser', data, {
      headers: this.headers
    })
  }

  public changePasswordByUser (data: any): Observable<any> {
    return this.http.post(this.fullUrl + '/changePasswordByUser', data, {
      headers: this.headers
    })
  }
}
