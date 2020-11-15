import { User } from './../../classes/user';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
    ) {
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

    const generateUserId = Math.floor(100 + Math.random() * 900);

    var new_user = new User(generateUserId, this.f.email.value, this.f.name.value, this.f.password.value);

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.authService.register(new_user).subscribe(
      data => {
        console.log('success', data);
        this.router.navigate(['signin']);
      },
      error => {
        console.log(error);
      });
  }

}
