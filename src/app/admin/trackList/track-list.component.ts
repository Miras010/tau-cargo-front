import {Component, OnInit, ViewChild} from '@angular/core'
import {ConfirmationService, LazyLoadEvent} from 'primeng/api'
import { MessageService } from 'primeng/api'
import {Track, UsersTrack} from '../../models/response/track-models'
import {AdminTrackService} from "../../services/admin/admin-track.service"
import {Table} from "primeng/table"
import {FormControl, FormGroup, Validators} from "@angular/forms"
import * as XLSX from 'xlsx'
import { startOfMonth, endOfMonth } from 'date-fns'
// @ts-ignore
import { getFormattedDate } from '../../functionServices/dataService';
import {AdminFileService} from "../../services/admin/admin-file.service";
import {FileModel} from "../../models/response/file-model";

@Component({
  selector: 'app-tracks',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss'],
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
  providers: [MessageService,ConfirmationService]
})
export class TrackListComponent implements OnInit {
  totalRecords: number = 0;
  totalFiles: number = 0;
  loading: boolean = false
  productDialog: any
  ownerDialog: any
  ownerInfo: Array<UsersTrack> | undefined
  addManyDialog: any
  editingType: string = ''
  tracks: Track[] = []
  file: File | undefined
  arrayBuffer: any
  title = 'xlsreader'
  fileList: any
  uploadedFiles: any[] = []
  arraylist = []
  filterBy: any
  rangeDates = [
    startOfMonth(new Date()),
    endOfMonth(new Date())
  ]
  files: FileModel[] = []
  defaultParams = {
    page: 1,
    rows: 10,
    globalFilter: null
  }
  defaultFilesParams = {
    page: 1,
    rows: 10,
    globalFilter: null
  }

  trackForm: FormGroup = new FormGroup({
    trackNumber: new FormControl('', Validators.required),
    fromChinaToAlmaty: new FormControl(''),
    receivedInAlmatyDate: new FormControl(''),
    receivedInChinaDate: new FormControl(''),
    receivedByClient: new FormControl(''),
  })

  selectedTracks: Track[] = []

