import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  fullUrl = environment.apiUrl + '/track';
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + sessionStorage.getItem(environment.apiToken),
  });

  constructor(private http: HttpClient) {
  }

  public addUsersTrack (data: any): Observable<any> {
    return this.http.post(this.fullUrl + '/user/follow', data, {
      headers: this.headers
    })
  }

  public getAllUsersTrack (): Observable<any> {
    return this.http.get(this.fullUrl + '/user/getall', {
      headers: this.headers
    })
  }

  public unfollowTrack (id: string): Observable<any> {
    return this.http.post(this.fullUrl + '/user/delete/' + id, '', {
      headers: this.headers
    })
  }
}
