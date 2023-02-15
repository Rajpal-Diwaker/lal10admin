import { Component, OnInit, ViewEncapsulation, OnDestroy, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';
import { CrudService } from 'src/app/_services/crud.service';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-edit-shop',
  templateUrl: './edit-shop.component.html',
  styleUrls: ['./edit-shop.component.css']
})
export class EditShopComponent implements OnInit {
  materialList: any;
  artisanData: any;

  viewType = false;
  submitted = false;

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private userService: UserService,
    private crudService: CrudService,
    private router: Router, private route: ActivatedRoute
  ) { }
  get f() {
    return this.productsGrp.controls;
  }
  productsGrp: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  images: FormArray;
  imageSrc: any = [];
  editFlag = false;
  editId: any;
  editDataArr: any = [];
  image_url: any = environment.image_url;
  categoryList: any;
  deleteId = [];
  craftArr: any = [];
  stateId = [];
  craftId = [];
  materialId = [];
  stateListArr;
  ngOnInit() {
    // this.craft();
    // this.material();
    this.getStateList();
    this.getCategory();
    this.artisanList();
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.editId = params.id;
        if (this.editId) {
          this.viewType = params.view;
          this.editFlag = true;
          this.editData();
        }
      });
    this.createForm();
  }
  addMoreImages(ob = { url: 'assets/images/camera_images.png' }) {
    this.images = this.productsGrp.get('images') as FormArray;
    this.images.push(this.createItem(ob.url));
  }
  editData() {
    const ob = {
      id: this.editId,
      type: app_strings.MODELS.products,
    };
    this.crudService
      .editData(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.editDataArr = result;
        this.getCraft(this.editDataArr.pstateId);
        this.getMaterial(this.editDataArr.craft);
        if (!this.editDataArr) { return; }
        const { name, amount, inventoryQty, craft, userId, material, image, pstateId } = this.editDataArr;

        // this.imageSrc = imageTest
        this.productsGrp.patchValue({
          name,
          amount,
          artisanId: userId || undefined,
          inventoryQty,
          craft: craft ? Number(craft) : undefined,
          material: material || undefined,
          pstateId: pstateId || undefined
        });
        if (image) {
          image.forEach(el => {
            this.imageSrc.push(el.image);
            this.addMoreImages({ url: el.id });
          });
        }
      });
  }
  readURL(e, i) {
    if (e.target.files && e.target.files[0]) {
      this.imagesObj[i] = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc[i] = reader.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }
  // craft() {
  //   this.userService.options('craft')
  //     .pipe(take(1))
  //     .subscribe(res => {
  //       this.craftArr = res.result;
  //     });
  // }
  // material() {
  //   this.userService.options('material')
  //     .pipe(take(1))
  //     .subscribe(res => {
  //       this.materialList = res.result;
  //     });
  // }
  getStateList() {
    const ob = {
      type: 'state'
    };
    this.userService.getStateList(ob).subscribe(res => {
      if (res && res.code === 200) {
        this.stateListArr = res.result;
      }
      // if (this.editFlag) {
      //   this.getCraft(this.editDataArr.pstateId);
      // }
    });
  }
  getCraft(val) {
    this.stateId = [];
    this.craftArr = [];
    this.stateId.push(val);
    // this.stateId.toString();
    const ob: any = {
      stateId: this.stateId.toString()
    };
    console.log('request',ob);

    this.userService.getManageListingHeirarchy(ob, 'CRAFT').subscribe(res => {
      if (res && res.code === 200) {

        this.craftArr = res.result;
      //   if (this.editFlag) {
      //   this.getMaterial(this.editDataArr.craft);
      // }
      } else {
        this.userService.error(res.message);
      }
    });
  }
  getMaterial(val) {
    this.materialList = [];
    this.craftId = [];
    this.craftId.push(val);
    // this.craftId.toString();
    const ob: any = {
      stateId: this.stateId.toString(),
      craftId: this.craftId.toString()
    };
    this.userService.getManageListingHeirarchy(ob, 'MATERIAL').subscribe(res => {
      if (res && res.code === 200) {
        this.materialList =  res.result;
      } else {
        this.userService.error(res.message);
      }
    });
  }
  createItem(url = 'assets/images/camera_images.png'): FormGroup {
    return this.fb.group({
      image: url
    });
  }
  createForm() {
    this.productsGrp = this.fb.group({
      images: this.fb.array([]),
      // tslint:disable-next-line: max-line-length
      name: [{ value: '', disabled: this.viewType ? true : false }, Validators.compose([Validators.required, Validators.maxLength(50)])],
      amount: [{ value: '', disabled: this.viewType ? true : false }, Validators.compose([Validators.required])],
      inventoryQty: [{ value: '', disabled: this.viewType ? true : false }],
      craft: [undefined, Validators.compose([Validators.required])],
      material: [{ value: undefined, disabled: this.viewType ? true : false }, Validators.compose([Validators.required])],
      artisanId: [{ value: undefined, disabled: this.viewType ? true : false }, Validators.compose([Validators.required])],
      pstateId: [undefined, Validators.compose([Validators.required])]
    });
    if (!this.editFlag) {
      this.addMoreImages();
    }
  }
  submit(val) {
    // console.log('invalidForm', this.productsGrp.controls);
    // return;
    console.log(this.productsGrp);

    if (this.productsGrp.invalid) {

      for (const key of Object.keys(this.productsGrp.controls)) {
        if (this.productsGrp.controls[key].invalid) {
          console.log(key);
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
        }
      }
      return;
    }


    const ob: any = {
      artisanId: this.f.artisanId.value,
      name: this.f.name.value,
      amount: this.f.amount.value,
      inventoryQty: this.f.inventoryQty.value,
      craft: this.f.craft.value,
      material: this.f.material.value,
      verified: '1',
      image_ids: this.deleteId.toString(),
      pstateId: this.f.pstateId.value
    };
    if (this.editFlag == false && JSON.stringify(this.imagesObj) == '{}') {
      this.userService.error(app_strings.IMAGE_VALIDATION);
      return;
    }
    console.log(ob);
    const fd = new FormData();
    for (const key in ob) {
      if (ob.hasOwnProperty(key)) {
        const element = ob[key];
        fd.append(key, element);
      }
    }
    for (const key in this.imagesObj) {
      if (this.imagesObj.hasOwnProperty(key)) {
        const element = this.imagesObj[key];
        // ob['product[]'] = element;
        fd.append('files', element);
      }
    }
    if (this.editId && this.editId != 'null') {
      fd.append('id', this.editId);
    }
    this.userService
      .addShopProduct(fd)
      .pipe(take(1))
      .subscribe((res) => {
        if (res.code === 200) {
          this.router.navigate(['/shop']);
        }
        else {
          this.userService.error(res.message)
        }
      });
  }
  getCategory() {
    this.userService.getCategory()
      .pipe(take(1))
      .subscribe(res => {
        this.categoryList = res.result;
      });
  }
  changeImage(val) {
    console.log(val.value);
    val.value.image = (val.value.image).toString();
    console.log(val.value.image.length);
    if (val.value.image.length < 10) {
      this.deleteId.push(val.value.image);
    }
    console.log(this.deleteId);
  }
  artisanList() {
    this.userService.listofArtisanDownload({})
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.artisanData = result;
      });
  }
  changeStatus(isActive) {
    /* Are you sure you want to deactivate?
Are you sure you want to activate? */
    let title;
    const ob = { type: 'products', verified: isActive ? '1' : '0', id: this.editId };
    if (isActive) {
      title = 'Are you sure you want to Approve?';
    } else { title = 'Are you sure you want to Disapproved?'; }
    this.crudService.confirmPopup({ confirmButtonText: 'Yes', text: '', title })
      .then((suc) => {
        // debugger
        if (suc && (suc.dismiss === 'backdrop' || suc.dismiss === 'cancel')) {

        } else {

          this.userService
            .commonChangeStatus(ob)
            .pipe(take(1))
            .subscribe((res) => {
              this.router.navigate(['/shop']);

            });
        }
      });
  }
  toCallChangeStatus(val) {
    this.submitted = true;
    if (this.f.craft.status === 'INVALID') {
      console.log('invalidCraf', this.f.craft);
      return;
    } else {
      this.changeStatus(val);
    }
  }
}
