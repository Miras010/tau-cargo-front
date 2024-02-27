import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import {UserComponent} from "./user.component";
import { TracksComponent } from './tracks/tracks.component';
import {CardModule} from "primeng/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserHeaderComponent} from "../ui-components/user-header/user-header.component";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {AccordionModule} from "primeng/accordion";
import {ButtonModule} from "primeng/button";
import {DialogComponent} from "./dialog/dialog.component";
import {ToastModule} from "primeng/toast";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {RippleModule} from "primeng/ripple";
import {ConfirmationService} from "primeng/api";
import {CardComponent} from "./cardInfo/card.component";
import {HomeComponent} from "./home/home.component";
import {ReceiptsComponent} from "./receipts/receipts.component";
import {ProfileComponent} from "./profile/profile.component";
import {InputMaskModule} from "primeng/inputmask";
import {NewUserHeaderComponent} from "../ui-components/new-user-header/new-user-header.component";

@NgModule({
  imports: [
    UserRoutingModule,
    CardModule,
    FormsModule,
    ProgressSpinnerModule,
    NgIf,
    AccordionModule,
    NgForOf,
    ButtonModule,
    ToastModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ConfirmDialogModule,
    DialogModule,
    RippleModule,
    NgStyle,
    InputMaskModule
  ],
    exports: [
        NewUserHeaderComponent
    ],
  declarations: [
    UserComponent,
    TracksComponent,
    HomeComponent,
    UserHeaderComponent,
    NewUserHeaderComponent,
    DialogComponent,
    CardComponent,
    ReceiptsComponent,
    ProfileComponent
  ],
  providers: [ConfirmationService],
})

export class UserModule {
}
