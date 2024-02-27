import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { UserComponent } from './user.component';
import {TracksComponent} from "./tracks/tracks.component";
import {HomeComponent} from "./home/home.component";
import {ReceiptsComponent} from "./receipts/receipts.component";
import {ProfileComponent} from "./profile/profile.component";

const routes: Routes = [
  {
  path: '',
  component: UserComponent,
  children: [
    {
      path: 'home',
      component: HomeComponent
    },
    {
      path: 'track',
      component: TracksComponent
    },
    {
      path: 'receipts',
      component: ReceiptsComponent
    },
    {
      path: 'profile',
      component: ProfileComponent
    },
    {
      path: '',
      redirectTo: 'track',
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
export class UserRoutingModule {
}
