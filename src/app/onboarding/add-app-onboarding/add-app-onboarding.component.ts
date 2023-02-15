import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { OnboardingService } from '../onboarding.service';
import { UserService } from 'src/app/_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/_services/crud.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';
import { UrlChecker } from 'src/app/_helpers/url-checker';
import {Location} from '@angular/common';
@Component({
  selector: 'app-add-app-onboarding',
  templateUrl: './add-app-onboarding.component.html',
  styleUrls: ['./add-app-onboarding.component.css']
})
export class AddAppOnboardingComponent implements OnInit {
  onboardingGrp: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  languageArr: any = [];
  editFlag = false;
  editId: any;
  editDataArr: any = [];
  image_url: any = environment.image_url;
  submitted=false;
  constructor(private fb: FormBuilder,
    private onboardingService: OnboardingService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private crudService: CrudService,
    private _location: Location) { }
  ngOnInit() {
    this.languages();
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
      type: app_strings.MODELS.onboarding,
    };
    this.crudService
      .editData(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.editDataArr = result;
        if (!this.editDataArr) { return; }
        const { language, description, url, image, hindiDescription, bangaliDescription, gujratiDescription } = this.editDataArr;
        this.onboardingGrp.patchValue({ language, description, url, hindiDescription, bangaliDescription, gujratiDescription });
        this.previewObj.image = image;
      });
  }
  languages() {
    this.userService.options('language')
      .pipe(take(1))
      .subscribe(res => {
        this.languageArr = res.result;
      });
  }
  showImage(imageUrl) {
    if (!imageUrl) { return; }
    this.userService.showImage(imageUrl);
  }
  onboardingFrm() {
    this.onboardingGrp = this.fb.group({
      language: ['1', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
      url: ['', Validators.compose([Validators.required, Validators.pattern(app_strings.URL_PATTERN)])],
      hindiDescription: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
      bangaliDescription: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
      gujratiDescription: ['', Validators.compose([Validators.required, Validators.maxLength(500)])]
     });
  }
  fileUpload(e, type) {
    if (!type) { return; }
    const file = e.target.files[0];
    this.imagesObj[type] = file;
    this.userService.imagePreview(file)
      .then(preview => {
        this.previewObj[type] = preview;
      });
  }
  get f() { return this.onboardingGrp.controls; }
  submit() {

    if (this.onboardingGrp.invalid) {
      this.submitted=true
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      return;
    }
    this.submitted=false
    const ob: any = {
      language: this.f.language.value,
      description: this.f.description.value,
      url: this.f.url.value,
      type: 'app',
      hindiDescription: this.f.hindiDescription.value,
      bangaliDescription: this.f.bangaliDescription.value,
      gujratiDescription: this.f.gujratiDescription.value
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
        if (res.code === 200) {
          this.router.navigate(['/onboarding/app-onboarding-list']);
        } else {
          this.userService.error(res.message);
        }
      });
  }
  goBack() {
    this._location.back();
  }
}
