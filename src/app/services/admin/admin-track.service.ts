import {Injectable} from "@angular/core"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {Observable} from "rxjs"
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})

export class AdminTrackService {
  fullUrl = environment.apiUrl + '/track'
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + sessionStorage.getItem(environment.apiToken),
  })

  constructor(private http: HttpClient) {
  }

  public getAllTracks (params: any): Observable<any> {
    const { page, rows, globalFilter, filterBy, from, to } = params
    return this.http.get(this.fullUrl + '/getAll?' + `page=${page}&limit=${rows}&globalFilter=${globalFilter}&filterBy=${filterBy}&from=${from}&to=${to}`,  {
      headers: this.headers
    })
  }

  public getAllPartnerTracks (params: any): Observable<any> {
    const { page, rows, globalFilter, filterBy, from, to } = params
    return this.http.get(this.fullUrl + '/partner/getAll?' + `page=${page}&limit=${rows}&globalFilter=${globalFilter}&filterBy=${filterBy}&from=${from}&to=${to}`,  {
      headers: this.headers
    })
  }

  public createTrack (data: any): Observable<any> {
    return this.http.post(this.fullUrl + '/create', data, {
      headers: this.headers
    })
  }

  public getTrackinfo (trackNumber: any): Observable<any> {
    return this.http.get(this.fullUrl + '/getOwner/' + trackNumber, {
      headers: this.headers
    })
  }

  public upsertManyTracks (data: any): Observable<any> {
    return this.http.post(this.fullUrl + '/upsertMany', data, {
      headers: this.headers
    })
  }

  public uploadFile (data: any): Observable<any> {
    return this.http.post(this.fullUrl + '/upsertMany', data, {
      headers: this.headers
    })
  }

  public getOneTrack (trackId: string): Observable<any> {
    return this.http.get(this.fullUrl + '/getOne/' + trackId, {
      headers: this.headers
    })
  }

  public updateTrack (data: any): Observable<any> {
    return this.http.put(this.fullUrl + '/update', data, {
      headers: this.headers
    })
  }

  public deleteTrack (trackId: string): Observable<any> {
    return this.http.post(this.fullUrl + '/delete/' + trackId, '', {
      headers: this.headers
    })
  }

}
