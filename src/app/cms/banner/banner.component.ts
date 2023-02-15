import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';
import { CmsService } from '../cms.service';
import { CrudService } from 'src/app/_services/crud.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
declare var $: any;
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  bannerFlag = true;
  constructor(private fb: FormBuilder,
              private cmsService: CmsService,
              private crudService: CrudService,
              private userService: UserService) { }
  get f() { return this.bannerGrp.controls; }
  bannerGrp: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  list: any;
  list2: any;
  editFlag = false;
  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi',
    'Episode IX – The Rise of Skywalker'
  ];
  ngOnInit() {
    this.bannerFrm();
    this.getlist({ type: app_strings.MODELS.Banner, viewType: 'web' });
  }
  getlist(val) {
    this.cmsService.list(val)
      .pipe(take(1))
      .subscribe(res => {
        this.list = res.result;
      });
  }
  getlist2() {
    this.cmsService.exhibitionList()
      .pipe(take(1))
      .subscribe(res => {
        this.list2 = res.result;
      });
  }
  bannerFrm() {
    this.bannerGrp = this.fb.group({
      type: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.pattern(app_strings.URL_PATTERN)])],
      description: ['', [Validators.required]],
      id: ['']
    });
  }
  edit(item) {
    this.editFlag = true;
    const { type, title, name, description, id } = item;
    this.bannerGrp.patchValue({ type, title, name, description, id });
    window.scroll(0, 0);
    // this.imagesObj['image'] = item.link;
    this.previewObj['image'] = item.link;
  }
  cancelEdit() {
    this.bannerFrm();
    this.imagesObj = {};
    this.previewObj = {};
    this.editFlag = false;
    // this.imageUrl = undefined;
    // this.submitted = false;
  }
  fileUpload(e: { target: { files: any[]; }; }, type: string | number) {
    // tslint:disable-next-line: curly
    if (!type) return;
    const file = e.target.files[0];
    this.imagesObj[type] = file;
    this.userService.imagePreview(file)
      .then((preview: any) => {
        this.previewObj[type] = preview;
      });
  }
  submit() {
    if (this.bannerGrp.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      return;
    }
    if (Object.keys(this.imagesObj).length === 0 && Object.keys(this.previewObj).length === 0) {
      return this.userService.error(app_strings.PLEASE_UPLOAD_IMAGE);
    }
    const ob: any = {
      type: this.f.type.value,
      name: this.f.name.value,
      title: this.f.title.value,
      description: this.f.description.value,
      id: this.f.id.value
    };
    if (!this.editFlag) {
      delete ob.id;
    }
    for (const key in this.imagesObj) {
      if (this.imagesObj.hasOwnProperty(key)) {
        const element = this.imagesObj[key];
        ob.link = element;
      }
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
      // tslint:disable-next-line: variable-name
      .subscribe(_res => {
        this.userService.success(_res.message);
        this.bannerFrm();
        if (this.bannerFlag) {
          this.getlist({ type: app_strings.MODELS.Banner, viewType: 'web' });
        } else {
          this.getlist2();
        }
        this.imagesObj = {};
        this.previewObj = {};
      });
    } else {
      this.cmsService.editBannerOrExhibiton(fd)
      .pipe(take(1))
      // tslint:disable-next-line: variable-name
      .subscribe(_res => {
        this.userService.success(_res.message);
        this.bannerFrm();
        if (this.bannerFlag) {
          this.getlist({ type: app_strings.MODELS.Banner, viewType: 'web' });
        } else {
          this.getlist2();
        }
        this.imagesObj = {};
        this.previewObj = {};
        this.editFlag = false;
      });
    }
  }
  deleteItem(id: any) {
    if (!id) { return; }
    this.crudService.confirmPopup().then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
      } else {
        // tslint:disable-next-line: variable-name
        this.cmsService.deletePatchMsgStatus(id).subscribe(_res => {
          if (this.bannerFlag) {
            this.getlist({ type: app_strings.MODELS.Banner, viewType: 'web' });
          } else {
            this.getlist2();
          }
        });
      }
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    console.log(event.previousIndex, event.currentIndex);
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
    let temp = [this.list[event.previousIndex].seqId, this.list[event.currentIndex].seqId];
    this.cmsService.changeBannerIndex(temp.toString()).subscribe(res => {
      if (res.code === 200) {
        this.userService.success(res.message);
        this.ngOnInit();
      } else {
        this.userService.bug(res.message);
      }
    });
  }
  bannerBtn() {
    this.bannerFlag = this.bannerFlag ? false : true;
    if (this.bannerFlag) {
      this.getlist({ type: app_strings.MODELS.Banner, viewType: 'web' });
    } else {
      this.getlist2();
    }
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

  showImage(imageUrl) {
    if (!imageUrl) { return; }
    this.userService.showImage(imageUrl);
  }
}
