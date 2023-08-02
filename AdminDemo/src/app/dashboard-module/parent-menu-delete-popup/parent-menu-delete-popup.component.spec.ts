import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentMenuDeletePopupComponent } from './parent-menu-delete-popup.component';

describe('ParentMenuDeletePopupComponent', () => {
  let component: ParentMenuDeletePopupComponent;
  let fixture: ComponentFixture<ParentMenuDeletePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentMenuDeletePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentMenuDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
