import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleEditPopupComponent } from './role-edit-popup.component';

describe('RoleEditPopupComponent', () => {
  let component: RoleEditPopupComponent;
  let fixture: ComponentFixture<RoleEditPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleEditPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleEditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
