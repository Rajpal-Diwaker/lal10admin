import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubadminComponent } from './create-subadmin.component';

describe('CreateSubadminComponent', () => {
  let component: CreateSubadminComponent;
  let fixture: ComponentFixture<CreateSubadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSubadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
