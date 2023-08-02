import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShgAndPayoutComponent } from './shg-and-payout.component';

describe('ShgAndPayoutComponent', () => {
  let component: ShgAndPayoutComponent;
  let fixture: ComponentFixture<ShgAndPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShgAndPayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShgAndPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
