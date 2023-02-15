import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateLeadEnquiriesComponent } from './generate-lead-enquiries.component';

describe('GenerateLeadEnquiriesComponent', () => {
  let component: GenerateLeadEnquiriesComponent;
  let fixture: ComponentFixture<GenerateLeadEnquiriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateLeadEnquiriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateLeadEnquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
