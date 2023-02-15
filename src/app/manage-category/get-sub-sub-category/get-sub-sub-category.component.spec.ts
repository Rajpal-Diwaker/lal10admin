import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSubSubCategoryComponent } from './get-sub-sub-category.component';

describe('GetSubSubCategoryComponent', () => {
  let component: GetSubSubCategoryComponent;
  let fixture: ComponentFixture<GetSubSubCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetSubSubCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetSubSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
