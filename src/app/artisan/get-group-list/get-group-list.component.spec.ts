import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetGroupListComponent } from './get-group-list.component';

describe('GetGroupListComponent', () => {
  let component: GetGroupListComponent;
  let fixture: ComponentFixture<GetGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
