import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  base_url: string = environment.base_url;
  crudRoute = 'api/v2/crud';
  adminRoute = 'api/v2/admin';

  multipartyHeaders = new HttpHeaders({ multiparty: 'yes' });
  constructor(private http: HttpClient) { }

  add(ob: any): Observable<any> {
    const uri = `${this.base_url}/${this.crudRoute}/addEntity`;
    return this.http.post(uri, ob);
  }

  list(ob: any): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/listingCms`;
    return this.http.post(uri, ob);
  }
  getBrandList(): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getBrand`;
    return this.http.get(uri);
  }
  addMultiparty(ob: FormData): Observable<any> {
    const uri = `${this.base_url}/${this.crudRoute}/addEntity`;
    return this.http.post(uri, ob, { headers: this.multipartyHeaders });
  }
  uploadBrand(ob: FormData): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/uploadBrand`;
    return this.http.post(uri, ob, { headers: this.multipartyHeaders });
  }

  addContentMultiparty(ob: FormData): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/editAboustUs`;
    return this.http.post(uri, ob);
  }
  editFaq(ob: any): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/edit/faqs`;
    return this.http.post(uri, ob);
  }
  deleteFaq(ob: any): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/delete/faqs`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'token': (token),
      }),
      body: ob,
    };
    return this.http.delete(uri, httpOptions);
  }

  /* patch msg start here */
  changePatchMsgStatus(ob: any): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/status/message`;
    return this.http.patch(uri, ob);
  }
  editPatchMsgStatus(ob: any): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/edit/message`;
    return this.http.post(uri, ob);
  }
  deletePatchMsgStatus(ob: any): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/delete/message`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'token': (token),
      }),
      body: ob,
    };

    return this.http.delete(uri, httpOptions);
  }
  /* patch msg end here */

  /* change indexing api start here */
  changeBannerIndex(ob: any): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/bannerSequenceChanged?id=${ob}`;
    return this.http.get(uri);
  }
  /* change indexing api start here */

  // exhibition list start here

  exhibitionList(): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getExhibannerList`;
    return this.http.get(uri);
  }

  exhibitionUserList(ob): Observable<any> {
    const uri = `${this.base_url}/${this.adminRoute}/getExhibannerUserList?id=${ob}`;
    return this.http.get(uri);
  }

  // exhinition list end here

  // inforgraphics start here
  infoList(ob): Observable<any> {
    const uri = `${this.base_url}/${this.crudRoute}/getInfographics?type=${ob}`;
    return this.http.get(uri);
  }
  addInfographics(ob: FormData): Observable<any> {
    const uri = `${this.base_url}/${this.crudRoute}/addInfographics`;
    return this.http.post(uri, ob, { headers: this.multipartyHeaders });
  }
  // infographics end here


//   1.Catalogue
// 2.Careers
// 3.blogs
// 5.team [about us  mai team section pending] [done]
// 6.returnPolicy
// 7.privacypolicy
addTeam(ob: FormData): Observable<any> {
  const uri = `${this.base_url}/${this.adminRoute}/addTeam`;
  return this.http.post(uri, ob, { headers: this.multipartyHeaders });
}
getTeam(): Observable<any> {
  const uri = `${this.base_url}/${this.adminRoute}/getTeam`;
  return this.http.get(uri);
}
getCatalogue(): Observable<any> {
  const uri = `${this.base_url}/${this.adminRoute}/getCatalouge`;
  return this.http.get(uri);
}
addCatalogue(ob: FormData): Observable<any> {
  const uri = `${this.base_url}/${this.adminRoute}/addCatalouge`;
  return this.http.post(uri, ob, { headers: this.multipartyHeaders });
}
editTestimonial(ob: FormData): Observable<any> {
  const uri = `${this.base_url}/${this.adminRoute}/edit/testimonials`;
  return this.http.post(uri, ob, { headers: this.multipartyHeaders });
}
addCareer(ob): Observable<any> {
  const uri = `${this.base_url}/${this.adminRoute}/addCarrer`;
  return this.http.post(uri, ob);
}
getCarrer(): Observable<any> {
  const uri = `${this.base_url}/${this.adminRoute}/getCarrer`;
  return this.http.get(uri);
}
getReturnPolicy(): Observable<any> {
  const uri = `${this.base_url}/${this.adminRoute}/getReturnPolicy`;
  return this.http.get(uri);
}
addReturnPolicy(ob): Observable<any> {
  const uri = `${this.base_url}/${this.adminRoute}/addReturnPolicy`;
  return this.http.post(uri, ob);
}
getPrivacyPolicy(): Observable<any> {
  const uri = `${this.base_url}/${this.adminRoute}/getPrivacyPolicy`;
  return this.http.get(uri);
}
addPrivacyPolicy(ob): Observable<any> {
  const uri = `${this.base_url}/${this.adminRoute}/addPrivacyPolicy`;
  return this.http.post(uri, ob);
}
getBlogs(): Observable<any> {
  const uri = `${this.base_url}/${this.adminRoute}/getBlogs`;
  return this.http.get(uri);
}
addBlogs(ob: FormData): Observable<any> {
  const uri = `${this.base_url}/${this.adminRoute}/addBlogs`;
  return this.http.post(uri, ob, { headers: this.multipartyHeaders });
}
editBannerOrExhibiton(ob: FormData): Observable<any> {
  const uri = `${this.base_url}/${this.adminRoute}/editBanner`;
  return this.http.post(uri, ob, { headers: this.multipartyHeaders });
}
}
