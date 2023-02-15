import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { take } from 'rxjs/operators';
import { OnboardingService } from '../onboarding.service';
import { environment } from '../../../environments/environment';
import { CrudService } from 'src/app/_services/crud.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-lisitng',
  templateUrl: './lisitng.component.html',
  styleUrls: ['./lisitng.component.css']
})
export class LisitngComponent implements OnInit {
  constructor(private onboardingService: OnboardingService,
    private crudService: CrudService,
    private router: Router
  ) { }
  listHeaders: any = ['S.no', 'Image', 'Description', 'Uploaded on',
    'Action', 'status'];
  listArr: any = [];
  flickerArr: any = {};
  ngOnInit() {
    this.listing();
  }
  listing() {
    this.onboardingService.listing({ type: 'web' })
      .pipe(take(1))
      .subscribe(res => {
        this.listArr = res.result;
      });
  }
  delete(id: any) {
    if (!id) { return; }
    this.crudService.confirmPopup().then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
      } else {
        const ob = {
          type: app_strings.MODELS.onboarding,
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
  edit(id: any) {
    if (!id) { return; }
    this.crudService.setId(id);
    this.router.navigate(['/onboarding/add'], { queryParams: { id } });
  }
  def(e: { target: { src: string; }; }, id: string | number) {
    this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    const img = 'assets/images/def.png';
    if (!e && this.flickerArr[id] > 1) { return; }
    e.target.src = img;
  }
  changeStatus(isActive: any, id: any) {
    const ob = { isActive: isActive ? '1' : '0', id };
    let title: string;
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
