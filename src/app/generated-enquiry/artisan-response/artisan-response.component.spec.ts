import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtisanResponseComponent } from './artisan-response.component';

describe('ArtisanResponseComponent', () => {
  let component: ArtisanResponseComponent;
  let fixture: ComponentFixture<ArtisanResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtisanResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtisanResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
