import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticDetailComponent } from './logistic-detail.component';

describe('LogisticDetailComponent', () => {
  let component: LogisticDetailComponent;
  let fixture: ComponentFixture<LogisticDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogisticDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogisticDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
