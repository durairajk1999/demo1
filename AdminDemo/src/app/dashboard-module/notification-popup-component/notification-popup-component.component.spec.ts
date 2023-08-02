import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationPopupComponentComponent } from './notification-popup-component.component';

describe('NotificationPopupComponentComponent', () => {
  let component: NotificationPopupComponentComponent;
  let fixture: ComponentFixture<NotificationPopupComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationPopupComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationPopupComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
