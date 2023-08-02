import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantTopUpConfirmationComponent } from './merchant-top-up-confirmation.component';

describe('MerchantTopUpConfirmationComponent', () => {
  let component: MerchantTopUpConfirmationComponent;
  let fixture: ComponentFixture<MerchantTopUpConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantTopUpConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantTopUpConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
