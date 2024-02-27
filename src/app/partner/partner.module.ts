import { NgModule } from '@angular/core';

import { PartnerRoutingModule } from './partner-routing.module';
import {PartnerComponent} from "./partner.component";
import {TracksComponent} from './tracks/tracks.component';
import {CardModule} from "primeng/card";
import {TableModule} from "primeng/table";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToolbarModule} from "primeng/toolbar";
import {ToastModule} from "primeng/toast";
import {FileUploadModule} from "primeng/fileupload";
import {RatingModule} from "primeng/rating";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {UserModule} from "../user/user.module";
import {PartnerHeaderComponent} from "../ui-components/partner-header/partner-header.component";
import {CalendarModule} from "primeng/calendar";
import {ReceiptsComponent} from "./receipts/receipts.component";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ScanComponent} from "./scan/scan.component";

@NgModule({
  imports: [
    PartnerRoutingModule,
    CardModule,
    TableModule,
    ConfirmDialogModule,
    ToolbarModule,
    ToastModule,
    FileUploadModule,
    RatingModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    RadioButtonModule,
    InputNumberModule,
    InputTextareaModule,
    InputTextModule,
    RippleModule,
    UserModule,
    ReactiveFormsModule,
    CalendarModule,
    AutoCompleteModule,
  ],
  exports: [
  ],
  declarations: [
    PartnerComponent,
    TracksComponent,
    PartnerHeaderComponent,
    ReceiptsComponent,
    ScanComponent
  ]
})

export class PartnerModule {
}
