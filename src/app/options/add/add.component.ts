import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';
import { OptionsService } from '../options.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/_services/crud.service';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit, OnDestroy {
  manageListingGrp: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  types: any = ['craft', 'material', 'state', 'products'];
  editFlag = false;
  editId: any;
  editDataArr: any = [];
  key: any;
  editStateFlag: boolean;
  stateListArr;
  stateListSubs: Subscription;
  stateSetting = {};
  craftSetting = {};
  materialSetting = {};
  submitted = false;
  craftListArr;
  materailListArr;
  state :any= [];
  craft :any=  [];
  materail :any=  [];
  constructor(private fb: FormBuilder,
              private manageListingService: OptionsService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private crudService: CrudService) {
                this.stateSetting = {
                  singleSelection: false,
                  idField: 'id',
                  textField: 'name',
                  selectAllText: 'Select All',
                  unSelectAllText: 'UnSelect All',
                  itemsShowLimit: 5,
                  allowSearchFilter: true
                };
                this.craftSetting = {
                  singleSelection: false,
                  idField: 'id',
                  textField: 'name',
                  selectAllText: 'Select All',
                  unSelectAllText: 'UnSelect All',
                  itemsShowLimit: 5,
                  allowSearchFilter: true
                };
                this.materialSetting = {
                  singleSelection: false,
                  idField: 'id',
                  textField: 'name',
                  selectAllText: 'Select All',
                  unSelectAllText: 'UnSelect All',
                  itemsShowLimit: 5,
                  allowSearchFilter: true
                };
               }
  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.editId = params.id;
        this.key = params.key;
        if (this.editId) {
          this.editData();
          this.editFlag = true;
        } else {
          this.getStateList();
        }
      });
    // this.getStateList();
    this.newsfeedFrm();

  }
  editData() {
    const ob = {
      id: this.editId,
      type: app_strings.MODELS.options,
    };
    this.crudService
      .editData(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.editDataArr = result;
        console.log('=====', this.editDataArr)
        if (!this.editDataArr) { return; }
        this.getStateList();
        const { name, type, image, hindiName, gujratiName, bangaliName } = this.editDataArr;
        this.previewObj.image = image;
        this.manageListingGrp.patchValue({ name, type, hindiName, gujratiName, bangaliName });
        // switch (this.key) {
        //   case 'material':
        //     this.getCraft();
        //     break;
        //   case 'products':
        //     this.getCraft();
        //     this.getMaterial();
        //     break;
        //   default:
        //     break;
        // }
        if (this.editDataArr && this.editDataArr.type === 'state') {
          this.clearValidators();
          // this.editStateFlag = true;
        }
      });
  }
  newsfeedFrm() {
    this.manageListingGrp = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      type: [this.key, Validators.compose([Validators.required])],
      bangaliName: ['', Validators.compose([Validators.required])],
      gujratiName: ['', Validators.compose([Validators.required])],
      hindiName: ['', Validators.compose([Validators.required])],
      stateId: [''],
      craftId: [''],
      materialId: ['']
    });
    if (this.key !== 'state') {
      // this.editStateFlag = true;
      this.setValidators();
    }
    if (this.key === 'material' || this.key === 'products') {
      this.setCraftValidator();
    }
    if (this.key === 'products') {
      this.setMaterailValidator();
    }
  }
  setCraftValidator() {
    this.f.craftId.setValidators([Validators.required]);
    this.f.craftId.updateValueAndValidity();
  }
  setMaterailValidator() {
    this.f.materialId.setValidators([Validators.required]);
    this.f.materialId.updateValueAndValidity();
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
  get f() { return this.manageListingGrp.controls; }
  submit() {

    this.submitted = true;
    if (this.manageListingGrp.invalid) {
      this.manageListingGrp.markAsTouched();
      // this.userService.error(app_strings.INVALID_FORM)
      return;
    }
    const ob: any = {
      name: this.f.name.value,
      type: this.f.type.value,
      isActive: 1,
      bangaliName: this.f.bangaliName.value,
      gujratiName: this.f.gujratiName.value,
      hindiName: this.f.hindiName.value
    };
    // if (this.editStateFlag) {
    //   ob.bangaliName = this.f.bangaliName.value;
    //   ob.gujratiName = this.f.gujratiName.value;
    //   ob.hindiName = this.f.hindiName.value;
    // }
    if (this.key !== 'state') {
      const state = [];
      this.manageListingGrp.value.stateId.forEach(element => {
        state.push(element.id);
      });
      ob.stateId = state.toString();
    }
    if (this.key !== 'state' && this.key === 'material') {
      ob.craftId = this.craft.toString();
    }
    if (this.key !== 'state' && this.key === 'products') {
      ob.craftId = this.craft.toString();
      ob.materialId = this.materail.toString();
    }
    for (const key in this.imagesObj) {
      if (this.imagesObj.hasOwnProperty(key)) {
        const element = this.imagesObj[key];
        ob.manageListing = element;
      }
    }
    // tslint:disable-next-line: triple-equals
    if (this.editFlag == false && JSON.stringify(this.imagesObj) == '{}') {
      this.userService.error(app_strings.IMAGE_VALIDATION);
      return;
    }
    const fd = new FormData();
    for (const key in ob) {
      if (ob.hasOwnProperty(key)) {
        const element = ob[key];
        fd.append(key, element);
      }
    }
    // tslint:disable-next-line: triple-equals
    if (this.editFlag == true) {
      fd.append('id', this.editId);
    }
    this.manageListingService.add(fd)
      .pipe(take(1))
      .subscribe(res => {
        this.manageListingGrp.reset();
        this.previewObj = this.imagesObj = {};
        this.router.navigate(['/options'], { queryParams: { id: this.f.type.value } });
      });
  }

  onTypeChange(val) {

    this.key = val;
    if (this.key === 'state') {
      // this.editStateFlag = true;
      this.clearValidators();
    } else {
      // this.editStateFlag = false;
      this.setValidators();
    }
  }

  setValidators() {
    this.f.stateId.setValidators(Validators.required);
    this.f.stateId.updateValueAndValidity();
  }

  clearValidators() {
    this.f.stateId.clearValidators();
    this.f.stateId.updateValueAndValidity();
  }

  getStateList() {
    // this.manageListingGrp.get('craftId').setValue(null)
    // this.manageListingGrp.get('materialId').setValue(null)
    const ob = {
      type: 'state'
    };
    this.stateListSubs = this.userService.getStateList(ob).subscribe(res => {
      if (res && res.code === 200) {
        this.stateListArr = res.result;
        if (this.editDataArr) {
          this.manageListingGrp.patchValue({ stateId: this.editDataArr.stateArr });
        }
        // debugger
        if (this.key === 'material' || this.key === 'products') {
          this.getCraft('','');
        }
      }
    });
  }

  getCraft(val,condition) {
    if(condition=!''){
      this.manageListingGrp.patchValue({ craftId: null });
  }
    console.log(val,condition,'selectedStates', this.f.stateId.value);
    this.state = [];

    if(condition!='ALL'){
    this.manageListingGrp.value.stateId.forEach(element => {
        this.state.push(element.id);
      });
    }
    else{
      val.forEach(element => {
        this.state.push(element.id);
      });
    }
    this.state=condition=='DESELECTALL'?'':this.state.toString();
    const ob: any = {
      stateId:this.state
    };
    console.log('request',ob);

    this.userService.getManageListingHeirarchy(ob, 'CRAFT').subscribe(res => {
      if (res && res.code === 200) {

        this.craftListArr = res.result.filter(el=>{
          if(el.type=='craft') return true
        });
        if (this.editDataArr) {
          this.manageListingGrp.patchValue({ craftId: this.editDataArr.craftArr });
        }
        if (this.key === 'products') {
          this.getMaterial('','');
        }
      } else {
        this.userService.error(res.message);
      }
    });
  }

  getMaterial(val,condition) {
    console.log(val,condition,'selectedCraft', this.f.craftId.value);
    this.craft = [];
    // this.manageListingGrp.value.craftId.forEach(element => {
    //     this.craft.push(element.id);
    //   });

    if(condition!='ALL'){
      this.manageListingGrp.value.craftId.forEach(element => {
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
        this.materailListArr =  res.result.filter(el=>{
          if(el.type=='material') return true
        });
        if (this.editDataArr) {
          this.manageListingGrp.patchValue({ materialId: this.editDataArr.materialArr });
          this.materialSelect()
        }
      } else {
        this.userService.error(res.message);
      }
    });
  }

  materialSelect() {
    this.materail = [];
    this.manageListingGrp.value.materialId.forEach(element => {
        this.materail.push(element.id);
      });
  }


  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.stateListSubs.unsubscribe();
  }
}
