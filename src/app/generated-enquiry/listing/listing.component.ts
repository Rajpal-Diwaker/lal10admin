import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { CrudService } from 'src/app/_services/crud.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { app_strings } from 'src/app/_constants/app_strings';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit, AfterViewInit {
  total = 0;
  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private router: Router
  ) { }
  listHeaders: any = ['Image', 'Enquiry ID', 'Title', 'SKU', 'Artisan Name', 'Type', 'Total Artisans',
    'Responded by', 'Created-on', /* 'Order/Estimate', */ 'Action'];
  listArr: any = [];
  listArrbackup: any = [];
  image_url: any = environment.image_url;
  page = 1;
  limit: any = 10;
  searchKey: any = '';
  updatePage = 0;
  flickerArr: any = {};
  focusID = 0;
  colName = '';
  sortby = '';
  ngOnInit() {
    const pageNumber = JSON.parse(sessionStorage.getItem('genEnqPage'));
    sessionStorage.removeItem('genEnqPage');
    if (pageNumber) {
      this.page = Number(pageNumber);
    }
    this.listing();

  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      $('#enquiries').removeClass('active')
    }, 200);
  }
  listing() {
    let ob = {
      page: this.page,
      order: this.sortby,
      sort: this.colName
    };
    if (!this.sortby) {
      delete ob.order;
      delete ob.sort;
    }
    this.focusID = 0;
    this.userService.getGenrateEnquiryList(ob)
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.listArr = result;
        this.total = res.total;
        this.listArrbackup = this.listArr;
        this.focusID = JSON.parse(sessionStorage.getItem('genEnqFocus'));
        sessionStorage.removeItem('genEnqFocus');
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
          // type: app_strings.MODELS.enquiries,
          // isActive: '0', deleted: '0',
          id

        };
        this.userService
          .deleteGeneratedEnquiry(ob)
          .pipe(take(1))
          .subscribe((res) => {
            this.ngOnInit();
          });
      }
    });
  }
  search(e: { target: { value: any; }; }) {
    this.searchKey = (e.target.value).toUpperCase();
    this.listArr = this.listArrbackup.filter((el: { name: string; }) => {
      // if()
      el.name = el.name.toUpperCase();
      if (el.name.includes(this.searchKey)) {
        return true;
      }
    });
  }
  onScroll() {
    ++this.page;
    const temp = this.page * 10;
    this.updatePage = temp;
    this.ngOnInit();
    console.log('scrolled!!', temp);
  }
  download() {
    // this.userService.listingArtisan()
    //   .pipe(take(1))
    //   .subscribe(res => {
    // const exportCSV = [];
    // this.listArr.forEach((element) => {
    //   // const Craft = [], Product = [], Material = [];
    //   // element.craft.forEach((el: { name: any; }) => {
    //   //   Craft.push(el.name);
    //   // });
    //   // element.material.forEach((el: { name: any; }) => {
    //   //   Material.push(el.name);
    //   // });
    //   // element.product.forEach((el: { name: any; }) => {
    //   //   Product.push(el.name);
    //   // });
    //   // const temp = {
    //   //   ['Artisan name']: element.name || '--',
    //   //   ['Artisan number']: element.mobile || '--',
    //   //   State: element.stateName,
    //   //   Craft: Craft.toString(),
    //   //   Material: Material.toString(),
    //   //   ['Product fields']: Product.toString()
    //   // };
    //   exportCSV.push(temp);
    // });

    let temp = this.listArr.filter(el => {
      el.created_at = new Date(el.created_at);
      delete el.assignUserId;
      delete el.isGenrate;
      return true;
    })
    this.userService.exportAsExcelFile(temp, 'enquiries-list');
    // });
  }
  edit(id: any) {
    if (!id) { return; }
    // this.crudService.setId(id)
    this.router.navigate(['/generated-enquiry/edit'], { queryParams: { id, type: 'enquiries/generateEnqList', page: this.page } });
  }
  changePage(val: number) {
    console.log(val);
    this.page = val;
    this.listing();
  }
  sort(sort: any, col: string) {
    /* listHeaders: any = ['Image', 'Enquiry ID', 'Title', 'Total Artisans ',
    'Responded by', 'Created-on', 'Order/Estimate', 'Action']; */
    this.page = 1;
    this.sortby = sort;
    if (col === 'Enquiry ID') {
      this.colName = 'uniqueId';
      // this.listArr = _.orderBy(this.listArr, [col], [sort]);
      this.listing();
    }
    if (col === 'Title') {
      this.colName = 'title';
      // this.listArr = _.orderBy(this.listArr, [col], [sort]);
      this.listing();
    }
    if (col === 'Total Artisans') {
      this.colName = 'totalArtisan';
      // this.listArr = _.orderBy(this.listArr, [col], [sort]);
      this.listing();
    }
    if (col === 'Responded by') {
      this.colName = 'totalResponce';
      // this.listArr = _.orderBy(this.listArr, [col], [sort]);
      this.listing();
    }
    if (col === 'Created-on') {
      this.colName = 'created_at';
      // this.listArr = _.orderBy(this.listArr, [col], [sort]);
      this.listing();
    }
    if (col === 'Total Artisans') {
      this.colName = 'totalArtisan';
      // this.listArr = _.orderBy(this.listArr, [col], [sort]);
      this.listing();
    }

  }

}
