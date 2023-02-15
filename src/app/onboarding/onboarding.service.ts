import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  base_url: string = environment.base_url;
  userRoute = 'api/v2/user';
  userId: BehaviorSubject<any> = new BehaviorSubject(null);
  noauthHeaders = new HttpHeaders({ noauth: 'yes' });
  multipartyHeaders = new HttpHeaders({ multiparty: 'yes' });
  constructor(private http: HttpClient) { }

  add(ob): Observable<any> {
    const uri = `${this.base_url}/${this.userRoute}/addOnboarding`;
    return this.http.post(uri, ob, {headers: this.multipartyHeaders});
  }

  listing(obj): Observable<any> {
    const uri = `${this.base_url}/${this.userRoute}/listingOnboarding?type=${obj.type}`;
    return this.http.get(uri);
  }

  statusOnboarding(ob): Observable<any> {
    const uri = `${this.base_url}/${this.userRoute}/statusOnboarding`;
    return this.http.put(uri, ob);
  }

  listingLoginOnboarding(ob): Observable<any> {
    const uri = `${this.base_url}/${this.userRoute}/listingLoginOnboarding?table=${ob.table}`;
    return this.http.get(uri);
  }
  addLoginOnboarding(ob): Observable<any> {
    const uri = `${this.base_url}/${this.userRoute}/addLoginOnboarding`;
    return this.http.post(uri, ob, {headers: this.multipartyHeaders});
  }
  delLoginOnboarding(ob): Observable<any> {
    const uri = `${this.base_url}/${this.userRoute}/delLoginOnboarding?table=${ob.table}&id=${ob.id}`;
    return this.http.get(uri);
  }


}
