import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl:string;
  constructor() { 
    this.apiUrl =  environment.API_URL;
    console.log(this.apiUrl);
  }
}
