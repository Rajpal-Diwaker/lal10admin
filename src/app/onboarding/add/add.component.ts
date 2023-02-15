import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { app_strings } from 'src/app/_constants/app_strings';
import { UserService } from 'src/app/_services/user.service';
import { take } from 'rxjs/operators';
import { OnboardingService } from '../onboarding.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/_services/crud.service';
import { environment } from '../../../environments/environment';
import { UrlChecker } from 'src/app/_helpers/url-checker';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit, OnDestroy {
  onboardingGrp: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  languageArr: any = [];
  editFlag = false;
  editId: any;
  editDataArr: any  = [];
  image_url: any = environment.image_url;

  constructor(private fb: FormBuilder,
              private onboardingService: OnboardingService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private crudService: CrudService) { }

  ngOnInit() {
    // this.languages();
    this.onboardingFrm();

    this.route.queryParams
    .subscribe(params => {
      console.log(params);
      this.editId = params.id;
      if (this.editId) {
        this.editData();
        this.editFlag = true;
      }
    });
  }

  editData() {
    const ob = {
      id: this.editId,
      type:  app_strings.MODELS.onboarding,
    };
    this.crudService
      .editData(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.editDataArr = result;

        if (!this.editDataArr) { return; }

        const { language, description, url, image } = this.editDataArr;

        this.previewObj.image = image;
        this.onboardingGrp.patchValue({ language, description, url });
      });
  }

  // languages() {
  //   this.userService.options('language')
  //    .pipe(take(1))
  //    .subscribe(res => {
  //     this.languageArr = res.result;
  //    });
  // }

  showImage(imageUrl: any) {
    if (!imageUrl) { return; }

    this.userService.showImage(imageUrl);
  }

  onboardingFrm() {
    this.onboardingGrp = this.fb.group({
      // language: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
      url: ['', Validators.compose([Validators.required,Validators.pattern(app_strings.URL_PATTERN)])]
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

  get f() { return this.onboardingGrp.controls; }

  submit() {


    if (this.onboardingGrp.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      return;
    }
    const ob: any = {
       language: 'English',
       description: this.f.description.value,
       url: this.f.url.value,
       type:'web'
     };

    for (const key in this.imagesObj) {
       if (this.imagesObj.hasOwnProperty(key)) {
         const element = this.imagesObj[key];
         ob.onboarding = element;
       }
     }

    if (this.editFlag == false && JSON.stringify(this.imagesObj) == '{}') {
      this.userService.error(app_strings.IMAGE_VALIDATION);
      return;
    }

    const fd = new FormData();

    for (const key in ob) {
       if (ob.hasOwnProperty(key)) {
         const element = ob[key];
         fd.append(key, element);
       }
     }

    if (this.editId && this.editId != 'null') {
       fd.append('id', this.editId);
     }

    this.onboardingService.add(fd)
     .pipe(take(1))
     .subscribe(res => {
      // this.onboardingGrp.reset()
      // this.imagesObj = {}
      // this.previewObj = {}
      if (res.code == 200) {
      this.router.navigate(['/onboarding']);
      } else {
      this.userService.error(res.message);
      }
     });
  }

  ngOnDestroy() {
    this.crudService.editId.next(null);
  }

}
