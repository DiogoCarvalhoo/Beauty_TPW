import { TestBed } from '@angular/core/testing';

import { ServicoslistService } from './servicoslist.service';

describe('ServicoslistService', () => {
  let service: ServicoslistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicoslistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
