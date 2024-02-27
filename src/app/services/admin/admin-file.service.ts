import {Injectable} from "@angular/core"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {Observable} from "rxjs"
import {environment} from '../../../environments/environment'
import {FileModel} from "../../models/response/file-model";

@Injectable({
  providedIn: 'root',
})

export class AdminFileService {
  fullUrl = environment.apiUrl + '/file'
  headers = new HttpHeaders({
    'Content-Type': 'multipart/form-data',
    'enctype': 'multipart/form-data',
    'Authorization': 'Bearer ' + sessionStorage.getItem(environment.apiToken),
  })

  constructor(private http: HttpClient) {
  }

  public getAllFiles (params: any): Observable<any> {
    const { page, rows, globalFilter} = params
    return this.http.get(this.fullUrl + '/getAll' + `?page=${page}&limit=${rows}&globalFilter=${globalFilter}`, {
      headers: this.headers
    })
  }

  public uploadFile (data: FormData): Observable<any> {
    return this.http.post(this.fullUrl + '/upload', data)
  }

  public async downloadFile (file: FileModel) {
    const response = await fetch(this.fullUrl + `/download?id=${file._id}`)
    if (response.status === 200) {
      window.open(this.fullUrl + `/download?id=${file._id}`)
      // const blob = await response.blob()
      // const downloadUrl = window.URL.createObjectURL(blob)
      // const link = document.createElement('a')
      // link.href = downloadUrl
      // link.download = file.name
      // document.appendChild(link)
      // link.click()
      // link.remove()
    }
  }

}
