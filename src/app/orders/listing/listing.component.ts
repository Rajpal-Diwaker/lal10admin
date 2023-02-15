import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { CrudService } from 'src/app/_services/crud.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import { SocketService } from 'src/app/_services/socket.service';
import { Subscription } from 'rxjs';

declare let $: any;
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit, OnDestroy {
  listHeaders: any = ['Image', 'Order ID', 'Title', 'Artisans Name', 'Amount', 'Placed On', 'Action', 'Chat'];
  page = 1;
  listArr: any;
  total: any;
  receiveSubscribe: Subscription;
  focusID = 0;
  // adminId = '1';
  colName = '';
  sortby = '';
  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private router: Router,
    private socket: SocketService
  ) { }
  ngOnInit() {
    const pageNumber = JSON.parse(sessionStorage.getItem('orderPage'));
    sessionStorage.removeItem('orderPage');
    if (pageNumber) {
      this.page = Number(pageNumber);
    }
    this.getOrderlist();
    // const adminInfo = {
    //   fromId: this.adminId
    // };
    // this.socket.initChat(adminInfo);
    this.receiveSubscribe = this.socket.receiveOrderListChatON().subscribe(response => {
      // debugger
      console.log('response', response);
      let res = response.result;
      // for (let i = 0; i < this.listArr.length; i++) {
      //   if (Number(this.listArr[i].EnqId) == Number(res.EnqId)) {
      //     if (Number(this.listArr[i].userId) == Number(res.fromId)) {
      //       this.listArr[i].chatCount += 1;
      //       break;
      //     } else {
      //       if (this.listArr.length-1 === i) {
      //         // debugger
      //         this.getOrderlist()
      //       }
      //     }
      //   }
      // }
      this.listArr.forEach(element => {
        // console.log('element>>>>', element);
        // console.log('element>>>>', element.EnqId, res.EnqId, element.userId, res.fromId);
        if (Number(element.EnqId) == Number(res.EnqId) && Number(element.userId) == Number(res.fromId)) {
          // console.log('>>>>>>>check');
          element.chatCount += 1;
        }
      });
      // tslint:disable-next-line: max-line-length
      // if (((res.result.toId === Number(this.details.userId) || res.result.fromId === Number(this.details.userId)) && res.result.EnqId === Number(this.details.EnqId))) {
      //   console.log('udpated');
      //   // this.socket.readMessage(this.temp);
      //   if (res.result.type === 'image') {
      //     res.result.files = res.result.files.split(',');
      //   }
      //   this.listArr.push(res.result);
      //   // $('.chat_screencontent').animate({ scrollTop: $('.chat_screencontent')[0].scrollHeight }, 'slow');
      // }
    });
  }
  getOrderlist() {
    let ob = {
      page: this.page,
      order: this.sortby,
      sort: this.colName
    };
    if (!this.sortby) {
      delete ob.order;
      delete ob.sort;
    }
    this.focusID = 0;
    this.userService.getOrderList(ob)
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.listArr = result;
        this.total = result.total;
        this.focusID = JSON.parse(sessionStorage.getItem('orderFocus'));
        sessionStorage.removeItem('orderFocus');
        if (this.focusID) {
          setTimeout(() => {
            $('html, body').animate({
              scrollTop: $('#k' + this.focusID).offset().top - 350
          }, 500);
          }, 1500);
        }
      });
  }
  sort(sort: any, col: string) {
    // listHeaders: any = ['Image', 'Order ID', 'Title', 'Artisans Name', 'Amount', 'Placed On', 'Action', 'Chat']
    this.page = 1;
    this.sortby = sort;
    console.log(sort, col);
    if (col === 'Artisans Name') {
      this.colName = 'artisanName';
      // this.listArr = _.orderBy(this.listArr, [col], [sort]);
      this.getOrderlist();
    }
    if (col === 'Amount') {
      this.colName = 'expPrice';
      // this.listArr = _.orderBy(this.listArr, [col], [sort]);
      this.getOrderlist();
    }
    // if (col === 'Total Inquiries') {
    //   col='name'
    //   this.listArr = _.orderBy(this.listArr, [col], [sort]);
    // }
  }
  download() {
    if (this.listArr.length) {
      const exportData = this.listArr.filter(res => {
        delete res.id;
        delete res.adminId;
        delete res.userId;
        delete res.chatCount;
        delete res.update_status;
        return true;
      });
      this.userService.exportAsExcelFile(exportData, 'Export-Orders');
    }
    else {
      this.userService.bug('No Record found');
    }
  }

  changePage(page) {
    this.page = page;
    // if (this.liveCheck) {
    //   this.pliveCondition(this.pliveValue);
    //   return;
    // }
    this.getOrderlist();
  }
  ngOnDestroy() {
    this.socket.removeListerner('receiveOrderListChat');
    this.receiveSubscribe.unsubscribe();
  }
}
