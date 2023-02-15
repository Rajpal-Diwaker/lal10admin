import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/_services/user.service';
import { take } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/_services/crud.service';
import { Options } from '@angular-slider/ngx-slider';
import { app_strings } from 'src/app/_constants/app_strings';
import { filter } from 'src/app/_interfaces/filter';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'],
})
export class ListingComponent implements OnInit, OnDestroy {
  page: any = 1;
  total: any;
  categoryList: any;
  getSubcategory: any;
  myForm: FormGroup;
  plive: any = '';
  liveCheck: boolean;
  pliveValue: any;
  finalCount: number;
  priceFilter: any;
  searchKeyWord: string;
  refresh: void;
  colName = '';
  sortby = '';
  constructor(
    private userService: UserService,
    private router: Router,
    private crudService: CrudService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) { }
  listHeaders: any = [
    'Image',
    'Products Name',
    'Artisans Name',
    'Amount',
    'QTY',
    'Doable quantity',
    'Total Enquiry',
    'Material Used',
    'No. of orders',
    'Uploaded By',
    'Action',
    'Publish on web',
    'Category/Sub-category',
    'Add in Best Selling',
    // 'Add best selling description'
    'Description'
  ];
  listArr: any = [];
  listArrbackup: any = [];
  image_url: any = environment.image_url;
  value = 1000;
  options: Options = {
    floor: 0,
    ceil: 2000
  };
  liveFilter: any = '';
  flickerArr: any = {};
  editDescriptionFlag: boolean;
  focusID = 0;
  firstFlag = true;
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button

