import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {environment} from '../../environments/environment'

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {

  loginForm: any;
  logoPath = `assets/${environment.logoUrl}`
  submitted = false;
  isLoading: boolean = false
  token = ''

  constructor(private authService: AuthService,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private router: Router
              ) {
  }
  ngOnInit() {
    this.route.params.subscribe((param) => {
      if (param['token']) {
        this.token = param['token']
      }
    })

    this.loginForm = new FormGroup({
      phoneNumber: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    this.submitted = true
    if (this.loginForm.valid) {
      this.isLoading = true
      const symbols = ['+', '(', ')', ' ', '-']
      symbols.forEach(symbol => {
        this.loginForm.value.phoneNumber = this.loginForm.value.phoneNumber.replaceAll(symbol, '')
      })
      const data = {
        phoneNumber: this.loginForm.value.phoneNumber,
      }
      this.authService.forgotPasswordByPhone(this.loginForm.value)
        .toPromise()
        .then(res => {
            this.messageService.add({
              severity: "success",
              summary: "Успешно",
              detail: "На Вашу почту придет ссылка для изменений пароля!"
            });
            setTimeout(() => {
              this.router.navigate(['login'])
            }, 3000)
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
