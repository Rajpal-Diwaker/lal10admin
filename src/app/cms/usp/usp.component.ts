import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';
import { CmsService } from '../cms.service';
import { CrudService } from 'src/app/_services/crud.service';
@Component({
  selector: 'app-usp',
  templateUrl: './usp.component.html',
  styleUrls: ['./usp.component.css']
})
export class UspComponent implements OnInit {
  uspGrp: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  list: any;
  constructor(private fb: FormBuilder,
    private cmsService: CmsService,
    private crudService: CrudService,
    private userService: UserService) { }
  ngOnInit() {
    this.uspFrm();
    this.getlist({ type: app_strings.MODELS.USP, viewType: 'web' });
  }
  getlist(val) {
    this.cmsService.list(val)
      .pipe(take(1))
      .subscribe(res => {
        this.list = res.result;
      });
  }
  uspFrm() {
    this.uspGrp = this.fb.group({
      title: ['', Validators.compose([Validators.required])]
    });
  }
  fileUpload(e, type) {
    if (!type) return;
    const file = e.target.files[0];
    this.imagesObj[type] = file;
    this.userService.imagePreview(file)
      .then(preview => {
        this.previewObj[type] = preview;
      });
  }
  get f() { return this.uspGrp.controls; }
  submit() {
    if (this.uspGrp.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      return;
    }
    if (Object.keys(this.imagesObj).length === 0) {
      return this.userService.error(app_strings.PLEASE_UPLOAD_IMAGE)
    }
    const ob: any = {
      type: 'USP',
      name: '',
      title: this.f.title.value,
      description: ''
    };

    for (const key in this.imagesObj) {
      if (this.imagesObj.hasOwnProperty(key)) {
        const element = this.imagesObj[key];
        ob['link'] = element;
      }
    }
    const fd = new FormData();
    for (const key in ob) {
      if (ob.hasOwnProperty(key)) {
        const element = ob[key];
        fd.append(key, element);
      }
    }
    fd.append('modelType', app_strings.MODELS['cms']);
    this.cmsService.addMultiparty(fd)
      .pipe(take(1))
      .subscribe(res => {
        this.uspGrp.reset();
        this.getlist({ type: app_strings.MODELS.USP, viewType: 'web' });
        this.imagesObj = {};
        this.previewObj = {};
      });
  }
  delete(id: any) {
    if (!id) { return; }
    this.crudService.confirmPopup().then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
      } else {
        this.cmsService.deletePatchMsgStatus(id).subscribe(res => {
          this.ngOnInit();
        });
      }
    });
  }
}
