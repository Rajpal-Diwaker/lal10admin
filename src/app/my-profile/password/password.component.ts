import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { MustMatch } from 'src/app/_helpers/must-match';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  editPasswordForm: FormGroup;
  submittedPassword = false;
  @ViewChild('oldPasswordEle') oldPasswordEle;
  editingPassword = false;
  oldPasswordType: boolean;
  newPasswordType: boolean;
  confirmPassowrdType: boolean;
  adminId: any = localStorage.getItem('x-id');

  constructor(private userService: UserService, private fb: FormBuilder) { }

  ngOnInit() {
    this.setEditPasswordFormField();
  }

  // function to set edit password form field
  setEditPasswordFormField() {
    this.submittedPassword = false;
    this.editingPassword = false;
    this.editPasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    }, {validator: MustMatch('newPassword', 'confirmNewPassword')}
    );
  }

  // function to get edit password form controls
  get f() { return this.editPasswordForm.controls; }

  // function to submit edit password form
  submitPassword() {
    this.submittedPassword = true;
    // if (!this.editPasswordForm.valid) {
    //   console.log('ivalidPasswordForm', this.f);
    //   return;
    // }
    if (this.editPasswordForm.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      // this.userService.error(app_strings.INVALID_FORM)
      return;
    }
    const payload = {
      oldPassword: this.f.oldPassword.value,
      newPassword: this.f.newPassword.value
    };
    this.userService.showLoader();
    this.userService.changePassword(payload).subscribe(response => {
      if (response && response.code === 200) {
        this.userService.success(response.message);
        this.userService.hideLoder();
        this.editingPassword = false;
        this.setEditPasswordFormField();
      } else if (response && response.code === 201) { // on new password is same as old password
        this.userService.bug(response.message);
        this.userService.hideLoder();
      } else if (response && response.code === 401) {
        this.userService.bug(response.message);
        this.userService.hideLoder();
      } else {
        this.userService.bug(response.message);
        this.userService.hideLoder();
      }
    }, error => {
      this.userService.success(error);
      this.userService.hideLoder();
    });
  }

  // function to show/hide passwords
  toggleFieldTextType(type) {
    if (type === 1) {
      this.oldPasswordType = !this.oldPasswordType;
    } else if (type === 2) {
      this.newPasswordType = !this.newPasswordType;
    } else {
      this.confirmPassowrdType = !this.confirmPassowrdType;
    }
  }

}
