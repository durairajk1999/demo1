import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryInfoPopupComponent } from './beneficiary-info-popup.component';

describe('BeneficiaryInfoPopupComponent', () => {
  let component: BeneficiaryInfoPopupComponent;
  let fixture: ComponentFixture<BeneficiaryInfoPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryInfoPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
