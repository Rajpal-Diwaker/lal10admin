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
    private manageListingService: OptionsService,
    private router: Router
  ) { }
  listHeaders: any = ['Image', 'Order-ID', 'Product Name', 'Order by Name ', 'Amount',
    'Placed on ','Generate Invoice', 'Action'];
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
    this.artisanListing();
  }
  artisanListing() {
    this.userService.getWebsiteOrderList()
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
  download() {
    this.userService.listingArtisan({})
      .pipe(take(1))
      .subscribe(res => {
        const exportCSV = [];
        // tslint:disable-next-line: max-line-length
        res.result.forEach((element: { email: any[]; craft: any[]; material: any[]; product: any[]; name: any; mobile: any; stateName: any; }) => {
          // tslint:disable-next-line: one-variable-per-declaration
          const Craft = [], Product = [], Material = [];
          element.craft.forEach((el: { name: any; }) => {
            Craft.push(el.name);
          });
          element.material.forEach((el: { name: any; }) => {
            Material.push(el.name);
          });
          element.product.forEach((el: { name: any; }) => {
            Product.push(el.name);
          });
          const temp = {
            ['Artisan name']: element.name || '--',
            ['Artisan email']: element.email || '--',
            ['Artisan number']: element.mobile || '--',
            State: element.stateName,
            Craft: Craft.toString(),
            Material: Material.toString(),
            ['Product fields']: Product.toString()
          };
          exportCSV.push(temp);
        });
        this.userService.exportAsExcelFile(exportCSV, 'artisan-list');
      });
  }
  edit(id: any) {
    if (!id) { return; }
    this.router.navigate(['/websiteOrders/details'], { queryParams:id });
  }
  generateInvoice(id: any) {
    if (!id) { return; }
    this.router.navigate(['/websiteOrders/generateInvoice'], { queryParams: id });
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
    this.artisanListing();
  }
}
