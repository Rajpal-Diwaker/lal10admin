import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAppOnboardingComponent } from './list-app-onboarding.component';

describe('ListAppOnboardingComponent', () => {
  let component: ListAppOnboardingComponent;
  let fixture: ComponentFixture<ListAppOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAppOnboardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAppOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
