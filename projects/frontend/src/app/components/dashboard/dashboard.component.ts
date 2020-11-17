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
  all;
  completed;
  ongoing;
  upcoming;
  percentComp;

  ngOnInit(): void {
    this.listTasks();
  }

  // tslint:disable-next-line:typedef
  listTasks() {
    const url = this.apiUrl + '/tasks';
    this.http.get(url).subscribe(res => {
      this.tasks = res;
    });
    this.loadStatistics(this.tasks);
  }

  // tslint:disable-next-line:typedef
  loadStatistics(tasks){
  }

}
