import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementWalletBalanceComponent } from './statement-wallet-balance.component';

describe('StatementWalletBalanceComponent', () => {
  let component: StatementWalletBalanceComponent;
  let fixture: ComponentFixture<StatementWalletBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatementWalletBalanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatementWalletBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
