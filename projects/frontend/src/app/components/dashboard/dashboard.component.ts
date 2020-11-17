import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from './../../services/task.service';
import { Task } from './../../classes/task';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'projects/frontend/src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private taskService: TaskService,
    private formBuilder: FormBuilder
    ) {
    this.apiUrl = environment.API_URL;
    if (this.authService.getLoggedInUser() == null) {
      this.router.navigate(['signin']);
    }
  }

  tasks;
  currentUser;
  addform: FormGroup;
  updateform: FormGroup;
  loading = false;
  updating = false;
  adding = false;
  task: Task;
  etask: Task;

  ngOnInit(): void {
    this.getUser();
    this.addform = this.formBuilder.group({
      task: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
    this.updateform = this.formBuilder.group({
      task: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  get af() { return this.addform.controls; }
  get uf() { return this.updateform.controls; }

  getUser() {
    this.currentUser = this.authService.getLoggedInUser();
    this.listTasks();
  }
  viewTask(id) {
    this.taskService.getTask(id).subscribe(
      data => {
        this.task = data;
        document.querySelector('#viewform').innerHTML =
        `<table>
            <tr>
                <th>Description: </th>
                <td>${ this.task.task }</td>
            </tr>
            <tr>
                <th>Priority: </th>
                <td>${ this.task.priority }</td>
            </tr>
            <tr>
                <th>Status: </th>
                <td>${ this.task.status }</td>
            </tr>
        </table>`;
    });
  }

  isSelectedPriority(p){
    if (this.task.priority === p){
      // console.log(p);
      return 'selected';
    } else {
      return '';
    }
  }

  isSelectedStatus(s){
    if (this.task.status === s){
      // console.log(s);
      return 'selected';
    } else {
      return '';
    }
  }

  updateTask() {
    this.loading = true;

    var edited_task = new Task(this.task.id, this.uf.task.value, this.currentUser.id, this.uf.priority.value, this.uf.status.value);

    if (this.updateform.invalid) {
      return;
    }

    this.updating = true;

    console.log('calling api');
    this.taskService.updateTask(this.task.id , edited_task).subscribe(
      data => {
        console.log('updated', data);
        this.listTasks();
        this.loading = false;
        this.updating = false;
      }, error => {
        console.log(error);
      }
    );
  }

  editTask(id) {
    this.taskService.getTask(id).subscribe(
      data => {
        this.etask = data;
      });
  }

  deleteTask(id) {
    this.taskService.deleteTask(id).subscribe(
      data => {
        console.log('deleted', data);
        this.listTasks();
      }, error => {
        console.log(error);
      }
    );
  }

  addTask() {

    this.loading = true;

    const generateUserId = Math.floor(100 + Math.random() * 900);
    var new_task = new Task(generateUserId, this.af.task.value, this.currentUser.id, this.af.priority.value, this.af.status.value);

    if (this.addform.invalid){
      return;
    }

    this.adding = true;

    this.taskService.addTask(new_task).subscribe(
      data => {
        console.log('success', data);
        // this.listTasks();
        this.ngOnInit();
        this.adding = false;
        this.loading = false;
      }, error => {
        console.log(error);
      }
    );
  }

  listTasks() {
    const url = this.apiUrl + '/tasks?createdBy=' + this.currentUser.id;
    this.http.get(url).subscribe(res => {
      this.tasks = res;
    });
  }

}
