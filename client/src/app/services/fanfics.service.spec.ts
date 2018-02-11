import { TestBed, inject } from '@angular/core/testing';

import { FanficsService } from './fanfics.service';

describe('FanficsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FanficsService]
    });
  });

  it('should be created', inject([FanficsService], (service: FanficsService) => {
    expect(service).toBeTruthy();
  }));
});
