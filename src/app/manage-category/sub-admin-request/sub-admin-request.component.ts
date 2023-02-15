import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { CrudService } from 'src/app/_services/crud.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { app_strings } from 'src/app/_constants/app_strings';
declare var $: any;

@Component({
  selector: 'app-sub-admin-request',
  templateUrl: './sub-admin-request.component.html',
  styleUrls: ['./sub-admin-request.component.css']
})
export class SubAdminRequestComponent implements OnInit {
  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private router: Router
  ) { }
  listHeaders: any = ['Category image', 'Sub-admin Name', 'Mobile Number', 'Email ID', 'Cateogry Name', 'Sub-category Name',
  'Verify'];
  listArr: any = [];
  listArrbackup: any = [];
  image_url: any = environment.image_url;
  page = 0;
  limit: any = 10;
  searchKey: any = '';
  updatePage = 0;
  flickerArr: any = {};
  ngOnInit() {
    this.artisanListing();
  }
  artisanListing() {
    this.userService.viewSubAdminCategorylist()
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.listArr = result;
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
          type: app_strings.MODELS.users,
          id,
        };
        this.crudService
          .deleteEntity(ob)
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
      let Craft = [], Product = [], Material = [];

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
    this.router.navigate(['/artisan/add'], { queryParams: { id } });
  }
  changeStatus(i: any, status: any, userId: any) {
    const ob = { verified: status === true ? '1' : '0', id: userId, type: app_strings.MODELS.category };
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
            .subscribe((res) => {
              if (res && res.code === 200) {
                this.userService.success(res.message);
                // this.ngOnInit();
              }
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

}
