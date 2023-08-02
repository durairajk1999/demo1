import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankBranchDetailComponent } from './bank-branch-detail.component';

describe('BankBranchDetailComponent', () => {
  let component: BankBranchDetailComponent;
  let fixture: ComponentFixture<BankBranchDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankBranchDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankBranchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
