import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { CrudService } from 'src/app/_services/crud.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { app_strings } from 'src/app/_constants/app_strings';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-get-group-list',
  templateUrl: './get-group-list.component.html',
  styleUrls: ['./get-group-list.component.css']
})
export class GetGroupListComponent implements OnInit {
  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private router: Router
  ) { }
  listHeaders: any = ['Group Name', 'Total Artisans', 'Created On', 'Action', ' status'];
  listArr: any = [];
  listArrbackup: any = [];
  image_url: any = environment.image_url;
  page = 1;
  limit: any = 10;
  updatePage = 0;
  flickerArr: any = {};
  total: any;
  colName = '';
  sortby = '';
  ngOnInit() {
    this.getlist();
  }
  getlist() {
    let ob = {
      page: this.page,
      order: this.sortby,
      sort: this.colName
    };
    if (!this.sortby) {
      delete ob.order;
      delete ob.sort;
    }
    this.userService.getGroupListArtisan2(ob)
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.listArr = result.filter(el => {

          el.total_artisanSUM = el.total_artisan.length;
          return true;
        })
        this.listArr = result
        this.listArrbackup = this.listArr;
        this.total = result.total;
      });
  }
  delete(id) {
    if (!id) { return; }
    this.crudService.confirmPopup().then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
      } else {
        const ob = {
          type: app_strings.MODELS.users,
          id,
        };
        this.userService
          .deleteGroupArtisan(ob)
          .pipe(take(1))
          .subscribe((res) => {
            this.ngOnInit();
          });
      }
    });
  }
  edit(val) {
    if (!val) { return; }
    // this.crudService.setId(id)
    this.router.navigate(['/artisan/addgroup'], { queryParams: val });
  }
  changeStatus(i, status, userId) {
    const ob = { isActive: status === true ? '1' : '0', id: userId, type: app_strings.MODELS.artisan_group };

    let title;
    if (status) {
      title = 'Are you sure you want to activate?';
    } else { title = 'Are you sure you want to deactivate?'; }
    this.crudService.confirmPopup({ confirmButtonText: 'Yes', text: '', title })
      .then((suc) => {
        if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
          // console.log(`#switchRoundedSuccess${i}`,status,$(`#switchRoundedSuccess0`).prop('checked',true))
          if (status) {
            console.log('ifff', `#switchRoundedSuccess${i}`, status);
            $(`#switchRoundedSuccess${i}`).prop('checked', false);
          } else {
            console.log('else', `#switchRoundedSuccess${i}`, status);
            $(`#switchRoundedSuccess${i}`).prop('checked', true);
          }
        } else {
          this.userService
            .commonChangeStatus(ob)
            .pipe(take(1))
            .subscribe((res) => {
              this.ngOnInit();
            });
        }
      });
  }
  sort(sort: any, col: string) {
    // listHeaders: any = ['Group Name', 'Total Artisans', 'Created On', 'Action', ' status'];
    this.page = 1;
    this.sortby = sort;
    console.log(sort, col);
    if (col === 'Group Name') {
      this.colName = 'group_name';
      // this.listArr = _.orderBy(this.listArrbackup, [col], [sort]);
      this.getlist();
    }
    if (col === 'Total Artisans') {
      this.colName = 'total_artisan';
      // this.listArr = _.orderBy(this.listArrbackup, [col], [sort]);
      this.getlist();
    }
    if (col === 'Created On') {
      this.colName = 'created_at';
      // this.listArr = _.orderBy(this.listArrbackup, [col], [sort]);
      this.getlist();
    }
    // if (col === 'Total Inquiries') {
    //   col='name'
    //   this.listArr = _.orderBy(this.listArr, [col], [sort]);
    // }
  }

  changePage(page) {
    this.page = page;
    // if (this.liveCheck) {
    //   this.pliveCondition(this.pliveValue);
    //   return;
    // }
    this.getlist();
  }

}
