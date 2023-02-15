import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-kind-ofstore',
  templateUrl: './kind-ofstore.component.html',
  styleUrls: ['./kind-ofstore.component.css']
})
export class KindOfstoreComponent implements OnInit {
  myForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      items: this.formBuilder.array([])
    });
    for (let index = 0; index < 15; index++) {
      this.addItem({ name: 'static', id: index });
    }
    console.log(this.myForm.value);
  }
  get f() {
    return this.myForm.controls;
  }
  createItem(val): FormGroup {
    return this.formBuilder.group({
      name: val.name || '',
      id: val.id || ''
    });
  }
  addItem(val): void {
    if (this.myForm.get('name').invalid) { return; }
    const items = this.myForm.get('items') as FormArray;
    items.push(this.createItem(val));
    this.myForm.get('name').reset();
  }
  submit(val) {
    console.log(val);

  }

}
