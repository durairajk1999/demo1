import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelChangeConfirmationPopupComponent } from './model-change-confirmation-popup.component';

describe('ModelChangeConfirmationPopupComponent', () => {
  let component: ModelChangeConfirmationPopupComponent;
  let fixture: ComponentFixture<ModelChangeConfirmationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelChangeConfirmationPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelChangeConfirmationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
