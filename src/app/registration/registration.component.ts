import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {environment} from '../../environments/environment'


function validateWhiteSpace(control: FormControl) {
    if (control.value.includes(' ')) {
      return {
          hasWhiteSpace: true
      }
    }
    return null
}


@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss',],
    encapsulation: ViewEncapsulation.None
})
export class RegistrationComponent implements OnInit {

  loginForm: any;
  logoPath = `assets/${environment.logoUrl}`
  submitted = false;
  isLoading: boolean = false

  constructor(private messageService: MessageService,
              private authService: AuthService,
              private router: Router) {
  }


  ngOnInit() {
    this.loginForm = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      mail: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, validateWhiteSpace]),
      // username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  onSubmit() {
    this.submitted = true
    if (this.loginForm.valid) {
      const symbols = ['+', '(', ')', ' ', '-']
      symbols.forEach(symbol => {
        this.loginForm.value.phoneNumber = this.loginForm.value.phoneNumber.replaceAll(symbol, '')
      })
      this.isLoading = true
      this.authService.register(this.loginForm.value).toPromise()
        .then(() => {
          this.messageService.add({
            severity: "success",
            summary: "Успешно",
            detail: "Пользователь успешно зарегистрирован!"
          });
          setTimeout(() => {
            this.router.navigate(['login'])
          }, 1000)
        }).catch((e) => {
        this.messageService.add({
          severity: "info",
          summary: "Ошибка регистрации",
          detail: e.error.message
        })
      }).finally(() => {
        this.isLoading = false
      })
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Не все поля заполнены",
        detail: "Заполните все поля!"
      });
    }
  }

}
