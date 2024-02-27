import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + sessionStorage.getItem(environment.apiToken),
  });

  public authorized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  fullUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient,
              private router: Router,
              private messageService: MessageService) {
  }

  authorize = (perf: any, inputData: any) => {
    this.authorized.next(true);
    localStorage.setItem('lastPhoneNumber', inputData.phoneNumber);
    localStorage.setItem('lastPassword', inputData.password);

    sessionStorage.setItem(environment.apiToken, perf.token);
    sessionStorage.setItem('userInfo', JSON.stringify(perf.userInfo));
    perf.roles.forEach((role: string) => {
      if (role === 'ADMIN') {
        sessionStorage.setItem(environment.roleName, role);
        sessionStorage.setItem(environment.rolePath, 'admin');
      } else if (role === 'USER') {
        sessionStorage.setItem(environment.roleName, role);
        sessionStorage.setItem(environment.rolePath, 'user');
      } else if (role === 'PARTNER') {
        sessionStorage.setItem(environment.roleName, role);
        sessionStorage.setItem(environment.rolePath, 'partner');
      }
    })
    if (sessionStorage.getItem(environment.rolePath) === 'partner') {
      this.router.navigate(['partner']);
    } else if (sessionStorage.getItem(environment.rolePath) === 'user') {
      this.router.navigate(['user'])
    } else if (sessionStorage.getItem(environment.rolePath) === 'admin') {
      this.router.navigate(['admin'])
    }
  }

  login(data: any): Observable<any> {
    return this.http.post(this.fullUrl + '/login', data);
  }

  loginByPhone(data: any): Observable<any> {
    return this.http.post(this.fullUrl + '/loginByPhone', data);
  }

  // currentUser(token: string): Observable<any> {
  //   return this.http.get<any>(environment.apiUrl + '/partners/api/employee/token', {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + token,
  //     }),
  //   });
  // }

  register(registerRequest: any) {
    return this.http.post(this.fullUrl + '/registration', registerRequest);
  }

  forgotPassword(data: any) {
    return this.http.post(this.fullUrl + '/forgotPassword', data);
  }

  forgotPasswordByPhone(data: any) {
    return this.http.post(this.fullUrl + '/forgotPasswordByPhone', data);
  }

  resetPassword(data: any) {
    return this.http.post(this.fullUrl + '/resetPassword', data);
  }

  confirmRegister(phone: string, code: string) {
    return this.http.put(this.fullUrl + '/register/confirm?phone=' + phone + '&registrationCode=' + code, null);
  }

  isAuthorized() {
    return sessionStorage.getItem(environment.apiToken);
  }

  checkAvailability(): boolean {
    return !!sessionStorage.getItem(environment.apiToken);
  }

  removeToken() {
    sessionStorage.removeItem(environment.apiToken);
  }

  removeRole() {
    sessionStorage.removeItem(environment.roleName);
  }

  removeAll() {
    this.removeRole();
    this.removeToken();
  }

  getToken() {
    return sessionStorage.getItem(environment.apiToken);
  }

  getRole() {
    return sessionStorage.getItem(environment.roleName);
  }

  getRolePath() {
    return sessionStorage.getItem(environment.rolePath);
  }

  public logout() {
    this.authorized.next(false);
    const lastPhoneNumber = localStorage.getItem('lastPhoneNumber')
    const lastPassword =  localStorage.getItem('lastPassword')
    localStorage.clear();
    if (lastPhoneNumber) {
      localStorage.setItem('lastPhoneNumber', lastPhoneNumber)
    }
    if (lastPassword) {
      localStorage.setItem('lastPassword', lastPassword)
    }
    this.router.navigate(['/login']);
  }

  public getLastInputData() {
    const lastPhoneNumber = localStorage.getItem('lastPhoneNumber')
    const lastPassword =  localStorage.getItem('lastPassword')
    if (lastPhoneNumber && lastPassword) {
      return { lastPhoneNumber, lastPassword }
    }
    return null
  }

  // getMyRole() {
  //   if (!this.getMyApi()) {
  //     return null;
  //   }
  //   const base64Url = this.getMyApi().split('.')[1];
  //   const base64 = base64Url.replace('-', '+').replace('_', '/');
  //   return (JSON.parse(window.atob(base64))).role;
  // }

  // getMyUsername() {
  //   if (!this.getMyApi()) {
  //     return null;
  //   }
  //   const base64Url = this.getMyApi().split('.')[1];
  //   const base64 = base64Url.replace('-', '+').replace('_', '/');
  //   return (JSON.parse(window.atob(base64))).sub;
  // }

  getMyApi() {
    return sessionStorage.getItem(environment.apiToken);
  }

}
