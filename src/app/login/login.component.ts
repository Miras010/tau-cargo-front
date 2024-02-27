import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {Router} from "@angular/router";
import {environment} from '../../environments/environment'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  loginForm: any;
  logoPath = `assets/${environment.logoUrl}`
  submitted = false;
  isLoading: boolean = false
  lastInputData: any

  constructor(private authService: AuthService,
              private messageService: MessageService,
              private router: Router
              ) {
  }
  ngOnInit() {
    this.authService.logout()
    this.loginForm = new FormGroup({
      phoneNumber: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    this.getLastInputData()
  }

  getLastInputData() {
    const lastInputData = this.authService.getLastInputData()
    if (lastInputData) {
      this.lastInputData = lastInputData
      this.loginForm.patchValue({
        phoneNumber: lastInputData.lastPhoneNumber,
        password: lastInputData.lastPassword,
      })
    }
  }

  onSubmit() {
    this.submitted = true
    if (this.loginForm.valid) {
      this.isLoading = true
      const symbols = ['+', '(', ')', ' ', '-']
      symbols.forEach(symbol => {
        this.loginForm.value.phoneNumber = this.loginForm.value.phoneNumber.replaceAll(symbol, '')
      })
      this.authService.loginByPhone(this.loginForm.value)
        .toPromise()
        .then(res => {
          this.authService.authorize(res, {phoneNumber: this.loginForm.value.phoneNumber, password: this.loginForm.value.password})
        }).catch((err) => {
        console.log(err);
        this.messageService.add({severity:'error', summary: 'Ошибка', detail: err.error.message, life: 3000});
      }).finally(() => {
        this.isLoading = false
      })
    } else {
      this.messageService.add({severity:'info', summary:'Info Message', detail:'Не все поля заполнены!'})
    }
  }


}
