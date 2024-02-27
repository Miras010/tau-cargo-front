import { Component } from '@angular/core';
import {environment} from '../../../environments/environment'

@Component({
  selector: 'app-partner-header',
  templateUrl: './partner-header.component.html',
  styleUrls: ['./partner-header.component.scss']
})

export class PartnerHeaderComponent {
  logoPath = `assets/${environment.logoUrl}`
}
