import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryAccountDetailsComponent } from './beneficiary-account-details.component';

describe('BeneficiaryAccountDetailsComponent', () => {
  let component: BeneficiaryAccountDetailsComponent;
  let fixture: ComponentFixture<BeneficiaryAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryAccountDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
