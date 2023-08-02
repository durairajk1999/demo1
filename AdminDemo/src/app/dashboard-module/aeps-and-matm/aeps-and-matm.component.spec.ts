import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AepsAndMATMComponent } from './aeps-and-matm.component';

describe('AepsAndMATMComponent', () => {
  let component: AepsAndMATMComponent;
  let fixture: ComponentFixture<AepsAndMATMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AepsAndMATMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AepsAndMATMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
