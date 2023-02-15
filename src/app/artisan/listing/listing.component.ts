import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserService } from 'src/app/_services/user.service';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/_services/crud.service';
import { app_strings } from 'src/app/_constants/app_strings';
import * as _ from 'lodash';
import { OptionsService } from 'src/app/options/options.service';
import { element } from 'protractor';
import Swal from 'sweetalert2';
declare var $: any;
// import * as $ from 'jquery';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  total = 0;
  craftType: any;
  CraftList: any;
  productList: any;
  materialList: any;
  stateList: any;
  searchKeyWord: string;
  focusID = 0;
  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private manageListingService: OptionsService,
    private router: Router
  ) { }
  listHeaders: any = ['Profile image', 'Artisans Name', 'Mobile Number', 'Email ID', 'KYC Verified', 'State',
    'Total Enquiry', 'Total Orders', 'Action', 'Status'];
  listArr: any = [];
  listArrbackup: any = [];
  image_url: any = environment.image_url;
  page = 1;
  limit: any = 10;
  searchKey: any = '';
  updatePage = 0;
  flickerArr: any = {};
  state: any;
  material: any;
  product: any;
  craft: any;
  stateId = [];
  craftId = [];
  materialId = [];
  sel1;
  sel2;
  sel3;
  sel4;
  colName = '';
  sortby = '';
  ngOnInit() {
    const pageNumber = JSON.parse(sessionStorage.getItem('artisanPage'));
    sessionStorage.removeItem('artisanPage');
    if (pageNumber) {
      this.page = Number(pageNumber);
    }
    this.searchKeyWord = '';
    this.state = '';
    this.material = '';
    this.product = '';
    this.craft = '';
    this.artisanListing();
    // this.getCraft('craft');
    // this.getProduct('products');
    // this.getMaterial('material');
    this.getState('state');
  }
  artisanListing() {
    const temp = {
      pageNumber: this.page,
      state: this.state || '',
      material: this.material || '',
      craft: this.craft || '',
      product: this.product || '',
      search: this.searchKeyWord,
      order: this.sortby,
      sort: this.colName
    };
    if (!this.sortby) {
      delete temp.order;
      delete temp.sort;
    }
    this.focusID = 0;
    this.userService.listingArtisanPagination(temp)
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.listArr = result;
        this.total = res.total;
        this.listArrbackup = this.listArr;
        this.focusID = JSON.parse(sessionStorage.getItem('artisanFocus'));
        sessionStorage.removeItem('artisanFocus');
        if (this.focusID) {
          setTimeout(() => {
            $('html, body').animate({
              scrollTop: $('#k' + this.focusID).offset().top - 350
          }, 500);
          }, 1500);
        }
      });
  }
  def(e: { target: { src: string; }; }, id: string | number) {
    this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    const img = 'assets/images/def.png';
    if (!e && this.flickerArr[id] > 1) { return; }
    e.target.src = img;
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
          .deleteArtisanNew(ob)
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
  search() {

    if (this.searchKeyWord.length > 0) {
      this.artisanListing();
    }
    if (this.searchKeyWord.length === 0) {
      this.artisanListing();
    }
  }
  onScroll() {
    ++this.page;
    const temp = this.page * 10;
    this.updatePage = temp;
    this.ngOnInit();
    console.log('scrolled!!', temp);
  }
  downloadSample() {
    this.userService.getArtisanSample().subscribe(res => {
      this.userService.exportToCsv('sampleArtisan.csv', res['result']);
    });

  }
  download() {
    this.userService.listofArtisanDownload({})
      .pipe(take(1))
      .subscribe(res => {
        const exportCSV = [];
        // tslint:disable-next-line: max-line-length
        res.result.forEach((element: { email: any[]; craft: any[]; material: any[]; product: any[]; name: any; mobile: any; stateName: any; }) => {
          // tslint:disable-next-line: one-variable-per-declaration
          const Craft = [], Product = [], Material = [];
          element.craft.forEach((el: { name: any; }) => {
            Craft.push(el.name);
          });
          element.material.forEach((el: { name: any; }) => {
            Material.push(el.name);
          });
          element.product.forEach((el: { name: any; }) => {
            Product.push(el.name);
          });
          const temp = {
            ['Artisan name']: element.name || '--',
            ['Artisan email']: element.email || '--',
            ['Artisan number']: element.mobile || '--',
            State: element.stateName,
            Craft: Craft.toString(),
            Material: Material.toString(),
            ['Product fields']: Product.toString()
          };
          exportCSV.push(temp);
        });
        this.userService.exportAsExcelFile(exportCSV, 'artisan-list');
      });
  }
  edit(id: any) {
    if (!id) { return; }
    // this.crudService.setId(id)
    this.router.navigate(['/artisan/add'], { queryParams: { id, page: this.page } });
  }
  changeStatus(i: any, status: any, userId: any) {
    const ob = { isActive: status === true ? '1' : '0', id: userId, type: app_strings.MODELS.users };
    let title: string;
    if (status) {
      title = 'Are you sure you want to activate?';
    } else { title = 'Are you sure you want to deactivate?'; }
    this.crudService.confirmPopup({ confirmButtonText: 'Yes', text: '', title })
      .then((suc) => {
        // tslint:disable-next-line: triple-equals
        if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
          // console.log(`#switchRoundedSuccess${i}`,status,$(`#switchRoundedSuccess0`).prop('checked',true))
          if (status) {
            $(`#switchRoundedSuccess${i}`).prop('checked', false);
          } else {
            $(`#switchRoundedSuccess${i}`).prop('checked', true);
          }
        } else {
          this.userService
            .commonChangeStatus(ob)
            .pipe(take(1))
            .subscribe(() => {
              // this.ngOnInit();
              if (status) {
                $(`#switchRoundedSuccess${i}`).prop('checked', true);
              } else {
                $(`#switchRoundedSuccess${i}`).prop('checked', false);
              }
            });
        }
      });
  }
  changePage(val: number) {
    console.log(val);
    this.page = val;
    this.artisanListing();
  }
  sort(sort: any, col: string) {
    /* listHeaders: any = ['Profile image', 'Artisans Name', 'Mobile Number', 'Email ID', 'State',
    'Total Enquiry', 'Total Orders', 'Action', 'Status']; */
    this.page = 1;
    this.sortby = sort;
    console.log(sort, col);
    if (col === 'Artisans Name') {
      this.colName = 'name';
      // this.listArr = _.orderBy(this.listArr, [col], [sort]);
      this.artisanListing();
    }
    if (col === 'Total Enquiry') {
      this.colName = 'totalEnq';
      // this.listArr = _.orderBy(this.listArr, [col], [sort]);
      this.artisanListing();
    }
    if (col === 'Total Orders') {
      this.colName = 'totalOrders';
      // this.listArr = _.orderBy(this.listArr, [col], [sort]);
      this.artisanListing();
    }
    // if (col === 'Total Enquiry') {
    //   col='name'
    //   this.listArr = _.orderBy(this.listArr, [col], [sort]);
    // }
  }
  import(e) {
    // debugger
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
      const emailIndex = colArr.indexOf('Email');
      const kycImageIndex = colArr.indexOf('KycImage');
      if (!emailIndex || !kycImageIndex) {
        this.userService.error('Invalid CSV data format, Please refer sample CSV');
        return;
      }
      for (let index = 0; index < val.length; index++) {
        // if (val[index] === '' && (val[index] !== '')) {
        //   this.userService.error('Please provide data of all column');
        //   return;
        // }
        // val[index].forEach((element, i) => {
        //   if (i !== 2 || i !== 8) {
        //     if
        //   }
        // });
        for (let i = 0; i < val[index].length; i++) {
          // if (i === 2) {
          //   continue
          // }
          switch (i) {
            case emailIndex:

              break;
            case kycImageIndex:
              break;

            default:
              if (val[index][i] === '') {
                // debugger
                this.userService.error('Please provide data of all column, Optional fields: Email, KYC Image');
                return;
              }
              break;
          }
        }
      }
      // console.log('success');
      // return;
      let sampleCSV;
      const formatValArr = [];
      this.userService.getArtisanSample().subscribe((jsdonww: any) => {
        sampleCSV = jsdonww.result[0];
        for (const key in sampleCSV) {
          if (key) {
            formatValArr.push(key);
          }
        }
        // console.log('formattedJsonVal', formatValArr);
        if (this.userService.compareTwoCSVarr(colArr, formatValArr)) {
          // console.log('allMatched');
          this.uploadCSV(file);
        } else {
          // console.log('NotAllMatched');
          this.userService.error('Invalid CSV data format, Please refer sample CSV');
        }
      });
    });
  }
  uploadCSV(file) {
    const fd = new FormData();
    fd.append('files', file);
    this.userService.importArtisan(fd).subscribe(res => {
      if (res.code == 200) {
        this.userService.success(res.message);
        this.ngOnInit();
      } else {
        this.userService.error(res.message);
        if (res.url) {
          window.open(res.url, '_blank');
        }
      }
    });
  }
  // getCraft(val: string) {
  //   const ob = {
  //     type: val,
  //   };
  //   this.manageListingService
  //     .listing(ob)
  //     .pipe(take(1))
  //     .subscribe((res) => {
  //       const { result } = res;
  //       this.CraftList = result;
  //     });
  // }
  // getProduct(val: string) {
  //   const ob = {
  //     type: val,
  //   };
  //   this.manageListingService
  //     .listing(ob)
  //     .pipe(take(1))
  //     .subscribe((res) => {
  //       const { result } = res;
  //       this.productList = result;
  //     });
  // }
  // getMaterial(val: string) {
  //   const ob = {
  //     type: val,
  //   };
  //   this.manageListingService
  //     .listing(ob)
  //     .pipe(take(1))
  //     .subscribe((res) => {
  //       const { result } = res;
  //       this.materialList = result;
  //     });
  // }
  getState(val: string) {
    const ob = {
      type: val,
    };
    this.manageListingService
      .listing(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.stateList = result;
      });
  }
  getCraft(val) {
    this.stateId = [];
    this.CraftList = [];
    this.stateId.push(val);
    // this.stateId.toString();
    const ob: any = {
      stateId: this.stateId.toString()
    };
    console.log('request',ob);

    this.userService.getManageListingHeirarchy(ob, 'CRAFT').subscribe(res => {
      if (res && res.code === 200) {

        this.CraftList = res.craftList;
        this.materialList = res.materialList;
        this.productList = res.productList;
      } else {
        this.userService.error(res.message);
      }
    });
  }
  getMaterial(val) {
    this.materialList = [];
    this.craftId = [];
    this.craftId.push(val);
    // this.craftId.toString();
    const ob: any = {
      stateId: this.stateId.toString(),
      craftId: this.craftId.toString()
    };
    this.userService.getManageListingHeirarchy(ob, 'MATERIAL').subscribe(res => {
      if (res && res.code === 200) {
        this.materialList =  res.result;
        this.productList = res.productList;
      } else {
        this.userService.error(res.message);
      }
    });
  }
  getProducts(val) {
    this.productList = [];
    this.materialId = [];
    this.materialId.push(val);
    // this.materialId.toString();
    const ob: any = {
      stateId: this.stateId.toString(),
      craftId: this.craftId.toString(),
      materialId: this.materialId.toString()
    };
    this.userService.getManageListingHeirarchy(ob, 'PRODUCT').subscribe(res => {
      if (res && res.code === 200) {
        this.productList =  res.result;
      } else {
        this.userService.error(res.message);
      }
    });
  }
  filter(val: any, type: any) {
    console.log(val, type);
    switch (type) {
      case 'craft':
        this.craft = val;
        this.artisanListing();
        break;
      case 'material':
        this.material = val;
        this.artisanListing();
        break;
      case 'state':
        this.state = val;
        this.artisanListing();
        break;
      default:
        this.product = val;
        this.artisanListing();
        break;
    }
  }
  reset() {
    this.stateId = [];
    this.CraftList = [];
    this.materialList = [];
    this.craftId = [];
    this.productList = [];
    this.materialId = [];
    this.colName = '';
    this.sortby = '';
    this.ngOnInit();
  }
  showKYCimage(data, imageType?: string) {
    if (!data.kycImage) {
      console.log(data.kycImage);
      return;
    }
    if (imageType) {
      this.userService.showImageKYC(data.kycImage).then((result) => {
        const ob: any = {
          id: data.id,
          type: 'users',
          is_verified: '1'
        };
        if (result.value) {
          // alert('Approved');
          this.userService.commonChangeStatus(ob).subscribe(res => {
            if (res && res.code === 200) {
              this.userService.success(res.message);
              this.artisanListing();
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // alert('Rejected');
          ob.is_verified = '0';
          this.userService.commonChangeStatus(ob).subscribe(res => {
            if (res && res.code === 200) {
              this.userService.success(res.message);
              this.artisanListing();
            }
          });
        }
      });
    } else {
      // this.userService.showImage(imageUrl);
    }
  }
}
