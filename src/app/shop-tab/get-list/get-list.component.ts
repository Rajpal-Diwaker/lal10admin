import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/_services/crud.service';
import { environment } from 'src/environments/environment';
import { Options } from '@angular-slider/ngx-slider';
import { app_strings } from 'src/app/_constants/app_strings';
import { filter } from 'src/app/_interfaces/filter';
import { take } from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'app-get-list',
  templateUrl: './get-list.component.html',
  styleUrls: ['./get-list.component.css']
})
export class GetListComponent implements OnInit {
  page = 1;
  total: any;
  constructor(
    private userService: UserService,
    private router: Router,
    private crudService: CrudService
  ) { }
  listHeaders: any = [
    'Image',
    'Products Name',
    'Artisans Name',
    'Amount',
    'Inventory QTY.',
    'Material Used',
    'view',
    'Action'
  ];
  listArr: any = [];
  listArrbackup: any = [];
  image_url: any = environment.image_url;
  value = 100;
  options: Options = {
    floor: 0,
    ceil: 200
  };
  liveFilter: any = '';
  flickerArr: any = {};
  ngOnInit() {
    this.getList();
  }
  filterListing(ob: filter) {
    console.log(ob);
    this.crudService
      .filterEntity(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.listArr = result;
      });
  }
  dataChanged(e, type) {
    console.log(e, type);
    switch (type) {
      case 'live':
        const ob: filter = { val: +e, modelType: app_strings.MODELS.products, col: 'isActive' };
        this.filterListing(ob);
        break;
      case 'price':
        const ob_price: filter = { val: `0-${e}`, modelType: app_strings.MODELS.products, col: 'amount' };
        this.filterListing(ob_price);
        break;
      case 'user':
        const ob_user: filter = { val: +e.target.value, modelType: app_strings.MODELS.products, col: 'userId' };
        this.filterListing(ob_user);
        break;
      default:
        break;
    }
  }
  def(e, id) {
    this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    const img = 'assets/images/def.png';
    if (!e && this.flickerArr[id] > 1) { return; }
    e.target.src = img;
  }
  getList() {
    const temp = {
      page: this.page
    };
    this.userService
      .getShop(temp)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.listArr = result;
        this.listArrbackup = result;
        this.total = res.total;
      });
  }
  changeStatus(isActive, id) {
    /* Are you sure you want to deactivate?
Are you sure you want to activate? */
    let title;
    const ob = { type: 'products', isActive: isActive ? 1 : 0, id };
    if (isActive) {
      title = 'Are you sure you want to activate?';
    } else { title = 'Are you sure you want to deactivate?'; }
    this.crudService.confirmPopup({ confirmButtonText: 'Yes', text: '', title })
      .then((suc) => {
        if (suc && (suc.dismiss === 'backdrop' || suc.dismiss === 'cancel')) {
          if (isActive) {
            $(`#switchRoundedSuccess${id}`).prop('checked', false);
          } else {
            $(`#switchRoundedSuccess${id}`).prop('checked', true);
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
  search(e) {
    // const val = e.target.value;
    // this.listArr = this.listArrbackup.filter(
    //   (res) => res.name.indexOf(val) >= 0
    // );
    const val = (e.target.value).toUpperCase();
    this.listArr = this.listArrbackup.filter(el=>{
      // (res) => res.name.indexOf(val) >= 0
      // el.name = el.name.toUpperCase();
      if (el.name.toUpperCase().includes(val)) {
        return true;
      }
    });
  }
  edit(id) {
    if (!id) { return; }
    // this.crudService.setId(id)
    this.router.navigate(['/shop/edit'], { queryParams: { id } });
  }
  download() {
    const temp = ([] = this.listArr);
    this.userService.exportAsExcelFile(temp, 'Shop-list');
  }
  changePage(page) {
    this.page = page;
    this.ngOnInit();
  }
}
