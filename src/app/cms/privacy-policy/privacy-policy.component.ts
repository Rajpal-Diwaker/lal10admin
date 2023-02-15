import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { app_strings } from 'src/app/_constants/app_strings';
import { CrudService } from 'src/app/_services/crud.service';
import { UserService } from 'src/app/_services/user.service';
import { CmsService } from '../cms.service';

declare var $: any;

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  uspGrp: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  list: any;
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button

      // ['link', 'image', 'video']                         // link and image, video
    ]
  };
  editorStyle = {
    height: '500px'
  }
  constructor(private fb: FormBuilder,
    private cmsService: CmsService,
    private crudService: CrudService,
    private userService: UserService) { }
  ngOnInit() {
    this.uspFrm();
    this.getlist();
  }
  getlist() {
    this.cmsService.getPrivacyPolicy()
      .pipe(take(1))
      .subscribe(res => {
        this.list = res.result;
        const { title, description } = res.result[0];
        this.uspGrp.patchValue({ title, description });
      });
  }
  uspFrm() {
    this.uspGrp = this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])]
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
      console.log('invalid', this.f);
      return;
    }
    // if (Object.keys(this.imagesObj).length === 0) {
    //   return this.userService.error(app_strings.PLEASE_UPLOAD_IMAGE)
    // }
    const ob: any = {
      title: this.f.title.value,
      description: this.f.description.value
    };

    // for (const key in this.imagesObj) {
    //   if (this.imagesObj.hasOwnProperty(key)) {
    //     const element = this.imagesObj[key];
    //     ob['link'] = element;
    //   }
    // }
    // const fd = new FormData();
    // for (const key in ob) {
    //   if (ob.hasOwnProperty(key)) {
    //     const element = ob[key];
    //     fd.append(key, element);
    //   }
    // }
    // fd.append('modelType', app_strings.MODELS['cms']);
    this.cmsService.addPrivacyPolicy(ob)
      .pipe(take(1))
      .subscribe(res => {
        this.uspGrp.reset();
        this.getlist();
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
        let ob = {
          type: 'privacy',
          id: id.id
        };
        this.userService.deleteData(ob).subscribe(res => {
          this.ngOnInit();
        });
      }
    });
  }

  changeStatus(i: any, status: any, userId: any) {
    console.log(status)
    const ob = { isActive: status === true ? '1' : '0', id: userId, type: app_strings.MODELS.privacy };
    let title: string;
    if (status) {
      title = 'Are you sure you want to activate?';
    } else { title = 'Are you sure you want to deactivate?'; }
    this.crudService.confirmPopup({ confirmButtonText: 'Yes', text: '', title })
      .then((suc) => {
        // tslint:disable-next-line: triple-equals
        if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
          // console.log(`#switchRoundedSuccess${i}`,status,$(`#switchRoundedSuccess0`).prop('checked',true))
          if (status) {
            $(`#switchRoundedSuccess${userId}`).prop('checked', false);
          } else {
            $(`#switchRoundedSuccess${userId}`).prop('checked', true);
          }
        } else {
          this.userService
            .commonChangeStatus(ob)
            .pipe(take(1))
            .subscribe(() => {
              // this.ngOnInit();
              if (status) {
                $(`#switchRoundedSuccess${userId}`).prop('checked', true);
              } else {
                $(`#switchRoundedSuccess${userId}`).prop('checked', false);
              }
            });
        }
      });
  }

}
