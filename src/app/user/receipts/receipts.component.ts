import { Component, OnInit } from '@angular/core'
// @ts-ignore
import {getFormattedDate} from '../../functionServices/dataService'
import {ReceiptService} from "../../services/receipt.service";

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss'],
})
export class ReceiptsComponent implements OnInit {

  data: any = []
  isLoading: boolean = false

  constructor(private receiptService: ReceiptService) { }

  ngOnInit() {
    this.getReceipts()
  }

  async getReceipts () {
    this.isLoading = true
    this.receiptService.getAllUsersReceipt().subscribe(async (resp: any) => {
        // @ts-ignore
        this.data = resp.map(item => {
          item.createdDate = getFormattedDate(item.createdDate).split(' ')[0]
          return item
        })
      },
      (error: any) => {
      console.log('error', error)
    },
      () => {
      this.isLoading = false
    })
  }

}





