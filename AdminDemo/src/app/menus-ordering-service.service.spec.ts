import { TestBed } from '@angular/core/testing';

import { MenusOrderingServiceService } from './menus-ordering-service.service';

describe('MenusOrderingServiceService', () => {
  let service: MenusOrderingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenusOrderingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
