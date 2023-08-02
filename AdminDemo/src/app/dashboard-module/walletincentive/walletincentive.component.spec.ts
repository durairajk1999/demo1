import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletincentiveComponent } from './walletincentive.component';

describe('WalletincentiveComponent', () => {
  let component: WalletincentiveComponent;
  let fixture: ComponentFixture<WalletincentiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletincentiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletincentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
