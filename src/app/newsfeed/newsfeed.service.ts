import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsfeedService {
  base_url: string = environment.base_url;
  userRoute = 'api/v2/user';
  userId: BehaviorSubject<any> = new BehaviorSubject(null);
  noauthHeaders = new HttpHeaders({ noauth: 'yes' });
  multipartyHeaders = new HttpHeaders({ multiparty: 'yes' });
  constructor(private http: HttpClient) { }

  add(ob): Observable<any> {
    const uri = `${this.base_url}/${this.userRoute}/addNewsfeed`;
    return this.http.post(uri, ob, {headers: this.multipartyHeaders});
  }

  listing(val): Observable<any> {
    const uri = `${this.base_url}/${this.userRoute}/getNewsfeed?type=${val.type}`;
    return this.http.get(uri);
  }

}
