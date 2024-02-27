import { Component } from '@angular/core';

@Component({
    selector: 'app-partner',
    template: `
      <app-partner-header></app-partner-header>
      <router-outlet></router-outlet>
    `,
})

export class PartnerComponent {

    constructor() {
    }
}
