import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl: string;
  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = environment.API_URL;
  }

  createProfile(user): Observable<any> {
    // console.log(user);
    const url = this.apiUrl + '/profiles';
    const profile = { userId: user.id, company: 'edit to add' };
    return this.http.post(url, profile);
  }

  getProfile(id): Observable<any> {
    const url = this.apiUrl + '/profiles/myProfile';
    console.log(url);
    return this.http.post(url, id);
  }

  updateProfile(profile): Observable<any> {
    const url = this.apiUrl + '/profiles/update';
    return this.http.post(url, profile);
  }
}
