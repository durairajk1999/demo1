import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanchayatAdditionComponent } from './panchayat-addition.component';

describe('PanchayatAdditionComponent', () => {
  let component: PanchayatAdditionComponent;
  let fixture: ComponentFixture<PanchayatAdditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanchayatAdditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanchayatAdditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
