import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterMenuEditPopupComponent } from './master-menu-edit-popup.component';

describe('MasterMenuEditPopupComponent', () => {
  let component: MasterMenuEditPopupComponent;
  let fixture: ComponentFixture<MasterMenuEditPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterMenuEditPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterMenuEditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
