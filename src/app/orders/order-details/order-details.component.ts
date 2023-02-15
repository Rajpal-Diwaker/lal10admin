import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OptionsService } from 'src/app/options/options.service';
import { app_strings } from 'src/app/_constants/app_strings';
import * as _ from 'lodash';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  editable = false
  myForm: FormGroup;
  editFlag = false;
  submitted = false;
  craft: any;
  artisanList: any;
  material: any;
  imagesObj: any = {};
  imageSrc: any = [];
  deleteId = [];
  type: any;
  params: Params;
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private manageListingService: OptionsService,
    private _route: Router,
    private route: ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        console.log("---------------------------------......", params);
        this.params = params
        // if (params.id) {
        //   this.editFlag = true;
        // }
      });
  }
  ngOnInit() {
    this.getCraftList('craft');
    this.getMaterialList('material');
    this.getArtisanGroupList();
    this.createForm();
    this.getDetails();
  }
  get f() {
    return this.myForm.controls;
  }
  getDetails() {
    this.myForm.patchValue({
      title: this.params.title,
      description: this.params.description,
      craft: this.params.craftId,
      material: this.params.materialId,
      enquiryId: this.params.orderId || '',
      id: this.params.id,
      update_status: this.params.update_status||''
    });
  }
  createForm() {
    this.myForm = this.fb.group({
      images: this.fb.array([]),
      enquiryId: [''],
      update_status: [''],
      id: [''],
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      craft: ['', Validators.compose([Validators.required])],
      material: ['', Validators.compose([Validators.required])]
    });
    if (!this.editFlag) {
      this.addMoreImages();
    }
  }
  addMoreImages(ob = { attachment: this.params.image, id: '' }) {
    console.log("ob", ob);
    this.imageSrc.push(ob.attachment)
    const images = this.myForm.get('images') as FormArray;
    images.push(this.createItem(ob));
  }
  createItem(obj): FormGroup {
    console.log("obj", obj);
    return this.fb.group({
      image: obj.attachment,
      id: obj.id
    });
  }
  changeImage(val) {
    console.log(val.value);
    if (val.value.id) {
      this.deleteId.push(val.value.id);
    }
    // debugger;
    // val.value.image = (val.value.image).toString();
    // console.log(val.value.image.length);
    // if (val.value.length < 10) {
    //   this.deleteId.push(val.value.image);
    // }
    console.log(this.deleteId);
  }
  readURL(e: { target: { files: Blob[]; }; }, i: string | number) {
    if (e.target.files && e.target.files[0]) {
      this.imagesObj[i] = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc[i] = reader.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }
  getCraftList(type: string) {
    const ob = {
      type,
    };
    this.manageListingService
      .listing(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.craft = result;
      });
  }
  getMaterialList(type: string) {
    const ob = {
      type,
    };
    this.manageListingService
      .listing(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.material = result;
      });
  }
  getArtisanGroupList() {
    this.userService.getGroupListArtisan()
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.artisanList = result;
      });
  }
  submit(ob) {
    let temp = {
      id: this.params.id,
      update_status2: ob.update_status,
      type: 'enquiry_order'
    }
    this.userService
      .commonChangeStatus(temp)
      .pipe(take(1))
      .subscribe((res) => {
        this._route.navigate(['/orders']);
      });
  }

  showImage(imageUrl) {
    if (!imageUrl) { return; }
    this.userService.showImage(imageUrl);
  }
}
