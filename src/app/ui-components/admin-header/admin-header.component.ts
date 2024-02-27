import { Component } from '@angular/core';
import {environment} from '../../../environments/environment'

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent {
  logoPath = `assets/${environment.logoUrl}`
}
