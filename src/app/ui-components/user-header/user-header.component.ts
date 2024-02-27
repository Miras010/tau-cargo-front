import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment'

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit {
  logoPath = `assets/${environment.logoUrl}`
  // @ts-ignore
  userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

  ngOnInit() {
    console.log('userInfo', this.userInfo.username)
  }
}
