import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatchMesssageComponent } from './patch-messsage.component';

describe('PatchMesssageComponent', () => {
  let component: PatchMesssageComponent;
  let fixture: ComponentFixture<PatchMesssageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatchMesssageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatchMesssageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
