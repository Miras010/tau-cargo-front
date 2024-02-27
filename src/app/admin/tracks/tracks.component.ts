import {Component, OnInit, ViewChild} from '@angular/core'
import {ConfirmationService, LazyLoadEvent} from 'primeng/api'
import { MessageService } from 'primeng/api'
import { Track } from '../../models/response/track-models'
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
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss'],
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
  providers: [MessageService,ConfirmationService]
})
export class TracksComponent implements OnInit {
  totalRecords: number = 0;
  totalFiles: number = 0;
  loading: boolean = false
  productDialog: any
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
  selectedStatus: any;
  statuses = [
    { value: 'Дата получения на складе в Китае', key: 'receivedInChinaDate' },
    { value: 'Дата отправления в Алматы', key: 'fromChinaToAlmaty' },
    { value: 'Дата получения на складе в Алматы', key: 'receivedInAlmatyDate' },
    { value: 'Дата отправления из Алматы в другой город', key: 'shippedFromAlmatyDate' },
    { value: 'Дата получения клиентом', key: 'receivedByClient' },
  ]

  addManyForm: FormGroup = new FormGroup({
    status: new FormControl('', Validators.required),
    date: new FormControl(''),
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

  downloadFile (file: FileModel) {
    this.adminFileService.downloadFile(file)
  }

  getFormattedDate (date: any) {
    return getFormattedDate(date).split(' ')[0]
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

  hideDialog() {
    this.productDialog = false;
  }

  hideManyDialog () {
    this.addManyDialog = false
  }

  async onManySubmit () {
    if (this.addManyForm.valid) {
      this.loading = true
      if (this.arraylist.length > 0) {
        // @ts-ignore
        const userId = JSON.parse(sessionStorage.getItem('userInfo'))._id
        const newArr = this.arraylist.map(item => {
          let itemValue = ''
          if (item['条码']) {
            itemValue = item['条码']
          } else if (item['内容']) {
            itemValue = item['内容']
          } else if (item['单号']) {
            itemValue = item['单号']
          }
          let newItem = {
            trackNumber: '',
            fileName: ''
          }
          // @ts-ignore
          newItem[this.addManyForm.value.status.key] = this.addManyForm.value.date
          // @ts-ignore
          newItem.fileName = this.file?.name
          newItem.trackNumber = itemValue
          return newItem
        })
        let promises = []
        if (newArr.length > 300) {
          let index = Math.ceil(newArr.length / 300)
          for (let i = 1; i <= index; i++) {
            console.log(newArr.slice((i - 1) * 300, i * 300))
            promises.push(this.adminTrackService.upsertManyTracks(newArr.slice((i - 1) * 300, i * 300)).toPromise())
          }
        } else {
          promises.push(this.adminTrackService.upsertManyTracks(newArr).toPromise())
        }
        let successUpload = false
        await Promise.all(promises)
          .then((resp) => {
            this.addManyDialog = false
            successUpload = true
            this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Трек номера успешно созданы (обновлены)', life: 3000});
            console.log(resp)
          })
          .catch((err) => {
            this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось создать (обновить)' + err.error.message, life: 3000});
          }).finally(() => {
            this.loading = true
          })
        if (successUpload) {
          console.log('upload')
          const formData = new FormData()
          // @ts-ignore
          formData.append('file', this.file)
          // @ts-ignore
          formData.append('name', this.file.name)
          formData.append('date', this.addManyForm.value.date)
          formData.append('statusKey', this.addManyForm.value.status.key)
          formData.append('statusValue', this.addManyForm.value.status.value)
          this.adminFileService.uploadFile(formData).toPromise()
            .then(() => {
              console.log('success')
            }).catch(err => {
            console.log('err', err)
          }).finally(() => {
            this.getAllFiles(this.defaultFilesParams)
          })
        }
        // this.adminTrackService.upsertManyTracks(newArr)
        //   .toPromise()
        //   .then((resp) => {
        //     this.addManyDialog = false
        //     this.getAllTracks(this.defaultParams)
        //     this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Трек номера успешно созданы (обновлены)', life: 3000});
        //     console.log(resp)
        //   })
        //   .catch((err) => {
        //     this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось создать (обновить)' + err.error.message, life: 3000});
        //   })
      } else {
        this.messageService.add({severity:'info', summary: 'Error', detail: 'Не удалось получить данные с файла', life: 3000})
      }
    }
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
