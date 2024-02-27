import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-user-header',
  templateUrl: './new-user-header.component.html',
  styleUrls: ['./new-user-header.component.scss']
})
export class NewUserHeaderComponent implements OnInit {

  currentUrl: string = ''

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.currentUrl = this.router.url
  }

  route (path: string) {
    this.router.navigate([path])
    this.currentUrl = path
  }
}
