import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CmsService } from '../cms.service';
import { UserService } from 'src/app/_services/user.service';
import { app_strings } from 'src/app/_constants/app_strings';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-infographics',
  templateUrl: './infographics.component.html',
  styleUrls: ['./infographics.component.css']
})
export class InfographicsComponent implements OnInit {
  infoFormIndia: FormGroup;
  infoFromCountry: FormGroup;
  imagesObj: any = {};
  previewObj: any = {};
  indiaFlag = true;
  listObj: any = {};
  imageSelectedFlag = true;
  targetImage;

  constructor(private fb: FormBuilder,
    private cmsService: CmsService,
    private userService: UserService) { }

  ngOnInit() {
    this.setInfoFormIndia();
    this.getList();
  }

  getList() {
    this.cmsService.infoList(this.indiaFlag ? 'India' : 'Country').subscribe(res => {
      if (res && res.code === 200) {
        
        this.listObj = res.result[0];
        this.imageSelectedFlag = false;
        this.targetImage = this.listObj.image;
        
        this.indiaFlag ? this.setInfoFormIndia(this.listObj) : this.setInfoFormCountry(this.listObj);
      } else {
        this.userService.error(res.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  setInfoFormIndia(data?) {
    
    this.infoFormIndia = this.fb.group({
      artisan: [data ? data.totalArtisan : '', Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])],
      products: [data ? data.totalProducts : '', Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])],
      delivered: [data ? data.unitsDelivered : '', Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])],
      exported: [data ? data.totalCountries : '', Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])]
    });
  }

  setInfoFormCountry(data?) {
    

    this.infoFromCountry = this.fb.group({
      countries: [data ? data.totalCountries : '', Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])],
      industries: [data ? data.insdustry : '', Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])],
      projects: [data ? data.totalProject : '', Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])],
      clients: [data ? data.totalClients : '', Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])]
    });
  }

  submit() {
    if (this.indiaFlag) {
      if (this.infoFormIndia.invalid) {
        this.infoFormIndia.markAsTouched();
        // this.userService.error(app_strings.INVALID_FORM)
        return;
      }
    } else {
      if (this.infoFromCountry.invalid) {
        this.infoFromCountry.markAsTouched();
        // this.userService.error(app_strings.INVALID_FORM)
        return;
      }
    }
    if (Object.keys(this.imagesObj).length === 0) {
      return this.userService.error(app_strings.PLEASE_UPLOAD_IMAGE)
    }
    let ob;
    if (this.indiaFlag) {
      ob = {
        type: 'India',
        totalArtisan: this.f.artisan.value,
        totalProducts: this.f.products.value,
        unitsDelivered: this.f.delivered.value,
        exportedTo: this.f.exported.value
      };
    } else {
      ob = {
        type: 'Country',
        totalCountries: this.g.countries.value,
        insdustry: this.g.industries.value,
        totalProjects: this.g.projects.value,
        totalClients: this.g.clients.value
      };
    }

    for (const key in this.imagesObj) {
      if (this.imagesObj.hasOwnProperty(key)) {
        const element = this.imagesObj[key];
        ob.image = element;
      }
    }

    const fd = new FormData();

    for (const key in ob) {
      if (ob.hasOwnProperty(key)) {
        const element = ob[key];
        fd.append(key, element);
      }
    }

    // fd.append('modelType', app_strings.MODELS.cms);

    this.cmsService.addInfographics(fd)
      .pipe(take(1))
      .subscribe(res => {
        this.getList();
        this.imagesObj = {};
        this.previewObj = {};
      });
  }

  fileUpload(e: { target: { files: any[]; }; }, type: string | number) {
    // tslint:disable-next-line: curly
    if (!type) return;
    const file = e.target.files[0];
    this.imageSelectedFlag = true;

    this.imagesObj[type] = file;
    this.userService.imagePreview(file)
      .then((preview: any) => {
        this.previewObj[type] = preview;
      });
  }

  changeSelection(data) {
    console.log('data', data);
    this.imagesObj = {};
    this.previewObj = {};
    if (data === 'india') {
      this.indiaFlag = true;
    } else {
      this.indiaFlag = false;
      // this.setInfoFormCountry();
    }
    this.getList();
  }
  get f() { return this.infoFormIndia.controls; }

  get g() { return this.infoFromCountry.controls; }

  // function to accept number only
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
