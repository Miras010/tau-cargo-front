import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {environment} from '../../environments/environment'

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

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
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    this.submitted = true
    if (this.loginForm.valid) {
      this.isLoading = true
      const data = {
        token: this.token,
        password: this.loginForm.value.password
      }
      this.authService.resetPassword(data)
        .toPromise()
        .then(res => {
            this.messageService.add({
              severity: "success",
              summary: "Успешно",
              detail: "Пароль успешно изменен!"
            });
            setTimeout(() => {
              this.router.navigate(['login'])
            }, 1000)
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
