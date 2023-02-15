import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  myform: FormGroup;
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router, private route: ActivatedRoute) {
  }
  get f() { return this.myform.controls; }
  imagesObj: any = {};
  previewObj: any = {};
  editFlag = false;
  editId: any;
  editDataArr: any = [];
  image_url: any = environment.image_url;
  ngOnInit() {
    this.artisanFrm();
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        if (params.id) {
          this.editData(JSON.parse(params.id));
          this.editFlag = true;
        }
      });
  }
  artisanFrm() {
    this.myform = this.fb.group({
      id: [''],
      name: ['', Validators.compose([Validators.required])],
      image: ['', Validators.compose([Validators.required])],
      banner: ['', Validators.compose([Validators.required])],
    });
  }
  editData(val: { title: any; id: any; image: any; banner_image: any; }) {
    this.myform.get('name').setValue(val.title);
    this.myform.get('id').setValue(val.id);
   
    this.previewObj.image = val.image;
    this.previewObj.banner = val.banner_image;
    this.myform.get('image').clearValidators();
    this.myform.get('banner').clearValidators();
    this.myform.get('image').updateValueAndValidity();
    this.myform.get('banner').updateValueAndValidity();

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
  submit() {
    if (this.myform.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      return;
    }
    const ob: any = {
      name: this.f.name.value,
    };
    
    for (const key in this.imagesObj) {
      if (this.imagesObj.hasOwnProperty(key)) {
        const element = this.imagesObj[key];
        ob[key] = element;
      }
    }
    console.log('------------------->>>>>>>>', ob);
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
    if (this.editFlag) {
      fd.append('id', this.myform.get('id').value)
      this.userService.editCategory(fd)
        .pipe(take(1))
        .subscribe(res => {
          if (res.code) {
            this.router.navigateByUrl('/managecategory');
          } else {
            this.userService.error(res.message);
          }
        });
    } else {
      this.userService.addCategory(fd)
        .pipe(take(1))
        .subscribe(res => {
          if (res.code) {
            this.router.navigateByUrl('/managecategory');
          } else {
            this.userService.error(res.message);
          }
        });
    }
  }
}
