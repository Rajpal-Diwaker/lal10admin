import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OptionsService } from 'src/app/options/options.service';
import { app_strings } from 'src/app/_constants/app_strings';
import * as _ from 'lodash';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {
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
          this.editFlag = true;
          this.focusid = params.id;
          this.page = params.page;
          this.getDetails(params);
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
  enquiryDetails;
  // imageChangeFlag = false;
  imgIds = [];
  randomId = 10000;
  requestToSettings = {};
  selectedVal = [];
  focusid = 0;
  page = 1;
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
    this.getCraftList('craft');
    this.getMaterialList('material');
    this.getProductList('products');
    // this.getArtisanGroupList();
    this.getStateList();
    this.createForm();
  }
  ngOnDestroy(): void {
    // alert('destroy')
    if (this.page) {
      sessionStorage.setItem('genEnqPage', JSON.stringify(this.page));
      sessionStorage.setItem('genEnqFocus', JSON.stringify(this.focusid));
    }
  }
  getDetails(val: Params) {
    this.userService.getEnquiriesById(val)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.enquiryDetails = res.result;
        this.getArtisanGroupList();
        // const { reqList } = this.enquiryDetails.requestTo2;
        // this.myForm.patchValue({ requestTo: reqList })
        if (this.editFlag && this.type === 'enquiries/generateEnqList') {
          // this.getCraft(result.estateId);
          // this.getMaterial(result.craftId);
          // this.getProducts(result.materialId);
        }
        this.myForm.patchValue({
          title: result.title,
          description: result.description,
          craft: result.craftId,
          material: result.materialId,
          // requestTo: result.requestTo || '',
          enquiryId: result.uniqueId || '',
          expectedPrice: result.expPrice || '',
          qty:result.qty || '',
          id: result.id || '',
          estateId: result.estateId,
          pproductId: result.pproductId
        });
        if (result.attachment) {
          result.attachment.forEach(el => {
            this.imageSrc.push(el.attachment);
            this.imgIds.push(el.id);
            this.addMoreImages(el);
          });
        }
        console.log('checkImage', this.imageSrc);
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
      craft: ['', Validators.compose([Validators.required])],
      material: ['', Validators.compose([Validators.required])],
      requestTo: ['', Validators.compose([Validators.required])],
      expectedPrice: ['', Validators.compose([Validators.required])],
      pproductId: ['', Validators.compose([Validators.required])],
      estateId: ['', Validators.compose([Validators.required])]
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
    // this.imageChangeFlag = true;
    this.imageSrc.splice(index, 1);
    this.imgIds.splice(index, 1);
    console.log('>>>>IMGiDS', this.imgIds);
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
        // this.imageChangeFlag = true;
        this.randomId++;
        this.imgIds[i] = this.randomId;
        console.log('>>>>IMGiDS', this.imgIds);
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
        const reqList  = this.enquiryDetails.requestTo2;
        console.log('>>>REQLIST', reqList)
        this.myForm.patchValue({ requestTo: reqList })
        this.artisanList.forEach(element => {
          // if (i===0) {
          //   element.isDisabled = true;
          // }
          reqList.forEach(ele => {
            if (ele.id === element.id) {
              element.isDisabled = true;
            }
          });
        });
        console.log('artisangrp', this.artisanList);
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
    if (this.editFlag) {
      let updatedValues = [];
      let requestTo = [];
      if (this.f.title.value !== this.enquiryDetails.title) {
        updatedValues.push('TITLE');
      }
      if (this.f.description.value !== this.enquiryDetails.description) {
        updatedValues.push('DESCRIPTION');
      }
      if (Number(this.f.expectedPrice.value) !== Number(this.enquiryDetails.expPrice)) {
        updatedValues.push('EXP_PRICE');
      }
      if (Number(this.f.qty.value) !== Number(this.enquiryDetails.qty)) {
        updatedValues.push('QTY');
      }
      for (let i = 0; i < this.imgIds.length; i++) {
        if (this.enquiryDetails.attachment[i]) {
          if (this.enquiryDetails.attachment[i].id !== this.imgIds[i]) {
            updatedValues.push('IMG');
          }
        } else {
          updatedValues.push('IMG');
        }
      }
      if (this.selectedVal.length) {
        updatedValues.push('ART');
      }
      ob.requestTo.forEach(element => {
        if (element.id === 0) {
          requestTo.push('All');
        } else {
          requestTo.push(element.id);
        }
      });
      if (!updatedValues.length) {
        this._route.navigate(['/generated-enquiry']);
        return;
      }
      ob.craftId = ob.craft;
      ob.materialId = ob.material;
      ob.image_ids = this.deleteId.toString();
      ob.requestTo = requestTo.toString();
      console.log('>>>CheckOB', ob);
      // return;
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
          this._route.navigate([`${this.type}`]);
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

  onArtisanGrpSelect(e, type: string) {
    console.log(e, type);
    if (type === 'ON') {
      this.selectedVal.push(e);
    } else {
      this.selectedVal.forEach((element, i) => {
        if (element.id === e.id) {
          this.selectedVal.splice(i, 1);
        }
      });
    }
    console.log('selectedVal', this.selectedVal);
    console.log('reqToFormControl', this.f.requestTo.value);
  }

}
