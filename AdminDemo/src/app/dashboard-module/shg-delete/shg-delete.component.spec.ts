import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShgDeleteComponent } from './shg-delete.component';

describe('ShgDeleteComponent', () => {
  let component: ShgDeleteComponent;
  let fixture: ComponentFixture<ShgDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShgDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShgDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
