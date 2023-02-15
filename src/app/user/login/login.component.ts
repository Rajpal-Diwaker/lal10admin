import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';
import { SocketService } from 'src/app/_services/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loader: boolean = false;
  loginFrmGrp: FormGroup;
  submitted: boolean = false;
  adminId = localStorage.getItem('x-id');

  constructor(private router: Router, private fb: FormBuilder, private socket: SocketService,
    // tslint:disable-next-line: align
    private userService: UserService) { }

  ngOnInit() {
    this.loginFrm();

    if (this.userService.isAuthenticated()) {
      this.goto('/dashboard');

    }
  }

  loginFrm() {
    this.loginFrmGrp = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  get f() { return this.loginFrmGrp.controls; }

  login() {
    if (this.loginFrmGrp.invalid) {
      // this.loginFrmGrp.markAsUntouched()
      this.submitted = true;
      // this.userService.error(app_strings.INVALID_FORM)
      return;
    }
    this.loader = true;
    const ob = {
      email: this.f.email.value,
      password: this.f.password.value
    };

    // setTimeout(() => {
    //   this.loader = false
    // }, 4 * 1000)

    this.userService.login(ob)
      .pipe(take(1))
      .subscribe(res => {
        if (res.code === 200 && res.result.token) {
          this.userService.setToken(res.result.token);
          localStorage.setItem('x-id', res.result.id);
          const adminInfo = {
            // fromId: res.result.id
            fromId: 1
          };
          this.socket.initChat(adminInfo);
          this.loader = false;
          this.goto('/dashboard');
          let { menus } = res
          let temp = []
          menus.forEach(element => {
            temp.push(element.title)
          });

          localStorage.setItem('menu', temp.toString());

        } else {
          this.loader = false;
          this.userService.error(res.message);
        }
      }, err => {
        console.log(err);
        this.loader = false;
        this.userService.error(err.message);
      });
  }

  goto(uri) {
    if (!uri) { return; }
    this.router.navigateByUrl(uri);
  }
}
