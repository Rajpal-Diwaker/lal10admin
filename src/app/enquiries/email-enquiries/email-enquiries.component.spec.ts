import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailEnquiriesComponent } from './email-enquiries.component';

describe('EmailEnquiriesComponent', () => {
  let component: EmailEnquiriesComponent;
  let fixture: ComponentFixture<EmailEnquiriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailEnquiriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailEnquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
