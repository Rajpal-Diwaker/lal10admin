import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CrudService } from 'src/app/_services/crud.service';
import { take } from 'rxjs/operators';
import { UserService } from 'src/app/_services/user.service';
import { OnboardingService } from 'src/app/onboarding/onboarding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/_services/socket.service';
@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css']
})
export class GalleryListComponent implements OnInit {
  imagesObj: any;
  details: any;
  response: any;
  adminId = localStorage.getItem('x-id');
  constructor(private formBuilder: FormBuilder,
              private crudService: CrudService,
              private socket: SocketService,
              private userService: UserService,
              private route: ActivatedRoute,
              private onboarding: OnboardingService,
              private router: Router) { }
  get f() {
    return this.myForm.controls;
  }
  myForm: FormGroup;
  flickerArr: any = {};
  ngOnInit() {
    this.createForm();
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // {order: "popular"}
        this.details = params;
      });
    this.getGallery();
  }
  getGallery() {
    const request = {
      userId: this.details.userId,
      EnqId: this.details.EnqId
    };
    this.userService.getGallery(request).subscribe(res => {
      console.log(res);
      this.response = res.result;
      res.result.forEach((element: any) => {
        this.addItem(element);
      });
    });
  }
  getList(ob: any) {
    this.onboarding.listingLoginOnboarding(ob).subscribe(res => {
      res.result.forEach((element: any) => {
        this.addItem(element);
      });
    });
  }
  createForm() {
    this.myForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      items: this.formBuilder.array([])
    });
  }
  createItem(val: { comments: any; id: any; files: any; price: any; fromId: any; }): FormGroup {
    return this.formBuilder.group({
      name: val.comments || '',
      id: val.id || '',
      icon: val.files,
      price: val.price || '',
      fromId: val.fromId
    });
  }
  addItem(val: any): void {
    // if (this.myForm.get('name').invalid) { return; }
    const items = this.myForm.get('items') as FormArray;
    items.push(this.createItem(val));
    this.myForm.get('name').reset();
  }
  def(e: { target: { src: string; }; }, id: string | number) {
    this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    const img = 'assets/images/def.png';
    if (!e && this.flickerArr[id] > 1) { return; }
    e.target.src = img;
  }
  delete(id: any) {
    this.crudService.confirmPopup().then((suc) => {
      // tslint:disable-next-line: triple-equals
      if (suc && (suc.dismiss == 'backdrop' || suc.dismiss == 'cancel')) {
      } else {
        this.userService
          .deleteGalleryImage({ id } = id)
          .pipe(take(1))
          .subscribe(() => {
            this.ngOnInit();
            const temp = {
              EnqId: this.details.EnqId,    // enquiry id
              fromId: this.adminId,
              toId: this.details.userId, /* (reciever_id) */
              msg: '',
              files: '',
              type: 'delete' /* (sample text,image,logistic,invoice,tracker) (optional parameters) */
            };
            this.socket.sendMessage(temp);
            console.log('socket request', temp);
          });
      }
    });
  }
  goToChat() {
    this.router.navigate(['/generated-enquiry/chat'], { queryParams: this.details });
  }
}
