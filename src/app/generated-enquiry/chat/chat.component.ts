import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/_services/socket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/_services/user.service';
import { app_strings } from 'src/app/_constants/app_strings';
import * as _ from 'lodash';
import { subscribeOn, distinct, distinctUntilChanged } from 'rxjs/operators';

declare var $: any;
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  details: any;
  myForm: FormGroup;
  listArr = [];
  submitted = false;
  // adminId = localStorage.getItem('x-id');
  adminId = '1';
  receiveSubscribe: Subscription;
  bluetrickSubscribe: Subscription;
  temp: { EnqId: any; /* enquiry Id */ fromId: string; /* (sender_id) */ toId: any; /* (reciever_id) */ limit: number; offset: number; };
  readTikSubscribe: Subscription;
  imagesObj: any;
  page = 0;
  load = true;
  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private socket: SocketService, private userService: UserService) { }
  ngOnInit() {
    this.createForm();
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // {order: "popular"}
        this.details = params;
      });
    const adminInfo = {
      fromId: this.adminId
    };
    this.temp = {
      EnqId: this.details.EnqId,  /* enquiry Id */
      fromId: adminInfo.fromId, /* (sender_id) */
      toId: this.details.userId, /* (reciever_id) */
      limit: 1000,
      offset: this.page,
    };
    /* socket calling */
    // this.socket.initChat(adminInfo); /* online on emitter */
    this.socket.windowOn(this.temp);
    this.getList(this.temp);
    this.receiveSubscribe = this.socket.receiveMessageON().subscribe(res => {
      console.log('response', res);
      // tslint:disable-next-line: max-line-length
      if (((res.result.toId === Number(this.details.userId) || res.result.fromId === Number(this.details.userId)) && res.result.EnqId === Number(this.details.EnqId))) {
        console.log('udpated');
        // this.socket.readMessage(this.temp);
        if (res.result.type === 'image') {
          res.result.files = res.result.files.split(',');
        }
        this.listArr.push(res.result);
        $('.chat_screencontent').animate({ scrollTop: $('.chat_screencontent')[0].scrollHeight }, 'slow');
      }
    });
    this.socket.getMessageON().subscribe(res => {
      console.log('getmessag check', res);
      let demo = res.result;
      // this.listArr.push(res.result);
      // console.log(this.listArr)
      // this.listArr = this.listArr.concat(res.result.reverse());

      const temp = demo.filter(el => {
        if (el.type === 'image' || el.type === 'general') {

          if (typeof el.files == typeof "")
            el.files = el.files.split(',');
          // el.files = el.files;
          return true;
        } else { return true; }
      });

      this.listArr = temp.concat(this.listArr);
      this.listArr = _.orderBy(this.listArr, ['id'], ['asc']);


      // this.listArr = [...res.result, ...this.listArr];
      // console.log('this is list array', this.listArr);
      if (this.load) {
        this.load = false;
        console.log(this.page, 'page move');
        setTimeout(() => {
          $('.chat_screencontent').animate({ scrollTop: $('.chat_screencontent')[0].scrollHeight }, 'slow');
        }, 500);
      }
    });
    this.socket.errormessage().subscribe(res => {
      console.log('user messgae', res);
    });
    // this.socket.readMessage(this.temp);
    this.bluetrickSubscribe = this.socket.blueTikON().subscribe(result => {
      console.log('blue tik', result);
      // tslint:disable-next-line: max-line-length
      if (((result.toId == (this.details.userId) || result.fromId == (this.details.userId)) && result.EnqId == (this.details.EnqId))) {
        this.listArr = this.listArr.filter(el => {
          el.isRead = 2;
          return true;
        });
      }
    });
    this.readTikSubscribe = this.socket.readTikON().subscribe(res => {
      console.log('readTik', res);
      this.listArr = this.listArr.filter(el => {
        if (el.isRead === 0 || el.isRead === '0') {
          el.isRead = 1;
          return true;
        } else {
          return true;
        }
      });
    });
  }
  createForm() {
    this.myForm = this.fb.group({
      msg: ['', Validators.compose([Validators.required])],
      files: [''],
      type: ['text', Validators.compose([Validators.required])],
    });

  }
  get f() {
    return this.myForm.controls;
  }
  send(val) {


    this.myForm.get('msg').setValue(this.myForm.get('msg').value.trim())

    if (this.myForm.invalid) {
      this.submitted = true;
      return true;
    }
    this.submitted = false;
    const temp = {
      EnqId: this.details.EnqId,    // enquiry id
      fromId: this.adminId,
      toId: this.details.userId, /* (reciever_id) */
      msg: val.msg,
      files: val.files,
      type: val.type /* (sample text,image,logistic,invoice,tracker) (optional parameters) */
    };
    console.log(temp);
    this.socket.sendMessage(temp);
    this.createForm();
  }
  getList(val) {
    this.socket.getMessage(val);
  }
  onScroll(val) {
    if (val === 0) {
      // console.log(val);
      this.page = this.page + 10;
      this.temp.offset = this.page;
      // console.log(this.temp);
      this.getList(this.temp);
    }
  }
  fileUpload(e) {
    const file = e.target.files[0];
    this.imagesObj = file;
    const fd = new FormData();
    fd.append('files', this.imagesObj);
    this.userService.uploadMedia(fd).subscribe(el => {
      if (el.code === 200) {
        this.myForm.get('files').setValue(el.result.filename[0]);
        this.myForm.get('type').setValue('image');
        this.myForm.get('msg').clearValidators();
        this.myForm.get('msg').updateValueAndValidity();
        this.send(this.myForm.value);
      }
    });
  }
  purchaseOrder() {
    const temp = {
      table: app_strings.MODELS.purchaseOrder,
      id: this.details.EnqId,
      assignUserId: this.details.userId
    };
    this.userService.checkPDF(temp).subscribe(res => {
      if (res.result === '') {
        this.userService.bug(app_strings.pleaseUploadPurchaseOrder);
        this.router.navigate(['/generated-enquiry/purchaseOrder'], { queryParams: this.details });

      } else {

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
        }
      });
      }
    });
  }
  estimate() {
    const temp = {
      table: app_strings.MODELS.estimate,
      id: this.details.EnqId,
      assignUserId: this.details.userId
    };
    this.userService.checkPDF(temp).subscribe(res => {
      if (res.result === '') {
        this.userService.bug(app_strings.pleaseUploadEstimateOrder);
        this.router.navigate(['/generated-enquiry/estimateOrder'], { queryParams: this.details });

      } else {
        this.userService.downloadPdf(res.result, 'estimate order');
        const request = {
          EnqId: this.details.EnqId,    // enquiry id
          fromId: this.adminId,
          toId: this.details.userId, /* (reciever_id) */
          msg: '',
          files: res.result,
          type: 'estimate' /* (sample 'text','image','logistic','invoice','tracker','purchase','estimate') (optional parameters) */
        };
        this.socket.sendMessage(request);
        window.open(res.result, '_blank');
      }
    });
  }

  blankMsg(val) {

    this.myForm.get('msg').setValue(val.trim())
  }
  ngOnDestroy() {
    console.log('destroy');
    this.socket.windowOff(this.temp);
    // this.bluetrickSubscribe.unsubscribe();
    // this.receiveSubscribe.unsubscribe();
    this.socket.removeListerner('receiveMessage');
    this.socket.removeListerner('readTik');
    this.socket.removeListerner('receiveOrderChat');
    this.socket.removeListerner('receiveEnquiryChat');
    this.socket.removeListerner('blueTik');
    // this.socket.disconnect();
  }
  // onfileupload(){
  //   var filenames = Array.from(this.files).map(function(f) {
  //     return f.name;
  //   });
  //   console.log(filenames);
  // }

  showImage(imageUrl) {
    if (!imageUrl) { return; }
    this.userService.showImage(imageUrl);
  }
  openURL(url) {
    window.open(url, '_blank');
  }
  clickToCallKnowlarity() {
    const ob = {
      k_number: '+918047275792',
      agent_number: '+918047275793',
      customer_number: `+91${this.details.mobile}`,
      caller_id: '+918047275795'
    };
    this.userService.showLoader();
    this.userService.callKnowlarity(ob).subscribe(res => {
      if (res && res.success.status === 'success') {
        this.userService.hideLoder();
        this.userService.success(res.success.message);
      } else {
        this.userService.hideLoder();
        this.userService.error(res.message);
      }
    });
  }

  confirmPopup(title1: string, type: string) {
    this.userService.confirmPopup({ confirmButtonText: 'Yes',
  text: '', title: title1 }).then((result) => {
    if (result.value) {
      switch (type) {
        case 'CALL':
          this.clickToCallKnowlarity();
          break;

        default:
          break;
      }
    } else {
      // do something on cancel
    }
  });
  }
}
