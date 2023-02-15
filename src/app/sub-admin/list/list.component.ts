import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserService } from 'src/app/_services/user.service';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/_services/crud.service';
import { app_strings } from 'src/app/_constants/app_strings';
import * as _ from 'lodash';
declare var $: any;
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
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
    private router: Router
  ) { }
  listHeaders: any = ['Profile image', 'Sub admin Name', 'Mobile Number', 'Group Name', 'Total Group',
    'Total Artisan', 'Action', 'Status'];
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
    this.searchKeyWord = '';
    this.getList();
  }
  getList() {
    const temp = {
      pageNumber: this.page,
      state: this.state || '',
      material: this.material || '',
      craft: this.craft || '',
      product: this.product || '',
      search: this.searchKeyWord
    };
    this.userService.getSubAdminList()
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
  delete(id: any) {
    if (!id) { return; }
    this.crudService.confirmPopup().then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
      } else {
        const ob = {
          type: app_strings.MODELS.users,
          id,
        };
        this.crudService
          .deleteEntity(ob)
          .pipe(take(1))
          .subscribe(() => {
            this.ngOnInit();
          });
      }
    });
  }
  search() {
    if (this.searchKeyWord.length > 0) {
      this.getList();
    }
    if (this.searchKeyWord.length === 0) {
      this.getList();
    }
  }
  edit(id: any) {
    console.log(id)
    if (!id) { return; }
    // this.crudService.setId(id)
    this.router.navigate(['/subadmin/update'], { queryParams:id });
  }
  changeStatus(i: any, status: any, userId: any) {
    const ob = { isActive: status === true ? '1' : '0', id: userId, type: app_strings.MODELS.users };
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
            .commonChangeStatus(ob)
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
    this.getList();
  }
  sort(sort: any, col: string) {
    /* listHeaders: any = ['Profile image', 'Artisans Name', 'Mobile Number', 'Email ID', 'State',
    'Total Enquiry', 'Total Orders', 'Action', 'Status']; */
    console.log(sort, col);
    if (col === 'Artisans Name') {
      col = 'name';
      this.listArr = _.orderBy(this.listArr, [col], [sort]);
    }
    if (col === 'Total Enquiry') {
      col = 'totalEnq';
      this.listArr = _.orderBy(this.listArr, [col], [sort]);
    }
    if (col === 'Total Orders') {
      col = 'totalOrders';
      this.listArr = _.orderBy(this.listArr, [col], [sort]);
    }
    // if (col === 'Total Enquiry') {
    //   col='name'
    //   this.listArr = _.orderBy(this.listArr, [col], [sort]);
    // }
  }
  reset() {
    this.ngOnInit();
  }
}
