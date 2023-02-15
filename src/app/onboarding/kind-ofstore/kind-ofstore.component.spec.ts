import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KindOfstoreComponent } from './kind-ofstore.component';

describe('KindOfstoreComponent', () => {
  let component: KindOfstoreComponent;
  let fixture: ComponentFixture<KindOfstoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KindOfstoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KindOfstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
