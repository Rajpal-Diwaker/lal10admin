import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';
import { CrudService } from 'src/app/_services/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
//import { $ } from 'protractor';
declare var $: any;
@Component({
  selector: 'app-allproduct',
  templateUrl: './allproduct.component.html',
  styleUrls: ['./allproduct.component.css']
})
export class AllproductComponent implements OnInit {
  formgroup: FormGroup;
  submitted: boolean;
  editFlag: boolean;
  params: any;
  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private route: ActivatedRoute,
    private router: Router,
    // tslint:disable-next-line: variable-name
    private _fb: FormBuilder
  ) {
    this.createGroup();
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
      });
  }
  listHeaders: any = ['image', 'Product Name', 'Artisan name', 'Order ', 'Enquiry Count',
    'Website count', 'Action'];
  listArr: any = [];
  image_url: any = environment.image_url;
  page = 0;
  limit: any = 10;
  searchKey: any = '';
  updatePage = 0;
  flickerArr: any = {};
  ngOnInit() {
    $('a#fromallproduct').addClass('activetab');
    this.getList();
  }
  createGroup() {
    this.formgroup = this._fb.group({
      table: this._fb.array([])
    });
  }
  get f() { return this.formgroup.controls; }
  createItem(obj): FormGroup {
    return this._fb.group(obj);
  }
  addItem(obj): void {
    const temp = this.formgroup.get('table') as FormArray;
    temp.push(this.createItem(obj));
  }
  getList() {
    this.userService
      .getFromAllProduct()
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.listArr = result;
        this.listArr.forEach(element => {
          if (this.editFlag === true && this.params.total_product.split(',').indexOf((element.id).toString()) > -1) {
            element.check = true;
          } else {
            element.check = false;
          }
          this.addItem(element);
        });
        console.log(this.formgroup.get('table').value);
      });
  }
  def(e, id) {
    this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    const img = 'assets/images/def.png';
    if (!e && this.flickerArr[id] > 1) { return; }
    e.target.src = img;
  }
  submit() {
    console.log(this.formgroup.value)
    if (this.formgroup.invalid) {
      this.submitted = true;
      return true;
    }
    const temp = [];
    this.formgroup.get('table').value.forEach(element => {
      if (element.check) {
        temp.push(element.id);
      }
    });
    console.log(temp);
    if (temp.length === 0) {
      return this.userService.error(app_strings.errorMsg.pleaseSelectOneArtisan);
    }
    const request: any = {
      productId: temp.toString()
    };
    this.userService.makeIdealProduct(request).subscribe(result => {
          if (result['code'] === 200) {
            this.router.navigate(['/ideal']);
          } else {
            this.userService.error(result['message']);
          }
    });
  }
}
