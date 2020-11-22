import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from './../../services/profile.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  form: FormGroup;
  loading;
  submitted;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private toast: ToastrService
  ) {
    this.currentUser = this.authService.getLoggedInUser();
  }

  currentUser;
  currentProfile;

  ngOnInit(): void {
    console.log(this.currentUser.id);
    this.profileService.getProfile({id: this.currentUser.id}).subscribe(
      data => {
        this.currentProfile = data[0];
      }
    );

    this.form = this.formBuilder.group({
      company: ['']
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {

    this.submitted = true;

    const profile = {
      profileId: this.currentProfile.id
    };

    this.loading = true;

    this.profileService.updateProfile(profile).subscribe(
      data => {
        this.toast.success('profile updated');
        this.ngOnInit();
      }, error => {
        this.toast.error('update failed');
      }
    );
  }
}
