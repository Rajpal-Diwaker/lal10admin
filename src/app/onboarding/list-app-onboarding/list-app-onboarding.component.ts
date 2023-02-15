import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/_services/user.service';
import { OnboardingService } from '../onboarding.service';
import { CrudService } from 'src/app/_services/crud.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { app_strings } from 'src/app/_constants/app_strings';
declare var $: any;

@Component({
  selector: 'app-list-app-onboarding',
  templateUrl: './list-app-onboarding.component.html',
  styleUrls: ['./list-app-onboarding.component.css']
})
export class ListAppOnboardingComponent implements OnInit {
  constructor(private onboardingService: OnboardingService,
    private crudService: CrudService,
    private router: Router
  ) { }
  listHeaders: any = ['S.no', 'Image', 'English Description', 'Hindi Description', 'Bengali Description', 'Gujrati Description', 'Uploaded on',
    'Action', 'status'];
  listArr: any = [];
  flickerArr: any = {};
  ngOnInit() {
    this.listing();
  }
  listing() {
    this.onboardingService.listing({ type: 'app' })
      .pipe(take(1))
      .subscribe(res => {
        this.listArr = res.result;
      });
  }
  delete(id) {
    if (!id) { return; }
    this.crudService.confirmPopup().then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
      } else {
        const ob = {
          // tslint:disable-next-line: no-string-literal
          type: app_strings.MODELS['onboarding'],
          id,
        };
        this.crudService
          .deleteEntity(ob)
          .pipe(take(1))
          .subscribe(() => {
            this.listing();
          });
      }
    });
  }
  edit(id) {
    if (!id) { return; }
    this.crudService.setId(id);
    this.router.navigate(['/onboarding/add-app-onboarding'], { queryParams: { id } });
  }
  def(e, id) {
    this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    const img = 'assets/images/def.png';
    if (!e && this.flickerArr[id] > 1) { return; }
    e.target.src = img;
  }
  changeStatus(isActive, id) {
    const ob = { isActive: isActive ? '1' : '0', id };
    let title;
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
          this.onboardingService
            .statusOnboarding(ob)
            .pipe(take(1))
            .subscribe(() => {
              if (isActive) {
                $(`#switchRoundedSuccess${id}`).prop('checked', true);
              } else {
                $(`#switchRoundedSuccess${id}`).prop('checked', false);
              }
            });
        }
      });
  }
}
