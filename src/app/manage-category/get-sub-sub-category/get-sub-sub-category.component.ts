import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { CrudService } from 'src/app/_services/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { app_strings } from 'src/app/_constants/app_strings';
declare var $: any;
@Component({
  selector: 'app-get-sub-sub-category',
  templateUrl: './get-sub-sub-category.component.html',
  styleUrls: ['./get-sub-sub-category.component.css']
})
export class GetSubSubCategoryComponent implements OnInit {
  details: any;
  totalActive: any;
  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  listHeaders: any = ['Image', 'Sub-Category Name', 'Total Products', 'Created on',
    'Action', 'Status'];
  listArr: any = [];
  listArrbackup: any = [];
  image_url: any = environment.image_url;
  page = 0;
  limit: any = 10;
  searchKey: any = '';
  updatePage = 0;
  flickerArr: any = {};
  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.details = params
        this.getList(params);
      });
  }
  getList(params) {
    // const temp={
    //   id:
    // }
    this.userService.getSubSubCategory(params)
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.listArr = result;
        this.totalActive = this.listArr.filter(el => {
          if (el.isActive === 1) {
            return true
          }
        })
        this.listArrbackup = this.listArr;
      });
  }
  def(e, id) {
    this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    const img = 'assets/images/def.png';
    if (!e && this.flickerArr[id] > 1) { return; }
    e.target.src = img;
  }
  delete(id) {
    if (!id) { return; }
    this.crudService.confirmPopup().then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
      } else {
        const ob = {
          type: app_strings.MODELS.category,
          deleted: '0',
          id,
        };
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
    this.searchKey = (e.target.value).toUpperCase();
    this.listArr = this.listArrbackup.filter(el => {
      // if()
      el.name = el.name.toUpperCase();
      if (el.name.includes(this.searchKey)) {
        return true;
      }
    });
  }
  onScroll() {
    ++this.page;
    const temp = this.page * 10;
    this.updatePage = temp;
    this.ngOnInit();
    console.log('scrolled!!', temp);
  }
  download() {
    const exportCSV = [];
    this.listArr.forEach(element => {
      // tslint:disable-next-line: one-variable-per-declaration
      // tslint:disable-next-line: prefer-const
      // tslint:disable-next-line: one-variable-per-declaration
      const Craft = [], Product = [], Material = [];
      element.craft.forEach(el => {
        Craft.push(el.name);
      });
      element.material.forEach(el => {
        Material.push(el.name);
      });
      element.product.forEach(el => {
        Product.push(el.name);
      });
      const temp = {
        ['Artisan name']: element.name || '--',
        ['Artisan number']: element.mobile || '--',
        State: element.stateName,
        Craft: Craft.toString(),
        Material: Material.toString(),
        ['Product fields']: Product.toString()
      };
      exportCSV.push(temp);
    });
    this.userService.exportAsExcelFile(exportCSV, 'artisan-list');
  }
  edit(id) {
    if (!id) { return; }
    // this.crudService.setId(id)
    this.router.navigate(['/managecategory/updatesubsubcategory'], { queryParams: id });
  }
  changeStatus(i, status, id) {
    const ob = { status, id };
    let title;
    if (status) {
      title = 'Are you sure you want to activate?';
    } else { title = 'Are you sure you want to deactivate?'; }
    this.crudService.confirmPopup({ confirmButtonText: 'Yes', text: '', title })
      .then((suc) => {
        // tslint:disable-next-line: triple-equals
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
          ob['isActive'] = status === true ? 1 : 0;
          delete ob.status;
          ob['type'] = app_strings.MODELS.category,
            this.userService
              .commonChangeStatus(ob)
              .pipe(take(1))
              .subscribe((res) => {
                this.ngOnInit();
                // if (!status) {
                //   console.log('ifff', `#switchRoundedSuccess${i}`, status);
                //   $(`#switchRoundedSuccess${i}`).prop('checked', false);
                // } else {
                //   console.log('else', `#switchRoundedSuccess${i}`, status);
                //   $(`#switchRoundedSuccess${i}`).prop('checked', true);
                // }
              });
        }
      });
  }
}
