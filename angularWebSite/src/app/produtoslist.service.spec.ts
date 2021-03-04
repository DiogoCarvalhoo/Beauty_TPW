import { TestBed } from '@angular/core/testing';

import { ProdutoslistService } from './produtoslist.service';

describe('ProdutoslistService', () => {
  let service: ProdutoslistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdutoslistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
