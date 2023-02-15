import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NewsfeedService } from '../newsfeed.service';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/_services/crud.service';
import { UserService } from 'src/app/_services/user.service';
import { take } from 'rxjs/operators';
import { app_strings } from 'src/app/_constants/app_strings';

@Component({
  selector: 'app-app-feeds-list',
  templateUrl: './app-feeds-list.component.html',
  styleUrls: ['./app-feeds-list.component.css']
})
export class AppFeedsListComponent implements OnInit {
  constructor(private newsfeedService: NewsfeedService,
              private router: Router,
              private crudService: CrudService,
              private userService: UserService
    ) { }

  listHeaders: any = ['Image', 'Title', 'Description', 'Uploaded on', 'Action',
  'Publish on Web'];
  listArr: any = [];
  flickerArr: any = {};
  ngOnInit() {
    this.newsfeed();
  }
  newsfeed() {
    this.newsfeedService.listing({type: 'app'})
     .pipe(take(1))
     .subscribe(res => {
       this.listArr = res.result;
     });
  }
  def(e: { target: { src: string; }; }, id: string | number) {
    this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    const img = 'assets/images/def.png';
    if (!e && this.flickerArr[id] > 1) { return; }
    e.target.src = img;
  }
  edit(id: any) {
    if (!id) { return; }
    this.router.navigate(['/newsfeed/add-app-feeds'], { queryParams: { id } });
  }
  delete(id: any) {
    if (!id) { return; }
    this.crudService.confirmPopup()
    .then(suc => {
      console.log(suc);
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel') ) {
      } else {
        const ob = {
          type: app_strings.MODELS.newsfeed,
          id
        };
        this.crudService.deleteEntity(ob)
        .pipe(take(1))
        // tslint:disable-next-line: variable-name
        .subscribe(_res => {
          this.newsfeed();
        });
      }
    });
  }
  changeStatus(isPublished: any, id: any) {
    const ob = {type: app_strings.MODELS.newsfeed, isPublished: isPublished ? 1 : 0, id};
    let title: string;
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
          // tslint:disable-next-line: variable-name
          .subscribe((_res) => {
            this.newsfeed();
          });
      }
    });
  }

}
