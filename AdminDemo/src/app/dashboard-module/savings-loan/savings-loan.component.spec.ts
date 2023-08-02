import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsLoanComponent } from './savings-loan.component';

describe('SavingsLoanComponent', () => {
  let component: SavingsLoanComponent;
  let fixture: ComponentFixture<SavingsLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavingsLoanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
