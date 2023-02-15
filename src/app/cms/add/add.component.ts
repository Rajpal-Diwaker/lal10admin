import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';
import { CmsService } from '../cms.service';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  cmsGrp: FormGroup;
  cmsOptions: any = [{ id: 1, name: 'About us' }];
  constructor(private fb: FormBuilder,
    private cmsService: CmsService,
    
    private userService: UserService) { }
  ngOnInit() {
    this.cmsFrm();
  }
  cmsFrm() {
    this.cmsGrp = this.fb.group({
      type: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])]
    });
  }
  get f() { return this.cmsGrp.controls; }
  submit() {
    if (this.cmsGrp.invalid) {
      this.cmsGrp.markAsTouched();
      // this.userService.error(app_strings.INVALID_FORM)
      return;
    }
    const ob: any = {
      type: this.f.type.value,
      modelType: app_strings.MODELS.cms,
      description: this.f.description.value,
    };
    // const fd = new FormData();
    // for (const key in ob) {
    //   if (ob.hasOwnProperty(key)) {
    //     const element = ob[key];
    //     console.log(element, key);
    //     fd.append(key, element);
    //   }
    // }
    this.cmsService.addContentMultiparty(ob)
      .pipe(take(1))
      .subscribe(res => {
        this.cmsGrp.reset();
      });
  }
}
