import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { filter } from '../_interfaces/filter';
@Injectable({
  providedIn: 'root'
})
export class CrudService {
  base_url: string = environment.base_url;
  crudRoute = 'api/v2/crud';
  editId: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private http: HttpClient) { }
  deleteEntity(ob): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: ob
    };
    const uri = `${this.base_url}/${this.crudRoute}/delete`;
    return this.http.delete(uri, options);
  }
  editEntity(ob): Observable<any> {
    const uri = `${this.base_url}/${this.crudRoute}/edit`;
    return this.http.put(uri, ob);
  }
  editData(ob): Observable<any> {
    const uri = `${this.base_url}/${this.crudRoute}/editData`;
    return this.http.post(uri, ob);
  }
  addEntity(ob): Observable<any> {
    const uri = `${this.base_url}/${this.crudRoute}/addEntity`;
    return this.http.post(uri, ob);
  }
  filterEntity(ob: filter): Observable<any> {
    const { col, val, modelType } = ob;
    const uri = `${this.base_url}/${this.crudRoute}/filterEntity?col=${col}&val=${val}&modelType=${modelType}`;
    return this.http.get(uri);
  }
  setId(id) {
    this.editId.next(id);
  }
  getId(): BehaviorSubject<any> {
    return this.editId;
  }
  confirmPopup(ob = {
    confirmButtonText: 'Yes, delete it!',
    text: 'You won\'t be able to revert this!',
    title: 'Are you sure?'
  }): Promise<any> {
    const { confirmButtonText, text, title } = ob;
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText
    });
  }
}
