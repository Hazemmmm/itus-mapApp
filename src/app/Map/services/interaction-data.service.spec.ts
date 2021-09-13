import { TestBed } from '@angular/core/testing';

import { InteractionDataService } from './interaction-data.service';

describe('InteractionDataService', () => {
  let service: InteractionDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteractionDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
