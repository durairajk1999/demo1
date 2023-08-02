import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDeletePopupComponent } from './role-delete-popup.component';

describe('RoleDeletePopupComponent', () => {
  let component: RoleDeletePopupComponent;
  let fixture: ComponentFixture<RoleDeletePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleDeletePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
