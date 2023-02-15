import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { CrudService } from 'src/app/_services/crud.service';
import { OptionsService } from 'src/app/options/options.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
declare var $: any;
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  type: any = 1;
  listHeaders: any = ['Enquiry ID', 'User Name', 'Lead By', 'Email ID', 'Title',
    'Description', 'Action', 'Chat'];
  list: any[];
  page = 1;
  total: any;
  focusID = 0;
  colName = '';
  sortby = '';
  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private manageService: OptionsService,
    private route: ActivatedRoute,
    private router: Router) { }
  ngOnInit() {
    // const val = sessionStorage.getItem('genEnq');
    // if (val) {
    //   sessionStorage.removeItem('genEnq');
    //   window.location.reload();
    // }
    const pageNumber = JSON.parse(sessionStorage.getItem('enqPage'));
    sessionStorage.removeItem('enqPage');
    if (pageNumber) {
      this.page = Number(pageNumber);
    }
    const tabType = JSON.parse(sessionStorage.getItem('tabType'));
    sessionStorage.removeItem('tabType');
    if (tabType) {
      this.getList(Number(tabType));
      this.type = Number(tabType);
    } else {
      this.route.queryParams
      .subscribe(params => {
        console.log(params);
        switch (params.type) {
          case 'email':
            this.setActive(2);
            break;
          case 'web':
            this.setActive(3);
            break;
          default:
            this.setActive(1);
            break;
        }
      });
    }
  }
  getList(id) {
    const temp = {
      type: id || 1, /* 1->lead Enquiry,2->Email Enquiry,3->website Enquiry */
      page: this.page,
      order: this.sortby,
      sort: this.colName
    };
    if (!this.sortby) {
      delete temp.order;
      delete temp.sort;
    }
    this.userService.getEnquiries(temp).subscribe(res => {
      if (res.result) {
        this.list = res.result;
        this.total = res.total;
        this.focusID = JSON.parse(sessionStorage.getItem('enqFocus'));
        sessionStorage.removeItem('enqFocus');
        if (this.focusID) {
          switch (this.type) {
            case 1:
              setTimeout(() => {
                $('html, body').animate({
                  scrollTop: $('#kl' + this.focusID).offset().top - 350
              }, 500);
              }, 1500);
              break;

            case 2:
              setTimeout(() => {
                $('html, body').animate({
                  scrollTop: $('#ke' + this.focusID).offset().top - 350
              }, 500);
              }, 1500);
              break;

            default:
              setTimeout(() => {
                $('html, body').animate({
                  scrollTop: $('#kw' + this.focusID).offset().top - 350
              }, 500);
              }, 1500);
              break;
          }
        }
      } else {
        this.list = [];
      }
    });
  }
  setActive(id) {
    // this.currentLi = this.types[+id - 1];
    this.sortby = '';
    this.colName = '';
    this.page = 1;
    this.getList(id);
    this.type = id;
  }
  search(e) {
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
      for (let index = 0; index < val.length; index++) {
        for (let i = 0; i < val[index].length; i++) {
          if (val[index][i] === '') {
            this.userService.error('Please provide data of all column');
            return;
          }
        }
      }
      let sampleCSV;
      const formatValArr = [];
      this.userService.getEnquireSample().subscribe((jsdonww: any) => {
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
    fd.append('type', this.type);
    this.userService.importEnquires(fd).subscribe(res => {
      if (res.code === 200) {
        this.userService.success(res.message)
        this.ngOnInit()
      }
      else {
        this.userService.success(res.message)
      }
    })
  }
  sort(sort, col) {
    this.page = 1;
    this.sortby = sort;
    this.colName = col;
    this.getList(this.type);
    // this.list = _.orderBy(this.list, [col], [sort]);
  }
  downloadSample() {
    this.userService.getEnquireSample().subscribe(res => {
      this.userService.exportToCsv('sampleEnquire.csv', res['result']);
    })
  }
  download() {
    if (this.list.length) {
      this.userService.exportAsExcelFile(this.list, 'Export-Enquire');
    }
    else {
      this.userService.bug('No Record found');
    }

  }
  changePage(page, id) {
    this.page = page;
    // if (this.liveCheck) {
    //   this.pliveCondition(this.pliveValue);
    //   return;
    // }
    this.getList(id);
  }
  refresh(id) {
    this.userService.emailSync().subscribe(res => {
      if (res.code === 200) {
        // this.userService.success(res.message);
        this.page = 1;
        this.getList(id);
      } else {
        this.userService.error(res.message);
      }
    });
  }
}
