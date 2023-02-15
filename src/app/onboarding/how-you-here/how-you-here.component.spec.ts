import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowYouHereComponent } from './how-you-here.component';

describe('HowYouHereComponent', () => {
  let component: HowYouHereComponent;
  let fixture: ComponentFixture<HowYouHereComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowYouHereComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowYouHereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
