import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { SocketService } from 'src/app/_services/socket.service';
@Component({
  selector: 'app-production-tracker',
  templateUrl: './production-tracker.component.html',
  styleUrls: ['./production-tracker.component.css']
})
export class ProductionTrackerComponent implements OnInit {
  editId: any;
  editFlag: boolean;
  producationValue = 0;
  paymentValue = 0;
  adminId = localStorage.getItem('x-id');
  options: Options = {
    floor: 0,
    ceil: 100,
    disabled: true
  };
  paymentOptions: Options = {
    floor: 0,
    ceil: 100
  }
  deliveryOptions: Options = {
    floor: 0,
    ceil: 100
  }
  details: any;
  image: any;
  deliveryDate: any;
  deliveryValue: any;
  currentDate: any = new Date().getTime();
  dateRange: Date[];
  changeFlag = false;
  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router, private route: ActivatedRoute, private socket: SocketService) {
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
    this.userService.getProductionTracker(this.details).subscribe(res => {
      if (res.code === 200) {
        this.producationValue = res.result.productionStatus;
        this.paymentValue = res.result.paymentStatus;
        this.image = res.result.files || 'assets/images/def.png';
        // this.deliveryDate = res.result.deliveryDate;
        // this.deliveryDate = this.deliveryDateFunction(res.result.created_at, res.result.deliveryDate);
        this.dateRange = this.deliveryDateFunction(res.result.created_at, res.result.deliveryDate);
        // this.deliveryOptions.ceil = this.deliveryDate.total_days;
        const newOptions: Options = Object.assign({}, this.deliveryOptions);
        // newOptions.floor = 0;
        // newOptions.ceil = this.deliveryDate.total_days;
        // newOptions.disabled = true;
        newOptions.readOnly = true;
        newOptions.showSelectionBar = true;
        console.log('dateRAnge', this.dateRange)
        newOptions.stepsArray = this.dateRange.map((date: Date) => {
          return { value: new Date(date).getTime() };
        }),
        newOptions.translate =  (value: number, label: LabelType): string => {
          return new Date(value).toDateString();
        }
        this.deliveryOptions = newOptions;
        // this.refresh[0] = this.ref.next();
        // this.deliveryValue = Number(this.deliveryDate.current_day);
        console.log('--------------new options-------.>>>>>>>>>>',newOptions);
        this.currentDate=new Date().setDate(new Date().getDate() -1);
        // this.currentDate=new Date();
        // console.log('----------delivery-------',this.deliveryOptions);
        console.log('------------current----->>>>>>>',this.currentDate);



      }
    });
  }
  deliveryDateFunction(d1: Date, d2) {
    console.log(d1, d2);

    let start_date = new Date(d1);
    let end_date = new Date(d2);
    console.log('EndDate', end_date);
    let total_days = (Math.round((end_date.getTime() - start_date.getTime()) / (60 * 60 * 1000 * 24)));
    let current_day = (Math.round((new Date().getTime() - start_date.getTime()) / (60 * 60 * 1000 * 24)));
    const obj = {
      total_days,
      current_day
    };
    console.log('totalDays', total_days);
    const dates: any[] = [];
    for (let i: number = 0; i < obj.total_days + 1; i++) {
      dates.push(new Date(d1).setDate(new Date(d1).getDate() + i));
    }
    return dates;
  }
  dataChanged(event) {
    console.log('data change', event);
    this.changeFlag = true;
  }
  changeEvent(event) {
    console.log('asdfasdfas', event);
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
  submit(condition) {
    // if (this.myForm.invalid) {
    //   for (const key in this.f) {
    //     if (this.f.hasOwnProperty(key)) {
    //       const element = this.f[key];
    //       element.markAsTouched();
    //     }
    //   }
    //   return;
    // }
    const request = {
      id: this.details.id,
      // productionStatus: this.producationValue,
      paymentStatus: this.paymentValue,
      // deliveryDate: '2020-09-20'
    };
    if (condition) {
      this.userService.editProductionTracker(request).subscribe(res => {
        if (res.code === 200) {
          if (this.changeFlag) {
            const temp = {
              EnqId: this.details.EnqId,    // enquiry id
              fromId: this.adminId,
              toId: this.details.userId, /* (reciever_id) */
              msg: '',
              files: '',
              type: 'tracker' /* (sample text,image,logistic,invoice,tracker) (optional parameters) */
            };
            console.log('socket request', temp);
            // this.socket.sendMessage(temp);
            sessionStorage.setItem('tracker', '1');
          }
          this.router.navigate(['/orders/chat'], { queryParams: this.details });
        }
      });
    } else {
      this.router.navigate(['/orders/chat'], { queryParams: this.details });
    }
  }

  goToChat() {
    this.router.navigate(['/orders/chat'], { queryParams: this.details });
  }
}