  @ViewChild('dt') dt: Table | undefined
  @ViewChild('FileTable') FileTable: Table | undefined

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private adminFileService: AdminFileService,
              private adminTrackService: AdminTrackService) { }

  ngOnInit() {
    this.getAllFiles(this.defaultFilesParams)
    // this.getAllTracks(this.defaultParams)
  }

  getAllFiles (params: any) {
    this.adminFileService.getAllFiles(params).toPromise()
      .then((resp) => {
        this.files = resp.resp
        this.totalFiles = resp.totalCount
      }).catch(err => {
      console.log('err', err)
    }).finally(() => {
      this.loading = false
    })
  }

  getAllTracks (params: any) {
    this.loading = true
    this.adminTrackService.getAllTracks(params).toPromise()
      .then(resp => {
        this.tracks = resp.resp
        this.totalRecords = resp.totalCount
      }).catch(err => {
      console.log('err', err)
    }).finally(() => {
      this.loading = false
    })
  }

  downloadFile (file: FileModel) {
    this.adminFileService.downloadFile(file)
  }

  getFormattedDate (date: any) {
    return getFormattedDate(date).split(' ')[0]
  }

  enterFilter() {
    console.log('this.filterBy',this.filterBy)
    const params = {
      page: 1,
      rows: 10,
      globalFilter: null,
      filterBy: this.filterBy.key,
      from: this.rangeDates[0].getTime(),
      to: this.rangeDates[1].getTime(),
    }
    this.getAllTracks(params)
  }

  loadTracks(event: LazyLoadEvent) {
    this.loading = false;
    console.log('event', event)
    let page = 1
    const { rows, first, globalFilter} = event
    // @ts-ignore
    if (first > 0) {
      // @ts-ignore
      page = (first / rows) + 1
    }
    this.getAllTracks({rows, page, globalFilter})
  }

  loadFiles(event: LazyLoadEvent) {
    this.loading = false;
    let page = 1
    const { rows, first, globalFilter} = event
    // @ts-ignore
    if (first > 0) {
      // @ts-ignore
      page = (first / rows) + 1
    }
    this.getAllFiles({rows, page, globalFilter})
  }

  filterGlobal (dt: any, $event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  filterFiles (dt: any, $event: any, stringVal: any) {
    this.FileTable!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  openNew() {
    this.editingType = 'new'
    this.productDialog = true;
  }

  openMany () {
    this.addManyDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Вы уверены что хотите удалить выбранные треки?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let promises: Promise<any>[] = []
        this.selectedTracks.forEach((item) => {
          promises.push(this.adminTrackService.deleteTrack(item._id).toPromise())
        })
        Promise.all(promises)
          .then(() => {
            this.getAllTracks(this.defaultParams)
          this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Треки удалены', life: 3000});
        })
          .catch(err => {
            this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось удалить трек номер' + err.error.message, life: 3000});
          })
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
        this.getAllTracks(this.defaultParams)
      }
    });
  }

  editProduct(track: Track) {
    console.log(track)
    this.editingType = 'edit'
    this.trackForm =  new FormGroup({
      _id: new FormControl(track._id),
      trackNumber: new FormControl(track.trackNumber, Validators.required),
      receivedInChinaDate: new FormControl(track.receivedInChinaDate ? new Date(track.receivedInChinaDate) : ''),
      receivedInAlmatyDate: new FormControl(track.receivedInAlmatyDate ? new Date(track.receivedInAlmatyDate) : ''),
      fromChinaToAlmaty: new FormControl(track.fromChinaToAlmaty ? new Date(track.fromChinaToAlmaty) : ''),
      receivedByClient: new FormControl(track.receivedByClient ? new Date(track.receivedByClient) : ''),
    })
    console.log(this.trackForm)
    this.productDialog = true;
  }

  getInfo(track: Track) {
    console.log(track)
    this.adminTrackService.getTrackinfo(track.trackNumber).toPromise().then(resp => {
      console.log(resp)
      this.ownerInfo = resp
    }).catch(err => {
      console.log(err)
    })
    this.ownerDialog = true
  }

  deleteProduct(track: Track) {
    this.confirmationService.confirm({
      message: 'Вы уверены что хотите удалить ' + track.trackNumber + '?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.adminTrackService.deleteTrack(track._id).toPromise()
          .then(() => {
            this.getAllTracks(this.defaultParams)
            this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Трек успешно удален', life: 3000});
          })
          .catch(err => {
            this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось удалить трек номер' + err.error.message, life: 3000});
          })
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
  }

  hideManyDialog () {
    this.addManyDialog = false
  }

  onSubmit() {
    console.log('onsubm2it')

    if (this.trackForm.valid) {
      console.log('onsubmit')
      if (this.editingType === 'new') {
        this.adminTrackService.createTrack(this.trackForm.value).toPromise()
          .then(() => {
            this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Трек номер успешно создан', life: 3000});
            this.productDialog = false
            this.getAllTracks(this.defaultParams)
          })
          .catch((err) => {
            this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось создать трек номер' + err.error.message, life: 3000});
            console.log(err)
          })
      } else if (this.editingType === 'edit') {
        this.adminTrackService.updateTrack(this.trackForm.value).toPromise()
          .then(() => {
            this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Трек номер успешно обновлен', life: 3000});
            this.productDialog = false
            this.getAllTracks(this.defaultParams)
          })
          .catch((err) => {
            this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось обновить трек номер' + err, life: 3000});
            console.log(err)
          })
      }

    }
    console.log('t', this.trackForm.value)
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i]._id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 5; i++ ) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  onUpload(event: { files: any; }) {
    for(let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

  addfile(event: Event)
  {
    // @ts-ignore
    this.file= event.target.files[0];
    let fileReader = new FileReader();
    // @ts-ignore
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      let data = new Uint8Array(this.arrayBuffer);
      let arr = [];
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      let bstr = arr.join("");
      let workbook = XLSX.read(bstr, {type:"binary", cellDates: true, dateNF: 'yyyy/mm/dd;@'});
      let first_sheet_name = workbook.SheetNames[0];
      let worksheet = workbook.Sheets[first_sheet_name];
       // @ts-ignore
      this.arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true})
      console.log('XLSX', this.arraylist);

      this.fileList = [];

    }
  }

}
