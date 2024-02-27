import {Component, Input} from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from "primeng/api";
import {TrackService} from "../../services/track.service";
// @ts-ignore
import { getFormattedDate } from '../../functionServices/dataService';

@Component({
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.scss']
})
export class CardComponent {

  trackForm: any;
  item: any;

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private trackService: TrackService
              ) {
    this.item = config.data.item
  }

  ngOnInit() {
  }

  onSubmit () {

  }

  selectProduct() {
    this.ref.close('CLOSE');
  }

  getFormattedDate (date: Date) {
    return getFormattedDate(date).split(' ')[0]
  }

  deleteTrack (item: any) {
    this.confirmationService.confirm({
      message: 'Вы уверены что хотите удалить ' + item.track.trackNumber + '?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.trackService.unfollowTrack(item._id).toPromise().then(() => {
          this.messageService.add({
            severity: "success",
            summary: "Успешно",
            detail: "Трек номер успешно удален!"
          });
          this.ref.close()
        }).catch((err) => {
          this.messageService.add({
            severity: "info",
            summary: "Ошибка",
            detail: err.error.message
          });
          console.log('err', err)
        })
      }
    });
  }
}
