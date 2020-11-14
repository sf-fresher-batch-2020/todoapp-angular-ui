import { User } from './../classes/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  users: any;

  private apiUrl: string;
  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.apiUrl = environment.API_URL;
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(email, password) {
    const url = this.apiUrl + '/users';
    this.http.get(url).subscribe(res => {
      this.users = res;
      for (const obj of this.users) {
        if (obj.mail === email){
          console.log('email found');
          if (obj.password === password) {
            // this.storeLoginDetails(obj);
            console.log('success');
            return obj;
          } else {
            console.log('failed');
            return null;
          }
        } else {
          console.log('email does not matched!');
          return null;
        }
      }
    });
  }

  // logout() {
  //   // remove user from local storage
  //   localStorage.removeItem('user');
  //   this.userSubject.next(null);
  //   this.router.navigate(['/']);
  // }
}
