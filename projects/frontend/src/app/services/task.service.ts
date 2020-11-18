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
    const url = this.apiUrl + '/tasks/' + id;
    return this.http.delete(url);
  }

  addTask(task: Task): Observable<any> {
    const url = this.apiUrl + '/tasks';
    return this.http.post(url, task);
  }

  getAllTasks(): Observable<any> {
    const url = this.apiUrl + '/tasks?createdBy=' + this.currentUser.id;
    return this.http.get(url);
  }

  updateTask(id, task: Task): Observable<any> {
    const url = this.apiUrl + '/tasks/' + id;
    console.log('api loading!');
    return this.http.put(url, task);
  }

  getTask(id): Observable<any> {
    const url = this.apiUrl + '/tasks/' + id;
    return this.http.get(url);
  }
}
