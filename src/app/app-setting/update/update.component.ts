import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { take } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  detail: any;
  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router, private route: ActivatedRoute) {
    this.createForm();

    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.detail = params;
        if (params.id) {
          this.editData();
          this.editFlag = true;
        }
      });
  }
  get f() { return this.myform.controls; }
  myform: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  editFlag = false;
  editId: any;
  ngOnInit() {
  }
  createForm() {
    this.myform = this.fb.group({
      id: [],
      title: ['', Validators.compose([Validators.required])],
    });
  }
  editData() {
    this.myform.patchValue(this.detail);

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
  submit(val: { id: any; }) {
    if (this.myform.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      // this.userService.error(app_strings.INVALID_FORM)
      return;
    }


    if (this.editFlag) {
      this.userService.addeditAppSetting(val)
        .pipe(take(1))
        .subscribe(() => {
          this.myform.reset();
          this.router.navigateByUrl('/app-setting');

        });
    } else {
      delete val.id;
      this.userService.addeditAppSetting(val)
        .pipe(take(1))
        .subscribe(() => {
          this.myform.reset();
          this.router.navigateByUrl('/app-setting');
        });
    }
  }
}
