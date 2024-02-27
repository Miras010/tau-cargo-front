import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ButtonModule} from "primeng/button";
import {HttpClientModule} from "@angular/common/http";
import {SidebarModule} from "primeng/sidebar";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CardModule} from "primeng/card";
import {LoginComponent} from "./login/login.component";
import {ReactiveFormsModule} from "@angular/forms";
import {PanelModule} from "primeng/panel";
import {InputTextModule} from "primeng/inputtext";
import {RegistrationComponent} from "./registration/registration.component";
import {MessageService} from "primeng/api";
import {LogoutComponent} from "./logout/logout.component";
import {UserGuard} from "./guards/user.guard";
import {ToastModule} from "primeng/toast";
import {InputMaskModule} from "primeng/inputmask";
import {DynamicDialogModule} from "primeng/dynamicdialog";
import {DialogComponent} from "./user/dialog/dialog.component";
import {DialogModule} from "primeng/dialog";
import {AdminGuard} from "./guards/admin.guard";
import {PartnerGuard} from "./guards/partner.guard";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    LogoutComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent
  ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        AppRoutingModule,
        ButtonModule,
        HttpClientModule,
        SidebarModule,
        BrowserAnimationsModule,
        CardModule,
        ReactiveFormsModule,
        PanelModule,
        InputTextModule,
        ToastModule,
        InputMaskModule,
        DynamicDialogModule,
        DialogModule
    ],
  providers: [
    MessageService,
    UserGuard,
    PartnerGuard,
    AdminGuard,
  ],
  exports: [
  ],
  bootstrap: [
    AppComponent,
    LoginComponent,
    RegistrationComponent
  ],
  entryComponents: [
    DialogComponent
  ],
})
export class AppModule { }
