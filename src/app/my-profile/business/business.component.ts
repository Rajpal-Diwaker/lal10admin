import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { app_strings } from 'src/app/_constants/app_strings';
import { UserService } from 'src/app/_services/user.service';
@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {
  editFlag = false;
  myForm: FormGroup;
  adminId: any = localStorage.getItem('x-id');
  constructor(private fb: FormBuilder,
    private el: ElementRef,
    private userService: UserService,
    private router: Router, private route: ActivatedRoute) {
  }
  ngOnInit() {
    this.createForm();
    this.getDetails();
  }
  edit(condi) {
    this.editFlag = condi;
    console.log(this.editFlag);
    condi ? this.myForm.enable() : this.myForm.disable();
  }
  getDetails() {
    this.userService.getAdminBussinessDetails().subscribe(res => {
      if (res.code == 200) {
        const { result } = res;
        this.myForm.patchValue(result[0]);
        console.log(this.myForm.value);
      }
    });
  }
  get f() {
    return this.myForm.controls;
  }
  createForm() {
    this.myForm = this.fb.group({
      companyAddress: [{ value: '', disabled: this.editFlag ? false : true }, Validators.required],
      companyEmail: [{ value: '', disabled: this.editFlag ? false : true }, Validators.compose([Validators.required, Validators.email])],
      // tslint:disable-next-line: max-line-length
      companyNumber: [{ value: '', disabled: this.editFlag ? false : true }, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(15)])],
      // tslint:disable-next-line: max-line-length
      facebook: [{ value: '', disabled: this.editFlag ? false : true }, Validators.compose([Validators.required, Validators.pattern(app_strings.URL_PATTERN)])],
      id: [{ value: '', disabled: this.editFlag ? false : true }, Validators.required],
      // tslint:disable-next-line: max-line-length
      instagram: [{ value: '', disabled: this.editFlag ? false : true }, Validators.compose([Validators.required, Validators.pattern(app_strings.URL_PATTERN)])],

    });
  }
  submit(val) {
    // console.log('invalidForm', this.productsGrp.controls);
    // return;
    console.log(this.myForm);
    if (this.myForm.invalid) {
      for (const key of Object.keys(this.myForm.controls)) {
        if (this.myForm.controls[key].invalid) {
          console.log(key);
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
        }
      }
      return;
    }


    this.userService.addAdminBussinessDetails(val).subscribe(res => {

      if (res.code == 200) {
        this.editFlag = false;
        this.myForm.disable();
      }

    });
  }
}
