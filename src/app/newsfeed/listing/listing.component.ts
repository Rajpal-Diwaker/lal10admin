import { Component, OnInit } from '@angular/core';
import { NewsfeedService } from '../newsfeed.service';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/_services/crud.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { UserService } from 'src/app/_services/user.service';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  constructor(private newsfeedService: NewsfeedService,
              private router: Router,
              private crudService: CrudService    ) { }
  listHeaders: any = ['Image', 'Title', 'Description', 'Uploaded on', 'Action',
  'Publish on Web'];
  listArr: any = [];
  flickerArr: any = {};
  ngOnInit() {
    this.newsfeed();
  }
  newsfeed() {
    this.newsfeedService.listing({type: 'web'})
     .pipe(take(1))
     .subscribe(res => {
       this.listArr = res.result;
     });
  }
  def(e, id) {
    this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    const img = 'assets/images/def.png';
    if (!e && this.flickerArr[id] > 1) { return; }
    e.target.src = img;
  }
  edit(id) {
    if (!id) { return; }
    this.router.navigate(['/newsfeed/add'], { queryParams: { id } });
  }
  delete(id) {
    if (!id) { return; }
    this.crudService.confirmPopup()
    .then(suc => {
      console.log(suc);
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel') ) {
      } else {
        const ob = {
          type: app_strings.MODELS.newsfeed,
          id
        };
        this.crudService.deleteEntity(ob)
        .pipe(take(1))
        .subscribe(() => {
          this.newsfeed();
        });
      }
    });
  }
  changeStatus(isPublished, id) {
    const ob = {type: app_strings.MODELS.newsfeed, isPublished: isPublished ? 1 : 0, id};
    let title;
    if (isPublished) {
      title = 'Are you sure you want to activate?';
    } else { title = 'Are you sure you want to deactivate?'; }
    this.crudService.confirmPopup({ confirmButtonText: 'Yes', text: '', title })
      .then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
        this.newsfeed();
      } else {
        this.crudService
        .editEntity(ob)
          .pipe(take(1))
          .subscribe(() => {
            this.newsfeed();
          });
      }
    });
  }
}
