import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { OnboardingService } from '../onboarding.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { UserService } from 'src/app/_services/user.service';
import { take } from 'rxjs/operators';
import { CrudService } from 'src/app/_services/crud.service';
@Component({
  selector: 'app-how-you-here',
  templateUrl: './how-you-here.component.html',
  styleUrls: ['./how-you-here.component.css']
})
export class HowYouHereComponent implements OnInit {
  myForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private crudService: CrudService,
    private onboarding: OnboardingService) { }
  ngOnInit() {
    this.createForm();
    this.getList({ table: app_strings.MODELS.aboutus_sample });
  }
  getList(ob: any) {
    console.log(ob);
    this.onboarding.listingLoginOnboarding(ob).subscribe(res => {
      res.result.forEach((element: any) => {
        this.addItem(element);
      });
    });
  }
  createForm() {
    this.myForm = this.formBuilder.group({
      type: ['', [Validators.required]],
      items: this.formBuilder.array([])
    });
  }
  get f() {
    return this.myForm.controls;
  }
  createItem(val: { type: any; id: any; }): FormGroup {
    return this.formBuilder.group({
      name: val.type || '',
      id: val.id || '',
      edit: false
    });
  }
  get item() {
    return this.myForm.get('items') as FormArray;
  }
  edit(val, index: number, condition: any) {
    if (!condition) {
      const ob = {
        type: app_strings.MODELS.aboutus_sample,
        // tslint:disable-next-line: quotemark
        name: val.name,
        id: val.id,
      };
      this.userService
        .commonChangeStatus(ob)
        .pipe(take(1))
        .subscribe((res) => {
        });
      this.item.controls[index].patchValue({ edit: condition });
    } else {
      this.item.controls[index].patchValue({ edit: condition });
    }
    // this.myForm.get('items').value[i].edit.setValue(true)
  }
  delete(val) {
    this.crudService.confirmPopup().then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
      } else {
        const ob = {
          table: app_strings.MODELS.aboutus_sample,
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
  addItem(val: any): void {
    // if (this.myForm.get('name').invalid) { return; }
    const items = this.myForm.get('items') as FormArray;
    items.push(this.createItem(val));
    this.myForm.get('type').reset();
  }
  add(val) {
    if (this.myForm.get('type').invalid) { return; }
    const ob = {
      table: app_strings.MODELS.aboutus_sample,
      type: val.type
    };
    const fd = new FormData();
    for (const key in ob) {
      if (ob.hasOwnProperty(key)) {
        const element = ob[key];
        fd.append(key, element);
      }
    }
    this.onboarding.addLoginOnboarding(fd).subscribe(res => {
      this.ngOnInit();
    })
  }
  submit(val: any) {
    console.log(val);
  }
}
