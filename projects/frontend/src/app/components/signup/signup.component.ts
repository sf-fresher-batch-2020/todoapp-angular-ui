import { ToastrService } from 'ngx-toastr';
import { ProfileService } from './../../services/profile.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmedValidator } from '../../confirmed.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService,
    private toast: ToastrService
    ) {
      if (this.authService.getLoggedInUser()) {
        this.router.navigate(['dashboard']);
      }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required]]
    }, {
      validator: ConfirmedValidator('password', 'confirmpassword')
    });
  }

  get f() { return this.form.controls; }



  onSubmit() {

    this.submitted = true;

    const newUser = { email: this.f.email.value, name: this.f.name.value, password: this.f.password.value};

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.authService.register(newUser).subscribe(
      data => {
        this.profileService.createProfile(data).subscribe(
          data => {
            this.toast.success('registered successfully!');
            this.router.navigate(['signin']);
          }, error => {
            this.toast.error('profile creation failed!');
            console.log(error);
          }
        );
      },
      error => {
        console.log(error);
        this.toast.error('registration failed');
      });
  }

}
