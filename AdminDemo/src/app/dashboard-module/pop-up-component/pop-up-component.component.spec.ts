import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpComponentComponent } from './pop-up-component.component';

describe('PopUpComponentComponent', () => {
  let component: PopUpComponentComponent;
  let fixture: ComponentFixture<PopUpComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
