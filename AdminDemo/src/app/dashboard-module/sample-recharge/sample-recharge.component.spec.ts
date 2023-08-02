import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleRechargeComponent } from './sample-recharge.component';

describe('SampleRechargeComponent', () => {
  let component: SampleRechargeComponent;
  let fixture: ComponentFixture<SampleRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleRechargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
