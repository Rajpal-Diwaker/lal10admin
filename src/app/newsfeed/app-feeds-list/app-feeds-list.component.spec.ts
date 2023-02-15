import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFeedsListComponent } from './app-feeds-list.component';

describe('AppFeedsListComponent', () => {
  let component: AppFeedsListComponent;
  let fixture: ComponentFixture<AppFeedsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFeedsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFeedsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
