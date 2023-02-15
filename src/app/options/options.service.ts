import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {
  base_url: string = environment.base_url;
  artisanRoute = 'api/v2/artisan';
  userId: BehaviorSubject<any> = new BehaviorSubject(null);
  noauthHeaders = new HttpHeaders({ noauth: 'yes' });
  multipartyHeaders = new HttpHeaders({ multiparty: 'yes' });
  constructor(private http: HttpClient) { }

  add(ob): Observable<any> {
    const uri = `${this.base_url}/${this.artisanRoute}/addManageListing`;
    return this.http.post(uri, ob, {headers: this.multipartyHeaders});
  }

  listing(ob): Observable<any> {
    const uri = `${this.base_url}/${this.artisanRoute}/getManageListing?type=${ob.type}`;
    return this.http.get(uri);
  }
}
