import { TestBed } from '@angular/core/testing';

import { StafflistService } from './stafflist.service';

describe('StafflistService', () => {
  let service: StafflistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StafflistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
