import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppOnboardingComponent } from './add-app-onboarding.component';

describe('AddAppOnboardingComponent', () => {
  let component: AddAppOnboardingComponent;
  let fixture: ComponentFixture<AddAppOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAppOnboardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAppOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
