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

  constructor(private http: HttpClient) {
    this.apiUrl = environment.API_URL;
  }

  tasks;

  ngOnInit(): void {
    this.listTasks();
    // this.loadTaks();
  }

  // loadTaks() {
  //   let content = "";
  //   for (let task of this.tasks) {
  //     let editButton = `<a type="button" class="btn text-primary" data-toggle="modal" data-target="#edittask" onClick="taskServiceObj.openEditModal(${tasks[i].id})">Edit</a>`;
  //     let viewButton = `<a type="button" class="btn text-info" data-toggle="modal" data-target="#viewtask" onClick="taskServiceObj.openViewModal(${tasks[i].id})">View</a>`;
  //     let deleteButton = `<a type="button" class="btn text-danger" onClick="taskServiceObj.delete(${tasks[i].id})" data-target="#deletetask">Delete</a>`;
  //     content =
  //       `<tr>
  //         <td>${tasks[i].task}</td>
  //         <td>${tasks[i].priority}</td>
  //         <td>${tasks[i].status}</td>
  //         <td>${editButton}</td>
  //         <td>${viewButton}</td>
  //         <td>${deleteButton}</td>
  //       </tr>`;
  //   }
  //   document.querySelector("#taskslist").innerHTML = content;
  // }

  listTasks() {
    let url = this.apiUrl + '/tasks';
    this.http.get(url).subscribe(res => {
      this.tasks = res;
    });
    // this.loadTaks();
  }

}
