import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIaComponent } from './view-ia.component';

describe('ViewIaComponent', () => {
  let component: ViewIaComponent;
  let fixture: ComponentFixture<ViewIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewIaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
