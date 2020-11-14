import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  res: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.userValue) {
      // this.router.navigate(['/']);
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

    if (this.loginForm.invalid){
      return;
    }

    this.loading = true;

    if (this.authService.login(this.f.email.value, this.f.password.value) != null) {
      this.router.navigate(['dashboard']);
    }

    // this.authService.login(this.f.email.value, this.f.password.value).pipe(first()).subscribe(
    //   data => {
    //     console.log('success', data);
    //   },
    //   error => {
    //     console.log(error);
    //   });
  }

}
