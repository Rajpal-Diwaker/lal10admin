import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material';
import { SocketService } from 'src/app/_services/socket.service';
@Component({
  selector: 'app-estimate-order',
  templateUrl: './estimate-order.component.html',
  styleUrls: ['./estimate-order.component.css']
})
export class EstimateOrderComponent implements OnInit {
  editId: any;
  minDate = new Date();
  editFlag: boolean;
  details: any;
  adminId = localStorage.getItem('x-id');
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router, private route: ActivatedRoute,
    private socket: SocketService) {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.editId = params.id;
        this.details = params;
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
      enqId: [this.details.EnqId, Validators.compose([Validators.required])],
      assignUserId: [this.details.userId],
      address: ['', Validators.compose([Validators.required])],
      shipTo: ['', Validators.compose([Validators.required])],
      estimateNo: ['', Validators.compose([Validators.required])],
      productName: ['', Validators.compose([Validators.required])],
      unit: ['', Validators.compose([Validators.required])],
      estimateRate: ['', Validators.compose([Validators.required])],
      tax: ['', Validators.compose([Validators.required])],
      amount: [''],
      subTotal: [''],
      acceptedBy: ['admin', Validators.compose([Validators.required])],
      acceptedDate: ['', Validators.compose([Validators.required])],
      totalQTY: ['', Validators.compose([Validators.required])]
    });
  }
  setDynamicValidator() {
    console.log('checkChange');
    // this.f.discount.setValue(0);
    this.f.tax.setValidators([Validators.required, Validators.max(this.f.totalQTY.value * this.f.estimateRate.value)]);
    // this.f.discount.setValidators([Validators.required,
    //   Validators.max((1 - (this.f.tax.value / 100)) * (this.f.totalQTY.value * this.f.rate.value))]);
  }
  submit(val) {
    console.log(val);
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
    val.amount = (1 + (this.f.tax.value / 100)) * (this.f.totalQTY.value * this.f.estimateRate.value);
    val.subTotal = (this.f.totalQTY.value * this.f.estimateRate.value);

    const newDate: any = new Date(this.f.acceptedDate.value);
    console.log('newDate', new Date(newDate).toLocaleDateString());
    const dt = new Date(newDate).toLocaleDateString();
    const dt2 = dt.split('/');
    val.acceptedDate = `${dt2[2]}-${dt2[1]}-${dt2[0]}`;

    delete val.approvedBy;
    val.qty = val.totalQTY;
    // val.price = val.estimateRate;
    // val.gst = val.tax;
    delete val.totalQTY;
    // delete val.estimateRate;
    // delete val.tax;
    // val.acceptedDate = new Date(val.acceptedDate).toJSON().split('T')[0];
    this.userService.genrateEstimate(val).subscribe(res => {
      if (res.code === 201) {
        const request = {
          EnqId: this.details.EnqId,    // enquiry id
          fromId: this.adminId,
          toId: this.details.userId, /* (reciever_id) */
          msg: '',
          files: res.result,
          type: 'estimate' /* (sample 'text','image','logistic','invoice','tracker','purchase','estimate') (optional parameters) */
        };
          this.socket.sendMessage(request);
        this.router.navigate(['/generated-enquiry/chat'],{ queryParams: this.details });
      }
    });
  }
  goToChat() {
    this.router.navigate(['/generated-enquiry/chat'], { queryParams: this.details });
  }
}