      // ['link', 'image', 'video']                         // link and image, video
    ]
  };
  editorStyle = {
    height: '250px'
  }
  ngOnInit() {
    const pageNumber = JSON.parse(localStorage.getItem('pageNo'));
    localStorage.removeItem('pageNo');
    if (pageNumber) {
      this.page = Number(pageNumber);
    }
    this.searchKeyWord = ''
    this.priceFilter = '';
    this.plive = '';
    this.pliveValue = '';
    this.productsListing();
    this.getCategory();
    this.createForm();
    $(`#featured-1`).prop('checked', false);
    $(`#featured-2`).prop('checked', false);
  }

  ngOnDestroy(): void {
    localStorage.removeItem('pageNo');
  }
  getCategory() {
    this.userService.getCategory()
      .pipe(take(1))
      .subscribe(res => {
        this.categoryList = res.result;
      });
  }
  filterListing(ob: filter) {
    console.log(ob);
    this.crudService
      .filterEntity(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.listArr = result;
      });
  }
  pliveCondition(ob) {
    this.liveCheck = true;
    const temp = {
      page: 1, plive: this.pliveValue.val
    };
    this.page = 1;
    this.userService
      .listingProductPaginationwithPlive(temp)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.listArr = result;
        this.listArrbackup = result;
        this.total = res.total;
      });
  }
  dataChanged(e, type) {
    console.log(e, type);
    switch (type) {
      case 'live':
        const ob: filter = { val: +e, modelType: app_strings.MODELS.products, col: 'isActive' };
        this.pliveValue = (ob.val).toString();
        this.page = 1;
        this.productsListing();
        break;
      case 'price':
        const ob_price: filter = { val: `0,${e}`, modelType: app_strings.MODELS.products, col: 'amount' };
        this.priceFilter = ob_price.val;
        this.productsListing();
        // this.filterListing(ob_price);
        break;
      case 'user':
        const ob_user: filter = { val: +e.target.value, modelType: app_strings.MODELS.products, col: 'userId' };
        // this.filterListing(ob_user);
        break;
      default:
        break;
    }
  }
  def(e, id) {
    this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    const img = 'assets/images/def.png';
    if (!e && this.flickerArr[id] > 1) { return; }
    e.target.src = img;
  }
  productsListing() {
    const temp = {
      plive: this.pliveValue,
      page: this.page,
      price: this.priceFilter,
      userId: this.userService.getUserId() || localStorage.get('x-id'),
      search: this.searchKeyWord,
      order: this.sortby,
      sort: this.colName
    };
    if (!this.sortby) {
      delete temp.order;
      delete temp.sort;
    }
    console.log('tem>>>', temp);
    this.focusID = 0;
    this.userService
      .listingProductPagination(temp)
      .pipe(take(1))
      .subscribe((res) => {
        const ref = new Subject<void>();
        const { result } = res;
        this.listArr = result;
        this.listArrbackup = result;
        this.total = res.total;
        // this.search(this.searchKeyWord);
        const newOptions: Options = Object.assign({}, this.options);
        newOptions.floor = 0;
        newOptions.ceil = result[0].maxAmount;
        this.options = newOptions;
        if (this.firstFlag) {
          this.value = result[0].maxAmount;
        }
        this.firstFlag = false;
        this.refresh = ref.next();
        this.focusID = JSON.parse(localStorage.getItem('focusid'));
        localStorage.removeItem('focusid');
        if (this.focusID) {
          setTimeout(() => {
            $('html, body').animate({
              scrollTop: $('#k' + this.focusID).offset().top - 350
          }, 500);
          }, 1500);
        }
      });
  }
  switchchange(e, id, i) {
    if (false && $(e.target).prop('checked') === true) {
      $('#swtichmodal').modal('show');
      this.myForm.get('id').setValue(id);
    } else {
      // tslint:disable-next-line: one-variable-per-declaration
      let title, val = { type: '', publish: '', id };
      val.type = (app_strings.MODELS.products).toLowerCase(),
        val.publish = $(e.target).prop('checked') === true ? '1' : '0';
      if ($(e.target).prop('checked')) {
        title = 'Are you sure you want to add into publish?';
      } else { title = 'Are you sure you want to remove into publish?'; }
      this.crudService.confirmPopup({ confirmButtonText: 'Yes', text: '', title })
        .then((suc) => {
          // tslint:disable-next-line: triple-equals
          if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
            if (e) {
              $(`#publish${i}`).prop('checked', true);
            } else {
              $(`#publish${i}`).prop('checked', true);
            }
          } else {
            this.userService
              .commonChangeStatus(val)
              .pipe(take(1))
              .subscribe((_res) => {
                this.productsListing();
              });
          }
        });
    }
  }
  changeStatus(isActive, id) {
    /* Are you sure you want to deactivate?
Are you sure you want to activate? */
    let title;
    const ob = { isActive: isActive ? 1 : 0, id };
    if (isActive) {
      title = 'Are you sure you want to activate?';
    } else { title = 'Are you sure you want to deactivate?'; }
    this.crudService.confirmPopup({ confirmButtonText: 'Yes', text: '', title })
      .then((suc) => {
        // tslint:disable-next-line: triple-equals
        if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
          if (isActive) {
            $(`#switchRoundedSuccess${id}`).prop('checked', false);
          } else {
            $(`#switchRoundedSuccess${id}`).prop('checked', true);
          }
        } else {
          this.userService
            .changeStatusProduct(ob)
            .pipe(take(1))
            .subscribe((_res) => { this.productsListing(); });
        }
      });
  }
  search(e) {
    if (e.length > 0) {
      // const val = (e).toUpperCase();
      // this.listArr = this.listArrbackup.filter(el => {
      //   // (res) => res.name.indexOf(val) >= 0
      //   if (el.name.toUpperCase().includes(val) || el.artisanName.toUpperCase().includes(val)) {
      //     return true;
      //   }
      // });
      this.productsListing()

    }
    if (this.searchKeyWord.length === 0) {
      this.productsListing();
    }
  }
  edit(id) {
    if (!id) { return; }
    // this.crudService.setId(id)
    this.router.navigate(['/products/add'], { queryParams: { id, page: this.page } });
  }
  download() {
    const temp = {
      plive: this.pliveValue,
      price: this.priceFilter,
      userId: this.userService.getUserId() || localStorage.get('x-id')
    };
    this.userService
      .listingProduct(temp)
      .pipe(take(1))
      .subscribe((res) => {
        let temp = [];
        res.result.forEach(el => {
          delete el.id;
          delete el.isActive;
          delete el.categoryId;
          delete el.subcategoryId;
          delete el.addingBestselling;
          delete el.plive;
          delete el.roleName;
          delete el.publish;
          delete el.image;
          temp.push({
            Name: el.name,
            Amount: el.amount,
            ['No Of Order']: el.noOfOrder,
            ['Material']: el.material,
            ['Category Name']: el.categoryName,
            ['Subcategory Name']: el.subcategoryName,
            ['Inventory Qty']: el.inventoryQty,
            ['Search Tags']: el.searchTags,
            ['Bestselling Comment']: el.addingBestsellingComment || '-----',
          });
        });
        if (temp.length) {
          this.userService.exportAsExcelFile(temp, 'product-list');
        } else {
          this.userService.bug('No record found !');
        }
      });
  }
  changePage(page) {
    this.page = page;
    // if (this.liveCheck) {
    //   this.pliveCondition(this.pliveValue);
    //   return;
    // }
    this.productsListing();
  }
  getCatId(val) {
    console.log(val);
    const temp = {
      id: val
    };
    this.userService.getSubCategoryByCatId(temp)
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        if (result.length) {
          this.getSubcategory = result;
        } else {
          this.userService.error('No subcategory found');
        }
      });
  }
  createForm() {
    this.myForm = this.fb.group({
      id: [],
      addingBestsellingComment: [''],
      description: ['']
      // categoryId: ['', [Validators.required]],
      // subcategoryId: ['', [Validators.required]],
    });
  }
  submit(val) {
    delete val.description;
    if (this.finalCount > 200) {
      this.userService.error(app_strings.EXCEED_WORD_LIMIT);
      return;
    }
    if (this.myForm.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      // this.userService.error(app_strings.INVALID_FORM);
      return;
    }
    console.log(val);
    val.type = (app_strings.MODELS.products).toLowerCase();
    val.addingBestselling = '1';
    this.userService
      .commonChangeStatus(val)
      .pipe(take(1))
      .subscribe((_res) => {
        this.productsListing();
        this.createForm();
        $('#swtichmodal').modal('hide');
      });
  }
  get f() {
    return this.myForm.controls;
  }
  addintoBestSelling(isActive, id, addingBestsellingComment) {
    let title;
    this.editDescriptionFlag = false;
    // if (isActive) {
    //   this.myForm.get('description').clearValidators();
    //   this.myForm.get('addingBestsellingComment').setValidators(Validators.required);
    //   this.myForm.get('description').updateValueAndValidity();
    //   this.myForm.get('addingBestsellingComment').updateValueAndValidity();
    //   $('#swtichmodal').modal({ backdrop: 'static', keyboard: false });
    //   this.myForm.get('id').setValue(id);
    //   this.myForm.get('addingBestsellingComment').setValue(addingBestsellingComment);
    //   this.wordCount(addingBestsellingComment);
    //   return;
    // }
    const ob = { addingBestselling: isActive ? '1' : '0', id, type: '' };
    if (isActive) {
      title = 'Are you sure you want to add into bestSelling?';
    } else { title = 'Are you sure you want to remove from best selling?'; }
    this.crudService.confirmPopup({ confirmButtonText: 'Yes', text: '', title })
      .then((suc) => {
        // tslint:disable-next-line: triple-equals
        if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
          if (isActive) {
            $(`#addingBestselling${id}`).prop('checked', false);
          } else {
            $(`#addingBestselling${id}`).prop('checked', true);
          }
        } else {
          ob.type = (app_strings.MODELS.products).toLowerCase(),
            this.userService
              .commonChangeStatus(ob)
              .pipe(take(1))
              .subscribe((_res) => {
                if (isActive) {
                  $(`#addingBestselling${id}`).prop('checked', true);
                } else {
                  $(`#addingBestselling${id}`).prop('checked', false);
                }
              });
        }
      });
  }
  closePopup() {
    console.log(`#addingBestselling${this.myForm.get('id').value}`);
    $(`#addingBestselling${this.myForm.get('id').value}`).prop('checked', false);
  }
  import(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    e.target.value = '';
    this.userService.readCSVnew(file).then(data => {
      console.log('data>>', data);
      const colArr = data[0];
      data.shift();
      const val = data;
      console.log('colArr', colArr);
      console.log('csvValCheck', val);
      const tagsIndex = colArr.indexOf('Tags');
      const otherImageUrlIndex = colArr.indexOf('other_image_url');
      const descriptionIndex = colArr.indexOf('Description');
      if (!tagsIndex || !otherImageUrlIndex) {
        this.userService.error('Invalid CSV data format, Please refer sample CSV');
        return;
      }
      let sampleCSV;
      const formatColArr = [];
      this.userService.getProductSample().subscribe((jsdonww: any) => {
        sampleCSV = jsdonww.result[0];
        for (const key in sampleCSV) {
          if (key) {
            formatColArr.push(key);
          }
        }
        if (this.userService.compareTwoCSVarr(colArr, formatColArr)) {
          console.log('allColMatched');
          // return;
          for (let index = 0; index < val.length; index++) {
            for (let i = 0; i < val[index].length; i++) {
              switch (i) {
                case tagsIndex:
                  break;

                case otherImageUrlIndex:
                  break;

                case descriptionIndex:
                  if (val[index][descriptionIndex]) {
                    val[index][descriptionIndex].replace('/n', '<br>');
                    console.log('desc', val[index][descriptionIndex]);
                  } else {
                    this.userService.error('Please provide data of all column, Optional field: Tags, Other image url');
                    return;
                  }
                  break;

                default:
                  if (val[index][i] === '') {
                    this.userService.error('Please provide data of all column, Optional field: Tags, Other image url');
                    return;
                  }
              }
            }
          }
          this.uploadCSV(file);
        } else {
          this.userService.error('Invalid CSV data format, Please refer sample CSV');
        }
      });

    });
  }
  uploadCSV(file) {
    const fd = new FormData();
    fd.append('files', file);
    this.userService.importProduct(fd).subscribe(res => {
      if (res.code === 200) {
        this.userService.success(res.message);
        this.ngOnInit();
      } else {
        this.userService.success(res.message);
      }
    });
  }
  sort(sort, col) {
    this.page = 1;
    this.sortby = sort;
    if (col === 'Artisans Name') {
      this.colName = 'artisanName';
      // this.listArr = _.orderBy(this.listArr, [col], [sort]);
      this.productsListing();
    }
    if (col === 'Amount') {
      this.colName = 'amount';
      // this.listArr = _.orderBy(this.listArr, [col], [sort]);
      this.productsListing();
    }
    if (col === 'QTY') {
      this.colName = 'inventoryQty';
      // this.listArr = _.orderBy(this.listArr, [col], [sort]);
      this.productsListing();
    }
    if (col === 'No. of orders') {
      this.colName = 'noOfOrder';
      // this.listArr = _.orderBy(this.listArr, [col], [sort]);
      this.productsListing();
    }
  }
  wordCount(val) {
    const wordCounts = {};
    const matches = val.match(/\b/g);
    wordCounts[val] = matches ? matches.length / 2 : 0;
    this.finalCount = 0;
    $.each(wordCounts, (k, v) => {
      this.finalCount += v;
    });
    $('#display_count').html(this.finalCount);
  }
  reset() {
    this.firstFlag = true;
    this.colName = '';
    this.sortby = '';
    this.ngOnInit();
    // this.value = this.listArr[0].maxAmount / 2;
    this.searchKeyWord = '';
  }
  downloadSample() {
    this.userService.getProductSample().subscribe(res => {
      this.userService.exportToCsv('sampleProduct.csv', res['result']);
    });
  }

  editDescription(id, description) {
    this.editDescriptionFlag = true;
    this.myForm.get('addingBestsellingComment').clearValidators();
    this.myForm.get('description').setValidators(Validators.required);
    this.myForm.get('addingBestsellingComment').updateValueAndValidity();
    this.myForm.get('description').updateValueAndValidity();
    $('#swtichmodal').modal({ backdrop: 'static', keyboard: false });
    this.myForm.get('id').setValue(id);
    this.myForm.get('description').setValue(description);
  }
  submitEditDescription(val) {
    delete val.addingBestsellingComment;
    // if (this.finalCount > 200) {
    //   this.userService.error(app_strings.EXCEED_WORD_LIMIT);
    //   return;
    // }
    if (this.myForm.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      // this.userService.error(app_strings.INVALID_FORM);
      return;
    }
    console.log(val);
    val.type = (app_strings.MODELS.products).toLowerCase();
    this.userService
      .commonChangeStatus(val)
      .pipe(take(1))
      .subscribe((_res) => {
        this.productsListing();
        this.createForm();
        $('#swtichmodal').modal('hide');
      });
  }
  delete(id: any) {
    if (!id) { return; }
    this.crudService.confirmPopup().then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
      } else {
        const ob = {
          // type: app_strings.MODELS.users,
          id,
        };
        this.userService
          .deleteProductNew(ob)
          .pipe(take(1))
          .subscribe((res) => {
            if (res && res.code === 400) {
              this.userService.error(res.message);
              return;
            }
            this.userService.success(res.message);
            this.ngOnInit();
          });
      }
    });
  }

  openProductOnWeb(id) {
    const url = `https://lal10.com/products/detail?productId=${id}`
    window.open(url, '_blank');
  }
}
