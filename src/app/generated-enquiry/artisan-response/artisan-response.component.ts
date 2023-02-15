import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { CrudService } from 'src/app/_services/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { app_strings } from 'src/app/_constants/app_strings';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/_services/socket.service';
declare var $: any;
@Component({
  selector: 'app-artisan-response',
  templateUrl: './artisan-response.component.html',
  styleUrls: ['./artisan-response.component.css']
})
export class ArtisanResponseComponent implements OnInit, OnDestroy {
  total = 0;
  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private router: Router,
    private route: ActivatedRoute,
    private socket: SocketService

  ) { }
  listHeaders: any = ['Profile image', 'Artisan Name', 'Mobile Number', 'State',
    'Total Enquires', 'Total Order', 'Action'];
  listArr: any = [];
  listArrbackup: any = [];
  image_url: any = environment.image_url;
  page = 1;
  limit: any = 10;
  searchKey: any = '';
  updatePage = 0;
  flickerArr: any = {};
  paramVal;
  receiveSubscribe: Subscription;
  adminId = '1';
  pageNew = 1;
  ngOnInit() {

    this.route.queryParams
    .subscribe(params => {
      console.log(params); // {order: "popular"}
      this.paramVal = params;
      this.pageNew = params.page;
      this.listing(this.paramVal)
    });
    const adminInfo = {
      fromId: this.adminId
    };
    // this.socket.initChat(adminInfo);
    this.receiveSubscribe = this.socket.receiveEnquiryListChatON().subscribe(response => {
      // debugger
      console.log('response', response);
      let res = response.result;
      for (let i = 0; i < this.listArr.length; i++) {
        if (Number(this.listArr[i].EnqId) == Number(res.EnqId)) {
          if (Number(this.listArr[i].userId) == Number(res.fromId)) {
            this.listArr[i].chatCount += 1;
            break;
          } else {
            if (this.listArr.length-1 === i) {
              // debugger
              this.listing(this.paramVal)
            }
          }
        }
      }
      // this.listArr.forEach((element, i) => {
      //   // console.log('element>>>>', element);
      //   console.log('element>>>>', element.EnqId, res.EnqId, element.userId, res.fromId);
      //   if (Number(element.EnqId) == Number(res.EnqId)) {
      //     if (Number(element.userId) == Number(res.fromId)) {
      //       element.chatCount += 1;

      //     } else {
      //       if (this.listArr.length-1 === i) {
      //         debugger
      //         this.listing(this.paramVal)
      //       }
      //     }
      //     // console.log('>>>>>>>check');

      //   }
      // });
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
  listing(val) {
    // val.page = this.page;
    this.userService.viewEnquiryArtisan(val, this.page)
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.listArr = result;
        this.total = res.total;
        this.listArrbackup = this.listArr;
      });
  }
  def(e: { target: { src: string; }; }, id: string | number) {
    this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    const img = 'assets/images/def.png';
    if (!e && this.flickerArr[id] > 1) { return; }
    e.target.src = img;
  }
  changePage(val) {
    console.log(val);
    this.page = val;
    this.listing(this.paramVal);
  }

  ngOnDestroy() {
    if (this.pageNew) {
      sessionStorage.setItem('genEnqPage', JSON.stringify(this.pageNew));
      sessionStorage.setItem('genEnqFocus', JSON.stringify(this.paramVal.id));
    }
    this.socket.removeListerner('receiveEnquiryListChat');
    this.receiveSubscribe.unsubscribe();
  }
}
