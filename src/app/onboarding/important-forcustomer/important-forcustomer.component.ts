import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { OnboardingService } from '../onboarding.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';
import { CrudService } from 'src/app/_services/crud.service';
import { UserService } from 'src/app/_services/user.service';
@Component({
  selector: 'app-important-forcustomer',
  templateUrl: './important-forcustomer.component.html',
  styleUrls: ['./important-forcustomer.component.css']
})
export class ImportantForcustomerComponent implements OnInit {
  myForm: FormGroup;
  flickerArr: any = {};
  imagesObj: any;
  constructor(private formBuilder: FormBuilder,
    private crudService: CrudService,
    private userService: UserService,
    private onboarding: OnboardingService) { }
  ngOnInit() {
    this.imagesObj = undefined;
    this.createForm();
    this.getList({ table: app_strings.MODELS.customer_important_sample });
  }
  createForm() {
    this.myForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      country: ['India'],
      items: this.formBuilder.array([])
    });
  }
  fileUpload(e, condition) {
    const file = e.target.files[0];
    this.imagesObj = file;
    // this.imagesObj[type] = file;
    this.userService.imagePreview(file)
      .then(preview => {

      });

    if (condition)
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
    if (this.myForm.get('name').invalid || this.imagesObj === undefined) {
      this.userService.error(app_strings.IMAGE_VALIDATION);
      return;
    } else {
      const ob = {
        table: app_strings.MODELS.customer_important_sample,
        type: val.name,
        country: val.country
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
          table: app_strings.MODELS.customer_important_sample,
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
  getList(ob: any) {
    console.log(ob);
    this.onboarding.listingLoginOnboarding(ob).subscribe(res => {
      res.result.forEach((element: any) => {
        this.addItem(element);
      });
    });
  }
  get f() {
    return this.myForm.controls;
  }
  createItem(val: { type: any; id: any; icon: any; }): FormGroup {
    return this.formBuilder.group({
      name: val.type || '',
      id: val.id || '',
      icon: val.icon
    });
  }
  def(e: { target: { src: string; }; }, id: string | number) {
    this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    const img = 'assets/images/def.png';
    if (!e && this.flickerArr[id] > 1) { return; }
    e.target.src = img;
  }
  addItem(val: any): void {
    // if (this.myForm.get('name').invalid) { return; }
    const items = this.myForm.get('items') as FormArray;
    items.push(this.createItem(val));
    this.myForm.get('name').reset();
  }
  submit(val: any) {
    console.log(val);
  }
}
