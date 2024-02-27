import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import {AdminComponent} from "./admin.component";
import {CardModule} from "primeng/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {NgForOf, NgIf} from "@angular/common";
import {AccordionModule} from "primeng/accordion";
import {ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {AdminHeaderComponent} from "../ui-components/admin-header/admin-header.component";
import {TracksComponent} from "./tracks/tracks.component";
import {ToolbarModule} from "primeng/toolbar";
import {FileUploadModule} from "primeng/fileupload";
import {TableModule} from "primeng/table";
import {RatingModule} from "primeng/rating";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputNumberModule} from "primeng/inputnumber";
import {RippleModule} from "primeng/ripple";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {CalendarModule} from "primeng/calendar";
import {UsersComponent} from "./users/users.component";
import {CascadeSelectModule} from "primeng/cascadeselect";
import {InputMaskModule} from "primeng/inputmask";
import {CheckboxModule} from "primeng/checkbox";
import {MultiSelectModule} from "primeng/multiselect";
import {ReceiptsComponent} from "./receipts/receipts.component";
import {SkeletonModule} from "primeng/skeleton";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ScanComponent} from "./scan/scan.component";
import {TrackListComponent} from "./trackList/track-list.component";

@NgModule({
  imports: [
    AdminRoutingModule,
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
    ToolbarModule,
    FileUploadModule,
    TableModule,
    RatingModule,
    DialogModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    RippleModule,
    ConfirmDialogModule,
    CalendarModule,
    CascadeSelectModule,
    InputMaskModule,
    CheckboxModule,
    MultiSelectModule,
    SkeletonModule,
    AutoCompleteModule,
  ],
  exports: [
  ],
  declarations: [
    AdminComponent,
    TracksComponent,
    TrackListComponent,
    ReceiptsComponent,
    AdminHeaderComponent,
    UsersComponent,
    ScanComponent
  ],
})

export class AdminModule {
}
