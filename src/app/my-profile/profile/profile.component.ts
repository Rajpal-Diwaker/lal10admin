import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  editProfileForm: FormGroup;
  submittedProfile = false;
  profileDataArr;
  @ViewChild('firstNameEle') firstNameEle;
  editingProfile = false;
  adminId: any = localStorage.getItem('x-id');

  constructor(private userService: UserService, private fb: FormBuilder) { }

  ngOnInit() {
    this.getProfile();
    this.setEditProfileFormField();
  }

  // set edit profile form filed
  setEditProfileFormField(ob?: {name, name2, mobile, email}) {
    this.submittedProfile = false;
    this.editingProfile = false;
    this.editProfileForm = this.fb.group({
      firstName: [ob ? ob.name : '', [Validators.required]],
      lastName: [ob ? ob.name2 : '', [Validators.required]],
      // tslint:disable-next-line: max-line-length
      email: [ob ? ob.email : '', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      mobile: [ob ? ob.mobile : '', [Validators.required, Validators.minLength(10),
        Validators.maxLength(15)]]
    });
    // this.firstNameEle.nativeElement.focus();
    // debugger
  }

  // get edit profile form controls
  get f() { return this.editProfileForm.controls; }

  // submit edit profile
  submitProfile() {
    this.submittedProfile = true;
    if (!this.editProfileForm.valid) {
      console.log('invalidEditProfile', this.f);
      return;
    }
    const payload = {
      name: this.f.firstName.value,
      name2: this.f.lastName.value
    };
    this.userService.showLoader();
    this.userService.updateProfile(payload).subscribe(response => {
      if (response && response.code === 200) {
        this.userService.success(response.message);
        this.getProfile();
      } else {
        this.userService.error(response.message);
        this.userService.hideLoder();
      }
    }, error => {
      this.userService.error(error);
      this.userService.hideLoder();
    });
  }

  // function to get profile info
  getProfile() {
    this.userService.getProfile().subscribe(response => {
      if (response && response.code === 200) {
        this.userService.hideLoder();
        // const profile = response.result;
        // profile[0].name = profile[0].name.split(' ');
        this.profileDataArr = response.result;
        console.log('profileArr', this.profileDataArr);
        this.editProfileForm.disable();
        this.setEditProfileFormField(this.profileDataArr[0]);
      } else {
        this.userService.error(response.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  // function to enable profile editing
  enableProfileEditing() {
    this.editingProfile = true;
    this.editProfileForm.enable();
    this.f.email.disable();
    this.f.mobile.disable();
    this.firstNameEle.nativeElement.focus();
  }

  // function on cancel profile editing
  cancelProfileEditing() {
    // this.submittedProfile = false;
    this.editProfileForm.disable();
    this.setEditProfileFormField(this.profileDataArr[0]);
    // this.editingProfile = false;
  }

  // function to accept number only
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
