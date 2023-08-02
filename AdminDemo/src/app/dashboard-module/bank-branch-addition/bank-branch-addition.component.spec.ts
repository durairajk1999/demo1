import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankBranchAdditionComponent } from './bank-branch-addition.component';

describe('BankBranchAdditionComponent', () => {
  let component: BankBranchAdditionComponent;
  let fixture: ComponentFixture<BankBranchAdditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankBranchAdditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankBranchAdditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
