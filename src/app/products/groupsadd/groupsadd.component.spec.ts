import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsaddComponent } from './groupsadd.component';

describe('GroupsaddComponent', () => {
  let component: GroupsaddComponent;
  let fixture: ComponentFixture<GroupsaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
