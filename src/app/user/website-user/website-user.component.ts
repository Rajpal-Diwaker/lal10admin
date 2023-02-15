import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { CrudService } from 'src/app/_services/crud.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { app_strings } from 'src/app/_constants/app_strings';
import { OptionsService } from 'src/app/options/options.service';
import { OnboardingService } from 'src/app/onboarding/onboarding.service';
declare var $: any;
@Component({
  selector: 'app-website-user',
  templateUrl: './website-user.component.html',
  styleUrls: ['./website-user.component.css']
})
export class WebsiteUserComponent implements OnInit {
  productList: any;
  searchkey = '';
  typeofstore: string;
  category: string;
  customerImportant: string;
  typeofstoreList: any;
  importantForCustomer: any;
  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private manageService: OptionsService,
    private onboarding: OnboardingService,
    private router: Router
  ) { }
  listHeaders: any = ['User name', 'Mobile Number', 'Email ID', 'View', 'Status'];
  listArr: any = [];
  listArrbackup: any = [];
  ngOnInit() {
    this.searchkey = '',
      this.typeofstore = '',
      this.category = '',
      this.customerImportant = '';
    this.getProduct();
    this.getwebSiteUser();
    this.getListTypeOfList({ table: app_strings.MODELS.type_of_store });
    this.getListImportforCustomer({ table: app_strings.MODELS.customer_important_sample });
  }
  getListTypeOfList(ob) {
    this.userService.getTypeofStore().subscribe(res => {
      this.typeofstoreList = res.result;
    });
  }
  getListImportforCustomer(ob: any) {
    this.onboarding.listingLoginOnboarding(ob).subscribe(res => {
      this.importantForCustomer = res.result;
    });
  }
  getwebSiteUser() {
    const temp = {
      search: this.searchkey || '',
      typeofstore: this.typeofstore || '',
      category: this.category || '',
      customerImportant: this.customerImportant || ''
    };
    this.userService.getWebUser(temp).subscribe(res => {
      // tslint:disable-next-line: triple-equals
      if (res.code == 200) {
        this.listArr = res.result;
      } else {
        this.listArr = [];
      }
      console.log(this.listArr);
    });
  }
  getProduct() {
    const temp = {
      type: 'products'
    };
    this.manageService.listing(temp).subscribe(res => {
      // tslint:disable-next-line: triple-equals
      if (res.code == 200) {
        this.productList = res.result;
      } else {
        this.productList = [];
      }
    });
  }
  changeStatus(i, status, userId) {
    console.log(i, status, userId);
    const ob = { status, userId };
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
          const ob = {
            type: app_strings.MODELS.users,
            // tslint:disable-next-line: quotemark
            isActive: status === true ? 1 : 0,
            id: userId
          };
          this.userService
            .commonChangeStatus(ob)
            .pipe(take(1))
            .subscribe((_res) => {
            });
        }
      });
  }
  filter(val, type) {
    console.log(val, type);
    switch (type) {
      case 'important':
        this.importantForCustomer = val;
        this.getwebSiteUser();
        break;
      case 'typeofstore':
        this.typeofstore = val;
        this.getwebSiteUser();
        break;
      default:
        this.category = val;
        this.getwebSiteUser();
        break;
    }
  }
  search(val) {
    this.searchkey = val;
    if (this.searchkey.length > 3 || this.searchkey.length === 0) {
      this.getwebSiteUser();
    }
  }
  reset() {
    this.ngOnInit();
  }
}
