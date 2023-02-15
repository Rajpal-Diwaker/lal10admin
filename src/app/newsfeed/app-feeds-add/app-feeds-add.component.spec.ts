import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFeedsAddComponent } from './app-feeds-add.component';

describe('AppFeedsAddComponent', () => {
  let component: AppFeedsAddComponent;
  let fixture: ComponentFixture<AppFeedsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFeedsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFeedsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
