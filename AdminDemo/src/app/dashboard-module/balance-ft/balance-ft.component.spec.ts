import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceFtComponent } from './balance-ft.component';

describe('BalanceFtComponent', () => {
  let component: BalanceFtComponent;
  let fixture: ComponentFixture<BalanceFtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceFtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceFtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
