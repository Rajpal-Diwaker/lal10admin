import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIndustriesComponent } from './manage-industries.component';

describe('ManageIndustriesComponent', () => {
  let component: ManageIndustriesComponent;
  let fixture: ComponentFixture<ManageIndustriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageIndustriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageIndustriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
