import { TestBed } from '@angular/core/testing';

import { statesService } from './states.service';

describe('statesService', () => {
  let service: statesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(statesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
