import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionTrackerComponent } from './production-tracker.component';

describe('ProductionTrackerComponent', () => {
  let component: ProductionTrackerComponent;
  let fixture: ComponentFixture<ProductionTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
