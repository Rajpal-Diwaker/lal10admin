import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { app_strings } from 'src/app/_constants/app_strings';
import { UserService } from 'src/app/_services/user.service';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  details: any;
  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router, private route: ActivatedRoute) {
    this.createForm();
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.details = params;
        if (params.id) {
          this.editData();
          this.editFlag = true;
        }
      });
  }
  get f() { return this.artisanGrp.controls; }
  artisanGrp: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  editFlag = false;
  editId: any;
  editDataArr: any = [];
  image_url: any = environment.image_url;
  craftList = [];
  craftSetting = {};
  productList = [];
  productSetting = {};
  materialList = [];
  materialSetting = {};
  craftArr: any = [];
  stateArr: any = [];
  productArr: any = [];
  materialArr: any = [];
  ngOnInit() {
  }
  createForm() {
    this.artisanGrp = this.fb.group({
      id: [''],
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      url: ['', Validators.compose([Validators.pattern(app_strings.URL_PATTERN)])],
      name: ['', Validators.compose([Validators.required])],
      subtitle: ['', Validators.compose([Validators.required])]
    });
  }
  editData() {
    const { title, description, image, id, url, name, subtitle } = this.details;
    // this.previewObj.artisanImage = artisanImage;
    this.previewObj.kycImage = image;
    // this.artisanGrp.patchValue(this.details);
    this.artisanGrp.patchValue({ title, description, id, url, name, subtitle });
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
  submit(ob: { [x: string]: any; image: any; hasOwnProperty: (arg0: string) => any; }) {
    if (this.artisanGrp.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      // this.userService.error(app_strings.INVALID_FORM)
      return;
    }
    // tslint:disable-next-line: triple-equals
    if (this.editFlag == false && JSON.stringify(this.imagesObj) == '{}') {
      this.userService.bug(app_strings.IMAGE_VALIDATION);
      return;
    }
    // tslint:disable-next-line: one-variable-per-declaration
    for (const key in this.imagesObj) {
      if (this.imagesObj.hasOwnProperty(key)) {
        const element = this.imagesObj[key];
        ob.image = element;
      }
    }
    const fd = new FormData();
    for (const key in ob) {
      if (ob.hasOwnProperty(key)) {
        const element = ob[key];
        fd.append(key, element);
      }
    }
    // tslint:disable-next-line: triple-equals
    if (this.editId && this.editId != 'null') {
      fd.append('id', this.editId);
    }
    if (!this.editFlag) {
      fd.delete('id');
      this.userService.addAvenue(fd)
        .pipe(take(1))
        .subscribe(() => {
          this.artisanGrp.reset();
          this.router.navigate(['/avenue']);
        });
    } else {
      this.userService.updateAvenue(fd)
        .pipe(take(1))
        .subscribe(() => {
          this.artisanGrp.reset();
          this.router.navigate(['/avenue']);
        });
    }
  }
}
