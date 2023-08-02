import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MastermenuDeletePopupComponent } from './mastermenu-delete-popup.component';

describe('MastermenuDeletePopupComponent', () => {
  let component: MastermenuDeletePopupComponent;
  let fixture: ComponentFixture<MastermenuDeletePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MastermenuDeletePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MastermenuDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
