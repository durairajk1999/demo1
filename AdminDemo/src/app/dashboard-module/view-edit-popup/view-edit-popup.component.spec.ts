import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditPopupComponent } from './view-edit-popup.component';

describe('ViewEditPopupComponent', () => {
  let component: ViewEditPopupComponent;
  let fixture: ComponentFixture<ViewEditPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEditPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
