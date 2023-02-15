import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { app_strings } from '../_constants/app_strings';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  base_url: string = environment.base_url;
  moduleName = 'auth';
  userRoute = 'api/v2/user';
  appRoute = 'api/v2/app';
  adminRoute = 'api/v2/admin';
  artisanRoute = 'api/v2/artisan';
  productsRoute = 'api/v2/products';
  websiteRoute = 'api/v2/web';
  knowlarity_url: string = environment.knowlarity;
  // userId: BehaviorSubject<any> = new BehaviorSubject(null);
  noauthHeaders = new HttpHeaders({ noauth: 'yes' });
  multipartyHeaders = new HttpHeaders({ multiparty: 'yes' });
  knowlarity = new HttpHeaders({ knowlarity: 'yes' });
  constructor(private http: HttpClient, private spinner: NgxSpinnerService, private toastr: ToastrService,
    private ngxCsvParser: NgxCsvParser) { }
  success(msg) {
    if (!msg) { return; }
    this.toastr.success(msg);
  }
  showLoader() {
    this.spinner.show();
  }
  hideLoder() {
    this.spinner.hide();
  }
  error(msg) {
    if (!msg) { return; }
    this.toastr.error(msg);
  }
  bug(msg) {
    if (!msg) { return; }
    this.toastr.warning(msg);
  }
  setToken(token) {
    if (!token) { return; }
    return localStorage.setItem('accessToken', token);
  }
  defaultImg() {
    return 'src/assets/images/def.png';
  }
  getToken() {
    return localStorage.getItem('accessToken');
  }
  getUserId() {
    return localStorage.getItem('x-id');
  }
  login(ob): Observable<any> {
    this.showLoader();
    const uri = `${this.base_url}/${this.userRoute}/login`;
    return this.http.post(uri, ob, { headers: this.noauthHeaders });
  }
  dashboard(): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/dashboard`;
    return this.http.get(uri);
  }
  options(type): Observable<any> {
    const uri = `${this.base_url}/${this.userRoute}/options?type=${type}`;
    return this.http.get(uri);
  }
  isAuthenticated(): boolean {
    if (this.getToken()) {
      return true;
    } else {
      return false;
    }
  }
  showImage(imageUrl) {
    return Swal.fire({
      imageUrl,
      imageHeight: 400,
      // customClass: 'swal-wide'
      customClass: {
        container: 'container-class',
        popup: 'popup-class popup_width',
        }
    });
  }
  showImageKYC(imageUrl) {
    return Swal.fire({
      imageUrl,
      imageHeight: 400,
      confirmButtonText: 'Approve',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Reject !'
    });
  }
  // tslint:disable-next-line: max-line-length
  confirmPopup(ob = { confirmButtonText: 'Yes, delete it!', text: 'You won\'t be able to revert this!', title: 'Are you sure?' }): Promise<any> {
    const { title, text, confirmButtonText } = ob;
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText,
    });
  }
  imagePreview(file) {
    const reader = new FileReader();
    let previewPromise;
    previewPromise = new Promise((resolve, reject) => {
      reader.onload = (loaded: any) => {
        const preview = loaded.target.result;
        resolve(preview);
      };
      reader.readAsDataURL(file);
    });
    return previewPromise;
  }
  readCSV(file) {
    const reader = new FileReader();
    let previewPromise;
    previewPromise = new Promise((resolve, reject) => {
      reader.onload = (loaded: any) => {
        const preview = loaded.target.result;
        resolve(preview);
      };
      reader.readAsText(file);
    });
    return previewPromise;
  }
  compareTwoCSVarr(array1, array2) {
    // debugger
    let allMatched = false;
    // array2.forEach(element => {
    //   if (array1.includes(element)) {
    //     allMatched = true;
    //   } else {
    //     allMatched = false
    //   }
    // });
    if (array1.length !== array2.length) {
      return false;
    }
    for (let i = 0; i < array2.length; i++) {
      if (array1.includes(array2[i])) {
        allMatched = true;
      } else {
        allMatched = false;
        break;
      }
    }
    return allMatched;
    // return array1.length === array2.length && array1.every((value, index) => value.trim() === array2[index].trim());
  }
  // setuserId(id) {
  //   this.userId.next(id);
  // }
  // getuserId(): BehaviorSubject<any> {
  //   return this.userId;
  // }
  download(
    byteArrays,
    contentType = 'application/vnd.ms-excel',
    FILENAME = 'report'
  ) {
    const blob = new Blob(byteArrays, { type: contentType });
    const blobUrl = URL.createObjectURL(blob);
    FileSaver.saveAs(
      blobUrl,
      FILENAME + '_export_' + new Date().getTime() + app_strings.XLS_EXTENSION
    );
  }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
  /* export csv function start here */
  exportToCsv(filename: string, rows: object[]) {
    if (!rows || !rows.length) {
      return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date
            ? cell.toLocaleString()
            : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
  /* export CCSV function end here */
  downloadPdf(pdfUrl: string, pdfName: string) {
    FileSaver.saveAs(pdfUrl, pdfName);
  }
  /* enquiries service start here */
  getEnquiries(obj): Observable<any> {
    // 1->lead Enquiry,2->Email Enquiry,3->website Enquiry
    let uri;
    if (obj.sort) {
      uri = `${this.base_url}/${this.adminRoute}/getEnquiries?type=${obj.type}&page=${obj.page}&sort=${obj.sort}&order=${obj.order}`;
    } else {
      uri = `${this.base_url}/${this.adminRoute}/getEnquiries?type=${obj.type}&page=${obj.page}`;
    }
    return this.http.get(uri);
  }
  getGallery(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/get/gallery`;
    return this.http.post(uri, obj);
  }
  updateCommentPrice(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/gallery/comment`;
    return this.http.post(uri, obj);
  }
  deleteGalleryImage(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/del/gallery`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'token': (token),
      }),
      body: obj,
    };
    return this.http.delete(uri, httpOptions);
  }
  importEnquires(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/importEnquiries`;
    return this.http.post(uri, ob, { headers: this.multipartyHeaders });
  }
  getGenrateEnquiryList(ob): Observable<any> {
    // 1->lead Enquiry,2->Email Enquiry,3->website Enquiry
    let uri;
    if (ob.sort) {
      uri = `${this.base_url}/${this.adminRoute}/getGenrateEnquiryList?page=${ob.page}&order=${ob.order}&sort=${ob.sort}`;
    } else {
      uri = `${this.base_url}/${this.adminRoute}/getGenrateEnquiryList?page=${ob.page}`;
    }
    return this.http.get(uri);
  }
  getEnquiriesById(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getEnquiryById?id=${obj.id}`;
    return this.http.get(uri);
  }
  viewEnquiryArtisan(obj, page): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/viewEnquiryArtisan?id=${obj.id}&type=${obj.type}&page=${page}`;
    return this.http.get(uri);
  }
  editEnquiries(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/editEnquiry`;
    return this.http.post(uri, obj);
  }
  genrateEnquiry(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/genrateEnquiry`;
    return this.http.post(uri, ob, { headers: this.multipartyHeaders });
  }
  genrateNewEnquiry(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/genrateNewEnquiry`;
    return this.http.post(uri, ob, { headers: this.multipartyHeaders });
  }
  genratePurchaseOrder(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/genratePurchaseOrder`;
    return this.http.post(uri, ob);
  }
  genrateEstimate(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/genrateEstimate`;
    return this.http.post(uri, ob);
  }
  /* enquiries service End here */
  /* user tab start here */
  getWebUser(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getWebUser`;
    return this.http.post(uri, obj);
  }
  getWebUserByid(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getWebUserById?id=${obj.id}`;
    return this.http.get(uri);
  }
  /* user tab end here */
  /* artisan api start here */
  addArtisan(ob): Observable<any> {
    const uri = `${this.base_url}/${this.artisanRoute}/add`;
    return this.http.post(uri, ob, { headers: this.multipartyHeaders });
  }
  importArtisan(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/importArtisan`;
    return this.http.post(uri, ob, { headers: this.multipartyHeaders });
  }
  listingByIdArtisan(id): Observable<any> {
    const uri = `${this.base_url}/${this.artisanRoute}/listingById?id=${id}`;
    return this.http.get(uri);
  }
  // /* http://localhost:5656/api/v1/artisan/listing?limit=10&offset=0 */
  listingArtisanPagination(obj): Observable<any> {
    const uri = `${this.base_url}/${this.artisanRoute}/listing?limit=${obj.pageNumber}`;
    return this.http.post(uri, obj);
  }
  // http://localhost:5656/api/v1/artisan/listing?limit=10&offset=0 */
  listingArtisan(obj): Observable<any> {
    const uri = `${this.base_url}/${this.artisanRoute}/listing?limit=${obj.pageNumber}`;
    return this.http.post(uri, obj);
  }
  // http://localhost:5656/api/v1/artisan/listing?limit=10&offset=0 */
  listofArtisanDownload(obj): Observable<any> {
    const uri = `${this.base_url}/${this.artisanRoute}/listing`;
    return this.http.post(uri, obj);
  }
  // changeArtisanStatus(ob): Observable<any> {
  //   const uri = `${this.base_url}/${this.adminRoute}/changeStatus`;
  //   return this.http.post(uri, ob);
  // }
  deleteArtisan(ob): Observable<any> {
    const uri = `${this.base_url}/${this.artisanRoute}/deleteUser`;
    return this.http.delete(uri, ob);
  }
  createArtisanGroup(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/addGroup`;
    return this.http.post(uri, ob);
  }
  editArtisanGroup(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/editGroup`;
    return this.http.post(uri, ob);
  }
  checkEmailArtisan(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/checkEmail`;
    return this.http.post(uri, ob);
  }
  getGroupListArtisan(): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/groupListing`;
    return this.http.get(uri);
  }
  getGroupListArtisan2(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/groupListing2`;
    return this.http.post(uri, ob);
  }
  checkGroupNameArtisan(val): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/checkGroupName?group_name=${val.group_name}`;
    return this.http.get(uri);
  }
  deleteGroupArtisan(val): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/deleteGroup?id=${val.id}`;
    return this.http.get(uri);
  }
  /* artisan api end here */
  /* product  tab start here */
  addProduct(ob): Observable<any> {
    const uri = `${this.base_url}/${this.productsRoute}/add`;
    return this.http.post(uri, ob, { headers: this.multipartyHeaders });
  }
  importProduct(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/importProduct`;
    return this.http.post(uri, ob, { headers: this.multipartyHeaders });
  }
  changeProductStatus(ob): Observable<any> {
    const uri = `${this.base_url}/${this.userRoute}/changeStatus`;
    return this.http.post(uri, ob);
  }
  listingProduct(obj = {}): Observable<any> {
    const uri = `${this.base_url}/${this.productsRoute}/listing`;
    return this.http.post(uri, obj);
  }
  listingProductPagination(obj): Observable<any> {
    const uri = `${this.base_url}/${this.productsRoute}/listing`;
    return this.http.post(uri, obj);
  }
  listingProductPaginationwithPlive(obj): Observable<any> {
    const uri = `${this.base_url}/${this.productsRoute}/listing`;
    return this.http.post(uri, obj);
  }
  changeStatusProduct(ob): Observable<any> {
    const uri = `${this.base_url}/${this.productsRoute}/changeStatus`;
    return this.http.post(uri, ob);
  }
  groupProductListing(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/groupProductListing`;
    return this.http.post(uri, ob);
  }
  checkProductGroupName(val): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/checkProductGroupName?group_name=${val.group_name}`;
    return this.http.get(uri);
  }
  addProductGroup(obj) {
    const uri = `${this.base_url}/${this.adminRoute}/addProductGroup`;
    return this.http.post(uri, obj);
  }
  editProductGroup(obj) {
    const uri = `${this.base_url}/${this.adminRoute}/editProductGroup`;
    return this.http.post(uri, obj);
  }
  deleteProductGroup(val): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/deleteProductGroup?id=${val.id}`;
    return this.http.get(uri);
  }
  /* product tab end here */
  /* manage category start here */
  getCategory(): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getCategory`;
    return this.http.get(uri);
  }
  getSubCategoryByCatId(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getSubCategory?id=${obj.id}`;
    return this.http.get(uri);
  }
  addCategory(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/addCategory`;
    return this.http.post(uri, ob, { headers: this.multipartyHeaders });
  }
  editCategory(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/editCategory`;
    return this.http.post(uri, ob, { headers: this.multipartyHeaders });
  }
  addSubCategory(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/addSubCategory`;
    return this.http.post(uri, ob, { headers: this.multipartyHeaders });
  }
  editSubCategory(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/editSubCategory`;
    return this.http.post(uri, ob, { headers: this.multipartyHeaders });
  }
  getSubSubCategory(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getSubSubCategory?id=${obj.id}`;
    return this.http.get(uri);
  }
  viewSubAdminCategorylist(): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/viewSubAdminCategorylist`;
    return this.http.get(uri);
  }
  /* manage category end here */
  // common api start
  commonChangeStatus(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/changeStatus`;
    return this.http.post(uri, obj);
  }
  deleteGeneratedEnquiry(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/deleteEnquiry`;
    return this.http.post(uri, obj);
  }
  uploadMedia(ob): Observable<any> {
    const uri = `${this.base_url}/api/v2/app/uploadChatMedia`;
    return this.http.post(uri, ob, { headers: this.multipartyHeaders });
  }
  // common api end
  /* order start here */
  getOrderList(ob): Observable<any> {
    let uri;
    if (ob.sort) {
      uri = `${this.base_url}/${this.adminRoute}/getOrderList?page=${ob.page}&order=${ob.order}&sort=${ob.sort}`;
    } else {
      uri = `${this.base_url}/${this.adminRoute}/getOrderList?page=${ob.page}`;
    }
    return this.http.get(uri);
  }
  generateInvoiceOrder(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/generateInvoice`;
    return this.http.post(uri, ob);
  }
  givePurchaseOrder(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/givePurchaseOrder`;
    return this.http.post(uri, ob);
  }
  checkPDF(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/checkPDF`;
    return this.http.post(uri, ob);
  }
  /* order end here */
  /* shop start here */
  getShop(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getshop`;
    return this.http.get(uri);
  }
  addShopProduct(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/addShopProduct`;
    return this.http.post(uri, ob, { headers: this.multipartyHeaders });
  }
  /* shop start here */
  /* ideal shop start here */
  getIdealShop(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getIdealShop`;
    return this.http.get(uri);
  }
  makeIdealProduct(val): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/makeIdealProduct?ids=${val.productId}`;
    return this.http.get(uri);
  }
  getFromAllProduct(): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getFromAllProduct`;
    return this.http.get(uri);
  }
  /* ideal shop end here */
  getArtisanSample() {
    return this.http.get('assets/json/artisanSample.json');
  }
  getEnquireSample() {
    return this.http.get('assets/json/enquireSample.json');
  }
  getProductSample() {
    return this.http.get('assets/json/productSample.json');
  }
  /* website user  start here*/
  getTypeofStore(): Observable<any> {
    const url = `${this.base_url}/${this.websiteRoute}/typeOfStore`;
    return this.http.get(url);
  }
  /* website user  start here*/
  /* avenue start api  */
  getavenueList(): Observable<any> {
    const url = `${this.base_url}/${this.adminRoute}/get/stories`;
    return this.http.get(url);
  }
  addAvenue(obj): Observable<any> {
    const url = `${this.base_url}/${this.adminRoute}/add/stories`;
    return this.http.post(url, obj, { headers: this.multipartyHeaders });
  }
  updateAvenue(obj): Observable<any> {
    const url = `${this.base_url}/${this.adminRoute}/edit/stories`;
    return this.http.put(url, obj, { headers: this.multipartyHeaders });
  }
  deleteAvenue(obj): Observable<any> {
    const url = `${this.base_url}/${this.adminRoute}/delete/stories`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'token': (token),
      }),
      body: obj,
    };
    return this.http.delete(url, httpOptions);
  }
  /* avenune ends here */
  /* website orders start here */
  getWebsiteOrderList(): Observable<any> {
    const url = `${this.base_url}/${this.adminRoute}/website/orders`;
    return this.http.get(url);
  }
  addWebsiteOrderInvoiceGenerate(obj): Observable<any> {
    const url = `${this.base_url}/${this.adminRoute}/website/orders/invoice`;
    return this.http.post(url, obj);
  }
  updateWebsiteOrder(obj): Observable<any> {
    const url = `${this.base_url}/${this.adminRoute}/website/orders/invoice`;
    return this.http.put(url, obj);
  }
  updateWebsiteOrderDetails(obj): Observable<any> {
    const url = `${this.base_url}/${this.adminRoute}/websiteOrderEdit`;
    return this.http.post(url, obj);
  }
  /* website orders ends here */
  /* notification start here */
  addNotification(obj): Observable<any> {
    const url = `${this.base_url}/${this.adminRoute}/add/notification`;
    return this.http.post(url, obj);
  }
  getNotificationList(): Observable<any> {
    const url = `${this.base_url}/${this.adminRoute}/get/notification`;
    return this.http.get(url);
  }
  getUserNotificationList(): Observable<any> {
    const url = `${this.base_url}/${this.adminRoute}/getNotificationList`;
    return this.http.get(url);
  }
  deleteNotification(obj): Observable<any> {
    const url = `${this.base_url}/${this.adminRoute}/delete/notification`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'token': (token),
      }),
      body: obj,
    };
    return this.http.delete(url, httpOptions);
  }
  repeatNotification(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/repeat/Notification`;
    return this.http.post(uri, obj);
  }
  /* Notification end here */
  /* awards start here */
  // http://15.207.157.139:5578/api/v2/admin/get/awards
  getAwardsList(obj): Observable<any> {
    const url = `${this.base_url}/${this.adminRoute}/get/awards?search=${obj.search}`;
    return this.http.get(url);
  }
  publishAwardToNewsFeed(obj): Observable<any> {
    const url = `${this.base_url}/${this.adminRoute}/publishAwardToNewsFeed`;
    return this.http.post(url, obj);
  }
  /* awards start here */
  /* production tracker start here  */
  // Url : /api/v2/app/getProductionTracker
  // Method : POST
  getProductionTracker(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getProductionTracker?id=${obj.id}`;
    return this.http.get(uri);
  }
  editProductionTracker(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/editProductionTracker`;
    return this.http.post(uri, obj);
  }
  getlogisticDetails(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getlogisticDetails?id=${obj.id}`;
    return this.http.get(uri);
  }
  /* production tracker end here  */
  /* subadmin start here */
  getRoleList(): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getSubAdminRole`;
    return this.http.get(uri);
  }
  getGroupUser(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getGroupUser?id=${obj.id}`;
    return this.http.get(uri);
  }
  createSubAdminGroup(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/createSubAdminGroup`;
    return this.http.post(uri, obj);
  }
  addSubAdmin(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/addSubAdmin`;
    return this.http.post(uri, obj);
  }
  getSubAdminList(): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getSubAdminList`;
    return this.http.get(uri);
  }
  getSubAdminDetails(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getSubAdminDetails?id=${obj.id}`;
    return this.http.get(uri);
  }
  /* subadmin end here */
  /* gallery api start here  */
  getGalleryList(): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getGalleryList`;
    return this.http.get(uri);
  }
  downloadZip() {
    const uri = `${this.base_url}/${this.adminRoute}/gallery/zip`;

    return window.open(uri, '_blank');
    // return this.http.get(uri);
  }
  getGalleryDetails(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getGalleryDetails?id=${obj.id}`;
    return this.http.get(uri);
  }
  /* gallery api end here  */
  /* my-profile api start here  */
  getProfile(): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getProfile`;
    return this.http.get(uri);
  }
  updateProfile(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/profileUpdate`;
    return this.http.post(uri, obj);
  }
  changePassword(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/changePassword`;
    return this.http.post(uri, obj);
  }
  addAdminBussinessDetails(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/addAdminBussinessDetails`;
    return this.http.post(uri, obj);
  }
  getAdminBussinessDetails(): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getAdminBussinessDetails`;
    return this.http.get(uri);
  }
  /* my-profile api end here  */
  /* app setting */
  getAppSetting(): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getSupportList`;
    return this.http.get(uri);
  }
  addeditAppSetting(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/addEditSupport`;
    return this.http.post(uri, obj);
  }
  deletAppSetting(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/deleteSupport`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'token': (token),
      }),
      body: obj,
    };
    return this.http.delete(uri, httpOptions);
  }

  updateToken(obj) {
    const uri = `${this.base_url}/${this.adminRoute}/addWebToken`;
    return this.http.post(uri, obj);
  }
  removeToken(obj) {
    const uri = `${this.base_url}/${this.adminRoute}/removeWebToken`;
    return this.http.post(uri, obj);
  }
  deleteData(obj) {
    const url = `${this.base_url}/${this.adminRoute}/deleteData`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'token': (token),
      }),
      body: obj,
    };
    return this.http.delete(url, httpOptions );
  }
  emailSync(): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/emailSync`;
    return this.http.get(uri);
  }
  getStateList(val): Observable<any> {
    const uri = `${this.base_url}/${this.artisanRoute}/getManageListing?type=${val.type}`;
    return this.http.get(uri);
  }
  callKnowlarity(ob): Observable<any> {
    const url = this.knowlarity_url;
    return this.http.post(url, ob, {headers: this.knowlarity});
  }
  getManageListingHeirarchy(ob, type): Observable<any> {
    let url: string;
    switch (type) {
      case 'CRAFT':
        url = `${this.base_url}/${this.adminRoute}/getManageListing?stateId=${ob.stateId}`;
        break;
      case 'MATERIAL':
        url = `${this.base_url}/${this.adminRoute}/getManageListing?stateId=${ob.stateId}?craftId=${ob.craftId}`;
        break;
      case 'PRODUCT':
        // tslint:disable-next-line: max-line-length
        url = `${this.base_url}/${this.adminRoute}/getManageListing?stateId=${ob.stateId}?craftId=${ob.craftId}?materialId=${ob.materialId}`;
        break;
      default:
        break;
    }
    return this.http.post(url, ob);
  }
  deleteArtisanNew(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/deleteArtisan`;
    return this.http.post(uri, obj);
  }
  deleteProductNew(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/deleteProduct`;
    return this.http.post(uri, obj);
  }
  deleteProductImage(obj): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/deleteProductImage`;
    return this.http.post(uri, obj);
  }

  readCSVnew(file) {
    let csvRecords: any[] = [];
    const header = false;
    let val;
    val = new Promise((resolve, reject) => {
      this.ngxCsvParser.parse(file, { header: header, delimiter: ',' })
      .pipe().subscribe((result: Array<any>) => {

        // console.log('Result', result);
        csvRecords = result;
        resolve(result);
      }, (error: NgxCSVParserError) => {
        console.log('Error', error);
      });
    });
    return val;

  }
}
