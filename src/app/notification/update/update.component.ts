import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { app_strings } from 'src/app/_constants/app_strings';
import { UserService } from 'src/app/_services/user.service';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  artisanList = [{ id: 'All', group_name: 'All' }];
  groupId: any = [];
  listArr: any;
  total: any;
  listHeaders: any = ['Profile image', 'Sub admin Name', 'Mobile Number', 'Group Name', 'Total Group',
    'Total Artisan'];
  listArrbackup: any;
  page=1;
  notificationData;
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router, private route: ActivatedRoute) {
  }
  get f() { return this.artisanGrp.controls; }
  artisanGrp: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  editFlag = false;
  editId: any;
  editDataArr: any = [];
  image_url: any = environment.image_url;
  materialSetting = {};
  notificationType = [
    'enquiryList',
    'orderList',
    'myShop',
    'liveProduct',
    'support',
    'dashboard',
    'chat',
    'imageGallery',
    'imageGalleryPrice',
    'imageGalleryComment',
    'myAwards','URL'];
  ngOnInit() {
    this.getArtisanGroupList();
    this.artisanFrm();
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.editId = params.id;
        if (params.data) {
          this.notificationData = JSON.parse(params.data);
          this.artisanFrm(this.notificationData);
          this.onItemSelect(this.notificationData.to);
        } else {
          this.artisanFrm();
        }
        if (this.editId) {
          this.editData(params);
          this.editFlag = true;
        }
      });
    this.materialSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'group_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: false,
      enableCheckAll: false
    };
  }
  artisanFrm(data?) {
    this.artisanGrp = this.fb.group({
      sendType: ['push', Validators.compose([Validators.required])],
      userIds: [data ? [data.to] : '', Validators.compose([Validators.required])],
      message: [data ? data.description : '', Validators.compose([Validators.required])],
      type: [data ? data.type : '', Validators.compose([Validators.required])],
      URL: ['', Validators.compose([Validators.pattern(app_strings.URL_PATTERN)])]
    });
  }
  getArtisanGroupList() {
    this.userService.getGroupListArtisan()
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.artisanList = this.artisanList.concat(result);
      });
  }
  editData(val) {
    this.previewObj.kycImage = val.image;
    this.artisanGrp.patchValue(val);
    console.log(this.artisanGrp.value);
  }
  fileUpload(e, type) {
    if (!type) { return; }
    const file = e.target.files[0];
    this.imagesObj[type] = file;
    this.userService.imagePreview(file)
      .then(preview => {
        this.previewObj[type] = preview;
      });
  }
  showImage(imageUrl) {
    if (!imageUrl) { return; }
    this.userService.showImage(imageUrl);
  }
  onItemSelect(event) {
    console.log(event);
    const groupIds = this.artisanGrp.get('userIds').value;
    console.log(groupIds);
    if (groupIds.indexOf('All') > -1) {
      this.groupId = ['All'].toString();
    } else {
      if (groupIds.length === 0) {
        this.listArr = [];
        this.listArrbackup = []
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
    const groupIds = this.artisanGrp.get('userIds').value;
    console.log(groupIds);
    if (groupIds.indexOf('All') > -1) {
      this.groupId = ['All'].toString();
    } else {
      if (groupIds.length === 0) {
        this.listArr = [];
        this.listArrbackup = []
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
  changePage(val: number) {
    console.log(val);
    this.page = val;
    this.artisanListing();
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
        for (let i = 0; i < this.listArr.length; i++) {
          this.listArr[i].isChecked = true;
        }
        this.total = res.total;
        this.listArrbackup = this.listArr;
      });
  }
  submit(val) {
    console.log(val);
    if (this.artisanGrp.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      // this.userService.error(app_strings.INVALID_FORM)
      return;
    }
    if (val.userIds.indexOf('All') > -1) {
      val.userIds = ['All'].toString();
    } else {
      const temp = [];
      val.userIds.forEach(element => {
        temp.push(element.id);
      });
      val.userIds = temp.toString();
    }
    val.group = val.userIds;
    const totalArtisan = [];
    this.listArr.forEach(element => {

      if (element.isChecked) {
        totalArtisan.push(element.id);
      }
    });
    val.userIds = totalArtisan.toString();
    console.log(this.listArr);
    val.message= val.URL?val.message+' '+val.URL:val.message;

    this.userService.addNotification(val)
      .pipe(take(1))
      .subscribe(res => {
        if (res.code === 200) {
          this.router.navigate(['/notification']);
        }
      });
  }
  check(item, event) {
    console.log(item, event)

    this.listArr.forEach(element => {
      if (element.id === item.id) {
        element.isChecked = event;
      }
    });
  }
}
