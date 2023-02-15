import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';
import { CrudService } from 'src/app/_services/crud.service';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  materialList: any;
  artisanData: any;
  constructor(
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
          this.editFlag = true;
          this.editData();
        }
      });
    this.createForm();
    $('#Manually').addClass('activetab');
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
        const { name, amount, inventoryQty, craft,  material, userId, image, pstateId } = this.editDataArr;
        // const imageArr = image.split(",")
        // image.forEach(element => {
        //   if (element) this.imageSrc.push(element.image)
        // });
        image.forEach(el => {
          this.imageSrc.push(el.image);
          this.addMoreImages({ url: el.id });
        });
        // this.imageSrc = imageTest
        this.productsGrp.patchValue({
          name,
          artisanId:userId || undefined,
          amount,
          inventoryQty,
          craft: craft || undefined,
          material: material || undefined,
          pstateId: pstateId || undefined
        });
        console.log(this.productsGrp.value);
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
      name: ['', Validators.compose([Validators.required, Validators.maxLength(40), Validators.pattern(app_strings.ALPHABET_PATTERN)])],
      amount: ['', Validators.compose([Validators.required])],
      inventoryQty: [''],
      craft: [undefined, Validators.compose([Validators.required])],
      material: [undefined, Validators.compose([Validators.required, Validators.maxLength(40)])],
      artisanId: [undefined, Validators.compose([Validators.required])],
      pstateId: [undefined, Validators.compose([Validators.required])]

    });
    if (!this.editFlag) {
      this.addMoreImages();
    }
  }
  submit() {
    if (this.productsGrp.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      // this.userService.error(app_strings.INVALID_FORM);
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
      ideal:'1',
      image_ids: this.deleteId.toString(),
      pstateId: this.f.pstateId.value
    };
    console.log(this.imagesObj);

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
      debugger
      fd.append('id', this.editId);
    }
    this.userService
      .addShopProduct(fd)
      .pipe(take(1))
      .subscribe((res) => {
        if (res.code === 200) {
          this.productsGrp.reset();
          this.router.navigate(['/ideal']);
        } else {
          this.userService.error(res.message);
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


}
