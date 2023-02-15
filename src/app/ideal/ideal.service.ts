import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class IdealService {
  base_url: string = environment.base_url
  artisanRoute: string = "api/v2/artisan";
  userId: BehaviorSubject<any> = new BehaviorSubject(null);
  noauthHeaders = new HttpHeaders({ 'noauth': 'yes' });
  constructor(private http: HttpClient) { }

  add(ob): Observable<any>{
    const uri = `${this.base_url}/${this.artisanRoute}/add`
    return this.http.post(uri, ob)
  }
}
