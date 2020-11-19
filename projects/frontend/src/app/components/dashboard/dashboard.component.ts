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

  allTasks;
  tasks;
  filteredTasks;
  currentUser;
  addForm: FormGroup;
  updateForm: FormGroup;
  loading = false;
  updating = false;
  adding = false;
  task;
  eTask;
  // stats
  all = 0;
  ongoing = 0;
  upcoming = 0;
  completed = 0;

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

  viewTask(task) {
    this.task = task;
  }

  loadStats() {
    this.all = 0;
    this.ongoing = 0;
    this.upcoming = 0;
    this.completed = 0;
    for (let task of this.tasks) {
      this.all += 1;
      if (task.status === 'ongoing') {
        this.ongoing += 1;
      } else if (task.status === 'upcoming') {
        this.upcoming += 1;
      } else if (task.status === 'completed') {
        this.completed += 1;
      }
    }
  }

  filterTasks(val){

    let tasksO = this.allTasks;

    if (val === 'ongoing' || val === 'upcoming' || val === 'completed') {
      this.tasks = tasksO.filter(task => task.status === val);
    } else if (val === 'high' || val === 'medium' || val === 'low') {
      this.tasks = tasksO.filter(task => task.priority === val);
    } else {
      this.listTasks();
    }
  }

  sortTasks(val) {
    let tasksO = this.allTasks;
    if (val === 'priority') {
      console.log('sort by priority');
      this.tasks = tasksO.sort(this.sortByPriority);
    } else if (val === 'status') {
      console.log('sort by status');
      this.tasks = tasksO.sort(this.sortByStatus);
    } else {
      this.listTasks();
    }
  }

  sortByPriority(t1: Task, t2: Task) {
    if (t1.priority > t2.priority) {
      return 1;
    } else if (t1.priority === t2.priority) {
      return 0;
    } else {
      return -1;
    }
  }

  sortByStatus(t1: Task, t2: Task) {
    if (t1.status > t2.status) {
      return 1;
    } else if (t1.status === t2.status) {
      return 0;
    } else {
      return -1;
    }
  }
  updateTask() {

    this.loading = true;

    console.log('editing');

    const editedTask = new Task(this.uf.task.value, this.currentUser.id, this.uf.priority.value, this.uf.status.value);

    if (this.updateForm.invalid) {
      return;
    }

    console.log('updating');

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

  editTask(task) {
    this.eTask = task;
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

  bindTasks(tasks) {
    this.tasks = tasks;
    this.loadStats();
  }

  listTasks() {
    this.taskService.getAllTasks().subscribe(
      data => {
        this.allTasks = data;
        this.bindTasks(this.allTasks);
      }
    );
  }

}
