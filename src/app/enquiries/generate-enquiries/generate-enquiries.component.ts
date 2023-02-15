import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { take } from 'rxjs/operators';
import { OptionsService } from 'src/app/options/options.service';
import { app_strings } from 'src/app/_constants/app_strings';

@Component({
  selector: 'app-generate-enquiries',
  templateUrl: './generate-enquiries.component.html',
  styleUrls: ['./generate-enquiries.component.css']
})
export class GenerateEnquiriesComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  editFlag: any;
  submitted = false;
  craft: any;
  artisanList: any;
  material: any;
  imagesObj: any = {};
  imageSrc: any = [];
  deleteId = [];
  type: any;
  keyword = 'name';
  data = [];
  stateListArr;
  stateId = [];
  craftId = [];
  materialId = [];
  productListArr;
  requestToSettings = {};
  page = 1;
  focusid = 0;
  tabType = '1';
  constructor(private fb: FormBuilder,
              private _route: Router,
              private userService: UserService,
              private manageListingService: OptionsService,
              private route: ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        console.log(params.id);
        this.type = params.type;
        if (params.id) {
          this.focusid = params.id;
          this.tabType = params.type === 'lead' ? '1' : (params.type === 'email' ? '2' : '3');
          this.page = params.page;
          this.editFlag = true;
          this.getDetails(params);
        }

      });
  }
  ngOnInit() {
    this.requestToSettings = {
      singleSelection: false,
                  idField: 'id',
                  textField: 'group_name',
                  selectAllText: 'Select All',
                  unSelectAllText: 'UnSelect All',
                  itemsShowLimit: 3,
                  "enableCheckAll": false,
                  allowSearchFilter: true
    };
    this.getMaterialList('material');
    this.getCraftList('craft');
    this.getProductList('products');
    this.getArtisanGroupList();
    this.getStateList();
    this.createForm();
  }
  ngOnDestroy() {
    if (this.page) {
      sessionStorage.setItem('enqPage', JSON.stringify(this.page));
      sessionStorage.setItem('enqFocus', JSON.stringify(this.focusid));
      sessionStorage.setItem('tabType', JSON.stringify(this.tabType));
    }
  }
  get f() {
    return this.myForm.controls;
  }
  getDetails(val: Params) {
    this.userService.getEnquiriesById(val)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        // this.getCraft(result.estateId);
        // this.getMaterial(result.craftId);
        // this.getProducts(result.materialId);
        this.myForm.patchValue({
          mailBy: result.mailBy,
          mailSubject: result.mailSubject,
          mailBody: result.mailBody,

          title: result.title,
          description: result.description,
          craft: result.craftId || undefined,
          material: result.materialId || undefined,
          requestTo: result.requestTo || '',
          enquiryId: result.uniqueId || '',
          id: result.id || '',
          estateId: result.estateId || undefined,
          pproductId: result.pproductId || undefined
        });
        if (result.attachment) {
          result.attachment.forEach(el => {
            this.imageSrc.push(el.attachment);
            this.addMoreImages(el);
          });
        }
        console.log(this.myForm.get('images').value);
      });
  }
  createForm() {
    this.myForm = this.fb.group({
      images: this.fb.array([]),
      enquiryId: [''],
      id: [''],
      mailBy: [''],
      mailSubject: [''],
      mailBody: [''],
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      craft: [undefined, Validators.compose([Validators.required])],
      material: [undefined, Validators.compose([Validators.required])],
      requestTo: ['', Validators.compose([Validators.required])],
      expectedPrice: ['', Validators.compose([Validators.required])],
      // productId: ['', Validators.compose([Validators.required])],
      pproductId: [undefined, Validators.compose([Validators.required])],
      estateId: [undefined, Validators.compose([Validators.required])],
      qty:['', Validators.compose([Validators.required])]
    });
    if (!this.editFlag) {
      this.addMoreImages();
    }
  }
  addMoreImages(ob = { url: 'assets/images/camera_images.png' }) {
    const images = this.myForm.get('images') as FormArray;
    images.push(this.createItem(ob.url));
  }
  deleteImages(index: number) {
    (<FormArray>this.myForm.get('images')).removeAt(index);
    delete this.imagesObj[index];
    this.imageSrc.splice(index, 1);
}
  createItem(url = 'assets/images/camera_images.png'): FormGroup {
    return this.fb.group({
      image: url
    });
  }
  showImage(imageUrl) {
    if (!imageUrl) { return; }
    this.userService.showImage(imageUrl);
  }
  changeImage(val) {
    console.log(val.value);
    if (val.value.id) {
      this.deleteId.push(val.value.id);
    }
    // val.value.image = (val.value.image).toString();
    // console.log(val.value.image.length);
    // if (val.value.image.length < 10) {
    //   this.deleteId.push(val.value.image);
    // }
    console.log(this.deleteId);
  }
  readURL(e: { target: { files: Blob[]; }; }, i: string | number) {
    if (e.target.files && e.target.files[0]) {
      this.imagesObj[i] = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc[i] = reader.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }
  getCraftList(type: string) {
    const ob = {
      type,
    };
    this.manageListingService
      .listing(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.craft = result;
      });
  }
  getMaterialList(type: string) {
    const ob = {
      type,
    };
    this.manageListingService
      .listing(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.material = result;
      });
  }
  getProductList(type: string) {
    const ob = {
      type,
    };
    this.manageListingService
      .listing(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.productListArr = result;
      });
  }
  getArtisanGroupList() {
    this.userService.getGroupListArtisan()
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.artisanList = result;
        this.artisanList.unshift({id: 0, group_name: "All",
        craft: "",
        created_at: "",
        created_by: 1,
        isActive: 1,
        total_artisan: ''});
      });
  }
  submit(ob: any) {
    if (this.myForm.invalid) {
      this.myForm.markAsTouched();
      this.submitted = true;
      return;
    }
    if (JSON.stringify(this.imagesObj) === '{}') {
      this.userService.error(app_strings.IMAGE_VALIDATION);
      return;
    }
    let requestTo = [];
    ob.requestTo.forEach(element => {
      if (element.id === 0) {
        requestTo.push('All');
      } else {
        requestTo.push(element.id);
      }
    });
    ob.requestTo = requestTo.toString();
    // console.log('>>>ob', ob);
    // return;
    // delete ob.id;
    //   delete ob.enquiryId;
      delete ob.images;
      ob.craftId = ob.craft;
      ob.materialId = ob.material;

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
    // if (this.editFlag) {
    //   fd.append('id', ob);
    // }

    this.userService
      .genrateNewEnquiry(fd)
      .pipe(take(1))
      .subscribe((res) => {
        this._route.navigate(['/enquiries'], { queryParams: { type: this.type } });
        // sessionStorage.setItem('genEnq', '1');
      });
  }
  // productsListing(search) {
  //   const temp = {
  //     page: 1,
  //     search: search || '',
  //     userId: this.userService.getUserId() || localStorage.get('x-id'),
  //   };
  //   this.userService
  //     .listingProductPagination(temp)
  //     .pipe(take(1))
  //     .subscribe((res) => {

  //       this.data = res.result;

  //     });
  // }
  selectEvent(item) {
    console.log('selectevetn', item);
    this.myForm.get('productId').setValue(item.id)
    // do something with selected item
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
      //   this.getCraft(res.result.pstateId);
      // }
    });
  }
  // getCraft(val) {
  //   this.stateId = [];
  //   this.craft = [];
  //   this.stateId.push(val);
  //   // this.stateId.toString();
  //   const ob: any = {
  //     stateId: this.stateId.toString()
  //   };
  //   console.log('request',ob);

  //   this.userService.getManageListingHeirarchy(ob, 'CRAFT').subscribe(res => {
  //     if (res && res.code === 200) {

  //       this.craft = res.result;
  //       // if (this.editFlag) {
  //       //   this.getMaterial(res.result.craft);
  //       // }
  //     } else {
  //       this.userService.error(res.message);
  //     }
  //   });
  // }
  // getMaterial(val) {
  //   this.material = [];
  //   this.craftId = [];
  //   this.craftId.push(val);
  //   // this.craftId.toString();
  //   const ob: any = {
  //     stateId: this.stateId.toString(),
  //     craftId: this.craftId.toString()
  //   };
  //   this.userService.getManageListingHeirarchy(ob, 'MATERIAL').subscribe(res => {
  //     if (res && res.code === 200) {
  //       this.material =  res.result;
  //     } else {
  //       this.userService.error(res.message);
  //     }
  //   });
  // }
  // getProducts(val) {
  //   this.productListArr = [];
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
  //       this.productListArr =  res.result;
  //     } else {
  //       this.userService.error(res.message);
  //     }
  //   });
  // }
  // onChangeSearch(val: string) {
  //   console.log('onchanges', val);
  //   if (val.length > 3 || val.length === 0) {
  //     this.productsListing(val);
  //   }
  //   // fetch remote data from here
  //   // And reassign the 'data' which is binded to 'data' property.
  // }
  // focused = false
  // onFocused(e) {
  //   console.log('onfocy', e);
  //   if (!this.focused) {
  //     this.productsListing('');
  //   }
  //   this.focused = true

  //   // do something when input is focused
  // }
}
