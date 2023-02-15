import { TestBed } from '@angular/core/testing';

import { IdealService } from './ideal.service';

describe('IdealService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IdealService = TestBed.get(IdealService);
    expect(service).toBeTruthy();
  });
});
