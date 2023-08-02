import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnniyamUserInterfaceComponent } from './anniyam-user-interface.component';

describe('AnniyamUserInterfaceComponent', () => {
  let component: AnniyamUserInterfaceComponent;
  let fixture: ComponentFixture<AnniyamUserInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnniyamUserInterfaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnniyamUserInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
