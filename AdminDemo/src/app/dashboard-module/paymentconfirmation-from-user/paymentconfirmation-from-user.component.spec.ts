import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentconfirmationFromUserComponent } from './paymentconfirmation-from-user.component';

describe('PaymentconfirmationFromUserComponent', () => {
  let component: PaymentconfirmationFromUserComponent;
  let fixture: ComponentFixture<PaymentconfirmationFromUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentconfirmationFromUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentconfirmationFromUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
