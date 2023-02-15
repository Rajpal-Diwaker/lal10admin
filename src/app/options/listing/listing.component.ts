import { Component, OnInit } from '@angular/core';
import { OptionsService } from '../options.service';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CrudService } from 'src/app/_services/crud.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'],
})
export class ListingComponent implements OnInit {
  constructor(
    private crudService: CrudService,
    private manageListingService: OptionsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  sections = ['Crafts', 'Material', 'State', 'Products'];
  types = ['craft', 'material', 'state', 'products'];
  listArr: any = [];
  currentLi: any = 'craft';
  image_url: any = environment.image_url;
  addButtonText = '';
  flickerArr: any = {};
  ngOnInit() {
    // this.listing();
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        switch (params.id) {
          case 'material':
            this.setActive(2);
            break;
          case 'state':
            this.setActive(3);
            break;
          case 'products':
            this.setActive(4);
            break;
          default:
            this.setActive(1);
            break;
        }
      });
  }
  listing() {
    const ob = {
      type: this.currentLi,
    };
    this.manageListingService
      .listing(ob)
      .pipe(take(1))
      .subscribe((res) => {
        const { result } = res;
        this.listArr = result;
      });
  }
  setAddTextButton(id) {
    switch (id) {
      case 2:
        this.addButtonText = 'Add New Material';
        break;
      case 3:
        this.addButtonText = 'Add New State';
        break;
      case 4:
        this.addButtonText = 'Add New Product';
        break;
      default:
        this.addButtonText = 'Add New Craft';
        break;
    }
  }
  setActive(id) {
    this.setAddTextButton(id);
    this.currentLi = this.types[+id - 1];
    console.log(this.currentLi);

    this.listing();
    $(`ul.options > li`).removeClass('active');
    $(`ul.options > li:nth-child(${id})`).addClass('active');
  }
  def(e, id) {
    this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    const img = 'assets/images/def.png';
    if (!e && this.flickerArr[id] > 1) { return; }
    e.target.src = img;
  }
  delete(id) {
    if (!id) { return; }
    this.crudService.confirmPopup().then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
      } else {
        const ob = {
          type: app_strings.MODELS.options,
          id,
        };
        this.crudService
          .deleteEntity(ob)
          .pipe(take(1))
          .subscribe((res) => {
            this.listing();
          });
      }
    });
  }
  edit(id) {
    if (!id) { return; }
    this.crudService.setId(id);
    // if (this.currentLi === 'state') {
    //   this.router.navigate(['/options/add'], { queryParams: { id, key: 'state' } });
    // } else {
    //   this.router.navigate(['/options/add'], { queryParams: { id } });
    // }
    // this.router.navigate(['/options/add'], { queryParams: { id } });
    switch (this.currentLi) {
      case 'state':
        this.router.navigate(['/options/add'], { queryParams: { id, key: 'state' } });
        break;
      case 'craft':
        this.router.navigate(['/options/add'], { queryParams: { id, key: 'craft' } });
        break;
      case 'material':
        this.router.navigate(['/options/add'], { queryParams: { id, key: 'material' } });
        break;
      case 'products':
        this.router.navigate(['/options/add'], { queryParams: { id, key: 'products' } });
        break;
      default:
        break;
    }
  }
}
