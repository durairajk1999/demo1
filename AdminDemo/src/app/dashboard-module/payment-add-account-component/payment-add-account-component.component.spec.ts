import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAddAccountComponentComponent } from './payment-add-account-component.component';

describe('PaymentAddAccountComponentComponent', () => {
  let component: PaymentAddAccountComponentComponent;
  let fixture: ComponentFixture<PaymentAddAccountComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentAddAccountComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentAddAccountComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
