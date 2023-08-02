import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentMenuPopupComponent } from './parent-menu-popup.component';

describe('ParentMenuPopupComponent', () => {
  let component: ParentMenuPopupComponent;
  let fixture: ComponentFixture<ParentMenuPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentMenuPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentMenuPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
