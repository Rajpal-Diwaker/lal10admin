import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubSubCategoryComponent } from './create-sub-sub-category.component';

describe('CreateSubSubCategoryComponent', () => {
  let component: CreateSubSubCategoryComponent;
  let fixture: ComponentFixture<CreateSubSubCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSubSubCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
