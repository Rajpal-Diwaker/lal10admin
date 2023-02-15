import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { app_strings } from 'src/app/_constants/app_strings';
import { CrudService } from 'src/app/_services/crud.service';
import { UserService } from 'src/app/_services/user.service';
import { CmsService } from '../cms.service';
declare var $: any;

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {

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
    this.getlist();
  }
  getlist() {
    this.cmsService.getBlogs()
      .pipe(take(1))
      .subscribe(res => {
        this.list = res.result;
      });
  }
  uspFrm() {
    this.uspGrp = this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      link: ['', Validators.compose([Validators.required, Validators.pattern(app_strings.URL_PATTERN)])]
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
      title: this.f.title.value,
      description: this.f.description.value,
      link: this.f.link.value
    };

    for (const key in this.imagesObj) {
      if (this.imagesObj.hasOwnProperty(key)) {
        const element = this.imagesObj[key];
        ob['image'] = element;
      }
    }
    const fd = new FormData();
    for (const key in ob) {
      if (ob.hasOwnProperty(key)) {
        const element = ob[key];
        fd.append(key, element);
      }
    }
    // fd.append('modelType', app_strings.MODELS['cms']);
    this.cmsService.addBlogs(fd)
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
          type: 'blogs',
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
    const ob = { isTrending: status === true ? '1' : '0', id: userId, type: app_strings.MODELS.Blogs };
    let title: string;
    if (status) {
      title = 'Are you sure you want to make it trending blog?';
    } else { title = 'Are you sure you want to revoke it as trending blog?'; }
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
