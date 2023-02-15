import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';
import { CmsService } from '../cms.service';
import { CrudService } from 'src/app/_services/crud.service';
declare var $: any;

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit {
  testimonialGrp: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  list: any;
  editFlag = false;
  imageUrl;
  submitted = false;
  constructor(private fb: FormBuilder,
              private cmsService: CmsService,
              private userService: UserService,
              private crudService: CrudService) { }

  ngOnInit() {
    this.testimonialFrm();
    this.getlist({ type: app_strings.MODELS.Testimonial, viewType: 'web' });
  }

  getlist(val) {
    this.cmsService.list(val)
      .pipe(take(1))
      .subscribe(res => {
        this.list = res.result;
      });
  }

  testimonialFrm() {
    this.testimonialGrp = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      id: ['']
    });
  }

  fileUpload(e: { target: { files: any[]; }; }, type: string | number) {
    // tslint:disable-next-line: curly
    if (!type) return;
    this.imageUrl = undefined;
    const file = e.target.files[0];

    this.imagesObj[type] = file;
    this.userService.imagePreview(file)
      .then((preview: any) => {
        this.previewObj[type] = preview;
      });
  }

  get f() { return this.testimonialGrp.controls; }

  submit() {
    this.submitted = true;
    if (this.testimonialGrp.invalid) {
      this.testimonialGrp.markAsTouched();
      console.log('invalidForm', this.f);
      // this.userService.error(app_strings.INVALID_FORM)
      return;
    }
    if (Object.keys(this.imagesObj).length === 0 && !this.imageUrl) {
      return this.userService.error(app_strings.PLEASE_UPLOAD_IMAGE)
    }
    const ob: any = {
      type: 'Testimonial',
      name: this.f.name.value,
      title: this.f.title.value,
      description: this.f.description.value,
      id: this.f.id.value,
    };

    for (const key in this.imagesObj) {
      if (this.imagesObj.hasOwnProperty(key)) {
        const element = this.imagesObj[key];
        this.editFlag ? ob.imgs = element : ob.link = element;
      }
    }

    const fd = new FormData();

    for (const key in ob) {
      if (ob.hasOwnProperty(key)) {
        const element = ob[key];
        fd.append(key, element);
      }
    }
    if (this.editFlag === false) {
      fd.delete('id');
    }

    fd.append('modelType', app_strings.MODELS.cms);

    if (this.editFlag) {
      fd.delete('modelType');
      fd.delete('type');
      this.cmsService.editTestimonial(fd)
      .pipe(take(1))
      .subscribe(res => {
        this.testimonialGrp.reset();
        this.imagesObj = {};
        this.previewObj = {};
        this.editFlag = false;
        this.imageUrl = undefined;
        this.submitted = false;
        this.getlist({ type: app_strings.MODELS.Testimonial, viewType: 'web' });
      });
    } else {
      this.cmsService.addMultiparty(fd)
      .pipe(take(1))
      .subscribe(res => {
        this.testimonialGrp.reset();
        this.imagesObj = {};
        this.previewObj = {};
        this.submitted = false;
        this.getlist({ type: app_strings.MODELS.Testimonial, viewType: 'web' });
      });
    }
  }

  delete(id: any) {
    if (!id) { return; }
    this.crudService.confirmPopup().then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
      } else {
        let ob = {
          type: app_strings.MODELS.cms,
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
    const ob = { isActive: status === true ? '1' : '0', id: userId, type: app_strings.MODELS.cms };
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

  edit(val) {
    this.editFlag = true;
    this.testimonialGrp.patchValue(val);
    // this.faqsGrp.get('questions').setValue(val.title);
    this.imageUrl = val.link;
    console.log(this.testimonialGrp.value);
    window.scrollTo(0, 0);
  }
  cancelEdit() {
    this.testimonialGrp.reset();
    this.imagesObj = {};
    this.previewObj = {};
    this.editFlag = false;
    this.imageUrl = undefined;
    this.submitted = false;
  }

}
