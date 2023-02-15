import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-logistic-detail',
  templateUrl: './logistic-detail.component.html',
  styleUrls: ['./logistic-detail.component.css']
})
export class LogisticDetailComponent implements OnInit {
  editId: any;
  editFlag: boolean;
  details: any;
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router, private route: ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.details = params;
        if (params.id) {
          this.editFlag = true;
        }
      });
  }
  get f() { return this.myForm.controls; }
  myForm: FormGroup;
  ngOnInit() {
    this.createForm();
    this.getList();
  }

  getList() {
    this.userService.getlogisticDetails(this.details).subscribe(res => {
      if (res.code === 200) {
        this.myForm.patchValue(res.result)
      }
    })
  }
  createForm() {
    this.myForm = this.fb.group({
      carrier: [{value: '', disabled: true}, Validators.compose([Validators.required])],
      trackingNo: [{value: '', disabled: true}, Validators.compose([Validators.required])],
      boxes: [{value: '', disabled: true}, Validators.compose([Validators.required])],
      paymentMode: [{value: '', disabled: true}, Validators.compose([Validators.required])],

    });
  }
  submit(val) {
    if (this.myForm.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      return;
    }
  }
  goToChat() {
    this.router.navigate(['/orders/chat'], { queryParams: this.details });
  }
}
