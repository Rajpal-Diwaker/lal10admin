import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { app_strings } from 'src/app/_constants/app_strings';
import { UserService } from 'src/app/_services/user.service';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit, OnDestroy {
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router, private route: ActivatedRoute, private location: Location) {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.editId = params.id;
        this.page = params.page;
        if (this.editId) {
          this.editData();
          this.editFlag = true;
        }
      });
  }
  get f() { return this.artisanGrp.controls; }
  artisanGrp: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  editFlag = false;
  editId: any;
  editDataArr;
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
  userId: any;
  state :any= [];
  craft :any=  [];
  materail :any=  [];
  product: any = [];
  page = 1;
  ngOnInit() {
    this.craftSetting = {
      singleSelection: false,
                  idField: 'id',
                  textField: 'name',
                  selectAllText: 'Select All',
                  unSelectAllText: 'UnSelect All',
                  itemsShowLimit: 3,
                  allowSearchFilter: true
    };
    this.productSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.materialSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    // this.state();
    this.getStateList();
    // this.products();
    // this.material();
    // this.craft();
    this.artisanFrm();
  }
  ngOnDestroy(): void {
    // alert('destroy')
    if (this.page) {
      sessionStorage.setItem('artisanPage', JSON.stringify(this.page));
      sessionStorage.setItem('artisanFocus', JSON.stringify(this.editId));
    }
  }
  artisanFrm() {
    this.artisanGrp = this.fb.group({
      email: ['', Validators.compose([Validators.email])],
      name: ['', Validators.compose([Validators.required, Validators.pattern(app_strings.ALPHABET_PATTERN)])],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(15)])],
      state: [undefined, Validators.compose([Validators.required])],
      craft: ['', Validators.compose([Validators.required])],
      product: ['', Validators.compose([Validators.required])],
      material: ['', Validators.compose([Validators.required])],
    });
  }
  // craft() {
  //   this.userService.options('craft')
  //     .pipe(take(1))
  //     .subscribe(res => {
  //       this.craftList = res.result;
  //     });
  // }
  // state() {
  //   this.userService.options('state')
  //     .pipe(take(1))
  //     .subscribe(res => {
  //       this.stateArr = res.result;
  //     });
  // }
  getStateList() {
    // this.manageListingGrp.get('craftId').setValue(null)
    // this.manageListingGrp.get('materialId').setValue(null)
    const ob = {
      type: 'state'
    };
    this.userService.getStateList(ob).subscribe(res => {
      if (res && res.code === 200) {
        this.stateArr = res.result;
        if (this.editDataArr) {
          this.artisanGrp.patchValue({ state: Number(this.editDataArr.stateId) });
          this.getCraft(this.f.state.value, '', true);
        }
        // if (this.key === 'material' || this.key === 'products') {
        //   this.getCraft('','');
        // }
      }
    });
  }
  getCraft(val,condition, editCondition?) {
    if(condition=!''){
      this.artisanGrp.patchValue({ craft: null });
  }
    console.log(val,condition,'selectedStates', this.f.state.value);
    this.state = [];

    // if(condition!='ALL'){
    // this.manageListingGrp.value.stateId.forEach(element => {
    //     this.state.push(element.id);
    //   });
    // }
    // else{
    //   val.forEach(element => {
    //     this.state.push(element.id);
    //   });
    // }
    this.state.push(val);
    this.state=condition=='DESELECTALL'?'':this.state.toString();
    const ob: any = {
      stateId:this.state
    };
    console.log('request',ob);

    this.userService.getManageListingHeirarchy(ob, 'CRAFT').subscribe(res => {
      if (res && res.code === 200) {

        this.craftList = res.result.filter(el=>{
          if(el.type=='craft') return true
        });
        if (this.editDataArr && editCondition) {
          this.artisanGrp.patchValue({ craft: this.editDataArr.craft });
          this.getMaterial('', '',  true);
        }
        // if (this.key === 'products') {
        //   this.getMaterial('','');
        // }
      } else {
        this.userService.error(res.message);
      }
    });
  }
  getMaterial(val,condition, editCondition?) {
    console.log(val,condition,'selectedCraft', this.f.craft.value);
    if(condition=!''){
      this.artisanGrp.patchValue({ material: null });
  }
    this.craft = [];
    // this.manageListingGrp.value.craftId.forEach(element => {
    //     this.craft.push(element.id);
    //   });

    if(condition!='ALL'){
      this.artisanGrp.value.craft.forEach(element => {
          this.craft.push(element.id);
        });
      }
      else{
        val.forEach(element => {
          this.craft.push(element.id);
        });
      }
      this.craft=condition=='DESELECTALL'?'':this.craft.toString();
    const ob: any = {
      stateId: this.state.toString(),
      craftId: this.craft.toString()
    };
    this.userService.getManageListingHeirarchy(ob, 'MATERIAL').subscribe(res => {
      if (res && res.code === 200) {
        this.materialList =  res.result.filter(el=>{
          if(el.type=='material') return true
        });
        if (this.editDataArr && editCondition) {
          this.artisanGrp.patchValue({ material: this.editDataArr.material });
          this.getProducts('', '', true);
        }
      } else {
        this.userService.error(res.message);
      }
    });
  }
  getProducts(val,condition, editCondition?) {
    // console.log(val,condition,'selectedCraft', this.f.craftId.value);
    if(condition=!''){
      this.artisanGrp.patchValue({ product: null });
  }
    this.materail = [];
    // this.manageListingGrp.value.craftId.forEach(element => {
    //     this.craft.push(element.id);
    //   });

    if(condition!='ALL'){
      this.artisanGrp.value.material.forEach(element => {
          this.materail.push(element.id);
        });
      }
      else{
        val.forEach(element => {
          this.materail.push(element.id);
        });
      }
      this.materail=condition=='DESELECTALL'?'':this.materail.toString();
    const ob: any = {
      stateId: this.state.toString(),
      craftId: this.craft.toString(),
      materialId: this.materail.toString()
    };
    this.userService.getManageListingHeirarchy(ob, 'PRODUCT').subscribe(res => {
      if (res && res.code === 200) {
        this.productList =  res.result.filter(el=>{
          if(el.type=='products') return true
        });
        if (this.editDataArr && editCondition) {
          this.artisanGrp.patchValue({ product: this.editDataArr.product });
          // this.materialSelect()
        }
      } else {
        this.userService.error(res.message);
      }
    });
  }
  // products() {
  //   this.userService.options('products')
  //     .pipe(take(1))
  //     .subscribe(res => {
  //       this.productList = res.result;
  //     });
  // }
  // material() {
  //   this.userService.options('material')
  //     .pipe(take(1))
  //     .subscribe(res => {
  //       this.materialList = res.result;
  //     });
  // }
  editData() {
    this.userService.listingByIdArtisan(this.editId)
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.editDataArr = result;
        this.userId = result.userId;
        if (!this.editDataArr) { return; }
        const { email, name, mobile, artisanImage, kycImage } = this.editDataArr;
        this.previewObj.artisanImage = artisanImage;
        this.previewObj.kycImage = kycImage;
        this.artisanGrp.patchValue({ email, name, mobile });
        console.log(this.artisanGrp.value);
      });
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
  showImage(imageUrl, imageType?: string) {
    if (!imageUrl) { return; }
    if (this.editFlag && imageType) {
      this.userService.showImageKYC(imageUrl).then((result) => {
        const ob: any = {
          id: this.userId,
          type: 'users',
          is_verified: '1'
        };
        if (result.value) {
          // alert('Approved');
          this.userService.commonChangeStatus(ob).subscribe(res => {
            if (res && res.code === 200) {
              this.userService.success(res.message);
              this.location.back();
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // alert('Rejected');
          ob.is_verified = '0';
          this.userService.commonChangeStatus(ob).subscribe(res => {
            if (res && res.code === 200) {
              this.userService.success(res.message);
              this.location.back();
            }
          });
        }
      });
    } else {
      this.userService.showImage(imageUrl);
    }
  }
  submit() {
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
    // tslint:disable-next-line: one-variable-per-declaration
    const material = [], craft = [], product = [];
    this.artisanGrp.value.material.forEach(element => {
      material.push(element.id);
    });
    this.artisanGrp.value.craft.forEach(element => {
      craft.push(element.id);
    });
    this.artisanGrp.value.product.forEach(element => {
      product.push(element.id);
    });
    const ob: any = {
      email: this.f.email.value || '',
      name: this.f.name.value,
      mobile: this.f.mobile.value,
      state: this.f.state.value,
      craft: craft.toString(),
      product: product.toString(),
      material: material.toString(),
      type: 'artisan'
    };
    for (const key in this.imagesObj) {
      if (this.imagesObj.hasOwnProperty(key)) {
        const element = this.imagesObj[key];
        ob[key] = element;
      }
    }
    const fd = new FormData();
    for (const key in ob) {
      if (ob.hasOwnProperty(key)) {
        const element = ob[key];
        fd.append(key, element);
      }
    }
    if (this.editId && this.editId != 'null') {
      fd.append('id', this.editId);
    }
    // this.userService.checkEmailArtisan(ob).subscribe(checkEmail => {
    //   if (checkEmail.code === 401 && this.editFlag === false && ob.email) {
    //     this.userService.error(checkEmail.message);
    //     window.scrollTo(0, 0);
    //     return;
    //   }
    this.userService.addArtisan(fd)
      .pipe(take(1))
      .subscribe(res => {
        if (res.code === 401) {
          this.userService.bug(res.message);
          window.scrollTo(0, 0);
          return;
        }
        this.artisanGrp.reset();
        this.previewObj.artisanImage = '';
        this.previewObj.kycImage = '';
        this.router.navigateByUrl('/artisan');
      });
    // });
  }
}
