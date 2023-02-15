import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateEnquiriesComponent } from './generate-enquiries.component';

describe('GenerateEnquiriesComponent', () => {
  let component: GenerateEnquiriesComponent;
  let fixture: ComponentFixture<GenerateEnquiriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateEnquiriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateEnquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
