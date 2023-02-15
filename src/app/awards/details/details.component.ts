import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  detail: any;
  constructor(private fb: FormBuilder,
              private userService: UserService,
              private route: ActivatedRoute) {
    this.createForm();
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.editId = params.id;
        this.detail = params;
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
  }
  createForm() {
    this.artisanGrp = this.fb.group({
      title: [{ value: '', disabled: true }],
      name: ['']
    });
  }
  editData() {
    this.editDataArr = this.detail;
    if (!this.editDataArr) { return; }
    const { title, name, image } = this.editDataArr;
    this.previewObj.artisanImage = image;
    this.previewObj.kycImage = image;
    this.artisanGrp.patchValue({ name, title });
    console.log(this.artisanGrp.value);
  }
  showImage(imageUrl) {
    if (!imageUrl) { return; }
    this.userService.showImage(imageUrl);
  }
}
