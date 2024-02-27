import {Component, OnInit, ViewChild} from '@angular/core'
import {ConfirmationService, LazyLoadEvent} from 'primeng/api'
import { MessageService } from 'primeng/api'
import { Track } from '../../models/response/track-models'
import {AdminTrackService} from "../../services/admin/admin-track.service"
import {Table} from "primeng/table"
import {FormControl, FormGroup, Validators} from "@angular/forms"
import * as XLSX from 'xlsx'
import { startOfMonth, endOfMonth } from 'date-fns'
import {AdminReceiptsService} from "../../services/admin/admin-receipts.service";
import {AdminUsersService} from "../../services/admin/admin-users.service";

@Component({
  selector: 'app-tracks',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss'],
  styles: [`
    :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
    }
  `],
  providers: [MessageService,ConfirmationService]
})
export class ReceiptsComponent implements OnInit {
  totalRecords: number = 0;
  loading: boolean = false
  productDialog: any
  addManyDialog: any
  editingType: string = ''
  receipts: any = []
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
  defaultParams = {
    page: 1,
    rows: 10,
    globalFilter: null
  }

  receiptForm: FormGroup = new FormGroup({
    receiver: new FormControl('', Validators.required),
    weight: new FormControl('', Validators.required),
    totalSum: new FormControl(''),
    totalNumber: new FormControl(''),
    createdBy: new FormControl(''),
  })

  selectedTracks: Track[] = []
  receivers: any[] = []

  @ViewChild('dt') dt: Table | undefined

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private adminReceiptsService: AdminReceiptsService,
              private adminUsersService: AdminUsersService) { }

  ngOnInit() {
    // this.getAllTracks(this.defaultParams)
  }

  enterFilter() {
    const params = {
      page: 1,
      rows: 10
    }
    this.getAll(params)
  }

  loadCustomers(event: LazyLoadEvent) {
    this.loading = false;
    console.log('event', event)
    let page = 1
    const { rows, first, globalFilter} = event
    // @ts-ignore
    if (first > 0) {
      // @ts-ignore
      page = (first / rows) + 1
    }
    this.getAll({rows, page, globalFilter})
  }

  getAll (params: any) {
    this.loading = true
    this.adminReceiptsService.getAll(params).toPromise()
      .then(resp => {
        this.receipts = resp.resp
        this.totalRecords = resp.totalCount
      }).catch(err => {
      console.log('err', err)
    }).finally(() => {
      this.loading = false
    })
  }

  filterGlobal (dt: any, $event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  openNew() {
    this.editingType = 'new'
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Вы уверены что хотите удалить выбранные треки?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let promises: Promise<any>[] = []
        this.selectedTracks.forEach((item) => {
          promises.push(this.adminReceiptsService.deleteReceipt(item._id).toPromise())
        })
        Promise.all(promises)
          .then(() => {
            this.getAll(this.defaultParams)
            this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Треки удалены', life: 3000});
          })
          .catch(err => {
            this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось удалить трек номер' + err.error.message, life: 3000});
          })
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
        this.getAll(this.defaultParams)
      }
    });
  }

  editProduct(receipt: any) {
    console.log(receipt)
    this.editingType = 'edit'
    this.receiptForm =  new FormGroup({
      _id: new FormControl(receipt._id),
      receiver: new FormControl(receipt.receiver, Validators.required),
      weight: new FormControl(receipt.weight, Validators.required),
      totalSum: new FormControl(receipt.totalSum, Validators.required),
      totalNumber: new FormControl(receipt.totalNumber, Validators.required),
    })
    console.log(this.receiptForm)
    this.productDialog = true;
  }

  deleteProduct(track: Track) {
    this.confirmationService.confirm({
      message: 'Вы уверены что хотите удалить ' + track.trackNumber + '?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.adminReceiptsService.deleteReceipt(track._id).toPromise()
          .then(() => {
            this.getAll(this.defaultParams)
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

  onSubmit() {
    if (this.receiptForm.valid && this.receiptForm.value.receiver._id) {
      this.receiptForm.patchValue({
        receiver: this.receiptForm.value.receiver._id
      })
      if (this.editingType === 'new') {
        this.adminReceiptsService.createReceipt(this.receiptForm.value).toPromise()
          .then(() => {
            this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Трек номер успешно создан', life: 3000});
            this.productDialog = false
            this.getAll(this.defaultParams)
          })
          .catch((err) => {
            this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось создать трек номер' + err.error.message, life: 3000});
            console.log(err)
          })
      } else if (this.editingType === 'edit') {
        this.adminReceiptsService.updateReceipt(this.receiptForm.value).toPromise()
          .then(() => {
            this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Трек номер успешно обновлен', life: 3000});
            this.productDialog = false
            this.getAll(this.defaultParams)
          })
          .catch((err) => {
            this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось обновить трек номер' + err, life: 3000});
            console.log(err)
          })
      }

    }
    console.log('t', this.receiptForm.value)
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.receipts.length; i++) {
      if (this.receipts[i]._id === id) {
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

  onLazyLoad(event: any) {
    console.log(event)
    if (event.query) {
      this.adminUsersService.loadUsers({globalFilter: event.query}).toPromise()
        .then(resp => {
          this.receivers = resp
          console.log('resp', resp)
        }).catch(err => {
        this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось найти пользователей' + err, life: 3000});
      })
    }

  }
}
