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
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
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
  listHeaders: any = ['Image', 'Artisans Name', 'Title', 'Total Awards', 'Status',
    'publish on NewsFeeds'];
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
    this.state = '';
    this.material = '';
    this.product = '';
    this.craft = '';
    this.artisanListing();

  }
  artisanListing() {
    let request = {
      search: this.searchKeyWord
    }
    this.userService.getAwardsList(request)
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
      this.artisanListing();
    }
    if (this.searchKeyWord.length === 0) {
      this.artisanListing();
    }
  }


  edit(id: any) {
    if (!id) { return; }
    // this.crudService.setId(id)
    this.router.navigate(['/awards/details'], { queryParams: id});
  }
  changeStatus(i: any, status: any, userId: any) {
    const ob = { isActive: status === true ? '1' : '0', id: userId, type: app_strings.MODELS.awards };
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
  publishOnweb(i: any, status: any, userId: any) {
    const ob = { isPublished: status === true ? '1' : '0', id: userId };
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
            $(`#publish${i}`).prop('checked', false);
          } else {
            $(`#publish${i}`).prop('checked', true);
          }
        } else {
          this.userService
            .publishAwardToNewsFeed(ob)
            .pipe(take(1))
            .subscribe(() => {
              // this.ngOnInit();
              if (status) {
                $(`#publish${i}`).prop('checked', true);
              } else {
                $(`#publish${i}`).prop('checked', false);
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
  filter(val: any, type: any) {
    console.log(val, type);
    switch (type) {
      case 'craft':
        this.craft = val;
        this.artisanListing();
        break;
      case 'material':
        this.material = val;
        this.artisanListing();
        break;
      case 'state':
        this.state = val;
        this.artisanListing();
        break;
      default:
        this.product = val;
        this.artisanListing();
        break;
    }
  }
  reset() {
    this.ngOnInit();
  }

}
