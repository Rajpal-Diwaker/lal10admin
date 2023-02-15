import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { app_strings } from 'src/app/_constants/app_strings';
import { CrudService } from 'src/app/_services/crud.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-create-subadmin',
  templateUrl: './create-subadmin.component.html',
  styleUrls: ['./create-subadmin.component.css']
})
export class CreateSubadminComponent implements OnInit {
  total = 0;
  myform: FormGroup;
  role: any;
  roleSetting: {
    singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string;
    // itemsShowLimit: 3,
    allowSearchFilter: boolean; enableCheckAll: boolean;
  };
  groupId: any = [];
  get f() { return this.myform.controls; }
  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
      });
  }
  ngOnInit() {
    this.createForm();
    this.getRole();
    this.roleSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: false,
      enableCheckAll: true
    };
  }
  createForm() {
    this.myform = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(15)])],
      roleIds: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])]
    });
  }
  getRole() {
    this.userService.getRoleList()
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.role = result;
      });
  }
  submit(val) {
    if (this.myform.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      // this.userService.error(app_strings.INVALID_FORM)
      return;
    }
    /* subAdminRoleId */
    const roleIds = [];
    val.roleIds.forEach(element => {
      roleIds.push(element.id);
    });
    val.roleIds = roleIds.toString();
    this.userService.addSubAdmin(val).subscribe(res => {
      console.log(res);
      if (res.code == 200) {
        this.router.navigate(['/subadmin']);
      }
      else{
        this.userService.bug(res.message)
      }
    });
  }
}
