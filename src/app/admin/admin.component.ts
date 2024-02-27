import { Component } from '@angular/core';

@Component({
    selector: 'app-partner',
    template: `
      <app-admin-header></app-admin-header>
      <hr>
      <router-outlet></router-outlet>
    `,
})

export class AdminComponent {

    constructor() {
    }
}
