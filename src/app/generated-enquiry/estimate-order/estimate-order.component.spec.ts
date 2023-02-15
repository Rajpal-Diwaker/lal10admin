import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateOrderComponent } from './estimate-order.component';

describe('EstimateOrderComponent', () => {
  let component: EstimateOrderComponent;
  let fixture: ComponentFixture<EstimateOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstimateOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimateOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
