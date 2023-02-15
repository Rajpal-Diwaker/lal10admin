import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { CrudService } from 'src/app/_services/crud.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { app_strings } from 'src/app/_constants/app_strings';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import * as JSZip from 'jszip';
import { HttpClient } from '@angular/common/http';
declare var $: any;
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  constructor(
    private _http: HttpClient,
    private userService: UserService,
    private crudService: CrudService,
    private router: Router
  ) { }
  totalActive: any;
  listHeaders: any = ['Profile Image', 'Title', 'Artisan Name', 'Total Images'];
  listArr: any = [];
  listArrbackup: any = [];
  image_url: any = environment.image_url;
  page = 0;
  limit: any = 10;
  searchKey: any = '';
  updatePage = 0;
  flickerArr: any = {};

  getRequests = [];
  ngOnInit() {
    this.getList();
  }
  getList() {
    this.userService.getGalleryList()
      .pipe(take(1))
      .subscribe(res => {
        const { result } = res;
        this.listArr = result;
        this.totalActive = this.listArr.filter(el => {
          if (el.isActive === 1) {
            return true;
          }
        });
        console.log(this.totalActive);
        console.log();
        this.listArrbackup = this.listArr;
      });
  }
  def(e, id) {
    this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    const img = 'assets/images/def.png';
    if (!e && this.flickerArr[id] > 1) { return; }
    e.target.src = img;
  }
  /* download zip start here */
  /* download zip start here */
  /* download zip start here */
  /* download zip start here */
  download() {

    this.userService.downloadZip()
    // this.userService.downloadZip().subscribe(res => {

    //   // this.createGetRequets(res.result);
    //   if (res.code == 200 && res.result.length) {
    //     this.export(res.result)
    //   }
    // });
  }
  private createGetRequets(data) {
    data.forEach(url => this.getRequests.push(this._http.post(url.images, { responseType: 'arraybuffer' })));
  }
  export(data) {
    this.getRequests = [];
    this.createGetRequets(data);
    // tslint:disable-next-line: deprecation
    forkJoin(...this.getRequests)
      .subscribe((res) => {
        const zip = new JSZip();
        res.forEach((f, i) => {
          zip.file(`lal10image${i}.png`, f);
        });
        /* With file saver */
        // zip
        //   .generateAsync({ type: 'blob' })
        //   .then(blob => saveAs(blob, `lal10image${new Date().getTime()}.zip`));
        /* Without file saver */
        zip
          .generateAsync({ type: 'blob' })
          .then(blob => {
            const a: any = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = `lal10image${new Date().getTime()}.zip`;
            a.click();
            window.URL.revokeObjectURL(url);
          });
      });
  }
  /* download zip end here */
  /* download zip end here */
  /* download zip end here */
  /* download zip end here */
}
