import { Observable } from 'rxjs';
import { User } from './../classes/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

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
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('LOGGED_IN_USER')));
    this.user = this.userSubject.asObservable();
  }

  storeLoginDetails(user) {
    localStorage.setItem('LOGGED_IN_USER', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.mail
    }));
  }

  getLoggedInUser(): Observable<any> {
    return JSON.parse(localStorage.getItem('LOGGED_IN_USER'));
  }

  login(email): Observable<any> {
    const url = this.apiUrl + '/users?mail=' + email;
    return this.http.get(url);
  }

  logout(){
    localStorage.removeItem('LOGGED_IN_USER');
    console.log('logged out');
    this.router.navigate(['signin']);
  }

  register(user: User): Observable<any> {
    const url = this.apiUrl + '/users';
    return this.http.post(url, user);
  }
}
