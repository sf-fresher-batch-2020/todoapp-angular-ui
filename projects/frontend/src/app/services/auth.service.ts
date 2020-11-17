import { Observable } from 'rxjs';
import { User } from './../classes/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string;
  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.apiUrl = environment.API_URL;
    // console.log(this.apiUrl);
  }

  register(user: User): Observable<any> {
    const url = this.apiUrl + '/users';
    return this.http.post(url, user);
  }
}
