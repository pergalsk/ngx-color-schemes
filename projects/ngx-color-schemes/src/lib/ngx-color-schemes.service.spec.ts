import { TestBed } from '@angular/core/testing';

import { NgxColorSchemesService } from './ngx-color-schemes.service';

describe('NgxColorSchemesService', () => {
  let service: NgxColorSchemesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxColorSchemesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
