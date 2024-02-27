import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, LazyLoadEvent} from 'primeng/api';
import { MessageService } from 'primeng/api';
import { User } from '../../models/user'
import {Table} from "primeng/table";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AdminUsersService} from "../../services/admin/admin-users.service";


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
  providers: [MessageService,ConfirmationService]
})
export class UsersComponent implements OnInit {
  productDialog: any;
  changePasswordDialog: boolean = false
  editingType: string = ''
  users: User[] = []
  loading: boolean = false
  totalRecords: number = 0

  userForm: FormGroup = new FormGroup({
    _id: new FormControl(''),
    username: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    mail: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    roles: new FormControl(null),
    isActive: new FormControl('false')
  })

  changePasswordForm: FormGroup = new FormGroup({
    _id: new FormControl(''),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  })

  roles = [
    { text: 'Пользователь', value: 'USER'},
    { text: 'Партнер', value: 'PARTNER'},
    { text: 'Администратор', value: 'ADMIN'},
  ]

  defaultParams = {
    page: 1,
    rows: 10,
    globalFilter: null
  }

  selectedUsers: User[] = [];

  @ViewChild('dt') dt: Table | undefined;

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private adminUsersService: AdminUsersService) { }

  ngOnInit() {
    this.getAllUsers(this.defaultParams)
  }

  loadData(event: LazyLoadEvent) {
    this.loading = false;
    let page = 1
    const { rows, first, globalFilter} = event
    // @ts-ignore
    if (first > 0) {
      // @ts-ignore
      page = (first / rows) + 1
    }
    this.getAllUsers({rows, page, globalFilter})
  }

  getAllUsers (params: any) {
    this.adminUsersService.getAllUsers(params).toPromise()
      .then(resp => {
        this.users = resp.resp
        this.totalRecords = resp.totalCount
      }).catch(err => {
        console.log('err', err)
     })
  }

  filterGlobal (dt: any, $event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  openNew() {
    this.editingType = 'new'
    this.productDialog = true;
  }

  deleteSelected() {
    this.confirmationService.confirm({
      message: 'Вы уверены что хотите удалить выбранные треки?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let promises: Promise<any>[] = []
        this.selectedUsers.forEach((user) => {
          promises.push(this.adminUsersService.deleteUser(user._id).toPromise())
        })
        Promise.all(promises)
          .then(() => {
          this.getAllUsers(this.defaultParams)
          this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Треки удалены', life: 3000});
        })
          .catch(err => {
            this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось удалить трек номер' + err.error.message, life: 3000});
          })
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
        this.getAllUsers(this.defaultParams)
      }
    });
  }

  edit(user: User) {
    this.editingType = 'edit'
    this.userForm.setValue({
      _id: user._id,
      username: user.username,
      surname: user.surname,
      name: user.name,
      phoneNumber: user.phoneNumber,
      mail: user.mail,
      password: user.password,
      roles: user.roles,
      isActive: user.isActive
    })
    this.productDialog = true;
  }

  openChangePassword(user: User) {
    this.changePasswordForm.patchValue({
      _id: user._id
    })
    console.log('user._id', user._id)
    this.changePasswordDialog = true;
  }

  deleteProduct(user: User) {
    this.confirmationService.confirm({
      message: 'Вы уверены что хотите удалить ' + user.username + '?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.adminUsersService.deleteUser(user._id).toPromise()
          .then(() => {
            this.getAllUsers(this.defaultParams)
            this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Пользователь успешно удален', life: 3000});
          })
          .catch(err => {
            this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось удалить трек номер. ' + err.error.message, life: 3000});
          })
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
  }

  hidePasswordDialog() {
    this.changePasswordDialog = false;
  }

  onSubmit() {
    if (this.userForm.valid) {
      const symbols = ['+', '(', ')', ' ', '-']
      symbols.forEach(symbol => {
        this.userForm.value.phoneNumber = this.userForm.value.phoneNumber.replaceAll(symbol, '')
      })
      if (this.editingType === 'new') {
        this.adminUsersService.createUser(this.userForm.value).toPromise()
          .then(() => {
            this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Пользователь успешно создан', life: 3000});
            this.productDialog = false
            this.getAllUsers(this.defaultParams)
          })
          .catch((err) => {
            this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось создать пользователя' + err.error.message, life: 3000});
            console.log(err)
          })
      } else if (this.editingType === 'edit') {
        this.adminUsersService.updateUser(this.userForm.value).toPromise()
          .then(() => {
            this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Пользователь успешно обновлен', life: 3000});
            this.productDialog = false
            this.getAllUsers(this.defaultParams)
          })
          .catch((err) => {
            this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось обновить' + err, life: 3000});
            console.log(err)
          })
      }
    }
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      const values = this.changePasswordForm.getRawValue()
      if (values.password === values.confirmPassword) {
        this.adminUsersService.changePassword({ _id: values._id, password: values.password }).toPromise()
          .then(() => {
            this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Пользователь успешно обновлен', life: 3000});
            this.changePasswordDialog = false
            this.getAllUsers(this.defaultParams)
          })
          .catch((err) => {
            this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось обновить' + err, life: 3000});
            console.log(err)
          })
      } else {
        this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Пароли не совпадают', life: 3000});
      }
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i]._id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 5; i++ ) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}
