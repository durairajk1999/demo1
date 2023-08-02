import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupEditPopupComponent } from './group-edit-popup.component';

describe('GroupEditPopupComponent', () => {
  let component: GroupEditPopupComponent;
  let fixture: ComponentFixture<GroupEditPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupEditPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupEditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
