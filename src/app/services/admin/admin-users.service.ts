import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})

export class AdminUsersService {
  fullUrl = environment.apiUrl + '/user';
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + sessionStorage.getItem(environment.apiToken),
  });

  constructor(private http: HttpClient) {
  }

  public getAllUsers (params: any): Observable<any> {
    const { page, rows, globalFilter } = params
    return this.http.get(this.fullUrl + '/getAll?' + `page=${page}&limit=${rows}&globalFilter=${globalFilter}`,  {
      headers: this.headers
    })
  }

  public loadUsers (params: any): Observable<any> {
    const { globalFilter } = params
    return this.http.get(this.fullUrl + '/loadUsers?' + `globalFilter=${globalFilter}`,  {
      headers: this.headers
    })
  }

  public createUser (data: any): Observable<any> {
    return this.http.post(this.fullUrl + '/create', data, {
      headers: this.headers
    })
  }

  public getOneUser (trackId: string): Observable<any> {
    return this.http.get(this.fullUrl + '/getOne/' + trackId, {
      headers: this.headers
    })
  }

  public updateUser (data: any): Observable<any> {
    return this.http.put(this.fullUrl + '/update', data, {
      headers: this.headers
    })
  }

  public changePassword (data: any): Observable<any> {
    return this.http.put(this.fullUrl + '/changePassword', data, {
      headers: this.headers
    })
  }

  public deleteUser (trackId: string): Observable<any> {
    return this.http.post(this.fullUrl + '/delete/' + trackId, '', {
      headers: this.headers
    })
  }

}
