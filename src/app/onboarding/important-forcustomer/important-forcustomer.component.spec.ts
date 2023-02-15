import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantForcustomerComponent } from './important-forcustomer.component';

describe('ImportantForcustomerComponent', () => {
  let component: ImportantForcustomerComponent;
  let fixture: ComponentFixture<ImportantForcustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportantForcustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportantForcustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
