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
  styleUrls: ['./add.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddComponent implements OnInit, OnDestroy {
  materialList: any;
  getSubcategory: any;
  getSubSubcategory: any;
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
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button

      // ['link', 'image', 'video']                         // link and image, video
    ]
  };
  editorStyle = {
    height: '300px'
  }
  page = 1;
  ngOnInit() {
    // this.craft();
    // this.material();
    this.getStateList();
    this.getCategory();
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.editId = params.id;
        this.page = params.page;
        if (this.editId) {
          this.editFlag = true;
          this.editData();
        }
      });
    this.createForm();
  }

  ngOnDestroy(): void {
    // alert('destroy')
    if (this.page) {
      localStorage.setItem('pageNo', JSON.stringify(this.page));
      localStorage.setItem('focusid', JSON.stringify(this.editId));
    }
  }
  addMoreImages(ob = { url: 'assets/images/camera_images.png' }) {
    this.images = this.productsGrp.get('images') as FormArray;
    this.images.push(this.createItem(ob.url));
  }
  showImage(imageUrl) {
    if (!imageUrl) { return; }
    this.userService.showImage(imageUrl);
  }
  deleteImages(index: number, imageId) {
    if (this.imageSrc[index].type) {
      console.log('image server id', imageId);
      this.userService.confirmPopup({
        confirmButtonText: 'Yes',
        title: 'Are you sure, you want to delete this image ?',
        text: ''
      }).then(val => {
        if (val.value) {
          const ob = {
            id: imageId
          };
          this.userService.deleteProductImage(ob).subscribe(res => {
            if (res && res.code == 200) {
              this.userService.success(res.message);
              (<FormArray>this.productsGrp.get('images')).removeAt(index);
                delete this.imagesObj[index];
                // this.imageChangeFlag = true;
                this.imageSrc.splice(index, 1);
            }
          });
        }
      });
    } else {
          (<FormArray>this.productsGrp.get('images')).removeAt(index);
        delete this.imagesObj[index];
        // this.imageChangeFlag = true;
        this.imageSrc.splice(index, 1);
    }

    // this.imgIds.splice(index, 1);
    // console.log('>>>>IMGiDS', this.imgIds);
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
        if (!this.editDataArr) { return; }
        this.getCraft(this.editDataArr.pstateId);
        this.getMaterial(this.editDataArr.craft);
        const { name, amount, subsubcategoryId, subcategoryId, categoryId, inventoryQty, doableQty, craft, searchTags, material, description, image, pstateId } = this.editDataArr;

        this.productsGrp.patchValue({
          name,
          subcategoryId: subcategoryId || '',
          categoryId: categoryId || '',
          amount,
          inventoryQty,
          doableQty,
          craft: craft,
          searchTags,
          description,
          subsubcategoryId: subsubcategoryId || '',
          material: material,
          pstateId: pstateId || undefined
        });
        this.getCatId(categoryId);
        this.getSUBSUBCatId(subcategoryId);

        if (image) {
          image.forEach(el => {
            this.imageSrc.push({image: el.image, type: 1}); // 1 === server image, 0 === local image
            this.addMoreImages({ url: el.id });
          });
        }
      });
  }
  getCatId(val) {
    console.log(val);
    const temp = {
      id: val
    };
    this.userService.getSubCategoryByCatId(temp)
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        if (result.length) {
          this.getSubcategory = result;
        } else {
          this.userService.error('No subcategory found');
        }
      });
  }

  getSUBSUBCatId(val) {
    console.log(val);
    const temp = {
      id: val
    };
    this.userService.getSubCategoryByCatId(temp)
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        if (result.length) {
          this.getSubSubcategory = result;
        } else {
          this.userService.error('No subcategory found');
        }
      });
  }


  readURL(e, i) {
    if (e.target.files && e.target.files[0]) {
      this.imagesObj[i] = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = reader.result;
        const type = 0;
        this.imageSrc[i] = { image: image, type: type };
        // this.imageSrc[i]['image'] = reader.result;
        // this.imageSrc[i]['type'] = 0;
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
  createItem(url = 'assets/images/camera_images.png'): FormGroup {
    return this.fb.group({
      image: url
    });
  }
  createForm() {
    this.productsGrp = this.fb.group({
      images: this.fb.array([]),
      name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      amount: ['', Validators.compose([Validators.required])],
      inventoryQty: [''],
      doableQty: ['', Validators.compose([Validators.required])],
      //Removed mandatory validation from craft field as per chanchal request May 5, 2021
      craft: [''],
      searchTags: ['', Validators.compose([Validators.required])],
      //Removed mandatory validation from material field as per chanchal request May 5, 2021
      material: ['', Validators.compose([Validators.maxLength(40)])],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(1500)])],
      categoryId: ['', Validators.compose([Validators.required])],
      subcategoryId: ['', Validators.compose([Validators.required])],
      subsubcategoryId: [''],
      pstateId: [undefined, Validators.compose([Validators.required])]
    });
    if (!this.editFlag) {
      this.addMoreImages();
    }
  }
  submit() {
    console.log('>>', this.productsGrp.controls);
    // return;

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
      name: this.f.name.value,
      amount: this.f.amount.value,
      inventoryQty: this.f.inventoryQty.value,
      doableQty: this.f.doableQty.value,
      craft: this.f.craft.value,
      searchTags: this.f.searchTags.value,
      material: this.f.material.value,
      description: this.f.description.value,
      categoryId: this.f.categoryId.value,
      subcategoryId: this.f.subcategoryId.value,
      subsubcategoryId: this.f.subsubcategoryId.value,
      plive: 0,
      image_ids: this.deleteId.toString(),
      pstateId: this.f.pstateId.value
    };
    console.log(this.imagesObj);
    for (const key in this.imagesObj) {
      if (this.imagesObj.hasOwnProperty(key)) {
        const element = this.imagesObj[key];
        ob['product[]'] = element;
      }
    }
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
      .addProduct(fd)
      .pipe(take(1))
      .subscribe((res) => {
        this.userService.success(res.message);
        this.productsGrp.reset();
        this.router.navigate(['/products']);
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
}
