import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  userExists = false;
  submitted = false;
  returnUrl: string;
  res: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService
  ) {
    if (this.authService.getLoggedInUser()) {
      this.router.navigate(['dashboard']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    const user = { email: this.f.email.value, password: this.f.password.value };

    this.authService.login(user).subscribe(
      data => {
        this.authService.storeLoginDetails(data[0]);
        window.location.href = '/dashboard';
      }, error => {
        console.log(error);
        this.loading = false;
        this.toast.error('check credentials');
      }
    );
  }
}
