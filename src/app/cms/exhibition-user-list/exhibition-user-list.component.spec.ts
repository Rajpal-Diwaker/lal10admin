import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitionUserListComponent } from './exhibition-user-list.component';

describe('ExhibitionUserListComponent', () => {
  let component: ExhibitionUserListComponent;
  let fixture: ComponentFixture<ExhibitionUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExhibitionUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExhibitionUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
