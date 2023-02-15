import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { app_strings } from 'src/app/_constants/app_strings';
import { UserService } from 'src/app/_services/user.service';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  imageIndex = 0;
  selectedImage;
  imageArr;
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router, private route: ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.editId = params;
        if (this.editId) {
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
  ngOnInit() {
    this.artisanFrm();
  }
  artisanFrm() {
    this.artisanGrp = this.fb.group({
      artisanName: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
    });
  }
  editData() {
    this.userService.getGalleryDetails(this.editId)
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.editDataArr = result;
        this.imageArr = result[0].Images;
        console.log('imagesArr', this.imageArr);
        if (!this.editDataArr) { return; }
        const { artisanName, title } = this.editDataArr[0];
        this.artisanGrp.patchValue({ artisanName, title });
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
  showImage(imageUrl) {
    if (!imageUrl) { return; }
    this.userService.showImage(imageUrl);
  }

  changeIndex(data) {
    if (data === 'plus') {
      if (this.imageIndex === this.imageArr.length - 1) {
        return;
      } else {
        this.imageIndex++;
      }
    } else {
      if (this.imageIndex === 0) {
        return;
      } else {
        this.imageIndex--;
      }
    }
  }
}
