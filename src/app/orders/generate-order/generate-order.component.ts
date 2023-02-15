import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-generate-order',
  templateUrl: './generate-order.component.html',
  styleUrls: ['./generate-order.component.css']
})
export class GenerateOrderComponent implements OnInit, OnDestroy {
  enqid: any;
  userid: any;
  editFlag: boolean;
  minDate=new Date();
  editData: any;
  page = 1;
  focusId;
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router, private route: ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.enqid = params.id;
        this.userid = params.userId;
        this.editData = params.productName;
        this.page = params.page;
        this.focusId = params.focusid;
        if (this.enqid) {
          this.editFlag = true;
        }
      });
  }
  get f() { return this.myForm.controls; }
  myForm: FormGroup;
  ngOnInit() {
    this.createForm();
    this.minDate.setDate(this.minDate.getDate() + 1);
  }
  ngOnDestroy(): void {
    // alert('destroy')
    if (this.page) {
      sessionStorage.setItem('orderPage', JSON.stringify(this.page));
      sessionStorage.setItem('orderFocus', JSON.stringify(this.focusId));
    }
  }
  createForm() {
    this.myForm = this.fb.group({
      enqId: [this.enqid, Validators.compose([Validators.required])],
      userId: [this.userid, Validators.compose([Validators.required])],
      invoiceTo: ['', Validators.compose([Validators.required])],
      shipTo: ['', Validators.compose([Validators.required])],
      placeOfSupply: ['', Validators.compose([Validators.required])],
      productName: [this.editFlag ? this.editData : '', Validators.compose([Validators.required])],
      unit: ['', Validators.compose([Validators.required])],
      rate: ['', Validators.compose([Validators.required])],
      tax: ['', Validators.compose([Validators.required])],
      currency: ['', Validators.compose([Validators.required])],
      dueDate: ['', Validators.compose([Validators.required])],
      subTotal: [''],
      qty: ['', Validators.compose([Validators.required])],
      amount: ['']
    });
  }
  setDynamicValidator() {
    console.log('checkChange');
    // this.f.discount.setValue(0);
    this.f.tax.setValidators([Validators.required, Validators.max(this.f.qty.value * this.f.rate.value)]);
    // this.f.discount.setValidators([Validators.required,
    //   Validators.max((1 - (this.f.tax.value / 100)) * (this.f.totalQTY.value * this.f.rate.value))]);
  }
  submit(val) {
    if (this.myForm.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      // this.userService.error(app_strings.INVALID_FORM)
      return;
    }
    const newDate: any = new Date(this.f.dueDate.value);
    console.log('newDate', new Date(newDate).toLocaleDateString());
    const dt = new Date(newDate).toLocaleDateString();
    const dt2 = dt.split('/');
    val.dueDate = `${dt2[2]}-${dt2[1]}-${dt2[0]}`;
    // val.dueDate = new Date(val.dueDate).toJSON().split('T')[0];

    val.amount = (1 + (this.f.tax.value / 100)) * (this.f.qty.value * this.f.rate.value);
    val.subTotal = (this.f.qty.value * this.f.rate.value);

    this.userService.generateInvoiceOrder(val).subscribe(res => {
      if (res.code === 201) {
        this.router.navigate(['/orders'])
      } else {
        this.userService.error(res.message)
      }
    })
  }
}
