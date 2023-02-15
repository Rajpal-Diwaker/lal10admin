import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { CrudService } from 'src/app/_services/crud.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { app_strings } from 'src/app/_constants/app_strings';
declare var $: any;

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})

export class GroupsComponent implements OnInit {
  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private router: Router
  ) { }
  listHeaders: any = [
    'Groups Name',
    'Total Artisans',

    'Created On',
    'Action',
    'Status'
  ];
  listArr: any = [];
  listArrbackup: any = [];
  image_url: any = environment.image_url;
  page = 0;
  limit: any = 10;
  updatePage = 0;
  flickerArr: any = {};
  total: any;
  ngOnInit() {
    this.getlist();
  }
  getlist() {
    let ob = {
      page: this.page
    };
    this.userService.groupProductListing(ob)
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.listArr = result;
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
          .deleteProductGroup(ob)
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
    this.router.navigate(['products/add-group'], { queryParams: val });
  }
  changeStatus(i, status, userId) {
    const ob = { isActive: status === true ? '1' : '0', id: userId, type: app_strings.MODELS.product_group };
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

  changePage(page) {
    this.page = page;
    // if (this.liveCheck) {
    //   this.pliveCondition(this.pliveValue);
    //   return;
    // }
    this.getlist();
  }

}
