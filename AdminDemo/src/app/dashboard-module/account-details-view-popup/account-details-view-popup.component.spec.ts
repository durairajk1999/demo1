import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDetailsViewPopupComponent } from './account-details-view-popup.component';

describe('AccountDetailsViewPopupComponent', () => {
  let component: AccountDetailsViewPopupComponent;
  let fixture: ComponentFixture<AccountDetailsViewPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountDetailsViewPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountDetailsViewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
