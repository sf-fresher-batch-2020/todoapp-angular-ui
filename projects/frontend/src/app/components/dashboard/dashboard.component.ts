import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from './../../services/task.service';
import { Task } from './../../classes/task';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private toast: ToastrService
    ) {}

  tasks;
  currentUser;
  addForm: FormGroup;
  updateForm: FormGroup;
  loading = false;
  updating = false;
  adding = false;
  task;
  eTask;

  ngOnInit(): void {
    this.getUser();
    this.addForm = this.formBuilder.group({
      task: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
    this.updateForm = this.formBuilder.group({
      task: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  get af() { return this.addForm.controls; }
  get uf() { return this.updateForm.controls; }

  getUser() {
    this.currentUser = this.authService.getLoggedInUser();
    this.listTasks();
  }

  viewTask(id) {
    this.taskService.getTask(id).subscribe(
      data => {
        this.task = data;
    });
  }

  isSelectedPriority(p){
    if (this.eTask.priority === p){
      // console.log(p);
      return 'selected';
    } else {
      return '';
    }
  }
  isSelectedStatus(s){
    if (this.eTask.status === s){
      // console.log(s);
      return 'selected';
    } else {
      return '';
    }
  }

  updateTask() {
    this.loading = true;

    const editedTask = new Task(this.uf.task.value, this.currentUser.id, this.uf.priority.value, this.uf.status.value);

    if (this.updateForm.invalid) {
      return;
    }

    this.updating = true;

    console.log('calling api');
    this.taskService.updateTask(this.eTask.id , editedTask).subscribe(
      data => {
        console.log('updated', data);
        this.listTasks();
        this.toast.success('added edited!');
      }, error => {
        // console.log(error);
        this.toast.error(error);
      }
    );
  }

  editTask(id) {
    this.taskService.getTask(id).subscribe(
      data => {
        this.eTask = data;
      });
  }

  deleteTask(id) {
    this.taskService.deleteTask(id).subscribe(
      data => {
        console.log('deleted', data);
        this.listTasks();
        this.toast.success('task deleted!');
      }, error => {
        console.log(error);
        this.toast.error(error);
      }
    );
  }

  addTask() {

    this.loading = true;

    const newTask = new Task(this.af.task.value, this.currentUser.id, this.af.priority.value, this.af.status.value);

    if (this.addForm.invalid){
      return;
    }

    this.adding = true;

    this.taskService.addTask(newTask).subscribe(
      data => {
        console.log('success', data);
        // this.listTasks();
        this.ngOnInit();
        this.adding = false;
        this.loading = false;
        this.toast.success('added task');
      }, error => {
        console.log(error);
        this.toast.error(error);
      }
    );
  }

  listTasks() {
    this.taskService.getAllTasks().subscribe(
      data => {
        this.tasks = data;
      }
    );
  }

}
