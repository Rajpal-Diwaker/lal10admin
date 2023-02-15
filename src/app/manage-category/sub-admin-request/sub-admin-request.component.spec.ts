import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAdminRequestComponent } from './sub-admin-request.component';

describe('SubAdminRequestComponent', () => {
  let component: SubAdminRequestComponent;
  let fixture: ComponentFixture<SubAdminRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubAdminRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAdminRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
