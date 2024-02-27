import {Injectable} from "@angular/core"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {Observable} from "rxjs"
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})

export class AdminReceiptsService {
  fullUrl = environment.apiUrl + '/receipt'
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + sessionStorage.getItem(environment.apiToken),
  })

  constructor(private http: HttpClient) {
  }

  public getAll (params: any): Observable<any> {
    const { page, rows } = params
    return this.http.get(this.fullUrl + '/getAll?' + `page=${page}&limit=${rows}`,  {
      headers: this.headers
    })
  }

  public getAllPartnerTracks (params: any): Observable<any> {
    const { page, rows } = params
    return this.http.get(this.fullUrl + '/partner/getAll?' + `page=${page}&limit=${rows}`,  {
      headers: this.headers
    })
  }

  public createReceipt (data: any): Observable<any> {
    return this.http.post(this.fullUrl + '/create', data, {
      headers: this.headers
    })
  }

  public getOneReceipt (id: string): Observable<any> {
    return this.http.get(this.fullUrl + '/getOne/' + id, {
      headers: this.headers
    })
  }

  public updateReceipt (data: any): Observable<any> {
    return this.http.put(this.fullUrl + '/update', data, {
      headers: this.headers
    })
  }

  public deleteReceipt (id: string): Observable<any> {
    return this.http.post(this.fullUrl + '/delete/' + id, '', {
      headers: this.headers
    })
  }

}
