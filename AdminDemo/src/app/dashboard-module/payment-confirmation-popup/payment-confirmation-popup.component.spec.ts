import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentConfirmationPopupComponent } from './payment-confirmation-popup.component';

describe('PaymentConfirmationPopupComponent', () => {
  let component: PaymentConfirmationPopupComponent;
  let fixture: ComponentFixture<PaymentConfirmationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentConfirmationPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentConfirmationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
