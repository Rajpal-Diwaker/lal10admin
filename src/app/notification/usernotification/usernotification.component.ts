import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserService } from 'src/app/_services/user.service';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/_services/crud.service';
import { app_strings } from 'src/app/_constants/app_strings';
import * as _ from 'lodash';
import { OptionsService } from 'src/app/options/options.service';
declare var $: any;
@Component({
  selector: 'app-usernotification',
  templateUrl: './usernotification.component.html',
  styleUrls: ['./usernotification.component.css']
})
export class UsernotificationComponent implements OnInit {
  total = 0;
  craftType: any;
  CraftList: any;
  productList: any;
  materialList: any;
  stateList: any;
  searchKeyWord: string;
  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private manageListingService: OptionsService,
    private router: Router
  ) { }
  listHeaders: any = ['Notification Type', 'ArtisanName', 'Description', 'Send-on ',
   ];
  listArr: any = [];
  listArrbackup: any = [];
  image_url: any = environment.image_url;
  page = 1;
  limit: any = 10;
  searchKey: any = '';
  updatePage = 0;
  flickerArr: any = {};
  state: any;
  material: any;
  product: any;
  craft: any;
  ngOnInit() {
    this.getlist();
  }
  getlist() {
    this.userService.getUserNotificationList()
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.listArr = result;
        this.total = this.listArr.lenght;
        this.listArrbackup = this.listArr;
      });
  }
  delete(id: any) {
    if (!id) { return; }
    this.crudService.confirmPopup().then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
      } else {
        const ob = {
          id,
        };
        this.userService
          .deleteNotification(ob)
          .pipe(take(1))
          .subscribe(() => {
            this.ngOnInit();
          });
      }
    });
  }
  edit(id: any) {
    if (!id) { return; }
    this.router.navigate(['/websiteOrders/details'], { queryParams: id });
  }
  generateInvoice(id: any) {
    if (!id) { return; }
    this.router.navigate(['/websiteOrders/generateInvoice'], { queryParams: id });
  }
  changeStatus(i: any, status: any, userId: any) {
    const ob = { isActive: status === true ? '1' : '0', id: userId };
    let title: string;
    if (status) {
      title = 'Are you sure you want to activate?';
    } else { title = 'Are you sure you want to deactivate?'; }
    this.crudService.confirmPopup({ confirmButtonText: 'Yes', text: '', title })
      .then((suc) => {
        // tslint:disable-next-line: triple-equals
        if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
          // console.log(`#switchRoundedSuccess${i}`,status,$(`#switchRoundedSuccess0`).prop('checked',true))
          if (status) {
            $(`#switchRoundedSuccess${i}`).prop('checked', false);
          } else {
            $(`#switchRoundedSuccess${i}`).prop('checked', true);
          }
        } else {
          this.userService
            .repeatNotification(ob)
            .pipe(take(1))
            .subscribe(() => {
              // this.ngOnInit();
              if (status) {
                $(`#switchRoundedSuccess${i}`).prop('checked', true);
              } else {
                $(`#switchRoundedSuccess${i}`).prop('checked', false);
              }
            });
        }
      });
  }
  changePage(val: number) {
    console.log(val);
    this.page = val;
    // this.getlist();
  }
}
