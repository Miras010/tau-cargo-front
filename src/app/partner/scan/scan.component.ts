import {Component, ElementRef, OnInit, ViewChild} from '@angular/core'
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

export interface TrackInfo {
  trackNumber: string,
  receivedInAlmatyDate: Date
}

@Component({
  selector: 'app-tracks',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss'],
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
  providers: [MessageService,ConfirmationService]
})
export class ScanComponent implements OnInit {

  @ViewChild('inputRef') inputRef: ElementRef | undefined;

  trackNumber: string = ''
  selectedStatus = {
    value: 'Дата получения на складе в Китае',
    key: 'receivedInChinaDate'
  }
  isLoading: boolean = false;

  statuses = [
    { value: 'Дата получения на складе в Китае', key: 'receivedInChinaDate' },
    { value: 'Дата отправления в Алматы', key: 'fromChinaToAlmaty' },
    { value: 'Дата получения на складе в Алматы', key: 'receivedInAlmatyDate' },
    { value: 'Дата получения клиентом', key: 'receivedByClient' },
  ]

  constructor(private adminTrackService: AdminTrackService,
              private messageService: MessageService) { }

  ngOnInit() {
  }

  updateTrack (data: any) {
      this.isLoading = true
      this.adminTrackService.upsertManyTracks(data)
        .toPromise()
        .then(() => {
          this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Трек номера успешно созданы (обновлены)', life: 3000});
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1000)
        })
        .catch((err) => {
          this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось создать (обновить)' + err.error.message, life: 3000});
        }).finally(() => {
        this.isLoading = false
      })
  }

  enter() {
    let data = {}
    // @ts-ignore
    data[this.selectedStatus.key] = Date.now()
    // @ts-ignore
    data['trackNumber'] = this.trackNumber
    this.updateTrack([data])
    this.trackNumber = ''
  }

}
