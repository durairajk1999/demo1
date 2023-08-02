import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShgsCountComponent } from './shgs-count.component';

describe('ShgsCountComponent', () => {
  let component: ShgsCountComponent;
  let fixture: ComponentFixture<ShgsCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShgsCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShgsCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
