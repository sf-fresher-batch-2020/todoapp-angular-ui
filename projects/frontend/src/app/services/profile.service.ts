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
    const url = this.apiUrl + '/profiles';
    let profile = { userId: user.id, company: '', gitname: ''  };
    return this.http.post(url, profile);
  }

  getProfile(id): Observable<any> {
    const url = this.apiUrl + '/profiles?userId=' + id;
    console.log(url);
    return this.http.get(url);
  }

  updateProfile(id, profile): Observable<any> {
    const url = this.apiUrl + '/profiles/' + id;
    return this.http.put(url, profile);
  }
}
