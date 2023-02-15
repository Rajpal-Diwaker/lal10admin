import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LisitngComponent } from './lisitng.component';

describe('LisitngComponent', () => {
  let component: LisitngComponent;
  let fixture: ComponentFixture<LisitngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LisitngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LisitngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
