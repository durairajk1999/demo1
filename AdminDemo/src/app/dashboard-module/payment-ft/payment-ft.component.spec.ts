import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFTComponent } from './payment-ft.component';

describe('PaymentFTComponent', () => {
  let component: PaymentFTComponent;
  let fixture: ComponentFixture<PaymentFTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentFTComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentFTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
