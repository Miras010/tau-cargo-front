import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
    selector: 'app-logout',
    template: `<h1>Logout</h1>`
})
export class LogoutComponent implements OnInit, OnDestroy {


  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.logout()
  }

  ngOnDestroy() {
    window.location.reload()
  }

}
