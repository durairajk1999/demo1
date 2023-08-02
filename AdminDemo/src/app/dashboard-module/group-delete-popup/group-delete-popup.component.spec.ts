import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDeletePopupComponent } from './group-delete-popup.component';

describe('GroupDeletePopupComponent', () => {
  let component: GroupDeletePopupComponent;
  let fixture: ComponentFixture<GroupDeletePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupDeletePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
