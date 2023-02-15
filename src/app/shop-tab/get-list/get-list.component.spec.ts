import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetListComponent } from './get-list.component';

describe('GetListComponent', () => {
  let component: GetListComponent;
  let fixture: ComponentFixture<GetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
