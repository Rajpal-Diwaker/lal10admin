import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';
import { CrudService } from 'src/app/_services/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { Options } from '@angular-slider/ngx-slider';
import { filter } from 'src/app/_interfaces/filter';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-groupsadd',
  templateUrl: './groupsadd.component.html',
  styleUrls: ['./groupsadd.component.css']
})
export class GroupsaddComponent implements OnInit {
  formgroup: FormGroup;
  submitted: boolean;
  editFlag: boolean;
  liveFilter: any = '';
  value = 1000;
  options: Options = {
    floor: 0,
    ceil: 2000
  };
  params: any;
  pliveValue: any;
  priceFilter: any;
  searchKeyWord: string;
  refresh: void;
  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private route: ActivatedRoute,
    private router: Router,
    // tslint:disable-next-line: variable-name
    private _fb: FormBuilder
  ) {
    this.createGroup();
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        if (params.id) {
          this.editFlag = true;
          this.params = params;
          this.formgroup.get('groupName').setValue(this.params.group_name);
        }
      });
  }
  listHeaders: any = ['image', 'Product Name', 'Amount', 'inventory QTY', 'Material',
    'Uploaded by', 'Action'];
  listArr: any = [];
  image_url: any = environment.image_url;
  page = 1;
  limit: any = 10;
  searchKey: any = '';
  updatePage = 0;
  flickerArr: any = {};
  total: any;
  ngOnInit() {
    this.getList();
  }
  createGroup() {
    this.formgroup = this._fb.group({
      table: this._fb.array([]),
      groupName: ['', Validators.required]
    });
  }
  get f() { return this.formgroup.controls; }
  createItem(obj): FormGroup {
    return this._fb.group(obj);
  }
  addItem(obj): void {
    const temp = this.formgroup.get('table') as FormArray;
    temp.push(this.createItem(obj));
  }
  getList() {
    const temp = {
      plive: this.pliveValue,
      page: this.page,
      price: this.priceFilter,
      userId: this.userService.getUserId() || localStorage.get('x-id'),
      search: this.searchKeyWord
    };
    this.userService
      .listingProductPagination(temp)
      .pipe(take(1))
      .subscribe((res) => {
        // this.createGroup()
        const { result } = res;
        this.listArr = result;
        this.total = res.total;
        this.listArr.forEach(element => {
          if (this.editFlag === true && this.params.total_product.split(',').indexOf((element.id).toString()) > -1) {
            element.check = true;
          } else {
            element.check = false;
          }
          this.addItem(element);
        });

        const newArr = _.orderBy(this.listArr, ['check'], ['desc']);
        this.formgroup.get('table').setValue(newArr);


        const ref = new Subject<void>();
        const newOptions: Options = Object.assign({}, this.options);
        newOptions.floor = 0;
        newOptions.ceil = result[0].maxAmount;
        this.options = newOptions;
        this.refresh = ref.next();


      });
  }
  dataChanged(e, type) {
    // console.log(e, type);
    switch (type) {
      case 'live':
        const ob: filter = { val: +e, modelType: app_strings.MODELS.products, col: 'isActive' };
        this.pliveValue = (ob.val).toString();
        this.page = 1;
        this.getList();
        break;
      case 'price':
        const ob_price: filter = { val: `0,${e}`, modelType: app_strings.MODELS.products, col: 'amount' };
        this.priceFilter = ob_price.val;
        this.getList();
        // this.filterListing(ob_price);
        break;
      case 'user':
        const ob_user: filter = { val: +e.target.value, modelType: app_strings.MODELS.products, col: 'userId' };
        // this.filterListing(ob_user);
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
  submit() {
    if (this.formgroup.invalid) {
      this.submitted = true;
      return true;
    }
    const temp = [];
    this.formgroup.get('table').value.forEach(element => {
      if (element.check) {
        temp.push(element.id);
      }
    });
    // console.log(temp);
    if (temp.length === 0) {
      return this.userService.error(app_strings.errorMsg.pleaseSelectOneProduct);
    }
    const request: any = {
      group_name: this.formgroup.get('groupName').value,
      total_product: temp.toString(),
      craft: '',
      userId: '1'
    };
    if (this.editFlag) {
      request.id = this.params.id;
      this.userService.editProductGroup(request).subscribe(result => {
        if (result['code'] === 200) {
          this.router.navigate(['products/group']);
        } else {
          this.userService.error(result['message']);
        }
      });
    } else {
      this.userService.checkProductGroupName(request).subscribe(res => {
        if (res.code === 200) {
          this.userService.addProductGroup(request).subscribe(result => {
            if (result['code'] === 200) {
              this.router.navigate(['products/group']);
            } else {
              this.userService.error(result['message']);
            }
          });
        } else {
          return this.userService.error(app_strings.errorMsg.groupNameEXIST);
        }
      });
    }
  }
  search(val) {
    if (val.length > 0) {
      // const val = (e).toUpperCase();
      // this.listArr = this.listArrbackup.filter(el => {
      //   // (res) => res.name.indexOf(val) >= 0
      //   if (el.name.toUpperCase().includes(val) || el.artisanName.toUpperCase().includes(val)) {
      //     return true;
      //   }
      // });
      this.getList()

    }
    if (this.searchKeyWord.length === 0) {
      this.getList();
    }
  }
  reset() {
    this.ngOnInit();
    // this.value = this.listArr[0].maxAmount / 2;
    this.searchKeyWord = '';
  }
  changePage(page) {
    this.page = page;
    // if (this.liveCheck) {
    //   this.pliveCondition(this.pliveValue);
    //   return;
    // }
    // this.getList();
    this.createGroup();
    if (this.editFlag) {
      this.formgroup.get('groupName').setValue(this.params.group_name);
    }
    this.getList();
    // this.formgroup.get('table').setValue(null);
    console.log('kuldeep1111', this.formgroup.value)
  }
}
