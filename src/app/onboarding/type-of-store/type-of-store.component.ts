import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { OnboardingService } from '../onboarding.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { CrudService } from 'src/app/_services/crud.service';
import { take } from 'rxjs/operators';
import { UserService } from 'src/app/_services/user.service';
declare var $: any;
@Component({
  selector: 'app-type-of-store',
  templateUrl: './type-of-store.component.html',
  styleUrls: ['./type-of-store.component.css']
})
export class TypeOfStoreComponent implements OnInit {
  imagesObj: any;
  constructor(private formBuilder: FormBuilder,
    private crudService: CrudService,
    private userService: UserService,
    private onboarding: OnboardingService) { }
  get f() {
    return this.myForm.controls;
  }
  myForm: FormGroup;
  flickerArr: any = {};
  ngOnInit() {
    this.createForm();
    console.log(this.myForm.value);
    this.getList({ table: app_strings.MODELS.type_of_store });
  }
  getList(ob) {
    this.onboarding.listingLoginOnboarding(ob).subscribe(res => {
      res.result.forEach(element => {
        this.addItem(element);
      });
    });
  }
  createForm() {
    this.myForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      items: this.formBuilder.array([])
    });
  }
  createItem(val): FormGroup {
    return this.formBuilder.group({
      name: val.name || '',
      id: val.id || '',
      icon: val.icon
    });
  }
  fileUpload(e,condition) {
    const file = e.target.files[0];
    this.imagesObj = file;
    // this.imagesObj[type] = file;
    this.userService.imagePreview(file)
      .then(preview => {
        console.log(preview);
      });
    console.log(this.imagesObj);
    if(condition)
    this.udpate(this.myForm.value);
  }
  udpate(val) {
    if (this.myForm.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      return;
    }
    if (this.imagesObj === undefined) {
      this.userService.error(app_strings.PLEASE_UPLOAD_IMAGE);
      return;
    } else {
      const ob = {
        table: app_strings.MODELS.type_of_store,
        type: val.name
      };
      const fd = new FormData();
      for (const key in ob) {
        if (ob.hasOwnProperty(key)) {
          const element = ob[key];
          fd.append(key, element);
        }
      }
      if (val.id) {
        fd.append('id', val.id);
      }
      fd.append('loginOnboarding', this.imagesObj)
      this.onboarding.addLoginOnboarding(fd).subscribe(res => {
        this.imagesObj=undefined
        this.ngOnInit();
      })
    }
  }
  delete(val) {
    this.crudService.confirmPopup().then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
      } else {
        const ob = {
          table: app_strings.MODELS.type_of_store,
          id: val.id
        };
        this.onboarding
          .delLoginOnboarding(ob)
          .pipe(take(1))
          .subscribe(() => {
            this.ngOnInit();
          });
      }
    });
  }
  edit(val, index) {
    console.log(val, index);
    this.myForm.get('id').setValue(val.id);
    this.myForm.get('name').setValue(val.name);
  }
  addItem(val): void {
    // if (this.myForm.get('name').invalid) { return; }
    const items = this.myForm.get('items') as FormArray;
    items.push(this.createItem(val));
    this.myForm.get('name').reset();
  }
  def(e: { target: { src: string; }; }, id: string | number) {
    this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    const img = 'assets/images/def.png';
    if (!e && this.flickerArr[id] > 1) { return; }
    e.target.src = img;
  }
  submit(val) {
    console.log(val);
  }
}
/*  $('[type=file]').on('change', function() {
      const file = this.files[0].name;
      const dflt = $(this).attr('placeholder');
      // tslint:disable-next-line: triple-equals
      if ($(this).val() != '') {
        $(this).next().text(file);
      } else {
        $(this).next().text(dflt);
      }
    }); */
