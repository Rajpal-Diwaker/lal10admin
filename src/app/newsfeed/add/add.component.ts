import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { app_strings } from 'src/app/_constants/app_strings';
import { UserService } from 'src/app/_services/user.service';
import { take } from 'rxjs/operators';
import { NewsfeedService } from '../newsfeed.service';
import { CrudService } from 'src/app/_services/crud.service';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlChecker } from 'src/app/_helpers/url-checker';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit, OnDestroy {
  editFlag = false;
  editId: any;
  editDataArr: any = [];
  image_url: any = environment.image_url;
  newsfeedGrp: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  constructor(private fb: FormBuilder,
              private newsfeedService: NewsfeedService,
              private userService: UserService,
              private crudService: CrudService,
              private router: Router,
              private route: ActivatedRoute
  ) { }
  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.editId = params.id;
        if (this.editId) {
          this.editData();
          this.editFlag = true;
        }
      });
    this.newsfeedFrm();
  }
  editData() {
    const ob = {
      id: this.editId,
      type: app_strings.MODELS.newsfeed,
    };
    this.crudService
      .editData(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.editDataArr = result;
        const { title, description, url, image } = this.editDataArr;
        if (image) { this.previewObj.image =image; }
        this.newsfeedGrp.patchValue({ title, description, url });
      });
  }
  newsfeedFrm() {
    this.newsfeedGrp = this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      type: ['web'],
      description: ['', Validators.compose([Validators.required])],
      url: ['', Validators.compose([Validators.required, Validators.pattern(app_strings.URL_PATTERN)])]
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
  showImage(imageUrl: any) {
    if (!imageUrl) { return; }
    this.userService.showImage(imageUrl);
  }
  get f() { return this.newsfeedGrp.controls; }
  submit() {
    if (this.newsfeedGrp.invalid) {
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
      title: this.f.title.value,
      description: this.f.description.value,
      url: this.f.url.value,
      type: this.f.type.value,
    };
    for (const key in this.imagesObj) {
      if (this.imagesObj.hasOwnProperty(key)) {
        const element = this.imagesObj[key];
        ob.newsfeed = element;
      }
    }
    const fd = new FormData();
    for (const key in ob) {
      if (ob.hasOwnProperty(key)) {
        const element = ob[key];
        fd.append(key, element);
      }
    }
    if (this.editFlag == false && JSON.stringify(this.imagesObj) == '{}') {
      this.userService.bug(app_strings.IMAGE_VALIDATION);
      return;
    }
    
    // tslint:disable-next-line: triple-equals
    if (this.editId && this.editId != 'null') {
      fd.append('id', this.editId);
    }
    this.newsfeedService.add(fd)
      .pipe(take(1))
      // tslint:disable-next-line: variable-name
      .subscribe(_res => {
        this.router.navigate(['/newsfeed']);
      });
  }
  ngOnDestroy() {
    this.crudService.setId(null);
  }
}
