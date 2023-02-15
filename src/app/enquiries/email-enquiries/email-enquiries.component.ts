import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OptionsService } from 'src/app/options/options.service';
import { app_strings } from 'src/app/_constants/app_strings';
import * as _ from 'lodash';
@Component({
  selector: 'app-email-enquiries',
  templateUrl: './email-enquiries.component.html',
  styleUrls: ['./email-enquiries.component.css']
})
export class EmailEnquiriesComponent implements OnInit, OnDestroy {
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private manageListingService: OptionsService,
    private _route: Router,
    private route: ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        console.log('---------------------------------......', params);
        this.type = params.type;
        if (this.type === 'enquiries/generateEnqList' && params.id) {
          this.editable = false;
        }
        else {
          this.editable = true
        }
        if (params.id) {
          this.focusid = params.id;
          this.tabType = params.type === 'lead' ? '1' : (params.type === 'email' ? '2' : '3');
          this.page = params.page;
          this.editFlag = true;
          this.getDetails(params);
        } else {
          this.getCraftList('craft');
          this.getMaterialList('material');
          this.getProductList('products');
        }
      });
  }
  get f() {
    return this.myForm.controls;
  }
  myForm: FormGroup;
  editFlag = false;
  editable: any;
  submitted = false;
  craft: any;
  artisanList: any;
  material: any;
  imagesObj: any = {};
  imageSrc: any = [];
  deleteId = [];
  type: any;
  // tslint:disable-next-line: member-ordering
  keyword = 'name';
  data = [];
  focused = false;
  state :any= [];
  // craft :any=  [];
  materail :any=  [];
  product: any = [];
  craftList = [];
  craftSetting = {};
  productList = [];
  productSetting = {};
  materialList = [];
  materialSetting = {};
  stateListArr;
  stateId = [];
  craftId = [];
  materialId = [];
  productListArr;
  requestToSettings = {};
  page = 1;
  focusid = 0;
  tabType = '1';
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
    // this.getStateList();
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
  getDetails(val: Params) {
    this.userService.getEnquiriesById(val)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        if (this.editFlag && this.type === 'enquiries/generateEnqList') {
          // this.getCraft(result.estateId);
          // this.getMaterial(result.craftId);
          // this.getProducts(result.materialId);
        }
        this.getCraftList('craft');
        this.getMaterialList('material');
        this.getProductList('products');
        this.myForm.patchValue({
          title: result.title,
          description: result.description,
          craft: result.craftId || undefined,
          material: result.materialId || undefined,
          requestTo: result.requestTo || '',
          enquiryId: result.uniqueId || '',
          expectedPrice: result.expPrice || '',
          qty:result.qty || '',
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
      update_status: ['enquiry forwared to artisan'],
      id: [''],
      qty:['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      craft: [undefined, Validators.compose([Validators.required])],
      material: [undefined, Validators.compose([Validators.required])],
      requestTo: ['', Validators.compose([Validators.required])],
      expectedPrice: ['', Validators.compose([Validators.required])],
      pproductId: [undefined, Validators.compose([Validators.required])],
      estateId: [undefined, Validators.compose([Validators.required])]
    });
    if (!this.editFlag) {
      this.addMoreImages();
    }
  }
  addMoreImages(ob = { attachment: 'assets/images/camera_images.png', id: '' }) {
    console.log('ob', ob);
    const images = this.myForm.get('images') as FormArray;
    images.push(this.createItem(ob));
  }
  deleteImages(index: number) {
    (<FormArray>this.myForm.get('images')).removeAt(index);
    delete this.imagesObj[index];
    this.imageSrc.splice(index, 1);
}
  createItem(obj): FormGroup {
    console.log('obj', obj);
    return this.fb.group({
      image: obj.attachment,
      id: obj.id
    });
  }
  changeImage(val) {
    console.log(val.value);
    if (val.value.id) {
      this.deleteId.push(val.value.id);
    }
    // debugger;
    // val.value.image = (val.value.image).toString();
    // console.log(val.value.image.length);
    // if (val.value.length < 10) {
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
  // getCraft(val,condition, editCondition?) {
  //   if(condition=!''){
  //     this.artisanGrp.patchValue({ craft: null });
  // }
  //   console.log(val,condition,'selectedStates', this.f.state.value);
  //   this.state = [];

  //   // if(condition!='ALL'){
  //   // this.manageListingGrp.value.stateId.forEach(element => {
  //   //     this.state.push(element.id);
  //   //   });
  //   // }
  //   // else{
  //   //   val.forEach(element => {
  //   //     this.state.push(element.id);
  //   //   });
  //   // }
  //   this.state.push(val);
  //   this.state=condition=='DESELECTALL'?'':this.state.toString();
  //   const ob: any = {
  //     stateId:this.state
  //   };
  //   console.log('request',ob);

  //   this.userService.getManageListingHeirarchy(ob, 'CRAFT').subscribe(res => {
  //     if (res && res.code === 200) {

  //       this.craftList = res.result.filter(el=>{
  //         if(el.type=='craft') return true
  //       });
  //       if (this.editDataArr && editCondition) {
  //         this.artisanGrp.patchValue({ craft: this.editDataArr.craft });
  //         this.getMaterial('', '',  true);
  //       }
  //       // if (this.key === 'products') {
  //       //   this.getMaterial('','');
  //       // }
  //     } else {
  //       this.userService.error(res.message);
  //     }
  //   });
  // }
  // getMaterial(val,condition, editCondition?) {
  //   console.log(val,condition,'selectedCraft', this.f.craft.value);
  //   if(condition=!''){
  //     this.artisanGrp.patchValue({ material: null });
  // }
  //   this.craft = [];
  //   // this.manageListingGrp.value.craftId.forEach(element => {
  //   //     this.craft.push(element.id);
  //   //   });

  //   if(condition!='ALL'){
  //     this.artisanGrp.value.craft.forEach(element => {
  //         this.craft.push(element.id);
  //       });
  //     }
  //     else{
  //       val.forEach(element => {
  //         this.craft.push(element.id);
  //       });
  //     }
  //     this.craft=condition=='DESELECTALL'?'':this.craft.toString();
  //   const ob: any = {
  //     stateId: this.state.toString(),
  //     craftId: this.craft.toString()
  //   };
  //   this.userService.getManageListingHeirarchy(ob, 'MATERIAL').subscribe(res => {
  //     if (res && res.code === 200) {
  //       this.materialList =  res.result.filter(el=>{
  //         if(el.type=='material') return true
  //       });
  //       if (this.editDataArr && editCondition) {
  //         this.artisanGrp.patchValue({ material: this.editDataArr.material });
  //         this.getProducts('', '', true);
  //       }
  //     } else {
  //       this.userService.error(res.message);
  //     }
  //   });
  // }
  // getProducts(val,condition, editCondition?) {
  //   // console.log(val,condition,'selectedCraft', this.f.craftId.value);
  //   if(condition=!''){
  //     this.artisanGrp.patchValue({ product: null });
  // }
  //   this.materail = [];
  //   // this.manageListingGrp.value.craftId.forEach(element => {
  //   //     this.craft.push(element.id);
  //   //   });

  //   if(condition!='ALL'){
  //     this.artisanGrp.value.material.forEach(element => {
  //         this.materail.push(element.id);
  //       });
  //     }
  //     else{
  //       val.forEach(element => {
  //         this.materail.push(element.id);
  //       });
  //     }
  //     this.materail=condition=='DESELECTALL'?'':this.materail.toString();
  //   const ob: any = {
  //     stateId: this.state.toString(),
  //     craftId: this.craft.toString(),
  //     materialId: this.materail.toString()
  //   };
  //   this.userService.getManageListingHeirarchy(ob, 'PRODUCT').subscribe(res => {
  //     if (res && res.code === 200) {
  //       this.productList =  res.result.filter(el=>{
  //         if(el.type=='products') return true
  //       });
  //       if (this.editDataArr && editCondition) {
  //         this.artisanGrp.patchValue({ product: this.editDataArr.product });
  //         // this.materialSelect()
  //       }
  //     } else {
  //       this.userService.error(res.message);
  //     }
  //   });
  // }
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
  submit(ob) {
    console.log(ob);
    if (this.myForm.invalid) {
      this.myForm.markAsTouched();
      this.submitted = true;
      return;
    }
    if (this.editFlag === false && JSON.stringify(this.imagesObj) === '{}') {
      this.userService.error(app_strings.IMAGE_VALIDATION);
      return;
    }
    let requestTo = [];
    if (this.editFlag) {
      ob.requestTo.forEach(element => {
        if (element.id === 0) {
          requestTo.push('All');
        } else {
          requestTo.push(element.id);
        }
      });
      ob.requestTo = requestTo.toString();
      ob.craftId = ob.craft;
      ob.materialId = ob.material;
      ob.image_ids = this.deleteId.toString();
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
      this.userService
        .genrateNewEnquiry(fd)
        .pipe(take(1))
        .subscribe((res) => {
          if (this.type === 'enquiries/generateEnqList') {
            this._route.navigate(['/generated-enquiry']);
          } else { this._route.navigate(['/enquiries'], { queryParams: { type: this.type } }); }
        });
    } else {
      ob.requestTo.forEach(element => {
        if (element.id === 0) {
          requestTo.push('All');
        } else {
          requestTo.push(element.id);
        }
      });
      ob.requestTo = requestTo.toString();
      delete ob.id;
      delete ob.enquiryId;
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
      this.userService
        .genrateNewEnquiry(fd)
        .pipe(take(1))
        .subscribe((res) => {
          // this._route.navigate([`${this.type}`]);
          this._route.navigate(['/generated-enquiry'])
        });
    }
  }
  productsListing(search) {
    const temp = {
      page: 1,
      search: search || '',
      userId: this.userService.getUserId() || localStorage.get('x-id'),
    };
    this.userService
      .listingProductPagination(temp)
      .pipe(take(1))
      .subscribe((res) => {
        this.data = res.result;
      });
  }
  selectEvent(item) {
    console.log('selectevetn', item);
    this.myForm.get('pproductId').setValue(item.id);
    // do something with selected item
  }
  onChangeSearch(val: string) {
    console.log('onchanges', val);
    if (val.length > 3 || val.length === 0) {
      this.productsListing(val);
    }
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  onFocused(e) {
    console.log('onfocy', e);
    if (!this.focused) {
      this.productsListing('');
    }
    this.focused = true;
    // do something when input is focused
  }
  showImage(imageUrl) {
    if (!imageUrl) { return; }
    this.userService.showImage(imageUrl);
  }
  // getCraft(val) {
  //   this.stateId = [];
  //   this.craft = [];
  //   this.stateId.push(val);
  //   const ob: any = {
  //     stateId: this.stateId.toString()
  //   };
  //   console.log('request',ob);

  //   this.userService.getManageListingHeirarchy(ob, 'CRAFT').subscribe(res => {
  //     if (res && res.code === 200) {

  //       this.craft = res.result;
  //     } else {
  //       this.userService.error(res.message);
  //     }
  //   });
  // }
  // getMaterial(val) {
  //   this.material = [];
  //   this.craftId = [];
  //   this.craftId.push(val);
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
}
