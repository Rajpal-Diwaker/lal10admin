import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketService } from 'src/app/_services/socket.service';
@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {
  editId: any;
  editFlag: boolean;
  minDate = new Date();
  details: any;
  name: any;
  adminId = localStorage.getItem('x-id');
  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router, private route: ActivatedRoute, private socket: SocketService) {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.editId = params.id;
        this.details = params;
        this.name = params.name;
        if (this.editId) {
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
  createForm() {
    this.myForm = this.fb.group({
      enqId: [this.details.EnqId, Validators.compose([Validators.required])],
      assignUserId: [this.details.userId],
      supplier: [this.name, Validators.compose([Validators.required])],
      shipTo: ['', Validators.compose([Validators.required])],
      totalQTY: ['', Validators.compose([Validators.required])],
      productName: ['', Validators.compose([Validators.required])],
      unit: ['', Validators.compose([Validators.required])],
      rate: ['', Validators.compose([Validators.required])],
      tax: ['', [Validators.required]],
      amount: [''],
      dueDate: ['', Validators.compose([Validators.required])],
      subTotal: [''],
      approvedBy: ['Admin', Validators.compose([Validators.required])],
      discount: ['', [Validators.required]],
    });
    // this.setDynamicValidator();
  }
  setDynamicValidator() {
    console.log('checkChange');
    this.f.discount.setValue(0);
    this.f.tax.setValidators([Validators.required, Validators.max(this.f.totalQTY.value * this.f.rate.value)]);
    this.f.discount.setValidators([Validators.required,
      Validators.max((1 - (this.f.tax.value / 100)) * (this.f.totalQTY.value * this.f.rate.value))]);
  }
  submit(val: any) {
    if (this.myForm.invalid) {
      console.log('invalidForm', this.f);
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      return;
    }
    // const newDate: any = new Date(val.dueDate).setDate(val.dueDate.getDate() + 1);
    // val.dueDate = newDate.toJSON().split('T')[0];
    // val.dueDate = val.dueDate.replace('-', '/');

    const newDate: any = new Date(this.f.dueDate.value);
    console.log('newDate', new Date(newDate).toLocaleDateString());
    const dt = new Date(newDate).toLocaleDateString();
    const dt2 = dt.split('/');
    val.dueDate = `${dt2[2]}-${dt2[0]}-${dt2[1]}`;
    // val.dueDate = new Date(val.)
    // val.dueDate = new Date(val.dueDate).toISOString();
    // val.dueDate = new Date(this.f.dueDate.value).toUTCString();

    val.amount = (1 - (this.f.discount.value / 100) + (this.f.tax.value / 100)) * (this.f.totalQTY.value * this.f.rate.value);
    val.subTotal = (1 - (this.f.discount.value / 100)) * (this.f.totalQTY.value * this.f.rate.value);
    val.qty = val.totalQTY;
    val.price = val.rate;
    val.gst = val.tax;
    delete val.approvedBy;
    delete val.totalQTY;
    delete val.rate;
    delete val.tax;
    console.log(val);
    // return;
    this.userService.genratePurchaseOrder(val).subscribe(res => {
      if (res.code === 201) {
        // const temp = {
        //   EnqId: this.details.EnqId,    // enquiry id
        //   fromId: this.adminId,
        //   toId: this.details.userId, /* (reciever_id) */
        //   msg: '',
        //   files: '',
        //   type: 'estimate' /* (sample text,image,logistic,invoice,tracker) (optional parameters) */
        // };
        // console.log('socket request', temp);
        // this.socket.sendMessage(temp);
        this.userService.success(res.message);
        this.userService.confirmPopup({ confirmButtonText: 'Yes',
      text: '', title: 'Do you want to send purchase order to the artisan ?' }).then((result) => {
        if (result.value) {
          this.userService.downloadPdf(res.result, 'purchase order');
          const request = {
          EnqId: this.details.EnqId,    // enquiry id
          fromId: this.adminId,
          toId: this.details.userId, /* (reciever_id) */
          msg: '',
          files: res.result,
          type: 'purchase' /* (sample 'text','image','logistic','invoice','tracker','purchase','estimate') (optional parameters) */
        };
          this.socket.sendMessage(request);
          this.userService.givePurchaseOrder({ userId: this.details.userId, enqId: this.details.EnqId }).subscribe(res => {
          console.log(res);
        });
          window.open(res.result, '_blank');
          this.router.navigate(['/generated-enquiry/chat'], { queryParams: this.details });
        } else {
          this.router.navigate(['/generated-enquiry/chat'], { queryParams: this.details });
        }
      });
      }
    });
  }

  dateChage() {
    // console.log('checkDate', this.f.dueDate.value);
    // const newDate: any = this.f.dueDate.value;
    // const newVal = newDate.toJSON().split('T')[0];
    // const currentTime: any = new Date();
    // const veryNewVal = newVal + `T${currentTime.toJSON().split('T')[1]}`;
    // console.log('checkDate', newVal);
    // console.log('checkIsoDate', veryNewVal);
    // console.log('utc', new Date(this.f.dueDate.value).toUTCString());
    const newDate: any = new Date(this.f.dueDate.value);
    console.log('newDate', new Date(newDate).toLocaleDateString());
    const dt = new Date(newDate).toLocaleDateString();
    const dt2 = dt.split('/');
    const val = `${dt2[2]}-${dt2[0]}-${dt2[1]}`;
    console.log('checkFormattedDated', val);
    // const dueDate = new Date(newDate).toJSON().split('T')[0];
    // const ndueDate = dueDate.replace('-', '/');
    // console.log('date', ndueDate);
  }
  goToChat() {
    this.router.navigate(['/generated-enquiry/chat'], { queryParams: this.details });
  }
}
