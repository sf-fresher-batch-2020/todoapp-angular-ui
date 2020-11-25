import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Task } from './../classes/task';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl: string;
  currentUser;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.apiUrl = environment.API_URL;
    this.currentUser = this.authService.getLoggedInUser();
  }

  deleteTask(id): Observable<any> {
    console.log(id);
    const url = this.apiUrl + '/tasks/delete';
    return this.http.post(url, id);
  }

  addTask(task: Task): Observable<any> {
    console.log(task);
    const url = this.apiUrl + '/tasks';
    return this.http.post(url, task);
  }

  getAllTasks(userId): Observable<any> {
    const url = this.apiUrl + '/tasks/' + userId;
    return this.http.post(url, userId);
  }

  updateTask(task): Observable<any> {
    // console.log(task);
    const url = this.apiUrl + '/tasks/update';
    console.log('api loading!');
    return this.http.post(url, task);
  }
}
