import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { CrudService } from 'src/app/_services/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { app_strings } from 'src/app/_constants/app_strings';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { OptionsService } from 'src/app/options/options.service';
declare var $: any;
@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit, OnDestroy {
  formgroup: FormGroup;
  submitted: boolean;
  editFlag: boolean;
  params: any;
  CraftList: any;
  productList: any;
  materialList: any;
  stateList: any;
  craft: any;
  material: any;
  state: any;
  product: any;
  stateId = [];
  craftId = [];
  materialId = [];
  grpid;
  sel1;
  sel2;
  sel3;
  sel4;
  colName = '';
  sortby = '';
  constructor(
    private userService: UserService,
    private manageListingService: OptionsService,
    private crudService: CrudService,
    private router: Router,
    private route: ActivatedRoute,
    // tslint:disable-next-line: variable-name
    private _fb: FormBuilder
  ) {

  }
  listHeaders: any = ['Profile image', 'Artisans Name', 'Mobile Number', 'Email ID', 'State',
    'Total Inquiries', 'Total Orders', 'Action'];
  listArr: any = [];
  image_url: any = environment.image_url;
  page = 1;
  limit: any = 10;
  searchKey: any = '';
  updatePage = 0;
  flickerArr: any = {};
  total: any;
  alreadySelectedArtisans = [];
  ngOnInit() {
    this.createGroup();
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        if (params.id) {
          this.grpid = params.id;
          this.editFlag = true;
          this.params = params;
          // sessionStorage.setItem('artGrp', params.total_artisan);
          this.alreadySelectedArtisans = params.total_artisan.split(',');
          this.formgroup.get('groupName').setValue(this.params.group_name);
        }
      });
    this.page = 1;
    this.artisanListing();
    this.state = '';
    this.material = '';
    this.craft = '';
    this.product = '';
    this.getCraft('craft');
    this.getProduct('products');
    this.getMaterial('material');
    this.getState('state');
  }
  ngOnDestroy() {
    sessionStorage.removeItem('artGrp');
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
  get inFormArray(): FormArray {
    return this.formgroup.get('table') as FormArray;
  }
  artisanListing() {
    const temp: any = {
      pageNumber: this.page,
      state: this.state || '',
      material: this.material || '',
      craft: this.craft || '',
      product: this.product || '',
      order: this.sortby,
      sort: this.colName
    };
    if (!this.sortby) {
      delete temp.order;
      delete temp.sort;
    }
    if (this.editFlag) {
      temp.group_id = this.grpid;
    }
    this.userService.listingArtisan(temp)
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        // this.listArr = result;
        // this.total = result.total;
        // const alreadySelectedArtisans = sessionStorage.getItem('artGrp').split(',');
        this.listArr = result.filter(element => {
          if (element.isActive == 1) {
            if (this.editFlag === true && this.alreadySelectedArtisans.indexOf((element.userId).toString()) > -1) {
              element.check = true;
            } else {
              element.check = false;
            }
            return true;
          }
        });
        // const newArr = _.orderBy(this.listArr, ['check'], ['desc']);
        // this.formgroup.get('table').value.forEach((element,i) => {
        //       this.formgroup.get('table').
        // });
        const control = this.inFormArray;
        for (let i = control.length - 1; i >= 0; i--) {
          control.removeAt(i);
        }
        this.listArr.forEach(element => {
          this.addItem(element);
        });
        this.total = res.total;
        // console.log(result);

        // console.log(this.inFormArray.value);
      });
  }
  def(e, id) {
    this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    const img = 'assets/images/def.png';
    if (!e && this.flickerArr[id] > 1) { return; }
    e.target.src = img;
  }
  submit() {
    console.log(this.formgroup.value);
    if (this.formgroup.invalid) {
      this.submitted = true;
      return true;
    }
    // const temp = [];
    // this.formgroup.get('table').value.forEach(element => {
    //   if (element.check) {
    //     temp.push(element.userId);
    //   }
    // });
    const temp = this.alreadySelectedArtisans;
    console.log(temp);
    if (temp.length === 0) {
      return this.userService.error(app_strings.errorMsg.pleaseSelectOneArtisan);
    }
    const request: any = {
      group_name: this.formgroup.get('groupName').value,
      total_artisan: temp.toString(),
      craft: '',
      userId: '1'
    };
    if (this.editFlag) {
      request.id = this.params.id;
      this.userService.editArtisanGroup(request).subscribe(result => {
        if (result.code === 200) {
          this.router.navigate(['artisan/groupList']);
        } else {
          this.userService.error(result.message);
        }
      });
    } else {
      this.userService.checkGroupNameArtisan(request).subscribe(res => {
        if (res.code === 200) {
          this.userService.createArtisanGroup(request).subscribe(result => {
            if (res.code === 200) {
              this.router.navigate(['artisan/groupList']);
            } else {
              this.userService.error(result.message);
            }
          });
        } else {
          return this.userService.error(app_strings.errorMsg.groupNameEXIST);
        }
      });
    }
  }
  getCraft(val) {
    const ob = {
      type: val,
    };
    this.manageListingService
      .listing(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.CraftList = result;
      });
  }
  getProduct(val) {
    const ob = {
      type: val,
    };
    this.manageListingService
      .listing(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.productList = result;
      });
  }
  getMaterial(val) {
    const ob = {
      type: val,
    };
    this.manageListingService
      .listing(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.materialList = result;
      });
  }
  getState(val) {
    const ob = {
      type: val,
    };
    this.manageListingService
      .listing(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.stateList = result;
      });
  }
  // getCraft(val) {
  //   this.stateId = [];
  //   this.CraftList = [];
  //   this.stateId.push(val);
  //   // this.stateId.toString();
  //   const ob: any = {
  //     stateId: this.stateId.toString()
  //   };
  //   console.log('request',ob);

  //   this.userService.getManageListingHeirarchy(ob, 'CRAFT').subscribe(res => {
  //     if (res && res.code === 200) {

  //       this.CraftList = res.result;
  //       this.materialList = res.materialList;
  //       this.productList = res.productList;
  //     } else {
  //       this.userService.error(res.message);
  //     }
  //   });
  // }
  // getMaterial(val) {
  //   this.materialList = [];
  //   this.craftId = [];
  //   this.craftId.push(val);
  //   // this.craftId.toString();
  //   const ob: any = {
  //     stateId: this.stateId.toString(),
  //     craftId: this.craftId.toString()
  //   };
  //   this.userService.getManageListingHeirarchy(ob, 'MATERIAL').subscribe(res => {
  //     if (res && res.code === 200) {
  //       this.materialList =  res.result;
  //       this.productList = res.productList;
  //     } else {
  //       this.userService.error(res.message);
  //     }
  //   });
  // }
  // getProducts(val) {
  //   this.productList = [];
  //   this.materialId = [];
  //   this.materialId.push(val);
  //   // this.materialId.toString();
  //   const ob: any = {
  //     stateId: this.stateId.toString(),
  //     craftId: this.craftId.toString(),
  //     materialId: this.materialId.toString()
  //   };
  //   this.userService.getManageListingHeirarchy(ob, 'PRODUCT').subscribe(res => {
  //     if (res && res.code === 200) {
  //       this.productList =  res.result;
  //     } else {
  //       this.userService.error(res.message);
  //     }
  //   });
  // }
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
  sort(sort: any, col: string) {
    this.page = 1;
    this.sortby = sort;
    if (col === 'Total Inquiries') {
      this.colName = 'totalEnq';
      // const newArr = _.orderBy(this.inFormArray.value, [col], [sort]);
      // const control = this.inFormArray;
      // for (let i = control.length - 1; i >= 0; i--) {
      //   control.removeAt(i);
      // }
      // newArr.forEach(element => {
      //   this.addItem(element);
      // });
      this.artisanListing();
    }
    if (col === 'Total Orders') {
      this.colName = 'totalOrders';
      // const newArr = _.orderBy(this.inFormArray.value, [col], [sort]);
      // const control = this.inFormArray;
      // for (let i = control.length - 1; i >= 0; i--) {
      //   control.removeAt(i);
      // }
      // newArr.forEach(element => {
      //   this.addItem(element);
      // });
      this.artisanListing();
    }
  }

  changePage(page) {
    this.page = page;
    // if (this.liveCheck) {
    //   this.pliveCondition(this.pliveValue);
    //   return;
    // }
    // this.getList();
    // let temp = [];
    // temp = sessionStorage.getItem('artGrp').split(',');
    // this.formgroup.get('table').value.forEach(element => {
    //   if (element.check) {
    //     if (!this.alreadySelectedArtisans.includes(element.userId.toString())) {
    //       this.alreadySelectedArtisans.push(element.userId.toString());
    //     }
    //   }
    // });
    // sessionStorage.setItem('artGrp', temp.toString());
    this.createGroup();
    if (this.editFlag) {
      this.formgroup.get('groupName').setValue(this.params.group_name);
    }
    this.artisanListing();
    // this.formgroup.get('table').setValue(null);
    console.log('kuldeep1111', this.formgroup.value)
  }
  reset() {
    this.ngOnInit();
    this.colName = '';
    this.sortby = '';
    this.artisanListing();
    this.stateId = [];
    this.CraftList = [];
    this.materialList = [];
    this.craftId = [];
    this.productList = [];
    this.materialId = [];

  }

  statusChange(e, data) {
    // console.log(e, data);
    const isChecked: boolean = e.target.checked;
    if (isChecked) {
      this.alreadySelectedArtisans.push(data.value.userId.toString());
    } else {
      const index = this.alreadySelectedArtisans.indexOf(data.value.userId.toString());
      if (index) {
        this.alreadySelectedArtisans.splice(index, 1);
      }
    }
    console.log('selected artisans', this.alreadySelectedArtisans);
  }
}
