import { Component, OnInit } from '@angular/core'
import {ConfirmationService, MessageService} from 'primeng/api'
import {TrackService} from "../../services/track.service"
import {UsersTrack } from '../../models/response/track-models'
// @ts-ignore
import {getFormattedDate} from '../../functionServices/dataService'
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {DialogComponent} from "../dialog/dialog.component";
import {Track} from '../../models/response/track-models'
import {CardComponent} from "../cardInfo/card.component";

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss'],
  providers: [MessageService, DialogService]
})
export class TracksComponent implements OnInit {
  totalTracks: number = 0
  data: Array<UsersTrack> = []
  isLoading: boolean = false
  // @ts-ignore
  userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  // @ts-ignore
  ref: DynamicDialogRef;

  constructor(private messageService: MessageService,
              private trackService: TrackService,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService) { }

  ngOnInit() {
    this.getTracks()
  }

  async getTracks () {
    this.isLoading = true
    this.trackService.getAllUsersTrack().subscribe(async (resp: any) => {
        this.data = resp.filter((item: any) => {
          return !!item.track;
        }).sort((a: UsersTrack, b: UsersTrack) => {
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        })
      this.totalTracks = this.data.length
      },
      (error: any) => {
      console.log('error', error)
    },
      () => {
      this.isLoading = false
    })
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
          this.getTracks()
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

  getBackground (item: any) {
    if (item.track.receivedByClient) {
      return {'background': '#f280ff'}
    } else if (item.track.receivedInAlmatyDate) {
      return {'background': '#82ff9e'}
    } else if (item.track.fromChinaToAlmaty) {
      return {'background': '#7ea8ff'}
    } else if (item.track.receivedInChinaDate) {
      return {'background': '#fffc80'}
    }
    return {'background': '#c2c2c2'}
  }

  getTypeText(item: any) {
    if (item.track.receivedByClient) {
      const date = getFormattedDate(item.track.receivedInAlmatyDate).split(' ')[0]
      return 'получено клиентом' + ' - ' + date
    } else if (item.track.receivedInAlmatyDate) {
      const date = getFormattedDate(item.track.receivedInAlmatyDate).split(' ')[0]
      return 'в Алматы' + ' - ' + date
    } else if (item.track.fromChinaToAlmaty) {
      const date =  getFormattedDate(item.track.fromChinaToAlmaty).split(' ')[0]
      return 'отправлено из Китая' + ' - ' + date
    } else if (item.track.receivedInChinaDate) {
      const date = getFormattedDate(item.track.receivedInChinaDate).split(' ')[0]
      return 'на складе в Китае' + ' - ' + date
    }
    return 'добавлено'
  }

  cardClick(item: any) {
    this.ref = this.dialogService.open(CardComponent, {
      header: 'Детальная информация',
      width: '90%',
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      baseZIndex: 10000,
      data: {item}
    });

    this.ref.onClose.subscribe(() =>{
      this.getTracks()
    });
  }

  showConfirm() {
    this.messageService.clear();
    this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'Вы действительно хотите удалить трек номер?'});
  }

  openDialog () {
    this.ref = this.dialogService.open(DialogComponent, {
      header: 'Добавление трек номера',
      width: '90%',
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((data) =>{
      if (data) {
        this.isLoading = true
        this.trackService.addUsersTrack(data).subscribe(() => {
          this.messageService.add({
            severity: "success",
            summary: "Успешно",
            detail: "Трек номер успешно добавлен!"
          });
          this.getTracks()
        }, (err) => {
          this.messageService.add({
            severity: "info",
            summary: "Ошибка",
            detail: err.error.message
          });
          console.log('err', err)
          this.isLoading = false
        })
      }
    });
  }

}





