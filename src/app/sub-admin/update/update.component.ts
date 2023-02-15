import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserService } from 'src/app/_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/_services/crud.service';
import { app_strings } from 'src/app/_constants/app_strings';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  total = 0;
  craftType: any;
  artisanGroup = [{ id: 'All', group_name: 'All' }];
  CraftList: any;
  productList: any;
  materialList: any;
  stateList: any;
  searchKeyWord: string;
  myform: FormGroup;
  role: any;
  groupSetting: {
    singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string;
    // itemsShowLimit: 3,
    allowSearchFilter: boolean; enableCheckAll: boolean;
  };
  roleSetting: {
    singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string;
    // itemsShowLimit: 3,
    allowSearchFilter: boolean; enableCheckAll: boolean;
  };
  groupId: any = [];
  params: any;
  result: any;
  get f() { return this.myform.controls; }
  listHeaders: any = ['Profile image', 'Sub admin Name', 'Mobile Number', 'Group Name', 'Total Group',
    'Total Artisan'];
  listArr: any = [];
  listArrbackup: any = [];
  image_url: any = environment.image_url;
  page = 1;
  limit: any = 10;
  searchKey: any = '';
  updatePage = 0;
  flickerArr: any = {};
  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.createForm();
    this.route.queryParams
      .subscribe(params => {
        this.params = params;
        this.userService.getSubAdminDetails(this.params).subscribe(res => {
          console.log(res.result[0]);
          const { result } = res;
          console.log(result);
          this.result = result[0];
          this.myform.patchValue({
            id: result[0].id,
            groupName: result[0].groupName,
            mobile: result[0].mobile,
            email: result[0].email,
            name: result[0].name,
            subAdminRoleId: result[0].subAdminRoleList,
            totalArtisan: result[0].totalArtisan,
            // groupId: result[0].groupId
          });
          console.log(this.myform.value);
          this.groupId = result[0].groupId.split(',');
          this.artisanListing();



        });
      });
  }
  ngOnInit() {
    this.searchKeyWord = '';
    this.getRole();
    this.getArtisanGroupList();
    this.groupSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'group_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: false,
      enableCheckAll: false
    };
    this.roleSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: false,
      enableCheckAll: true
    };
  }
  getArtisanGroupList() {
    this.userService.getGroupListArtisan()
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.artisanGroup = this.artisanGroup.concat(result);
        let temp = [];
        this.artisanGroup.forEach(el => {
          if (this.groupId.indexOf((el.id).toString()) > -1) {
            temp.push(el)
          }
        })
        this.myform.get('groupId').setValue(temp)


      });
  }
  createForm() {
    this.myform = this.fb.group({
      id: [''],
      name: [''],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      groupName: ['', Validators.compose([Validators.required])],
      subAdminRoleId: ['', Validators.compose([Validators.required])],
      mobile: [{ value: '', disabled: true }, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(15)])],
      totalArtisan: [''],
      groupId: ['', Validators.compose([Validators.required])],
    });
  }
  artisanListing() {
    const temp = {
      id: this.groupId.toString()
    };
    this.userService.getGroupUser(temp)
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.listArr = result;
        // tslint:disable-next-line: prefer-for-of
        const artisanUser = this.myform.get('totalArtisan').value.split(',');
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.listArr.length; i++) {
          console.log(artisanUser, this.listArr[i].id);
          if (artisanUser.indexOf((this.listArr[i].id).toString()) > -1) {
            this.listArr[i].isChecked = true;
          } else {
            this.listArr[i].isChecked = false;
          }
        }

        this.listArr = _.orderBy(this.listArr, ['isChecked'], ['desc']);

        this.total = res.total;
        this.listArrbackup = this.listArr;
      });
  }
  getRole() {
    this.userService.getRoleList()
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.role = result;
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
    this.router.navigate(['/artisan/add'], { queryParams: { id } });
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
  reset() {
    this.ngOnInit();
  }
  onItemSelect(event) {
    console.log(event);
    const groupIds = this.myform.get('groupId').value;
    console.log(groupIds);
    if (groupIds.indexOf('All') > -1) {
      this.groupId = ['All'].toString();
    } else {
      if (groupIds.length === 0) {
        this.listArr = [];
        this.listArrbackup = [];
        this.total = 0;
        return;
      }
      const temp = [];
      groupIds.forEach(element => {
        temp.push(element.id);
      });
      this.groupId = temp.toString();
    }
    this.artisanListing();
  }
  onItemDeSelect(event) {
    console.log(event);
    const groupIds = this.myform.get('groupId').value;
    console.log(groupIds);
    if (groupIds.indexOf('All') > -1) {
      this.groupId = ['All'].toString();
    } else {
      if (groupIds.length === 0) {
        this.listArr = [];
        this.listArrbackup = [];
        this.total = 0;
        return;
      }
      const temp = [];
      this.groupId.forEach(element => {
        temp.push(element.id);
      });
      this.groupId = temp.toString();
    }
    this.artisanListing();
  }
  submit(val) {
    if (this.myform.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      // this.userService.error(app_strings.INVALID_FORM)
      return;
    }
    /* subAdminRoleId */
    const subAdminRoleId = [];
    val.subAdminRoleId.forEach(element => {
      subAdminRoleId.push(element.id);
    });
    val.subAdminRoleId = subAdminRoleId.toString();
    /* totalArtisan */
    const totalArtisan = [];
    this.listArr.forEach(element => {
      if (element.isChecked) {
        totalArtisan.push(element.id);
      }
    });
    val.totalArtisan = totalArtisan.toString();
    /* group ids  */
    if (val.groupId.indexOf('All') > -1) {
      val.groupId = ['All'].toString();
    } else {
      const temp = [];
      val.groupId.forEach(element => {
        temp.push(element.id);
      });
      val.groupId = temp.toString();
    }
    console.log(val);
    // delete val.name;
    this.userService.createSubAdminGroup(val).subscribe(res => {
      console.log(res);
      if (res.code == 200) {
        this.router.navigate(['/subadmin']);
      } else {
        this.userService.bug(res.message);
      }
    });
  }
  check(item, event) {
    console.log(item, event);
    this.listArr.forEach(element => {
      if (element.id === item.id) {
        element.isChecked = event;
      }
    });
  }
}
