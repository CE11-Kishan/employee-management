import { TestBed } from '@angular/core/testing';

import { IndexdbserviceService } from './indexdbservice.service';

describe('IndexdbserviceService', () => {
  let service: IndexdbserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexdbserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
