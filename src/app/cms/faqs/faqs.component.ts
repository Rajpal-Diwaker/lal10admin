import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';
import { CmsService } from '../cms.service';
import { CrudService } from 'src/app/_services/crud.service';
@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent implements OnInit {
  faqsGrp: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  list: any;
  editFlag = false;
  constructor(private fb: FormBuilder,
    private cmsService: CmsService,
    private crudService: CrudService,
    private userService: UserService) { }
  ngOnInit() {
    this.faqsFrm();
    this.getlist({ type: app_strings.MODELS.Faq, viewType: 'web' });
  }
  getlist(val) {
    this.cmsService.list(val)
      .pipe(take(1))
      .subscribe(res => {
        this.list = res.result;
      });
  }
  faqsFrm() {
    this.faqsGrp = this.fb.group({
      id: [''],
      questions: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])]
    });
  }
  get f() { return this.faqsGrp.controls; }
  submit() {
    if (this.faqsGrp.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      // this.userService.error(app_strings.INVALID_FORM)
      return;
    }
    const ob: any = {
      type: 'Faq',
      modelType: app_strings.MODELS.cms,
      description: this.f.description.value,
      title: this.f.questions.value,
      link: '',
      name: '',
      id: this.f.id.value
    };
    const fd = new FormData();
    for (const key in ob) {
      if (ob.hasOwnProperty(key)) {
        const element = ob[key];
        fd.append(key, element);
      }
    }
    if (this.editFlag === false) {
      fd.delete('id');
      this.cmsService.addMultiparty(fd)
        .pipe(take(1))
        .subscribe(res => {
          this.faqsGrp.reset();
          this.getlist({ type: app_strings.MODELS.Faq, viewType: 'web' });
          this.imagesObj = {};
          this.previewObj = {};
        });
    }
    else {
      const request: any = {
        description: this.f.description.value,
        question: this.f.questions.value,
        id: this.f.id.value,
        isFaq: 1
      };

      this.cmsService.editFaq(request)
        .pipe(take(1))
        .subscribe(res => {
          this.ngOnInit();
          this.editFlag = false;
        });
    }
  }
  edit(val) {
    this.editFlag = true;
    this.faqsGrp.patchValue(val);
    this.faqsGrp.get('questions').setValue(val.title);
    console.log(this.faqsGrp.value);
    window.scrollTo(0, 0);
  }
  delete(id: any) {
    if (!id) { return; }
    this.crudService.confirmPopup().then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
      } else {
        this.cmsService.deleteFaq(id).subscribe(res => {
          this.ngOnInit();
        })
      }
    });
  }
}
