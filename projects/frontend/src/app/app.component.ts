import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from './classes/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  user: User;

  constructor(
    private toastr: ToastrService,
    private authService: AuthService
    ) {
      this.authService.user.subscribe(x => this.user = x);
    // this.toastr.success('Success');
  }
}
