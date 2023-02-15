import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfStoreComponent } from './type-of-store.component';

describe('TypeOfStoreComponent', () => {
  let component: TypeOfStoreComponent;
  let fixture: ComponentFixture<TypeOfStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeOfStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeOfStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
