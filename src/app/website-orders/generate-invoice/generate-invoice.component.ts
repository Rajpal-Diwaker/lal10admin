import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.css']
})
export class GenerateInvoiceComponent implements OnInit {

  editId: any;
  editFlag: boolean;
  minDate = new Date();
  editData: any;
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router, private route: ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.editId = params.id;
        this.editData = params;
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
      enqId: [this.editId, Validators.compose([Validators.required])],
      supplier: ['', Validators.compose([Validators.required])],
      shipTo: ['', Validators.compose([Validators.required])],
      totalQTY: ['', Validators.compose([Validators.required])],
      productName: [this.editFlag ? this.editData.productName : '', Validators.compose([Validators.required])],
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
    val.dueDate = new Date(val.dueDate).toJSON().split('T')[0];

    val.userId = '1';
    val.type = 'order';
    val.qty = val.totalQTY;
    val.placeOfSupply = val.supplier;
    // val.price = val.rate;
    // val.gst = val.tax;
    delete val.supplier;
    delete val.approvedBy;
    delete val.totalQTY;
    delete val.discount;
    // delete val.rate;
    // delete val.tax;
    console.log(val);
    this.userService.addWebsiteOrderInvoiceGenerate(val).subscribe(res => {
      if (res.code === 201) {
        this.router.navigate(['/websiteOrders']);
      }
    });
  }

}
