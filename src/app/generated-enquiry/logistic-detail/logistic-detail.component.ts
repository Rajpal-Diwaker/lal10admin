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
  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router, private route: ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.editId = params.id;
        if (this.editId) {
          this.editFlag = true;
        }
      });
  }
  get f() { return this.myForm.controls; }
  myForm: FormGroup;
  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      enqId: ['', Validators.compose([Validators.required])],
      supplier: ['', Validators.compose([Validators.required])],
      shipTo: ['', Validators.compose([Validators.required])],
      totalQTY: ['', Validators.compose([Validators.required])],
      productName: ['', Validators.compose([Validators.required])],
      unit: ['', Validators.compose([Validators.required])],
      rate: ['', Validators.compose([Validators.required])],
      tax: ['', Validators.compose([Validators.required])],
      amount: ['', Validators.compose([Validators.required])],
      dueDate: ['', Validators.compose([Validators.required])],
      subTotal: ['', Validators.compose([Validators.required])],
      approvedBy: ['Admin', Validators.compose([Validators.required])],
      discount: ['', Validators.compose([Validators.required])],
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
}
