import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import { SocketService } from 'src/app/_services/socket.service';
@Component({
  selector: 'app-gallery-detail',
  templateUrl: './gallery-detail.component.html',
  styleUrls: ['./gallery-detail.component.css']
})
export class GalleryDetailComponent implements OnInit {
  myForm: FormGroup;
  submitted = false;
  imagesObj: any = {};
  imageSrc: any = [];
  adminId = localStorage.getItem('x-id');
  details: Params;
  changeFlag = false;
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private _route: Router, private socket: SocketService,
    private route: ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        console.log('---------------------------------......', params);
        this.details = params;
      });
  }
  ngOnInit() {
    this.createForm();
  }
  get f() {
    return this.myForm.controls;
  }
  createForm() {
    this.myForm = this.fb.group({
      images: this.fb.array([]),
      EnqId: [''],
      update_status: ['1'],
      id: [''],
      price: [''],
      comments: ['', Validators.compose([Validators.required])]
    });
    this.myForm.patchValue(this.details);
    this.imageSrc.push(this.details.files);
    this.addMoreImages(this.details);
  }
  addMoreImages(ob) {
    console.log('ob', ob);
    const images = this.myForm.get('images') as FormArray;
    images.push(this.createItem(ob));
  }
  createItem(obj): FormGroup {
    console.log('obj', obj);
    return this.fb.group({
      image: obj.files,
      id: obj.id
    });
  }
  submit(ob) {
    if (this.myForm.invalid) {
      for (const key in this.f) {
        if (this.f.hasOwnProperty(key)) {
          const element = this.f[key];
          element.markAsTouched();
        }
      }
      return;
    }
    ob.ids = ob.id;
    const { EnqId, ids, comments, price } = ob;
    const request = {
      EnqId, ids, comments, price
    };

    this.userService
      .updateCommentPrice(request)
      .pipe(take(1))
      .subscribe(() => {

        if (this.changeFlag) {
          const temp = {
            EnqId: this.details.EnqId,    // enquiry id
            fromId: this.adminId,
            toId: this.details.userId, /* (reciever_id) */
            msg: '',
            files: '',
            type: 'comment' /* (sample text,image,logistic,invoice,tracker) (optional parameters) */
          };
          console.log('socket request', temp);
          this.socket.sendMessage(temp);
        }
        this._route.navigate(['/generated-enquiry/gallery'], { queryParams: this.details });
      });
  }
}
