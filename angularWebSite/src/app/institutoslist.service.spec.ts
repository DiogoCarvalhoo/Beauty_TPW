import { TestBed } from '@angular/core/testing';

import { InstitutoslistService } from './institutoslist.service';

describe('InstitutoslistService', () => {
  let service: InstitutoslistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstitutoslistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
