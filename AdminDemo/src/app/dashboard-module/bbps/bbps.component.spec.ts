import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BBPSComponent } from './bbps.component';

describe('BBPSComponent', () => {
  let component: BBPSComponent;
  let fixture: ComponentFixture<BBPSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BBPSComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BBPSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
