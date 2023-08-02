import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantTopUpComponent } from './merchant-top-up.component';

describe('MerchantTopUpComponent', () => {
  let component: MerchantTopUpComponent;
  let fixture: ComponentFixture<MerchantTopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantTopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantTopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
