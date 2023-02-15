import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';
import { CmsService } from '../cms.service';
import { CrudService } from 'src/app/_services/crud.service';
@Component({
  selector: 'app-manage-industries',
  templateUrl: './manage-industries.component.html',
  styleUrls: ['./manage-industries.component.css']
})
export class ManageIndustriesComponent implements OnInit {
  industriesGrp: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  list: any;
  editFlag = false;
  constructor(private fb: FormBuilder,
              private cmsService: CmsService,
              private crudService: CrudService,
              private userService: UserService) { }
  ngOnInit() {
    this.industriesFrm();
    this.getlist({ type: app_strings.MODELS.Industries, viewType: 'web' });

  }

  getlist(val: { type: string; viewType: string; }) {
    this.cmsService.list(val)
      .pipe(take(1))
      .subscribe(res => {
        this.list = res.result;
      });
  }
  industriesFrm() {
    this.industriesGrp = this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      id: ['']
    });
  }
  fileUpload(e: { target: { files: any[]; }; }, type: string | number) {
    if (!type) { return; }
    const file = e.target.files[0];
    this.imagesObj[type] = file;
    this.userService.imagePreview(file)
      .then((preview: any) => {
        this.previewObj[type] = preview;
      });
  }
  get f() { return this.industriesGrp.controls; }
  submit() {
    if (this.industriesGrp.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      // this.userService.error(app_strings.INVALID_FORM)
      return;
    }
    // if (Object.keys(this.imagesObj).length === 0) {
    //   return this.userService.error(app_strings.PLEASE_UPLOAD_IMAGE);
    // }
    const ob: any = {
      type: 'Industries',
      name: '',
      title: this.f.title.value,
      description: this.f.description.value,
      link: '',
      id: this.f.id.value
    };
    // for (const key in this.imagesObj) {
    //   if (this.imagesObj.hasOwnProperty(key)) {
    //     const element = this.imagesObj[key];
    //     ob.link = element;
    //   }
    // }
    if (!this.editFlag) {
      delete ob.id;
    }
    const fd = new FormData();
    for (const key in ob) {
      if (ob.hasOwnProperty(key)) {
        const element = ob[key];
        fd.append(key, element);
      }
    }
    fd.append('modelType', app_strings.MODELS.cms);
    if (!this.editFlag) {
      this.cmsService.addMultiparty(fd)
      .pipe(take(1))
      .subscribe(res => {
        this.industriesGrp.reset();
        this.previewObj = {};
        this.imagesObj = {};
        this.getlist({ type: app_strings.MODELS.Industries, viewType: 'web' });

      });
    } else {
      this.cmsService.editBannerOrExhibiton(fd)
      .pipe(take(1))
      // tslint:disable-next-line: variable-name
      .subscribe(_res => {
        this.userService.success(_res.message);
        this.industriesFrm();
        this.getlist({ type: app_strings.MODELS.Industries, viewType: 'web' });
        this.imagesObj = {};
        this.previewObj = {};
        this.editFlag = false;
      });
    }
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
  edit(item) {
    this.editFlag = true;
    const { type, title, name, description, id } = item;
    this.industriesGrp.patchValue({ title, description, id });
    window.scroll(0, 0);
    // this.imagesObj['image'] = item.link;
    // this.previewObj['image'] = item.link;
  }
  cancelEdit() {
    this.industriesFrm();
    this.imagesObj = {};
    this.previewObj = {};
    this.editFlag = false;
    // this.imageUrl = undefined;
    // this.submitted = false;
  }
}
