import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountPopUpComponentComponent } from './add-account-pop-up-component.component';

describe('AddAccountPopUpComponentComponent', () => {
  let component: AddAccountPopUpComponentComponent;
  let fixture: ComponentFixture<AddAccountPopUpComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAccountPopUpComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAccountPopUpComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
