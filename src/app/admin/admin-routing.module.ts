import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AdminComponent } from './admin.component';
import {TracksComponent} from "./tracks/tracks.component";
import {UsersComponent} from "./users/users.component";
import {ReceiptsComponent} from "./receipts/receipts.component";
import {ScanComponent} from "./scan/scan.component";
import {TrackListComponent} from "./trackList/track-list.component";

const routes: Routes = [
  {
  path: '',
  component: AdminComponent,
  children: [
    {
      path: 'tracks',
      component: TracksComponent
    },
    {
      path: 'track-list',
      component: TrackListComponent
    },
    {
      path: 'receipts',
      component: ReceiptsComponent
    },
    {
      path: 'scan',
      component: ScanComponent
    },
    {
      path: 'users',
      component: UsersComponent
    },
    {
      path: '',
      redirectTo: 'tracks',
      pathMatch: 'full'
    },
    {
      path: '**',
      redirectTo: 'track',
      pathMatch: 'full',
    },
  ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
}
