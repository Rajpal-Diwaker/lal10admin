import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';
import { CmsService } from '../cms.service';
import { CrudService } from 'src/app/_services/crud.service';
declare var $: any;
@Component({
  selector: 'app-patch-messsage',
  templateUrl: './patch-messsage.component.html',
  styleUrls: ['./patch-messsage.component.css']
})
export class PatchMesssageComponent implements OnInit {
  patchGrp: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  list: any;
  editFlag = false;
  constructor(private fb: FormBuilder,
    private cmsService: CmsService,
    private crudService: CrudService,
    private userService: UserService) { }
  ngOnInit() {
    this.patchFrm();
    this.getlist({ type: app_strings.MODELS['Patch- message'], viewType: 'web' });
  }
  getlist(val) {
    this.cmsService.list(val)
      .pipe(take(1))
      .subscribe(res => {
        this.list = res.result;
      });
  }
  patchFrm() {
    this.patchGrp = this.fb.group({
      id: [''],
      question: ['', Validators.compose([Validators.required])],
      link: ['', Validators.compose([Validators.required, Validators.pattern(app_strings.URL_PATTERN)])]
    });
  }
  get f() { return this.patchGrp.controls; }
  submit() {

    if (this.patchGrp.invalid) {
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
      type: 'Patch-message',
      modelType: app_strings.MODELS.cms,
      description: '',
      title: this.f.question.value,
      link: this.f.link.value,
      name: ''
    };
    const fd = new FormData();
    for (const key in ob) {
      if (ob.hasOwnProperty(key)) {
        const element = ob[key];
        fd.append(key, element);
      }
    }
    if (this.editFlag === false) {

      this.cmsService.addMultiparty(fd)
        .pipe(take(1))
        .subscribe(res => {
          this.patchGrp.reset();
          this.getlist({ type: app_strings.MODELS['Patch- message'], viewType: 'web' });
          this.imagesObj = {};
          this.previewObj = {};
        });
    } else {
      const request: any = {
        title: this.f.question.value,
        link: this.f.link.value,
        id: this.f.id.value,
        isCms: 1
      };

      this.cmsService.editPatchMsgStatus(request)
        .pipe(take(1))
        .subscribe(res => {
          this.ngOnInit();
          this.editFlag = false;
        });
    }
  }
  changeStatus(status: any, id: any) {
    const ob = { isActive: status === true ? '1' : '0', id,isCms: 1 };
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
            $(`#switchRoundedSuccess${id}`).prop('checked', false);
          } else {
            $(`#switchRoundedSuccess${id}`).prop('checked', true);
          }
        } else {
          this.cmsService
            .changePatchMsgStatus(ob)
            .pipe(take(1))
            .subscribe(() => {
              this.ngOnInit();
              if (status) {
                $(`#switchRoundedSuccess${id}`).prop('checked', true);
              } else {
                $(`#switchRoundedSuccess${id}`).prop('checked', false);
              }
            });
        }
      });
  }
  edit(val) {
    this.editFlag = true;
    this.patchGrp.patchValue(val);
    this.patchGrp.get('question').setValue(val.title);
    console.log(this.patchGrp.value);
    window.scrollTo(0, 0);
  }
  delete(id: any) {
    if (!id) { return; }
    this.crudService.confirmPopup().then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
      } else {
        this.cmsService.deletePatchMsgStatus(id).subscribe(res => {
          this.ngOnInit();
        })
      }
    });
  }
}
