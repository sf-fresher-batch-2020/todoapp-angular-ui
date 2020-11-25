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
  viewingTask;
  eTask;

  addForm: FormGroup;
  updateForm: FormGroup;
  loading = false;
  updating = false;
  adding = false;

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
    this.viewingTask = task;
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

  getCompleted() {
    return (Math.floor((this.completed / this.all) * 100));
  }

  filterTasks(val){
    let tempTasks = this.allTasks;

    if (val === 'ongoing' || val === 'upcoming' || val === 'completed') {
      this.tasks = tempTasks.filter(task => task.status === val);
    } else if (val === 'high' || val === 'medium' || val === 'low') {
      this.tasks = tempTasks.filter(task => task.priority === val);
    } else {
      this.listTasks();
    }
  }

  sortTasks(val) {
    let tempTasks = this.allTasks;
    if (val === 'priority') {
      this.tasks = tempTasks.sort(this.sortByPriority);
    } else if (val === 'status') {
      this.tasks = tempTasks.sort(this.sortByStatus);
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
    const editedTask = {
      id: this.eTask.id,
      task: this.uf.task.value,
      priority: this.uf.priority.value,
      status: this.uf.status.value
    };

    if (this.updateForm.invalid) {
      return;
    }

    this.updating = true;
    this.taskService.updateTask(editedTask).subscribe(
      data => {
        this.listTasks();
        this.toast.success('task edited!');
      }, error => {
        this.toast.error(error);
      }
    );
  }

  editTask(task) {
    this.eTask = task;
  }

  deleteTask(tid) {
    const task = {id: tid};
    this.taskService.deleteTask(task).subscribe(
      data => {
        this.toast.success('task deleted!');
        this.listTasks();
      }, error => {
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
        this.ngOnInit();
        this.adding = false;
        this.loading = false;
        this.toast.success('added task');
      }, error => {
        this.toast.error(error);
      }
    );
  }

  bindTasks(tasks) {
    this.tasks = tasks;
    this.loadStats();
  }

  listTasks() {
    this.loading = true;
    this.taskService.getAllTasks(this.currentUser.id).subscribe(
      data => {
        this.loading = false;
        this.allTasks = data;
        this.bindTasks(this.allTasks);
      }, error => {
        this.loading = false;
      }
    );
  }

}
