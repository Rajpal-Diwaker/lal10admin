import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { app_strings } from 'src/app/_constants/app_strings';
import { UserService } from 'src/app/_services/user.service';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  details: any;
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
  craftList = [];
  craftSetting = {};
  productList = [];
  productSetting = {};
  materialList = [];
  materialSetting = {};
  craftArr: any = [];
  stateArr: any = [];
  productArr: any = [];
  materialArr: any = [];
  ngOnInit() {
    this.artisanFrm();
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.details = params;
        if (params.id) {
          this.editData(params);
          this.editFlag = true;
        }
      });
  }
  artisanFrm() {
    this.artisanGrp = this.fb.group({
      userName: [{ value: '', disabled: true }],
      productName: [{ value: '', disabled: true }],
      qty: [{ value: '', disabled: true }],
      expPrice: [{ value: '', disabled: true }],
      update_status: ['', Validators.compose([Validators.required])],
      description: [{ value: '', disabled: true }],
      EnqId: [{ value: '', disabled: false }],
      productId: [{ value: '', disabled: true }],
      title: [{ value: '', disabled: true }],
      uniqueId: [{ value: '', disabled: true }]
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
  submit(val) {
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
    this.userService.updateWebsiteOrderDetails(val)
      .pipe(take(1))
      .subscribe(res => {
        if (res && res.code === 200) {
          this.userService.success(res.message);
          this.router.navigate(['/websiteOrders']);
        } else {
          this.userService.error(res.message);
        }
      }, error => {
        this.userService.error(error);
      });
  }
}
